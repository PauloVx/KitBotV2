import YouTubeVideo from "../../services/YouTube/YouTubeVideo";

export default class SongQueue {
  private static queue = new Array<YouTubeVideo>();

  public getQueue(): Array<YouTubeVideo> {
    return SongQueue.queue;
  }
}
