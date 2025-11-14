/**
 * jQuery interface for type safety
 * Minimal interface for the functions we use
 */
export interface JQueryStatic {
    (selector: string): JQueryElement;
}

export interface JQueryElement {
    length: number;
    attr(attributeName: string): string | undefined;
}

/**
 * Window interface extension for jQuery
 */
declare global {
    interface Window {
        jQuery: JQueryStatic;
    }
}

/**
 * Custom error for jQuery-related issues
 */
export class JQueryNotAvailableError extends Error {
    constructor(message: string = 'jQuery must be globally available for this function to work.') {
        super(message);
        this.name = 'JQueryNotAvailableError';
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, JQueryNotAvailableError);
        }
    }
}

/**
 * Validates that jQuery is available globally
 * 
 * @throws {JQueryNotAvailableError} If jQuery is not available
 * @private
 */
export function validateJQueryAvailability(): void {
    if (typeof window === 'undefined') {
        throw new JQueryNotAvailableError('Window object is not available. This function must run in a browser environment.');
    }

    if (typeof jQuery === "undefined" || typeof window.jQuery === "undefined") {
        throw new JQueryNotAvailableError('jQuery must be loaded and available globally (window.jQuery).');
    }
}
