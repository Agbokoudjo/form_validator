/**
 * CRUD Action  Handler
 * 
 * Reusable system for managing account CRUD Action for dashboard (Eg:SonataAdminBundle,EasyAdmin,Django etc).
 * Framework-agnostic and compatible with all modern frameworks (jQuery, React, Angular, Vue, Vanilla JS).
 * Uses jQuery internally for legacy browser compatibility.
 * 
 * @module CRUDActionHandler
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @company INTERNATIONALES WEB APPS & SERVICES
 * @phone +229 0167 25 18 86
 * @linkedin https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * @package https://github.com/Agbokoudjo/
 * @version 2.1.0
 * @license MIT
 */

import Swal, { SweetAlertOptions } from "sweetalert2";
import {
    MissingAttributeError,
    HttpMethod
} from "../_Utils";
import {
    CRUDActionEventDetail,
    CRUD_ACTION_CONFIRMED_EVENT
} from "./Event";

/**
 * Extracted toggle data from DOM element
 */
export interface ExtractedCRUDActionData {
    /** Modal title */
    title: string;
    /** Confirmation message text */
    actionConfirmText: string;
    /** Action URL for the toggle request */
    actionUrl: string;
    /** Additional custom data */
    additionalData: Record<string, unknown>;
    /** HTTP method (default: 'PATCH') */
    httpMethodRequestAction: HttpMethod;
}

/**
 * CRUDAction handler parameters
 */
export interface CRUDActionConfirmationParams {
    /** DOM element that triggered the action */
    element: HTMLElement;
    /** Custom event name to dispatch */
    eventName?: string;
    /** Custom configuration for confirmation dialog */
    confirmDialogConfig?: Partial<SweetAlertOptions>;
    /** Custom configuration for cancellation dialog */
    cancelDialogConfig?: Partial<SweetAlertOptions>;
    /** Callback executed after confirmation */
    onConfirm?: ((data: ExtractedCRUDActionData, event: CustomEvent) => void | Promise<void>) | null;
    /** Callback executed after cancellation */
    onCancel?: ((data: ExtractedCRUDActionData) => void | Promise<void>) | null;
    /** Callback executed on error */
    onError?: ((error: Error) => void) | null;
}

/**
 * Handles CRUDAction confirmation workflow
 * 
 * Main function that orchestrates the entire confirmation process:
 * 1. Extracts data from DOM element
 * 2. Shows confirmation dialog
 * 3. Dispatches custom event if confirmed
 * 4. Shows cancellation dialog if cancelled
 * 5. Executes appropriate callbacks
 * 
 * This function is completely framework-agnostic and can be used with any
 * JavaScript framework or vanilla JS.
 * 
 * @param params - Configuration parameters
 * @returns Promise resolving to true if confirmed, false if cancelled
 * @throws {CRUDActionConfirmationError} If confirmation handling fails
 * 
 * @example
 * ```typescript
 * const confirmed = await CRUDActionConfirmationHandle({
 *     element: buttonElement,
 *     eventName: 'account:toggle:confirmed',
 *     onConfirm: async (data) => {
 *         console.log('Confirmed:', data);
 *     }
 * });
 * 
 * if (confirmed) {
 *     console.log('User confirmed the action');
 * }
 * ```
 */
