/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Github: https://github.com/Agbokoudjo/form_validator
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */
import { Logger } from ".";
if (typeof window.jQuery === 'undefined') {
    console.error("jQuery is required for usage of these functions");
}

/**
 * Génère une balise <small> HTML pour afficher des messages d'erreur.
 * Peut inclure un attribut `data-key` pour un usage JavaScript ou de debugging.
 *
 * @param message_error Le message d'erreur à afficher.
 * @param className Les classes CSS à appliquer à la balise <small>.
 * @param id L'ID unique de la balise <small>.
 * @param key (Optionnel) Une clé numérique à inclure comme attribut `data-key` pour un usage spécifique (ex: identification en JS).
 * @returns Une chaîne de caractères représentant la balise <small> HTML.
 */
export function smallError(message_error: string, className: string, id: string, key?: number): string {
    // Si 'key' est fourni et n'est pas undefined/null, ajoute l'attribut data-key.
    // Sinon, l'attribut data-key n'est pas inclus.
    const dataKeyAttribute = (key !== undefined && key !== null) ? ` data-key="${key}"` : '';

    return `<small id="${id}" class="${className}"  ${dataKeyAttribute}>${message_error}</small>`;
}

interface ValidatorErrorFieldProps {
    messageerror: string | string[];
    classnameerror?: string[];
    id: string; // Cet ID sera la base pour générer des IDs uniques si plusieurs messages
    separator_join: string; // Retourne une chaîne, donc le séparateur doit être une chaîne HTML
}

/**
 * Génère un bloc de messages d'erreur formatés en HTML.
 * Peut gérer un message unique ou plusieurs messages, en les joignant avec un séparateur.
 * 
 * @param validate_error_field Un objet contenant les messages d'erreur, les classes, l'ID et le séparateur.
 * @returns Une chaîne de caractères HTML représentant le(s) message(s) d'erreur.
 */
export const validatorErrorField = (validate_error_field: ValidatorErrorFieldProps = {
    messageerror: ' ',
    classnameerror: ["fw-bold", "text-danger", "mt-2"],
    id: `error-field-${Date.now()}`, // Préfixe pour l'ID pour éviter les conflits
    separator_join: "<br/><hr/>"
}): string => {
    const { messageerror, id, classnameerror, separator_join } = validate_error_field;

    // Concaténation des classes CSS
    const combinedClassNames = classnameerror && classnameerror.length > 0
        ? `error-message ${classnameerror.join(" ")}`
        : 'error-message';

    let smallErrorHtmlStrings: string[] = [];

    if (Array.isArray(messageerror)) {
        messageerror.forEach((messageErrorItem, index) => {
            // Pour chaque message, générer un ID unique et passer l'index comme 'key' pour data-key.
            smallErrorHtmlStrings.push(
                smallError(messageErrorItem, combinedClassNames, `${id}-${index}`, index)
            );
        });
    } else {
        // Pour un seul message, utiliser l'ID de base et ne pas passer de 'key' (ou un 0 si désiré)
        smallErrorHtmlStrings.push(
            smallError(messageerror, combinedClassNames, id)
        );
    }

    // Joindre toutes les chaînes HTML des messages d'erreur avec le séparateur
    return smallErrorHtmlStrings.join(separator_join);
};

/**
 * Cette fonction crée ou récupère un petit élément de message d'erreur pour un champ de saisie donné.
 * @param fieldInputID - L'ID du champ de saisie pour lequel le message d'erreur est créé.
 * @param errorMessage - Le texte du message d'erreur à afficher.
 * @param keyError - Une clé ou un identifiant unique pour l'instance d'erreur spécifique, crucial pour plusieurs erreurs par champ.
 *
 * @returns {JQuery<HTMLElement>} - L'élément jQuery représentant le message d'erreur créé ou existant.
 *
 * Cette fonction vérifie d'abord si un élément d'erreur avec un ID spécifique (dérivé de `fieldInputID` et `keyError`)
 * existe déjà dans le DOM. Si trouvé, elle retourne cet élément existant. Sinon, elle génère une nouvelle
 * chaîne HTML de message d'erreur en utilisant `validatorErrorField`, l'enveloppe dans un objet jQuery, et la retourne.
 */
