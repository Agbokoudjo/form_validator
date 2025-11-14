/**
 * Translation Cache System
 * 
 * Professional caching system for managing translation messages with support for
 * multiple storage adapters (localStorage, IndexedDB/Dexie, custom implementations).
 * 
 * Designed for frameworks like Symfony Sonata Admin where translations are embedded
 * in meta tags and need efficient client-side caching.
 * 
 * @module TranslationCache
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @company INTERNATIONALES WEB APPS & SERVICES
 * @phone +229 0167 25 18 86
 * @linkedin https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * @package https://github.com/Agbokoudjo/form_validator
 * @version 1.0.0
 * @license MIT
 */

import { CacheItemInterface } from "../Cache";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Translation messages structure
 * Maps translation keys to their localized strings
 * 
 * @example
 * ```typescript
 * const messages: TranslationMessages = {
 *     'LABEL_BTN_CONFIRM': 'Confirm',
 *     'LABEL_BTN_CANCEL': 'Cancel',
 *     'ACTION_PENDING_TITLE': 'Processing...'
 * };
 * ```
 */
export type TranslationMessages = Record<string, string>;

/**
 * Language-specific translation structure
 * Maps language codes to their translation messages
 * 
 * @example
 * ```typescript
 * const translations: LanguageTranslations = {
 *     en: {
 *         'AbortError': 'Request timed out',
 *         'TypeError': 'Network error'
 *     },
 *     fr: {
 *         'AbortError': 'La requête a expiré',
 *         'TypeError': 'Erreur réseau'
 *     }
 * };
 * ```
 */
export type LanguageTranslations = Record<string, TranslationMessages>;

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Cache Translation Interface
 * 
 * Extends the base CacheItemInterface to provide specialized methods for
 * storing and retrieving translation messages. Implementations must handle
 * async operations and error recovery gracefully.
 * 
 * @interface CacheTranslationInterface
 * @extends {CacheItemInterface}
 * 
 * @example
 * ```typescript
 * class CustomCache implements CacheTranslationInterface {
 *     async getItem(key: string): Promise<TranslationMessages | null> {
 *         // Custom implementation
 *     }
 *     
 *     async setItem(key: string, messages: TranslationMessages): Promise<void> {
 *         // Custom implementation
 *     }
 * }
 * ```
 */
export interface CacheTranslationInterface extends CacheItemInterface {
    /**
     * Retrieves translation messages for a specific key (usually language code)
     * 
     * @param key - The cache key, typically a language code (e.g., 'en', 'fr', 'es')
     * @returns Promise resolving to translation messages object or null if not found
     * 
     * @throws Should not throw - implementations must handle errors internally
     * 
     * @example
     * ```typescript
     * const messages = await cache.getItem('en');
     * if (messages) {
     *     console.log(messages['LABEL_BTN_CONFIRM']); // "Confirm"
     * }
     * ```
     */
    getItem(key: string): Promise<TranslationMessages | null>;

    /**
     * Stores translation messages for a specific key
     * 
     * @param key - The cache key, typically a language code (e.g., 'en', 'fr', 'es')
     * @param messages - Translation messages object to store
     * @returns Promise that resolves when storage is complete
     * 
     * @throws Should not throw - implementations must handle errors internally
     * 
     * @example
     * ```typescript
     * await cache.setItem('en', {
     *     'CONFIRM': 'Confirm',
     *     'CANCEL': 'Cancel'
     * });
     * ```
     */
    setItem(key: string, messages: TranslationMessages): Promise<void>;

    /**
     * Optional: Clear all cached translations
     * 
     * @returns Promise that resolves when cache is cleared
     */
    clear?(): Promise<void>;

    /**
     * Optional: Check if a key exists in cache
     * 
     * @param key - The cache key to check
     * @returns Promise resolving to true if key exists, false otherwise
     */
    has?(key: string): Promise<boolean>;

    /**
     * Optional: Delete a specific cache entry
     * 
     * @param key - The cache key to delete
     * @returns Promise that resolves when deletion is complete
     */
    delete?(key: string): Promise<void>;
}

