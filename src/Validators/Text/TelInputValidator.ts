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

import { TextInputOptions, textInputValidator } from "./TextInputValidator";
import { FormError } from "../FormError";
import { parsePhoneNumberWithError, ParseError, CountryCode } from "libphonenumber-js";
import { Logger } from "../../_Utils";
export interface TelInputOptions extends TextInputOptions {
    defaultCountry: CountryCode;
}
export interface TelInputValidatorInterface {
    /**
* Validates a phone number in international format using `libphonenumber-js`.
* Ensures that the number starts with a '+' sign and is valid for the specified country.
* If valid, formats and optionally updates the input field using jQuery (if present).
*
* - Automatically checks if the number is valid based on its international format.
* - Falls back to `defaultCountry` for more accurate validation when possible.
* - Provides custom error messages and supports additional input constraints (min/max length, required).
*
* @param data_tel - The phone number input string (should be trimmed and preferably start with '+').
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
*  telInputValidator.telValidator('+229016725186', 'phone', {
*   defaultCountry: 'BJ',
*   egAwait: '+229 01 67 25 18 86',
*   requiredInput: true
* });
*```
* @example
* ```typescript
*  telInputValidator.telValidator('+33612345678', 'mobile', {
*   defaultCountry: 'FR',
*   errorMessageInput: 'Ce numéro de téléphone est invalide.',
*   minLength: 10,
*   maxLength: 20
* });
*```
* @see https://gitlab.com/catamphetamine/libphonenumber-js for more formatting capabilities
*/
    telValidator: (
        data_tel: string,
        targetInputname: string,
        optionsinputTel: TelInputOptions
    ) => this;
}
/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @extends FormError
 * @interface TelInputValidatorInterface
 */
export class TelInputValidator extends FormError implements TelInputValidatorInterface {
    private static __instanceTelValidator: TelInputValidator;
    public static getInstance(): TelInputValidator {
        if (!TelInputValidator.__instanceTelValidator) {
            TelInputValidator.__instanceTelValidator = new TelInputValidator();
        }
        return TelInputValidator.__instanceTelValidator;
    }
    public telValidator = (
        data_tel: string,
        targetInputname: string,
        optionsinputTel: TelInputOptions
    ): this => {
        const raw_tel = data_tel.trim();

        // 1. Rejette toute entrée qui ne commence pas par l’indicatif international
        if (!raw_tel.startsWith('+')) {
            return this.setValidatorStatus(
                false,
                "Please enter a valid international number starting with '+' or select a country code.",
                targetInputname
            );
        }

        try {
            // 2. Parse le numéro à l’aide de libphonenumber-js
            const phoneNumber = parsePhoneNumberWithError(raw_tel, {
                defaultCountry: optionsinputTel.defaultCountry,
                extract: false
            });

            // 3. Vérifie la validité
            if (!phoneNumber.isValid()) {
                return this.setValidatorStatus(
                    false,
                    `Invalid phone number. e.g. ${optionsinputTel.egAwait ?? '+229 01 67 25 18 86'}`,
                    targetInputname
                );
            }

            // 4. Met à jour le champ si jQuery est présent
            if (typeof jQuery !== 'undefined') {
                jQuery(`input[name="${targetInputname}"]`).val(phoneNumber.formatInternational());
            }

        } catch (error) {
            Logger.error('Phone validation error:', error);

            const msg =
                error instanceof ParseError || error instanceof Error
                    ? error.message
                    : 'Unknown phone number error';

            return this.setValidatorStatus(
                false,
                `${msg} e.g. ${optionsinputTel.egAwait ?? '+229 01 67 25 18 86'}`,
                targetInputname
            );
        }

        // 5. Validation de structure via textValidator (min, max, required)
        textInputValidator.textValidator(data_tel, targetInputname, {
            errorMessageInput: optionsinputTel.errorMessageInput ?? 'This phone number seems to be invalid',
            minLength: optionsinputTel.minLength ?? 8,
            maxLength: optionsinputTel.maxLength ?? 80,
            requiredInput: optionsinputTel.requiredInput ?? true,
            typeInput: 'tel'
        }, true);

        return this;
    }
}
export const telInputValidator = TelInputValidator.getInstance();