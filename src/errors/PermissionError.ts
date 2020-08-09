import AppError from "./AppError";
import { Message } from "discord.js";

export default class PermissionError extends AppError {
  constructor(message: Message) {
    super(
      message,
      "You don't have all the necessary permissions to execute the command!"
    );
  }
}
