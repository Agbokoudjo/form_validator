##

- This file is part of the project by AGBOKOUDJO Franck.
-
- (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
- Phone: +229 67 25 18 86
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
  <div class="form-group">
    <form class="form">
      <label for="fullname_test">Fullname</label><br/>
      <input type="text" class="form-control"
        placeholder="Eg: AGBOKOUDJO Hounha Franck" id="fullname_test" name="fullname_test"/><br/>

      <label for="email_test">Email</label><br/>
      <input type="email" class="email form-control" 
        placeholder="Eg: franckagbokoudjo301@gmail.com" id="email_test" name="email_test"/><br/>

      <label for="tel_test">Phone:</label>
      <input type="tel" class="tel form-control" 
        placeholder="Eg: +22967251886" id="tel_test" name="tel_test"/><br/>

      <label for="message_test">Message:</label>
      <textarea id="message_test" placeholder="Write the message here"></textarea>

      <button type="submit" class="btn-submit btn">Valid</button>
    </form>
  </div>
</div>
```

---

## 🛠️ Script de Validation avec `jQuery` et `TypeScript`

```typescript
import jQuery from "jquery";
import { debounce } from "lodash";
import { formInputValidator } from "./validators";

jQuery(function validateInput() {
  const fullname = jQuery<HTMLInputElement>("#fullname_test");
  const email = jQuery<HTMLInputElement>("#email_test");
  const tel = jQuery<HTMLInputElement>("#tel_test");
  const message = jQuery<HTMLTextAreaElement>("#message_test");

  jQuery(this).on("blur", "#fullname_test,#email_test,#tel_test,#message_test", (event: JQuery.BlurEvent) => {
    const target = jQuery<HTMLTextAreaElement | HTMLInputElement>(event.target)!;

    if (target.length > 0) {
      switch (target.attr("id")) {
        case "fullname_test":
          formInputValidator.validatorInputTypeText(target.val() as string, target.attr("name") as string, {
            regexValidator: /^[a-zA-ZÀ-ÿ\s]+$/i,
            requiredInput: true,
            escapestripHtmlAndPhpTags: true,
            maxLength: 200,
            minLength: 6,
            typeInput: "text",
            errorMessageInput: "The content of this field must contain only alphabetical letters."
          });
          break;
        
        case "message_test":
          formInputValidator.validatorInputTypeText(target.val() as string, target.attr("name") as string, {
            regexValidator: /^[a-zA-ZÀ-ÿ\s]+$/i,
            requiredInput: true,
            escapestripHtmlAndPhpTags: false,
            maxLength: 10000,
            minLength: 20,
            typeInput: "textarea",
            errorMessageInput: "The content of this field is invalid."
          });
          break;
        
        case "email_test":
          formInputValidator.validatorInputEmail(target.val() as string, target.attr("name") as string, {
            regexValidator: /^([a-zA-ZÀ-ÿ0-9._-]{2,})+(@[a-zA-ZÀ-ÿ0-9._-]{2,})+(\.[a-z]{2,6})+$/i,
            requiredInput: true,
            maxLength: 180,
            minLength: 6,
            errorMessageInput: "Email is invalid. Eg: franckagbokoudjo301@gmail.com"
          });
          break;
        
        case "tel_test":
          formInputValidator.validatorInputTel(target.val() as string, target.attr("name") as string, {
            regexValidator: /^([\+]{1})([0-9\s]{1,})+$/i,
            requiredInput: true,
            maxLength: 30,
            minLength: 8,
            errorMessageInput: "The phone number must contain only numbers, one '+' symbol, and spaces."
          });
          break;
      }

      if (!formInputValidator.getIsValidFieldWithKey(target.attr("name") as string)) {
        serviceInternclass(jQuery(target), formInputValidator);
      }
    }
  });

  jQuery(this).on("change", "#fullname_test,#email_test,#tel_test,#message_test", (event: JQuery.ChangeEvent) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (target) {
      clearErrorInput(jQuery(target), formInputValidator);
    }
  });
});
```

---

Here is a well-formatted English version of your `README.md` with clear explanations and proper structure:  

```md
# 📝 Code Explanation  

## ✅ 1. Field Validation  

The validation process is handled using `formInputValidator`, applying specific rules for each field:  

- **`fullname_test`**:  
  - Accepts only letters (including accented characters).  
  - Special characters and numbers are not allowed.  

- **`email_test`**:  
  - Must follow the standard email format (`example@domain.com`).  
  - Ensures the presence of an `@` symbol and a valid domain.  

- **`tel_test`**:  
  - Must start with `+`, followed by numbers and spaces (e.g., `+229 67 25 18 86`).  
  - Validates minimum and maximum length.  

- **`message_test`**:  
  - Must contain **at least 20 characters**.  
  - Prevents empty or overly short messages.  

