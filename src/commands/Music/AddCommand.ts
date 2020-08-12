import Command, { CommandType } from "../Command";
import { Client, Message } from "discord.js";
import PermissionError from "../../errors/PermissionError";
import SongQueue from "./SongQueue";
import YouTubeAPI from "../../services/YouTube/YouTubeAPI";
import CommandParser from "../../utils/CommandParser";
import Logger from "../../utils/Logger";
import AppError from "../../errors/AppError";
import VoiceChannel from "../../utils/VoiceChannel";

export default class AddCommand extends Command<CommandType.ADD> {
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

    const finalSearchWords = CommandParser.separateSearchArgs(
      this.message,
      args
    );

    const video = await YouTubeAPI.search(this.message, finalSearchWords);
    SongQueue.getInstance().get().push(video);
    this.message.channel.send(`**Added ${video.getTitle()} to the queue! **`);
    Logger.info("Added: " + video.getTitle() + " to the queue.");
    Logger.log("Queue:\n" + SongQueue.getInstance().get());
  }

  public hasPermissionToExecute(): boolean {
    if (
      !this.message.member.hasPermission("CONNECT") ||
      !this.message.member.hasPermission("SPEAK")
    )
      throw new PermissionError(this.message).logOnChannel();

    return true;
  }
}
