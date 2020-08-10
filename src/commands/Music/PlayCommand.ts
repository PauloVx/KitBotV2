import Command, { CommandType } from "../Command";
import { Client, Message, StreamDispatcher } from "discord.js";
import AppError from "../../errors/AppError";
import PermissionError from "../../errors/PermissionError";

import VoiceChannel from "../../utils/VoiceChannel";
import YouTubeVideo from "../../services/YouTube/YouTubeVideo";
import SongQueue from "./SongQueue";
import CommandParser from "../../utils/CommandParser";
import ytdl from "ytdl-core";
import YouTubeAPI from "../../services/YouTube/YouTubeAPI";

export default class PlayCommand extends Command<CommandType.PLAY> {
  private dispatcher: StreamDispatcher;
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

    const finalSearchWords = this.separateSearchArgs(args);

    const video = await YouTubeAPI.search(this.message, finalSearchWords);
    this.queue.getQueue().push(video);

    this.message.channel.send(`__**${video.toString()}**__`);

    console.log(this.queue.getQueue());

    this.play(this.queue.getQueue()[0]);
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
    if (!this.queue.getQueue()[0]) return;
    const connection = await VoiceChannel.join(this.message);

    const url = video.getUrl();
    const title = video.getTitle();

    const stream = ytdl(url, {
      filter: "audioandvideo",
      highWaterMark: 1 << 25,
    });

    this.dispatcher = connection.play(stream);

    this.dispatcher.on("start", () => {
      console.log(`\nA song started playing!`);
      console.log(video.getTitle());
      this.message.channel.send(`Now Playing: **${video.getTitle()} **`);

      console.log(`\nQueue: `);
      console.log(this.queue.getQueue());
    });

    this.dispatcher.on("finish", (reason: string) => {
      console.warn(`\nFinished playing ${title}, reason: ${reason}.`);
      this.queue.getQueue().shift();
      this.play(this.queue.getQueue()[0]);
      if (!this.queue.getQueue()[0]) {
        VoiceChannel.leave(this.message);
      }
    });
  }

  private separateSearchArgs(args: Array<string>): string {
    if (!args[0])
      throw new AppError(
        this.message,
        "You need to tell me what to play!",
        __filename
      ).logOnConsoleAndReplyToUser();

    let finalSearchArgs: string = "";
    args.forEach((arg) => {
      finalSearchArgs += " " + arg;
    });

    return finalSearchArgs;
  }
}
