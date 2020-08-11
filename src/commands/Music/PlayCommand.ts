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

    const [, args] = CommandParser.parseCommand(this.message.content);

    const finalSearchWords = this.separateSearchArgs(args);

    const video = await YouTubeAPI.search(this.message, finalSearchWords);
    this.queue.get().push(video);

    this.message.channel.send(`**${video.toString()}**`);

    console.log(this.queue.get());

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
      console.log(`\nA song started playing!`);
      console.log(video.getTitle());
      this.message.channel.send(`**Now Playing: ${video.getTitle()}**`);

      console.log(`\nQueue: `);
      console.log(this.queue.get());
    });

    this.dispatcher.on("finish", (reason: string) => {
      console.warn(`\nFinished playing ${title}, reason: ${reason}.`);
      this.queue.get().shift();
      this.play(this.queue.get()[0]);
      if (!this.queue.get()[0]) {
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
