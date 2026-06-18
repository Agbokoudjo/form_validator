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
import {
    WordScoringOptions,
    HTMLFormChildrenElement,
    stringToRegex,
    escapeHtmlBalise,
    MediaRequiredType,
    MediaType,
    FormInputType
} from "../../../_Utils";

import { CountryCode } from "libphonenumber-js";

import {
    AbstractFieldController,
    DocumentTypeResolver
} from "./AbstractFieldController";

import { formInputValidator } from "../Router";

import type {
    PasswordRuleOptions,
    EventValidate,
    NumberOptions,
    DateInputOptions,
    URLOptions,
    SelectOptions,
    OptionsCheckbox,
    OptionsRadio,
    OptionsFile,
    OptionsImage,
    OptionsMediaVideo,
    TextInputOptions,
    FQDNOptions,
    EmailInputOptions,
    TelInputOptions,
    DimensionsMediaOption,
    OptionsExcelFile,
    OptionsCsvFile,
    CsvColumnType,
    OptionsWordFile,
    OptionsOdfFile,
    UnityMaxSizeTypeFile,
    OptionsValidate,
    IsbnOptions,
    IsbnType,
    CardSchemeOptions,
    CardSchemeType,
    OptionsPdf
} from "../../types"

import type {FormChildrenValidateInterface } from "../../Contracts";

/**
 * Automatically infers validation rules based on HTML attributes if no explicit options are provided.
 * 
 * @class FieldInputController
 * @description 
 *  The DOM Adapter/Controller** for a single form field.
* This class acts as the high-level interface between the HTML element (input, textarea, etc.) and the validation engine.
* It is responsible for exposing the raw DOM properties (name, value, required, disabled) in a secure manner and for controlling the execution flow
* of the validation by delegating the task to the Central Router (FormInputValidator).
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 */
export class FieldInputController extends AbstractFieldController implements FormChildrenValidateInterface {

    constructor(
        childrenInput: HTMLFormChildrenElement,
        private optionsValidate?: OptionsValidate) {
        super(childrenInput);
    }

