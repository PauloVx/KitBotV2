import Command, { CommandType } from "../Command";
import { Client, Message } from "discord.js";
import PermissionError from "../../errors/PermissionError";
import AppError from "../../errors/AppError";
import VoiceChannel from "../../utils/VoiceChannel";
import SongQueue from "./SongQueue";
import YouTubeAPI from "../../services/YouTube/YouTubeAPI";
import Logger from "../../utils/Logger";

export default class SkipCommand extends Command<CommandType.SKIP> {
  public constructor(private client: Client, private message: Message) {
    super();
  }

  public async execute() {
    if (!this.hasPermissionToExecute())
      throw new PermissionError(this.message).replyErrorToUser();

    if (!VoiceChannel.userIsInVoiceChannel(this.message)) {
      throw new AppError(
        this.message,
        "You need to join a voice channel!",
        `${__filename}`
      ).logOnConsoleAndReplyToUser();
    }

    if (!SongQueue.getInstance().get()[0]) {
      this.message.reply("There's nothing playing! 😅");
      return;
    }

    //Try to skip last song in the queue.
    if (!SongQueue.getInstance().get()[1]) {
      this.message.channel.send(
        `**Skipped: ${SongQueue.getInstance().get()[0].getTitle()}**`
      );

      SongQueue.getInstance().destroy();
      await VoiceChannel.leave(this.message);
      return;
    }

    this.message.channel.send(
      `**Skipped: ${SongQueue.getInstance().get()[0].getTitle()}**`
    );

    SongQueue.getInstance().get().shift();

    const stream = YouTubeAPI.getStream(
      SongQueue.getInstance().get()[0].getUrl()
    );
    (await VoiceChannel.getDispatcher(this.message, stream)).destroy();
    await VoiceChannel.getDispatcher(this.message, stream);

    this.message.channel.send(
      `**Now Playing: ${SongQueue.getInstance().get()[0].getTitle()}**`
    );
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
