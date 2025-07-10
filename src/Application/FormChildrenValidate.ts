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
import { toBoolean, getInputPatternRegex, HTMLFormChildrenElement } from "../_Utils";
import { stringToRegex } from "..";
import { CountryCode } from "libphonenumber-js";
import { AbstractFormChildrenValidate, EventValidate } from "./AbstractFormChildrenValidate";
import {
    formInputValidator, OptionsValidate, FormErrorInterface,
    PassworkRuleOptions, NumberOptions, DateInputOptions,
    URLOptions, SelectOptions, OptionsCheckbox, OptionsRadio,
    OptionsFile, OptionsImage, OptionsMediaVideo, TextInputOptions,
    FQDNOptions, EmailInputOptions, TelInputOptions
} from "../Validators"

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
    getOptionsValidate(): OptionsValidate;

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

/**
 * Class that implements validation for non-file form fields.
 * Automatically infers validation rules based on HTML attributes if no explicit options are provided.
 */
export class FormChildrenValidate extends AbstractFormChildrenValidate implements FormChildrenValidateInterface {
    constructor(
        childrenInput: HTMLFormChildrenElement,
        private optionsValidate?: OptionsValidate) {
        super(childrenInput);
    }
    /**
     * Validates the current form input field using appropriate validators depending on its type.
     * Validation options are resolved from attributes or defaults if not explicitly provided.
     */
    public validate = async (): Promise<void> => {
        if (!this._value) return;
        formInputValidator.allTypesValidator(
            this._value,
            this.name,
            this.type,
            this.getOptionsValidate()
        );
        this.emitEventHandler();
    }
    public isValid(): boolean { return this.getFormError().hasErrorsField(this.name); }
    public getFormError(): FormErrorInterface { return formInputValidator.getValidator(this.name); }
    /**
     * Provides the validation options for the input field, inferred from HTML attributes or defaults.
     */
    public getOptionsValidate(): OptionsValidate {
        if (!this.optionsValidate) {
            switch (this.type) {
                case 'text':
                    this.optionsValidate = this.getOptionsValidateSimpleText();
                    break;
                case 'email':
                    this.optionsValidate = this.getOptionsValidateEmail();
                    break;
                case 'fqdn':
                    this.optionsValidate = this.getOptionsValidateFQDN();
                    break;
                case 'tel':
                    this.optionsValidate = this.getOptionsValidateTel();
                    break;
                case 'textarea':
                    this.optionsValidate = this.getOptionsValidateTextarea();
                    break;
                case 'password':
                    this.optionsValidate = this.getOptionsValidatePassword();
                    break;
                case 'url':
                    this.optionsValidate = this.getOptionsValidateUrl();
                    break;
                case 'date':
                    this.optionsValidate = this.getOptionsValidateDate();
                    break;
                case 'select':
                    this.optionsValidate = this.getOptionsValidateSelect();
                    break;
                case 'number':
                    this.optionsValidate = this.getOptionsValidateNumber();
                    break;
                case 'checkbox':
                    this.optionsValidate = this.getOptionsValidateCheckBox();
                    break;
                case 'radio':
                    this.optionsValidate = this.getOptionsValidateRadio();
                    break;
                case 'image':
                    this.optionsValidate = this.getOptionsValidateImage();
                    break;
                case 'document':
                    this.optionsValidate = this.getBaseOptionsValidateMedia();
                    break;
                case 'video':
                    this.optionsValidate = this.getOptionsValidateVideo();
                    break;
                default:
                    this.optionsValidate = this.getOptionsValidateSimpleText();
                    break;
            }
        }
        return this.optionsValidate;
    }
    /**
     * Ensures that all checkboxes with the same name are grouped within a container with the same ID.
     * Throws an error if the structure is invalid.
     */
    private hasContainerCheckbox(): boolean {
        const container = this._children.closest(`[id="${this.name}"]`);
        if (!container.length) { // Utilisez .length pour les objets jQuery
            throw new Error(`All checkboxes with name "${this.name}" must be wrapped inside a container with id="${this.name}".`);
        }

        const checkboxes = this._formParent.find<HTMLInputElement>(`input[type="checkbox"][name="${this.name}"]`).get(); // Récupérez les éléments DOM natifs

        const notInsideContainer = checkboxes.some((checkbox) => !container[0].contains(checkbox)); // Utilisez la méthode native contains

        if (notInsideContainer) {
            throw new Error(`Some checkboxes with name "${this.name}" are not inside the container with id="${this.name}". Group them correctly.`);
        }
        this._checkBoxContainer = container;
        return true; // Toutes les cases à cocher sont à l'intérieur du conteneur spécifié
    }
    /**
     * Ensures that all radios with the same name are grouped within a container with the same ID.
     * Throws an error if the structure is invalid.
     */
    private hasContainerRadio(): boolean {
        const container = this._children.closest(`[id="${this.name}"]`);
        if (!container.length) { // Utilisez .length pour les objets jQuery
            throw new Error(`All radios with name "${this.name}" must be wrapped inside a container with id="${this.name}".`);
        }

        const checkboxes = this._formParent.find<HTMLInputElement>(`input[type="radio"][name="${this.name}"]`).get(); // Récupérez les éléments DOM natifs

        const notInsideContainer = checkboxes.some((checkbox) => !container[0].contains(checkbox)); // Utilisez la méthode native contains

        if (notInsideContainer) {
            throw new Error(`Some radios with name "${this.name}" are not inside the container with id="${this.name}". Group them correctly.`);
        }
        this._checkBoxContainer = container;
        return true; // Toutes les cases à cocher sont à l'intérieur du conteneur spécifié
    }
    /**
    * Retrieves a specific attribute from the checkbox container.
    */
    private getAttrCheckboxContainer(attributeName: string): string | undefined {
        this.hasContainerCheckbox();
        if (!this._checkBoxContainer) { return undefined; }
        return this._checkBoxContainer.attr(attributeName);
    }
    /**
    * Retrieves a specific attribute from the radio container.
    */
    private getAttrRadioContainer(attributeName: string): string | undefined {
        this.hasContainerRadio();
        if (!this._checkBoxContainer) { return undefined; }
        return this._checkBoxContainer.attr(attributeName);
    }
    /**
     * Generates validation options for textarea fields using HTML attributes or default values.
     */
    private getOptionsValidateTextarea(): TextInputOptions {
        return {
            maxLength: parseInt(this.getAttrChildren('max-length') ?? '1000', 10),
            minLength: parseInt(this.getAttrChildren('min-length') ?? '10', 10),
            typeInput: "textarea",
            escapestripHtmlAndPhpTags: toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags')),
            requiredInput: toBoolean(this.getAttrChildren('required')),
            errorMessageInput: `The content you entered is invalid.  
                            Please ensure that your input complies with the required rules:
                            - It must match the specified pattern.
                            - It must not contain prohibited characters or words.
                            - The length must be within the allowed range.
                            - All required fields must be correctly filled in.

                            Please review your entry and try again.`,
            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name')!, 'iu')
        }
    }
    private getOptionsValidateEmail(): EmailInputOptions {
        return {
            typeInput: "email",
            requiredInput: toBoolean(this.getAttrChildren('required')),
            minLength: parseInt(this.getAttrChildren('min-length') ?? '6', 10),
            maxLength: parseInt(this.getAttrChildren('max-length') ?? '254', 10),
            escapestripHtmlAndPhpTags: toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags')),
            errorMessageInput: this.getAttrChildren('data-error-message-input'),
            egAwait: this.getAttrChildren('data-eg-await'),
            // FQDNOptions
            allowWildcard: toBoolean(this.getAttrChildren('data-allow-wildcard')),
            allowNumericTld: toBoolean(this.getAttrChildren('data-allow-numeric-tld')),
            allowedUnderscores: toBoolean(this.getAttrChildren('data-allowed-underscores')),
            requireTLD: toBoolean(this.getAttrChildren('data-require-tld')),
            allowTrailingDot: toBoolean(this.getAttrChildren('data-allow-trailing-dot')),
            ignoreMaxLength: toBoolean(this.getAttrChildren('data-ignore-max-length')),

            // Email-specific options
            allowUtf8LocalPart: toBoolean(this.getAttrChildren('data-allow-utf8-local-part')),
            allowIpDomain: toBoolean(this.getAttrChildren('data-allow-ip-domain')),
            allowQuotedLocal: toBoolean(this.getAttrChildren('data-allow-quoted-local')),
            allowDisplayName: toBoolean(this.getAttrChildren('data-allow-display-name')),
            requireDisplayName: toBoolean(this.getAttrChildren('data-require-display-name')),

            blacklistedChars: this.getAttrChildren('data-blacklisted-chars') ?? undefined,

            hostBlacklist: this.getAttrChildren('data-host-blacklist')
                ?.split(',')
                .map(v => v.trim())
                .filter(Boolean) ?? [],

            hostWhitelist: this.getAttrChildren('data-host-whitelist')
                ?.split(',')
                .map(v => v.trim())
                .filter(Boolean) ?? [],

            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name') ?? '[unknown form]', 'iu'),
        };
    }

