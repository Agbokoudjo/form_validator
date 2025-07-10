::: {#logger .section .container ._utils-logger}
# Logger Module

The `Logger` module provides environment-aware logging utilities for
development, production, and testing. It supports methods for standard
logs, information, warnings, and errors with timestamped and color-coded
output.

## Environment

The logger supports the following environments: `"dev"`{.tag}
`"prod"`{.tag} `"test"`{.tag}

## Usage Example

            Logger.log('Application started');
            Logger.info('User logged in', { id: 123, name: "Alice" });
            Logger.warn('Deprecated function called');
            Logger.error(new Error('Something went wrong'));
        

### Example Output (dev environment)

::: example-output
\[LOG\] 2025-05-26T10:20:30.123Z \"Application started\"
:::

::: example-output
\[INFO\] 2025-05-26T10:20:30.456Z \"User logged in\" { id: 123, name:
\"Alice\" }
:::

::: example-output
\[WARN\] 2025-05-26T10:20:30.789Z \"Deprecated function called\"
:::

::: example-output
\[ERROR\] 2025-05-26T10:20:31.000Z \"Error: Something went wrong\"
:::

## Class: Logger

### Properties

-   `APP_ENV: Env` --- Application environment (\"dev\", \"prod\",
    \"test\")
-   `DEBUG: boolean` --- Enables or disables logging

### Methods

#### `log(...args: any[]): void`

Logs standard messages (in dev or test environments only).

#### `info(...args: any[]): void`

Logs informative messages in **dev** environment only.

#### `warn(...args: any[]): void`

Logs warning messages. Available in all environments when DEBUG is true.

#### `error(...args: any[]): void`

Always logs error messages, even in production.

### Internal Logic

-   Each log method checks the current environment before logging.
-   Logs are timestamped using `new Date().toISOString()`.
-   Errors are stringified with stack traces.
-   Objects are formatted as pretty-printed JSON.

## Singleton Pattern

The logger uses a singleton pattern via `getInstance()` to ensure only
one instance is used throughout the app.
:::
