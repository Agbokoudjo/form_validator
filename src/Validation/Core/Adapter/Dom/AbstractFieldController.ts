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

import {
    FieldValidationEventDataInterface,
    FieldValidationEventData
} from "../FieldValidationEvent";

import {
    AttributeException,
    HTMLFormChildrenElement,
    toBoolean,
    FormInputType,
    DataInput,
    getInputPatternRegex,
    FormAttributeNoFoundException,
    MediaType,
    MediaTypeArray
} from "../../../../_Utils";

import { FieldValidatorInterface } from "../../../Rules";

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
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
*   @package <https://github.com/Agbokoudjo/form_validator>
 */
export abstract class AbstractFieldController {

    protected readonly _children: JQuery<HTMLFormChildrenElement>;

    protected readonly _formParent: JQuery<HTMLFormElement>;

    protected _checkBoxContainer: JQuery<HTMLElement> | undefined;

    protected _radiosContainer: JQuery<HTMLElement> | undefined;

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

        this._radiosContainer = undefined;
    }

    public abstract validate(): Promise<void>;

    /**
    * Returns the `id` attribute of the input element.
    * If the input is a checkbox, returns the `name` instead.
    * @throws AttributeException if the id is missing.
    */
    protected get id(): string {

        if (this.type === "checkbox") { return this.name; }

        const id = this.getAttrChildren('id');

        if (id) return id;

        throw new AttributeException('id', this.name, this.getAttrFormParent('name') ?? '[unknown form]');
    }

    /**
     * Returns the `name` attribute of the input element.
     * @throws AttributeException if the name is missing.
     */
    protected get name(): string {

        const name = this.getAttrChildren('name');

        if (!name) {

            throw new AttributeException('name', this.htmlElementChildren.tagName.toLowerCase(), this.getAttrFormParent('name') ?? '[unknown form]');
        }

        return name;
    }

    /**
     * Returns the `type` attribute of the input element (e.g., text, checkbox, file).
     * Falls back to the tag name (e.g., textarea) if the type is not present.
     */
    protected get type(): FormInputType | MediaType {

        let type = this.getAttrChildren('data-type') ?? this.getAttrChildren('type');

        if (!type) {

            type = this.htmlElementChildren.tagName.toLowerCase(); //for field as textarea
        }

        if (type === "file") {

            type = this.getAttrChildren('data-media-type');
            if (!type) {

                throw new AttributeException('data-media-type', this.name, this.getAttrFormParent('name') ?? 'form');
            }
        }

        return type as FormInputType | MediaType;
    }

    /**
    * Returns the current value of the input based on its type.
    * Supports checkboxes, radio buttons, file inputs, and standard inputs.
    */
    protected get value(): DataInput {

        if ((this.type === "file" || MediaTypeArray.includes(this.type)) && this.htmlElementChildren instanceof HTMLInputElement) {

            const files = this.htmlElementChildren.files

            if (!this.isMultiple) { return files ? files[0] : null; }

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
     * @returns {string} The value of the requested attribute.
     * @throws {Error} If the attribute is missing on the parent form element.
     */
    protected getAttrFormParent(attributeName: string): string {

        const attributeValue = this._formParent.attr(attributeName);

        if (attributeValue === undefined || attributeValue === null) {

            // on Lance l'exception en utilisant la représentation HTML complète.
            throw new FormAttributeNoFoundException(
                this.htmlElementFormParent,
                attributeName,
                this.name);
        }

        return attributeValue;
    }

    /**
     * Returns the raw HTML element wrapped by jQuery.
     */
    protected get htmlElementChildren(): HTMLFormChildrenElement {

        return this._children.get(0)!;
    }

    protected get htmlElementFormParent(): HTMLFormElement {

        return this._formParent.get(0)!
    }

    /**
     * Dispatches a custom event from the form element for validation status.
     * @param event_type The custom event type to dispatch.
     * @param data_event The payload data associated with the validation event.
     */
    protected emitEvent(
        event_type: FormChildrenValidateEvent,
        data_event: FieldValidationEventDataInterface
    ): void {

        this.htmlElementFormParent.dispatchEvent(new CustomEvent(event_type, {
            bubbles: false,
            cancelable: true,
            detail: new FieldValidationEventData(data_event)
        }))

    }

    /**
     * Must be implemented by subclasses to return the specific form error handler for this field.
     */
    protected abstract get errorStoreAccessor(): FieldValidatorInterface | undefined;

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
     * Clears the validation error for this field using the form error handler, 
     * seulement si le validateur existe.
     */
    public clearErrorField(): void {
        const validator = this.errorStoreAccessor;

        if (validator) {
            validator.formErrorStore.clearFieldState(this.name);

            return;
        }

        console.warn(`the validator instance of ${this.name} no exist in container `);
    }

    public isValid(): boolean {

        const validator = this.errorStoreAccessor;

        if (validator) {
            return validator.formErrorStore.isFieldValid(this.name);
        }

        console.warn(`the validator instance of ${this.name} no exist in container `);

        return true; //on renvoie true simplement lorsque lorsque l'instance de validator n'exist pas
    }

    /**
    * Emits a validation event based on the current validation state.
    * Sends either a success or failure event with full context.
    */
    protected emitEventHandler(): void {

        const validatorField = this.errorStoreAccessor;
        if (!validatorField) {
            return;
        }

        const { errors, isValid } = validatorField.getState(this.name);

        if (!isValid) {

            this.emitEvent(FieldValidationFailed, {
                id: this.id,
                name: this.name,
                value: this.value,
                formParentName: this.getAttrFormParent('name'),
                message: errors,
                target: this.htmlElementChildren
            })

            return;
        }

        this.emitEvent(FieldValidationSuccess, {
            id: this.id,
            name: this.name,
            value: this.value,
            formParentName: this.getAttrFormParent('name'),
            target: this.htmlElementChildren
        })

        this.clearErrorField(); //clear message field then success 
    }

    protected isRequiredField(): boolean {

        const attrValue = this.getAttrChildren('required') ?? this.getAttrChildren('data-required');

        return attrValue !== undefined && attrValue !== null;
    }

    protected isMultipleFieldTypeFile(): boolean {

        const attrValue = this.getAttrChildren('multiple') ?? this.getAttrChildren('data-multiple');

        return attrValue !== undefined && attrValue !== null;
    }

    protected get isMultiple(): boolean {

        return this.isMultipleFieldTypeFile() !== false;
    }

    protected get required(): boolean {

        return this.isRequiredField() !== false;
    }

    protected isDisabledField(): boolean {

        const attrValue = this.getAttrChildren('disabled');

        return attrValue !== undefined && attrValue !== null;
    }

    protected get attrMaxLength(): string | undefined {

        return this.getAttrChildren('maxLength')
            ?? this.getAttrChildren('max-length')
            ?? this.getAttrChildren('data-max-length')
            ?? this.getAttrChildren('data-maxLength')
            ;
    }

    protected getMaxLength(defaultValue: number | undefined | null = 255): number | undefined {

        if (defaultValue) {

            return parseInt(this.attrMaxLength ?? defaultValue.toString(), 10)
        }

        return undefined;
    }

    protected get attrMinLength(): string | undefined {

        return this.getAttrChildren('minLength')
            ?? this.getAttrChildren('min-length')
            ?? this.getAttrChildren('data-min-length')
            ?? this.getAttrChildren('data-minLength')
            ;
    }

    protected getMinLength(defaultValue: number = 1): number | undefined {

        return parseInt(this.attrMinLength ?? defaultValue.toString(), 10)
    }

    protected parseBooleanAttr(attrName: string, defaultValue: boolean = true): boolean {

        return toBoolean(this.getAttrChildren(attrName) ?? defaultValue.toString());
    }

    protected parseIntAttr(attrName: string, defaultValue: number = 1, radix: number | undefined = 10): number {

        return parseInt(this.getAttrChildren(attrName) ?? defaultValue.toString(), radix);
    }

    protected parseFloatAttr(attrName: string, defaultValue: number = 1): number {

        return parseFloat(this.getAttrChildren(attrName) ?? defaultValue.toString());
    }

    protected get flagRegExp(): string {

        return this.getAttrChildren('data-flag-pattern') ?? 'iu';
    }

    protected get patternRegExp(): RegExp | undefined {

        return getInputPatternRegex(this._children, this.getAttrFormParent('name'), this.flagRegExp);
    }

    protected get escapestripHtmlAndPhpTags(): boolean {

        return toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags') ?? 'true');
    }

    protected get errorMessage(): string | undefined {

        return this.getAttrChildren('data-error-message-input');
    }

    protected get egAwait(): string | undefined {

        return this.getAttrChildren('data-eg-await');
    }

    protected get minDate(): Date | undefined {

        const min_date = this.getAttrChildren('data-min-date')
            ?? this.getAttrChildren('min')
            ?? this.getAttrChildren('data-min');

        return min_date ? new Date(min_date) : undefined;
    }

    protected get maxDate(): Date | undefined {

        const max_date = this.getAttrChildren('data-max-date')
            ?? this.getAttrChildren('data-max')
            ?? this.getAttrChildren('max')
            ;

        return max_date ? new Date(max_date) : undefined;
    }

    protected get delimiters(): string[] {

        const delimiters = this.getAttrChildren('data-delimiters');

        return delimiters ? delimiters.split(',') : ['/', '-'];
    }
}
