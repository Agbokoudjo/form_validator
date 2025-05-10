import { FormErrorInterface } from "../FormError";

/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */
if (typeof window.jQuery === 'undefined') {
    console.error("jQuery is required for usage of these functions");
}
/**
 * This function handles error messages for the current input field, 
 * displaying error messages related to input errors. 
 * It disables the submit button when the field content is invalid 
 * and enables it when the field is valid.
 * 
 * @param input_field - Champ input (JQuery<HTMLInputElement|HTMLTextAreaElement>)
 * @param Errorhandle - Le type de validator héritant la classe ErrorMessageFormHandle par défaut
 */
export function serviceInternclass(input_field: JQuery<HTMLInputElement | HTMLTextAreaElement>, errorhandle: FormErrorInterface): void {
    const btnsubmited = jQuery('button[type="submit"]', input_field.closest('form'));
    if (!errorhandle.hasErrorsField(input_field.attr('name') as string)) {
        btnsubmited.attr('disabled', 'disabled');
        btnsubmited.css({ display: 'none' });
        addErrorMessageFieldDom(input_field.attr('id') as string, errorhandle);
    } else {
        btnsubmited.css({ display: 'block' });
        if (btnsubmited.attr('disabled')) { btnsubmited.removeAttr('disabled'); }
    }
}
/**
 * This function adds error messages to a field in the DOM.
 * 
 * Cette fonction ajoute des messages d'erreur à un champ dans le DOM.
 * 
 * @param fieldId - The unique ID of the field to which the error messages will be added.
 * @param Errorhandle - An instance of ErrorMessageHandle used to retrieve error messages.
 * 
 * This function checks if there are error messages associated with the field, 
 * adds the 'is-invalid' class if not present, creates small error message elements, 
 * and appends them to the field.
 */
export function addErrorMessageFieldDom(fieldId: string, errorhandle: FormErrorInterface): void {
    const elmtfield = jQuery(`#${fieldId}`);
    const errormessagefield = errorhandle.getErrorMessageField(elmtfield.attr('name') as string);
    if (errormessagefield && errormessagefield.length > 0) {
        const containerDivErrorMessage = jQuery('<div class="border border-3 border-light"></div>');
        if (!elmtfield.hasClass('is-invalid')) {
            elmtfield.addClass('is-invalid');
        }
        const errormessagedom = errormessagefield.map((errormessagefieldItem, keyerror) => {
            const smallerror = createSmallErrorMessage(fieldId, errormessagefieldItem, keyerror);
            return smallerror;
        });
        containerDivErrorMessage.append(errormessagedom);
        elmtfield.after(containerDivErrorMessage);
    }
}
/**
 * This function handles errors for multiple form fields.
 * 
 * Cette fonction gère les erreurs pour plusieurs champs de formulaire.
 * 
 * @param formName - The name of the form to which the errors belong.
 * @param formId - The unique ID of the form.
 * @param errors - An object containing field names as keys and corresponding error messages as values.
 * 
 * This function loops through the errors object, finds the corresponding form fields,
 * adds the 'is-invalid' class to them, and appends a small error message element next to the input field.
 */
export function handleErrorsManyForm(
    formName: string,
    formId: string,
    errors: Record<string, string>
): void {
    if (Object.keys(errors).length === 0) return;
    let element: JQuery<HTMLElement>;
    for (const key in errors) {
        element = jQuery(`#${formName}_${key}`);
        element.addClass('is-invalid');
        const small = createSmallErrorMessage(formId, errors[key], key);
        element.after(small);
    }
}

/**
 * This function creates a small error message element for a given input field.
 * 
 * Cette fonction crée un élément de message d'erreur en petit pour un champ d'entrée donné.
 * 
 * @param fieldInputID - The ID of the input field for which the error message is created.
 * @param errorMessage - The error message text to display.
 * @param keyError - A unique key or identifier for the specific error instance.
 * 
 * @returns {JQuery<HTMLElement>} - The jQuery element representing the created error message.
 * 
 * This function checks if an error item with the given `fieldInputID` and `keyError` already exists.
 * If so, it returns that existing item. Otherwise, it creates a new small error message element, adds appropriate classes,
 * sets its ID and text content, and returns the newly created element.
 */
export function createSmallErrorMessage(
    fieldInputID: string,
    errorMessage: string,
    keyError: number | string
): JQuery<HTMLElement> {
    const existingErrorItem = jQuery(`#error-item-${fieldInputID}-${keyError}`);
    if (existingErrorItem.length > 0) {
        return existingErrorItem;
    }
    const small = jQuery('<small></small>')
        .addClass(`error-item-${fieldInputID}`)
        .addClass('invalid-feedback d-block')
        .attr('id', `error-item-${fieldInputID}-${keyError}`)
        .text(errorMessage)
        .after('<br/>')
        .after('<hr/>');
    return small;
}
/**
 * This function clears error messages associated with an input field.
 * 
 * @param inputFieldJQuery - A jQuery element representing the input field whose errors need to be cleared.
 * @param Errorhandle - An instance of the ErrorMessageHandle class used to manage error messages.
 * 
 * @returns {void} - Returns nothing.
 * 
 * This function checks if the input field has the 'is-invalid' CSS class.
 * If so, it:
 * - Removes the 'is-invalid' class from the field.
 * - Resets the CSS style of the border to its default state.
 * - Loops through all error elements associated with the field (having a class in the format `.error-item-ID` where ID is the field's ID),
 *   and removes them from the DOM.
 * - Clears errors related to the field using the provided ErrorMessageHandle instance.
 */
export function clearErrorInput(inputFieldJQuery: JQuery, errorhandle: FormErrorInterface): void {
    if (!inputFieldJQuery.hasClass('is-invalid')) { return; }
    inputFieldJQuery.removeClass('is-invalid');
    inputFieldJQuery.css({ border: 'medium none blue' });
    jQuery(`.error-item-${inputFieldJQuery.attr('id')}`).each(function (index, elmtError) {
        jQuery<HTMLElement>(elmtError).empty().remove();
    });
    errorhandle.clearError(inputFieldJQuery.attr('name') as string);
}
