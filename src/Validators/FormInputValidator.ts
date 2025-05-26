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
import { FormError } from "./FormError";
import { ValidatorFormInputNoTypeFileInterface, FormInputType } from "./ValidatorFormInputNoTypeFileInterface";
import { OptionsValidateNoTypeFile, OptionsInputField, DateOptions, OptionsRadio, SelectOptions, URLOptions, PassworkRuleOptions, NumberOptions, OptionsCheckbox } from ".";
const emailErrorMessage = "Please enter a valid email address";
const phoneErrorMessage = 'This phone number seems to be invalid';
const textErrormMessage = "The content of this field must contain only alphabetical letters and must not null";
const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^(\+|00|0)[0-9]{1,3}[0-9]{1,4}[0-9]{6,13}$/s
const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/

export class FormInputValidator extends FormError implements ValidatorFormInputNoTypeFileInterface {
	private static m_instance_validator: FormInputValidator;
	private constructor() { super() }
	/**
	 * Méthode statique pour récupérer ou créer l'instance unique de la classe.
	 * @returns L'instance unique de TextInputValidator.
	 */
	public static getInstance = (): FormInputValidator => {
		if (!FormInputValidator.m_instance_validator) {
			FormInputValidator.m_instance_validator = new FormInputValidator();
		}
		return FormInputValidator.m_instance_validator;
	}

