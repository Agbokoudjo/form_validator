/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Github: https://github.com/Agbokoudjo/form_validator
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { hasProperty } from "./string";

/**
 * Generates an HTML <small> tag to display error messages.
 * Includes an optional `data-key` attribute for JavaScript tracking or debugging.
 *
 * @param {string} message_error - The error message text to display.
 * @param {string} className - CSS classes to apply to the element.
 * @param {string} id - Unique ID for the element.
 * @param {number} [key] - Optional numeric key for identification.
 * @returns {string} The HTML string representing the <small> tag.
 */
export function smallError(message_error: string, className: string, id: string, key?: number): string {
    const dataKeyAttribute = (key !== undefined && key !== null) ? ` data-key="${key}"` : '';

    return `<small id="${id}" class="${className}" ${dataKeyAttribute}>${message_error}</small>`;
}

interface ValidatorErrorFieldProps {
    messageerror: string | string[];
    classnameerror?: string[];
    id: string; // Base ID for generating unique element IDs
    separator_join: string; // HTML string used to join multiple messages
}

/**
 * Generates an HTML block containing one or more formatted error messages.
 * Handles single strings or arrays of messages by joining them with a separator.
 * * @param {ValidatorErrorFieldProps} validate_error_field - Configuration for the error block.
 * @returns {string} The HTML string containing the formatted error message(s).
 */
export const validatorErrorField = (validate_error_field: ValidatorErrorFieldProps = {
    messageerror: ' ',
    classnameerror: ["fw-bold", "text-danger", "mt-2"],
    id: `error-field-${Date.now()}`,
    separator_join: "<br/><hr/>"
}): string => {
    const { messageerror, id, classnameerror, separator_join } = validate_error_field;

    // Combine CSS classes into a single string
    const combinedClassNames = classnameerror && classnameerror.length > 0
        ? `error-message ${classnameerror.join(" ")}`
        : 'error-message';

    let smallErrorHtmlStrings: string[] = [];

    if (Array.isArray(messageerror)) {
        messageerror.forEach((messageErrorItem, index) => {
            // Generate unique IDs and data-keys for each message in the array
            smallErrorHtmlStrings.push(
                smallError(messageErrorItem, combinedClassNames, `${id}-${index}`, index)
            );
        });
    } else {
        // Generate a single message using the base ID
        smallErrorHtmlStrings.push(
            smallError(messageerror, combinedClassNames, id)
        );
    }

    return smallErrorHtmlStrings.join(separator_join);
};

/**
 * Creates or retrieves a small error message element for a specific input field.
 * * This function checks the DOM for an existing error element with a specific ID.
 * If not found, it creates a new HTML element from the template.
 * * @param {string} fieldInputID - The ID of the input field being validated.
 * @param {string} errorMessage - The text to display.
 * @param {number | string} keyError - Unique key for the specific error instance.
 * @returns {HTMLElement} The native DOM element representing the error message.
 */
