import Command, { CommandType } from "../Command";
import { Client, Message } from "discord.js";
import AppError from "../../errors/AppError";
import PermissionError from "../../errors/PermissionError";

import VoiceChannel from "../../utils/VoiceChannel";
import YouTube from "../../services/YouTubeVideo";
import YouTubeVideo from "../../services/YouTubeVideo";

export default class PlayCommand extends Command<CommandType.PLAY> {
  //private songQueue = new Map();

  public constructor(private client: Client, private message: Message) {
    super();
  }

  public async execute(): Promise<void> {
    if (
      !this.hasPermissionToExecute() ||
      !VoiceChannel.userIsInVoiceChannel(this.message)
    )
      return;

    VoiceChannel.join(this.message);

    const video = new YouTubeVideo();
    await video.setVideoInfo("NjdgcHdzvac");

    console.log(video.toString());
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
