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
import { REGEX_FORMAT_DATE, deepMerge, pad, zipArray } from "../../_Utils";
import { FormError } from "../FormError";
import { TextInputOptions } from "./TextInputValidator";
export interface DateInputOptions extends TextInputOptions {
    format?: string;       // Format attendu (ex: "YYYY-MM-DD", "DD/MM/YYYY")
    minDate?: Date;      // Date minimale
    maxDate?: Date;      // Date maximale
    allowFuture?: boolean; // Autoriser les dates futures
    allowPast?: boolean;   // Autoriser les dates passées
    delimiters?: string[]; // Délimiteurs autorisés
    strictMode?: boolean; //Si true, la date doit respecter strictement la longueur du format.
}
export interface DateInputValidatorInterface {
    /**
     * Validates a date string or Date object based on provided formatting and business rules.
     *
     * @param date_input - The date to validate (as a string or Date object).
     * @param targetInputname - The name of the input field being validated.
     * @param date_options - Optional rules to validate the date, including format, range, etc.
     *
     * @returns The current instance, allowing method chaining.
     *
     * @example
     * dateValidator('2024/06/30', 'birthdate', { format: 'YYYY/MM/DD', allowFuture: false });
 */
    dateValidator: (date_input: string | Date, targetInputname: string, date_options: DateInputOptions) => this;
}
/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @extends FormError
 * @interface DateInputValidatorInterface
 */
export class DateInputValidator extends FormError implements DateInputValidatorInterface {
    private static __instanceDateValidator: DateInputValidator;
    private constructor() { super(); }
    public static getInstance(): DateInputValidator {
        if (!DateInputValidator.__instanceDateValidator) {
            DateInputValidator.__instanceDateValidator = new DateInputValidator();
        }
        return DateInputValidator.__instanceDateValidator;
    }
    public dateValidator = (date_input: string | Date, targetInputname: string, date_options: DateInputOptions = {}): this => {
        const {
            format = 'YYYY/MM/DD',
            strictMode,
            delimiters = ['/', '-'],
            minDate,
            maxDate,
            allowFuture,
            allowPast
        } = date_options;
        if (typeof date_input === "string") {
            if (!REGEX_FORMAT_DATE.test(format)) {
                throw new Error(`Invalid date format pattern. ${format}`); //on lance une execption pour signaler au developpeur une erreur de saisi de format de sa part
            }
            if (strictMode === true && date_input.length !== format.length) {
                return this.setValidatorStatus(false, 'Date does not match required length in strict mode.', targetInputname);
            }
            //On détecte les délimiteurs utilisés dans le format et dans l'entrée.
            const formatDelimiter = delimiters.find(delimiter => format.indexOf(delimiter) !== -1);
            //si strictMode est true cela signifi que la date respect le format donc son dateDelimiter=formatDelimiter 
            //sinon on detecte pour la date 
            const dateDelimiter = strictMode ? formatDelimiter : delimiters.find(delimiter => date_input.indexOf(delimiter) !== -1);

            if (!formatDelimiter || !dateDelimiter) {
                return this.setValidatorStatus(false, 'Could not detect delimiter in date.', targetInputname);
            }
            const dateParts = date_input.split(dateDelimiter);
            const formatParts = format.toLowerCase().split(formatDelimiter);
            if (dateParts.length !== formatParts.length) {
                return this.setValidatorStatus(false, 'Mismatch between date and format parts.', targetInputname);
            }
            /**
             * cette fonction zipArray lance une exception de type Error lorsque les longueurs des deux tableaux 
             * passés ne sont pas egales ,puisque nous avons gerer le cas ou les longueurs ne sont pas egales avant d'appeler la fonction 
             * nous avons plus besoin d'entourer la fonction de tryCatch pour gerer l'exception
             */
            const zipped_date = zipArray<string>(dateParts, formatParts);
            const dateObj: Record<string, string> = {};
            for (const [value, format] of zipped_date) {
                if (!value || !format || value.length !== format.length) {
                    return this.setValidatorStatus(false, `Invalid part: '${value}' does not match '${format}'`, targetInputname);
                }
                dateObj[format[0]] = value;
            }
            let fullYear = dateObj.y;
            if (fullYear.startsWith('-')) {
                return this.setValidatorStatus(false, 'Negative years are not supported.', targetInputname);
            }
            if (fullYear.length === 2) {
                const twoDigit = parseInt(fullYear, 10);
                const currentYear = ((new Date()).getFullYear()) % 100;
                fullYear = (twoDigit < currentYear ? '20' : '19') + fullYear;
            }
            const day = pad(dateObj.d);
            const dateValue = new Date(`${fullYear}-${pad(dateObj.m)}-${day}T00:00:00.000Z`);
            if (isNaN(dateValue.getTime())) {
                return this.setValidatorStatus(false, 'Invalid date created from input.', targetInputname);
            }
            //La méthode getUTCDate() renvoie le jour du mois pour la date renseignee d'apres UTC.
            if (dateValue.getUTCDate() !== +day) {
                return this.setValidatorStatus(false, 'Day mismatch (invalid day in month).', targetInputname);
            }
            // Vérification de la date minimale
            if (minDate && dateValue < minDate) {
                return this.setValidatorStatus(false, `The date must be after ${minDate}.`, targetInputname);
            }
            // Vérification de la date maximale
            if (maxDate && dateValue > maxDate) {
                return this.setValidatorStatus(false, `The date must be before ${maxDate}.`, targetInputname);
            }
            const now = new Date();
            // Vérification si les dates futures sont autorisées
            if (allowFuture === false && dateValue > now) {
                return this.setValidatorStatus(false, `The date "${dateValue.toISOString().split('T')[0]}" cannot be in the future.`, targetInputname);
            }
            // Vérification si les dates passées sont autorisées
            if (allowPast === false && dateValue < now) {
                return this.setValidatorStatus(false, `The date "${dateValue.toISOString().split('T')[0]}" cannot be in the past.`, targetInputname);
            }
        }
        return this;
    }
}
export const dateInputValidator = DateInputValidator.getInstance();