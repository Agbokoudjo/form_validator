/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

/**
 * ErrorMessageHandle Class
 *
 * This class is designed to manage error messages and validation states for input fields in a form. 
 * It provides utility methods for storing, retrieving, and removing error messages and validation states, 
 * ensuring a consistent and reusable approach for form validation and error handling in a project.
 *
 * ### Constructor
 * - **constructor()**
 *   - Initializes two maps:
 *     - `m_isValidField`: Stores the validation state (`boolean`) of each field.
 *     - `m_errorMessageField`: Stores an array of error messages (`string[]`) for each field.
 *
 * ### Public Methods
 *
 * - **areAllFieldsValid()**
 *   - Checks if all fields are valid.
 *   - Returns `true` if all fields are valid, `false` otherwise.
 *
 * - **clearAll()**
 *   - Clears all validation states and error messages.
 *   - Returns the instance of the class for method chaining.
 *
 * - **removeSpecificErrorMessage(targetInputname: string, messageerrorinput: string)**
 *   - Removes a specific error message for a given field.
 *   - If the field has no remaining error messages, it is removed from the map.
 *   - Returns the instance of the class for method chaining.
 *
 * - **setIsValidFieldWithKey(targetname: string, valueboolean: boolean)**
 *   - Sets the validation state for a specific field.
 *   - Throws an error if the field ID is empty.
 *   - Returns the instance of the class for method chaining.
 *
 * - **getIsValidFieldWithKey(targetname: string)**
 *   - Retrieves the validation state of a specific field.
 *   - Returns `true`, `false`, or `undefined` based on the field's state.
 *
 * - **setErrorMessageFieldWithKey(targetInputname: string, messageerrorinput: string)**
 *   - Adds an error message for a specific field.
 *   - Ensures no duplicate messages are added.
 *   - Returns the instance of the class for method chaining.
 *
 * - **getErrorMessageFieldWithKey(targetInputname: string)**
 *   - Retrieves all error messages for a specific field.
 *   - Returns an array of messages or an empty array if none exist.
 *
 * - **clearError(targetInputname: string)**
 *   - Clears error messages and validation state for a specific field.
 *   - Throws an error if the field ID is empty.
 *   - Returns the instance of the class for method chaining.
 *
 * - **getIsValidField()**
 *   - Retrieves the validation states of all fields.
 *   - Returns a `Map<string, boolean>` containing the states.
 *
 * - **getErrorMessageField()**
 *   - Retrieves all error messages for all fields.
 *   - Returns a `Map<string, string[]>` containing the error messages.
 *
 * ### Private Methods
 *
 * - **is_empty_Id_field(targetname: string)**
 *   - Validates that the field ID is not empty.
 *   - Throws an error if the ID is an empty string or contains only whitespace.
 *
 * ### Usage
 * ```typescript
 * const errorHandle = new ErrorMessageHandle();
 *
 * // Set validation state
 * errorHandle.setIsValidFieldWithKey("email", false);
 *
 * // Add error message
 * errorHandle.setErrorMessageFieldWithKey("email", "Invalid email address");
 *
 * // Check all fields validity
 * const allValid = errorHandle.areAllFieldsValid(); // false
 *
 * // Get specific error messages
 * const errors = errorHandle.getErrorMessageFieldWithKey("email"); // ["Invalid email address"]
 *
 * // Remove specific error message
 * errorHandle.removeSpecificErrorMessage("email", "Invalid email address");
 *
 * // Clear all errors and validation states
 * errorHandle.clearAll();
 * ```
 *
 * This class provides a flexible and efficient way to manage form validation and error handling.
 */