export function createSmallErrorMessage(
    fieldInputID: string,
    errorMessage: string,
    keyError: number | string
): JQuery<HTMLElement> {
    // Construire l'ID unique pour l'élément d'erreur
    const errorElementId = `error-item-${fieldInputID}-${keyError}`;

    // Vérifier si un élément d'erreur avec cet ID existe déjà dans le DOM
    const existingErrorItem = jQuery(`#${errorElementId}`);
    if (existingErrorItem.length > 0) {
        // S'il existe, retourner l'élément jQuery existant
        return existingErrorItem;
    }

    // Si aucun élément existant n'est trouvé, générer la chaîne HTML en utilisant validatorErrorField
    const errorHtmlString = validatorErrorField({
        messageerror: errorMessage,
        // Ajouter une classe spécifique pour cet élément d'erreur, et les classes de validation Bootstrap générales
        classnameerror: [`error-for-${fieldInputID}`, 'invalid-feedback', 'd-block'],
        id: errorElementId, // Utiliser l'ID unique généré
        separator_join: "<br/><hr/>" // Conserver votre séparateur choisi
    });

    // Créer un nouvel élément jQuery à partir de la chaîne HTML générée
    // L'ajout d'un attribut `data-field-id` peut être utile pour sélectionner les erreurs
    // liées à un champ spécifique ultérieurement.
    const newErrorElement = jQuery(errorHtmlString)
        .attr('data-field-id', fieldInputID); // Optionnel : Ajouter un attribut de données pour un ciblage facile

    return newErrorElement;
}

/**
 * Appends or updates a list of validation error messages for a form field in the DOM.
 *
 * This function visually displays server-side or client-side validation errors for a specific form field.
 * It ensures only one error container exists per field, adding or updating its content.
 * Each error message is wrapped in a `<small>` tag within a container `<div>` below the targeted input element.
 *
 * It also adds/removes the `is-invalid` class to the form field for Bootstrap-style validation feedback.
 *
 * @param elmtfield - The jQuery object representing the target form input/select/textarea element.
 * @param errormessagefield - An optional array of error messages to display for this field.
 * If empty or `undefined`, existing error messages and `is-invalid` class will be removed.
 * @param className_container_ErrorMessage - Optional custom class string for styling
 * the error message container. Defaults to a Bootstrap border style.
 *
 * @returns {void}
 *
 * @example
 * // To display errors for an input with ID "user_email":
 * addErrorMessageFieldDom($('#user_email'), [
 * 'This field is required.',
 * 'Must be a valid email address.'
 * ]);
 *
 * // To clear errors for the same input:
 * addErrorMessageFieldDom($('#user_email')); // Passing no errors or an empty array
 */
