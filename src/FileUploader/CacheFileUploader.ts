/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { CacheItemInterface } from "../Cache";
import { ResumeData } from "./interface";

/**
 * Interface for caching upload resume data.
 * 
 * This interface extends the base cache functionality to specifically
 * handle resume data for file uploads, allowing uploads to be paused
 * and resumed across browser sessions.
 * 
 * @extends CacheItemInterface
 * 
 * @example
 * ```typescript
 * const cache: UploadResumeCacheInterface = new LocalStorageUploadResumeCache();
 * 
 * // Save progress
 * await cache.setItem('video.mp4', {
 *   uploadedChunks: 45,
 *   totalChunks: 100,
 *   lastBytePosition: 47185920
 * });
 * 
 * // Resume later
 * const data = await cache.getItem('video.mp4');
 * console.log(`Resume from chunk ${data.uploadedChunks}`);
 * ```
 */
interface UploadResumeCacheInterface extends CacheItemInterface {
    /**
     * Retrieves cached resume data for a specific upload.
     * 
     * @param key - Unique identifier for the upload (typically filename or file hash)
     * @returns Promise resolving to the cached resume data
     * @throws {Error} If the key doesn't exist or data is corrupted
     */
    getItem(key: string): Promise<ResumeData>;

    /**
     * Stores resume data for an upload session.
     * 
     * @param key - Unique identifier for the upload
     * @param data - Resume data containing upload progress information
     * @returns Promise that resolves when data is successfully cached
     * @throws {Error} If storage quota is exceeded or data is invalid
     */
    setItem(key: string, data: ResumeData): Promise<void>;
}


/**
 * Custom error for upload cache operations.
 * 
 * @example
 * ```typescript
 * throw new UploadCacheError('Resume data not found', 'NOT_FOUND');
 * ```
 */
class UploadCacheError extends Error {
    constructor(
        message: string,
        public readonly code: string
    ) {
        super(message);
        this.name = 'UploadCacheError';
    }
}

/**
 * Default adapter for caching resume data during file uploads.
 * 
 * Implements an in-memory storage strategy with secure serialization,
 * strict data validation, and comprehensive error handling.
 * 
 * This implementation serves as a foundation for specialized adapters
 * (localStorage, IndexedDB, sessionStorage, etc.).
 * 
 * @implements {UploadResumeCacheInterface}
 * 
 * @example
 * ```typescript
 * const adapter = new DefaultUploadResumeCacheAdapter();
 * 
 * // Save resume data
 * await adapter.setItem('upload-123', {
 *   fileId: 'file-abc',
 *   fileName: 'document.pdf',
 *   fileSize: 5242880,
 *   uploadedChunks: 12,
 *   lastChunkIndex: 11,
 *   lastBytePosition: 1258291,
 *   chunkSize: 1048576
 * });
 * 
 * // Retrieve and resume
 * const resumeData = await adapter.getItem('upload-123');
 * console.log(`Resume from chunk ${resumeData.uploadedChunks}`);
 * 
 * // Remove specific item
 * await adapter.removeItem('upload-123');
 * 
 * // Clear all cache
 * await adapter.clear();
 * ```
 */
export class DefaultUploadResumeCacheAdapter implements UploadResumeCacheInterface {

    private cache: Map<string, ResumeData> = new Map();
    private readonly maxCacheSize: number = 100;

    constructor() {
        this.validateEnvironment();
    }

    /**
     * Validates that the runtime environment is appropriate.
     * 
     * @private
     * @throws {UploadCacheError} If the environment is incompatible
     */
    private validateEnvironment(): void {
        if (typeof window === 'undefined') {
            console.warn(
                '[UploadResumeCacheAdapter] Server-side execution detected. ' +
                'Consider a server-compatible adapter for persistent storage.'
            );
        }
    }

