import { Message } from "discord.js";
import AppError from "../errors/AppError";

export default class VoiceChannel {
  public static async join(message: Message): Promise<void> {
    const voiceChannel = message.member.voice.channel;
    try {
      await voiceChannel.join();
    } catch (error) {
      throw new AppError(message, error, __filename).logOnConsole();
    }
  }

  public static async leave(message: Message): Promise<void> {
    if (!this.userIsInVoiceChannel) return;

    const voiceChannel = message.member.voice.channel;
    try {
      await voiceChannel.leave();
    } catch (error) {
      throw new AppError(message, error, __filename).logOnConsole();
    }
  }

  public static userIsInVoiceChannel(message: Message): boolean {
    if (!message.member.voice.channel) {
      throw new AppError(
        message,
        "You need to join a voice channel!",
        `${__filename}`
      ).logOnConsoleAndReplyToUser();
    }
    return true;
  }
}