export function addErrorMessageFieldDom(
    elmtfield: JQuery<HTMLElement>, // Corrected type for better compatibility
    errormessagefield?: string[],
    className_container_ErrorMessage: string = "border border-3 border-light"
): void {
    if (!errormessagefield || errormessagefield.length === 0) { return; }
    const fieldId = elmtfield.attr("id");

    // --- Input Validation ---
    if (!fieldId) {
        console.error("addErrorMessageFieldDom: The provided element does not have an 'id' attribute.", elmtfield);
        return; // Exit if no ID, as it's crucial for error message management
    }

    const containerId = `container-div-error-message-${fieldId}`;
    let containerDivErrorMessage = jQuery(`#${containerId}`);
    // --- Handle Error Clearing ---
    if (!errormessagefield || errormessagefield.length === 0) {
        // If no errors provided, remove the invalid state and the error container
        elmtfield.removeClass('is-invalid');
        if (containerDivErrorMessage.length > 0) {
            containerDivErrorMessage.remove();
        }
        return; // All cleared, exit
    }
    // --- Handle Error Display / Update ---
    // If container doesn't exist, create it
    if (containerDivErrorMessage.length === 0) {
        containerDivErrorMessage = jQuery(`<div class="${className_container_ErrorMessage}" id="${containerId}"></div>`);
        elmtfield.after(containerDivErrorMessage); // Append the container right after the field
    } else {
        // If container exists, clear its current content before adding new messages
        containerDivErrorMessage.empty();
    }

    // Add 'is-invalid' class to the field if not already present
    if (!elmtfield.hasClass('is-invalid')) {
        elmtfield.addClass('is-invalid');
    }

    // Generate jQuery error message elements
    const errorMessagesJQuery = errormessagefield.map((errorMessageItem, keyError) => {
        return createSmallErrorMessage(fieldId, errorMessageItem, keyError);
    });

    // Append all generated error messages to the container
    containerDivErrorMessage.append(errorMessagesJQuery);
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
    const $form = jQuery(`#${formId}`);
    if ($form.length === 0) {
        Logger.warn(`Form with ID "${formId}" not found for error handling. Cannot clear previous errors.`);
        // If the form itself isn't found, we can't reliably clear errors.
        // We might still try to apply errors if field IDs are globally unique,
        // but it's safer to assume a problem and exit if formId is meant for scoping.
        // For this version, we'll continue to try applying errors to individual elements
        // if the form isn't found, but log a warning.
    }

    // Find all fields and error containers that might have been marked as invalid by this system
    // Using `[id^='${formName}_']` targets elements whose ID starts with the formName prefix.
    // This assumes that ALL fields handled by this system follow the `${formName}_FIELD_ID` convention.
    // This is more efficient than selecting all :input elements and iterating.
    const $potentiallyInvalidFields = $form.length > 0 ?
        $form.find(`[id^='${formName}_']`).add($form.find(`[id^='container-div-error-message-${formName}_']`)) :
        jQuery(`[id^='${formName}_']`).add(jQuery(`[id^='container-div-error-message-${formName}_']`));


    // Iterate over all potentially invalid fields and clear their errors
    $potentiallyInvalidFields.each(function () {
        const $el = jQuery(this);
        // If it's a field (e.g., input, select, textarea)
        if ($el.is('input, select, textarea')) {
            // Call addErrorMessageFieldDom with an empty array to clear errors for this specific field
            addErrorMessageFieldDom($el as JQuery<HTMLElement>, []);
        } else if ($el.attr('id')?.startsWith('container-div-error-message-')) {
            // If it's an error container div, just remove it directly
            $el.remove();
        }
    });

    // 2. If no new errors are provided, we've already cleared them, so we're done.
    if (Object.keys(errors).length === 0) {
        return;
    }

    // 3. Apply new errors
    for (const key in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, key)) { // Good practice to check hasOwnProperty
            const fieldId = `${formName}_${key.replace(/\./g, '_')}`;

            // Scope the element selection to the form if the form was found, otherwise search globally.
            const element = $form.length > 0 ?
                $form.find(`#${fieldId}`) as JQuery<HTMLElement> :
                jQuery(`#${fieldId}`) as JQuery<HTMLElement>;

            if (element.length === 0) {
                Logger.warn(`handleErrorsManyForm: Field '${fieldId}' (derived from '${key}') not found in DOM or within form '#${formId}'.`);
                continue;
            }

            // addErrorMessageFieldDom already handles adding 'is-invalid' and appending messages
            addErrorMessageFieldDom(element, errors[key]);
        }
    }
}

/**
 * Cette fonction efface les messages d'erreur associés à un champ de saisie du DOM.
 * Elle supprime la classe d'invalidation (par ex. 'is-invalid' de Bootstrap) du champ
 * et retire le conteneur des messages d'erreur du DOM.
 *
 * @param inputFieldJQuery - Un élément jQuery représentant le champ de saisie dont les erreurs doivent être effacées.
 * @returns {void} - Ne retourne rien.
 *
 * Cette fonction vérifie si le champ de saisie a la classe 'is-invalid'.
 * Si c'est le cas, elle :
 * - Supprime la classe 'is-invalid' du champ.
 * - Supprime l'élément conteneur des messages d'erreur (généré par `addErrorMessageFieldDom`) du DOM.
 *
 * @example
 * // Pour effacer les erreurs d'un champ avec l'ID "user_email":
 * clearErrorInput($('#user_email'));
 */
