# Exceptions Documentation

## Table of Contents

[AttributeException](#attribute-exception)

::: {#attribute-exception .section}
## Class `AttributeException`

Custom exception thrown when a required attribute is missing from a DOM
element, such as the `pattern` attribute on an `<input>` or `<textarea>`
element.

Useful in form validation where certain attributes are expected on child
elements.

### Usage Example

    if (!pattern) {
        throw new AttributeException('pattern', input.name, 'RegistrationForm');
    }

### Properties

-   **name**: Name of the exception (`"AttributeException"`).
-   **attributeName**: Name of the missing attribute.
-   **childrenName**: Name of the affected child element.
-   **parentNameOrIdOrTagName**: Name or ID of the parent for context.

### Source Code

    export class AttributeException extends Error {
        constructor(
            private readonly attributeName: string,
            private readonly childrenName: string,
            private readonly parentNameOrIdOrTagName: string) {
            const message = `The ${attributeName} field named "${childrenName}" in the "${parentNameOrIdOrTagName}" container does not have a pattern attribute.`;
            super(message);
            this.name = 'AttributeException';
            Logger.error(message);
            Object.setPrototypeOf(this, AttributeException.prototype);
        }
    }

Note: This class uses the `Logger.error()` method for consistent
logging.
:::
