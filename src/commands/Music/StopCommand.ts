import { Client, Message } from "discord.js";

import Command, { CommandType } from "../Command";
import SongQueue from "./SongQueue";

import AppError from "../../errors/AppError";
import PermissionError from "../../errors/PermissionError";

import VoiceChannel from "../../utils/VoiceChannel";

export default class StopCommand extends Command<CommandType.STOP> {
  public constructor(private client: Client, private message: Message) {
    super();
  }

  public async execute(): Promise<void> {
    if (!VoiceChannel.userIsInVoiceChannel(this.message)) {
      throw new AppError(
        this.message,
        "You need to join a voice channel!",
        `${__filename}`
      ).replyErrorToUser();
    }

    if (!SongQueue.getInstance().get()[0]) {
      this.message.reply("There's nothing playing! 😅");
      return;
    }

    SongQueue.getInstance().destroy();
    await VoiceChannel.leave(this.message);
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
