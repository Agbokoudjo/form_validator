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
import { AttributeException, HTMLFormChildrenElement, toBoolean, FormInputType } from "../_Utils";
import { FormErrorInterface } from "../Validators";
/**
 * @event Validate
 * Custom event names for field validation result.
 */
export const FieldValidationFailed = 'field:validation:failed';
export const FieldValidationSuccess = 'field:validation:success';
export type FormChildrenValidateEvent =
    | typeof FieldValidationFailed
    | typeof FieldValidationSuccess;
export type EventValidate = 'change' | 'blur' | 'input' | 'focus';

/**
 * Interface representing the data passed with a validation event.
 */
export interface DataFieldValidation {
    /** The ID attribute of the validated field. */
    id: string;

    /** The name attribute of the validated field. */
    name: string;

    /** Optional error message(s) describing the validation issue(s). */
    message?: string[];

    /** The current value of the validated field. */
    value: string | string[] | number | undefined | File | FileList;

    /** The name of the form or parent container. */
    formParentName: string;
    target: HTMLFormChildrenElement;
}

/**
 * Class to encapsulate and provide read-only access to validation data.
 * This class is typically used in custom validation event payloads.
 */
export class FieldValidationEventData {
    constructor(protected readonly data: DataFieldValidation) { }

    /** The ID of the validated field. */
    public get id(): string { return this.data.id; }

    /** The name of the validated field. */
    public get name(): string { return this.data.name; }

    /** The validation message(s), if any. */
    public get message(): string[] | undefined { return this.data.message; }

    /** The current value of the field at the time of validation. */
    public get value() { return this.data.value; }

    /** The name of the parent form or container. */
    public get formParentName(): string { return this.data.formParentName; }
    public get targetChildrenForm() { return this.data.target; }
}

export abstract class AbstractFormChildrenValidate {
    protected readonly _children: JQuery<HTMLFormChildrenElement>;
    protected readonly _formParent: JQuery<HTMLFormElement>;
    protected _checkBoxContainer: JQuery<HTMLElement> | undefined;
    /**
     * @param children The raw HTML input or textarea element to be validated.
     */
    protected constructor(children: HTMLFormChildrenElement) {
        this._children = jQuery<HTMLFormChildrenElement>(children);
        this._formParent = this._children.closest('form');
        // Optionally, you can check if the element is inside a <form>
        if (this._formParent.length === 0) {
            throw new Error(`The input field "${children.name}" is not inside a <form> element.`);
        }
        this._checkBoxContainer = undefined;
    }
    public abstract validate: () => Promise<void>;
    /**
    * Returns the `id` attribute of the input element.
    * If the input is a checkbox, returns the `name` instead.
    * @throws AttributeException if the id is missing.
    */
    public get id(): string {
        if (this.type === "checkbox") { return this.name; }
        const id = this.getAttrChildren('id');
        if (id) return id;

        throw new AttributeException('id', this.name, this.getAttrFormParent('name') ?? '[unknown form]');
    }

    /**
     * Returns the `name` attribute of the input element.
     * @throws AttributeException if the name is missing.
     */
    public get name(): string {
        const name = this.getAttrChildren('name');
        if (!name) {
            throw new AttributeException('name', this.getHtmlChildrenObject.tagName.toLowerCase(), this.getAttrFormParent('name') ?? '[unknown form]');
        }
        return name;
    }

