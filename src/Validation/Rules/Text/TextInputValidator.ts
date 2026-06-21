/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { AbstractFieldValidator } from "../FieldValidator";
import { escapeHtmlBalise, deepMerge } from "../../../_Utils";
import type { TextInputOptions } from "../../types";
import { SmartHtmlSecurityValidator } from "./SmartHtmlSecurityValidator";

/**
 * Configuration error messages (centralized, localizable)
 */
const CONFIG_ERRORS = {
    RICH_TEXT_REQUIRES_TAGS:
        `Security mode "rich-text" requires allowedHtmlTags to be configured.`+
        `[FieldInputController] Security mode "rich-text" requires data-allowed-tags attribute. ` +
        `Example: data-allowed-tags="p,strong,em,a"`,
    
    RICH_TEXT_REQUIRES_ATTRIBUTES:
        'Security mode "rich-text" requires allowedHtmlAttributes to be configured.' +
        `[FieldInputController] Security mode "rich-text" requires allowed attributes. ` +
        `Provide either data-allowed-html-attributes (JSON) or data-allowed-attrs-for-* attributes.`,
    SAFE_HTML_REQUIRES_TAGS:
        'Security mode "safe-html" requires allowedHtmlTags to be configured.'+
        `[FieldInputController] Security mode "safe-html" requires data-allowed-tags attribute. ` +
        `Example: data-allowed-tags="p,strong,em,a"`
};

/**
 * Validation result that includes both validation state and sanitized content.
 * This allows the caller to update the textarea or form field with cleaned content.
 */
interface ValidationResult {
    isValid: boolean;
    errorMessage?: string;
    sanitizedContent?: string; // Cleaned content (if sanitization was used)
}

/**
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class TextInputValidator
 * @extends AbstractFieldValidator
 */
export class TextInputValidator extends AbstractFieldValidator {
    private static instance: TextInputValidator;
    // No singleton pattern - dependency injection preferred
    public readonly htmlSecurityValidator: SmartHtmlSecurityValidator;

    protected constructor(htmlSecurityValidator?: SmartHtmlSecurityValidator) {
        super();
        this.htmlSecurityValidator =
            htmlSecurityValidator || new SmartHtmlSecurityValidator();
    }

    /**
    * Retrieves the single static instance of the TextInputValidator.
    * Implements the Singleton pattern.
    * @returns {TextInputValidator} The unique instance of the validator.
    */
    public static getInstance(): TextInputValidator {
        if (!TextInputValidator.instance) {
            TextInputValidator.instance = new TextInputValidator();
        }
        return TextInputValidator.instance;
    }

    /**
     * Validates a text input field.
     *
     * Performs sequential validation steps:
     * 1. Clear previous state
     * 2. Normalize input value
     * 3. Validate required field status
     * 4. Validate HTML/XSS security (based on security mode)
     * 5. Validate regex pattern
     * 6. Validate length constraints
     *
     * @param inputValue - The string value to validate (can be undefined)
     * @param fieldName - The name/key of the input field in the form
     * @param inputOptions - Validation configuration options
     * @param ignoreMergeWithDefaultOptions - If true, skip merging with defaults
     *
     * @returns The validator instance (for chaining)
     *
     * @throws Error if configuration is invalid (checked upfront)
     */
    public validate(
        inputValue: string | undefined,
        fieldName: string,
        inputOptions: TextInputOptions,
        ignoreMergeWithDefaultOptions: boolean = false
    ): this {
        // Normalize options early
        const options = this.normalizeOptions(
            inputOptions,
            ignoreMergeWithDefaultOptions
        );

        // Validate configuration upfront (fail fast)
        this.validateConfiguration(options);

        // Clear state (assume valid until proven otherwise)
        this.formErrorStore.clearFieldState(fieldName);

        //Normalize and convert input value
        const normalizedValue = this.normalizeValue(inputValue);

        //Required field validation (short-circuit if empty)
        if (!normalizedValue || normalizedValue.trim() === "") {
            this.requiredValidator(normalizedValue, fieldName, options.requiredInput);
            if (!this.formErrorStore.isFieldValid(fieldName)) {
                return this; // Stop here if required validation failed
            }
        }

        // From this point, we know we have a non-empty string
        const safeValue = normalizedValue ? normalizedValue.trim() : "";

        //HTML/XSS security validation
        this.validateHtmlSecurity(safeValue, fieldName, options);
        if (!this.formErrorStore.isFieldValid(fieldName)) {
            return this;
        }

        //Escape/strip HTML if needed (strict mode only)
        let processedValue = this.processValue(safeValue, options);

        //Regex pattern validation
        this.validateRegexPattern(processedValue, fieldName, options);
        if (!this.formErrorStore.isFieldValid(fieldName)) {
            return this;
        }

        //Length validation
        this.lengthValidator(processedValue, fieldName, options.minLength,options.maxLength);

        return this;
    }

    /**
     * Get default validation options.
     */
    private get defaultOptions(): TextInputOptions {
        return {
            requiredInput: true,
            minLength: 1,
            maxLength: 255,
            typeInput: "text",
            errorMessageInput:
                "The content of this field must contain only alphabetical letters",
            escapestripHtmlAndPhpTags: true,
            regexValidator: /^\p{L}+$/iu,
            match: true,
            securityMode: "strict"
        };
    }

    /**
     * Merges the provided options with the default options based on the control flag.
     * @param {TextInputOptions} userOptions - The options provided by the caller.
     * @param {boolean} ignoreDefaults - If true, ignores default options and uses only userOptions.
     * @returns {TextInputOptions} The final set of options to be used for validation.
     */
    private normalizeOptions(
        userOptions: TextInputOptions,
        ignoreDefaults: boolean
    ): TextInputOptions {
        if (ignoreDefaults) {
            return userOptions;
        }

        return deepMerge<TextInputOptions, TextInputOptions>(
            userOptions,
            this.defaultOptions
        );
    }

