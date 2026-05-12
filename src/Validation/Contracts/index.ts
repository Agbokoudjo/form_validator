
import type {
    FormInputType, DataInput,
    MediaType, MediaRequiredType
} from "../../_Utils";

import type {
    //Choice
    OptionsCheckbox,
    SelectOptions,
    OptionsMediaVideo,
    URLOptions,
    EmailInputOptions,
    FQDNOptions,
    DateInputOptions,
    OptionsValidate,
    OptionsValidateTypeFile,
    FieldStateValidating,
     EventValidate
} from "../types"

/**
 * Interface defining the contract for the centralized form error state manager (Store).
 * It acts as the Single Source of Truth for the validity and errors of all fields.
 * 
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
*   @package <https://github.com/Agbokoudjo/form_validator>
 */
export interface FormErrorStoreInterface {

    /**
     * Checks the validity status of the entire form.
     * @returns {boolean} Returns `true` if no field is explicitly marked as invalid, `false` otherwise.
     */
    isFormValid(): boolean;

    /**
     * Explicitly sets the validity state of a specific field in the store.
     * @param {string} fieldName The name (key) of the field whose state should be updated.
     * @param {boolean} isValid The validity status to record (`true` for valid, `false` for invalid).
     * @returns {this} The store instance for method chaining.
     */
    setFieldValid(fieldName: string, isValid: boolean): this;

    /**
     * Adds one or more error messages to the list of errors for a given field.
     * Existing error messages will not be added again.
     * @param {string} fieldName The name of the field concerned.
     * @param {string | string[]} messages The error message or an array of messages to add.
     * @returns {this} The store instance for method chaining.
     */
    addFieldError(fieldName: string, messages: string | string[]): this;

    /**
     * Retrieves the complete list of error messages associated with a field.
     * @param {string} fieldName The name of the field to retrieve errors for.
     * @returns {string[]} An array containing the error messages. Returns an empty array if no errors are found.
     */
    getFieldErrors(fieldName: string): string[];

    /**
     * Checks if a specific field is considered valid according to the recorded state.
     * @param {string} fieldName The name of the field to check.
     * @returns {boolean} Returns `true` if the field has not been explicitly marked as invalid (`false`).
     */
    isFieldValid(fieldName: string): boolean;

    /**
     * Completely clears the recorded state for a field.
     * This removes both the error messages and the validity status of the field from the store.
     * @param {string} fieldName The name of the field to clear.
     * @returns {this} The store instance for method chaining.
     */
    clearFieldState(fieldName: string): this;

    /**
     * Removes a specific error message for a field.
     * If this action empties the list of errors, the field's entry is removed from the store.
     * @param {string} fieldName The name of the field.
     * @param {string} messageToRemove The exact error message to remove.
     * @returns {this} The store instance for method chaining.
     */
    removeFieldError(fieldName: string, messageToRemove: string): this;
}

export interface DateInputValidatorInterface {
    /**
     * Validates a date string or Date object based on provided formatting and business rules.
     *
     * @param date_input - The date to validate (as a string or Date object).
     * @param targetInputname - The name of the input field being validated.
     * @param date_options - Optional rules to validate the date, including format, range, etc.
     *
     * @returns The current instance, allowing method chaining.
     *
     * @example
     * dateValidator('2024/06/30', 'birthdate', { format: 'YYYY/MM/DD', allowFuture: false });
 */
    validate: (date_input: string | Date, targetInputname: string, date_options: DateInputOptions) => this;
}

export interface EmailInputValidatorInterface {
    /**  
     * Validates an email input field.  
     * Checks if the entered value adheres to a specific format, minimum and maximum length, and if the field is required.  
     * Updates the state and error messages associated with the field in case of validation failure.  
     *  
     * @param datainputemail (string) : The input value to validate.  
     * @param targetInputnameemail (string) : The identifier or key associated with the input field in the form.  
     * @param optionsinputemail (OptionsInputText) : Object containing validation options.  
     * - errorMessageInput (string) : Custom error message if validation fails.  
     * - regexValidator (RegExp) : Custom regular expression to validate the email format.  
     * - minLength (number) : Minimum allowed length for the input.  
     * - maxLength (number) : Maximum allowed length for the input.  
     * - requiredInput (boolean) : Indicates if the field is mandatory.  
     * @returns this : The current class instance, allowing method chaining.  
     *  
     */
    validate: (datainput: string, targetInputname: string, optionsinputemail: EmailInputOptions) => Promise<this>;
}

