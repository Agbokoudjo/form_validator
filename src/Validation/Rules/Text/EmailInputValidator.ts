
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

import { isIP, checkHost, isByteLength, deepMerge, deepMergeAll } from "../../../_Utils";
import { AbstractFieldValidator } from "../FieldValidator";
import { FQDNOptions, fqdnInputValidator } from "./FQDNInputValidator";
import { TextInputOptions, textInputValidator } from "./TextInputValidator";

export interface EmailInputOptions extends FQDNOptions, TextInputOptions {
    allowUtf8LocalPart?: boolean;
    allowIpDomain?: boolean;
    allowQuotedLocal?: boolean;
    ignoreMaxLength?: boolean;
    hostBlacklist?: Array<string | RegExp>;
    hostWhitelist?: Array<string | RegExp>;
    blacklistedChars?: string;
    requireDisplayName?: boolean,
    allowDisplayName?: boolean,
}
interface EmailInputValidatorInterface {
    /**  
     * Validates an email input field.  
     * Checks if the entered value adheres to a specific format, minimum and maximum length, and if the field is required.  
     * Updates the state and error messages associated with the field in case of validation failure.  
     *  
     * @param datainputemail (string) : The input value to validate.  
     * @param targetInputnameemail (string) : The identifier or key associated with the input field in the form.  
     * @param optionsinputemail (OptionsInputText) : Object containing validation options.  
     * - errorMessageInput (string) : Custom error message if validation fails.  
     * - regexValidator (RegExp) : Custom regular expression to validate the email format.  
     * - minLength (number) : Minimum allowed length for the input.  
     * - maxLength (number) : Maximum allowed length for the input.  
     * - requiredInput (boolean) : Indicates if the field is mandatory.  
     * @returns this : The current class instance, allowing method chaining.  
     *  
     */
    validate: (datainput: string, targetInputname: string, optionsinputemail: EmailInputOptions) => Promise<this>;
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class EmailInputValidator
 * @extends AbstractFieldValidator
 * @implements EmailInputValidatorInterface
 */
export class EmailInputValidator extends AbstractFieldValidator implements EmailInputValidatorInterface {
    private static __instanceEmailValidator: EmailInputValidator;
    private readonly __defaultEmailRegex =

        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    private readonly __splitNameAddress = /^([^\x00-\x1F\x7F-\x9F\cX]+)</i;

