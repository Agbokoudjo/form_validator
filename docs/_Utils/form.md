# 📋 `@wlindabla/form_validator` — DOM Error Handling & Form Utilities Module

> **Part of the `@wlindabla/form_validator` library** — A powerful JavaScript/TypeScript library for validating HTML form fields: `text`, `email`, `tel`, `password`, `image`, `PDF`, `Word`, `CSV`, `Excel`, and more.

---

## 📦 Installation

```bash
# npm
npm install @wlindabla/form_validator

# yarn
yarn add @wlindabla/form_validator

# pnpm
pnpm add @wlindabla/form_validator
```

---

## 📖 Table of Contents

- [📋 `@wlindabla/form_validator` — DOM Error Handling \& Form Utilities Module](#-wlindablaform_validator--dom-error-handling--form-utilities-module)
  - [📦 Installation](#-installation)
  - [📖 Table of Contents](#-table-of-contents)
  - [Overview](#overview)
  - [API Reference](#api-reference)
    - [`smallError`](#smallerror)
    - [`validatorErrorField`](#validatorerrorfield)
    - [`createSmallErrorMessage`](#createsmallerrormessage)
    - [`addErrorMessageFieldDom`](#adderrormessagefielddom)
    - [`handleErrorsManyForm`](#handleerrorsmanyform)
    - [`clearErrorInput`](#clearerrorinput)
    - [`getInputPatternRegex`](#getinputpatternregex)
    - [`getAttr`](#getattr)
    - [`stringToRegex`](#stringtoregex)
    - [`getFormAction`](#getformaction)
    - [`cancelEvent`](#cancelevent)
    - [`SubmitterHandle`](#submitterhandle)
  - [Types \& Interfaces](#types--interfaces)
  - [Integration Examples by Framework](#integration-examples-by-framework)
    - [Vanilla JavaScript](#vanilla-javascript)
    - [React / Next.js](#react--nextjs)
    - [Vue.js / Nuxt](#vuejs--nuxt)
    - [Angular](#angular)
    - [Symfony + Twig](#symfony--twig)
    - [Laravel + Blade](#laravel--blade)
    - [Django + Jinja2](#django--jinja2)
    - [PHP + HTML (No Framework)](#php--html-no-framework)
    - [Java + Thymeleaf / JSP](#java--thymeleaf--jsp)
    - [C++ + HTML (WebAssembly / Emscripten)](#c--html-webassembly--emscripten)
  - [🔑 Field ID Convention](#-field-id-convention)
  - [🛡️ Accessibility](#️-accessibility)
  - [📄 License](#-license)

---

## Overview

This module provides a complete **DOM-side error management system** for HTML forms. It handles:

- Generating accessible, styled error message HTML elements
- Appending, updating, and clearing validation errors in the DOM
- Managing submit button states during form submission
- Extracting and compiling `pattern` attributes from inputs into `RegExp` objects
- Handling server-side or client-side validation error objects for complex, multi-field forms

All utilities are **framework-agnostic** and work anywhere JavaScript runs in a browser.

---

## API Reference

---

### `smallError`

Generates a single `<small>` HTML tag for displaying an error message.

```ts
function smallError(
  message_error: string,
  className: string,
  id: string,
  key?: number
): string
```

| Parameter       | Type     | Required | Description                                      |
|-----------------|----------|----------|--------------------------------------------------|
| `message_error` | `string` | ✅        | The error text to display.                        |
| `className`     | `string` | ✅        | CSS class(es) to apply to the element.            |
| `id`            | `string` | ✅        | Unique DOM id for the element.                    |
| `key`           | `number` | ❌        | Optional numeric key, added as `data-key` attr.   |

**Returns:** `string` — An HTML string like:
```html
<small id="error-email" class="fw-bold text-danger" data-key="0">This field is required.</small>
```

**Example:**

```ts
import { smallError } from '@wlindabla/form_validator';

const html = smallError('This field is required.', 'fw-bold text-danger', 'error-email', 0);
document.getElementById('email-wrapper')!.innerHTML = html;
```

---

### `validatorErrorField`

Generates a complete HTML block of one or more `<small>` error messages, joined by a configurable separator.

```ts
function validatorErrorField(validate_error_field?: {
  messageerror: string | string[];
  classnameerror?: string[];
  id: string;
  separator_join: string;
}): string
```

| Parameter          | Type               | Default                              | Description                                            |
|--------------------|--------------------|--------------------------------------|--------------------------------------------------------|
| `messageerror`     | `string\|string[]` | `' '`                                | One error message or an array of messages.             |
| `classnameerror`   | `string[]`         | `['fw-bold', 'text-danger', 'mt-2']` | Additional CSS classes (merged with `error-message`).  |
| `id`               | `string`           | Auto-generated from `Date.now()`     | Base ID for generated elements.                        |
| `separator_join`   | `string`           | `'<br/><hr/>'`                       | HTML string used to join multiple error messages.      |

**Returns:** `string` — Full HTML containing all error `<small>` elements.

**Example — Single error:**

```ts
import { validatorErrorField } from '@wlindabla/form_validator';

const html = validatorErrorField({
  messageerror: 'Please enter a valid email.',
  classnameerror: ['text-danger', 'fw-bold'],
  id: 'error-email',
  separator_join: '<br/>'
});

document.querySelector('#email-container')!.innerHTML = html;
```

**Example — Multiple errors:**

```ts
const html = validatorErrorField({
  messageerror: [
    'This field is required.',
    'Must be a valid email address.',
    'Maximum 255 characters allowed.'
  ],
  classnameerror: ['invalid-feedback', 'd-block'],
  id: 'error-email',
  separator_join: '<br/><hr/>'
});
```

---

### `createSmallErrorMessage`

Creates or retrieves a `<small>` error DOM element for a specific input field. If an element with the generated ID already exists in the DOM, it returns the existing one to avoid duplicates.

```ts
function createSmallErrorMessage(
  fieldInputID: string,
  errorMessage: string,
  keyError: number | string
): HTMLElement
```

| Parameter      | Type               | Description                                            |
|----------------|--------------------|--------------------------------------------------------|
| `fieldInputID` | `string`           | The `id` attribute of the target input element.        |
| `errorMessage` | `string`           | The error text to display.                             |
| `keyError`     | `number \| string` | Unique key for this specific error instance.           |

**Returns:** `HTMLElement` — A native DOM element ready to be inserted.

**Generated element ID format:** `error-item-{fieldInputID}-{keyError}`

**Example:**

```ts
import { createSmallErrorMessage } from '@wlindabla/form_validator';

const emailInput = document.getElementById('user_email')!;
const errorEl = createSmallErrorMessage('user_email', 'Invalid email format.', 0);

emailInput.insertAdjacentElement('afterend', errorEl);
```

---

### `addErrorMessageFieldDom`

The **main function** for displaying validation errors on a form field. It appends or updates error messages directly after the field in the DOM, and toggles Bootstrap's `is-invalid` class.

- Creates a unique error **container div** per field (ID: `container-div-error-message-{fieldId}`)
- Clears and re-renders errors on each call
- Passing an empty array `[]` clears all errors for that field

```ts
function addErrorMessageFieldDom(
  elmtfield: HTMLElement,
  errormessagefield?: string[],
  className_container_ErrorMessage?: string
): void
```

| Parameter                        | Type          | Default                          | Description                                                     |
|----------------------------------|---------------|----------------------------------|-----------------------------------------------------------------|
| `elmtfield`                      | `HTMLElement` | —                                | The target input, select, or textarea element. **Must have `id`**. |
| `errormessagefield`              | `string[]`    | `undefined`                      | Array of error messages. Empty array or omitted → clears errors. |
| `className_container_ErrorMessage` | `string`   | `'border border-3 border-light'` | CSS classes for the error container `<div>`.                    |

**Example — Display errors:**

```ts
import { addErrorMessageFieldDom } from '@wlindabla/form_validator';

const emailInput = document.getElementById('user_email') as HTMLElement;

addErrorMessageFieldDom(emailInput, [
  'This field is required.',
  'Must be a valid email address.'
]);
```

**Example — Clear errors:**

```ts
addErrorMessageFieldDom(emailInput, []);
// or simply:
addErrorMessageFieldDom(emailInput);
```

**DOM output produced:**

```html
<input id="user_email" type="email" class="form-control is-invalid" />
<div id="container-div-error-message-user_email" class="border border-3 border-light">
  <small id="error-item-user_email-0" class="error-message error-for-user_email invalid-feedback d-block">
    This field is required.
  </small>
  <small id="error-item-user_email-1" class="error-message error-for-user_email invalid-feedback d-block">
    Must be a valid email address.
  </small>
</div>
```

---

### `handleErrorsManyForm`

Processes an **entire form's validation error object** at once — ideal for handling backend API responses or comprehensive client-side validation results.

It:
1. Clears all existing errors and `is-invalid` classes in the form scope
2. Iterates the errors object and maps each key to a field ID
3. Calls `addErrorMessageFieldDom` for each field found in the DOM

Field IDs are expected to follow the convention: `{formName}_{fieldKey}` (Symfony-compatible, dot-notation keys like `address.city` are converted to `address_city`).

```ts
function handleErrorsManyForm(
  formName: string,
  formId: string,
  errors: Record<string, string[]>
): void
```

| Parameter  | Type                       | Description                                                              |
|------------|----------------------------|--------------------------------------------------------------------------|
| `formName` | `string`                   | The form's name/alias used as a prefix for field IDs.                    |
| `formId`   | `string`                   | The DOM `id` of the `<form>` element (used for scoping).                 |
| `errors`   | `Record<string, string[]>` | Key-value map of field names → arrays of error messages.                 |

**Example — Apply backend errors:**

```ts
import { handleErrorsManyForm } from '@wlindabla/form_validator';

// Server returned this error object:
const serverErrors = {
  "email": ["This email is already in use.", "Must be a valid email."],
  "address.city": ["City is required."],
  "password": ["Password must be at least 8 characters."]
};

// Form HTML uses IDs: user_email, user_address_city, user_password
handleErrorsManyForm('user', 'user_registration_form', serverErrors);
```

**Example — Clear all form errors:**

```ts
handleErrorsManyForm('user', 'user_registration_form', {});
```

---

### `clearErrorInput`

Clears the error state of a **single input field**: removes the `is-invalid` class and deletes its error container from the DOM.

```ts
function clearErrorInput(inputField: HTMLElement): void
```

| Parameter    | Type          | Description                          |
|--------------|---------------|--------------------------------------|
| `inputField` | `HTMLElement` | The input element to clear. Must have an `id`. |

**Example:**

```ts
import { clearErrorInput } from '@wlindabla/form_validator';

const emailInput = document.getElementById('user_email') as HTMLElement;

emailInput.addEventListener('input', () => {
  clearErrorInput(emailInput);
});
```

---

### `getInputPatternRegex`

Extracts the `pattern` (or `data-pattern`) attribute from an input element and returns it as a compiled `RegExp` object with the specified flags.

```ts
function getInputPatternRegex(
  children: HTMLElement,
  formParentName: string,
  flag?: string
): RegExp | undefined
```

| Parameter        | Type          | Default | Description                                              |
|------------------|---------------|---------|----------------------------------------------------------|
| `children`       | `HTMLElement` | —       | The input or textarea element to read `pattern` from.    |
| `formParentName` | `string`      | —       | Descriptive form name for error logging context.         |
| `flag`           | `string`      | `'i'`   | RegExp flags: any combination of `g`, `i`, `m`, `u`, `y`, `s`. |

**Returns:** `RegExp | undefined`

**Example:**

```ts
import { getInputPatternRegex } from '@wlindabla/form_validator';

const usernameInput = document.querySelector('#user_username') as HTMLInputElement;
// HTML: <input id="user_username" pattern="^[a-zA-Z0-9_]{4,12}$" />

const regex = getInputPatternRegex(usernameInput, 'RegistrationForm', 'i');

if (regex && !regex.test(usernameInput.value)) {
  console.warn('Invalid username format!');
}
```

---

### `getAttr`

A safe, typed helper to read an attribute value from a DOM element, with optional JSON parsing and a fallback default.

```ts
function getAttr<T = unknown>(
  element: HTMLElement | null | undefined,
  name: string,
  defaults?: unknown,
  toJson?: boolean
): T
```

| Parameter  | Type                            | Default | Description                                    |
|------------|---------------------------------|---------|------------------------------------------------|
| `element`  | `HTMLElement \| null \| undefined` | —    | The DOM element to read from.                  |
| `name`     | `string`                        | —       | Attribute name to retrieve.                    |
| `defaults` | `unknown`                       | `null`  | Value returned if the attribute is missing.    |
| `toJson`   | `boolean`                       | `false` | If `true`, parse the attribute value as JSON.  |

**Returns:** `T` — The attribute value cast to the specified type, or the default.

**Example:**

```ts
import { getAttr } from '@wlindabla/form_validator';

const form = document.getElementById('user_form') as HTMLFormElement;

const action = getAttr<string>(form, 'action', '/default-url');
const maxItems = getAttr<number>(form, 'data-max-items', 10, false);
const config = getAttr<{ limit: number }>(form, 'data-config', {}, true);
```

---

### `stringToRegex`

Converts a regex pattern string into a `RegExp` object with specified flags.

```ts
function stringToRegex(
  regexString: string | null | undefined,
  flags?: FlagRegExp
): RegExp | undefined
```

| Parameter     | Type                       | Default | Description                              |
|---------------|----------------------------|---------|------------------------------------------|
| `regexString` | `string \| null \| undefined` | —    | The regex pattern as a string.           |
| `flags`       | `FlagRegExp`               | `'iu'`  | RegExp flags to apply.                   |

**Returns:** `RegExp | undefined`

**Example:**

```ts
import { stringToRegex } from '@wlindabla/form_validator';

const pattern = '^[a-zA-Z]{2,50}$';
const regex = stringToRegex(pattern, 'gi');

if (regex) {
  console.log(regex.test('Hello')); // true
}
```

---

### `getFormAction`

Resolves the submission URL of a form by checking the `action` attribute on the `<form>` element first, then the `formaction` attribute on the submitter button.

```ts
function getFormAction(
  formElement: HTMLFormElement,
  submitter: HTMLButtonElement | HTMLInputElement
): string
```

**Example:**

```ts
import { getFormAction } from '@wlindabla/form_validator';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const submitter = e.submitter as HTMLButtonElement;
  const action = getFormAction(form, submitter);
  // Use action as the fetch URL
  fetch(action, { method: 'POST', body: new FormData(form) });
});
```

---

### `cancelEvent`

Cancels both the default behavior and immediate propagation of a DOM event.

```ts
function cancelEvent(event: Event): void
```

**Example:**

```ts
import { cancelEvent } from '@wlindabla/form_validator';

submitButton.addEventListener('click', cancelEvent, { capture: true });
```

---

### `SubmitterHandle`

An **abstract base class** for managing submit button states during form submission. Inspired by Symfony's `AbstractController` pattern.

Extend this class to:
- Automatically find the submit button for a form
- Set a loading text (from `data-submits-with` attribute) while submitting
- Re-enable the button and restore original text on completion

```ts
abstract class SubmitterHandle {
  protected constructor(formElement: HTMLFormElement)

  // Public methods:
  getSubmitterForm(formElement: HTMLFormElement): HTMLSubmitterElement
  getSubmitsWith(): string
  resetSubmitterText(): void

  // Protected static helpers:
  protected static beforeSubmit(submitter: HTMLSubmitterElement): void
  protected static afterSubmit(submitter: HTMLSubmitterElement): void
}
```

**HTML setup:**

```html
<form id="contact_form" name="contact" action="/submit">
  <!-- ... form fields ... -->
  <button type="submit" data-submits-with="Sending... ⏳">
    Send Message
  </button>
</form>
```

**Example — Extending SubmitterHandle:**

```ts
import { SubmitterHandle } from '@wlindabla/form_validator/form-submit';

class ContactFormHandler extends SubmitterHandle {
  constructor(formElement: HTMLFormElement) {
    super(formElement);
  }

  async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    // Disable button and show loading text
    SubmitterHandle.beforeSubmit(this.submitter);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(event.target as HTMLFormElement)
      });

      if (!response.ok) {
        const errors = await response.json();
        handleErrorsManyForm('contact', 'contact_form', errors);
      }
    } finally {
      // Re-enable button and restore original text
      SubmitterHandle.afterSubmit(this.submitter);
      this.resetSubmitterText();
    }
  }
}

const form = document.getElementById('contact_form') as HTMLFormElement;
const handler = new ContactFormHandler(form);
form.addEventListener('submit', (e) => handler.submit(e as SubmitEvent));
```

**Button lookup order:**

The `getSubmitterForm()` method searches in this order:
1. Inside the `<form>` element itself
2. In the form's parent container
3. Anywhere in the document matching `[type="submit"][form="{formId}"]`
4. Anywhere in the document matching `[type="submit"][form="{formName}"]`

---

## Types & Interfaces

```ts
// Supported media types for file validation
type MediaType = "video" | "document" | "image";

// Required document subtypes
type MediaRequiredType = "pdf" | "excel" | "word" | "odf" | "csv";

// Supported form input types
type FormInputType =
  | "fqdn" | "file" | "radio" | "checkbox" | "number"
  | "text" | "email" | "password" | "url" | "select"
  | "textarea" | "date" | "tel";

// Union of HTML form child elements
type HTMLFormChildrenElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// Supported data input types
type DataInput = string | string[] | number | null | undefined | File | FileList | Date;

// Valid RegExp flag combinations
type FlagRegExp = 'g' | 'i' | 'm' | 'u' | 'y' | 's' | 'gi' | 'iu' | 'gim' | /* ... */;

// Submit element types
type HTMLSubmitterElement = HTMLButtonElement | HTMLInputElement;
```

---

## Integration Examples by Framework

---

### Vanilla JavaScript

No build tools required. Use the ESM bundle from a CDN or local `dist/`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Form Validator - Vanilla JS</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
</head>
<body>
<div class="container mt-4">
  <form id="registration_form" name="registration" action="/register" method="POST">
    <div class="mb-3">
      <label for="registration_email">Email</label>
      <input
        id="registration_email"
        name="email"
        type="email"
        class="form-control"
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        data-pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
      />
    </div>
    <div class="mb-3">
      <label for="registration_password">Password</label>
      <input id="registration_password" name="password" type="password" class="form-control" />
    </div>
    <button type="submit" class="btn btn-primary" data-submits-with="Registering... ⏳">
      Register
    </button>
  </form>
</div>

<script type="module">
  import {
    addErrorMessageFieldDom,
    clearErrorInput,
    handleErrorsManyForm,
    getInputPatternRegex
  } from './dist/esm/index.js';

  const form = document.getElementById('registration_form');
  const emailInput = document.getElementById('registration_email');

  // Clear errors on input
  emailInput.addEventListener('input', () => clearErrorInput(emailInput));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Client-side pattern check
    const emailRegex = getInputPatternRegex(emailInput, 'RegistrationForm', 'i');
    if (emailRegex && !emailRegex.test(emailInput.value)) {
      addErrorMessageFieldDom(emailInput, ['Please enter a valid email address.']);
      return;
    }

    // Submit to server
    const response = await fetch('/register', {
      method: 'POST',
      body: new FormData(form)
    });

    if (!response.ok) {
      const errors = await response.json();
      handleErrorsManyForm('registration', 'registration_form', errors);
    }
  });
</script>
</body>
</html>
```

---

### React / Next.js

```tsx
// components/RegistrationForm.tsx
import React, { useRef, useEffect } from 'react';
import {
  addErrorMessageFieldDom,
  clearErrorInput,
  handleErrorsManyForm,
  getInputPatternRegex
} from '@wlindabla/form_validator';

export default function RegistrationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current || !emailRef.current) return;

    // Client-side validation
    const emailRegex = getInputPatternRegex(emailRef.current, 'RegistrationForm', 'i');
    if (emailRegex && !emailRegex.test(emailRef.current.value)) {
      addErrorMessageFieldDom(emailRef.current, ['Please enter a valid email address.']);
      return;
    }

    const response = await fetch('/api/register', {
      method: 'POST',
      body: new FormData(formRef.current)
    });

    if (!response.ok) {
      const errors: Record<string, string[]> = await response.json();
      // Maps 'email' → #registration_email, 'password' → #registration_password, etc.
      handleErrorsManyForm('registration', 'registration_form', errors);
    }
  };

  return (
    <form
      id="registration_form"
      name="registration"
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="mb-3">
        <label htmlFor="registration_email">Email</label>
        <input
          id="registration_email"
          name="email"
          type="email"
          ref={emailRef}
          className="form-control"
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          onChange={() => clearErrorInput(emailRef.current!)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="registration_password">Password</label>
        <input
          id="registration_password"
          name="password"
          type="password"
          ref={passwordRef}
          className="form-control"
          onChange={() => clearErrorInput(passwordRef.current!)}
        />
      </div>

      <button type="submit" className="btn btn-primary" data-submits-with="Registering... ⏳">
        Register
      </button>
    </form>
  );
}
```

---

### Vue.js / Nuxt

```vue
<!-- components/RegistrationForm.vue -->
<template>
  <form
    id="registration_form"
    name="registration"
    ref="formRef"
    @submit.prevent="handleSubmit"
    novalidate
  >
    <div class="mb-3">
      <label for="registration_email">Email</label>
      <input
        id="registration_email"
        name="email"
        type="email"
        ref="emailRef"
        class="form-control"
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        @input="clearErrorInput(emailRef)"
      />
    </div>

    <div class="mb-3">
      <label for="registration_password">Password</label>
      <input
        id="registration_password"
        name="password"
        type="password"
        ref="passwordRef"
        class="form-control"
        @input="clearErrorInput(passwordRef)"
      />
    </div>

    <button
      type="submit"
      class="btn btn-primary"
      data-submits-with="Registering... ⏳"
    >
      Register
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  addErrorMessageFieldDom,
  clearErrorInput,
  handleErrorsManyForm,
  getInputPatternRegex
} from '@wlindabla/form_validator';

const formRef = ref<HTMLFormElement | null>(null);
const emailRef = ref<HTMLInputElement | null>(null);
const passwordRef = ref<HTMLInputElement | null>(null);

async function handleSubmit() {
  if (!formRef.value || !emailRef.value) return;

  const emailRegex = getInputPatternRegex(emailRef.value, 'RegistrationForm', 'i');
  if (emailRegex && !emailRegex.test(emailRef.value.value)) {
    addErrorMessageFieldDom(emailRef.value, ['Please enter a valid email address.']);
    return;
  }

  const response = await fetch('/api/register', {
    method: 'POST',
    body: new FormData(formRef.value)
  });

  if (!response.ok) {
    const errors: Record<string, string[]> = await response.json();
    handleErrorsManyForm('registration', 'registration_form', errors);
  }
}
</script>
```

---

### Angular

```ts
// registration-form.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  addErrorMessageFieldDom,
  clearErrorInput,
  handleErrorsManyForm
} from '@wlindabla/form_validator';

@Component({
  selector: 'app-registration-form',
  template: `
    <form id="registration_form" name="registration" (ngSubmit)="onSubmit()" #formRef novalidate>
      <div class="mb-3">
        <label for="registration_email">Email</label>
        <input
          id="registration_email"
          name="email"
          type="email"
          class="form-control"
          #emailRef
          (input)="onInputChange(emailRef)"
        />
      </div>
      <div class="mb-3">
        <label for="registration_password">Password</label>
        <input
          id="registration_password"
          name="password"
          type="password"
          class="form-control"
          #passwordRef
          (input)="onInputChange(passwordRef)"
        />
      </div>
      <button type="submit" class="btn btn-primary" data-submits-with="Registering...">
        Register
      </button>
    </form>
  `
})
export class RegistrationFormComponent {
  @ViewChild('formRef') formRef!: ElementRef<HTMLFormElement>;
  @ViewChild('emailRef') emailRef!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) {}

  onInputChange(input: HTMLInputElement): void {
    clearErrorInput(input);
  }

  onSubmit(): void {
    const formData = new FormData(this.formRef.nativeElement);

    this.http.post('/api/register', formData).subscribe({
      error: (err) => {
        const errors: Record<string, string[]> = err.error;
        handleErrorsManyForm('registration', 'registration_form', errors);
      }
    });
  }
}
```

---

### Symfony + Twig

The library pairs seamlessly with Symfony's form naming convention (`formName_fieldName`).

**Twig template:**

```twig
{# templates/registration/index.html.twig #}
{{ form_start(registrationForm, {
    'attr': {
        'id': 'registration_form',
        'name': 'registration',
        'novalidate': 'novalidate'
    }
}) }}

<div class="mb-3">
  {{ form_label(registrationForm.email) }}
  {{ form_widget(registrationForm.email, {
    'attr': {
      'class': 'form-control',
      'pattern': '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      'data-pattern': '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
    }
  }) }}
</div>

<div class="mb-3">
  {{ form_label(registrationForm.password.first) }}
  {{ form_widget(registrationForm.password.first, {'attr': {'class': 'form-control'}}) }}
</div>

<button type="submit" class="btn btn-primary" data-submits-with="Registering... ⏳">
  Register
</button>

{{ form_end(registrationForm) }}

<script type="module">
import {
  handleErrorsManyForm,
  clearErrorInput,
  getInputPatternRegex,
  addErrorMessageFieldDom
} from '/assets/form_validator/dist/esm/index.js';

const form = document.getElementById('registration_form');
const emailInput = document.getElementById('registration_email');

emailInput?.addEventListener('input', () => clearErrorInput(emailInput));

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailRegex = getInputPatternRegex(emailInput, 'RegistrationForm', 'i');
  if (emailRegex && !emailRegex.test(emailInput.value)) {
    addErrorMessageFieldDom(emailInput, ['Please enter a valid email address.']);
    return;
  }

  const response = await fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  });

  if (!response.ok) {
    const data = await response.json();
    // data.errors: { "email": ["Already in use."], "password.first": ["Too short."] }
    // Dot notation is automatically converted: password.first → registration_password_first
    handleErrorsManyForm('registration', 'registration_form', data.errors);
  }
});
</script>
```

**Symfony controller:**

```php
// src/Controller/RegistrationController.php
#[Route('/register', name: 'app_register', methods: ['POST'])]
public function register(Request $request): JsonResponse
{
    $form = $this->createForm(RegistrationFormType::class);
    $form->handleRequest($request);

    if ($form->isSubmitted() && !$form->isValid()) {
        $errors = [];
        foreach ($form->getErrors(true, true) as $error) {
            $fieldName = $error->getOrigin()->getName();
            $errors[$fieldName][] = $error->getMessage();
        }
        return $this->json(['errors' => $errors], 422);
    }

    // ... handle valid form
    return $this->json(['success' => true]);
}
```

---

### Laravel + Blade

```blade
{{-- resources/views/auth/register.blade.php --}}
<form
  id="registration_form"
  name="registration"
  action="{{ route('register') }}"
  method="POST"
  novalidate
>
  @csrf

  <div class="mb-3">
    <label for="registration_email">Email</label>
    <input
      id="registration_email"
      name="email"
      type="email"
      class="form-control"
      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
      value="{{ old('email') }}"
    />
  </div>

  <div class="mb-3">
    <label for="registration_password">Password</label>
    <input
      id="registration_password"
      name="password"
      type="password"
      class="form-control"
    />
  </div>

  <button type="submit" class="btn btn-primary" data-submits-with="Registering... ⏳">
    Register
  </button>
</form>

@push('scripts')
<script type="module">
import {
  handleErrorsManyForm,
  clearErrorInput,
  addErrorMessageFieldDom,
  getInputPatternRegex
} from '/js/form_validator/dist/esm/index.js';

const form = document.getElementById('registration_form');
const emailInput = document.getElementById('registration_email');

emailInput?.addEventListener('input', () => clearErrorInput(emailInput));

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailRegex = getInputPatternRegex(emailInput, 'RegistrationForm', 'i');
  if (emailRegex && !emailRegex.test(emailInput.value)) {
    addErrorMessageFieldDom(emailInput, ['Please enter a valid email address.']);
    return;
  }

  const response = await fetch('{{ route("register") }}', {
    method: 'POST',
    body: new FormData(form),
    headers: {
      'X-CSRF-TOKEN': '{{ csrf_token() }}',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  if (response.status === 422) {
    const data = await response.json();
    // Laravel validation: { errors: { email: ["..."], password: ["..."] } }
    handleErrorsManyForm('registration', 'registration_form', data.errors);
  }
});
</script>
@endpush
```

**Laravel controller:**

```php
// app/Http/Controllers/Auth/RegisterController.php
public function store(Request $request): JsonResponse
{
    $validated = $request->validate([
        'email'    => ['required', 'email', 'unique:users'],
        'password' => ['required', 'min:8', 'confirmed'],
    ]);

    // create user...

    return response()->json(['success' => true]);
}
```

> Laravel's validation JSON response is already in the format `{ errors: { field: [messages] } }` — compatible out of the box with `handleErrorsManyForm`.

---

### Django + Jinja2

```html
<!-- templates/registration/register.html -->
{% extends "base.html" %}
{% block content %}

<form
  id="registration_form"
  name="registration"
  action="{% url 'register' %}"
  method="POST"
  novalidate
>
  {% csrf_token %}

  <div class="mb-3">
    <label for="registration_email">Email</label>
    <input
      id="registration_email"
      name="email"
      type="email"
      class="form-control"
      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
    />
  </div>

  <div class="mb-3">
    <label for="registration_password">Password</label>
    <input
      id="registration_password"
      name="password"
      type="password"
      class="form-control"
    />
  </div>

  <button type="submit" class="btn btn-primary" data-submits-with="Registering... ⏳">
    Register
  </button>
</form>

<script type="module">
import {
  handleErrorsManyForm,
  clearErrorInput,
  addErrorMessageFieldDom
} from '/static/js/form_validator/dist/esm/index.js';

const form = document.getElementById('registration_form');
const emailInput = document.getElementById('registration_email');
const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

emailInput?.addEventListener('input', () => clearErrorInput(emailInput));

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const response = await fetch('{% url "register" %}', {
    method: 'POST',
    body: new FormData(form),
    headers: { 'X-CSRFToken': csrfToken }
  });

  if (!response.ok) {
    const data = await response.json();
    // Django returns: { "email": ["Enter a valid email address."] }
    handleErrorsManyForm('registration', 'registration_form', data);
  }
});
</script>

{% endblock %}
```

**Django view:**

```python
# views.py
import json
from django.http import JsonResponse
from django.views import View
from .forms import RegistrationForm

class RegisterView(View):
    def post(self, request):
        form = RegistrationForm(request.POST)
        if not form.is_valid():
            # Convert Django errors to { field: [messages] } format
            errors = {
                field: list(messages)
                for field, messages in form.errors.items()
                if field != '__all__'
            }
            return JsonResponse(errors, status=422)

        form.save()
        return JsonResponse({'success': True})
```

---

### PHP + HTML (No Framework)

```php
<?php
// register.php
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Registration</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
</head>
<body>
<div class="container mt-4">
  <form
    id="registration_form"
    name="registration"
    action="register_handler.php"
    method="POST"
    novalidate
  >
    <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?? '' ?>" />

    <div class="mb-3">
      <label for="registration_email">Email</label>
      <input
        id="registration_email"
        name="email"
        type="email"
        class="form-control"
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        data-pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
      />
    </div>

    <div class="mb-3">
      <label for="registration_password">Password</label>
      <input
        id="registration_password"
        name="password"
        type="password"
        class="form-control"
      />
    </div>

    <button type="submit" class="btn btn-primary" data-submits-with="Registering... ⏳">
      Register
    </button>
  </form>
</div>

<script type="module">
import {
  handleErrorsManyForm,
  clearErrorInput,
  addErrorMessageFieldDom,
  getInputPatternRegex
} from './assets/form_validator/dist/esm/index.js';

const form = document.getElementById('registration_form');
const emailInput = document.getElementById('registration_email');

emailInput?.addEventListener('input', () => clearErrorInput(emailInput));

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailRegex = getInputPatternRegex(emailInput, 'RegistrationForm', 'i');
  if (emailRegex && !emailRegex.test(emailInput.value)) {
    addErrorMessageFieldDom(emailInput, ['Please enter a valid email address.']);
    return;
  }

  const response = await fetch('register_handler.php', {
    method: 'POST',
    body: new FormData(form)
  });

  if (!response.ok) {
    const data = await response.json();
    handleErrorsManyForm('registration', 'registration_form', data.errors);
  }
});
</script>
</body>
</html>
```

```php
<?php
// register_handler.php
header('Content-Type: application/json');

$errors = [];

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($email)) {
    $errors['email'][] = 'Email is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'][] = 'Please enter a valid email address.';
}

if (strlen($password) < 8) {
    $errors['password'][] = 'Password must be at least 8 characters.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

// ... process registration
echo json_encode(['success' => true]);
```

---

### Java + Thymeleaf / JSP

**Thymeleaf template:**

```html
<!-- src/main/resources/templates/registration.html -->
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="UTF-8"/>
  <title>Registration</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
</head>
<body>
<div class="container mt-4">
  <form
    id="registration_form"
    name="registration"
    th:action="@{/register}"
    method="POST"
    novalidate
  >
    <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}" />

    <div class="mb-3">
      <label for="registration_email">Email</label>
      <input
        id="registration_email"
        name="email"
        type="email"
        class="form-control"
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
      />
    </div>

    <div class="mb-3">
      <label for="registration_password">Password</label>
      <input
        id="registration_password"
        name="password"
        type="password"
        class="form-control"
      />
    </div>

    <button type="submit" class="btn btn-primary" data-submits-with="Registering... ⏳">
      Register
    </button>
  </form>
</div>

<script type="module">
import {
  handleErrorsManyForm,
  clearErrorInput,
  addErrorMessageFieldDom
} from '/js/form_validator/dist/esm/index.js';

const form = document.getElementById('registration_form');
const emailInput = document.getElementById('registration_email');
const csrfToken = document.querySelector('[name="_csrf"]').value;

emailInput?.addEventListener('input', () => clearErrorInput(emailInput));

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    },
    body: JSON.stringify({
      email: emailInput.value,
      password: document.getElementById('registration_password').value
    })
  });

  if (!response.ok) {
    const data = await response.json();
    // Spring Boot BindingResult errors mapped to { field: [messages] }
    handleErrorsManyForm('registration', 'registration_form', data.errors);
  }
});
</script>
</body>
</html>
```

**Spring Boot controller:**

```java
// RegistrationController.java
@RestController
@RequestMapping("/register")
public class RegistrationController {

    @PostMapping
    public ResponseEntity<?> register(
        @Valid @RequestBody RegistrationRequest request,
        BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            Map<String, List<String>> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                errors.computeIfAbsent(error.getField(), k -> new ArrayList<>())
                      .add(error.getDefaultMessage())
            );
            return ResponseEntity.unprocessableEntity().body(Map.of("errors", errors));
        }
        // ... create user
        return ResponseEntity.ok(Map.of("success", true));
    }
}
```

---

### C++ + HTML (WebAssembly / Emscripten)

When building C++ applications compiled to **WebAssembly** with Emscripten, you can use this library in the JavaScript glue layer to handle form errors reported by your C++ validation logic.

**C++ validation (compiled to WASM):**

```cpp
// validation.cpp
#include <emscripten/bind.h>
#include <string>
#include <map>
#include <vector>
#include <regex>

using namespace emscripten;

struct ValidationResult {
    bool valid;
    std::map<std::string, std::vector<std::string>> errors;
};

ValidationResult validateRegistration(const std::string& email, const std::string& password) {
    ValidationResult result;
    result.valid = true;

    std::regex emailRegex(R"(^[^\s@]+@[^\s@]+\.[^\s@]+$)");
    if (!std::regex_match(email, emailRegex)) {
        result.errors["email"].push_back("Please enter a valid email address.");
        result.valid = false;
    }

    if (password.length() < 8) {
        result.errors["password"].push_back("Password must be at least 8 characters.");
        result.valid = false;
    }

    return result;
}

// Export to JavaScript via Emscripten
EMSCRIPTEN_BINDINGS(validator) {
    emscripten::function("validateRegistration", &validateRegistration);
}
```

**JavaScript / HTML integration:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>WASM + Form Validator</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
</head>
<body>
<div class="container mt-4">
  <form id="registration_form" name="registration" novalidate>
    <div class="mb-3">
      <label for="registration_email">Email</label>
      <input id="registration_email" name="email" type="email" class="form-control" />
    </div>
    <div class="mb-3">
      <label for="registration_password">Password</label>
      <input id="registration_password" name="password" type="password" class="form-control" />
    </div>
    <button type="submit" class="btn btn-primary" data-submits-with="Validating... ⏳">
      Register
    </button>
  </form>
</div>

<script src="validation.js"></script>  <!-- Emscripten-generated glue -->
<script type="module">
import {
  handleErrorsManyForm,
  clearErrorInput
} from '/js/form_validator/dist/esm/index.js';

// Wait for WASM module to load
Module.onRuntimeInitialized = () => {
  const form = document.getElementById('registration_form');
  const emailInput = document.getElementById('registration_email');
  const passwordInput = document.getElementById('registration_password');

  emailInput.addEventListener('input', () => clearErrorInput(emailInput));
  passwordInput.addEventListener('input', () => clearErrorInput(passwordInput));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Call C++ validation via WASM
    const result = Module.validateRegistration(
      emailInput.value,
      passwordInput.value
    );

    if (!result.valid) {
      // Convert WASM result errors to JS object
      const errors = {};
      for (const [field, messages] of Object.entries(result.errors)) {
        errors[field] = messages;
      }
      handleErrorsManyForm('registration', 'registration_form', errors);
    } else {
      // Proceed with form submission
      fetch('/register', { method: 'POST', body: new FormData(form) });
    }
  });
};
</script>
</body>
</html>
```

---

## 🔑 Field ID Convention

All DOM functions rely on the following ID convention for fields:

```
{formName}_{fieldKey}
```

| Form name       | Field key         | Expected DOM ID                      |
|-----------------|-------------------|--------------------------------------|
| `registration`  | `email`           | `registration_email`                 |
| `registration`  | `address.city`    | `registration_address_city`          |
| `user`          | `profile.phone`   | `user_profile_phone`                 |

> Dot notation (e.g., `address.city`) is automatically converted to underscores (`address_city`) by `handleErrorsManyForm`.

---

## 🛡️ Accessibility

- Error containers are inserted directly after the invalid field using `insertAdjacentElement('afterend', ...)`, keeping them adjacent in the DOM tab order.
- The `is-invalid` class follows Bootstrap's convention, which works alongside native `aria-invalid` attributes you may add.
- Error `<small>` elements use the `invalid-feedback d-block` classes to ensure they are always visible, not just on focus.

---

## 📄 License

MIT © [AGBOKOUDJO Franck](mailto:internationaleswebservices@gmail.com) — [INTERNATIONALES WEB APPS & SERVICES](https://www.linkedin.com/in/internationales-web-services-120520193/)

> GitHub: [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator)