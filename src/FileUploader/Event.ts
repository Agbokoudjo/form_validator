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
import { ApiError } from "../_Utils";
import {
    ChunkInfo,
    InitializeUploadResponse,
    ResumeData,
    UploadProgress,
    UploadResult,
    UploadState,
    UploadStatus
} from "./interface";

/**
 * @Event Upload Media
 */
export const MEDIA_CHUNK_UPLOAD_STARTED = "mediaChunkUploadStarted";
export const MEDIA_CHUNK_UPLOAD_FAILED = "mediaChunkUploadFailed";
export const MEDIA_CHUNK_UPLOAD_HTTP_ERROR_RESPONSE = "mediaChunkUploadHttpErrorResponse";
export const MEDIA_CHUNK_UPLOAD_STATUS = "mediaChunkUploadStatus";
export const MEDIA_CHUNK_UPLOAD_SUCCESS = "mediaChunkUploadSuccess";
export const MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE = "mediaChunkUploadMaxRetryExpire";
export const DOWNLOAD_MEDIA_COMPLETE = "downloadMediaComplete";
export const DOWNLOAD_MEDIA_FAILURE = "downloadMediaFailure";
export const MEDIA_CHUNK_UPLOAD_RESUME = "mediaChunkUploadResume";
export const DOWNLOAD_MEDIA_RESUME = "downloadMediaResume";
export const MEDIA_METADATA_SAVE_SUCCESS = "mediaMetadataSaveSuccess";
export const INITIALIZE_UPLOAD_STARTED = "initializeUploadStarted";
export const INITIALIZE_UPLOAD_SUCCESS = "initializeUploadSuccess";
export const INITIALIZE_UPLOAD_FAILURE = "initializeUploadFailure";
export const UPLOAD_CANCELLED = "uploadCancelled";
export const UPLOAD_STATE_CHANGED = "uploadStateChanged";
export const UPLOAD_PAUSED = "uploadPaused";
export const UPLOAD_RESUMED = "uploadResumed";

/**
 * @type EventUploadMedia 
 */
export type EventUploadMedia =
    typeof MEDIA_CHUNK_UPLOAD_STARTED
    | typeof MEDIA_CHUNK_UPLOAD_FAILED
    | typeof MEDIA_CHUNK_UPLOAD_SUCCESS
    | typeof MEDIA_CHUNK_UPLOAD_STATUS
    | typeof MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE
    | typeof MEDIA_CHUNK_UPLOAD_RESUME
    | typeof MEDIA_METADATA_SAVE_SUCCESS
    | typeof DOWNLOAD_MEDIA_RESUME
    | typeof DOWNLOAD_MEDIA_COMPLETE
    | typeof DOWNLOAD_MEDIA_FAILURE
    | typeof INITIALIZE_UPLOAD_FAILURE
    | typeof INITIALIZE_UPLOAD_STARTED
    | typeof INITIALIZE_UPLOAD_SUCCESS
    | typeof MEDIA_CHUNK_UPLOAD_HTTP_ERROR_RESPONSE
    | typeof UPLOAD_CANCELLED
    | typeof UPLOAD_PAUSED
    | typeof UPLOAD_RESUMED

    ;

/**
 * Event data for INITIALIZE_UPLOAD_STARTED
 */
export class InitializeUploadStartedEvent {
    constructor(
        public readonly fileName: string,
        public readonly fileSize: number,
        public readonly fileHash: string
    ) { }
}

// Assurez-vous que l'interface InitializeUploadResponse est définie ailleurs,
// mais elle est utilisée ici comme un type pour la propriété responseData.

/**
 * Event data for INITIALIZE_UPLOAD_SUCCESS
 */
export class InitializeUploadSuccessEvent {
    constructor(
        public readonly status: number,
        public readonly sessionId: string,
        public readonly responseData: InitializeUploadResponse
    ) { }
}

/**
 * Event data for INITIALIZE_UPLOAD_FAILURE
 */
export class InitializeUploadFailureEvent {
    constructor(
        public readonly error: Error | ApiError,
        public readonly status?: number,
        public readonly errorData?: any,
        public readonly responseData?: any,
        public readonly isNetworkError?: boolean
    ) { }
}

/**
 * Event data for MEDIA_CHUNK_UPLOAD_HTTP_ERROR_RESPONSE
 */
