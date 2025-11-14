/**
 * Application Translation Manager
 * 
 * Enterprise-grade translation management system with caching support.
 * Designed for Symfony Sonata Admin and modern web applications.
 * 
 * Features:
 * - Multi-language support with automatic detection
 * - Intelligent caching with configurable adapters
 * - Meta tag integration for server-side translations
 * - Fallback mechanism for missing translations
 * - Memory-efficient lazy loading
 * 
 * @module AppTranslation
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @company INTERNATIONALES WEB APPS & SERVICES
 * @phone +229 0167 25 18 86
 * @linkedin https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * @package https://github.com/Agbokoudjo/
 * @version 2.0.0
 * @license MIT
 */


import {
    ConfigCacheAdapterTranslation,
    CacheTranslationInterface,
    LocalStorageCacheTranslationAdapter,
    TranslationMessages
} from "./TranslationCache";

import {
    detectLanguageFromDom,
    getMetaContentAsJSON,
    hasProperty
} from "../_Utils";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Translation configuration options
 */
export interface TranslationConfig {
    /** Default meta tag name for translations */
    defaultMetaName?: string;
    /** Default language code */
    defaultLanguage?: string;
    /** Cache adapter instance */
    cacheAdapter?: CacheTranslationInterface;
    /** Enable debug logging */
    debug?: boolean;
    /** Fallback translations for critical keys */
    fallbackTranslations?: TranslationMessages;
}

/**
 * Translation parameters for interpolation
 * 
 * @example
 * { name: "John", count: 5 }
 */
export type TranslationParams = Record<string, string | number>;


/**
 * Translation result with metadata
 */
export interface TranslationResult {
    /** The translated text */
    text: string;
    /** Language code used */
    language: string;
    /** Whether it came from cache */
    fromCache: boolean;
    /** Whether it's a fallback */
    isFallback: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<TranslationConfig> = {
    defaultMetaName: 'app-translations',
    defaultLanguage: 'en',
    cacheAdapter: new LocalStorageCacheTranslationAdapter(),
    debug: false,
    fallbackTranslations: {}
};

/**
 * Cache key prefix for translation storage
 */
const CACHE_KEY_PREFIX = 'app_translation_';

// ============================================================================
// MAIN CLASS
// ============================================================================


/**
 * AppTranslation
 * 
 * Main translation manager class that handles loading, caching, and retrieving
 * translations from meta tags or API endpoints.
 * @example 
 * **Usage Example:**
 * ```html
 * // HTML Setup (Symfony Twig):
 * // <meta name="app-translations" 
 * //       content='{{ {
 * //           CONFIRM_EXIT: "confirm_exit"|trans({}, "SonataAdminBundle"),
 * //           LABEL_BTN_CONFIRM: "label_btn_confirm"|trans({}, "SonataAdminBundle")
 * //       }|json_encode()|e("html_attr")}}'>
 * ```
 * // JavaScript/TypeScript Usage:
 * ```typescript
 * import { appTranslation } from '@wlindabla/form_validator';
 * 
 * // Basic translation
 * const confirmText = await appTranslation.trans('LABEL_BTN_CONFIRM');
 * console.log(confirmText); // "Confirm"
 * 
 * // With custom meta tag name
 * const text = await appTranslation.trans('MY_KEY', 'custom-translations');
 * 
 * // With parameters
 * const greeting = await appTranslation.trans('HELLO_USER', 'app-translations', {
 *     name: 'John'
 * });
 * ```
 * 
 * @class AppTranslation
 * @implements {ConfigCacheAdapterTranslation}
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package @wlindabla/form_validator
 */
export class AppTranslation implements ConfigCacheAdapterTranslation {
    /**
     * Cache adapter for storing translations
     * @private
     */
    private adapter: CacheTranslationInterface;

    /**
     * Current application language
     * @private
     */
    private readonly currentLanguage: string;

    /**
     * Loaded translation messages cache
     * @private
     */
    private messagesCache: Map<string, TranslationMessages>;

    /**
     * Configuration options
     * @private
     */
    private readonly config: Required<TranslationConfig>;

    /**
     * Flag to track initialization status
     * @private
     */
    private isInitialized: boolean;

