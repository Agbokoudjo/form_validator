# 📘 Function Documentation

::: toc
## 📌 Table of contents

-   [addParamToUrl](#addParamToUrl)
-   [buildUrlFromForm](#buildUrlFromForm)
-   [responseTypeHandle](#responseTypeHandle)
-   [detectedResponseTypeNoOk](#detectedResponseTypeNoOk)
-   [mapStatusToResponseType](#mapStatusToResponseType)
-   [HttpFetchError](#HttpFetchError)
-   [httpFetchHandler](#httpFetchHandler)
:::

::: {#addParamToUrl .section .function-doc}
## 🔧 Function: `addParamToUrl`

This function dynamically adds query parameters to an existing URL and
returns the updated URL, either as a string or as a `URL` instance.

### 📥 Parameters

-   `urlparam: string | URL` -- The base URL to which query parameters
    will be added.
-   `addparamUrlDependencie: Record<string, any> | null` -- Key-value
    pairs to be added as query parameters (default: `null`).
-   `returnUrl: boolean` -- If `true` (default), returns the URL as a
    string. If `false`, returns it as a `URL` instance.
-   `baseUrl: string | URL | undefined` -- The base URL to use if
    `urlparam` is relative (default: `window.location.origin`).

### 📤 Returns

`string | URL` -- The updated URL, either as a string or a `URL` object.

### 💡 Example

    const result = addParamToUrl("https://example.com", { lang: "fr", user: "test" });
    console.log(result); 
    // "https://example.com/?lang=fr&user=test"
      
:::

::: {#buildUrlFromForm .section .function-doc}
## 🔧 Function: `buildUrlFromForm`

This function extracts data from an HTML form and converts it into URL
parameters, which are then appended to a target URL. It can also merge
additional parameters into the final URL.

### 📥 Parameters

-   `formElement: HTMLFormElement` -- The source form whose data should
    be converted into URL parameters.
-   `form_action: string | null` -- An alternative action URL to use if
    `formElement.action` is empty (default: `null`).
-   `addparamUrlDependencie: Record<string, any> | null` -- Additional
    parameters to be merged into the generated URL (default: `null`).
-   `returnUrl: boolean` -- If `true` (default), returns a string;
    otherwise returns a `URL` instance.
-   `baseUrl: string | URL | undefined` -- The base URL to use in case
    of a relative path (default: `window.location.origin`).

### 📤 Returns

`string | URL` -- The resulting URL enriched with form data and
optionally additional parameters.

### 💡 Example

    // HTML
    <form id="searchForm">
      <input name="q" value="javascript">
      <input name="sort" value="asc">
    </form>

    // JavaScript
    const form = document.getElementById("searchForm");
    const result = buildUrlFromForm(form, null, { page: 2 });
    console.log(result);
    // "http://.../search?q=javascript&sort=asc&page=2"
      
:::

::: {#responseTypeHandle .section .function-doc}
## 🔧 Function: `responseTypeHandle`

This asynchronous function handles different HTTP response types
(`json`, `text`, `blob`, etc.) and returns a `HttpResponse` instance
containing the extracted data based on the specified type.

### 📥 Parameters

-   **`responseType: string`** -- The expected type of the response. Can
    be `"json"`, `"text"`, `"blob"`, `"arrayBuffer"`, `"formData"`, or
    `"stream"`.
-   **`response: Response`** -- The HTTP `Response` object to be
    handled.

### 📤 Returns

A `Promise` that resolves to an instance of `HttpResponse` with the
following properties:

-   `status` -- The HTTP status code
-   `headers` -- The HTTP response headers
-   `data` -- The parsed response data according to the specified type

### 💡 Example

``` ts
// Example usage with fetch
const response = await fetch("/api/data");
const result = await responseTypeHandle("json", response);
console.log(result.data); // Outputs the extracted JSON data
  
```
:::

::: {#detectedResponseTypeNoOk .section .function-doc}
## 🔧 Function: `detectedResponseTypeNoOk`

This function automatically detects the content type of an HTTP response
based on the `Content-Type` header when an error status is returned
(e.g., status code 4xx or 5xx). It then uses `responseTypeHandle` to
properly parse the response data.

### 📥 Parameters

-   **`response: Response`** -- The HTTP response object to analyze.

### 📤 Returns

A `Promise` resolving to an instance of `HttpResponse` containing the
parsed response body. The data type depends on the actual content
returned by the server: JSON, plain text, XML, or raw status message.

### 🔍 Behavior by Content-Type

-   `application/json`, `application/ld+json`, or any type containing
    `"json"` → **Parsed as JSON**
-   `text/html`, `text/plain` → **Parsed as text**
-   `application/xml`, `text/xml`, or any type containing `"xml"` →
    **Parsed as text**
-   *Other types* → Raw `statusText` is returned as the data

### 💡 Example

``` ts
// Example usage
const response = await fetch("/api/404");
const result = await detectedResponseTypeNoOk(response);
console.log(result.data); // Outputs error text or JSON
  
```
:::

::: {#mapStatusToResponseType .section .function-doc}
## 🔧 Function: `mapStatusToResponseType`

This function maps an HTTP status code (`statusCodeHttpResponse`) to a
simplified logical response type that can be used to display user
messages or apply styling (e.g., success, error, etc.).

### 📥 Parameters

-   **`statusCodeHttpResponse: number`** -- The HTTP response code to
    evaluate (e.g., 200, 404, 301, etc.).

### 📤 Returns

A value of type `'success'` \| `'info'` \| `'warning'` \| `'error'`,
representing the mapped logical status.

### 🔍 Status Mapping

-   **\< 200** → `'info'` (informational, custom redirects\...)
-   **200--299** → `'success'` (request successful)
-   **300--399** → `'warning'` (redirection, attention needed)
-   **400+** → `'error'` (client or server error)

### 💡 Example

``` ts
// Example usage
const type = mapStatusToResponseType(404);
console.log(type); // 'error'
  
```
:::

------------------------------------------------------------------------

::: {#HttpFetchError .section}
## HttpFetchError

`HttpFetchError` is a custom class that extends `Error`. It represents a
specific error during an HTTP request, with additional metadata useful
for debugging and monitoring, such as retry attempts, status code, or
the response body.

### Constructor

``` ts
new HttpFetchError(
  message: string,
  url: string | URL | Request,
  options?: {
    attempt?: number;
    responseStatus?: number;
    responseBody?: any;
    cause?: any;
  }
)
  
```

### Parameters

-   **message** (`string`) -- The error message.
-   **url** (`string | URL | Request`) -- The URL related to the failed
    HTTP request.
-   **options** (optional):
    -   **attempt** (`number`) -- Number of attempts made before the
        failure.
    -   **responseStatus** (`number`) -- The returned HTTP status code.
    -   **responseBody** (`any`) -- The body of the HTTP response.
    -   **cause** (`any`) -- The original cause of the error (e.g.,
        internal exception).

### Properties

-   `name` -- Always set to `"HttpFetchError"` for easy identification.
-   `url` -- The URL or request associated with the error.
-   `attempt` -- The number of retry attempts made.
-   `responseStatus` -- The returned HTTP status code.
-   `responseBody` -- The body of the HTTP response.
-   `cause` -- Details or exception that caused the error.

### Usage Example

``` ts
// Create a custom HTTP error
throw new HttpFetchError("Network error", "https://example.com/api", {
  attempt: 3,
  responseStatus: 500,
  responseBody: { error: "Internal Server Error" },
});
  
```
:::

------------------------------------------------------------------------

::: {#httpFetchHandler .section}
## 🔄 Function: `httpFetchHandler`

`httpFetchHandler` is an advanced asynchronous utility for handling HTTP
requests with built-in support for retries, timeout handling, error
categorization, and automatic response parsing. It encapsulates common
fetch operations and adds resilience through retry logic and
fine-grained error management.

### 📥 Parameters

-   **`url: string | URL | Request`** -- The URL or request object to
    send the HTTP request to.

-   **`methodSend: string`** -- HTTP method (e.g. `"GET"`, `"POST"`,
    `"PUT"`, etc.). Default is `"GET"`.

-   **`data: any`** -- The request payload. If it is an instance of
    `FormData`, headers will be adjusted automatically.

-   **`optionsheaders: HeadersInit`** -- Custom request headers.
    Defaults to:

        {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }

-   **`timeout: number`** -- Timeout in milliseconds. Default is `45000`
    (45 seconds). Ignored if `keepalive` is `true`.

-   **`retryCount: number`** -- Maximum number of retry attempts for
    recoverable errors. Default is `3`.

-   **`responseType: string`** -- Expected response type. Can be
    `"json"`, `"text"`, `"blob"`, etc.

-   **`retryOnStatusCode: boolean`** -- Whether to retry requests on
    error HTTP status codes (like 500). Default is `false`.

-   **`keepalive: boolean`** -- Enables the keepalive flag for
    background requests (e.g., during page unload). Disables timeout and
    retries if `true`.

### 📤 Returns

A `Promise` that resolves to an `HttpResponse` object containing the
response status, headers, and parsed data based on the specified
`responseType`.

### 🚦Behavior & Features

-   💡 Automatically retries failed requests (e.g., network errors,
    server issues) up to `retryCount` times.
-   ⏱️ Applies a timeout using `AbortController`, unless `keepalive` is
    enabled.
-   🧠 Intelligent content parsing with `responseTypeHandle` and
    fallback handling via `detectedResponseTypeNoOk`.
-   🪝 Logs responses, warnings, and errors with contextual information
    including the attempt count.
-   ❗ Throws an `HttpFetchError` when all attempts fail or when an
    unrecoverable error occurs.

### 💡 Example

``` ts
const response = await httpFetchHandler({
  url: "https://api.example.com/data",
  methodSend: "POST",
  data: { username: "john", password: "secret" },
  retryOnStatusCode: true,
  timeout: 10000,
  responseType: "json"
});

console.log(response.data); // Parsed response data
  
```

### 🔁 Retry Strategy

The function attempts the request up to `retryCount` times in the
following cases:

-   **Timeout** -- The server doesn\'t respond in time.
-   **Network Error** -- The connection fails (e.g., no internet).
-   **Error HTTP Status** -- Only if `retryOnStatusCode` is `true`.
-   Each retry is delayed by a backoff timer (e.g., 500ms × attempt
    index).

### ⚠️ Errors Thrown

-   `HttpFetchError` -- When the request fails after all retries or in
    case of unexpected failures.
-   Includes useful metadata: attempted URL, response status, body (if
    available), and original cause.
:::
