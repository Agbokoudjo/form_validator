import { Logger } from ".";

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
export function addParamToUrl(urlparam: string | URL,
  addparamUrlDependencie: Record<string, any> | null = null,
  returnUrl: boolean = true,
  baseUrl: string | URL | undefined = window.location.origin): string | URL {
  const url = new URL(urlparam, baseUrl);
  if (addparamUrlDependencie) {
    for (const [keyparam, valueparam] of Object.entries(addparamUrlDependencie)) {
      url.searchParams.set(keyparam, valueparam);
    }
  }
  return returnUrl ? url.toString() : url;
};
/**
 * Crée une URL avec des paramètres à partir des données de formulaire.
 * 
 * @param formElement - L'élément de formulaire dont les données sont extraites.
 * @param baseUrl - L'URL de base pour laquelle les paramètres doivent être ajoutés.
 * @param returnUrl - Si vrai, retourne une chaîne de caractères représentant l'URL, sinon retourne une instance de URL.
 * @returns Une chaîne de caractères ou une instance de URL avec les paramètres ajoutés.
 */
export function buildUrlFromForm(
  formElement: HTMLFormElement,
  form_action: string | null = null,
  addparamUrlDependencie: Record<string, any> | null,
  returnUrl: boolean = true,
  baseUrl: string | URL | undefined = window.location.origin
): string | URL {
  const formData = new FormData(formElement);
  const searchParamsInstance = new URLSearchParams();
  formData.forEach((value, key) => {
    searchParamsInstance.append(key, value.toString());
  });
  const url = new URL(formElement.action || form_action || baseUrl, baseUrl);
  // Ajouter les paramètres au URL
  searchParamsInstance.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  const urlWithAddedParams = addParamToUrl(url, addparamUrlDependencie, returnUrl, baseUrl);
  return returnUrl ? urlWithAddedParams.toString() : urlWithAddedParams;
};
interface HttpResponseData<T = unknown> {
  readonly status: number;
  readonly headers: Headers;
  readonly data: T;
}

export class HttpResponse<T = unknown> {
  constructor(private readonly response_data: HttpResponseData<T>) { }
  get status(): number { return this.response_data.status; }
  get headers(): Headers { return this.response_data.headers; }
  get data(): T { return this.response_data.data; }
}
async function responseTypeHandle<T = unknown>(
  responseType: string,
  response: Response
): Promise<HttpResponse> {
  const status = response.status;
  const headers = response.headers;

  switch (responseType) {
    case "json":
      return new HttpResponse<T>({ status, headers, data: await response.json() });

    case "text":
      return new HttpResponse({ status, headers, data: await response.text() });

    case "blob":
      return new HttpResponse({ status, headers, data: await response.blob() });

    case "arrayBuffer":
      return new HttpResponse({ status, headers, data: await response.arrayBuffer() });

    case "formData":
      return new HttpResponse({ status, headers, data: await response.formData() });

    case "stream":
      return new HttpResponse({ status, headers, data: response.body }); // ReadableStream directement

    default:
      return new HttpResponse({ status, headers, data: await response.text() }); // Par défaut, du texte
  }
}
async function detectedResponseTypeNoOk<T = unknown>(
  response: Response
): Promise<HttpResponse> {
  const contentType = (response.headers.get("content-type") ?? "").trim().toLowerCase();
  if (["application/json", "application/ld+json"].some((type) => contentType.startsWith(type)) ||
    contentType.includes("json") || contentType.endsWith("+json")) {
    return await responseTypeHandle<T>("json", response);
  }
  if (contentType.startsWith("text/html") || contentType.startsWith("text/plain")) {
    return await responseTypeHandle<T>("text", response);
  }
  if (["application/xml", "text/xml"].some((type) => contentType.startsWith(type))
    ||
    contentType.includes("xml")
  ) {
    return await responseTypeHandle<T>("text", response); // XML est souvent traité comme texte
  }
  // ✅ Retour par défaut si aucun type détecté
  return new HttpResponse({ status: response.status, headers: response.headers, data: response.statusText });
}
type MappedHttpStatus = 'success' | 'info' | 'warning' | 'error';
export function mapStatusToResponseType(statusCodeHttpResponse: number): MappedHttpStatus {
  if (statusCodeHttpResponse < 200) { return 'info'; }
  else if (statusCodeHttpResponse >= 200 && statusCodeHttpResponse < 300) { return 'success'; }
  else if (statusCodeHttpResponse >= 300 && statusCodeHttpResponse < 400) { return 'warning'; }
  else if (statusCodeHttpResponse >= 400) { return 'error'; }
  else { return 'error'; }
}
interface HttpFetchErrorOptions {
  attempt?: number;
  responseStatus?: number;
  responseBody?: any;
  cause?: any;
}
export class HttpFetchError extends Error {
  url: string | URL | Request;
  attempt?: number;
  responseStatus?: number;
  responseBody?: any; // Vous pouvez typer cela plus précisément si nécessaire
  cause?: any;

