# @wlindabla/form_validator

> **Powerful, framework-agnostic JavaScript/TypeScript form validation library**

A comprehensive form validation library for HTML forms supporting `text`, `email`, `tel`, `password`, `URL`, `date`, `number`, `select`, `ISBN`,`checkbox`, `radio`, **credit/debit card numbers** (CardSchemeValidator), and enriched file types: **images**, **PDFs**, **Word documents**, **Excel**, **CSV**, **ODF/RTF**, and **videos** — with binary signature inspection (magic bytes), real metadata validation, and a centralized error store.

**Author:** [AGBOKOUDJO Franck](https://www.linkedin.com/in/internationales-web-apps-services-120520193/)  
**Company:** INTERNATIONALES WEB APPS & SERVICES  
**GitHub:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator)  
**Issues:** [https://github.com/Agbokoudjo/form_validator/issues](https://github.com/Agbokoudjo/form_validator/issues)

---

## Table of Contents

- [@wlindabla/form\_validator](#wlindablaform_validator)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Architecture](#architecture)
  - [Quick Start](#quick-start)
    - [Using the Central Router (recommended)](#using-the-central-router-recommended)
    - [Using the Full Form Controller (HTML-driven)](#using-the-full-form-controller-html-driven)
  - [Text Validators](#text-validators)
    - [TextInputValidator](#textinputvalidator)
    - [TextareaValidator](#textareavalidator)
      - [Security Modes (Rich Text Support)](#security-modes-rich-text-support)
      - [HTML Attributes Configuration](#html-attributes-configuration)
    - [IsbnValidator](#isbnvalidator)
    - [Simple Usage](#simple-usage)
      - [Accept both formats](#accept-both-formats)
      - [Only ISBN-13](#only-isbn-13)
      - [Strict (no dashes/spaces)](#strict-no-dashesspaces)
      - [Optional field](#optional-field)
      - [Via the Central Router](#via-the-central-router)
      - [Avec FormValidateController (HTML-driven)](#avec-formvalidatecontroller-html-driven)
      - [Formats Acceptés](#formats-acceptés)
      - [Checksum Validation](#checksum-validation)
      - [Avec React](#avec-react)
      - [Avec Vue.js](#avec-vuejs)
    - [CardSchemeValidator](#cardschemevalidator)
      - [Simple Usage](#simple-usage-1)
      - [Accept multiple schemes](#accept-multiple-schemes)
      - [Accept any known scheme](#accept-any-known-scheme)
      - [Optional field](#optional-field-1)
      - [With spaces and hyphens (sanitize: true by default)](#with-spaces-and-hyphens-sanitize-true-by-default)
      - [Via the Central Router](#via-the-central-router-1)
      - [Via FormValidateController (HTML-driven)](#via-formvalidatecontroller-html-driven)
      - [Validation pipeline](#validation-pipeline)
      - [With React](#with-react)
      - [With Symfony + Twig](#with-symfony--twig)
      - [Static utility](#static-utility)
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
  - [Orchestrator: FormValidateController](#orchestrator-formvalidatecontroller)
  - [Error Store: FormErrorStore](#error-store-formerrorstore)
  - [Validation Events](#validation-events)
  - [Cache Adapter](#cache-adapter)
  - [HTML Attribute-Based Validation](#html-attribute-based-validation)
  - [Framework Integration](#framework-integration)
    - [Vanilla JS / TypeScript](#vanilla-js--typescript)
    - [React / Next.js](#react--nextjs)
    - [Angular](#angular)
    - [Vue.js](#vuejs)
    - [jQuery](#jquery)
    - [Symfony + Twig](#symfony--twig)
  - [API Reference](#api-reference)
    - [Exports Table](#exports-table)
    - [Methods Common to All Validators](#methods-common-to-all-validators)
    - [FormValidateController — Public Methods](#formvalidatecontroller--public-methods)
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

## Architecture

```
@wlindabla/form_validator
src/Validation/
├── Cache
│   └── index.ts
├── contracts
│   └── index.ts
├── Core
│   ├── Adapter
│   │   ├── AbstractFieldController.ts
│   │   ├── FieldInputController.ts
│   │   ├── FieldValidationEvent.ts
│   │   └── index.ts
│   ├── index.ts
│   └── Router
│       └── index.ts
├── FormValidateController.ts
├── index.ts
├── Rules
│   ├── Choice
│   │   └── index.ts
│   ├── FieldValidator.ts
│   ├── File
│   │   ├── AbstractMediaValidator.ts
│   │   ├── DocumentValidator.ts
│   │   ├── ImageValidator.ts
│   │   ├── index.ts
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
│       ├── TextInputValidator.ts
│       └── URLInputValidator.ts
├── Store
│   └── index.ts
└── types
    └── index.ts
```

**Key design principles:**
- **Singleton Validators** — each validator class exposes a single shared instance via `getInstance()`.
- **Centralized error store** — all validation results are stored in `FormErrorStore`, the single source of truth.
- **Event-driven** — validation results are dispatched as `CustomEvent` on the parent `<form>` element.
- **Framework-agnostic** — works with Vanilla JS, React, Angular, Vue, jQuery, or any server-side template.
- **Automatic document type detection** — `DocumentTypeResolver` automatically detects the real type of each uploaded file and applies the appropriate validator.

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

// Check the result
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
    data-event-validate-blur="blur"
    data-error-message-input="Please enter a valid email address."
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

Validates text fields with regex, length constraints, HTML/PHP tag stripping, and required field checking.

**Import:**
```typescript
import { textInputValidator, TextInputOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Options (`TextInputOptions`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `requiredInput` | `boolean` | `true` | Field is required |
| `minLength` | `number` | `1` | Minimum number of characters |
| `maxLength` | `number` | `255` | Maximum number of characters |
| `regexValidator` | `RegExp` | `/^\p{L}+$/iu` | Pattern to test |
| `match` | `boolean` | `true` | `true` = value must match the regex; `false` = must not match |
| `escapestripHtmlAndPhpTags` | `boolean` | `true` | Strip HTML/PHP tags before validation |
| `errorMessageInput` | `string` | — | Custom error message |
| `egAwait` | `string` | — | Example value shown in error |
| `typeInput` | `FormInputType` | `'text'` | Hint for error messages |

**Example:**
```typescript
textInputValidator.validate('John-Pierre', 'firstName', {
  minLength: 2,
  maxLength: 50,
  requiredInput: true,
  regexValidator: /^[\p{L}\s\-']+$/u,
  match: true,
  errorMessageInput: 'Only letters, spaces, hyphens and apostrophes.',
  egAwait: 'John-Pierre'
});

const errors = textInputValidator.formErrorStore.getFieldErrors('firstName');
```

---

### TextareaValidator

Delegates to `TextInputValidator` with `ignoreMergeWithDefaultOptions: true`. Use it for long text content.

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
#### Security Modes (Rich Text Support)

TextareaValidator now supports three security levels for HTML content:

| Mode | Purpose | Use Case |
|------|---------|----------|
| `'strict'` (default) | Rejects ALL HTML/PHP/JS | Plain text fields, comments |
| `'safe-html'` | Whitelist of tags without attributes | Simple blogs, forums |
| `'rich-text'` | HTML with controlled attributes | WYSIWYG editors (TinyMCE, Quill) |

**Example - Rich Text Mode:**
```typescript
textareaInputValidator.validate(
  userContent,
  'article_body',
  {
    typeInput: 'textarea',
    securityMode: 'rich-text',
    allowedHtmlTags: ['p', 'h1', 'h2', 'strong', 'em', 'a', 'img', 'blockquote', 'ul', 'li', 'ol'],
    allowedHtmlAttributes: {
      'a': ['href', 'title', 'target'],
      'img': ['src', 'alt', 'width', 'height'],
      'p': [],
      'h1': [],
      'h2': [],
      'strong': [],
      'em': [],
      'blockquote': [],
      'ul': [],
      'li': [],
      'ol': [],
      '*': [] // Other tags: no attributes allowed
    },
    sanitizeInsteadOfReject: true,
    minLength: 50,
    maxLength: 5000,
    requiredInput: true
  }
);
```

#### HTML Attributes Configuration

Configure textarea validation directly from HTML using `data-*` attributes:

**Method A: JSON in Single Attribute** (Recommended for small/medium configs)
```html
<textarea
  id="article"
  name="article_body"
  data-type="textarea"
  data-security-mode="rich-text"
  data-allowed-tags="p,h1,h2,strong,em,a,img,blockquote,ul,li,ol"
  data-allowed-html-attributes='{
    "a": ["href", "title", "target"],
    "img": ["src", "alt", "width", "height"],
    "p": [],
    "h1": [],
    "h2": [],
    "strong": [],
    "em": [],
    "blockquote": [],
    "ul": [],
    "li": [],
    "ol": [],
    "*": []
  }'
  data-sanitize-instead-of-reject="true"
  required
  minlength="50"
  maxlength="5000"
  data-event-validate="blur"
  data-event-validate-blur="blur"
></textarea>
```

**Method B: Granular Attributes** (Better for backend template generation)
```html
<textarea
  id="article"
  name="article_body"
  data-type="textarea"
  data-security-mode="rich-text"
  data-allowed-tags="p,h1,strong,em,a,img"
  data-allowed-attrs-for-p=""
  data-allowed-attrs-for-h1=""
  data-allowed-attrs-for-strong=""
  data-allowed-attrs-for-em=""
  data-allowed-attrs-for-a="href,title,target"
  data-allowed-attrs-for-img="src,alt,width,height"
  data-sanitize-instead-of-reject="true"
  required
  minlength="50"
  maxlength="5000"
></textarea>
```

**Method C: Global Configuration** (Best for multiple textareas)
```typescript
// Define once at app startup
window.TEXTAREA_CONFIGS = {
  'blog-post': {
    a: ['href', 'title', 'target'],
    img: ['src', 'alt', 'width', 'height'],
    p: [],
    h1: [],
    h2: [],
    strong: [],
    em: [],
    blockquote: [],
    ul: [],
    li: [],
    ol: [],
    '*': []
  },
  'forum-post': {
    strong: [],
    em: [],
    blockquote: [],
    '*': []
  }
};
```

```html
<!-- Use config by key -->
<textarea
  id="article"
  data-allowed-tags="p,h1,h2,strong,em,a,img,blockquote,ul,li,ol"
  data-allowed-attributes-key="blog-post"
  data-security-mode="rich-text"
  data-sanitize-instead-of-reject="true"
></textarea>
```
---

### IsbnValidator 

** ISBN Validator **

Validates ISBN-10 and ISBN-13 numbers with automatic checksum.

### Simple Usage

```typescript
import { isbnValidator } from '@wlindabla/form_validator/validation/rules/text';

// Validate an ISBN
isbnValidator.validate('978-3-16-148410-0', 'isbn', {
  type: 'isbn13',
  requiredInput: true
});

// Check the result
if (isbnValidator.formErrorStore.isFieldValid('isbn')) {
  console.log('✅ ISBN valide!');
} else {
  const errors = isbnValidator.formErrorStore.getFieldErrors('isbn');
  console.log('❌ Erreurs:', errors);
}
```

** Validation Options **
```typescript
interface IsbnOptions {
  // Type: 'isbn10' | 'isbn13' | 'both' (default)
  type?: 'isbn10' | 'isbn13' | 'both';

  // required
  requiredInput?: boolean;  // default: true

  // Custom error messages
  isbn10Message?: string;
  isbn13Message?: string;
  bothIsbnMessage?: string;

  // Example for the error message
  egAwait?: string;  // Ex: "978-3-16-148410-0"

 // Management of dashes/spaces
  allowHyphens?: boolean;   // default: true
  allowSpaces?: boolean;    // default: true
}
```

** Examples ** 

#### Accept both formats

```typescript
isbnValidator.validate(value, 'isbn', {
  type: 'both',
  requiredInput: true
});
```

#### Only ISBN-13 

```typescript
isbnValidator.validate(value, 'isbn', {
  type: 'isbn13',
  requiredInput: true,
  isbn13Message: 'Enter a valid ISBN-13'
});
```

#### Strict (no dashes/spaces)

```typescript
isbnValidator.validate(value, 'isbn', {
  type: 'isbn10',
  allowHyphens: false,
  allowSpaces: false
});
```

#### Optional field

```typescript
isbnValidator.validate(value, 'isbn', {
  type: 'both',
  requiredInput: false
});
```

#### Via the Central Router

```typescript
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';

await formInputValidator.allTypesValidator(
  '978-3-16-148410-0',
  'myIsbn',
  'isbn13',
  { requiredInput: true }
);
```

#### Avec FormValidateController (HTML-driven)

```html
<form name="myForm" class="form-validate" novalidate>
  <input
    id="isbn"
    name="isbn"
    type="text"
    required
    data-type="isbn"
    data-type-isbn="isbn13"
    data-event-validate="blur"
    data-event-validate-blur="blur"
    data-error-message-input="ISBN invalide"
    placeholder="978-3-16-148410-0"
  />
  <button type="submit">Valider</button>
</form>
```

#### Formats Acceptés

**ISBN-10:**
- `0306406152` (sans tirets)
- `0-306-40615-2` (avec tirets)
- `043942089X` (avec X comme checksum)

**ISBN-13:**
- `9783161484100` (sans tirets)
- `978-3-16-148410-0` (avec tirets)
- `978 3 16 148410 0` (avec espaces)

#### Checksum Validation

Le validateur vérifie automatiquement que la checksum est correcte:

```typescript
isbnValidator.validate('9783161484100', 'isbn', { type: 'isbn13' });
// ✅ Valide (checksum correcte)

isbnValidator.validate('9783161484101', 'isbn', { type: 'isbn13' });
// ❌ Invalide (checksum incorrecte)
```

#### Avec React

```typescript
import { useState } from 'react';
import { isbnValidator } from '@wlindabla/form_validator/validation/rules/text';

function IsbnInput() {
  const [isbn, setIsbn] = useState('');
  const [error, setError] = useState('');

  const validateIsbn = (value: string) => {
    isbnValidator.validate(value, 'isbn', { type: 'both' });
    const errors = isbnValidator.formErrorStore.getFieldErrors('isbn');
    setError(errors[0] || '');
  };

  return (
    <div>
      <input
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        onBlur={() => validateIsbn(isbn)}
        placeholder="978-3-16-148410-0"
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

#### Avec Vue.js

```vue
<template>
  <div>
    <input
      v-model="isbn"
      @blur="validateIsbn"
      placeholder="978-3-16-148410-0"
    />
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { isbnValidator } from '@wlindabla/form_validator/validation/rules/text';

const isbn = ref('');
const error = ref('');

const validateIsbn = () => {
  isbnValidator.validate(isbn.value, 'isbn', { type: 'both' });
  const errors = isbnValidator.formErrorStore.getFieldErrors('isbn');
  error.value = errors[0] || '';
};
</script>
```

---

### CardSchemeValidator

Validates credit and debit card numbers against one or more card schemes.
Inspired by Symfony's `CardScheme` constraint — same scheme registry, same two-step pipeline: numeric guard → scheme regex match.

> **Note on Luhn:** Unlike some third-party libraries, `CardSchemeValidator` does **not** run the Luhn checksum by default — consistent with Symfony's `CardSchemeValidator` philosophy. The constraint validates the **format** of the number, not its real-world existence. Luhn verification is the responsibility of the payment gateway (Stripe, PayPal, etc.).

**Supported schemes:**

| Constant | Description |
|----------|-------------|
| `AMEX` | American Express — starts with 34 or 37, 15 digits |
| `CHINA_UNIONPAY` | China UnionPay — starts with 62, 16–19 digits. **Luhn-exempt** |
| `DINERS` | Diners Club — starts with 300–305, 36 or 38, 14 digits |
| `DISCOVER` | Discover — starts with 6011, 622126–622925, 644–649 or 65, 16 digits |
| `INSTAPAYMENT` | InstaPayment — starts with 637–639, 16 digits |
| `JCB` | JCB — starts with 2131, 1800 (15 digits) or 35xxxx (16 digits) |
| `LASER` | Laser — starts with 6304, 6706, 6709 or 6771, 16–19 digits |
| `MAESTRO` | Maestro — various prefixes, 12–19 digits |
| `MASTERCARD` | MasterCard — starts with 51–55 or 222100–272099, 16 digits |
| `MIR` | MIR (Russia) — starts with 2200–2204, 16–19 digits |
| `UATP` | UATP — starts with 1, 15 digits |
| `VISA` | Visa — starts with 4, 13, 16 or 19 digits |

**Import:**
```typescript
import { cardSchemeValidator } from '@wlindabla/form_validator/validation/rules/text';
```

**Options (`CardSchemeOptions`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `schemes` | `CardSchemeType \| CardSchemeType[]` | `[]` (all) | Scheme(s) to validate against. Empty = all known schemes |
| `requiredInput` | `boolean` | `true` | Field is required |
| `errorMessageInput` | `string` | `'Unsupported card type or invalid card number.'` | Custom error message |
| `egAwait` | `string` | — | Example value shown in error message |
| `sanitize` | `boolean` | `true` | Strip spaces and hyphens before validation |
| `luhnCheck` | `boolean` | `false` | Run Luhn checksum after format validation (opt-in) |

#### Simple Usage

```typescript
import { cardSchemeValidator } from '@wlindabla/form_validator/validation/rules/text';

// Validate a VISA card
cardSchemeValidator.validate('4111111111111111', 'cardNumber', {
    schemes: 'VISA',
    requiredInput: true,
});

if (cardSchemeValidator.formErrorStore.isFieldValid('cardNumber')) {
    console.log('Valid VISA card!');
} else {
    console.log(cardSchemeValidator.formErrorStore.getFieldErrors('cardNumber'));
}
```

#### Accept multiple schemes

```typescript
cardSchemeValidator.validate('5500005555555559', 'cardNumber', {
    schemes: ['VISA', 'MASTERCARD'],
    egAwait: '4111 1111 1111 1111',
});
```

#### Accept any known scheme

```typescript
// No schemes restriction → validates against all 12 known schemes
cardSchemeValidator.validate('378282246310005', 'cardNumber', {
    requiredInput: true,
});
```

#### Optional field

```typescript
cardSchemeValidator.validate(undefined, 'cardNumber', {
    requiredInput: false,
    schemes: ['VISA', 'MASTERCARD'],
});
// → valid (field is not required and value is empty)
```

#### With spaces and hyphens (sanitize: true by default)

```typescript
// These three calls are strictly equivalent
cardSchemeValidator.validate('4111 1111 1111 1111', 'cardNumber', { schemes: 'VISA' });
cardSchemeValidator.validate('4111-1111-1111-1111', 'cardNumber', { schemes: 'VISA' });
cardSchemeValidator.validate('4111111111111111',    'cardNumber', { schemes: 'VISA' });
```

#### Via the Central Router

```typescript
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';

await formInputValidator.allTypesValidator(
    '4111111111111111',
    'cardNumber',
    'card',
    { schemes: ['VISA', 'MASTERCARD'], requiredInput: true }
);

const validator = formInputValidator.getValidator('cardNumber');
console.log(validator?.formErrorStore.isFieldValid('cardNumber')); // true
```

#### Via FormValidateController (HTML-driven)

```html
<form name="paymentForm" class="form-validate" novalidate>
  <input
    id="cardNumber"
    name="cardNumber"
    type="text"
    data-type="card"
    required
    data-card-schemes="VISA,MASTERCARD"
    data-card-sanitize="true"
    data-eg-await="4111 1111 1111 1111"
    data-error-message-input="Please enter a valid VISA or Mastercard number."
    data-event-validate="blur"
    data-event-validate-blur="blur"
  />
</form>
```

#### Validation pipeline

```
Input value
    │
    ├─ 1. Clear previous state
    ├─ 2. Required check          → empty + required  → NOT_NUMERIC_ERROR
    ├─ 3. XSS guard               → escapeHtmlBalise()
    ├─ 4. Sanitize                → strip spaces / hyphens (if sanitize: true)
    ├─ 5. Numeric guard           → /^[0-9]+$/  → NOT_NUMERIC_ERROR
    ├─ 6. Scheme regex match      → test each scheme's patterns
    │         no match            → INVALID_FORMAT_ERROR
    └─ 7. Luhn checksum (opt-in)  → only if luhnCheck: true AND scheme not LUHN-exempt
              fail                → INVALID_FORMAT_ERROR
              pass                → ✅ valid
```

#### With React

```tsx
import { cardSchemeValidator } from '@wlindabla/form_validator/validation/rules/text';
import { useState } from 'react';

function CardField() {
    const [error, setError] = useState('');

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        cardSchemeValidator.validate(e.target.value, 'cardNumber', {
            schemes: ['VISA', 'MASTERCARD'],
        });
        const errors = cardSchemeValidator.formErrorStore.getFieldErrors('cardNumber');
        setError(errors[0] ?? '');
    };

    return (
        <div>
            <input type="text" name="cardNumber" onBlur={handleBlur} />
            {error && <span className="error">{error}</span>}
        </div>
    );
}
```

#### With Symfony + Twig

```twig
{{ form_row(paymentForm.cardNumber, {
    'attr': {
        'data-type': 'card',
        'data-card-schemes': 'VISA,MASTERCARD',
        'data-card-sanitize': 'true',
        'data-eg-await': '4111 1111 1111 1111',
        'data-error-message-input': 'Please enter a valid VISA or Mastercard number.',
        'data-event-validate': 'blur',
        'data-event-validate-blur': 'blur'
    }
}) }}
```

#### Static utility

```typescript
// Run Luhn only — without the full validator pipeline
const isLuhnValid = CardSchemeValidator.luhnCheck('4111111111111111');
console.log(isLuhnValid); // true

// Inspect the full scheme registry
const allSchemes = CardSchemeValidator.schemes;
console.log(Object.keys(allSchemes));
// ['AMEX', 'CHINA_UNIONPAY', 'DINERS', ...]
```



### EmailInputValidator

Full RFC-compliant validation: regex, display names, FQDN domain check, UTF-8 local parts, host blacklists/whitelists.

**Import:**
```typescript
import { emailInputValidator, EmailInputOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Key Options (`EmailInputOptions`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowUtf8LocalPart` | `boolean` | `true` | Allow Unicode in local part |
| `allowIpDomain` | `boolean` | `false` | Allow IP domains |
| `allowDisplayName` | `boolean` | `false` | Allow `"John Doe <john@example.com>"` format |
| `requireDisplayName` | `boolean` | `false` | Require display name |
| `hostBlacklist` | `(string\|RegExp)[]` | `[]` | Blocked domains |
| `hostWhitelist` | `(string\|RegExp)[]` | `[]` | Allowed domains only |
| `blacklistedChars` | `string` | `''` | Forbidden characters in local part |
| `ignoreMaxLength` | `boolean` | `false` | Ignore max length check |

**Example:**
```typescript
await emailInputValidator.validate('john.doe@example.com', 'userEmail', {
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

Validates passwords based on character rules (uppercase, lowercase, digits, symbols, punctuation), length, and optional strength scoring. Triggers a `CustomEvent` with the score if enabled.

**Import:**
```typescript
import { passwordInputValidator, PassworkRuleOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Key Options (`PasswordRuleOptions`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minLength` | `number` | `8` | Minimum length |
| `maxLength` | `number` | `256` | Maximum length |
| `upperCaseAllow` | `boolean` | `true` | Require uppercase letter |
| `lowerCaseAllow` | `boolean` | `true` | Require lowercase letter |
| `numberAllow` | `boolean` | `true` | Require digit |
| `symbolAllow` | `boolean` | `true` | Require special character |
| `enableScoring` | `boolean` | `true` | Trigger score event |
| `regexValidator` | `RegExp` | strong regex | Override pattern |

**Scoring Event:**
```typescript
document.addEventListener('scoreAnalysisPassword', (e: CustomEvent) => {
  const { score, analysis, input } = e.detail;
  console.log(`Field: ${input}, Strength score: ${score}`);
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

Validates international phone numbers via [`libphonenumber-js`](https://gitlab.com/catamphetamine/libphonenumber-js). Automatically formats valid numbers in the DOM field.

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

// French number:
telInputValidator.validate('+33612345678', 'mobile', {
  defaultCountry: 'FR',
  minLength: 10,
  maxLength: 20
});
```

> The number must start with `+`. The validator automatically formats valid numbers into international format (e.g. `+229 01 67 25 18 86`).

---

### URLInputValidator

Validates URLs against protocol rules, host, IP, localhost, query parameters, fragments, port, auth credentials, and blacklists/whitelists.

**Import:**
```typescript
import { urlInputValidator, URLOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Key Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowedProtocols` | `string[]` | `['http','https','file','blob','url','data']` | Accepted protocols |
| `requireProtocol` | `boolean` | `false` | URL must include a protocol |
| `requireValidProtocol` | `boolean` | `true` | Protocol must be in `allowedProtocols` |
| `allowLocalhost` | `boolean` | `false` | Allow `localhost` / `127.0.0.1` |
| `allowIP` | `boolean` | `false` | Allow IP hosts |
| `allowQueryParams` | `boolean` | `true` | Allow `?key=value` |
| `allowHash` | `boolean` | `true` | Allow `#fragment` |
| `disallowAuth` | `boolean` | `false` | Reject `user:pass@host` |
| `maxAllowedLength` | `number` | `2048` | Max URL length |
| `hostBlacklist` | `(string\|RegExp)[]` | `[]` | Blocked hosts |
| `hostWhitelist` | `(string\|RegExp)[]` | `[]` | Allowed hosts only |

**Example:**
```typescript
await urlInputValidator.validate('https://example.com/catalogue', 'website', {
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

dateInputValidator.validate('12/25/1990', 'birthdate', {
  format: 'MM/DD/YYYY',
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

// Single selection
selectValidator.validate('en', 'country', {
  optionsChoices: ['fr', 'en', 'bj', 'de']
});

// Multiple selection
selectValidator.validate(['react', 'vue'], 'frameworks', {
  optionsChoices: ['react', 'vue', 'angular', 'svelte']
});
```

---

### CheckBoxValidator

Validates checkbox groups: required state, min/max number of selections.

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

Validates that a radio button group has a selection when required.

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
  maxsizeFile: 2,
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

Validates video files with binary signature check, MIME type, and metadata (duration, width, height) via a hidden `<video>` element.

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
  maxHeight: 1080
});
```

---

### PdfValidator

Validates PDF files: magic bytes (`%PDF` = `25504446`), MIME type, and page count via `pdfjs-dist`.

**Validation pipeline:**
1. Extension (`.pdf`)
2. MIME type (soft check)
3. Binary signature (`25504446`)
4. PDF structure via `pdfjs-dist` (page count > 0)

```typescript
import { pdfValidator } from '@wlindabla/form_validator/validation/rules/file';

await pdfValidator.validate(file, 'contract', {
  allowedExtensions: ['pdf'],
  allowedMimeTypeAccept: ['application/pdf', 'application/x-pdf'],
  maxsizeFile: 10,
  unityMaxSizeFile: 'MiB'
});
```

---

### ExcelValidator

Validates Excel files (`.xls`/`.xlsx`): magic bytes (OLE2 or ZIP), MIME type (soft cross-platform check), workbook structure via SheetJS, sheet count, required columns.

**Cross-platform note:** Windows may report `application/vnd.ms-excel` for both `.xls` AND `.xlsx`. Linux/macOS sometimes report `application/octet-stream` for `.xls`. Magic bytes are therefore the authoritative format check.

**Magic bytes:**
- `d0cf11e0`: OLE2 Compound Document (`.xls`)
- `504b0304`: ZIP local file header (`.xlsx`)

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

**Options (`OptionsExcelFile`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minSheets` | `number` | `1` | Minimum number of sheets |
| `maxSheets` | `number` | — | Maximum number of sheets |
| `requiredColumns` | `string[]` | `[]` | Required columns in target sheet |
| `rejectEmptySheet` | `boolean` | `true` | Reject sheet with no data |
| `sheetIndex` | `number` | `0` | Target sheet index (0 = first) |

---

### CsvValidator

Validates CSV files: binary/BOM pre-check, structural parsing via PapaParse, required headers, row count, per-column type validation.

**Supported column types:** `'string'`, `'number'`, `'date'`, `'boolean'`, `'email'`

**Cross-platform note:** Windows reports `text/csv`, macOS reports `text/csv` or `text/comma-separated-values`, Linux reports `text/plain` or `application/csv`. MIME is treated as a warning only.

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

**Options (`OptionsCsvFile`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `requiredHeaders` | `string[]` | `[]` | Required headers |
| `columnTypes` | `Record<string, CsvColumnType>` | `{}` | Expected type per column |
| `useFirstLineAsHeaders` | `boolean` | `true` | First line = headers |
| `skipEmptyLines` | `boolean` | `true` | Skip empty lines |
| `delimiter` | `string` | auto-detected | Column separator |
| `minRows` | `number` | `1` | Minimum number of data rows |
| `maxRows` | `number` | — | Maximum number of data rows |
| `maxRowErrors` | `number` | `2` | Stop after N row errors |
| `worker` | `boolean` | `false` | Use PapaParse Web Worker |

---

### MicrosoftWordValidator

Validates `.docx` and `.doc` files: magic bytes (OLE2/ZIP), OOXML structure (`[Content_Types].xml`, `word/document.xml`), content rules (empty document, paragraph count, required text).

**Validation pipeline:**

```
1. Extension          .docx / .doc
2. File size
3. MIME type          (soft warning — unreliable across OS)
4. Magic bytes        OLE2 (d0cf11e0) | ZIP/PK (504b0304)
5. .docx only — ZIP integrity (JSZip)
6. .docx only — OOXML structure ([Content_Types].xml present)
7. .docx only — word/document.xml present and parseable
8. .docx only — Content rules (empty doc, minParagraphs, …)
9. .docx only — requiredTextFragments
```

> **Note:** `.doc` files stop at step 4. The OLE2 format is a proprietary binary format that cannot be reliably inspected in the browser.

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

**Options (`OptionsWordFile`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rejectEmptyDocument` | `boolean` | `true` | Reject document with no text |
| `minParagraphs` | `number` | — | Minimum number of paragraphs |
| `allowLegacyDoc` | `boolean` | `true` | Allow `.doc` (OLE2) files |
| `requiredTextFragments` | `string[]` | `[]` | Required text fragments in document |

---

### OdtValidator

Validates OpenDocument Format files (`.odt`, `.ods`, `.odp`, `.odg`, `.rtf`, etc.): ZIP integrity, internal `mimetype` entry, `content.xml`, content rules.

**Supported formats:**

| Extension | Format |
|-----------|--------|
| `.odt` | OpenDocument Text (LibreOffice Writer) |
| `.ott` | ODT Template |
| `.ods` | OpenDocument Spreadsheet (LibreOffice Calc) |
| `.ots` | ODS Template |
| `.odp` | OpenDocument Presentation (LibreOffice Impress) |
| `.otp` | ODP Template |
| `.odg` | OpenDocument Drawing (LibreOffice Draw) |
| `.rtf` | Rich Text Format |

**ODF validation pipeline:**

```
1. Extension
2. File size
3. MIME type (soft warning)
4. Magic bytes: ODF → 504b0304 (ZIP) | RTF → 7b5c7274 ({\rt)
5. ZIP integrity (JSZip)
6. Internal "mimetype" entry — ODF self-identification
7. "mimetype" matches declared extension
8. content.xml present and valid XML
9. Content rules (empty doc, minParagraphs, requiredFragments)
```

> **Key insight:** Every ODF file stores its exact MIME type as an UNCOMPRESSED entry named `mimetype` at the beginning of the ZIP archive. This is the most reliable format identifier — more trustworthy than the OS-reported `file.type` or even the extension.

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

**Options (`OptionsOdfFile`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rejectEmptyDocument` | `boolean` | `true` | Reject document with no text |
| `minParagraphs` | `number` | — | Minimum number of paragraphs |
| `allowRtf` | `boolean` | `true` | Allow `.rtf` files |
| `requiredTextFragments` | `string[]` | `[]` | Required text fragments |

---

## Central Router: FormInputValidator

`FormInputValidator` is the **façade** that dispatches any input to the correct specialized validator. Use it when you want to handle all types uniformly.

```typescript
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';

// Text
await formInputValidator.allTypesValidator('Alice', 'username', 'text', {
  minLength: 3, maxLength: 30, requiredInput: true
});
//ISBN 13
await formInputValidator.allTypesValidator(
  '978-3-16-148410-0',
  'myIsbn',
  'isbn',
  { requiredInput: true,type: "isbn13" }
);
//ISBN both
await formInputValidator.allTypesValidator(
  '9783161484100',
  'myIsbn',
  'isbn',
  { requiredInput: false,type: "both" }
);
//ISBN 10
await formInputValidator.allTypesValidator(
  '0-306-40615-2',
  'myIsbn',
  'isbn',
  { requiredInput: false,type: "isbn10",
   allowHyphens: false,
  allowSpaces: false }
);
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

// Get state
const v = formInputValidator.getValidator('username');
console.log(v?.formErrorStore.isFieldValid('username'));
console.log(v?.formErrorStore.getFieldErrors('username'));
```

**Supported `type_field` values:**

| Type | Input nature |
|------|--------------|
| `'text'` | Text field |
| `'email'` | Email field |
| `'isbn'` |ISBN type to validate field |
| `'password'` | Password field |
| `'tel'` | Phone number |
| `'url'` | URL field |
| `'fqdn'` | FQDN field |
| `'date'` | Date field |
| `'textarea'` | Text area |
| `'number'` | Numeric field |
| `'select'` | Dropdown list |
| `'checkbox'` | Checkbox group |
| `'radio'` | Radio button group |
| `'image'` | Image file |
| `'video'` | Video file |
| `'pdf'` | PDF file |
| `'excel'` | Excel file |
| `'csv'` | CSV file |
| `'word'` | Word document |
| `'odf'` | ODF / RTF document |
| `'document'` | Auto-detected document |

> **Note on the `'document'` type:** When using the `'document'` type via `FieldInputController`, the system uses `DocumentTypeResolver` to automatically detect the real type of each file (pdf, excel, csv, word, odf) by its extension and applies the appropriate validator. This allows handling fields that accept multiple document types in a single input.

---

## Orchestrator: FormValidateController

`FormValidateController` encapsulates an entire `<form>` element and manages all field validations, event grouping, and an optional cache adapter.

**Important changes from the previous version:**
- No more jQuery dependency — uses only the native DOM API.
- New `isFormValid()` method to validate the entire form at once.
- The `form` property now returns a native `HTMLFormElement` (no longer a jQuery object).
- `addErrorMessageChildrenForm` now accepts a native `HTMLElement`.
- Event attributes are now `data-event-validate-blur`, `data-event-validate-input`, etc.

```typescript
import { FormValidateController } from '@wlindabla/form_validator';
import { LocalStorageCacheAdapter } from '@wlindabla/form_validator/validation/cache';

const controller = new FormValidateController(
  '.registration-form',
  new LocalStorageCacheAdapter() // optional: caches validation options
);
or 
import {SessionStorageCacheAdapter} from from '@wlindabla/form_validator/validation/cache' ;
const controller = new FormValidateController(
  '.registration-form',
  new SessionStorageCacheAdapter() // by default: caches validation options
);
// Field IDs grouped by trigger event
console.log(controller.idChildrenUsingEventBlur);      // data-event-validate-blur
console.log(controller.idChildrenUsingEventInput);     // data-event-validate-input
console.log(controller.idChildrenUsingEventChange);    // data-event-validate-change
console.log(controller.idChildrenUsingEventDragenter); // data-event-validate-dragenter
console.log(controller.idChildrenUsingEventDrop); // data-event-validate-drop
console.log(controller.idChildrenUsingEventFocus);     // data-event-validate-focus

// Validate all fields (e.g. on submit)
const isValid = await controller.isFormValid();

// Validate a single field
await controller.validateChildrenForm(inputElement);

// Display errors for a field
controller.addErrorMessageChildrenForm(
  targetElement,
  ['Error message'],
  'container-div-error-message' // optional error container className
);

// Clear error state for a field
controller.clearErrorDataChildren(inputElement);
```

---

## Error Store: FormErrorStore

The `FormErrorStore` is a **singleton** that acts as the single source of truth for all validation states. All validators read from and write to it.

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

// Clear state for a field
formErrorStore.clearFieldState('email');

// Remove a specific error
formErrorStore.removeFieldError('email', 'Invalid format.');
```

---

## Validation Events

`FieldInputController` dispatches two custom events on the parent `<form>` element after each field validation:

| Event name | When triggered |
|------------|----------------|
| `field:validation:failed` | Validation failed — `event.detail.message` contains the error array |
| `field:validation:success` | Validation succeeded |

**Event detail structure (`FieldValidationEventData`):**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Field `id` attribute |
| `name` | `string` | Field `name` attribute |
| `value` | `DataInput` | Current field value |
| `formParentName` | `string` | Parent form `name` attribute |
| `message` | `string[]` | Error messages (on failure) |
| `targetChildrenForm` | `HTMLElement` | The field DOM element |

**Usage:**
```typescript
const form = document.querySelector('form[name="registrationForm"]')!;

form.addEventListener('field:validation:failed', (e: CustomEvent) => {
  const { name, message, targetChildrenForm } = e.detail;

  // Display errors via the controller
  controller.addErrorMessageChildrenForm(
    targetChildrenForm,
    message,
    'container-div-error-message'
  );

  targetChildrenForm.classList.add('is-invalid');
});

form.addEventListener('input', (event) => {
        const target = event.target;
        if ((target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement)
             && target.type !== "file") {

            controller.clearErrorDataChildren(target);
           
        }
    });

form.addEventListener('field:validation:success', (e: CustomEvent) => {
  const { targetChildrenForm } = e.detail;
  targetChildrenForm.classList.remove('is-invalid');
  targetChildrenForm.classList.add('is-valid');
});
```

---

## Cache Adapter

The `LocalStorageCacheAdapter` caches resolved validation options in `localStorage`, indexed by form name + field name. This avoids recalculating options from DOM attributes on each validation call.

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

## HTML Attribute-Based Validation

`FieldInputController` can infer all validation options directly from `data-*` HTML attributes, allowing you to configure validation entirely in your template without writing any JS.

**Main attributes:**

| Attribute | Role |
|-----------|------|
| `type` | Input type (`text`, `email`, `password`, `url`, `date`, `tel`, `number`, `file`) |
| `data-type` | Override for custom types (`fqdn`, `textarea`,`isbn`) |
| `data-media-type` | For `type="file"`: `image`, `video`, `document` |
| `required` / `data-required` | Required field |
| `data-event-validate` | Event triggering validation (`blur`, `input`, `change`, `focus`) |
| `data-event-validate-blur` | Register field in blur group |
| `data-event-validate-input` | Register field in input group |
| `data-event-validate-change` | Register field in change group |
| `data-event-validate-dragenter` | Register field in dragenter group (files) |
| `data-event-clear-error` | Event that clears errors (default: `change`) |
| `data-error-message-input` | Custom error message |
| `data-min-length` / `data-max-length` | Length constraints |
| `minLength` / `maxLength` | Native HTML length constraints |
| `pattern` / `data-flag-pattern` | Regex pattern + flags |
| `data-match-regexp` | `true`/`false` — match or reject the pattern |
| `data-eg-await` | Example value shown in the error |
| `data-escapestrip-html-and-php-tags` | Strip tags before validation |
| `data-default-country` | Country code for phone validation (e.g. `US`, `FR`) |
| `data-format-date` | Date format (e.g. `MM/DD/YYYY`) |
| `data-allow-future` / `data-allow-past` | Date range restriction |
| `data-min-date` / `data-max-date` | Min/max date limits |
| `data-extentions` | Allowed file extensions (comma-separated) |
| `data-allowed-mime-type-accept` | Allowed MIME types (comma-separated) |
| `data-maxsize-file` | Max file size (numeric) |
| `data-unity-max-size-file` | Size unit (`B`, `KiB`, `MiB`, `GiB`) |
| `data-min-width` / `data-max-width` | Image/video dimension constraints |
| `data-min-height` / `data-max-height` | Image/video dimension constraints |
| `data-required-columns` | Required columns for Excel (comma-separated) |
| `data-required-headers` | Required headers for CSV (comma-separated) |
| `data-column-types` | JSON of CSV column types e.g. `{"Age":"number","Email":"email"}` |
| `data-reject-empty-sheet` | Reject empty Excel sheet (default: `true`) |
| `data-min-sheets` | Minimum number of Excel sheets |
| `data-required-text-fragments` | Required text fragments in Word/ODF (JSON array or CSV) |
| `data-reject-empty-document` | Reject empty Word/ODF document (default: `true`) |
| `data-min-paragraphs` | Minimum number of paragraphs in Word/ODF |
| `data-allow-rtf` | Allow RTF files in OdtValidator (default: `true`) |
| `data-allow-legacy-doc` | Allow `.doc` files in MicrosoftWordValidator (default: `true`) |
| `data-security-mode` | Security level for textarea: 'strict', 'safe-html', or 'rich-text' (default: `'strict'`) |
| `data-allowed-tags` | Comma-separated list of allowed HTML tags for rich-text mode |
| `data-allowed-html-attributes` | JSON object mapping tags to allowed attributes |
| `data-allowed-attrs-for-*` | Per-tag configuration (e.g. `data-allowed-attrs-for-a="href,title"`) |
| `data-allowed-attributes-key` | Reference key to global TEXTAREA_CONFIGS object |
| `data-sanitize-instead-of-reject` | Auto-sanitize invalid HTML instead of rejecting (default: `false`) |
| ` data-type-isbn` | ISBN type to validate: 'isbn10', 'isbn13', or 'both' (default: `both`) |
| `data-isbn-10-message` | Custom error message for ISBN-10 validation |
| `data-isbn-13-message` |Custom error message for ISBN-13 validation |
| `data-isbn-both-message` | Custom error message when both formats fail |
| `data-allow-hyphens` | Whether to allow hyphens and spaces (default: `true`)|
| `data-allow-spaces` | Whether to allow hyphens and spaces (default: `true`)|
| `data-type` | `"card"` | For card number fields: set `data-type="card"` |
| `data-card-schemes` | Comma-separated `CardSchemeType` | Schemes to validate against e.g. `"VISA,MASTERCARD"` |
| `data-card-sanitize` | `"true"` / `"false"` | Strip spaces and hyphens before validation (default: `true`) |

**Full HTML form example with attribute-based validation:**

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
    data-event-validate-blur="blur"
    data-error-message-input="Please enter your full name."
    data-eg-await="John Doe"
  />

  <!-- Email field -->
  <input
    id="email"
    name="email"
    type="email"
    required
    data-event-validate="blur"
    data-event-validate-blur="blur"
    data-allow-display-name="false"
    data-host-blacklist="tempmail.com,guerrillamail.com"
  />

  <!-- Phone field -->
  <input
    id="phone"
    name="phone"
    type="tel"
    required
    data-default-country="US"
    data-eg-await="+1 555 123 4567"
    data-event-validate="blur"
    data-event-validate-blur="blur"
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
    data-event-validate-input="input"
  />
    <!-- Rich Text Editor (Textarea with HTML support) -->
  <textarea
    id="article_content"
    name="article_content"
    data-type="textarea"
    data-security-mode="rich-text"
    data-allowed-tags="p,h1,h2,strong,em,a,img,blockquote,ul,li,ol"
    data-allowed-html-attributes='{
      "a": ["href", "title", "target"],
      "img": ["src", "alt", "width", "height"],
      "*": []
    }'
    data-sanitize-instead-of-reject="true"
    required
    minlength="50"
    maxlength="5000"
    data-event-validate="blur"
    data-event-validate-blur="blur"
    data-error-message-input="Article content must be between 50 and 5000 characters."
  ></textarea>
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
    data-event-validate-change="change"
    data-event-validate-dragenter="dragenter"
  />
<input
    id="isbn"
    name="isbn"
    type="text"
    required
    data-type="isbn"
    data-type-isbn="isbn13"
    data-event-validate="blur"
    data-event-validate-blur="blur"
    data-error-message-input="ISBN invalide"
    placeholder="978-3-16-148410-0"
  />
  <!-- Document upload (PDF, Word, Excel, CSV auto-detected) -->
  <input
    id="document"
    name="document"
    type="file"
    data-media-type="document"
    data-maxsize-file="10"
    data-unity-max-size-file="MiB"
    data-reject-empty-document="true"
    data-event-validate="change"
    data-event-validate-change="change"
  />

  <!-- Excel upload with advanced options -->
  <input
    id="importFile"
    name="importFile"
    type="file"
    data-media-type="document"
    data-extentions="xlsx,xls"
    data-maxsize-file="5"
    data-required-columns="Name,Email,Phone"
    data-reject-empty-sheet="true"
    data-event-validate="change"
    data-event-validate-change="change"
  />

  <!-- CSV upload with column validation -->
  <input
    id="csvData"
    name="csvData"
    type="file"
    data-media-type="document"
    data-extentions="csv"
    data-maxsize-file="5"
    data-required-headers="Name,Email,Age"
    data-column-types='{"Age":"number","Email":"email"}'
    data-max-row-errors="5"
    data-event-validate="change"
    data-event-validate-change="change"
  />

  <button type="submit">Submit</button>
</form>
```

---

## Framework Integration

### Vanilla JS / TypeScript

```typescript
import { FormValidateController } from '@wlindabla/form_validator';
import {
  FieldValidationFailed,
  FieldValidationSuccess
} from '@wlindabla/form_validator';

document.addEventListener('DOMContentLoaded', () => {
  const formExist = document.querySelector('form.form-validate');
  if (!formExist) return;

  const controller = new FormValidateController('.form-validate');
  const form = controller.form; // native HTMLFormElement

  // Attach blur events
  controller.idChildrenUsingEventBlur.forEach(id => {
    document.getElementById(id)?.addEventListener('blur', async (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.type !== 'file') {
        await controller.validateChildrenForm(target);
      }
    });
  });

  // Attach input events (clear errors)
  controller.idChildrenUsingEventInput.forEach(id => {
    document.getElementById(id)?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.type !== 'file') {
        controller.clearErrorDataChildren(target);
      }
    });
  });

  // Attach change events (files, selects, checkboxes)
  controller.idChildrenUsingEventChange.forEach(id => {
    document.getElementById(id)?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'file') {
        await controller.validateChildrenForm(target);
      }
    });
  });

  // Dragenter on files (clear errors)
  controller.idChildrenUsingEventDragenter.forEach(id => {
    document.getElementById(id)?.addEventListener('dragenter', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'file') {
        controller.clearErrorDataChildren(target);
      }
    });
  });

  // Listen for validation events
  form.addEventListener(FieldValidationFailed, (e: Event) => {
    const { targetChildrenForm, message } = (e as CustomEvent).detail;
    controller.addErrorMessageChildrenForm(
      targetChildrenForm,
      message,
      'container-div-error-message'
    );
    targetChildrenForm.classList.add('is-invalid');
  });

  form.addEventListener(FieldValidationSuccess, (e: Event) => {
    const { targetChildrenForm } = (e as CustomEvent).detail;
    targetChildrenForm.classList.remove('is-invalid');
    targetChildrenForm.classList.add('is-valid');
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isValid = await controller.isFormValid();
    if (isValid) {
      (e.target as HTMLFormElement).submit();
    }
  });


});
or 
document.addEventListener('DOMContentLoaded', () => {
// Build CSS selector strings from the controller's ID lists
const selectorBlur = this.buildSelector(controller.idChildrenUsingEventBlur);
const selectorInput = this.buildSelector(controller.idChildrenUsingEventInput);
const selectorChange = this.buildSelector(controller.idChildrenUsingEventChange);
const selectorDragenter = this.buildSelector(controller.idChildrenUsingEventDragenter);
// Blur validation — validate on field blur
    form.addEventListener('blur', async (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (!target.matches(selectorBlur)) return;

        if (
            (target instanceof HTMLInputElement ||
              target instanceof HTMLTextAreaElement) &&
            target.type !== 'file'
        ) {
            await controller.validateChildrenForm(target);
        }

        //for input filed don't drap and drop
        if (
            target instanceof HTMLInputElement &&
            target.type === 'file'
        ) {
            controller.clearErrorDataChildren(target);
        }

    }, true); 

// Input — clear errors on input
form.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.matches(selectorInput)) return;

    if (
        (target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement) &&
        target.type !== 'file'
    ) {
        controller.clearErrorDataChildren(target);
    }
},true);

        // Change — validate file inputs and selects
form.addEventListener('change', async (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.matches(selectorChange)) return;

    if (
        target instanceof HTMLInputElement &&
        target.type === 'file'
    ) {
        await controller.validateChildrenForm(target);
    }
},true);

// Dragenter — clear errors on file drag
form.addEventListener('dragenter', (e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (!target.matches(selectorDragenter)) return;

    if (
        target instanceof HTMLInputElement &&
        target.type === 'file'
    ) {
        controller.clearErrorDataChildren(target);
    }
},true);

form.addEventListener('dragleave', (e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (!target.matches(selectorDragenter)) return;

    if (
        target instanceof HTMLInputElement &&
        target.type === 'file'
    ) {
        controller.clearErrorDataChildren(target);
    }
}, true);

form.addEventListener('drop', async (e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (!target.matches(selectorDragenter)) return;
        e.preventDefault();
    if (
        target instanceof HTMLInputElement &&
        target.type === 'file'
    ) {
        await controller.validateChildrenForm(target);
    }
},true);

// Listen to validation events to update submit button state
form.addEventListener('field:validation:failed', (event) => {
    const data = (event as CustomEvent).detail as FieldValidationEventData;
    this.updateSubmitButtonState(form, false);

    controller.addErrorMessageChildrenForm(
        data.targetChildrenForm,
        data.message!,
        'container-div-error-message');
});

form.addEventListener('field:validation:success', (event) => {
    const data = (event as CustomEvent).detail as FieldValidationEventData;
    this.checkFormValidityAndUpdateButton(form, controller);
    controller.clearErrorDataChildren(data.targetChildrenForm);
});
        
});
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
      defaultCountry: 'US', requiredInput: true
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
          placeholder="+1 555 123 4567"
          onBlur={async (e) => {
            await validateField('phone', e.target.value, 'tel', {
              defaultCountry: 'US', requiredInput: true
            });
          }}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <button type="submit">Sign in</button>
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

```javascript
import {
  FormValidateController,
  addHashToIds,
  FieldValidationFailed,
  FieldValidationSuccess
} from '@wlindabla/form_validator';

window.addEventListener('DOMContentLoaded', () => {
  const formExist = document.querySelector('form.form-validate');
  if (formExist === null) return;

  const form_validate = new FormValidateController('.form-validate');
  const __form = $(form_validate.form); // Wrap native HTMLFormElement with jQuery

  const idsBlur = addHashToIds(form_validate.idChildrenUsingEventBlur).join(',');
  const idsInput = addHashToIds(form_validate.idChildrenUsingEventInput).join(',');
  const idsChange = addHashToIds(form_validate.idChildrenUsingEventChange).join(',');
  const idsDragenter = addHashToIds(form_validate.idChildrenUsingEventDragenter).join(',');

  // Blur validation (text, email, tel, etc.)
  __form.on('blur', idsBlur, async (event) => {
    const target = event.target;
    if (
      (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
      && target.type !== 'file'
    ) {
      await form_validate.validateChildrenForm(target);
    }
  });

  // Validation failed event → display errors
  __form.on(FieldValidationFailed, (event) => {
    const data = event.originalEvent.detail;
    form_validate.addErrorMessageChildrenForm(
      data.targetChildrenForm,
      data.message,
      'container-div-error-message'
    );
  });

  // Validation success event → clear errors
  __form.on(FieldValidationSuccess, (event) => {
    const data = event.originalEvent.detail;
    jQuery(data.targetChildrenForm)
      .removeClass('is-invalid')
      .addClass('is-valid');
  });

  // Input → real-time error clearing
  __form.on('input', idsInput, (event) => {
    const target = event.target;
    if (
      (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
      && target.type !== 'file'
    ) {
      form_validate.clearErrorDataChildren(target);
    }
  });

  // Change → validate files, selects, checkboxes
  __form.on('change', idsChange, async (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === 'file') {
      await form_validate.validateChildrenForm(target);
    }
  });

  // Dragenter → clear errors for files
  __form.on('dragenter', idsDragenter, (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === 'file') {
      form_validate.clearErrorDataChildren(target);
    }
  });

  // Form submission
  __form.on('submit', async (e) => {
    e.preventDefault();
    const isValid = await form_validate.isFormValid();
    if (isValid) {
      __form.off('submit').submit();
    }
  });
});
```

---

### Symfony + Twig

Use `data-*` HTML attributes to configure validation, then initialize the controller in your main JS entry point.

**Twig Template:**
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
        'data-event-validate-blur': 'blur',
        'data-host-blacklist': 'tempmail.com,guerrillamail.com',
        'data-error-message-input': 'Please enter a valid email address.'
    }
}) }}

{{ form_row(registrationForm.password.first, {
    'attr': {
        'data-event-validate': 'input',
        'data-event-validate-input': 'input',
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
        'data-event-validate': 'change',
        'data-event-validate-change': 'change',
        'data-event-validate-dragenter': 'dragenter'
    }
}) }}

{{ form_row(registrationForm.document, {
    'attr': {
        'data-media-type': 'document',
        'data-maxsize-file': '10',
        'data-unity-max-size-file': 'MiB',
        'data-reject-empty-document': 'true',
        'data-event-validate': 'change',
        'data-event-validate-change': 'change'
    }
}) }}

<button type="submit" class="btn btn-primary">Register</button>
{{ form_end(registrationForm) }}
```

**assets/app.js:**
```javascript
import {
  FormValidateController,
  addHashToIds,
  FieldValidationFailed,
  FieldValidationSuccess
} from '@wlindabla/form_validator';

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('form.form-validate')) return;

  const controller = new FormValidateController('.form-validate');
  const form = controller.form;

  // Blur validation
  controller.idChildrenUsingEventBlur.forEach(id => {
    document.getElementById(id)?.addEventListener('blur', async (e) => {
      const target = e.target;
      if (
        (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
        && target.type !== 'file'
      ) {
        await controller.validateChildrenForm(target);
      }
    });
  });

  // Input → clear errors
  controller.idChildrenUsingEventInput.forEach(id => {
    document.getElementById(id)?.addEventListener('input', (e) => {
      const target = e.target;
      if (
        (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
        && target.type !== 'file'
      ) {
        controller.clearErrorDataChildren(target);
      }
    });
  });

  // Change → files
  controller.idChildrenUsingEventChange.forEach(id => {
    document.getElementById(id)?.addEventListener('change', async (e) => {
      const target = e.target;
      if (target instanceof HTMLInputElement && target.type === 'file') {
        await controller.validateChildrenForm(target);
      }
    });
  });

  // Dragenter → clear file errors
  controller.idChildrenUsingEventDragenter.forEach(id => {
    document.getElementById(id)?.addEventListener('dragenter', (e) => {
      const target = e.target;
      if (target instanceof HTMLInputElement && target.type === 'file') {
        controller.clearErrorDataChildren(target);
      }
    });
  });

  // Validation failed → Bootstrap classes
  form.addEventListener(FieldValidationFailed, (e) => {
    const { targetChildrenForm, message } = e.detail;
    targetChildrenForm.classList.add('is-invalid');
    controller.addErrorMessageChildrenForm(
      targetChildrenForm,
      message,
      'invalid-feedback'
    );
  });

  // Validation success → Bootstrap classes
  form.addEventListener(FieldValidationSuccess, (e) => {
    const { targetChildrenForm } = e.detail;
    targetChildrenForm.classList.remove('is-invalid');
    targetChildrenForm.classList.add('is-valid');
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (await controller.isFormValid()) {
      e.target.submit();
    }
  });
});
```

---

## API Reference

### Exports Table

| Import path | Exports |
|-------------|---------|
| `@wlindabla/form_validator` | `FormValidateController`, `FieldValidationFailed`, `FieldValidationSuccess`, `addHashToIds` |
| `@wlindabla/form_validator/validation/core/router` | `formInputValidator`, `FormInputValidator`, `OptionsValidate` |
| `@wlindabla/form_validator/validation` | `formErrorStore`, `FormErrorStore` |
| `@wlindabla/form_validator/validation/rules/text` | `textInputValidator`, `emailInputValidator`, `passwordInputValidator`, `telInputValidator`, `urlInputValidator`, `fqdnInputValidator`, `dateInputValidator`, `numberInputValidator`, `textareaInputValidator` , `isbnValidator`,`IsbnValidator`,`cardSchemeValidator`, `CardSchemeValidator` |
| `@wlindabla/form_validator/validation/rules/choice` | `selectValidator`, `checkboxValidator`, `radioValidator` |
| `@wlindabla/form_validator/validation/rules/file` | `imageValidator`, `videoValidator`, `pdfValidator`, `excelValidator`, `csvValidator`, `microsoftWordValidator`, `odtValidator` |
| `@wlindabla/form_validator/validation/core/adapter` | `FieldOptionsValidateCacheAdapterInterface` |
| `@wlindabla/form_validator/cache` | `LocalStorageCacheAdapter` |

### Methods Common to All Validators

| Method | Description |
|--------|-------------|
| `formErrorStore.isFieldValid(name)` | Returns `true` if no errors are recorded |
| `formErrorStore.getFieldErrors(name)` | Returns `string[]` of error messages |
| `formErrorStore.clearFieldState(name)` | Clears all state for a field |
| `formErrorStore.isFormValid()` | Returns `true` if no field is invalid |
| `formErrorStore.setFieldValid(name, bool)` | Manually sets field validity |
| `formErrorStore.addFieldError(name, msg)` | Manually adds an error message |
| `formErrorStore.removeFieldError(name, msg)` | Removes a specific error message |

### FormValidateController — Public Methods

| Method | Description |
|--------|-------------|
| `isFormValid(): Promise<boolean>` | Validates all fields and returns `true` if the form is valid |
| `validateChildrenForm(target): Promise<void>` | Validates a single field |
| `clearErrorDataChildren(target): void` | Clears error state for a field |
| `addErrorMessageChildrenForm(el, messages, className?)` | Displays error messages in the DOM |
| `autoValidateAllFields(): Promise<void>` | Validates all fields without checking the overall result |
| `form` | Native `HTMLFormElement` (no longer jQuery) |
| `childrens` | Native `HTMLFormChildrenElement[]` |
| `idChildrenUsingEventBlur` | IDs of fields with `data-event-validate-blur` |
| `idChildrenUsingEventInput` | IDs of fields with `data-event-validate-input` |
| `idChildrenUsingEventChange` | IDs of fields with `data-event-validate-change` |
| `idChildrenUsingEventDragenter` | IDs of fields with `data-event-validate-dragenter` |
| `idChildrenUsingEventFocus` | IDs of fields with `data-event-validate-focus` |

---

## License

MIT © [AGBOKOUDJO Franck](https://github.com/Agbokoudjo) — INTERNATIONALES WEB APPS & SERVICES