export function clearErrorInput(
    inputFieldJQuery: JQuery<HTMLElement> // Type corrigé pour une meilleure compatibilité
): void {
    // Obtenez l'ID du champ. C'est crucial pour cibler le conteneur d'erreurs.
    const fieldId = inputFieldJQuery.attr('id');
    // Assurez-vous que le champ a un ID pour éviter les erreurs de ciblage.
    if (!fieldId) {
        Logger.warn("clearErrorInput : Le champ de saisie fourni n'a pas d'attribut 'id'. Impossible d'effacer les erreurs de manière fiable.", inputFieldJQuery);
        return;
    }

    // Vérifiez si le champ a la classe 'is-invalid'. Si non, il n'y a rien à effacer.
    if (!inputFieldJQuery.hasClass('is-invalid')) {
        // Optionnel : Vérifier si le conteneur d'erreurs existe quand même et le supprimer.
        // Cela gère les cas où la classe 'is-invalid' a été retirée manuellement mais le div d'erreur est resté.
        const containerId = `container-div-error-message-${fieldId}`;
        const existingContainer = jQuery(`#${containerId}`);
        if (existingContainer.length > 0) {
            existingContainer.remove();
        }
        return;
    }

    // 1. Supprime la classe 'is-invalid' du champ.
    inputFieldJQuery.removeClass('is-invalid');

    // 2. Cible et supprime le conteneur principal des messages d'erreur.
    // D'après la fonction addErrorMessageFieldDom, le conteneur a un ID spécifique.
    const containerId = `container-div-error-message-${fieldId}`;
    const errorContainer = jQuery(`#${containerId}`);

    if (errorContainer.length > 0) {
        errorContainer.remove(); // Supprime l'élément conteneur et tout son contenu du DOM.
    }
}

type SingleFlag = 'g' | 'i' | 'm' | 'u' | 'y' | 's';

// Exemples de combinaisons courantes que vous voulez supporter
type CommonFlagCombinations = SingleFlag |
    `${'g' | 'i' | 'm' | 'u' | 'y' | 's'}${'g' | 'i' | 'm' | 'u' | 'y' | 's'}` | // Permet des combinaisons de 2 flags
    `${'g' | 'i' | 'm' | 'u' | 'y' | 's'}${'g' | 'i' | 'm' | 'u' | 'y' | 's'}${'g' | 'i' | 'm' | 'u' | 'y' | 's'}`; // Permet des combinaisons de 3 flags

// Vous pouvez continuer cette logique pour 4, 5, 6 flags si nécessaire.
// Ou pour des combinaisons spécifiques comme 'gi', 'iu', etc.
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
    children: HTMLElement | JQuery<HTMLElement>,
    formParentName: string,
    flag: string = 'i'
): RegExp | undefined {
    if (children instanceof HTMLElement) {
        children = jQuery<HTMLElement>(children);
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
        const pattern = children.attr('pattern') ?? children.attr('data-pattern');
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

/**
 * @type 
 */
export type MediaType = "video" | "document" | "image";
export type FormInputType = "fqdn" | "file" | "radio" | "checkbox" | "number" | "text" | "email" | "password" | "url" | "select" | "textarea" | "date" | "tel" | "video" | "document" | "image";
export type HTMLFormChildrenElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function getAttr<T = unknown>(
    element: HTMLElement | null | undefined | JQuery<HTMLElement>,
    name: string,
    defaults: unknown = null,
    toJson = false,
): T {
    if (!element) {
        return defaults as T;
    }
    if (element instanceof HTMLElement) {
        element = jQuery<HTMLElement>(element)
    }
    let value = element.attr(name);
    if (!value) { return defaults as T }

    if (toJson) {
        try {
            value = JSON.parse(value);
        } catch (error) {
            Logger.error('error toJson getAttr:', error)
            return defaults as T;
        }
    }
    return value as T;
}

// Exemple d'une fonction qui pourrait être utilisée
export function stringToRegex(regexString: string | null | undefined, flags: FlagRegExp = 'iu'): RegExp | undefined {
    if (!regexString) {
        return undefined;
    }
    try {
        return new RegExp(regexString, flags);
    } catch (e) {
        Logger.error(`Invalid regex string: ${regexString}`, e);
        throw e; // Ou lancez une erreur si une regex invalide n'est pas acceptable
    }
}