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

import { checkHost, deepMergeAll, isIP, CustomURL as URL } from "../../../_Utils";
import { AbstractFieldValidator } from "../FieldValidator";
import { TextInputOptions, textInputValidator } from "./TextInputValidator";
import { fqdnInputValidator, FQDNOptions } from "./FQDNInputValidator";

export interface URLOptions extends FQDNOptions, TextInputOptions {
    allowedProtocols?: string[];  // Ex: ['http', 'https']
    allowLocalhost?: boolean;     // Autoriser localhost
    allowIP?: boolean;            // Accepter les adresses IP
    allowQueryParams?: boolean;   // Accepter ?key=value
    allowHash?: boolean;           // Accepter #section
    validateLength?: boolean;   //if set to false isURL will skip string length validation. `max_allowed_length` will be ignored if this is set as `false`.
    maxAllowedLength?: number;  //if set, isURL will not allow URLs longer than the specified value (default is 2084 that IE maximum URL length).
    requirePort?: boolean;
    disallowAuth?: boolean; // Exclure user:pass@host
    allowProtocolRelativeUrls?: boolean; // Ex : //example.com
    hostWhitelist?: (string | RegExp)[];
    hostBlacklist?: (string | RegExp)[];
    requireHost?: boolean;
    requireValidProtocol?: boolean;
    requireProtocol?: boolean;
}
export interface URLInputValidatorInterface {
    /**
     * Validates a URL string according to customizable rules and constraints.
     * 
     * This function ensures that the input URL is syntactically valid and conforms to the provided rules,
     * such as accepted protocols, required host, optional port, TLD presence, and whether IPs or localhost are allowed.
     * 
     * @param urlData - The raw URL string to validate (e.g., "https://example.com").
     * @param targetInputname - The identifier or name of the input field (used for error tracking).
     * @param url_options - An object of validation rules extending `FQDNOptions`.
     * 
     * @param url_options.allowedProtocols - Array of allowed protocols (e.g., `["http", "https", "ftp"]`).  
     * @param url_options.requireProtocol - If `true`, the URL must include a protocol (`http://`, `https://`, etc.).  
     * @param url_options.requireValidProtocol - If `true`, the protocol must be included in `allowedProtocols`.  
     * @param url_options.allowProtocolRelativeUrls - If `true`, allows protocol-relative URLs like `//example.com`.  
     * @param url_options.requireHost - If `true`, the URL must include a host (e.g., `example.com`).  
     * @param url_options.requirePort - If `true`, the URL must include a port (e.g., `:8080`).  
     * @param url_options.allowIP - If `true`, IP addresses (IPv4 or IPv6) are accepted as hosts.  
     * @param url_options.allowLocalhost - If `true`, `localhost` and `127.0.0.1` are accepted as hosts.  
     * @param url_options.allowQueryParams - If `true`, query parameters (e.g., `?id=123`) are allowed.  
     * @param url_options.allowHash - If `true`, URL fragments (e.g., `#section1`) are allowed.  
     * @param url_options.regexValidator - A custom `RegExp` to further validate the complete URL.  
     * @param url_options.validateLength - If `true`, checks that the URL length does not exceed `maxAllowedLength`.  
     * @param url_options.maxAllowedLength - Maximum allowed length for the URL string (default: `2048`).  
     * @param url_options.disallowAuth - If `true`, URLs with credentials (`user:pass@host`) are rejected.  
     * @param url_options.hostBlacklist - List of disallowed hostnames (strings or RegExp). If matched, validation fails.  
     * @param url_options.hostWhitelist - List of allowed hostnames (strings or RegExp). If not matched, validation fails.  
     * 
     * @returns A `Promise<this>` — the current instance, to allow method chaining.
     * 
     * @example
     * const validator = new URLInputValidator();
     * await validator.urlValidator("https://example.com", "website", {
     *   allowedProtocols: ["https"],
     *   requireProtocol: true,
     *   allowQueryParams: false,
     *   hostBlacklist: ["banned.com"]
     * });
     */
    validate: (urlData: string, targetInputname: string, url_options: URLOptions) => Promise<this>;
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class URLInputValidator
 * @extends AbstractFieldValidator
 * @implements URLInputValidatorInterface
 */
export class URLInputValidator extends AbstractFieldValidator implements URLInputValidatorInterface {
    private static __instanceURLValidator: URLInputValidator;

    constructor() { super(); }

    public static getInstance(): URLInputValidator {
        if (!URLInputValidator.__instanceURLValidator) {
            URLInputValidator.__instanceURLValidator = new URLInputValidator();
        }

        return URLInputValidator.__instanceURLValidator;
    }