    /**
     * Orchestrates the validation process for the current field.
     *  Validates the current form input field using appropriate validators depending on its type.
     * Validation options are resolved from attributes or defaults if not explicitly provided.
     * Handles two distinct flows:
     * 1. Multi-document validation: Each file is identified and validated by its specific 
     *    type (PDF, Excel, etc.), then errors are bubbled up to the main input name.
     * 2. Standard validation: Generic validation for text, email, password, etc.
     * 
     * @returns {Promise<void>}
     */
    public async validate(): Promise<void> {
        const val = this.value;  // Retrieve current field value
        if ((!val && !this.isRequiredField()) || this.noValidate()) return;  // Short-circuit if field is empty and not required

        const currentType = this.type;
        //Specialized Document Validation 
        if (currentType === "document" && val) {
            DocumentTypeResolver.clearCache(this.name);// Reset resolver cache to ensure fresh detection
            // Map each file to its specific validator type (e.g., [pdf, word, excel])
            let fileArray: File[]=[];

            if (val instanceof File) {
                fileArray = [val];
            } else if (val instanceof FileList) {
                fileArray = Array.from(val);
            } 

            if (fileArray.length === 0) {
                this.emitEventHandler();
                return;
            }

            const detectedTypes = await DocumentTypeResolver.detect(fileArray, this.name);
            let isAllValid = true;
            let lastErrorKey = this.name;
            for (let i = 0; i < fileArray.length; i++) {
                const specificType = detectedTypes[i];
                // Generate a unique internal key for each file to isolate validation logic
                const fileKey = `${this.name}_${fileArray[i].name.replace(/[^a-z0-9]/gi, '_')}`;
                // MATH LOGIC: We resolve the specific options for THIS specific file type
                // Resolve specific rules (e.g., PDF-specific max size vs Excel-specific sheets)
                this.optionsValidate = this.resolveOptionsByType(specificType);
                // Execute validation for the individual file
                await formInputValidator.allTypesValidator(
                    fileArray[i],
                    fileKey,
                    specificType,
                    this.optionsValidate
                );
                // Check if the current file failed validation
                const fileValidator = formInputValidator.getValidator(fileKey);
                const isFileValid = fileValidator
                    ? fileValidator.formErrorStore.isFieldValid(fileKey)
                    : false;  // no validator = we don’t know = invalid for safety

                if (!isFileValid) {
                    isAllValid = false;
                    lastErrorKey = fileKey;
                    break;
                }
            }

            if (!isAllValid) {
                // Retrieve the validator instance that caught the error
                this.errorStoreAccessor = formInputValidator.getValidator(lastErrorKey);
                if (this.errorStoreAccessor) {
                    // Extract specific error messages for this file
                    const fileErrors = this.errorStoreAccessor.formErrorStore.getFieldErrors(lastErrorKey);
                    /** 
                     * BUBBLING LOGIC: 
                     * We transfer the failure state from the specific fileKey to the main 
                     * input name so the UI Controller can catch it and display the error.
                     */
                    this.errorStoreAccessor.setValidationState(false, fileErrors, this.name);
                    // Clean up the temporary fileKey state to keep the store lean
                    this.errorStoreAccessor.formErrorStore.clearFieldState(lastErrorKey);
                    formInputValidator.setValidator(this.name, this.errorStoreAccessor); //we transfer the validator to the relevant input field
                    formInputValidator.removeValidator(lastErrorKey);//we remove the validator from the failed file
                }

                this.errorStoreAccessor = formInputValidator.getValidator(this.name);
            } else {
                const lastFile = fileArray[fileArray.length - 1];
                const lastFileKey = `${this.name}_${lastFile.name.replace(/[^a-z0-9]/gi, '_')}`;
                const lastValidator = formInputValidator.getValidator(lastFileKey);
                if (lastValidator) {
                    // We transfer the 'overall valid' state under the main key of the field
                    lastValidator.setValidationState(true, [], this.name);
                    formInputValidator.setValidator(this.name, lastValidator);
                    formInputValidator.removeValidator(lastFileKey);
                }
            }
        } else {
            // Standard non-document validation
            await formInputValidator.allTypesValidator(
                val,
                this.name,
                currentType,
                this.fieldOptionsValidate
            );
        }
        this.errorStoreAccessor = formInputValidator.getValidator(this.name);
        // Trigger events (Success or Failure) to update the UI/Controller
        this.emitEventHandler();
    }

    /**
     * Provides the validation options for the input field, inferred from HTML attributes or defaults.
     */
    public get fieldOptionsValidate(): OptionsValidate {
        if (!this.optionsValidate) {
            switch (this.type) {
                case 'text':
                    this.optionsValidate = this.optionsValidateSimpleText;
                    break;
                case 'isbn':
                    this.optionsValidate = this.optionsValidateIsbn;
                    break;
                case 'email':
                    this.optionsValidate = this.optionsValidateEmail;
                    break;
                case 'fqdn':
                    this.optionsValidate = this.optionsValidateFQDN;
                    break;
                case 'tel':
                    this.optionsValidate = this.optionsValidateTel;
                    break;
                case 'textarea':
                    this.optionsValidate = this.optionsValidateTextarea;
                    break;
                case 'password':
                    this.optionsValidate = this.optionsValidatePassword;
                    break;
                case 'url':
                    this.optionsValidate = this.optionsValidateUrl;
                    break;
                case 'date':
                    this.optionsValidate = this.optionsValidateDate;
                    break;
                case 'select':
                    this.optionsValidate = this.optionsValidateSelect;
                    break;
                case 'number':
                    this.optionsValidate = this.optionsValidateNumber;
                    break;
                case 'checkbox':
                    this.optionsValidate = this.optionsValidateCheckBox;
                    break;
                case 'radio':
                    this.optionsValidate = this.optionsValidateRadio;
                    break;
                case 'image':
                    this.optionsValidate = this.optionsValidateImage;
                    break;
                case 'document':
                    this.optionsValidate = this.baseOptionsValidateMedia;
                    break;
                case 'video':
                    this.optionsValidate = this.optionsValidateVideo;
                    break;
                case 'card':
                    this.optionsValidate = this.optionsValidateCard;
                    break;
                default:
                    this.optionsValidate = this.optionsValidateSimpleText;
                    break;
            }
        }

        return this.optionsValidate;
    }

