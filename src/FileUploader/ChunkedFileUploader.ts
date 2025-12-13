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

import {
    
    Logger,
    //Http
    httpFetchHandler,
    HttpResponse,
    mapStatusToResponseType,
    //Event
    EventEmitterInterface,
    ApiError
} from "../_Utils";

import {
    UploadResult,
    ChunkInfo,
    UploadOptions,
    InitializeUploadResponse,
    ChunkError,
    UploadProgress,
    ResumeData,
    UploadState
} from "./interface";

import { UploadResumeCacheInterface } from "./CacheFileUploader";

import { FileUtils, createChunkFormData } from "./utils";

import {
    //event
    INITIALIZE_UPLOAD_SUCCESS,
    INITIALIZE_UPLOAD_STARTED,
    MEDIA_CHUNK_UPLOAD_FAILED,
    INITIALIZE_UPLOAD_FAILURE,
    MEDIA_CHUNK_UPLOAD_STARTED,
    MEDIA_CHUNK_UPLOAD_HTTP_ERROR_RESPONSE,
    MEDIA_CHUNK_UPLOAD_SUCCESS,
    UPLOAD_CANCELLED,
    UPLOAD_STATE_CHANGED,
    InitializeUploadStartedEvent,
    InitializeUploadFailureEvent,
    InitializeUploadSuccessEvent,
    ChunkUploadHttpErrorResponseEvent,
    UploadProgressEvent,
    UploadCancelledEvent,
    UPLOAD_PAUSED,
    UploadStateChangedEvent,
    UploadPausedEvent,
    DOWNLOAD_MEDIA_COMPLETE,
    UploadMediaCompleteEvent,
    DOWNLOAD_MEDIA_FAILURE,
    MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE,
    UPLOAD_RESUMED,
    UploadResumedEvent,
    UploadChunkStartedEvent,
    MEDIA_CHUNK_UPLOAD_RESUME,
    ResumeUploadEvent
} from "./Event";

import {
    ChunkUploadHttpErrorException, 
    FileUploadChunkError, 
    InitializeUploadFailureException,
    UploadCancelledException
} from "./Exception";

/**
 * Enhanced Chunked File Upload Library
 * A generic, framework-agnostic solution for uploading large files in chunks
 * 
 * @author AGBOKOUDJO Franck
 * @version 2.4.0
 * @license MIT
 */
export class ChunkedFileUploader{
    private isPaused: boolean;
    private startTime: number;
    private uploadedBytes: number;
    private abortController: AbortController;
    private state: UploadState ;
    private totalChunks: number;
    private percentage: number;
    private uploadedChunks: number;
    private lastUploadedChunkIndex: number;  

    constructor(
        private readonly options: UploadOptions,
        private readonly uploadResumeData: UploadResumeCacheInterface,
        private readonly eventEmitter: EventEmitterInterface) {
        this.validateOptions();
        this.isPaused = false;
        this.startTime = 0;
        this.uploadedBytes = 0;
        this.abortController = new AbortController();
        this.state = UploadState.IDLE;
        this.totalChunks = 0;
        this.percentage = 0;
        this.uploadedChunks = 0;           
        this.lastUploadedChunkIndex = -1;  
    }

