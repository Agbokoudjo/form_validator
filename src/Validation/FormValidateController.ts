/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import {
    HTMLFormChildrenElement,
    Logger,
    addErrorMessageFieldDom,
    clearErrorInput
} from "../_Utils";

import {
    FieldInputController,
    FormChildrenValidateInterface,
    FieldOptionsValidateCacheAdapterInterface,
    OptionsValidate
} from "./Core";


/**
---

# Class: `FormValidateController`

* @Description
* **Contrôleur de Formulaire (Orchestrateur)** et point d'entrée principal pour la gestion d'un formulaire HTML unique.
 * Cette classe est responsable de l'initialisation du formulaire, de la gestion du cycle de vie des champs, 
 * et de l'orchestration des validations pour l'ensemble du formulaire. Elle stocke les instances de l'Adaptateur/Contrôleur DOM 
 * (FieldInputController) pour un accès rapide aux statuts de champ.
 * 
This class manages the validation of form fields inside a given HTML form using jQuery. It supports automatic validator instantiation for different input types (file and non-file inputs), builds validator instances, triggers validations on demand, and organizes form children fields by the type of DOM event that triggers their validation. This structure simplifies event handling and validation control on the frontend.

---

## Constructor

```ts
constructor(formCssSelector: string = ".form-validate")
```

* **`formCssSelector`**: Optional CSS selector suffix to target a specific form on the page. Defaults to `"form"`, meaning it selects all `<form>` elements.
* Throws an error if no form is found for the given selector.

---

## Private Properties

| Name                    | Type                                    | Description                                                                                     |
| ----------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `_idChildrens`          | `string[]`                              | Array containing IDs of all form input/select/textarea elements, excluding certain input types. |
| `_form`                 | `JQuery<HTMLFormElement>`               | The jQuery wrapped form element targeted by the selector.                                       |
| `_formChildrenValidate` | `FormChildrenValidateInterface \| null` | Current validator instance for a specific child field during validation.                        |
| `_excludedTypes`        | `string[]`                              | List of input types excluded from validation (`hidden`, `submit`, `datetime`, etc.).            |

---

## Public Methods

### `autoValidateAllFields(): Promise<void>`

* Validates all fields in the form by building validator instances and invoking their validation asynchronously.
* Logs and throws errors if validation fails.

---

### `validateChildrenForm(target: HTMLFormChildrenElement): Promise<void>`

* Validates a single child field passed as `target`.
* Instantiates the proper validator depending on the field type and media-type attribute (for file inputs).
* Throws and logs validation errors.




### `clearErrorDataChildren(): void`

* Clears validation error data on the current `_formChildrenValidate` instance if any.

---

### `getValidatorInstance(target: HTMLFormChildrenElement): FormChildrenTypeFileValidate | FormChildrenTypeNoFileValidate`

* Instantiates the appropriate validator class depending on the type of `target`:

  * If it is a file input (`<input type="file">`), it checks for a `media-type` attribute (`image`, `video`, `document`) and creates a `FormChildrenTypeFileValidate` with the corresponding validator.
  * For other inputs/selects/textareas, creates a `FormChildrenTypeNoFileValidate` with a generic input validator.
* Throws an `AttributeException` if `media-type` attribute is missing on file inputs.
* Throws an error for unsupported media types.

---

## Form Children Accessors (with Event-Based Grouping)

These getters return **arrays of IDs** of form fields grouped by the event type that should trigger their validation, as declared by custom HTML attributes on each field:

* **Required field attributes for event-based grouping:**

  * `event-validate-blur="blur"`
  * `event-validate-input="input"`
  * `event-validate-change="change"`
  * `event-validate-focus="focus"`
  * `event-validate-dragenter="dragenter"`

This setup allows the system to know exactly which fields need validation on which DOM event, optimizing event listener attachment.

---

### `childrens: JQuery<HTMLFormChildrenElement>`

* Returns all input, select, and textarea elements inside the form, excluding inputs of types listed in `_excludedTypes`.

---

### `idChildrenUsingEventBlur: string[]`

* Returns IDs of children whose attribute `event-validate-blur` is set to `"blur"`.

---

### `idChildrenUsingEventInput: string[]`

* Returns IDs of children whose attribute `event-validate-input` is set to `"input"`.

---

### `idChildrenUsingEventChange: string[]`

* Returns IDs of children whose attribute `event-validate-change` is set to `"change"`.

### `idChildrenUsingEventdragenter: string[]`

* Returns IDs of children whose attribute `event-validate-dragenter` is set to `"dragenter"`.

---

### `idChildrenUsingEventFocus: string[]`

* Returns IDs of children whose attribute `event-validate-focus` is set to `"focus"`.

---

### `idChildrens: string[]`

* Returns the cached array `_idChildrens` of IDs for all input/select/textarea elements inside the form, excluding hidden, submit, datetime, etc.

---

### `form: JQuery<HTMLFormElement>`

* Returns the jQuery wrapped form element.

---

## Required Attributes in the Form and on Fields

| Attribute Name          | Where to Add                           | Purpose / Usage                                                                                 |
| ----------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `id`                    | On every input/select/textarea         | Unique identifier used for mapping validators and event listeners.                              |
| `media-type`            | On `<input type="file">` fields        | Defines the media type for files (`image`, `video`, or `document`) to select correct validator. |
| `event-validate-blur`   | On any field needing blur validation   | Indicates validation on the blur event.                                                         |
| `event-validate-input`  | On any field needing input validation  | Indicates validation on the input event.                                                        |
| `event-validate-change` | On any field needing change validation | Indicates validation on the change event.                                                       |
| `event-validate-focus`  | On any field needing focus validation  | Indicates validation on the focus event.                                                        |
| `event-validate-dragenter`| On any field needing dragenter validation | Indicates validation on the dragenter event for files. 
---

## Summary

This class centralizes the management of form validation by:

* Collecting relevant form children fields excluding certain types.
* Categorizing fields by event attributes to optimize event listener attachment.
* Creating specific validator instances depending on input type and media-type.
* Allowing easy triggering of validation on all fields or individual fields.
* Managing error clearing and error handling uniformly.

---

 */
