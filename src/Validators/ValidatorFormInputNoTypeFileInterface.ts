import { OptionsValidateNoTypeFile, OptionsInputField, DateOptions, SelectOptions, URLOptions, PassworkRuleOptions, NumberOptions, OptionsCheckbox, OptionsRadio } from ".";

export interface FieldStateValidating {
    errorMessage: string[];
    validatorStatus: boolean;
}
export type FormInputType = "radio" | "checkbox" | "number" | "text" | "email" | "password" | "url" | "select" | "textarea" | "date" | "file" | "tel";

export interface ValidatorFormInputNoTypeFileInterface {
    /**
     * Generalized validator function for various input types.
     * Validates text, URLs, dates, and passwords based on specified rules.
     * 
     * @param {string} datainput - The value of the input field to validate.
     * @param {string} targetInputname - The name of the input field being validated.
     * @param {string} type_field - The type of input field (e.g., 'text', 'url', 'date', 'password').
     * @param {OptionsInputField | URLOptions | DateOptions | PassworkRuleOptions} options_validator 
     *        - Configuration options specific to the field type.
     * 
     * @returns {this} Returns the current instance for method chaining.
     * 
     * @example
     * allTypesValidator("test@example.com", "email", "text", { regexValidator: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ });
     * allTypesValidator("https://example.com", "website", "url", { requireHttps: true });
     * allTypesValidator("2024-03-01", "birthdate", "date", { minDate: "2000-01-01" });
     * allTypesValidator("SecurePass123!", "password", "password", { minLength: 8, specialChar: true });
     */

    allTypesValidator: (
        datainput: string | string[] | number | null | undefined,
        targetInputname: string,
        type_field: FormInputType,
        options_validator: OptionsValidateNoTypeFile) => this;
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
     * @throws Error : Throws an error if `datainputemail` or `targetInputnameemail` is empty.  
     */
    emailValidator: (datainput: string, targetInputname: string, optionsinputemail: OptionsInputField) => this;

    /**  
     * Validates a phone number input field.  
     * Checks if the entered value adheres to a specific format, minimum and maximum length, and if the field is required.  
     * Updates the state and error messages associated with the field in case of validation failure.  
     *  
     * @param dataInputTel (string) : The input value to validate.  
     * @param targetInputTel (string) : The identifier or key associated with the input field in the form.  
     * @param optionsinputTel (OptionsInputField) : Object containing validation options.  
     * - errorMessageInput (string) : Custom error message if validation fails.  
     * - regexValidator (RegExp) : Custom regular expression to validate the phone number format.  
     * - minLength (number) : Minimum allowed length for the input.  
     * - maxLength (number) : Maximum allowed length for the input.  
     * - requiredInput (boolean) : Indicates if the field is mandatory.  
     * @returns this : The current class instance, allowing method chaining.  
     *  
     * @throws Error : Throws an error if `dataInputTel` or `targetInputTel` is empty.  
     */
    telValidator: (data_tel: string, targetInputname: string, optionsinputTel: OptionsInputField) => this;
    /**  
     * Validates a text input field.  
     * Checks if the entered value adheres to a specific format, minimum and maximum length, and if the field is required.  
     * Optionally removes HTML and PHP tags if needed.  
     * Updates the state and error messages associated with the field in case of validation failure.  
     *  
     * @param datainput (string) : The input value to validate.  
     * @param targetInputname (string) : The identifier or key associated with the input field in the form.  
     * @param optionsinputtext (OptionsInputField) : Object containing validation options.  
     * - typeInput (string) : Type of field, for example "text" or "textarea".  
     * - regexValidator (RegExp) : Custom regular expression to validate the text format.  
     * - requiredInput (boolean) : Indicates if the field is mandatory.  
     * - escapestripHtmlAndPhpTags (boolean) : Removes HTML and PHP tags if necessary.  
     * - minLength (number) : Minimum allowed length for the value.  
     * - maxLength (number) : Maximum allowed length for the value.  
     * - errorMessageInput (string) : Custom error message if validation fails.  
     * @returns this : The current class instance, allowing method chaining.  
     *  
     * @throws Error : Throws an error if `datainput` or `targetInputname` is empty.  
     */
    textValidator: (datainput: string, targetInputname: string, optionsinputtext: OptionsInputField) => this;

