/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 01 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { DataInput, FormInputType } from "../../_Utils";
import type { FieldValidatorInterface, FormErrorStoreInterface } from "../Contracts";
import type { FieldStateValidating,BaseInputOptions } from "../types";
import { formErrorStore} from "../Store";

/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
*/
export abstract class AbstractFieldValidator implements FieldValidatorInterface {


	protected constructor() { }

	public get formErrorStore(): FormErrorStoreInterface {

		return formErrorStore;
	}

	public setValidationState = (isValid: boolean, errorMessage: string | string[], fieldName: string): this => {
		formErrorStore.setFieldValid(fieldName, isValid);
		if (!isValid) {
			formErrorStore.addFieldError(fieldName, errorMessage);
		} 

		return this; 
	};

	/**
	* Récupère l'état de validation complet du champ.
	*/
	public getState = (fieldName: string): FieldStateValidating => {
		return {
			isValid: formErrorStore.isFieldValid(fieldName),
			errors: formErrorStore.getFieldErrors(fieldName)
		};
	};

	public abstract validate(value: DataInput, fieldName: string, optionsValidate: any, ...otherArgs: any): Promise<this> | this;

	protected getRawStringValue(value?: string): string {
		const rawValue = (typeof value === 'string' || value === undefined || value === null)
			? (value || '') 
			: String(value);

		return rawValue
	}

	protected normalizeValue(value?: string): string{
		return this.getRawStringValue(value);
	}

	/**
   * Rule: Checks if the field value is present when required.
   */
	protected requiredValidator(value: string | undefined, fieldName: string, required?: boolean): this {
		if (required === true && (!value || value.trim() === '')) {
			this.setValidationState(false, "This field is required and cannot be empty", fieldName);
		}
		return this;
	}

	/**
	* Rule: Checks if the field value respects the min/max length constraints.
	*/
	protected lengthValidator(value: string, fieldName: string, minLength: number | undefined, maxLength: number | undefined): this {

		const len = value.length;

		if (minLength && len < minLength) {
			return this.setValidationState(false, `Please enter at least ${minLength} characters.`, fieldName);
		}

		if (maxLength && len > maxLength) {

			return this.setValidationState(false, `Please enter at most ${maxLength} characters.`, fieldName);
		}

		return this;
	}

	/**
	 * Regex pattern validation with clear true/false logic.
	 */
	protected validateRegexPattern(
		value: string,
		fieldName: string,
		options: BaseInputOptions
	): void {
		const regex = options.regexValidator;

		if (!regex) {
			return; // No regex validation needed
		}

		const shouldMatch = options.match !== false; // Default to true
		const regexPassed = regex.test(value);
		const validationFailed = shouldMatch ? !regexPassed : regexPassed;

		if (validationFailed) {
			const errorMessage = this.buildErrorMessage(
				options.typeInput || "text",
				options.errorMessageInput,
				options.egAwait);
			this.setValidationState(false, errorMessage, fieldName);
		}
	}

	/**
	 * Build error message for regex validation failure.
	 */
	protected buildErrorMessage(
		typeInput:FormInputType,
		errorMessageInput?: string,
		egAwait?: string): string {
		let message = errorMessageInput || "Format is invalid";

		if (
			typeInput !== "textarea" &&
			egAwait
		) {
			message += ` e.g.: ${egAwait}`;
		}

		return message;
	}

	protected setValue(newValue: string, targetInputname: string): void{
		if (typeof window !== "undefined" && typeof document !== "undefined") {
			const targetInput = document.querySelector<HTMLInputElement|HTMLTextAreaElement>(`[name="${targetInputname}"]`);

			if (targetInput) {
				targetInput.value = newValue;
				targetInput.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}
	}
}