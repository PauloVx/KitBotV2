import { Client, Message } from "discord.js";

import { TOKEN, ACTIVITY, PREFIX } from "./config";
import { CommandFactory } from "./commands/CommandFactory";

export default class DiscordBot {
  private static instance: DiscordBot;
  private client: Client = new Client();
  private prefix = PREFIX;

  private commandFactory: CommandFactory = new CommandFactory(
    this.client,
    this.prefix
  );

  private constructor() {
    this.initializeClient();
  }

  public static getInstance(): DiscordBot {
    if (!DiscordBot.instance) return new DiscordBot();
    return DiscordBot.instance;
  }

  public connect(): void {
    this.client
      .login(TOKEN)
      .then(() => {
        console.warn(
          "\x1b[32m",
          "\x1b[1m",
          "\n[INFO] Connected to Discord! Username: " +
            this.client.user.username,
          "\x1b[0m"
        );
      })
      .catch((err) => {
        console.error(
          "\x1b[31m",
          "\x1b[1m",
          "\n[ERROR] Login Error: " + err,
          "\x1b[0m"
        );
      });
  }

  private initializeClient(): void {
    if (!this.client) return;

    this.setReadyHandler();
    this.setMessageHandler();
  }

  private setReadyHandler(): void {
    this.client.on("ready", () => {
      this.client.user?.setActivity(ACTIVITY);
    });
  }

  private setMessageHandler(): void {
    this.client.on("message", async (message: Message) => {
      if (message.content.indexOf(this.prefix) !== 0) return;
      if (message.author.bot) return;

      //* delegates creation to factory & executes
      const command = this.commandFactory.createCommand(message);
      await command.execute();
    });
  }
}