    private get optionsValidateCard(): CardSchemeOptions {
        const schemesAttr = this.getAttrChildren('data-card-schemes');

        return {
            requiredInput: this.required,
            errorMessageInput: this.errorMessage,
            egAwait: this.egAwait,
            sanitize: this.parseBooleanAttr('data-card-sanitize', true),
            luhnCheck: this.parseBooleanAttr('data-card-luhn-check', true),
            schemes: schemesAttr
                ? (schemesAttr
                    .split(',')
                    .map(s => s.trim().toUpperCase())
                    .filter(Boolean) as CardSchemeType[])
                : undefined,
        };
    }

    /**
     * Build complete TextInputOptions object from textarea attributes.
     * Uses the HYBRID approach (JSON with fallback to granular).
     * HTML:
     * ```html
     * <textarea
     *   id="article_editor"
     *   name="article_content"
     *   data-type="textarea"
     *   data-security-mode="rich-text"
     *   data-allowed-tags="p,h1,h2,strong,em,a,img"
     *   data-allowed-html-attributes='{
     *     "a": ["href", "title"],
     *     "img": ["src", "alt"],
     *     "*": []
     *   }'
     *   data-sanitize-instead-of-reject="true"
     *   required
     *   minlength="50"
     *   maxlength="5000"
     * ></textarea>
     * ```
     * Returns: Complete TextInputOptions object ready for validation
     */
    private get optionsValidateTextarea(): TextInputOptions {
        return {
            maxLength: this.getMaxLength(2000),
            minLength: this.getMinLength(20),
            typeInput: "textarea",
            requiredInput: this.required,
            escapestripHtmlAndPhpTags: this.escapestripHtmlAndPhpTags,
            errorMessageInput: this.errorMessage
                ?? `The content you entered is invalid.  
                            Please ensure that your input complies with the required rules:
                            - It must match the specified pattern.
                            - It must not contain prohibited characters or words.
                            - The length must be within the allowed range.
                            - All required fields must be correctly filled in.

                            Please review your entry and try again.`,
            regexValidator: this.patternRegExp,
            match: this.matchRegex,
            sanitizeInsteadOfReject: this.sanitizeInsteadOfReject,
            securityMode: this.securityMode,
            allowedHtmlTags: this.allowedTags.length > 0 ? this.allowedTags : undefined,
            allowedHtmlAttributes: this.allowedAttributesHybrid || undefined,
        }
    }

    private get optionsValidateEmail(): EmailInputOptions {
        return {
            typeInput: "email",
            maxLength: this.getMaxLength(180),
            minLength: this.getMinLength(6),
            requiredInput: this.required,
            escapestripHtmlAndPhpTags: this.escapestripHtmlAndPhpTags,
            errorMessageInput: this.errorMessage,
            match: this.matchRegex,
            egAwait: this.egAwait,
            // FQDNOptions
            ...this.optionsValidateFQDN,
            // Email-specific options
            allowUtf8LocalPart: this.parseBooleanAttr('data-allow-utf8-local-part', true),
            allowIpDomain: this.parseBooleanAttr('data-allow-ip-domain', false),
            allowQuotedLocal: this.parseBooleanAttr('data-allow-quoted-local', true),
            allowDisplayName: this.parseBooleanAttr('data-allow-display-name', false),
            requireDisplayName: this.parseBooleanAttr('data-require-display-name', false),
            blacklistedChars: this.getAttrChildren('data-blacklisted-chars') ?? undefined,
            hostBlacklist: this.dataHostBlacklist,
            hostWhitelist: this.dataHostWhitelist
        };
    }