export interface URLInputValidatorInterface {
    /**
     * Validates a URL string according to customizable rules and constraints.
     * 
     * This function ensures that the input URL is syntactically valid and conforms to the provided rules,
     * such as accepted protocols, required host, optional port, TLD presence, and whether IPs or localhost are allowed.
     * 
     * @param urlData - The raw URL string to validate (e.g., "https://example.com").
     * @param targetInputname - The identifier or name of the input field (used for error tracking).
     * @param url_options - An object of validation rules extending `FQDNOptions`.
     * 
     * @param url_options.allowedProtocols - Array of allowed protocols (e.g., `["http", "https", "ftp"]`).  
     * @param url_options.requireProtocol - If `true`, the URL must include a protocol (`http://`, `https://`, etc.).  
     * @param url_options.requireValidProtocol - If `true`, the protocol must be included in `allowedProtocols`.  
     * @param url_options.allowProtocolRelativeUrls - If `true`, allows protocol-relative URLs like `//example.com`.  
     * @param url_options.requireHost - If `true`, the URL must include a host (e.g., `example.com`).  
     * @param url_options.requirePort - If `true`, the URL must include a port (e.g., `:8080`).  
     * @param url_options.allowIP - If `true`, IP addresses (IPv4 or IPv6) are accepted as hosts.  
     * @param url_options.allowLocalhost - If `true`, `localhost` and `127.0.0.1` are accepted as hosts.  
     * @param url_options.allowQueryParams - If `true`, query parameters (e.g., `?id=123`) are allowed.  
     * @param url_options.allowHash - If `true`, URL fragments (e.g., `#section1`) are allowed.  
     * @param url_options.regexValidator - A custom `RegExp` to further validate the complete URL.  
     * @param url_options.validateLength - If `true`, checks that the URL length does not exceed `maxAllowedLength`.  
     * @param url_options.maxAllowedLength - Maximum allowed length for the URL string (default: `2048`).  
     * @param url_options.disallowAuth - If `true`, URLs with credentials (`user:pass@host`) are rejected.  
     * @param url_options.hostBlacklist - List of disallowed hostnames (strings or RegExp). If matched, validation fails.  
     * @param url_options.hostWhitelist - List of allowed hostnames (strings or RegExp). If not matched, validation fails.  
     * 
     * @returns A `Promise<this>` — the current instance, to allow method chaining.
     * 
     * @example
     * const validator = new URLInputValidator();
     * await validator.urlValidator("https://example.com", "website", {
     *   allowedProtocols: ["https"],
     *   requireProtocol: true,
     *   allowQueryParams: false,
     *   hostBlacklist: ["banned.com"]
     * });
     */
    validate: (urlData: string, targetInputname: string, url_options: URLOptions) => Promise<this>;
}

/**
 * Interface representing a validator that can validate various types of media.
 * 
 * @property fileValidator - A function that takes a media file or list,
 * validates it based on the provided options, and returns a Promise of the current instance.
 */
export interface MediaValidatorInterface {
    validate: (
        media: File | FileList,
        targetInputname: string,
        optionsfile: OptionsValidateTypeFile
    ) => Promise<this>;
}

export interface VideoValidatorInterface extends MediaValidatorInterface {
    /**
    * Validates one or more video files based on various criteria such as file extension, size, MIME type,
    * and metadata (dimensions and duration).
    * 
    * This function checks whether the uploaded video files meet the following requirements:
    * - The file extension must be valid and match one of the allowed extensions specified in the configuration.
    * - The file size must be less than or equal to the maximum allowed size.
    * - The MIME type of the file must be valid.
    * - The metadata of the video (dimensions and duration) must be validated.
    * 
    * If any of these criteria fail, an error will be returned, and the file will be ignored for subsequent validations.
    * 
    * @param {File | FileList} medias - The video file(s) to validate. Can be a single file or a list of files.
    * @param {string} [targetInputname='videofile'] - The name of the input field, used to personalize the error messages.
    * @param {OptionsMediaVideo} [optionsmedia] - The video file validation options, including allowed extensions, 
    *                                          allowed MIME types, and file size restrictions.
    * 
    * @returns {Promise<this>} - A promise that returns the instance of the object after validating the files, 
    *                             allowing for chaining of additional methods if necessary.
    * 
    * @example
    * const videoFiles = document.getElementById('videoInput').files;
    * await validator.fileValidator(videoFiles, 'videoInput', {
    *   extensions: ['mp4', 'mkv'],
    *   allowedMimeTypeAccept: ['video/mp4', 'video/x-matroska'],
    *   maxsizeFile: 10,
    *   unityMaxSizeFile: 'MiB'
    * });
    * 
    * @throws {Error} - Throws an error if validation fails for any of the files, with details about the encountered issue.
    * 
    * @see {@link metadataValidate} for validating metadata (dimensions, duration, etc.).
    * @see {@link sizeValidate} for validating the size of the video files.
    * @see {@link extensionValidate} for validating the extensions of the video files.
    * @see {@link mimeTypeFileValidate} for validating the MIME type of the video files.
    */
    validate: (
        medias: File | FileList,
        targetInputname: string,
        optionsmedia: OptionsMediaVideo
    ) => Promise<this>
}


