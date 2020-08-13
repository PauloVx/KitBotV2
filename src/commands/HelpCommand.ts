import Command, { CommandType } from "./Command";
import { Message, Client } from "discord.js";
import { PREFIX } from "../config";

export default class HelpCommand extends Command<CommandType.HELP> {
  public constructor(private client: Client, private message: Message) {
    super();
  }
  public async execute(): Promise<void> {
    if (!this.hasPermissionToExecute) return;

    this.message.channel.send(
      `**${PREFIX}play (Song name) - To play music.\n${PREFIX}add (Song name) - To add song to the queue.\n${PREFIX}queue - To see the song queue.\n${PREFIX}skip - To skip the current song.\n${PREFIX}stop - To stop the current song.\n${PREFIX}ping - To see the bot's ping.**`
    );
  }

  public hasPermissionToExecute(): boolean {
    return true;
  }
}
