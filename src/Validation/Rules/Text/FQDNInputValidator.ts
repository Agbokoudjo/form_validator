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

import { escapeHtmlBalise, deepMerge } from "../../../_Utils";
import { AbstractFieldValidator } from "../FieldValidator";

export interface FQDNOptions {
    allowWildcard?: boolean; // interdit les domaines de type *.example.com
    allowNumericTld?: boolean; // interdit les TLD purement numériques
    allowedUnderscores?: boolean; //if set to true, the validator will allow underscores in the URL.
    requireTLD?: boolean;         // Exige un TLD comme .com, .org
    allowTrailingDot?: boolean; // if set to true, the validator will allow the domain to end with a `.` character.
    ignoreMaxLength?: boolean; // vérifie que chaque partie ≤ 63 caractères
    allowHyphens?: boolean; // Les tirets sont la norme DNS, donc la valeur par défaut est TRUE.
}

export interface FQDNInputValidatorInterface {

    /**
        * Validates a Fully Qualified Domain Name (FQDN) input field.
        *
        * This function applies strict validation rules on the structure of the domain name, including:
        * - the presence of a valid top-level domain (TLD),
        * - disallowing underscores in domain segments,
        * - optional support for trailing dots,
        * - restrictions on numeric-only TLDs,
        * - length limits on domain segments.
        * 
        * Custom validation behavior can be configured through the provided options.
        * On failure, it updates the validation state and error messages for the target field.
        *
        * @param input - The input string representing the domain name to validate (e.g., `example.com`).
        * @param targetInputname - The name or identifier of the input field in the form (used for error reporting).
        * @param fqdnOptions - An object configuring the validation logic for the domain input.
        *
        * @param fqdnOptions.requireTLD - (default `true`) If `true`, the domain must end with a valid TLD (e.g., `.com`).
        * @param fqdnOptions.allowedUnderscores - (default `false`) If `true`, underscores (`_`) are allowed in domain segments.
        * @param fqdnOptions.allowTrailingDot - (default `false`) If `true`, a trailing dot (e.g., `example.com.`) is permitted.
        * @param fqdnOptions.allowNumericTld - (default `false`) If `true`, allows numeric-only TLDs (e.g., `example.123`).
        * @param fqdnOptions.allowWildcard - (default `false`) If `true`, allows domains that start with a wildcard (`*.example.com`).
        * @param fqdnOptions.ignoreMaxLength - (default `false`) If `true`, bypasses the 63-character-per-label limit.
        * 
        * Inherits from `TextInputOptions`:
        * @param fqdnOptions.regexValidator - A custom regular expression to validate domain format.
        * @param fqdnOptions.errorMessageInput - A custom error message to show if the input is invalid.
        * @param fqdnOptions.minLength - The minimum required character length.
        * @param fqdnOptions.maxLength - The maximum allowed character length.
        * @param fqdnOptions.requiredInput - If `true`, the input must not be empty.
        * @param fqdnOptions.escapestripHtmlAndPhpTags - If `true`, removes HTML and PHP tags before validation.
        * @param fqdnOptions.egAwait - Example value to include in the error message for user guidance.
        *
        * @param ignoreMergeWithDefaultOptions - If `true`, skips merging with default FQDN validation options.
        *
        * @returns A Promise resolving with the current class instance (`this`) for method chaining.
        *
    */

    validate: (input: string, targetInputname: string, fqdnOptions: FQDNOptions, ignoreMergeWithDefaultOptions: boolean) => Promise<this>;
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class FQDNInputValidator
 * @extends AbstractFieldValidator
 * @implements FQDNInputValidatorInterface
 */
export class FQDNInputValidator extends AbstractFieldValidator implements FQDNInputValidatorInterface {

    private static __instanceFQDNValidator: FQDNInputValidator;

    private constructor() { super(); }

    public static getInstance(): FQDNInputValidator {
        if (!FQDNInputValidator.__instanceFQDNValidator) {
            FQDNInputValidator.__instanceFQDNValidator = new FQDNInputValidator()
        }
        return FQDNInputValidator.__instanceFQDNValidator;
    }