export class FormValidateController {

    private _idChildrens: string[] = [];

    private readonly _form: HTMLFormElement;

    private readonly _formChildrenValidate: Map<string, FormChildrenValidateInterface>;

    private readonly _excludedTypes = ["hidden", "submit", "datetime", "datetime-local", "time", "month"];

    private _eventGroups: Map<string, string[]> = new Map();

    constructor(
        formCssSelector: string = ".form-validate",
        private readonly optionsValidatorCacheAdapter?: FieldOptionsValidateCacheAdapterInterface) {
        
        const formElement = document.querySelector<HTMLFormElement>(`form${formCssSelector}`);

        if (!formElement) {
            throw new Error(`No form found with selector: form${formCssSelector}`);
        }

        this._form = formElement;
        this._formChildrenValidate = new Map<string, FormChildrenValidateInterface>();

        this.init();
    }

    private readonly init = (): void => {
        // We get all children and filter them immediately
        const allChildren = this.getChildrensArray();

        // 1. Indexing IDs (Replacing .find().filter().map().get())
        this._idChildrens = allChildren
            .map(el => el.id)
            .filter(id => id !== undefined && id !== "");

        // 2. Indexing Events (Replacing .each() and .attr())
        allChildren.forEach(el => {
            ['blur', 'input', 'change', 'dragenter', 'focus'].forEach(evt => {
                if (el.hasAttribute(`data-event-validate-${evt}`)) {
                    const current = this._eventGroups.get(evt) || [];
                    current.push(el.id);
                    this._eventGroups.set(evt, current);
                }
            });
        });
    }

