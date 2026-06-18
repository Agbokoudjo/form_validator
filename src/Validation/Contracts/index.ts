
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


export interface SmartHtmlSecurityValidatorInterface{
    /**
     * Strips HTML tags that are not included in the allowed tags list.
     * 
     * This method removes any HTML opening or closing tags that are not explicitly
     * whitelisted, while preserving the text content and allowed tags. It uses a 
     * regular expression to identify all HTML tags and evaluates each one against
     * the whitelist before deciding whether to keep or remove it.
     *
     * @param {string} html - The HTML string to be sanitized. Can contain mixed 
     *                        allowed and disallowed tags.
     * 
     * @param {string[]} allowedTags - Array of tag names (in lowercase) that are 
     *                                 permitted to remain in the output.
     *                                 Example: ['p', 'strong', 'em', 'a']
     *
     * @returns {string} The sanitized HTML string with disallowed tags removed.
     *                   Text content is preserved. Allowed tags (both opening and 
     *                   closing) remain intact.
     *
     * @example
     * // Basic usage
     * const html = '<p>Hello <strong>World</strong> <script>alert(1)</script></p>';
     * const allowedTags = ['p', 'strong'];
     * const result = stripUnallowedTags(html, allowedTags);
     * // Result: '<p>Hello <strong>World</strong></p>'
     *
     * @example
     * // Preserves text content while removing dangerous tags
     * const html = '<div>Welcome <script>malicious code</script> here!</div>';
     * const allowedTags = ['p', 'strong'];
     * const result = stripUnallowedTags(html, allowedTags);
     * // Result: 'Welcome malicious code here!'
     *
     * @example
     * // Case-insensitive tag matching
     * const html = '<P>Text</P> <SCRIPT>bad</SCRIPT>';
     * const allowedTags = ['p'];
     * const result = stripUnallowedTags(html, allowedTags);
     * // Result: '<P>Text</P> bad'
     *
     * @remarks
     * - Tag matching is case-insensitive (both <DIV> and <div> are recognized)
     * - Only the tag names are checked; attributes are ignored
     * - HTML attributes are removed along with disallowed tags
     * - Empty tags (e.g., <br/>) and self-closing tags are handled correctly
     * - The function does NOT escape or encode special characters in content
     * - This is a DESTRUCTIVE operation; use for sanitization, not preservation
     *
     * @note
     * This method is typically used in rich-text editor scenarios where you want to
     * allow only specific HTML tags. For example, a blog editor might allow 'p', 
     * 'strong', 'em', 'a' but reject 'script', 'iframe', 'style', etc.
     *
     * @throws Does not throw errors. Invalid input is handled gracefully:
     *         - null/undefined html → returns empty string
     *         - empty allowedTags array → removes all HTML tags
     *
     * @see validateRichText - For validation instead of stripping
     * @see sanitizeRichText - For comprehensive sanitization with warnings
     *
     * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
     * @package @wlindabla/form_validator
     */
    stripUnallowedTags(html: string, allowedTags: string[]): string;

