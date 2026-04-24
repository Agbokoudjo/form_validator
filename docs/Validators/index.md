# @wlindabla/form_validator

> **Powerful, framework-agnostic form validation library for JavaScript & TypeScript**

A comprehensive validation library for HTML forms supporting `text`, `email`, `tel`, `password`, `URL`, `date`, `number`, `select`, `checkbox`, `radio`, and rich file types: **images**, **PDFs**, **Word documents**, **Excel**, **CSV**, **ODF**, and **videos** — with deep binary signature inspection, real metadata validation, and a centralized error store.

**Author:** [AGBOKOUDJO Franck](https://www.linkedin.com/in/internationales-web-apps-services-120520193/)  
**Company:** INTERNATIONALES WEB APPS & SERVICES  
**GitHub:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator)  
**Issues:** [https://github.com/Agbokoudjo/form_validator/issues](https://github.com/Agbokoudjo/form_validator/issues)

---

## Table of Contents

- [@wlindabla/form\_validator](#wlindablaform_validator)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Architecture Overview](#architecture-overview)
  - [Quick Start](#quick-start)
    - [Using the Central Router (recommended)](#using-the-central-router-recommended)
    - [Using the Full Form Controller (HTML-driven)](#using-the-full-form-controller-html-driven)
  - [Text Validators](#text-validators)
    - [TextInputValidator](#textinputvalidator)
    - [TextareaValidator](#textareavalidator)
    - [EmailInputValidator](#emailinputvalidator)
    - [PasswordInputValidator](#passwordinputvalidator)
    - [TelInputValidator](#telinputvalidator)
    - [URLInputValidator](#urlinputvalidator)
    - [FQDNInputValidator](#fqdninputvalidator)
    - [DateInputValidator](#dateinputvalidator)
    - [NumberInputValidator](#numberinputvalidator)
  - [Choice Validators](#choice-validators)
    - [SelectValidator](#selectvalidator)
    - [CheckBoxValidator](#checkboxvalidator)
    - [RadioValidator](#radiovalidator)
  - [File Validators](#file-validators)
    - [ImageValidator](#imagevalidator)
    - [VideoValidator](#videovalidator)
    - [PdfValidator](#pdfvalidator)
    - [ExcelValidator](#excelvalidator)
    - [CsvValidator](#csvvalidator)
    - [MicrosoftWordValidator](#microsoftwordvalidator)
    - [OdtValidator](#odtvalidator)
  - [Central Router: FormInputValidator](#central-router-forminputvalidator)
  - [Form Orchestrator: FormValidateController](#form-orchestrator-formvalidatecontroller)
  - [Error Store: FormErrorStore](#error-store-formerrorstore)
  - [Validation Events](#validation-events)
  - [Cache Adapter](#cache-adapter)
  - [HTML Attribute-Driven Validation](#html-attribute-driven-validation)
  - [Framework Integration Examples](#framework-integration-examples)
    - [Vanilla JS / TypeScript](#vanilla-js--typescript)
    - [React / Next.js](#react--nextjs)
    - [Angular](#angular)
    - [Vue.js](#vuejs)
    - [jQuery](#jquery)
    - [Symfony + Twig](#symfony--twig)
  - [API Reference](#api-reference)
    - [Exports Map](#exports-map)
    - [Common Methods on All Validators](#common-methods-on-all-validators)
  - [License](#license)

---

## Installation

```bash
# npm
npm install @wlindabla/form_validator

# yarn
yarn add @wlindabla/form_validator

# pnpm
pnpm add @wlindabla/form_validator
```

---

## Architecture Overview

```
@wlindabla/form_validator
src/Validation/
├── Core
│   ├── Adapter
│   │   ├── Dom
│   │   │   ├── AbstractFieldController.ts
│   │   │   ├── Cache
│   │   │   │   ├── index.ts
│   │   │   │   └── LocalStorageCacheAdapter.ts
│   │   │   ├── FieldInputController.ts
│   │   │   └── index.ts
│   │   ├── FieldOptionsValidateCacheAdapter.ts
│   │   ├── FieldValidationEvent.ts
│   │   └── index.ts
│   ├── index.ts
│   └── Router
│       ├── FormInputValidator.ts
│       └── index.ts
├── FormValidateController.ts
├── index.ts
├── Rules
│   ├── Choice
│   │   ├── CheckBoxValidator.ts
│   │   ├── index.ts
│   │   ├── RadioValidator.ts
│   │   └── SelectValidator.ts
│   ├── FieldValidator.ts
│   ├── File
│   │   ├── AbstractMediaValidator.ts
│   │   ├── DocumentValidator.ts
│   │   ├── ImageValidator.ts
│   │   ├── index.ts
│   │   ├── InterfaceMedia.ts
│   │   └── VideoValidator.ts
│   ├── index.ts
│   └── Text
│       ├── DateInputValidator.ts
│       ├── EmailInputValidator.ts
│       ├── FQDNInputValidator.ts
│       ├── index.ts
│       ├── NumberInputValidator.ts
│       ├── PasswordInputValidator.ts
│       ├── TelInputValidator.ts
│       ├── TextareaValidator.ts
│       ├── TextInputValidator.ts
│       └── URLInputValidator.ts
└── Store
    └── index.ts
```

**Key design principles:**
- **Singleton validators** — each validator class exposes a single shared instance via `getInstance()`.
- **Centralized error store** — all validation results are stored in `FormErrorStore`, the single source of truth.
- **Event-driven** — validation results are broadcast as `CustomEvent`s on the parent `<form>` element.
- **Framework-agnostic** — works with vanilla JS, React, Angular, Vue, jQuery, or any server-side template.

---

## Quick Start

### Using the Central Router (recommended)

```typescript
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';

// Text field
await formInputValidator.allTypesValidator(
  'John Doe',
  'fullName',
  'text',
  { minLength: 2, maxLength: 100, requiredInput: true }
);

// Check result
const validator = formInputValidator.getValidator('fullName');
if (validator?.formErrorStore.isFieldValid('fullName')) {
  console.log('Valid!');
} else {
  console.log(validator?.formErrorStore.getFieldErrors('fullName'));
}
```

### Using the Full Form Controller (HTML-driven)

```html
<form name="registrationForm" class="form-validate">
  <input
    id="email"
    name="email"
    type="email"
    required
    data-event-validate="blur"
    data-error-message-input="Please enter a valid email."
  />
</form>
```

```typescript
import { FormValidateController } from '@wlindabla/form_validator';

const controller = new FormValidateController('.form-validate');

// Validate all fields at once (e.g. on submit)
const isValid = await controller.isFormValid();

// Validate a single field
const input = document.querySelector<HTMLInputElement>('#email')!;
await controller.validateChildrenForm(input);
```

---

## Text Validators

### TextInputValidator

Validates text fields with regex, length constraints, HTML/PHP tag stripping, and required checks.

**Import:**
```typescript
import { textInputValidator, TextInputOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Options (`TextInputOptions`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `requiredInput` | `boolean` | `true` | Field is mandatory |
| `minLength` | `number` | `1` | Minimum character count |
| `maxLength` | `number` | `255` | Maximum character count |
| `regexValidator` | `RegExp` | `/^\p{L}+$/iu` | Pattern to test |
| `match` | `boolean` | `true` | `true` = value must match regex; `false` = value must NOT match |
| `escapestripHtmlAndPhpTags` | `boolean` | `true` | Strip HTML/PHP tags before validation |
| `errorMessageInput` | `string` | — | Custom error message |
| `egAwait` | `string` | — | Example value shown in error |
| `typeInput` | `FormInputType` | `'text'` | Hint for error messages |

**Example:**
```typescript
textInputValidator.validate('Jean-Pierre', 'firstName', {
  minLength: 2,
  maxLength: 50,
  requiredInput: true,
  regexValidator: /^[\p{L}\s\-']+$/u,
  match: true,
  errorMessageInput: 'Only letters, spaces, hyphens and apostrophes are allowed.',
  egAwait: 'Jean-Pierre'
});

const errors = textInputValidator.formErrorStore.getFieldErrors('firstName');
```

---

### TextareaValidator

Delegates to `TextInputValidator` with `ignoreMergeWithDefaultOptions: true`. Use for long-form text.

```typescript
import { textareaInputValidator } from '@wlindabla/form_validator/validation/rules/text';

textareaInputValidator.validate(
  userInput,
  'bio',
  {
    minLength: 20,
    maxLength: 2000,
    requiredInput: true,
    typeInput: 'textarea',
    escapestripHtmlAndPhpTags: true
  }
);
```

---

### EmailInputValidator

Full RFC-compliant email validation: regex check, display names, FQDN domain check, UTF-8 local parts, host blacklists/whitelists.

**Import:**
```typescript
import { emailInputValidator, EmailInputOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Key options (`EmailInputOptions`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowUtf8LocalPart` | `boolean` | `true` | Allow Unicode in local part |
| `allowIpDomain` | `boolean` | `false` | Allow IP-address domains |
| `allowDisplayName` | `boolean` | `false` | Allow `"John Doe <john@example.com>"` format |
| `requireDisplayName` | `boolean` | `false` | Require display name |
| `hostBlacklist` | `(string\|RegExp)[]` | `[]` | Blocked domains |
| `hostWhitelist` | `(string\|RegExp)[]` | `[]` | Allowed domains only |
| `blacklistedChars` | `string` | `''` | Characters forbidden in local part |
| `ignoreMaxLength` | `boolean` | `false` | Skip max-length check |

**Example:**
```typescript
await emailInputValidator.validate('franckagbokoudjo301@gmail.com', 'userEmail', {
  requiredInput: true,
  allowUtf8LocalPart: true,
  hostBlacklist: ['tempmail.com', 'guerrillamail.com'],
  errorMessageInput: 'Please enter a valid professional email address.'
});

if (!emailInputValidator.formErrorStore.isFieldValid('userEmail')) {
  const errors = emailInputValidator.formErrorStore.getFieldErrors('userEmail');
}
```

---

### PasswordInputValidator

Validates passwords against character rules (upper, lower, digit, symbol, punctuation), length, and optional strength scoring. Fires a `CustomEvent` with the score when enabled.

**Import:**
```typescript
import { passwordInputValidator, PassworkRuleOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Key options (`PassworkRuleOptions`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minLength` | `number` | `8` | Minimum length |
| `maxLength` | `number` | `256` | Maximum length |
| `upperCaseAllow` | `boolean` | `true` | Require uppercase letter |
| `lowerCaseAllow` | `boolean` | `true` | Require lowercase letter |
| `numberAllow` | `boolean` | `true` | Require digit |
| `symbolAllow` | `boolean` | `true` | Require special character |
| `enableScoring` | `boolean` | `true` | Dispatch score event |
| `regexValidator` | `RegExp` | strong regex | Override pattern |

**Scoring event:**
```typescript
document.addEventListener('scoreAnalysisPassword', (e: CustomEvent) => {
  const { score, analysis, input } = e.detail;
  console.log(`Field: ${input}, Strength score: ${score}`);
  // analysis = { hasUpper, hasLower, hasNumber, hasSymbol, ... }
});

passwordInputValidator.validate('MyP@ssw0rd!', 'password', {
  minLength: 10,
  upperCaseAllow: true,
  numberAllow: true,
  symbolAllow: true,
  enableScoring: true
});
```

---

### TelInputValidator

Validates international phone numbers using [`libphonenumber-js`](https://gitlab.com/catamphetamine/libphonenumber-js). Auto-formats valid numbers in the DOM input.

**Import:**
```typescript
import { telInputValidator, TelInputOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Example:**
```typescript
telInputValidator.validate('+22901672518 86', 'phone', {
  defaultCountry: 'BJ',
  egAwait: '+229 01 67 25 18 86',
  requiredInput: true
});

// For a French number:
telInputValidator.validate('+33612345678', 'mobile', {
  defaultCountry: 'FR',
  minLength: 10,
  maxLength: 20
});
```

> The number must start with `+`. The validator auto-formats valid numbers into international format (e.g. `+229 01 67 25 18 86`).

---

### URLInputValidator

Validates URLs against protocol, host, IP, localhost, query params, fragments, port, auth credentials, and host blacklist/whitelist rules.

**Import:**
```typescript
import { urlInputValidator, URLOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Key options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowedProtocols` | `string[]` | `['http','https','file','blob','url','data']` | Accepted protocols |
| `requireProtocol` | `boolean` | `false` | URL must include protocol |
| `requireValidProtocol` | `boolean` | `true` | Protocol must be in `allowedProtocols` |
| `allowLocalhost` | `boolean` | `false` | Allow `localhost` / `127.0.0.1` |
| `allowIP` | `boolean` | `false` | Allow IP-based hosts |
| `allowQueryParams` | `boolean` | `true` | Allow `?key=value` |
| `allowHash` | `boolean` | `true` | Allow `#fragment` |
| `disallowAuth` | `boolean` | `false` | Reject `user:pass@host` |
| `maxAllowedLength` | `number` | `2048` | Max URL length |
| `hostBlacklist` | `(string\|RegExp)[]` | `[]` | Blocked hosts |
| `hostWhitelist` | `(string\|RegExp)[]` | `[]` | Allowed hosts only |

**Example:**
```typescript
await urlInputValidator.validate('https://proticeditions.com/catalogue', 'website', {
  allowedProtocols: ['https'],
  requireProtocol: true,
  allowQueryParams: true,
  hostBlacklist: ['spam.com'],
  disallowAuth: true
});
```

---

### FQDNInputValidator

Validates Fully Qualified Domain Names (FQDN): TLD requirement, underscores, wildcards, trailing dot, label length.

```typescript
import { fqdnInputValidator, FQDNOptions } from '@wlindabla/form_validator/validation/rules/text';

await fqdnInputValidator.validate('mail.example.com', 'domain', {
  requireTLD: true,
  allowedUnderscores: false,
  allowWildcard: false
});
```

---

### DateInputValidator

Parses and validates date strings against format templates, date ranges, and future/past restrictions.

**Options (`DateInputOptions`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `string` | `'YYYY/MM/DD'` | Date format template |
| `strictMode` | `boolean` | `false` | Enforce exact length match |
| `delimiters` | `string[]` | `['/', '-']` | Allowed separators |
| `minDate` | `Date` | — | Minimum allowed date |
| `maxDate` | `Date` | — | Maximum allowed date |
| `allowFuture` | `boolean` | — | Allow future dates |
| `allowPast` | `boolean` | — | Allow past dates |

**Example:**
```typescript
import { dateInputValidator } from '@wlindabla/form_validator/validation/rules/text';

dateInputValidator.validate('25/12/1990', 'birthdate', {
  format: 'DD/MM/YYYY',
  allowFuture: false,
  minDate: new Date('1900-01-01')
});
```

---

### NumberInputValidator

Validates numeric values with min, max, step, and regex constraints.

```typescript
import { numberInputValidator } from '@wlindabla/form_validator/validation/rules/text';

numberInputValidator.validate('42', 'age', {
  min: 18,
  max: 120,
  step: 1
});

numberInputValidator.validate('9.99', 'price', {
  min: 0,
  max: 10000,
  step: 0.01
});
```

---

## Choice Validators

### SelectValidator

Validates that selected values belong to the declared option set.

```typescript
import { selectValidator } from '@wlindabla/form_validator/validation/rules/choice';

// Single select
selectValidator.validate('fr', 'country', {
  optionsChoices: ['fr', 'en', 'bj', 'de']
});

// Multi-select
selectValidator.validate(['react', 'vue'], 'frameworks', {
  optionsChoices: ['react', 'vue', 'angular', 'svelte']
});
```

---

### CheckBoxValidator

Validates checkbox groups: required state, min/max selection count.

```typescript
import { checkboxValidator } from '@wlindabla/form_validator/validation/rules/choice';

// 2 checkboxes checked out of 5
checkboxValidator.validate(2, 'interests', {
  required: true,
  minAllowed: 1,
  maxAllowed: 3,
  dataChoices: ['sports', 'music'],
  optionsChoicesCheckbox: ['sports', 'music', 'art', 'tech', 'travel']
});
```

---

### RadioValidator

Validates that a radio group has a selection when required.

```typescript
import { radioValidator } from '@wlindabla/form_validator/validation/rules/choice';

radioValidator.validate('male', 'gender', { required: true });
radioValidator.validate(undefined, 'gender', { required: true });
// → Error: "Please select an option in the 'gender' group."
```

---

## File Validators

All file validators perform checks in this order: **extension → size → MIME type → binary signature (magic bytes) → deep content/metadata inspection**.

### ImageValidator

Validates images: extension, size, MIME type (browser loading), magic bytes, and pixel dimensions.

Supported formats: `jpg`, `jpeg`, `png`, `gif`, `bmp`, `webp`, `svg`

```typescript
import { imageValidator } from '@wlindabla/form_validator/validation/rules/file';

const file = inputElement.files[0];

await imageValidator.validate(file, 'avatar', {
  allowedMimeTypeAccept: ['image/jpeg', 'image/png', 'image/webp'],
  maxsizeFile: 2,           // 2 MiB
  unityMaxSizeFile: 'MiB',
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
  minWidth: 100,
  maxWidth: 2000,
  minHeight: 100,
  maxHeight: 2000
});

if (!imageValidator.formErrorStore.isFieldValid('avatar')) {
  console.log(imageValidator.formErrorStore.getFieldErrors('avatar'));
}
```

---

### VideoValidator

Validates video files with binary signature check, MIME type, and metadata (duration, width, height) using a hidden `<video>` element.

Supported formats: `mp4`, `webm`, `mkv`, `avi`, `mov`, `flv`, `wmv`, `3gp`, `ogv`, and more.

```typescript
import { videoValidator } from '@wlindabla/form_validator/validation/rules/file';

await videoValidator.validate(file, 'presentation', {
  allowedExtensions: ['mp4', 'webm'],
  allowedMimeTypeAccept: ['video/mp4', 'video/webm'],
  maxsizeFile: 50,
  unityMaxSizeFile: 'MiB',
  minWidth: 320,
  maxWidth: 1920,
  minHeight: 240,
  maxHeight: 1080,
  validateBySignature: true
});
```

---

### PdfValidator

Validates PDF files: magic bytes (`%PDF` = `25504446`), MIME type, and page count via `pdfjs-dist`.

```typescript
import { pdfValidator } from '@wlindabla/form_validator/validation/rules/file';

await pdfValidator.validate(file, 'contract', {
  allowedExtensions: ['pdf'],
  allowedMimeTypeAccept: ['application/pdf'],
  maxsizeFile: 10,
  unityMaxSizeFile: 'MiB'
});
```

---

### ExcelValidator

Validates Excel files (`.xls`/`.xlsx`): magic bytes (OLE2 or ZIP), MIME type (cross-platform soft check), workbook structure via SheetJS, sheet count, required columns.

```typescript
import { excelValidator } from '@wlindabla/form_validator/validation/rules/file';

await excelValidator.validate(file, 'importFile', {
  allowedExtensions: ['xlsx', 'xls'],
  maxsizeFile: 5,
  unityMaxSizeFile: 'MiB',
  minSheets: 1,
  maxSheets: 10,
  rejectEmptySheet: true,
  sheetIndex: 0,
  requiredColumns: ['Name', 'Email', 'Phone']
});
```

---

### CsvValidator

Validates CSV files: binary/BOM pre-check, PapaParse structural parsing, required headers, row count, per-column type validation.

**Supported column types:** `'string'`, `'number'`, `'date'`, `'boolean'`, `'email'`

```typescript
import { csvValidator } from '@wlindabla/form_validator/validation/rules/file';

await csvValidator.validate(file, 'dataImport', {
  allowedExtensions: ['csv'],
  maxsizeFile: 5,
  unityMaxSizeFile: 'MiB',
  requiredHeaders: ['Name', 'Email', 'Age'],
  columnTypes: {
    Age: 'number',
    Email: 'email',
    CreatedAt: 'date'
  },
  minRows: 1,
  maxRows: 10000,
  maxRowErrors: 5,
  skipEmptyLines: true
});
```

---

### MicrosoftWordValidator

Validates `.docx` and `.doc` files: magic bytes (OLE2/ZIP), OOXML structure (`[Content_Types].xml`, `word/document.xml`), content rules (empty document, paragraph count, required text).

```typescript
import { microsoftWordValidator } from '@wlindabla/form_validator/validation/rules/file';

await microsoftWordValidator.validate(file, 'report', {
  allowedExtensions: ['docx', 'doc'],
  maxsizeFile: 10,
  unityMaxSizeFile: 'MiB',
  rejectEmptyDocument: true,
  minParagraphs: 3,
  allowLegacyDoc: true,
  requiredTextFragments: ['TERMS AND CONDITIONS', 'Signature']
});
```

---

### OdtValidator

Validates OpenDocument Format files (`.odt`, `.ods`, `.odp`, `.odg`, `.rtf`, etc.) and RTF: ZIP integrity, in-archive `mimetype` entry, `content.xml` validation, content rules.

```typescript
import { odtValidator } from '@wlindabla/form_validator/validation/rules/file';

await odtValidator.validate(file, 'document', {
  allowedExtensions: ['odt', 'ods', 'rtf'],
  maxsizeFile: 10,
  unityMaxSizeFile: 'MiB',
  rejectEmptyDocument: true,
  minParagraphs: 2,
  allowRtf: true,
  requiredTextFragments: ['Introduction']
});
```

---

## Central Router: FormInputValidator

`FormInputValidator` is the **facade** that dispatches any input to the correct specialized validator. Use it when you want to handle all types uniformly.

```typescript
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';

// Text
await formInputValidator.allTypesValidator('Alice', 'username', 'text', {
  minLength: 3, maxLength: 30, requiredInput: true
});

// Email
await formInputValidator.allTypesValidator('alice@example.com', 'email', 'email', {
  requiredInput: true
});

// Password
await formInputValidator.allTypesValidator('Secur3P@ss!', 'password', 'password', {
  minLength: 10, upperCaseAllow: true, symbolAllow: true
});

// Image file
await formInputValidator.allTypesValidator(file, 'photo', 'image', {
  maxsizeFile: 2, unityMaxSizeFile: 'MiB'
});

// Retrieve state
const v = formInputValidator.getValidator('username');
console.log(v?.formErrorStore.isFieldValid('username'));
console.log(v?.formErrorStore.getFieldErrors('username'));
```

**Supported `type_field` values:**

| Type | Input kind |
|------|-----------|
| `'text'` | Text input |
| `'email'` | Email input |
| `'password'` | Password input |
| `'tel'` | Phone number |
| `'url'` | URL input |
| `'date'` | Date input |
| `'textarea'` | Textarea |
| `'number'` | Numeric input |
| `'select'` | Select dropdown |
| `'checkbox'` | Checkbox group |
| `'radio'` | Radio group |
| `'image'` | Image file |
| `'video'` | Video file |
| `'pdf'` | PDF file |
| `'excel'` | Excel file |
| `'csv'` | CSV file |
| `'word'` | Word document |
| `'odf'` | ODF / RTF document |
| `'document'` | Auto-detected document |

---

## Form Orchestrator: FormValidateController

`FormValidateController` wraps an entire `<form>` element and manages all field validations, event grouping, and the optional cache adapter.

```typescript
import { FormValidateController } from '@wlindabla/form_validator';
import { LocalStorageCacheAdapter } from '@wlindabla/form_validator/cache';

const controller = new FormValidateController(
  '.registration-form',
  new LocalStorageCacheAdapter() // optional: cache validation options
);

// Get field IDs grouped by their trigger event
console.log(controller.idChildrenUsingEventBlur);     // fields with data-event-validate-blur
console.log(controller.idChildrenUsingEventInput);    // fields with data-event-validate-input
console.log(controller.idChildrenUsingEventChange);   // fields with data-event-validate-change

// Validate all fields (e.g. on form submit)
const isValid = await controller.isFormValid();

// Validate a single field
await controller.validateChildrenForm(inputElement);

// Clear a field's error state
controller.clearErrorDataChildren(inputElement);
```

---

## Error Store: FormErrorStore

The `FormErrorStore` is a **singleton** that acts as the single source of truth for all validation states. All validators read and write to it.

```typescript
import { formErrorStore } from '@wlindabla/form_validator/validation';

// Check form validity
formErrorStore.isFormValid(); // false if any field has errors

// Check a specific field
formErrorStore.isFieldValid('email');

// Get errors for a field
formErrorStore.getFieldErrors('email'); // string[]

// Manually set a field as invalid
formErrorStore.setFieldValid('email', false);
formErrorStore.addFieldError('email', 'Invalid format.');

// Clear a field's state
formErrorStore.clearFieldState('email');

// Remove a specific error
formErrorStore.removeFieldError('email', 'Invalid format.');
```

---

## Validation Events

`FieldInputController` dispatches two custom events on the parent `<form>` element after each field validation:

| Event name | When fired |
|-----------|-----------|
| `field:validation:failed` | Validation failed — `event.detail.message` contains the error array |
| `field:validation:success` | Validation passed |

**Event detail shape (`FieldValidationEventData`):**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Field `id` attribute |
| `name` | `string` | Field `name` attribute |
| `value` | `DataInput` | Current field value |
| `formParentName` | `string` | Parent form `name` attribute |
| `message` | `string[]` | Error messages (on failure) |
| `targetChildrenForm` | `HTMLElement` | The field element |

**Usage:**
```typescript
const form = document.querySelector('form[name="registrationForm"]')!;

form.addEventListener('field:validation:failed', (e: CustomEvent) => {
  const { name, message, targetChildrenForm } = e.detail;
  // Show errors next to the field
  const errorEl = document.getElementById(`${name}-error`);
  if (errorEl){
    errorEl.textContent = message.join(', ');
    or 
   controller.addErrorMessageChildrenForm(
    targetChildrenForm,
    message
   );
  } 
  targetChildrenForm.classList.add('is-invalid');
});

form.addEventListener('field:validation:success', (e: CustomEvent) => {
  const { name, targetChildrenForm } = e.detail;
  targetChildrenForm.classList.remove('is-invalid');
  targetChildrenForm.classList.add('is-valid');
});
```

---

## Cache Adapter

The `LocalStorageCacheAdapter` caches resolved validation options in `localStorage`, keyed by form name + field name. This avoids re-computing options from DOM attributes on every validation call.

```typescript
import { FormValidateController } from '@wlindabla/form_validator';
import { LocalStorageCacheAdapter } from '@wlindabla/form_validator/cache';

const controller = new FormValidateController(
  '.my-form',
  new LocalStorageCacheAdapter()
);
```

To implement a custom adapter (e.g. IndexedDB, session storage):

```typescript
import type { FieldOptionsValidateCacheAdapterInterface } from '@wlindabla/form_validator/validation/core/adapter';
import type { OptionsValidate } from '@wlindabla/form_validator/validation/core/router';

class SessionStorageAdapter implements FieldOptionsValidateCacheAdapterInterface {
  async getItem(key: string): Promise<OptionsValidate | undefined> {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  }
  async setItem(key: string, options: OptionsValidate): Promise<void> {
    sessionStorage.setItem(key, JSON.stringify(options));
  }
}
```

---

## HTML Attribute-Driven Validation

`FieldInputController` can infer all validation options directly from HTML `data-*` attributes, so you can configure validation entirely in your template without writing any JS.

**Core attributes:**

| Attribute | Purpose |
|-----------|---------|
| `type` | Input type (`text`, `email`, `password`, `url`, `date`, `tel`, `number`, `file`) |
| `data-type` | Override for custom types (`fqdn`, `textarea`) |
| `data-media-type` | For `type="file"`: `image`, `video`, `document` |
| `required` / `data-required` | Mark field as required |
| `data-event-validate` | Event that triggers validation (`blur`, `input`, `change`, `focus`) |
| `data-event-clear-error` | Event that clears errors (default: `input`) |
| `data-error-message-input` | Custom error message |
| `data-min-length` / `data-max-length` | Length constraints |
| `minLength` / `maxLength` | Native HTML length constraints |
| `pattern` / `data-flag-pattern` | Regex pattern + flags |
| `data-match-regex` | `true`/`false` — match or reject the pattern |
| `data-eg-await` | Example value shown in error |
| `data-escapestrip-html-and-php-tags` | Strip tags before validation |
| `data-default-country` | Country code for phone validation (e.g. `BJ`, `FR`) |
| `data-format-date` | Date format (e.g. `DD/MM/YYYY`) |
| `data-allow-future` / `data-allow-past` | Date range restriction |
| `data-min-date` / `data-max-date` | Min/max date boundaries |
| `data-extentions` | Comma-separated allowed file extensions |
| `data-allowed-mime-type-accept` | Comma-separated allowed MIME types |
| `data-maxsize-file` | Max file size (numeric) |
| `data-unity-max-size-file` | Size unit (`B`, `KiB`, `MiB`, `GiB`) |
| `data-min-width` / `data-max-width` | Image/video dimension constraints |
| `data-min-height` / `data-max-height` | Image/video dimension constraints |

**Example HTML form with attribute-driven validation:**

```html
<form name="contactForm" class="form-validate" novalidate>

  <!-- Text field -->
  <input
    id="fullName"
    name="fullName"
    type="text"
    required
    minLength="2"
    maxLength="100"
    data-event-validate="blur"
    data-error-message-input="Please enter your full name."
    data-eg-await="Jean Dupont"
  />

  <!-- Email field -->
  <input
    id="email"
    name="email"
    type="email"
    required
    data-event-validate="blur"
    data-allow-display-name="false"
    data-host-blacklist="tempmail.com,guerrillamail.com"
  />

  <!-- Phone field -->
  <input
    id="phone"
    name="phone"
    type="tel"
    required
    data-default-country="BJ"
    data-eg-await="+229 01 67 25 18 86"
    data-event-validate="blur"
  />

  <!-- Password -->
  <input
    id="password"
    name="password"
    type="password"
    required
    data-upper-case-allow="true"
    data-number-allow="true"
    data-symbol-allow="true"
    data-min-length="10"
    data-enable-scoring="true"
    data-event-validate="input"
  />

  <!-- Image upload -->
  <input
    id="avatar"
    name="avatar"
    type="file"
    data-media-type="image"
    data-extentions="jpg,jpeg,png,webp"
    data-maxsize-file="2"
    data-unity-max-size-file="MiB"
    data-max-width="2000"
    data-max-height="2000"
    data-event-validate="change"
  />

  <button type="submit">Submit</button>
</form>
```

```typescript
import { FormValidateController } from '@wlindabla/form_validator';

const controller = new FormValidateController('.form-validate');

// Attach blur/input/change listeners dynamically
controller.idChildrenUsingEventBlur.forEach(id => {
  document.getElementById(id)?.addEventListener('blur', async (e) => {
    await controller.validateChildrenForm(e.target as HTMLInputElement);
  });
});

// Submit handler
document.querySelector('form[name="contactForm"]')!
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    if (await controller.isFormValid()) {
      // Submit the form data
    }
  });
```

---

## Framework Integration Examples

### Vanilla JS / TypeScript

```typescript
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';

async function validateRegistrationForm(formData: {
  name: string;
  email: string;
  password: string;
  avatar: File;
}) {
  await formInputValidator.allTypesValidator(formData.name, 'name', 'text', {
    minLength: 2, maxLength: 100, requiredInput: true
  });

  await formInputValidator.allTypesValidator(formData.email, 'email', 'email', {
    requiredInput: true, hostBlacklist: ['tempmail.com']
  });

  await formInputValidator.allTypesValidator(formData.password, 'password', 'password', {
    minLength: 10, upperCaseAllow: true, symbolAllow: true
  });

  await formInputValidator.allTypesValidator(formData.avatar, 'avatar', 'image', {
    maxsizeFile: 2, unityMaxSizeFile: 'MiB',
    allowedExtensions: ['jpg', 'png', 'webp']
  });

  // Aggregate results
  const fields = ['name', 'email', 'password', 'avatar'];
  const errors: Record<string, string[]> = {};

  for (const field of fields) {
    const v = formInputValidator.getValidator(field);
    if (v && !v.formErrorStore.isFieldValid(field)) {
      errors[field] = v.formErrorStore.getFieldErrors(field);
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
```

---

### React / Next.js

```tsx
import React, { useRef, useState } from 'react';
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';

interface FormErrors {
  email?: string;
  password?: string;
  phone?: string;
}

export function LoginForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const validateField = async (
    fieldName: keyof FormErrors,
    value: string,
    type: string,
    options: object
  ) => {
    await formInputValidator.allTypesValidator(value, fieldName, type as any, options as any);
    const v = formInputValidator.getValidator(fieldName);
    const fieldErrors = v?.formErrorStore.getFieldErrors(fieldName) ?? [];
    setErrors(prev => ({ ...prev, [fieldName]: fieldErrors[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value ?? '';
    const password = passwordRef.current?.value ?? '';
    const phone = phoneRef.current?.value ?? '';

    await validateField('email', email, 'email', { requiredInput: true });
    await validateField('password', password, 'password', {
      minLength: 8, upperCaseAllow: true
    });
    await validateField('phone', phone, 'tel', {
      defaultCountry: 'BJ', requiredInput: true
    });

    const allValid = ['email', 'password', 'phone'].every(f => {
      const v = formInputValidator.getValidator(f);
      return v?.formErrorStore.isFieldValid(f) ?? true;
    });

    if (allValid) {
      console.log('Form is valid, submitting...');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <input
          ref={emailRef}
          type="email"
          name="email"
          placeholder="Email"
          onBlur={async (e) => {
            await validateField('email', e.target.value, 'email', { requiredInput: true });
          }}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          ref={passwordRef}
          type="password"
          name="password"
          placeholder="Password"
          onInput={async (e) => {
            const val = (e.target as HTMLInputElement).value;
            await validateField('password', val, 'password', {
              minLength: 8, upperCaseAllow: true, enableScoring: true
            });
          }}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <input
          ref={phoneRef}
          type="tel"
          name="phone"
          placeholder="+229 01 67 25 18 86"
          onBlur={async (e) => {
            await validateField('phone', e.target.value, 'tel', {
              defaultCountry: 'BJ', requiredInput: true
            });
          }}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
```

**File upload in React:**
```tsx
import { imageValidator } from '@wlindabla/form_validator/validation/rules/file';

function AvatarUpload() {
  const [error, setError] = useState<string>('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await imageValidator.validate(file, 'avatar', {
      allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
      allowedMimeTypeAccept: ['image/jpeg', 'image/png', 'image/webp'],
      maxsizeFile: 2,
      unityMaxSizeFile: 'MiB',
      maxWidth: 1500,
      maxHeight: 1500
    });

    const errors = imageValidator.formErrorStore.getFieldErrors('avatar');
    setError(errors[0] ?? '');
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

---

### Angular

```typescript
// validation.service.ts
import { Injectable } from '@angular/core';
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';
import type { OptionsValidate } from '@wlindabla/form_validator/validation/core/router';

@Injectable({ providedIn: 'root' })
export class FormValidationService {
  async validate(
    value: any,
    fieldName: string,
    type: string,
    options: OptionsValidate
  ): Promise<string[]> {
    await formInputValidator.allTypesValidator(value, fieldName, type as any, options);
    const v = formInputValidator.getValidator(fieldName);
    return v?.formErrorStore.getFieldErrors(fieldName) ?? [];
  }

  isValid(fieldName: string): boolean {
    const v = formInputValidator.getValidator(fieldName);
    return v?.formErrorStore.isFieldValid(fieldName) ?? true;
  }
}
```

```typescript
// register.component.ts
import { Component } from '@angular/core';
import { FormValidationService } from './validation.service';

@Component({
  selector: 'app-register',
  template: `
    <form (ngSubmit)="onSubmit()" novalidate>
      <div>
        <input
          type="email"
          name="email"
          [(ngModel)]="email"
          (blur)="validate('email', email, 'email', { requiredInput: true })"
        />
        <span *ngIf="errors['email']" class="error">{{ errors['email'][0] }}</span>
      </div>
      <div>
        <input
          type="password"
          name="password"
          [(ngModel)]="password"
          (input)="validate('password', password, 'password', { minLength: 8 })"
        />
        <span *ngIf="errors['password']" class="error">{{ errors['password'][0] }}</span>
      </div>
      <button type="submit">Register</button>
    </form>
  `
})
export class RegisterComponent {
  email = '';
  password = '';
  errors: Record<string, string[]> = {};

  constructor(private validationService: FormValidationService) {}

  async validate(field: string, value: any, type: string, options: any) {
    this.errors[field] = await this.validationService.validate(value, field, type, options);
  }

  async onSubmit() {
    await this.validate('email', this.email, 'email', { requiredInput: true });
    await this.validate('password', this.password, 'password', {
      minLength: 8, upperCaseAllow: true, symbolAllow: true
    });
    const valid = ['email', 'password'].every(f => !this.errors[f]?.length);
    if (valid) console.log('Submitting...');
  }
}
```

---

### Vue.js

```vue
<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <div>
      <input
        v-model="form.email"
        type="email"
        name="email"
        @blur="validateField('email', form.email, 'email', { requiredInput: true })"
      />
      <p v-if="errors.email" class="error">{{ errors.email }}</p>
    </div>

    <div>
      <input
        v-model="form.password"
        type="password"
        name="password"
        @input="validateField('password', form.password, 'password', { minLength: 8 })"
      />
      <p v-if="errors.password" class="error">{{ errors.password }}</p>
    </div>

    <div>
      <input
        type="file"
        accept="image/*"
        @change="handleFileChange"
      />
      <p v-if="errors.avatar" class="error">{{ errors.avatar }}</p>
    </div>

    <button type="submit">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';
import { imageValidator } from '@wlindabla/form_validator/validation/rules/file';

const form = reactive({ email: '', password: '' });
const errors = reactive<Record<string, string>>({});

async function validateField(name: string, value: any, type: string, options: any) {
  await formInputValidator.allTypesValidator(value, name, type, options);
  const v = formInputValidator.getValidator(name);
  const fieldErrors = v?.formErrorStore.getFieldErrors(name) ?? [];
  errors[name] = fieldErrors[0] ?? '';
}

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  await imageValidator.validate(file, 'avatar', {
    maxsizeFile: 2, unityMaxSizeFile: 'MiB',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp']
  });
  const fieldErrors = imageValidator.formErrorStore.getFieldErrors('avatar');
  errors['avatar'] = fieldErrors[0] ?? '';
}

async function handleSubmit() {
  await validateField('email', form.email, 'email', { requiredInput: true });
  await validateField('password', form.password, 'password', { minLength: 8 });

  const isValid = ['email', 'password', 'avatar'].every(f => !errors[f]);
  if (isValid) console.log('Submitting...');
}
</script>
```

---

### jQuery

```html
<script type="module">
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';
import { FormValidateController } from '@wlindabla/form_validator';

$(function () {
  const controller = new FormValidateController('.form-validate');

  // Blur validation for text/email/tel fields
  controller.idChildrenUsingEventBlur.forEach(id => {
    $(`#${id}`).on('blur', async function () {
      await controller.validateChildrenForm(this);
    });
  });

  // Input validation for password
  controller.idChildrenUsingEventInput.forEach(id => {
    $(`#${id}`).on('input', async function () {
      await controller.validateChildrenForm(this);
    });
  });

  // Listen to custom validation events
  $('form[name="registrationForm"]').on('field:validation:failed', function (e) {
    const { name, message } = e.originalEvent.detail;
    $(`#${name}-error`).text(message.join(', ')).show();
    $(`[name="${name}"]`).addClass('is-invalid');
    controller.addErrorMessageChildrenForm(
    targetChildrenForm,
    message
   );
  });

  $('form[name="registrationForm"]').on('field:validation:success', function (e) {
    const { name } = e.originalEvent.detail;
    $(`#${name}-error`).hide();
    $(`[name="${name}"]`).removeClass('is-invalid').addClass('is-valid');
  });

  // Submit
  $('form[name="registrationForm"]').on('submit', async function (e) {
    e.preventDefault();
    const isValid = await controller.isFormValid();
    if (isValid) $(this).unbind('submit').submit();
  });
});
</script>
```

---

### Symfony + Twig

Use HTML `data-*` attributes to configure validation, then initialize the controller in your main JS entry point.

**Twig template:**
```twig
{# templates/registration/register.html.twig #}
{{ form_start(registrationForm, {
    'attr': {
        'name': 'registrationForm',
        'class': 'form-validate',
        'novalidate': true
    }
}) }}

{{ form_row(registrationForm.email, {
    'attr': {
        'data-event-validate': 'blur',
        'data-host-blacklist': 'tempmail.com,guerrillamail.com',
        'data-error-message-input': 'Please enter a valid email address.'
    }
}) }}

{{ form_row(registrationForm.password.first, {
    'attr': {
        'data-event-validate': 'input',
        'data-upper-case-allow': 'true',
        'data-number-allow': 'true',
        'data-symbol-allow': 'true',
        'data-min-length': '10',
        'data-enable-scoring': 'true'
    }
}) }}

{{ form_row(registrationForm.avatar, {
    'attr': {
        'data-media-type': 'image',
        'data-extentions': 'jpg,jpeg,png,webp',
        'data-maxsize-file': '2',
        'data-unity-max-size-file': 'MiB',
        'data-max-width': '2000',
        'data-max-height': '2000',
        'data-event-validate': 'change'
    }
}) }}

<button type="submit">Register</button>
{{ form_end(registrationForm) }}
```

**assets/app.js:**
```javascript
import { FormValidateController } from '@wlindabla/form_validator';

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('form.form-validate')) return;

  const controller = new FormValidateController('.form-validate');

  // Attach events
  ['blur', 'input', 'change'].forEach(eventType => {
    const idList = {
      blur: controller.idChildrenUsingEventBlur,
      input: controller.idChildrenUsingEventInput,
      change: controller.idChildrenUsingEventChange,
    }[eventType];

    idList.forEach(id => {
      document.getElementById(id)?.addEventListener(eventType, async (e) => {
        await controller.validateChildrenForm(e.target);
      });
    });
  });

  // Validation events → Bootstrap classes
  document.querySelector('form.form-validate').addEventListener(
    'field:validation:failed', (e) => {
      const { targetChildrenForm, message } = e.detail;
      targetChildrenForm.classList.add('is-invalid');
      const feedback = targetChildrenForm.parentElement?.querySelector('.invalid-feedback');
      if (feedback) feedback.textContent = message.join(', ');

      controller.addErrorMessageChildrenForm(
        targetChildrenForm,
        message
        );
    }
  );

  document.querySelector('form.form-validate').addEventListener(
    'field:validation:success', (e) => {
      const { targetChildrenForm } = e.detail;
      targetChildrenForm.classList.remove('is-invalid');
      targetChildrenForm.classList.add('is-valid');
    }
  );

  // Submit
  document.querySelector('form.form-validate').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (await controller.isFormValid()) e.target.submit();
  });
});
```

---

## API Reference

### Exports Map

| Import path | Exports |
|-------------|---------|
| `@wlindabla/form_validator` | `FormValidateController` |
| `@wlindabla/form_validator/validation/core/router` | `formInputValidator`, `FormInputValidator`, `OptionsValidate` |
| `@wlindabla/form_validator/validation` | `formErrorStore`, `FormErrorStore` |
| `@wlindabla/form_validator/validation/rules/text` | `textInputValidator`, `emailInputValidator`, `passwordInputValidator`, `telInputValidator`, `urlInputValidator`, `fqdnInputValidator`, `dateInputValidator`, `numberInputValidator`, `textareaInputValidator` |
| `@wlindabla/form_validator/validation/rules/choice` | `selectValidator`, `checkboxValidator`, `radioValidator` |
| `@wlindabla/form_validator/validation/rules/file` | `imageValidator`, `videoValidator`, `pdfValidator`, `excelValidator`, `csvValidator`, `microsoftWordValidator`, `odtValidator` |
| `@wlindabla/form_validator/validation/core/adapter` | `FieldOptionsValidateCacheAdapterInterface` |
| `@wlindabla/form_validator/cache` | `LocalStorageCacheAdapter` |

### Common Methods on All Validators

| Method | Description |
|--------|-------------|
| `formErrorStore.isFieldValid(name)` | Returns `true` if no error recorded |
| `formErrorStore.getFieldErrors(name)` | Returns `string[]` of error messages |
| `formErrorStore.clearFieldState(name)` | Clears all state for a field |

---

## License

MIT © [AGBOKOUDJO Franck](https://github.com/Agbokoudjo) — INTERNATIONALES WEB APPS & SERVICES