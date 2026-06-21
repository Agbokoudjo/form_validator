/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */
import type {
    FormInputType, DataInput,
    MediaType, MediaRequiredType
} from "../../../_Utils";

import type {
    FieldValidatorInterface,
    FormInputValidatorInterface,
    ContainerValidatorInterface
} from "../../Contracts"

import {
    emailInputValidator,
    passwordInputValidator,
    textInputValidator,
    urlInputValidator,
    dateInputValidator,
    telInputValidator,
    numberInputValidator,
    textareaInputValidator,
    //media 
    imageValidator,
    videoValidator,
    microsoftWordValidator,
    csvValidator,
    pdfValidator,
    excelValidator,
    checkboxValidator,
    radioValidator,
    selectValidator,
    odtValidator,
    fqdnInputValidator,
    isbnValidator,
    cardSchemeValidator,
    iconValidator
} from "../../Rules";

import type {
    //Choice
    OptionsCheckbox,
    OptionsRadio,
    SelectOptions,
    OptionsWordFile,
    OptionsCsvFile,
    OptionsExcelFile,
    OptionsOdfFile,
    OptionsImage,
    OptionsMediaVideo,
    PasswordRuleOptions,
    URLOptions,
    NumberOptions,
    TelInputOptions,
    EmailInputOptions,
    FQDNOptions,
    TextInputOptions,
    DateInputOptions,
    OptionsValidate,
    IsbnOptions,
    CardSchemeOptions,
    OptionsPdf,
    IconOptions
} from "../../types"

/**
 * @class FormInputValidator
 * @description 
 * Central Router and Instance Manager (Singleton).
 * This class acts as the main Facade for the validation engine.
 * It routes (dispatches) input data to the appropriate specialized validator 
 * (Email, Password, File, etc.) based on the field type, and maintains 
 * a registry of these validators to manage error states.
 * * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 */
export class FormInputValidator implements FormInputValidatorInterface, ContainerValidatorInterface {
    private static m_instance_validator: FormInputValidator;
    private readonly __containerValidator: Map<string, FieldValidatorInterface>;

    private constructor() { this.__containerValidator = new Map<string, FieldValidatorInterface>(); }

    public static getInstance(): FormInputValidator {

        if (!FormInputValidator.m_instance_validator) {
            FormInputValidator.m_instance_validator = new FormInputValidator();
        }

        return FormInputValidator.m_instance_validator;
    }