/**
 * Configuration Interface for Cache Adapter
 * 
 * Provides a standardized way to configure and access cache adapters.
 * Used for dependency injection and adapter swapping at runtime.
 * 
 * @interface ConfigCacheAdapterTranslation
 * 
 * @example
 * ```typescript
 * import { appTranslation } from "@wlindabla/form_validator";
 * 
 * // Configure with localStorage adapter
 * appTranslation.configAdapter = new LocalStorageCacheTranslationAdapter();
 * 
 * // Or configure with custom adapter
 * appTranslation.configAdapter = new DexieCacheAdapter();
 * ```
 */
export interface ConfigCacheAdapterTranslation {
    /**
     * Gets the configured cache adapter instance
     * 
     * @returns The cache adapter implementation
     */
    get configAdapter(): CacheTranslationInterface;

    /**
     * Sets the cache adapter instance
     * 
     * @param adapter - The cache adapter to use
     */
    set configAdapter(adapter: CacheTranslationInterface);
}

// ============================================================================
// DEFAULT IMPLEMENTATION: LOCALSTORAGE ADAPTER
// ============================================================================

/**
 * LocalStorage Cache Translation Adapter
 * 
 * Default implementation using browser's localStorage for translation caching.
 * Provides synchronous-like API with async interface for consistency with
 * other storage adapters (IndexedDB, etc.).
 * 
 * **Features:**
 * - ✅ Simple and fast (synchronous storage)
 * - ✅ No dependencies required
 * - ✅ Works in all modern browsers
 * - ✅ Automatic error handling
 * - ⚠️ Limited storage capacity (~5-10MB)
 * - ⚠️ Synchronous operations (can block UI on large data)
 * 
 * **Storage Format:**
 * ```json
 * {
 *   "en": "{\"CONFIRM\":\"Confirm\",\"CANCEL\":\"Cancel\"}",
 *   "fr": "{\"CONFIRM\":\"Confirmer\",\"CANCEL\":\"Annuler\"}"
 * }
 * ```
 * 
 * @class LocalStorageCacheTranslationAdapter
 * @implements {CacheTranslationInterface}
 * 
 * @example
 * ```typescript
 * const cache = new LocalStorageCacheTranslationAdapter();
 * 
 * // Store translations
 * await cache.setItem('en', {
 *     'CONFIRM': 'Confirm',
 *     'CANCEL': 'Cancel'
 * });
 * 
 * // Retrieve translations
 * const messages = await cache.getItem('en');
 * console.log(messages?.CONFIRM); // "Confirm"
 * ```
 * 
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 */
export class LocalStorageCacheTranslationAdapter implements CacheTranslationInterface {
    /**
     * Storage key prefix to avoid collisions
     * @private
     */
    private readonly storagePrefix = 'translation_cache_';

    /**
     * Maximum storage size in bytes (5MB by default)
     * @private
     */
    private readonly maxStorageSize = 5 * 1024 * 1024; // 5MB

    /**
     * Retrieves translation messages from localStorage
     * 
     * Gracefully handles errors and returns null if:
     * - Key doesn't exist
     * - localStorage is unavailable
     * - JSON parsing fails
     * - Storage quota exceeded
     * 
     * @param key - Language code or cache key
     * @returns Promise resolving to translation messages or null
     * 
     * @example
     * ```typescript
     * const adapter = new LocalStorageCacheTranslationAdapter();
     * 
     * // Retrieve English translations
     * const enMessages = await adapter.getItem('en');
     * if (enMessages) {
     *     console.log('Translations loaded:', Object.keys(enMessages).length);
     * } else {
     *     console.log('No cached translations found');
     * }
     * ```
     */
    public async getItem(key: string): Promise<TranslationMessages | null> {
        
        return new Promise((resolve) => {
            try {
                this.validateKey(key);

                const fullKey = this.getFullKey(key);
                const messages = this.readFromStorage(fullKey);

                if (messages) {
                    this.logDebug(`Cache hit for key: ${key}`, messages);
                } else {
                    this.logDebug(`Cache miss for key: ${key}`);
                }

                resolve(messages);
            } catch (error) {
                this.logError('Error reading from cache', error, { key });
                resolve(null);
            }
        });
    }

