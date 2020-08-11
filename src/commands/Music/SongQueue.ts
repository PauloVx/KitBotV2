import YouTubeVideo from "../../services/YouTube/YouTubeVideo";

export default class SongQueue {
  private queue = new Array<YouTubeVideo>();
  private static instance: SongQueue = new SongQueue();

  private constructor() {}

  public static getInstance(): SongQueue {
    return SongQueue.instance;
  }

  public get(): Array<YouTubeVideo> {
    return this.queue;
  }

  public destroy(): void {
    this.get().length = 0;
    console.warn("\x1b[33m", "\n[WARN] The queue was destroyed!", "\x1b[0m");
  }
}
