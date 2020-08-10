import ytdl from "ytdl-core";
import getVideoId from "get-video-id";

export default class YouTubeVideo {
  private videoId: string;
  private videoUrl: string;
  private title: string;
  private channel: string;
  private uploadDate: string;
  private likes: number;
  private dislikes: number;
  private artist: string;
  private writers: string;
  private game: string;

  public async setVideoInfo(videoUrl: string): Promise<void> {
    const videoId = YouTubeVideo.getIdFromUrl(videoUrl);

    this.videoId = videoId;

    const videoInfo = await this.getVideoInfo();

    this.videoUrl = videoInfo.videoDetails.video_url;
    this.title = videoInfo.videoDetails.title;
    this.channel = videoInfo.videoDetails.ownerChannelName;
    this.uploadDate = videoInfo.videoDetails.uploadDate;
    this.likes = videoInfo.videoDetails.likes;
    this.dislikes = videoInfo.videoDetails.dislikes;
    this.artist = videoInfo.videoDetails.media.artist || "Unknown";
    this.writers = videoInfo.videoDetails.media.writers || "Unknown";
    this.game = videoInfo.videoDetails.media.game || "Unknown";
  }

  private async getVideoInfo(): Promise<ytdl.videoInfo> {
    const videoInfo = await ytdl.getInfo(this.videoId);
    return videoInfo;
  }

  public toString(): string {
    return `\nId: ${this.videoId}\nTitle: ${this.title}\nChannel: ${this.channel}\nUpload Date: ${this.uploadDate}\nLikes: ${this.likes}\nDislikes: ${this.dislikes}\nArtist: ${this.artist}\nWriters: ${this.writers}\nGame: ${this.game}\nUrl: ${this.videoUrl}\n`;
  }

  public static getIdFromUrl(videoUrl: string): string {
    const videoId = getVideoId(videoUrl).id;
    return videoId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getUrl(): string {
    return this.videoUrl;
  }
}
