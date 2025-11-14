/**
 * Meta Content Utility Module
 * Provides utilities for retrieving meta tag content from the DOM.
 * Uses jQuery for broad browser compatibility (IE8+).
 * 
 * @module MetaContentUtility
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package https://github.com/Agbokoudjo/
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * @version 1.0.0
 */
import { validateJQueryAvailability,JQueryElement } from "./jQueryExtension";

/**
 * Options for getMetaContent function
 */
export interface GetMetaContentOptions {
    /** Whether to trim whitespace from the content (default: true) */
    trim?: boolean;
    /** Whether to throw error if content is empty (default: true) */
    throwOnEmpty?: boolean;
    /** Default value to return if meta tag not found (instead of throwing) */
    defaultValue?: string;
}

/**
 * Result object for getMetaContentSafe function
 */
interface MetaContentResult {
    /** Whether the operation was successful */
    success: boolean;
    /** The content value if found */
    content?: string;
    /** Error message if operation failed */
    error?: string;
}

/**
 * Custom error for DOM-related issues
 */
export class MetaTagNotFoundError extends Error {
    public readonly metaName: string;

    constructor(metaName: string, message?: string) {
        super(message || `The <meta name="${metaName}"> tag does not exist in the DOM.`);
        this.name = 'MetaTagNotFoundError';
        this.metaName = metaName;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MetaTagNotFoundError);
        }
    }
}

/**
 * Custom error for empty content
 */
export class EmptyContentError extends Error {
    public readonly metaName: string;

    constructor(metaName: string, message?: string) {
        super(message || `The "content" attribute is missing or empty for <meta name="${metaName}">.`);
        this.name = 'EmptyContentError';
        this.metaName = metaName;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EmptyContentError);
        }
    }
}

/**
 * Validates that the meta name parameter is valid
 * 
 * @param name - The meta tag name to validate
 * @throws {TypeError} If name is not a valid string
 * @private 
 */
function validateMetaName(name: string): void {
    if (typeof name !== 'string') {
        throw new TypeError(`Meta name must be a string, received: ${typeof name}`);
    }

    if (name.trim() === '') {
        throw new TypeError('Meta name cannot be an empty string');
    }
}

/**
 * Retrieves the content of the 'content' attribute of a <meta> tag by its name.
 * 
 * This function uses jQuery for maximum browser compatibility (IE8+).
 * It provides strict validation and clear error messages.
 * 
 * @param name - The name of the <meta> tag (e.g., "sonata-translations")
 * @param options - Optional configuration object
 * @returns The value of the 'content' attribute
 * 
 * @throws {TypeError} If the name parameter is invalid
 * @throws {JQueryNotAvailableError} If jQuery is not available globally
 * @throws {MetaTagNotFoundError} If the <meta> tag does not exist in the DOM
 * @throws {EmptyContentError} If the 'content' attribute is empty and throwOnEmpty is true
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const translations = getMetaContent('sonata-translations');
 * 
 * // With options
 * const config = getMetaContent('app-config', {
 *     trim: true,
 *     throwOnEmpty: false
 * });
 * 
 * // With default value
 * const theme = getMetaContent('theme', {
 *     defaultValue: 'light'
 * });
 * ```
 * 
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package https://github.com/Agbokoudjo/
 */
export function getMetaContent(
    name: string,
    options: GetMetaContentOptions = {}
): string {
    // Set default options
    const {
        trim = true,
        throwOnEmpty = true,
        defaultValue
    } = options;

    // Validation Phase
    validateMetaName(name);
    validateJQueryAvailability();

    // DOM Query Phase
    const $element: JQueryElement = window.jQuery!(`meta[name="${name}"]`);

    if ($element.length === 0) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new MetaTagNotFoundError(name);
    }

    // Content Extraction Phase
    const rawContent: string | undefined = $element.attr('content');

    if (rawContent === undefined || rawContent === null) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new EmptyContentError(name, `The "content" attribute does not exist for <meta name="${name}">.`);
    }

    // Content Processing Phase
    const processedContent: string = trim ? rawContent.trim() : rawContent;

    if (throwOnEmpty && processedContent === '') {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new EmptyContentError(name);
    }

    return processedContent;
}

/**
 * Safe version of getMetaContent that returns a result object instead of throwing
 * 
 * @param name - The name of the <meta> tag
 * @param options - Optional configuration object
 * @returns Result object with success status, content, and potential error message
 * 
 * @example
 * ```typescript
 * const result = getMetaContentSafe('translations');
 * if (result.success) {
 *     console.log('Content:', result.content);
 * } else {
 *     console.error('Error:', result.error);
 * }
 * ```
 */
