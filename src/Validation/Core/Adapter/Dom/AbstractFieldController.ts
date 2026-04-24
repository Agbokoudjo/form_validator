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
    MediaTypeArray,
    escapeHtmlBalise,
    MediaRequiredType
} from "../../../../_Utils";

import { FieldValidatorInterface, OdtValidator } from "../../../Rules";

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

    protected readonly _children: HTMLFormChildrenElement;

    protected readonly _formParent: HTMLFormElement;

    protected _checkBoxContainer: HTMLElement | undefined;

    protected _radiosContainer: HTMLElement | undefined;

    /**
     * @param children The raw HTML input or textarea element to be validated.
     */
    protected constructor(children: HTMLFormChildrenElement) {

        this._children = children;

        const parent = this._children.closest('form');

        if (!parent) {
            throw new Error(`The input field "${children.name || 'unnamed'}" is not inside a <form> element.`);
        }

        this._formParent = parent as HTMLFormElement;

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
        const element = this._children;

        // File management
        if ((this.type === "file" || MediaTypeArray.includes(this.type)) && element instanceof HTMLInputElement) {
            const files = element.files;
            if (!this.isMultiple) return files && files.length > 0 ? files[0] : null;
            return files;
        }

        // Checkbox management (returns count of checked items with same name)
        if (this.type === "checkbox") {
            const selector = `input[type="checkbox"][name="${this.name}"]`;
            const checkboxes = this._formParent.querySelectorAll<HTMLInputElement>(selector);
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            return checkedCount;
        }

        // Radio management
        if (this.type === "radio") {
            const selector = `input[type="radio"][name="${this.name}"]`;
            const radios = this._formParent.querySelectorAll<HTMLInputElement>(selector);
            const selected = Array.from(radios).find(r => r.checked);
            return selected ? selected.value : undefined;
        }

        // Default Input / Textarea / Select
        return (element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    }

    /**
     * Returns a specific attribute from the form field.
     * @param attributeName The name of the attribute to retrieve.
     */
    protected getAttrChildren(attributeName: string): string | undefined {
        return this._children.getAttribute(attributeName) ?? undefined;
    }


    /**
     * Returns a specific attribute from the parent form.
     * @param {string} attributeName The name of the attribute to retrieve.
     * @returns {string} The value of the requested attribute.
     * @throws {Error} If the attribute is missing on the parent form element.
     */
    protected getAttrFormParent(attributeName: string): string {

        const attributeValue = this._formParent.getAttribute(attributeName);

        if (attributeValue === undefined || attributeValue === null) {
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
    /**
     * Directly returns the element (no more .get(0))
     */
    protected get htmlElementChildren(): HTMLFormChildrenElement {
        return this._children;
    }

    protected get htmlElementFormParent(): HTMLFormElement {
        return this._formParent;
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
     */
    public clearErrorField(): void {
        const validator = this.errorStoreAccessor;

        if (validator) {
            validator.formErrorStore.clearFieldState(this.name);

            return;
        }
        console.warn(`the validator instance of ${this.name} no exist in container `);
    }

    /**
     * Checks if the field is valid. 
     * Defaults to true if no validator is present for this field.
     */
    public isValid(): boolean {
        const validator = this.errorStoreAccessor;

        if (validator) {
            return validator.formErrorStore.isFieldValid(this.name);
        }

        console.warn(`[FormValidator] No validator instance for ${this.name}. Field is considered valid by default.`);

        return true;
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

    protected get matchRegex(): boolean | undefined {

        const match=this.getAttrChildren('data-match-regex')
            ?? this.getAttrChildren('data-match')
            ?? this.getAttrChildren('match')
            ;
        return toBoolean(match ?? "true");
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

    protected get dataHostWhitelist(): (string | RegExp)[] | undefined{
        return this.getAttrChildren('data-host-whitelist')
            ?.split(',')
            .map(v => v.trim())
            .filter(Boolean) ?? []
            ;
    }

    protected get dataHostBlacklist(): (string | RegExp)[] | undefined {
        return this.getAttrChildren('data-host-blacklist')
            ?.split(',')
            .map(v => v.trim())
            .filter(Boolean) ?? []
            ;
    }

    /**
     * Core utility to parse a raw string into a sanitized string array.
     * Handles both JSON arrays and comma-separated strings.
     */
    protected parseRawToStringArray(rawValue: string | null | undefined): string[] {
        if (!rawValue || typeof rawValue !== 'string') {
            return [];
        }

        let items: any[] = [];
        const trimmedValue = rawValue.trim();

        // Detect and parse format
        if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmedValue);
                items = Array.isArray(parsed) ? parsed : [trimmedValue];
            } catch {
                items = rawValue.split(',');
            }
        } else {
            items = rawValue.split(',');
        }

        //  Deep sanitation
        return items
            .map(item => {
                // Convert to string, escape HTML, trim, and collapse multiple spaces
                const sanitized = String(escapeHtmlBalise(item)).trim();
                // Assuming escapeHtmlBalise is available in your context
                return sanitized.replace(/\s+/g, ' ');
            })
            .filter(item => item.length > 0);
    }
}

/**
 * Class: DocumentTypeResolver
 * A static utility class to detect and cache document types.
 * Now supports single and multiple file uploads.
 */
export class DocumentTypeResolver {

    private static documentTypeCache: Map<string, MediaRequiredType[]> = new Map();

    private constructor() { }

    /**
     * Detects document types for one or more files.
     * * @param files A single File or a FileList/Array of files.
     * @param targetName The name attribute of the input field.
     * @returns {MediaRequiredType[]} An array of detected types.
     */
    public static detect(files: File | File[] | FileList, targetName: string): MediaRequiredType[] {
        // Consistency check: Convert everything to an array
        const fileArray = files instanceof File
            ? [files]
            : Array.from(files);

        // Return from cache if already detected
        if (this.documentTypeCache.has(targetName)) {
            return this.documentTypeCache.get(targetName)!;
        }

        const detectedTypes: MediaRequiredType[] = fileArray.map(file => {
            const extension = file.name.split('.').pop()?.toLowerCase() || '';

            if (OdtValidator.LIBREOFFICE_EXTENSIONS.includes(extension)) return "odf";
            if (['docx', 'doc', 'dotx'].includes(extension)) return "word";
            if (extension === 'pdf') return "pdf";
            if (extension === 'csv') return "csv";
            if (['xls', 'xlsx', 'xlsm'].includes(extension)) return "excel";

            return "pdf";
        });

        // Save result
        this.documentTypeCache.set(targetName, detectedTypes);

        return detectedTypes;
    }

    /**
     * Helper to get the primary type (useful for choosing a single validator).
     */
    public static resolvePrimaryType(files: File | File[] | FileList, targetName: string): MediaRequiredType {
        const types = this.detect(files, targetName);
        return types.length > 0 ? types[0] : "pdf";
    }

    public static clearCache(targetName?: string): void {
        if (targetName) {
            this.documentTypeCache.delete(targetName);
        } else {
            this.documentTypeCache.clear();
        }
    }
}