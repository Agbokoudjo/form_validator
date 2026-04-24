/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 01 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

/**
 * Interface defining the contract for the centralized form error state manager (Store).
 * It acts as the Single Source of Truth for the validity and errors of all fields.
 * 
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
*   @package <https://github.com/Agbokoudjo/form_validator>
 */
export interface FormErrorStoreInterface {

    /**
     * Checks the validity status of the entire form.
     * @returns {boolean} Returns `true` if no field is explicitly marked as invalid, `false` otherwise.
     */
    isFormValid(): boolean;

    /**
     * Explicitly sets the validity state of a specific field in the store.
     * @param {string} fieldName The name (key) of the field whose state should be updated.
     * @param {boolean} isValid The validity status to record (`true` for valid, `false` for invalid).
     * @returns {this} The store instance for method chaining.
     */
    setFieldValid(fieldName: string, isValid: boolean): this;

    /**
     * Adds one or more error messages to the list of errors for a given field.
     * Existing error messages will not be added again.
     * @param {string} fieldName The name of the field concerned.
     * @param {string | string[]} messages The error message or an array of messages to add.
     * @returns {this} The store instance for method chaining.
     */
    addFieldError(fieldName: string, messages: string | string[]): this;

    /**
     * Retrieves the complete list of error messages associated with a field.
     * @param {string} fieldName The name of the field to retrieve errors for.
     * @returns {string[]} An array containing the error messages. Returns an empty array if no errors are found.
     */
    getFieldErrors(fieldName: string): string[];

    /**
     * Checks if a specific field is considered valid according to the recorded state.
     * @param {string} fieldName The name of the field to check.
     * @returns {boolean} Returns `true` if the field has not been explicitly marked as invalid (`false`).
     */
    isFieldValid(fieldName: string): boolean;

    /**
     * Completely clears the recorded state for a field.
     * This removes both the error messages and the validity status of the field from the store.
     * @param {string} fieldName The name of the field to clear.
     * @returns {this} The store instance for method chaining.
     */
    clearFieldState(fieldName: string): this;

    /**
     * Removes a specific error message for a field.
     * If this action empties the list of errors, the field's entry is removed from the store.
     * @param {string} fieldName The name of the field.
     * @param {string} messageToRemove The exact error message to remove.
     * @returns {this} The store instance for method chaining.
     */
    removeFieldError(fieldName: string, messageToRemove: string): this;
}

/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
*/
export class FormErrorStore implements FormErrorStoreInterface {

    private static __instance: FormErrorStore;

    private fieldValidity: Map<string, boolean>;
    private fieldErrors: Map<string, string[]>;

    private constructor() {
        this.fieldValidity = new Map<string, boolean>();
        this.fieldErrors = new Map<string, string[]>();
    }

    public static getInstance(): FormErrorStore {

        if (!FormErrorStore.__instance) {
            FormErrorStore.__instance = new FormErrorStore();
        }
        return FormErrorStore.__instance;
    }

    public setFieldValid(fieldName: string, isValid: boolean): this {
        this.fieldValidity.set(fieldName, isValid);
        return this;
    }

    public addFieldError(fieldName: string, messages: string | string[]): this {
        const currentErrors = this.fieldErrors.get(fieldName) || [];

        const messagesToAdd = Array.isArray(messages) ? messages : [messages];

        messagesToAdd.forEach((message) => {
            if (!currentErrors.includes(message)) {
                currentErrors.push(message);
            }
        });

        this.fieldErrors.set(fieldName, currentErrors);

        return this;
    }

    public getFieldErrors(fieldName: string): string[] {
        return this.fieldErrors.get(fieldName) || [];
    }

    public isFieldValid(fieldName: string): boolean {
        // Renvoie true si la validité est explicitement TRUE ou si elle n'a jamais été définie (non en erreur).
        return this.fieldValidity.get(fieldName) !== false;
    }

    public clearFieldState(fieldName: string): this {

        if (this.fieldValidity.has(fieldName)) {
            this.fieldValidity.delete(fieldName);
        }

        if (this.fieldErrors.has(fieldName)) {
            this.fieldErrors.delete(fieldName);
        }

        return this;
    }

    public removeFieldError(fieldName: string, messageToRemove: string): this {
        const currentErrors = this.getFieldErrors(fieldName);
        const updatedErrors = currentErrors.filter(msg => msg !== messageToRemove);

        if (updatedErrors.length > 0) {
            this.fieldErrors.set(fieldName, updatedErrors);
        } else {
            // Si le tableau est vide, on supprime la clé pour nettoyer le store
            this.fieldErrors.delete(fieldName);
            this.setFieldValid(fieldName, true); 
        }

        return this;
    }

    public isFormValid(): boolean {
        // S'il existe au moins une entrée explicitement marquée 'false', le formulaire est invalide.
        for (const isValid of this.fieldValidity.values()) {
            if (isValid === false) {
                return false;
            }
        }
        return true;
    }

}

export const formErrorStore = FormErrorStore.getInstance();