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
import { OptionsInputField, PassworkRuleOptions, NumberOptions, DateOptions, URLOptions, SelectOptions, FormErrorInterface, FormInputValidator, FormInputType, OptionsValidate, OptionsValidateNoTypeFile, OptionsValidateTypeFile, FormError, OptionsCheckbox, OptionsRadio } from "../..";
import { OptionsFile, OptionsImage, OptionsMediaVideo } from "../..";
import { AttributeException } from "../../..";
import { toBoolean } from "../../..";
import { getInputPatternRegex } from "../../_functions";
import { AbstractMediaValidator } from "../../Media/AbstractMediaValidator";
import { AbstractFormChildrenValidate, EventValidate } from ".";
import { HTMLFormChildrenElement, MediaType } from "..";

/**
 * Interface for form field validation components.
 */
export interface FormChildrenValidateInterface {
    /**
     * Checks if the current field is valid (i.e., has no validation errors).
     */
    isValid(): boolean;

    /**
     * Retrieves the current validation options for the field.
     */
    getOptionsValidate(): OptionsValidate;

    /**
     * Runs the validation logic on the field asynchronously.
     */
    validate(): Promise<void>;

    /**
     * Returns the event object responsible for triggering field validation.
     */
    eventValidate(): EventValidate;

    /**
     * Returns the event object responsible for clearing field errors.
     */
    eventClearError(): EventValidate;

    /**
     * Clears the visual error state and message for the field.
     */
    clearErrorField(): void;
}
/**
 * Class that implements validation for non-file form fields.
 * Automatically infers validation rules based on HTML attributes if no explicit options are provided.
 */
