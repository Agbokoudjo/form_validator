import { Logger } from ".";

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
export function bytesToMegabytes(bytes: number) {
    return bytes / (1024 * 1024);
}
/*
 * @formatting string
 */
/**
 * Échappe les balises HTML contenues dans la chaîne ou dans chaque chaîne d'un tableau ou objet.
 *
 * @param content - La chaîne, le tableau de chaînes, ou l'objet à traiter.
 * @param stripHtmlTags - Si vrai, supprime les balises HTML avant d'échapper. Par défaut, c'est vrai.
 * @return - La chaîne échappée, le tableau de chaînes échappées, ou un objet avec valeurs échappées.
 * @throws - Si la chaîne ou le tableau est vide.
 */
export function escapeHtmlBalise(
    content: string | string[] | Record<string, any> | undefined | null,
    stripHtmlTags: boolean = true
): string | string[] | Record<string, any> {
    if (content === undefined || content === null || Object.keys(content).length === 0) { throw new Error("I expected a string no empty,array or object but it is not yet"); }
    const escapeString = (str: string | null | undefined): string => {
        if (str === null || str === undefined) {
            return '';
        }
        if (stripHtmlTags) {
            str = str.replace(/<\/?[^>]+(>|$)/g, '');
        }
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    if (Array.isArray(content)) {
        return content.map(escapeString);
    } else if (typeof content === 'object') {
        const escapedObject: Record<string, any> = {};
        for (const key in content) {
            if (Object.prototype.hasOwnProperty.call(content, key)) {
                const value = content[key];
                escapedObject[key] = typeof value === 'object' && value !== null
                    ? escapeHtmlBalise(value, stripHtmlTags)
                    : escapeString(value);
            }
        }
        return escapedObject;
    }

    return escapeString(content);
}

/**
* This function capitalizes the first letter of a word and converts the rest to lowercase.
* 
* @param {string} str - The input string to transform.
* @param {boolean} [escapeHtmlBalise_string=true] - If true, escapes HTML tags in the string.
* @param {string | string[]} [locales] - The locale(s) to use for capitalization.
* @returns {string} - Returns a formatted string in the form "Agbokoudjo".
*/
export function ucfirst(str: string, escapeHtmlBalise_string: boolean = true, locales?: string | string[]): string {
    if (!str) return str; // Returns the string as is if it's empty or null
    if (escapeHtmlBalise_string) {
        str = escapeHtmlBalise(str) as string;
    }
    return str.charAt(0).toLocaleUpperCase(locales) + str.slice(1).toLowerCase();
}

/**
 * Ajoute des sauts de ligne automatiquement sur une chaine
 *
 * @param str
 * @return string
 */
export function nl2br(str: string) {
    return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2')
}
/**
 * Capitalizes each word in a string.
 * 
 * This function transforms each word by making the first letter uppercase 
 * and the rest of the letters lowercase. It is ideal for form fields 
 * where a full name or title is required.
 * 
 * **Examples of usage:**
 * - "hounha franck empedocle" → "Hounha Franck Empedocle"
 * - "internationales web services" → "Internationales Web Services"
 * 
 * @param {string} data - The string to be transformed.
 * @param {string} [separator_toString=" "] - The separator for words or substrings in the main string.
 * @param {string} [finale_separator_toString=" "] - The final separator used to join the formatted words.
 * @param {boolean} [escapeHtmlBalise_string=true] - If true, HTML tags are escaped to prevent injections.
 * @param {string | string[]} [locales] - Specifies the locale used for uppercase formatting.
 * @returns {string} - Returns the formatted string with each word capitalized.
 */
export function capitalizeString(data: string,
    separator_toString: string = " ",
    finale_separator_toString: string = " ",
    escapeHtmlBalise_string: boolean = true,
    locales?: string | string[]
): string {
    data = data.replace(/\s+/g, " ");
    let words: string[] = data.split(separator_toString);
    if (words.length <= 1) { return ucfirst(data, true, locales); }
    if (escapeHtmlBalise_string) {
        words = escapeHtmlBalise(words, true) as string[];
    }
    return words.map((word_item: string, index: number) => ucfirst(word_item, false, locales))
        .join(finale_separator_toString);
}
/**
 * This function formats a string into a full name with first name(s) and last name.
 * For example, if you provide a string like "Agbokoudjo hounha franck empedocle hounha franck empedocle Agbokoudjo",
 * it will return either `Hounha Franck Empedocle AGBOKOUDJO` or `AGBOKOUDJO Hounha Franck Empedocle` 
 * depending on the value of the `position_lastname` argument.
 * This function is ideal for input fields in forms where full names (first name and last name) need to be entered.
 * 
 * **Examples of usage:**
 * - "Agbokoudjo hounha franck empedocle hounha franck empedocle Agbokoudjo" with position_lastname="left" → "Hounha Franck Empedocle AGBOKOUDJO"
 * - "Agbokoudjo hounha franck empedocle hounha franck empedocle Agbokoudjo" with position_lastname="right" → "AGBOKOUDJO Hounha Franck Empedocle"
 * 
 * @param {string} value_username - The string to format (e.g., a full name with first and last name).
 * @param {string} [position_lastname="left"] - Position of the last name in the formatted string ("left" or "right").
 * @param {string} [separator_toString=" "] - The separator for words or substrings in the main string (default is a space).
 * @param {string} [finale_separator_toString=" "] - The final separator used to join the formatted words (default is a space).
 * @param {string | string[]} [locales] - The locale used for uppercase formatting.
 * @returns {string} - Returns the formatted full name with the last name placed according to the `position_lastname`.
 */
export function usernameFormat(value_username: string,
    position_lastname: "left" | "right" = "left",
    separator_toString: string = " ",
    finale_separator_toString: string = " ",
    locales?: string | string[]
): string {
    value_username = value_username.trim().replace(/\s+/g, " ");
    // Vérifier si la chaîne est vide ou ne contient qu'un seul mot
    if (!value_username || value_username.split(separator_toString).length <= 1) {
        return value_username;
    }
    const username_elmt = escapeHtmlBalise(value_username.split(separator_toString)) as string[];
    const lastname = position_lastname === "right"
        ? username_elmt.pop()!.toLocaleUpperCase(locales)
        : username_elmt[0].toLocaleUpperCase(locales);
    const firstname_emt = position_lastname === "right"
        ? username_elmt
        : username_elmt.slice(1);
    const firstname = firstname_emt
        .map(firstname_item => capitalizeString(firstname_item, separator_toString, finale_separator_toString, false, locales))
        .join(finale_separator_toString);
    return position_lastname === "right"
        ? `${firstname}${finale_separator_toString}${lastname}`
        : `${lastname}${finale_separator_toString}${firstname}`;
}
/**
 * Converts a string value to a boolean.
 * Recognized truthy values: "true", "1", "yes"
 * Recognized falsy values: "false", "0", "no"
 *
 * @param value - The string to convert
 * @returns boolean representation of the value
 */
export function toBoolean(value: string | null | undefined): boolean {
    if (typeof value !== 'string') return false;

    const normalized = value.trim().toLowerCase();

    if (['true', '1', 'yes'].includes(normalized)) return true;
    if (['false', '0', 'no'].includes(normalized)) return false;

    // Optional: throw or default to false for unrecognized strings
    Logger.warn(`Unrecognized boolean string value: "${value}"`);
    return false;
}

/**
 * Prefixes each string in the provided array with a hash symbol (#).
 *
 * This utility function is commonly used when converting an array of element IDs
 * into CSS selectors that target elements by their ID (e.g., "#elementId").
 *
 * @param ids - An array of strings representing element IDs.
 * @returns A new array of strings with each ID prefixed by a hash symbol (#).
 *
 * @example
 * const ids = ['name', 'email', 'submit'];
 * const result = addHashToIds(ids);
 * console.log(result); // ['#name', '#email', '#submit']
 */
export function addHashToIds(ids: string[]): string[] {
    if (!Array.isArray(ids)) { return []; }
    return ids.map(id => `#${id}`);
}
