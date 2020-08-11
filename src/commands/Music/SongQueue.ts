import YouTubeVideo from "../../services/YouTube/YouTubeVideo";
import Logger from "../../utils/Logger";

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
    Logger.warn("The queue was destroyed!");
  }
}
