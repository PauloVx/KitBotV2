import YouTubeVideo from "../../services/YouTubeVideo";

export default class SongQueue {
  private queue = new Map<YouTubeVideo, number>();

  public getQueue(): Map<YouTubeVideo, number> {
    return this.queue;
  }

  public setQueue(queue: Map<YouTubeVideo, number>): void {
    this.queue = queue;
  }
}