    /** 
    * Generates validation options for URL input fields.
    */
    private get optionsValidateUrl(): URLOptions {
        const allowed_protocols = this.getAttrChildren('data-allowed-protocols');

        return {
            typeInput: "url",
            requiredInput: this.required,
            minLength: this.getMinLength(6),
            maxLength: this.getMaxLength(255),
            escapestripHtmlAndPhpTags: this.escapestripHtmlAndPhpTags,
            errorMessageInput: this.errorMessage,
            egAwait: this.egAwait,

            // FQDNOptions
            ... this.optionsValidateFQDN,

            // URLOptions spécifiques
            allowedProtocols: allowed_protocols ? allowed_protocols.split(',').map(p => p.trim()) : ['https'],
            allowLocalhost: this.parseBooleanAttr('data-allow-localhost', false),
            allowIP: this.parseBooleanAttr('data-allow-ip', false),
            allowQueryParams: this.parseBooleanAttr('data-allow-query-params', true),
            allowHash: this.parseBooleanAttr('data-allow-hash', true),
            validateLength: this.parseBooleanAttr('data-validate-length', true),
            maxAllowedLength: parseInt(this.getAttrChildren('data-max-allowed-length') ?? '2084', 10),
            requirePort: this.parseBooleanAttr('data-require-port', false),
            disallowAuth: this.parseBooleanAttr('data-disallow-auth', false),
            allowProtocolRelativeUrls: this.parseBooleanAttr('data-allow-protocol-relative-urls', false),
            requireHost: this.parseBooleanAttr('data-require-host', true),
            requireValidProtocol: this.parseBooleanAttr('data-require-valid-protocol', true),
            requireProtocol: this.parseBooleanAttr('data-require-protocol', false),
            hostBlacklist: this.dataHostBlacklist,
            hostWhitelist: this.dataHostWhitelist,
            regexValidator: this.patternRegExp,
            match: this.matchRegex,
        };
    }
    /**
     * Generates validation options for date input fields.
     */
    private get optionsValidateDate(): DateInputOptions {
        return {
            format: this.getAttrChildren('data-format-date'),
            minDate: this.minDate,
            maxDate: this.maxDate,
            allowFuture: this.parseBooleanAttr('data-allow-future', false),
            allowPast: this.parseBooleanAttr('data-allow-past', false),
            strictMode: this.parseBooleanAttr('data-strict-mode', false),
            delimiters: this.delimiters,
            maxLength: this.getMaxLength(21),
            minLength: this.getMinLength(10),
            requiredInput: this.required,
            escapestripHtmlAndPhpTags: this.escapestripHtmlAndPhpTags,
            regexValidator: this.patternRegExp,
            errorMessageInput: this.errorMessage,
            typeInput: 'date',
            egAwait: this.egAwait
        };
    }

    /**
     * Generates validation options for select dropdowns.
     * Extracts all available values from the <option> elements.
     */
    private get optionsValidateSelect(): SelectOptions {
        // Suppression du cast JQuery
        const selectElement = this._children as HTMLSelectElement;

        // On récupère toutes les options et on les transforme en tableau de chaînes
        const options_choices: string[] = Array.from(selectElement.options).map((option) => {
            // En Vanilla JS, option.value renvoie l'attribut value 
            // ou le texte de l'option si value est absent. C'est automatique !
            return option.value;
        });

        return {
            optionsChoices: options_choices,
            escapestripHtmlAndPhpTags: this.escapestripHtmlAndPhpTags
        };
    }