export interface SelectValidatorInterface {
    /**
         * Validates if the selected value exists within the predefined choices.
         *
         * @param {string| string[]} value_index - The selected value to be validated.
         * @param {string} targetInputname - The name of the input field being validated.
         * @param {SelectOptions} options_select - The options available for selection.
         *        - `optionsChoices` (string[]): List of allowed values for selection.
         *        - Other validation options inherited from `OptionsInputField`.
         *
         * @returns {this} - Returns the current instance for method chaining.
         *
         * @example
         * const validator = new Validator();
         * validator.selectValidator("apple", "fruitChoice", { optionsChoices: ["apple", "banana", "orange"] });
    */
    validate: (value_index: string | string[], targetInputname: string, options_select: SelectOptions) => this;

}

export interface CheckBoxValidatorInterface {

    /**
     * Method used to validate a group of checkbox inputs based on the provided options.
     *
     * @param checkCount - The number of checkboxes currently selected in the group.
     * @param groupName - The name attribute shared by the checkbox inputs in the group.
     * @param options_checkbox - An object containing validation options such as `minAllowed`, `maxAllowed`, and `required`.
     * @returns Returns the current instance for method chaining.
     */

    validate: (checkCount: number, groupName: string, options_checkbox?: OptionsCheckbox) => this;
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
*   @package <https://github.com/Agbokoudjo/form_validator>
 */
export interface FieldOptionsValidateCacheAdapterInterface  {

    /**
     * Récupère les options de validation pour une clé donnée.
     */
    getItem(key: string): Promise<OptionsValidate | undefined>;

    /**
     * Stocke les options de validation.
     */
    setItem(key: string, options: OptionsValidate): Promise<void>;

}

export interface FQDNInputValidatorInterface {

    /**
        * Validates a Fully Qualified Domain Name (FQDN) input field.
        *
        * This function applies strict validation rules on the structure of the domain name, including:
        * - the presence of a valid top-level domain (TLD),
        * - disallowing underscores in domain segments,
        * - optional support for trailing dots,
        * - restrictions on numeric-only TLDs,
        * - length limits on domain segments.
        * 
        * Custom validation behavior can be configured through the provided options.
        * On failure, it updates the validation state and error messages for the target field.
        *
        * @param input - The input string representing the domain name to validate (e.g., `example.com`).
        * @param targetInputname - The name or identifier of the input field in the form (used for error reporting).
        * @param fqdnOptions - An object configuring the validation logic for the domain input.
        *
        * @param fqdnOptions.requireTLD - (default `true`) If `true`, the domain must end with a valid TLD (e.g., `.com`).
        * @param fqdnOptions.allowedUnderscores - (default `false`) If `true`, underscores (`_`) are allowed in domain segments.
        * @param fqdnOptions.allowTrailingDot - (default `false`) If `true`, a trailing dot (e.g., `example.com.`) is permitted.
        * @param fqdnOptions.allowNumericTld - (default `false`) If `true`, allows numeric-only TLDs (e.g., `example.123`).
        * @param fqdnOptions.allowWildcard - (default `false`) If `true`, allows domains that start with a wildcard (`*.example.com`).
        * @param fqdnOptions.ignoreMaxLength - (default `false`) If `true`, bypasses the 63-character-per-label limit.
        * 
        * Inherits from `TextInputOptions`:
        * @param fqdnOptions.regexValidator - A custom regular expression to validate domain format.
        * @param fqdnOptions.errorMessageInput - A custom error message to show if the input is invalid.
        * @param fqdnOptions.minLength - The minimum required character length.
        * @param fqdnOptions.maxLength - The maximum allowed character length.
        * @param fqdnOptions.requiredInput - If `true`, the input must not be empty.
        * @param fqdnOptions.escapestripHtmlAndPhpTags - If `true`, removes HTML and PHP tags before validation.
        * @param fqdnOptions.egAwait - Example value to include in the error message for user guidance.
        *
        * @param ignoreMergeWithDefaultOptions - If `true`, skips merging with default FQDN validation options.
        *
        * @returns A Promise resolving with the current class instance (`this`) for method chaining.
        *
    */

    validate: (input: string, targetInputname: string, fqdnOptions: FQDNOptions, ignoreMergeWithDefaultOptions: boolean) => Promise<this>;
}

/**
 * Interface defining the contract for any single field validator implementation.
 * It provides core utilities for interacting with the global error store and performing validation.
 */
export interface FieldValidatorInterface {

