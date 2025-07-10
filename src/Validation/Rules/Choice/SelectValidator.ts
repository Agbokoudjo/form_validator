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
import { escapeHtmlBalise } from "../../../_Utils";
import { AbstractFieldValidator } from "../FieldValidator";

export interface SelectOptions {
    optionsChoices: string[];
    escapestripHtmlAndPhpTags?: boolean;
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

/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
* @extends AbstractFieldValidator
* @implements SelectValidatorInterface
*/
export class SelectValidator extends AbstractFieldValidator implements SelectValidatorInterface {

    private static __instanceSelectValidator: SelectValidator;

    private constructor() { super(); }

    public static getInstance(): SelectValidator {
        if (!SelectValidator.__instanceSelectValidator) {
            SelectValidator.__instanceSelectValidator = new SelectValidator();
        }
        return SelectValidator.__instanceSelectValidator;
    }

    public validate = (value_index: string | string[], targetInputname: string, options_select: SelectOptions): this => {

        this.formErrorStore.clearFieldState(targetInputname);

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
            this.setValidationState(
                false,
                error_message,
                targetInputname
            );
        }
        return this;
    }

}

export const selectValidator = SelectValidator.getInstance();