export function createSmallErrorMessage(
    fieldInputID: string,
    errorMessage: string,
    keyError: number | string
): HTMLElement {
    // Construct a unique ID for the error element
    const errorElementId = `error-item-${fieldInputID}-${keyError}`;

    // Check if the error element already exists in the DOM using native selection
    const existingErrorItem = document.getElementById(errorElementId);
    if (existingErrorItem) {
        return existingErrorItem;
    }

    // Generate HTML string using the validatorErrorField template
    const errorHtmlString = validatorErrorField({
        messageerror: errorMessage,
        classnameerror: [`error-for-${fieldInputID}`, 'invalid-feedback', 'd-block'],
        id: errorElementId,
        separator_join: "<br/><hr/>"
    });

    // Create a temporary container to transform the HTML string into a native DOM Node
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = errorHtmlString.trim();

    const newErrorElement = tempContainer.firstChild as HTMLElement;

    // Set optional metadata attribute for easier targeting
    newErrorElement.setAttribute('data-field-id', fieldInputID);

    return newErrorElement;
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * * Appends or updates a list of validation error messages for a form field in the DOM.
 */

/**
 * Appends or updates a list of validation error messages for a form field.
 * * This function visually displays validation errors for a specific form field.
 * It ensures only one error container exists per field, updating its content as needed.
 * Each error is wrapped in a container inserted immediately after the targeted input.
 * * It also toggles the Bootstrap 'is-invalid' class for visual feedback.
 *
 * @param {HTMLElement} elmtfield - The native DOM element (input, select, textarea).
 * @param {string[]} [errormessagefield] - Array of error messages. If empty, errors are cleared.
 * @param {string} [className_container_ErrorMessage] - CSS classes for the error container.
 */
export function addErrorMessageFieldDom(
    elmtfield: HTMLElement,
    errormessagefield?: string[],
    className_container_ErrorMessage: string = "border border-3 border-light"
): void {
     if (!errormessagefield || errormessagefield.length === 0) { return; }
    const fieldId = elmtfield.id;

    if (!fieldId) {
        console.error("addErrorMessageFieldDom: The provided element does not have an 'id' attribute.", elmtfield);
        return;
    }

    const containerId = `container-div-error-message-${fieldId}`;
    let containerDivErrorMessage = document.getElementById(containerId);

    // Case 1: No error messages provided or empty array -> Clear errors
    if (!errormessagefield || errormessagefield.length === 0) {
        elmtfield.classList.remove('is-invalid');
        if (containerDivErrorMessage) {
            containerDivErrorMessage.remove();
        }
        return;
    }

    // Case 2: Error messages exist -> Manage the container
    if (!containerDivErrorMessage) {
        // Create container if it doesn't exist
        containerDivErrorMessage = document.createElement('div');
        containerDivErrorMessage.id = containerId;
        containerDivErrorMessage.className = className_container_ErrorMessage;

        // Native equivalent of .after(): inserts the container right after the field
        elmtfield.insertAdjacentElement('afterend', containerDivErrorMessage);
    } else {
        // Clear current content if the container already exists
        containerDivErrorMessage.innerHTML = '';
    }

    // Add Bootstrap invalid class
    if (!elmtfield.classList.contains('is-invalid')) {
        elmtfield.classList.add('is-invalid');
    }

    // Generate and append each error message
    errormessagefield.forEach((errorMessageItem, keyError) => {
        const errorSmallElement = createSmallErrorMessage(fieldId, errorMessageItem, keyError);
        // Since createSmallErrorMessage now returns a native HTMLElement
        containerDivErrorMessage!.appendChild(errorSmallElement);
    });
}

/**
 * Handles and displays/clears multiple validation errors for a form, including nested fields.
 *
 * This function is typically used to apply validation feedback returned by a backend API
 * or from a comprehensive client-side validation process. It processes an `errors` object
 * where keys represent form field names (e.g., "email", "address.city") and values are
 * arrays of error messages for that field.
 *
 * The function performs the following steps:
 * 1. **Clears all existing error messages and `is-invalid` classes** within the specified form
 * (or globally if `formId` is not used for scoping).
 * 2. **Iterates through the new `errors` object**:
 * - For each error key, it constructs the expected DOM field ID (e.g., `formName_field_name` for `formName.field_name`).
 * - It attempts to find the corresponding field in the DOM (scoped to `formId` if provided).
 * - If the field is found, it calls `addErrorMessageFieldDom` to display the specific error messages
 * and add the `is-invalid` class.
 * - If a field is not found, a warning is logged using `Logger.warn`.
 *
 * This ensures that the form's error state is accurately updated to reflect only the latest errors.
 *
 * @param formName - The name/alias of the form (used as a prefix for field IDs).
 * @param formId - The DOM ID of the form. Used to scope error clearing and field selection.
 * @param errors - An object where keys are field names (e.g., "email", "address.city") and values are arrays of error messages.
 *
 * @example
 * // To display errors for 'user' form, ID 'user_form':
 * handleErrorsManyForm('user', 'user_form', {
 * "email": ["This field is required.", "Must be a valid email."],
 * "address.city": ["City is required."]
 * });
 *
 * // To clear all errors for the 'user' form (e.g., after successful submission or client-side revalidation):
 * handleErrorsManyForm('user', 'user_form', {});
 */
export function handleErrorsManyForm(
    formName: string,
    formId: string, // Keep formId as it's useful for scoping
    errors: Record<string, string[]>
): void {
    // 1. Clear all previous validation feedback for this form
    // Select all elements within the form that might have the 'is-invalid' class or an error message container.
    // Assuming error containers have IDs like 'container-div-error-message-FIELD_ID'.
    // A more robust approach might be to have a common class on all error containers.
    let formElement = document.getElementById(formId) as HTMLFormElement | null;
    if (!formElement) {
        console.warn(`Form with ID "${formId}" not found for error handling. Cannot clear previous errors.`);
        // If the form itself isn't found, we can't reliably clear errors.
        // We might still try to apply errors if field IDs are globally unique,
        // but it's safer to assume a problem and exit if formId is meant for scoping.
        // For this version, we'll continue to try applying errors to individual elements
        // if the form isn't found, but log a warning.
        formElement = document.querySelector(`form[name='${formName}']`);
    }

    // Define the root for our search (the form if found, otherwise the whole document)
    const searchRoot: ParentNode = formElement || document;

    /**
     * Clear previous errors.
     * We target elements starting with the form prefix to reset their state.
     */
    const fieldsSelector = `input[id^='${formName}_'], select[id^='${formName}_'], textarea[id^='${formName}_']`;
    const containerSelector = `div[id^='container-div-error-message-${formName}_']`;

    // Reset all potentially invalid fields within the scope
    const fields = searchRoot.querySelectorAll<HTMLElement>(fieldsSelector);
    fields.forEach(field => {
        addErrorMessageFieldDom(field, []);
    });

    // Remove any leftover error containers
    const containers = searchRoot.querySelectorAll<HTMLElement>(containerSelector);
    containers.forEach(container => container.remove());


    // 2. If no new errors are provided, we've already cleared them, so we're done.
    if (Object.keys(errors).length === 0) {
        return;
    }

    // Apply new errors
    for (const key in errors) {
        if (hasProperty(errors, key)) {
            // Symfony nested fields (e.g., address.city) use underscores in IDs (address_city)
            const fieldId = `${formName}_${key.replace(/\./g, '_')}`;
            const element = searchRoot.querySelector<HTMLElement>(`#${fieldId}`);

            if (!element) {
                console.warn(`handleErrorsManyForm: Field '${fieldId}' (from key '${key}') not found in DOM.`);
                continue;
            }

            // Display messages using our previously cleaned utility
            addErrorMessageFieldDom(element, errors[key]);
        }
    }
}

/**
 * Clears error messages and invalid status from a specific input field.
 * Removes Bootstrap 'is-invalid' class and deletes the error container.
 *
 * @param {HTMLElement} inputField - The native DOM input element to clear.
 */
export function clearErrorInput(inputField: HTMLElement): void {
    const fieldId = inputField.id;

    if (!fieldId) {
        console.warn("clearErrorInput: Provided field has no 'id' attribute. Cannot clear errors reliably.", inputField);
        return;
    }

    // Error container ID follows the convention established in addErrorMessageFieldDom
    const containerId = `container-div-error-message-${fieldId}`;
    const existingContainer = document.getElementById(containerId);

    // 1. Remove invalid visual state
    if (inputField.classList.contains('is-invalid')) {
        inputField.classList.remove('is-invalid');
    }

    // 2. Remove the error container from the DOM
    if (existingContainer) {
        existingContainer.remove();
    }
}

type SingleFlag = 'g' | 'i' | 'm' | 'u' | 'y' | 's';

type CommonFlagCombinations = SingleFlag |
    `${'g' | 'i' | 'm' | 'u' | 'y' | 's'}${'g' | 'i' | 'm' | 'u' | 'y' | 's'}` | // Permet des combinaisons de 2 flags
    `${'g' | 'i' | 'm' | 'u' | 'y' | 's'}${'g' | 'i' | 'm' | 'u' | 'y' | 's'}${'g' | 'i' | 'm' | 'u' | 'y' | 's'}`; // Permet des combinaisons de 3 flags


export type FlagRegExp = CommonFlagCombinations | 'gi' | 'iu' | 'gim';

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
    children: HTMLElement,
    formParentName: string,
    flag: string = 'i'
): RegExp | undefined {
    if (!children) {
        console.warn(`The input element is not present in the DOM for ${formParentName}`);
        return undefined;
    }

    // Valider les flags
    const isValidFlag = /^[gimuys]*$/.test(flag);
    if (!isValidFlag) {
        console.error(`Invalid regex flag(s) "${flag}" passed for the ${formParentName} form.`);
        return undefined;
    }

    try {
        const pattern = getAttr(children, 'pattern') ?? getAttr(children,'data-pattern');
        const fieldName = getAttr(children,'name') ?? '[unknown name]';

        if (!pattern) {
            console.error(
                `The ${fieldName} field in the ${formParentName} form does not have a pattern attribute.`
            );

            return undefined;
        }
        const regex = new RegExp(pattern as string| RegExp, flag);

        console.log('Pattern transform in javascript:', regex)

        return regex;
    } catch (error: any) {
        console.error(`Invalid pattern in ${formParentName} form field: ${error.message}`);
        throw error;
    }
}