    /**
    * Generates validation options for number input fields.
    */
    private get optionsValidateNumber(): NumberOptions {
        const minAttr = this.getAttrChildren('min');
        const maxAttr = this.getAttrChildren('max');
        const stepAttr = this.getAttrChildren('step');
        return {
            min: minAttr ? parseFloat(minAttr) : undefined,
            max: maxAttr ? parseFloat(maxAttr) : undefined,
            step: stepAttr ? parseFloat(stepAttr) : undefined,
            regexValidator: this.patternRegExp
        };
    }

    /**
    * Generates validation options for basic text fields.
    */
    private get optionsValidateSimpleText(): TextInputOptions {
        return {
            regexValidator: this.patternRegExp,
            maxLength: this.getMaxLength(),
            minLength: this.getMinLength(),
            requiredInput: this.required,
            escapestripHtmlAndPhpTags: this.escapestripHtmlAndPhpTags,
            errorMessageInput: this.errorMessage,
            typeInput: "text",
            egAwait: this.egAwait,
            match: this.matchRegex
        }
    }
    /**
    * Generates validation options for password fields, including character requirements.
    */
    private get optionsValidatePassword(): PasswordRuleOptions {
        return {
            upperCaseAllow: this.parseBooleanAttr('data-upper-case-allow', true),
            lowerCaseAllow: this.parseBooleanAttr('data-lower-case-allow', true),
            symbolAllow: this.parseBooleanAttr('data-symbol-allow', true),
            numberAllow: this.parseBooleanAttr('data-number-allow', true),
            punctuationAllow: this.parseBooleanAttr('data-puntuation-allow', true),
            regexValidator: this.patternRegExp,
            maxLength: this.getMaxLength(256),
            minLength: this.getMinLength(8),
            requiredInput: this.required,
            errorMessageInput: this.errorMessage,
            match: this.matchRegex,
            minLowercase: this.parseIntAttr('data-min-lowercase'),
            minUppercase: this.parseIntAttr('data-min-uppercase'),
            minNumbers: this.parseIntAttr('data-min-number'),
            minSymbols: this.parseIntAttr('data-min-symbol'),
            enableScoring: this.parseBooleanAttr('data-enable-scoring', true),
            customUpperRegex: stringToRegex(this.getAttrChildren('data-custom-upper-regex'), 'u'),
            customLowerRegex: stringToRegex(this.getAttrChildren('data-custom-lower-regex'), 'u'),
            customNumberRegex: stringToRegex(this.getAttrChildren('data-custom-number-regex'), 'u'),
            customSymbolRegex: stringToRegex(this.getAttrChildren('data-custom-symbol-regex'), 'u'),
            customPunctuationRegex: stringToRegex(this.getAttrChildren('data-custom-punctuation-regex'), 'u'),
            ...this.wordScoringOptions
        }
    }

    private get wordScoringOptions(): WordScoringOptions {
        return {
            pointsPerLength: this.parseIntAttr('data-points-per-length', 1),
            pointsPerUniqueChar: this.parseIntAttr('data-points-per-unique-char', 2),
            pointsPerRepeatChar: this.parseFloatAttr('data-points-per-repeat-char', 0.5),
            bonusForContainingLower: this.parseIntAttr('data-bonus-containing-lower', 10),
            bonusForContainingUpper: this.parseIntAttr('data-bonus-containing-upper', 10),
            bonusForContainingNumber: this.parseIntAttr('data-bonus-containing-number', 10),
            bonusForContainingSymbol: this.parseIntAttr('data-bonus-containing-symbol', 10),
            bonusForContainingPunctuation: this.parseIntAttr('data-bonus-containing-punctuation', 10)
        }
    }

    private get optionsValidateVideo(): OptionsMediaVideo {
        return {
            ...this.baseOptionsValidateMedia,
            duration: this.parseIntAttr('data-duration', 10),
            ...this.dimensionsMedia,
            unityDurationMedia: this.getAttrChildren('data-unity-duration-media')
        }
    }