    public async upload(): Promise<UploadResult> { 
        this.setState(UploadState.INITIALIZING);
        const { file, maxRetries = 3, config, speedMbps } = this.options;
        // Generate file hash for integrity check
        const fileHash = await FileUtils.generateFileHash(file);
        let fileId: string;

        try {
            // Initialize upload session
            fileId = await this.initializeUpload(fileHash);
        } catch (error) {
            this.setState(UploadState.FAILED);
            throw error;
        }

        this.setState(UploadState.UPLOADING);
        this.startTime = Date.now();
        this.uploadedBytes = 0;
        this.uploadedChunks = 0;          
        this.lastUploadedChunkIndex = -1;  

        const chunkSize = this.options.chunkSize || FileUtils.calculateChunkSize(file.size, speedMbps, config);
        this.totalChunks = Math.ceil(file.size / chunkSize);

        try {
            // Fichier: 1000 bytes
            // Chunk size: 300 bytes
            // Total chunks: 4
            for (let chunkIndex = 0; chunkIndex < this.totalChunks; chunkIndex++) {
                try {
                    await this.processChunk(
                        file,
                        chunkIndex,
                        chunkSize,
                        fileId,
                        fileHash,
                        maxRetries
                    )
                } catch (error) {
                    throw error;
                }
            }//end of the for loop  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++)

            // Finalize upload
            return await this.finalizeUpload(fileId, fileHash);
        } catch (error) {
            this.handleUploadFailure(error as Error);
            throw error;
        }
    }

    /**
     * Process a single chunk: slice, upload with retry, and save progress.
     * 
     * @param file - The file being uploaded
     * @param currentChunkIndex - Index of the current chunk (0-based)
     * @param chunkSize - Size of each chunk in bytes
     * @param fileId - Server-provided file/session ID
     * @param fileHash - SHA-256 hash of the file
     * @param maxRetries - Maximum number of retry attempts
     * 
     * @throws {UploadCancelledException} If upload is cancelled
     * @throws {FileUploadChunkError} If chunk upload fails after all retries
     */
    private async processChunk(
        file:File,
        currentChunkIndex: number,
        chunkSize:number,
        fileId: string,
        fileHash:string,
        maxRetries:number
        ): Promise<void>{
        try {
            if (this.abortController.signal.aborted) {
                    this.setState(UploadState.CANCELLED);
                    this.eventEmitter.emit(
                        UPLOAD_CANCELLED,
                        new UploadCancelledEvent(
                            file.name,
                            this.totalChunks,
                            this.uploadedBytes,
                            this.percentage,
                            Date.now()
                        ));
                    
                    throw new UploadCancelledException(
                        currentChunkIndex,
                        this.totalChunks,
                        this.uploadedBytes,
                        'Upload cancelled by user')
                }

                while (this.isPaused) {
                    await this.sleep(100);
                }
                // Calcule où commencer dans le fichier
            const start = currentChunkIndex * chunkSize;
                // chunkIndex=0 → start=0
                // chunkIndex=1 → start=300
                // chunkIndex=2 → start=600
                // chunkIndex=3 → start=900

                // Calcule où finir (sans depasser la fin du fichier)
                const end = Math.min(file.size, start + chunkSize);
                // chunkIndex=0 → end=min(1000, 300)=300
                // chunkIndex=1 → end=min(1000, 600)=600
                // chunkIndex=2 → end=min(1000, 900)=900
                // chunkIndex=3 → end=min(1000, 1200)=1000 ← Limité !

                // Découpe le morceau
                const chunk = file.slice(start, end);
                // chunkIndex=0 → slice(0, 300)   → 300 bytes
                // chunkIndex=1 → slice(300, 600) → 300 bytes
                // chunkIndex=2 → slice(600, 900) → 300 bytes
                // chunkIndex=3 → slice(900, 1000)→ 100 bytes ← Plus petit !
                const chunkInfo: ChunkInfo = {
                    index: currentChunkIndex,
                    start,
                    end,
                    size: chunk.size,
                    attempt: 0,
                    status: 'pending'
                };

                this.eventEmitter.emit(
                    MEDIA_CHUNK_UPLOAD_STARTED, 
                    new UploadChunkStartedEvent(chunkInfo)
                )

                // Upload with retry
                await this.uploadChunkWithRetry(
                    chunk,
                    chunkInfo,
                    fileId,
                    fileHash,
                    this.totalChunks,
                    maxRetries
                );

                // Auto-save progress
                if (this.options.autoSave) {
                    await this.saveResumeData(fileId,chunkSize);
                }
        } catch (error) {
            throw error;
            
        }
    }
    
