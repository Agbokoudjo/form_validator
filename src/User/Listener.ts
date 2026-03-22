/**
 * CRUD Action Processor
 * 
 * Framework-agnostic system for listening to and processing CRUDAction events.
 * Handles HTTP requests with loading states, success/error notifications,
 * and configurable callbacks.
 * 
 * @module CRUDActionProcessor
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @company INTERNATIONALES WEB APPS & SERVICES
 * @phone +229 0167 25 18 86
 * @linkedin https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * @package https://github.com/Agbokoudjo/
 * @version 2.2.0
 * @license MIT
 */


import {
    Logger,
    detectLanguageFromDom,
    showErrorDialog,
    showSuccessDialog,
    showLoadingDialog
} from "../_Utils";

import { CRUDActionEventDetail } from "./Event";

import {
    safeFetch,
    HttpResponse
} from "@wlindabla/http_client";
import {
    HttpMethod
} from "@wlindabla/http_client/types";

import {
    FetchResponseInterface
} from "@wlindabla/http_client/contracts";

import Swal, { SweetAlertOptions} from "sweetalert2";

/**
 * Translator function signature
 */
export type Translator = (key: string, error?: Error | null, language?: string) => string;


/**
 * Parameters for processToggleAction
 */
export interface ProcessCRUDActionParams {
    /** Event detail from custom event */
    eventDetail: CRUDActionEventDetail;
    optionsHeaders?: HeadersInit;
    /** Translation function (optional) */
    translator?: Translator | null;
    /** Custom loading dialog config */
    loadingConfig?: Partial<SweetAlertOptions>;
    /** Custom success dialog config */
    successConfig?: Partial<SweetAlertOptions>;
    /** Custom error dialog config */
    errorConfig?: Partial<SweetAlertOptions>;
    /** HTTP method (default: 'PATCH') */
    httpMethod?: HttpMethod;
    /** Retry count (default: 2) */
    retryCount?: number;
    /** Callback after success */
    onSuccess?: ((data: unknown, eventDetail: CRUDActionEventDetail) => void | Promise<void>) | null;
    /** Callback after error */
    onError?: ((error: Error | FetchResponseInterface<unknown>, eventDetail: CRUDActionEventDetail) => void | Promise<void>) | null;
    /** Callback after completion (always called) */
    onComplete?: ((eventDetail: CRUDActionEventDetail) => void | Promise<void>) | null;
}

/**
 * Processes toggle action with HTTP request
 * 
 * Main function that orchestrates the entire CRUD action process:
 * 1. Shows loading dialog
 * 2. Executes HTTP request with retry logic
 * 3. Handles success/error responses
 * 4. Shows appropriate dialogs
 * 5. Executes callbacks
 * 
 * **Server Requirements:**
 * - Controller must accept XMLHttpRequest
 * - Must return JSON response regardless of status
 * - Response format: `{ title: string, message: string }`
 * - Example: `new JsonResponse(['title' => 'Success', 'message' => '...'], status, headers)`
 * 
 * @param params - Configuration parameters
 * @returns Promise resolving to HTTP response
 * @throws {Error} Re-throws error after showing error dialog
 * 
 * @example
 * ```typescript
 * try {
 *     const response = await processCRUDAction({
 *         eventDetail: event.detail,
 *         translator: (key) => translations[key],
 *         httpMethod: 'PATCH',
 *         retryCount: 2,
 *         onSuccess: async (data) => {
 *             console.log('Success:', data);
 *             location.reload();
 *         },
 *         onError: (error) => {
 *             console.error('Failed:', error);
 *         }
 *     });
 * } catch (error) {
 *     // Error already shown to user
 *     console.error('Toggle action failed:', error);
 * }
 * ```
 */
export async function processCRUDAction(
    params: ProcessCRUDActionParams
): Promise<FetchResponseInterface> {
    const {
        eventDetail,
        translator = null,
        loadingConfig = {},
        successConfig = {},
        errorConfig = {},
        optionsHeaders,
        httpMethod = "PATCH",
        retryCount = 2,
        onSuccess = null,
        onError = null,
        onComplete = null
    } = params;

    let timerInterval: NodeJS.Timeout | undefined;

    try {
        Swal.close();  // Close any previously opened modal

        // 2. Show loading dialog
        const timer = showLoadingDialog({
            config: loadingConfig
        });
        timerInterval = timer.timerInterval;

        const response = await safeFetch({
            url: eventDetail.urlActionRequest,
            data: eventDetail.data,
            methodSend: httpMethod,
            headers: optionsHeaders,
            retryCount: retryCount,
            responseType: "json"
        });

        Swal.close();

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = undefined;
        }

        if (response.failed) {
            throw response;
        }

        // 6. Log success
        Logger.log("CRUD action successful:", response);

        // 7. Extract response data
        const responseData = response.data || response;

        // 8. Show success dialog
        await showSuccessDialog({
            title: (responseData as { title?: string }).title || "Success",
            message: (responseData as { message?: string }).message || "Action completed successfully",
            config: successConfig
        });

        // 9. Execute onSuccess callback
        if (onSuccess && typeof onSuccess === "function") {
            await onSuccess(responseData, eventDetail);
        }

        return response;

    } catch (error) {
        Swal.close();

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        // 11. Log error
        Logger.error("CRUD action failed:", error);

        // 12. Determine error message and title
        let errorMessage = "An error occurred";
        let errorTitle = "Error";
        if (error instanceof HttpResponse) {
            // HTTP response error
            Logger.error(`HTTP ${error.status}:`, error.data);
            const errorData = error.data as { message?: string; title?: string, detail?: string };
            errorMessage = errorData.message || errorData.detail || errorMessage;
            errorTitle = errorData.title || `HTTP ${error.status}`;
        } else if (error instanceof Error) {
            // JavaScript error (network, timeout, etc.)
            if (translator) {
                // Use translator if available (e.g., fetchErrorTranslator)
                errorMessage = translator(error.name, error, detectLanguageFromDom());
            } else {
                errorMessage = error.message || errorMessage;
            }
            errorTitle = errorTitle || error.name;
        }

        // 13. Show error dialog
        await showErrorDialog({
            title: errorTitle,
            message: errorMessage,
            config: errorConfig
        });

        // 14. Execute onError callback
        if (onError && typeof onError === "function") {
            await onError(error as Error | HttpResponse<unknown>, eventDetail);
        }

        // 15. Re-throw error
        throw error;

    } finally {
        if (onComplete && typeof onComplete === "function") {
            await onComplete(eventDetail);
        }
    }
}


/**
 * Safe version of processCRUDAction that doesn't throw
 * 
 * @param params - Configuration parameters
 * @returns Promise resolving to result object
 * 
 * @example
 * ```typescript
 * const result = await processCRUDActionSafe({
 *     eventDetail: event.detail,
 *     httpHandler: fetchHandler,
 * });
 * 
 * if (result.success) {
 *     console.log('Response:', result.response);
 * } else {
 *     console.error('Error:', result.error);
 * }
 * ```
 */
export async function processCRUDActionSafe(
    params: ProcessCRUDActionParams
): Promise<{
    success: boolean;
    response?: HttpResponse<unknown>;
    error?: Error | HttpResponse<unknown>;
}> {
    try {
        const response = await processCRUDAction(params) as HttpResponse;
        return { success: true, response };
    } catch (error) {
        return {
            success: false,
            error: error as Error | HttpResponse<unknown>
        };
    }
}

