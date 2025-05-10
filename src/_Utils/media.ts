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

import { Logger } from ".";

/**
 * @interface ChunkSizeConfiguration
 * @description Defines the configuration object for determining the optimal upload chunk size.
 * This configuration allows for adjustments based on network speed and file size.
 */
export interface ChunkSizeConfiguration {
    /**
     * @property defaultChunkSizeMo
     * @type number
     * @description The default chunk size in megabytes (MB) to be used when no specific
     * conditions based on network speed or file size are met. This serves as the fallback value.
     * @example 50 (represents 50 MB)
     */
    defaultChunkSizeMo: number;

    /**
     * @property slowSpeedThresholdMbps
     * @type number
     * @description The network speed threshold in megabits per second (Mbps). If the detected
     * upload speed is below this value, the system will consider the connection to be slow
     * and may apply more conservative chunk sizes to improve reliability.
     * @example 5 (represents 5 Mbps)
     */
    slowSpeedThresholdMbps: number;

    /**
     * @property verySlowSpeedChunkSizeMo
     * @type number
     * @description The maximum chunk size in megabytes (MB) to be used when the upload speed
     * is considered very slow (below the `slowSpeedThresholdMbps`). This setting helps to
     * prevent timeouts and improve the chances of successful uploads on poor connections.
     * @example 2 (represents a maximum of 2 MB for slow connections)
     */
    verySlowSpeedChunkSizeMo: number;

    /**
     * @property fileSizeThresholds
     * @type { maxSizeMo: number; chunkSizeMo: number; }[]
     * @description An array of objects that define different chunk sizes to be used based on
     * the size of the file being uploaded. Each object in the array specifies a maximum
     * file size (in MB) and the corresponding chunk size (in MB) to be used for files
     * up to that size. The array should be ordered by `maxSizeMo` in ascending order.
     * The last element can have `Infinity` as `maxSizeMo` to cover all larger files.
     * @example
     * [
     * { maxSizeMo: 200, chunkSizeMo: 50 }, // For files up to 200 MB, use 50 MB chunks
     * { maxSizeMo: 400, chunkSizeMo: 100 }, // For files up to 400 MB, use 100 MB chunks
     * { maxSizeMo: Infinity, chunkSizeMo: 700 } // For files larger than 400 MB, use 700 MB chunks
     * ]
     */
    fileSizeThresholds: {
        maxSizeMo: number;
        chunkSizeMo: number;
    }[];
}
const defaultChunkConfig: ChunkSizeConfiguration = {
    defaultChunkSizeMo: 50,
    slowSpeedThresholdMbps: 5,
    verySlowSpeedChunkSizeMo: 2,
    fileSizeThresholds: [
        { maxSizeMo: 200, chunkSizeMo: 50 }, // Même taille que défaut pour < 200 Mo
        { maxSizeMo: 400, chunkSizeMo: 100 },
        { maxSizeMo: 800, chunkSizeMo: 300 },
        { maxSizeMo: 1000, chunkSizeMo: 500 },
        { maxSizeMo: Infinity, chunkSizeMo: 700 }, // Pour les fichiers plus grands que 1000 Mo
    ],
};
export function calculateUploadChunkSize(
    media_size: number,
    speedMbps: number | undefined,
    config: ChunkSizeConfiguration = defaultChunkConfig
): number {
    const mo_unity = Math.pow(1024, 2);
    const media_sizeMo = media_size / mo_unity;
    //Slow connection management
    if (speedMbps && speedMbps < config.slowSpeedThresholdMbps) {
        return Math.min(config.defaultChunkSizeMo * mo_unity, config.verySlowSpeedChunkSizeMo * mo_unity);
    }
    // Adjustment based on file size
    for (const threshold of config.fileSizeThresholds) {
        if (media_sizeMo <= threshold.maxSizeMo) {
            return threshold.chunkSizeMo * mo_unity;
        }
    }
    // Returns the default size if no conditions are met (should be covered by the last threshold
    return config.defaultChunkSizeMo * mo_unity;
}

export function convertOctetToGo(size_file: number): number {
    const go = size_file / (Math.pow(1024, 3));
    return parseFloat(go.toFixed(2));
}
export function convertOctetToMo(size_file: number): number {
    const mo = size_file / (Math.pow(1024, 2));
    return parseFloat(mo.toFixed(2));
}

/**
 * Creates a `FormData` object for uploading a single file chunk to the server.
 *
 * This function prepares the required metadata so the backend can properly reconstruct
 * the full media file from individual chunks during a chunked file upload process.
 *
 * @param chunk_media - The current chunk of the media file, represented as a `Blob`.
 * @param orginal_name_media - The original filename of the media being uploaded.
 * @param mediaIdFromServer - The ID of the media as provided by the server (after metadata registration).
 * @param sizeMedia - The total size of the full media file in bytes.
 * @param uploadedChunks - The index of the current chunk being uploaded (zero-based).
 * @param totalChunks - The total number of chunks expected to complete the upload.
 * @param provider - (Optional) The storage provider name (default is `"videoLocal"`).
 *@param  othersData -(Optional) Other data  puts into the body of the request and will be to the server
 * @returns A `FormData` instance containing the chunk and all necessary metadata for server processing.
 *
 * Note: If the current chunk is the last one (`uploadedChunks === totalChunks - 1`),
 * an additional `sizeTailChunk` field is appended to indicate the final chunk's size.
 */
