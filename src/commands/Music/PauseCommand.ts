import Command, { CommandType } from "../Command";

export default class PauseCommand extends Command<CommandType.PAUSE> {
  execute(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  canExecute(): boolean {
    throw new Error("Method not implemented.");
  }
}
