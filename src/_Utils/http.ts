/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 01 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Github: https://github.com/Agbokoudjo/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */
import { Logger } from "./logger";

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

/**
 * Mapping between response type strings and their corresponding TypeScript types
 */
export type ResponseTypeMap = {
  json: unknown;
  text: string;
  blob: Blob;
  arrayBuffer: ArrayBuffer;
  formData: FormData;
  stream: ReadableStream<Uint8Array> | null;
};

/**
 * Valid response type keys
 */
export type HttpResponseType = keyof ResponseTypeMap;

/**
 * Handles different response types and returns properly typed HttpResponse
 * 
 * @template K - The response type key (json, text, blob, etc.)
 * @param responseType - The expected response format
 * @param response - The fetch Response object
 * @returns Promise resolving to typed HttpResponse
 * 
 * @example
 * ```typescript
 * // Blob response
 * const blobResult = await responseTypeHandle("blob", response);
 * blobResult.data // Type: Blob
 * 
 * // JSON response
 * const jsonResult = await responseTypeHandle("json", response);
 * jsonResult.data // Type: unknown (cast as needed)
 * ```
 */
export async function responseTypeHandle<K extends HttpResponseType>(
  responseType: K,
  response: Response
): Promise<HttpResponse<ResponseTypeMap[K]>> {
  const status = response.status;
  const headers = response.headers;

  switch (responseType) {
    case "json":
      return new HttpResponse({
        status,
        headers,
        data: await response.json()
      }) as HttpResponse<ResponseTypeMap[K]>;

    case "text":
      return new HttpResponse({
        status,
        headers,
        data: await response.text()
      }) as HttpResponse<ResponseTypeMap[K]>;

    case "blob":
      return new HttpResponse({
        status,
        headers,
        data: await response.blob()
      }) as HttpResponse<ResponseTypeMap[K]>;

    case "arrayBuffer":
      return new HttpResponse({
        status,
        headers,
        data: await response.arrayBuffer()
      }) as HttpResponse<ResponseTypeMap[K]>;

    case "formData":
      return new HttpResponse({
        status,
        headers,
        data: await response.formData()
      }) as HttpResponse<ResponseTypeMap[K]>;

    case "stream":
      return new HttpResponse({
        status,
        headers,
        data: response.body
      }) as HttpResponse<ResponseTypeMap[K]>;

    default:
      // Fallback to text
      return new HttpResponse({
        status,
        headers,
        data: await response.text()
      }) as HttpResponse<ResponseTypeMap[K]>;
  }
}

/**
 * this remove function in 2.4.1 future version
 * @deprecated use  parseHttpErrorResponse<T> instead
 */
export async function detectedResponseTypeNoOk<K extends HttpResponseType = "text">(
  response: Response
): Promise<HttpResponse<ResponseTypeMap[K]>>{
  return await parseHttpErrorResponse(response);
}

/**
 * Detects and parses error responses based on Content-Type header
 * 
 * @template K - The detected response type
 * @param response - The fetch Response object with error status
 * @returns Promise resolving to typed HttpResponse
 */
export async function parseHttpErrorResponse<K extends HttpResponseType = "text">(
  response: Response
): Promise<HttpResponse<ResponseTypeMap[K]>> {

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return new HttpResponse<K>({
      status: response.status,
      headers: response.headers,
      data: '' as K
    }) as HttpResponse<ResponseTypeMap[K]>;
  }

  const contentType = (response.headers.get("content-type") ?? "").trim().toLowerCase();

  if (["application/json", 
    "application/ld+json",
    "application/problem+json",
    "application/vnd.api+json"].some((type) => contentType.startsWith(type)) ||
    contentType.includes("json") || contentType.endsWith("+json")) {
    
    return await responseTypeHandle("json" as K, response);
  }

  if (
    contentType.startsWith("text/html") ||
    contentType.startsWith("text/plain") ||
    contentType.startsWith("text/") 
  ) {
    return await responseTypeHandle("text" as K, response);
  }

  if (
    contentType.startsWith("application/xml") || 
    contentType.startsWith("text/xml") ||
    contentType.includes("xml")
  ) {
    return await responseTypeHandle("text" as K, response);
  }

  try {
    const clonedResponse = response.clone();
    return await responseTypeHandle("json" as K, clonedResponse);
  } catch {
    return new HttpResponse({
      status: response.status,
      headers: response.headers,
      data: response.statusText 
    }) as HttpResponse<ResponseTypeMap[K]>;
  }
}

type MappedHttpStatus = 'success' | 'info' | 'warning' | 'error';

