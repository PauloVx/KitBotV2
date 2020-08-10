import Command, { CommandType } from "../Command";
import { Client, Message, Guild } from "discord.js";
import AppError from "../../errors/AppError";
import PermissionError from "../../errors/PermissionError";

import VoiceChannel from "../../utils/VoiceChannel";
import YouTubeVideo from "../../services/YouTubeVideo";
import SongQueue from "./SongQueue";
import CommandParser from "../../utils/CommandParser";
import ytdl from "ytdl-core";

export default class PlayCommand extends Command<CommandType.PLAY> {
  private queue: SongQueue = new SongQueue();

  public constructor(private client: Client, private message: Message) {
    super();
  }

  public async execute(): Promise<void> {
    if (
      !this.hasPermissionToExecute() ||
      !VoiceChannel.userIsInVoiceChannel(this.message)
    )
      return;

    const [, args] = CommandParser.parseCommand(this.message.content);
    const videoUrl = args[0];
    if (!videoUrl)
      throw new AppError(
        this.message,
        "You need to tell me what to play!",
        __filename
      ).logOnConsoleAndReplyToUser();

    const video = new YouTubeVideo();
    await video.setVideoInfo(videoUrl);
    this.message.channel.send(`**${video.toString()}**`);
    this.queue.getQueue().set(video.getTitle(), video.getUrl());

    console.log(this.queue.getQueue());

    this.play(video);
  }

  public hasPermissionToExecute(): boolean {
    if (
      !this.message.member.hasPermission("CONNECT") ||
      !this.message.member.hasPermission("SPEAK")
    )
      throw new PermissionError(this.message).logOnChannel();

    return true;
  }

  private async play(video: YouTubeVideo): Promise<void> {
    const connection = await VoiceChannel.join(this.message);

    const stream = ytdl(video.getUrl(), {
      filter: "audioonly",
    });

    const dispatcher = connection.play(stream);

    dispatcher.on("finish", () => VoiceChannel.leave(this.message));
  }
}
