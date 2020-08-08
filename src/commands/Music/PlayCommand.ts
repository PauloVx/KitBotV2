import Command, { CommandType } from "../Command";
import { Client, Message } from "discord.js";
import AppError from "../../errors/AppError";
import PermissionError from "../../errors/PermissionError";

import VoiceChannel from "../../utils/VoiceChannel";

export default class PlayCommand extends Command<CommandType.PLAY> {
  public constructor(private client: Client, private message: Message) {
    super();
  }

  public async execute(): Promise<void> {
    if (
      !this.hasPermissionToExecute() ||
      !VoiceChannel.userIsInVoiceChannel(this.message)
    )
      return;

    VoiceChannel.join(this.message);

    //Execute here
  }

  public hasPermissionToExecute(): boolean {
    if (!this.message.member.hasPermission("CONNECT"))
      throw new PermissionError(this.message).logOnChannel();

    return true;
  }
}
