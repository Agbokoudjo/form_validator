# `@wlindabla/form_validator` — DOM Error Handling & Form Utilities Module

> **Author:** AGBOKOUDJO Franck — [INTERNATIONALES WEB APPS & SERVICES](https://www.linkedin.com/in/internationales-web-services-120520193/)
> **GitHub:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator)
> **License:** MIT | **Version:** 3.2.0

---

## Table of Contents

- [`@wlindabla/form_validator` — DOM Error Handling \& Form Utilities Module](#wlindablaform_validator--dom-error-handling--form-utilities-module)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Installation](#installation)
  - [Module API Reference](#module-api-reference)
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
    - [`SubmitterHandle` (Abstract Class)](#submitterhandle-abstract-class)
  - [Types \& Interfaces](#types--interfaces)
  - [Framework Integration Examples](#framework-integration-examples)
    - [Vanilla JavaScript / HTML](#vanilla-javascript--html)
    - [React / Next.js](#react--nextjs)
    - [Vue.js / Nuxt.js](#vuejs--nuxtjs)
    - [Angular](#angular)
    - [Svelte / SvelteKit](#svelte--sveltekit)
    - [Symfony + Twig](#symfony--twig)
    - [Laravel + Blade](#laravel--blade)
    - [Django + Django Templates](#django--django-templates)
    - [PHP + HTML (Plain)](#php--html-plain)
    - [Java (Thymeleaf / Jakarta EE)](#java-thymeleaf--jakarta-ee)
    - [C++ with HTML Frontend (WebAssembly / Emscripten)](#c-with-html-frontend-webassembly--emscripten)
  - [Advanced Patterns](#advanced-patterns)
    - [Real-time Validation with Debounce](#real-time-validation-with-debounce)
    - [Full Async Submit Handler with `SubmitterHandle`](#full-async-submit-handler-with-submitterhandle)
  - [Browser Compatibility](#browser-compatibility)
  - [Contributing \& Support](#contributing--support)

---

## Overview

This module provides a complete, framework-agnostic set of utilities to **display, update, and clear validation error messages** directly in the DOM for any HTML form. It integrates seamlessly with Bootstrap's `is-invalid` / `invalid-feedback` classes, but is fully usable without Bootstrap.

**Key capabilities:**
- Generate error `<small>` elements dynamically
- Attach/detach error containers next to form fields
- Handle flat or nested field errors returned by any backend (REST, GraphQL, form submission)
- Disable/enable submit buttons during async form processing
- Extract and validate HTML `pattern` attributes as `RegExp` objects

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

## Module API Reference

---

### `smallError`

Generates a raw HTML string representing a `<small>` element designed to display a single error message.

```typescript
function smallError(
  message_error: string,
  className: string,
  id: string,
  key?: number
): string
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `message_error` | `string` | ✅ | The error text to display |
| `className` | `string` | ✅ | CSS class string to apply |
| `id` | `string` | ✅ | Unique DOM id for the element |
| `key` | `number` | ❌ | Optional `data-key` attribute for tracking |

**Returns:** `string` — An HTML string like `<small id="..." class="..." data-key="0">Error</small>`

**Example:**

```typescript
import { smallError } from '@wlindabla/form_validator/utils';

const html = smallError('This field is required.', 'text-danger fw-bold', 'error-email', 0);
// → <small id="error-email" class="text-danger fw-bold"  data-key="0">This field is required.</small>
```

---

### `validatorErrorField`

Generates a complete HTML block containing one or more formatted error messages. Handles both single string and array of messages.

```typescript
function validatorErrorField(validate_error_field: {
  messageerror: string | string[];
  classnameerror?: string[];
  id: string;
  separator_join: string;
}): string
```

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `messageerror` | `string \| string[]` | ✅ | — | Single or multiple error messages |
| `classnameerror` | `string[]` | ❌ | `["fw-bold","text-danger","mt-2"]` | CSS classes for each `<small>` |
| `id` | `string` | ✅ | — | Base ID (each item gets `id-0`, `id-1`, etc.) |
| `separator_join` | `string` | ✅ | — | HTML separator between multiple messages |

**Returns:** `string` — Ready-to-inject HTML block.

**Example:**

```typescript
import { validatorErrorField } from '@wlindabla/form_validator/utils';

// Single message
const single = validatorErrorField({
  messageerror: 'Email is invalid.',
  classnameerror: ['text-danger', 'fw-bold'],
  id: 'error-email',
  separator_join: '<br/>'
});

// Multiple messages
const multiple = validatorErrorField({
  messageerror: ['Field is required.', 'Must be at least 8 characters.'],
  classnameerror: ['invalid-feedback', 'd-block'],
  id: 'error-password',
  separator_join: '<br/><hr/>'
});
```

---

### `createSmallErrorMessage`

Creates or retrieves a native `HTMLElement` for displaying a field-specific error. Checks whether the element already exists in the DOM before creating a new one (avoids duplicates).

```typescript
function createSmallErrorMessage(
  fieldInputID: string,
  errorMessage: string,
  keyError: number | string
): HTMLElement
```

| Parameter | Type | Description |
|---|---|---|
| `fieldInputID` | `string` | The `id` attribute of the related input element |
| `errorMessage` | `string` | The error text |
| `keyError` | `number \| string` | Unique identifier for this specific error |

**Returns:** `HTMLElement` — A `<small>` DOM element.

**Generated element ID convention:** `error-item-{fieldInputID}-{keyError}`

**Example:**

```typescript
import { createSmallErrorMessage } from '@wlindabla/form_validator';

const errorEl = createSmallErrorMessage('user_email', 'Invalid email address.', 0);
document.getElementById('my-error-container')?.appendChild(errorEl);
```

---

### `addErrorMessageFieldDom`

**Primary utility.** Appends or updates a list of validation error messages visually displayed below a form field. Manages a dedicated error container per field and handles Bootstrap's `is-invalid` class automatically.

```typescript
function addErrorMessageFieldDom(
  elmtfield: HTMLElement,
  errormessagefield?: string[],
  className_container_ErrorMessage?: string
): void
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `elmtfield` | `HTMLElement` | — | The input/select/textarea element |
| `errormessagefield` | `string[]` | — | Array of error strings. Pass empty array `[]` to **clear** errors |
| `className_container_ErrorMessage` | `string` | `"border border-3 border-light"` | CSS classes on the error wrapper `<div>` |

**DOM conventions:**
- Error container id: `container-div-error-message-{fieldId}`
- Each error element id: `error-item-{fieldId}-{index}`
- Adds `is-invalid` class to the field on error
- Removes `is-invalid` and error container when `errormessagefield` is empty

**Example:**

```typescript
import { addErrorMessageFieldDom } from '@wlindabla/form_validator/utils';

const emailField = document.getElementById('user_email') as HTMLElement;

// Display errors
addErrorMessageFieldDom(emailField, [
  'This field is required.',
  'Must be a valid email address.'
]);

// Clear errors
addErrorMessageFieldDom(emailField, []);
```

---

### `handleErrorsManyForm`

Handles and displays/clears **multiple validation errors** across an entire form at once. Typically used after a failed API call or server-side validation. Automatically clears all previous errors before applying new ones.

```typescript
function handleErrorsManyForm(
  formName: string,
  formId: string,
  errors: Record<string, string[]>
): void
```

| Parameter | Type | Description |
|---|---|---|
| `formName` | `string` | Prefix used in field IDs (e.g., `"user"` → targets `user_email`, `user_password`) |
| `formId` | `string` | The `id` attribute of the `<form>` element (used to scope DOM queries) |
| `errors` | `Record<string, string[]>` | Object mapping field names to arrays of error messages |

**Field ID resolution:** For a field key `"address.city"`, the function looks for `#{formName}_address_city` in the DOM (dots replaced by underscores — compatible with Symfony form naming conventions).

**Example:**

```typescript
import { handleErrorsManyForm } from '@wlindabla/form_validator/utils';

// After a failed API call:
const apiErrors = {
  "email": ["This email is already taken.", "Must be a valid email."],
  "password": ["Password is too short."],
  "address.city": ["City is required."]
};

handleErrorsManyForm('user', 'user_registration_form', apiErrors);

// To clear all errors (e.g., on successful submission):
handleErrorsManyForm('user', 'user_registration_form', {});
```

---

### `clearErrorInput`

Clears the error state of a single input field: removes the `is-invalid` CSS class and deletes its error container from the DOM.

```typescript
function clearErrorInput(inputField: HTMLElement): void
```

| Parameter | Type | Description |
|---|---|---|
| `inputField` | `HTMLElement` | The input element to reset |

**Example:**

```typescript
import { clearErrorInput } from '@wlindabla/form_validator/utils';

const emailInput = document.getElementById('user_email') as HTMLElement;

emailInput.addEventListener('input', () => {
  clearErrorInput(emailInput); // Clear errors as the user types
});
```

---

### `getInputPatternRegex`

Reads the `pattern` (or `data-pattern`) attribute from an input/textarea element and returns it as a compiled JavaScript `RegExp` object.

```typescript
function getInputPatternRegex(
  children: HTMLElement,
  formParentName: string,
  flag?: string
): RegExp | undefined
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `children` | `HTMLElement` | — | The input/textarea element |
| `formParentName` | `string` | — | Form name (used in error logs for context) |
| `flag` | `string` | `'i'` | RegExp flags (`g`, `i`, `m`, `u`, `y`, `s`) |

**Returns:** A compiled `RegExp` or `undefined` if the pattern is missing or invalid.

**Example:**

```typescript
import { getInputPatternRegex } from '@wlindabla/form_validator/utils';

const usernameInput = document.querySelector('#user_username') as HTMLInputElement;
// HTML: <input pattern="^[a-zA-Z0-9_]{4,12}$" ... />

const regex = getInputPatternRegex(usernameInput, 'RegistrationForm', 'i');

if (regex && !regex.test(usernameInput.value)) {
  console.warn('Invalid username format!');
}
```

---

### `getAttr`

A safe, typed wrapper to read HTML element attributes with optional JSON parsing and default fallback.

```typescript
function getAttr<T = unknown>(
  element: HTMLElement | null | undefined,
  name: string,
  defaults?: unknown,
  toJson?: boolean
): T
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `element` | `HTMLElement \| null \| undefined` | — | Target element |
| `name` | `string` | — | Attribute name |
| `defaults` | `unknown` | `null` | Value returned if attribute is absent |
| `toJson` | `boolean` | `false` | Parse the attribute value as JSON |

**Example:**

```typescript
import { getAttr } from '@wlindabla/form_validator/utils';

const input = document.getElementById('my_input');

const maxLength = getAttr<number>(input, 'data-max-length', 255);
const config = getAttr<{ required: boolean }>(input, 'data-config', {}, true);
```

---

### `stringToRegex`

Converts a regex pattern string to a `RegExp` object with specified flags.

```typescript
function stringToRegex(
  regexString: string | null | undefined,
  flags?: FlagRegExp
): RegExp | undefined
```

**Example:**

```typescript
import { stringToRegex } from '@wlindabla/form_validator/utils';

const pattern = stringToRegex('^[a-z]+$', 'i');
console.log(pattern?.test('Hello')); // true
```

---

### `getFormAction`

Extracts the form submission URL from either the `<form action="...">` attribute or the submitter button's `formaction` attribute.

```typescript
function getFormAction(
  formElement: HTMLFormElement,
  submitter: HTMLButtonElement | HTMLInputElement
): string
```

**Example:**

```typescript
import { getFormAction } from '@wlindabla/form_validator/utils';

form.addEventListener('submit', (e) => {
  const submitter = (e as SubmitEvent).submitter as HTMLButtonElement;
  const actionUrl = getFormAction(form, submitter);
  console.log('Submitting to:', actionUrl);
});
```

---

### `cancelEvent`

Prevents both the default browser action and further propagation of a DOM event. Useful for disabling submit during async processing.

```typescript
function cancelEvent(event: Event): void
```

**Example:**

```typescript
import { cancelEvent } from '@wlindabla/form_validator/utils';

submitButton.addEventListener('click', cancelEvent, { capture: true });
```

---

### `SubmitterHandle` (Abstract Class)

An abstract base class providing a complete lifecycle manager for form submit buttons. Handles disabling, re-enabling, text replacement during async submission, and restoration afterward.

Inspired by Symfony's `AbstractController` design pattern.

```typescript
abstract class SubmitterHandle {
  protected constructor(formElement: HTMLFormElement)

  // Static lifecycle hooks
  protected static beforeSubmit(submitter: HTMLSubmitterElement): void
  protected static afterSubmit(submitter: HTMLSubmitterElement): void

  // Instance methods
  public getSubmitterForm(formElement: HTMLFormElement): HTMLSubmitterElement
  public getSubmitsWith(): string      // Sets loading text, returns original text
  public resetSubmitterText(): void    // Restores original text
}
```

**`data-submits-with` attribute:** Place this on your submit button to define the loading text shown during submission. Defaults to `"Sending..."`.

```html
<button type="submit" data-submits-with="⏳ Saving...">Save Profile</button>
```

**Example — Extending `SubmitterHandle`:**

```typescript
import { SubmitterHandle, handleErrorsManyForm } from '@wlindabla/form_validator';

class ProfileFormHandler extends SubmitterHandle {
  private readonly formElement: HTMLFormElement;

  constructor(formElement: HTMLFormElement) {
    super(formElement);
    this.formElement = formElement;
  }

  async handleSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    SubmitterHandle.beforeSubmit(this.submitter); // Disable + show loading text

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        body: new FormData(this.formElement)
      });

      const data = await response.json();

      if (!response.ok) {
        handleErrorsManyForm('profile', this.formElement.id, data.errors);
      }
    } finally {
      SubmitterHandle.afterSubmit(this.submitter); // Re-enable + restore text
      this.resetSubmitterText();
    }
  }
}

const form = document.getElementById('profile_form') as HTMLFormElement;
const handler = new ProfileFormHandler(form);
form.addEventListener('submit', (e) => handler.handleSubmit(e as SubmitEvent));
```

---

## Types & Interfaces

```typescript
// Accepted regex flag combinations
type FlagRegExp = 'g' | 'i' | 'm' | 'u' | 'y' | 's' | 'gi' | 'iu' | 'gim' | /* ... */;

// File/media field types
type MediaType = "video" | "document" | "image";
type MediaRequiredType = "pdf" | "excel" | "word" | "odf" | "csv";

// All supported HTML form input types
type FormInputType = "fqdn" | "file" | "radio" | "checkbox" | "number" | "text"
  | "email" | "password" | "url" | "select" | "textarea" | "date" | "tel";

// Union of native form children element types
type HTMLFormChildrenElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// Valid input data types
type DataInput = string | string[] | number | null | undefined | File | FileList | Date;

// Submitter element union type
type HTMLSubmitterElement = HTMLButtonElement | HTMLInputElement;
```

---

## Framework Integration Examples

---

### Vanilla JavaScript / HTML

```html
<!-- index.html -->
<form id="contact_form" name="contact" action="/submit" method="POST">
  <div class="mb-3">
    <label for="contact_email">Email</label>
    <input type="email" id="contact_email" name="email"
           pattern="^[\w\.-]+@[\w\.-]+\.\w{2,}$"
           class="form-control" />
  </div>
  <button type="submit" data-submits-with="Sending...">Send</button>
</form>

<script type="module">
  import {
    addErrorMessageFieldDom,
    handleErrorsManyForm,
    clearErrorInput
  } from '@wlindabla/form_validator';

  const form = document.getElementById('contact_form');
  const emailField = document.getElementById('contact_email');

  emailField.addEventListener('input', () => clearErrorInput(emailField));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const res = await fetch('/submit', { method: 'POST', body: new FormData(form) });
    const data = await res.json();

    if (!res.ok) {
      handleErrorsManyForm('contact', 'contact_form', data.errors);
    }
  });
</script>
```

---

### React / Next.js

```tsx
// components/RegistrationForm.tsx
import React, { useRef, useEffect } from 'react';
import {
  addErrorMessageFieldDom,
  clearErrorInput,
  getInputPatternRegex
} from '@wlindabla/form_validator';

interface ApiErrors {
  [key: string]: string[];
}

export function RegistrationForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch('/api/register', { method: 'POST', body: formData });
    const data: { errors?: ApiErrors } = await res.json();

    if (!res.ok && data.errors) {
      if (data.errors.email && emailRef.current) {
        addErrorMessageFieldDom(emailRef.current, data.errors.email);
      }
      if (data.errors.password && passwordRef.current) {
        addErrorMessageFieldDom(passwordRef.current, data.errors.password);
      }
    }
  };

  const handleEmailChange = () => {
    if (emailRef.current) {
      clearErrorInput(emailRef.current);

      // Validate against HTML pattern attribute in real time
      const regex = getInputPatternRegex(emailRef.current, 'RegistrationForm');
      if (regex && !regex.test(emailRef.current.value)) {
        addErrorMessageFieldDom(emailRef.current, ['Invalid email format.']);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} id="user_registration_form" name="user">
      <div className="mb-3">
        <label htmlFor="user_email">Email</label>
        <input
          ref={emailRef}
          id="user_email"
          name="email"
          type="email"
          pattern="^[\w\.-]+@[\w\.-]+\.\w{2,}$"
          className="form-control"
          onChange={handleEmailChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="user_password">Password</label>
        <input
          ref={passwordRef}
          id="user_password"
          name="password"
          type="password"
          className="form-control"
          onChange={() => passwordRef.current && clearErrorInput(passwordRef.current)}
        />
      </div>

      <button type="submit" data-submits-with="Creating account...">
        Register
      </button>
    </form>
  );
}
```

---

### Vue.js / Nuxt.js

```vue
<!-- components/LoginForm.vue -->
<template>
  <form id="auth_login_form" name="auth" @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="auth_email">Email</label>
      <input
        ref="emailRef"
        id="auth_email"
        name="email"
        type="email"
        class="form-control"
        @input="clearField(emailRef)"
      />
    </div>

    <div class="mb-3">
      <label for="auth_password">Password</label>
      <input
        ref="passwordRef"
        id="auth_password"
        name="password"
        type="password"
        class="form-control"
        @input="clearField(passwordRef)"
      />
    </div>

    <button type="submit" data-submits-with="Logging in...">Login</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  handleErrorsManyForm,
  clearErrorInput
} from '@wlindabla/form_validator';

const emailRef = ref<HTMLInputElement | null>(null);
const passwordRef = ref<HTMLInputElement | null>(null);

function clearField(fieldRef: { value: HTMLInputElement | null }) {
  if (fieldRef.value) clearErrorInput(fieldRef.value);
}

async function handleSubmit(event: Event) {
  const form = event.target as HTMLFormElement;

  const res = await fetch('/api/login', {
    method: 'POST',
    body: new FormData(form)
  });

  const data = await res.json();

  if (!res.ok) {
    handleErrorsManyForm('auth', 'auth_login_form', data.errors ?? {});
  }
}
</script>
```

---

### Angular

```typescript
// login.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { addErrorMessageFieldDom, clearErrorInput, handleErrorsManyForm } from '@wlindabla/form_validator';

@Component({
  selector: 'app-login',
  template: `
    <form id="user_login_form" name="user" (ngSubmit)="onSubmit()">
      <input #emailInput id="user_email" name="email" type="email"
             class="form-control" (input)="clearField(emailInput)" />

      <input #passwordInput id="user_password" name="password" type="password"
             class="form-control" (input)="clearField(passwordInput)" />

      <button type="submit" data-submits-with="Authenticating...">
        Login
      </button>
    </form>
  `
})
export class LoginComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) {}

  clearField(el: HTMLInputElement) {
    clearErrorInput(el);
  }

  async onSubmit() {
    const form = document.getElementById('user_login_form') as HTMLFormElement;

    this.http.post('/api/login', new FormData(form), { observe: 'response' }).subscribe({
      error: (err) => {
        if (err.error?.errors) {
          handleErrorsManyForm('user', 'user_login_form', err.error.errors);
        }
      }
    });
  }
}
```

---

### Svelte / SvelteKit

```svelte
<!-- src/routes/register/+page.svelte -->
<script lang="ts">
  import { addErrorMessageFieldDom, clearErrorInput, handleErrorsManyForm } from '@wlindabla/form_validator';
  import { browser } from '$app/environment';

  let emailEl: HTMLInputElement;
  let passwordEl: HTMLInputElement;

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const res = await fetch('/api/register', {
      method: 'POST',
      body: new FormData(form)
    });

    const data = await res.json();

    if (!res.ok && browser) {
      handleErrorsManyForm('registration', 'registration_form', data.errors ?? {});
    }
  }
</script>

<form id="registration_form" name="registration" on:submit={handleSubmit}>
  <input
    bind:this={emailEl}
    id="registration_email"
    name="email"
    type="email"
    class="form-control"
    on:input={() => clearErrorInput(emailEl)}
  />

  <input
    bind:this={passwordEl}
    id="registration_password"
    name="password"
    type="password"
    class="form-control"
    on:input={() => clearErrorInput(passwordEl)}
  />

  <button type="submit" data-submits-with="Registering...">
    Create Account
  </button>
</form>
```

---

### Symfony + Twig

In a Symfony project, form field IDs follow the convention `{formName}_{fieldName}`, which maps directly to `handleErrorsManyForm`.

```twig
{# templates/registration/register.html.twig #}
{{ form_start(registrationForm, {'attr': {'id': 'registration_form', 'name': 'registration'}}) }}
  <div class="mb-3">
    {{ form_label(registrationForm.email) }}
    {{ form_widget(registrationForm.email, {'attr': {
      'class': 'form-control',
      'data-submits-with': 'Sending...'
    }}) }}
  </div>

  <div class="mb-3">
    {{ form_label(registrationForm.password.first) }}
    {{ form_widget(registrationForm.password.first, {'attr': {'class': 'form-control'}}) }}
  </div>

  <button type="submit" data-submits-with="Creating account...">Register</button>
{{ form_end(registrationForm) }}
```

```javascript
// assets/js/registration.js
import { handleErrorsManyForm, clearErrorInput } from '@wlindabla/form_validator/utils';

const form = document.getElementById('registration_form');

// Clear on input
form.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => clearErrorInput(input));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const res = await fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  });

  const data = await res.json();

  if (!res.ok) {
    // Symfony returns errors keyed by field name (e.g., "email", "password.first")
    // handleErrorsManyForm resolves "password.first" → #registration_password_first
    handleErrorsManyForm('registration', 'registration_form', data.errors);
  }
});
```

---

### Laravel + Blade

```blade
{{-- resources/views/auth/register.blade.php --}}
<form id="user_form" name="user" method="POST" action="{{ route('register') }}">
  @csrf

  <div class="mb-3">
    <label for="user_name">Name</label>
    <input type="text" id="user_name" name="name"
           class="form-control @error('name') is-invalid @enderror"
           value="{{ old('name') }}" />
    @error('name')
      <small class="text-danger fw-bold d-block">{{ $message }}</small>
    @enderror
  </div>

  <div class="mb-3">
    <label for="user_email">Email</label>
    <input type="email" id="user_email" name="email"
           class="form-control @error('email') is-invalid @enderror"
           value="{{ old('email') }}" />
  </div>

  <button type="submit" data-submits-with="Creating account...">Register</button>
</form>

<script type="module">
  import { handleErrorsManyForm, clearErrorInput } from '@wlindabla/form_validator';

  // Handle AJAX submission (Laravel API route)
  document.getElementById('user_form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const res = await fetch('{{ route("api.register") }}', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': '{{ csrf_token() }}',
        'Accept': 'application/json'
      },
      body: new FormData(form)
    });

    if (!res.ok) {
      const { errors } = await res.json(); // Laravel returns { errors: { field: ["msg"] } }
      handleErrorsManyForm('user', 'user_form', errors);
    }
  });

  // Clear on input
  document.querySelectorAll('#user_form input').forEach(input => {
    input.addEventListener('input', () => clearErrorInput(input));
  });
</script>
```

---

### Django + Django Templates

Django typically names fields as plain `name` attributes. Assign IDs using the `attrs` dict on widgets, or manually using `id_for_label`.

```python
# forms.py
from django import forms

class RegistrationForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'id': 'registration_email',
        'class': 'form-control',
        'pattern': r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'id': 'registration_password',
        'class': 'form-control'
    }))
```

```html
<!-- templates/registration.html -->
<form id="registration_form" name="registration" method="post">
  {% csrf_token %}
  {{ form.email.label_tag }}
  {{ form.email }}
  {{ form.password.label_tag }}
  {{ form.password }}
  <button type="submit" data-submits-with="Registering...">Register</button>
</form>

<script type="module">
  import { handleErrorsManyForm, clearErrorInput } from '@wlindabla/form_validator';

  const form = document.getElementById('registration_form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const res = await fetch('/api/register/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': '{{ csrf_token }}',
        'Accept': 'application/json'
      },
      body: new FormData(form)
    });

    const data = await res.json();

    if (!res.ok) {
      // Django REST Framework returns { "field": ["error"] }
      handleErrorsManyForm('registration', 'registration_form', data);
    }
  });

  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => clearErrorInput(input));
  });
</script>
```

---

### PHP + HTML (Plain)

```php
<?php
// process.php
header('Content-Type: application/json');

$errors = [];

if (empty($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = ['Please enter a valid email address.'];
}

if (empty($_POST['password']) || strlen($_POST['password']) < 8) {
    $errors['password'] = ['Password must be at least 8 characters.'];
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

echo json_encode(['message' => 'Registration successful!']);
```

```html
<!-- index.html -->
<form id="user_form" name="user">
  <input type="email" id="user_email" name="email" class="form-control" />
  <input type="password" id="user_password" name="password" class="form-control" />
  <button type="submit" data-submits-with="Please wait...">Register</button>
</form>

<script type="module">
  import { handleErrorsManyForm, clearErrorInput } from '@wlindabla/form_validator';

  const form = document.getElementById('user_form');

  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => clearErrorInput(input));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const res = await fetch('process.php', { method: 'POST', body: new FormData(form) });
    const data = await res.json();

    if (!res.ok) {
      handleErrorsManyForm('user', 'user_form', data.errors);
    } else {
      alert(data.message);
    }
  });
</script>
```

---

### Java (Thymeleaf / Jakarta EE)

```java
// UserController.java (Spring Boot)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDto dto, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, List<String>> errors = new HashMap<>();
            result.getFieldErrors().forEach(err ->
                errors.computeIfAbsent(err.getField(), k -> new ArrayList<>())
                      .add(err.getDefaultMessage())
            );
            return ResponseEntity.unprocessableEntity().body(Map.of("errors", errors));
        }
        // Process registration...
        return ResponseEntity.ok(Map.of("message", "Registered!"));
    }
}
```

```html
<!-- templates/register.html (Thymeleaf) -->
<form id="user_form" name="user" th:action="@{/register}" method="post">
  <input type="email" id="user_email" name="email" class="form-control" />
  <input type="password" id="user_password" name="password" class="form-control" />
  <button type="submit" data-submits-with="Registering...">Register</button>
</form>

<script type="module">
  import { handleErrorsManyForm, clearErrorInput } from '@wlindabla/form_validator';

  const form = document.getElementById('user_form');

  form.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', () => clearErrorInput(el));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });

    const data = await res.json();

    if (!res.ok) {
      // Spring Boot returns { errors: { email: ["..."], password: ["..."] } }
      handleErrorsManyForm('user', 'user_form', data.errors);
    }
  });
</script>
```

---

### C++ with HTML Frontend (WebAssembly / Emscripten)

When building C++ applications compiled to WebAssembly, the validation logic lives in JavaScript while C++ handles backend processing. Use this library on the HTML/JS side to display any validation messages sent back from your C++ WebAssembly module.

```cpp
// validator.cpp (compiled with Emscripten)
#include <emscripten/bind.h>
#include <string>
#include <map>
#include <vector>
#include <regex>

using namespace emscripten;

// Returns a JSON string of errors
std::string validateForm(const std::string& email, const std::string& password) {
    std::string result = "{\"errors\":{";
    bool hasErrors = false;

    std::regex emailRegex(R"(^[\w\.-]+@[\w\.-]+\.\w{2,}$)");
    if (!std::regex_match(email, emailRegex)) {
        result += "\"email\":[\"Invalid email address.\"]";
        hasErrors = true;
    }

    if (password.length() < 8) {
        if (hasErrors) result += ",";
        result += "\"password\":[\"Password must be at least 8 characters.\"]";
        hasErrors = true;
    }

    result += "}}";
    return hasErrors ? result : "{}";
}

EMSCRIPTEN_BINDINGS(validator) {
    function("validateForm", &validateForm);
}
```

```html
<!-- index.html -->
<form id="user_form" name="user">
  <input type="email" id="user_email" name="email" class="form-control" />
  <input type="password" id="user_password" name="password" class="form-control" />
  <button type="submit" data-submits-with="Validating...">Submit</button>
</form>

<script src="validator.js"></script> <!-- compiled WebAssembly JS glue -->
<script type="module">
  import { handleErrorsManyForm, clearErrorInput } from '@wlindabla/form_validator/utils';

  const form = document.getElementById('user_form');

  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => clearErrorInput(input));
  });

  // Wait for Wasm module to be ready
  Module.onRuntimeInitialized = () => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('user_email').value;
      const password = document.getElementById('user_password').value;

      // Call C++ validation logic
      const resultJson = Module.validateForm(email, password);
      const result = JSON.parse(resultJson);

      if (result.errors && Object.keys(result.errors).length > 0) {
        handleErrorsManyForm('user', 'user_form', result.errors);
      } else {
        alert('Form is valid! Proceeding...');
      }
    });
  };
</script>
```

---

## Advanced Patterns

### Real-time Validation with Debounce

```typescript
import { addErrorMessageFieldDom, 
clearErrorInput, 
getInputPatternRegex
 } from '@wlindabla/form_validator/utils';
import debounce from 'lodash.debounce'; // already a dependency of this package

const emailInput = document.getElementById('user_email') as HTMLInputElement;

const validateEmail = debounce(() => {
  clearErrorInput(emailInput);

  const regex = getInputPatternRegex(emailInput, 'ContactForm', 'i');
  if (regex && emailInput.value && !regex.test(emailInput.value)) {
    addErrorMessageFieldDom(emailInput, ['Please enter a valid email address.']);
  }
}, 400);

emailInput.addEventListener('input', validateEmail);
```

---

### Full Async Submit Handler with `SubmitterHandle`

```typescript
import { SubmitterHandle, handleErrorsManyForm, getFormAction } from '@wlindabla/form_validator/utils';

class CheckoutFormHandler extends SubmitterHandle {
  private form: HTMLFormElement;

  constructor(form: HTMLFormElement) {
    super(form);
    this.form = form;
  }

  async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    const action = getFormAction(this.form, event.submitter as HTMLButtonElement);

    SubmitterHandle.beforeSubmit(this.submitter);

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(this.form)
      });
      const data = await res.json();

      if (!res.ok) {
        handleErrorsManyForm('checkout', this.form.id, data.errors ?? {});
      } else {
        window.location.href = data.redirect;
      }
    } catch (err) {
      console.error('Network error:', err);
    } finally {
      SubmitterHandle.afterSubmit(this.submitter);
      this.resetSubmitterText();
    }
  }
}

const form = document.getElementById('checkout_form') as HTMLFormElement;
const handler = new CheckoutFormHandler(form);
form.addEventListener('submit', (e) => handler.submit(e as SubmitEvent));
```

---

## Browser Compatibility

| Browser | Version | Support |
|---|---|---|
| Chrome | 80+ | ✅ Full |
| Firefox | 75+ | ✅ Full |
| Safari | 13+ | ✅ Full |
| Edge | 80+ | ✅ Full |
| Opera | 67+ | ✅ Full |
| IE 11 | — | ❌ Not supported |

> This library uses native DOM APIs (`getElementById`, `insertAdjacentElement`, `classList`, `querySelector`). No jQuery dependency is required at runtime.

---

## Contributing & Support

- **Issues:** [https://github.com/Agbokoudjo/form_validator/issues](https://github.com/Agbokoudjo/form_validator/issues)
- **Pull Requests:** Welcome! Please open an issue first to discuss proposed changes.
- **Email:** internationaleswebservices@gmail.com
- **LinkedIn:** [INTERNATIONALES WEB APPS & SERVICES](https://www.linkedin.com/in/internationales-web-services-120520193/)

---

> **License:** MIT — Free to use in personal and commercial projects.
> © 2024–2025 AGBOKOUDJO Franck — INTERNATIONALES WEB APPS & SERVICES