/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 01 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { formErrorStateManager } from "./AbstractFormError";
import { Logger } from "../_Utils";
export interface FieldStateValidating {
	errorMessage: string[];
	validatorStatus: boolean;
}
export interface FormErrorInterface {
	/**
	 * Sets the validation status and error message for a specific input field.
	 * 
	 * @param {boolean} status - The validation status (true for valid, false for invalid).
	 * @param {string} error_message - The error message to associate with the field.
	 * @param {string} targetInputname - The name of the input field to update.
	 * 
	 * @returns {this} Returns the current instance for method chaining.
	 * 
	 * @example
	 * setValidatorStatus(false, "Invalid email format", "email");
	 * setValidatorStatus(true, "", "password"); // No error, valid password
	 */
	setValidatorStatus: (status: boolean, error_message: string, targetInputname: string) => this;
	/**
	 * Retrieves the validation status of a specific input field.
	 * 
	 * @param {string} targetInputname - The name of the input field to check.
	 * @returns {ValidatorStatusField} An object containing the validation status and error message.
	 * 
	 * @example
	 * const status = getValidatorStatus("email");
	 * console.log(status.validatorStatus); // true or false
	 * console.log(status.errorMessage); // "Invalid email format" (if applicable)
	 */
	getValidatorStatus: (targetInputname: string) => FieldStateValidating;

	/**
	 * EN : Clears the error messages and validation state associated with a specific field in the form.
	 * 
	 * @param targetInputname
	 *                          EN : The name or ID of the field whose error messages and validation state should be cleared.
	 * @returns 
	 *            EN : The instance of the class to allow method chaining.
	 */
	clearError: (targetInputname: string) => this;
	/**
	 * EN : Retrieves the validation status of a specific field in the form.
	 * 
	 * @param targetname EN : The name or ID of the field to check.
	 * @returns  EN : The validation status of the field (true if valid, false if invalid, undefined if not defined).
	 */
	hasErrorsField: (targetInputname: string) => boolean;

	getErrors: (targetInputname: string) => string[];
	getErrorsField: (targetInputname: string) => string[];
}
export abstract class FormError implements FormErrorInterface {

	protected constructor() { Logger.log('formErrorStateManager:', formErrorStateManager) }
	/**
	 * Vérifie si tous les champs sont valides.
	 * @returns true si tous les champs sont valides, false sinon.
	 */
	public areAllFieldsValid = (): boolean => {
		return formErrorStateManager.__areAllFieldsValid();
	}

	public removeSpecificErrorMessage = (targetInputname: string, messageerrorinput: string): this => {
		formErrorStateManager.__removeSpecificErrorMessage(targetInputname, messageerrorinput);
		return this;
	}
	public hasErrorsField = (targetInputname: string): boolean => { return formErrorStateManager.getStatus(targetInputname); };

	getErrorsField(targetInputname: string): string[] { return formErrorStateManager.getErrorMessageField(targetInputname); }
	getErrors(targetInputname: string): string[] { return formErrorStateManager.getErrorMessageField(targetInputname); }
	public clearError = (targetInputname: string): this => {
		formErrorStateManager.clearErrorField(targetInputname);
		return this;
	};
	public setValidatorStatus = (status: boolean, error_message: string, targetInputname: string): this => {
		formErrorStateManager.setStatus(targetInputname, status)
		formErrorStateManager.setErrorMessageField(targetInputname, error_message);
		return this;
	};
	public getValidatorStatus = (targetInputname: string): FieldStateValidating => {
		return {
			validatorStatus: this.hasErrorsField(targetInputname),
			errorMessage: formErrorStateManager.getErrorMessageField(targetInputname)
		};
	};

}