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
    FieldValidationEventData
} from "./FieldValidationEvent";

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
    MediaRequiredType,
    getAttr
} from "../../../_Utils";

import { OdtValidator } from "../../Rules";
import {
    FieldValidationEventDataInterface,
    FieldValidationFailed,
    FieldValidationSuccess,
    FormChildrenValidateEvent,
    EventValidate
} from "../../types";

import type { FieldValidatorInterface } from "../../Contracts";

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
     * Must be implemented by subclasses to return the specific form error handler for this field.
     */
    protected errorStoreAccessor: FieldValidatorInterface | undefined;

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

        if (this.type === "checkbox") {
            const checkboxes = this._formParent.querySelectorAll<HTMLInputElement>(
                `input[type="checkbox"][name="${this.name}"]`
            );
            const checkedValues = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            // Retourne le tableau des valeurs cochées, cohérent avec OptionsCheckbox.dataChoices
            return checkedValues.length > 0 ? checkedValues : [];
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
        return getAttr(this._children, attributeName) || undefined;
    }


    /**
     * Returns a specific attribute from the parent form.
     * @param {string} attributeName The name of the attribute to retrieve.
     * @returns {string} The value of the requested attribute.
     * @throws {Error} If the attribute is missing on the parent form element.
     */
    protected getAttrFormParent(attributeName: string): string {

        const attributeValue = getAttr<string | null>(this._formParent, attributeName);

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
            bubbles: true,
            cancelable: true,
            detail: new FieldValidationEventData(data_event)
        }))

    }

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

    protected getErrorsMessageForDocumentFile(key_name: string): string[] {
        const validator = this.errorStoreAccessor;

        return validator ? validator.formErrorStore.getFieldErrors(key_name) : [];
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

        const match = this.getAttrChildren('data-match-regex')
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

    protected get dataHostWhitelist(): (string | RegExp)[] | undefined {
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
     * Détecte le type réel de chaque fichier en lisant ses magic bytes.
     * Asynchrone car nécessite une lecture partielle du fichier.
     */
    public static async detect(
        files: File | File[] | FileList,
        targetName: string
    ): Promise<MediaRequiredType[]> {

        const fileArray = files instanceof File ? [files] : Array.from(files);

        const detectedTypes = await Promise.all(
            fileArray.map(file => this.detectSingleFile(file))
        );

        this.documentTypeCache.set(targetName, detectedTypes);
        return detectedTypes;
    }

    /**
     * Détecte le type réel d'un fichier unique via ses magic bytes.
     * L'extension n'est utilisée que pour affiner les formats ZIP/OLE2 ambigus.
     */
    private static async detectSingleFile(file: File): Promise<MediaRequiredType> {
        // Lire les 8 premiers octets — suffisant pour toutes les signatures connues
        const header = await this.readFileHeader(file, 8);
        if (!header) {
            // Lecture impossible → fallback extension
            return this.fallbackByExtension(file.name);
        }

        // PDF : %PDF = 25 50 44 46
        if (header[0] === 0x25 && header[1] === 0x50 &&
            header[2] === 0x44 && header[3] === 0x46) {
            return 'pdf';
        }

        // RTF : {\rtf = 7B 5C 72 74 66
        if (header[0] === 0x7B && header[1] === 0x5C &&
            header[2] === 0x72 && header[3] === 0x74) {
            return 'odf';
        }

        // OLE2 : D0 CF 11 E0 — .xls ou .doc selon l'extension
        if (header[0] === 0xD0 && header[1] === 0xCF &&
            header[2] === 0x11 && header[3] === 0xE0) {
            return this.refineOle2ByExtension(file.name);
        }

        // ZIP : PK 03 04 — .xlsx, .docx, .odt, .ods, .odp…
        // Nécessite une inspection interne pour distinguer les formats
        if (header[0] === 0x50 && header[1] === 0x4B &&
            header[2] === 0x03 && header[3] === 0x04) {
            return await this.refineZipFormat(file);
        }

        // Aucune signature reconnue → fichier invalide ou format inconnu
        // On retourne 'pdf' comme type par défaut pour que le validator PDF
        // rejette proprement le fichier avec un message d'erreur clair
        return this.fallbackByExtension(file.name);
    }

    /**
     * Pour les fichiers OLE2 (D0 CF 11 E0), affine le type par l'extension.
     * OLE2 est utilisé par .xls, .doc, .ppt — tous ont la même signature binaire.
     */
    private static refineOle2ByExtension(fileName: string): MediaRequiredType {
        const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
        if (['xls', 'xlsm'].includes(ext)) return 'excel';
        if (['doc', 'dot'].includes(ext)) return 'word';
        // Fallback : on retourne 'word' pour que le validator rejette proprement
        return 'word';
    }

    /**
     * Pour les fichiers ZIP (PK 03 04), inspecte l'entrée interne pour
     * distinguer .xlsx, .docx, .odt, .ods, .odp, etc.
     * 
     * On lit la liste des entrées ZIP sans décompresser le contenu — 
     * c'est rapide même pour des fichiers volumineux.
     */
    private static async refineZipFormat(file: File): Promise<MediaRequiredType> {
        try {
            // Import dynamique pour éviter de charger JSZip si inutile
            const JSZip = (await import('jszip')).default;
            const arrayBuffer = await file.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);

            const entryNames = Object.keys(zip.files);

            // ODF : contient toujours une entrée "mimetype" non compressée
            if (entryNames.includes('mimetype')) {
                const mimeContent = await zip.file('mimetype')!.async('string');
                return this.odfMimeToType(mimeContent.trim());
            }

            // OOXML Word : contient word/document.xml
            if (entryNames.some(n => n.startsWith('word/'))) {
                return 'word';
            }

            // OOXML Excel : contient xl/workbook.xml
            if (entryNames.some(n => n.startsWith('xl/'))) {
                return 'excel';
            }

            // OOXML PowerPoint : contient ppt/
            // Non géré par tes validators actuels → fallback extension
            if (entryNames.some(n => n.startsWith('ppt/'))) {
                return this.fallbackByExtension(file.name);
            }

            // ZIP générique non reconnu → fallback extension
            return this.fallbackByExtension(file.name);

        } catch {
            // JSZip ne peut pas ouvrir le fichier → fallback extension
            return this.fallbackByExtension(file.name);
        }
    }

    /**
     * Convertit un MIME type ODF interne en MediaRequiredType.
     */
    private static odfMimeToType(mimeType: string): MediaRequiredType {
        if (mimeType.includes('spreadsheet')) return 'odf'; // .ods
        if (mimeType.includes('presentation')) return 'odf'; // .odp
        if (mimeType.includes('graphics')) return 'odf';    // .odg
        if (mimeType.includes('text')) return 'odf';        // .odt
        return 'odf'; // autres formats ODF
    }

    /**
     * Fallback par extension — utilisé uniquement quand les magic bytes
     * sont absents ou insuffisants (ex: CSV, texte pur).
     * 
     * Pour les fichiers avec une signature non reconnue, retourne un type
     * qui fera rejeter le fichier avec un message d'erreur explicite.
     */
    private static fallbackByExtension(fileName: string): MediaRequiredType {
        const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

        if (OdtValidator.LIBREOFFICE_EXTENSIONS.includes(ext)) return 'odf';
        if (['docx', 'doc', 'dotx'].includes(ext)) return 'word';
        if (ext === 'pdf') return 'pdf';
        if (ext === 'csv') return 'csv'; // CSV n'a pas de magic bytes
        if (['xls', 'xlsx', 'xlsm'].includes(ext)) return 'excel';

        // Extension inconnue → 'pdf' pour forcer un rejet propre
        return 'pdf';
    }

    /**
     * Lit les N premiers octets d'un fichier sans le charger entièrement.
     * Utilise File.slice() pour ne lire que ce qui est nécessaire.
     */
    private static async readFileHeader(
        file: File,
        byteCount: number
    ): Promise<Uint8Array | null> {
        try {
            const slice = file.slice(0, byteCount);
            const buffer = await slice.arrayBuffer();
            return new Uint8Array(buffer);
        } catch {
            return null;
        }
    }

    public static clearCache(targetName?: string): void {
        if (targetName) {
            this.documentTypeCache.delete(targetName);
        } else {
            this.documentTypeCache.clear();
        }
    }
}