# 📚 DOM Utilities Documentation

## Table of Contents

-   [smallError](#smallError)
-   [validatorErrorField](#validatorErrorField)
-   [createSmallErrorMessage](#createSmallErrorMessage)
-   [addErrorMessageFieldDom](#addErrorMessageFieldDom)
-   [handleErrorsManyForm](#handleErrorsManyForm)
-   [clearErrorInput](#clearErrorInput)
-   [getInputPatternRegex](#getInputPatternRegex)

::: {#smallError .section}
## `smallError`

The `smallError` function generates a `<small>` HTML element containing
an error message, optionally including a `data-key` attribute for
JavaScript tracking or debugging purposes.

### Function Signature

``` ts
export function smallError(
  message_error: string,
  className: string,
  id: string,
  key?: number
): string
    
```

### Parameters

-   **message_error** (`string`): The error message to be displayed.
-   **className** (`string`): The CSS class(es) applied to the `<small>`
    element.
-   **id** (`string`): A unique identifier for the HTML element.
-   **key** (`number`, optional): An optional numeric key used in the
    `data-key` attribute (useful for identifying or debugging elements).

### Returns

`string` --- A string representing an HTML `<small>` element with the
specified parameters.

### Behavior

If the `key` parameter is provided and is not `undefined` or `null`, the
function will include a `data-key` attribute in the output. Otherwise,
this attribute will be omitted.

### Example

``` ts
const html = smallError(
  "This field is required",
  "text-danger",
  "field-error",
  12345
);

// Output:
// <small id="field-error" class="text-danger" data-key="12345">This field is required</small>
    
```
:::

::: {#validatorErrorField .section}
## `validatorErrorField`

The `validatorErrorField` function generates a formatted block of HTML
`<small>` tags to display one or more validation error messages. It
supports customization of the CSS class, unique HTML IDs, and custom
separators for joining multiple messages.

### Function Signature

``` ts
  export const validatorErrorField = (
    validate_error_field: ValidatorErrorFieldProps = {
      messageerror: ' ',
      classnameerror: ["fw-bold", "text-danger", "mt-2"],
      id: `error-field-${Date.now()}`,
      separator_join: "<br/><hr/>"
    }
  ): string
    
```

### Parameters

-   **validate_error_field** (`ValidatorErrorFieldProps`, optional): An
    object containing the following properties:
    -   `messageerror` (`string | string[]`): The error message(s) to
        display.
    -   `classnameerror` (`string[]`): A list of CSS classes to apply to
        the `<small>` tags.
    -   `id` (`string`): The base HTML `id` used for each error element.
        If multiple messages exist, the index is appended.
    -   `separator_join` (`string`): A string used to join multiple
        `<small>` tags (default: `<br/><hr/>`).

### Returns

`string` --- A string containing one or more formatted `<small>` HTML
elements with appropriate classes and IDs.

### Behavior

-   If `messageerror` is an array, each message gets a unique ID and
    optional `data-key` attribute for debugging.
-   If it is a single string, a single `<small>` tag is returned.
-   CSS classes are dynamically joined from the provided array.
-   Messages are joined using the specified `separator_join`.

### Example Usage

``` ts
  validatorErrorField({
    messageerror: ["Field is required", "Must be a valid email"],
    classnameerror: ["text-danger", "mt-1"],
    id: "email-error",
    separator_join: "<br/>"
  });
  
  // Output:
  // <small id="email-error-0" class="error-message text-danger mt-1" data-key="0">Field is required</small>
  // <br/>
  // <small id="email-error-1" class="error-message text-danger mt-1" data-key="1">Must be a valid email</small>
    
```

### React Example

When using `validatorErrorField` inside a React component, you can
safely inject the generated HTML error messages using
`dangerouslySetInnerHTML`. Make sure the message content is sanitized
beforehand.

``` tsx
import React from 'react';
// Make sure to import validatorErrorField properly
import { validatorErrorField } from '@wlindabla/form_validator';

function MyFormErrorDisplay() {
  // Example usage with multiple error messages
  const errors = [
    "Username is required.",
    "Password must be at least 8 characters long."
  ];

  const htmlErrors = validatorErrorField({
    messageerror: errors,
    classnameerror: ["my-custom-error-class", "font-bold"],
    id: "form-validation-errors",
    separator_join: "<hr/>"
  });

  // Or with a single message:
  // const htmlErrors = validatorErrorField({
  //   messageerror: "A general error occurred.",
  //   id: "generic-error"
  // });

  return (
    <div className="error-container">
      {/* Be cautious with dangerouslySetInnerHTML! */}
      <div dangerouslySetInnerHTML={{ __html: htmlErrors }} />
    </div>
  );
}

export default MyFormErrorDisplay;
```

**⚠️ Warning:** When using `dangerouslySetInnerHTML` in React, make sure
the content is trusted or properly sanitized to avoid XSS
vulnerabilities.
:::

::: {#createSmallErrorMessage .section .doc-section .mt-5}
## createSmallErrorMessage {#createsmallerrormessage .text-primary .mb-4 .border-bottom .pb-2}

This function creates or retrieves a `<small>` HTML error message
element for a given input field using a unique key. It\'s useful when
multiple validation errors can exist per field and you want to uniquely
identify or reuse them in the DOM.

#### Function Signature {#function-signature-2 .mt-4}

``` {.bg-light .p-3 .rounded .border}
  
  createSmallErrorMessage(
    fieldInputID: string,
    errorMessage: string,
    keyError: number | string
  ): JQuery<HTMLElement>
  
    
```

#### Parameters {#parameters-2 .mt-4}

-   **fieldInputID** `(string)` -- The ID of the related input field.
-   **errorMessage** `(string)` -- The error text to display inside the
    element.
-   **keyError** `(number | string)` -- A unique identifier for the
    error (used in the element\'s ID).

#### Returns {#returns-2 .mt-4}

`JQuery<HTMLElement>` -- A jQuery object representing the existing or
newly created error message element.

#### Behavior {#behavior-2 .mt-4}

-   Generates a unique ID using the format
    `error-item-{fieldInputID}-{keyError}`.
-   Checks if an element with that ID already exists in the DOM.
-   If it exists, returns the existing element.\
    Otherwise, generates a new error message HTML using
    `validatorErrorField`, wraps it with jQuery, assigns a
    `data-field-id` attribute, and returns it.

#### Example {#example-1 .mt-4}

``` {.bg-light .p-3 .rounded .border}
  
  const errorElement = createSmallErrorMessage(
    "email", 
    "Email address is invalid.", 
    1
  );
  jQuery("#email").after(errorElement);
  
    
```

#### Related {#related .mt-4}

-   [`validatorErrorField`](#validatorErrorField) -- Generates
    structured error HTML.
-   [`smallError`](#smallError) -- Basic HTML generator for a single
    error message.
:::

::: {#addErrorMessageFieldDom .section .doc-section .mt-5}
## addErrorMessageFieldDom {#adderrormessagefielddom .text-primary .mb-4 .border-bottom .pb-2}

This function adds or updates validation error messages for a specific
input field in the DOM. It ensures that only one error container exists
per field and toggles Bootstrap-compatible error classes for styling and
feedback.

#### Function Signature {#function-signature-3 .mt-4}

``` {.bg-light .p-3 .rounded .border}
  
  addErrorMessageFieldDom(
    elmtfield: JQuery<HTMLElement>,
    errormessagefield?: string[],
    className_container_ErrorMessage?: string
  ): void
  
    
```

#### Parameters {#parameters-3 .mt-4}

-   **elmtfield** `(JQuery<HTMLElement>)` -- The target input, select,
    or textarea element to which validation messages are attached.
-   **errormessagefield** `(string[])` -- Optional list of error
    messages. If omitted or empty, any existing messages will be
    removed.
-   **className_container_ErrorMessage** `(string)` -- Optional custom
    class for styling the message container. Defaults to
    `"border border-3 border-light"`.

#### Returns {#returns-3 .mt-4}

`void` -- This function does not return anything. It directly
manipulates the DOM.

#### Behavior {#behavior-3 .mt-4}

-   Appends a `<div>` container after the input if it doesn\'t already
    exist.
-   Uses the input's `id` to uniquely identify its associated error
    container.
-   Each error message is rendered as a `<small>` element with
    attributes for styling and traceability.
-   Automatically adds the Bootstrap `is-invalid` class for red visual
    feedback.
-   If `errormessagefield` is not provided or is empty, removes all
    errors and clears the validation style.

#### Example {#example-2 .mt-4}

``` {.bg-light .p-3 .rounded .border}
  
  // Add multiple error messages for an email field
  addErrorMessageFieldDom($('#user_email'), [
    'This field is required.',
    'Must be a valid email address.'
  ]);
  
  // Clear errors for the same field
  addErrorMessageFieldDom($('#user_email'));
  
    
```

#### Related {#related-1 .mt-4}

-   [`createSmallErrorMessage`](#createSmallErrorMessage) -- Generates
    individual error `<small>` elements.
-   [`validatorErrorField`](#validatorErrorField) -- Assembles error
    messages into HTML strings.
:::

::: {#handleErrorsManyForm .section .doc-section .mt-5}
## handleErrorsManyForm {#handleerrorsmanyform .text-primary .border-bottom .pb-2}

Handles and displays or clears multiple validation errors for a form,
including support for nested field names. It ensures a clean reset of
any previous errors and updates the form fields with the latest
feedback.

#### Function Signature {#function-signature-4 .mt-4}

``` {.bg-light .p-3 .rounded .border}
  
  handleErrorsManyForm(
    formName: string,
    formId: string,
    errors: Record<string, string[]>
  ): void
  
    
```

#### Parameters {#parameters-4 .mt-4}

-   **formName** `(string)` -- The name or alias of the form. This acts
    as a prefix to locate fields in the DOM (e.g., `user_email`).
-   **formId** `(string)` -- The HTML `id` of the form element. Used to
    scope both error clearing and error application.
-   **errors** `(Record<string, string[]>)` -- An object representing
    validation errors, where each key is a field name and each value is
    an array of messages.

#### Behavior {#behavior-4 .mt-4}

1.  Clears all previous error messages and `is-invalid` classes from
    fields under the specified form.
2.  Iterates through the `errors` object and locates each corresponding
    input field using a naming convention: `${formName}_${fieldName}`.
3.  For each field found, it uses `addErrorMessageFieldDom` to display
    errors visually below the input field.
4.  If a field cannot be found in the DOM, a warning is logged via
    `Logger.warn`.

#### Return Value {#return-value .mt-4}

`void` -- This function performs DOM manipulation directly and returns
nothing.

#### Example Usage {#example-usage-1 .mt-4}

``` {.bg-light .p-3 .rounded .border}
  
  // Show validation errors for 'user' form with ID 'user_form'
  handleErrorsManyForm('user', 'user_form', {
    "email": ["This field is required.", "Must be a valid email."],
    "address.city": ["City is required."]
  });
  
  // Clear all previous errors from 'user_form'
  handleErrorsManyForm('user', 'user_form', {});
  
    
```

#### Assumptions {#assumptions .mt-4}

-   Form field elements follow a naming convention such as
    `formName_fieldName`.
-   Error containers are generated using the `addErrorMessageFieldDom`
    utility.
-   Fields and error containers are uniquely identifiable using their ID
    attributes.

#### Related {#related-2 .mt-4}

-   [`addErrorMessageFieldDom`](#addErrorMessageFieldDom) -- Displays
    individual field errors.
-   [`createSmallErrorMessage`](#createSmallErrorMessage) -- Creates a
    single error message element.
:::

::: {#clearErrorInput .section .doc-section .mt-5}
## clearErrorInput {#clearerrorinput .text-primary .border-bottom .pb-2}

Removes all validation error indicators for a specific input field,
including both the `is-invalid` class and the associated error message
container.

#### Function Signature {#function-signature-5 .mt-4}

``` {.bg-light .p-3 .rounded .border}
  
  clearErrorInput(inputFieldJQuery: JQuery<HTMLElement>): void
  
    
```

#### Parameters {#parameters-5 .mt-4}

-   **inputFieldJQuery** `(JQuery<HTMLElement>)` -- A jQuery-wrapped
    input element (e.g., `<input>`, `<select>`, or `<textarea>`) from
    which errors should be cleared.

#### Behavior {#behavior-5 .mt-4}

1.  Retrieves the `id` of the target input field to locate its
    associated error container.
2.  If the field has the `is-invalid` class, it removes this class to
    visually clear the error state.
3.  Locates the associated error container element by its generated ID
    (`container-div-error-message-FIELD_ID`), and removes it from the
    DOM if present.
4.  If the `is-invalid` class is not present, it still checks for and
    removes the error container in case it exists due to manual
    inconsistencies.
5.  If the input field lacks an `id`, a warning is logged and the
    function exits without making changes.

#### Return Value {#return-value-1 .mt-4}

`void` -- The function performs DOM updates in place and does not return
any value.

#### Example Usage {#example-usage-2 .mt-4}

``` {.bg-light .p-3 .rounded .border}
  
  // To clear all validation errors from the input field with ID "user_email":
  clearErrorInput($('#user_email'));
  
    
```

#### Related {#related-3 .mt-4}

-   [`addErrorMessageFieldDom`](#addErrorMessageFieldDom) -- Adds or
    updates validation error messages for a field.
-   [`handleErrorsManyForm`](#handleErrorsManyForm) -- Processes and
    displays multiple field errors for an entire form.
:::

::: {#getInputPatternRegex .section .doc-section .mt-5}
## getInputPatternRegex {#getinputpatternregex .text-primary .border-bottom .pb-2}

Converts a `pattern` attribute from an `<input>` or `<textarea>` element
into a JavaScript `RegExp` object with optional flags. This is
particularly useful for validating form input values against constraints
defined in HTML.

#### Function Signature {#function-signature-6 .mt-4}

``` {.bg-light .p-3 .rounded .border}
  
  getInputPatternRegex(
    children: HTMLElement | JQuery<HTMLElement>,
    formParentName: string,
    flag?: string
  ): RegExp | undefined
  
    
```

#### Parameters {#parameters-6 .mt-4}

-   **children** `(HTMLElement | JQuery<HTMLElement>)` -- A reference to
    the DOM input or textarea element that contains a `pattern`
    attribute.
-   **formParentName** `(string)` -- A human-readable label or name for
    the form used in error logging for better debugging context.
-   **flag** `(string, optional)` -- Regex flags such as `i`, `g`, `u`,
    etc. Defaults to `"i"`.

#### Returns {#returns-4 .mt-4}

A `RegExp` object if the pattern is found and valid; otherwise
`undefined`. Errors are logged or thrown if issues occur during parsing.

#### Behavior {#behavior-6 .mt-4}

1.  Ensures the element exists in the DOM; otherwise, logs a warning and
    returns `undefined`.
2.  Validates that the `flag` parameter contains only accepted regex
    characters.
3.  Extracts the `pattern` attribute (or `data-pattern`) from the
    input/textarea element.
4.  If the pattern is found, constructs and returns a `RegExp` object
    using the pattern and the flags.
5.  Logs helpful messages via `Logger` in case of issues.

#### Example (Vanilla JS) {#example-vanilla-js .mt-4}

``` {.bg-light .p-3 .rounded .border}
  
  const input = document.querySelector('#email') as HTMLInputElement;
  const regex = getInputPatternRegex(input, 'LoginForm', 'gi');
  if (regex?.test(input.value)) {
    console.log('Valid email input!');
  }
  
    
```

#### Example (React) {#example-react .mt-4}

``` {.bg-light .p-3 .rounded .border .language-tsx}
  
  import React, { useRef } from 'react';
  
  export function MyFormComponent() {
    const inputRef = useRef<HTMLInputElement>(null);
  
    const handleValidate = () => {
      if (inputRef.current) {
        const regex = getInputPatternRegex(inputRef.current, 'MyReactForm', 'i');
        const value = inputRef.current.value;
        if (regex?.test(value)) {
          console.log('✅ Valid input!');
        } else {
          console.warn('❌ Invalid input!');
        }
      }
    };
  
    return (
      <div>
        <input
          ref={inputRef}
          type="text"
          name="username"
          pattern="^[a-zA-Z0-9_]{4,12}+$"
          placeholder="Enter your username"
        />
        <button onClick={handleValidate}>Validate</button>
      </div>
    );
  }
  
    
```

#### Related {#related-4 .mt-4}

-   [`addErrorMessageFieldDom`](#addErrorMessageFieldDom)
-   [`handleErrorsManyForm`](#handleErrorsManyForm)
-   [`validatorErrorField`](#validatorErrorField)
:::
