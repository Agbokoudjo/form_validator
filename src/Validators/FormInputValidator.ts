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

import { escapeHtmlBalise } from "../_Utils/string";
import { FormError} from "./FormError";
import { ValidatorInterface,OptionsInputField,URLOptions,DateOptions,SelectOptions,PassworkRuleOptions } from "./ValidatorFormInterface";
const emailErrorMessage = "Please enter a valid email address";
const phoneErrorMessage = 'This phone number seems to be invalid';
const textErrormMessage = "The content of this field must contain only alphabetical letters and must not null";
const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^(\+|00|0)[0-9]{1,3}[0-9]{1,4}[0-9]{6,13}$/s    
const  urlRegex = /^(ftp|http|https):\/\/[^ "]+$/

export class FormInputValidator extends FormError  implements  ValidatorInterface{
	private static m_instance_validator: FormInputValidator;
	private constructor() { super() }
	/**
     * Méthode statique pour récupérer ou créer l'instance unique de la classe.
     * @returns L'instance unique de TextInputValidator.
     */
	public static getInstance=():FormInputValidator=> {
		if (!FormInputValidator.m_instance_validator) {
			FormInputValidator.m_instance_validator = new FormInputValidator();
		}
		return FormInputValidator.m_instance_validator;
	}

	public allTypesValidator = (
    datainput: string,
    targetInputname: string,
    type_field:"email" | "password" | "text" | "url" | "date" | "tel" | "select",
    options_validator: OptionsInputField | URLOptions | DateOptions | PassworkRuleOptions | SelectOptions
): this => {
    switch (type_field) {
        case 'email':
            if (this.isOptionsInputField(options_validator)) {
                this.emailValidator(datainput, targetInputname, options_validator);
            } else {
                throw new TypeError(`Invalid options for ${type_field} validator.`);
            }
            break;
        case 'password':
            if (this.isPassworkRuleOptions(options_validator)) {
                this.passwordValidator(datainput, targetInputname, options_validator);
            } else {
                throw new TypeError(`Invalid options for ${type_field} validator.`);
            }
            break;
        case 'text':
            if (this.isOptionsInputField(options_validator)) {
                this.textValidator(datainput, targetInputname, options_validator);
            } else {
                throw new TypeError(`Invalid options for ${type_field} validator.`);
            }
            break;
        case 'url':
            if (this.isURLOptions(options_validator)) {
                this.urlValidator(datainput, targetInputname, options_validator);
            } else {
                throw new TypeError(`Invalid options for ${type_field} validator.`);
            }
            break;
        case 'date':
            if (this.isDateOptions(options_validator)) {
                this.dateValidator(datainput, targetInputname, options_validator);
            } else {
                throw new TypeError(`Invalid options for ${type_field} validator.`);
            }
            break;
        case 'tel':
            if (this.isOptionsInputField(options_validator)) {
                this.telValidator(datainput, targetInputname, options_validator);
            } else {
                throw new TypeError(`Invalid options for ${type_field} validator.`);
            }
            break;
        case 'select':
            if (this.isSelectOptions(options_validator)) {
                this.selectValidator(datainput, targetInputname, options_validator);
            } else {
                throw new TypeError(`Invalid options for ${type_field} validator.`);
            }
            break;
        default:
            throw new ReferenceError(`The validation function for ${type_field} is not implemented.`);
    }
    return this;
};

	public textValidator=(datainput: string, targetInputname: string,
        optionsinputtext: OptionsInputField = {
			typeInput: 'text',
			regexValidator: /^[a-zA-ZÀ-ÿ\s]+$/i,
            requiredInput: true,
             escapestripHtmlAndPhpTags:true
        }): this => {
        let messageerror = optionsinputtext.errorMessageInput ?? textErrormMessage;
        const regexName = optionsinputtext.regexValidator ?? /^[\p{L}\s]+$/u;
        let datavalue = datainput.trim();
        if (optionsinputtext.escapestripHtmlAndPhpTags && optionsinputtext.escapestripHtmlAndPhpTags === true) {
            datavalue = escapeHtmlBalise(datainput) as string;  
        }
		if (optionsinputtext.typeInput && optionsinputtext.typeInput === "text") {
			messageerror=`${messageerror} eg:${optionsinputtext.egAwait ?? "WLINDABLA Franck Empedocle"}`
		}
        if (regexName.test(datavalue)=== false) {
			this.setValidatorStatus(false, messageerror, targetInputname);
        }
        this.validatorLength(datavalue, targetInputname, optionsinputtext.minLength, optionsinputtext.maxLength);
        this.validatorRequired(datavalue, targetInputname, optionsinputtext.requiredInput || true);
        return this;
    }
	public emailValidator = (datavalueemail: string, targetInputnameemail: string, optionsinputemail: OptionsInputField={minLength:6,maxLength:180}): this => { 
		return this.textValidator(datavalueemail, targetInputnameemail, {
			errorMessageInput: `${optionsinputemail.errorMessageInput ?? emailErrorMessage} eg:${optionsinputemail.egAwait ?? "franckagbokoudjo301@gmail.com"}`,
			regexValidator: optionsinputemail.regexValidator ?? emailRegex,
			minLength: optionsinputemail.minLength ?? 6,
			maxLength: optionsinputemail.maxLength ?? 180,
			requiredInput: optionsinputemail.requiredInput ?? true,
			typeInput:'email'
		}); 
	};  
	public telValidator = (data_tel: string, targetInputname: string, optionsinputTel: OptionsInputField): this => {
		return this.textValidator(data_tel, targetInputname, {
			regexValidator: optionsinputTel.regexValidator ?? phoneRegex,
			errorMessageInput: `${optionsinputTel.errorMessageInput ?? phoneErrorMessage} eg:${optionsinputTel.egAwait ?? '+229016725186'}`, 
			minLength: optionsinputTel.minLength ?? 8,
			maxLength: optionsinputTel.maxLength ?? 80,
			requiredInput: optionsinputTel.requiredInput ?? true,
			typeInput:'tel'
		})
	}
	public passwordValidator = (datainput: string, targetInputname: string, optionsinputtext: PassworkRuleOptions = {
		minLength: 16,
		maxLength: 256,
		upperCaseAllow: true,
		lowerCaseAllow: true,
		numberAllow: true,
		specialChar: true,
	}): this => {
		datainput = datainput.trim();
		if (optionsinputtext.upperCaseAllow && !/[A-Z]/.test(datainput)) {
			this.setValidatorStatus(false,"Password must contain at least one uppercase letter.",targetInputname);
		}
	   if (optionsinputtext.lowerCaseAllow && !/[a-z]/.test(datainput)) {
			this.setValidatorStatus(false,"Password must contain at least one lowercase letter.",targetInputname);
		}
		if (optionsinputtext.numberAllow && !/[0-9]/.test(datainput)) {
			this.setValidatorStatus(false,"Password must contain at least one numeric digit.",targetInputname);
		}
		if (optionsinputtext.specialChar && !/[!@#$%^&*(),.?":{}|<>[\]\\]/.test(datainput)) {
			 this.setValidatorStatus(false,"Password must contain at least one special character.",targetInputname);
		}
		return this.textValidator(datainput,
			targetInputname,
			{ minLength:optionsinputtext.minLength,
				maxLength: optionsinputtext.maxLength,
				requiredInput: optionsinputtext.requiredInput ?? true,
				regexValidator: optionsinputtext.regexValidator ?? /[A-Za-z0-9[!@#$%^&*(),.?":{}|<>[\]\\]]/,
				typeInput: "password",
				errorMessageInput: "Password does not match the required pattern. ",
			}
		)
	}
	public urlValidator = (urlData: string,
		targetInputname: string,
		url_options: URLOptions = {
			allowedProtocols: ["ftp", "https", "http"],
			allowLocalhost: false,
			requireTLD: true,
			allowIP: false,
			allowHash: false,
			allowQueryParams: true,
		}): this => {
    	const parsedURL = new URL(urlData.trim());
		// Vérifie si le protocole est autorisé
		if (url_options.allowedProtocols && !url_options.allowedProtocols.includes(parsedURL.protocol.replace(':', ''))) {
			this.setValidatorStatus(false,
				`The protocol ${parsedURL.protocol} is not allowed. Allowed protocols: ${url_options.allowedProtocols.join(", ")}`,
				targetInputname
			);
		}
		// Vérifie si un TLD est requis
		if (url_options.requireTLD && !/\.[a-z]{2,}$/i.test(parsedURL.hostname)) {
			this.setValidatorStatus(false,`The hostname ${parsedURL.hostname} does not contain a required TLD.`,targetInputname);
		}
		// Vérifie si localhost est autorisé
		if (!url_options.allowLocalhost && (parsedURL.hostname === 'localhost' || parsedURL.hostname === '127.0.0.1')) {
			this.setValidatorStatus(false,`The hostname ${parsedURL.hostname} is not allowed.`,targetInputname);
		}
		// Vérifie si les IPs sont autorisées
		if (!url_options.allowIP && /^[\d.]+$/.test(parsedURL.hostname)) {
			this.setValidatorStatus(false,`IP addresses are not allowed in URLs.`,targetInputname);}
		// Vérifie si les paramètres de requête sont autorisés
		if (!url_options.allowQueryParams && parsedURL.search) {
			this.setValidatorStatus(false,`Query parameters ${parsedURL.search} are not allowed in the URL.`,targetInputname);
		}
		// Vérifie si les fragments (#) sont autorisés
		if (!url_options.allowHash && parsedURL.hash) {
			this.setValidatorStatus(false,`URL fragments ${parsedURL.hash} are not allowed.`,targetInputname);
		}
    	return this.textValidator(urlData,
				targetInputname,
				{ regexValidator:url_options.regexValidator ?? urlRegex,
					errorMessageInput: url_options.errorMessageInput ?? `${urlData.trim()} is invalid. Expected format: https://example.com  `,
					minLength: url_options.minLength ?? 8,
					maxLength: url_options.maxLength ?? 255,
					escapestripHtmlAndPhpTags: url_options.escapestripHtmlAndPhpTags ?? true,
					typeInput:"url"
				});
};

	public dateValidator = (date_input: string, targetInputname: string, date_options: DateOptions): this => {
		// Conversion en objet Date
		const dateValue = new Date(date_input);
		if (isNaN(dateValue.getTime())) {
			this.setValidatorStatus(false, `The provided date "${date_input}" is invalid.`, targetInputname);
		}
    	const now = new Date();
		// Vérification de la date minimale
		if (date_options.minDate) {
			const minDate = new Date(date_options.minDate);
			if (dateValue < minDate) {
				this.setValidatorStatus(false, `The date must be after ${date_options.minDate}.`, targetInputname);
			}
		}
		// Vérification de la date maximale
		if (date_options.maxDate) {
			const maxDate = new Date(date_options.maxDate);
			if (dateValue > maxDate) {
				this.setValidatorStatus(false, `The date must be before ${date_options.maxDate}.`, targetInputname);
			}
		}
		// Vérification si les dates futures sont autorisées
		if (date_options.allowFuture === false && dateValue > now) {
			this.setValidatorStatus(false, `The date "${dateValue.toISOString().split('T')[0]}" cannot be in the future.`, targetInputname);
		}
		// Vérification si les dates passées sont autorisées
		if (date_options.allowPast === false && dateValue < now) {
			this.setValidatorStatus(false, `The date "${dateValue.toISOString().split('T')[0]}" cannot be in the past.`, targetInputname);
		}
   		 return this.textValidator(date_input,
				targetInputname, {
				regexValidator: date_options.regexValidator ?? /^\d{4}-\d{2}-\d{2}$/,
				minLength: date_options.minLength ?? 10,
				maxLength: date_options.maxLength ?? 21,
				errorMessageInput: `The value "${date_input}" is not a valid date format. Expected format: YYYY-MM-DD`,
				escapestripHtmlAndPhpTags: true,
				typeInput: "date",
				requiredInput: date_options.requiredInput
			});
		}

	public selectValidator = (value_index: string,targetInputname: string,options_select: SelectOptions): this => {
		if (!options_select.optionsChoices.includes(value_index)) {
			this.setValidatorStatus(
				false,
				`The selected value "${value_index}" is not included in the available options: ${options_select.optionsChoices.join(" | ")}`,
				targetInputname
			);
		}
    	return this.textValidator(value_index, targetInputname, options_select);
};

    protected validatorRequired = (datainput: string, targetInputname: string, required: boolean = true): this => {
        if (required === true && !datainput.trim()) {
            this.setValidatorStatus(false,"this input field is mandatory", targetInputname)
        }
        return this;
    }
    private validatorLength = (datavaluelength: string, targetInputname: string, minlength: number | undefined, maxlength: number | undefined): this => {
        if (datavaluelength) {
            if (minlength && datavaluelength.length < minlength) {
				this.setValidatorStatus(false, `please enter at least ${minlength} characters`, targetInputname);
            }
            if (maxlength && datavaluelength.length > maxlength) {
                this.setValidatorStatus(false,`please enter at less than ${maxlength} characters `,targetInputname)
            }
        }
        return this;
	}
	private isOptionsInputField(obj: unknown): obj is OptionsInputField {
    	return obj !== null && typeof obj === "object" && "regexValidator" in obj;
	}
	private isPassworkRuleOptions(obj: unknown): obj is PassworkRuleOptions {
		return obj !== null && typeof obj === "object" && "minLength" in obj;
	}
	private isURLOptions(obj: unknown): obj is URLOptions {
		return obj !== null && typeof obj === "object" && "protocols" in obj;
	}
	private isDateOptions(obj: unknown): obj is DateOptions {
		return obj !== null && typeof obj === "object" && "minDate" in obj;
	}
	private isSelectOptions(obj: unknown): obj is SelectOptions {
		return obj !== null && typeof obj === "object" && "optionsChoices" in obj;
	}
}