/**
 * Checks whether the provided object is a regular expression.
 * @param obj - The value to check.
 * @returns True if the object is a RegExp, false otherwise.
 */
export function isRegExp(obj: unknown): obj is RegExp {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
}
export const letterRegex = /^\p{L}$/u;       // Lettre (majuscule ou minuscule) de n'importe quelle langue
export const upperRegex = /^\p{Lu}$/u;      // Majuscule de n'importe quelle langue
export const lowerRegex = /^\p{Ll}$/u;      // Minuscule de n'importe quelle langue
export const numberRegex = /^\p{N}$/u;       // Tout chiffre (0-9 ou autre chiffre d'autres systèmes)
export const symbolRegex = /^\p{S}$/u;
export const punctuationRegex = /^\p{P}$/u;
export const regex = /^[\p{L}\p{S}\p{N}]+$/u; // L: letters, S: symbols, N: numbers
export const passwordCharRegex = /^[\p{L}\p{N}\p{S}\p{P}]+$/u; // L = letters, N = numbers, S = symbols, P = punctuation
export const strongPasswordWithUpperRegex = /^(?=.*\p{Lu})(?=.*\p{Ll})(?=.*\p{N})(?=.*[\p{S}\p{P}]).{8,}$/u;
export const secureUnicodePasswordRegex = /^(?=.*\p{L})(?=.*\p{N})(?=.*[\p{S}\p{P}]).{8,}$/u;
// regex
export const REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/
export const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
export const REGEX_FORMAT_DATE = /(^(y{4}|y{2})[.\/-](m{1,2})[.\/-](d{1,2})$)|(^(m{1,2})[.\/-](d{1,2})[.\/-]((y{4}|y{2})$))|(^(d{1,2})[.\/-](m{1,2})[.\/-]((y{4}|y{2})$))/gi;
