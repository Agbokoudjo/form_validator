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
import { ChunkSizeConfig,DEFAULT_CONFIG } from "./interface";

export class FileUtils {
    static readonly MB = 1024 * 1024;
    static readonly GB = 1024 * 1024 * 1024;

    static bytesToMB(bytes: number): number {
        return parseFloat((bytes / this.MB).toFixed(2));
    }

    static bytesToGB(bytes: number): number {
        return parseFloat((bytes / this.GB).toFixed(2));
    }

    static formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static formatDuration(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    }

    static calculateChunkSize(
        fileSize: number,
        speedMbps?: number,
        config: ChunkSizeConfig = DEFAULT_CONFIG
    ): number {
        const fileSizeMB = fileSize / this.MB;

        // Handle slow connections
        if (speedMbps && speedMbps < config.slowSpeedThresholdMbps) {
            return Math.min(
                config.defaultChunkSizeMB * this.MB,
                config.slowSpeedChunkSizeMB * this.MB
            );
        }

        // Adjust based on file size
        for (const threshold of config.fileSizeThresholds) {
            if (fileSizeMB <= threshold.maxSizeMB) {
                return threshold.chunkSizeMB * this.MB;
            }
        }

        return config.defaultChunkSizeMB * this.MB;
    }

    static generateFileHash(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const buffer = e.target?.result as ArrayBuffer;
                    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer.slice(0, 1024 * 1024));
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    resolve(hashHex);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file.slice(0, 1024 * 1024)); // Hash first 1MB
        });
    }
}

export function updateProgressBarHTMLNotified(
    progress: number,
    media_id: number,
    filename: string,
    providerName = "LocalVideo"
): string {
    const progressBarId = `progress-bar-item_${providerName}_${media_id}`;
    let progressBarInner = jQuery(`#${progressBarId}`);
    if (progressBarInner.length) {
        progressBarInner.css({ width: `${progress}%` });
        progressBarInner.attr('aria-valuenow', progress.toString());
        progressBarInner.text(`${Math.round(progress)}%`);
    }
    else {
        progressBarInner = jQuery(`
                <div id="${progressBarId}" class="mb-2" style="width:100%;">
                <small class="control-label text-dark fw-bolder filename-label w-100 d-block text-truncate" title="${filename}">${filename}</small>
                <div class="progress">
                    <div class="progress-bar bg-success progress-bar-striped progress-bar-animated"
                         role="progressbar"
                         style="width: ${progress}%;"
                         aria-valuenow="${progress}"
                         aria-valuemin="0"
                         aria-valuemax="100">${Math.round(progress)}%</div>
                </div>
            </div>
            `);
    }
    return progressBarInner.get(0)!.innerHTML;
}

/**
 * Options for creating chunk FormData
 */
export interface ChunkFormDataOptions {
    chunkIndex: number;
    totalChunks: number;
    mediaId: string;
    fileName: string;
    fileSize: number;
    fileHash: string;
    metadata?: Record<string, string | Blob>;
}

/**
 * Creates FormData for uploading a single file chunk.
 * 
 * @param chunk - The chunk blob to upload
 * @param options - Chunk upload options
 * @returns FormData ready to be sent to the server
 * 
 * @example
 * ```typescript
    * const formData = createChunkFormData(blob, {
        *   chunkIndex: 5,
        *   totalChunks: 10,
        *   mediaId: 'abc123',
        *   fileName: 'video.mp4',
        *   fileSize: 104857600,
        *   fileHash: 'sha256...'
 * });
 * ```
 */
export function createChunkFormData(
    chunk: Blob,
    options: ChunkFormDataOptions
): FormData {
    const formData = new FormData();
    
    // Chunk data
    formData.append('chunk', chunk);
    formData.append('chunkIndex', options.chunkIndex.toString());
    formData.append('chunkSize', chunk.size.toString());
    formData.append('totalChunks', options.totalChunks.toString());
    
    // File metadata
    formData.append('fileName', options.fileName);
    formData.append('fileSize', options.fileSize.toString());
    formData.append('fileHash', options.fileHash);
    
    // Media ID (returned by server after metadata registration)
    formData.append('mediaId', options.mediaId);
    
    // Optional additional data
    if (options.metadata) {
        for (const [key, value] of Object.entries(options.metadata)) {
            if (typeof value === 'string' || value instanceof Blob) {
                formData.append(key, value);
            }
        }
    }
    
    return formData;
}

/**
 * Builder pattern for creating chunk FormData with fluent API.
 */
export class ChunkFormDataBuilder {
    private formData: FormData = new FormData();

    constructor(private chunk: Blob) {
        this.formData.append('chunk', chunk);
        this.formData.append('chunkSize', chunk.size.toString());
    }

    withChunkInfo(chunkIndex: number, totalChunks: number): this {
        this.formData.append('chunkIndex', chunkIndex.toString());
        this.formData.append('totalChunks', totalChunks.toString());
        return this;
    }

    withFileInfo(fileName: string, fileSize: number, fileHash: string): this {
        this.formData.append('fileName', fileName);
        this.formData.append('fileSize', fileSize.toString());
        this.formData.append('fileHash', fileHash);
        return this;
    }

    withSessionId(sessionId: string): this {
        this.formData.append('sessionId', sessionId);
        return this;
    }

    withMetadata(metadata: Record<string, string | Blob>): this {
        for (const [key, value] of Object.entries(metadata)) {
            if (typeof value === 'string' || value instanceof Blob) {
                this.formData.append(key, value);
            }
        }
        return this;
    }

    build(): FormData {
        return this.formData;
    }
}

// Stratégie de retry configurable
interface RetryStrategyInterface {
    shouldRetry(attempt: number, maxRetries: number, error: Error): boolean;
    getDelay(attempt: number): number;
}

export class ExponentialBackoffStrategy implements RetryStrategyInterface {
    shouldRetry(attempt: number, maxRetries: number): boolean {
        return attempt < maxRetries;
    }

    getDelay(attempt: number): number {
        return Math.pow(2, attempt) * 1000;
    }
}

export class LinearBackoffStrategy implements RetryStrategyInterface {
    shouldRetry(attempt: number, maxRetries: number): boolean {
        return attempt < maxRetries;
    }

    getDelay(attempt: number): number {
        return (attempt + 1) * 1000; // 1s, 2s, 3s...
    }
}

