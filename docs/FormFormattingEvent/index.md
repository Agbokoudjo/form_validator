# FormFormattingEvent Module Documentation

## Table of Contents

-   [FormFormattingEvent](#FormFormattingEvent)
-   [init Method](#initMethod)
-   [lastnameToUpperCase](#lastnameToUpperCase)
-   [capitalizeUsername](#capitalizeUsername)
-   [usernameFormatDom](#usernameFormatDom)

::: {#FormFormattingEvent .section}
## FormFormattingEvent

`FormFormattingEvent` is a singleton class designed to handle automatic
formatting of user form inputs, particularly name fields such as
`.firstname`, `.lastname`, and `.username`.

It provides utility methods to standardize user input presentation,
enhancing both frontend UX and backend data consistency.
:::

::: {#initMethod .section}
## init Method

The `init` method initializes formatting rules for specified form inputs
within a given context (DOM container). It binds blur events to the
input fields and formats their values using the provided options.

### Parameters

-   **option_module**: Additional configuration such as `locales`.
:::

::: {#lastnameToUpperCase .section}
## lastnameToUpperCase

Automatically converts the value of an input field with class
`.lastname` to uppercase when it loses focus. Useful for standardizing
how last names are entered.

### Parameters

-   **subject**: The DOM scope containing the input field.
-   **locales**: Optional locale to be used for the transformation.
:::

::: {#capitalizeUsername .section}
## capitalizeUsername

Capitalizes each word in the input field with class `.firstname`. Ideal
for properly formatting first names like \"john doe\" into \"John Doe\".

### Parameters

-   **subject**: The DOM scope where the field exists.
-   **separator_toString**: Separator before formatting (default:
    space).
-   **finale_separator_toString**: Final separator after formatting
    (default: space).
-   **locales**: Optional locale(s) to be used for capitalization.
:::

::: {#usernameFormatDom .section}
## usernameFormatDom

Formats the full name field (.username) by applying the correct casing
and name positioning (first name + last name). Takes into account the
custom attribute `data-position-lastname` to determine the display
order.

### Parameters

-   **subject**: The DOM container to operate in.
-   **separator_toString**: Separator before formatting (default:
    space).
-   **finale_separator_toString**: Separator after formatting (default:
    space).
-   **locales**: Optional locale(s) for formatting.
:::
