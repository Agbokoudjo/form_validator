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

import { AbstractFieldValidator } from "../FieldValidator";
import { textInputValidator, TextInputOptions } from "./TextInputValidator";


/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * 
 * @class TextareaValidator
 * @extends AbstractFieldValidator
 */
export class TextareaValidator extends AbstractFieldValidator {

    private static instance: TextareaValidator;

    private constructor() { super(); }

    public static getInstance(): TextareaValidator {
        if (!TextareaValidator.instance) {
            TextareaValidator.instance = new TextareaValidator();
        }

        return TextareaValidator.instance;
    }

    public validate = (
        value: string | undefined,
        targetInputname: string,
        optionsinputtext: TextInputOptions,
        ignoreMergeWithDefaultOptions: boolean = false
    ): this => {

        textInputValidator.validate(value, targetInputname, optionsinputtext, true);

        return this;
    }

}

export const textareaInputValidator = TextareaValidator.getInstance();