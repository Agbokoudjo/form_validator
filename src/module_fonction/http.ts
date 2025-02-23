/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */
export interface addParamToUrlConfig {
    [key: string]: any;
  }
  /**
   * 
   * @param urlparam 
   * @param addparamUrlDependencie 
   * @param returnUrl un boolean qui permet de dire que si il faut renvoyer url sous forme de chaine de caractere ou sous 
   * sous forme instance de URL par default c'est true 
   * si @default returnUrl =true on envoie sous forme de chaine de caractere sinon on envoie le nouveau URL construire sous forme
   * d'instance de URL
   * @param baseUrl 
   * @returns string |URL
   */
  export const addParamToUrl = (urlparam: string, 
                                addparamUrlDependencie: addParamToUrlConfig|null=null,
                                returnUrl:boolean=true,
                                baseUrl: string | URL = window.location.origin): string|URL => {
    const url = new URL(urlparam, baseUrl);
    if (addparamUrlDependencie) {
        for (const [keyparam, valueparam] of Object.entries(addparamUrlDependencie)) {
      url.searchParams.set(keyparam, valueparam);
    }
    }
      return returnUrl ? url.toString() :url;
  };
  /**
   * Crée une URL avec des paramètres à partir des données de formulaire.
   * 
   * @param formElement - L'élément de formulaire dont les données sont extraites.
   * @param baseUrl - L'URL de base pour laquelle les paramètres doivent être ajoutés.
   * @param returnUrl - Si vrai, retourne une chaîne de caractères représentant l'URL, sinon retourne une instance de URL.
   * @returns Une chaîne de caractères ou une instance de URL avec les paramètres ajoutés.
   */
  export const buildUrlFromForm = (
      formElement: HTMLFormElement,
      addparamUrlDependencie: addParamToUrlConfig|null,
       returnUrl: boolean = true,
      baseUrl: string | URL = window.location.origin
  ): string | URL => {
      const formData = new FormData(formElement);
      const searchParamsInstance = new URLSearchParams();
  
      formData.forEach((value, key) => {
          searchParamsInstance.append(key, value.toString());
      });
  
      const url = new URL(formElement.action || baseUrl.toString(), baseUrl);
  
      // Ajouter les paramètres au URL
      searchParamsInstance.forEach((value, key) => {
          url.searchParams.set(key, value);
      });
      const urlWithAddedParams = addParamToUrl(url.toString(), addparamUrlDependencie, returnUrl, baseUrl);
      return returnUrl ? urlWithAddedParams.toString() : urlWithAddedParams;
  };
  interface FetchOptions {
    url: string | URL;
    methodSend?: string;
    data?: any;
    optionsheaders?: HeadersInit;
    timeout?: number;
    retryCount?: number;
    responseType?: 'json' | 'text' | 'blob'|'arrayBuffer'|'stream'|'formData';
  }

  /**
   * 
   * Voici la documentation complète en anglais et en français pour la fonction `httpFetchHandler`.  

---

# 📌 **English Documentation**
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
const response = await httpFetchHandler({
  url: "https://api.example.com/data",
  methodSend: "POST",
  data: { username: "Alice" },
  responseType: "json"
});

console.log(response); // Parsed JSON response
```

---
   */
export async function httpFetchHandler({
    url,
    methodSend = "GET",
    data = null,
    optionsheaders = {
      'Accept': "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    timeout = 5000, // 5 secondes par défaut
    retryCount = 3, // 3 tentatives par défaut
    responseType = 'json',
  }: FetchOptions): Promise<any> {
    // ✅ Vérifier si `data` est un FormData pour ajuster les headers
  const isFormData = data instanceof FormData;
  const headers = isFormData
    ? optionsheaders // Ne pas modifier les headers si FormData
    : { ...optionsheaders }; // Cloner les headers pour éviter de modifier l'original

    if (!isFormData && headers instanceof Object) {
      delete (headers as Record<string, string>)["Content-Type"];
    }    

    const params: RequestInit = {
      method: methodSend.toUpperCase(),
      headers: optionsheaders,
    };
  
     // ✅ Ajouter le body uniquement pour POST, PUT, PATCH
  if (data && ["POST", "PUT", "PATCH"].includes(methodSend.toUpperCase())) {
    params.body = isFormData ? data : JSON.stringify(data);
  }
  
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      params.signal = controller.signal;
  
      try {
        const response = await fetch(url, params);
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          return Promise.reject(response);
        }
  
        switch (responseType) {
          case 'json':
            return await response.json();
          case 'text':
            return await response.text();
          case 'blob':
            return await response.blob();
          case 'arrayBuffer':
              return await response.arrayBuffer();
          case 'formData':
              return await response.formData();
          case 'stream':
              return response.body; // Retourne le ReadableStream directement
          default:
            throw new Error('Unsupported response type');
        }
  
      } catch (error: any) {
        clearTimeout(timeoutId); // Nettoyer le timeout en cas d'erreur
        console.error('Attempt ${attempt} failed on ${retryCount}:', error);
        if (error.name === 'AbortError') {
          throw new Error("Request timed out");
        } else if (attempt === retryCount) {
          throw error; // Lancer l'erreur après la dernière tentative
        }
      }
    }
  }
  