    /**
     * Stores translation messages in localStorage
     * 
     * Automatically handles:
     * - JSON serialization
     * - Storage quota errors
     * - localStorage unavailability
     * - Invalid data
     * 
     * @param key - Language code or cache key
     * @param messages - Translation messages to store
     * @returns Promise that resolves when storage is complete
     * 
     * @example
     * ```typescript
     * const adapter = new LocalStorageCacheTranslationAdapter();
     * 
     * await adapter.setItem('fr', {
     *     'CONFIRM': 'Confirmer',
     *     'CANCEL': 'Annuler',
     *     'SAVE': 'Enregistrer'
     * });
     * 
     * console.log('French translations cached successfully');
     * ```
     */
    public async setItem(key: string, messages: TranslationMessages): Promise<void> {
        return new Promise((resolve) => {
            try {
                this.validateKey(key);
                this.validateMessages(messages);

                const fullKey = this.getFullKey(key);
                const serialized = JSON.stringify(messages);

                // Check storage size before writing
                if (this.willExceedQuota(serialized)) {
                    this.logWarning('Storage quota would be exceeded, clearing old entries');
                    this.clearOldEntries();
                }

                this.writeToStorage(fullKey, serialized);
                this.logDebug(`Cache updated for key: ${key}`, messages);

                resolve();
            } catch (error) {
                this.logError('Error writing to cache', error, { key, messagesCount: Object.keys(messages).length });
                resolve(); // Don't throw - cache failures shouldn't break the app
            }
        });
    }