    /**
     * Validate configuration options upfront (fail fast).
     *
     * @throws Error if configuration is invalid
     */
    private validateConfiguration(options: TextInputOptions): void {
        const mode = options.securityMode || "strict";

        if (mode === "rich-text") {
            if (!options.allowedHtmlTags || options.allowedHtmlTags.length === 0) {
                throw new Error(CONFIG_ERRORS.RICH_TEXT_REQUIRES_TAGS);
            }
            if (
                !options.allowedHtmlAttributes ||
                Object.keys(options.allowedHtmlAttributes).length === 0
            ) {
                throw new Error(CONFIG_ERRORS.RICH_TEXT_REQUIRES_ATTRIBUTES);
            }
        }

        if (mode === "safe-html") {
            if (!options.allowedHtmlTags || options.allowedHtmlTags.length === 0) {
                throw new Error(CONFIG_ERRORS.SAFE_HTML_REQUIRES_TAGS);
            }
        }
    }

    /**
     * HTML/XSS security validation based on security mode.
     */
    private validateHtmlSecurity(
        value: string,
        fieldName: string,
        options: TextInputOptions
    ): void {
        const mode = options.securityMode || "strict";

        if (mode === "strict") {
            const error = this.htmlSecurityValidator.validateStrict(value);
            if (error) {
                this.setValidationState(false,error,fieldName);
            }
            return;
        }

        if (mode === "safe-html") {
            const allowedTags = options.allowedHtmlTags || [];
            const error = this.htmlSecurityValidator.validateSafeHtml(
                value,
                allowedTags
            );
            if (error) {
                this.setValidationState(false, error, fieldName);
            }
            return;
        }

        if (mode === "rich-text") {
            const allowedTags = options.allowedHtmlTags || [];
            const allowedAttributes = options.allowedHtmlAttributes || {};
            const error = this.htmlSecurityValidator.validateRichText(value, {
                allowedTags,
                allowedAttributes
            });
            if (error) {
                this.setValidationState(false, error, fieldName);
            }
        }
    }

    /**
     * Process value (escape/strip HTML if needed).
     */
    private processValue(
        value: string,
        options: TextInputOptions
    ): string {
        const mode = options.securityMode || "strict";

        if (
            mode === "strict" &&
            options.escapestripHtmlAndPhpTags &&
            value.length > 0
        ) {
            // Assumes escapeHtmlBalise is a global/imported function
            return escapeHtmlBalise(value) as string;
        }

        return value;
    }
}

export const textInputValidator = TextInputValidator.getInstance();

/**
 * @class TextareaValidator
 * @extends AbstractFieldValidator
 * Improvements:
 * - Handles sanitization properly (returns cleaned content)
 * - Clear distinction between validation and sanitization modes
 * - Better error handling
 * - Delegates to TextInputValidator cleanly
 */
export class TextareaValidator extends AbstractFieldValidator {
    private static instance: TextareaValidator;

    private readonly textInputValidator: TextInputValidator;

    protected constructor(textInputValidator: TextInputValidator) {
        super();
        this.textInputValidator =textInputValidator;
    }

    public static getInstance(textInputValidator: TextInputValidator): TextareaValidator {
        if (!TextareaValidator.instance) {
            TextareaValidator.instance = new TextareaValidator(textInputValidator);
        }

        return TextareaValidator.instance;
    }

    /**
     * Validate textarea content.
     *
     * Supports three security modes:
     * - strict: Plain text, HTML/PHP tags removed
     * - safe-html: Only whitelisted tags, no attributes
     * - rich-text: Whitelisted tags with controlled attributes
     *
     * Can operate in two modes:
     * - Validation: Reject invalid content (strict)
     * - Sanitization: Clean invalid content and accept (WYSIWYG-friendly)
     *
     * @returns this for chaining
     */
    public validate(
        inputValue: string | undefined,
        fieldName: string,
        inputOptions: TextInputOptions,
        ignoreMergeWithDefaultOptions: boolean = true
    ): this {
        //Run base text input validation
        this.textInputValidator.validate(
            inputValue,
            fieldName,
            inputOptions,
            ignoreMergeWithDefaultOptions
        );

        // Stop if base validation failed
        if (!this.formErrorStore.isFieldValid(fieldName)) {
            return this;
        }

        // At this point, value is guaranteed to be a valid string
        const value = (inputValue as string) || "";

        // Run security-mode-specific validation
        const mode = inputOptions.securityMode || "strict";

        if (mode === "safe-html") {
            this.validateSafeHtmlMode(value, fieldName, inputOptions);
        } else if (mode === "rich-text") {
            this.validateRichTextMode(value, fieldName, inputOptions);
        }

        return this;
    }

    /**
     * Validate safe-html mode: whitelisted tags only, no attributes.
     */
    private validateSafeHtmlMode(
        value: string,
        fieldName: string,
        options: TextInputOptions
    ): this {
        const allowedTags = options.allowedHtmlTags || [];

        if (allowedTags.length === 0) {
            throw new Error(CONFIG_ERRORS.SAFE_HTML_REQUIRES_TAGS);
        }

        const error = this.textInputValidator
            .htmlSecurityValidator.validateSafeHtml(value, allowedTags);

        if (error) {
            if (options.sanitizeInsteadOfReject) {
                // Sanitization mode: clean the content
                const cleaned = this.textInputValidator
                    .htmlSecurityValidator.stripUnallowedTags(value, allowedTags);
                value = cleaned;
                this.setValue(value, fieldName)
                console.log("[TextareaValidator] Content sanitized (safe-html mode)");
            } else {
                // Validation mode: reject invalid content
                this.setValidationState(false, error, fieldName);
            }
        }

        return this;
    }

