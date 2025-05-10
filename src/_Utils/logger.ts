/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */
export type Env = "dev" | "prod" | "test";
export class Logger {
    private static loggerInstance: Logger;
    public APP_ENV: Env = "dev";
    public DEBUG: boolean = true;

    private constructor() { }

    public static getInstance(): Logger {
        if (!Logger.loggerInstance) {
            Logger.loggerInstance = new Logger();
        }
        return Logger.loggerInstance;
    }

    private formatMessage(type: string, args: any[]): string {
        return `${new Date().toISOString()} [${type.toUpperCase()}] ${args.join(' ')}`;
    }

    public static log(...args: any[]): void {
        if (this.loggerInstance.DEBUG && this.loggerInstance.APP_ENV !== "prod") {
            console.log(this.loggerInstance.formatMessage('log', args));
        }
    }

    public static warn(...args: any[]): void {
        if (this.loggerInstance.DEBUG || this.loggerInstance.APP_ENV !== "prod") {
            console.warn(this.loggerInstance.formatMessage('warn', args));
        }
    }

    public static error(...args: any[]): void {
        console.error(this.loggerInstance.formatMessage('error', args));
    }

    public static info(...args: any[]): void {
        if (this.loggerInstance.DEBUG && this.loggerInstance.APP_ENV === "dev") {
            console.info(this.loggerInstance.formatMessage('info', args));
        }
    }
}
export class Profiler {

}