export function mapStatusToResponseType(statusCodeHttpResponse: number|string): MappedHttpStatus {

  if(typeof statusCodeHttpResponse ==="string"){
    statusCodeHttpResponse = parseInt(statusCodeHttpResponse, 10);
  }

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
  private __url: string | URL | Request;
  attempt?: number;
  responseStatus?: number;
  responseBody?: any; 
  cause?: any;

  constructor(message: string, url: string | URL | Request, options?: HttpFetchErrorOptions) {
    super(message);
    this.name = 'HttpFetchError'; 
    this.__url = url;
    this.attempt = options?.attempt;
    this.responseStatus = options?.responseStatus;
    this.responseBody = options?.responseBody;
    this.cause = options?.cause;
    Object.setPrototypeOf(this, HttpFetchError.prototype);
  }

  public get url():string | URL | Request {return this.__url ;}
}

//Allowed HTTP methods
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'HEAD'
  | 'DELETE'
  | 'PURGE'
  | 'OPTIONS'
  | 'TRACE'
  | 'CONNECT'
  | 'QUERY'
  ;
  
//Supported response types for parsing
type HttpResponseTypeCase = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream' | 'formData';

//Main type definition for httpFetchHandler options
export interface FetchOptions<T = unknown> {
  // The target URL for the request
  url: string | URL | Request;

  // HTTP method to be used (defaults to 'GET' if not specified)
  methodSend?: HttpMethod;

  // Data to be sent with the request (e.g., FormData, JSON object, etc.)
  data?: T;

  // Custom HTTP headers to be sent with the request
  optionsheaders?: HeadersInit;

  // Maximum time (in milliseconds) before the request is aborted
  timeout?: number;

  // Number of retry attempts on network failure or timeout
  retryCount?: number;

  // Expected response type to automatically handle parsing
  responseType?: HttpResponseType;

  // Whether to retry the request for certain HTTP status codes (e.g., 5xx)
  retryOnStatusCode?: boolean;
  keepalive?: boolean;
}

/**
 *
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
export async function httpFetchHandler<K extends HttpResponseType = "json">({
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
  retryOnStatusCode = false,
  keepalive = false
}: FetchOptions): Promise<HttpResponse<ResponseTypeMap[typeof responseType]>> {
  
  const isFormData = data instanceof FormData;
  const headers_requete: HeadersInit = { ...optionsheaders };

  if (isFormData && headers_requete instanceof Object) {
    delete (headers_requete as Record<string, string>)["Content-Type"];
  }

  if (keepalive) {
    retryCount = 1;
    timeout = 0;
  }

  const params: RequestInit = {
    method: methodSend,
    headers: headers_requete,
    keepalive: keepalive // Send request with keepalive flag if enabled
  };

  if (data && ["POST", "PUT", "PATCH"].includes(methodSend)) {
    params.body = isFormData ? data : JSON.stringify(data);
  }

  if (retryCount === 1) {
    retryCount += 2;
  }

  for (let attempt = 0; attempt < retryCount; ++attempt) {
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (!keepalive && timeout > 0) {
      timeoutId = setTimeout(() => controller.abort(), timeout);
      params.signal = controller.signal;
    }

    try {
      const response = await fetch(url, params);

      if (timeoutId) clearTimeout(timeoutId);

      const isErrror = mapStatusToResponseType(response.status) === "error"

      if (isErrror) {
        Logger.warn(`Response status=${response.status} (attempt ${attempt + 1}/${retryCount})`);

        if (!retryOnStatusCode || attempt === retryCount - 1) {
          return await parseHttpErrorResponse(response);
        }

        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));

        continue; 
      }

      Logger.info(`Successful response (status ${response.status}) on attempt ${attempt + 1}`);

      return await responseTypeHandle(responseType, response);

    } catch (error: any) {

      if (timeoutId) clearTimeout(timeoutId);

      const isLastAttempt = attempt === retryCount - 1;

      if (error.name === "AbortError") {
        Logger.warn(`Timeout (attempt ${attempt + 1}/${retryCount})`);

        if (isLastAttempt) { //si c'est la dernier tentative

          throw new HttpFetchError("Request timed out because the server did not respond within the specified time.", url, { cause: error });
        }

      } else if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {

        Logger.warn(`Network error: ${error.message} (attempt ${attempt + 1}/${retryCount})`);

        if (isLastAttempt) {
          throw new HttpFetchError(`Network error after ${retryCount} attempts: ${error.message}`, url, { cause: error });
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));

        continue;
      }

      else {
        Logger.error(`Unexpected error: ${error.message} (attempt ${attempt + 1}/${retryCount})`);

        if (isLastAttempt) {
          throw new HttpFetchError(`Unexpected error after ${retryCount} attempts: ${error.message}`, url, { cause: error });
        }

        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));

        continue;
      }
    }
  }

  throw new HttpFetchError("Unexpected fallthrough in httpFetchHandler", url);
}
