import { Message } from "discord.js";

export default class AppError {
  public readonly message: string;
  public readonly origin: string;

  private discordMsg: Message;

  public constructor(discordMsg: Message, message?: string, origin?: string) {
    this.message = message || "An error ocurred!";
    this.origin = origin || "Unknown Origin";
    this.discordMsg = discordMsg;
  }

  public logOnChannel(): void {
    this.discordMsg.channel.send(this.message);
  }

  public logOnConsole(): void {
    console.error(this.message + " at " + this.origin);
  }

  public replyErrorToUser(): void {
    this.discordMsg.reply(this.message);
  }

  public logOnConsoleAndReplyToUser(): void {
    this.logOnConsole();
    this.replyErrorToUser();
  }

  public logOnChannelAndConsole(): void {
    this.logOnChannel();
    this.logOnConsole();
  }
}
