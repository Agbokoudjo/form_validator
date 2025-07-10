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

/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
*/
class FormErrorStateManager {
    private static __instanceFormError: FormErrorStateManager;
    private m_is_valid_field: Map<string, boolean>;
    private m_errorMessageField: Map<string, string[]>;
    private constructor() {
        this.m_is_valid_field = new Map<string, boolean>();
        this.m_errorMessageField = new Map<string, string[]>();
    }
    public static getInstance(): FormErrorStateManager {
        if (!FormErrorStateManager.__instanceFormError) {
            FormErrorStateManager.__instanceFormError = new FormErrorStateManager();
        }
        return FormErrorStateManager.__instanceFormError;
    }
    public setStatus(targetInputname: string, status: boolean): this {
        this.m_is_valid_field.set(targetInputname, status);
        return this;
    }
    /**
     * EN : Stores an error message for an input field in the form. 
     * If the error message already exists, it will not be added again.
     * 
     * @param targetInputname  EN : The name or ID of the field as a key.
     * @param messageerrorinput EN : The error message to add for the field.
     * @returns EN : The instance of the class to allow method chaining.
     */
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
    /**
     * EN : Retrieves all error messages associated with a specific field in the form.
     * If no error messages are defined for the field, returns an empty array.
     * 
     * @param targetInputname
     *                          EN : The name or ID of the field whose error messages should be retrieved.
     * @returns
     *            EN : An array containing the error messages for the field, or an empty array if none exist.
     */
    public getErrorMessageField = (targetInputname: string): string[] => { return this.m_errorMessageField.get(targetInputname) || []; };
    public getStatus(targetInputname: string): boolean {
        return this.m_is_valid_field.get(targetInputname) === true || this.m_is_valid_field.get(targetInputname) === undefined
    }
    public clearErrorField(targetInputname: string): this {
        if (this.m_is_valid_field.has(targetInputname) && this.m_errorMessageField.has(targetInputname)) {
            this.m_is_valid_field.delete(targetInputname);
            this.m_errorMessageField.delete(targetInputname);
        }
        return this;
    }
    /**
     * Supprime un message d'erreur spécifique pour un champ.
     * @param targetInputname Le nom du champ.
     * @param messageerrorinput Le message d'erreur à supprimer.
     * @returns L'instance de la classe.
     */
    public __removeSpecificErrorMessage = (targetInputname: string, messageerrorinput: string): this => {
        const errorMessageField = this.m_errorMessageField.get(targetInputname) || [];
        const updatedErrors = errorMessageField.filter(msg => msg !== messageerrorinput);
        if (updatedErrors.length > 0) {
            this.m_errorMessageField.set(targetInputname, updatedErrors);
        } else {
            this.m_errorMessageField.delete(targetInputname);
        }
        return this;
    }
    public __areAllFieldsValid = (): boolean => {
        for (const isValid of this.m_is_valid_field.values()) {
            if (!isValid) {
                return false;
            }
        }
        return true;
    }

}
export const formErrorStateManager = FormErrorStateManager.getInstance();