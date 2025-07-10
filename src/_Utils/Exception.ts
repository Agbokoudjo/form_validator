/**
 * Custom exception thrown when a required attribute is missing on a DOM element,
 * such as the `pattern` attribute on an `<input>` or `<textarea>` element.
 *
 * This exception is particularly useful in form validation scenarios where specific
 * attributes are expected to be present on child elements within a parent container.
 *
 * It automatically logs an error message using the `Logger` service when instantiated.
 *
 * Example use case:
 * ```ts
 * if (!pattern) {
 *   throw new AttributeException('pattern', input.name, 'RegistrationForm');
 * }
 * ```
 *
 * @class AttributeException
 * @extends Error
 *
 * @param attributeName - The name of the missing attribute (e.g., "pattern").
 * @param childrenName - The `name` attribute of the DOM element (child) that is missing the required attribute.
 * @param  parentNameOrIdOrTagName - A descriptive name of the parent container or form (used for logging context).
 *
 * @property name - The name of the exception ("AttributeException").
 * @property attributeName - The name of the missing attribute.
 * @property childrenName - The child input's name where the issue occurred.
 * @property  parentNameOrIdOrTagName - The name of the parent container for better context.
 *
 * @note This class uses the `Logger.error()` method internally for consistent logging.
 */
export class AttributeException extends Error {
    constructor(
        private readonly attributeName: string,
        private readonly childrenName: string,
        private readonly parentNameOrIdOrTagName: string) {
        const message = `The ${attributeName} field named "${childrenName}" in the "${parentNameOrIdOrTagName}" container does not have a pattern attribute.`;
        super(message);

        this.name = 'AttributeException';

        console.error(message);
        Object.setPrototypeOf(this, AttributeException.prototype);
    }

    public get __attributeName(): string { return this.attributeName; }

    public get __childrenName(): string { return this.childrenName; }

    public get __parentNameOrIdOrTagName(): string { return this.parentNameOrIdOrTagName; }
}

export class FormAttributeNoFoundException extends Error {

    public constructor(
        private readonly form: HTMLFormElement,
        private readonly attributeName: string,
        private readonly contextChildrenName: string
    ) {
        const message = `The required attribute "${attributeName}" does not exist on the parent form element (Form HTML: ${form.outerHTML}). ` +
            `This attribute is mandatory for validation logic initiated by the field "${contextChildrenName}".`
        super(message);

        this.name = "FormAttributeNoFoundException";
        console.error(message);
        Object.setPrototypeOf(this, FormAttributeNoFoundException.prototype);
    }

    public get __form(): HTMLFormElement { return this.form; }

    public get __childrenName(): string { return this.contextChildrenName; }

    public get __attributeName(): string { return this.attributeName; }
}