import { Client, Message } from "discord.js";
import { TOKEN, PREFIX, ACTIVITY } from "./config";

const client = new Client();

client.on("message", async (msg: Message) => {
  if (!msg.content.startsWith(PREFIX)) return;
});

client.on("ready", () => {
  client.user?.setActivity(ACTIVITY);
  console.warn("KitBot V2 Logged in!");
});

client.login(TOKEN).catch((err) => {
  console.error("Login Error: " + err);
});