export class ChunkUploadHttpErrorResponseEvent{
    constructor(
        public readonly errorPayload: string | Record<string, string | unknown> | unknown,
        public readonly statusResponse: number,
        public readonly urlEndpoint: string | URL | Request,
        public readonly chunkInfo:ChunkInfo
    ) {}

    public get chunkIndex(): number{ return this.chunkInfo.index;}
}

/**
 * Event data for MEDIA_CHUNK_UPLOAD_SUCCESS
 */
export class UploadProgressEvent{
    constructor(
        private readonly uploadProgress: UploadProgress,
        public readonly responseData: string | Record<string, string|any>|unknown,
        public readonly httpStatus:number
    ) { }

    public get uploadedChunks(): number{ return this.uploadProgress.uploadedChunks;}

    public get totalChunks(): number { return this.uploadProgress.totalChunks; }

    public get percentage(): number { return this.uploadProgress.percentage; }

    public get uploadedBytes(): number { return this.uploadProgress.uploadedBytes; }

    public get totalBytes(): number { return this.uploadProgress.totalBytes; }

    public get currentChunk(): number { return this.uploadProgress.currentChunk; }

    public get speed(): number|undefined { return this.uploadProgress.speed; }

    public get estimatedTimeRemaining(): number|undefined|null { return this.uploadProgress.estimatedTimeRemaining; }
}

/**
 * Event data for UPLOAD_CANCELLED
 */
export class UploadCancelledEvent{
    constructor(
        public readonly mediaName:string,
        public readonly totalChunks: number,
        public readonly uploadedBytes: number,
        public readonly percentage:number,
        public readonly cancelledAt:number=Date.now()
    ) {}
}

/**
 * Event data for UPLOAD_PAUSED
 */
export class UploadPausedEvent{
    constructor(
        public readonly mediaName: string,
        public readonly totalChunks: number,
        public readonly uploadedBytes: number,
        public readonly percentage: number,
        public readonly pausedAt: number = Date.now()
    ) { }
}

/**
 * Event data for UPLOAD_STATE_CHANGED
 */
export class UploadStateChangedEvent {
    constructor(
        public readonly oldState: UploadState,
        public readonly newState :UploadState ,
        public readonly changedAt: number = Date.now()
    ) { }
}

/**
 * Event data for DOWNLOAD_MEDIA_COMPLETE
 */
export class UploadMediaCompleteEvent{
    constructor(private readonly _uploadResult:UploadResult) { }

    public get success(): boolean { return this._uploadResult.success; }

    public get mediaId(): string | number { return this._uploadResult.fileId! }
    
    public get totalBytes(): number { return this._uploadResult.totalBytes; }

    public get totalChunks(): number { return this._uploadResult.totalChunks; }

    public get finalizeUploadHttpResponse(): any { return this._uploadResult.finalizeUploadResponse; }

    public get operationDuration(): number { return this._uploadResult.duration; }

    public get averageSpeed(): number { return this._uploadResult.averageSpeed; }
}

/**
 * Event data for UPLOAD_RESUMED
 */
export class UploadResumedEvent{
    constructor(
        public readonly mediaName: string,
        public readonly totalChunks: number,
        public readonly uploadedBytes: number,
        public readonly percentage: number,
        public readonly resumedAt: number = Date.now()
    ) {}
}

/**
 * Event data for MEDIA_CHUNK_UPLOAD_STARTED
 */
export class UploadChunkStartedEvent{
    constructor(private readonly _chunkInfo:ChunkInfo) {}

    public get start(): number { return this._chunkInfo.start; }

    public get end(): number { return this._chunkInfo.end; }

    public get uploadStatus(): UploadStatus { return this._chunkInfo.status; }

    public get chunkIndex(): number { return this._chunkInfo.index; }


}

/**
 * Event data for MEDIA_CHUNK_UPLOAD_RESUME
 */
export class ResumeUploadEvent{
    constructor(
        private readonly __resumeData: ResumeData,
        public readonly message:string) { }

    public get mediaId():string|number {return this.__resumeData.fileId ;}
    
    public get fileName(): string { return this.__resumeData.fileName; }

    public get uploadedChunks(): number { return this.__resumeData.uploadedChunks; }

    public get lastChunkIndex(): number { return this.__resumeData.lastChunkIndex; }

    public get lastBytePosition(): number { return this.__resumeData.lastBytePosition; }

    public get chunkSize(): number { return this.__resumeData.chunkSize; }

    public get fileSize(): number { return this.__resumeData.fileSize; }
}