export async function CRUDActionConfirmationHandle(
    params: CRUDActionConfirmationParams
): Promise<boolean> {
    const {
        element,
        eventName = CRUD_ACTION_CONFIRMED_EVENT,
        confirmDialogConfig = {},
        cancelDialogConfig = {},
        onConfirm = null,
        onCancel = null,
        onError = null
    } = params;

    try {
        // 1. Extract and validate data
        const crudActionData = extractCRUDActionData(element);
        // 2. Prepare confirmation dialog configuration
        const finalConfirmConfig: SweetAlertOptions = {
            icon: "question",
            position: "top",
            showCancelButton: true,
            animation: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: confirmDialogConfig.background ?? "#00427E",
            color: confirmDialogConfig.color ?? "#fff",
            title: crudActionData.title,
            text: crudActionData.actionConfirmText,
            confirmButtonText: confirmDialogConfig.confirmButtonText ?? "Confirm",
            cancelButtonText: cancelDialogConfig.cancelButtonText ?? "Cancel",
            confirmButtonColor: confirmDialogConfig.confirmButtonColor ?? '#3085d6',
            cancelButtonColor: cancelDialogConfig.cancelButtonColor ?? '#d33',
            didOpen: (): void => {
                const container = document.querySelector<HTMLElement>('.swal2-container');
                if (container) {
                    container.style.zIndex = '99999';
                }
            },
            showClass: {
                popup: "animate__animated animate__fadeInUp animate__faster"
            },
            hideClass: {
                popup: "animate__animated animate__fadeOutDown animate__faster"
            },
        };
        // 3. Show confirmation dialog
        const result = await Swal.fire(finalConfirmConfig);
        // 4. Handle confirmation
        if (result.isConfirmed) {
            // Create and dispatch custom event
            const customEvent = createCRUDActionEvent(eventName, crudActionData, element);
            document.dispatchEvent(customEvent);
            // Execute onConfirm callback
            if (onConfirm && typeof onConfirm === "function") {
                await onConfirm(crudActionData, customEvent);
            }
            return true;
        }
        // 5. Handle cancellation
        if (result.dismiss) {
            const finalCancelConfig: SweetAlertOptions = {
                icon: cancelDialogConfig.icon || "info",
                position: 'top',
                showConfirmButton: false,
                timer: cancelDialogConfig.timer || 3000,
                background: cancelDialogConfig.background || "#00427E",
                color: cancelDialogConfig.color || "#fff",
                showCloseButton: true,
                title: cancelDialogConfig.title || "Action cancelled",
                text: cancelDialogConfig.text
            };
            await Swal.fire(finalCancelConfig);

            // Execute onCancel callback
            if (onCancel && typeof onCancel === "function") {
                await onCancel(crudActionData);
            }

            return false;
        }

        return false;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[CRUDActionConfirmation] Error in toggle confirmation handler:", error);

        // Execute onError callback
        if (onError && typeof onError === "function") {
            onError(error instanceof Error ? error : new Error(errorMessage));
        } else {
            // Re-throw if no error handler provided
            throw new CRUDActionConfirmationError(
                `CRUDAction confirmation failed: ${errorMessage}`,
                error instanceof Error ? error : undefined
            );
        }

        return false;
    }
}

/**
 * Creates a safe version of CRUDActionConfirmationHandle that doesn't throw
 * 
 * @param params - Configuration parameters
 * @returns Promise resolving to confirmation result
 * 
 * @example
 * ```typescript
 * const result = await CRUDActionConfirmationHandleSafe({
 *     element: buttonElement,
 *     eventName: 'toggle:confirmed',
 *     dialogHandler: Swal.fire
 * });
 * 
 * if (result.success) {
 *     console.log('Confirmed:', result.confirmed);
 * } else {
 *     console.error('Error:', result.error);
 * }
 * ```
 */
