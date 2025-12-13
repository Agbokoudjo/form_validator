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

export interface UploadOptions {
    autoSave?:boolean,
    file: File;
    endpoint: string|URL|Request;//the entrypoint for send chunk upload
    endpointInit: string | URL | Request; //the entrypoint for send metadata
    endpointFinalize: string | URL | Request;
    chunkSize?: number;
    speedMbps?: number;
    config?: ChunkSizeConfig;
    headers?: HeadersInit;
    chunkOtherData?: Record<string, any>;
    metadata?: Record<string, any>;
    maxRetries?: number;
    timeout?: number;
    initTimeout?: number;
    onProgress?: (progress: UploadProgress) => void;
    onChunkSuccess?: (chunk: ChunkInfo) => void;
    onChunkError?: (error: ChunkError) => void;
    onComplete?: (result: UploadResult) => void;
    onError?: (error: Error) => void;
}

export interface ChunkSizeConfig {
    defaultChunkSizeMB: number;
    slowSpeedThresholdMbps: number;
    slowSpeedChunkSizeMB: number;
    fileSizeThresholds: Array<{
        maxSizeMB: number;
        chunkSizeMB: number;
    }>;
}

export interface UploadProgress {
    uploadedChunks: number;
    totalChunks: number;
    uploadedBytes: number;
    totalBytes: number;
    percentage: number;
    currentChunk: number;
    speed?: number; // bytes per second
    estimatedTimeRemaining?: number | null; // seconds
    elapsed: number;// secondes écoulées
}
export interface ChunkError {
    chunk: ChunkInfo;
    error: Error;
    attempt: number;
    willRetry: boolean;
}

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

export interface ChunkInfo {
    index: number;
    start: number;
    end: number;
    size: number;
    attempt: number;
    status: UploadStatus;
}

export enum UploadState {
    IDLE = 'idle',
    INITIALIZING = 'initializing',
    UPLOADING = 'uploading',
    PAUSED = 'paused',
    CANCELLED = 'cancelled',
    FINALIZING = 'finalizing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export interface UploadResult {
    success: boolean;
    fileId?: string;
    totalChunks: number;
    totalBytes: number;
    duration: number;
    averageSpeed: number;
    finalizeUploadResponse?: any;
    statusResponse?: number;
}

export interface ResumeData {
    fileId: string;
    fileName: string;
    fileSize: number;
    uploadedChunks: number;
    lastChunkIndex: number;
    lastBytePosition: number;
    chunkSize: number;
}

export const DEFAULT_CONFIG: ChunkSizeConfig = {
    defaultChunkSizeMB: 50,
    slowSpeedThresholdMbps: 5,
    slowSpeedChunkSizeMB: 2,
    fileSizeThresholds: [
        { maxSizeMB: 200, chunkSizeMB: 50 },
        { maxSizeMB: 400, chunkSizeMB: 100 },
        { maxSizeMB: 800, chunkSizeMB: 300 },
        { maxSizeMB: 1000, chunkSizeMB: 500 },
        { maxSizeMB: Infinity, chunkSizeMB: 700 }
    ]
};

/**
 * Expected response structure from initialize endpoint
 */
export interface InitializeUploadResponse {
    mediaIdFromServer?: string|number;
    sessionId?: string | number;
    uploadId?: string | number;
    mediaId?: string | number;
    message?: string | number;
    [key: string]: any; // Allow extra fields
}

export interface ChunkUploadSuccessResponseEvent{}