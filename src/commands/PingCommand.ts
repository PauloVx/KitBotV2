import { Client, Message } from "discord.js";
import Command, { CommandType } from "./Command";
import AppError from "../errors/AppError";

export default class PingCommand extends Command<CommandType.PING> {
  public constructor(private client: Client, private message: Message) {
    super();
  }

  public async execute(): Promise<void> {
    if (this.canExecute()) {
      try {
        await this.message.channel.send(
          `My latency is ${this.client.ws.ping}ms`
        );
      } catch (err) {
        throw new AppError(
          this.message,
          `Could not execute ${CommandType.PING}. Error: ${err.message}`,
          `${__filename} at line 20`
        ).logOnChannel();
      }
    }
  }

  //Everyone has permission to execute.
  public canExecute(): boolean {
    return true;
  }
}
