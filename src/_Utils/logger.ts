/*
 * Logger Utility Module
 * 
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @version 1.0.0
 * @license MIT
 * 
 * Company: INTERNATIONALES WEB APPS & SERVICES
 * Contact: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 */

/**
 * Supported environment types
 */
export type Env = 'dev' | 'prod' | 'test';

/**
 * LogLevel enum for type-safe logging levels
 */
enum LogLevel {
    LOG = 'log',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

/**
 * Prefix configuration interface
 */
interface PrefixConfig {
    prefixString: string;
    styles: string[];
}

/**
 * Logger class - Singleton pattern for consistent application-wide logging
 * 
 * Provides formatted console logging with environment-aware output and color-coded messages.
 * Supports multiple log levels (log, info, warn, error) with automatic timestamp injection.
 * 
 * @example
 * ```typescript
 * Logger.log('Application started');
 * Logger.info('User logged in', { id: 123, name: 'Alice' });
 * Logger.warn('Deprecated function called');
 * Logger.error(new Error('Something went wrong'));
 * 
 * // Output:
 * // [LOG]     2025-05-26T10:20:30.123Z  "Application started"
 * // [INFO]    2025-05-26T10:20:30.456Z  "User logged in" { id: 123, name: "Alice" }
 * // [WARN]    2025-05-26T10:20:30.789Z  "Deprecated function called"
 * // [ERROR]   2025-05-26T10:20:31.000Z  "Error: Something went wrong"
 * ```
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package @wlindabla/form_validator
 */
export class Logger {
    private static instance: Logger;
    public readonly APP_ENV: Env = 'dev';
    public readonly DEBUG: boolean = true;

    /**
     * Private constructor - prevents direct instantiation
     */
    private constructor() { }

    /**
     * Gets or creates the singleton Logger instance
     * @returns {Logger} The singleton Logger instance
     */
    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * Formats arguments for console output
     * Handles Error objects, complex objects, and primitive values
     * 
     * @param {any[]} args - Arguments to format
     * @returns {any[]} Formatted arguments ready for console output
     * @private
     */
    private formatArgs(args: any[]): any[] {
        return args.map((arg) => {
            if (arg instanceof Error) {
                return `Error: ${arg.name}: ${arg.message}\n${arg.stack}\n\t${arg.cause ?? ''}`;
            }

            if (typeof arg === 'object' && arg !== null) {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch {
                    return '[Unserializable object]';
                }
            }

            return arg;
        });
    }

    /**
     * Generates console prefix with styling based on log level
     * 
     * @param {LogLevel} level - The log level type
     * @returns {PrefixConfig} Object containing prefix string and CSS styles
     * @private
     */
    private getPrefix(level: LogLevel): PrefixConfig {
        const timestamp = new Date().toISOString();
        const levelUpper = level.toUpperCase();

        const colorMap: Record<LogLevel, string> = {
            [LogLevel.LOG]: 'color: #333; font-weight: bold;',
            [LogLevel.INFO]: 'color: #0066cc; font-weight: bold;',
            [LogLevel.WARN]: 'color: #ff9900; font-weight: bold;',
            [LogLevel.ERROR]: 'color: #cc0000; font-weight: bold;',
        };

        const typeColor = colorMap[level];
        const timestampColor = 'color: #666; font-size: 0.85em;';
        const prefixString = `%c[${levelUpper}]%c ${timestamp}`;
        const styles = [typeColor, timestampColor];

        return { prefixString, styles };
    }

    /**
     * Logs a general message
     * Only outputs in non-production environments with DEBUG enabled
     * 
     * @param {...any[]} args - Arguments to log
     */
    public static log(...args: any[]): void {
        const logger = Logger.getInstance();

        if (logger.DEBUG && logger.APP_ENV !== 'prod') {
            const { prefixString, styles } = logger.getPrefix(LogLevel.LOG);
            console.log(prefixString, ...styles, ...logger.formatArgs(args));
        }
    }

    /**
     * Logs an informational message
     * Only outputs in development environment with DEBUG enabled
     * 
     * @param {...any[]} args - Arguments to log
     */
    public static info(...args: any[]): void {
        const logger = Logger.getInstance();

        if (logger.DEBUG && logger.APP_ENV === 'dev') {
            const { prefixString, styles } = logger.getPrefix(LogLevel.INFO);
            console.info(prefixString, ...styles, ...logger.formatArgs(args));
        }
    }

    /**
     * Logs a warning message
     * Outputs in non-production environments or when DEBUG is enabled
     * 
     * @param {...any[]} args - Arguments to log
     */
    public static warn(...args: any[]): void {
        const logger = Logger.getInstance();

        if (logger.DEBUG || logger.APP_ENV !== 'prod') {
            const { prefixString, styles } = logger.getPrefix(LogLevel.WARN);
            console.warn(prefixString, ...styles, ...logger.formatArgs(args));
        }
    }

    /**
     * Logs an error message
     * Always outputs regardless of environment or DEBUG setting
     * Critical for error tracking and debugging
     * 
     * @param {...any[]} args - Arguments to log
     */
    public static error(...args: any[]): void {
        const logger = Logger.getInstance();
        const { prefixString, styles } = logger.getPrefix(LogLevel.ERROR);
        console.error(prefixString, ...styles, ...logger.formatArgs(args));
    }
}