    private get dimensionsMedia(): DimensionsMediaOption {
        return {
            minWidth: this.parseIntAttr('data-min-width', 10),
            maxWidth: this.parseIntAttr('data-max-width', 1600),
            minHeight: this.parseIntAttr('data-min-height', 10),
            maxHeight: this.parseIntAttr('data-max-height', 2500)
        }
    }

    private get optionsValidateImage(): OptionsImage {
        return {
            ...this.baseOptionsValidateMedia,
            ... this.dimensionsMedia
        }
    }

    private get baseOptionsValidateMedia(): OptionsFile {
        const extensions_file = this.getAttrChildren('data-extentions');
        const allowedMimeTypeAccept_file = this.getAttrChildren('data-allowed-mime-type-accept');
        return {
           allowedMimeTypeAccept: allowedMimeTypeAccept_file
            ? allowedMimeTypeAccept_file
                .split(',')
                .map(mime => mime.trim())      
                .filter(mime => mime.length > 0) 
            : undefined,
            maxsizeFile: this.parseIntAttr('data-maxsize-file', 2),
            unityMaxSizeFile: this.getAttrChildren('data-unity-max-size-file') as UnityMaxSizeTypeFile,
            allowedExtensions: extensions_file
                ? extensions_file
                    .split(',')
                    .map(ext => ext.trim())         
                    .filter(ext => ext.length > 0)
                : undefined,
            unityDimensions: this.getAttrChildren('data-unity-dimensions')
        }
    }

    private get optionsValidatePdf():OptionsPdf{
        return {
            password: this.password,
            skipPasswordProtectedValidation: this.skipPasswordProtectedValidation,
            ...this.baseOptionsValidateMedia
        }
    }

    private get optionsValidateExcelFile(): OptionsExcelFile {
        return {
            minSheets: this.parseIntAttr('data-min-sheets', 1),
            maxSheets: this.parseIntAttr('data-max-sheets'),
            requiredColumns: this.resolveColumns(this.getAttrChildren('data-required-columns')),
            rejectEmptySheet: this.parseBooleanAttr('data-reject-empty-sheet', true),
            sheetIndex: this.parseIntAttr('data-sheet-index', 1),
            ...this.baseOptionsValidateMedia
        }
    }

    private get optionsValidateCsvFile(): OptionsCsvFile {
        return {
            delimiter: this.getAttrChildren('data-delimiter'),
            requiredHeaders: this.resolveRequiredHeaders(this.getAttrChildren('data-required-headers')),
            columnTypes: this.resolveColumnTypes(this.getAttrChildren('data-column-types')),
            useFirstLineAsHeaders: this.parseBooleanAttr('data-use-first-line-as-headers', true),
            skipEmptyLines: this.parseBooleanAttr('data-skip-empty-lines', true),
            maxRows: this.parseIntAttr('data-max-rows'),
            minRows: this.parseIntAttr('data-min-rows', 1),
            maxRowErrors: this.parseIntAttr('data-max-row-errors', 2),
            worker: this.parseBooleanAttr('data-worker'),
            ...this.baseOptionsValidateMedia
        }
    }

    private get optionsValidateWordFile(): OptionsWordFile {
        return {
            rejectEmptyDocument: this.parseBooleanAttr('data-reject-empty-document', true),
            minParagraphs: this.parseIntAttr('data-min-paragraphs'),
            maxPages: this.parseIntAttr('data-max-pages'),
            allowLegacyDoc: this.parseBooleanAttr('data-allow-legacy-doc', true),
            requiredTextFragments: this.parseRawToStringArray(this.getAttrChildren('data-required-text-fragments')),
            ...this.baseOptionsValidateMedia
        }
    }

    private get optionsValidateOdfFile(): OptionsOdfFile {
        return {
            rejectEmptyDocument: this.parseBooleanAttr('data-reject-empty-document', true),
            minParagraphs: this.parseIntAttr('data-min-paragraphs'),
            allowRtf: this.parseBooleanAttr('data-allow-rtf', true),
            requiredTextFragments: this.parseRawToStringArray(this.getAttrChildren('data-required-text-fragments')),
            ...this.baseOptionsValidateMedia
        }
    }

