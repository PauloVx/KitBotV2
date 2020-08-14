import { Message } from "discord.js";
import { CommandType } from "../commands/Command";
import { PREFIX } from "../config";
import AppError from "../errors/AppError";

export default class CommandParser {
  public static parseCommand(messageContent: string): [CommandType, string[]] {
    const args = messageContent.slice(PREFIX.length).trim().split(/ +/g);
    const keyword = args.shift()?.toUpperCase() ?? "";
    const commandType =
      CommandType[keyword as keyof typeof CommandType] ?? null;

    return [commandType, args];
  }

  public static separateSearchArgs(
    message: Message,
    args: Array<string>
  ): string {
    if (!args[0])
      throw new AppError(
        message,
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
