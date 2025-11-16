/**
 * Toggle Action Processor
 * 
 * Framework-agnostic system for listening to and processing toggle events.
 * Handles HTTP requests with loading states, success/error notifications,
 * and configurable callbacks.
 * 
 * @module ToggleActionProcessor
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @company INTERNATIONALES WEB APPS & SERVICES
 * @phone +229 0167 25 18 86
 * @linkedin https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * @package https://github.com/Agbokoudjo/
 * @version 2.0.1
 * @license MIT
 */

import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
import {
    mapStatusToResponseType,
    HttpResponse,
    httpFetchHandler,
    HttpMethod
} from "../_Utils";
import { ToggleEventDetail } from "./event";
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * HTTP handler function signature
 */
export type HttpHandler = (options: {
    url: string;
    data: unknown;
    methodSend: string;
    retryCount: number;
}) => Promise<HttpResponse<unknown>>;

/**
 * Dialog handler function signature
 */
export type DialogHandler = typeof Swal.fire & {
    close?: () => void;
    getPopup?: () => HTMLElement | null;
    getTimerLeft?: () => number;
};

/**
 * Translator function signature
 */
export type Translator = (key: string, error?: Error | null, language?: string) => string;

/**
 * Options for showLoadingDialog
 */
export interface ShowLoadingDialogOptions {
    /** Custom configuration */
    config?: Partial<SweetAlertOptions>;
}

/**
 * Options for showSuccessDialog
 */
export interface ShowSuccessDialogOptions {
    /** Dialog title */
    title: string;
    /** Success message */
    message: string;
    /** Custom configuration */
    config?: Partial<SweetAlertOptions>;
}

/**
 * Options for showErrorDialog
 */
export interface ShowErrorDialogOptions {
    /** Dialog title */
    title: string;
    /** Error message */
    message: string;
    /** Custom configuration */
    config?: Partial<SweetAlertOptions>;
}

/**
 * Parameters for processToggleAction
 */
export interface ProcessToggleActionParams {
    /** Event detail from custom event */
    eventDetail: ToggleEventDetail;
    optionsheaders?: HeadersInit;
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
    onSuccess?: ((data: unknown, eventDetail: ToggleEventDetail) => void | Promise<void>) | null;
    /** Callback after error */
    onError?: ((error: Error | HttpResponse<unknown>, eventDetail: ToggleEventDetail) => void | Promise<void>) | null;
    /** Callback after completion (always called) */
    onComplete?: ((eventDetail: ToggleEventDetail) => void | Promise<void>) | null;
}

/**
 * Timer interval wrapper
 */
export interface TimerWrapper {
    timerInterval?: NodeJS.Timeout;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default configuration for loading dialog
 */
export const DEFAULT_LOADING_DIALOG_CONFIG: Partial<SweetAlertOptions> = {
    icon: "info",
    allowOutsideClick: false,
    showConfirmButton: false,
    timer: 50000,
    timerProgressBar: true,
    didOpen: (): void => {
        const container = document.querySelector<HTMLElement>(".swal2-container");
        if (container) {
            container.style.zIndex = "99999";
        }
        Swal.showLoading();
    },
    customClass: {
        loader: "spinner-border text-info",
        timerProgressBar: "bg-info"
    }
} as const;

/**
 * Default configuration for success dialog
 */
export const DEFAULT_SUCCESS_DIALOG_CONFIG: Partial<SweetAlertOptions> = {
    icon: "success",
    timer: 40000,
    timerProgressBar: true,
    showConfirmButton: false,
    showCloseButton: true
} as const;

/**
 * Default configuration for error dialog
 */
export const DEFAULT_ERROR_DIALOG_CONFIG: Partial<SweetAlertOptions> = {
    icon: "error",
    timer: 30000,
    showConfirmButton: true,
    confirmButtonText: "OK",
    showCloseButton: true
} as const;

// ============================================================================
// DIALOG FUNCTIONS
// ============================================================================

/**
 * Shows a loading dialog with timer
 * 
 * Displays a modal with loading spinner and progress bar.
 * Automatically updates timer display in real-time.
 * 
 * @param options - Configuration options
 * @returns Object containing timer interval
 * 
 * @example
 * ```typescript
 * const { timerInterval } = showLoadingDialog({
 *     translator: (key) => translations[key]
 * });
 * 
 * // Later: cleanup
 * if (timerInterval) clearInterval(timerInterval);
 * ```
 */
export function showLoadingDialog(
    options: ShowLoadingDialogOptions
): TimerWrapper {
    const { config = {} } = options;

    let timerInterval: NodeJS.Timeout | undefined;

    const finalConfig: SweetAlertOptions = {
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 50000,
        timerProgressBar: true,
        background: config.background || "#00427E",
        color: config.color || "#fff",
        title: config.title || "Processing..." ,
        html: `<div class="alert alert-info" role="alert">
               ${config.text || 'Please wait...'}
               </div>`
               ,
        didOpen: (): void => {
            // Update timer in UI
            const container = document.querySelector<HTMLElement>(".swal2-container");
            if (container) {
                container.style.zIndex = "99999";
            }
            Swal.showLoading();
            const timerElement =Swal.getPopup()?.querySelector<HTMLElement>("b");
            if (timerElement) {
                timerInterval = setInterval(() => {
                    const timeLeft = Swal.getTimerLeft() || 0;
                    timerElement.textContent = `${timeLeft}ms`;
                }, 100);
            }
        },
        willClose: (): void => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        },
        customClass: {
            loader: "spinner-border text-info",
            timerProgressBar: "bg-info"
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
       
    };

    Swal.fire(finalConfig);

    return { timerInterval };
}

/**
 * Shows a success dialog
 * 
 * Displays a success modal with custom title and message.
 * 
 * @param options - Configuration options
 * @returns Promise resolving to SweetAlert result
 * 
 * @example
 * ```typescript
 * await showSuccessDialog({
 *     title: 'Success!',
 *     message: 'Operation completed successfully'
 * });
 * ```
 */
export function showSuccessDialog(
    options: ShowSuccessDialogOptions
): Promise<SweetAlertResult> {
    const {title, message, config = {} } = options;

    const finalConfig: SweetAlertOptions = {
        animation: true,
        allowEscapeKey: false,
        background: config.background || "#00427E",
        color: config.color || "#fff",
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
        },
        title:title,
        html: message,
        icon: "success",
        showConfirmButton: false,
        showCloseButton: true
    };