  constructor(message: string, url: string | URL | Request, options?: HttpFetchErrorOptions) {
    super(message);
    this.name = 'HttpFetchError'; // Important pour identifier le type d'erreur
    this.url = url;
    this.attempt = options?.attempt;
    this.responseStatus = options?.responseStatus;
    this.responseBody = options?.responseBody;
    this.cause = options?.cause;
    Object.setPrototypeOf(this, HttpFetchError.prototype);
  }
}
interface FetchOptions {
  url: string | URL | Request;
  methodSend?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'PURGE' | 'OPTIONS' | 'TRACE' | 'CONNECT';
  data?: unknown;
  optionsheaders?: HeadersInit;
  timeout?: number;
  retryCount?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream' | 'formData';
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
export async function httpFetchHandler<T = unknown>({
  url,
  methodSend = "GET",
  data = null,
  optionsheaders = {
    'Accept': "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout = 45000, // 45 secondes par défaut
  retryCount = 3, // 3 tentatives par défaut
  responseType = 'json',
}: FetchOptions): Promise<HttpResponse> {
  const isFormData = data instanceof FormData;
  const headers_requete: HeadersInit = { ...optionsheaders };

  if (isFormData && headers_requete instanceof Object) {
    delete (headers_requete as Record<string, string>)["Content-Type"];
  }
  const params: RequestInit = {
    method: methodSend,
    headers: headers_requete,
  };

  if (data && ["POST", "PUT", "PATCH"].includes(methodSend)) { // ✅ Ajouter le body uniquement pour POST, PUT, PATCH
    params.body = isFormData ? data : JSON.stringify(data);
  }

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    params.signal = controller.signal;
    try {
      const response = await fetch(url, params);
      clearTimeout(timeoutId);
      if (mapStatusToResponseType(response.status) === 'error') {
        return await detectedResponseTypeNoOk<T>(response);
      }
      return await responseTypeHandle<T>(responseType, response);
    } catch (error: any) {
      clearTimeout(timeoutId); // Nettoyer le timeout en cas d'erreur
      if (error?.name === "AbortError") {
        throw new HttpFetchError("Request timed out because the server did not respond within the specified time.", url, { cause: error });
      }

      if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
        if (attempt === retryCount) {
          throw new HttpFetchError(`Request failed after ${retryCount} attempts due to network issues: ${error.message}`, url, { attempt, cause: error });
        }
        Logger.warn(`Network error (attempt ${attempt}): The server did not respond. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Délai progressif
        continue; // Passe à la prochaine tentative
      }

      if (attempt === retryCount) {
        throw new HttpFetchError(`Failed after ${retryCount} attempts due to an unexpected error: ${error?.message}`, url, { attempt, cause: error });
      }
      Logger.error(`An unexpected error occurred (attempt ${attempt}): ${error?.message}`);

      if (attempt < retryCount) {
        await new Promise(resolve => setTimeout(resolve, 500 * attempt)); // Délai pour les autres erreurs
        continue;
      }
    }
  }
  // 🔴 Normalement, ce point n'est jamais atteint, mais on ajoute un throw par sécurité
  throw new HttpFetchError("Unexpected error in httpFetchHandler", url);
}