export async function CRUDActionConfirmationHandleSafe(
    params: CRUDActionConfirmationParams
): Promise<{ success: boolean; confirmed?: boolean; error?: string }> {
    try {
        const confirmed = await CRUDActionConfirmationHandle(params);
        return { success: true, confirmed };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * (c) INTERNATIONALES WEB SERVICES
 */

/**
 * Checks if a DOM element contains all the necessary attributes for a CRUD action (like Delete/Confirm).
 * It verifies the presence of a confirmation flag, a title (for tooltips/modals), and a target URL.
 * * @param {HTMLElement} element - The native DOM element to validate.
 * @returns {boolean} True if all required CRUD attributes are present, false otherwise.
 */
export function hasRequiredCRUDActionAttributes(element: HTMLElement): boolean {
    try {
        // Assuming validateElement is a native utility that throws error if element is invalid
        validateElement(element);

        // 1. Check for confirmation attribute (data-action-confirm)
        const hasActionConfirm: boolean = element.hasAttribute("data-action-confirm");

        // 2. Check for Title (standard title or Bootstrap's original title attribute)
        const hasTitle: boolean = !!(
            element.getAttribute("title") ||
            element.getAttribute("data-bs-original-title")
        );

        // 3. Check for URL (href for links, or custom data-href/data-url for other elements)
        const hasUrl: boolean = !!(
            (element instanceof HTMLAnchorElement && element.getAttribute("href")) ||
            element.getAttribute("data-href") ||
            element.getAttribute("data-url")
        );

        return hasActionConfirm && hasTitle && hasUrl;
    } catch {
        // Returns false if validation fails or an error occurs during attribute access
        return false;
    }
}

/**
 * Creates a custom event for CRUDAction
 * 
 * @param eventName - Name of the custom event
 * @param crudActionData - Extracted CRUDAction data
 * @param sourceElement - Source DOM element
 * @returns CustomEvent with CRUDAction
 * 
 * @example
 * ```typescript
 * const event = createCRUDActionEvent('account:toggle', data, element);
 * document.dispatchEvent(event);
 * ```
 */
export function createCRUDActionEvent(
    eventName: string,
    crudActionData: ExtractedCRUDActionData,
    sourceElement: HTMLElement
): CustomEvent<CRUDActionEventDetail> {
    return new CustomEvent<CRUDActionEventDetail>(eventName, {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
            data: crudActionData.additionalData,
            urlActionRequest: crudActionData.actionUrl,
            sourceElement,
            timestamp: new Date().toISOString(),
            httpMethodRequestAction: crudActionData.httpMethodRequestAction
        }
    });
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * (c) INTERNATIONALES WEB SERVICES
 */

/**
 * Extracts and validates CRUD Action data from a DOM element.
 * * This function retrieves confirmation text, titles, URLs, and additional JSON data
 * directly from the DOM attributes without external dependencies.
 * * @param {HTMLElement} element - DOM element containing CRUD data attributes.
 * @returns {ExtractedCRUDActionData} Validated CRUD Action data object.
 * @throws {TypeError} If the element is null or undefined.
 * @throws {MissingAttributeError} If mandatory attributes are missing.
 */
export function extractCRUDActionData(element: HTMLElement): ExtractedCRUDActionData {
    // 1. Validate the input element using your existing utility
    validateElement(element);

    // 2. Extract and validate 'data-action-confirm'
    const actionConfirmText = element.getAttribute("data-action-confirm");
    if (!actionConfirmText || actionConfirmText.trim() === "") {
        throw new MissingAttributeError("data-action-confirm", element.outerHTML);
    }

    // 3. Extract title (Compatible with Bootstrap tooltips and standard titles)
    const title =
        element.getAttribute("title") ||
        element.getAttribute("data-bs-original-title") ||
        element.getAttribute("data-original-title");

    if (!title || title.trim() === "") {
        throw new MissingAttributeError("title", element.outerHTML);
    }

    // 4. Extract action URL (Supports links or custom data attributes)
    const actionUrl =
        element.getAttribute("href") ||
        element.getAttribute("data-href") ||
        element.getAttribute("data-url");

    if (!actionUrl || actionUrl.trim() === "") {
        throw new MissingAttributeError("href or data-url", element.outerHTML);
    }

    // 5. Parse optional additional JSON data
    const additionalDataAttr = element.getAttribute("data-additional");
    let additionalData: Record<string, unknown> = {};

    if (additionalDataAttr) {
        try {
            additionalData = JSON.parse(additionalDataAttr) as Record<string, unknown>;
        } catch (error) {
            console.warn("[CRUDAction] Failed to parse data-additional attribute:", error);
        }
    }

    // 6. Resolve HTTP Method (Defaulting to PATCH if missing)
    let httpMethodRequestAction = element.getAttribute('data-http-method-request-action') as HttpMethod | undefined;

    if (!httpMethodRequestAction || (typeof httpMethodRequestAction === 'string' && httpMethodRequestAction.trim() === "")) {
        httpMethodRequestAction = "PATCH" as HttpMethod;
        console.warn("[CRUDAction] HTTP method missing, defaulting to 'PATCH'");
    }

    return {
        title,
        actionConfirmText,
        actionUrl,
        additionalData,
        httpMethodRequestAction
    };
}

/**
 * Validates that an element is not null/undefined
 * @private
 */
export function validateElement(element: HTMLElement | null | undefined): asserts element is HTMLElement {
    if (!element) {
        throw new TypeError("Element is required for extracting CRUDAction data");
    }
}

/**
 * Error thrown when CRUDAction  confirmation handling fails
 */
export class CRUDActionConfirmationError extends Error {
    constructor(message: string, public readonly cause?: Error) {
        super(message);
        this.name = "CRUDActionConfirmationError";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CRUDActionConfirmationError);
        }
    }
}