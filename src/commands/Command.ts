export enum CommandType {
  PING,
  PLAY,
  PAUSE,
  STOP,
  SAY,
}

export default abstract class Command<CommandType> {
  abstract async execute(): Promise<void>;
  abstract canExecute(): boolean;
}