    /**
     * Initializes upload session with the server.
     * 
     * @param fileHash - SHA-256 hash of the file (first 1MB)
     * @returns Session ID from server, or null if initialization failed
     * @throws {FileUploadInitializationError} If server returns error or network fails
     */
    private async initializeUpload(fileHash: string): Promise<string> {
        const initData: Record<string, string | number | object> = {
            fileName: this.options.file.name,
            fileSize: this.options.file.size,
            fileType: this.options.file.type,
            fileHash,
        };

        if (this.options.metadata) {
            initData.metadata = this.options.metadata;
        }

        this.eventEmitter.emit(
            INITIALIZE_UPLOAD_STARTED,
            new InitializeUploadStartedEvent(
                this.options.file.name,
                this.options.file.size,
                fileHash
            ));

        try {
            const response = await httpFetchHandler({
                url: this.options.endpointInit,
                methodSend: 'POST',
                optionsheaders: {
                    'Content-Type': 'application/json',
                    ...this.options.headers
                },
                data: initData,
                responseType: "json",
                retryCount: 3,
                retryOnStatusCode: true,
                timeout: this.options.initTimeout || 45000
            });

            const status = response.status;
            const responseData = response.data as InitializeUploadResponse;

            // Validate server response struct
            if (!responseData || typeof responseData !== 'object') {
                const validationError = 'Invalid server response: expected object, got ' + typeof responseData
                Logger.error('Invalid response structure:', responseData);

                throw new InitializeUploadFailureException(
                    responseData,
                    validationError
                );
            }

            // Handle error responses (4xx, 5xx)
            if (mapStatusToResponseType(status) === "error") {
                const apiError = new ApiError(responseData, status);
                this.eventEmitter.emit(
                    INITIALIZE_UPLOAD_FAILURE,
                    new InitializeUploadFailureEvent(
                        apiError,
                        status,
                        responseData)
                );
                Logger.error(`Initialize upload failed (HTTP ${status}):`, responseData);

                throw new InitializeUploadFailureException(
                    responseData,
                    `Server returned error: HTTP ${response.status}`
                );
            }

            // Extract session ID
            let sessionId =
                responseData.mediaId ||
                responseData.mediaIdFromServer ||
                responseData.sessionId ||
                responseData.uploadId;

            if (!sessionId) {
                const missingKeyError = 'Server response missing required field: "mediaId","mediaIdFromServer", "sessionId", or "uploadId"';
                
                Logger.error('Missing session ID in response:', responseData);
                throw new InitializeUploadFailureException(
                        responseData,   
                        missingKeyError
                    );
            }

            if (typeof sessionId === "number") { sessionId = sessionId.toString();}

            this.eventEmitter.emit(
                INITIALIZE_UPLOAD_SUCCESS,
                new InitializeUploadSuccessEvent(
                    status,
                    sessionId,
                    responseData
                ));

            Logger.info(`Upload initialized successfully. Session ID: ${sessionId}`);

            return sessionId;
        } catch (error) {
            Logger.error('Initialize upload exception:', error);

            this.eventEmitter.emit(
                INITIALIZE_UPLOAD_FAILURE,
                new InitializeUploadFailureEvent(
                    error instanceof Error ? error : new Error(String(error)),
                ));
            throw error;
        }
    }

