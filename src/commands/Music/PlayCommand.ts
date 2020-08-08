import Command, { CommandType } from "../Command";

export default class PlayCommand extends Command<CommandType.PLAY> {
  execute(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  canExecute(): boolean {
    throw new Error("Method not implemented.");
  }
}
