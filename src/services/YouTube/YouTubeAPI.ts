import YouTube from "simple-youtube-api";
import { YOUTUBE_API_KEY } from "../../config";
import AppError from "../../errors/AppError";
import { Message } from "discord.js";
import YouTubeVideo from "./YouTubeVideo";
import ytdl from "ytdl-core";

export default class YouTubeAPI {
  private static youTubeApi = new YouTube(YOUTUBE_API_KEY);

  public static async search(
    discordMsg: Message,
    keyWord: string
  ): Promise<YouTubeVideo> {
    let searchResult;
    try {
      searchResult = await YouTubeAPI.youTubeApi.searchVideos(keyWord, 1);
    } catch (error) {
      throw new AppError(
        discordMsg,
        `**An error ocurred: ${error.message}\nCode: ${error.code} ${error.errors[0].reason}\nStatus: ${error.status}**`,
        __filename
      ).logOnChannelAndConsole();
    }

    const videoId = searchResult[0].id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const video = new YouTubeVideo().configureVideo(videoUrl);

    return video;
  }

  public static getStream(url: string) {
    const stream = ytdl(url, {
      filter: "audioandvideo",
      highWaterMark: 1 << 25,
    });

    return stream;
  }
}
