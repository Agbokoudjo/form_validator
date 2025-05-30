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
import { HTMLFormChildrenElement, Logger } from "../..";
if (typeof window.jQuery === 'undefined') {
    console.error("jQuery is required for usage of these functions");
}
interface ValidatorErrorFieldProps {
    messageerror: string | string[];
    classnameerror?: string[];
    id: string;
    separator_join: string;
}
function smallError(message_error: string, className: string, id: string, key: number = Date.now()): string {
    return `<small id="${id}" class="${className}" key=${key}>${message_error}<small>`
}
export const validatorErrorField = (validate_error_field: ValidatorErrorFieldProps = {
    messageerror: ' ',
    classnameerror: ["fw-bold", "text-danger", "mt-2"],
    id: `${Date.now()}`,
    separator_join: "<br/><hr/>"
}): string => {
    const { messageerror, id, classnameerror, separator_join } = validate_error_field;
    const classNames = `error-message ${classnameerror?.join(" ")}`;
    let small_error: string[] = [];
    if (Array.isArray(messageerror)) {
        messageerror.map((messageerroritem, keyitemerror) => (
            small_error.push(`${smallError(messageerroritem, classNames, id, keyitemerror)}`)
        ))
    } else {
        small_error = [smallError(messageerror, classNames, id)]
    }
    return small_error.join(separator_join);
}
/**
 * This function creates a small error message element for a given input field.
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
    return jQuery(validatorErrorField({
        messageerror: errorMessage,
        classnameerror: [`error-item-${fieldInputID}`, 'invalid-feedback d-block'],
        id: `error-item-${fieldInputID}-${keyError}`,
        separator_join: "<br/><hr/>"
    }));
}

/**
 * Appends a list of validation error messages to a form field in the DOM.
 *
 * This function is used to visually display server-side or client-side validation 
 * errors for a specific form field. It adds a container `<div>` below the targeted 
 * input element, containing each error message wrapped in a `<small>` tag.
 *
 * Additionally, it adds the `is-invalid` class to the form field for Bootstrap-style 
 * validation feedback.
 *
 * @param elmtfield - The jQuery object representing the target form input element.
 * @param errormessagefield - An optional array of error messages to display for this field.
 * @param className_container_ErrorMessage - Optional custom class string for styling 
 *        the error message container. Defaults to a Bootstrap border style.
 *
 * @example
 * // For an input with ID "user_email" and validation errors:
 * addErrorMessageFieldDom($('#user_email'), [
 *   'This field is required.',
 *   'Must be a valid email address.'
 * ]);
 */
export function addErrorMessageFieldDom(
    elmtfield: JQuery<HTMLFormChildrenElement>,
    errormessagefield?: string[],
    className_container_ErrorMessage: string = "border border-3 border-light"): void {
    const fieldId = elmtfield.attr("id")!;
    if (errormessagefield && errormessagefield.length > 0) {
        const containerDivErrorMessage = jQuery(`<div class="${className_container_ErrorMessage}"
             id="container-div-error-message-${fieldId}"></div>`);
        if (!elmtfield.hasClass('is-invalid')) { elmtfield.addClass('is-invalid'); }
        const errormessagedom = errormessagefield.map((errormessagefieldItem, keyerror) => {
            return createSmallErrorMessage(fieldId, errormessagefieldItem, keyerror);
        });
        containerDivErrorMessage.append(errormessagedom);
        elmtfield.after(containerDivErrorMessage);
    }
}
/**
 * This function handles error messages for the current input field, 
 * displaying error messages related to input errors. 
 * It disables the submit button when the field content is invalid 
 * and enables it when the field is valid.
 * @param input_field - Champ input (JQuery<HTMLInputElement|HTMLTextAreaElement>)
 * @param Errorhandle - Le type de validator héritant la classe ErrorMessageFormHandle par défaut
 */
export function serviceInternclass(input_field: JQuery<HTMLInputElement | HTMLTextAreaElement>,
    errormessagefield?: string[]): void {
    const btnsubmited = jQuery('button[type="submit"]', input_field.closest('form'));
    btnsubmited.attr('disabled', 'disabled');
    btnsubmited.css({ display: 'none' });
    addErrorMessageFieldDom(input_field, errormessagefield);
}

/**
 * Handles and displays multiple validation errors for a form with nested fields.
 *
 * This function is typically used to apply validation feedback returned by the backend.
 * It traverses the `errors` object where each key represents a form field (including nested fields like `address.city`)
 * and each value is an array of error messages for that field.
 *
 * For each field:
 * - It constructs the DOM field ID using the `formName` and the error key, replacing dots (`.`) with underscores (`_`)
 *   to support nested fields.
 * - It checks whether the field exists in the DOM.
 * - If found, it adds the `is-invalid` class and appends the error messages below the field using `addErrorMessageFieldDom`.
 * - If the field is not found, a warning is logged using `Logger.warn`.
 *
 * @param formName - The name/alias of the form (used as a prefix for field IDs).
 * @param formId - The DOM ID of the form (not used in this implementation but can be helpful for future extensions).
 * @param errors - An object where keys are field names (e.g. "email", "address.city") and values are arrays of error messages.
 *
 * @example
 * handleErrorsManyForm('user', 'user_form', {
 *   "email": ["This field is required."],
 *   "address.city": ["City is required."]
 * });
 */