    /**
     * Clears all translation cache entries
     * 
     * Only removes keys with the translation cache prefix,
     * preserving other localStorage data.
     * 
     * @returns Promise that resolves when cache is cleared
     * 
     * @example
     * ```typescript
     * const adapter = new LocalStorageCacheTranslationAdapter();
     * await adapter.clear();
     * console.log('Translation cache cleared');
     * ```
     */
    public async clear(): Promise<void> {
        return new Promise((resolve) => {
            try {
                const keysToRemove: string[] = [];

                // Find all translation cache keys
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(this.storagePrefix)) {
                        keysToRemove.push(key);
                    }
                }

                // Remove them
                keysToRemove.forEach(key => localStorage.removeItem(key));

                this.logDebug(`Cleared ${keysToRemove.length} cache entries`);
                resolve();
            } catch (error) {
                this.logError('Error clearing cache', error);
                resolve();
            }
        });
    }

    /**
     * Checks if a cache key exists
     * 
     * @param key - Language code or cache key
     * @returns Promise resolving to true if key exists
     * 
     * @example
     * ```typescript
     * if (await adapter.has('en')) {
     *     console.log('English translations are cached');
     * }
     * ```
     */
    public async has(key: string): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const fullKey = this.getFullKey(key);
                const exists = localStorage.getItem(fullKey) !== null;
                resolve(exists);
            } catch (error) {
                this.logError('Error checking cache existence', error, { key });
                resolve(false);
            }
        });
    }

    /**
     * Deletes a specific cache entry
     * 
     * @param key - Language code or cache key
     * @returns Promise that resolves when deletion is complete
     * 
     * @example
     * ```typescript
     * await adapter.delete('en');
     * console.log('English translations removed from cache');
     * ```
     */
    public async delete(key: string): Promise<void> {
        return new Promise((resolve) => {
            try {
                const fullKey = this.getFullKey(key);
                localStorage.removeItem(fullKey);
                this.logDebug(`Deleted cache entry: ${key}`);
                resolve();
            } catch (error) {
                this.logError('Error deleting cache entry', error, { key });
                resolve();
            }
        });
    }

    // ========================================================================
    // PRIVATE HELPER METHODS
    // ========================================================================

    /**
     * Gets the full storage key with prefix
     * @private
     */
    private getFullKey(key: string): string {
        return `${this.storagePrefix}${key}`;
    }

    /**
     * Validates cache key
     * @private
     */
    private validateKey(key: string): void {
        if (!key || typeof key !== 'string') {
            throw new TypeError('Cache key must be a non-empty string');
        }

        if (key.trim() === '') {
            throw new TypeError('Cache key cannot be empty or whitespace only');
        }
    }

    /**
     * Validates translation messages object
     * @private
     */
    private validateMessages(messages: TranslationMessages): void {
        if (!messages || typeof messages !== 'object') {
            throw new TypeError('Messages must be an object');
        }

        if (Array.isArray(messages)) {
            throw new TypeError('Messages cannot be an array');
        }

        // Validate all values are strings
        for (const [key, value] of Object.entries(messages)) {
            if (typeof value !== 'string') {
                throw new TypeError(`Message value for key "${key}" must be a string, got ${typeof value}`);
            }
        }
    }

    /**
     * Reads and parses data from localStorage
     * @private
     */
    private readFromStorage(key: string): TranslationMessages | null {
        try {
            const item = localStorage.getItem(key);
            if (!item) {
                return null;
            }

            const parsed = JSON.parse(item);
            return parsed;
        } catch (error) {
            this.logError(`Failed to parse cached data for key: ${key}`, error);
            // Remove corrupted data
            localStorage.removeItem(key);
            return null;
        }
    }

    /**
     * Serializes and writes data to localStorage
     * @private
     */
    private writeToStorage(key: string, serializedData: string): void {
        try {
            localStorage.setItem(key, serializedData);
        } catch (error) {
            if (this.isQuotaExceededError(error)) {
                this.logWarning('Storage quota exceeded, clearing cache and retrying');
                this.clearOldEntries();

                try {
                    localStorage.setItem(key, serializedData);
                } catch (retryError) {
                    this.logError('Failed to write to storage even after clearing', retryError);
                    throw retryError;
                }
            } else {
                throw error;
            }
        }
    }

    /**
     * Checks if error is a quota exceeded error
     * @private
     */
    private isQuotaExceededError(error: unknown): boolean {
        return error instanceof DOMException && (
            error.name === 'QuotaExceededError' ||
            error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        );
    }

    /**
     * Estimates if writing data would exceed quota
     * @private
     */
    private willExceedQuota(data: string): boolean {
        const dataSize = new Blob([data]).size;
        const currentSize = this.estimateStorageSize();
        return (currentSize + dataSize) > this.maxStorageSize;
    }

    /**
     * Estimates current localStorage usage
     * @private
     */
    private estimateStorageSize(): number {
        let totalSize = 0;
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const value = localStorage.getItem(key);
                    if (value) {
                        totalSize += new Blob([key + value]).size;
                    }
                }
            }
        } catch (error) {
            this.logError('Error estimating storage size', error);
        }
        return totalSize;
    }

    /**
     * Clears old cache entries to free up space
     * @private
     */
    private clearOldEntries(): void {
        try {
            const keysToRemove: string[] = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix)) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));
            this.logDebug(`Cleared ${keysToRemove.length} old entries`);
        } catch (error) {
            this.logError('Error clearing old entries', error);
        }
    }

    /**
     * Debug logging (can be disabled in production)
     * @private
     */
    private logDebug(message: string, data?: unknown): void {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[TranslationCache] ${message}`, data || '');
        }
    }

    /**
     * Warning logging
     * @private
     */
    private logWarning(message: string, data?: unknown): void {
        console.warn(`[TranslationCache] ${message}`, data || '');
    }

    /**
     * Error logging
     * @private
     */
    private logError(message: string, error: unknown, context?: Record<string, unknown>): void {
        console.error(`[TranslationCache] ${message}`, {
            error: error instanceof Error ? error.message : String(error),
            context
        });
    }
}
