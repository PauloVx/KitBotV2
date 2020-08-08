import { Message } from "discord.js";

export default class AppError {
  public readonly message: string;
  public readonly origin: string;

  private discordMsg: Message;

  public constructor(discordMsg: Message, message?: string, origin?: string) {
    this.message = message || "An error ocurred!";
    this.origin = origin || "Unknown Origin";
    this.discordMsg = discordMsg;

    console.error(this.message + " at " + this.origin);
  }

  public logOnChannel(): void {
    this.discordMsg.channel.send(this.message + " at " + this.origin);
  }
}
