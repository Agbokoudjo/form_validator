import { HTMLFormChildrenElement, MediaType, ValidatorRegistry } from ".";
import { AttributeException, Logger } from "../..";
import { FormChildrenTypeFileValidate, FormChildrenTypeNoFileValidate, FormChildrenValidateInterface } from "./Children";

/**
---

# Class: `FormValidate`

**Description:**
This class manages the validation of form fields inside a given HTML form using jQuery. It supports automatic validator instantiation for different input types (file and non-file inputs), builds validator instances, triggers validations on demand, and organizes form children fields by the type of DOM event that triggers their validation. This structure simplifies event handling and validation control on the frontend.

---

## Constructor

```ts
constructor(formCssSelector: string = "form")
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

---

### `buildValidators(): FormChildrenValidateInterface[]`

* Builds and returns an array of validator instances for every child element in the form (input, select, textarea).
* Uses `getValidatorInstance()` internally.

---

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
export class FormValidate {
    private _idChildrens: string[];
    private _form: JQuery<HTMLFormElement>;
    private _formChildrenValidate: FormChildrenValidateInterface | null = null;
    private readonly _excludedTypes = ["hidden", "submit", "datetime", "datetime-local", "time", "month"];
    constructor(formCssSelector: string = "form") {
        this._form = jQuery<HTMLFormElement>(`form${formCssSelector}`);

        if (this._form.length === 0) {
            throw new Error(`No form found with selector: form${formCssSelector}`);
        }

        this._idChildrens = this._form
            .find("input, select, textarea")
            .filter((_index, el) => {
                if (el instanceof HTMLInputElement) {
                    const type = el.type;
                    return !this._excludedTypes.includes(type);
                }
                return true;
            })
            .map((_i, el) => el.id)
            .get()
            .filter((id) => id !== undefined && id !== "");
    }
    public autoValidateAllFields = async (): Promise<void> => {
        try {
            const validators = this.buildValidators();
            for (const validator of validators) {
                await validator.validate();
            }
        } catch (error) {
            Logger.error('Validation failed All Fields:', error);
            throw error;
        }
    }
    public validateChildrenForm = async (target: HTMLFormChildrenElement): Promise<void> => {
        try {
            this._formChildrenValidate = this.getValidatorInstance(target);
            await this._formChildrenValidate.validate();
        } catch (error) {
            Logger.error('Validation failed:', error);
            throw error;
        }
    }

    public buildValidators(): FormChildrenValidateInterface[] {
        const validators: FormChildrenValidateInterface[] = [];
        this.childrens.each((_i, el) => {
            validators.push(this.getValidatorInstance(el as HTMLFormChildrenElement))
        });
        return validators;
    }

    public clearErrorDataChildren(): void { this._formChildrenValidate?.clearErrorField(); }
    private getValidatorInstance(target: HTMLFormChildrenElement): FormChildrenTypeFileValidate | FormChildrenTypeNoFileValidate {
        if (target instanceof HTMLInputElement && target.type === "file") {
            const mediaType = jQuery(target).attr('data-media-type') as MediaType | undefined;
            if (!mediaType) {
                throw new AttributeException('data-media-type', target.name, this._form.attr('name') ?? 'form');
            }
            switch (mediaType) {
                case "video":
                    return new FormChildrenTypeFileValidate(target, ValidatorRegistry.getInstanceVideoValidator());
                case "image":
                    return new FormChildrenTypeFileValidate(target, ValidatorRegistry.getInstanceImageValidator());
                case "document":
                    return new FormChildrenTypeFileValidate(target, ValidatorRegistry.getInstanceDocumentValidator());
                default:
                    throw new Error(`Unsupported media-type '${mediaType}' for input field '${target.name}' in form '${this._form.attr('name') ?? 'form'}'.`);
            }
        }
        return new FormChildrenTypeNoFileValidate(
            target,
            ValidatorRegistry.getInstanceFormInputValidator()
        )
    }
    /**
     * Returns the list of all input/select/textarea elements inside the form.
     */
    public get childrens(): JQuery<HTMLFormChildrenElement> {
        const childrens = this._form.find("input, select, textarea") as JQuery<HTMLFormChildrenElement>;
        return childrens.filter((_index, elmt_children) => {
            if (elmt_children instanceof HTMLInputElement) {
                return !this._excludedTypes.includes(elmt_children.type);
            }
            return true;
        });
    }
    public get idChildrenUsingEventBlur(): string[] {
        return this.childrens.filter((_index, children) => {
            if (children instanceof HTMLInputElement || children instanceof HTMLTextAreaElement) {
                return jQuery(children).attr('data-event-validate-blur') === "blur";
            }
            return false;
        })
            .get()
            .map((el, _i) => el.id)
    }
    public get idChildrenUsingEventInput(): string[] {
        return this.childrens.filter((_index, children) => {
            if (children instanceof HTMLInputElement || children instanceof HTMLTextAreaElement) {
                return jQuery(children).attr('data-event-validate-input') === "input";
            }
            return false;
        })
            .get()
            .map((el, _i) => el.id)
    }
    public get idChildrenUsingEventChange(): string[] {
        return this.childrens.filter((_index, children) => {
            return jQuery(children).attr('data-event-validate-change') === "change";
        })
            .get()
            .map((el, _i) => el.id)
    }
    public get idChildrenUsingEventFocus(): string[] {
        return this.childrens.filter((_index, children) => {
            return jQuery(children).attr('data-event-validate-focus') === "focus";
        })
            .get()
            .map((el, _i) => el.id)
    }
    /**
     * Returns the list of IDs of children inputs inside the form.
     */
    public get idChildrens(): string[] {
        return this._idChildrens;
    }
    public get form(): JQuery<HTMLFormElement> { return this._form; }
}
