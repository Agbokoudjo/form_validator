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
import { lowerRegex, punctuationRegex, numberRegex, symbolRegex, upperRegex } from "./regex";
import { deepMerge } from "./merge";

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
    const escapeString = (str: string | null | undefined): string => {
        if (str === null || str === undefined) {
            return '';
        }
        if (stripHtmlTags) {
            str = str.replace(/<\/?[^>]+(>|$)/g, '');
        }
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\//g, '&#x2F;')
            .replace(/\\/g, '&#x5C;')
            .replace(/`/g, '&#96;');
    };

    if (content === undefined || content === null) {
        throw new Error("Expected a non-empty string, array or object, but got null or undefined");
    }

    if (typeof content === 'string') {
        return escapeString(content);
    }

    if (Array.isArray(content)) {
        return content.map(item =>
            typeof item === 'string' || item === null || item === undefined
                ? escapeString(item)
                : item
        );
    }

    if (typeof content === 'object') {
        const escapedObject: Record<string, any> = {};
        for (const key in content) {
            if (hasProperty(content, key)) {
                const value = content[key];
                if (
                    typeof value === 'string' ||
                    value === null ||
                    value === undefined
                ) {
                    escapedObject[key] = escapeString(value);
                } else if (typeof value === 'object') {
                    escapedObject[key] = escapeHtmlBalise(value, stripHtmlTags);
                } else {
                    escapedObject[key] = value;
                }
            }
        }
        return escapedObject;
    }

    throw new Error("Unsupported input type for HTML escaping.");
}

/**
 * Recursively unescapes HTML entities from strings, arrays, or objects.
 *
 * This function is the inverse of `escapeHtmlBalise`. It replaces HTML entities
 * such as `&amp;`, `&lt;`, `&gt;`, `&quot;`, and others with their corresponding characters.
 *
 * It supports:
 * - Strings: returns the unescaped string.
 * - Arrays: returns a new array with all string elements unescaped.
 * - Objects: returns a new object with all string values recursively unescaped.
 *
 * @param content - A string, array of strings, or object (possibly nested) whose content may contain HTML-escaped entities.
 * @returns The unescaped version of the input, preserving its original structure (string, array, or object).
 *
 * @throws {Error} If the input is `null`, `undefined`, or of an unsupported type.
 *
 * @example
 * unescapeHtmlBalise('&lt;b&gt;bold&lt;/b&gt;'); // "<b>bold</b>"
 * unescapeHtmlBalise(['&amp;copy;', '&quot;text&quot;']); // ["©", '"text"']
 * unescapeHtmlBalise({ name: '&lt;John&gt;', meta: { desc: '&quot;hello&quot;' } });
 * // { name: "<John>", meta: { desc: '"hello"' } }
 */

export function unescapeHtmlBalise(
    content: string | string[] | Record<string, any> | undefined | null
): string | string[] | Record<string, any> {
    const unescapeString = (str: string | null | undefined): string => {
        if (str === null || str === undefined) {
            return '';
        }
        return str
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#x2F;/g, '/')
            .replace(/&#x5C;/g, '\\')
            .replace(/&#96;/g, '`')
            .replace(/&amp;/g, '&'); // Important : doit rester le dernier
    };

    if (content === undefined || content === null) {
        throw new Error("Expected a non-empty string, array or object, but got null or undefined");
    }

    if (typeof content === 'string') {
        return unescapeString(content);
    }

    if (Array.isArray(content)) {
        return content.map(item =>
            typeof item === 'string' || item === null || item === undefined
                ? unescapeString(item)
                : item
        );
    }

    if (typeof content === 'object') {
        const unescapedObject: Record<string, any> = {};
        for (const key in content) {
            if (hasProperty(content, key)) {
                const value = content[key];
                if (
                    typeof value === 'string' ||
                    value === null ||
                    value === undefined
                ) {
                    unescapedObject[key] = unescapeString(value);
                } else if (typeof value === 'object') {
                    unescapedObject[key] = unescapeHtmlBalise(value);
                } else {
                    unescapedObject[key] = value;
                }
            }
        }
        return unescapedObject;
    }

    throw new Error("Unsupported input type for HTML unescaping.");
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
    console.warn(`Unrecognized boolean string value: "${value}"`);
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

export interface ByteLengthOptions {
    min?: number;
    max?: number;
}
/**
 * Checks whether the byte length of a given string is within the specified range.
 *
 * This function encodes the string in UTF-8 using `encodeURI` and calculates its actual byte length.
 * It's useful for validating fields that must comply with byte-based limits, such as email addresses,
 * usernames, database columns, or network transmission constraints.
 *
 * @function isByteLength
 * @param {string} str - The string to evaluate.
 * @param {ByteLengthOptions} [options={}] - Optional constraints for validation.
 * @param {number} [options.min=0] - Minimum byte length allowed. Defaults to 0 if not provided.
 * @param {number} [options.max] - Maximum byte length allowed. If not defined, no upper limit is enforced.
 *
 * @returns {boolean} Returns `true` if the string's byte length is within the specified range, `false` otherwise.
 *
 * @example
 * isByteLength("hello", { min: 3, max: 10 });        // true
 * isByteLength("é", { min: 1, max: 1 });             // false (é = 2 bytes in UTF-8)
 * isByteLength("你好", { max: 4 });                  // false (each character = 3 bytes, total = 6)
 * isByteLength("François", { max: 9 });              // true (ç = 2 bytes, total = 9 bytes)
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI | encodeURI}
 */

/**
 * Options pour la validation de la longueur en octets.
 */
export function isByteLength(str: string, options: ByteLengthOptions = {}): boolean {
    const min: number = options.min ?? 0;
    const max: number | undefined = options.max;
    // Encode en UTF-8 et calcule la longueur réelle en octets
    const byteLength: number = encodeURI(str).split(/%..|./).length - 1;
    // Vérifie que byteLength est ≥ min et ≤ max (si max est défini)
    return byteLength >= min && (typeof max === 'undefined' || byteLength <= max);
}

export function mapToObject(map: Map<string, number>): Record<string, number> {
    const obj: Record<string, number> = {};
    for (const [key, value] of map.entries()) {
        obj[key] = value;
    }
    return obj;
}

/**
 * Counts the number of occurrences of each character in the input string.
 *
 * Throws an error if the string is longer than 255 characters, recommending
 * to use `countWord` instead for longer text analysis.
 *
 * @param {string} str - The string to analyze.
 * @returns {Map<string, number>} A map where each character is a key and the value is its count.
 * @throws {Error} If the input string exceeds 255 characters.
 *
 * @example
 * countChars("hello"); // Map { 'h' => 1, 'e' => 1, 'l' => 2, 'o' => 1 }
 */
export function countChars(str: string): Map<string, number> {

    if (str.length > 255) {
        throw new Error(`${str} is too long. Maximum allowed is 255 characters. Use countWord() instead for processing.`);
    }

    str = str.trim();
    let result_char = new Map<string, number>();
    for (const char of str) {
        const count_char = result_char.get(char) || 0;
        result_char.set(char, count_char + 1);
    }

    return result_char;
}


export interface AnalyzeAllowedCharOptions {
    allowedUpper?: boolean;
    allowedLower?: boolean;
    allowedNumber?: boolean;
    allowedSymbol?: boolean;
    allowedPunctuation?: boolean;
}

export interface AnalyzeWordOptions {
    customUpperRegex?: RegExp;
    customLowerRegex?: RegExp;
    customNumberRegex?: RegExp;
    customSymbolRegex?: RegExp;
    customPunctuationRegex?: RegExp;
    analyzeCharTypes?: AnalyzeAllowedCharOptions;
}
export interface AnalysisWordInterface {
    length: number;
    uniqueChars: number;
    uppercaseCount: number;
    lowercaseCount: number;
    numberCount: number;
    symbolCount: number;
    punctuationCount: number;
}

/**
 * Analyzes the composition of a word or phrase by counting character types:
 * uppercase letters, lowercase letters, digits, symbols, and punctuation marks.
 *
 * Allows for customization of character classification using regular expressions and
 * selective toggling of which categories to count.
 *
 * @param word - The input string to analyze.
 * @param analyzeWordOptions - Optional configuration object to customize regex patterns and enabled character types.
 *
 * @returns An object containing the total length, unique character count, and individual counts
 *          of uppercase, lowercase, numeric, symbol, and punctuation characters.
 *
 * @throws {TypeError} If the `word` argument is not a string.
 * @throws {Error} If the character count mapping fails (e.g., input too long).
 *
 * @example
 * ```typescript
 * analyzeWord("Hello123!");
  {
   lengthWord: 9,
   uniqueChars: 8,
   uppercaseCount: 1,
    lowercaseCount: 4,
    numberCount: 3,
    symbolCount: 1,
   punctuationCount: 0
  }
 *```
 * @example
 * ```typescript
 * analyzeWord("ça c'est génial!", {
 *   customLowerRegex: /^[a-zàâäéèêëïîôöùûüç]$/i,
 *   customUpperRegex: /^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ]$/
 * });
 *```
 * @example
 * ```typescript
 * analyzeWord("User@domain.com!", {
 *   analyzeCharTypes: {
 *     allowedUpper: true,
 *     allowedLower: true,
 *     allowedNumber: false,
 *     allowedSymbol: true,
 *     allowedPunctuation: true
 *   }
 * });
 * ```
 */
export function analyzeWord(word: string, analyzeWordOptions?: AnalyzeWordOptions): AnalysisWordInterface {

    if (typeof word !== 'string') { throw new TypeError('The argument "word" must be a string.'); }

    let charMap: Map<string, number>;

    try {
        charMap = countChars(word);
    } catch (error) {
        throw error;
    }

    let analysis: AnalysisWordInterface = {
        length: word.length,
        uniqueChars: charMap.size,
        uppercaseCount: 0,
        lowercaseCount: 0,
        numberCount: 0,
        symbolCount: 0,
        punctuationCount: 0
    };

    const mergedOptions = deepMerge<AnalyzeWordOptions, AnalyzeWordOptions>(
        analyzeWordOptions || {}, {
        customUpperRegex: upperRegex,
        customLowerRegex: lowerRegex,
        customNumberRegex: numberRegex,
        customSymbolRegex: symbolRegex,
        customPunctuationRegex: punctuationRegex,
        analyzeCharTypes: {
            allowedUpper: true,
            allowedLower: true,
            allowedNumber: true,
            allowedSymbol: true,
            allowedPunctuation: true
        }
    });
    // Destructuration et renommage pour la clarté 
    const {
        customUpperRegex,
        customLowerRegex,
        customNumberRegex,
        customSymbolRegex,
        customPunctuationRegex,
        analyzeCharTypes
    } = mergedOptions;

    // Destructuration avec les noms corrigés
    const { allowedLower, allowedNumber, allowedPunctuation, allowedSymbol, allowedUpper } = analyzeCharTypes!;

    for (const [char, charCount] of charMap.entries()) {


        if (allowedUpper && customUpperRegex && customUpperRegex.test(char)) {
            analysis.uppercaseCount += charCount;

        } else if (allowedLower && customLowerRegex && customLowerRegex.test(char)) {
            analysis.lowercaseCount += charCount;

        } else if (allowedNumber && customNumberRegex && customNumberRegex.test(char)) {
            analysis.numberCount += charCount;

        } else if (allowedSymbol && customSymbolRegex && customSymbolRegex.test(char)) {
            // Note: Les symboles peuvent inclure des ponctuations si les regex se chevauchent.
            analysis.symbolCount += charCount;

        } else if (allowedPunctuation && customPunctuationRegex && customPunctuationRegex.test(char)) {
            analysis.punctuationCount += charCount;
        }

    }

    return analysis;
}

// Interface d’analyse (résultat de analyzeWord par exemple)
export interface WordAnalysis {
    length: number;
    uniqueChars: number;
    lowercaseCount: number;
    uppercaseCount: number;
    numberCount: number;
    symbolCount: number;
    punctuationCount: number; // Vous pourriez vouloir l'inclure si analyzeWord la fournit
}

// Options de scoring (personnalisables)
export interface WordScoringOptions {
    pointsPerLength?: number;       // Points par caractère de longueur totale
    pointsPerUniqueChar?: number;   // Points par caractère unique
    pointsPerRepeatChar?: number;   // Points par caractère répété (caractères totaux - uniques)

    // Bonus pour la présence de chaque type de caractère (si > 0)
    bonusForContainingLower?: number;
    bonusForContainingUpper?: number;
    bonusForContainingNumber?: number;
    bonusForContainingSymbol?: number;
    bonusForContainingPunctuation?: number; // Si vous l'incluez dans WordAnalysis
}
export type WordScoreLevel = 'weak' | 'medium' | 'strong';

export interface ScoredWord {
    score: number;
    level: WordScoreLevel;
}

/**
 * Calcule un score de "richesse" ou de "complexité" pour n'importe quel mot,
 * basé sur sa longueur, la diversité de ses caractères et la présence de différents types.
 *
 * @param analysis - Le résultat de l'analyse du mot (comptes de caractères).
 * @param scoringOptions - Options configurables pour assigner des points par règle.
 *
 * @returns Un score numérique représentant la richesse/complexité du mot.
 *
 * @example
 * ```typescript
 const analysis = analyzeWord("Bonjour123!");
const result = scoreWord(analysis, {
  pointsPerLength: 2,
  pointsPerUniqueChar: 2,
  pointsPerRepeatChar: 1,
  bonusForContainingLower: 10,
  bonusForContainingUpper: 10,
  bonusForContainingNumber: 10,
  bonusForContainingSymbol: 10
});

console.log(result); // { score: 95, level: 'strong' }

 * ```
 */
export function scoreWord(
    analysis: AnalysisWordInterface,
    scoringOptions: WordScoringOptions = {}
): ScoredWord {
    const {
        pointsPerLength = 1,
        pointsPerUniqueChar = 2,
        pointsPerRepeatChar = 0.5,
        bonusForContainingLower = 10,
        bonusForContainingUpper = 10,
        bonusForContainingNumber = 10,
        bonusForContainingSymbol = 10,
        bonusForContainingPunctuation = 10
    } = scoringOptions;

    let score = 0;

    // 1. Points basés sur la longueur totale du mot
    score += analysis.length * pointsPerLength;

    // 2. Points basés sur le nombre de caractères uniques
    score += analysis.uniqueChars * pointsPerUniqueChar;

    // 3. Points pour les caractères répétés (longueur totale - uniques)
    // C'est ici que votre version originale était pertinente pour un scoring générique :
    // une répétition n'est pas une "pénalité" mais une contribution à la "masse" du mot.
    score += (analysis.length - analysis.uniqueChars) * pointsPerRepeatChar;

    // 4. Bonus pour la présence d'au moins un caractère de chaque catégorie
    if (analysis.lowercaseCount > 0) score += bonusForContainingLower;

    if (analysis.uppercaseCount > 0) score += bonusForContainingUpper;

    if (analysis.numberCount > 0) score += bonusForContainingNumber;

    if (analysis.symbolCount > 0) score += bonusForContainingSymbol;

    if (analysis.punctuationCount > 0) score += bonusForContainingPunctuation; // Si vous l'ajoutez

    // Détermination du niveau
    let level: WordScoreLevel;
    if (score >= 80) {
        level = 'strong';
    } else if (score >= 50) {
        level = 'medium';
    } else {
        level = 'weak';
    }
    return { score, level };
}

/**
 * Pads a single-digit string with a leading zero.
 *
 * This function takes a string as input. If the string's length is 1,
 * it prepends a "0" to it, effectively padding it to two digits.
 * If the string's length is not 1 (e.g., it's already two or more digits, or empty),
 * it returns the string unchanged.
 *
 * @param val - The string value to be padded.
 * @returns The padded string (e.g., "5" becomes "05"), or the original string if its length is not 1.
 *
 * @example
 * // Returns "05"
 * pad("5");
 *
 * @example
 * // Returns "12"
 * pad("12");
 *
 * @example
 * // Returns ""
 * pad("");
 */
export function pad(val: string): string { return val.length === 1 ? `0${val}` : val; }

/**
 * Checks if an object has a specific property as its own property (not inherited).
 *
 * This function uses the modern and safer `Object.hasOwn()` if available in the runtime
 * environment to prevent prototype pollution attacks and ensure reliable checks.
 * If `Object.hasOwn()` is not supported, it falls back to the secure
 * `Object.prototype.hasOwnProperty.call()` method.
 *
 * @param obj The object to check for the property.
 * @param prop The name or Symbol of the property to test.
 * @returns {boolean} True if the object has the specified property as its own property, false otherwise.
 * 
 * @example
 * const runHasPropertyExample = () => {
    console.log("--- Running hasProperty Example ---");

    const settings = {
        theme: 'dark',
        cache: true,
        // The object does not have the 'toString' method as its own property
    };

    // 1. Check for an existing own property
    console.log(`Has 'theme' property? ${hasProperty(settings, 'theme')}`); // Expected: true

    // 2. Check for a non-existent property
    console.log(`Has 'language' property? ${hasProperty(settings, 'language')}`); // Expected: false

    // 3. Check for an inherited property (should return false)
    // The hasProperty function ensures we only check *own* properties.
    console.log(`Has 'toString' inherited property? ${hasProperty(settings, 'toString')}`); // Expected: false

    // 4. Test with a potentially "polluted" object (demonstrates reliability)
    const polluted = {
        value: 10,
        hasOwnProperty: () => false // Overriding the built-in method
    };

    // Using the secure method ensures the check is correct despite pollution
    console.log(`Has 'value' property (polluted test)? ${hasProperty(polluted, 'value')}`); // Expected: true (Correctly identifies 'value')
    console.log("-------------------------------------");
};

runHasPropertyExample();
 */
export const hasProperty = (obj: object, prop: string | number | symbol): boolean => {
    // Check for modern support (The future standard)
    if (typeof Object.hasOwn === 'function') {
        return Object.hasOwn(obj, prop);
    }

    // Fallback for older environments (The secure method)
    return Object.prototype.hasOwnProperty.call(obj, prop);
};