    /**
     * Validate rich-text mode: whitelisted tags + controlled attributes.
     */
    private validateRichTextMode(
        value: string,
        fieldName: string,
        options: TextInputOptions
    ): this {
        const allowedTags = options.allowedHtmlTags || [];
        const allowedAttributes = options.allowedHtmlAttributes || {};

        // Validate configuration
        if (allowedTags.length === 0) {
            throw new Error(CONFIG_ERRORS.RICH_TEXT_REQUIRES_TAGS);
        }

        if (Object.keys(allowedAttributes).length === 0) {
            throw new Error(CONFIG_ERRORS.RICH_TEXT_REQUIRES_ATTRIBUTES);
        }

        const error = this.textInputValidator
            .htmlSecurityValidator.validateRichText(value, {
                allowedTags,
                allowedAttributes
            });

        if (error) {
            if (options.sanitizeInsteadOfReject) {
                // Sanitization mode: clean and accept
                const sanitized = this.textInputValidator
                    .htmlSecurityValidator.sanitizeRichText(value, {
                        allowedTags,
                        allowedAttributes,
                        stripDangerousAttributes: true
                    });
                value = sanitized
                this.setValue(value, fieldName)
                console.log("[TextareaValidator] Content sanitized (rich-text mode)");
            } else {
                // Validation mode: reject invalid content
                this.setValidationState(false, error, fieldName);
            }
        }

        return this;
    }
}

export const textareaInputValidator = TextareaValidator.getInstance(textInputValidator);


import type { IsbnOptions, IsbnValidationResult, IsbnErrorCode } from '../../types';

/**
 *  ISBN Validator for @wlindabla/form_validator
 * 
 * Validates ISBN-10 and ISBN-13 formats with checksum verification.
 * Inspired by Symfony's IsbnValidator component.
 *
 * ISBN Validator
 * 
 * Validates ISBN-10 and ISBN-13 numbers with:
 * - Format validation (regex)
 * - Checksum verification
 * - Hyphen/space handling
 * - Type-specific validation
 * 
 * @extends AbstractFieldValidator
 * @example
 * ```typescript
 * import { isbnValidator } from '@wlindabla/form_validator/validation/rules/text';
 * 
 * // Basic usage
 * isbnValidator.validate('978-3-16-148410-0', 'isbn', { type: 'isbn13' });
 * 
 * // Check result
 * if (isbnValidator.formErrorStore.isFieldValid('isbn')) {
 *   console.log('ISBN is valid!');
 * } else {
 *   console.log(isbnValidator.formErrorStore.getFieldErrors('isbn'));
 * }
 * ```
 */
export class IsbnValidator extends AbstractFieldValidator {
    private static instance: IsbnValidator;

    protected constructor() { super(); }

    /**
     * Get the singleton instance of IsbnValidator
     * @returns {IsbnValidator} The unique instance
     */
    public static getInstance(): IsbnValidator {
        if (!IsbnValidator.instance) {
            IsbnValidator.instance = new IsbnValidator();
        }
        return IsbnValidator.instance;
    }

    /**
     * Validate an ISBN number
     * 
     * @param value - The ISBN value to validate
     * @param targetInputName - The field name/identifier
     * @param options - Validation options
     * @returns {this} For method chaining
     * 
     * @example
     * ```typescript
     * isbnValidator.validate('0-306-40615-2', 'isbn10Field', {
     *   type: 'isbn10',
     *   requiredInput: true,
     *   egAwait: '0-306-40615-2'
     * });
     * ```
     */
    public validate = (
        value: string | undefined,
        targetInputName: string,
        options: IsbnOptions = {}
    ): this => {

        const mergedOptions = this.mergeOptions(options);

        // Clear previous state
        this.formErrorStore.clearFieldState(targetInputName);

        // Type conversion and validation
        let rawValue = this.getRawStringValue(value);

        // Required field check
        if (!rawValue || rawValue.trim() === '') {
            this.requiredValidator(rawValue, targetInputName, mergedOptions.requiredInput ?? true);

            // Short-circuit if required and empty
            if (!this.formErrorStore.isFieldValid(targetInputName)) {
                return this;
            }
        }

        // Empty value is valid if not required
        if (!rawValue || rawValue.trim() === '') {
            return this;
        }

        rawValue = escapeHtmlBalise(rawValue) as string;
        // Validate the ISBN
        const result = this.validateIsbn(rawValue, mergedOptions);

        if (!result.isValid) {
            const errorMessage = result.errorMessage || mergedOptions.errorMessageInput ||
                this.getDefaultErrorMessage(mergedOptions.type || 'both');

            return this.setValidationState(false, errorMessage, targetInputName);
        }

        // Success
        this.formErrorStore.setFieldValid(targetInputName, true);
        return this;
    };