export class FormChildrenTypeNoFileValidate extends AbstractFormChildrenValidate implements FormChildrenValidateInterface {
    constructor(
        childrenInput: HTMLFormChildrenElement,
        protected readonly formInputValidate: FormInputValidator,
        private optionsValidate?: OptionsValidateNoTypeFile) {
        super(childrenInput);
    }
    /**
     * Validates the current form input field using appropriate validators depending on its type.
     * Validation options are resolved from attributes or defaults if not explicitly provided.
     */
    public validate = async (): Promise<void> => {
        if (!this._value) return;
        this.formInputValidate.allTypesValidator(
            this._value as string | string[] | number,
            this.name,
            this.type,
            this.getOptionsValidate()
        );
        this.emitEventHandler();
    }
    /**
     * Returns whether the current input field is valid or has errors.
     */
    public isValid(): boolean {
        return this.formInputValidate.hasErrorsField(this.name);
    }
    protected getFormError(): FormErrorInterface { return this.formInputValidate }
    /**
     * Provides the validation options for the input field, inferred from HTML attributes or defaults.
     */
    public getOptionsValidate(): OptionsValidateNoTypeFile {
        if (!this.optionsValidate) {
            switch (this.type) {
                case 'text':
                    this.optionsValidate = this.getOptionsValidateSimpleText();
                    break;
                case 'tel':
                    this.optionsValidate = this.getOptionsValidateSimpleText();
                    break;
                case 'textarea':
                    this.optionsValidate = this.getOptionsValidateTextarea();
                    break;
                case 'password':
                    this.optionsValidate = this.getOptionsValidatePassword();
                    break;
                case 'url':
                    this.optionsValidate = this.getOptionsValidateUrl();
                    break;
                case 'date':
                    this.optionsValidate = this.getOptionsValidateDate();
                    break;
                case 'select':
                    this.optionsValidate = this.getOptionsValidateSelect();
                    break;
                case 'number':
                    this.optionsValidate = this.getOptionsValidateNumber();
                    break;
                case 'checkbox':
                    this.optionsValidate = this.getOptionsValidateCheckBox();
                    break;
                case 'radio':
                    this.optionsValidate = this.getOptionsValidateRadio();
                    break;
                default:
                    this.optionsValidate = this.getOptionsValidateSimpleText();
                    break;
            }
        }
        return this.optionsValidate;
    }
    /**
     * Ensures that all checkboxes with the same name are grouped within a container with the same ID.
     * Throws an error if the structure is invalid.
     */
    private hasContainerCheckbox(): boolean {
        const container = this._children.closest(`[id="${this.name}"]`);
        if (!container.length) { // Utilisez .length pour les objets jQuery
            throw new Error(`All checkboxes with name "${this.name}" must be wrapped inside a container with id="${this.name}".`);
        }

        const checkboxes = this._formParent.find<HTMLInputElement>(`input[type="checkbox"][name="${this.name}"]`).get(); // Récupérez les éléments DOM natifs

        const notInsideContainer = checkboxes.some((checkbox) => !container[0].contains(checkbox)); // Utilisez la méthode native contains

        if (notInsideContainer) {
            throw new Error(`Some checkboxes with name "${this.name}" are not inside the container with id="${this.name}". Group them correctly.`);
        }
        this._checkBoxContainer = container;
        return true; // Toutes les cases à cocher sont à l'intérieur du conteneur spécifié
    }
    /**
     * Ensures that all radios with the same name are grouped within a container with the same ID.
     * Throws an error if the structure is invalid.
     */
    private hasContainerRadio(): boolean {
        const container = this._children.closest(`[id="${this.name}"]`);
        if (!container.length) { // Utilisez .length pour les objets jQuery
            throw new Error(`All radios with name "${this.name}" must be wrapped inside a container with id="${this.name}".`);
        }

        const checkboxes = this._formParent.find<HTMLInputElement>(`input[type="radio"][name="${this.name}"]`).get(); // Récupérez les éléments DOM natifs

        const notInsideContainer = checkboxes.some((checkbox) => !container[0].contains(checkbox)); // Utilisez la méthode native contains

        if (notInsideContainer) {
            throw new Error(`Some radios with name "${this.name}" are not inside the container with id="${this.name}". Group them correctly.`);
        }
        this._checkBoxContainer = container;
        return true; // Toutes les cases à cocher sont à l'intérieur du conteneur spécifié
    }
    /**
    * Retrieves a specific attribute from the checkbox container.
    */
    private getAttrCheckboxContainer(attributeName: string): string | undefined {
        this.hasContainerCheckbox();
        if (!this._checkBoxContainer) { return undefined; }
        return this._checkBoxContainer.attr(attributeName);
    }
    /**
    * Retrieves a specific attribute from the radio container.
    */
    private getAttrRadioContainer(attributeName: string): string | undefined {
        this.hasContainerRadio();
        if (!this._checkBoxContainer) { return undefined; }
        return this._checkBoxContainer.attr(attributeName);
    }
    /**
     * Generates validation options for textarea fields using HTML attributes or default values.
     */
    private getOptionsValidateTextarea(): OptionsInputField {
        return {
            maxLength: parseInt(this.getAttrChildren('max-length') ?? '1000', 10),
            minLength: parseInt(this.getAttrChildren('min-length') ?? '10', 10),
            typeInput: "textarea",
            escapestripHtmlAndPhpTags: toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags')),
            requiredInput: toBoolean(this.getAttrChildren('required')),
            errorMessageInput: `The content you entered is invalid.  
                            Please ensure that your input complies with the required rules:
                            - It must match the specified pattern.
                            - It must not contain prohibited characters or words.
                            - The length must be within the allowed range.
                            - All required fields must be correctly filled in.

                            Please review your entry and try again.`,
            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name')!, 'iu')
        }
    }
    /**
    * Generates validation options for URL input fields.
    */
    private getOptionsValidateUrl(): URLOptions {
        const allowed_protocoles = this.getAttrChildren('data-allowed-protocols');
        return {
            allowedProtocols: allowed_protocoles ? allowed_protocoles.split(',') : ['https'],
            requireTLD: toBoolean(this.getAttrChildren('data-required-tld')),
            allowLocalhost: toBoolean(this.getAttrChildren('data-allow-localhost')),
            allowIP: toBoolean(this.getAttrChildren('data-allow-ip')),
            allowQueryParams: toBoolean(this.getAttrChildren('data-allow-query-params')),
            allowHash: toBoolean(this.getAttrChildren('data-allow-hash')),
            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name') ?? '[unknown form]', 'iu'),
            maxLength: parseInt(this.getAttrChildren('max-length') ?? '255', 10),
            minLength: parseInt(this.getAttrChildren('min-length') ?? '6', 10),
        }
    }
    /**
     * Generates validation options for date input fields.
     */
    private getOptionsValidateDate(): DateOptions {
        return {
            format: this.getAttrChildren('data-format-date'),
            minDate: this.getAttrChildren('data-min-date'),
            maxDate: this.getAttrChildren('data-max-date'),
            allowFuture: toBoolean(this.getAttrChildren('data-allow-future')),
            allowPast: toBoolean(this.getAttrChildren('data-allow-past')),
            maxLength: parseInt(this.getAttrChildren('data-max-length') ?? '21', 10),
            minLength: parseInt(this.getAttrChildren('data-min-length') ?? '10', 10),
            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name') ?? '[unknown form]', 'iu'),
        }
    }
    /**
     * Generates validation options for select dropdowns.
     */
    private getOptionsValidateSelect(): SelectOptions {
        const children = this._children as JQuery<HTMLSelectElement>
        let options_choices: string[] = [];
        children.find('option').map(function (index, elementOption) {
            const option = jQuery(elementOption);
            if (option.attr('value')) {
                options_choices.push(option.val()!)
            } else {
                options_choices.push(option.text())
            }
        })
        return {
            optionsChoices: options_choices,
            escapestripHtmlAndPhpTags: toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags'))
        }
    }
    /**
    * Generates validation options for number input fields.
    */
    private getOptionsValidateNumber(): NumberOptions {
        const minAttr = this.getAttrChildren('min');
        const maxAttr = this.getAttrChildren('max');
        const stepAttr = this.getAttrChildren('step');
        return {
            min: minAttr ? parseFloat(minAttr) : undefined,
            max: maxAttr ? parseFloat(maxAttr) : undefined,
            step: stepAttr ? parseFloat(stepAttr) : undefined,
            regexValidator: getInputPatternRegex(
                this._children,
                this.getAttrFormParent('name') ?? '[unknown form]',
                'iu'
            ),
        };
    }
    /**
    * Generates validation options for basic text fields.
    */
    private getOptionsValidateSimpleText(): OptionsInputField {
        return {
            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name') ?? '[unknown form]', 'iu'),
            maxLength: parseInt(this.getAttrChildren('max-length') ?? '255', 10),
            minLength: parseInt(this.getAttrChildren('min-length') ?? '1', 10),
            requiredInput: toBoolean(this.getAttrChildren('required')),
            escapestripHtmlAndPhpTags: toBoolean(this.getAttrChildren('data-escapestrip-html-and-php-tags')),
            errorMessageInput: this.getAttrChildren('data-error-message-input'),
            typeInput: "text",
            egAwait: this.getAttrChildren('data-eg-await')
        }
    }
    /**
    * Generates validation options for password fields, including character requirements.
    */
    private getOptionsValidatePassword(): PassworkRuleOptions {
        return {
            upperCaseAllow: toBoolean(this.getAttrChildren('data-upper-case-allow')),
            lowerCaseAllow: toBoolean(this.getAttrChildren('data-lower-case-allow')),
            specialChar: toBoolean(this.getAttrChildren('data-special-char')),
            numberAllow: toBoolean(this.getAttrChildren('data-number-allow')),
            regexValidator: getInputPatternRegex(this._children, this.getAttrFormParent('name') ?? '[unknown form]', 'iu'),
            maxLength: parseInt(this.getAttrChildren('max-length') ?? '255', 10),
            minLength: parseInt(this.getAttrChildren('min-length') ?? '8', 10),
            requiredInput: toBoolean(this.getAttrChildren('required'))
        }
    }
    /**
    * Retrieves the selected values of a group of checkboxes.
    */
    private get _valueCheckbox(): string | string[] {
        const checkboxes = this._formParent.find<HTMLInputElement>(`input[type="checkbox"][name="${this.name}"]`);
        return Array.from(checkboxes)
            .filter(checkbox_elt => checkbox_elt.checked)
            .map(checkbox => checkbox.value);
    }
    /**
     * Retrieves all possible values from the checkbox group.
     */
    private get _valueOptionsheckbox(): string[] {
        const checkboxes = this._formParent.find<HTMLInputElement>(`input[type="checkbox"][name="${this.name}"]`);
        return Array.from(checkboxes).map(checkbox => checkbox.value);
    }
    /**
     * Constructs validation options for checkbox fields based on attributes from their container.
     */
    private getOptionsValidateCheckBox(): OptionsCheckbox {
        const max_allowed = this.getAttrCheckboxContainer('data-max-allowed');
        const min_allowed = this.getAttrCheckboxContainer('data-min-allowed');
        return {
            maxAllowed: max_allowed ? parseInt(max_allowed) : undefined,
            minAllowed: min_allowed ? parseInt(min_allowed) : undefined,
            required: toBoolean(this.getAttrCheckboxContainer('required')),
            dataChoices: this._valueCheckbox,
            optionsChoicesCheckbox: this._valueOptionsheckbox
        }
    }
    /**
    * Constructs validation options for radio fields based on attributes from their container.
    */
    private getOptionsValidateRadio(): OptionsRadio {
        return {
            required: toBoolean(this.getAttrRadioContainer('required'))
        }
    }
}

