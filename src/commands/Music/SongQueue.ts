import YouTubeVideo from "../../services/YouTube/YouTubeVideo";

export default class SongQueue {
  private static queue = new Array<YouTubeVideo>();
  private static instance: SongQueue = new SongQueue();

  private constructor() {}

  public static getInstance(): SongQueue {
    return SongQueue.instance;
  }

  public get(): Array<YouTubeVideo> {
    return SongQueue.queue;
  }

  public destroy(): void {
    this.get().length = 0;
  }
}
