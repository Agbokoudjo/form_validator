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

import { OptionsInputField } from "../interfaces";
import { escapeHtmlBalise } from "../module_fonction/function";
import { ErrorMessageHandle } from "./ErrorMessageHandle";

class FormInputValidator extends ErrorMessageHandle{
	private static m_instance_validator: FormInputValidator;
	private m_messagetextinput = "The content of this field must contain only alphabetical letters    " +
        "and must not null Eg:AGBOKOUDJO Hounha Franck";
    private throwmessage = "The first two arguments passed to the 'validatorInputTypeText' function must not be empty or undefined." +
        " Please ensure that the field value argument is provided and valid."
    private m_emailRegex = /^([a-zA-ZÀ-ÿ0-9._-]{2,})+(@[a-zA-ZÀ-ÿ0-9._-]{2,})+(\.[a-z]{2,6})+$/i;
    private m_phoneRegex = /^([\+]{1})([0-9\s]{1,})+$/i;
    private m_messageInputErrorTel = 'The content of this field must contain only number ,one symbol +,of spaces and must not null ,Eg: +229 67 25 18 86';
	private constructor() { super() }
	
	/**
     * Méthode statique pour récupérer ou créer l'instance unique de la classe.
     * @returns L'instance unique de TextInputValidator.
     */
	public static getInstance=():FormInputValidator=> {
		if (!FormInputValidator.m_instance_validator) {
			FormInputValidator.m_instance_validator = new FormInputValidator();
		}
		return FormInputValidator.m_instance_validator;
	}
	/**  
	 * Validates a text input field.  
	 * Checks if the entered value adheres to a specific format, minimum and maximum length, and if the field is required.  
	 * Optionally removes HTML and PHP tags if needed.  
	 * Updates the state and error messages associated with the field in case of validation failure.  
	 *  
	 * @param datainput (string) : The input value to validate.  
	 * @param targetInputname (string) : The identifier or key associated with the input field in the form.  
	 * @param optionsinputtext (OptionsInputField) : Object containing validation options.  
	 * - typeInput (string) : Type of field, for example "text" or "textarea".  
	 * - regexValidator (RegExp) : Custom regular expression to validate the text format.  
	 * - requiredInput (boolean) : Indicates if the field is mandatory.  
	 * - escapestripHtmlAndPhpTags (boolean) : Removes HTML and PHP tags if necessary.  
	 * - minLength (number) : Minimum allowed length for the value.  
	 * - maxLength (number) : Maximum allowed length for the value.  
	 * - errorMessageInput (string) : Custom error message if validation fails.  
	 * @returns this : The current class instance, allowing method chaining.  
	 *  
	 * @throws Error : Throws an error if `datainput` or `targetInputname` is empty.  
	 */
	/**  
	 * Valide un champ de type texte.  
	 * Vérifie si la valeur saisie respecte un format spécifique, la longueur minimale et maximale, et si le champ est obligatoire.  
	 * Optionnellement, retire les balises HTML et PHP en cas de besoin.  
	 * Met à jour l'état et les messages d'erreur associés au champ en cas d'échec de validation.  
	 *  
	 * @param datainput (string) : La valeur saisie à valider.  
	 * @param targetInputname (string) : L'identifiant ou clé associé au champ dans le formulaire.  
	 * @param optionsinputtext (OptionsInputField) : Objet contenant les options pour la validation.  
	 * - typeInput (string) : Type du champ, par exemple "text" ou "textarea".  
	 * - regexValidator (RegExp) : Expression régulière personnalisée pour valider le format du texte.  
	 * - requiredInput (boolean) : Indique si le champ est obligatoire.  
	 * - escapestripHtmlAndPhpTags (boolean) : Supprime les balises HTML et PHP si nécessaire.  
	 * - minLength (number) : Longueur minimale autorisée pour la valeur.  
	 * - maxLength (number) : Longueur maximale autorisée pour la valeur.  
	 * - errorMessageInput (string) : Message d'erreur personnalisé en cas de validation échouée.  
	 * @returns this : L'instance actuelle de la classe, permettant un chaînage des appels.  
	 *  
	 * @throws Error : Lance une erreur si `datainput` ou `targetInputname` est vide.  
	 */
	public validatorInputTypeText=(datainput: string, targetInputname: string,
        optionsinputtext: OptionsInputField = {
            typeInput: 'text', regexValidator: /^[a-zA-ZÀ-ÿ\s]+$/i,
            requiredInput: true,
             escapestripHtmlAndPhpTags:true
        }): this => {
        const messageerror = optionsinputtext.errorMessageInput || this.m_messagetextinput;
        const regexName = optionsinputtext.regexValidator || /^[a-zA-ZÀ-ÿ\s]+$/i;
        let datavalue = datainput.trim();
        if (!targetInputname || !datainput) { throw Error(this.throwmessage); }
        if (optionsinputtext.escapestripHtmlAndPhpTags && optionsinputtext.escapestripHtmlAndPhpTags === true) {
            datavalue = escapeHtmlBalise(datainput) as string;  
        }
        if (optionsinputtext.typeInput && optionsinputtext.typeInput === "textarea") { datavalue = datainput.trim(); }
        if (this.checkRegexInput(datavalue, regexName) === false) {
            this.setIsValidFieldWithKey(targetInputname, false)
            this.setErrorMessageFieldWithKey(targetInputname, messageerror);
        }
        this.validatorLength(datavalue, targetInputname, optionsinputtext.minLength, optionsinputtext.maxLength);
        this.validatorRequired(datavalue, targetInputname, optionsinputtext.requiredInput || true);
        return this;
    }
	/**  
	 * Validates an email input field.  
	 * Checks if the entered value adheres to a specific format, minimum and maximum length, and if the field is required.  
	 * Updates the state and error messages associated with the field in case of validation failure.  
	 *  
	 * @param datainputemail (string) : The input value to validate.  
	 * @param targetInputnameemail (string) : The identifier or key associated with the input field in the form.  
	 * @param optionsinputemail (OptionsInputText) : Object containing validation options.  
	 * - errorMessageInput (string) : Custom error message if validation fails.  
	 * - regexValidator (RegExp) : Custom regular expression to validate the email format.  
	 * - minLength (number) : Minimum allowed length for the input.  
	 * - maxLength (number) : Maximum allowed length for the input.  
	 * - requiredInput (boolean) : Indicates if the field is mandatory.  
	 * @returns this : The current class instance, allowing method chaining.  
	 *  
	 * @throws Error : Throws an error if `datainputemail` or `targetInputnameemail` is empty.  
	 */
	/**  
	 * Valide un champ de type email.  
	 * Vérifie si la valeur saisie respecte un certain format, la longueur minimale et maximale, et si le champ est obligatoire.  
	 * Met à jour l'état et les messages d'erreur associés au champ en cas d'échec de validation.  
	 *  
	 * @param datainputemail (string) : La valeur saisie à valider.  
	 * @param targetInputnameemail (string) : L'identifiant ou clé associé au champ dans le formulaire.  
	 * @param optionsinputemail (OptionsInputText) : Objet contenant les options pour la validation.  
	 * - errorMessageInput (string) : Message d'erreur personnalisé en cas de validation échouée.  
	 * - regexValidator (RegExp) : Expression régulière personnalisée pour valider le format de l'email.  
	 * - minLength (number) : Longueur minimale autorisée pour la valeur.  
	 * - maxLength (number) : Longueur maximale autorisée pour la valeur.  
	 * - requiredInput (boolean) : Indique si le champ est obligatoire.  
	 * @returns this : L'instance actuelle de la classe, permettant un chaînage des appels.  
	 *  
	 * @throws Error : Lance une erreur si `datainputemail` ou `targetInputnameemail` est vide.  
	 */
	public validatorInputEmail = (datainputemail: string, targetInputnameemail: string, optionsinputemail: OptionsInputField={minLength:6,maxLength:180}): this => { 
		const messageerrorEmail = optionsinputemail.errorMessageInput || "email is invalid  Eg:franckagbokoudjo301@gmail.com"; 
		const regexNameEmail = optionsinputemail.regexValidator || this.m_emailRegex; 
		if (!targetInputnameemail || !datainputemail) { throw Error(this.throwmessage); } 
		const datavalueemail = datainputemail.trim(); 
		if (this.checkRegexInput(datavalueemail, regexNameEmail) ===false) { 
			this.setIsValidFieldWithKey(targetInputnameemail, false); 
			this.setErrorMessageFieldWithKey(targetInputnameemail, messageerrorEmail); 
		} 
		this.validatorLength(datavalueemail, targetInputnameemail, optionsinputemail.minLength || 6, optionsinputemail.maxLength || 180); 
		this.validatorRequired(datavalueemail, targetInputnameemail, optionsinputemail.requiredInput || true); 
		return this; 
	};  

