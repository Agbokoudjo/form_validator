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

import { FormError } from "../FormError";
export interface NumberOptions {
    min?: number;
    max?: number;
    step?: number;
    regexValidator?: RegExp;
}
interface NumberInputValidatorInterface {
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

    numberValidator: (val: string | number, targetInputname: string, options_number?: NumberOptions) => this
}
/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
* @extends FormError
* @implements NumberInputValidatorInterface
*/
export class NumberInputValidator extends FormError implements NumberInputValidatorInterface {
    private static __instanceNumberValidator: NumberInputValidator;
    private constructor() { super(); }
    public static getInstance(): NumberInputValidator {
        if (!NumberInputValidator.__instanceNumberValidator) {
            NumberInputValidator.__instanceNumberValidator = new NumberInputValidator();
        }
        return NumberInputValidator.__instanceNumberValidator;
    }
    public numberValidator = (
        val: string | number,
        targetInputname: string,
        options_number?: NumberOptions
    ): this => {
        const value = typeof val === "string" ? parseFloat(val) : val;

        if (isNaN(value)) {
            return this.setValidatorStatus(false, 'Please enter a valid number.', targetInputname);
        }

        if (!options_number) {
            return this;
        }

        const { min, max, step, regexValidator } = options_number;

        if ((min && value < min) || (max && value > max)) {
            return this.setValidatorStatus(
                false,
                `Value must be between ${min ?? '-∞'} and ${max ?? '+∞'}.`,
                targetInputname
            );
        }

        if (step != null) {
            const epsilon = 1e-8;
            const offset = (value - (min ?? 0)) % step;
            if (Math.abs(offset) > epsilon && Math.abs(offset - step) > epsilon) {
                return this.setValidatorStatus(
                    false,
                    `The value ${value} must be a multiple of ${step}.`,
                    targetInputname
                );
            }
        }

        if (regexValidator && !regexValidator.test(String(val))) {
            return this.setValidatorStatus(
                false,
                `The input does not match the expected format.`,
                targetInputname
            );
        }

        return this;
    }
}
export const numberInputValidator = NumberInputValidator.getInstance();