---

## 🎯 2. Event Handling  

The following events improve user experience and real-time validation:  

- **`blur` (losing focus)**:  
  - Triggers validation when the user leaves a field.  
  - Displays an error message if the input is invalid.  

- **`change` (modifying the field)**:  
  - Immediately clears error messages when the user corrects the input.  
  - Enables dynamic validation as the user types.  

---

## 🛠 3. Using `formInputValidator`  

`formInputValidator` is the core of the validation system. It provides:  

✅ **Automatic input verification** based on predefined rules.  
✅ **Custom error messages** displayed when validation fails.  
✅ **Seamless integration** with jQuery for real-time validation.  

---

# 🚀 Installation & Usage  

## 📥 1. Installation  

Clone this project and install the required dependencies:  

```sh
git clone https://github.com/Agbokoudjo/form_validator.git
cd form_validator
yarn install
```

Or using **npm**:  

```sh
npm install
```

---

## ▶️ 2. Run the Project  

Start the project in development mode:  

```sh
yarn run dev
```

Or using **npm**:  

```sh
npm run dev
```

---

# 📌 Technologies Used  

This project is built using modern technologies:  

- ✅ **HTML** / **CSS** / **Bootstrap 5.3**  
- ✅ **JavaScript (ES6+)** / **TypeScript**  
- ✅ **jQuery**  
- ✅ **Lodash**  
- ✅ **Custom validation with `formInputValidator`**  

---

# 📞 Contact  

If you have any questions or suggestions, feel free to reach out:  

📧 **Email**: [franckagbokoudjo301@gmail.com](mailto:franckagbokoudjo301@gmail.com)  
📱 **Phone**: +229 67 25 18 86  

---

🚀 *Thank you for checking out this project! If you find it useful, don’t forget to leave a ⭐ on GitHub!*  
```

### ✅ Improvements Made:
✔️ Structured headings (`#`, `##`, `###`) for better readability.  
✔️ Clear explanations of each validation rule.  
✔️ Properly formatted code blocks (`sh` for terminal commands).  
✔️ Highlighted key features using ✅ and **bold keywords**.  
✔️ Added clear installation and setup instructions.  

This version is optimized for readability and easy integration into your GitHub `README.md`. 🚀
```typescript
import jQuery from "jquery";
import { debounce } from "lodash";
import { ImageValidator, DocumentValidator } from "./validators";

jQuery(function documentLoad() {
  
  // Validation des images
  const imagesAll = jQuery<HTMLInputElement>('input#img_test');
  let instance = imageValidator;
  
  const validateImage = debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instance = await imageValidator.validatorFile(target.files as FileList, target.name);
      if (!instance.getIsValidFieldWithKey(target.name)) {
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

  // Validation des documents PDF
  const pdfAll = jQuery<HTMLInputElement>('input#pdf_test');
  let instanceValidatorpdf = documentValidator;

  const validatePdf = debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instanceValidatorpdf = await documentValidator.validatorFile(
        target.files as FileList, target.name,
        {
          allowedMimeTypeAccept: [
            'application/pdf', 'text/csv', 'text/plain',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.text'
          ]
        }
      );
      if (!instanceValidatorpdf.getIsValidFieldWithKey(target.name)) {
        serviceInternclass(jQuery(target), instanceValidatorpdf);
      }
    }
  }, 300); // Délai de 300ms

  pdfAll.on('blur', validatePdf);
  pdfAll.on('change', (event: JQuery.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      clearErrorInput(jQuery(target), instanceValidatorpdf);
    }
  });
});
```

---


---


---

import { httpFetchHandler } from "./module_fonction/http";
# httpFetchHandler

## 📄 Overview
The `httpFetchHandler` function is an asynchronous utility for making HTTP requests with built-in timeout handling, retry attempts, and automatic response parsing.

---

## 📋 Parameters

| Parameter       | Type                                  | Default Value    | Description |
|----------------|--------------------------------------|-----------------|-------------|
| `url`          | `string | URL`                      | **Required**     | The API endpoint to send the request to. |
| `methodSend`   | `string`                             | `"GET"`          | The HTTP method (`GET`, `POST`, `PUT`, `DELETE`, etc.). |
| `data`         | `any`                                | `null`           | The data to send in the request body (supports JSON and FormData). |
| `optionsheaders` | `HeadersInit`                     | `{ 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }` | Custom headers for the request. |
| `timeout`      | `number`                             | `5000` (5 sec)   | The maximum time (in milliseconds) before the request is aborted. |
| `retryCount`   | `number`                             | `3`              | Number of times to retry the request if it fails. |
| `responseType` | `'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData' | 'stream'` | `'json'`          | The expected response format. |

---

## 🔄 Function Workflow

