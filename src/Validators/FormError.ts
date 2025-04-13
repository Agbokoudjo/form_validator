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
import { FieldStateValidating } from "./ValidatorFormInterface";
export interface FormErrorInterface{
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
	 * EN : Stores an error message for an input field in the form. 
	 * If the error message already exists, it will not be added again.
	 * 
	 * @param targetInputname  EN : The name or ID of the field as a key.
	 * @param messageerrorinput EN : The error message to add for the field.
	 * @returns EN : The instance of the class to allow method chaining.
	 */
	setErrorMessageField: (targetInputname: string, messageerrorinput: string | string[]) => this;
	/**
	 * EN : Retrieves all error messages associated with a specific field in the form.
	 * If no error messages are defined for the field, returns an empty array.
	 * 
	 * @param targetInputname
	 *                          EN : The name or ID of the field whose error messages should be retrieved.
	 * @returns
	 *            EN : An array containing the error messages for the field, or an empty array if none exist.
	 */
	getErrorMessageField: (targetInputname: string) => string[] | undefined;
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
	hasErrorsField: (targetInputname: string) => boolean
	/**
	 * Supprime un message d'erreur spécifique pour un champ.
	 * @param targetInputname Le nom du champ.
	 * @param messageerrorinput Le message d'erreur à supprimer.
	 * @returns L'instance de la classe.
	 */
	removeSpecificErrorMessage: (targetInputname: string, messageerrorinput: string) => this;
	/**
     * Récupère l'état de validation de tous les champs.
     * @returns La Map des états de validation des champs.
     */
    getErrorsFieldAll:()=> Map<string, boolean>
    /**
     * Récupère les messages d'erreur de tous les champs.
     * @returns La Map des messages d'erreur des champs.
     */
	getErrorMessageFieldAll: () => Map<string, string[]>;
}
export abstract class FormError implements FormErrorInterface{
	private m_is_valid_field: Map<string, boolean>;
    private m_errorMessageField: Map<string, string[]>;
	protected constructor() {
		 this.m_is_valid_field = new Map<string, boolean>();
        this.m_errorMessageField = new Map<string, string[]>();
	}
	/**
	 * Vérifie si tous les champs sont valides.
	 * @returns true si tous les champs sont valides, false sinon.
	 */
	public areAllFieldsValid = (): boolean => {
    for (const isValid of this.m_is_valid_field.values()) {
        if (!isValid) {
            return false;
        }
    }
    return true;
	}
	/**
	 * Réinitialise tous les états de validation et messages d'erreur.
	 * @returns L'instance de la classe.
	 */
	public clearAll = (): this => {
		this.m_is_valid_field.clear();
		this.m_errorMessageField.clear();
    return this;
	}
	public removeSpecificErrorMessage = (targetInputname: string, messageerrorinput: string): this => {
		const errorMessageField = this.m_errorMessageField.get(targetInputname) || [];
		const updatedErrors = errorMessageField.filter(msg => msg !== messageerrorinput);
		if (updatedErrors.length > 0) {
			this.m_errorMessageField.set(targetInputname, updatedErrors);
		} else {
			this.m_errorMessageField.delete(targetInputname);
		}
		return this;
	}
	public hasErrorsField = (targetname: string): boolean => {
		return this.m_is_valid_field.get(targetname) === true || this.m_is_valid_field.get(targetname)===undefined 
	};
	public setErrorMessageField = (targetInputname: string, messageerrorinput: string | string[]): this => {
		// Si messageerrorinput est un tableau, on l'assigne directement à errorMessageField
		const errorMessageField = this.m_errorMessageField.get(targetInputname) || [];

		// Si le message d'erreur est un tableau, on ajoute les messages un par un
		if (Array.isArray(messageerrorinput)) {
			messageerrorinput.forEach((message) => {
				if (!errorMessageField.includes(message)) {
					errorMessageField.push(message);
				}
			});
		} else {
			// Si c'est une chaîne, on l'ajoute directement
			if (!errorMessageField.includes(messageerrorinput)) {
				errorMessageField.push(messageerrorinput);
			}
		}

		// On met à jour l'erreur pour ce champ
		this.m_errorMessageField.set(targetInputname, errorMessageField);

		return this;
	};

	public getErrorMessageField = (targetInputname: string): string[] | undefined => { return this.m_errorMessageField.get(targetInputname) || []; };

	public clearError = (targetInputname: string): this => {
		if (this.m_is_valid_field.has(targetInputname)) {
			this.m_is_valid_field.delete(targetInputname);
			this.m_errorMessageField.delete(targetInputname);
		}
		return this;
	};
    public getErrorsFieldAll = (): Map<string, boolean> => { return this.m_is_valid_field; }
	public getErrorMessageFieldAll = (): Map<string, string[]> => { return this.m_errorMessageField; }
	public setValidatorStatus = (status: boolean, error_message: string, targetInputname: string): this => {
		this.m_is_valid_field.set(targetInputname, status);
		this.setErrorMessageField(targetInputname, error_message);
		return this;
	};
	public getValidatorStatus = (targetInputname: string): FieldStateValidating => {
		return {
			validatorStatus: this.m_is_valid_field.get(targetInputname),
			errorMessage: this.getErrorMessageField(targetInputname)
		};
	};

}