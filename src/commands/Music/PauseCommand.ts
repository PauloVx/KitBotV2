import Command, { CommandType } from "../Command";
import PermissionError from "../../errors/PermissionError";
import { Client, Message } from "discord.js";

export default class PauseCommand extends Command<CommandType.PAUSE> {
  public constructor(private client: Client, private message: Message) {
    super();
  }

  execute(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public hasPermissionToExecute(): boolean {
    if (!this.message.member.hasPermission("CONNECT")) {
      throw new PermissionError(this.message).logOnChannel();
    }
    return true;
  }
}
