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
import { FormInputType, Logger } from "../_Utils";
import {
	EmailInputOptions, FQDNOptions, TextInputOptions,
	DateInputOptions, emailInputValidator, passwordValidator, textInputValidator,
	urlInputValidator, dateInputValidator, telInputValidator, PassworkRuleOptions, URLOptions, NumberOptions, TelInputOptions, numberInputValidator
} from "./Text";
import { OptionsCheckbox, OptionsRadio, SelectOptions, choiceValidator } from "./Choice";
import {
	OptionsFile, OptionsImage, OptionsMediaVideo,
	imageValidator, videoValidator, documentValidator
} from "./File";
import { FormErrorInterface } from ".";
export type OptionsValidate = TextInputOptions | EmailInputOptions | DateInputOptions |
	FQDNOptions | SelectOptions | OptionsRadio |
	OptionsCheckbox | PassworkRuleOptions | URLOptions |
	NumberOptions | TelInputOptions | OptionsFile | OptionsImage | OptionsMediaVideo

export interface FormInputValidatorInterface {
	/**
	  * Generalized validator function for various input types.
	  * Validates text, URLs, dates, passwords, numbers, choices, and files (images, videos, documents)
	  * based on specified rules.
	  *
	  * @param {string | string[] | number | null | undefined | File | FileList} datainput - The value of the input field to validate. This can be a string (text, email, URL, date, tel, radio), an array of strings (select, checkbox), a number (number, checkbox), null, undefined, or a File/FileList for file inputs.
	  * @param {string} targetInputname - The name of the input field being validated.
	  * @param {FormInputType} type_field - The type of input field (e.g., 'text', 'url', 'date', 'password', 'image', 'video', 'document', 'email', 'tel', 'select', 'number', 'checkbox', 'radio').
	  * @param {OptionsValidateNoTypeFile} options_validator - Configuration options specific to the field type.
	  *
	  * @returns {void} This function modifies the validator's internal state (e.g., sets error messages) but does not return a value directly.
	  *
	  * @example
	  * // Text validation
	  * formInputValidator.allTypesValidator("Hello World", "message", "text", { minLength: 5, maxLength: 50 });
	  * // Email validation
	  * formInputValidator.allTypesValidator("test@example.com", "userEmail", "email", { requiredInput: true });
	  * // Date validation
	  * formInputValidator.allTypesValidator("2024/07/04", "eventDate", "date", { format: 'YYYY/MM/DD', minDate: new Date('2024-01-01') });
	  * // Phone validation
	  * formInputValidator.allTypesValidator("+22997000000", "userPhone", "tel", { countryCode: 'BJ' });
	  * // Image file validation (assuming 'fileInput' is an HTMLInputElement)
	  * const imageFile = (document.getElementById('fileInput') as HTMLInputElement).files?.[0];
	  * if (imageFile) {
	  * formInputValidator.allTypesValidator(imageFile, "profileImage", "image", { allowedMimeTypeAccept: ['image/png'], maxsizeFile: 2 });
	  * }
	  */
	allTypesValidator: (
		datainput: string | string[] | number | null | undefined,
		targetInputname: string,
		type_field: FormInputType,
		options_validator: OptionsValidate) => void;
}
export interface ContainerValidatorInterface {
	setValidator(targetInputname: string, validator: FormErrorInterface): void;
	getValidator: (targetInputname: string) => FormErrorInterface
}
/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
*/
export class FormInputValidator implements FormInputValidatorInterface, ContainerValidatorInterface {
	private static m_instance_validator: FormInputValidator;
	private readonly __containerValidator: Map<string, FormErrorInterface>;
	private constructor() { this.__containerValidator = new Map<string, FormErrorInterface>(); }
	public static getInstance = (): FormInputValidator => {
		if (!FormInputValidator.m_instance_validator) {
			FormInputValidator.m_instance_validator = new FormInputValidator();
		}
		return FormInputValidator.m_instance_validator;
	}

	public allTypesValidator = (
		datainput: string | string[] | number | null | undefined | File | FileList,
		targetInputname: string,
		type_field: FormInputType,
		options_validator: OptionsValidate
	): void => {
		if (datainput instanceof File || datainput instanceof FileList) {
			switch (type_field) {
				case "image":
					imageValidator.fileValidator(datainput, targetInputname, options_validator as OptionsImage);
					this.setValidator(targetInputname, imageValidator);
					break;
				case "video":
					videoValidator.fileValidator(datainput, targetInputname, options_validator as OptionsMediaVideo);
					this.setValidator(targetInputname, videoValidator);
					break;
				default: //document
					documentValidator.fileValidator(datainput, targetInputname, options_validator as OptionsFile);
					this.setValidator(targetInputname, documentValidator);
					break;
			}
			return;
		}
		switch (type_field) {
			case 'email':
				emailInputValidator.emailValidator(datainput as string, targetInputname, options_validator as EmailInputOptions);
				this.setValidator(targetInputname, emailInputValidator);
				break;
			case 'password':
				passwordValidator.passwordValidator(datainput as string, targetInputname, options_validator as PassworkRuleOptions);
				this.setValidator(targetInputname, passwordValidator);
				break;
			case 'text':
				textInputValidator.textValidator(datainput as string, targetInputname, options_validator as TextInputOptions);
				this.setValidator(targetInputname, textInputValidator);
				break;
			case 'textarea':
				textInputValidator.textValidator(datainput as string, targetInputname, options_validator as TextInputOptions);
				this.setValidator(targetInputname, textInputValidator);
				break;
			case 'url':
				urlInputValidator.urlValidator(datainput as string, targetInputname, options_validator as URLOptions);
				this.setValidator(targetInputname, urlInputValidator);
				break;
			case 'date':
				dateInputValidator.dateValidator(datainput as string, targetInputname, options_validator as DateInputOptions);
				this.setValidator(targetInputname, dateInputValidator)
				break;
			case 'tel':
				telInputValidator.telValidator(datainput as string, targetInputname, options_validator as TelInputOptions);
				this.setValidator(targetInputname, telInputValidator)
				break;
			case 'select':
				choiceValidator.selectValidator(datainput as string | string[], targetInputname, options_validator as SelectOptions);
				this.setValidator(targetInputname, choiceValidator);
				break;
			case 'number':
				numberInputValidator.numberValidator(datainput as string | number, targetInputname, options_validator as NumberOptions);
				this.setValidator(targetInputname, numberInputValidator);
				break;
			case 'checkbox':
				choiceValidator.checkboxValidator(datainput as number, targetInputname, options_validator as OptionsCheckbox);
				this.setValidator(targetInputname, choiceValidator);
				break;
			case 'radio':
				choiceValidator.radioValidator(datainput as string | null | undefined, targetInputname, options_validator as OptionsRadio);
				this.setValidator(targetInputname, choiceValidator);
				break;
			default:
				Logger.error(`The validation function for ${type_field} is not implemented.`);
				break;
		}
	};
	public setValidator(targetInputname: string, validator: FormErrorInterface): void {
		this.__containerValidator.set(targetInputname, validator);
	}
	public getValidator = (targetInputname: string): FormErrorInterface => {
		return this.__containerValidator.get(targetInputname)!
	}
}
export const formInputValidator = FormInputValidator.getInstance();