    // Méthode refactorisée pour upload avec retry
    private async uploadChunkWithRetry(
        chunk: Blob,
        chunkInfo: ChunkInfo,
        fileId: string,
        fileHash: string,
        totalChunks: number,
        maxRetries: number
    ): Promise<void>{
        let success = false;
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < maxRetries && !success; attempt++) {
            chunkInfo.attempt = attempt + 1;
            chunkInfo.status = 'uploading';

            try {
                const response = await this.uploadChunk(chunk, chunkInfo, fileId, fileHash, totalChunks);
                success = true;
                chunkInfo.status = 'success';

                this.uploadedBytes += chunk.size;
                this.uploadedChunks++;                   
                this.lastUploadedChunkIndex = chunkInfo.index;
                
                this.options.onChunkSuccess?.(chunkInfo);
                this.notifyProgress(
                    this.uploadedChunks,
                    totalChunks,
                    this.options.file.size,
                    response
                );
            } catch (error) {
                if (error instanceof ChunkUploadHttpErrorException) {
                    this.eventEmitter.emit(
                        MEDIA_CHUNK_UPLOAD_HTTP_ERROR_RESPONSE,
                        new ChunkUploadHttpErrorResponseEvent(
                            error.errorPayload,
                            error.statusResponse,
                            this.options.endpoint,
                            chunkInfo))
                }

                lastError = error as Error;
                chunkInfo.status = 'error';

                const chunkError: ChunkError = {
                    chunk: chunkInfo,
                    error: lastError,
                    attempt: attempt + 1,
                    willRetry: attempt < maxRetries - 1
                };
                
                this.options.onChunkError?.(chunkError);
                this.eventEmitter.emit(MEDIA_CHUNK_UPLOAD_FAILED, chunkError)
                
                if (attempt < maxRetries - 1) {
                    const delay = Math.pow(2, attempt) * 1000;
                    await this.sleep(delay); 
                    
                    Logger.info(`Retry #${attempt + 2} in ${delay / 1000}s...`);
                }
            }
        }

