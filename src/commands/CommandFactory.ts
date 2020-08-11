import { Client, Message } from "discord.js";
import Command, { CommandType } from "./Command";
import CommandParser from "../utils/CommandParser";

import AppError from "../errors/AppError";

import Ping from "./PingCommand";
import PlayCommand from "./Music/PlayCommand";
import StopCommand from "./Music/StopCommand";
import QueueCommand from "./Music/QueueCommand";

export class CommandFactory {
  public constructor(private client: Client, private prefix: string) {}

  public createCommand(message: Message): Command<CommandType> | null {
    const [keyword, args] = CommandParser.parseCommand(message.content);

    switch (keyword) {
      case CommandType.PING:
        return new Ping(this.client, message);

      case CommandType.PLAY:
        return new PlayCommand(this.client, message);

      case CommandType.STOP:
        return new StopCommand(this.client, message);

      case CommandType.ADD:
        throw new AppError(
          message,
          "Command not yet implemented!"
        ).logOnChannel();

      case CommandType.QUEUE:
        return new QueueCommand(this.client, message);

      default:
        throw new AppError(
          message,
          "Unknown Command 🤔",
          `${__filename} at line 43`
        ).logOnChannel();
    }
  }
}