    private get optionsValidateFQDN(): FQDNOptions {
        return {
            allowWildcard: this.parseBooleanAttr('data-allow-wildcard', false),
            allowNumericTld: this.parseBooleanAttr('data-allow-numeric-tld', false),
            allowedUnderscores: this.parseBooleanAttr('data-allowed-underscores', false),
            requireTLD: this.parseBooleanAttr('data-require-tld', true),
            allowTrailingDot: this.parseBooleanAttr('data-allow-trailing-dot', false),
            ignoreMaxLength: this.parseBooleanAttr('data-ignore-max-length', false),
        };
    }

    /**
     * Returns all checkbox inputs sharing the same name within the parent form.
     */
    private get checkboxGroup(): HTMLInputElement[] {
        return Array.from(
            this._formParent.querySelectorAll<HTMLInputElement>(
                `input[type="checkbox"][name="${this.name}"]`
            )
        );
    }

    /**
     * Returns the values of all checked checkboxes in the group.
     */
    private get checkedValues(): string[] {
        return this.checkboxGroup
            .filter(cb => cb.checked)
            .map(cb => cb.value);
    }

    /**
     * Returns all possible values in the checkbox group.
     */
    private get allCheckboxValues(): string[] {
        return this.checkboxGroup.map(cb => cb.value);
    }

    /**
     * Reads a data attribute from the closest ancestor that has it,
     * searching upward from the current checkbox element.
     * Falls back to the form element itself if not found on any ancestor.
     */
    private getAttrCheckboxContainer(attributeName: string): string | undefined {
        // Walk up the DOM from the checkbox looking for the attribute
        let el: HTMLElement | null = this._children.parentElement;

        while (el && el !== this._formParent) {
            const val = el.getAttribute(attributeName);
            if (val !== null) return val;
            el = el.parentElement;
        }

        // Fallback: check the form itself
        return this._formParent.getAttribute(attributeName) ?? undefined;
    }

    /**
     * Builds checkbox validation options without requiring a dedicated container.
     */
    private get optionsValidateCheckBox(): OptionsCheckbox {
        const max_allowed = this.getAttrCheckboxContainer('data-max-allowed');
        const min_allowed = this.getAttrCheckboxContainer('data-min-allowed');

        return {
            maxAllowed: max_allowed !== undefined ? parseInt(max_allowed, 10) : undefined,
            minAllowed: min_allowed !== undefined ? parseInt(min_allowed, 10) : undefined,
            required: this.required,
            dataChoices: this.checkedValues,
            optionsChoicesCheckbox: this.allCheckboxValues,
        };
    }

    /**
     * Returns all radio inputs sharing the same name within the parent form.
     */
    private get radioGroup(): HTMLInputElement[] {
        return Array.from(
            this._formParent.querySelectorAll<HTMLInputElement>(
                `input[type="radio"][name="${this.name}"]`
            )
        );
    }

    /**
     * Reads a data attribute by walking up the DOM from the current radio element.
     */
    private getAttrRadioContainer(attributeName: string): string | undefined {
        let el: HTMLElement | null = this._children.parentElement;

        while (el && el !== this._formParent) {
            const val = el.getAttribute(attributeName);
            if (val !== null) return val;
            el = el.parentElement;
        }

        return this._formParent.getAttribute(attributeName) ?? undefined;
    }

    /**
     * Builds radio validation options without requiring a dedicated container.
     */
    private get optionsValidateRadio(): OptionsRadio {
        return {
            required: this.required,
        };
    }



