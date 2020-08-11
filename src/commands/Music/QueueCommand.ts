import Command, { CommandType } from "../Command";
import { Client, Message } from "discord.js";
import PermissionError from "../../errors/PermissionError";
import SongQueue from "./SongQueue";
import AppError from "../../errors/AppError";

export default class QueueCommand extends Command<CommandType.QUEUE> {
  public constructor(private client: Client, private message: Message) {
    super();
  }

  public async execute(): Promise<void> {
    const songQueue = SongQueue.getInstance().get();
    let position: number = 0;
    let formattedTitles: string = "";

    if (!songQueue[0])
      throw new AppError(
        this.message,
        "The queue is empty! 😴",
        __filename
      ).logOnChannelAndConsole();

    songQueue.forEach((video) => {
      position++;
      formattedTitles += `${position} - ${video.getTitle() + "\n"}`;
    });

    this.message.channel.send(`**Queue:\n ${formattedTitles}**`);
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
