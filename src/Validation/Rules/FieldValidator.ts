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

import { DataInput } from "../../_Utils";
import { formErrorStore, FormErrorStoreInterface } from "../Store";

export interface FieldStateValidating {
	errors: string[];
	isValid: boolean;
}

/**
 * Interface defining the contract for any single field validator implementation.
 * It provides core utilities for interacting with the global error store and performing validation.
 */
export interface FieldValidatorInterface {

	/**
	 * Provides read-only access to the central error management store.
	 * @type {FormErrorStoreInterface}
	 */
	readonly formErrorStore: FormErrorStoreInterface;

	/**
	 * Sets the validation state (validity status and error message) for the field.
	 * * @param {boolean} isValid - The validation status (`true` for valid, `false` for invalid).
	 * @param {string | string[]} errorMessage - The error message(s) to associate with the field if invalid.
	 * @param {string} fieldName - The name of the input field to update.
	 * * @returns {this} The current instance for method chaining.
	 */
	setValidationState(isValid: boolean, errorMessage: string | string[], fieldName: string): this;

	/**
	 * Retrieves the current validation state of the field.
	 * * @param {string} fieldName - The name of the input field to check.
	 * @returns {FieldStateValidating} An object containing the validity status and error messages.
	 */
	getState(fieldName: string): FieldStateValidating;

	/**
	* Executes the specific validation logic for this field and updates the error state.
	* * This method supports both synchronous and asynchronous validation.
	* * @param {DataInput} value - The value to be validated.
	* @param {string} fieldName - The name of the field.
	* @returns {Promise<this> | this} Returns the instance (`this`) for synchronous validation, or a 
	* Promise resolving to the instance for asynchronous validation.
	*/
	validate(value: DataInput, fieldName: string, optionsValidate: any, ignoreMergeWithDefaultOptions?: boolean): Promise<this> | this;
}

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

		// 1. Définir le statut de validité
		formErrorStore.setFieldValid(fieldName, isValid);

		// 2. Ajouter le message d'erreur (la logique d'ajout est dans le Store)
		if (!isValid) {
			formErrorStore.addFieldError(fieldName, errorMessage);
		} else {
			// Si le champ est marqué valide, on s'assure qu'il n'y a pas d'erreurs résiduelles.
			// Note: Ceci peut nécessiter une vérification si vous voulez supprimer le champ uniquement.
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

	public abstract validate(value: DataInput, fieldName: string, optionsValidate: any, ignoreMergeWithDefaultOptions?: boolean): Promise<this> | this;

	protected getRawStringValue(value?: string): string {

		const rawValue = (typeof value === 'string' || value === undefined || value === null)
			? (value || '') // Utilise une chaîne vide si null/undefined
			: String(value);

		return rawValue
	}

	/**
   * Rule: Checks if the field value is present when required.
   */
	protected requiredValidator(value: string | undefined, fieldName: string, required?: boolean): this {
		if (required === true && (!value || value.trim() === '')) {
			// Utilise la méthode du parent pour enregistrer l'erreur
			this.setValidationState(false, "This input field is mandatory.", fieldName);
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
}