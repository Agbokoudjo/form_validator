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
    validateJQueryAvailability,
    HttpMethod
} from "../_Utils";
import { CRUDActionEventDetail, CRUD_ACTION_CONFIRMED_EVENT } from "./event";

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
        eventName= CRUD_ACTION_CONFIRMED_EVENT,
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
            const customEvent = createCRUDActionEvent(eventName,crudActionData, element);
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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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
 * Checks if an element has all required CRUDAction attributes
 * 
 * @param element - DOM element to check
 * @returns True if element has all required attributes
 * 
 * @example
 * ```typescript
 * if (hasRequiredCRUDActionAttributes(element)) {
 *     const data = extractCRUDActionData(element);
 * }
 * ```
 */
export function hasRequiredCRUDActionAttributes(element: HTMLElement): boolean {
    try {
        validateElement(element);
        validateJQueryAvailability();

        const $element = jQuery(element);

        const hasActionConfirm = !!$element.attr("data-action-confirm");
        const hasTitle = !!($element.attr("title") || $element.attr("data-bs-original-title"));
        const hasUrl = !!($element.attr("href") || $element.attr("data-href") || $element.attr("data-url"));

        return hasActionConfirm && hasTitle && hasUrl;
    } catch {
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
            httpMethodRequestAction:crudActionData.httpMethodRequestAction
        }
    });
}

/**
 * Extracts and validates CRUD Action data from a DOM element
 * 
 * Uses jQuery internally for maximum browser compatibility (IE8+).
 * Validates all required attributes and parses additional data.
 * 
 * @param element - DOM element containing toggle data attributes
 * @returns Validated CRUD Action  data object
 * @throws {TypeError} If element is null or undefined
 * @throws {Error} If jQuery is not available
 * @throws {MissingAttributeError} If required attributes are missing
 * 
 * @example
 * ```typescript
 * const element = document.querySelector('.btn-toggle');
 * const data = extractCRUDActionData(element);
 * console.log(data.title); // "Toggle Account"
 * ```
 */
export function extractCRUDActionData(element: HTMLElement): ExtractedCRUDActionData {
    // Validate input
    validateElement(element);
    validateJQueryAvailability();

    // Convert to jQuery for compatibility
    const $element = jQuery(element);

    // Extract and validate data-action-confirm
    const actionConfirmText = $element.attr("data-action-confirm");
    if (!actionConfirmText || actionConfirmText.trim() === "") {
        throw new MissingAttributeError("data-action-confirm", element.outerHTML);
    }

    // Extract title (Bootstrap 5 compatible)
    const title =
        $element.attr("title") ||
        $element.attr("data-bs-original-title") ||
        $element.attr("data-original-title");

    if (!title || title.trim() === "") {
        throw new MissingAttributeError("title", element.outerHTML);
    }

    // Extract action URL
    const actionUrl =
        $element.attr("href") ||
        $element.attr("data-href") ||
        $element.attr("data-url");

    if (!actionUrl || actionUrl.trim() === "") {
        throw new MissingAttributeError("href or data-url", element.outerHTML);
    }

    // Parse additional data (optional)
    const additionalDataAttr = $element.attr("data-additional");
    let additionalData: Record<string, unknown> = {};

    if (additionalDataAttr) {
        try {
            additionalData = JSON.parse(additionalDataAttr) as Record<string, unknown>;
        } catch (error) {
            console.warn("[CRUDActionConfirmation] Failed to parse data-additional attribute:", error);
        }
    }

    let httpMethodRequestAction = $element.attr('data-http-method-request-action') as HttpMethod | undefined;

    if (!httpMethodRequestAction || (typeof httpMethodRequestAction === 'string' && httpMethodRequestAction.trim() === "")) {
        httpMethodRequestAction = "PATCH" as HttpMethod;
        console.warn("The HTTP method for sending the request for CRUDAction is missing in the attribute, but by default the HTTP method used is 'PATCH'");
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
        this.name = " CRUDActionConfirmationError";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CRUDActionConfirmationError);
        }
    }
}