	public allTypesValidator = (
		datainput: string | string[] | number | null | undefined,
		targetInputname: string,
		type_field: FormInputType,
		options_validator: OptionsValidateNoTypeFile
	): this => {
		switch (type_field) {
			case 'email':
				if (this.isOptionsInputField(options_validator)) {
					this.emailValidator(datainput as string, targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			case 'password':
				if (this.isPassworkRuleOptions(options_validator)) {
					this.passwordValidator(datainput as string, targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			case 'text':
				if (this.isOptionsInputField(options_validator)) {
					this.textValidator(datainput as string, targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			case 'textarea':
				if (this.isOptionsInputField(options_validator)) {
					this.textValidator(datainput as string, targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			case 'url':
				if (this.isURLOptions(options_validator)) {
					this.urlValidator(datainput as string, targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			case 'date':
				if (this.isDateOptions(options_validator)) {
					this.dateValidator(datainput as string, targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			case 'tel':
				if (this.isOptionsInputField(options_validator)) {
					this.telValidator(datainput as string, targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			case 'select':
				if (this.isSelectOptions(options_validator)) {
					this.selectValidator(datainput as string | string[], targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			case 'number':
				if (this.isNumberOptions(options_validator)) {
					this.numberValidator(datainput as string | number, targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			case 'checkbox':
				if (this.isCheckboxOptions(options_validator)) {
					this.checkboxValidator(datainput as number, targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			case 'radio':
				if (this.isRadioOptions(options_validator)) {
					this.radioValidator(datainput as string | null | undefined, targetInputname, options_validator);
				} else {
					throw new TypeError(`Invalid options for ${type_field} validator.`);
				}
				break;
			default:
				throw new ReferenceError(`The validation function for ${type_field} is not implemented.`);
		}
		return this;
	};

	public textValidator = (datainput: string | undefined, targetInputname: string,
		optionsinputtext: OptionsInputField = {
			typeInput: 'text',
			regexValidator: /^[a-zA-ZÀ-ÿ\s]+$/i,
			requiredInput: true,
			escapestripHtmlAndPhpTags: true
		}): this => {
		let messageerror = optionsinputtext.errorMessageInput ?? textErrormMessage;
		const regexName = optionsinputtext.regexValidator ?? /^[\p{L}\s]+$/u;
		if (!datainput) {
			return this.validatorRequired(datainput, targetInputname, optionsinputtext.requiredInput || true);
		}
		let datavalue = datainput.trim();
		if (optionsinputtext.escapestripHtmlAndPhpTags && optionsinputtext.escapestripHtmlAndPhpTags === true) {
			datavalue = escapeHtmlBalise(datainput) as string;
		}
		if (optionsinputtext.typeInput && optionsinputtext.typeInput !== "textarea") {
			messageerror = `${messageerror} eg:${optionsinputtext.egAwait ?? "WLINDABLA Franck Empedocle"}`
		}
		if (regexName.test(datavalue) === false) {
			return this.setValidatorStatus(false, messageerror, targetInputname);
		}
		this.validatorLength(datavalue, targetInputname, optionsinputtext.minLength, optionsinputtext.maxLength);
		return this;
	}
	public emailValidator = (datavalueemail: string, targetInputnameemail: string, optionsinputemail: OptionsInputField = { minLength: 6, maxLength: 180 }): this => {
		return this.textValidator(datavalueemail, targetInputnameemail, {
			errorMessageInput: `${optionsinputemail.errorMessageInput ?? emailErrorMessage}`,
			regexValidator: optionsinputemail.regexValidator ?? emailRegex,
			minLength: optionsinputemail.minLength ?? 6,
			maxLength: optionsinputemail.maxLength ?? 180,
			requiredInput: optionsinputemail.requiredInput ?? true,
			egAwait: optionsinputemail.egAwait ?? "franckagbokoudjo301@gmail.com",
			typeInput: 'email'
		});
	};
	public telValidator = (data_tel: string, targetInputname: string, optionsinputTel: OptionsInputField): this => {
		return this.textValidator(data_tel, targetInputname, {
			regexValidator: optionsinputTel.regexValidator ?? phoneRegex,
			errorMessageInput: `${optionsinputTel.errorMessageInput ?? phoneErrorMessage}`,
			minLength: optionsinputTel.minLength ?? 8,
			maxLength: optionsinputTel.maxLength ?? 80,
			requiredInput: optionsinputTel.requiredInput ?? true,
			egAwait: optionsinputTel.egAwait ?? "+229016725186",
			typeInput: 'tel'
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
			this.setValidatorStatus(false, "Password must contain at least one uppercase letter.", targetInputname);
		}
		if (optionsinputtext.lowerCaseAllow && !/[a-z]/.test(datainput)) {
			this.setValidatorStatus(false, "Password must contain at least one lowercase letter.", targetInputname);
		}
		if (optionsinputtext.numberAllow && !/[0-9]/.test(datainput)) {
			this.setValidatorStatus(false, "Password must contain at least one numeric digit.", targetInputname);
		}
		if (optionsinputtext.specialChar && !/[!@#$%^&*(),.?":{}|<>[\]\\]/.test(datainput)) {
			this.setValidatorStatus(false, "Password must contain at least one special character.", targetInputname);
		}
		return this.textValidator(datainput,
			targetInputname,
			{
				minLength: optionsinputtext.minLength,
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
			this.setValidatorStatus(false, `The hostname ${parsedURL.hostname} does not contain a required TLD.`, targetInputname);
		}
		// Vérifie si localhost est autorisé
		if (!url_options.allowLocalhost && (parsedURL.hostname === 'localhost' || parsedURL.hostname === '127.0.0.1')) {
			this.setValidatorStatus(false, `The hostname ${parsedURL.hostname} is not allowed.`, targetInputname);
		}
		// Vérifie si les IPs sont autorisées
		if (!url_options.allowIP && /^[\d.]+$/.test(parsedURL.hostname)) {
			this.setValidatorStatus(false, `IP addresses are not allowed in URLs.`, targetInputname);
		}
		// Vérifie si les paramètres de requête sont autorisés
		if (!url_options.allowQueryParams && parsedURL.search) {
			this.setValidatorStatus(false, `Query parameters ${parsedURL.search} are not allowed in the URL.`, targetInputname);
		}
		// Vérifie si les fragments (#) sont autorisés
		if (!url_options.allowHash && parsedURL.hash) {
			this.setValidatorStatus(false, `URL fragments ${parsedURL.hash} are not allowed.`, targetInputname);
		}
		return this.textValidator(urlData,
			targetInputname,
			{
				regexValidator: url_options.regexValidator ?? urlRegex,
				errorMessageInput: url_options.errorMessageInput ?? `${urlData.trim()} is invalid. Expected format: https://example.com  `,
				minLength: url_options.minLength ?? 8,
				maxLength: url_options.maxLength ?? 255,
				escapestripHtmlAndPhpTags: url_options.escapestripHtmlAndPhpTags ?? true,
				typeInput: "url"
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


	public selectValidator = (value_index: string | string[], targetInputname: string, options_select: SelectOptions): this => {
		let is_include: boolean = true;
		let error_message: string | undefined;
		const { optionsChoices, escapestripHtmlAndPhpTags } = options_select;
		if (escapestripHtmlAndPhpTags === true) {
			value_index = escapeHtmlBalise(value_index) as string | string[];
		}
		if (typeof value_index === "string") {
			if (!optionsChoices.includes(value_index)) {
				is_include = false;
				error_message = `The selected value "${value_index}" is not included in the available options: ${options_select.optionsChoices.join(" | ")}`;
			}
		} else if (Array.isArray(value_index)) {
			const set_optionsChoices = new Set(optionsChoices);
			const value_exclude: string[] = value_index.filter(element => !set_optionsChoices.has(element));
			if (value_exclude.length > 0) {
				is_include = false;
				error_message = `The selected values "${value_exclude.join(', ')}" are not included in the available options: ${options_select.optionsChoices.join(" | ")}`;
			}
		}
		if (!is_include && error_message) {
			this.setValidatorStatus(
				false,
				error_message,
				targetInputname
			);
		}
		return this;
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
	public checkboxValidator = (
		checkCount: number,
		groupName: string,
		options_checkbox?: OptionsCheckbox
	): this => {
		if (!options_checkbox) return this;

		const { minAllowed, maxAllowed, required, optionsChoicesCheckbox, dataChoices } = options_checkbox;

		if (required && checkCount === 0) {
			return this.setValidatorStatus(
				false,
				`Please select at least one option in the "${groupName}" group.`,
				groupName
			);
		}

		if (typeof maxAllowed === "number" && checkCount > maxAllowed) {
			return this.setValidatorStatus(
				false,
				`You can only select up to ${maxAllowed} options in the "${groupName}" group.`,
				groupName
			);
		}

		if (typeof minAllowed === "number" && checkCount < minAllowed) {
			return this.setValidatorStatus(
				false,
				`You must select at least ${minAllowed} options in the "${groupName}" group.`,
				groupName
			);
		}

		return this.selectValidator(
			dataChoices,
			groupName,
			{
				optionsChoices: optionsChoicesCheckbox
			}
		);
	}
	public radioValidator = (
		selectedValue: string | null | undefined,
		groupName: string,
		options_radio?: OptionsRadio
	): this => {
		if (!options_radio) { return this; }
		const { required } = options_radio;
		if (required && !selectedValue) {
			return this.setValidatorStatus(
				false,
				`Please select an option in the "${groupName}" group.`,
				groupName
			);
		}

		return this;
	}

	protected validatorRequired = (datainput: string | undefined, targetInputname: string, required: boolean = true): this => {
		if (required === true && !datainput) {
			this.setValidatorStatus(false, "this input field is mandatory", targetInputname)
		}
		return this;
	}
	private validatorLength = (datavaluelength: string, targetInputname: string, minlength: number | undefined, maxlength: number | undefined): this => {
		if (datavaluelength) {
			if (minlength && datavaluelength.length < minlength) {
				this.setValidatorStatus(false, `please enter at least ${minlength} characters`, targetInputname);
			}
			if (maxlength && datavaluelength.length > maxlength) {
				this.setValidatorStatus(false, `please enter at less than ${maxlength} characters `, targetInputname)
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
	private isNumberOptions(obj: unknown): obj is NumberOptions {
		return obj !== null && typeof obj === "object" && "min" in obj;
	}
	private isCheckboxOptions(obj: unknown): obj is OptionsCheckbox {
		return obj !== null && typeof obj === "object" && "required" in obj;
	}
	private isRadioOptions(obj: unknown): obj is OptionsRadio {
		return obj !== null && typeof obj === "object" && "required" in obj;
	}
}