    /**
     * Core ISBN validation logic
     * @private
     */
    private validateIsbn(
        rawValue: string,
        options: IsbnOptions
    ): IsbnValidationResult {

        const type = options.type || 'both';

        // Clean the ISBN (remove hyphens and spaces)
        const cleaned = this.cleanIsbn(rawValue, options);

        if (!cleaned.isValid) {
            return {
                isValid: false,
                errorCode: cleaned.errorCode as IsbnErrorCode,
                errorMessage: cleaned.errorMessage
            };
        }

        const isbn = cleaned.cleanedValue!;

        // Try ISBN-10
        if (type === 'isbn10' || type === 'both') {
            const isbn10Result = this.validateIsbn10(isbn);
            if (isbn10Result.isValid) {
                return { ...isbn10Result, cleanedValue: isbn };
            }

            // If type is explicitly isbn10, return error
            if (type === 'isbn10') {
                return {
                    isValid: false,
                    errorCode: isbn10Result.errorCode,
                    errorMessage: options.isbn10Message || 'This value is not a valid ISBN-10.'
                };
            }
        }

        // Try ISBN-13
        if (type === 'isbn13' || type === 'both') {
            const isbn13Result = this.validateIsbn13(isbn);
            if (isbn13Result.isValid) {
                return { ...isbn13Result, cleanedValue: isbn };
            }

            // If type is explicitly isbn13, return error
            if (type === 'isbn13') {
                return {
                    isValid: false,
                    errorCode: isbn13Result.errorCode,
                    errorMessage: options.isbn13Message || 'This value is not a valid ISBN-13.'
                };
            }
        }

        // Both failed
        return {
            isValid: false,
            errorCode: 'type_not_recognized_error' as IsbnErrorCode,
            errorMessage: options.bothIsbnMessage || 'This value is neither a valid ISBN-10 nor a valid ISBN-13.'
        };
    }

    /**
     * Clean ISBN string (remove hyphens and spaces)
     * @private
     */
    private cleanIsbn(
        value: string,
        options: IsbnOptions
    ): { isValid: boolean; cleanedValue?: string; errorCode?: IsbnErrorCode; errorMessage?: string } {

        let cleaned = value;

        // Remove spaces if allowed
        if (options.allowSpaces !== false) {
            cleaned = cleaned.replace(/\s+/g, '');
        } else if (/\s+/.test(cleaned)) {
            return {
                isValid: false,
                errorCode: 'invalid_characters_error' as IsbnErrorCode,
                errorMessage: 'Spaces are not allowed in ISBN numbers.'
            };
        }

        // Remove hyphens if allowed
        if (options.allowHyphens !== false) {
            cleaned = cleaned.replace(/-/g, '');
        } else if (/-/.test(cleaned)) {
            return {
                isValid: false,
                errorCode: 'invalid_characters_error' as IsbnErrorCode,
                errorMessage: 'Hyphens are not allowed in ISBN numbers.'
            };
        }

        return { isValid: true, cleanedValue: cleaned };
    }

    /**
     * Validate ISBN-10 format and checksum
     * @private
     */
    private validateIsbn10(isbn: string): Omit<IsbnValidationResult, 'cleanedValue'> {

        const isbn10Regex = /^(?:\d{9}[\dXx])$/;

        // Format check
        if (!isbn10Regex.test(isbn)) {
            if (isbn.length < 10) {
                return {
                    isValid: false,
                    type: 'isbn10',
                    errorCode: 'too_short_error' as IsbnErrorCode
                };
            } else if (isbn.length > 10) {
                return {
                    isValid: false,
                    type: 'isbn10',
                    errorCode: 'too_long_error' as IsbnErrorCode
                };
            } else {
                return {
                    isValid: false,
                    type: 'isbn10',
                    errorCode: 'invalid_characters_error' as IsbnErrorCode
                };
            }
        }

        // Checksum validation
        if (!this.verifyIsbn10Checksum(isbn)) {
            return {
                isValid: false,
                type: 'isbn10',
                errorCode: 'checksum_failed_error' as IsbnErrorCode
            };
        }

        return { isValid: true, type: 'isbn10' };
    }

    /**
     * Verify ISBN-10 checksum
     * @private
     */
    private verifyIsbn10Checksum(isbn10: string): boolean {

        let checksum = 0;

        // Process first 9 digits
        for (let i = 0; i < 9; i++) {
            checksum += (i + 1) * parseInt(isbn10[i], 10);
        }

        // Process check digit (can be 0-9 or X)
        const lastChar = isbn10[9].toUpperCase();
        if (lastChar === 'X') {
            checksum += 10 * 10;
        } else {
            checksum += 10 * parseInt(lastChar, 10);
        }

        return checksum % 11 === 0;
    }

    /**
     * Validate ISBN-13 format and checksum
     * @private
     */
    private validateIsbn13(isbn: string): Omit<IsbnValidationResult, 'cleanedValue'> {

        const isbn13Regex = /^\d{13}$/;

        // Format check
        if (!isbn13Regex.test(isbn)) {
            if (isbn.length < 13) {
                return {
                    isValid: false,
                    type: 'isbn13',
                    errorCode: 'too_short_error' as IsbnErrorCode
                };
            } else if (isbn.length > 13) {
                return {
                    isValid: false,
                    type: 'isbn13',
                    errorCode: 'too_long_error' as IsbnErrorCode
                };
            } else {
                return {
                    isValid: false,
                    type: 'isbn13',
                    errorCode: 'invalid_characters_error' as IsbnErrorCode
                };
            }
        }

        // Checksum validation
        if (!this.verifyIsbn13Checksum(isbn)) {
            return {
                isValid: false,
                type: 'isbn13',
                errorCode: 'checksum_failed_error' as IsbnErrorCode
            };
        }

        return { isValid: true, type: 'isbn13' };
    }

    /**
     * Verify ISBN-13 checksum
     * @private
     */
    private verifyIsbn13Checksum(isbn13: string): boolean {

        let checksum = 0;
        const factors = [1, 3];

        // Calculate weighted sum of first 12 digits
        for (let i = 0; i < 12; i++) {
            checksum += factors[i % 2] * parseInt(isbn13[i], 10);
        }

        // Calculate and verify check digit
        const calculatedCheckDigit = (10 - (checksum % 10)) % 10;
        const providedCheckDigit = parseInt(isbn13[12], 10);

        return calculatedCheckDigit === providedCheckDigit;
    }

