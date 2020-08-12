import { Client, Message, StreamDispatcher } from "discord.js";
import ytdl from "ytdl-core";

import AppError from "../../errors/AppError";
import PermissionError from "../../errors/PermissionError";
import YouTubeVideo from "../../services/YouTube/YouTubeVideo";
import YouTubeAPI from "../../services/YouTube/YouTubeAPI";
import CommandParser from "../../utils/CommandParser";
import VoiceChannel from "../../utils/VoiceChannel";
import SongQueue from "./SongQueue";
import Command, { CommandType } from "../Command";
import Logger from "../../utils/Logger";

export default class PlayCommand extends Command<CommandType.PLAY> {
  private dispatcher: StreamDispatcher;
  private queue: SongQueue = SongQueue.getInstance();

  public constructor(private client: Client, private message: Message) {
    super();
  }

  public async execute(): Promise<void> {
    if (!this.hasPermissionToExecute())
      throw new PermissionError(this.message).replyErrorToUser();

    if (!VoiceChannel.userIsInVoiceChannel(this.message)) {
      throw new AppError(
        this.message,
        "You need to join a voice channel!",
        `${__filename}`
      ).logOnConsoleAndReplyToUser();
    }

    //If a song is being played, user should use add command.
    if (this.queue.get()[0]) {
      this.message.reply("Use add command to add songs to the queue!");
      return;
    }

    const [, args] = CommandParser.parseCommand(this.message.content);

    const finalSearchWords = CommandParser.separateSearchArgs(
      this.message,
      args
    );

    const video = await YouTubeAPI.search(this.message, finalSearchWords);
    this.queue.get().push(video);

    this.message.channel.send(`**${video.toString()}**`);

    Logger.info(this.queue.get().toString());

    this.play(this.queue.get()[0]);
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
    if (!this.queue.get()[0]) return;
    const connection = await VoiceChannel.join(this.message);

    const url = video.getUrl();
    const title = video.getTitle();

    const stream = ytdl(url, {
      filter: "audioandvideo",
      highWaterMark: 1 << 25,
    });

    this.dispatcher = connection.play(stream);

    this.dispatcher.on("start", () => {
      Logger.info(`Started playing: ${video.getTitle()}`);
      this.message.channel.send(`**Now Playing: ${video.getTitle()}**`);

      Logger.log(`Queue: ` + this.queue.get().toString());
    });

    this.dispatcher.on("finish", (reason: string) => {
      Logger.warn(`Finished playing ${title}, reason: ${reason}.`);
      this.queue.get().shift();
      this.play(this.queue.get()[0]);
      if (!this.queue.get()[0]) {
        VoiceChannel.leave(this.message);
      }
    });
  }
}
