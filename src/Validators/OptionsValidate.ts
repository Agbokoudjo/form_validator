import { FormInputType, OptionsValidateTypeFile } from "../";
export interface OptionsInputField {
    typeInput?: FormInputType;
    errorMessageInput?: string;
    regexValidator?: RegExp;
    minLength?: number;
    maxLength?: number;
    requiredInput?: boolean;
    escapestripHtmlAndPhpTags?: boolean;
    egAwait?: string;
}
export interface PassworkRuleOptions extends OptionsInputField {
    upperCaseAllow?: boolean;
    lowerCaseAllow?: boolean;
    specialChar?: boolean;
    numberAllow?: boolean;
}
export interface URLOptions extends OptionsInputField {
    allowedProtocols?: string[];  // Ex: ['http', 'https']
    requireTLD?: boolean;         // Exige un TLD comme .com, .org
    allowLocalhost?: boolean;     // Autoriser localhost
    allowIP?: boolean;            // Accepter les adresses IP
    allowQueryParams?: boolean;   // Accepter ?key=value
    allowHash?: boolean;          // Accepter #section
}
export interface DateOptions extends OptionsInputField {
    format?: string;       // Format attendu (ex: "YYYY-MM-DD", "DD/MM/YYYY")
    minDate?: string;      // Date minimale
    maxDate?: string;      // Date maximale
    allowFuture?: boolean; // Autoriser les dates futures
    allowPast?: boolean;   // Autoriser les dates passées
}
export interface SelectOptions extends OptionsInputField {
    optionsChoices: string[];
}
export interface NumberOptions extends OptionsInputField {
    min?: number;
    max?: number;
    step?: number
}

/**
 * Options for validating checkbox input fields.
 *
 * This interface defines the configuration used to validate groups of checkbox inputs,
 * such as the minimum and maximum number of boxes that must or can be selected.
 */
export interface OptionsCheckbox {
    /**
     * The maximum number of checkboxes that can be selected.
     * If defined, selecting more than this number will be considered invalid.
     */
    maxAllowed?: number;

    /**
     * The minimum number of checkboxes that must be selected.
     * If defined, selecting fewer than this number will be considered invalid.
     */
    minAllowed?: number;

    /**
     * Indicates whether at least one checkbox is required to be selected.
     * This is equivalent to setting minAllowed to 1 if true.
     */
    required?: boolean;
    dataChoices: string | string[];
    optionsChoicesCheckbox: string[];
}
export interface OptionsRadio {
    required?: boolean
}
export type OptionsValidateNoTypeFile = OptionsRadio | OptionsCheckbox | NumberOptions | OptionsInputField | PassworkRuleOptions | DateOptions | URLOptions | SelectOptions;

export type OptionsValidate = OptionsValidateNoTypeFile | OptionsValidateTypeFile;