export class ErrorMessageHandle {
	 private m_isValidField: Map<string, boolean>;
    private m_errorMessageField: Map<string, string[]>;
	protected constructor() {
		 this.m_isValidField = new Map<string, boolean>();
        this.m_errorMessageField = new Map<string, string[]>();
	}
	/**
	 * Vérifie si tous les champs sont valides.
	 * @returns true si tous les champs sont valides, false sinon.
	 */
	public areAllFieldsValid = (): boolean => {
    for (const isValid of this.m_isValidField.values()) {
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
		this.m_isValidField.clear();
		this.m_errorMessageField.clear();
    return this;
	}
	/**
	 * Supprime un message d'erreur spécifique pour un champ.
	 * @param targetInputname Le nom du champ.
	 * @param messageerrorinput Le message d'erreur à supprimer.
	 * @returns L'instance de la classe.
	 */
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

	/**
	 * FR : Définit l'état de validation pour un champ spécifique dans le formulaire.
	 * Vérifie que l'identifiant du champ n'est pas une chaîne vide avant de l'ajouter.
	 * 
	 * EN : Sets the validation status for a specific field in the form.
	 * Ensures that the field ID is not an empty string before adding it.
	 * 
	 * @param targetname - FR : Le nom ou l'identifiant du champ. 
	 *                     EN : The name or ID of the field.
	 * @param valueboolean - FR : L'état de validation du champ (true pour valide, false pour invalide).
	 *                        EN : The validation status of the field (true for valid, false for invalid).
	 * @returns - FR : L'instance de la classe pour permettre le chaînage.
	 *            EN : The instance of the class to allow method chaining.
	 * 
	 * @throws Error - FR : Lance une erreur si l'identifiant du champ est une chaîne vide.
	 *                 EN : Throws an error if the field ID is an empty string.
	 */
	public setIsValidFieldWithKey = (targetname: string, valueboolean: boolean): this => {
		this.is_empty_Id_field(targetname);
		this.m_isValidField.set(targetname, valueboolean);
		return this;
	};
		/**
	 * FR : Récupère l'état de validation d'un champ spécifique dans le formulaire.
	 * 
	 * EN : Retrieves the validation status of a specific field in the form.
	 * 
	 * @param targetname - FR : Le nom ou l'identifiant du champ à vérifier.
	 *                     EN : The name or ID of the field to check.
	 * @returns - FR : L'état de validation du champ (true si valide, false si invalide, undefined si non défini).
	 *            EN : The validation status of the field (true if valid, false if invalid, undefined if not defined).
	 */
	public getIsValidFieldWithKey = (targetname: string): boolean | undefined => {return this.m_isValidField.get(targetname);};

	/**
	 * FR : Stocke un message d'erreur pour un champ input dans le formulaire. 
	 * Si le message d'erreur est déjà présent, il ne sera pas ajouté à nouveau.
	 * 
	 * EN : Stores an error message for an input field in the form. 
	 * If the error message already exists, it will not be added again.
	 * 
	 * @param targetInputname - FR : Le nom ou l'identifiant du champ comme clé.
	 *                          EN : The name or ID of the field as a key.
	 * @param messageerrorinput - FR : Le message d'erreur à ajouter pour le champ.
	 *                              EN : The error message to add for the field.
	 * @returns - FR : L'instance de la classe pour permettre le chaînage.
	 *            EN : The instance of the class to allow method chaining.
	 */
	public setErrorMessageFieldWithKey = (targetInputname: string, messageerrorinput: string): this => {
		const errorMessageField = this.m_errorMessageField.get(targetInputname) || [];
		if (!errorMessageField.includes(messageerrorinput)) {
			errorMessageField.push(messageerrorinput);
			this.m_errorMessageField.set(targetInputname, errorMessageField);
		}
		return this;
	};

	/**
	 * FR : Récupère tous les messages d'erreur associés à un champ spécifique dans le formulaire.
	 * Si aucun message d'erreur n'est défini pour le champ, retourne un tableau vide.
	 * 
	 * EN : Retrieves all error messages associated with a specific field in the form.
	 * If no error messages are defined for the field, returns an empty array.
	 * 
	 * @param targetInputname - FR : Le nom ou l'identifiant du champ dont les messages d'erreur doivent être récupérés.
	 *                          EN : The name or ID of the field whose error messages should be retrieved.
	 * @returns - FR : Un tableau contenant les messages d'erreur pour le champ, ou un tableau vide s'il n'y en a pas.
	 *            EN : An array containing the error messages for the field, or an empty array if none exist.
	 */
	public getErrorMessageFieldWithKey = (targetInputname: string): string[] | undefined => { return this.m_errorMessageField.get(targetInputname) || []; };

	/**
	 * FR : Supprime les messages d'erreur et l'état de validation associés à un champ spécifique du formulaire.
	 * 
	 * EN : Clears the error messages and validation state associated with a specific field in the form.
	 * 
	 * @param targetInputname - FR : Le nom ou l'identifiant du champ dont les messages d'erreur et l'état de validation doivent être supprimés.
	 *                          EN : The name or ID of the field whose error messages and validation state should be cleared.
	 * @returns - FR : L'instance de la classe pour permettre le chaînage de méthodes.
	 *            EN : The instance of the class to allow method chaining.
	 */
	public clearError = (targetInputname: string): this => {
		this.is_empty_Id_field(targetInputname)
		this.m_isValidField.delete(targetInputname);
		this.m_errorMessageField.delete(targetInputname);
		return this;
	};

	/**
     * Récupère l'état de validation de tous les champs.
     * @returns La Map des états de validation des champs.
     */
    public getIsValidField = (): Map<string, boolean> => { return this.m_isValidField; }
    /**
     * Récupère les messages d'erreur de tous les champs.
     * @returns La Map des messages d'erreur des champs.
     */
	public getErrorMessageField = (): Map<string, string[]> => { return this.m_errorMessageField; }
	
	private is_empty_Id_field(targetname: string): void{
		if (!targetname.trim()) {
			throw new Error("The ID of the field input must not be an empty string.");
		}
	}
}