    /**
     * Validates resume data according to strict criteria.
     * 
     * @private
     * @param data - The data to validate
     * @throws {UploadCacheError} If the data is invalid
     */
    private validateResumeData(data: ResumeData): void {
        if (!data || typeof data !== 'object') {
            throw new UploadCacheError(
                'Resume data must be a valid object',
                'INVALID_DATA'
            );
        }

        // Validate required fields
        const requiredFields: (keyof ResumeData)[] = [
            'fileId',
            'fileName',
            'fileSize',
            'uploadedChunks',
            'lastChunkIndex',
            'lastBytePosition',
            'chunkSize'
        ];

        for (const field of requiredFields) {
            if (!(field in data)) {
                throw new UploadCacheError(
                    `Required field '${field}' is missing`,
                    'MISSING_FIELD'
                );
            }
        }

        // Validate types
        if (typeof data.fileId !== 'string' || !data.fileId.trim()) {
            throw new UploadCacheError(
                'fileId must be a non-empty string',
                'INVALID_FILE_ID'
            );
        }

        if (typeof data.fileName !== 'string' || !data.fileName.trim()) {
            throw new UploadCacheError(
                'fileName must be a non-empty string',
                'INVALID_FILE_NAME'
            );
        }

        // Validate numbers
        if (!Number.isFinite(data.fileSize) || data.fileSize <= 0) {
            throw new UploadCacheError(
                'fileSize must be a positive number',
                'INVALID_FILE_SIZE'
            );
        }

        if (!Number.isFinite(data.chunkSize) || data.chunkSize <= 0) {
            throw new UploadCacheError(
                'chunkSize must be a positive number',
                'INVALID_CHUNK_SIZE'
            );
        }

        if (!Number.isInteger(data.uploadedChunks) || data.uploadedChunks < 0) {
            throw new UploadCacheError(
                'uploadedChunks must be a non-negative integer',
                'INVALID_UPLOADED_CHUNKS'
            );
        }

        if (!Number.isInteger(data.lastChunkIndex) || data.lastChunkIndex < -1) {
            throw new UploadCacheError(
                'lastChunkIndex must be an integer >= -1',
                'INVALID_LAST_CHUNK_INDEX'
            );
        }

        if (!Number.isFinite(data.lastBytePosition) || data.lastBytePosition < 0) {
            throw new UploadCacheError(
                'lastBytePosition must be a non-negative number',
                'INVALID_BYTE_POSITION'
            );
        }

        // Validate logical consistency
        if (data.uploadedChunks > 0 && data.lastBytePosition === 0) {
            throw new UploadCacheError(
                'lastBytePosition cannot be 0 if chunks have been uploaded',
                'INCONSISTENT_DATA'
            );
        }

        const expectedMaxChunks = Math.ceil(data.fileSize / data.chunkSize);
        if (data.uploadedChunks > expectedMaxChunks) {
            throw new UploadCacheError(
                `uploadedChunks (${data.uploadedChunks}) exceeds maximum expected (${expectedMaxChunks})`,
                'INCONSISTENT_DATA'
            );
        }
    }

    /**
     * Retrieves resume data for a specific upload.
     * 
     * @param key - Unique identifier for the upload
     * @returns Promise resolved with the resume data
     * @throws {UploadCacheError} If the key does not exist or data is corrupted
     * 
     * @example
     * ```typescript
     * try {
     *   const data = await adapter.getItem('upload-123');
     *   console.log(`${data.uploadedChunks}/${Math.ceil(data.fileSize / data.chunkSize)} chunks`);
     * } catch (error) {
     *   console.error('Failed to retrieve data:', error.message);
     * }
     * ```
     */
    async getItem(key: string): Promise<ResumeData> {
        return new Promise((resolve, reject) => {
            try {
                if (!key || typeof key !== 'string') {
                    reject(new UploadCacheError(
                        'Key must be a non-empty string',
                        'INVALID_KEY'
                    ));
                    return;
                }

                const data = this.cache.get(key);

                if (!data) {
                    reject(new UploadCacheError(
                        `Resume data for key '${key}' was not found`,
                        'NOT_FOUND'
                    ));
                    return;
                }

                // Return a deep copy to prevent external mutations
                resolve(JSON.parse(JSON.stringify(data)));
            } catch (error) {
                reject(new UploadCacheError(
                    `Error retrieving data: ${error instanceof Error ? error.message : String(error)}`,
                    'RETRIEVAL_ERROR'
                ));
            }
        });
    }

