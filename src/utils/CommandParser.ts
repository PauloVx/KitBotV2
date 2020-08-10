import { CommandType } from "../commands/Command";
import { PREFIX } from "../config";

export default class CommandParser {
  public static parseCommand(messageContent: string): [CommandType, string[]] {
    const args = messageContent.slice(PREFIX.length).trim().split(/ +/g);
    const keyword = args.shift()?.toUpperCase() ?? "";
    const commandType =
      CommandType[keyword as keyof typeof CommandType] ?? null;

    return [commandType, args];
  }
}
