import {
    MEDIA_CHUNK_UPLOAD_STARTED, MEDIA_CHUNK_UPLOAD_FAILED, emitEvent,
    MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE, MEDIA_CHUNK_UPLOAD_SUCCESS,
    DOWNLOAD_MEDIA_COMPLETE, DOWNLOAD_MEDIA_FAILURE, DOWNLOAD_MEDIA_RESUME,
    MEDIA_CHUNK_UPLOAD_RESUME, MEDIA_METADATA_SAVE_SUCCESS, translate,
    HttpFetchError, BaseUploadedMediaOptions, CustomEventOptions,
    BaseUploadedMedia, ChunkMediaDetailInterface
} from "..";
import {
    ApiError, ChunkMediaDetail,
    HttpResponse, Logger,
    calculateUploadChunkSize,
    createChunkFormData, httpFetchHandler,
    mapStatusToResponseType, baseSweetAlert2Options,
    ChunkSizeConfiguration
} from "..";
import Swal from "sweetalert2";
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
interface UploadedMediaInChunksOptions extends BaseUploadedMediaOptions {
    urlActionUploadMedia: string | URL | Request;
    startUpdate: number;
    uploadedChunksUpdate: number;
    readonly mediaIdFromServer: number;
    speedMbps?: number;
    config?: ChunkSizeConfiguration;
    readonly eventOptions?: CustomEventOptions;
}
export class UploadedMediaInChunks extends BaseUploadedMedia {
    constructor(private readonly uploadedMediaInChunksOptions: UploadedMediaInChunksOptions) {
        super(uploadedMediaInChunksOptions);
    }
    get urlActionUploadMedia(): string | URL | Request { return this.uploadedMediaInChunksOptions.urlActionUploadMedia }
    get mediaId(): number { return this.uploadedMediaInChunksOptions.mediaIdFromServer }
}
export async function uploadedMediaInChunks({
    urlActionUploadMedia,
    media,
    startUpdate = 0,
    uploadedChunksUpdate = 0,
    mediaIdFromServer,
    provider = "LocalVideo",
    target,
    timeoutUploadByChunk = 60000,
    speedMbps,
    othersData,
    config,
    eventOptions
}: UploadedMediaInChunksOptions): Promise<void> {
    const chunkSize = calculateUploadChunkSize(media.size, speedMbps, config);
    const totalChunks = Math.ceil(media.size / chunkSize);
    let uploadedChunks = uploadedChunksUpdate;
    let downloadMediaComplete: boolean = false;
    let progressPercentage: number = 0;
    let message: string | undefined;
    let data: any;
    const maxRetries = 4; // Nombre maximum de tentatives
    let start: number;
    let end: number;
    let status: number;
    for (start = startUpdate; start < media.size; start += chunkSize) {
        end = Math.min(media.size, start + chunkSize);
        const chunk = media.slice(start, end);
        let attempt = 0;
        let success = false;
        const baseChunkDetail = {
            chunkIndex: uploadedChunks + 1,
            start: start,
            totalChunks: totalChunks,
            mediaName: media.name,
            mediaId: mediaIdFromServer,
            provider: provider,
            progressPercentage: progressPercentage,
            urlActionUploadFile: urlActionUploadMedia
        };
        emitEvent(MEDIA_CHUNK_UPLOAD_STARTED, target,
            new ChunkMediaDetail({
                ...baseChunkDetail,
                messageFromServer: `<div class="alert alert-info" role="alert">Uploading chunk ${uploadedChunks + 1}...</div>`
            }), eventOptions);
        while (attempt < maxRetries && !success) {
            try {
                const response_data_media = await httpFetchHandler<any>({
                    url: urlActionUploadMedia,
                    methodSend: "POST",
                    retryCount: 1,
                    responseType: "json",
                    timeout: timeoutUploadByChunk,
                    data: createChunkFormData(chunk,
                        media.name,
                        mediaIdFromServer,
                        media.size,
                        uploadedChunks,
                        totalChunks,
                        provider,
                        othersData)
                })
                status = response_data_media.status;
                const statusMessage = mapStatusToResponseType(status);
                data = response_data_media.data;
                message = typeof data === "string" ? data : data?.message;
                if (statusMessage === "error") {
                    throw new HttpFetchError(message ?? `Error sending chunk ${uploadedChunks + 1}`, urlActionUploadMedia, {
                        attempt: attempt + 1,
                        responseStatus: status,
                        responseBody: data,
                        cause: new ChunkMediaDetail({
                            ...baseChunkDetail,
                            media: media,
                            status: status,
                            messageFromServer: message ?? `<div class="alert alert-danger" role="alert">Error sending chunk ${uploadedChunks + 1}</div>`,
                            urlActionUploadFile: urlActionUploadMedia
                        })
                    });
                }
                uploadedChunks++;
                success = true; // Chunk envoyé avec succès
                progressPercentage = Math.round((uploadedChunks / totalChunks) * 100);
                if (data?.downloadMediaComplete) { downloadMediaComplete = true; break; }
                if (success && !downloadMediaComplete) {
                    emitEvent(MEDIA_CHUNK_UPLOAD_SUCCESS, target,
                        new ChunkMediaDetail({
                            ...baseChunkDetail,
                            status: status,
                            messageFromServer: message ?? `<div class="alert alert-success" role="alert">Success for l'upload chunk ${uploadedChunks}</div>`,
                            progressPercentage: progressPercentage,
                        }), eventOptions)
                }
            } catch (error: any) {
                attempt++;
                Logger.log(`Retry #${attempt} for chunk ${uploadedChunks + 1}`);
                if (error instanceof HttpFetchError) {
                    if (error.cause instanceof ChunkMediaDetail) { emitEvent(MEDIA_CHUNK_UPLOAD_FAILED, target, error.cause); }
                    else if (error.cause instanceof Error) {
                        emitEvent(MEDIA_CHUNK_UPLOAD_FAILED, target,
                            new ChunkMediaDetail({
                                ...baseChunkDetail,
                                messageFromServer: `<div class="alert alert-danger" role="alert">${error.message}</div>`,
                            }), eventOptions);
                    }
                }
                if (attempt >= maxRetries) {
                    Logger.error(`Chunk ${uploadedChunks + 1} failed after ${maxRetries} attempts.`);
                    emitEvent(MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE, target,
                        new ChunkMediaDetail({
                            ...baseChunkDetail,
                            messageFromServer: `<div class="alert alert-danger" role="alert">
                                                Failed after ${maxRetries} attempts for chunk ${uploadedChunks + 1} of media 
                                                <span class="text-info fw-bolder">${media.name}</span>.
                                                 Please check your internet connection.</div>`,
                            downloadMediaComplete: false,
                            progressPercentage: progressPercentage,
                            urlActionUploadFile: urlActionUploadMedia,
                            media: media,
                        }), eventOptions);
                    break;
                }
            }
        }//End of the while loop
        if (downloadMediaComplete) break;
    }//end of the loop for
    const finalChunkDetail: ChunkMediaDetailInterface = {
        chunkIndex: uploadedChunks,
        totalChunks,
        mediaName: media.name,
        mediaId: mediaIdFromServer,
        status: data?.status,
        progressPercentage: progressPercentage,
        downloadMediaComplete: downloadMediaComplete,
        start: start,
        urlActionUploadFile: urlActionUploadMedia,
        provider: provider
    };
    if (downloadMediaComplete === true && progressPercentage === 100) {
        emitEvent(DOWNLOAD_MEDIA_COMPLETE, target,
            new ChunkMediaDetail({
                ...finalChunkDetail,
                messageFromServer: message ?? `<div class="alert alert-success" role="alert">
                                            Complete upload of the file ${media.name} by chunk do with success ...</div>`,
                progressPercentage: 100,
                downloadMediaComplete: true,
                provider: provider
            }), eventOptions);
    } else {
        emitEvent(DOWNLOAD_MEDIA_FAILURE, target,
            new ChunkMediaDetail({
                ...finalChunkDetail,
                media: media,
                messageFromServer: message ?? `<div class="alert alert-danger" role="alert">Error during upload of the file ${media.name} by chunk</div>`,
            }), eventOptions);
    }
}
export async function resumeMediaUploadFromCache(
    chunk_detail_media: ChunkMediaDetail,
    target: Window | Document,
    speedMbps: number | undefined,
    configOptions?: ChunkSizeConfiguration,
    othersData: Record<string, string | Blob> = {},
): Promise<void> {
    await uploadedMediaInChunks({
        urlActionUploadMedia: chunk_detail_media.urlAction!,
        media: chunk_detail_media.media!,
        startUpdate: chunk_detail_media.start,
        uploadedChunksUpdate: chunk_detail_media.chunkIndex,
        mediaIdFromServer: chunk_detail_media.mediaIdFromServer!,
        provider: chunk_detail_media.provider,
        target: target,
        timeoutUploadByChunk: 75000,
        speedMbps: speedMbps,
        othersData: othersData,
        config: configOptions,
    })
    emitEvent(MEDIA_CHUNK_UPLOAD_RESUME, target,
        new ChunkMediaDetail({
            mediaName: chunk_detail_media.mediaName,
            chunkIndex: chunk_detail_media.chunkIndex + 1,
            start: chunk_detail_media.start,
            provider: chunk_detail_media.provider,
            totalChunks: chunk_detail_media.totalChunks,
            messageFromServer: `<div class="alert alert-info" role="alert">Resume of upload of chunk ${chunk_detail_media.chunkIndex + 1} 
                                        for the media ${chunk_detail_media.mediaName}</div>`,
            mediaId: chunk_detail_media.mediaIdFromServer
        })
    )
}