/**
 * @type 
 */
export type MediaType = "video" | "document" | "image";
export type MediaRequiredType = "pdf" | "excel" | "word" | "odf" | "csv";
export type FormInputType = "fqdn" | "file" | "radio" | "checkbox" | "number" | "text" | "email" | "password" | "url" | "select" | "textarea" | "date" | "tel";
export type HTMLFormChildrenElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export type DataInput = string | string[] | number | null | undefined | File | FileList | Date;

export const MediaTypeArray = ['video', 'image', 'document'];

export function getAttr<T = unknown>(
    element: HTMLElement | null | undefined ,
    name: string,
    defaults: unknown = null,
    toJson = false,
): T {

    if (!element) {
        return defaults as T;
    }

    let value = element.getAttribute(name);

    if (!value) { return defaults as T }

    if (toJson) {
        try {

            value = JSON.parse(value);
        } catch (error) {
            console.error('error toJson getAttr:', error)

            return defaults as T;
        }
    }

    return value as T;
}

export function getValue(
    element: HTMLElement | JQuery<HTMLElement>
    ): string | number | string[] | undefined {

    if (element instanceof HTMLElement) {
        element = jQuery<HTMLElement>(element)
    }

    return element.val();
}

export function stringToRegex(regexString: string | null | undefined, flags: FlagRegExp = 'iu'): RegExp | undefined {

    if (!regexString) {
        return undefined;
    }

    try {
        return new RegExp(regexString, flags);
    } catch (e) {
        console.error(`Invalid regex string: ${regexString}`, e);
        throw e;
    }
}

