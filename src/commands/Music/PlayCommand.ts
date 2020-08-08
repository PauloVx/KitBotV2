import Command, { CommandType } from "../Command";
import { Client, Message, VoiceChannel } from "discord.js";
import AppError from "../../errors/AppError";
import PermissionError from "../../errors/PermissionError";

export default class PlayCommand extends Command<CommandType.PLAY> {
  private voiceChannel = this.message.member.voice.channel;

  public constructor(private client: Client, private message: Message) {
    super();
  }

  public async execute(): Promise<void> {
    if (!this.hasPermissionToExecute() || !this.userIsInVoiceChannel()) return;

    this.joinVoiceChannel();

    //Execute here
  }

  public hasPermissionToExecute(): boolean {
    if (!this.message.member.hasPermission("CONNECT"))
      throw new PermissionError(this.message).logOnChannel();

    return true;
  }

  private userIsInVoiceChannel(): boolean {
    if (!this.voiceChannel) {
      throw new AppError(
        this.message,
        "You need to join a voice channel!",
        `${__filename}`
      ).logOnConsoleAndReplyToUser();
    }
    return true;
  }

  private async joinVoiceChannel(): Promise<void> {
    try {
      await this.voiceChannel.join();
    } catch (error) {
      throw new AppError(this.message, error, __filename).logOnConsole();
    }
  }
}
