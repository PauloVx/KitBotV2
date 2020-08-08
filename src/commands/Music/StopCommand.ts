import Command, { CommandType } from "../Command";

export default class StopCommand extends Command<CommandType.STOP> {
  execute(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  canExecute(): boolean {
    throw new Error("Method not implemented.");
  }
}