export function getFormAction(formElement: HTMLFormElement,submitter: HTMLButtonElement | HTMLInputElement): string {
    return getAttr<string>(formElement, 'action', "") || getAttr<string>(submitter, 'formaction', "")
}

export function cancelEvent(event:Event):void {
    event.preventDefault()
    event.stopImmediatePropagation();
}

export type HTMLSubmitterElement = HTMLButtonElement | HTMLInputElement;

/**
 * Interface for handling form submission states.
 * Defines the contract for managing submit button behavior during form processing.
 * 
 * @interface SubmitterHandleInterface
 */
interface SubmitterHandleInterface {

    /**
     * Retrieves the submit button or input associated with a form element.
     * 
     * Searches for submit elements in the following order:
     * 1. Inside the form element itself
     * 2. Inside the form's parent container
     * 3. Anywhere in the document using the form's id attribute (form="formId")
     * 4. Anywhere in the document using the form's name attribute (form="formName")
     * 
     * @param {HTMLFormElement} formElement - The form element to find the submitter for
     * @returns {HTMLSubmitterElement} The submit button/input
     * 
     * @example
     * const form = document.getElementById('myForm');
     * const submitter = getSubmitterForm(form);
     * submitter.disabled = true;
     * 
     * @throws {Error} Implicitly throws if no submitter is found (returns undefined cast as defined type)
     */
    getSubmitterForm(formElement: HTMLFormElement): HTMLSubmitterElement;

    /**
     * Sets the submitter text/value to the value specified in the data-submits-with attribute.
     * 
     * For button elements, updates the innerHTML.
     * For input elements, updates the value property.
     * Stores the original text for later restoration.
     * 
     * @returns {void}
     * 
     * @example
     * // HTML: <button type="submit" data-submits-with="Loading...">Submit</button>
     * // After calling setSubmitsWith(), button shows "Loading..."
     */
    getSubmitsWith(): void;

    /**
     * Restores the submitter's original text/value that was stored before setSubmitsWith() was called.
     * 
     * For button elements, restores the innerHTML.
     * For input elements, restores the value property.
     * 
     * @returns {void}
     * 
     * @example
     * // Restores button text from "Loading..." back to "Submit"
     */
    resetSubmitterText(): void;
}

