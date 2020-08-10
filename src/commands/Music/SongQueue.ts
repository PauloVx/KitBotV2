export default class SongQueue {
  private queue = new Map<string, string>();

  public getQueue(): Map<string, string> {
    return this.queue;
  }
}