/**
 * ## 📄 Class: `FormChildrenTypeFileValidate`

**Description:**
This class is responsible for validating file input fields (`<input type="file">`) in a form. It supports different media types such as `image`, `document`, and `video`, and applies specific validation rules based on the selected type. It extends `AbstractFormChildrenValidate` and implements the `FormChildrenValidateInterface`.

---

### 🔧 Constructor

```ts
constructor(
  children: HTMLInputElement,
  mediaValidator: AbstractMediaValidator,
  optionsValidateMedia?: OptionsValidateTypeFile
)
```

* `children`: The HTML file input element to be validated.
* `mediaValidator`: The media validator instance responsible for validating the file input.
* `optionsValidateMedia`: Optional custom validation options. If not provided, they are generated automatically based on the media type.

#### ⚠️ Throws:

* `AttributeException` if the `media-type` attribute is missing on the input element.

---

## 🧩 Public Methods

### `validate(): Promise<void>`

```ts
public validate = async (): Promise<void>
```

**Description:**
Triggers validation of the file using the appropriate validator based on the media type.

* If no file is selected (`_value` is empty), validation is skipped.
* Executes file validation and emits a validation event afterward.

---

### `isValid(): boolean`

```ts
public isValid(): boolean
```

**Description:**
Checks whether the file input has any validation errors.

* **Returns:** `true` if no errors are found; otherwise `false`.
* **Source:** Uses the `mediaValidator.hasErrorsField()` method.

---

### `getOptionsValidate(): OptionsValidateTypeFile`

```ts
public getOptionsValidate(): OptionsValidateTypeFile
```

**Description:**
Retrieves the validation options. If not explicitly defined, they are generated dynamically based on the `media-type` attribute.

* **Returns:** A set of validation options specific to the media type.
* **Throws:** `AttributeException` if `media-type` is missing or `Error` if the type is unsupported.

---

### `eventClearError(): EventValidate`

```ts
public eventClearError(): EventValidate
```

**Description:**
Determines the event that should be used to clear validation errors for the file input field.

* **Returns:** The event type defined in the `event-clear-error` attribute, or `'change'` as default.

---

## 🔐 Protected Methods

### `getFormError(): FormErrorInterface`

```ts
protected getFormError(): FormErrorInterface
```

**Description:**
Provides the media validator as the error handler for the field.

* **Returns:** An instance of `FormErrorInterface`.

---

## 🛠️ Private Methods — Option Builders

### `getOptionsValidateImage(): OptionsImage`

```ts
private getOptionsValidateImage(): OptionsImage
```

**Description:**
Builds and returns validation rules specific to **image** files.

* Includes: `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, and base file options.

---

### `getOptionsValidateVideo(): OptionsMediaVideo`

```ts
private getOptionsValidateVideo(): OptionsMediaVideo
```

**Description:**
Builds and returns validation rules specific to **video** files.

* Includes: `duration`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `unityDurationMedia`, and base file options.

---

### `getBaseOptionsValidate(): OptionsFile`

```ts
private getBaseOptionsValidate(): OptionsFile
```

**Description:**
Builds the base validation rules shared by all media types.

* Includes:

  * `allowedMimeTypeAccept`: Array of allowed MIME types.
  * `maxsizeFile`: Maximum file size.
  * `unityMaxSizeFile`: Size unit (e.g. MB, KB).
  * `extensions`: Allowed file extensions.
  * `unityDimensions`: Unit for dimensions (e.g. px).

---

## 📥 Private Properties

### `_mediaType?: MediaType`

**Description:**
Stores the value of the `media-type` attribute from the input element. This determines which set of validation rules should be applied.

* Supported types: `image`, `video`, `document`.

---

 */
