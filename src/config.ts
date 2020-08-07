import dotenv from "dotenv";
dotenv.config();

export const PREFIX = process.env["PREFIX"] || "k!";
export const TOKEN = process.env["TOKEN"] || undefined;

export const ACTIVITY =
  process.env["ACTIVITY"] || "Hello! - Did you forget to set my activity?";
