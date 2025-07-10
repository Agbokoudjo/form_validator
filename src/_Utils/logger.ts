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
 * @example 
 * 
 * ```typescript
 *  Logger.log('Application started');
 *   Logger.info('User logged in', { id: 123, name: "Alice" });
  *  Logger.warn('Deprecated function called');
  *  Logger.error(new Error('Something went wrong'));
   * [LOG]     2025-05-26T10:20:30.123Z  "Application started"
    [INFO]    2025-05-26T10:20:30.456Z  "User logged in" { id: 123, name: "Alice" }
    [WARN]    2025-05-26T10:20:30.789Z  "Deprecated function called"
    [ERROR]   2025-05-26T10:20:31.000Z  "Error: Something went wrong"
    ```
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

    private formatArgs(args: any[]): any[] {
        return args.map(arg => {
            if (arg instanceof Error) { return `Error:${arg.name}:${arg.message}\n${arg.stack}\n\t${arg.cause}`; }  // Retourne une seule chaîne qui inclut le nom, le message et la pile
            else if (typeof arg == "object" && arg !== null) {
                try {
                    // Retourne un objet transformé en chaîne JSON
                    return JSON.stringify(arg, null, 2);
                } catch {
                    return '[Unserializable object]';
                }
            } else {
                // Retourne les valeurs primitives directement
                return arg;
            }
        });
    }

    private getPrefix(type: string): { prefixString: string, styles: string[] } {

        const timestamp = new Date().toISOString();

        let typeColor: string = 'color: #333; font-weight: bold;';// Couleur par défaut pour 'log'

        let timestampColor: string = 'color: gray;'; // Couleur par défaut pour l'horodatage
        if (type === "error") { typeColor = 'color: red; font-weight: bold;'; }

        else if (type === "warn") { typeColor = 'color: orange; font-weight: bold;'; }

        else if (type === "info") { typeColor = 'color:blue; font-weight: bold;'; }

        // Construit la chaîne de format avec deux %c pour deux styles
        const prefixString = `%c[${type.toUpperCase()}]%c ${timestamp}`;

        // L'ordre est important : typeColor pour le premier %c, timestampColor pour le second %c
        const styles = [typeColor, timestampColor];

        return { prefixString, styles };
    }

    public static log(...args: any[]): void {
        const logger = this.getInstance();

        if (logger.DEBUG && logger.APP_ENV !== "prod") {

            const { prefixString, styles } = logger.getPrefix('log');
            // Passe la chaîne de préfixe, puis tous les arguments de style, puis les messages formatés réels
            console.log(prefixString, ...styles, ...logger.formatArgs(args));
        }
    }

    public static warn(...args: any[]): void {

        const logger = this.getInstance(); // S'assurer que getInstance est appelé dans chaque méthode statique

        if (logger.DEBUG || logger.APP_ENV !== "prod") { // Logique corrigée basée sur l'original, souvent les avertissements s'affichent même en production si le débogage est activé
            const { prefixString, styles } = logger.getPrefix('warn');
            console.warn(prefixString, ...styles, ...logger.formatArgs(args));
        }
    }

    public static error(...args: any[]): void {

        const logger = this.getInstance(); // S'assurer que getInstance est appelé dans chaque méthode statique

        const { prefixString, styles } = logger.getPrefix('error');
        // Les erreurs sont toujours journalisées
        console.error(prefixString, ...styles, ...logger.formatArgs(args));
    }

    public static info(...args: any[]): void {

        const logger = this.getInstance(); // S'assurer que getInstance est appelé dans chaque méthode statique

        if (logger.DEBUG && logger.APP_ENV === "dev") {
            const { prefixString, styles } = logger.getPrefix('info');
            console.info(prefixString, ...styles, ...logger.formatArgs(args));
        }
    }
}
