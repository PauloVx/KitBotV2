import { Client, Message } from "discord.js";

import { TOKEN, ACTIVITY, PREFIX } from "./config";
import { CommandFactory } from "./commands/CommandFactory";
import Logger from "./utils/Logger";

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
        Logger.info(
          "Connected to discord! Username: " + this.client.user.username
        );
      })
      .catch((err) => {
        Logger.error("Login Error: " + err);
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
      try {
        await command.execute();
      } catch (e) {}
    });
  }
}