interface MetadataSaveMediaOptions {
    readonly urlAction: string | URL | Request;
    readonly metadataSaveFile: FormData;
    readonly target: Window | Document;
    readonly messageBeforeDataSend?: string;
    readonly optionsHeaderInit?: HeadersInit;
    readonly eventOptions?: CustomEventOptions;
}
export async function uploadedMedia({
    urlAction,
    metadataSaveFile,
    target,
    messageBeforeDataSend,
    optionsHeaderInit,
    eventOptions
}: MetadataSaveMediaOptions): Promise<void> {
    let timerInterval: number | NodeJS.Timeout;
    let data: any;
    Swal.fire({
        title: `${translate("Processing...")}`,
        icon: "info",
        position: "center",
        html: `<div class="alert alert-info" role="alert">
                ${messageBeforeDataSend ?? "Sending metadata from the file to the server. Waiting for the answer ..."}
            </div>`,
        animation: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: "#283c63",
        color: "#fff",
        timer: 45000,
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: () => {
            document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';
            Swal.showLoading();
            const timerElement = Swal.getPopup()?.querySelector("b");
            timerInterval = setInterval(() => {
                if (timerElement) {
                    timerElement.textContent = `${Swal.getTimerLeft()}ms`;
                }
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        },
        showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
            `
        },
        hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
            `
        }
    })
    try {
        const response_metadata = await httpFetchHandler({
            url: urlAction,
            data: metadataSaveFile,
            responseType: "json",
            optionsheaders: optionsHeaderInit,
            timeout: 45000,
            retryCount: 3,
            methodSend: "POST"
        })
        const status = mapStatusToResponseType(response_metadata.status);
        data = response_metadata.data;
        if (status === "error") { Swal.close(); throw response_metadata; }
        Swal.fire({
            title: "Success",
            icon: "success",
            html: `<div class="alert alert-success" role="alert">
                        ${data.message ?? "The file's metadata has been successfully sent to the server. The file will now begin uploading in chunks. Please do not close the page or browser tab."}
                    </div>`,
            timer: 50000,
            ...baseSweetAlert2Options
        })
    } catch (error: any) {
        Swal.close();
        Logger.log('error Upload Media ...  ', error);
        let message = "An unexpected error occurred.";
        if (error instanceof HttpFetchError) { message = error.message; }
        if (error instanceof HttpResponse) {
            const data = error.data;
            if (data.message) { message = data.message; }
            else {
                const apiError = new ApiError(error.data, error.status);
                message = apiError.name;
            }
        }
        Swal.fire({
            ...baseSweetAlert2Options,
            title: `Error ${error.status ?? " "}...`,
            icon: "error",
            position: "top-end",
            html: `<div class="alert alert-danger" role="alert">
                    ${message}
                </div>`
        })
        return;
    }
    target.dispatchEvent(new CustomEvent(MEDIA_METADATA_SAVE_SUCCESS, {
        bubbles: eventOptions?.bubbles ?? false,
        cancelable: eventOptions?.cancelable ?? true,
        composed: eventOptions?.composed ?? true,
        detail: {
            urlActionUploadMedia: data.urlActionUploadMedia,
            mediaId: data.mediaId
        }
    }));
}