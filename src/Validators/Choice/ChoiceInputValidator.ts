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
import { escapeHtmlBalise } from "../../_Utils";
import { FormError } from "../FormError";

export interface SelectOptions {
    optionsChoices: string[];
    escapestripHtmlAndPhpTags?: boolean;
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
export interface ChoiceInputValidatorInterface {
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
     * Method used to validate a group of checkbox inputs based on the provided options.
     *
     * @param checkCount - The number of checkboxes currently selected in the group.
     * @param groupName - The name attribute shared by the checkbox inputs in the group.
     * @param options_checkbox - An object containing validation options such as `minAllowed`, `maxAllowed`, and `required`.
     * @returns Returns the current instance for method chaining.
     */

    checkboxValidator: (checkCount: number, groupName: string, options_checkbox?: OptionsCheckbox) => this;
    radioValidator: (radioValue: string | null | undefined, groupName: string, options_radio?: OptionsRadio) => this;
}
/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
* @extends FormError
* @implements ChoiceInputValidatorInterface
*/
export class ChoiceInputValidator extends FormError implements ChoiceInputValidatorInterface {
    private static __instanceChoiceValidator: ChoiceInputValidator;
    private constructor() { super(); }
    public static getInstance(): ChoiceInputValidator {
        if (!ChoiceInputValidator.__instanceChoiceValidator) {
            ChoiceInputValidator.__instanceChoiceValidator = new ChoiceInputValidator();
        }
        return ChoiceInputValidator.__instanceChoiceValidator;
    }
    public selectValidator = (value_index: string | string[], targetInputname: string, options_select: SelectOptions): this => {
        let is_include: boolean = true;
        let error_message: string | undefined;
        const { optionsChoices, escapestripHtmlAndPhpTags = true } = options_select;
        if (escapestripHtmlAndPhpTags === true) {
            value_index = escapeHtmlBalise(value_index) as string | string[];
        }
        if (typeof value_index === "string") {
            if (!optionsChoices.includes(value_index)) {
                is_include = false;
                error_message = `The selected value "${value_index}" is not included in the available options: ${options_select.optionsChoices.join(" | ")}`;
            }
        } else if (Array.isArray(value_index)) {
            const set_optionsChoices = new Set(optionsChoices);
            const value_exclude: string[] = value_index.filter(element => !set_optionsChoices.has(element));
            if (value_exclude.length > 0) {
                is_include = false;
                error_message = `The selected values "${value_exclude.join(', ')}" are not included in the available options: ${options_select.optionsChoices.join(" | ")}`;
            }
        }
        if (!is_include && error_message) {
            this.setValidatorStatus(
                false,
                error_message,
                targetInputname
            );
        }
        return this;
    }

    public checkboxValidator = (
        checkCount: number,
        groupName: string,
        options_checkbox?: OptionsCheckbox
    ): this => {
        if (!options_checkbox) return this;

        const { minAllowed, maxAllowed, required, optionsChoicesCheckbox, dataChoices } = options_checkbox;

        if (required && checkCount === 0) {
            return this.setValidatorStatus(
                false,
                `Please select at least one option in the "${groupName}" group.`,
                groupName
            );
        }

        if (typeof maxAllowed === "number" && checkCount > maxAllowed) {
            return this.setValidatorStatus(
                false,
                `You can only select up to ${maxAllowed} options in the "${groupName}" group.`,
                groupName
            );
        }

        if (typeof minAllowed === "number" && checkCount < minAllowed) {
            return this.setValidatorStatus(
                false,
                `You must select at least ${minAllowed} options in the "${groupName}" group.`,
                groupName
            );
        }

        return this.selectValidator(
            dataChoices,
            groupName,
            {
                optionsChoices: optionsChoicesCheckbox
            }
        );
    }
    public radioValidator = (
        selectedValue: string | null | undefined,
        groupName: string,
        options_radio?: OptionsRadio
    ): this => {
        if (!options_radio) { return this; }
        const { required } = options_radio;
        if (required && !selectedValue) {
            return this.setValidatorStatus(
                false,
                `Please select an option in the "${groupName}" group.`,
                groupName
            );
        }

        return this;
    }

}
export const choiceValidator = ChoiceInputValidator.getInstance();