	/**  
	 * Validates a phone number input field.  
	 * Checks if the entered value adheres to a specific format, minimum and maximum length, and if the field is required.  
	 * Updates the state and error messages associated with the field in case of validation failure.  
	 *  
	 * @param dataInputTel (string) : The input value to validate.  
	 * @param targetInputTel (string) : The identifier or key associated with the input field in the form.  
	 * @param optionsinputTel (OptionsInputField) : Object containing validation options.  
	 * - errorMessageInput (string) : Custom error message if validation fails.  
	 * - regexValidator (RegExp) : Custom regular expression to validate the phone number format.  
	 * - minLength (number) : Minimum allowed length for the input.  
	 * - maxLength (number) : Maximum allowed length for the input.  
	 * - requiredInput (boolean) : Indicates if the field is mandatory.  
	 * @returns this : The current class instance, allowing method chaining.  
	 *  
	 * @throws Error : Throws an error if `dataInputTel` or `targetInputTel` is empty.  
	 */
	/**  
	 * Valide un champ de type numéro de téléphone.  
	 * Vérifie si la valeur saisie respecte un certain format, la longueur minimale et maximale, et si le champ est obligatoire.  
	 * Met à jour l'état et les messages d'erreur associés au champ en cas d'échec de validation.
	 *  
	 * @param dataInputTel (string) : La valeur saisie à valider.  
	 * @param targetInputTel (string) : L'identifiant ou clé associé au champ dans le formulaire.  
	 * @param optionsinputTel (OptionsInputField) : Objet contenant les options pour la validation.  
	 * - errorMessageInput (string) : Message d'erreur personnalisé en cas de validation échouée.  
	 * - regexValidator (RegExp) : Expression régulière personnalisée pour valider le format du numéro.  
	 * - minLength (number) : Longueur minimale autorisée pour la valeur.  
	 * - maxLength (number) : Longueur maximale autorisée pour la valeur.  
	 * - requiredInput (boolean) : Indique si le champ est obligatoire.  
	 * @returns this : L'instance actuelle de la classe, permettant un chaînage des appels.  
	 *  
	 * @throws Error : Lance une erreur si `dataInputTel` ou `targetInputTel` est vide.  
	 */
	public validatorInputTel = (dataInputTel: string, targetInputTel: string, optionsinputTel: OptionsInputField): this => {
        const messageerrorTel = optionsinputTel.errorMessageInput || this.m_messageInputErrorTel;
        const regexPhone = optionsinputTel.regexValidator || this.m_phoneRegex;
        if (!targetInputTel || !dataInputTel) { throw Error(this.throwmessage); }
        const datavaluetel = dataInputTel.trim();
        if (this.checkRegexInput(datavaluetel, regexPhone) ===false) {
            this.setIsValidFieldWithKey(targetInputTel, false);
            this.setErrorMessageFieldWithKey(targetInputTel, messageerrorTel);
        }
        this.validatorLength(datavaluetel, targetInputTel, optionsinputTel.minLength || 8, optionsinputTel.maxLength || 80);
        this.validatorRequired(datavaluetel, targetInputTel, optionsinputTel.requiredInput || true);
        return this;
    }
	private checkRegexInput(inputvaluetext: string, nameRegexInputText: RegExp): boolean{
        return nameRegexInputText.test(inputvaluetext)
    }
    protected validatorRequired = (datainput: string, targetInputname: string, required: boolean = true): this => {
        if (required === true && !datainput) {
            this.setIsValidFieldWithKey(targetInputname, false)
            this.setErrorMessageFieldWithKey(targetInputname, "this input field is mandatory");
        }
        return this;
    }
    protected validatorLength = (datainput: string, targetInputname: string, minlength: number | undefined, maxlength: number | undefined): this => {
        if (datainput) {
            const datavaluelength = datainput.trim();
            if (minlength && datavaluelength.length < minlength) {
                this.setIsValidFieldWithKey(targetInputname, false)
                this.setErrorMessageFieldWithKey(targetInputname, "please enter at least" + " " + minlength + "  " + "characters ");
            }
            if (maxlength && datavaluelength.length > maxlength) {
                this.setIsValidFieldWithKey(targetInputname, false)
                this.setErrorMessageFieldWithKey(targetInputname, "please enter at less than" + "  " + maxlength + " " + "characters");
            }
        }
        return this;
    }
}
export default FormInputValidator.getInstance();