    /**
     * Validates a password based on the given rules.
     * Ensures that the password meets criteria such as length, uppercase, lowercase, numbers, and special characters.
     * Supports method chaining by returning `this`.
     * 
     * @param {string} datainput - The password string to be validated.
     * @param {string} targetInputname - The name of the target input field (e.g., "confirmPassword" for password confirmation validation).
     * @param {PassworkRuleOptions} optionsinputtext - An object specifying password validation rules.
     * 
     * @returns {this} Returns the current instance to allow method chaining.
     * 
     * @example
     * const validator = new FormValidator();
     * validator.passwordValidator("SecureP@ssword123", "confirmPassword", {
     *   minLength: 8,
     *   upperCaseAllow: true,
     *   lowerCaseAllow: true,
     *   specialChar: true,
     *   numberAllow: true
     * });
     */
    passwordValidator: (datainput: string, targetInputname: string, optionsinputtext: PassworkRuleOptions) => this;

    /**
    * Validates a URL based on the specified rules.
    * Ensures that the URL meets criteria such as allowed protocols, presence of a TLD, and other constraints.
    * Supports method chaining by returning `this`.
    * 
    * @param {string} urlData - The URL string to be validated.
    * @param {string} targetInputname - The name of the target input field (e.g., "websiteURL").
    * @param {URLOptions} url_options - An object specifying URL validation rules.
    * 
    * @returns {this} Returns the current instance to allow method chaining.
    * 
    * @example
    * const validator = new FormValidator();
    * validator.urlValidator("https://example.com", "websiteURL", {
    *   allowedProtocols: ["http", "https"],
    *   requireTLD: true,
    *   allowLocalhost: false,
    *   allowIP: false,
    *   allowQueryParams: true,
    *   allowHash: false
    * });
    */
    urlValidator: (urlData: string, targetInputname: string, url_options: URLOptions) => this;
    /**
     * Validates a date based on specified rules and constraints.
     * This function ensures the date adheres to a specific format, falls within a valid range,
     * and meets conditions such as allowing only past or future dates.
     * Supports method chaining by returning `this`.
     * 
     * @param {string} date_input - The date string to validate.
     * @param {string} targetInputname - The name of the input field being validated.
     * @param {DateOptions} date_options - An object specifying validation rules for the date.
     * 
     * @returns {this} Returns the current instance to allow method chaining.
     * 
     * @example
     * const validator = new FormValidator();
     * validator.dateValidator("15/08/2023", "birthDate", {
     *   format: "DD/MM/YYYY",
     *   minDate: "01/01/2000",
     *   maxDate: "31/12/2030",
     *   allowFuture: false,
     *   allowPast: true
     * });
     */
    dateValidator: (date_input: string, targetInputname: string, date_options: DateOptions) => this;
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
    selectValidator: (value_index: string | string[], targetInputname: string, options_select: SelectOptions) => this;

    /**
     * Validates a numeric input value against several configurable constraints such as:
     * - Minimum and maximum limits
     * - Step multiples
     * - Optional regular expression validation
     * 
     * This function supports both string and number types as input and automatically
     * parses strings to floats. If validation fails at any step, it sets an appropriate
     * error message using `setValidatorStatus`.
     * 
     * @param val - The value to validate, can be a string or number.
     * @param targetInputname - The name of the input field being validated (used for error reporting).
     * @param options_number - Optional validation options including:
     *   - min: Minimum allowable value
     *   - max: Maximum allowable value
     *   - step: The required multiple for the value
     *   - regexValidator: Optional RegExp to validate the raw input string
     * 
     * @returns The current instance (for chaining).
     */

    numberValidator: (val: string | number, targetInputname: string, options_number?: NumberOptions) => this
    /**
     * Method used to validate a group of checkbox inputs based on the provided options.
     *
     * @param checkCount - The number of checkboxes currently selected in the group.
     * @param groupName - The name attribute shared by the checkbox inputs in the group.
     * @param options_checkbox - An object containing validation options such as `minAllowed`, `maxAllowed`, and `required`.
     * @returns Returns the current instance for method chaining.
     */

    checkboxValidator: (checkCount: number, groupName: string, options_checkbox?: OptionsCheckbox) => this;
    radioValidator: (selectedValue: string | null | undefined, groupName: string, options_radio?: OptionsRadio) => this;
}