    /**
     * Stores resume data for an upload session.
     * 
     * @param key - Unique identifier for the upload
     * @param data - Resume data containing upload progress information
     * @returns Promise resolved when data is successfully cached
     * @throws {UploadCacheError} If quota is exceeded or data is invalid
     * 
     * @example
     * ```typescript
     * try {
     *   await adapter.setItem('upload-123', {
     *     fileId: 'file-abc',
     *     fileName: 'video.mp4',
     *     fileSize: 10737418240,
     *     uploadedChunks: 45,
     *     lastChunkIndex: 44,
     *     lastBytePosition: 47185920,
     *     chunkSize: 1048576
     *   });
     *   console.log('Data successfully saved');
     * } catch (error) {
     *   console.error('Storage error:', error.message);
     * }
     * ```
     */
    async setItem(key: string, data: ResumeData): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (!key || typeof key !== 'string') {
                    reject(new UploadCacheError(
                        'Key must be a non-empty string',
                        'INVALID_KEY'
                    ));
                    return;
                }

                this.validateResumeData(data);

                // Check cache limit
                if (this.cache.size >= this.maxCacheSize && !this.cache.has(key)) {
                    reject(new UploadCacheError(
                        `Cache limit (${this.maxCacheSize} entries) has been reached. ` +
                        'Remove obsolete entries or use an adapter with persistent storage.',
                        'CACHE_LIMIT_EXCEEDED'
                    ));
                    return;
                }

                // Store a deep copy
                this.cache.set(key, JSON.parse(JSON.stringify(data)));
                resolve();
            } catch (error) {
                if (error instanceof UploadCacheError) {
                    reject(error);
                } else {
                    reject(new UploadCacheError(
                        `Error storing data: ${error instanceof Error ? error.message : String(error)}`,
                        'STORAGE_ERROR'
                    ));
                }
            }
        });
    }

    /**
     * Removes resume data for a specific upload.
     * 
     * @param key - Unique identifier for the upload
     * @returns Promise resolved after removal
     * 
     * @example
     * ```typescript
     * await adapter.removeItem('upload-123');
     * ```
     */
    async removeItem(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (!key || typeof key !== 'string') {
                    reject(new UploadCacheError(
                        'Key must be a non-empty string',
                        'INVALID_KEY'
                    ));
                    return;
                }

                this.cache.delete(key);
                resolve();
            } catch (error) {
                reject(new UploadCacheError(
                    `Error removing data: ${error instanceof Error ? error.message : String(error)}`,
                    'DELETION_ERROR'
                ));
            }
        });
    }

    /**
     * Clears all cached resume data.
     * 
     * @returns Promise resolved after complete cleanup
     * 
     * @example
     * ```typescript
     * await adapter.clear();
     * console.log('Cache cleared');
     * ```
     */
    async clear(): Promise<void> {
        return new Promise((resolve) => {
            this.cache.clear();
            resolve();
        });
    }

    /**
     * Returns the number of entries currently in cache.
     * 
     * @returns Number of cache entries
     */
    get size(): number {
        return this.cache.size;
    }

    /**
     * Returns cache usage as a percentage.
     * 
     * @returns Usage percentage (0-100)
     */
    get usage(): number {
        return (this.cache.size / this.maxCacheSize) * 100;
    }
}

export { UploadResumeCacheInterface, UploadCacheError };