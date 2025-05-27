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
/**
 *  Logger.log('Application started');
 *   Logger.info('User logged in', { id: 123, name: "Alice" });
  *  Logger.warn('Deprecated function called');
  *  Logger.error(new Error('Something went wrong'));
   * [LOG]     2025-05-26T10:20:30.123Z  "Application started"
    [INFO]    2025-05-26T10:20:30.456Z  "User logged in" { id: 123, name: "Alice" }
    [WARN]    2025-05-26T10:20:30.789Z  "Deprecated function called"
    [ERROR]   2025-05-26T10:20:31.000Z  "Error: Something went wrong"
 */
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

    private formatArgs(args: any[]): string[] {
        return args.map(arg => {
            if (arg instanceof Error) {
                return `${arg.name}: ${arg.message}\n${arg.stack}`;
            }

            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch {
                    return '[Unserializable object]';
                }
            }

            return String(arg);
        });
    }


    private getPrefix(type: string): [string, string] {
        const prefix = `%c[${type.toUpperCase()}] %c${new Date().toISOString()}`;
        let color: string;
        switch (type) {
            case 'error': color = 'color: red; font-weight: bold'; break;
            case 'warn': color = 'color: orange; font-weight: bold'; break;
            case 'info': color = 'color: blue; font-weight: bold'; break;
            default: color = 'color: gray';
        }

        return [prefix, color];
    }

    public static log(...args: any[]): void {
        const logger = this.getInstance();
        if (logger.DEBUG && logger.APP_ENV !== "prod") {
            const [prefix, style1] = logger.getPrefix('log');
            console.log(prefix, style1, ...logger.formatArgs(args));
        }
    }

    public static warn(...args: any[]): void {
        const logger = this.getInstance();
        if (logger.DEBUG || logger.APP_ENV !== "prod") {
            const [prefix, style1] = logger.getPrefix('warn');
            console.warn(prefix, style1, ...logger.formatArgs(args));
        }
    }

    public static error(...args: any[]): void {
        const logger = this.getInstance();
        const [prefix, style1] = logger.getPrefix('error');
        console.error(prefix, style1, ...logger.formatArgs(args));
    }

    public static info(...args: any[]): void {
        const logger = this.getInstance();
        if (logger.DEBUG && logger.APP_ENV === "dev") {
            const [prefix, style1] = logger.getPrefix('info');
            console.info(prefix, style1, ...logger.formatArgs(args));
        }
    }
}