    /**
    * Dispatches the input data to the correct validator based on the field type.
    */
    public allTypesValidator = async (
        datainput: DataInput,
        targetInputname: string,
        type_field: FormInputType | MediaType | MediaRequiredType,
        options_validator: OptionsValidate,
        ...othersArg: any
    ): Promise<void> => {

        if (datainput instanceof File || datainput instanceof FileList) {
            switch (type_field) {
                case "image":
                    await imageValidator.validate(datainput, targetInputname, options_validator as OptionsImage);
                    this.setValidator(targetInputname, imageValidator);

                    break;
                case "video":
                    await videoValidator.validate(datainput, targetInputname, options_validator as OptionsMediaVideo);
                    this.setValidator(targetInputname, videoValidator);
                    break;
                case "word":
                    await microsoftWordValidator.validate(datainput, targetInputname, options_validator as OptionsWordFile);
                    this.setValidator(targetInputname, microsoftWordValidator);
                    break;
                case "odf":
                    await odtValidator.validate(datainput, targetInputname, options_validator as OptionsOdfFile);
                    this.setValidator(targetInputname, odtValidator);
                    break;
                case "excel":
                    await excelValidator.validate(datainput, targetInputname, options_validator as OptionsExcelFile);
                    this.setValidator(targetInputname, excelValidator);
                    break;
                case "csv":
                    await csvValidator.validate(datainput, targetInputname, options_validator as OptionsCsvFile);
                    this.setValidator(targetInputname, csvValidator);
                    break;
                case "pdf":
                    await pdfValidator.validate(datainput, targetInputname, options_validator as OptionsPdf);
                    this.setValidator(targetInputname, pdfValidator);
                    break;
                default:
                    console.error(`[FormValidator] File validation for type "${type_field}" is not implemented.`);
                    break;
            }
            return;
        }

        switch (type_field) {
            case 'email':
                await emailInputValidator.validate(datainput as string, targetInputname, options_validator as EmailInputOptions);
                this.setValidator(targetInputname, emailInputValidator);
                break;

            case 'password':
                passwordInputValidator.validate(datainput as string, targetInputname, options_validator as PasswordRuleOptions);
                this.setValidator(targetInputname, passwordInputValidator);
                break;

            case 'text':
                textInputValidator.validate(datainput as string, targetInputname, options_validator as TextInputOptions);
                this.setValidator(targetInputname, textInputValidator);
                break;

            case 'url':
                await urlInputValidator.validate(datainput as string, targetInputname, options_validator as URLOptions);
                this.setValidator(targetInputname, urlInputValidator);
                break;

            case 'date':
                dateInputValidator.validate(datainput as string|Date, targetInputname, options_validator as DateInputOptions);
                this.setValidator(targetInputname, dateInputValidator)
                break;

            case 'tel':
                telInputValidator.validate(datainput as string | undefined, targetInputname, options_validator as TelInputOptions);
                this.setValidator(targetInputname, telInputValidator)
                break;

            case 'textarea':
                textareaInputValidator.validate(datainput as string | undefined, targetInputname, options_validator as TextInputOptions);
                this.setValidator(targetInputname, textareaInputValidator);
                break;
            case 'isbn':
                isbnValidator.validate(datainput as string | undefined, targetInputname, options_validator as IsbnOptions);
                this.setValidator(targetInputname, isbnValidator);
                break;
            case 'select':
                selectValidator.validate(datainput as string | string[], targetInputname, options_validator as SelectOptions);
                this.setValidator(targetInputname, selectValidator);
                break;

            case 'number':
                numberInputValidator.validate(datainput as string | number, targetInputname, options_validator as NumberOptions);
                this.setValidator(targetInputname, numberInputValidator);
                break;

            case 'checkbox':
                checkboxValidator.validate(datainput as number, targetInputname, options_validator as OptionsCheckbox);
                this.setValidator(targetInputname, checkboxValidator);
                break;

            case 'radio':
                radioValidator.validate(datainput as string | null | undefined, targetInputname, options_validator as OptionsRadio);
                this.setValidator(targetInputname, radioValidator);
                break;
            case 'fqdn':
                fqdnInputValidator.validate(datainput as string, targetInputname, options_validator as FQDNOptions);
                this.setValidator(targetInputname, fqdnInputValidator);
                break;
            case 'card':
                cardSchemeValidator.validate(datainput as string, targetInputname,  options_validator as CardSchemeOptions);
                this.setValidator(targetInputname, cardSchemeValidator);
                break;
            case 'icon':
                iconValidator.validate(datainput as string | undefined, targetInputname, options_validator as IconOptions);
                this.setValidator(targetInputname, iconValidator);
                break;
            default:
                console.error(`The validation function for ${type_field} is not implemented.`);
                break;
        }
    };

    /**
     * Stores a validator instance associated with a specific field name.
     */
    public setValidator(targetInputname: string, validator: FieldValidatorInterface): void {
        this.__containerValidator.set(targetInputname, validator);
    }

    /**
    * Remove a validator instance associated with a specific field name.
    */
    public removeValidator(targetInputname: string): void {
        this.__containerValidator.delete(targetInputname);
    }

    /**
     * Retrieves a stored validator instance by field name.
     */
    public getValidator = (targetInputname: string): FieldValidatorInterface | undefined => {
        return this.__containerValidator.get(targetInputname);
    }
}

/**
 * Exported Singleton instance for global application use.
 */
export const formInputValidator = FormInputValidator.getInstance();