    /**
     * Removes HTML attributes that are not explicitly whitelisted for each tag.
     * 
     * This method parses the input HTML string and selectively removes attributes
     * from tags based on a whitelist configuration. Only attributes explicitly 
     * permitted for each tag name are preserved; all others are stripped while 
     * keeping the tag structure intact. Attribute matching is case-insensitive.
     *
     * @param {string} html - The HTML string containing tags with attributes to be sanitized.
     *                        This can include any valid HTML with opening tags that contain
     *                        attributes. Example: '<a href="link" onclick="bad()">Click</a>'
     *
     * @param {Record<string, string[]>} allowedAttributes - A configuration object mapping
     *                                                       tag names to arrays of permitted
     *                                                       attribute names. Tag names should
     *                                                       be lowercase. Attributes are 
     *                                                       matched case-insensitively.
     *                                                       
     *                                                       Structure: {
     *                                                         'tagName': ['attr1', 'attr2'],
     *                                                         'anotherTag': ['attrX']
     *                                                       }
     *
     * @returns {string} The sanitized HTML string with disallowed attributes removed.
     *                   Tag structures are preserved, and text content remains unchanged.
     *                   Closing tags (which contain no attributes) are unaffected.
     *
     * @example
     * // Example 1: Remove event handlers from a link
     * const html = '<a href="https://example.com" onclick="malicious()">Visit</a>';
     * const allowedAttributes = {
     *   'a': ['href', 'title', 'target']
     * };
     * 
     * const result = stripUnallowedAttributes(html, allowedAttributes);
     * // Result: '<a href="https://example.com">Visit</a>'
     * // Note: onclick attribute was removed because it's not in the whitelist
     *
     * @example
     * // Example 2: Multiple tags with different allowed attributes
     * const html = '<div id="main" onclick="alert()"><img src="pic.jpg" onerror="bad()" alt="Photo"></div>';
     * const allowedAttributes = {
     *   'div': ['id', 'class'],        // Only id and class allowed on div
     *   'img': ['src', 'alt', 'title'] // Only src, alt, title allowed on img
     * };
     * 
     * const result = stripUnallowedAttributes(html, allowedAttributes);
     * // Result: '<div id="main"><img src="pic.jpg" alt="Photo"></div>'
     * // Note: onclick on div and onerror on img were removed
     *
     * @example
     * // Example 3: Empty whitelist for a tag (removes all attributes)
     * const html = '<p id="para" class="text" data-value="5">Paragraph</p>';
     * const allowedAttributes = {
     *   'p': []  // No attributes allowed on p tag
     * };
     * 
     * const result = stripUnallowedAttributes(html, allowedAttributes);
     * // Result: '<p>Paragraph</p>'
     * // Note: All attributes (id, class, data-value) were removed
     *
     * @example
     * // Example 4: Case-insensitive tag matching
     * const html = '<A HREF="test" ONCLICK="bad">Link</A>';
     * const allowedAttributes = {
     *   'a': ['href'] // Note: lowercase in config
     * };
     * 
     * const result = stripUnallowedAttributes(html, allowedAttributes);
     * // Result: '<A HREF="test">Link</A>'
     * // Note: Works even though HTML uses uppercase tags
     *
     * @example
     * // Example 5: Real-world rich-text editor scenario
     * const html = `
     *   <p>Hello <strong>World</strong></p>
     *   <a href="/page" onclick="hack()" title="Link">Click here</a>
     *   <img src="/image.jpg" onerror="alert()" alt="Image" width="100">
     * `;
     * 
     * const allowedAttributes = {
     *   'p': [],
     *   'strong': [],
     *   'em': [],
     *   'a': ['href', 'title', 'target'],
     *   'img': ['src', 'alt', 'width', 'height']
     * };
     * 
     * const result = stripUnallowedAttributes(html, allowedAttributes);
     * // Result: 
     * // '<p>Hello <strong>World</strong></p>'
     * // '<a href="/page" title="Link">Click here</a>'
     * // '<img src="/image.jpg" alt="Image" width="100">'
     * // Note: onclick and onerror event handlers were removed
     *
     * @remarks
     * - Tag name matching is case-insensitive (both <A> and <a> work)
     * - Attribute name matching is case-insensitive (both href and HREF work)
     * - Self-closing tags (e.g., <br/>, <img/>) are handled correctly
     * - Closing tags (e.g., </div>) contain no attributes and are unaffected
     * - HTML entities within attributes are preserved as-is
     * - Whitespace and formatting within attributes are preserved
     * - If a tag has no entry in allowedAttributes, all its attributes are removed
     * - Empty attribute arrays [] mean that tag gets all attributes stripped
     *
     * @warning
     * This function does NOT validate or escape attribute values. It only filters
     * attribute names. Malicious content within attribute values (e.g., 
     * href="javascript:alert()") is NOT removed. Use this in combination with
     * URL validation functions for complete security.
     *
     * @security
     * This function removes dangerous event handlers (onclick, onerror, etc.) by 
     * filtering attribute names. However, it is part of a multi-layer defense:
     * 1. stripUnallowedAttributes() → removes event handler attributes
     * 2. validateRichText() → validates URLs in href/src attributes
     * 3. Server-side Content-Security-Policy → final browser protection
     *
     * @example
     * // Security example: Event handler removal
     * const dangerous = '<p onclick="window.location=\'http://evil.com\'">Text</p>';
     * const allowedAttributes = { 'p': [] };
     * 
     * const safe = stripUnallowedAttributes(dangerous, allowedAttributes);
     * // Result: '<p>Text</p>'
     * // The onclick handler is completely removed
     *
     * @note
     * Typical use case: Building a rich-text editor (blog, comments, etc.)
     * where you want to allow certain HTML tags but restrict their attributes
     * to prevent XSS attacks via event handlers and dangerous attributes.
     *
     * @performance
     * - Time complexity: O(n) where n is the length of the HTML string
     * - Two regex passes: one for tags, one for attributes within each tag
     * - Suitable for strings up to several MB in size
     *
     * @see stripUnallowedTags - For removing entire tags instead of attributes
     * @see validateRichText - For full HTML validation with domain checks
     * @see sanitizeRichText - For comprehensive sanitization with warnings
     *
     * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
     * @package @wlindabla/form_validator
     */
    stripUnallowedAttributes(html: string,allowedAttributes: Record<string, string[]>): string ;

