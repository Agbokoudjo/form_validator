/**
 * Handles HTTP requests with loading states, success/error notifications,
 * and configurable callbacks.
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @company INTERNATIONALES WEB APPS & SERVICES
 * @phone +229 0167 25 18 86
 * @linkedin https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * @package https://github.com/Agbokoudjo/
 * @license MIT
 */

import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

import {
    displayFlashMessage,
} from "../_Utils";

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

/**
 * Timer interval wrapper
 */
export interface TimerWrapper {
    timerInterval?: NodeJS.Timeout;
}

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
        timer: config.timer || 50000,
        timerProgressBar: true,
        background: config.background || "#00427E",
        color: config.color || "#fff",
        title: config.title || "Processing...",
        html: `<div class="alert alert-info" role="alert">
               ${config.text || 'Please wait...'}
               </div>`
        ,
        didOpen: (): void => {
            const container = document.querySelector<HTMLElement>(".swal2-container");
            if (container) {
                container.style.zIndex = "99999";
            }
            Swal.showLoading();
            const timerElement = Swal.getPopup()?.querySelector<HTMLElement>("b");
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
export async function showSuccessDialog(
    options: ShowSuccessDialogOptions
): Promise<SweetAlertResult> {
    const { title, message, config = {} } = options;

    Swal.close();
    
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
        title: title,
        html: displayFlashMessage(message, "success"),
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
export async function showErrorDialog(
    options: ShowErrorDialogOptions
): Promise<SweetAlertResult> {
    const { title, message, config = {} } = options;

    Swal.close();
    const finalConfig: SweetAlertOptions = {
        icon: "error",
        timer: config.timer || 50000,
        showConfirmButton: true,
        confirmButtonText: "OK",
        showCloseButton: true,
        title: title,
        html: displayFlashMessage(message, "danger"),
        background: config.background || "#00427E",
        color: config.color || "#fff"
    };

    return Swal.fire(finalConfig);
}