    /**
     * Get default error message based on ISBN type
     * @private
     */
    private getDefaultErrorMessage(type: string): string {
        switch (type) {
            case 'isbn10':
                return 'This value is not a valid ISBN-10.';
            case 'isbn13':
                return 'This value is not a valid ISBN-13.';
            default:
                return 'This value is neither a valid ISBN-10 nor a valid ISBN-13.';
        }
    }

    /**
     * Merge user options with defaults
     * @private
     */
    private mergeOptions(userOptions: IsbnOptions): IsbnOptions {
        return {
            type: userOptions.type ?? 'both',
            requiredInput: userOptions.requiredInput ?? true,
            allowHyphens: userOptions.allowHyphens ?? true,
            allowSpaces: userOptions.allowSpaces ?? true,
            isbn10Message: userOptions.isbn10Message,
            isbn13Message: userOptions.isbn13Message,
            bothIsbnMessage: userOptions.bothIsbnMessage,
            errorMessageInput: userOptions.errorMessageInput,
            egAwait: userOptions.egAwait
        };
    }
}

/**
 * Singleton instance of IsbnValidator
 * @type {IsbnValidator}
 */
export const isbnValidator = IsbnValidator.getInstance();

import type {
    CardSchemeOptions,
    CardSchemeType,
    CardSchemeErrorCode,
    CardSchemeValidationResult,
} from '../../types';
import { verifyLuhn } from "./utils";

// Mirrors Symfony's CardSchemeValidator::$schemes array exactly.
// Each scheme maps to one or more regex patterns (as in Symfony).
// Patterns use \d instead of [0-9] for readability; behaviour is identical.
// @see https://en.wikipedia.org/wiki/Payment_card_number
const CARD_SCHEME_REGEXES: Record<CardSchemeType, RegExp[]> = {
    // American Express: starts with 34 or 37, 15 digits total.
    AMEX: [/^3[47][0-9]{13}$/],

    // China UnionPay: starts with 62, 16–19 digits.
    // NOTE: Does NOT follow Luhn algorithm — exempt from checksum.
    CHINA_UNIONPAY: [/^62[0-9]{14,17}$/],

    // Diners Club: starts with 300–305, 36, or 38. 14 digits.
    // Joint ventures with MasterCard (prefix 5, 16 digits) handled separately.
    DINERS: [/^3(?:0[0-5]|[68][0-9])\d{11}$/],

    // Discover: starts with 6011, 622126–622925, 644–649, or 65. 16 digits.
    DISCOVER: [
        /^6011[0-9]{12}$/,
        /^64[4-9][0-9]{13}$/,
        /^65[0-9]{14}$/,
        /^622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|91[0-9]|92[0-5])[0-9]{10}$/,
    ],

    // InstaPayment: starts with 637–639, 16 digits.
    INSTAPAYMENT: [/^63[7-9][0-9]{13}$/],

    // JCB: starts with 2131 or 1800 (15 digits), or 35xxxx (16 digits).
    JCB: [/^(?:2131|1800|35[0-9]{3})[0-9]{11}$/],

    // Laser: starts with 6304, 6706, 6709, or 6771. 16–19 digits.
    LASER: [/^(6304|670[69]|6771)[0-9]{12,15}$/],

    // Maestro International: starts with 675900–675999, 12–19 digits.
    // Maestro UK: starts with 500000–509999 or 560000–699999, 12–19 digits.
    MAESTRO: [
        /^(6759[0-9]{2})[0-9]{6,13}$/,
        /^(50[0-9]{4})[0-9]{6,13}$/,
        /^5[6-9][0-9]{10,17}$/,
        /^6[0-9]{11,18}$/,
    ],

    // MasterCard: starts with 51–55 (16 digits), or 222100–272099 (Oct 2016+).
    MASTERCARD: [
        /^5[1-5][0-9]{14}$/,
        /^2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[01][0-9]{13}|720[0-9]{12})$/,
    ],

    // MIR (Russian payment system): starts with 2200–2204, 16–19 digits.
    MIR: [/^220[0-4][0-9]{12,15}$/],

    // UATP: starts with 1, 15 digits total.
    UATP: [/^1[0-9]{14}$/],

    // Visa: starts with 4, 13, 16, or 19 digits.
    VISA: [/^4([0-9]{12}|[0-9]{15}|[0-9]{18})$/],
};

// Schemes exempt from the Luhn checksum algorithm.
const LUHN_EXEMPT_SCHEMES: CardSchemeType[] = ['CHINA_UNIONPAY'];

/**
 * Validates credit/debit card numbers against one or more card schemes.
 *
 * Inspired by Symfony's CardSchemeValidator component, adapted for
 * JavaScript/TypeScript with full Luhn checksum support and the same
 * scheme registry (AMEX, VISA, MASTERCARD, etc.).
 *
 * Works identically in Browser and Node.js environments —
 * environment adaptation is handled upstream by the existing adapters.
 *
 * @extends AbstractFieldValidator
 *
 * @example
 * ```typescript
 * import { cardSchemeValidator } from '@wlindabla/form_validator/validation/rules/text';
 *
 * // Validate against a single scheme
 * cardSchemeValidator.validate('4111111111111111', 'cardNumber', {
 *     schemes: 'VISA',
 *     requiredInput: true,
 * });
 *
 * if (cardSchemeValidator.formErrorStore.isFieldValid('cardNumber')) {
 *     console.log('Valid VISA card!');
 * } else {
 *     console.log(cardSchemeValidator.formErrorStore.getFieldErrors('cardNumber'));
 * }
 *
 * // Validate against multiple schemes
 * cardSchemeValidator.validate('5500005555555559', 'cardNumber', {
 *     schemes: ['VISA', 'MASTERCARD'],
 * });
 *
 * // Accept any known card (no schemes restriction)
 * cardSchemeValidator.validate('378282246310005', 'cardNumber', {});
 * ```
 */