    /**
     * Helper to get children as a real Array instead of a JQuery object.
     */
    private readonly getChildrensArray =(): HTMLFormChildrenElement[] =>{
        const elements = Array.from(this._form.querySelectorAll<HTMLFormChildrenElement>("input, select, textarea"));
        
        return elements.filter(el => {
            if (el instanceof HTMLInputElement) {
                return !this._excludedTypes.includes(el.type);
            }
            return true;
        });
    }

    public autoValidateAllFields = (): Promise<void> => {
        const children = this.getChildrensArray();

        return Promise.all(
            children.map(el =>
                this.validateChildrenForm(el)
                    .catch(error => console.warn(`Validation skipped for ${el.name}:`, error))
            )
        ).then(() => void 0);
    }
    
    public validateChildrenForm = async (target: HTMLFormChildrenElement): Promise<void> => {

        let optionsValidate: OptionsValidate | undefined = undefined;

        try {
            if (this.optionsValidatorCacheAdapter) {
                // Essayer de lire depuis le cache (Cache Hit)
                optionsValidate = await this.optionsValidatorCacheAdapter.getItem(target.name);
            }

            // Creation et Validation
            // Si optionsValidate est 'undefined', FieldInputController calculera automatiquement les options lui meme (Cache Miss).
            const validator = new FieldInputController(target, optionsValidate);
            await validator.validate();
            this._formChildrenValidate.set(target.name, validator);

            //Mise à jour du cache (Cache Write)
            if (this.optionsValidatorCacheAdapter) {
                // Utilisation de  .setItem() sans 'await' pour rendre l'écriture non-bloquante,
                // et .catch() pour ignorer les erreurs de cache silencieusement.
                this.optionsValidatorCacheAdapter.setItem(target.name, validator.fieldOptionsValidate)
                    .catch(error => Logger.warn(`Cache write failed for ${target.name}:`, error));
            }

        } catch (error) {
            Logger.error('Validation failed:', error);
            throw error;
        }
    }

    public addErrorMessageChildrenForm(
        elmtfield: HTMLElement,
        errormessagefield: string[],
        className_container_ErrorMessage?: string): void {
        
        addErrorMessageFieldDom(
            elmtfield,
            errormessagefield,
            className_container_ErrorMessage
        )
    }

    public clearErrorDataChildren(target: HTMLFormChildrenElement): void {

        const validatorClean = this._formChildrenValidate.get(target.name)

        if (!validatorClean) { return; }

        validatorClean.clearErrorField();
        clearErrorInput(target);

        this._formChildrenValidate.delete(target.name);
    }

    /**
    * Replaces the getter 'childrens' to return an Array of native elements.
    */
    public get childrens(): HTMLFormChildrenElement[] {
        return this.getChildrensArray();
    }

    public get idChildrenUsingEventBlur(): string[] {
        return this._eventGroups.get('blur') || [];
    }

    public get idChildrenUsingEventInput(): string[] {
        return this._eventGroups.get('input') || [];
    }

    public get idChildrenUsingEventChange(): string[] {
        return this._eventGroups.get('change') || [];
    }

    public get idChildrenUsingEventDragenter(): string[] {
        return this._eventGroups.get('dragenter') || [];
    }

    public get idChildrenUsingEventFocus(): string[] {
        return this._eventGroups.get('focus') || [];
    }

    /**
     * Returns the list of IDs of children inputs inside the form.
     */
    public get idChildrens(): string[] {
        return this._idChildrens;
    }

    public get form(): HTMLFormElement { return this._form; }

    /**
  * Valide l'intégralité du formulaire.
  * @returns true si TOUS les champs sont valides, false sinon.
  */
    public async isFormValid(): Promise<boolean> {
        const allChildren = this.childrens;

        const results = await Promise.all(
            allChildren.map(async (el) => {
                try {
                   
                    await this.validateChildrenForm(el);
                    const v = this._formChildrenValidate.get(el.name);

                    return v ? v.isValid() : true;
                } catch (e) {
                    Logger.error(`Validation interrupted for field ${el.name}:`, e);
                    return false; 
                }
            })
        );

        return results.every(res => res === true);
    }
}