    public validate = async (
        input: string,
        targetInputname: string,
        fqdnOptions: FQDNOptions,
        ignoreMergeWithDefaultOptions: boolean = false
    ): Promise<this> => {

        this.formErrorStore.clearFieldState(targetInputname);

        const __fqdnqoptions = this.mergeOptions(fqdnOptions, ignoreMergeWithDefaultOptions);

        input = escapeHtmlBalise(input) as string;

        if (__fqdnqoptions.allowTrailingDot && input.endsWith('.')) { input = input.slice(0, -1); }

        if (__fqdnqoptions.allowWildcard && input.startsWith('*.')) { input = input.slice(2); }

        const parts = input.split('.');

        const tld = parts[parts.length - 1];

        if (__fqdnqoptions.requireTLD) {

            if (parts.length < 2 || !/\.[a-z]{2,}$/i.test(input)) {

                return this.setValidationState(false, `the hostname ${input} does not contain a valid top-level domain.`, targetInputname)
            }

            if (
                !__fqdnqoptions.allowNumericTld &&
                !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)
            ) {
                return this.setValidationState(false, `${input} has an invalid top-level domain (TLD). Only alphabetic or internationalized TLDs are allowed.`, targetInputname);
            }

            if (/\s/.test(tld)) {
                return this.setValidationState(false, `${input} must not use a TLD with spaces`, targetInputname);
            }
        }


        if (!__fqdnqoptions.allowNumericTld && /^\d+$/.test(tld)) {
            return this.setValidationState(false, `${input} must not use a numeric TLD.`, targetInputname);
        }

        for (const part of parts) {

            if (part.length > 63 && !__fqdnqoptions.ignoreMaxLength) {
                return this.setValidationState(false, `${input} contains a label longer than 63 characters.`, targetInputname);
            }

            if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
                return this.setValidationState(false, `${input} contains invalid characters.`, targetInputname);
            }

            if (/[\uff01-\uff5e]/.test(part)) {
                return this.setValidationState(false, `${input} contains full-width characters.`, targetInputname)
            }

            // 🛑 1. VÉRIFICATION DNS STANDARD (Tiret de Début/Fin)
            // C'est une règle DNS stricte. Le tiret ne peut être qu'au milieu.
            // Exception : Nous permettons 'xn--' qui commence par un tiret (Punicode).
            if (part !== 'xn--' && /^-|-$/.test(part)) {
                return this.setValidationState(
                    false,
                    `${input} contains a label starting or ending with '-'.`,
                    targetInputname
                );
            }

            // 🛑 2. VÉRIFICATION DE L'OPTION CUSTOM (Interdiction du Tiret Partout)
            // Si l'option est FALSE et que la partie contient un tiret (n'importe où).
            // La méthode 'includes' est plus lisible et plus rapide que la RegEx.
            if (!__fqdnqoptions.allowHyphens && part.includes('-')) {
                return this.setValidationState(
                    false,
                    `${input} must not contain hyphens ('-') as this is disallowed by settings.`,
                    targetInputname
                );
            }

            if (!__fqdnqoptions.allowedUnderscores && /_/.test(part)) {
                return this.setValidationState(false, `${input} must not contain underscores.`, targetInputname);
            }
        }

        return this;
    }

    private get defaultFQDNOptions(): FQDNOptions {
        return {
            requireTLD: true,           // le domaine doit avoir un TLD (ex. .com)
            allowedUnderscores: false,    // interdit les `_` (pas valides en DNS)
            allowTrailingDot: false,   // le point final est optionnel
            allowNumericTld: false,    // interdit les TLD purement numériques
            allowWildcard: false,       // interdit les domaines de type *.example.com
            ignoreMaxLength: false,    // vérifie que chaque partie ≤ 63 caractères,
            allowHyphens: true, // Les tirets sont la norme DNS, donc la valeur par défaut est TRUE.
        }
    }

    private mergeOptions(fqdnOptions: FQDNOptions, ignoreDefault: boolean): FQDNOptions {

        if (ignoreDefault) { return fqdnOptions; }

        return deepMerge(fqdnOptions, this.defaultFQDNOptions);
    }
}
export const fqdnInputValidator = FQDNInputValidator.getInstance();