    public validate = async (urlData: string, targetInputname: string, url_options: URLOptions): Promise<this> => {

        if (!urlData || /[\s<>]/.test(urlData) || urlData.startsWith('mailto:') === true) {

            return this.setValidationState(false, `The value "${urlData}" is not a valid URL format.`, targetInputname);
        }

        const __UrlOptions = deepMergeAll<URLOptions>('replace', url_options, {
            ...this.defaultURLOptions,
            minLength: url_options.requireProtocol === true ? 10 : 8,
            escapestripHtmlAndPhpTags: true,
        })

        if (__UrlOptions.validateLength === true ||
            __UrlOptions.escapestripHtmlAndPhpTags === true ||
            __UrlOptions.regexValidator
        ) {
            textInputValidator.validate(
                urlData,
                targetInputname, {
                regexValidator: __UrlOptions.regexValidator,
                errorMessageInput: `${urlData.trim()} is invalid. Expected format: https://example.com`,
                minLength: __UrlOptions.minLength,
                maxLength: __UrlOptions.maxAllowedLength,
                escapestripHtmlAndPhpTags: __UrlOptions.escapestripHtmlAndPhpTags,
                typeInput: "url",
                egAwait: undefined
            }, true)

            if (!this.formErrorStore.isFieldValid(targetInputname)) { return this; }
        }

        let parsedURL: URL;

        try {
            parsedURL = new URL(urlData);
        } catch (error: any) {

            console.error('error:URLInputValidator', error);

            return this.setValidationState(false, `The value "${urlData}" is not a valid URL.`, targetInputname);
        }

        const protocol = parsedURL.protocol.replace(':', '');

        const hostname = parsedURL.hostname;

        await fqdnInputValidator.validate(hostname, targetInputname, {
            requireTLD: __UrlOptions.requirePort,
            ignoreMaxLength: __UrlOptions.ignoreMaxLength,
            allowTrailingDot: __UrlOptions.allowTrailingDot,
            allowedUnderscores: __UrlOptions.allowedUnderscores,
            allowNumericTld: __UrlOptions.allowNumericTld,
            allowWildcard: __UrlOptions.allowWildcard
        });

        if (!this.formErrorStore.isFieldValid(targetInputname)) { return this; }

        if (__UrlOptions.requireHost && (!hostname || hostname.trim() === '')) {
            return this.setValidationState(false, `A hostname is required in the URL.`, targetInputname);
        }

        // Vérifie protocole obligatoire
        if (__UrlOptions.requireProtocol && !parsedURL.protocol) {
            return this.setValidationState(false, `Protocol is required in the URL.`, targetInputname);
        }
        // Vérifie que le protocole est autorisé
        if (parsedURL.protocol &&
            __UrlOptions.requireValidProtocol &&
            __UrlOptions.allowedProtocols &&
            !__UrlOptions.allowedProtocols.includes(protocol)) {
            return this.setValidationState(
                false,
                `The protocol "${protocol}" is not allowed. Allowed protocols: ${__UrlOptions.allowedProtocols.join(",")}.`,
                targetInputname
            );
        }

        // Localhost interdit
        if (!__UrlOptions.allowLocalhost && (hostname === "localhost" || hostname === "127.0.0.1")) {
            return this.setValidationState(false, `The hostname "${hostname}" is not allowed.`, targetInputname);
        }
        // IPs interdites
        if (!__UrlOptions.allowIP && (isIP(parsedURL.hostname, { version: 4 }) || isIP(parsedURL.hostname, { version: 6 }))) {
            return this.setValidationState(false, `IP addresses (IPv4 or IPv6) are not allowed in URLs.`, targetInputname);
        }
        // Paramètres de requête interdits
        if (!__UrlOptions.allowQueryParams && parsedURL.search) {
            return this.setValidationState(false, `Query parameters "${parsedURL.search}" are not allowed.`, targetInputname);
        }
        // Fragments (#) interdits
        if (!__UrlOptions.allowHash && parsedURL.hash) {
            return this.setValidationState(false, `Fragments "${parsedURL.hash}" are not allowed.`, targetInputname);
        }
        // Disallow protocol-relative URLs if not allowed
        if (urlData.startsWith('//') && !__UrlOptions.allowProtocolRelativeUrls) {
            return this.setValidationState(false, `Protocol-relative URLs (//example.com) are not allowed.`, targetInputname);
        }
        // Require port
        if (__UrlOptions.requirePort && !parsedURL.port) {
            return this.setValidationState(false, `The URL must specify a port.`, targetInputname);
        }
        // Disallow auth (user:pass)
        if (__UrlOptions.disallowAuth && (parsedURL.username || parsedURL.password)) {
            return this.setValidationState(false, `Authentication credentials in URLs are not allowed.`, targetInputname);
        }
        // Host blacklist
        if (__UrlOptions.hostBlacklist && checkHost(hostname, __UrlOptions.hostBlacklist)) {
            return this.setValidationState(false, `The hostname "${hostname}" is blacklisted.`, targetInputname);
        }
        // Host whitelist
        if (__UrlOptions.hostWhitelist && !checkHost(hostname, __UrlOptions.hostWhitelist)) {
            return this.setValidationState(false, `The hostname "${hostname}" is not in the allowed list.`, targetInputname);
        }
        return this;
    }

    public get defaultURLOptions(): URLOptions {
        return {
            allowLocalhost: false,
            allowIP: false,
            allowHash: true,
            allowQueryParams: true,
            requirePort: false,
            requireHost: true,
            maxAllowedLength: 2048,
            validateLength: true,
            regexValidator: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
            allowProtocolRelativeUrls: false,
            requireValidProtocol: true,
            requireProtocol: false,
            allowedProtocols: ["ftp", "https", "http"],
            disallowAuth: false,
            hostBlacklist: [],
            hostWhitelist: []
        }
    }
}
export const urlInputValidator = URLInputValidator.getInstance();