export function createChunkFormData(
    chunk_media: Blob,
    orginal_name_media: string,
    mediaIdFromServer: number,
    sizeMedia: number,
    uploadedChunks: number,
    totalChunks: number,
    provider: string = "LocalVideo",
    othersData: Record<string, string | Blob> = {}
): FormData {
    const chunkFormData = new FormData();
    chunkFormData.append("chunkMedia", chunk_media);
    chunkFormData.append('sizeChunk', (chunk_media.size).toString())
    chunkFormData.append("chunkIndex", uploadedChunks.toString());
    chunkFormData.append("totalChunks", totalChunks.toString());
    chunkFormData.append("filename", orginal_name_media);
    chunkFormData.append('mediaId', mediaIdFromServer.toString());
    chunkFormData.append('extension', orginal_name_media.split('.').pop() as string);
    chunkFormData.append('sizeMedia', sizeMedia.toString());
    chunkFormData.append('provider', provider);
    if (uploadedChunks === totalChunks - 1) {
        chunkFormData.append('sizeTailChunk', (chunk_media.size).toString())
    }
    if (othersData) {
        for (const key in othersData) {
            const value = othersData[key];
            if (typeof value === 'string' || value instanceof Blob) {
                chunkFormData.append(key, value);
            }
        }
    }
    return chunkFormData;
}
export interface BaseUploadedMediaOptions {
    readonly media: File;
    readonly provider: string;
    readonly target: Window | Document;
    readonly timeoutUploadByChunk?: number;
    readonly othersData?: Record<string, string | Blob>;
}
export class BaseUploadedMedia {
    constructor(private readonly baseUploadedMedia: BaseUploadedMediaOptions) { }
    get media(): File { return this.baseUploadedMedia.media; }
    get provider(): string { return this.baseUploadedMedia.provider; }
    get target(): Window | Document { return this.baseUploadedMedia.target; }
    get timeoutId(): number | undefined { return this.baseUploadedMedia.timeoutUploadByChunk; };
    get othersData(): Record<string, string | Blob> | undefined { return this.baseUploadedMedia.othersData; }
}
export interface ChunkMediaDetailInterface {
    chunkIndex: number;
    start: number;
    totalChunks: number;
    mediaName: string;
    mediaId?: number,
    media?: File,
    status?: number;
    urlActionUploadFile?: string | URL | Request,
    messageFromServer?: string;
    progressPercentage?: number;
    downloadMediaComplete?: boolean,
    provider: string;
}
export class ChunkMediaDetail {
    constructor(private readonly data_chunk: ChunkMediaDetailInterface) { }
    public get status(): number | undefined { return this.data_chunk.status; }
    public get message(): string | undefined { return this.data_chunk.messageFromServer; }
    public get progressPercentage(): number | undefined { return this.data_chunk.progressPercentage; }
    public get mediaIdFromServer(): number | undefined { return this.data_chunk.mediaId; }
    public get chunkIndex(): number { return this.data_chunk.chunkIndex - 1; }
    public get totalChunks(): number { return this.data_chunk.totalChunks; }
    public get mediaName(): string { return this.data_chunk.mediaName; }
    public isComplete(): boolean { return !!this.data_chunk.downloadMediaComplete; }
    public get start(): number { return this.data_chunk.start; }
    public get urlAction(): string | URL | Request | undefined { return this.data_chunk.urlActionUploadFile; }
    public get provider(): string { return this.data_chunk.provider }
    public get media(): File | undefined { return this.data_chunk.media }
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

    Logger.log('progress:', progressBarInner.text());
    Logger.log('progress Bar Html:', progressBarInner.get(0));
    return progressBarInner.get(0)!.innerHTML;
}
/**
 * @Event Upload Media
 */
export const MEDIA_CHUNK_UPLOAD_STARTED = "mediaChunkUploadStarted";
export const MEDIA_CHUNK_UPLOAD_FAILED = "mediaChunkUploadFailed";
export const MEDIA_CHUNK_UPLOAD_STATUS = "mediaChunkUploadStatus";
export const MEDIA_CHUNK_UPLOAD_SUCCESS = "mediaChunkUploadSuccess";
export const MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE = "mediaChunkUploadMaxRetryExpire";
export const DOWNLOAD_MEDIA_COMPLETE = "downloadMediaComplete";
export const DOWNLOAD_MEDIA_FAILURE = "downloadMediaFailure";
export const MEDIA_CHUNK_UPLOAD_RESUME = "mediaChunkUploadResume";
export const DOWNLOAD_MEDIA_RESUME = "downloadMediaResume";
export const MEDIA_METADATA_SAVE_SUCCESS = "mediaMetadataSaveSuccess";
/**
 * @type EventUploadMedia 
 */
export type EventUploadMedia = typeof MEDIA_CHUNK_UPLOAD_STARTED | typeof MEDIA_CHUNK_UPLOAD_FAILED |
    typeof MEDIA_CHUNK_UPLOAD_SUCCESS | typeof MEDIA_CHUNK_UPLOAD_STATUS |
    typeof MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE | typeof MEDIA_CHUNK_UPLOAD_RESUME |
    typeof MEDIA_METADATA_SAVE_SUCCESS | typeof DOWNLOAD_MEDIA_RESUME |
    typeof DOWNLOAD_MEDIA_COMPLETE | typeof DOWNLOAD_MEDIA_FAILURE;
export interface CustomEventOptions {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
}
export function emitEvent(
    typeEvent: EventUploadMedia,
    target: Window | Document,
    chunk_media_detail: ChunkMediaDetail,
    eventOptions?: CustomEventOptions
): void {
    target.dispatchEvent(new CustomEvent(typeEvent, {
        bubbles: eventOptions?.bubbles ?? false,
        cancelable: eventOptions?.cancelable ?? true,
        composed: eventOptions?.composed ?? true,
        detail: chunk_media_detail
    }));
}