export class CardSchemeValidator extends AbstractFieldValidator {
    private static instance: CardSchemeValidator;

    protected constructor() { super(); }
    /**
     * Returns the singleton instance of CardSchemeValidator.
     */
    public static getInstance(): CardSchemeValidator {
        if (!CardSchemeValidator.instance) {
            CardSchemeValidator.instance = new CardSchemeValidator();
        }
        return CardSchemeValidator.instance;
    }

    /**
     * Validates a card number field.
     *
     * Validation pipeline:
     * 1. Clear previous state
     * 2. Normalize & required check
     * 3. Non-numeric guard (mirrors Symfony's NOT_NUMERIC_ERROR)
     * 4. Sanitize (strip spaces/hyphens)
     * 5. Scheme regex match
     * 6. Luhn checksum (unless exempt)
     *
     * @param value          - Raw card number string (may contain spaces/hyphens)
     * @param targetInputName - Field name / key in the error store
     * @param options        - Validation configuration
     * @returns {this}       - For method chaining
     */
    public validate(
        value: string | undefined,
        targetInputName: string,
        options: CardSchemeOptions = {}
    ): this {
        const mergedOptions = this.mergeOptions(options);

        // 1 — Clear previous state
        this.formErrorStore.clearFieldState(targetInputName);

        // 2 — Normalize raw value
        let rawValue = this.getRawStringValue(value);

        // Required check
        if (!rawValue || rawValue.trim() === '') {
            this.requiredValidator(rawValue, targetInputName, mergedOptions.requiredInput);
            if (!this.formErrorStore.isFieldValid(targetInputName)) {
                return this;
            }
            // Not required + empty → valid
            return this;
        }

        // XSS guard — consistent with IsbnValidator
        rawValue = escapeHtmlBalise(rawValue) as string;

        // 3 — Sanitize: strip spaces and hyphens
        const sanitized = mergedOptions.sanitize !== false
            ? rawValue.replace(/[\s\-]+/g, '')
            : rawValue;

        // 4 — Non-numeric guard (mirrors Symfony's NOT_NUMERIC_ERROR)
        if (!/^[0-9]+$/.test(sanitized)) {
            return this.setValidationState(
                false,
                this.buildCardErrorMessage('NOT_NUMERIC_ERROR', mergedOptions),
                targetInputName
            );
        }

        // 5 — Resolve target schemes
        const targetSchemes = this.resolveSchemes(mergedOptions.schemes);

        // 6 — Scheme regex validation
        const result = this.validateAgainstSchemes(sanitized, targetSchemes, mergedOptions);

        if (!result.isValid) {
            return this.setValidationState(
                false,
                result.errorMessage ?? this.buildCardErrorMessage('INVALID_FORMAT_ERROR', mergedOptions),
                targetInputName
            );
        }

        // Success
        this.formErrorStore.setFieldValid(targetInputName, true);
        return this;
    }

    /**
     * Exposes the full scheme registry.
     * Useful for custom integrations or unit tests.
     */
    public static get schemes(): Record<CardSchemeType, RegExp[]> {
        return CARD_SCHEME_REGEXES;
    }

    /**
     * Runs only the Luhn checksum on a sanitized (digits-only) card number.
     * Useful for quick programmatic checks without the full validator pipeline.
     *
     * @param sanitized - Digits-only card number string
     */
    public static luhnCheck(sanitized: string): boolean {
        return verifyLuhn(sanitized);
    }

    /**
     * Resolves the list of schemes to test against.
     * If none provided → test ALL known schemes.
     */
    private resolveSchemes(
        schemes: CardSchemeOptions['schemes']
    ): CardSchemeType[] {
        if (!schemes || (Array.isArray(schemes) && schemes.length === 0)) {
            return Object.keys(CARD_SCHEME_REGEXES) as CardSchemeType[];
        }
        return Array.isArray(schemes) ? schemes : [schemes];
    }

    /**
     * Tests the sanitized card number against the resolved scheme regexes.
     * On first regex match, optionally runs Luhn (unless scheme is exempt).
     *
     * Mirrors exactly the nested loop in Symfony's CardSchemeValidator::validate().
     */
    private validateAgainstSchemes(
        sanitized: string,
        targetSchemes: CardSchemeType[],
        options: Required<CardSchemeOptions>
    ): CardSchemeValidationResult {

        for (const scheme of targetSchemes) {
            const regexes = CARD_SCHEME_REGEXES[scheme];

            if (!regexes) {
                // Unknown scheme — skip gracefully
                continue;
            }

            for (const regex of regexes) {
                if (regex.test(sanitized)) {
                    // Format matched — now run Luhn unless exempt or disabled
                    if (
                        options.luhnCheck &&
                        !LUHN_EXEMPT_SCHEMES.includes(scheme)
                    ) {
                        if (!verifyLuhn(sanitized)) {
                            return {
                                isValid: false,
                                errorCode: 'INVALID_FORMAT_ERROR',
                                errorMessage: options.errorMessageInput ??
                                    'Unsupported card type or invalid card number.',
                                detectedScheme: scheme,
                                cleanedValue: sanitized,
                            };
                        }
                    }

                    // All checks passed for this scheme
                    return {
                        isValid: true,
                        detectedScheme: scheme,
                        cleanedValue: sanitized,
                    };
                }
            }
        }

        // No scheme matched
        return {
            isValid: false,
            errorCode: 'INVALID_FORMAT_ERROR',
            errorMessage: options.errorMessageInput ??
                'Unsupported card type or invalid card number.',
        };
    }

