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
    stringToRegex
} from "../../../../_Utils";

import { CountryCode } from "libphonenumber-js";

import { AbstractFieldController, EventValidate } from "./AbstractFieldController";

import { formInputValidator, OptionsValidate } from "../../Router";

import {
    PassworkRuleOptions,
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
    FieldValidatorInterface,
    DimensionsMediaOption
} from "../../../Rules"

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

/**
 * * Class that implements validation for non-file form fields.
 * Automatically infers validation rules based on HTML attributes if no explicit options are provided.
 * 
 * @class FieldInputController
 * @description 
 * **L'Adaptateur/Contrôleur DOM** pour un champ de formulaire unique. 
 * Cette classe agit comme l'interface de haut niveau entre l'élément HTML (input, textarea, etc.) et le moteur de validation. 
 * Elle est responsable d'exposer les propriétés brutes du DOM (name, value, required, disabled) de manière sécurisée et de contrôler le flux d'exécution 
 * de la validation en déléguant la tâche au Routeur Central (FormInputValidator).
 * 
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
     * Validates the current form input field using appropriate validators depending on its type.
     * Validation options are resolved from attributes or defaults if not explicitly provided.
     */
    public async validate(): Promise<void> {

        // si le champ n'est pas obligatoire et il n'y a pas de donnée dans le champ
        // on arrête la validation immédiatement
        if (!this.value && !this.isRequiredField()) return;

        await formInputValidator.allTypesValidator(
            this.value,
            this.name,
            this.type,
            this.fieldOptionsValidate
        );

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
                default:
                    this.optionsValidate = this.optionsValidateSimpleText;
                    break;
            }
        }
        return this.optionsValidate;
    }

    protected get errorStoreAccessor(): FieldValidatorInterface | undefined {

        return formInputValidator.getValidator(this.name);
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

        const radios = this._formParent.find<HTMLInputElement>(`input[type="radio"][name="${this.name}"]`).get(); // Récupérez les éléments DOM natifs

        const notInsideContainer = radios.some((radio) => !container[0].contains(radio)); // Utilisez la méthode native contains

        if (notInsideContainer) {
            throw new Error(`Some radios with name "${this.name}" are not inside the container with id="${this.name}". Group them correctly.`);
        }

        this._radiosContainer = container;

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

        if (!this._radiosContainer) { return undefined; }

        return this._radiosContainer.attr(attributeName);
    }

    /**
     * Generates validation options for textarea fields using HTML attributes or default values.
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
            regexValidator: this.patternRegExp
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

            hostBlacklist: this.getAttrChildren('data-host-blacklist')
                ?.split(',')
                .map(v => v.trim())
                .filter(Boolean) ?? [],

            hostWhitelist: this.getAttrChildren('data-host-whitelist')
                ?.split(',')
                .map(v => v.trim())
                .filter(Boolean) ?? []
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

            hostBlacklist: this.getAttrChildren('data-host-blacklist')
                ?.split(',')
                .map(x => x.trim())
                .filter(Boolean) ?? [],

            hostWhitelist: this.getAttrChildren('data-host-whitelist')
                ?.split(',')
                .map(x => x.trim())
                .filter(Boolean) ?? [],

            regexValidator: this.patternRegExp,
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
     */
    private get optionsValidateSelect(): SelectOptions {
        const children = this._children as JQuery<HTMLSelectElement>;

        let options_choices: string[] = [];

        children.find('option').map(function (index, elementOption) {
            const option = jQuery<HTMLOptionElement>(elementOption);

            if (option.attr('value')) {
                options_choices.push(option.val()!)

            } else {
                options_choices.push(option.text())
            }
        })

        return {
            optionsChoices: options_choices,
            escapestripHtmlAndPhpTags: this.escapestripHtmlAndPhpTags
        }
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
            egAwait: this.egAwait
        }
    }
    /**
    * Generates validation options for password fields, including character requirements.
    */
    private get optionsValidatePassword(): PassworkRuleOptions {
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
            minLowercase: this.parseIntAttr('data-min-lowercase'),
            minUppercase: this.parseIntAttr('data-min-uppercase'),
            minNumbers: this.parseIntAttr('data-min-number'),
            minSymbols: this.parseIntAttr('data-min-symbol'),
            enableScoring: this.parseBooleanAttr('data-enable-scoring', true),
            customUpperRegex: stringToRegex(this.getAttrChildren('data-custom-upper-regex')),
            customLowerRegex: stringToRegex(this.getAttrChildren('data-custom-lower-regex')),
            customNumberRegex: stringToRegex(this.getAttrChildren('data-custom-number-regex')),
            customSymbolRegex: stringToRegex(this.getAttrChildren('data-custom-symbol-regex')),
            customPunctuationRegex: stringToRegex(this.getAttrChildren('data-custom-punctuation-regex')),
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
            allowedMimeTypeAccept: allowedMimeTypeAccept_file ? allowedMimeTypeAccept_file.split(',') : undefined,
            maxsizeFile: this.parseIntAttr('data-maxsize-file', 2),
            unityMaxSizeFile: this.getAttrChildren('data-unity-max-size-file') ?? 'MiB',
            extensions: extensions_file ? extensions_file.split(',') : undefined,
            unityDimensions: this.getAttrChildren('data-unity-dimensions')
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
    private get optionsValidateCheckBox(): OptionsCheckbox {
        const max_allowed = this.getAttrCheckboxContainer('data-max-allowed');
        const min_allowed = this.getAttrCheckboxContainer('data-min-allowed');
        return {
            maxAllowed: max_allowed ? parseInt(max_allowed) : undefined,
            minAllowed: min_allowed ? parseInt(min_allowed) : undefined,
            required: this.required,
            dataChoices: this._valueCheckbox,
            optionsChoicesCheckbox: this._valueOptionsheckbox
        }
    }
    private get optionsValidateTel(): TelInputOptions {
        return {
            defaultCountry: this.getAttrChildren('data-default-country') as CountryCode,
            // Hérite de TextInputOptions
            requiredInput: this.required,
            maxLength: this.getMaxLength(25),
            minLength: this.getMinLength(7),
            typeInput: "tel",
            escapestripHtmlAndPhpTags: this.escapestripHtmlAndPhpTags,
            errorMessageInput: this.errorMessage,
            egAwait: this.egAwait,
        };
    }

    /**
    * Constructs validation options for radio fields based on attributes from their container.
    */
    private get optionsValidateRadio(): OptionsRadio {
        return {
            required: this.required
        }
    }

    public eventClearError(): EventValidate { return this.toConvertTypeEvent(this.getAttrChildren('event-clear-error') ?? 'change'); }
}