    /**
     * Creates a new AppTranslation instance
     * 
     * @param config - Optional configuration object
     * 
     * @example
     * ```typescript
     * // With default configuration
     * const translation = new AppTranslation();
     * 
     * // With custom configuration
     * const translation = new AppTranslation({
     *     defaultLanguage: 'fr',
     *     debug: true,
     *     cacheAdapter: new CustomCacheAdapter()
     * });
     * ```
     */
    constructor(config: TranslationConfig = {}) {
        // Merge config with defaults
        this.config = {
            ...DEFAULT_CONFIG,
            ...config
        };

        // Set adapter
        this.adapter = config.cacheAdapter || new LocalStorageCacheTranslationAdapter();

        // Detect current language from document or use default
        this.currentLanguage = this.detectLanguage();

        // Initialize messages cache
        this.messagesCache = new Map<string, TranslationMessages>();

        // Track initialization
        this.isInitialized = false;

        this.logDebug('AppTranslation initialized', {
            language: this.currentLanguage,
            adapter: this.adapter.constructor.name
        });
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    /**
     * Retrieves a translated string for the given key
     * 
     * Automatically loads translations from cache or meta tag on first use.
     * Supports parameter interpolation for dynamic translations.
     * 
     * @param key - The translation key to look up
     * @param metaName - Optional meta tag name (default: 'app-translations')
     * @param params - Optional parameters for interpolation
     * @returns Promise resolving to the translated text
     * 
     * @throws {TranslationKeyNotFoundError} If the key doesn't exist and no fallback available
     * @throws {TranslationLoadError} If translations cannot be loaded
     * 
     * @example
     * ```typescript
     * // Simple translation
     * const text = await appTranslation.trans('LABEL_BTN_CONFIRM');
     * 
     * // With custom meta tag
     * const text = await appTranslation.trans('KEY', 'custom-meta');
     * 
     * // With parameters
     * const text = await appTranslation.trans('HELLO_USER', 'app-translations', {
     *     name: 'John',
     *     age: 25
     * });
     * // Returns: "Hello John, you are 25 years old"
     * ```
     */
    public async trans(
        key: string,
        metaName?: string,
        params?: TranslationParams
    ): Promise<string> {
        // Validate input
        this.validateTranslationKey(key);

        const finalMetaName = metaName || this.config.defaultMetaName;

        try {
            // Ensure translations are loaded
            await this.ensureTranslationsLoaded(finalMetaName);

            // Get translation
            const translation = this.getTranslation(key, finalMetaName);

            // Apply parameter interpolation if needed
            const finalTranslation = params
                ? this.interpolateParams(translation, params)
                : translation;

            this.logDebug(`Translation retrieved for key: ${key}`, {
                value: finalTranslation,
                hasParams: !!params
            });

            return finalTranslation;

        } catch (error) {
            this.logError('Translation retrieval failed', error, { key, metaName: finalMetaName });

            // Try fallback
            const fallback = this.getFallbackTranslation(key);
            if (fallback) {
                this.logDebug(`Using fallback for key: ${key}`, { fallback });
                return fallback;
            }

            throw new TranslationKeyNotFoundError(key, finalMetaName);
        }
    }

    /**
     * Retrieves translation with detailed metadata
     * 
     * @param key - The translation key
     * @param metaName - Optional meta tag name
     * @param params - Optional parameters
     * @returns Promise resolving to TranslationResult with metadata
     * 
     * @example
     * ```typescript
     * const result = await appTranslation.getTranslationInfo('LABEL_BTN_CONFIRM');
     * console.log(result.text);      // "Confirm"
     * console.log(result.fromCache); // true
     * console.log(result.language);  // "en"
     * ```
     */
    public async getTranslationInfo(
        key: string,
        metaName?: string,
        params?: TranslationParams
    ): Promise<TranslationResult> {
        const finalMetaName = metaName || this.config.defaultMetaName;
        const translations = this.messagesCache.get(finalMetaName);
        const fromCache = translations !== undefined;

        const text = await this.trans(key, metaName, params);
        const isFallback = !translations || !hasProperty(translations, key);

        return {
            text,
            language: this.currentLanguage,
            fromCache,
            isFallback
        };
    }

    /**
     * Checks if a translation key exists
     * 
     * @param key - The translation key to check
     * @param metaName - Optional meta tag name
     * @returns Promise resolving to true if key exists
     * 
     * @example
     * ```typescript
     * if (await appTranslation.has('LABEL_BTN_CONFIRM')) {
     *     console.log('Translation exists');
     * }
     * ```
     */
    public async has(key: string, metaName?: string): Promise<boolean> {
        const finalMetaName = metaName || this.config.defaultMetaName;

        try {
            await this.ensureTranslationsLoaded(finalMetaName);
            const translations = this.messagesCache.get(finalMetaName);
            return translations ? hasProperty(translations, key) : false;
        } catch {
            return false;
        }
    }

    /**
     * Preloads translations for better performance
     * 
     * @param metaName - Optional meta tag name
     * @returns Promise that resolves when translations are loaded
     * 
     * @example
     * ```typescript
     * // Preload at app startup
     * await appTranslation.preload();
     * 
     * // Now translations are instant
     * const text = await appTranslation.trans('LABEL_BTN_CONFIRM'); // Fast!
     * ```
     */
    public async preload(metaName?: string): Promise<void> {
        const finalMetaName = metaName || this.config.defaultMetaName;
        await this.ensureTranslationsLoaded(finalMetaName);
        this.logDebug(`Translations preloaded for: ${finalMetaName}`);
    }

    /**
     * Clears all cached translations
     * 
     * @returns Promise that resolves when cache is cleared
     * 
     * @example
     * ```typescript
     * // Clear cache to force reload
     * await appTranslation.clearCache();
     * ```
     */
    public async clearCache(): Promise<void> {
        try {
            await this.adapter.clear?.();
            this.messagesCache.clear();
            this.isInitialized = false;
            this.logDebug('Translation cache cleared');
        } catch (error) {
            this.logError('Failed to clear cache', error);
            throw new TranslationCacheError('Failed to clear translation cache');
        }
    }

    /**
     * Reloads translations from source (meta tag)
     * 
     * @param metaName - Optional meta tag name
     * @returns Promise that resolves when reload is complete
     * 
     * @example
     * ```typescript
     * // Force reload from meta tag
     * await appTranslation.reload();
     * ```
     */
    public async reload(metaName?: string): Promise<void> {
        const finalMetaName = metaName || this.config.defaultMetaName;
        this.messagesCache.delete(finalMetaName);
        await this.adapter.delete?.(this.getCacheKey(finalMetaName));
        await this.ensureTranslationsLoaded(finalMetaName);
        this.logDebug(`Translations reloaded for: ${finalMetaName}`);
    }

    /**
     * Gets current language code
     * 
     * @returns Current language code
     * 
     * @example
     * ```typescript
     * const lang = appTranslation.getCurrentLanguage();
     * console.log(lang); // "en"
     * ```
     */
    public getCurrentLanguage(): string {
        return this.currentLanguage;
    }

    /**
     * Gets all loaded translation keys
     * 
     * @param metaName - Optional meta tag name
     * @returns Array of translation keys
     * 
     * @example
     * ```typescript
     * const keys = appTranslation.getAvailableKeys();
     * console.log(keys); // ['LABEL_BTN_CONFIRM', 'LABEL_BTN_CANCEL', ...]
     * ```
     */
    public getAvailableKeys(metaName?: string): string[] {
        const finalMetaName = metaName || this.config.defaultMetaName;
        const translations = this.messagesCache.get(finalMetaName);
        return translations ? Object.keys(translations) : [];
    }

    // ========================================================================
    // CACHE ADAPTER CONFIGURATION
    // ========================================================================

    /**
     * Gets the current cache adapter
     * 
     * @returns Current cache adapter instance
     */
    public get configAdapter(): CacheTranslationInterface {
        return this.adapter;
    }

    /**
     * Sets a new cache adapter
     * 
     * @param adapter - New cache adapter to use
     * 
     * @example
     * ```typescript
     * import { appTranslation } from '@wlindabla/form_validator';
     * import { DexieCacheAdapter } from './custom-adapters';
     * 
     * // Switch to IndexedDB adapter
     * appTranslation.configAdapter = new DexieCacheAdapter();
     * ```
     */
    public set configAdapter(adapter: CacheTranslationInterface) {
        if (!adapter) {
            throw new TypeError('Cache adapter cannot be null or undefined');
        }

        this.adapter = adapter;
        this.logDebug('Cache adapter changed', {
            newAdapter: adapter.constructor.name
        });
    }

    // ========================================================================
    // PRIVATE HELPER METHODS
    // ========================================================================

    /**
     * Detects the current language from the document
     * @private
     */
    private detectLanguage(): string {
        return detectLanguageFromDom(this.config.defaultLanguage);
    }

    /**
     * Ensures translations are loaded for a meta tag
     * @private
     */
    private async ensureTranslationsLoaded(metaName: string): Promise<void> {
        // Check if already loaded in memory
        if (this.messagesCache.has(metaName)) {
            return;
        }

        const cacheKey = this.getCacheKey(metaName);

        try {
            // Try to load from cache adapter
            let translations = await this.adapter.getItem(cacheKey);

            if (translations) {
                this.logDebug(`Translations loaded from cache: ${metaName}`);
                this.messagesCache.set(metaName, translations);
                return;
            }

            // Load from meta tag
            translations = this.loadFromMetaTag(metaName);

            // Cache for future use
            await this.adapter.setItem(cacheKey, translations);

            // Store in memory
            this.messagesCache.set(metaName, translations);

            this.logDebug(`Translations loaded from meta tag: ${metaName}`);

        } catch (error) {
            this.logError(`Failed to load translations: ${metaName}`, error);
            throw new TranslationLoadError(metaName, error);
        }
    }

    /**
     * Loads translations from a meta tag
     * @private
     */
    private loadFromMetaTag(metaName: string): TranslationMessages {
        try {
            const translations = getMetaContentAsJSON<TranslationMessages>(metaName);

            if (!translations || typeof translations !== 'object') {
                throw new Error('Invalid translation format');
            }

            return translations;

        } catch (error) {
            this.logError(`Ensure it contains valid JSON: ${metaName}`, error);
            throw new TranslationLoadError(
                metaName,
                `Failed to parse meta tag "${metaName}". Ensure it contains valid JSON.`
            );
        }
    }

    /**
     * Gets a translation for a key
     * @private
     */
    private getTranslation(key: string, metaName: string): string {
        const translations = this.messagesCache.get(metaName);

        if (!translations) {
            throw new TranslationLoadError(metaName, 'Translations not loaded');
        }

        if (!hasProperty(translations, key)) {
            throw new TranslationKeyNotFoundError(key, metaName);
        }

        return translations[key];
    }

    /**
     * Gets fallback translation if available
     * @private
     */
    private getFallbackTranslation(key: string): string | null {
        if (hasProperty(this.config.fallbackTranslations, key)) {
            return this.config.fallbackTranslations[key];
        }
        return null;
    }

    /**
     * Interpolates parameters into translation string
     * @private
     */
    private interpolateParams(text: string, params: TranslationParams): string {
        let result = text;

        for (const [key, value] of Object.entries(params)) {
            const placeholder = `{${key}}`;
            result = result.replace(new RegExp(placeholder, 'g'), String(value));
        }

        return result;
    }

    /**
     * Generates cache key for a meta tag name
     * @private
     */
    private getCacheKey(metaName: string): string {
        return `${CACHE_KEY_PREFIX}${this.currentLanguage}_${metaName}`;
    }

    /**
     * Validates translation key
     * @private
     */
    private validateTranslationKey(key: string): void {
        if (!key || typeof key !== 'string') {
            throw new TypeError('Translation key must be a non-empty string');
        }

        if (key.trim() === '') {
            throw new TypeError('Translation key cannot be empty or whitespace');
        }
    }

    /**
     * Debug logging
     * @private
     */
    private logDebug(message: string, data?: unknown): void {
        if (this.config.debug) {
            console.log(`[AppTranslation] ${message}`, data || '');
        }
    }

    /**
     * Error logging
     * @private
     */
    private logError(message: string, error: unknown, context?: Record<string, unknown>): void {
        console.error(`[AppTranslation] ${message}`, {
            error: error instanceof Error ? error.message : String(error),
            context
        });
    }
}

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

/**
 * Error thrown when a translation key is not found
 */
export class TranslationKeyNotFoundError extends Error {
    public readonly key: string;
    public readonly metaName: string;

    constructor(key: string, metaName: string) {
        super(`Translation key "${key}" not found in meta tag "${metaName}"`);
        this.name = 'TranslationKeyNotFoundError';
        this.key = key;
        this.metaName = metaName;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TranslationKeyNotFoundError);
        }
    }
}

/**
 * Error thrown when translations cannot be loaded
 */
export class TranslationLoadError extends Error {
    public readonly metaName: string;

    constructor(metaName: string, details?: unknown) {
        const message = `Failed to load translations from meta tag "${metaName}"${details ? `: ${details}` : ''
            }`;
        super(message);
        this.name = 'TranslationLoadError';
        this.metaName = metaName;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TranslationLoadError);
        }
    }
}

/**
 * Error thrown for cache-related issues
 */
export class TranslationCacheError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TranslationCacheError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TranslationCacheError);
        }
    }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Global singleton instance for convenient access
 * 
 * @example
 * ```typescript
 * import { appTranslation } from '@wlindabla/form_validator';
 * 
 * const text = await appTranslation.trans('LABEL_BTN_CONFIRM');
 * ```
 */
export const appTranslation = new AppTranslation();

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    AppTranslation,
    appTranslation,
    TranslationKeyNotFoundError,
    TranslationLoadError,
    TranslationCacheError
};