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

import { AbstractFieldValidator } from "../FieldValidator";

export interface NumberOptions {
    min?: number;
    max?: number;
    step?: number;
    regexValidator?: RegExp;
}

/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
* @extends AbstractFieldValidator
* @implements NumberInputValidatorInterface
*/
export class NumberInputValidator extends AbstractFieldValidator {
    private static __instanceNumberValidator: NumberInputValidator;

    private constructor() { super(); }

    public static getInstance(): NumberInputValidator {
        if (!NumberInputValidator.__instanceNumberValidator) {
            NumberInputValidator.__instanceNumberValidator = new NumberInputValidator();
        }
        return NumberInputValidator.__instanceNumberValidator;
    }

    /**
         * Validates a numeric input value against several configurable constraints such as:
         * - Minimum and maximum limits
         * - Step multiples
         * - Optional regular expression validation
         * 
         * This function supports both string and number types as input and automatically
         * parses strings to floats. If validation fails at any step, it sets an appropriate
         * error message using `setValidatorStatus`.
         * 
         * @param val - The value to validate, can be a string or number.
         * @param targetInputname - The name of the input field being validated (used for error reporting).
         * @param options_number - Optional validation options including:
         *   - min: Minimum allowable value
         *   - max: Maximum allowable value
         *   - step: The required multiple for the value
         *   - regexValidator: Optional RegExp to validate the raw input string
         * 
         * @returns The current instance (for chaining).
     */
    public validate = (
        val: string | number,
        targetInputname: string,
        options_number?: NumberOptions
    ): this => {
        const value = typeof val === "string" ? parseFloat(val) : val;

        this.formErrorStore.clearFieldState(targetInputname);

        if (isNaN(value)) {
            return this.setValidationState(false, 'Please enter a valid number.', targetInputname);
        }

        if (!options_number) {
            return this;
        }

        const { min, max, step, regexValidator } = options_number;

        if ((min && value < min) || (max && value > max)) {

            return this.setValidationState(
                false,
                `Value must be between ${min ?? '-∞'} and ${max ?? '+∞'}.`,
                targetInputname
            );
        }

        if (step != null) {
            const epsilon = 1e-8;
            const offset = (value - (min ?? 0)) % step;
            if (Math.abs(offset) > epsilon && Math.abs(offset - step) > epsilon) {
                return this.setValidationState(
                    false,
                    `The value ${value} must be a multiple of ${step}.`,
                    targetInputname
                );
            }
        }

        if (regexValidator && !regexValidator.test(String(val))) {
            return this.setValidationState(
                false,
                `The input does not match the expected format.`,
                targetInputname
            );
        }

        return this;
    }
}
export const numberInputValidator = NumberInputValidator.getInstance();