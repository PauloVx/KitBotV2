import Command, { CommandType } from "../Command";
import { Client, Message } from "discord.js";
import PermissionError from "../../errors/PermissionError";
import SongQueue from "./SongQueue";

export default class QueueCommand extends Command<CommandType.QUEUE> {
  public constructor(private client: Client, private message: Message) {
    super();
  }

  public async execute(): Promise<void> {
    const songQueue = SongQueue.getInstance().get();
    let titles: string = "";

    songQueue.forEach((video) => {
      titles += video.getTitle() + "\n";
    });

    this.message.channel.send(`**Queue: \n${titles}**`);
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
