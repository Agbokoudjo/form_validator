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
import { textInputValidator } from "./TextInputValidator";
import { fqdnInputValidator} from "./FQDNInputValidator";
import type { URLInputValidatorInterface } from "../../contracts";
import type { URLOptions } from "../../types";

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
        this.formErrorStore.clearFieldState(targetInputname);
        urlData = this.getRawStringValue(urlData)
        
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
                egAwait: undefined,
                match:__UrlOptions.match ?? true
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
            requireTLD: __UrlOptions.requireTLD ?? true,
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
        if (__UrlOptions.hostBlacklist && __UrlOptions.hostBlacklist.length > 0) {
            if (checkHost(hostname, __UrlOptions.hostBlacklist)) {
                return this.setValidationState(false, `The hostname "${hostname}" is blacklisted.`, targetInputname);
            }
        }

        // Host whitelist
        if (__UrlOptions.hostWhitelist && __UrlOptions.hostWhitelist.length > 0) {
            if (!checkHost(hostname, __UrlOptions.hostWhitelist)) {
                return this.setValidationState(false, `The hostname "${hostname}" is not in the allowed list.`, targetInputname);
            }
        }
        
        return this;
    }

    public get defaultURLOptions(): URLOptions {
        return {
            allowLocalhost: false,
            allowIP: false,
            allowHash: true,
            allowQueryParams: true,
            requireTLD: true,
            requirePort: false,
            requireHost: true,
            maxAllowedLength: 2048,
            validateLength: true,
            regexValidator: undefined,
            allowProtocolRelativeUrls: false,
            requireValidProtocol: true,
            requireProtocol: false,
            allowedProtocols: ['http', 'https', 'file', 'blob', 'url', 'data'],
            disallowAuth: false,
            hostBlacklist: undefined,
            hostWhitelist: undefined
        }
    }
}
export const urlInputValidator = URLInputValidator.getInstance();
