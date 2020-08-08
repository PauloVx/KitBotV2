import { Client, Message } from "discord.js";
import Command, { CommandType } from "./Command";

import AppError from "../errors/AppError";

import Ping from "./PingCommand";
import PlayCommand from "./Music/PlayCommand";

export class CommandFactory {
  public constructor(private client: Client, private prefix: string) {}

  public createCommand(message: Message): Command<CommandType> | null {
    const [keyword, args] = this.parseCommand(message.content);

    switch (keyword) {
      case CommandType.PING:
        return new Ping(this.client, message);

      case CommandType.SAY:
        throw new AppError(
          message,
          "Command not yet implemented!"
        ).logOnChannel();

      case CommandType.PLAY:
        return new PlayCommand(this.client, message);

      case CommandType.PAUSE:
        throw new AppError(
          message,
          "Command not yet implemented!"
        ).logOnChannel();

      case CommandType.STOP:
        throw new AppError(
          message,
          "Command not yet implemented!"
        ).logOnChannel();

      default:
        throw new AppError(
          message,
          "Unknown Command ",
          `${__filename} at line 43`
        ).logOnChannel();
    }
  }

  private parseCommand(messageContent: string): [CommandType, string[]] {
    const args = messageContent.slice(this.prefix.length).trim().split(/ +/g);
    const keyword = args.shift()?.toUpperCase() ?? "";
    const commandType =
      CommandType[keyword as keyof typeof CommandType] ?? null;

    return [commandType, args];
  }
}