    return Swal.fire(finalConfig);
}

/**
 * Shows an error dialog
 * 
 * Displays an error modal with custom title and message.
 * Message is automatically wrapped in an alert-danger div.
 * 
 * @param options - Configuration options
 * @returns Promise resolving to SweetAlert result
 * 
 * @example
 * ```typescript
 * await showErrorDialog({
 *     title: 'Error',
 *     message: 'Something went wrong'
 * });
 * ```
 */
export function showErrorDialog(
    options: ShowErrorDialogOptions
): Promise<SweetAlertResult> {
    const { title, message, config = {} } = options;

    const finalConfig: SweetAlertOptions = {
        icon: "error",
        timer: 30000,
        showConfirmButton: true,
        confirmButtonText: "OK",
        showCloseButton: true,
        title:title,
        html: `<div class="alert alert-danger" role="alert">${message}</div>`,
        background:config.background || "#00427E",
        color:config.color || "#fff"
    };

    return Swal.fire(finalConfig);
}

// ============================================================================
// MAIN PROCESSING FUNCTION
// ============================================================================

/**
 * Processes toggle action with HTTP request
 * 
 * Main function that orchestrates the entire toggle action process:
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
 *     const response = await processToggleAction({
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
export async function processToggleAction(
    params: ProcessToggleActionParams
): Promise<HttpResponse<unknown>> {
    const {
        eventDetail,
        translator = null,
        loadingConfig = {},
        successConfig = {},
        errorConfig = {},
        optionsheaders,
        httpMethod = "PATCH",
        retryCount = 2,
        onSuccess = null,
        onError = null,
        onComplete = null
    } = params;

    let timerInterval: NodeJS.Timeout | undefined;

    try {
        // 1. Close any previously opened modal
        Swal.close();

        // 2. Show loading dialog
        const timer = showLoadingDialog({
            config: loadingConfig
        });
        timerInterval = timer.timerInterval;

        // 3. Execute HTTP request
        const response = await httpFetchHandler<HttpResponse>({
            url: eventDetail.url_action_confirm,
            data: eventDetail.data,
            methodSend: httpMethod,
            optionsheaders:optionsheaders,
            retryCount:retryCount,
            responseType:"json"
        });

        // 4. Close loading dialog
           Swal.close();

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = undefined;
        }

        // 5. Check if response indicates error
        if (mapStatusToResponseType(response.status) === "error") {
            throw response;
        }

        // 6. Log success
        console.log("✅ Toggle action successful:", response);

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
        // 10. Close loading dialog on error
          Swal.close();

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        // 11. Log error
        console.error("❌ Toggle action failed:", error);

        // 12. Determine error message and title
        let errorMessage = "An error occurred";
        let errorTitle = "Error";
        if (error instanceof HttpResponse) {
            // HTTP response error
            console.error(`HTTP ${error.status}:`, error.data);
            const errorData = error.data as { message?: string; title?: string };
            errorMessage = errorData.message || errorMessage;
            errorTitle = errorData.title || `HTTP ${error.status}`;
        } else if (error instanceof Error) {
            // JavaScript error (network, timeout, etc.)
            if (translator) {
                // Use translator if available (e.g., fetchErrorTranslator)
                errorMessage = translator(error.name, error, document.documentElement.lang);
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
        // 16. Execute onComplete callback (always runs)
        if (onComplete && typeof onComplete === "function") {
            await onComplete(eventDetail);
        }
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safe version of processToggleAction that doesn't throw
 * 
 * @param params - Configuration parameters
 * @returns Promise resolving to result object
 * 
 * @example
 * ```typescript
 * const result = await processToggleActionSafe({
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
export async function processToggleActionSafe(
    params: ProcessToggleActionParams
): Promise<{
    success: boolean;
    response?: HttpResponse<unknown>;
    error?: Error | HttpResponse<unknown>;
}> {
    try {
        const response = await processToggleAction(params);
        return { success: true, response };
    } catch (error) {
        return {
            success: false,
            error: error as Error | HttpResponse<unknown>
        };
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    showLoadingDialog,
    showSuccessDialog,
    showErrorDialog,
    processToggleAction,
    processToggleActionSafe,
    DEFAULT_LOADING_DIALOG_CONFIG,
    DEFAULT_SUCCESS_DIALOG_CONFIG,
    DEFAULT_ERROR_DIALOG_CONFIG
};