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

import { AbstractFieldValidator } from "../FieldValidator";
import { selectValidator } from "./SelectValidator";

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

export interface CheckBoxValidatorInterface {

    /**
     * Method used to validate a group of checkbox inputs based on the provided options.
     *
     * @param checkCount - The number of checkboxes currently selected in the group.
     * @param groupName - The name attribute shared by the checkbox inputs in the group.
     * @param options_checkbox - An object containing validation options such as `minAllowed`, `maxAllowed`, and `required`.
     * @returns Returns the current instance for method chaining.
     */

    validate: (checkCount: number, groupName: string, options_checkbox?: OptionsCheckbox) => this;
}

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