    /**
     * Returns the `type` attribute of the input element (e.g., text, checkbox, file).
     * Falls back to the tag name (e.g., textarea) if the type is not present.
     */
    public get type(): FormInputType {
        let type = this.getAttrChildren('data-type') ?? this.getAttrChildren('type');
        if (!type) {
            type = this.getHtmlChildrenObject.tagName.toLowerCase();
        }
        if (type === "file") {
            type = this.getAttrChildren('data-media-type');
            if (!type) {
                throw new AttributeException('data-media-type', this.name, this.getAttrFormParent('name') ?? 'form');
            }
        }
        return type as FormInputType;
    }
    /**
    * Returns the current value of the input based on its type.
    * Supports checkboxes, radio buttons, file inputs, and standard inputs.
    */
    public get _value(): string | string[] | number | undefined | FileList | File | null {
        if (this.type === "file" && this.getHtmlChildrenObject instanceof HTMLInputElement) {
            const files = this.getHtmlChildrenObject.files
            if (!toBoolean(this.getAttrChildren('multiple'))) { return files ? files[0] : null; }
            return files
        }
        if (this.type === "checkbox") {
            const checkboxes = this._formParent.find<HTMLInputElement>(`input[type="checkbox"][name="${this.name}"]`);
            const checkedCheckboxes = Array.from(checkboxes).filter(checkbox_elt => checkbox_elt.checked);
            return checkedCheckboxes.length;
        }
        if (this.type === "radio") {
            const radios = this._formParent.find<HTMLInputElement>(`input[type="radio"][name="${this.name}"]`);
            const selected = Array.from(radios).find(radio => radio.checked);
            return selected ? selected.value : undefined;
        }
        return this._children.val();
    }

    /**
     * Returns a specific attribute from the form field.
     * @param attributeName The name of the attribute to retrieve.
     */
    protected getAttrChildren(attributeName: string): string | undefined {
        return this._children.attr(attributeName);
    }

    /**
     * Returns a specific attribute from the parent form.
     * @param attributeName The name of the attribute to retrieve.
     */
    protected getAttrFormParent(attributeName: string): string | undefined {
        return this._formParent.attr(attributeName);
    }

    /**
     * Returns the raw HTML element wrapped by jQuery.
     */
    protected get getHtmlChildrenObject(): HTMLFormChildrenElement {
        return this._children.get(0)!;
    }

    /**
     * Dispatches a custom event from the form element for validation status.
     * @param event_type The custom event type to dispatch.
     * @param data_event The payload data associated with the validation event.
     */
    protected emitEvent(
        event_type: FormChildrenValidateEvent,
        data_event: DataFieldValidation
    ): void {
        this._formParent.get(0)!.dispatchEvent(new CustomEvent(event_type, {
            bubbles: false,
            cancelable: true,
            detail: new FieldValidationEventData(data_event)
        }))
        return;
    }
    /**
     * Must be implemented by subclasses to return the specific form error handler for this field.
     */
    protected abstract getFormError(): FormErrorInterface;

    /**
     * Converts a string value to a valid event type for triggering validation.
     * Defaults to "blur" if the provided value is not supported.
     * @param value_event The value to convert (e.g., from `event-validate` attribute).
     */
    protected toConvertTypeEvent(value_event: string): EventValidate {
        if (['focus', 'blur', 'change', 'input'].includes(value_event)) {
            return value_event as EventValidate;
        }
        return 'blur';
    }
    /**
    * Returns the configured event name to trigger validation.
    * Defaults to "blur" if no `event-validate` attribute is found.
    */
    public eventValidate(): EventValidate {
        return this.toConvertTypeEvent(this.getAttrChildren('data-event-validate') ?? 'blur');
    }

    /**
     * Returns the configured event name to clear validation errors.
     * Defaults to "input" if no `event-clear-error` attribute is found.
     */
    public eventClearError(): EventValidate {
        return this.toConvertTypeEvent(this.getAttrChildren('data-event-clear-error') ?? 'input');
    }

    /**
     * Clears the validation error for this field using the form error handler.
     */
    public clearErrorField(): void {
        this.getFormError().clearError(this.name);
    }

    /**
    * Emits a validation event based on the current validation state.
    * Sends either a success or failure event with full context.
    */
    protected emitEventHandler(): void {
        const { errorMessage, validatorStatus } = this.getFormError().getValidatorStatus(this.name);
        if (!validatorStatus) {
            this.emitEvent(FieldValidationFailed, {
                id: this.id,
                name: this.name,
                value: this._value as string | string[] | number | undefined | FileList | File,
                formParentName: this.getAttrFormParent('name') as string,
                message: errorMessage,
                target: this.getHtmlChildrenObject
            })
            return;
        }
        this.emitEvent(FieldValidationSuccess, {
            id: this.id,
            name: this.name,
            value: this._value as string | string[] | number | undefined | FileList | File,
            formParentName: this.getAttrFormParent('name') as string,
            target: this.getHtmlChildrenObject
        })
    }
}
