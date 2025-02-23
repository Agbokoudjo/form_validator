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

## **Form Validator** est une bibliothèque JavaScript/TypeScript permettant la validation de différents types de fichiers dans des formulaires HTML. Elle prend en charge les validations pour les entrées input de type text,email,tel,password,ainsi que les fichiers de type file comme image, PDF, Word, CSV,excel, et bien plus, avec des configurations personnalisables.

## 📋 Fonctionnalités principales

- **Validation des entrées de types tel que text,email,password,tel**:c'est la class typescript FormInputValidator qui est le gestionnaires des validations de ces types de champps input, -**Utilisation de FormInputValidator**:
Voici un fichier `README.md` bien formaté pour un affichage propre sur GitHub. J'ai ajouté une structure claire avec des titres, des blocs de code bien formattés et des explications.

---

```md
# Formulaire de Validation avec jQuery et TypeScript

Ce projet implémente un formulaire simple avec validation en utilisant `jQuery` et `TypeScript`.

## 📌 Fonctionnalités
- Validation des champs (Nom, Email, Téléphone, Message)
- Utilisation de `jQuery` pour gérer les événements
- Vérification des entrées avec `formInputValidator`
- Empêchement des caractères spéciaux non souhaités

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

## 📝 Explication du Code

1. **Validation des Champs** :  
   - `fullname_test` : Accepte uniquement des lettres (y compris les caractères accentués).  
   - `email_test` : Doit respecter le format email standard.  
   - `tel_test` : Doit commencer par `+` suivi de chiffres et d'espaces.  
   - `message_test` : Doit contenir au moins 20 caractères.  

2. **Gestion des événements** :  
   - `blur` : Lorsqu'un champ perd le focus, la validation est déclenchée.  
   - `change` : Efface les erreurs lorsqu'un champ est modifié.  

3. **Utilisation de `formInputValidator`** :  
   - Vérifie si les entrées respectent les règles définies.  
   - Affiche les messages d'erreur en cas d'invalidité.  

---

## 🚀 Installation & Utilisation

1. Clonez ce projet :
   ```sh
   git clone https://github.com/Agbokoudjo/form_validator.git
   cd votre-projet
   ```

2. Installez les dépendances :
   ```sh
   npm install
   ```

3. Démarrez le projet :
   ```sh
   npm run dev
   ```

---

## 📌 Technologies Utilisées

- **HTML** / **CSS** / **Bootstrap**
- **JavaScript** / **TypeScript**
- **jQuery**
- **Lodash**
- **Validation personnalisée avec `formInputValidator`**

---

## 📞 Contact

Si vous avez des questions, contactez-moi :  
📧 **Email** : [franckagbokoudjo301@gmail.com](mailto:franckagbokoudjo301@gmail.com)  
📱 **Téléphone** : +229 67 25 18 86  

---

🎯 *Merci d'avoir consulté ce projet ! N'hésitez pas à laisser un ⭐ sur GitHub si vous le trouvez utile !* 🚀
```

### ✅ Améliorations Apportées :
- Ajout de **titres structurés** (`#`, `##`, `###`).
- Utilisation de blocs de **code proprement formatés** pour HTML et TypeScript.
- Explication du code pour une meilleure lisibilité.
- Ajout d'une **section Installation & Utilisation**.
- Ajout des **contacts et liens utiles**.



- **Validation d'images** : Assure que le fichier image respecte les dimensions, taille maximale et type MIME autorisés.
- **Validation de documents (PDF, Word, CSV, etc.)** : Vérifie le type MIME, le contenu des fichiers CSV et les métadonnées des vidéos.
- **Personnalisation des règles de validation** : Définit des limites spécifiques comme la durée, les dimensions, ou encore la taille des fichiers.
- **Utilisation de classes spécialisées** : Les classes comme `ImageValidator` ou `DocumentValidator` offrent des méthodes puissantes et flexibles pour valider différents fichiers.
- **Support jQuery** : Facilité d'intégration avec des événements jQuery (`blur`, `change`, etc.) pour la validation en temps réel.

---

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants :

- **Node.js** : v16 ou supérieur.
- **jQuery** : v3.6 ou supérieur.
- **TypeScript** (optionnel) : Si vous souhaitez utiliser ou modifier le code TypeScript.
- **npm** ou **yarn** : Pour la gestion des dépendances.

---

## 🚀 Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/username/form-validator.git
   cd form-validator
   2-Installez les dépendances nécessaires :
   npm install
   ```

# ou

yarn install

📖 Exemple d'utilisation

Voici un exemple pour valider des fichiers d'image et de document dans un formulaire HTML.
HTML

 Voici une version mieux formatée de ton fichier `README.md` pour qu'il soit plus agréable à lire sur GitHub, en utilisant la syntaxe Markdown pour les titres, le code et les descriptions.  

---

# 📂 Formulaire de Téléversement d'Images et de Documents  

Ce projet contient un formulaire permettant l'envoi d'images et de documents PDF avec une validation en JavaScript via jQuery.  

## ✨ Fonctionnalités  
- Téléversement multiple d'images 📷  
- Téléversement multiple de fichiers PDF 📄  
- Validation automatique des fichiers  
- Suppression des erreurs en cas de correction  

---

## 📜 Code du Formulaire  

```html
<div class="container" id="app">
  <div id="app-header"></div>
  <div class="form-group">
    <form class="form">
      <!-- Upload d'Images -->
      <label for="image_test">Uploader des images</label><br/>
      <input type="file" class="images form-control" multiple 
             placeholder="Choisissez une ou plusieurs images" 
             id="img_test" name="images_test"/><br/>
      
      <!-- Upload de Documents PDF -->
      <label for="pdf_test">Uploader des documents PDF</label><br/>
      <input type="file" class="pdf form-control" multiple 
             placeholder="Choisissez un ou plusieurs fichiers PDF" 
             id="pdf_test" name="pdf_test"/><br/>
      
      <button type="submit" class="btn-submit btn">Valider</button>
    </form>
  </div>
</div>
```

---

## 🚀 Validation des Fichiers en JavaScript  

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

## 📌 Installation et Utilisation  

1. **Cloner le projet**  
   ```bash
   git clone https://github.com/ton-repo.git
   cd ton-repo
   ```

2. **Installer les dépendances**  
   ```bash
   npm install
   ```

3. **Lancer le projet**  
   ```bash
   npm start
   ```

---

## 🛠 Technologies Utilisées  

- **HTML / CSS** 🎨  
- **JavaScript (jQuery, Lodash)** ⚡  
- **TypeScript** 🔹  
- **Node.js / NPM** 📦  

---

## 📧 Contact  
✉️ Email : [franckagbokoudjo301@gmail.com](mailto:franckagbokoudjo301@gmail.com)  
📞 Téléphone : +229 67 25 18 86  

Si tu veux que j'ajoute des précisions ou un autre format, dis-moi ! 🚀
🔧 Configuration
Délais pour la validation

Vous pouvez modifier le délai pour les fonctions de validation avec le paramètre debounce :

debounce(validateImage, 300); // Défaut : 300 ms

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