export function handleErrorsManyForm(
    formName: string,
    formId: string,
    errors: Record<string, string[]>
): void {
    if (Object.keys(errors).length === 0) return;

    for (const key in errors) {
        const fieldId = `${formName}_${key.replace(/\./g, '_')}`;
        const element = jQuery<HTMLFormChildrenElement>(`#${fieldId}`);

        if (element.length === 0) {
            Logger.warn(`Field not found for ${fieldId}`);
            continue;
        }

        element.addClass('is-invalid');
        addErrorMessageFieldDom(element, errors[key]);
    }
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
export function clearErrorInput(
    inputFieldJQuery: JQuery<HTMLFormChildrenElement>,
    applicCss: Record<string, string> = { border: 'medium none blue' }
): void {
    if (!inputFieldJQuery.hasClass('is-invalid')) { return; }
    inputFieldJQuery.removeClass('is-invalid');
    inputFieldJQuery.css(applicCss);
    jQuery(`.error-item-${inputFieldJQuery.attr('id')}`).each(function (index, elmtError) {
        jQuery<HTMLElement>(elmtError).empty().remove();
    });
    return;
}
export type FlagRegExp = `${'g' | 'i' | 'm' | 'u' | 'y' | 's'}`; // Type plus précis
/**
 * Extracts the `pattern` attribute from an input or textarea element
 * and returns it as a JavaScript `RegExp` object, with optional flags.
 *
 * This function uses jQuery internally to safely access the DOM element's attributes.
 * While jQuery is used, this does not prevent the function from being used in modern
 * frameworks such as React, as long as the DOM node is accessible (e.g., via a `ref`).
 *
 * It ensures that the element exists in the DOM, that the `pattern` attribute is present,
 * and that the provided regex flags are valid before attempting to create a RegExp object.
 *
 * @param children - The input or textarea DOM element from which to extract the pattern.
 * @param formParentName - A descriptive name of the form for context in logging (e.g. 'LoginForm').
 * @param flag - A string of valid regex flags (`g`, `i`, `m`, `u`, `y`, `s`). Defaults to `'i'`.
 *
 * @returns A `RegExp` object if the pattern exists and is valid, otherwise `null`.
 *
 * @throws Will rethrow any error encountered during RegExp construction (e.g., if the pattern is invalid).
 *
 * @example
 * const input = document.querySelector('#email') as HTMLInputElement;
 * const regex = getInputPatternRegex(input, 'LoginForm', 'gi');
 * if (regex?.test(input.value)) {
 *   console.log('Valid email input!');
 * }
 *```tsx
* import React, { useRef } from 'react';

export function MyFormComponent() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleValidate = () => {
    if (inputRef.current) {
      const regex = getInputPatternRegex(inputRef.current, 'MyReactForm', 'i');
      const value = inputRef.current.value;
      if (regex?.test(value)) {
        console.log('✅ Valid input!');
      } else {
        console.warn('❌ Invalid input!');
      }
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        name="username"
        pattern="^[a-zA-Z0-9_]{4,12}+$"
        placeholder="Enter your username"
      />
      <button onClick={handleValidate}>Validate</button>
    </div>
  );
}
*
 *```
 * @note This function assumes that jQuery is available in your project.
 *       In React, you can pass a `ref.current` element to this function.
 */

export function getInputPatternRegex(
    children: HTMLElement | JQuery<HTMLElement | HTMLElement>,
    formParentName: string,
    flag: string = 'i'
): RegExp | undefined {
    if (children instanceof HTMLElement || children instanceof HTMLElement) {
        children = jQuery<HTMLElement | HTMLElement>(children);
    }
    if (children.length <= 0) {
        Logger.warn(`The input element is not present in the DOM for ${formParentName}`);
        return undefined;
    }

    // Valider les flags
    const isValidFlag = /^[gimuyss]*$/.test(flag);
    if (!isValidFlag) {
        Logger.error(`Invalid regex flag(s) "${flag}" passed for the ${formParentName} form.`);
        return undefined;
    }

    try {
        const pattern = children.attr('pattern');
        const fieldName = children.attr('name') ?? '[unknown name]';

        if (!pattern) {
            Logger.error(
                `The ${fieldName} field in the ${formParentName} form does not have a pattern attribute.`
            );
            return undefined;
        }
        const regex = new RegExp(pattern, flag);
        Logger.log('Pattern transform in javascript', regex)
        return regex;
    } catch (error: any) {
        Logger.error(`Invalid pattern in ${formParentName} form field: ${error.message}`);
        throw error;
    }
}