    /**
     * Provides read-only access to the central error management store.
     * @type {FormErrorStoreInterface}
     */
    readonly formErrorStore: FormErrorStoreInterface;

    /**
     * Sets the validation state (validity status and error message) for the field.
     * * @param {boolean} isValid - The validation status (`true` for valid, `false` for invalid).
     * @param {string | string[]} errorMessage - The error message(s) to associate with the field if invalid.
     * @param {string} fieldName - The name of the input field to update.
     * * @returns {this} The current instance for method chaining.
     */
    setValidationState(isValid: boolean, errorMessage: string | string[], fieldName: string): this;

    /**
     * Retrieves the current validation state of the field.
     * * @param {string} fieldName - The name of the input field to check.
     * @returns {FieldStateValidating} An object containing the validity status and error messages.
     */
    getState(fieldName: string): FieldStateValidating;

    /**
    * Executes the specific validation logic for this field and updates the error state.
    * * This method supports both synchronous and asynchronous validation.
    * * @param {DataInput} value - The value to be validated.
    * @param {string} fieldName - The name of the field.
    * @returns {Promise<this> | this} Returns the instance (`this`) for synchronous validation, or a 
    * Promise resolving to the instance for asynchronous validation.
    */
    validate(value: DataInput, fieldName: string, optionsValidate: any, ...otherArgs: any): Promise<this> | this;
}

export interface FormInputValidatorInterface {
    /**
      * Generalized validator function for various input types.
      * Validates text, URLs, dates, passwords, numbers, choices, and files (images, videos, documents)
      * based on specified rules.
      *
      * @param {string | string[] | number | null | undefined | File | FileList} datainput - The value of the input field to validate. This can be a string (text, email, URL, date, tel, radio), an array of strings (select, checkbox), a number (number, checkbox), null, undefined, or a File/FileList for file inputs.
      * @param {string} targetInputname - The name of the input field being validated.
      * @param {FormInputType | MediaType | MediaRequiredType} type_field - The type of input field (e.g., 'text', 'url', 'date', 'password', 'image', 'video', 'document', 'email', 'tel', 'select', 'number', 'checkbox', 'radio').
      * @param {OptionsValidateNoTypeFile} options_validator - Configuration options specific to the field type.
      *
      * @returns {void} This function modifies the validator's internal state (e.g., sets error messages) but does not return a value directly.
      *
      * @example
      * // Text validation
      * formInputValidator.allTypesValidator("Hello World", "message", "text", { minLength: 5, maxLength: 50 });
      * // Email validation
      * formInputValidator.allTypesValidator("test@example.com", "userEmail", "email", { requiredInput: true });
      * // Date validation
      * formInputValidator.allTypesValidator("2024/07/04", "eventDate", "date", { format: 'YYYY/MM/DD', minDate: new Date('2024-01-01') });
      * // Phone validation
      * formInputValidator.allTypesValidator("+22997000000", "userPhone", "tel", { countryCode: 'BJ' });
      * // Image file validation (assuming 'fileInput' is an HTMLInputElement)
      * const imageFile = (document.getElementById('fileInput') as HTMLInputElement).files?.[0];
      * if (imageFile) {
      * formInputValidator.allTypesValidator(imageFile, "profileImage", "image", { allowedMimeTypeAccept: ['image/png'], maxsizeFile: 2 });
      * }
      */
    allTypesValidator: (
        datainput: DataInput,
        targetInputname: string,
        type_field: FormInputType | MediaType | MediaRequiredType,
        options_validator: OptionsValidate,
        ...othersArg: any) => Promise<void>;
}

export interface ContainerValidatorInterface {

    setValidator(targetInputname: string, validator: FieldValidatorInterface): void;
    removeValidator(targetInputname: string): void;
    getValidator: (targetInputname: string) => FieldValidatorInterface | undefined
}

/**
 * Interface for form field validation components.
 */
export interface FormChildrenValidateInterface {
    /**
     * Checks if the current field is valid (i.e., has no validation errors).
     */
    isValid(): boolean;

    /**
     * Retrieves the current validation options for the field.
     */
    fieldOptionsValidate: OptionsValidate;

    /**
     * Runs the validation logic on the field asynchronously.
     */
    validate(): Promise<void>;

    /**
     * Returns the event object responsible for triggering field validation.
     */
    eventValidate(): EventValidate;

    /**
     * Returns the event object responsible for clearing field errors.
     */
    eventClearError(): EventValidate;

    /**
     * Clears the visual error state and message for the field.
     */
    clearErrorField(): void;
}
