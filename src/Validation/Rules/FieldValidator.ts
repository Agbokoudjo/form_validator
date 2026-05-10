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
import type { FieldValidatorInterface, FormErrorStoreInterface } from "../contracts";
import type { FieldStateValidating } from "../types";
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

		// Ajouter le message d'erreur (la logique d'ajout est dans le Store)
		if (!isValid) {
			formErrorStore.addFieldError(fieldName, errorMessage);
		} else {
			// Si le champ est marqué valide, on s'assure qu'il n'y a pas d'erreurs résiduelles.
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