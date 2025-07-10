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
import { FormInputType, escapeHtmlBalise, deepMerge } from "../../../_Utils";

export interface BaseInputOptions {
    requiredInput?: boolean;
    minLength?: number;
    maxLength?: number;
    escapestripHtmlAndPhpTags?: boolean;
    errorMessageInput?: string;
    typeInput?: FormInputType;
    regexValidator?: RegExp;
}

export interface TextInputOptions extends BaseInputOptions {
    egAwait?: string;
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class TextInputValidator
 * @extends AbstractFieldValidator
 */
export class TextInputValidator extends AbstractFieldValidator {

    // 1. Propriété privée statique pour stocker l'instance unique
    private static instance: TextInputValidator;

    private constructor() { super(); }

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
    * Performs checks on required field status, length constraints, 
    * and regex pattern validation. It can optionally strip HTML/PHP tags
    * from the input and handles error messaging and validator status updates.
    *
    * @param value- The string value to validate. Can be `undefined` if not provided.
    * @param targetInputname - The name or key representing the input field in the form.
    * @param optionsinputtext - Validation options specific to the input field.
    * 
    * @param optionsinputtext.typeInput - The type of input (e.g., `"text"`, `"textarea"`).
    * @param optionsinputtext.regexValidator - A custom regular expression used to validate the input format.
    * @param optionsinputtext.requiredInput - Whether the field is mandatory.
    * @param optionsinputtext.escapestripHtmlAndPhpTags - If `true`, removes HTML and PHP tags from the input.
    * @param optionsinputtext.minLength - Minimum number of characters required.
    * @param optionsinputtext.maxLength - Maximum number of characters allowed.
    * @param optionsinputtext.errorMessageInput - Custom error message to display on failure.
    * @param optionsinputtext.egAwait - Example value to show in error messages for guidance.
    *
    * @param ignoreMergeWithDefaultOptions - If `true`, skips merging with default validation options.
    *
    * @returns The current instance (`this`) to allow method chaining.
    *
    * @throws Error - If `datainput` or `targetInputname` is invalid or missing.
    */
    public validate = (
        value: string | undefined,
        targetInputname: string,
        optionsinputtext: TextInputOptions,
        ignoreMergeWithDefaultOptions: boolean = false
    ): this => {

        const __base_options = this.mergeOptions(optionsinputtext, ignoreMergeWithDefaultOptions);
        // Clear state at the start (assume valid until proven otherwise)
        this.formErrorStore.clearFieldState(targetInputname);

        //Type Check and Conversion (must be a string or treat as empty/undefined)
        const rawValue = this.getRawStringValue(value);

        // Required Check (Short-Circuit)
        if (!rawValue || rawValue.trim() === '') {
            this.requiredValidator(rawValue, targetInputname, __base_options.requiredInput);

            // Short-circuiting: if the field is mandatory and empty, stop here.
            if (!this.formErrorStore.isFieldValid(targetInputname)) {
                return this;
            }
        }

        //  Data Preparation (Safe trim/escape)
        // We know rawValue is not falsy or is a string at this point, but we still need a safe check.
        let dataValue = rawValue ? rawValue.trim() : "";

        if (__base_options.escapestripHtmlAndPhpTags === true && dataValue.length > 0) {
            // Assumes escapeHtmlBalise is a global/imported function
            dataValue = escapeHtmlBalise(dataValue) as string;
        }

        // Regex Validation (Short-Circuit)
        const regex = __base_options.regexValidator;
        if (regex) {
            let errorMessage = __base_options.errorMessageInput;
            // Build rich error message if type is not 'textarea'
            if (__base_options.typeInput !== "textarea" && __base_options.egAwait) {

                errorMessage = `${errorMessage} e.g.:${__base_options.egAwait}`;
            }

            if (!regex.test(dataValue)) {
                // Return immediately if regex fails
                return this.setValidationState(false, errorMessage || "Format is invalid.", targetInputname);
            }
        }

        this.lengthValidator(dataValue, targetInputname, __base_options.minLength, __base_options.maxLength);

        return this;
    }

    private get defaultOptionsValidate(): BaseInputOptions {
        return {
            requiredInput: true,
            minLength: 1,
            maxLength: 255,
            typeInput: "text",
            errorMessageInput: "The content of this field must contain only alphabetical letters and must not null",
            escapestripHtmlAndPhpTags: true,
            regexValidator: /^\p{L}+$/iu,
        };
    }

    /**
     * Merges the provided options with the default options based on the control flag.
     * @param {TextInputOptions} userOptions - The options provided by the caller.
     * @param {boolean} ignoreDefaults - If true, ignores default options and uses only userOptions.
     * @returns {TextInputOptions} The final set of options to be used for validation.
     */
    private mergeOptions(
        userOptions: TextInputOptions,
        ignoreDefaults: boolean
    ): TextInputOptions {

        // Si l'utilisateur demande d'ignorer les options par défaut, on retourne les siennes immédiatement.
        if (ignoreDefaults) {
            return userOptions;
        }

        return deepMerge<TextInputOptions, TextInputOptions>(
            userOptions,
            this.defaultOptionsValidate

        );
    }
}

export const textInputValidator = TextInputValidator.getInstance();