/**
 * Abstract base class for handling form submission button states.
 * Provides common functionality for disabling/enabling submit buttons
 * and managing their text during form submission.
 * 
 * Similar to Symfony's AbstractController pattern.
 * 
 * @abstract
 * @implements {SubmitterHandleInterface}
 * 
 *  * Form Submitter Handler
 * 
 * This module follows interface-driven design principles similar to Symfony's approach.
 * All public contracts are defined through interfaces to ensure type safety and extensibility.
 * 
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @inspired-by Symfony Framework (PHP)
 */
export abstract class SubmitterHandle implements SubmitterHandleInterface {
    protected readonly submitter: HTMLSubmitterElement ;
    private readonly originalSubmitText: string;

    protected constructor(formElement: HTMLFormElement) {
        this.submitter = this.getSubmitterForm(formElement);
        this.originalSubmitText=this.getSubmitsWith();
    }

    /**
     * Disables a submit button/input and prevents any click events.
     * 
     * Sets the disabled property, adds aria-disabled for accessibility,
     * and adds a click event listener that cancels all events.
     * 
     * @param {HTMLSubmitterElement} submitter - The submit element to disable
     * @returns {void}
     * 
     * @example
     * const submitBtn = document.querySelector('button[type="submit"]');
     * SubmitterHandle.beforeSubmit(submitBtn);
     */
    protected static beforeSubmit(submitter: HTMLSubmitterElement): void {
        submitter.disabled = true;
        submitter.setAttribute("aria-disabled", "true");
        submitter.addEventListener("click", cancelEvent, { capture: true });
    }

    /**
     * Re-enables a submit button/input and removes click event prevention.
     * 
     * Removes the disabled property, aria-disabled attribute,
     * and the click event listener that was canceling events.
     * 
     * @param {HTMLSubmitterElement} submitter - The submit element to enable
     * @returns {void}
     * 
     * @example
     * const submitBtn = document.querySelector('button[type="submit"]');
     * SubmitterHandle.afterSubmit(submitBtn);
     */
    protected static afterSubmit(submitter: HTMLSubmitterElement): void {
        submitter.disabled = false;
        submitter.removeAttribute("aria-disabled");
        submitter.removeEventListener("click", cancelEvent, { capture: true });
    }

    public getSubmitterForm(formElement: HTMLFormElement): HTMLSubmitterElement{
        const formId = getAttr<string>(formElement,'id');
        const formName = getAttr<string>(formElement, 'name');

        // Construction du sélecteur complet
        let selector = '[type="submit"]';

        if (formId) {
            selector += `, [type="submit"][form="${formId}"]`;
        }

        if (formName) {
            selector += `, [type="submit"][form="${formName}"]`;
        }

        // Chercher dans le formulaire d'abord
        let submitter = formElement.querySelector('[type="submit"]');

        if (submitter) {
            return submitter as HTMLSubmitterElement;
        }

        // Chercher dans le parent
        const containerParent = formElement.parentElement;
        submitter = containerParent!.querySelector(selector);

        if (submitter) {
            return submitter as HTMLSubmitterElement;
        }

        // Chercher dans tout le document (pour les boutons vraiment externes)
        submitter = document.querySelector(selector);

        return submitter as HTMLSubmitterElement ;
    }

    public getSubmitsWith():string{
        if (!this.submitter || !this.submitsWith) return 'Submit';

        if (this.submitter.matches("button")) {
            const _originalSubmitText = this.submitter.innerHTML
            this.submitter.innerHTML = this.submitsWith
            return _originalSubmitText;
        } else if (this.submitter.matches("input")) {
            const input = this.submitter
            const _originalSubmitText = input.value
            input.value = this.submitsWith

            return _originalSubmitText;
        }

        return 'Submit'
    }

    public resetSubmitterText():void {
        if (!this.submitter || !this.originalSubmitText) return

        if (this.submitter.matches("button")) {
            this.submitter.innerHTML = this.originalSubmitText
        } else if (this.submitter.matches("input")) {
            const input = this.submitter
            input.value = this.originalSubmitText
        }
     }
    
    /**
    * Gets the text to display while the form is submitting.
    * 
    * Reads from the data-submits-with attribute on the submitter element.
    * Defaults to "Sending..." if the attribute is not present.
    * 
    * @private
    * @returns {string} The text to display during submission
    */
    private get submitsWith(): string {
        return getAttr<string>(this.submitter, "data-submits-with", "Sending...")
    }
}
