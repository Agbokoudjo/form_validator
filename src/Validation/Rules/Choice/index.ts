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
import type { SelectValidatorInterface } from "../../Contracts";
import type { SelectOptions } from "../../types";

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

import type { CheckBoxValidatorInterface } from "../../Contracts";
import type { OptionsCheckbox } from "../../types";

/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
* @extends AbstractFieldValidator
* @implements CheckBoxValidator
*/
export class CheckBoxValidator extends AbstractFieldValidator implements CheckBoxValidatorInterface {

    private static __instanceCheckboxValidator: CheckBoxValidator;

    private constructor() { super(); }

    public static getInstance(): CheckBoxValidator {
        if (!CheckBoxValidator.__instanceCheckboxValidator) {
            CheckBoxValidator.__instanceCheckboxValidator = new CheckBoxValidator();
        }
        return CheckBoxValidator.__instanceCheckboxValidator;
    }

    public validate = (
        checkCount: number,
        groupName: string,
        options_checkbox?: OptionsCheckbox
    ): this => {

        this.formErrorStore.clearFieldState(groupName);

        if (!options_checkbox) return this;

        const { minAllowed, maxAllowed, required, optionsChoicesCheckbox, dataChoices } = options_checkbox;

        if (required && checkCount === 0) {
            return this.setValidationState(
                false,
                `Please select at least one option in the "${groupName}" group.`,
                groupName
            );
        }

        if (typeof maxAllowed === "number" && checkCount > maxAllowed) {
            return this.setValidationState(
                false,
                `You can only select up to ${maxAllowed} options in the "${groupName}" group.`,
                groupName
            );
        }

        if (typeof minAllowed === "number" && checkCount < minAllowed) {
            return this.setValidationState(
                false,
                `You must select at least ${minAllowed} options in the "${groupName}" group.`,
                groupName
            );
        }

        selectValidator.validate(
            dataChoices,
            groupName,
            {
                optionsChoices: optionsChoicesCheckbox
            }
        );
        return this;
    }

}
export const checkboxValidator = CheckBoxValidator.getInstance();

import type { OptionsRadio } from "../../types";

/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
* @extends AbstractFieldValidator
* @implements RadioValidator
*/
export class RadioValidator extends AbstractFieldValidator {

    private static __instanceRadioValidator: RadioValidator;

    private constructor() { super(); }

    public static getInstance(): RadioValidator {
        if (!RadioValidator.__instanceRadioValidator) {
            RadioValidator.__instanceRadioValidator = new RadioValidator();
        }
        return RadioValidator.__instanceRadioValidator;
    }

    public validate = (
        selectedValue: string | null | undefined,
        groupName: string,
        options_radio?: OptionsRadio
    ): this => {

        this.formErrorStore.clearFieldState(groupName);

        if (!options_radio) { return this; }

        const { required } = options_radio;

        if (required && !selectedValue) {
            return this.setValidationState(
                false,
                `Please select an option in the "${groupName}" group.`,
                groupName
            );
        }

        return this;
    }

}

export const radioValidator = RadioValidator.getInstance();

