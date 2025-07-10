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
import { ChunkMediaDetail, ChunkSizeConfiguration, Logger, baseSweetAlert2Options, translate } from "..";
import { resumeMediaUploadFromCache, uploadedMediaInChunks } from ".";
import Swal, { SweetAlertOptions } from "sweetalert2";
import 'animate.css';
import {
    MEDIA_CHUNK_UPLOAD_FAILED, MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE,
    MEDIA_CHUNK_UPLOAD_RESUME, MEDIA_CHUNK_UPLOAD_STARTED,
    MEDIA_CHUNK_UPLOAD_STATUS, MEDIA_CHUNK_UPLOAD_SUCCESS,
    MEDIA_METADATA_SAVE_SUCCESS, DOWNLOAD_MEDIA_COMPLETE,
    DOWNLOAD_MEDIA_FAILURE, DOWNLOAD_MEDIA_RESUME
} from "..";
export abstract class AbstractMediaUploadEventListener {
    protected constructor() { }
    public abstract eventMediaListenerAll(target: Window | Document): Promise<void>;
    protected abstract mediaMetadataSaveSuccessEvent(event: CustomEvent): Promise<void>
    protected abstract mediaChunkUploadStartedEvent(event: CustomEvent<ChunkMediaDetail>): void;
    protected abstract mediaChunkUploadSuccessEvent(event: CustomEvent<ChunkMediaDetail>): void;
    protected abstract mediaChunkUploadFailedEvent(event: CustomEvent<ChunkMediaDetail>): void;
    protected abstract mediaChunkUploadMaxRetryExpireEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void>;
    protected abstract downloadMediaFailureEvent(event: CustomEvent<ChunkMediaDetail>): void;
    protected abstract downloadMediaCompleteEvent(event: CustomEvent<ChunkMediaDetail>): void;
    protected abstract mediaChunkUploadResumeEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void>;
    protected abstract downloadMediaResume(event: CustomEvent<ChunkMediaDetail>): Promise<void>;
    protected abstract mediaChunkUploadStatusEvent(event: CustomEvent<ChunkMediaDetail>): void;
    protected abstract removeAllEventListeners(): void
}
/**
 * @class Handler Event
 */
export class MediaUploadEventListener extends AbstractMediaUploadEventListener {
    private target: Window | Document = document;
    private configOptions: ChunkSizeConfiguration | undefined
    public constructor(private readonly speedMbps?: number) { super(); }
    public eventMediaListenerAll = async (target: Window | Document = document): Promise<void> => { }
    protected async mediaMetadataSaveSuccessEvent(event: CustomEvent): Promise<void> {
        console.log('JQuery handler for mediaMetadataSaveSuccessEvent');
    }

    protected mediaChunkUploadStartedEvent(event: CustomEvent<ChunkMediaDetail>): void {
        const chunk_detail_upload_start = event.detail;
        Swal.fire({
            ...baseSweetAlert2Options,
            title: `${translate("Processing")}`,
            html: `${translate(chunk_detail_upload_start.message!)}
             <hr /> <br/> <strong class="fw-bold progess-title">Progression:</strong>
                    ${chunk_detail_upload_start.progressPercentage!}%
            `,
            icon: "info",
            timer: 35000
        });
        Logger.info('Event Listener mediaChunkUploadStartEvent:', chunk_detail_upload_start)
    }
    protected mediaChunkUploadSuccessEvent(event: CustomEvent<ChunkMediaDetail>): void {
        const chunk_detail_upload_success = event.detail;
        Swal.fire({
            ...baseSweetAlert2Options,
            title: `${translate("Success")} ${chunk_detail_upload_success.status ?? " "}...`,
            html: `${translate(chunk_detail_upload_success.message!)}
                    <hr /> <br/> <strong class="fw-bold progess-title">Progression:</strong>
                    ${chunk_detail_upload_success.progressPercentage!}%
            `,
            icon: "success",
            timer: 37000,
            width: 600,
        });
        Logger.log('Event Listener mediaChunkUploadSuccessEvent:', chunk_detail_upload_success)
    }
    protected async mediaChunkUploadFailedEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void> {
        const chunk_detail_upload_failed = event.detail;
        Swal.fire({
            ...baseSweetAlert2Options,
            title: `${translate("Error")} ${chunk_detail_upload_failed.status ?? " "}...`,
            html: `${translate(chunk_detail_upload_failed.message!)}
                    <hr /> <br/> <strong class="fw-bold progess-title">Progression:</strong>
                    ${chunk_detail_upload_failed.progressPercentage!}%
            `,
            icon: "error",
            timer: 50000
        });
        Logger.error('Event Listener mediaChunkUploadFailedEvent:', chunk_detail_upload_failed)
    }
    protected async mediaChunkUploadMaxRetryExpireEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void> {

        Logger.error('Event Listener mediaChunkUploadMaxRetryExpireEvent:')
    }
    protected downloadMediaFailureEvent(event: CustomEvent<ChunkMediaDetail>): void { }
    protected downloadMediaCompleteEvent(event: CustomEvent<ChunkMediaDetail>): void {
        const chunk_detail_upload_complete = event.detail;
        Swal.fire({
            ...baseSweetAlert2Options,
            title: `${translate("Success")} ${chunk_detail_upload_complete.status ?? " "}...`,
            html: `${translate(chunk_detail_upload_complete.message!)}
                    <hr /> <br/> <strong class="fw-bold progess-title">Progression:</strong>
                    ${chunk_detail_upload_complete.progressPercentage!}%
            `,
            icon: "success",
            timer: 75000,
            width: 800
        });
        Logger.log('Event Listener downloadMediaCompleteEvent:', chunk_detail_upload_complete)
        this.removeAllEventListeners();
    }
    protected async mediaChunkUploadResumeEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void> {
        const chunk_detail_upload_resume = event.detail;
        Swal.fire({
            ...baseSweetAlert2Options,
            title: `${translate(`Resuming upload of chunk no. ${chunk_detail_upload_resume.chunkIndex} of the file “${chunk_detail_upload_resume.mediaName}`)}...`,
            html: `${translate(chunk_detail_upload_resume.message!)}`,
            icon: "info",
            timer: 65000
        });
        Logger.info('Event Listener mediaChunkUploadResumeEvent:', chunk_detail_upload_resume)
    }
    protected async downloadMediaResume(event: CustomEvent<ChunkMediaDetail>): Promise<void> { }
    protected mediaChunkUploadStatusEvent(event: CustomEvent<ChunkMediaDetail>): void { }
    protected removeAllEventListeners(): void { }
    protected setTarget = (target: Window | Document): this => {
        this.target = target;
        return this;
    }
    protected getTarget = (): Window | Document => { return this.target; }
    public setConfigOptions = (configOptions: ChunkSizeConfiguration | undefined): this => {
        this.configOptions = configOptions;
        return this;
    }
    public getConfigOptions = (): ChunkSizeConfiguration | undefined => { return this.configOptions }
}    