### 1. **FormData Handling**  
- If `data` is an instance of `FormData`, it automatically manages headers.
- The `"Content-Type"` header is **removed** to let the browser set it correctly.

### 2. **Headers Handling**  
- If the headers are a `HeadersInit` object, they are converted to a mutable object using:
  ```ts
  Object.fromEntries(new Headers(optionsheaders).entries());
  ```
- This avoids `TypeScript` errors when modifying headers.

### 3. **Data Handling with `JSON.stringify`**  
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

### 4. **Request Timeout Handling**  
- Uses `AbortController` to automatically cancel requests after `timeout` milliseconds.

### 5. **Retry Mechanism**  
- If the request fails, the function retries up to `retryCount` times before throwing an error.

---

Here’s a well-formatted English documentation that you can include in your `README.md` before publishing your package on GitHub and NPM.

---

# 📖 `@wlindabla/form_validator` - Documentation  

## 🚀 Introduction  
This package provides useful tools for form validation, URL manipulation, and HTTP request handling in JavaScript/TypeScript.

---

## 📌 Installation  
Ensure you have installed the package via `npm`:  
```sh
npm install @wlindabla/form_validator
```

---

## 📡 `httpFetchHandler` - Advanced HTTP Request Handling  
This function simplifies HTTP requests using `fetch`, handling errors, timeouts, and retries automatically.

### ✅ **Usage**  
```ts
import { httpFetchHandler } from "@wlindabla/form_validator";

async function fetchData() {
    try {
        const response = await httpFetchHandler({
            url: "https://api.example.com/data",
            methodSend: "POST",
            data: JSON.stringify({ key: "value" }),
            responseType: "json"
        });

        console.log("Response received:", response);
    } catch (error) {
        console.error("Request error:", error);
    }
}

fetchData();
```

### 🛠 **Parameters**  
| Parameter         | Type                        | Description |
|------------------|---------------------------|-------------|
| `url`           | `string | URL`             | The request URL |
| `methodSend`    | `string` (optional)       | HTTP method (GET, POST, PUT, DELETE, etc.) |
| `data`          | `any` (optional)          | Data sent in the request body |
| `optionsheaders`| `HeadersInit` (optional)  | Custom HTTP headers |
| `timeout`       | `number` (optional)       | Maximum wait time in milliseconds before canceling the request |
| `retryCount`    | `number` (optional)       | Number of retry attempts in case of failure |
| `responseType`  | `'json' | 'text' | 'blob'` (optional) | Response format |

---

## 🔗 `addParamToUrl` - Add Parameters to a URL  
This function allows you to modify a URL by dynamically adding query parameters.

### ✅ **Usage**  
```ts
import { addParamToUrl } from "@wlindabla/form_validator/http";

const newUrl = addParamToUrl(
    "https://example.com",
    { lang: "en", theme: "dark" }
);

console.log(newUrl); // "https://example.com?lang=en&theme=dark"
```

### 🛠 **Parameters**  
| Parameter                | Type                         | Description |
|--------------------------|------------------------------|-------------|
| `urlparam`               | `string`                     | The base URL |
| `addparamUrlDependencie` | `Record<string, any>` (optional) | Key-value pairs of parameters to add |
| `returnUrl`              | `boolean` (optional, `true` by default) | Returns a string (`true`) or a `URL` instance (`false`) |
| `baseUrl`                | `string | URL` (optional) | Base URL (used for relative URLs) |

---

## 📝 `buildUrlFromForm` - Construct a URL from a Form  
This function generates a URL with dynamic parameters based on an HTML form.

### ✅ **Usage**  
```ts
import { buildUrlFromForm } from "@wlindabla/form_validator/http";

const formElement = document.querySelector("form");

if (formElement) {
    const updatedUrl = buildUrlFromForm(formElement, { debug: "true" });
    console.log(updatedUrl);
}
```

### 🛠 **Parameters**  
| Parameter                | Type                         | Description |
|--------------------------|------------------------------|-------------|
| `formElement`            | `HTMLFormElement`           | The `<form>` element whose values will be extracted |
| `addparamUrlDependencie` | `Record<string, any>` (optional) | Additional parameters to add |
| `returnUrl`              | `boolean` (optional, `true` by default) | Returns a string (`true`) or a `URL` instance (`false`) |
| `baseUrl`                | `string | URL` (optional) | Base URL (used if the form’s `action` is empty) |

---

## 🎯 Conclusion  
With these tools, you can efficiently handle HTTP requests, manage URLs, and process form data in your JavaScript/TypeScript projects.

---

💡 **Need Help?** Open an issue on [GitHub](https://github.com/wlindabla/form_validator) 🚀

👥 Contributeurs

    AGBOKOUDJO Franck - Créateur principal