export function getMetaContentSafe(
    name: string,
    options: GetMetaContentOptions = {}
): MetaContentResult {
    try {
        const content = getMetaContent(name, options);
        return {
            success: true,
            content
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

/**
 * Checks if a meta tag exists in the DOM
 * 
 * @param name - The name of the <meta> tag to check
 * @returns True if the meta tag exists, false otherwise
 * 
 * @example
 * ```typescript
 * if (hasMetaTag('translations')) {
 *     const content = getMetaContent('translations');
 * }
 * ```
 */
export function hasMetaTag(name: string): boolean {
    try {
        validateMetaName(name);
        validateJQueryAvailability();

        const $element: JQueryElement = window.jQuery!(`meta[name="${name}"]`);
        return $element.length > 0;
    } catch {
        return false;
    }
}

/**
 * Retrieves multiple meta tag contents at once
 * 
 * @param names - Array of meta tag names to retrieve
 * @param options - Optional configuration object
 * @returns Object mapping meta tag names to their content values
 * 
 * @example
 * ```typescript
 * const metas = getMultipleMetaContents([
 *     'translations',
 *     'app-config',
 *     'csrf-token'
 * ]);
 * 
 * console.log(metas.translations);
 * console.log(metas['app-config']);
 * ```
 */
export function getMultipleMetaContents(
    names: string[],
    options: GetMetaContentOptions = {}
): Record<string, string | null> {
    if (!Array.isArray(names)) {
        throw new TypeError('Names parameter must be an array of strings');
    }

    const result: Record<string, string | null> = {};

    for (const name of names) {
        try {
            result[name] = getMetaContent(name, options);
        } catch {
            result[name] = null;
        }
    }

    return result;
}


/**
 * Retrieves meta content and parses it as JSON
 * 
 * @param name - The name of the <meta> tag
 * @param options - Optional configuration object
 * @returns Parsed JSON object
 * 
 * @throws {SyntaxError} If the content is not valid JSON
 * 
 * @example
 * ```typescript
 * // <meta name="app-config" content='{"theme":"dark","lang":"en"}'>
 * const config = getMetaContentAsJSON<{theme: string, lang: string}>('app-config');
 * console.log(config.theme); // "dark"
 * ```
 */
export function getMetaContentAsJSON<T = unknown>(
    name: string,
    options: GetMetaContentOptions = {}
): T {
    const content = getMetaContent(name, options);

    try {
        return JSON.parse(content) as T;
    } catch (error) {
        throw new SyntaxError(
            `Failed to parse content of <meta name="${name}"> as JSON: ${error instanceof Error ? error.message : String(error)
            }`
        );
    }
}


/**
 * Retrieves meta content as a number
 * 
 * @param name - The name of the <meta> tag
 * @param options - Optional configuration object
 * @returns Parsed number value
 * 
 * @throws {TypeError} If the content cannot be parsed as a number
 * 
 * @example
 * ```typescript
 * // <meta name="max-items" content="100">
 * const maxItems = getMetaContentAsNumber('max-items');
 * console.log(maxItems); // 100
 * ```
 */
export function getMetaContentAsNumber(
    name: string,
    options: GetMetaContentOptions = {}
): number {
    const content = getMetaContent(name, options);
    const num = Number(content);

    if (isNaN(num)) {
        throw new TypeError(
            `Content of <meta name="${name}"> cannot be parsed as a number: "${content}"`
        );
    }

    return num;
}

/**
 * Retrieves meta content as a boolean
 * 
 * @param name - The name of the <meta> tag
 * @param options - Optional configuration object
 * @returns Boolean value (true for "true", "1", "yes"; false otherwise)
 * 
 * @example
 * ```typescript
 * // <meta name="debug-mode" content="true">
 * const debugMode = getMetaContentAsBoolean('debug-mode');
 * console.log(debugMode); // true
 * ```
 */
export function getMetaContentAsBoolean(
    name: string,
    options: GetMetaContentOptions = {}
): boolean {
    const content = getMetaContent(name, options).toLowerCase();
    return content === 'true' || content === '1' || content === 'yes';
}

/**
     * Detects the current language from the document
     * @private
     */
export function detectLanguageFromDom(defaultLanguage:string="en"): string {
    // Try document.documentElement.lang
    const docLang = document.documentElement.lang;
    if (docLang) {
        return docLang.split('-')[0].toLowerCase();
    }

    // Try navigator.language
    const navLang = navigator.language;
    if (navLang) {
        return navLang.split('-')[0].toLowerCase();
    }

    // Use default
    return defaultLanguage;
}

export default {
    getMetaContent,
    getMetaContentSafe,
    hasMetaTag,
    getMultipleMetaContents,
    getMetaContentAsJSON,
    getMetaContentAsNumber,
    getMetaContentAsBoolean,
    MetaTagNotFoundError,
    EmptyContentError,
    detectLanguageFromDom
};