    /**
     * Sanitizes HTML content from a rich-text editor (WYSIWYG) by removing dangerous
     * patterns and non-whitelisted tags/attributes.
     *
     * Unlike `validateRichText()` which rejects invalid content, this function modifies
     * the content to make it safe while preserving the overall structure and user intent.
     * This approach is ideal for WYSIWYG editors where users expect their content to be saved.
     *
     * @param {string} html - The HTML string to sanitize. Can contain any HTML tags,
     *                        attributes, and content. The function will progressively
     *                        clean it without removing the text content.
     *
     * @param {Object} options - Configuration object for sanitization behavior
     *
     * @param {string[]} options.allowedTags - Array of lowercase tag names to preserve.
     *                                         All other tags will be stripped (text preserved).
     *                                         Example: ['p', 'strong', 'em', 'a', 'img', 'h1', 'h2']
     *
     * @param {Record<string, string[]>} options.allowedAttributes - Mapping of tag names
     *                                                               to arrays of allowed
     *                                                               attribute names.
     *                                                               All other attributes
     *                                                               will be removed.
     *                                                               Example: {
     *                                                                 'a': ['href', 'title'],
     *                                                                 'img': ['src', 'alt']
     *                                                               }
     *
     * @param {boolean} [options.stripDangerousAttributes=true] - If true, performs an
     *                                                            additional pass to remove
     *                                                            event handler attributes
     *                                                            like onclick, onerror.
     *
     * @returns {string} The sanitized HTML string with:
     *                   - Dangerous XSS patterns removed
     *                   - Non-whitelisted tags stripped (content preserved)
     *                   - Non-whitelisted attributes removed
     *                   - Whitespace normalized
     *
     * @example
     * // Clean WYSIWYG editor output
     * const dirtyHtml = '<p>Hello <strong>World</strong></p><script>alert("xss")</script>';
     * const clean = sanitizeRichText(dirtyHtml, {
     *   allowedTags: ['p', 'strong'],
     *   allowedAttributes: { 'p': [], 'strong': [] }
     * });
     * // Result: '<p>Hello <strong>World</strong></p>'
     *
     * @example
     * // Blog article with controlled attributes
     * const article = '<h1>Title</h1><p>Content</p><img src="/img.jpg" onerror="alert(1)" alt="Photo">';
     * const clean = sanitizeRichText(article, {
     *   allowedTags: ['h1', 'p', 'img'],
     *   allowedAttributes: {
     *     'img': ['src', 'alt']
     *   }
     * });
     * // Result: '<h1>Title</h1><p>Content</p><img src="/img.jpg" alt="Photo">'
     * // - onerror handler removed
     *
     * @example
     * // Forum post with potential XSS
     * const post = '<p>Check <a href="javascript:alert(1)">this</a></p>';
     * const clean = sanitizeRichText(post, {
     *   allowedTags: ['p', 'a'],
     *   allowedAttributes: { 'a': ['href'] }
     * });
     * // Result: '<p>Check <a href="">this</a></p>'
     * // - dangerous javascript: protocol is removed in Step 1
     *
     * @remarks
     * **URL Handling:**
     * This function does NOT validate or filter URLs in href/src attributes.
     * All URLs (external, relative, data:, etc.) are passed through unchanged.
     * URL security is delegated to:
     * - Server-side Content-Security-Policy (CSP) headers
     * - File upload validation (magic bytes, not extensions)
     * - Browser CSP enforcement
     *
     * **Processing Steps:**
     * 1. Remove absolute XSS patterns (scripts, event handlers, template injection)
     * 2. Strip non-whitelisted tags (preserve text content)
     * 3. Remove non-whitelisted attributes (from all remaining tags)
     * 4. (Optional) Additional event handler stripping
     * 5. Normalize whitespace (collapse multiple spaces)
     *
     * **Idempotence:**
     * Running this function twice on the same content produces the same result as once.
     * Sanitized content is stable and will not change on repeated sanitization.
     *
     * @security
     * This sanitizer operates in "cleaning mode" not "rejection mode":
     * - Modifies content to remove threats instead of rejecting it
     * - Suitable for WYSIWYG editors where users expect their content to be saved
     * - Provides defense-in-depth when combined with server CSP and upload validation
     *
     * **Defense layers:**
     * 1. Client-side: This sanitizer removes obvious XSS patterns
     * 2. Server-side: CSP header prevents execution of any injected scripts
     * 3. Upload: File validation (magic bytes, not just extension/MIME)
     * 4. Storage: Sanitized content stored in database
     * 5. Output: Content displayed with CSP protections in place
     *
     * **What this CANNOT protect against:**
     * - Server misconfigurations (missing CSP headers)
     * - Stored XSS if database is compromised
     * - Attacks via non-HTML vectors (CSS injections in certain contexts)
     * - Sophisticated polyglot payloads (use dedicated library like DOMPurify for that)
     *
     * @note
     * **File Uploads:**
     * Images, videos, and PDF uploads are validated server-side BEFORE their URLs
     * are inserted into the HTML. This function does not re-validate files.
     * URL format is accepted as-is. See upload endpoint documentation for file validation.
     *
     * **Logging:**
     * - Uses console.warn() for debugging. Can be disabled in production.
     * - Each sanitization step logs warnings of what was removed.
     * - Useful for understanding what content was modified.
     *
     * @performance
     * - Time Complexity: O(n) where n = HTML string length
     * - Space Complexity: O(n) for temporary regex matches
     * - Suitable for: Documents up to 10MB
     * - For larger documents: Consider chunking or streaming
     * - Typical performance: 50-500ms for 1MB of HTML
     *
     * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
     * @company INTERNATIONALES WEB APPS & SERVICES
     * @license MIT
     */
    sanitizeRichText(
        html: string,
        options: {
            allowedTags: string[];
            allowedAttributes: Record<string, string[]>;
            stripDangerousAttributes?: boolean;
        }
    ): string;
}