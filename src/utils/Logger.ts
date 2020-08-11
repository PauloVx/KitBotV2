export default class Logger {
  public static log(message: string) {
    console.log("\x1b[1m", "\x1b[36m", `\n${message}`, "\x1b[0m");
  }

  public static info(message: string) {
    console.info("\x1b[1m", "\x1b[32m", `\n[INFO] ${message}`, "\x1b[0m");
  }

  public static warn(message: string) {
    console.warn("\x1b[1m", "\x1b[33m", `\n[WARN] ${message}`, "\x1b[0m");
  }

  public static error(message: string) {
    console.error("\x1b[1m", "\x1b[31m", `\n[ERROR] ${message}`, "\x1b[0m");
  }
}
