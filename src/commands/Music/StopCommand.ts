import Command, { CommandType } from "../Command";
import { Client, Message } from "discord.js";
import PermissionError from "../../errors/PermissionError";

export default class StopCommand extends Command<CommandType.STOP> {
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
