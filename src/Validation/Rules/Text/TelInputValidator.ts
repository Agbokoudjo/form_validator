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

import { TextInputOptions, textInputValidator } from "./TextInputValidator";
import { AbstractFieldValidator } from "../FieldValidator";
import { parsePhoneNumberWithError, ParseError, CountryCode } from "libphonenumber-js";

export interface TelInputOptions extends TextInputOptions {
    defaultCountry: CountryCode;
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class TelInputValidator
 * @extends AbstractFieldValidator
 */
export class TelInputValidator extends AbstractFieldValidator {

    private static instance: TelInputValidator;

    private constructor() { super(); }

    public static getInstance(): TelInputValidator {
        if (!TelInputValidator.instance) {
            TelInputValidator.instance = new TelInputValidator();
        }
        return TelInputValidator.instance;
    }

    /**
    * Validates a phone number in international format using `libphonenumber-js`.
    * Ensures that the number starts with a '+' sign and is valid for the specified country.
    * If valid, formats and optionally updates the input field using jQuery (if present).
    *
    * - Automatically checks if the number is valid based on its international format.
    * - Falls back to `defaultCountry` for more accurate validation when possible.
    * - Provides custom error messages and supports additional input constraints (min/max length, required).
    *
    * @param value - The phone number input string (should be trimmed and preferably start with '+').
    * @param targetInputname - The name of the form field to validate.
    * @param optionsinputTel - Configuration options for validation.
    *
    * @property optionsinputTel.defaultCountry - Optional ISO 2-letter country code (e.g., `'FR'`, `'BJ'`, `'US'`).
    * @property optionsinputTel.egAwait - Example format to show in case of validation failure.
    * @property optionsinputTel.errorMessageInput - Custom error message for formatting validation.
    * @property optionsinputTel.minLength - Minimum number of characters allowed.
    * @property optionsinputTel.maxLength - Maximum number of characters allowed.
    * @property optionsinputTel.requiredInput - Whether the field is mandatory.
    *
    * @returns Returns the current validator instance (for chaining).
    *@example 
    ```typescript
    const telInputValidator = TelInputValidator.getInstance()
    ```
    * @example
    * ```typescript
    *  telInputValidator.validate('+229016725186', 'phone', {
    *   defaultCountry: 'BJ',
    *   egAwait: '+229 01 67 25 18 86',
    *   requiredInput: true
    * });
    *```
    * @example
    * ```typescript
    *  telInputValidator.validate('+33612345678', 'mobile', {
    *   defaultCountry: 'FR',
    *   errorMessageInput: 'Ce numéro de téléphone est invalide.',
    *   minLength: 10,
    *   maxLength: 20
    * });
    *```
    * @see https://gitlab.com/catamphetamine/libphonenumber-js for more formatting capabilities
    */
    public validate = (
        value: string | undefined,
        targetInputname: string,
        optionsinputTel: TelInputOptions
        //le dernier parametre est ignorer nous n'avons pas besoin ici
    ): this => {

        const rawValue = this.getRawStringValue(value);

        const trimmedTel = rawValue.trim();

        //  VALIDATION: International Format Check (must start with '+')
        if (!trimmedTel.startsWith('+')) {
            return this.setValidationState(
                false,
                "Please enter a valid international number starting with '+' or select a country code.",
                targetInputname
            );
        }

        // VALIDATION: libphonenumber-js
        try {
            const phoneNumber = parsePhoneNumberWithError(trimmedTel, {
                defaultCountry: optionsinputTel.defaultCountry,
                extract: false
            });

            if (!phoneNumber.isValid()) {
                const eg = optionsinputTel.egAwait ?? '+229 01 67 25 18 86';
                return this.setValidationState(
                    false,
                    `Invalid phone number. e.g. ${eg}`,
                    targetInputname
                );
            }

            // JQUERY UPDATE (Cleanup Side-Effect)
            if (typeof jQuery !== 'undefined') {
                jQuery(`input[name="${targetInputname}"]`).val(phoneNumber.formatInternational());
            }

        } catch (error) {
            console.error('Phone validation error:', error);

            const msg = error instanceof ParseError || error instanceof Error
                ? error.message
                : 'Unknown phone number error';
            const eg = optionsinputTel.egAwait ?? '+229 01 67 25 18 86';

            return this.setValidationState(
                false,
                `${msg} e.g. ${eg}`,
                targetInputname
            );
        }

        // Validation de structure via TextInputValidator (min, max, required)
        textInputValidator.validate(
            trimmedTel,
            targetInputname, {
            errorMessageInput: optionsinputTel.errorMessageInput ?? 'This phone number seems to be invalid',
            minLength: optionsinputTel.minLength ?? 8,
            maxLength: optionsinputTel.maxLength ?? 80,
            requiredInput: optionsinputTel.requiredInput ?? true,
            typeInput: 'tel'
        }, true);

        // Short-circuiting: if the field is invalid, stop here.
        if (!this.formErrorStore.isFieldValid(targetInputname)) {
            return this;
        }

        return this;
    }

}
export const telInputValidator = TelInputValidator.getInstance();