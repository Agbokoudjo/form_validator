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

import { ChunkInfo, ChunkError } from "./interface";

/**
 * Custom error thrown during chunked file upload operations.
 * 
 * This error provides detailed information about which chunk failed,
 * the underlying error, and whether a retry will be attempted.
 * 
 * @example
 * ```typescript
 * try {
 *   await uploadChunk(chunk);
 * } catch (error) {
 *   throw new FileUploadChunkError(
 *     `Failed to upload chunk ${chunkIndex}`,
 *     chunkError
 *   );
 * }
 * 
 * // Later in error handler
 * if (error instanceof FileUploadChunkError) {
 *   console.log(`Chunk ${error.chunkIndex} failed`);
 *   console.log(`Will retry: ${error.willRetry}`);
 * }
 * ```
 */
export class FileUploadChunkError extends Error {

    /**
     * The detailed chunk error information
     */
    public readonly chunkError: ChunkError;

    /**
     * Creates a new FileUploadChunkError
     * 
     * @param message - Human-readable error message
     * @param chunkError - Detailed information about the chunk failure
     */
    constructor(message: string, chunkError: ChunkError) {
        super(message, { cause: chunkError.error });

        this.name = "FileUploadChunkError";
        this.chunkError = chunkError;

        // Maintain proper stack trace in V8 engines (Chrome, Node.js)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FileUploadChunkError);
        }
    }

    /**
     * Gets the index of the chunk that failed
     */
    get chunkIndex(): number {
        return this.chunkError.chunk.index;
    }

    /**
     * Gets the attempt number when the chunk failed
     */
    get attemptNumber(): number {
        return this.chunkError.attempt;
    }

    /**
     * Indicates whether a retry will be attempted
     */
    get willRetry(): boolean {
        return this.chunkError.willRetry;
    }

    /**
     * Gets the underlying error that caused the chunk upload to fail
     */
    get underlyingError(): Error {
        return this.chunkError.error;
    }

    /**
     * Gets the full chunk information
     */
    get chunk(): ChunkInfo {
        return this.chunkError.chunk;
    }

    /**
     * Returns a detailed string representation of the error
     */
    toString(): string {
        return `${this.name}: ${this.message}\n` +
            `  Chunk: ${this.chunkIndex + 1}/${this.chunk.size} bytes\n` +
            `  Attempt: ${this.attemptNumber}\n` +
            `  Will Retry: ${this.willRetry}\n` +
            `  Cause: ${this.underlyingError.message}`;
    }

    /**
     * Returns a JSON representation of the error
     */
    toJSON(): object {
        return {
            name: this.name,
            message: this.message,
            chunkIndex: this.chunkIndex,
            attempt: this.attemptNumber,
            willRetry: this.willRetry,
            underlyingError: {
                name: this.underlyingError.name,
                message: this.underlyingError.message
            },
            stack: this.stack
        };
    }
}

/**
 * Exception data for MEDIA_CHUNK_UPLOAD_HTTP_ERROR_RESPONSE
 */
export class ChunkUploadHttpErrorException extends Error{
    constructor(
        public readonly errorPayload: string | Record<string, string | unknown> | unknown,
        public readonly statusResponse: number
    ) {
        super();

        this.name = "ChunkUploadHttpErrorException";
      
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ChunkUploadHttpErrorException);
        }
     }
}

/**
 * 
 */
export class InitializeUploadFailureException extends Error{
    constructor(public readonly responseData: any,message: string) {
        super(message);
        this.name = "InitializeUploadFailureException";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InitializeUploadFailureException);
        }
     }
}

export class UploadCancelledException extends Error{
    constructor(
        public readonly chunkIndex: number,
        public readonly totalChunks: number,
        public readonly uploadedBytes: number, 
        message:string
    ) {
        super(message);
        this.name = "UploadCancelledException";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UploadCancelledException);
        }
    }
}