export class FormChildrenTypeFileValidate
    extends AbstractFormChildrenValidate
    implements FormChildrenValidateInterface {
    private _mediaType?: MediaType;
    constructor(
        children: HTMLInputElement,
        protected readonly mediaValidator: AbstractMediaValidator,
        protected optionsValidateMedia?: OptionsValidateTypeFile) {
        super(children);
        if (!this.getAttrChildren('data-media-type')) {
            throw new AttributeException('data-media-type', this.name, this.getAttrFormParent('name') ?? 'form');
        }
        this._mediaType = this.getAttrChildren('data-media-type') as MediaType | undefined;
    }
    public isValid(): boolean { return this.mediaValidator.hasErrorsField(this.name); }
    public validate = async (): Promise<void> => {
        if (!this._value) { return; }
        await this.mediaValidator.fileValidator(this._value as File | FileList, this.name, this.getOptionsValidate());
        this.emitEventHandler();
    }
    public getOptionsValidate(): OptionsValidateTypeFile {
        if (!this.optionsValidateMedia) {
            if (!this._mediaType) {
                throw new AttributeException('data-media-type', this.name, this.getAttrFormParent('name') ?? 'form');
            }
            switch (this._mediaType) {
                case 'image':
                    this.optionsValidateMedia = this.getOptionsValidateImage();
                    break;
                case 'document':
                    this.optionsValidateMedia = this.getBaseOptionsValidate();
                    break;
                case 'video':
                    this.optionsValidateMedia = this.getOptionsValidateVideo();
                    break;
                default:
                    throw new Error(`Unsupported media-type '${this._mediaType}' for input field '${this.name}' in form '${this.getAttrFormParent('name') ?? 'form'}'.`);
            }
        }
        return this.optionsValidateMedia;
    }
    protected getFormError(): FormErrorInterface { return this.mediaValidator; }
    public eventClearError(): EventValidate { return this.toConvertTypeEvent(this.getAttrChildren('event-clear-error') ?? 'change') }
    private getOptionsValidateVideo(): OptionsMediaVideo {
        return {
            ...this.getBaseOptionsValidate(),
            duration: parseInt(this.getAttrChildren('duration') ?? '10', 10),
            minWidth: parseInt(this.getAttrChildren('data-min-width') ?? '10', 10),
            maxWidth: parseInt(this.getAttrChildren('data-max-width') ?? '1600', 10),
            minHeight: parseInt(this.getAttrChildren('data-min-height') ?? '10', 10),
            maxHeight: parseInt(this.getAttrChildren('data-max-height') ?? '2500', 10),
            unityDurationMedia: this.getAttrChildren('data-unity-duration-media')
        }
    }
    private getOptionsValidateImage(): OptionsImage {
        return {
            ...this.getBaseOptionsValidate(),
            minWidth: parseInt(this.getAttrChildren('data-min-width') ?? '10', 10),
            maxWidth: parseInt(this.getAttrChildren('data-max-width') ?? '1600', 10),
            minHeight: parseInt(this.getAttrChildren('data-min-height') ?? '10', 10),
            maxHeight: parseInt(this.getAttrChildren('data-max-height') ?? '2500', 10)
        }
    }
    private getBaseOptionsValidate(): OptionsFile {
        const extensions_file = this.getAttrChildren('data-extentions');
        const allowedMimeTypeAccept_file = this.getAttrChildren('allowed-mime-type-accept');
        return {
            allowedMimeTypeAccept: allowedMimeTypeAccept_file ? allowedMimeTypeAccept_file.split(',') : undefined,
            maxsizeFile: parseInt(this.getAttrChildren('data-maxsize-file') ?? '2', 10),
            unityMaxSizeFile: this.getAttrChildren('data-unity-max-size-file'),
            extensions: extensions_file ? extensions_file.split(',') : undefined,
            unityDimensions: this.getAttrChildren('data-unity-dimensions')
        }
    }

}

