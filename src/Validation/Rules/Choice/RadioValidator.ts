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

export interface OptionsRadio {
    required?: boolean
}

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