    private readonly __simpleEmailPart = /^[a-z\d!#$%&'*+\-/=?^_`{|}~]+$/i;

    private readonly __utf8EmailPart = /^[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;

    private readonly __quotedLocalUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\u00A0-\uFFEF!#-[\]-~]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/;

    private readonly __quotedLocalAscii = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f!#-[\]-~]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/;

    private constructor() { super(); }

    public static getInstance(): EmailInputValidator {
        if (!EmailInputValidator.__instanceEmailValidator) {
            EmailInputValidator.__instanceEmailValidator = new EmailInputValidator()
        }

        return EmailInputValidator.__instanceEmailValidator;
    }

    public validate = async (datainput: string, targetInputname: string, optionsinputemail: EmailInputOptions): Promise<this> => {

        // Clear state at the start (assume valid until proven otherwise)
        this.formErrorStore.clearFieldState(targetInputname);

        const __emailOptions = deepMergeAll('replace', optionsinputemail, this.defaultEmailInputOptions);
        // Gère les noms affichés ("John Doe <john@example.com>")
        if (__emailOptions.requireDisplayName || __emailOptions.allowDisplayName) {
            const display_email = datainput.match(this.__splitNameAddress); //detecte un Display Name dans une adresse e-mail comme : "John Doe" 

            if (display_email) {
                let display_name = display_email[1].trim(); //it get -> John Doe
                // supprime displayName et les chevrons,on obtient -> john@example.com
                datainput = datainput.replace(display_name, '');
                // 2. Nettoyage et Retrait des Chevrons
                // On supprime les espaces de début/fin, puis on supprime les chevrons aux extrémités.
                datainput = datainput.trim().replace(/(^<|>$)/g, '');
                // sometimes need to trim the last space to get the display name
                // because there may be a space between display name and email address
                // eg. myname <address@gmail.com>
                // the display name is `myname` instead of `myname `, so need to trim the last space
                if (display_name.endsWith(' ')) {
                    display_name = display_name.slice(0, -1);  // supprime espace final
                }

                const is_validate_display_name = this.validateDisplayName(display_name);
                if (is_validate_display_name) {
                    return this.setValidationState(false, is_validate_display_name, targetInputname);
                }

            } else if (__emailOptions.requireDisplayName) {
                // --- LOGIQUE D'ÉCHEC POUR NOM D'AFFICHAGE MANQUANT ---
                // Ce bloc est exécuté SEULEMENT si :
                // 1. requireDisplayName est VRAI (dû au `else if`)
                // 2. Le display_email n'a PAS été trouvé (dû au `else`)
                return this.setValidationState(
                    false,
                    `${targetInputname} field must include a display name like "John Doe <example@email.com>"`,
                    targetInputname
                );
            }
        }

        textInputValidator.validate(datainput, targetInputname, {
            requiredInput: optionsinputemail.requiredInput ?? true,
            minLength: 6,
            maxLength: optionsinputemail.ignoreMaxLength ? undefined : optionsinputemail.maxLength ?? 254,
            typeInput: 'email',
            errorMessageInput: optionsinputemail.errorMessageInput ?? "Please enter a valid email address",
            escapestripHtmlAndPhpTags: optionsinputemail.escapestripHtmlAndPhpTags,
            regexValidator: this.__defaultEmailRegex,
            egAwait: optionsinputemail.egAwait ?? "franckagbokoudjo301@gmail.com",
        }, true);

        if (!this.formErrorStore.isFieldValid(targetInputname)) { return this; };

        let [local, domain] = datainput.split('@');//Séparer l’email en deux parties : utilisateur + domaine

        const lower_domain = domain.toLowerCase();
        // Vérifie les domaines blacklistés
        if (__emailOptions.hostBlacklist &&
            __emailOptions.hostBlacklist.length > 0
            && checkHost(lower_domain, __emailOptions.hostBlacklist)) {
            return this.setValidationState(
                false,
                `${targetInputname} field contains a blacklisted domain: "${lower_domain}".`,
                targetInputname
            );
        }

        // Vérifie les domaines whitelistés
        if (__emailOptions.hostWhitelist &&
            __emailOptions.hostWhitelist.length > 0
            && !checkHost(lower_domain, __emailOptions.hostWhitelist)) {
            return this.setValidationState(
                false,
                `${lower_domain} must belong to one of the allowed domains.`,
                targetInputname
            );
        }

        // Vérifie la longueur des deux parties (local part et domaine)
        if (
            !__emailOptions.ignoreMaxLength &&
            (!isByteLength(local, { max: 64 }) || !isByteLength(domain, { max: optionsinputemail.maxLength ?? 254 }))
        ) {
            return this.setValidationState(
                false,
                `${datainput} is too long. The local part must be ≤ 64 characters and the domain ≤ ${optionsinputemail.maxLength ?? 254} characters.`,
                targetInputname
            );
        }

        let isIpAddressDomain = false;

        if (domain.startsWith('[') && domain.endsWith(']')) {
            isIpAddressDomain = true;

            // A. Étape 1: Vérifier si allowIpDomain est FALSE
            if (!__emailOptions.allowIpDomain) {
                return this.setValidationState(
                    false,
                    `${domain} must not contain an IP domain.`,
                    targetInputname
                );
            }

            // B. Étape 2: Vérifier si l'IP est valide (si allowIpDomain est TRUE)
            const strippedDomain = domain.slice(1, -1); // Supprime les crochets
            if ((!strippedDomain || strippedDomain.length === 0) || !isIP(strippedDomain)) {
                return this.setValidationState(
                    false,
                    `${strippedDomain} contains an invalid IP address in domain.`,
                    targetInputname
                );
            }
            // Si nous arrivons ici, l'IP est valide et autorisée. L'e-mail est valide si la partie locale l'est.

        }

        if (!isIpAddressDomain) {

            /**
            * cette fonction est dedier a la validation FQDN  et appartient a la class FQDNInputValidator
            * qui est une fonction async qui renvoie une promise de l'instance de la class,nous avons mis la fonction
            * async puique nous avons besoin de ça dans certains class dans le but de ne pas repeter la logique et ne pas empeche
            * la validation des donnees .
            */
            await fqdnInputValidator.validate(domain, targetInputname, {
                requireTLD: __emailOptions.requireTLD,
                ignoreMaxLength: __emailOptions.ignoreMaxLength,
                allowedUnderscores: __emailOptions.allowedUnderscores,
                allowWildcard: __emailOptions.allowWildcard,
                allowTrailingDot: __emailOptions.allowTrailingDot,
                allowNumericTld: __emailOptions.allowNumericTld,
                allowHyphens: __emailOptions.allowHyphens
            });

            /**
             * Si le domaine n'est pas un FQDN, forcement dans la logique de construction de la fonction this.fqdnValidator
             *  aura une invalidation du champ dont son etat de validation est false raison pour laquelle
             * on emploie  if(!this.hasErrorsField(targetInputname)){return this;} 
             */
            if (!this.formErrorStore.isFieldValid(targetInputname)) { return this; }

        }

        //  Rejette les caractères interdits (blacklist)
        if (__emailOptions.blacklistedChars) {
            const blacklistedCharsIndex = local.search(new RegExp(`${__emailOptions.blacklistedChars}+`, 'g'));
            if (blacklistedCharsIndex !== -1) {
                return this.setValidationState(
                    false,
                    `${local} must not contain the forbidden character(s): <strong>${__emailOptions.blacklistedChars}</strong>`,
                    targetInputname
                );
            }
        }

        const is_validate_local_part = this.validateLocalPart(local, __emailOptions.allowUtf8LocalPart);
        if (is_validate_local_part) {

            return this.setValidationState(false, is_validate_local_part, targetInputname);
        }

        return this;
    }

    /**
     * Validate display name according to RFC 2822: https://tools.ietf.org/html/rfc2822#appendix-A.1.2
     *
     * @param displayName - The display name to validate (e.g. `"John Doe"`).
     * @returns `null` if valid, or a string message describing the error.
   */
    private validateDisplayName(displayName: string): string | null {

        const stripped = displayName.replace(/^"(.+)"$/, "$1");// Retire les guillemets éventuels autour du nom

        if (!stripped.trim()) { return "Display name cannot be empty or whitespace only."; }

        if (/[.";<>]/.test(stripped)) { // 2. Vérifie si le nom contient des caractères interdits : " . ; < >

            if (stripped === displayName) { // 2.a. Si le nom n’est pas entre guillemets mais contient ces caractères → erreur
                return "Display name contains illegal characters and must be enclosed in double quotes.";
            }
            // 2.b. Vérifie si les guillemets sont bien échappés avec un antislash (\")
            const isProperlyEscaped =
                stripped.split('"').length === stripped.split('\\"').length;

            if (!isProperlyEscaped) {
                return "Quotes inside the display name must be escaped with a backslash (\\\").";
            }
        }

        return null;
    }

    private validateLocalPart(local: string, allowUtf8LocalPart?: boolean): string | null {

        // Cas 1 : Partie locale entre guillemets
        if (local.startsWith('"') && local.endsWith('"')) {

            const stripped = local.slice(1, -1);

            const quotedRegex = allowUtf8LocalPart ? this.__quotedLocalUtf8 : this.__quotedLocalAscii;

            if (!quotedRegex.test(stripped)) {
                return `The quoted part "${stripped}" contains invalid characters.`;
            }
            return null;
        }
        // Cas 2 : Partie locale standard, séparée par des points
        const parts = local.split('.');
        const regex = allowUtf8LocalPart ? this.__utf8EmailPart : this.__simpleEmailPart;

        for (const part of parts) {
            if (!regex.test(part)) {
                return `The segment "${part}" in the local part of the email is invalid.`;
            }
        }

        return null;
    }

    private get defaultEmailInputOptions(): EmailInputOptions {
        return {
            allowUtf8LocalPart: true,
            allowIpDomain: false,
            allowQuotedLocal: true,
            ignoreMaxLength: false,
            hostBlacklist: [],
            hostWhitelist: [],
            blacklistedChars: '',
            requireDisplayName: false,
            allowDisplayName: false,
        };
    }
}
export const emailInputValidator = EmailInputValidator.getInstance();