    /**
     * Builds a localized error message for a given error code.
     */
    private buildCardErrorMessage(
        code: CardSchemeErrorCode,
        options: Required<CardSchemeOptions>
    ): string {
        if (options.errorMessageInput) {
            return options.errorMessageInput;
        }

        const messages: Record<CardSchemeErrorCode, string> = {
            NOT_NUMERIC_ERROR:
                'The card number must contain digits only (spaces and hyphens are allowed as separators).',
            INVALID_FORMAT_ERROR:
                'Unsupported card type or invalid card number.',
            MISSING_SCHEMES_ERROR:
                'At least one card scheme must be specified.',
        };

        let message = messages[code];

        if (options.egAwait) {
            message += ` e.g.: ${options.egAwait}`;
        }

        return message;
    }

    /**
     * Merges user options with safe defaults.
     */
    private mergeOptions(userOptions: CardSchemeOptions): Required<CardSchemeOptions> {
        return {
            schemes: userOptions.schemes ?? [],
            requiredInput: userOptions.requiredInput ?? true,
            errorMessageInput: userOptions.errorMessageInput ?? '',
            egAwait: userOptions.egAwait ?? '',
            sanitize: userOptions.sanitize ?? true,
            luhnCheck: userOptions.luhnCheck ?? true,
        };
    }
}

/**
 * Singleton instance of CardSchemeValidator.
 * @example
 * ```typescript
 * import { cardSchemeValidator } from '@wlindabla/form_validator/validation/rules/text';
 *
 * cardSchemeValidator.validate('4111111111111111', 'card', { schemes: 'VISA' });
 * console.log(cardSchemeValidator.formErrorStore.isFieldValid('card')); // true
 * ```
 */
export const cardSchemeValidator = CardSchemeValidator.getInstance();


import type { IconOptions, IconValidationResult, IconErrorCode } from '../../types';

/**
 * Default regex patterns for emoji/icon validation
 * Supports emoji ranges from Unicode 1F300 to 1FAFF (+ many subranges)
 */
const DEFAULT_ICON_PATTERNS = {
    /**
     * Comprehensive emoji support: emoji symbols, emoticons, decorative symbols
     * Includes: Zero-Width Joiner sequences, skin tone modifiers, flags
     */
    emoji: /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}\u{1F1E0}-\u{1F1FF}\u{200D}\u{20E3}\u{FE0F}]+$/u,

    /**
     * Lightweight: Just basic emojis (1F300-1FAFF range)
     */
    emojiBasic: /^[\u{1F300}-\u{1FAFF}]+$/u,

    /**
     * Single emoji only (stricter)
     */
    emojiSingle: /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}](?:\u{200D}[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}])*$/u,

    /**
     * Font Awesome / Material Icon-like class names (optional)
     * Matches: fa-heart, mdi-star, ri-home-line, etc.
     */
    iconClassName: /^[a-z0-9]+-[a-z0-9]+(-[a-z0-9]+)*$/i,
};

/**
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class IconValidator
 * @extends AbstractFieldValidator
 * 
 * Validates emoji and icon characters:
 * - Unicode emoji ranges
 * - Skin tone modifiers & ZWJ sequences
 * - Icon class names (fa-*, mdi-*, ri-*)
 * - Length constraints
 * - Custom regex patterns
 * 
 * @example
 * ```typescript
 * import { iconValidator } from '@wlindabla/form_validator/validation/rules/text';
 * 
 * // Simple emoji validation
 * iconValidator.validate('📖', 'icon', { mode: 'emoji' });
 * 
 * // With length constraint
 * iconValidator.validate('📖✍️🎭', 'icon', { 
 *   mode: 'emoji',
 *   maxCount: 3,
 *   requiredInput: true 
 * });
 * 
 * // Check result
 * if (iconValidator.formErrorStore.isFieldValid('icon')) {
 *   console.log('✅ Icon is valid!');
 * } else {
 *   console.log(iconValidator.formErrorStore.getFieldErrors('icon'));
 * }
 * ```
 */
export class IconValidator extends AbstractFieldValidator {
    private static instance: IconValidator;

    protected constructor() { super(); }

    /**
     * Get the singleton instance of IconValidator
     * @returns {IconValidator} The unique instance
     */
    public static getInstance(): IconValidator {
        if (!IconValidator.instance) {
            IconValidator.instance = new IconValidator();
        }
        return IconValidator.instance;
    }

    /**
     * Validates an icon/emoji input
     * 
     * Pipeline:
     * 1. Clear previous state
     * 2. Normalize & required check
     * 3. XSS guard (escapeHtmlBalise)
     * 4. Pattern matching (based on mode)
     * 5. Length/count validation
     * 6. Custom regex (optional)
     * 
     * @param value - The icon/emoji value to validate
     * @param targetInputName - The field name/identifier
     * @param options - Validation options
     * @returns {this} For method chaining
     */
    public validate(
        value: string | undefined,
        targetInputName: string,
        options: IconOptions = {}
    ): this {

        const mergedOptions = this.mergeOptions(options);

        // Clear previous state
        this.formErrorStore.clearFieldState(targetInputName);

        // Normalize raw value
        let rawValue = this.getRawStringValue(value);

        // Required field check
        if (!rawValue || rawValue.trim() === '') {
            this.requiredValidator(rawValue, targetInputName, mergedOptions.requiredInput);

            // Short-circuit if required and empty
            if (!this.formErrorStore.isFieldValid(targetInputName)) {
                return this;
            }
        }

        // Empty value is valid if not required
        if (!rawValue || rawValue.trim() === '') {
            return this;
        }

        // XSS guard
        rawValue = escapeHtmlBalise(rawValue) as string;

        // Pattern validation (based on mode)
        const result = this.validateIcon(rawValue, mergedOptions);

        if (!result.isValid) {
            const errorMessage = result.errorMessage || mergedOptions.errorMessageInput ||
                this.getDefaultErrorMessage(mergedOptions.mode || 'emoji');

            return this.setValidationState(false, errorMessage, targetInputName);
        }

        // Success
        this.formErrorStore.setFieldValid(targetInputName, true);
        return this;
    }