    /** 
    * Generates validation options for URL input fields.
    */
    private getOptionsValidateUrl(): URLOptions {
        const allowed_protocols = this.getAttrChildren('data-allowed-protocols');

        return {
            typeInput: "url",
            requiredInput: toBoolean(this.getAttrChildren('required')),
            minLength: parseInt(this.getAttrChildren('min-length') ?? '6', 10),
            maxLength: parseInt(this.getAttrChildren('max-length') ?? '255', 10),
            escapestripHtmlAndPhpTags: toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags')),
            errorMessageInput: this.getAttrChildren('data-error-message-input'),
            egAwait: this.getAttrChildren('data-eg-await'),

            // FQDNOptions
            allowWildcard: toBoolean(this.getAttrChildren('data-allow-wildcard')),
            allowNumericTld: toBoolean(this.getAttrChildren('data-allow-numeric-tld')),
            allowedUnderscores: toBoolean(this.getAttrChildren('data-allowed-underscores')),
            requireTLD: toBoolean(this.getAttrChildren('data-require-tld')),
            allowTrailingDot: toBoolean(this.getAttrChildren('data-allow-trailing-dot')),
            ignoreMaxLength: toBoolean(this.getAttrChildren('data-ignore-max-length')),

            // URLOptions spécifiques
            allowedProtocols: allowed_protocols ? allowed_protocols.split(',').map(p => p.trim()) : ['https'],
            allowLocalhost: toBoolean(this.getAttrChildren('data-allow-localhost')),
            allowIP: toBoolean(this.getAttrChildren('data-allow-ip')),
            allowQueryParams: toBoolean(this.getAttrChildren('data-allow-query-params')),
            allowHash: toBoolean(this.getAttrChildren('data-allow-hash')),
            validateLength: toBoolean(this.getAttrChildren('data-validate-length')) ?? true,
            maxAllowedLength: parseInt(this.getAttrChildren('data-max-allowed-length') ?? '2084', 10),
            requirePort: toBoolean(this.getAttrChildren('data-require-port')),
            disallowAuth: toBoolean(this.getAttrChildren('data-disallow-auth')),
            allowProtocolRelativeUrls: toBoolean(this.getAttrChildren('data-allow-protocol-relative-urls')),
            requireHost: toBoolean(this.getAttrChildren('data-require-host')),
            requireValidProtocol: toBoolean(this.getAttrChildren('data-require-valid-protocol')),
            requireProtocol: toBoolean(this.getAttrChildren('data-require-protocol')),

            hostBlacklist: this.getAttrChildren('data-host-blacklist')
                ?.split(',')
                .map(x => x.trim())
                .filter(Boolean) ?? [],

            hostWhitelist: this.getAttrChildren('data-host-whitelist')
                ?.split(',')
                .map(x => x.trim())
                .filter(Boolean) ?? [],

            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name') ?? '[unknown form]', 'iu'),
        };
    }
    /**
     * Generates validation options for date input fields.
     */
    private getOptionsValidateDate(): DateInputOptions {
        const min_date = this.getAttrChildren('data-min-date');
        const max_date = this.getAttrChildren('data-max-date');
        const delimiters = this.getAttrChildren('data-delimiters');

        return {
            format: this.getAttrChildren('data-format-date'),
            minDate: min_date ? new Date(min_date) : undefined,
            maxDate: max_date ? new Date(max_date) : undefined,
            allowFuture: toBoolean(this.getAttrChildren('data-allow-future')),
            allowPast: toBoolean(this.getAttrChildren('data-allow-past')),
            strictMode: toBoolean(this.getAttrChildren('data-strict-mode')),
            delimiters: delimiters ? delimiters.split(',') : undefined,
            maxLength: parseInt(this.getAttrChildren('data-max-length') ?? '21', 10),
            minLength: parseInt(this.getAttrChildren('data-min-length') ?? '10', 10),
            requiredInput: toBoolean(this.getAttrChildren('required')),
            escapestripHtmlAndPhpTags: toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags')),
            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name') ?? '[unknown form]', 'iu'),
            errorMessageInput: this.getAttrChildren('data-error-message-input'),
            typeInput: 'date',
            egAwait: this.getAttrChildren('data-eg-await')
        };
    }
    /**
     * Generates validation options for select dropdowns.
     */
    private getOptionsValidateSelect(): SelectOptions {
        const children = this._children as JQuery<HTMLSelectElement>
        let options_choices: string[] = [];
        children.find('option').map(function (index, elementOption) {
            const option = jQuery(elementOption);
            if (option.attr('value')) {
                options_choices.push(option.val()!)
            } else {
                options_choices.push(option.text())
            }
        })
        return {
            optionsChoices: options_choices,
            escapestripHtmlAndPhpTags: toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags'))
        }
    }
    /**
    * Generates validation options for number input fields.
    */
    private getOptionsValidateNumber(): NumberOptions {
        const minAttr = this.getAttrChildren('min');
        const maxAttr = this.getAttrChildren('max');
        const stepAttr = this.getAttrChildren('step');
        return {
            min: minAttr ? parseFloat(minAttr) : undefined,
            max: maxAttr ? parseFloat(maxAttr) : undefined,
            step: stepAttr ? parseFloat(stepAttr) : undefined,
            regexValidator: getInputPatternRegex(
                this._children,
                this.getAttrFormParent('name') ?? '[unknown form]',
                'iu'
            ),
        };
    }
    /**
    * Generates validation options for basic text fields.
    */
    private getOptionsValidateSimpleText(): TextInputOptions {
        return {
            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name') ?? '[unknown form]', 'iu'),
            maxLength: parseInt(this.getAttrChildren('max-length') ?? '255', 10),
            minLength: parseInt(this.getAttrChildren('min-length') ?? '1', 10),
            requiredInput: toBoolean(this.getAttrChildren('required')),
            escapestripHtmlAndPhpTags: toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags')),
            errorMessageInput: this.getAttrChildren('data-error-message-input'),
            typeInput: "text",
            egAwait: this.getAttrChildren('data-eg-await')
        }
    }
    /**
    * Generates validation options for password fields, including character requirements.
    */
    private getOptionsValidatePassword(): PassworkRuleOptions {
        return {
            upperCaseAllow: toBoolean(this.getAttrChildren('data-upper-case-allow')),
            lowerCaseAllow: toBoolean(this.getAttrChildren('data-lower-case-allow')),
            symbolAllow: toBoolean(this.getAttrChildren('data-symbol-allow')),
            numberAllow: toBoolean(this.getAttrChildren('data-number-allow')),
            punctuationAllow: toBoolean(this.getAttrChildren('data-puntuation-allow')),
            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name') ?? '[unknown form]', 'iu'),
            maxLength: parseInt(this.getAttrChildren('max-length') ?? '255', 10),
            minLength: parseInt(this.getAttrChildren('min-length') ?? '8', 10),
            requiredInput: toBoolean(this.getAttrChildren('required')),
            minLowercase: parseInt(this.getAttrChildren('data-min-lowercase') ?? '1', 10),
            minUppercase: parseInt(this.getAttrChildren('data-min-uppercase') ?? '1', 10),
            minNumbers: parseInt(this.getAttrChildren('data-min-number') ?? '1', 10),
            minSymbols: parseInt(this.getAttrChildren('data-min-symbol') ?? '1', 10),
            enableScoring: toBoolean(this.getAttrChildren('data-enable-scoring')),
            customUpperRegex: stringToRegex(this.getAttrChildren('data-custom-upper-regex')),
            customLowerRegex: stringToRegex(this.getAttrChildren('data-custom-lower-regex')),
            customNumberRegex: stringToRegex(this.getAttrChildren('data-custom-number-regex')),
            customSymbolRegex: stringToRegex(this.getAttrChildren('data-custom-symbol-regex')),
            customPunctuationRegex: stringToRegex(this.getAttrChildren('data-custom-punctuation-regex'))
        }
    }
    private getOptionsValidateVideo(): OptionsMediaVideo {
        return {
            ...this.getBaseOptionsValidateMedia(),
            duration: parseInt(this.getAttrChildren('data-duration') ?? '10', 10),
            minWidth: parseInt(this.getAttrChildren('data-min-width') ?? '10', 10),
            maxWidth: parseInt(this.getAttrChildren('data-max-width') ?? '1600', 10),
            minHeight: parseInt(this.getAttrChildren('data-min-height') ?? '10', 10),
            maxHeight: parseInt(this.getAttrChildren('data-max-height') ?? '2500', 10),
            unityDurationMedia: this.getAttrChildren('data-unity-duration-media')
        }
    }
    private getOptionsValidateImage(): OptionsImage {
        return {
            ...this.getBaseOptionsValidateMedia(),
            minWidth: parseInt(this.getAttrChildren('data-min-width') ?? '10', 10),
            maxWidth: parseInt(this.getAttrChildren('data-max-width') ?? '1600', 10),
            minHeight: parseInt(this.getAttrChildren('data-min-height') ?? '10', 10),
            maxHeight: parseInt(this.getAttrChildren('data-max-height') ?? '2500', 10)
        }
    }
    private getBaseOptionsValidateMedia(): OptionsFile {
        const extensions_file = this.getAttrChildren('data-extentions');
        const allowedMimeTypeAccept_file = this.getAttrChildren('data-allowed-mime-type-accept');
        return {
            allowedMimeTypeAccept: allowedMimeTypeAccept_file ? allowedMimeTypeAccept_file.split(',') : undefined,
            maxsizeFile: parseInt(this.getAttrChildren('data-maxsize-file') ?? '2', 10),
            unityMaxSizeFile: this.getAttrChildren('data-unity-max-size-file'),
            extensions: extensions_file ? JSON.parse(extensions_file) : undefined,
            unityDimensions: this.getAttrChildren('data-unity-dimensions')
        }
    }
    private getOptionsValidateFQDN(): FQDNOptions {
        return {
            allowWildcard: toBoolean(this.getAttrChildren('data-allow-wildcard')),
            allowNumericTld: toBoolean(this.getAttrChildren('data-allow-numeric-tld')),
            allowedUnderscores: toBoolean(this.getAttrChildren('data-allowed-underscores')),
            requireTLD: toBoolean(this.getAttrChildren('data-require-tld')),
            allowTrailingDot: toBoolean(this.getAttrChildren('data-allow-trailing-dot')),
            ignoreMaxLength: toBoolean(this.getAttrChildren('data-ignore-max-length')),
        };
    }