    private get optionsValidateTel(): TelInputOptions {
        return {
            defaultCountry: this.getAttrChildren('data-default-country') as CountryCode,
            requiredInput: this.required,
            maxLength: this.getMaxLength(25),
            minLength: this.getMinLength(7),
            typeInput: "tel",
            escapestripHtmlAndPhpTags: this.escapestripHtmlAndPhpTags,
            errorMessageInput: this.errorMessage,
            egAwait: this.egAwait,
        };
    }

    private get optionsValidateIsbn():IsbnOptions{
        return {
            requiredInput: this.required,
            errorMessageInput: this.errorMessage,
            egAwait: this.egAwait,
            type: this.getAttrChildren('data-type-isbn') as IsbnType,
            isbn10Message: this.getAttrChildren('data-isbn-10-message'),
            isbn13Message: this.getAttrChildren('data-isbn-13-message'),
            bothIsbnMessage: this.getAttrChildren('data-isbn-both-message'),
            allowHyphens: this.parseBooleanAttr('data-allow-hyphens',true),
            allowSpaces: this.parseBooleanAttr('data-allow-spaces', true),
        }
    }

    public eventClearError(): EventValidate { return this.toConvertTypeEvent(this.getAttrChildren('event-clear-error') ?? 'change'); }

    /**
     * Resolves column types mapping from an HTML attribute.
     * Expected format: A JSON object string like '{"Age": "number", "Email": "email"}'
     * * @param rawValue - The raw JSON string from the HTML attribute.
     * @returns Record<string, CsvColumnType> - A sanitized mapping of column types.
     */
    private resolveColumnTypes(rawValue: string | null | undefined): Record<string, CsvColumnType> {
        const types: Record<string, CsvColumnType> = {};

        if (!rawValue || typeof rawValue !== 'string') {
            return types;
        }

        try {
            const parsed = JSON.parse(rawValue);

            // Ensure we are dealing with a plain object, not an array or null
            if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                for (const [key, value] of Object.entries(parsed)) {
                    // Clean the column name (the key)
                    let cleanKey = escapeHtmlBalise(String(key).trim()) as string;
                    cleanKey = cleanKey.replace(/\s+/g, ' ');

                    // Clean and validate the type (the value)
                    const cleanValue = String(value).trim().toLowerCase() as CsvColumnType;

                    // Optional: Only add if the value is a valid CsvColumnType
                    const validTypes: CsvColumnType[] = ['string', 'number', 'date', 'boolean', 'email'];
                    if (validTypes.includes(cleanValue)) {
                        types[cleanKey] = cleanValue;
                    } else {
                        console.warn(`[Validator] Unknown type "${cleanValue}" for column "${cleanKey}". Defaulting to "string".`);
                        types[cleanKey] = 'string';
                    }
                }
            }
        } catch (error) {
            console.error("[Validator] Failed to parse columnTypes JSON:", error);
        }

        return types;
    }

    /**
     * Resolves column headers from an HTML attribute.
     */
    private resolveColumns(rawValue: string | undefined): string[] {
        return this.parseRawToStringArray(rawValue);
    }

    /**
     * Resolves required headers from an HTML attribute.
     */
    private resolveRequiredHeaders(rawValue: string | null | undefined): string[] {
        return this.parseRawToStringArray(rawValue);
    }

    /**
     * Resolves specific validation options based on the detected document type.
     * This ensures that if a field has multiple files, each file gets its 
     * specific rules (e.g., CSV rules for .csv, Word rules for .docx).
     */
    private resolveOptionsByType(type: FormInputType | MediaType | MediaRequiredType): OptionsValidate {
        switch (type) {
            case 'excel': return this.optionsValidateExcelFile;
            case 'csv': return this.optionsValidateCsvFile;
            case 'word': return this.optionsValidateWordFile;
            case 'odf': return this.optionsValidateOdfFile;
            case 'image': return this.optionsValidateImage;
            case 'video': return this.optionsValidateVideo;
            case 'pdf': return this.optionsValidatePdf; // PDF usually uses base file options
            default: return this.fieldOptionsValidate;    // Fallback to standard logic
        }
    }
}