        if (!success) {
            const fileUploadChunkError= new FileUploadChunkError(
                `Failed to upload chunk ${chunkInfo.index} after ${maxRetries} attempts`,
                {
                    chunk: chunkInfo,
                    error: lastError!,
                    attempt: maxRetries,
                    willRetry: false
                }
            );

            this.eventEmitter.emit(
                MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE,
                fileUploadChunkError
            )

            throw fileUploadChunkError ;
        }

    }

    private async uploadChunk(
        chunk: Blob,
        chunkInfo: ChunkInfo,
        mediaIdFromServer: string,
        fileHash: string,
        totalChunks: number
    ): Promise<HttpResponse> {
        const media = this.options.file;
        const chunkFormData =createChunkFormData(
            chunk,
            {
                chunkIndex:chunkInfo.index,
                mediaId:mediaIdFromServer,
                fileSize:media.size,
                fileName:media.name,
                fileHash:fileHash,
                totalChunks:totalChunks
            }
            );

        try {
            const response_of_server = await httpFetchHandler({
                url: this.options.endpoint,
                optionsheaders: this.options.headers,
                data: chunkFormData,
                methodSend: "POST",
                responseType: "json",
                timeout: this.options.timeout ?? 60000,
                retryCount: 1,
                retryOnStatusCode: true
            })
            const statusResponse = response_of_server.status;
            //if the server send a response which not success with status code(>=4XX ou >=5XX)
            if (mapStatusToResponseType(statusResponse) === "error") {
                throw new ChunkUploadHttpErrorException(response_of_server.data, statusResponse)
            }

            return response_of_server;
        } catch (error) {
            throw error;
        }
    }

    private notifyProgress(
        uploadedChunks: number,
        totalChunks: number,
        totalBytes: number,
        httpResponse: HttpResponse): void{
        // Temps écoulé (minimum 0.1s pour éviter division par zéro)
        const elapsed = Math.max((Date.now() - this.startTime) / 1000, 0.1);
        const speed = this.uploadedBytes / elapsed;  // Vitesse instantanée
        const remainingBytes = totalBytes - this.uploadedBytes; // Bytes restants
        // Temps restant (null si pas assez de données)
        const estimatedTimeRemaining = uploadedChunks < 2 ? null : remainingBytes / speed;

        this.percentage = Math.round((this.uploadedBytes / totalBytes) * 100);

        const progress: UploadProgress = {
            uploadedChunks,
            totalChunks,
            uploadedBytes: this.uploadedBytes,
            totalBytes,
            percentage:this.percentage,
            currentChunk: uploadedChunks,
            speed, // bytes/seconde
            estimatedTimeRemaining, // secondes (ou null)
            elapsed // secondes écoulées
        };

        this.eventEmitter.emit(
            MEDIA_CHUNK_UPLOAD_SUCCESS,
            new UploadProgressEvent(
                progress,
                httpResponse.data,
                httpResponse.status
            )
        )
        this.options.onProgress?.(progress); // Notifier l'utilisateur

        // Logger pour debugging
        Logger.info(
            `Progress: ${this.percentage}% | ` +
            `Speed: ${FileUtils.formatBytes(speed)}/s | ` +
            `ETA: ${estimatedTimeRemaining ? FileUtils.formatDuration(estimatedTimeRemaining) : 'Calculating...'}`
        );
    }

    private async finalizeUpload(sessionId: string, fileHash: string): Promise<UploadResult> {
        try {
            const responseFinalizeUpload = await httpFetchHandler({
                url: this.options.endpointFinalize,
                methodSend: 'POST',
                optionsheaders: {
                    'Content-Type': 'application/json',
                    ...this.options.headers
                },
                data: { mediaId:sessionId, mediaHash:fileHash }
            });

            this.setState(UploadState.FINALIZING);
            const duration = (Date.now() - this.startTime) / 1000;

            const uploadResult: UploadResult = {
                success: true,
                finalizeUploadResponse: responseFinalizeUpload,
                totalChunks: this.totalChunks,
                totalBytes: this.options.file.size,
                duration,
                averageSpeed: this.options.file.size / duration,
                fileId: sessionId
            };

            this.setState(UploadState.COMPLETED);
            this.eventEmitter.emit(
                DOWNLOAD_MEDIA_COMPLETE,
                new UploadMediaCompleteEvent(uploadResult)
            )

            this.options.onComplete?.(uploadResult);
            return uploadResult ;
        } catch (error) {
            throw error;
        }
    }

    private validateOptions(): void {
        if (!this.options.file) {
            throw new Error('File is required');
        }

        if (!this.options.endpoint) {
            throw new Error('Endpoint URL is required');
        }

        if (!this.options.endpointInit) { // Ajouter
            throw new Error('Endpoint init URL is required');
        }

        if (!this.options.endpointFinalize) { // Ajouter
            throw new Error('Endpoint finalize URL is required');
        }
        if (this.options.file.size === 0) {
            throw new Error('Cannot upload empty file');
        }
        // Valider les callbacks
        if (this.options.maxRetries && this.options.maxRetries < 1) {
            throw new Error('maxRetries must be at least 1');
        }
    }

    public pause(): void {
        this.isPaused = true;
        this.setState(UploadState.PAUSED);
        this.eventEmitter.emit(UPLOAD_PAUSED,
            new UploadPausedEvent(
                this.options.file.name,
                this.totalChunks,
                this.uploadedBytes,
                this.percentage,
                Date.now()
            )
        );
    }

    public resume(): void {
        this.isPaused = false;
        this.setState(UploadState.UPLOADING);
        this.eventEmitter.emit(
            UPLOAD_RESUMED,
            new UploadResumedEvent(
                this.options.file.name,
                this.totalChunks,
                this.uploadedBytes, 
                this.percentage)
        );
    }

    public cancel(): void {
        this.abortController?.abort();
        this.setState(UploadState.CANCELLED);
        // Émettre un événement d'annulation
        this.eventEmitter.emit(
            UPLOAD_CANCELLED,
            new UploadCancelledEvent(
                this.options.file.name,
                this.totalChunks,
                this.uploadedBytes,
                this.percentage,
                Date.now()
            )
        );

        Logger.info('Upload cancelled by user');
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Save current upload progress to cache for resume capability
     * 
     * @param fileId - Server-provided file/session ID
     * @param chunkSize - Size of each chunk in bytes
     * @returns Saved resume data
     */
    protected async saveResumeData(fileId: string,chunkSize:number): Promise<ResumeData> {
        const data: ResumeData = {
            fileId: fileId,
            fileName: this.options.file.name,
            fileSize: this.options.file.size,
            uploadedChunks: this.uploadedChunks,        
            lastChunkIndex: this.lastUploadedChunkIndex,  
            lastBytePosition: this.uploadedBytes,
            chunkSize: chunkSize
        };

        await this.uploadResumeData.setItem(`upload_${this.options.file.name}`, data);

        Logger.info(
            `Resume data saved: ${this.uploadedChunks}/${Math.ceil(this.options.file.size / chunkSize)} chunks, ` +
            `last chunk index: ${this.lastUploadedChunkIndex}`
        );

        return data;
    }

    /**
     * Load previously saved resume data
     * 
     * @param fileName - Name of the file to resume
     * @returns Resume data or null if not found
     */
    async loadResumeData(fileName: string): Promise<ResumeData | null> {
        try {
            const data = await this.uploadResumeData.getItem(`upload_${fileName}`);

            if (data) {
                Logger.info(
                    `Resume data loaded: ${data.uploadedChunks} chunks uploaded, ` +
                    `last index: ${data.lastChunkIndex}`
                );
            }
            return data; 
        } catch (error) {
            Logger.warn(`No resume data found for ${fileName}`);
            return null;
        }
    }


     /**
     * Resume upload from saved state
     * 
     * @param resumeData - Previously saved resume data
     * @returns Upload result
     */
    public async resumeUpload(resumeData: ResumeData): Promise<UploadResult> {
        const __message= `Resuming upload from chunk ${resumeData.lastChunkIndex + 1} ` +
            `(${resumeData.uploadedChunks} chunks already uploaded)` ;
        
        Logger.info(__message);
        
        // Restore state
        this.uploadedBytes = resumeData.lastBytePosition;
        this.uploadedChunks = resumeData.uploadedChunks;
        this.lastUploadedChunkIndex = resumeData.lastChunkIndex;
        
        // Calculate adjusted start time for accurate speed calculation
        const assumedSpeed = 500000; // 500 KB/s assumed
        const timeAlreadySpent = resumeData.lastBytePosition / assumedSpeed;
        this.startTime = Date.now() - (timeAlreadySpent * 1000);
        
        const { file, maxRetries = 3 } = this.options;
        const fileHash = await FileUtils.generateFileHash(file);
        const chunkSize = resumeData.chunkSize;
        this.totalChunks = Math.ceil(file.size / chunkSize);

        try {
            this.eventEmitter.emit(
                  MEDIA_CHUNK_UPLOAD_RESUME,
                new ResumeUploadEvent(
                    resumeData,
                    __message)
                )
            // Resume from next chunk
            for (let chunkIndex = resumeData.lastChunkIndex + 1; chunkIndex < this.totalChunks; chunkIndex++) {
                try {
                    await this.processChunk(
                        file,
                        chunkIndex,
                        chunkSize,
                        resumeData.fileId,
                        fileHash,
                        maxRetries
                    )
                } catch (error) {
                    throw error ;
                }
            }

            return this.finalizeUpload(resumeData.fileId, fileHash);

        } catch (error) {
            this.handleUploadFailure(error as Error);
            throw error;
        }
    }

    public getState(): UploadState {
        return this.state;
    }

    private setState(newState: UploadState): void {
        const oldState = this.state;
        this.state = newState;

        this.eventEmitter.emit(UPLOAD_STATE_CHANGED,
            new UploadStateChangedEvent(
                oldState,
                newState,
                Date.now()
            )
        );
    }

    private handleUploadFailure(error: Error): void {
        this.setState(UploadState.FAILED);

        this.eventEmitter.emit(DOWNLOAD_MEDIA_FAILURE, error);

        this.options.onError?.(error);

        Logger.error('Upload failed:', error);
    }
}
