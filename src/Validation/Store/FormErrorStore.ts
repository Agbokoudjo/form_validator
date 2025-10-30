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

import { FormErrorStoreInterface } from "./FormErrorStoreInterface";

/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
*/
export class FormErrorStore implements FormErrorStoreInterface {

    private static instance: FormErrorStore;

    private fieldValidity: Map<string, boolean>;
    private fieldErrors: Map<string, string[]>;

    private constructor() {
        this.fieldValidity = new Map<string, boolean>();
        this.fieldErrors = new Map<string, string[]>();
    }

    public static getInstance(): FormErrorStore {

        if (!FormErrorStore.instance) {
            FormErrorStore.instance = new FormErrorStore();
        }

        return FormErrorStore.instance;
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
            this.setFieldValid(fieldName, true); // On Marque comme valide si le dernier message a été retiré
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