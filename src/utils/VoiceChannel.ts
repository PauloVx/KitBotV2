import { Message, VoiceConnection } from "discord.js";
import AppError from "../errors/AppError";
import internal from "stream";
import Logger from "./Logger";

export default class VoiceChannel {
  public static async join(message: Message): Promise<VoiceConnection> {
    const voiceChannel = message.member.voice.channel;
    let voiceConnection: VoiceConnection;
    try {
      voiceConnection = await voiceChannel.join();
    } catch (error) {
      throw new AppError(message, error, __filename).logOnConsole();
    }

    Logger.warn("Joined Voice Channel");
    return voiceConnection;
  }

  public static leave(message: Message): Promise<void> {
    if (!this.userIsInVoiceChannel) return;

    const voiceChannel = message.member.voice.channel;
    try {
      voiceChannel.leave();
      Logger.warn("Left Voice Channel");
    } catch (error) {
      throw new AppError(message, error, __filename).logOnConsole();
    }
  }

  public static userIsInVoiceChannel(message: Message): boolean {
    if (!message.member.voice.channel) return false;

    return true;
  }

  public static async getConnection(
    message: Message
  ): Promise<VoiceConnection> {
    return await VoiceChannel.join(message);
  }

  public static async setDispatcher(
    message: Message,
    stream: internal.Readable
  ) {
    const connection = await VoiceChannel.getConnection(message);
    return connection.play(stream);
  }

  public static async getDispatcher(
    message: Message,
    stream: internal.Readable
  ) {
    const dispatcher = await VoiceChannel.setDispatcher(message, stream);
    return dispatcher;
  }
}
