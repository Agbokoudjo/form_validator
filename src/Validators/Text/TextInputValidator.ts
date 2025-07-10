/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { FormError } from "../FormError";
import { FormInputType, escapeHtmlBalise, deepMerge } from "../../_Utils";

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
 * Interface for validating text input fields.
 */
interface TextInputValidatorInterface {
    /**
     * Validates a text input field.
     *
     * Performs checks on required field status, length constraints, 
     * and regex pattern validation. It can optionally strip HTML/PHP tags
     * from the input and handles error messaging and validator status updates.
     *
     * @param datainput - The string value to validate. Can be `undefined` if not provided.
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
    textValidator(
        datainput: string | undefined,
        targetInputname: string,
        optionsinputtext: TextInputOptions,
        ignoreMergeWithDefaultOptions: boolean
    ): this;
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class TextInputValidator
 * @extends FormError
 * @implements TextInputValidatorInterface
 */
export class TextInputValidator extends FormError implements TextInputValidatorInterface {
    private static __instanceTextValidator: TextInputValidator | null = null;
    constructor() {
        super();
    }
    public static getInstance(): TextInputValidator {
        if (!TextInputValidator.__instanceTextValidator) {
            TextInputValidator.__instanceTextValidator = new TextInputValidator();
        }
        return TextInputValidator.__instanceTextValidator;
    }
    public textValidator = (datainput: string | undefined, targetInputname: string,
        optionsinputtext: TextInputOptions,
        ignoreMergeWithDefaultOptions: boolean = false
    ): this => {
        const __base_options = ignoreMergeWithDefaultOptions ?
            optionsinputtext :
            deepMerge<TextInputOptions, BaseInputOptions>(optionsinputtext, this.defaultOptionsValidate);
        this.requiredValidator(datainput, targetInputname, __base_options.requiredInput);
        if (!this.hasErrorsField(targetInputname)) { return this; }

        let datavalue = datainput!.trim();
        if (__base_options.escapestripHtmlAndPhpTags === true) {
            datavalue = escapeHtmlBalise(datainput) as string;
        }
        let message_error = __base_options.errorMessageInput! as string;
        if (__base_options.typeInput !== "textarea" &&
            __base_options.egAwait
        ) {
            message_error = `${message_error} e.g.:${__base_options.egAwait} `;
        }
        const regexName = __base_options.regexValidator;
        if (regexName) {
            if (!regexName.test(datavalue)) {
                return this.setValidatorStatus(false, message_error, targetInputname);
            }
        }
        this.lengthValidator(datavalue, targetInputname, __base_options.minLength, __base_options.maxLength);
        return this;
    }
    protected get defaultOptionsValidate(): BaseInputOptions {
        return {
            requiredInput: true,
            minLength: 1,
            maxLength: 255,
            typeInput: "text",
            errorMessageInput: "The content of this field must contain only alphabetical letters and must not null",
            escapestripHtmlAndPhpTags: true,
            regexValidator: /^\p{L}$/u,
        };
    }
    private requiredValidator = (datainput: string | undefined, targetInputname: string, required: boolean = true): this => {
        if (required === true && (!datainput || datainput === '')) {
            this.setValidatorStatus(false, "this input field is mandatory", targetInputname)
        }
        return this;
    }
    private lengthValidator = (datavaluelength: string, targetInputname: string, minlength: number | undefined, maxlength: number | undefined): this => {
        if (datavaluelength) {
            if (minlength && datavaluelength.length < minlength) {
                this.setValidatorStatus(false, `please enter at least ${minlength} characters`, targetInputname);
            }
            if (maxlength && datavaluelength.length > maxlength) {
                this.setValidatorStatus(false, `please enter at less than ${maxlength} characters `, targetInputname)
            }
        }
        return this;
    }
}
export const textInputValidator = TextInputValidator.getInstance();