    /**
    * Retrieves the selected values of a group of checkboxes.
    */
    private get _valueCheckbox(): string | string[] {
        const checkboxes = this._formParent.find<HTMLInputElement>(`input[type="checkbox"][name="${this.name}"]`);
        return Array.from(checkboxes)
            .filter(checkbox_elt => checkbox_elt.checked)
            .map(checkbox => checkbox.value);
    }
    /**
     * Retrieves all possible values from the checkbox group.
     */
    private get _valueOptionsheckbox(): string[] {
        const checkboxes = this._formParent.find<HTMLInputElement>(`input[type="checkbox"][name="${this.name}"]`);
        return Array.from(checkboxes).map(checkbox => checkbox.value);
    }
    /**
     * Constructs validation options for checkbox fields based on attributes from their container.
     */
    private getOptionsValidateCheckBox(): OptionsCheckbox {
        const max_allowed = this.getAttrCheckboxContainer('data-max-allowed');
        const min_allowed = this.getAttrCheckboxContainer('data-min-allowed');
        return {
            maxAllowed: max_allowed ? parseInt(max_allowed) : undefined,
            minAllowed: min_allowed ? parseInt(min_allowed) : undefined,
            required: toBoolean(this.getAttrCheckboxContainer('required')),
            dataChoices: this._valueCheckbox,
            optionsChoicesCheckbox: this._valueOptionsheckbox
        }
    }
    private getOptionsValidateTel(): TelInputOptions {
        return {
            defaultCountry: this.getAttrChildren('data-default-country') as CountryCode,
            // Hérite de TextInputOptions
            requiredInput: toBoolean(this.getAttrChildren('required')),
            maxLength: parseInt(this.getAttrChildren('max-length') ?? '15', 10),
            minLength: parseInt(this.getAttrChildren('min-length') ?? '8', 10),
            typeInput: "tel",
            escapestripHtmlAndPhpTags: toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags')),
            errorMessageInput: this.getAttrChildren('data-error-message-input') ?? "Please enter a valid phone number",
            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name') ?? '[unknown form]', 'iu'),
            egAwait: this.getAttrChildren('data-eg-await'),
        };
    }

    /**
    * Constructs validation options for radio fields based on attributes from their container.
    */
    private getOptionsValidateRadio(): OptionsRadio {
        return {
            required: toBoolean(this.getAttrRadioContainer('required'))
        }
    }

    public eventClearError(): EventValidate { return this.toConvertTypeEvent(this.getAttrChildren('event-clear-error') ?? 'change'); }
}
