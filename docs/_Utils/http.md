# HTTP Fetch Handler Documentation

## Table of Contents

### Core Utilities
- [HttpResponse Class](#HttpResponse)
- [HttpFetchError Class](#HttpFetchError)

### Response Handling
- [Response Type Handling](#responseTypeHandle)
- [Automatic Response Detection](#detectedResponseTypeNoOk)
- [Status Code Mapping](#mapStatusToResponseType)

### Main Handler
- [HTTP Fetch Handler](#httpFetchHandler)
- [Parameters Reference](#parameters-reference)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Retry Mechanism](#retry-mechanism)

### Integration
- [jQuery Form Submission](#jquery-form-submission)
- [SweetAlert2 Integration](#sweetalert2-integration)

---

## Class `HttpResponse` {#HttpResponse}

**Generic HTTP response wrapper for type-safe response handling.**

Encapsulates HTTP response data with status code, headers, and parsed response body.

### Constructor

```typescript
constructor(response_data: HttpResponseData<T>)
```

### Properties

- **`status: number`** - HTTP status code (200, 404, 500, etc.)
- **`headers: Headers`** - Response headers object
- **`data: T`** - Parsed response body (generic type)

### Example

```typescript
const response = new HttpResponse({
    status: 200,
    headers: new Headers({ 'content-type': 'application/json' }),
    data: { id: 1, name: 'John' }
});

console.log(response.status);  // 200
console.log(response.data);    // { id: 1, name: 'John' }
```

---

## Class `HttpFetchError` {#HttpFetchError}

**Custom error class for HTTP fetch operation failures.**

Extends native Error with HTTP context information for debugging.

### Constructor

```typescript
constructor(
    message: string,
    url: string | URL | Request,
    options?: HttpFetchErrorOptions
)
```

### Properties

- **`url: string | URL | Request`** - The URL that failed
- **`attempt?: number`** - Which retry attempt failed
- **`responseStatus?: number`** - HTTP response status code
- **`responseBody?: any`** - Response body if available
- **`cause?: any`** - Underlying error (AbortError, NetworkError, etc.)

### Example

```typescript
try {
    // Network request
} catch (error) {
    if (error instanceof HttpFetchError) {
        console.log(`Failed URL: ${error.url}`);
        console.log(`Attempt: ${error.attempt}`);
        console.log(`Status: ${error.responseStatus}`);
        console.log(`Cause: ${error.cause}`);
    }
}
```

---

## Function `responseTypeHandle` {#responseTypeHandle}

**Parses HTTP response based on specified response type.**

Automatically converts Response object to desired format (JSON, text, blob, etc.).

### Signature

```typescript
async function responseTypeHandle<T = unknown>(
    responseType: string,
    response: Response
): Promise<HttpResponse>
```

### Response Types

| Type | Description | Use Case |
|------|-------------|----------|
| `"json"` | Parses as JSON object | API responses |
| `"text"` | Plain text response | HTML, XML, plain text |
| `"blob"` | Binary large object | Images, files |
| `"arrayBuffer"` | Raw binary data | Binary processing |
| `"formData"` | Form data object | Form submissions |
| `"stream"` | ReadableStream | Streaming responses |

### Example

```typescript
const response = await fetch('https://api.example.com/users');
const parsed = await responseTypeHandle('json', response);
console.log(parsed.data);  // Parsed JSON
```

---

## Function `detectedResponseTypeNoOk` {#detectedResponseTypeNoOk}

**Automatically detects response type from Content-Type header.**

Smart type detection for error responses (4xx, 5xx status codes).

### Signature

```typescript
async function detectedResponseTypeNoOk<T = unknown>(
    response: Response
): Promise<HttpResponse>
```

### Auto-Detection Rules

| Content-Type | Detected As |
|--------------|-------------|
| `application/json`, `application/ld+json` | JSON |
| `text/html`, `text/plain` | Text |
| `application/xml`, `text/xml` | Text (XML) |
| Other | Status text |

### Example

```typescript
try {
    const response = await fetch('https://api.example.com/invalid');
    if (!response.ok) {
        const errorData = await detectedResponseTypeNoOk(response);
        console.log(errorData.data);  // Auto-detected error format
    }
} catch (error) {
    console.error(error);
}
```

---

## Function `mapStatusToResponseType` {#mapStatusToResponseType}

**Maps HTTP status codes to semantic response types.**

Categorizes HTTP status codes into logical groups.

### Signature

```typescript
function mapStatusToResponseType(statusCodeHttpResponse: number): 'success' | 'info' | 'warning' | 'error'
```

### Status Mapping

| Status Code | Type |
|-------------|------|
| < 200 | `'info'` |
| 200-299 | `'success'` |
| 300-399 | `'warning'` |
| ≥ 400 | `'error'` |

### Example

```typescript
const status1 = mapStatusToResponseType(200);  // 'success'
const status2 = mapStatusToResponseType(404);  // 'error'
const status3 = mapStatusToResponseType(301);  // 'warning'
const status4 = mapStatusToResponseType(100);  // 'info'
```

---

## Function `httpFetchHandler` {#httpFetchHandler}

**Advanced HTTP request handler with timeout, retry, and parsing.**

Main utility function for making HTTP requests with built-in resilience.

### Signature

```typescript
async function httpFetchHandler<T = unknown>(options: FetchOptions): Promise<HttpResponse>
```

### Parameters Reference {#parameters-reference}

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | `string \| URL \| Request` | **Required** | Target API endpoint |
| `methodSend` | `HttpMethod` | `"GET"` | HTTP method (GET, POST, PUT, DELETE, etc.) |
| `data` | `any` | `null` | Request body (JSON object or FormData) |
| `optionsheaders` | `HeadersInit` | See below | Custom HTTP headers |
| `timeout` | `number` | `45000` | Request timeout in milliseconds |
| `retryCount` | `number` | `3` | Number of retry attempts |
| `responseType` | `HttpResponseType` | `'json'` | Expected response format |
| `retryOnStatusCode` | `boolean` | `false` | Retry on 5xx errors |
| `keepalive` | `boolean` | `false` | Send request with keepalive flag |

### Default Headers

```typescript
{
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
}
```

### Behavior Details

#### FormData Handling
- Automatically removes `Content-Type` header for FormData
- Browser sets correct multipart encoding

#### JSON Data Handling
- Automatically calls `JSON.stringify()` on data
- **Do NOT pre-stringify data**

```typescript
// ✅ Correct
await httpFetchHandler({
    url: '/api/users',
    data: { name: 'John' }  // Plain object
});

// ❌ Wrong
await httpFetchHandler({
    url: '/api/users',
    data: JSON.stringify({ name: 'John' })  // Double encoding!
});
```

#### Timeout Mechanism
- Uses `AbortController` for request cancellation
- Triggers after specified timeout (default: 45s)
- Throws `HttpFetchError` on timeout

#### Retry Logic
- Automatic retries on network errors
- Exponential backoff: `500ms * (attempt + 1)`
- Configurable retry count (minimum 3)
- Optional retry on specific HTTP status codes

### Retry Flow

```
Attempt 1: Immediate
    ↓
Fail? → Yes → Wait 500ms
            ↓
Attempt 2
    ↓
Fail? → Yes → Wait 1000ms
            ↓
Attempt 3
    ↓
Fail? → Throw error
```

---

## Usage Examples {#usage-examples}

### Simple GET Request

```typescript
const response = await httpFetchHandler({
    url: 'https://api.example.com/posts',
    responseType: 'json'
});

console.log(response.status);  // 200
console.log(response.data);    // Array of posts
```

### POST with JSON Data

```typescript
const response = await httpFetchHandler({
    url: 'https://api.example.com/users',
    methodSend: 'POST',
    data: { 
        name: 'Alice',
        email: 'alice@example.com'
    },
    responseType: 'json'
});

console.log(response.data);  // Created user object
```

### File Upload with FormData

```typescript
const formElement = document.querySelector('form');
const formData = new FormData(formElement);

const response = await httpFetchHandler({
    url: 'https://api.example.com/upload',
    methodSend: 'POST',
    data: formData,  // FormData automatically handled
    responseType: 'json'
});

console.log(response.data);  // Upload response
```

### With Custom Headers

```typescript
const response = await httpFetchHandler({
    url: 'https://api.example.com/protected',
    optionsheaders: {
        'Authorization': `Bearer ${token}`,
        'X-Custom-Header': 'value'
    },
    responseType: 'json'
});
```

### Retry Configuration

```typescript
const response = await httpFetchHandler({
    url: 'https://unstable-api.example.com/data',
    timeout: 30000,       // 30 second timeout
    retryCount: 5,        // Try 5 times
    retryOnStatusCode: true,  // Retry on 5xx errors
    responseType: 'json'
});
```

### Blob Download

```typescript
const response = await httpFetchHandler({
    url: 'https://api.example.com/file.pdf',
    responseType: 'blob'
});

// Download file
const url = URL.createObjectURL(response.data);
const link = document.createElement('a');
link.href = url;
link.download = 'file.pdf';
link.click();
```

### Stream Response

```typescript
const response = await httpFetchHandler({
    url: 'https://api.example.com/stream',
    responseType: 'stream'
});

// Handle streaming
const reader = response.data.getReader();
const { value, done } = await reader.read();
```

---

## Error Handling {#error-handling}

### Handling HttpFetchError

```typescript
try {
    const response = await httpFetchHandler({
        url: 'https://api.example.com/data',
        timeout: 5000
    });
} catch (error) {
    if (error instanceof HttpFetchError) {
        if (error.name.includes('Timeout')) {
            console.log('Request timed out');
        } else if (error.message.includes('NetworkError')) {
            console.log('Network connection failed');
        } else {
            console.log('Other error:', error.message);
        }
    }
}
```

### Handling HTTP Errors (4xx, 5xx)

```typescript
const response = await httpFetchHandler({
    url: 'https://api.example.com/users/999',
    responseType: 'json'
});

if (mapStatusToResponseType(response.status) === 'error') {
    console.log(`Error ${response.status}:`, response.data);
}
```

### Handling Non-OK Status Codes

```typescript
try {
    const response = await httpFetchHandler({
        url: 'https://api.example.com/data',
        responseType: 'json'
    });

    const responseType = mapStatusToResponseType(response.status);
    
    if (responseType === 'error') {
        throw response;  // Handle as error
    }
    
    // Handle success
    console.log(response.data);
} catch (error) {
    if (error instanceof HttpResponse) {
        console.error(`HTTP ${error.status}:`, error.data);
    }
}
```

---

## Retry Mechanism {#retry-mechanism}

### Automatic Retry Scenarios

| Error Type | Retries | Behavior |
|-----------|---------|----------|
| Timeout (AbortError) | Yes | Wait 500ms × attempt count |
| Network error | Yes | Wait 1000ms × attempt count |
| 5xx status codes | Conditional | Only if `retryOnStatusCode: true` |
| Parse errors | No | Throw immediately |

### Exponential Backoff Example

```typescript
// Retry delays: 500ms → 1000ms → 1500ms
await httpFetchHandler({
    url: 'https://unstable.example.com',
    retryCount: 3,
    timeout: 10000
});
```

---

## jQuery Form Submission {#jquery-form-submission}

**Real-world integration with jQuery form handling.**

### HTML Structure

```html
<form class="form_submit" name="contactForm" id="contactForm">
    <input type="text" name="name" required />
    <input type="email" name="email" required />
    <textarea name="message" required></textarea>
    <button type="submit">Send</button>
</form>
```

### jQuery Handler Setup

```typescript
jQuery(function() {
    jQuery(document).on('submit', 'form.form_submit', async (event) => {
        event.preventDefault();
        
        const form = jQuery(event.target);
        const $submitButton = jQuery('button[type="submit"]', form);
        
        // Disable button and show loading state
        const originalText = $submitButton.text();
        $submitButton.prop('disabled', true).text('Sending...');

        try {
            // Submit form data
            const response = await httpFetchHandler({
                url: 'https://api.example.com/submit',
                methodSend: 'POST',
                data: new FormData(form.get()[0]),
                timeout: 60000,
                retryCount: 2,
                responseType: 'json'
            });

            if (mapStatusToResponseType(response.status) === 'success') {
                alert('Form submitted successfully!');
                form.get()[0].reset();
            } else {
                alert('Submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            // Restore button
            $submitButton.text(originalText).prop('disabled', false);
        }
    });
});
```

---

## SweetAlert2 Integration {#sweetalert2-integration}

**Complete example with SweetAlert2 for user feedback.**

### Base Configuration

```typescript
const baseSweetAlert2Options = {
    animation: true,
    allowEscapeKey: false,
    background: '#00427E',
    color: '#fff',
    showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster'
    }
};
```

### Form Submission with SweetAlert2

```typescript
jQuery(function() {
    let originalText;

    jQuery(document).on('submit', 'form.form_submit', async (event) => {
        event.preventDefault();

        const form = jQuery(event.target);
        const $submitButton = jQuery('button[type="submit"]', form);
        originalText = $submitButton.text();

        // Show loading alert
        Swal.fire({
            title: 'Processing',
            icon: 'info',
            html: '<div class="alert alert-info">Sending data. Please wait...</div>',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 60000,
            timerProgressBar: true,
            ...baseSweetAlert2Options
        });

        Swal.showLoading();

        try {
            const response = await httpFetchHandler({
                url: '/api/submit',
                methodSend: 'POST',
                data: new FormData(form.get()[0]),
                timeout: 60000,
                retryCount: 2,
                responseType: 'json'
            });

            if (mapStatusToResponseType(response.status) === 'error') {
                throw response;
            }

            // Success alert
            Swal.fire({
                title: response.data.title,
                icon: 'success',
                html: `<div class="alert alert-success">${response.data.message}</div>`,
                showConfirmButton: false,
                showCloseButton: true,
                ...baseSweetAlert2Options
            });

            form.get()[0].reset();
            $submitButton.text(originalText).prop('disabled', false);

        } catch (error) {
            // Error alert
            let title = 'Error';
            let message = 'An error occurred. Please try again.';

            if (error instanceof HttpResponse) {
                title = error.data?.title || `Error ${error.status}`;
                message = error.data?.message || error.data;
            } else if (error instanceof HttpFetchError) {
                title = 'Network Error';
                message = error.message;
            }

            Swal.fire({
                title: title,
                icon: 'error',
                html: `<div class="alert alert-danger">${message}</div>`,
                showConfirmButton: false,
                showCloseButton: true,
                ...baseSweetAlert2Options
            });

            $submitButton.text('Retry').prop('disabled', false);
        }
    });
});
```

---

## Best Practices

### ✅ Do's

- Pass plain objects, not stringified JSON
- Use appropriate response types
- Set reasonable timeouts (10-60 seconds)
- Handle errors with specific error classes
- Use retry for network operations
- Clear user feedback on errors

### ❌ Don'ts

- Don't pre-stringify JSON data
- Don't set timeout to 0 (unless keepalive)
- Don't ignore network errors
- Don't forget error handling
- Don't use retryOnStatusCode carelessly
- Don't forget to restore UI on completion

---

## Performance Tips

1. **Use keepalive for non-critical requests**
2. **Set appropriate timeouts for different operations**
3. **Use blob/arrayBuffer for binary data**
4. **Stream large responses when possible**
5. **Implement request deduplication**
6. **Cache responses when appropriate**