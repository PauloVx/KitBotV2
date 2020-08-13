export enum CommandType {
  PING,
  PLAY,
  STOP,
  SKIP,
  QUEUE,
  ADD,
  HELP,
}

export default abstract class Command<CommandType> {
  abstract async execute(): Promise<void>;
  abstract hasPermissionToExecute(): boolean;
}
