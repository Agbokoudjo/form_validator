##

- This file is part of the project by AGBOKOUDJO Franck.
-
- (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
- Phone: +229 01 67 25 18 86
- LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
- Company: INTERNATIONALES WEB SERVICES
-
- For more information, please feel free to contact the author.

##

# Form Validator

# 📌 Form Validator

**Form Validator** is a powerful JavaScript/TypeScript library designed to validate various types of fields in HTML forms. It supports input fields such as `text`, `email`, `tel`, `password`, as well as file types like `images`, `PDFs`, `Word documents`, `CSV`, `Excel`, and more. The library offers customizable configurations to suit different validation needs.

---

## 🚀 Features

✅ **Validation of input fields** (`text`, `email`, `password`, `tel`): Managed by the `FormInputValidator` class.  
✅ **File validation** (`images`, `PDFs`, `Word`, `CSV`, `Excel`): Controlled by `ImageValidator` and `DocumentsValidator`.  
✅ **Custom validation rules**: Allows adding your own validation rules dynamically.  
✅ **Easy integration**: Works seamlessly with `jQuery` and `TypeScript`.  
✅ **Error handling and messages**: Provides clear error messages and custom handlers.  

---

## 📦 Installation

You can install `Form Validator` via **npm**:

```sh
yarn add @wlindabla/form_validator

---

## 📋 Formulaire HTML

```html
<div class="container" id="app">
       <div id="app-header"></div>
       <hr/><br/>
      <div class="form-group text-center">
        <strong class="text-center fw-bolder">Text formatting and Field Data Validation</strong>
        <form class="form">
          <label for="lastname">Lastname</label><br/>
          <input type="text" class="form-control lastname"
          placeholder="Eg:AGBOKOUDJO" id="lastname" name="lastname"/><br/>
           <label for="firstname">Firstnames</label><br/>
          <input type="text" class="form-control firstname"
          placeholder="Eg:Franck Empedocle Hounha" id="firstname" name="firstname"/><br/>
          <label for="username">Fullname</label><br/>
          <input type="text" class="form-control username"
          placeholder="Eg:AGBOKOUDJO Hounha Franck or Hounha Franck AGBOKOUDJO" 
          id="username" name="username"
          position-lastname="right"
          /><br/>
          <hr/><br/>
           <label for="email">Email</label><br/>
          <input type="email" class="email form-control" 
          placeholder="Eg:franckagbokoudjo301@gmail.com" id="email" name="email"/><br/>
          <label for="tel">Phone:</label>
            <input type="tel" class="tel form-control" 
          placeholder="Eg:+22967251886" id="tel" name="tel"/><br/>
          <label for="message" class="form-label">Message:</label>
          <textarea id="message"
          class="form-control" 
           placeholder="write the message here" rows="10" cols="5">

          </textarea>
          <hr/><br/>
          <strong class="text-center fw-bolder">File Validation</strong><br/>
          <label for="img">Uploader des images</label><br/>
          <input type="file" class="images form-control" multiple 
          placeholder="choose images many or one" id="img" 
          name="images"/><br/>
           <label for="pdf">Uploader des documents pdf</label><br/>
          <input type="file" class="pdf form-control" multiple 
          placeholder="choose pdf many or one" id="pdf" name="pdf"/><br/>
          
          <button type="submit" class="btn-submit btn ">Valider</button>
        </form>
      </div>
    </div>
```

---

## 🛠️ Script de Validation avec `jQuery` et `TypeScript`

```typescript
import jQuery from "jquery";
import { debounce } from "lodash";
import {
  clearErrorInput,
  serviceInternclass,
} from "@wlindabla/form_validator";
import {FormInputValidator} from "@wlindabla/form_validator";
import {DocumentValidator} from "@wlindabla/form_validator";
import {ImageValidator} from "@wlindabla/form_validator";
import {FormFormattingEvent} from "@wlindabla/form_validator";
const formInputValidator = FormInputValidator.getInstance();
const documentValidator = DocumentValidator.getInstance();
const videoValidator = VideoValidator.getInstance();
const formFormattingEvent = FormFormattingEvent.getInstance();
const imageValidator = ImageValidator.getInstance();



```

---

Here is a well-formatted English version of your `README.md` with clear explanations and proper structure:  

```md
# 📝 Code Explanation  

# FormFormattingEvent Library

## Overview
The `FormFormattingEvent` library provides utility functions to format user input in forms, such as transforming last names to uppercase, capitalizing usernames, and ensuring a standardized username format.

## Installation
Ensure that your project supports ES6 module imports. You can import the library as follows:

```javascript
import {FormFormattingEvent} from "@wlindabla/form_validator";
const formFormattingEvent = FormFormattingEvent.getInstance();
```

## Usage

### 1. Convert Last Name to Uppercase
The `lastnameToUpperCase` function ensures that the last name is converted to uppercase.

**Syntax:**
```javascript
formFormattingEvent.lastnameToUpperCase(element, locale);
```

**Example:**
```javascript
jQuery(function validateInput() {
  formFormattingEvent.lastnameToUpperCase(this, 'en');
});
```

### 2. Capitalize Username
The `capitalizeUsername` function capitalizes the first letter of each word in the username while maintaining a proper name format.

**Syntax:**
```javascript
formFormattingEvent.capitalizeUsername(element, separator, finalSeparator, locale);
```

**Example:**
```javascript
jQuery(function validateInput() {
  formFormattingEvent.capitalizeUsername(this, " ", " ", 'en');
});
```

### 3. Format Username Dom
The `usernameFormatDom` function applies complete formatting to the username field, ensuring proper capitalization and spacing.

**Syntax:**
```javascript
formFormattingEvent.usernameFormatDom(element, separator, finalSeparator, locale);
```

**Example:**
```javascript
jQuery(function validateInput() {
  formFormattingEvent.usernameFormatDom(this, " ", " ", 'en');
});
```

## Notes
- These functions are designed to be used within a jQuery context.
- Ensure that your form elements trigger these functions appropriately on user input events such as `blur` or `change`.


## License
This library is licensed under MIT. Feel free to use and modify it as needed.

## Contributing
If you find any issues or have suggestions for improvements, feel free to submit a pull request or open an issue on the repository.

---

# 📌 `escapeHtmlBalise` – Escape HTML Content Securely

## 📖 Description

The `escapeHtmlBalise` function is a utility designed to sanitize and escape HTML characters in strings, arrays, and objects. It ensures that any potential HTML content is either removed or converted into a safe format to prevent XSS (Cross-Site Scripting) attacks.

---

Then, import the function into your project:

```ts
import { escapeHtmlBalise } from "@wlindabla/form_validator";
```

---

## 🛠️ Function Usage

### 📌 Signature
```ts
escapeHtmlBalise(
    content: string | string[] | Record<string, any>,
    stripHtmlTags: boolean = true
): string | string[] | Record<string, any>
```

### 📌 Parameters

| Parameter        | Type                            | Default | Description |
|-----------------|--------------------------------|---------|-------------|
| `content`       | `string | string[] | Record<string, any>` | - | The input data to be escaped. It can be a string, an array of strings, or an object containing strings. |
| `stripHtmlTags` | `boolean`                      | `true`  | If `true`, HTML tags are removed. If `false`, tags are preserved but escaped. |

---

## 📤 Return Value

The function returns:
- A **string** if the input is a single string.
- An **array of strings** if the input is an array.
- An **object with all values escaped** if the input is an object.

---

## 📌 Example Usage

### 🟢 Escaping a Single String
```ts
const unsafeString = "<script>alert('XSS Attack!')</script>";
const safeString = escapeHtmlBalise(unsafeString);
console.log(safeString); 
// Output: alert('XSS Attack!')
```

### 🟢 Processing an Array of Strings
```ts
const unsafeArray = ["<b>Bold</b>", "<i>Italic</i>", "<script>maliciousCode()</script>"];
const safeArray = escapeHtmlBalise(unsafeArray);
console.log(safeArray);
// Output: ["Bold", "Italic", "maliciousCode()"]
```

### 🟢 Escaping an Object
```ts
const unsafeObject = {
    name: "<h1>John Doe</h1>",
    bio: "<p>Hello <script>alert('Hacked!')</script></p>"
};
const safeObject = escapeHtmlBalise(unsafeObject);
console.log(safeObject);
// Output: { name: "John Doe", bio: "Hello alert('Hacked!')" }
```

### 🟢 Keeping HTML Tags but Escaping Special Characters
```ts
const unsafeString = "<b>Important</b>";
const safeString = escapeHtmlBalise(unsafeString, false);
console.log(safeString);
// Output: "&lt;b&gt;Important&lt;/b&gt;"
```

---

## 🔥 Error Handling

If `escapeHtmlBalise` is called with `null`, `undefined`, or an empty object, it throws the following error:

```ts
throw new Error("I expected a string no empty,array or object but it is not yet");
```

---

## 💡 Additional Notes

- This function **does not decode** escaped characters (e.g., `&lt;` stays `&lt;`).
- When `stripHtmlTags` is set to `false`, HTML tags remain but are encoded.

---

## 🛠️ Related Functions

- `formFormattingEvent.lastnameToUpperCase(this, 'en');`
- `formFormattingEvent.capitalizeUsername(this, " ", " ", 'en');`
- `formFormattingEvent.usernameFormatDom(this," "," ","en");`

---

---

### `ucfirst` Function

The `ucfirst` function capitalizes the first letter of a word and converts the rest to lowercase.

#### Parameters

- **`str`** (`string`): The input string to transform. This is the word or phrase on which the function will operate.
- **`escapeHtmlBalise_string`** (`boolean`, optional, default value: `true`): If `true`, the HTML tags in the string will be escaped before applying the transformation. If `false`, the HTML tags will be left as they are.
- **`locales`** (`string | string[]`, optional): Defines the locale(s) to use for capitalization (e.g., `'fr'` for French, `'en'` for English). If not specified, the default locale will be used.

#### Returns

The function returns a formatted string where the first letter is uppercase and the rest are lowercase. For example, "agbokoudjo" becomes "Agbokoudjo".

#### Example Usage

```typescript
import { ucfirst } from '@wlindabla/form_validator';

const result = ucfirst("agbokoudjo"); 
console.log(result); // Outputs "Agbokoudjo"

const resultWithHtmlEscape = ucfirst("<b>agbokoudjo</b>", true);
console.log(resultWithHtmlEscape); // Outputs "&lt;b&gt;Agbokoudjo&lt;/b&gt;"

const resultWithCustomLocale = ucfirst("agbokoudjo", true, 'fr');
console.log(resultWithCustomLocale); // Outputs "Agbokoudjo"
```

---

---

### `nl2br` Function

This function automatically adds line breaks (`<br>`) to a string wherever there are newlines.

#### Parameters

- **`str`** (`string`): The input string to which line breaks will be added.

#### Returns

The function returns the string with `<br>` inserted wherever newlines exist.

#### Example Usage

```typescript
import { nl2br } from '@wlindabla/form_validator';

const result = nl2br("Hello\nWorld");
console.log(result); // Outputs "Hello<br>World"
```

---

### `capitalizeString` Function

The `capitalizeString` function capitalizes the first letter of each word in a string and converts the rest to lowercase. It's ideal for formatting names or titles.

#### Parameters

- **`data`** (`string`): The string to be transformed.
- **`separator_toString`** (`string`, optional, default value: `" "`): The separator used to split the string into words.
- **`finale_separator_toString`** (`string`, optional, default value: `" "`): The separator used to join the formatted words.
- **`escapeHtmlBalise_string`** (`boolean`, optional, default value: `true`): If `true`, HTML tags in the string will be escaped.
- **`locales`** (`string | string[]`, optional): The locale(s) used for the capitalization.

#### Returns

The function returns a string where the first letter of each word is capitalized, and the rest are in lowercase.

#### Example Usage

```typescript
import { capitalizeString } from '@wlindabla/form_validator';

const result = capitalizeString("hounha franck empedocle");
console.log(result); // Outputs "Hounha Franck Empedocle"

const resultWithCustomSeparator = capitalizeString("hounha, franck, empedocle", ",");
console.log(resultWithCustomSeparator); // Outputs "Hounha, Franck, Empedocle"
```

---

### `usernameFormat` Function

This function formats a full name by capitalizing the first letter of each first name and last name, while placing the last name either at the beginning or the end of the string.

#### Parameters

- **`value_username`** (`string`): The full name to format (e.g., first name and last name).
- **`position_lastname`** (`"left" | "right"`, optional, default value: `"left"`): The position of the last name in the formatted string (`"left"` places the last name first, `"right"` places it last).
- **`separator_toString`** (`string`, optional, default value: `" "`): The separator used to split the string into words.
- **`finale_separator_toString`** (`string`, optional, default value: `" "`): The separator used to join the formatted words.
- **`locales`** (`string | string[]`, optional): The locale(s) used for uppercase formatting.

#### Returns

The function returns the formatted full name, with the last name placed according to the `position_lastname` argument. It capitalizes the first letter of each first name and last name.

#### Example Usage

```typescript
import { usernameFormat } from '@wlindabla/form_validator';

const resultLeft = usernameFormat("Agbokoudjo hounha franck empedocle", "left");
console.log(resultLeft); // Outputs "AGBOKOUDJO Hounha Franck Empedocle"

const resultRight = usernameFormat("hounha franck empedocle Agbokoudjo", "right");
console.log(resultRight); // Outputs "Hounha Franck Empedocle AGBOKOUDJO"
```

---


```markdown
# URL Utility Functions

This module contains utility functions to manipulate URLs by adding query parameters or creating URLs from form data.

## Features

### `addParamToUrl`

This function adds query parameters to an existing URL. It also allows you to return the modified URL either as a string or as an instance of the `URL` object.

#### Parameters

- **`urlparam`** (`string | URL`): The URL to which parameters should be added. This can be a string representing a URL or an instance of the `URL` object.
- **`addparamUrlDependencie`** (`Record<string, any> | null`, optional, default: `null`): An object representing the URL parameters to add, in key-value pairs. If `null`, no additional parameters will be added.
- **`returnUrl`** (`boolean`, optional, default: `true`): If `true`, the function returns the modified URL as a string. If `false`, it returns an instance of the `URL` object.
- **`baseUrl`** (`string | URL | undefined`, optional, default: `window.location.origin`): The base URL to use for the given `urlparam`. By default, it uses the current window's origin.

#### Return

The function returns either:
- A **string** representing the modified URL (if `returnUrl = true`), or
- An **instance of the `URL` object** representing the modified URL (if `returnUrl = false`).

#### Example Usage

```typescript
import { addParamToUrl } from '@wlindabla/form_validator';

// Adding parameters to a given URL
const updatedUrl = addParamToUrl('https://example.com', { page: 2, sort: 'asc' });
console.log(updatedUrl); // Logs the URL with the new parameters as a string

// Returning a URL instance
const urlInstance = addParamToUrl('https://example.com', { page: 2 }, false);
console.log(urlInstance instanceof URL); // Logs 'true'
```

---

### `buildUrlFromForm`

This function creates a URL by extracting parameters from an HTML form and adding additional parameters to it.

#### Parameters

- **`formElement`** (`HTMLFormElement`): The form element from which the data will be extracted to build the URL.
- **`form_action`** (`string | null`, optional, default: `null`): The form action URL to use as the base for the URL. If not specified, the action URL of the `formElement` is used.
- **`addparamUrlDependencie`** (`Record<string, any> | null`, optional): An object representing additional parameters to add to the URL, in key-value pairs.
- **`returnUrl`** (`boolean`, optional, default: `true`): If `true`, the function returns the URL as a string. If `false`, it returns an instance of the `URL` object.
- **`baseUrl`** (`string | URL | undefined`, optional, default: `window.location.origin`): The base URL to use for the constructed URL.

#### Return

The function returns either:
- A **string** representing the constructed URL with the form parameters and additional parameters (if `returnUrl = true`), or
- An **instance of the `URL` object** representing the constructed URL (if `returnUrl = false`).

#### Example Usage

```typescript
import { buildUrlFromForm } from '@wlindabla/form_validator';

// Assuming we have a form element in our HTML
const form = document.querySelector('form') as HTMLFormElement;
const additionalParams = { userId: 123 };

// Building the URL from the form data and adding additional parameters
const formUrl = buildUrlFromForm(form, null, additionalParams);
console.log(formUrl); // Logs the URL with form parameters and additional parameters
```

---


```

---
---
### **httpFetchHandler Function**
The `httpFetchHandler` function is an asynchronous utility for making HTTP requests with built-in timeout handling, retry attempts, and automatic response parsing.

### **Parameters**
| Parameter       | Type                                  | Default Value    | Description |
|----------------|--------------------------------------|-----------------|-------------|
| `url`          | `string | URL`                      | **Required**     | The API endpoint to send the request to. |
| `methodSend`   | `string`                             | `"GET"`          | The HTTP method (`GET`, `POST`, `PUT`, `DELETE`, etc.). |
| `data`         | `any`                                | `null`           | The data to send in the request body (supports JSON and FormData). |
| `optionsheaders` | `HeadersInit`                     | `{ 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }` | Custom headers for the request. |
| `timeout`      | `number`                             | `5000` (5 sec)   | The maximum time (in milliseconds) before the request is aborted. |
| `retryCount`   | `number`                             | `3`              | Number of times to retry the request if it fails. |
| `responseType` | `'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData' | 'stream'` | `'json'`          | The expected response format. |

### **Return Value**
The function returns a `Promise` that resolves to the requested data in the specified `responseType`.

### **Function Workflow**
1. **FormData Handling**  
   - If `data` is an instance of `FormData`, it automatically manages headers.
   - The `"Content-Type"` header is **removed** to let the browser set it correctly.

2. **Headers Handling**  
   - If the headers are a `HeadersInit` object, they are converted to a mutable object using:  
     ```ts
     Object.fromEntries(new Headers(optionsheaders).entries());
     ```
   - This avoids `TypeScript` errors when modifying headers.

3. **Data Handling with `JSON.stringify`**  
   - When sending `JSON` data, the function **automatically converts it** using `JSON.stringify(data)`.  
   - **Important:** Do not manually stringify the data before passing it, to avoid double encoding.  
   - Example:  
     ```ts
     httpFetchHandler({ url: "/api", methodSend: "POST", data: { name: "John" } });
     ```
     ✅ The function internally does:  
     ```ts
     JSON.stringify({ name: "John" });
     ```

4. **Request Timeout Handling**  
   - Uses `AbortController` to automatically cancel requests after `timeout` milliseconds.

5. **Retry Mechanism**  
   - If the request fails, the function retries up to `retryCount` times before throwing an error.

### **Example Usage**
```ts
import { httpFetchHandler } from '@wlindabla/form_validator';
const response = await httpFetchHandler({
  url: "https://api.example.com/data",
  methodSend: "POST",
  data: { username: "Alice" },
  responseType: "json"
});

console.log(response); // Parsed JSON response
```

---

### `mapStatusToResponseType(status: number): 'success' | 'info' | 'warning' | 'error'`

This function maps an HTTP status code to a response type, which helps in categorizing the status for easier handling in the application. The response type is returned based on the HTTP status code provided as input.

#### Parameters:
- `status` (number): The HTTP status code received from an API response. This value is used to determine the appropriate response type.

#### Returns:
- **'success'**: For status codes in the 200–299 range, indicating successful requests (e.g., `200 OK`, `201 Created`).
- **'info'**: For status codes in the 100–199 range, indicating informational responses (e.g., `100 Continue`, `101 Switching Protocols`).
- **'warning'**: For status codes in the 300–399 range, indicating redirection responses (e.g., `301 Moved Permanently`, `302 Found`).
- **'error'**: For status codes in the 400–499 range, indicating client errors (e.g., `404 Not Found`, `401 Unauthorized`), and for status codes in the 500–599 range, indicating server errors (e.g., `500 Internal Server Error`, `503 Service Unavailable`).

If the status code is not covered by the defined ranges, it defaults to `'error'` for safety.

#### Example usage:
```typescript
const responseType = mapStatusToResponseType(200);
console.log(responseType); // 'success'

const responseType = mapStatusToResponseType(404);
console.log(responseType); // 'error'

---

## **Form Error Handling Functions**

This section describes three functions used to manage form errors and display validation messages in your web application. These functions help in handling error messages dynamically, showing validation feedback for input fields, and ensuring proper form submission behavior.

### **1. `serviceInternclass`**

The `serviceInternclass` function handles error messages for the input field and manages the submit button's state based on whether the input field is valid or not.

#### **Usage:**
import {
  clearErrorInput,
  serviceInternclass,
} from "@wlindabla/form_validator/_fonction/function_dom";
This function checks if the input field is valid. If it's not, it disables the submit button and hides it. If the field is valid, the submit button is enabled and displayed.

- **Parameters:**
  - `input_field` (`JQuery<HTMLInputElement | HTMLTextAreaElement>`): The input field (either `<input>` or `<textarea>`) to validate.
  - `errorhandle` (`FormErrorInterface`): An instance of the form error handler that provides validation logic for the field.

- **Example:**

```ts
const inputField = jQuery('#username');  // Input field with id 'username'.
const errorHandle = new FormErrorInterface();  // Form error handler instance.

serviceInternclass(inputField, errorHandle);  // Validate the field and handle button state.
```

---

### **2. `addErrorMessageFieldDom`**

The `addErrorMessageFieldDom` function displays error messages associated with a specific input field in the DOM.

#### **Usage:**

This function checks if there are any error messages for the field. If errors are present, it appends them to the field and adds a class (`is-invalid`) to indicate validation failure.

- **Parameters:**
  - `fieldId` (`string`): The unique ID of the field where the error messages will be displayed.
  - `errorhandle` (`FormErrorInterface`): An instance of the error handler that provides error messages for the field.

- **Example:**

```ts
const fieldId = 'username';  // ID of the input field.
const errorHandle = new FormErrorInterface();  // Form error handler instance.

addErrorMessageFieldDom(fieldId, errorHandle);  // Display error messages for the field.
```

---

### **3. `handleErrorsManyForm`**

The `handleErrorsManyForm` function manages errors for multiple fields within a form and displays them next to the respective input fields.

#### **Usage:**

This function loops through a list of errors, adds the `is-invalid` class to the fields with errors, and appends the error messages next to them. It’s particularly useful for handling form-wide validation at once.

- **Parameters:**
  - `formName` (`string`): The name of the form.
  - `formId` (`string`): The ID of the form.
  - `errors` (`Record<string, string>`): An object where the keys are field names, and the values are corresponding error messages.

- **Example:**

```ts
const formName = 'registrationForm';  // Name of the form.
const formId = 'regForm';  // ID of the form.
const errors = {
    username: 'Username is required.',
    email: 'Email is not valid.',
};

handleErrorsManyForm(formName, formId, errors);  // Handle and display errors for multiple fields.
```

---

## **How to Use These Functions**

1. **Install and Import**  
   Ensure you have jQuery and the necessary error handler class (`FormErrorInterface`) available in your project.

2. **Initialize and Use the Functions**  
   For each form field that you need to validate, call `serviceInternclass` or `addErrorMessageFieldDom`. For handling multiple fields at once, use `handleErrorsManyForm`.

3. **Customize Error Handling**  
   Customize the error messages and validation logic within the `FormErrorInterface` class according to your needs.

---

---

# Input Validation Class Documentation

## Overview
This TypeScript class provides a flexible and reusable validation system for different types of input fields. It includes various validation methods to ensure data integrity and security when handling user input.

## Methods and Explanations

### 1. `allTypesValidator` Method
This is the main entry point for validating different types of input fields.

**Parameters:**
- `datainput`: The value to be validated.
- `targetInputname`: The name of the input field.
- `type_field`: The type of input field (e.g., email, password, text, etc.).
- `options_validator`: Validation options that vary depending on the field type.

**Functionality:**
- Uses a `switch` statement to determine the field type.
- Calls the appropriate validation method (e.g., `emailValidator`, `textValidator`, etc.).
- Ensures that the provided validation options are correct before executing validation.
- Throws an error if an invalid type or options are used.

---

### 2. `textValidator` Method
Validates **text input fields** according to specified rules.

**Parameters:**
- `datainput`: The text input value.
- `targetInputname`: The name of the input field.
- `optionsinputtext`: A configuration object specifying validation rules.

**Validation Steps:**
1. **Sanitization:** Trims the input and removes HTML and PHP tags if `escapestripHtmlAndPhpTags` is `true`.
2. **Regex Check:** Ensures the text matches the allowed character set (default: only letters and spaces).
3. **Length Validation:** Ensures the text meets the `minLength` and `maxLength` constraints.
4. **Required Field Validation:** Ensures the field is filled if `requiredInput` is `true`.

---

### 3. `emailValidator` Method
Validates an **email address**.

**Parameters:**
- `datavalueemail`: The email input value.
- `targetInputnameemail`: The name of the input field.
- `optionsinputemail`: A configuration object specifying validation rules.

**Functionality:**
- Calls `textValidator` with an **email regex pattern**.
- Ensures the email format is valid (e.g., `example@domain.com`).
- Checks **length constraints** (default: 6 to 180 characters).
- Ensures the field is **required** unless explicitly set otherwise.

---

### 4. `telValidator` Method
Validates a **telephone number**.

**Parameters:**
- `data_tel`: The phone number input.
- `targetInputname`: The name of the input field.
- `optionsinputTel`: A configuration object specifying validation rules.

**Functionality:**
- Calls `textValidator` with a **phone number regex**.
- Ensures it follows a valid format (e.g., `+229016725186`).
- Checks **length constraints** (default: 8 to 80 characters).
- Ensures the field is **required** unless explicitly set otherwise.

---

### 5. `passwordValidator` Method
Validates **password inputs** based on security rules.

**Parameters:**
- `datainput`: The password input.
- `targetInputname`: The name of the input field.
- `optionsinputtext`: A configuration object specifying password constraints.

**Validation Steps:**
1. **Trimming:** Removes extra spaces.
2. **Character Requirements:**
   - **Uppercase letter** check.
   - **Lowercase letter** check.
   - **Numeric digit** check.
   - **Special character** check.
   - **Custom regex validation** if provided.
3. **Length Validation:** Ensures the password meets the `minLength` and `maxLength` constraints.
4. **Required Field Validation:** Ensures the field is filled if `requiredInput` is `true`.

---

### 6. `urlValidator` Method
Validates a **URL input**.

**Parameters:**
- `urlData`: The URL string to validate.
- `targetInputname`: The name of the input field.
- `url_options`: A configuration object specifying URL constraints.

**Validation Steps:**
1. **Regex Validation:** Ensures the URL follows a valid format.
2. **Protocol Check:** Ensures the URL uses an allowed protocol (e.g., `http`, `https`, `ftp`).
3. **TLD Requirement:** Ensures the hostname contains a top-level domain (TLD) if required.
4. **Localhost Restriction:** Ensures localhost is disallowed if `allowLocalhost` is `false`.
5. **IP Restriction:** Ensures IP addresses are disallowed if `allowIP` is `false`.
6. **Query Parameter & Fragment Check:** Ensures query parameters (`?key=value`) and fragments (`#section`) are allowed or blocked.

---

### 7. `dateValidator` Method
Validates a **date input**.

**Parameters:**
- `date_input`: The date string.
- `targetInputname`: The name of the input field.
- `date_options`: A configuration object specifying date constraints.

**Validation Steps:**
1. **Required Check:** Ensures the field is filled if `requiredInput` is `true`.
2. **Regex Validation:** Ensures the date follows a valid format (default: `YYYY-MM-DD`).
3. **Custom Date Range:** Can enforce a valid date range (e.g., no future dates allowed).

--- 

---

### `selectValidator` Method  

This method validates whether a selected value exists within the available choices of a select field. If the selected value is not found in the given options, an error message is generated.  

#### **Parameters**  
- **`value_index` (string)** – The selected value that needs to be validated.  
- **`targetInputname` (string)** – The name of the input field being validated.  
- **`options_select` (SelectOptions)** – An object containing the list of valid options (`optionsChoices`).  

#### **Functionality**  
1. It checks if `value_index` exists in `options_select.optionsChoices`.  
2. If the value is not found, it updates the validator status with an error message.  
3. Finally, it calls the `textValidator` method to apply additional text-based validation on the selected value.  

#### **Return Value**  
- Returns the instance of the current class (`this`) to allow method chaining.  

---
# Example Usage
```typescript
jQuery(function validateInput() {
  formFormattingEvent.lastnameToUpperCase(this, 'en');
  formFormattingEvent.capitalizeUsername(this, " ", " ", 'en')
  formFormattingEvent.usernameFormatDom(this," "," ","en")
      jQuery(this).on('blur','#username,#email,#tel,#message',(event: JQuery.BlurEvent)=>{
        const target = jQuery<HTMLTextAreaElement | HTMLInputElement>(event.target)!;
        console.log(target.val())
        console.log(target.attr('id'));
          if(target.length>0 && target.val() && target.val()!.length>0){
            if (target.attr('id') === 'username') {
              formInputValidator.textValidator(
                target.val() as string, target.attr('name') as string, {
                  regexValidator: /^[a-zA-ZÀ-ÿ\s]+$/i,// by default  /^[a-zA-ZÀ-ÿ\s]+$/i
                  requiredInput: true,// by default tue
                  escapestripHtmlAndPhpTags:true,// by default tue
                  maxLength: 200,
                  minLength: 6,
                  typeInput:'text', //by default, 'text'
                  errorMessageInput: "The content of this field must contain only alphabetical letters  and must not null " // by default"The content of this field must contain only alphabetical letters  and must not null Eg:AGBOKOUDJO Hounha Franck"
                })
            } else if (target.attr('id') === 'message') {
              formInputValidator.textValidator(
                target.val() as string, target.attr('name') as string, {
                  regexValidator: /^[a-zA-ZÀ-ÿ0-9\s.,!?'-]+$/i,// by default  /^[a-zA-ZÀ-ÿ\s]+$/i
                  requiredInput: true,// by default tue
                  escapestripHtmlAndPhpTags:false,// by default tue
                  maxLength: 10000,
                  minLength: 20,
                  typeInput:'textarea', //by default, 'text'
                  errorMessageInput: "The content of this field is invalid"
                })
            }
             else if (target.attr('id') === 'email') {
              formInputValidator.emailValidator(
                target.val() as string, target.attr('name') as string, {
                  regexValidator: /^([a-zA-ZÀ-ÿ0-9._-]{2,})+(@[a-zA-ZÀ-ÿ0-9._-]{2,})+(\.[a-z]{2,6})+$/i,// by default  /^([a-zA-ZÀ-ÿ0-9._-]{2,})+(@[a-zA-ZÀ-ÿ0-9._-]{2,})+(\.[a-z]{2,6})+$/i;
                  requiredInput: true,// by default tue
                  escapestripHtmlAndPhpTags:false,// by default tue
                  maxLength: 180,
                  minLength: 6,
                  errorMessageInput: "email is invalid  Eg:franckagbokoudjo301@gmail.com" // by dfault "email is invalid  Eg:franckagbokoudjo301@gmail.com"
                })
            }else if (target.attr('id') === 'tel') {
              formInputValidator.telValidator(
                target.val() as string,
                target.attr('name') as string, {
                  regexValidator: /^([\+]{1})([0-9\s]{1,})+$/i,// by default  /^([\+]{1})([0-9\s]{1,})+$/i;
                  requiredInput: true,// by default tue
                  maxLength: 30,
                  minLength: 8,
                  errorMessageInput:'The content of this field must contain only number ,one symbol +,of spaces and must not null ,Eg: +229 67 25 18 86' // by dfault 'The content of this field must contain only number ,one symbol +,of spaces and must not null ,Eg: +229 67 25 18 86'
                })
            }
            if (!formInputValidator.hasErrorsField(target.attr('name') as string)) {
              serviceInternclass(jQuery(target), formInputValidator);
            }
          }
      })
      jQuery(this).on('input', '#username,#email,#tel,#message',(event: JQuery.Event|any) => {
    const target = event.target as HTMLInputElement|HTMLTextAreaElement;
        if (target) {
      clearErrorInput(jQuery(target), formInputValidator);
    }
  });
    })
```
Would you like me to adjust the wording or add more details? 😊
## Conclusion
This class provides a **robust and reusable validation system** for multiple input types. Each validator:
- Uses **regular expressions** for pattern matching.
- Enforces **minimum and maximum lengths**.
- Checks **required fields**.
- **Sanitizes** inputs where necessary.
- Supports **custom error messages**.

This allows the validation logic to be easily integrated into **form validation systems** in **TypeScript-based** projects. 🚀


# ImageValidator Class Documentation

## Overview
The `ImageValidator` class is responsible for validating image files based on different criteria such as MIME type, file signature, dimensions, and file size. It extends the `AbstractMediaValidator` class and follows a singleton pattern to ensure only one instance of the class is used throughout the application.

## Features
- **Singleton Pattern:** Ensures a single instance of the `ImageValidator` class.
- **File Signature Validation:** Prevents disguised files by checking hexadecimal signatures.
- **MIME Type Validation:** Ensures that the uploaded file matches the expected MIME type.
- **File Size Validation:** Checks that the file does not exceed the allowed maximum size.
- **Image Dimensions Validation:** Ensures that images meet the required width and height constraints.
- **Allowed Extensions Validation:** Ensures only specified image formats are accepted.

## Supported Formats
The `ImageValidator` class supports the following image formats:

| Format | Hexadecimal Signature |
|--------|----------------------|
| JPG | `ffd8ffe0`, `ffd8ffe1`, `ffd8ffe2`, `ffd8ffe3`, `ffd8ffe8` |
| JPEG | `ffd8ffe0`, `ffd8ffe1`, `ffd8ffe2`, `ffd8ffe3`, `ffd8ffe8` |
| PNG | `89504e47` |
| GIF | `47494638` |
| BMP | `424d` |
| WEBP | `52494646` |
| SVG | `3c3f786d6c2076657273696f6e3d`, `3c737667` |

## Methods

### `getInstance(): ImageValidator`
Returns the singleton instance of the `ImageValidator` class.

### `fileValidator(medias: File | FileList, targetInputname: string = 'photofile', optionsimg: OptionsImage): Promise<this>`
Validates an image file or a list of image files against the specified options.

- **Parameters:**
  - `medias`: The file or list of files to validate.
  - `targetInputname`: The name of the input field (default: `'photofile'`).
  - `optionsimg`: Configuration options including allowed MIME types, max file size, and dimension constraints.
- **Returns:** A promise resolving to the `ImageValidator` instance.

### `signatureFileValidate(file: File, uint8Array?: Uint8Array): Promise<string | null>`
Validates the file signature to ensure it is not disguised as another file type.

- **Parameters:**
  - `file`: The file to validate.
  - `uint8Array`: Optional binary representation of the file.
- **Returns:** A promise resolving to an error message if the validation fails, otherwise `null`.

### `mimeTypeFileValidate(file: File, allowedMimeTypeAccept?: string[]): Promise<string | null>`
Validates the MIME type of the file against allowed MIME types.

- **Parameters:**
  - `file`: The file to validate.
  - `allowedMimeTypeAccept`: List of accepted MIME types.
- **Returns:** A promise resolving to an error message if the validation fails, otherwise `null`.

### `getFileDimensions(file: File): Promise<{ width: number; height: number; }>`
Retrieves the dimensions of the image file.

- **Parameters:**
  - `file`: The image file.
- **Returns:** A promise resolving to an object containing `width` and `height`.

### `detecteMimetype(hexasignatureFile: string, uint8Array: Uint8Array): string | null`
Determines the actual MIME type of an image file based on its hexadecimal signature.

- **Parameters:**
  - `hexasignatureFile`: The hexadecimal signature of the image file.
  - `uint8Array`: The binary representation of the file.
- **Returns:** The true MIME type of the file or `null` if unknown.

### `getExtensions(allowedMimeTypes: string[]): string[]`
Converts a list of MIME types to their corresponding file extensions.

- **Parameters:**
  - `allowedMimeTypes`: List of allowed MIME types.
- **Returns:** An array of valid file extensions.

## Usage Example
```typescript
import {ImageValidator} from "@wlindabla/form_validator";
const imageValidator = ImageValidator.getInstance();

jQuery(function documentLoad() {
  const imagesAll = jQuery<HTMLInputElement>('input#img');
  let instance = imageValidator;
  const validateImage = debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instance = await imageValidator.fileValidator(target.files as FileList, target.name);
      if (!instance.hasErrorsField(target.name)) {
        serviceInternclass(jQuery(target), instance);
      }
    }
  }, 300); // Délai de 300ms

  imagesAll?.on('blur', validateImage);
  imagesAll?.on('change', (event: JQuery.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      clearErrorInput(jQuery(target), instance);
    }
  });
```

# DocumentValidator Class Documentation

## Overview
`DocumentValidator` is a singleton class that extends `AbstractMediaValidator` and implements `MediaValidatorInterface`. It is responsible for validating different types of document files based on their MIME types and hexadecimal signatures. It supports file types including PDFs, Word documents, Excel sheets, OpenDocument formats, text files, and CSVs.

## Features
- **Singleton Pattern**: Ensures a single instance of `DocumentValidator`.
- **MIME Type Validation**: Checks if the uploaded file matches the allowed MIME types.
- **Hexadecimal Signature Validation**: Validates file format based on magic numbers.
- **Content Parsing**: Ensures the file is properly formatted for Word, Excel, CSV, and PDF.
- **Support for OpenDocument formats**: Compatible with ODT, ODS, and other Linux-specific formats.
- **Error Handling**: Provides detailed error messages when validation fails.

## Class Definition
```typescript
class DocumentValidator extends AbstractMediaValidator implements MediaValidatorInterface
```

## Properties
### `mimeTypeMap: Record<string, string[]>`
Defines the MIME types for supported document formats:
```typescript
{
    pdf: ['application/pdf'],
    doc: ['application/msword'],
    docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    xls: ['application/vnd.ms-excel'],
    xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    odt: ['application/vnd.oasis.opendocument.text'],
    ods: ['application/vnd.oasis.opendocument.spreadsheet'],
    txt: ['text/plain'],
    csv: ['text/csv']
}
```

### `signatureHexadecimalFormatDocument: Record<string, string[]>`
Defines the hexadecimal signatures for different document formats:
```typescript
{
    pdf:  ['25504446'],
    word: ['504b0304', 'd0cf11e0'],
    excel: ['504b0304', 'd0cf11e0']
}
```

### `private static m_instance_doc_validator: DocumentValidator`
Singleton instance of the `DocumentValidator` class.

## Methods
### `getInstanceDocValidator(): DocumentValidator`
Returns the singleton instance of `DocumentValidator`.
```typescript
public static getInstanceDocValidator = (): DocumentValidator => {
    if (!DocumentValidator.m_instance_doc_validator) {
        DocumentValidator.m_instance_doc_validator = new DocumentValidator();
    }
    return DocumentValidator.m_instance_doc_validator;
}
```

### `fileValidator(medias: File | FileList, targetInputname: string, optionsdoc: OptionsFile): Promise<this>`
Validates a single or multiple files.

#### Parameters:
- `medias`: File or FileList to be validated.
- `targetInputname`: Input name associated with the file (default: `doc`).
- `optionsdoc`: Options specifying allowed MIME types.

#### Returns:
- A `Promise<this>` indicating validation success or failure.

### `validate(file: File, formatValidator: string): Promise<string | null>`
Validates a file based on its format.

#### Parameters:
- `file`: The file to validate.
- `formatValidator`: The format to validate against (pdf, word, excel, csv, text).

#### Returns:
- A `Promise<string | null>`, returning an error message if validation fails, otherwise `null`.

### `readFileAsUint8Array(file: File): Promise<Uint8Array>`
Reads a file as a `Uint8Array`.

#### Parameters:
- `file`: The file to read.

#### Returns:
- A `Promise<Uint8Array>` containing the file data.

### `validateSignature(file: File, formatValidator: string, uint8Array: Uint8Array): boolean`
Validates a file’s signature.

#### Parameters:
- `file`: The file to validate.
- `formatValidator`: Format category (pdf, word, excel, etc.).
- `uint8Array`: The binary data of the file.

#### Returns:
- `boolean`: `true` if valid, otherwise `false`.

### `validatePdf(file: File, uint8Array: Uint8Array): Promise<string | null>`
Validates a PDF file using `pdfjsLib`.

### `validateWord(file: File, uint8Array: Uint8Array): Promise<string | null>`
Validates a Word document using `Mammoth`.

### `validateExcel(file: File, uint8Array: Uint8Array): Promise<string | null>`
Validates an Excel file using `XLSX`.

### `validateText(file: File): Promise<string | null>`
Checks if a text file is not empty.

### `validateCsv(file: File): Promise<string | null>`
Parses and validates a CSV file using `Papa.parse`.

### `detecteMimetype(filename: string, hexasignatureFile: string, uint8Array: Uint8Array): this`
Detects the MIME type based on the file’s signature.

### `getExtensions(allowedMimeTypeAccept: string[]): string[]`
Retrieves allowed extensions based on the MIME type map.

## Example Usage
```typescript
import {DocumentValidator} from "@wlindabla/form_validator";
const documentValidator = DocumentValidator.getInstance();
 const pdfAll = jQuery<HTMLInputElement>('input#pdf');
  let instanceValidatorpdf = documentValidator;
  const validatePdf= debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instanceValidatorpdf = await documentValidator.fileValidator(
        target.files as FileList, target.name,
        {
          allowedMimeTypeAccept: ['application/pdf', 'text/csv', 'text/plain',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.text'
          ]
        });
      if (!instanceValidatorpdf.hasErrorsField(target.name)) {
        serviceInternclass(jQuery(target), instanceValidatorpdf);
      }
    }
  }, 300); // Délai de 300ms
  pdfAll.on('blur', validatePdf);
  pdfAll.on('change', (event: JQuery.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      clearErrorInput(jQuery(target),instanceValidatorpdf);
    }
  });
});
```

## Conclusion
The `DocumentValidator` class provides a robust and extensible way to validate document files in a web application. With support for various document formats, signature verification, and content parsing, it ensures that only valid files are processed.


---

# VideoValidator Class

The `VideoValidator` class is a utility for validating video files based on various criteria such as file extension, size, MIME type, and video metadata (dimensions, duration). This class is designed to ensure that uploaded video files meet specific validation requirements before being processed further.

## Features

- **Singleton Design Pattern**: The class follows the singleton pattern, ensuring only one instance of the validator is used throughout your application.
  
- **File Validation**: Validates video files by checking:
  - **Extension**: Ensures the file has a valid extension (e.g., `.mp4`, `.mkv`, `.avi`, etc.).
  - **Size**: Checks that the video file size is within the allowed limit.
  - **MIME Type**: Verifies that the file's MIME type matches the expected video types.
  - **Metadata**: Validates video metadata such as dimensions and duration.

- **Error Handling**: The class provides detailed error messages to notify the user when a file does not pass the validation checks.

## Usage

### Example

Here’s an example of how to use the `VideoValidator` class to validate video files:

```typescript
jQuery(function mediaLoad() {
 const videoAll = jQuery<HTMLInputElement>('input#video');
  let instanceValidatorvideo = videoValidator;
  const validatevideo= debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instanceValidatorvideo = await videoValidator.fileValidator(
        target.files as FileList, target.name,
        {
          extensions: [
            "avi", "flv", "wmv", "mp4", "mov", "mkv", "webm", "3gp",
            "3g2", "m4v", "mpg", "mpeg", "ts", "ogv", "asf", "rm", "divx"],
          allowedMimeTypeAccept: [
            "video/x-msvideo", "video/x-flv", "video/x-ms-wmv",
            "video/mp4", "video/quicktime", "video/x-matroska",
            "video/webm", "video/3gpp", "video/3gpp2", "video/x-m4v",
            "video/mpeg", "video/mp2t", "video/ogg", "video/x-ms-asf",
            "application/vnd.rn-realmedia", "video/divx"]
        });
      if (!instanceValidatorvideo.hasErrorsField(target.name)) {
        serviceInternclass(jQuery(target), instanceValidatorvideo);
      }
    }
  }, 300); // Délai de 300ms
  videoAll.on('blur', validatevideo);
  videoAll.on('change', (event: JQuery.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      clearErrorInput(jQuery(target),instanceValidatorvideo);
    }
  });
});
```

In this example, the `fileValidator` method validates the files selected in the input field `#videoInput`, checking for allowed extensions (`mp4`, `mkv`), valid MIME types, and a maximum size limit of 10 MiB.

### Constructor

The constructor is private, so the class cannot be instantiated directly. Instead, use the static `getInstance()` method to get the singleton instance.

### Methods

#### `fileValidator(medias, targetInputname, optionsmedia)`

- **Parameters**:
  - `medias`: A single video file or a list of files to validate.
  - `targetInputname`: The name of the input field to personalize error messages (default is 'videofile').
  - `optionsmedia`: An optional object with validation options (allowed extensions, MIME types, max file size, etc.).

- **Returns**: A promise that resolves after the files are validated, or rejects if any validation fails.

#### `mimeTypeFileValidate(media, allowedMimeTypeAccept)`

Validates the MIME type of the provided video file. Checks if the MIME type is one of the allowed types.

#### `metadataValidate(media, targetInputname, optionsvideo)`

Validates video metadata, including dimensions (width, height) and duration. This method ensures the video file has valid metadata before further processing.

### Example with Detailed Validation

```javascript
const videoFiles = document.getElementById('videoInput').files;

await videoValidator.fileValidator(videoFiles, 'videoInput', {
  extensions: ['mp4', 'mkv'],
  allowedMimeTypeAccept: ['video/mp4', 'video/x-matroska'],
  maxsizeFile: 10, // 10 MiB
  unityMaxSizeFile: 'MiB',
  minWidth: 640, // Minimum width
  maxWidth: 1920, // Maximum width
  minHeight: 360, // Minimum height
  maxHeight: 1080  // Maximum height
});
```

### Error Handling

If the validation fails, the class will throw an error, including the file name and the validation failure reason. For example:

- "Invalid MIME type for video file."
- "Video file size exceeds the allowed limit."
- "Video dimensions do not meet the required size."

## Installation

To use this library in your project, you can import the `VideoValidator` class directly or install it as a package (if published).

### Import Example

```javascript
import {VideoValidator} from "@wlindabla/form_validator";
const videoValidator = VideoValidator.getInstance();
```

---


---

---


# `ApiError` Class Documentation

The `ApiError` class is designed to handle and process errors returned from an API, particularly focusing on violation errors, which are common in validation processes. This class makes it easier to extract specific error messages related to each field, and also provides a structured way to retrieve all violation messages.

## **Class: `ApiError`**
### **Constructor:**
```typescript
import { ApiError } from "@wlindabla/form_validator";
constructor(data: Record<string, unknown>, status: number)
```

#### **Parameters:**
- **`data`**: The data returned from the API, usually containing information about errors and violations (e.g., validation errors).
  - Type: `Record<string, unknown>`
  - Structure:
      ```json
        {
          "title": "Validation Failed",
          "detail": "Some fields failed validation.",
          "violations": [
            {
              "propertyPath": "name",
              "message": "This field is required."
            },
            {
              "propertyPath": "email",
              "message": "Invalid email format."
            }
          ]
        }
  ```

- **`status`**: The HTTP status code returned from the API, indicating the response status (e.g., 400 for bad request, 422 for unprocessable entity).
  - Type: `number`

---

### **Methods**

#### **`violationsFor(field: string): string[]`**
```typescript
violationsFor(field: string): string[]
```

#### **Description:**
This method retrieves the list of violation messages for a specific field. It filters the violations by `propertyPath` and returns an array of messages related to that field.

#### **Parameters:**
- **`field`**: The name of the field for which violations are being retrieved.
  - Type: `string`

#### **Returns:**
- **`string[]`**: An array of violation messages related to the specified field. If no violations are found for the field, it returns an empty array.

#### **Example Usage:**
```typescript
const apiError = new ApiError({
    "violations": [
        { "propertyPath": "username", "message": "Username is required" },
        { "propertyPath": "email", "message": "Invalid email address" }
    ]
}, 400);

const usernameViolations = apiError.violationsFor("username");
console.log(usernameViolations); // ["Username is required"]
```

---

#### **`name`**
```typescript
get name(): string
```

#### **Description:**
This getter method returns a string combining the error title and detail. If the error detail is not available, it only returns the title.

#### **Returns:**
- **`string`**: The combined title and detail of the error.

#### **Example Usage:**
```typescript
const apiError = new ApiError({
    "title": "Validation Error",
    "detail": "One or more fields are invalid"
}, 400);

console.log(apiError.name); // "Validation Error One or more fields are invalid"
```

---

#### **`allViolations`**
```typescript
get allViolations(): Record<string, string[]>
```

#### **Description:**
This getter method organizes and retrieves all violation messages grouped by `propertyPath` (the field name). If there are no violations, it returns an object containing a `main` key with a general error message.

#### **Returns:**
- **`Record<string, string[]>`**: An object where each key is a field name (`propertyPath`), and the value is an array of violation messages for that field. If no violations are found, it returns an object with a `main` key.

#### **Example Usage:**
```typescript
const apiError = new ApiError({
    "violations": [
        { "propertyPath": "username", "message": "Username is required" },
        { "propertyPath": "email", "message": "Invalid email address" },
        { "propertyPath": "username", "message": "Username must be unique" }
    ]
}, 400);

console.log(apiError.allViolations);
// {
//   username: ["Username is required", "Username must be unique"],
//   email: ["Invalid email address"]
// }
```

---

## **Use Cases**

### **1. Handling Field Validation Errors**
The `ApiError` class is particularly useful when working with APIs that return field validation errors. For example, when submitting a form and the server returns violations (e.g., required fields, invalid email), you can use this class to easily access specific error messages for each field.

**Example Scenario:**
You send a request to an API that validates user input (like a registration form). If any fields (e.g., username, email) are invalid, the server returns a structured response with violation messages. You can use `ApiError` to display these errors to the user in a structured way.

**Sample Code:**
```typescript
const apiError = new ApiError(responseData, responseStatus);

// Retrieve specific field error messages
const usernameErrors = apiError.violationsFor("username");
const emailErrors = apiError.violationsFor("email");

// Display errors to the user
console.log(usernameErrors); // ["Username is required"]
console.log(emailErrors);    // ["Invalid email address"]
```

### **2. General Error Handling**
In cases where there are no specific field violations, the `ApiError` class provides a way to return a general error message that can be used for user notifications.

**Example Scenario:**
When the API returns an error without specific field violations (e.g., authentication failure, or a server error), the `ApiError` class allows you to display a generic error message.

**Sample Code:**
```typescript
const apiError = new ApiError({ "title": "Server Error", "detail": "Something went wrong" }, 500);

console.log(apiError.name); // "Server Error Something went wrong"
```

---
Here’s how you can document the usage of `ApiError` in your `README.md` file, explaining how it can be integrated into a React component that handles form submissions:

---



## Overview
## Usage in React

### 1. **Handling API Errors in React**

When submitting a form in React, you might want to handle errors returned from an API, particularly form validation errors. To manage this, we can use the `ApiError` class.

### Example Usage in a React Component

Here is an example of how to integrate the `ApiError` class in a React component that handles form submissions:

```jsx
import React, { useState, useEffect } from 'react';
import ValidatorErrorField from './ValidatorErrorField'; // Component to display error messages

// Function to submit form data and trigger custom event on error
async function submitForm(formData) {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    });

    const responseData = await response.json();

    // Create an instance of ApiError with the response data
    const apiError = new ApiError(responseData, response.status);

    // Dispatch a custom event with the apiError instance
    const event = new CustomEvent('formSubmissionError', {
      detail: { apiError }
    });

    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error during form submission', error);
  }
}

const YourForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    // Listen for the custom formSubmissionError event
    const handleApiError = (event) => {
      const { apiError } = event.detail;
      const violations = apiError.allViolations;

      // Map violations to errorMessages object for use in the form
      const errorMessages = {};

      Object.entries(violations).forEach(([field, messages]) => {
        errorMessages[field] = messages.join(', ');
      });

      setErrorMessages(errorMessages); // Update state with error messages
    };

    document.addEventListener('formSubmissionError', handleApiError);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('formSubmissionError', handleApiError);
    };
  }, []);

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    submitForm(formData); // Trigger form submission and handle errors
  };

  return (
    <form onSubmit={onSubmitForm}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onChangeHandle}
        />
        {errorMessages['name'] && (
          <ValidatorErrorField
            errordisplay={true}
            messageerror={errorMessages['name']}
            classnameerror={["fw-bold", "text-danger", "mt-2", "error-message"]}
          />
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChangeHandle}
        />
        {errorMessages['email'] && (
          <ValidatorErrorField
            errordisplay={true}
            messageerror={errorMessages['email']}
            classnameerror={["fw-bold", "text-danger", "mt-2", "error-message"]}
          />
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

### How It Works:

1. **Form Submission**:  
   When the user submits the form, the `submitForm` function is called. It sends the form data to the API and waits for the response.

2. **Handling Errors**:  
   If the API responds with errors (e.g., validation errors), an instance of the `ApiError` class is created and dispatched via a custom event (`formSubmissionError`).

3. **Event Listener**:  
   The `YourForm` component listens for the `formSubmissionError` event. When the event is triggered, it extracts the errors from the `ApiError` instance and updates the state with the error messages.

4. **Displaying Errors**:  
   The form renders any error messages next to the corresponding fields using the `ValidatorErrorField` component, which accepts error messages and displays them styled according to the provided classes.

---

### Key Benefits:

- **Separation of Concerns**: The error-handling logic is abstracted away from the React component, making the component code cleaner and easier to manage.
- **Reusability**: You can use the `ApiError` class across multiple forms and components, making it a reusable solution for handling API errors.
- **Flexibility**: By using custom events, you can easily handle errors from various parts of your application without having to pass props or states explicitly between components.

---

This way, the `ApiError` class integrates seamlessly with React form components and provides a structured and effective approach to handling validation errors from the API.
## **Conclusion**

The `ApiError` class is a powerful utility to handle API errors, especially when working with form validation. By structuring error messages by field and offering methods for easy access, it simplifies the process of displaying specific violations to the user. This class ensures that error handling is efficient and user-friendly.

---


## Contact Information

This file is part of the project by AGBOKOUDJO Franck.

- (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
- Phone: +229 01 67 25 18 86
- LinkedIn: [https://www.linkedin.com/in/internationales-web-services-120520193/](https://www.linkedin.com/in/internationales-web-services-120520193/)
- Company: INTERNATIONALES WEB SERVICES

For more information, please feel free to contact the author.

---