    /**
     * Core icon validation logic
     * @private
     */
    private validateIcon(
        rawValue: string,
        options: IconOptions
    ): IconValidationResult {

        // Pattern validation
        if (!this.matchesPattern(rawValue, options)) {
            return {
                isValid: false,
                errorCode: 'invalid_format_error' as IconErrorCode,
                errorMessage: `Invalid icon format. Expected: ${options.mode}`
            };
        }

        // Count/Length validation
        const emojiCount = this.countEmojis(rawValue);

        if (options.minCount !== undefined && emojiCount < options.minCount) {
            return {
                isValid: false,
                errorCode: 'too_few_error' as IconErrorCode,
                errorMessage: `Please provide at least ${options.minCount} emoji(s).`
            };
        }

        if (options.maxCount !== undefined && emojiCount > options.maxCount) {
            return {
                isValid: false,
                errorCode: 'too_many_error' as IconErrorCode,
                errorMessage: `Please provide at most ${options.maxCount} emoji(s).`
            };
        }

        // Length constraint (character length)
        if (options.minLength !== undefined && rawValue.length < options.minLength) {
            return {
                isValid: false,
                errorCode: 'too_short_error' as IconErrorCode,
                errorMessage: `Icon must be at least ${options.minLength} character(s) long.`
            };
        }

        if (options.maxLength !== undefined && rawValue.length > options.maxLength) {
            return {
                isValid: false,
                errorCode: 'too_long_error' as IconErrorCode,
                errorMessage: `Icon must not exceed ${options.maxLength} character(s).`
            };
        }

        // Custom regex (optional override)
        if (options.customRegex) {
            const customResult = options.customRegex.test(rawValue);
            if (!customResult && options.match !== false) {
                return {
                    isValid: false,
                    errorCode: 'custom_pattern_error' as IconErrorCode,
                    errorMessage: options.customErrorMessage || 'Icon does not match the required pattern.'
                };
            }
        }

        return { isValid: true };
    }

    /**
     * Check if value matches the pattern for the given mode
     * @private
     */
    private matchesPattern(value: string, options: IconOptions): boolean {
        const mode = options.mode || 'emoji';
        const pattern = options.pattern || DEFAULT_ICON_PATTERNS[mode as keyof typeof DEFAULT_ICON_PATTERNS];

        if (!pattern) {
            // Unknown mode - default to emoji
            return DEFAULT_ICON_PATTERNS.emoji.test(value);
        }

        return pattern.test(value);
    }

    /**
     * Count individual emojis in a string (accounts for ZWJ sequences & modifiers)
     * 
     * This is a simplified counter. For production, consider:
     * - graphemer library for perfect grapheme cluster counting
     * @private
     */
    private countEmojis(value: string): number {
        if (!value) return 0;

        // Use Array.from to count Unicode code points properly
        const chars = Array.from(value);

        // Very simplified emoji counter
        // In reality, ZWJ sequences might count as 1 or multiple depending on logic
        // For most use cases, this is sufficient:
        return chars.filter(char => {
            const code = char.codePointAt(0) || 0;
            return (
                (code >= 0x1f300 && code <= 0x1faff) || // Emoji ranges
                (code >= 0x2600 && code <= 0x27bf) ||
                (code >= 0xfe00 && code <= 0xfeff)
            );
        }).length;
    }

    /**
     * Get default error message based on mode
     * @private
     */
    private getDefaultErrorMessage(mode: string): string {
        const messages: Record<string, string> = {
            emoji: 'Please enter valid emoji(s).',
            emojiBasic: 'Please enter valid emoji(s).',
            emojiSingle: 'Please enter a single emoji.',
            iconClassName: 'Please enter a valid icon class name (e.g., fa-heart, mdi-star).'
        };

        return messages[mode] || 'Please enter a valid icon.';
    }

    /**
     * Merge user options with defaults
     * @private
     */
    private mergeOptions(userOptions: IconOptions): IconOptions {
        return {
            mode: userOptions.mode ?? 'emoji',
            requiredInput: userOptions.requiredInput ?? true,
            minCount: userOptions.minCount || undefined,
            maxCount: userOptions.maxCount ?? 3, // Default max 3 emojis
            minLength: userOptions.minLength || undefined,
            maxLength: userOptions.maxLength ?? 10,
            pattern: userOptions.pattern || undefined,
            customRegex: userOptions.customRegex || undefined,
            match: userOptions.match ?? true,
            customErrorMessage: userOptions.customErrorMessage || undefined,
            errorMessageInput: userOptions.errorMessageInput || undefined,
            egAwait: userOptions.egAwait || '📖'
        };
    }

    /**
     * Expose default patterns for public use
     */
    public static get patterns() {
        return DEFAULT_ICON_PATTERNS;
    }
}

/**
 * Singleton instance of IconValidator
 * @example
 * ```typescript
 * import { iconValidator } from '@wlindabla/form_validator/validation/rules/text';
 * 
 * iconValidator.validate('📖', 'icon', { mode: 'emoji' });
 * ```
 */
export const iconValidator = IconValidator.getInstance();