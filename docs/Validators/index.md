<div>

# Form Validator Documentation

</div>

::: container
## Table of Contents

### Validators

-   [TextInputValidator](#TextInputValidator)
-   [PasswordInputValidator](#PasswordInputValidator)
-   [FormError](#FormError)
-   [NumberInputValidator](#NumberInputValidator)
-   [TelInputValidator](#TelInputValidator)
-   [FQDNInputValidator](#FQDNInputValidator)
-   [EmailInputValidator](#EmailInputValidator)
-   [URLInputValidator](#URLInputValidator)
-   [DateInputValidator](#DateInputValidator)
-   [ChoiceInputValidator](#ChoiceInputValidator)
-   [ImageValidator](#ImageValidator)
-   [DocumentValidator](#DocumentValidator)
-   [VideoValidator](#VideoValidator)
-   [FieldInputController](#FieldInputController)
-   [FormValidateController](#FormValidateController)
-   [FQDNOptions](#FQDNOptions)
-   [EmailInputOptions](#EmailInputOptions)
-   [TextInputOptions](#TextInputOptions)
-   [NumberOptions](#NumberOptions)
-   [PassworkRuleOptions](#PassworkRuleOptions)
-   [TelInputOptions](#TelInputOptions)
-   [URLOptions](#URLOptions)
-   [DateInputOptions](#DateInputOptions)
-   [OptionsFile](#OptionsFile)
-   [OptionsImage](#OptionsImage)
-   [OptionsMediaVideo](#OptionsMediaVideo)
-   [SelectOptions](#SelectOptions)
-   [OptionsCheckbox](#OptionsCheckbox)
-   [OptionsRadio](#OptionsRadio)
-   [OptionsValidateTextarea](#OptionsValidateTextarea)
-   [EventClearError](#EventClearError)

::: {role="main"}
::: {#TextInputValidator .section}
# Class `TextInputValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `TextInputValidator` class is a specialized validator for text-based
input fields. It extends `FormError` for error management and implements
`TextInputValidatorInterface`, ensuring it adheres to a contract for
text input validation. This class follows the **singleton pattern**,
meaning only one instance of it exists throughout your application,
providing a centralized and efficient way to handle text input
validation.

\-\--

## Key Features:

-   **Singleton Pattern:** Ensures a single, globally accessible
    instance for consistent validation.
-   **Required Field Validation:** Checks if an input field is mandatory
    and has a value.
-   **Length Validation:** Validates the minimum and maximum length of
    the input string.
-   **Regular Expression Validation:** Allows custom regex patterns for
    specific input formats (e.g., email, phone number).
-   **HTML/PHP Tag Stripping:** Can escape or strip HTML and PHP tags
    from input to prevent XSS vulnerabilities.
-   **Customizable Error Messages:** Provides flexible options to define
    user-friendly error messages.

\-\--

## Usage:

To use the `TextInputValidator`, you first obtain its singleton
instance. Then, you can call the `validate` method, passing the input
data, the target field name, and an options object to define the
validation rules.

### Getting an Instance:

``` typescript
import { textInputValidator  } from '@wlindabla/form_validator'
```

### Validating Text Input:

``` typescript
import { TextInputOptions } from '@wlindabla/form_validator'; // Adjust path

const dataToValidate = "Hello World";
const fieldName = "username";
const options = {
    requiredInput: true,
    minLength: 5,
    maxLength: 50,
    regexValidator: /^[a-zA-Z\s]+$/, // Allows letters and spaces
    errorMessageInput: "Username must contain only letters and spaces."
};

textInputValidator.validate(dataToValidate, fieldName, options);

if (!textInputValidator. isFieldValid(fieldName)) {
    const {isValid,errors}=textInputValidator.getState();
    console.log(`Validation errors for ${fieldName}:`,);
} else {
    console.log(`${fieldName} is valid.`);
}
```

### Parameters for `validate`:

-   `datainput` (`string | undefined`): The string value from the input
    field to be validated.
-   `targetInputname` (`string`): The name of the input field, used for
    error reporting.
-   `optionsinputtext` (`TextInputOptions`): An object containing
    validation rules. This can include:
    -   `requiredInput?: boolean`: If \`true\`, the field cannot be
        empty.
    -   `minLength?: number`: The minimum allowed length of the input.
    -   `maxLength?: number`: The maximum allowed length of the input.
    -   `regexValidator?: RegExp`: A regular expression to test the
        input against.
    -   `errorMessageInput?: string`: A custom error message to display
        if validation fails.
    -   `escapestripHtmlAndPhpTags?: boolean`: If \`true\`, HTML and PHP
        tags are escaped/stripped before validation.
    -   `egAwait?: string`: An example of the expected format, often
        appended to error messages.
-   `ignoreMergeWithDefaultOptions` (`boolean`, optional): If \`true\`,
    default options will not be merged with provided
    \`optionsinputtext\`. Defaults to \`false\`.

The method returns the current instance of `TextInputValidator`,
allowing for method chaining.
:::

::: {#PasswordInputValidator .section}
# Class `PasswordInputValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `PasswordInputValidator` class is specifically designed to validate
password inputs, enforcing a set of configurable rules to ensure
password strength and security. It extends `FormError` for robust error
handling and implements `PasswordInputValidatorInterface`. Following the
**singleton pattern**, this class guarantees that only one instance is
active across your application, centralizing password validation logic.

\-\--

## Key Features:

-   **Singleton Pattern:** Provides a single, consistent entry point for
    all password validations.
-   **Character Type Requirements:** Enforces the inclusion of uppercase
    letters, lowercase letters, numbers, special characters, and
    punctuation.
-   **Length Constraints:** Validates minimum and maximum password
    length.
-   **Custom Regular Expressions:** Allows for highly flexible
    validation rules using custom regex for each character type.
-   **Password Strength Scoring:** Integrates with `analyzeWord` and
    `scoreWord` utilities to provide a numerical score and complexity
    level (weak, medium, strong) for the password. Dispatches a custom
    event with scoring details.
-   **Inherited Error Management:** Utilizes the error reporting
    capabilities from `FormError` for clear and consistent feedback.

\-\--

## Usage:

To validate a password, retrieve the singleton instance of
`PasswordInputValidator`. Then, call the `validate` method with the
password string, its input name, and an options object defining the
validation rules. You can also provide options for password strength
analysis and scoring.

### Getting an Instance:

``` typescript
import { passwordInputValidator } from '@wlindabla/form_validator';
            
       
            
```

### Validating a Password:

``` typescript
import { PassworkRuleOptions } from '@wlindabla/form_validator'; // Adjust path
            import { AnalyzeWordOptions, WordScoringOptions } from '@wlindabla/form_validator'; // Adjust path
            
            const password = "SecurePassword123!";
            const fieldName = "userPassword";
            
            const validationOptions: PassworkRuleOptions = {
                minLength: 12,
                maxLength: 64,
                upperCaseAllow: true,
                lowerCaseAllow: true,
                numberAllow: true,
                symbolAllow: true, // Renamed from specialChar in the example code snippet
                // punctuationAllow: true, // You can also enable punctuation checking
                enableScoring: true // Enable password strength scoring
            };
            
            // Optional: Custom options for password analysis and scoring
            const analysisOptions: AnalyzeWordOptions = {
                // ... custom regex or allowed character types
            };
            
            const scoringOptions: WordScoringOptions = {
                pointsPerLength: 3,
                bonusForContainingUpper: 15,
                bonusForContainingNumber: 15,
                bonusForContainingSymbol: 20
            };
            
            passwordInputValidator.validate(
                password,
                fieldName,
                validationOptions,
                false, // Merge with default options
                analysisOptions,
                scoringOptions
            );
            
            if (!passwordInputValidator. isFieldValid(fieldName)) {
                console.log(`Password validation failed for ${fieldName}:`, passwordInputValidator.getFieldErrors());
            } else {
                console.log(`${fieldName} password is valid.`);
            }
            
            // Listen for the custom event dispatched after scoring (if enabled)
            document.addEventListener('SCORE_ANALYSIS_PASSWORD', (event: CustomEvent) => {
                const { score, analysis, input } = event.detail;
                console.log(`Password score for ${input}:`, score);
                console.log('Analysis details:', analysis);
            });
            
```

### Parameters for `validate`:

-   `datainput` (`string`): The password string to be validated.
-   `targetInputname` (`string`): The name of the input field, used for
    error reporting.
-   `optionsinputtext` (`PassworkRuleOptions`): An object defining the
    specific password rules. This includes:
    -   `minLength?: number`: Minimum allowed password length.
    -   `maxLength?: number`: Maximum allowed password length.
    -   `upperCaseAllow?: boolean`: If `true`, requires at least one
        uppercase letter.
    -   `lowerCaseAllow?: boolean`: If `true`, requires at least one
        lowercase letter.
    -   `numberAllow?: boolean`: If `true`, requires at least one digit.
    -   `symbolAllow?: boolean`: If `true`, requires at least one
        special character (non-alphanumeric, non-punctuation).
    -   `punctuationAllow?: boolean`: If `true`, requires at least one
        punctuation character.
    -   `customUpperRegex?: RegExp`, `customLowerRegex?: RegExp`, etc.:
        Custom regex for specific character types.
    -   `regexValidator?: RegExp`: An overall regex for the password.
    -   `requiredInput?: boolean`: If `true`, the field cannot be empty.
    -   `enableScoring?: boolean`: If `true`, enables password strength
        analysis and scoring.
-   `ignoreMergeWithDefaultOptions` (`boolean`, optional): If `true`,
    default options will not be merged with provided
    \`optionsinputtext\`. Defaults to \`false\`.
-   `ananalyzePasswordOptions` (`AnalyzeWordOptions`, optional): Custom
    options for the `analyzeWord` utility when scoring.
-   `scoringPasswordOptions` (`WordScoringOptions`, optional): Custom
    options for the `scoreWord` utility when scoring.

The method returns the current instance of `PasswordInputValidator`,
allowing for method chaining.
:::

::: {#FormError .section}
# Abstract Class `FieldValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`FormError\` abstract class serves as the \*\*base class for all
validators\*\* in this library. It provides a foundational structure for
managing validation states and error messages across form fields. By
inheriting from \`FormError\`, all specific validators (like
\`TextInputValidator\`, \`PasswordInputValidator\`, \`ImageValidator\`,
etc.) gain a consistent mechanism for handling and reporting validation
errors.

It interacts with an internal \`formErrorStore\` to keep track of the
validation status and associated error messages for each input field.
This ensures a centralized and standardized approach to error handling
throughout your application.

\-\--

## Key Methods:

### `areAllFieldsValid(): boolean`

-   **Description:** Checks if all form fields currently tracked by the
    error state manager are valid. This is useful for determining if a
    form can be submitted or if further action is required.
-   **Returns:** \`true\` if all fields are valid (i.e., no errors have
    been set for any field), otherwise \`false\`.

### `removeSpecificErrorMessage(targetInputname: string, messageerrorinput: string): this`

-   **Description:** Removes a specific error message associated with a
    given input field. This is useful when an error condition is
    resolved for a particular field without clearing all errors for that
    field.
-   **Parameters:**
    -   \`targetInputname\` (\`string\`): The name of the input field.
    -   \`messageerrorinput\` (\`string\`): The specific error message
        to remove.
-   **Returns:** The current instance of the validator, allowing method
    chaining.

### ` isFieldValid(targetInputname: string): boolean`

-   **Description:** Checks if a specific input field has any validation
    errors.
-   **Parameters:**
    -   \`targetInputname\` (\`string\`): The name of the input field to
        check.
-   **Returns:** \`true\` if the specified field has errors, otherwise
    \`false\`.

### `clearError(targetInputname: string): this`

-   **Description:** Clears all error messages and resets the validation
    status for a specific input field. This is typically used when a
    user starts re-entering data into a field after an error has been
    displayed.
-   **Parameters:**
    -   \`targetInputname\` (\`string\`): The name of the input field
        whose errors should be cleared.
-   **Returns:** The current instance of the validator, allowing method
    chaining.

### `setValidatorState(status: boolean, error_message: string, targetInputname: string): this`

-   **Description:** Sets the validation status and an associated error
    message for a given input field. This is the core method used by
    specific validators to report validation failures.
-   **Parameters:**
    -   \`status\` (\`boolean\`): The validation status (\`true\` for
        valid, \`false\` for invalid).
    -   \`error_message\` (\`string\`): The error message to associate
        with the field if \`status\` is \`false\`.
    -   \`targetInputname\` (\`string\`): The name of the input field.
-   **Returns:** The current instance of the validator, allowing method
    chaining.

### `getSate(targetInputname: string): FieldStateValidating`

-   **Description:** Retrieves the current validation status and any
    associated error message for a specific input field.
-   **Parameters:**
    -   \`targetInputname\` (\`string\`): The name of the input field.
-   **Returns:** An object \`{isValid: boolean; errors:
    string\[\]\|\[\]; }\` containing the validation status and an array
    of error messages for the field.

\-\--

## Usage Example:

While \`FieldValidator\` is an abstract class and cannot be instantiated
directly, its methods are available to all classes that extend it.
Here\'s a conceptual example of how a derived validator might use these
methods:

``` typescript
// Inside a derived validator, e.g., EmailValidator
            class EmailValidator extends FieldValidator {
                validate(email: string, fieldName: string): this {
                    this.clearError(fieldName); // Always good practice to clear previous errors
            
                    if (!email) {
                        this.setValidatorStatus(false, "Email is required.", fieldName);
                        return this;
                    }
            
                    // Basic email regex for demonstration
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        this.setValidatorStatus(false, "Invalid email format.", fieldName);
                    } else {
                        // If validation passes, ensure status is true and no error messages
                        // (though setValidatorStatus with true status implicitly handles this)
                        this.setValidatorStatus(true, "", fieldName);
                    }
                    return this;
                }
            }
            
            const emailVal = new EmailValidator().getInstance() // Assuming concrete implementation
            emailVal.validateEmail("test@example.com", "userEmail");
            console.log("Has errors for userEmail?", emailVal. isFieldValid("userEmail"));
            console.log("Validator status for userEmail:", emailVal.getValidatorStatus("userEmail"));
            
            emailVal.validateEmail("invalid-email", "userEmail");
            console.log("Has errors for userEmail (after invalid)?", emailVal. isFieldValid("userEmail"));
            console.log("Validator status for userEmail (after invalid):", emailVal.getValidatorStatus("userEmail"));
            
            console.log("Are all fields valid?", emailVal.areAllFieldsValid());
            
```
:::

::: {#NumberInputValidator .section}
# Class `NumberInputValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`NumberInputValidator\` class is designed for validating numerical
inputs. It ensures that values are indeed numbers and fall within
specified ranges, respect a given step, and can even match a custom
regular expression. This class extends \`FormError\` for consistent
error management and implements \`NumberInputValidatorInterface\`. Like
other validators in this library, it follows the \*\*singleton
pattern\*\*, providing a single, globally accessible instance for
efficient number validation.

\-\--

## Key Features:

-   **Singleton Pattern:** Ensures a unique instance for centralized
    number validation.
-   **Numeric Type Checking:** Verifies if the input can be converted to
    a valid number.
-   **Range Validation:** Checks if the number is within a specified
    minimum (\`min\`) and maximum (\`max\`) value.
-   **Step Validation:** Ensures the number is a valid multiple of a
    given \`step\` value.
-   **Custom Regular Expression:** Allows applying a custom regex for
    specific number formats (e.g., currency, phone numbers).
-   **Inherited Error Management:** Leverages the error handling
    capabilities of \`FormError\` for clear reporting.

\-\--

## Usage:

To validate a number input, first get the singleton instance of
\`NumberInputValidator\`. Then, call the \`validate\` method, providing
the input value, its field name, and an optional \`NumberOptions\`
object to define specific validation rules.

### Getting an Instance:

``` typescript
import { numberInputValidator as numberValidator } from '@wlindabla/form_validator';
            
            
            
```

### Validating a Number Input:

``` typescript
import { NumberOptions } from '@wlindabla/form_validator'; // Adjust path
            
            // Example 1: Basic number validation
            let value1 = "123";
            let fieldName1 = "quantity";
            numberValidator.validate(value1, fieldName1);
            
            if (numberValidator. isFieldValid(fieldName1)) {
                console.log(`Validation errors for ${fieldName1}:`, numberValidator.getFieldErrors());
            } else {
                console.log(`${fieldName1} is valid.`); // Output: quantity is valid.
            }
            
            // Example 2: Number within a range
            let value2 = "75";
            let fieldName2 = "age";
            const options2: NumberOptions = { min: 18, max: 120 };
            numberValidator.numberValidator(value2, fieldName2, options2);
            
            if (numberValidator. isFieldValid(fieldName2)) {
                console.log(`Validation errors for ${fieldName2}:`, numberValidator.getFieldErrors());
            } else {
                console.log(`${fieldName2} is valid.`); // Output: age is valid.
            }
            
            // Example 3: Number with step validation (invalid)
            let value3 = "10.5";
            let fieldName3 = "price";
            const options3: NumberOptions = { min: 0, step: 1 };
            numberValidator.validate(value3, fieldName3, options3);
            
            if (numberValidator.isFieldValid(fieldName3)) {
                console.log(`Validation errors for ${fieldName3}:`, numberValidator.getFieldErrors());
                // Output: Validation errors for price: { price: "The value 10.5 must be a multiple of 1." }
            } else {
                console.log(`${fieldName3} is valid.`);
            }
            
            // Example 4: Invalid number input
            let value4 = "abc";
            let fieldName4 = "id";
            numberValidator.validate(value4, fieldName4);
            
            if (numberValidator.isFieldValid(fieldName4)) {
                console.log(`Validation errors for ${fieldName4}:`, numberValidator.getFieldErrors());
                // Output: Validation errors for id: { id: "Please enter a valid number." }
            }
            
```

### Parameters for `numberValidator`:

-   `val` (`string | number`): The input value to be validated. It can
    be a string (which will be parsed to a float) or a number.
-   `targetInputname` (`string`): The name of the input field, used for
    error reporting.
-   `options_number` (`NumberOptions`, optional): An object containing
    the validation rules for the number. This can include:
    -   `min?: number`: The minimum allowed numeric value.
    -   `max?: number`: The maximum allowed numeric value.
    -   `step?: number`: The allowed increment/decrement step for the
        number.
    -   `regexValidator?: RegExp`: An optional regular expression to
        validate the string representation of the number.

The method returns the current instance of \`NumberInputValidator\`,
allowing for method chaining.
:::

::: {#DateInputValidator .section}
# Class `DateInputValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`DateInputValidator\` class is designed to validate date inputs,
ensuring they adhere to specified formats, ranges, and temporal
constraints (future/past dates). It extends \`FormError\` for consistent
error management and implements \`DateInputValidatorInterface\`. This
validator also follows the \*\*singleton pattern\*\*, providing a
single, globally accessible instance for efficient date validation.

\-\--

## Key Features:

-   **Singleton Pattern:** Ensures a unique instance for centralized
    date validation.
-   **Format Validation:** Validates the input date string against a
    specified format (e.g., \'YYYY/MM/DD\', \'DD-MM-YYYY\').
-   **Strict Mode:** Enforces exact length matching with the format for
    stricter validation.
-   **Delimiter Detection:** Automatically detects common date
    delimiters (e.g., \'/\', \'-\').
-   **Date Range Validation:** Checks if the date falls within a
    specified minimum (\`minDate\`) and maximum (\`maxDate\`).
-   **Future/Past Date Restrictions:** Allows or disallows dates in the
    future or past relative to the current date.
-   **Two-Digit Year Handling:** Intelligently interprets two-digit
    years (e.g., \'99\' as 1999, \'25\' as 2025).
-   **Inherited Error Management:** Leverages the error handling
    capabilities of \`FormError\` for clear reporting.

\-\--

## Usage:

To validate a date input, first get the singleton instance of
\`DateInputValidator\`. Then, call the \`dateValidator\` method,
providing the date input (string or Date object), its field name, and an
optional \`DateInputOptions\` object to define specific validation
rules.

### Getting an Instance:

``` typescript
import { dateInputValidator as dateValidator} from './path/to/DateInputValidator';
            
           
            
```

### Validating a Date Input:

``` typescript
import { dateInputOptions as dateValidator } from './path/to/YourOptionsInterface'; // Adjust path
            
            // Example 1: Basic date validation with default format
            let date1 = "2023/10/26";
            let fieldName1 = "eventDate";
            dateValidator.validate(date1, fieldName1);
            
            if (dateValidator.isFieldValid(fieldName1)) {
                console.log(`Validation errors for ${fieldName1}:`, dateValidator.getFieldErrors());
            } else {
                console.log(`${fieldName1} is valid.`); // Output: eventDate is valid.
            }
            
            // Example 2: Date with a custom format and strict mode
            let date2 = "01-15-2024";
            let fieldName2 = "birthDate";
            const options2: DateInputOptions = {
                format: 'MM-DD-YYYY',
                strictMode: true,
                delimiters: ['-'],
                maxDate: new Date('2024-01-01') // Birth date should be before 2024
            };
            dateValidator.validate(date2, fieldName2, options2);
            
            if (dateValidator.isFieldValid(fieldName2)) {
                console.log(`Validation errors for ${fieldName2}:`, dateValidator.getFieldErrors());
                // Output: Validation errors for birthDate: { birthDate: "The date must be before Tue Jan 01 2024..." }
            } else {
                console.log(`${fieldName2} is valid.`);
            }
            
            // Example 3: Disallowing future dates
            let futureDate = new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0]; // Jan 1st next year
            let fieldName3 = "registrationDate";
            const options3: DateInputOptions = { allowFuture: false };
            dateValidator.validate(futureDate, fieldName3, options3);
            
            if (dateValidator.isFieldValid(fieldName3)) {
                console.log(`Validation errors for ${fieldName3}:`, dateValidator.getFieldErrors());
                // Output: Validation errors for registrationDate: { registrationDate: "The date "YYYY-MM-DD" cannot be in the future." }
            } else {
                console.log(`${fieldName3} is valid.`);
            }
            
            // Example 4: Invalid date string
            let date4 = "2023/13/01"; // Invalid month
            let fieldName4 = "invalidDate";
            dateValidator.dateValidator(date4, fieldName4);
            
            if (dateValidator.isFieldValid(fieldName4)) {
                console.log(`Validation errors for ${fieldName4}:`, dateValidator.  getFieldErrors());
                // Output: Validation errors for invalidDate: { invalidDate: "Invalid date created from input." }
            }
            
```

### Parameters for `dateValidator`:

-   `date_input` (`string | Date`): The date value to be validated. It
    can be a string (which will be parsed according to the format) or a
    JavaScript \`Date\` object.
-   `targetInputname` (`string`): The name of the input field, used for
    error reporting.
-   `date_options` (`DateInputOptions`, optional): An object containing
    the validation rules for the date. This can include:
    -   `format?: string`: The expected format of the date string (e.g.,
        \'YYYY/MM/DD\', \'DD-MM-YYYY\'). Defaults to \'YYYY/MM/DD\'.
    -   `strictMode?: boolean`: If \`true\`, the input date string must
        exactly match the length of the \`format\` string.
    -   `delimiters?: string[]`: An array of possible delimiters used in
        the date string. Defaults to \`\[\'/\', \'-\'\]\`.
    -   `minDate?: Date`: The earliest allowed date.
    -   `maxDate?: Date`: The latest allowed date.
    -   `allowFuture?: boolean`: If \`false\`, dates in the future are
        not allowed.
    -   `allowPast?: boolean`: If \`false\`, dates in the past are not
        allowed.

The method returns the current instance of \`DateInputValidator\`,
allowing for method chaining.
:::

::: {#TelInputValidator .section}
# Class `TelInputValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`TelInputValidator\` class is designed to validate telephone
numbers, ensuring they adhere to international formatting standards and
optional length constraints. It leverages the \`libphonenumber-js\`
library for robust parsing and validation. This class extends
\`FormError\` for consistent error management and implements
\`TelInputValidatorInterface\`. Following the \*\*singleton pattern\*\*,
it provides a single, globally accessible instance for efficient phone
number validation.

\-\--

## Key Features:

-   **Singleton Pattern:** Ensures a unique instance for centralized
    phone number validation.
-   **International Format Enforcement:** Requires phone numbers to
    start with a \'+\' for international dialing codes.
-   **\`libphonenumber-js\` Integration:** Utilizes a powerful external
    library for accurate phone number parsing, validation, and
    formatting.
-   **Default Country Configuration:** Allows specifying a default
    country for numbers that might not include an explicit country code.
-   **Automatic Formatting (with jQuery):** If jQuery is present, it can
    automatically format the input field to an international standard
    format.
-   **Length and Required Input Validation:** Integrates with
    \`TextInputValidator\` for basic length checks and required field
    validation.
-   **Comprehensive Error Handling:** Provides specific error messages
    for invalid formats, parsing issues, and general validation
    failures.
-   **Inherited Error Management:** Leverages the error handling
    capabilities of \`FormError\` for clear reporting.

\-\--

## Usage:

To validate a telephone number, first get the singleton instance of
\`TelInputValidator\`. Then, call the \`telValidator\` method, providing
the phone number string, its field name, and a \`TelInputOptions\`
object to define specific validation rules and default behaviors.

### Getting an Instance:

``` typescript
import { telInputValidator as telValidator} from '@wlindabla/form_validator';
            
           
            
```

### Validating a Telephone Number:

``` typescript
import { TelInputOptions } from '@wlindabla/form_validator'; // Adjust path
            
            // Example 1: Validating an international phone number with a default country
            let phoneNumber1 = "+12125550100"; // US number
            let fieldName1 = "userPhone";
            const options1: TelInputOptions = {
                defaultCountry: 'US',
                egAwait: '+1 (212) 555-0100' // Example for error messages
            };
            telValidator.validate(phoneNumber1, fieldName1, options1);
            
            if (telValidator. isFieldValid(fieldName1)) {
                console.log(`Validation errors for ${fieldName1}:`, telValidator.getFieldErrors());
            } else {
                console.log(`${fieldName1} is valid.`); // Output: userPhone is valid.
                // If jQuery is loaded, the input field named "userPhone" might be updated to "+1 212-555-0100"
            }
            
            // Example 2: Invalid phone number (missing '+')
            let phoneNumber2 = "22997000000";
            let fieldName2 = "contactPhone";
            const options2: TelInputOptions = {
                defaultCountry: 'BJ', // Benin
                errorMessageInput: "Please provide a valid Benin phone number."
            };
            telValidator.telValidator(phoneNumber2, fieldName2, options2);
            
            if (telValidator. isFieldValid(fieldName2)) {
                console.log(`Validation errors for ${fieldName2}:`, telValidator.getFieldErrors());
                // Output: Validation errors for contactPhone: { contactPhone: "Please enter a valid international number starting with '+' or select a country code." }
            }
            
            // Example 3: Invalid phone number format or non-existent number for the country
            let phoneNumber3 = "+229123"; // Too short for Benin
            let fieldName3 = "mobile";
            const options3: TelInputOptions = {
                defaultCountry: 'BJ',
                egAwait: '+229 01 67 25 18 86'
            };
            telValidator.telValidator(phoneNumber3, fieldName3, options3);
            
            if (telValidator.isFieldValid(fieldName3)) {
                console.log(`Validation errors for ${fieldName3}:`, telValidator.getFieldErrors());
                // Output: Validation errors for mobile: { mobile: "Invalid phone number. e.g. +229 01 67 25 18 86" }
            }
            
```

### Parameters for `validate`:

-   `data_tel` (`string`): The telephone number string to be validated.
-   `targetInputname` (`string`): The name of the input field, used for
    error reporting.
-   `optionsinputTel` (`TelInputOptions`): An object containing the
    validation rules and configuration for the phone number. This
    includes:
    -   `defaultCountry?: string`: An optional ISO 2-letter country code
        (e.g., \'US\', \'BJ\') to use as the default if the number does
        not include an explicit country code. This is crucial for
        \`libphonenumber-js\` to correctly parse local numbers.
    -   `egAwait?: string`: An example of an expected valid phone number
        format, displayed in error messages.
    -   `errorMessageInput?: string`: A custom error message to use if
        general phone number validation fails.
    -   `minLength?: number`: The minimum allowed length of the phone
        number string.
    -   `maxLength?: number`: The maximum allowed length of the phone
        number string.
    -   `requiredInput?: boolean`: If \`true\`, the field cannot be
        empty.

The method returns the current instance of \`TelInputValidator\`,
allowing for method chaining.
:::

::: {#FQDNInputValidator .section}
# Class `FQDNInputValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`FQDNInputValidator\` class is dedicated to validating Fully
Qualified Domain Names (FQDNs), ensuring they conform to standard DNS
naming conventions and additional configurable rules. This class extends
\`FormError\` for consistent error management and implements
\`FQDNInputValidatorInterface\`. Like other validators in this library,
it follows the \*\*singleton pattern\*\*, providing a single, globally
accessible instance for efficient FQDN validation.

\-\--

## Key Features:

-   **Singleton Pattern:** Ensures a unique instance for centralized
    FQDN validation.
-   **TLD (Top-Level Domain) Requirements:** Can enforce the presence
    and validity of a TLD, including support for internationalized TLDs.
-   **Character Restrictions:** Checks for invalid characters,
    full-width characters, and labels starting or ending with hyphens.
-   **Length Constraints:** Validates that each domain label does not
    exceed 63 characters.
-   **Configurable Rules:** Allows enabling or disabling specific rules
    such as:
    -   \`requireTLD\`: Whether a TLD is mandatory.
    -   \`allowedUnderscores\`: Whether underscores are permitted (not
        typically valid in DNS).
    -   \`allowTrailingDot\`: Whether a trailing dot is allowed.
    -   \`allowNumericTld\`: Whether purely numeric TLDs are permitted.
    -   \`allowWildcard\`: Whether wildcard domains (e.g.,
        \`\*.example.com\`) are allowed.
    -   \`ignoreMaxLength\`: Whether to bypass the 63-character label
        length check.
-   **HTML Escaping:** Automatically escapes HTML tags to prevent
    potential XSS issues.
-   **Inherited Error Management:** Leverages the error handling
    capabilities of \`FormError\` for clear reporting.

\-\--

## Usage:

To validate an FQDN, first get the singleton instance of
\`FQDNInputValidator\`. Then, call the \`fqdnValidator\` method,
providing the FQDN string, its field name, and an \`FQDNOptions\` object
to define specific validation rules.

### Getting an Instance:

``` typescript
import { fqdnInputValidator as fqdnValidator} from '@wlindabla/form_validator';
            
            
```

### Validating an FQDN:

``` typescript
import { FQDNOptions } from '@wlindabla/form_validator'; // Adjust path
            
            // Example 1: Basic valid FQDN
            let domain1 = "www.example.com";
            let fieldName1 = "website";
            const options1: FQDNOptions = {}; // Use default options
            await fqdnValidator.validate(domain1, fieldName1, options1);
            
            if (fqdnValidator.isFieldValid(fieldName1)) {
                console.log(`Validation errors for ${fieldName1}:`, fqdnValidator.getFieldErrors());
            } else {
                console.log(`${fieldName1} is valid.`); // Output: website is valid.
            }
            
            // Example 2: FQDN with an invalid TLD (numeric TLD not allowed by default)
            let domain2 = "example.123";
            let fieldName2 = "testDomain";
            const options2: FQDNOptions = { allowNumericTld: false }; // Explicitly disallow numeric TLDs
            await fqdnValidator.fqdnValidator(domain2, fieldName2, options2);
            
            if (fqdnValidator.isFieldValid(fieldName2)) {
                console.log(`Validation errors for ${fieldName2}:`, fqdnValidator.getFieldErrors());
                // Output: Validation errors for testDomain: { testDomain: "example.123 must not use a numeric TLD." }
            }
            
            // Example 3: FQDN with underscore (not allowed by default)
            let domain3 = "my_site.example.com";
            let fieldName3 = "subdomain";
            const options3: FQDNOptions = { allowedUnderscores: false };
            await fqdnValidator.fqdnValidator(domain3, fieldName3, options3);
            
            if (fqdnValidator.isFieldValid(fieldName3)) {
                console.log(`Validation errors for ${fieldName3}:`, fqdnValidator.getFieldErrors());
                // Output: Validation errors for subdomain: { subdomain: "my_site.example.com must not contain underscores." }
            }
            
            // Example 4: FQDN with wildcard allowed
            let domain4 = "*.dev.example.com";
            let fieldName4 = "wildcardDomain";
            const options4: FQDNOptions = { allowWildcard: true };
            await fqdnValidator.fqdnValidator(domain4, fieldName4, options4);
            
            if (fqdnValidator.isFieldValid(fieldName4)) {
                console.log(`Validation errors for ${fieldName4}:`, fqdnValidator.getFieldErrors());
            } else {
                console.log(`${fieldName4} is valid.`); // Output: wildcardDomain is valid.
            }
            
```

### Parameters for `validate`:

-   `input` (`string`): The FQDN string to be validated.
-   `targetInputname` (`string`): The name of the input field, used for
    error reporting.
-   `fqdnOptions` (`FQDNOptions`): An object containing the validation
    rules for the FQDN. This includes:
    -   `requireTLD?: boolean`: If \`true\`, the FQDN must include a
        top-level domain (e.g., \'.com\', \'.org\'). Defaults to
        \`true\`.
    -   `allowedUnderscores?: boolean`: If \`true\`, underscores are
        allowed in domain labels. Defaults to \`false\`.
    -   `allowTrailingDot?: boolean`: If \`true\`, a trailing dot at the
        end of the FQDN is permitted. Defaults to \`false\`.
    -   `allowNumericTld?: boolean`: If \`true\`, purely numeric TLDs
        (e.g., \'example.123\') are allowed. Defaults to \`false\`.
    -   `allowWildcard?: boolean`: If \`true\`, a leading wildcard
        character (\'\*.\') is allowed. Defaults to \`false\`.
    -   `ignoreMaxLength?: boolean`: If \`true\`, bypasses the check for
        individual domain label lengths (max 63 characters). Defaults to
        \`false\`.
-   `ignoreMergeWithDefaultOptions` (`boolean`, optional): If \`true\`,
    default options will not be merged with provided \`fqdnOptions\`.
    Defaults to \`false\`.

The method returns a Promise that resolves to the current instance of
\`FQDNInputValidator\`, allowing for asynchronous operations and method
chaining.
:::

::: {#EmailInputValidator .section}
# Class `EmailInputValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`EmailInputValidator\` class is a robust tool for validating email
addresses, adhering to various standards (RFC 5322, RFC 6531 for UTF-8)
and offering extensive customization. It extends \`FormError\` for
integrated error handling and implements
\`EmailInputValidatorInterface\`. This class follows the \*\*singleton
pattern\*\* to ensure a single, efficient instance for all email
validation needs across your application.

\-\--

## Key Features:

-   **Singleton Pattern:** Provides a unique instance for centralized
    email validation.
-   **Comprehensive Validation:** Checks email format, local part,
    domain part, and overall length.
-   **Display Name Support:** Can validate and optionally require
    display names (e.g., \"John Doe\" \<john@example.com\>).
-   **Domain Validation:**
    -   Integrates with \`FQDNInputValidator\` for strict Fully
        Qualified Domain Name validation.
    -   Supports IP address domains (e.g., \`user@\[192.168.1.1\]\`)
        with an optional flag.
    -   Allows host blacklisting and whitelisting for domain control.
-   **Local Part Validation:**
    -   Supports standard local parts (e.g., \`user.name\`).
    -   Handles quoted local parts (e.g., \`\"user.name\"\`).
    -   Allows UTF-8 characters in the local part for international
        email addresses.
    -   Can blacklist specific characters in the local part.
-   **Length Constraints:** Validates overall email length, as well as
    separate lengths for local and domain parts (up to 64 and 254
    characters respectively).
-   **HTML Escaping:** Automatically escapes HTML tags in the input to
    prevent XSS vulnerabilities.
-   **Inherited Error Management:** Leverages the robust error handling
    of \`FormError\` for clear and precise feedback.

\-\--

## Usage:

To validate an email address, get the singleton instance of
\`EmailInputValidator\`. Then, call the \`emailValidator\` method,
providing the email string, its field name, and an \`EmailInputOptions\`
object to define specific validation rules.

### Getting an Instance:

``` typescript
import { emailInputValidator as emailValidator} from '@wlindabla/form_validator';
            
            
```

### Validating an Email Address:

``` typescript
import { EmailInputOptions } from '@wlindabla/form_validator'; // Adjust path
            
            // Example 1: Basic valid email
            let email1 = "test@example.com";
            let fieldName1 = "userEmail";
            const options1: EmailInputOptions = {}; // Use default options
            await emailValidator.validate(email1, fieldName1, options1);
            
            if (emailValidator.isFieldValid(fieldName1)) {
                console.log(`Validation errors for ${fieldName1}:`, emailValidator.getFieldErrors());
            } else {
                console.log(`${fieldName1} is valid.`); // Output: userEmail is valid.
            }
            
            // Example 2: Email with display name required (but not provided)
            let email2 = "no-display-name@example.com";
            let fieldName2 = "contactEmail";
            const options2: EmailInputOptions = { requireDisplayName: true };
            await emailValidator.validate(email2, fieldName2, options2);
            
            if (emailValidator.isFieldValid(fieldName2)) {
                console.log(`Validation errors for ${fieldName2}:`, emailValidator.getFieldErrors());
                // Output: { contactEmail: "contactEmail field must include a display name like "John Doe "" }
            }
            
            // Example 3: Email with display name provided and valid
            let email3 = "John Doe ";
            let fieldName3 = "userAccountEmail";
            const options3: EmailInputOptions = { allowDisplayName: true };
            await emailValidator.validate(email3, fieldName3, options3);
            
            if (emailValidator.isFieldValid(fieldName3)) {
                console.log(`Validation errors for ${fieldName3}:`, emailValidator.getFieldErrors());
            } else {
                console.log(`${fieldName3} is valid.`); // Output: userAccountEmail is valid.
            }
            
            // Example 4: Email with a blacklisted host
            let email4 = "user@tempmail.com";
            let fieldName4 = "registrationEmail";
            const options4: EmailInputOptions = { hostBlacklist: ['tempmail.com', 'mailinator.com'] };
            await emailValidator.emailValidator(email4, fieldName4, options4);
            
            if (emailValidator.isFieldValid(fieldName4)) {
                console.log(`Validation errors for ${fieldName4}:`, emailValidator.getFieldErrors());
                // Output: { registrationEmail: "registrationEmail field contains a blacklisted domain: "tempmail.com"." }
            }
            
            // Example 5: Email with an IP domain (allowed)
            let email5 = "admin@[192.168.1.1]";
            let fieldName5 = "serverEmail";
            const options5: EmailInputOptions = { allowIpDomain: true };
            await emailValidator.emailValidator(email5, fieldName5, options5);
            
            if (emailValidator.isFieldValid(fieldName5)) {
                console.log(`Validation errors for ${fieldName5}:`, emailValidator.getFieldErrors());
            } else {
                console.log(`${fieldName5} is valid.`); // Output: serverEmail is valid.
            }
            
```

### Parameters for `validate`:

-   `datainput` (`string`): The email address string to be validated.
-   `targetInputname` (`string`): The name of the input field, used for
    error reporting.
-   `optionsinputemail` (`EmailInputOptions`): An object containing the
    validation rules and configuration for the email address. This
    includes:
    -   `allowUtf8LocalPart?: boolean`: If \`true\`, allows UTF-8
        characters in the local part of the email address. Defaults to
        \`true\`.
    -   `allowIpDomain?: boolean`: If \`true\`, allows IP addresses as
        the domain part (e.g., \`user@\[192.168.1.1\]\`). Defaults to
        \`true\`.
    -   `allowQuotedLocal?: boolean`: If \`true\`, allows the local part
        to be enclosed in double quotes (e.g.,
        \`\"first.last\"@example.com\`). Defaults to \`true\`.
    -   `ignoreMaxLength?: boolean`: If \`true\`, bypasses the default
        max length checks for the entire email (254 chars), local part
        (64 chars), and domain part (254 chars). Defaults to \`false\`.
    -   `hostBlacklist?: string[]`: An array of domain names that are
        not allowed.
    -   `hostWhitelist?: string[]`: An array of domain names that are
        exclusively allowed. If provided, any domain not in this list
        will be rejected.
    -   `blacklistedChars?: string`: A string of characters that are
        forbidden in the local part of the email.
    -   `requireDisplayName?: boolean`: If \`true\`, the email must
        include a display name (e.g., \"John Doe\"
        \<john@example.com\>). Defaults to \`false\`.
    -   `allowDisplayName?: boolean`: If \`true\`, allows an optional
        display name. Defaults to \`false\`.
    -   Any other options inherited from \`FQDNInputValidator\` (e.g.,
        \`requireTLD\`, \`allowedUnderscores\`).

The method returns a Promise that resolves to the current instance of
\`EmailInputValidator\`, allowing for asynchronous operations and method
chaining.
:::

::: {#URLInputValidator .section}
# Class `URLInputValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`URLInputValidator\` class is designed for comprehensive validation
of URLs, ensuring they conform to standard formatting, protocol
requirements, host restrictions, and various other configurable
criteria. It extends \`FormError\` for integrated error handling and
implements \`URLInputValidatorInterface\`. Following the \*\*singleton
pattern\*\*, this class provides a single, globally accessible instance
for efficient and consistent URL validation across your application.

\-\--

## Key Features:

-   **Singleton Pattern:** Ensures a unique instance for centralized URL
    validation.
-   **Basic Format Check:** Quickly rejects inputs with invalid
    characters or common non-URL patterns (e.g., \`mailto:\`).
-   **Protocol Validation:** Can enforce the presence of a protocol,
    require a valid protocol, and restrict to a list of allowed
    protocols (e.g., \`http\`, \`https\`, \`ftp\`).
-   **Host Validation:**
    -   Requires a hostname by default.
    -   Integrates with \`FQDNInputValidator\` for strict hostname
        validation (including TLD checks, length, invalid characters).
    -   Can disallow \`localhost\` and IP addresses as hosts.
    -   Supports host blacklisting and whitelisting.
-   **Port, Query, and Fragment Control:**
    -   Can require a port to be present.
    -   Allows or disallows query parameters (\`?key=value\`).
    -   Allows or disallows URL fragments (\`#section\`).
-   **Authentication Disallowance:** Can prevent URLs containing
    username and password (e.g., \`http://user:pass@example.com\`).
-   **Protocol-Relative URL Handling:** Can disallow URLs starting with
    \`//\` (protocol-relative).
-   **Length Constraints:** Validates overall URL length with
    configurable minimum and maximum limits.
-   **HTML Escaping:** Automatically escapes HTML tags in the URL to
    prevent XSS vulnerabilities.
-   **Custom Regular Expression:** Allows applying a custom regex for
    specific URL patterns.
-   **Inherited Error Management:** Leverages the robust error handling
    of \`FormError\` for clear and precise feedback.

\-\--

## Usage:

To validate a URL, get the singleton instance of \`URLInputValidator\`.
Then, call the \`urlValidator\` method, providing the URL string, its
field name, and a \`URLOptions\` object to define specific validation
rules.

### Getting an Instance:

``` typescript
import {urlInputValidator as urlValidator } from '@wlindabla/form_validator';
            
          
            
```

### Validating a URL:

``` typescript
import { URLOptions } from '@wlindabla/form_validator'; // Adjust path
            
            // Example 1: Basic valid URL
            let url1 = "https://www.example.com";
            let fieldName1 = "websiteUrl";
            const options1: URLOptions = {}; // Use default options
            await urlValidator.validate(url1, fieldName1, options1);
            
            if (urlValidator.isFieldValid(fieldName1)) {
                console.log(`Validation errors for ${fieldName1}:`, urlValidator.getFieldErrors());
            } else {
                console.log(`${fieldName1} is valid.`); // Output: websiteUrl is valid.
            }
            
            // Example 2: URL requiring protocol and specific allowed protocols
            let url2 = "ftp://fileserver.net/docs";
            let fieldName2 = "fileServerUrl";
            const options2: URLOptions = {
                requireProtocol: true,
                requireValidProtocol: true,
                allowedProtocols: ["ftp"]
            };
            await urlValidator.validate(url2, fieldName2, options2);
            
            if (urlValidator.isFieldValid(fieldName2)) {
                console.log(`Validation errors for ${fieldName2}:`, urlValidator.getFieldErrors());
            } else {
                console.log(`${fieldName2} is valid.`); // Output: fileServerUrl is valid.
            }
            
            // Example 3: URL disallowing IP addresses and query parameters
            let url3 = "http://192.168.1.1/dashboard?user=admin";
            let fieldName3 = "internalToolUrl";
            const options3: URLOptions = {
                allowIP: false,
                allowQueryParams: false
            };
            await urlValidator.validate(url3, fieldName3, options3);
            
            if (urlValidator.isFieldValid(fieldName3)) {
                console.log(`Validation errors for ${fieldName3}:`, urlValidator.getFieldErrors());
                // Output might include: "IP addresses (IPv4 or IPv6) are not allowed in URLs." and "Query parameters "?user=admin" are not allowed."
            }
            
            // Example 4: URL with a blacklisted host
            let url4 = "https://evil.com/malware";
            let fieldName4 = "downloadLink";
            const options4: URLOptions = {
                hostBlacklist: ['evil.com', 'phishing.net']
            };
            await urlValidator.validate(url4, fieldName4, options4);
            
            if (urlValidator.isFieldValid(fieldName4)) {
                console.log(`Validation errors for ${fieldName4}:`, urlValidator.getFieldErrors());
                // Output: { downloadLink: "The hostname "evil.com" is blacklisted." }
            }
            
```

### Parameters for `validate`:

-   `urlData` (`string`): The URL string to be validated.
-   `targetInputname` (`string`): The name of the input field, used for
    error reporting.
-   `url_options` (`URLOptions`): An object containing the validation
    rules and configuration for the URL. This includes:
    -   `allowLocalhost?: boolean`: If \`true\`, \`localhost\` and
        \`127.0.0.1\` are allowed as hostnames. Defaults to \`false\`.
    -   `allowIP?: boolean`: If \`true\`, IP addresses (IPv4 or IPv6)
        are allowed as hostnames. Defaults to \`false\`.
    -   `allowHash?: boolean`: If \`true\`, URL fragments (\`#\`) are
        allowed. Defaults to \`true\`.
    -   `allowQueryParams?: boolean`: If \`true\`, query parameters
        (\`?\`) are allowed. Defaults to \`true\`.
    -   `requirePort?: boolean`: If \`true\`, the URL must include a
        port number. Defaults to \`false\`.
    -   `requireHost?: boolean`: If \`true\`, a hostname must be present
        in the URL. Defaults to \`true\`.
    -   `maxAllowedLength?: number`: The maximum allowed length for the
        entire URL string. Defaults to \`2048\`.
    -   `validateLength?: boolean`: If \`true\`, performs length
        validation on the URL. Defaults to \`true\`.
    -   `regexValidator?: RegExp`: A custom regular expression to apply
        for overall URL validation.
    -   `allowProtocolRelativeUrls?: boolean`: If \`true\`, URLs
        starting with \`//\` (e.g., \`//example.com\`) are allowed.
        Defaults to \`false\`.
    -   `requireValidProtocol?: boolean`: If \`true\`, the URL must use
        one of the \`allowedProtocols\`. Defaults to \`true\`.
    -   `requireProtocol?: boolean`: If \`true\`, a protocol must be
        present in the URL (e.g., \`http://\`). Defaults to \`false\`.
    -   `allowedProtocols?: string[]`: An array of allowed protocols
        (e.g., \`\[\"http\", \"https\"\]\`). Defaults to \`\[\"ftp\",
        \"https\", \"http\"\]\`.
    -   `disallowAuth?: boolean`: If \`true\`, URLs with embedded
        authentication (username:password) are not allowed. Defaults to
        \`false\`.
    -   `hostBlacklist?: string[]`: An array of hostnames that are not
        allowed.
    -   `hostWhitelist?: string[]`: An array of hostnames that are
        exclusively allowed. If provided, any host not in this list will
        be rejected.
    -   Any other options inherited from \`FQDNInputValidator\` (e.g.,
        \`ignoreMaxLength\`, \`allowTrailingDot\`,
        \`allowedUnderscores\`, \`allowNumericTld\`, \`allowWildcard\`).

The method returns a Promise that resolves to the current instance of
\`URLInputValidator\`, allowing for asynchronous operations and method
chaining.
:::

::: {#ChoiceInputValidator .section}
# Class `ChoiceInputValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`ChoiceInputValidator\` class is designed to validate inputs from
selection-based fields such as dropdowns, checkboxes, and radio buttons.
It ensures that chosen values are among the allowed options and enforces
various constraints like minimum/maximum selections for checkboxes. It
extends \`FormError\` for consistent error management and implements
\`ChoiceInputValidatorInterface\`. This class follows the \*\*singleton
pattern\*\*, providing a single, globally accessible instance for
efficient choice input validation.

\-\--

## Key Features:

-   **Singleton Pattern:** Ensures a unique instance for centralized
    choice input validation.
-   **Select/Dropdown Validation:** Verifies if a single selected value
    (or multiple selected values) is present in a predefined list of
    allowed options.
-   **Checkbox Group Validation:**
    -   Ensures a minimum and/or maximum number of checkboxes are
        selected within a group.
    -   Can enforce that at least one checkbox is selected if required.
    -   Validates that selected checkbox values are within a predefined
        list of allowed options.
-   **Radio Button Validation:** Can enforce that at least one radio
    option is selected within a group.
-   **HTML Escaping:** Automatically escapes HTML tags in input values
    to prevent XSS vulnerabilities.
-   **Comprehensive Error Messages:** Provides clear and specific error
    messages for various validation failures.
-   **Inherited Error Management:** Leverages the robust error handling
    of \`FormError\` for clear and precise feedback.

\-\--

## Usage:

To validate choice inputs, first get the singleton instance of
\`ChoiceInputValidator\`. Then, use the appropriate method
(\`selectValidator\`, \`checkboxValidator\`, or \`radioValidator\`)
based on the type of input you are validating.

### Getting an Instance:

``` typescript
import { ChoiceInputValidator } from '@wlindabla/form_validator';
            
            const choiceValidator = ChoiceInputValidator.getInstance();
            
```

### Validating a Select (Dropdown) Input:

``` typescript
import { SelectOptions } from '@wlindabla/form_validator'; // Adjust path
            
            // Example 1: Single select - valid
            let selectedValue1 = "optionA";
            let fieldName1 = "myDropdown";
            const selectOptions1: SelectOptions = {
                optionsChoices: ["optionA", "optionB", "optionC"]
            };
            choiceValidator.selectValidator(selectedValue1, fieldName1, selectOptions1);
            
            if (choiceValidator. isFieldValid(fieldName1)) {
                console.log(`Validation errors for ${fieldName1}:`, choiceValidator.  getFieldErrors());
            } else {
                console.log(`${fieldName1} is valid.`); // Output: myDropdown is valid.
            }
            
            // Example 2: Single select - invalid value
            let selectedValue2 = "optionD";
            let fieldName2 = "myDropdown";
            const selectOptions2: SelectOptions = {
                optionsChoices: ["optionA", "optionB", "optionC"]
            };
            choiceValidator.selectValidator(selectedValue2, fieldName2, selectOptions2);
            
            if (choiceValidator. isFieldValid(fieldName2)) {
                console.log(`Validation errors for ${fieldName2}:`, choiceValidator.  getFieldErrors());
                // Output: { myDropdown: "The selected value "optionD" is not included in the available options: optionA | optionB | optionC" }
            }
            
            // Example 3: Multi-select - valid
            let selectedValues3 = ["optionA", "optionC"];
            let fieldName3 = "multiSelect";
            const selectOptions3: SelectOptions = {
                optionsChoices: ["optionA", "optionB", "optionC"]
            };
            choiceValidator.selectValidator(selectedValues3, fieldName3, selectOptions3);
            
            if (choiceValidator. isFieldValid(fieldName3)) {
                console.log(`Validation errors for ${fieldName3}:`, choiceValidator.  getFieldErrors());
            } else {
                console.log(`${fieldName3} is valid.`); // Output: multiSelect is valid.
            }
            
```

### Validating a Checkbox Group:

``` typescript
import { OptionsCheckbox } from '@wlindabla/form_validator'; // Adjust path
            
            // Example 1: Checkbox group - required and within min/max
            let checkedCount1 = 2; // User checked 2 options
            let groupName1 = "interests";
            const checkboxOptions1: OptionsCheckbox = {
                required: true,
                minAllowed: 1,
                maxAllowed: 3,
                optionsChoicesCheckbox: ["sports", "music", "reading", "coding"],
                dataChoices: ["sports", "music"] // Values actually checked by user
            };
            choiceValidator.checkboxValidator(checkedCount1, groupName1, checkboxOptions1);
            
            if (choiceValidator. isFieldValid(groupName1)) {
                console.log(`Validation errors for ${groupName1}:`, choiceValidator.  getFieldErrors());
            } else {
                console.log(`${groupName1} is valid.`); // Output: interests is valid.
            }
            
            // Example 2: Checkbox group - not enough selected
            let checkedCount2 = 0;
            let groupName2 = "colors";
            const checkboxOptions2: OptionsCheckbox = {
                required: true,
                minAllowed: 1,
                optionsChoicesCheckbox: ["red", "blue", "green"],
                dataChoices: [] // Nothing checked
            };
            choiceValidator.checkboxValidator(checkedCount2, groupName2, checkboxOptions2);
            
            if (choiceValidator. isFieldValid(groupName2)) {
                console.log(`Validation errors for ${groupName2}:`, choiceValidator.  getFieldErrors());
                // Output: { colors: "Please select at least one option in the "colors" group." }
            }
            
            // Example 3: Checkbox group - too many selected
            let checkedCount3 = 4;
            let groupName3 = "hobbies";
            const checkboxOptions3: OptionsCheckbox = {
                maxAllowed: 3,
                optionsChoicesCheckbox: ["painting", "gaming", "hiking", "cooking", "traveling"],
                dataChoices: ["painting", "gaming", "hiking", "cooking"]
            };
            choiceValidator.checkboxValidator(checkedCount3, groupName3, checkboxOptions3);
            
            if (choiceValidator. isFieldValid(groupName3)) {
                console.log(`Validation errors for ${groupName3}:`, choiceValidator.  getFieldErrors());
                // Output: { hobbies: "You can only select up to 3 options in the "hobbies" group." }
            }
            
```

### Validating a Radio Button Group:

``` typescript
import { OptionsRadio } from './path/to/YourOptionsInterface'; // Adjust path
            
            // Example 1: Radio group - valid selected
            let selectedValueRadio1 = "yes";
            let groupNameRadio1 = "consent";
            const radioOptions1: OptionsRadio = { required: true };
            choiceValidator.radioValidator(selectedValueRadio1, groupNameRadio1, radioOptions1);
            
            if (choiceValidator. isFieldValid(groupNameRadio1)) {
                console.log(`Validation errors for ${groupNameRadio1}:`, choiceValidator.  getFieldErrors());
            } else {
                console.log(`${groupNameRadio1} is valid.`); // Output: consent is valid.
            }
            
            // Example 2: Radio group - required but no selection
            let selectedValueRadio2 = null;
            let groupNameRadio2 = "gender";
            const radioOptions2: OptionsRadio = { required: true };
            choiceValidator.radioValidator(selectedValueRadio2, groupNameRadio2, radioOptions2);
            
            if (choiceValidator. isFieldValid(groupNameRadio2)) {
                console.log(`Validation errors for ${groupNameRadio2}:`, choiceValidator.  getFieldErrors());
                // Output: { gender: "Please select an option in the "gender" group." }
            }
            
```

### Parameters for `selectValidator`:

-   `value_index` (`string | string[]`): The value(s) selected by the
    user from the dropdown. For single-select, it\'s a string; for
    multi-select, it\'s an array of strings.
-   `targetInputname` (`string`): The name of the select input field.
-   `options_select` (`SelectOptions`): An object defining the select
    validation rules. This includes:
    -   `optionsChoices: string[]`: An array of all allowed values for
        the select options.
    -   `escapestripHtmlAndPhpTags?: boolean`: If \`true\`, HTML and PHP
        tags are escaped/stripped from the input value(s). Defaults to
        \`true\`.

### Parameters for `checkboxValidator`:

-   `checkCount` (`number`): The number of checkboxes currently selected
    in the group.
-   `groupName` (`string`): The name of the checkbox group. This is used
    for error reporting.
-   `options_checkbox` (`OptionsCheckbox`, optional): An object defining
    the checkbox group validation rules. This includes:
    -   `minAllowed?: number`: The minimum number of checkboxes that
        must be selected.
    -   `maxAllowed?: number`: The maximum number of checkboxes that can
        be selected.
    -   `required?: boolean`: If \`true\`, at least one checkbox must be
        selected.
    -   `optionsChoicesCheckbox: string[]`: An array of all allowed
        values for the checkboxes in the group.
    -   `dataChoices: string[]`: An array of the actual values selected
        by the user.

### Parameters for `radioValidator`:

-   `selectedValue` (`string | null | undefined`): The value of the
    selected radio button, or \`null\`/\`undefined\` if none is
    selected.
-   `groupName` (`string`): The name of the radio button group. This is
    used for error reporting.
-   `options_radio` (`OptionsRadio`, optional): An object defining the
    radio button group validation rules. This includes:
    -   `required?: boolean`: If \`true\`, an option must be selected in
        the radio group.

All methods return the current instance of \`ChoiceInputValidator\`,
allowing for method chaining.
:::

::: {#ImageValidator .section}
# Class `ImageValidator`

The `ImageValidator` class is a powerful validator designed specifically
for image files. It ensures that uploaded images adhere to strict
criteria such as allowed file extensions, dimensions (width and height),
MIME types, and hexadecimal file signatures. This class is a
\*\*singleton\*\*, which guarantees that only one instance of it exists
in your application, thereby centralizing image validation logic.

It extends `AbstractMediaValidator` (which handles common media
validations like size and extensions) and implements
`MediaValidatorInterface`, ensuring compliance with defined media
validation standards.

\-\--

## Key Features:

-   **Robust Image Validation**: Checks file extensions, dimensions
    (min/max width and height), and MIME types.
-   **Disguised File Detection**: Uses hexadecimal signature validation
    to ensure the file is truly an image and not a malicious file
    disguised with an image extension.
-   **Singleton Pattern**: Guarantees centralized and efficient
    management of image validations.
-   **Integrated Error Handling**: Inherits error handling capabilities
    from its parent class, allowing for consistent error reporting.
-   **Flexibility**: Supports validation of a single file or a list of
    files.

\-\--

## Prerequisites

This class depends on the following:

-   `validateImage`: From the external \`image-validator\` library. Used
    for image MIME type validation. (Make sure to install it: \`npm
    install image-validator\`)
-   `AbstractMediaValidator`: Internal base class for media validation.
-   `MediaValidatorInterface`, `OptionsImage`: Internal interfaces
    defining the validation contract and image-specific options.

\-\--

## Protected Properties

-   `protected readonly signatureHexadecimalFormatFile: Record`:

    A read-only object that stores the starting hexadecimal signatures
    for various common image formats (JPG, PNG, GIF, BMP, WebP, SVG).
    These signatures are used to verify the true file type regardless of
    its extension.

    Example structure:

    ``` typescript
    {
                    jpg: ['ffd8ffe0', ...],
                    png: ['89504e47'],
                    // ... other formats
                }
    ```

## Private Properties

-   `private static m_instance_image_validator: ImageValidator;`: Holds
    the single instance of the \`ImageValidator\` class for the
    singleton pattern.
-   `private m_Image: Map;`: An internal \`Map\` to potentially store
    validated \`File\` objects, indexed by their file name.

\-\--

## Constructor

The constructor of the `ImageValidator` class is `private`. You cannot
directly create an instance of this class using `new ImageValidator()`.
To obtain an instance, you must use the static method `getInstance()`,
in accordance with the singleton pattern.

``` typescript
private constructor() {
                super(); // Calls the AbstractMediaValidator constructor
                this.m_Image = new Map();
            }
            
```

\-\--

## Public Static Method

### `static getInstance(): ImageValidator`

-   **Description**: This is the sole way to obtain an instance of the
    `ImageValidator` class. If an instance already exists, it is
    returned; otherwise, a new instance is created and returned.

-   **Returns**: The unique instance of `ImageValidator`.

-   **Usage**:

    ``` typescript
    const imageValidator = ImageValidator.getInstance();
                
    ```

\-\--

## Public Instance Methods

### `fileValidator(medias: File | FileList, targetInputname: string = 'photofile', optionsimg: OptionsImage = { allowedMimeTypeAccept: ['image/jpeg', 'image/png', 'image/jpg'] }): Promise`

-   **Description**: The main method to validate one or more image
    files. It orchestrates extension, size, MIME type, and dimension
    validations.
-   **Parameters**:
    -   `medias`: A single \`File\` object or a \`FileList\` (for
        multiple files) to validate.
    -   `targetInputname` (optional): The name of the file input field,
        used for error messages. Defaults to \'photofile\'.
    -   `optionsimg` (optional): An [OptionsImage](#OptionsImage) object
        specifying validation rules (e.g., \`allowedMimeTypeAccept\`,
        \`extensions\`, \`maxsizeFile\`, \`minHeight\`, \`maxWidth\`,
        etc.). Default MIME types are \`\[\'image/jpeg\', \'image/png\',
        \'image/jpg\'\]\`.
-   **Returns**: A \`Promise\` that resolves to the current
    \`ImageValidator\` instance, allowing method chaining.
-   **How it works**:
    -   Converts \`medias\` to an array of files if it\'s a
        \`FileList\`.
    -   For each file:
        -   Validates the extension (inherited from
            `AbstractMediaValidator`).
        -   Validates the size (inherited from
            `AbstractMediaValidator`).
        -   Validates the MIME type via `mimeTypeFileValidate`.
        -   Validates the file signature via `signatureFileValidate` to
            detect disguised files.
        -   If MIME and signature validations succeed, it proceeds with
            height and width validations via `heightValidate` and
            `widthValidate` (inherited from `AbstractMediaValidator`).

\-\--

## Protected Methods

### `protected async signatureFileValidate(file: File, uint8Array?: Uint8Array): Promise`

-   **Description**: Validates the file\'s hexadecimal signature to
    confirm its true file type and detect disguised files. Reads the
    beginning of the file to extract its signature and compares it with
    known signatures.
-   **Parameters**:
    -   `file`: The \`File\` object to validate.
    -   `uint8Array` (optional): A \`Uint8Array\` of the file, if
        already available (for optimization).
-   **Returns**: A \`Promise\` that resolves to a \`string\` error
    message if the signature is invalid or \`null\` if validation
    succeeds.
-   **Error Behavior**: In case of file read error or if the file is
    disguised, an error message is resolved.

### `protected async mimeTypeFileValidate(file: File, allowedMimeTypeAccept?: string[] | undefined): Promise`

-   **Description**: Validates the file\'s MIME type using the external
    \`image-validator\` library.
-   **Parameters**:
    -   `file`: The \`File\` object to validate.
    -   `allowedMimeTypeAccept` (optional): An array of allowed MIME
        types.
-   **Returns**: A \`Promise\` that resolves to a \`string\` error
    message if the MIME type is invalid or \`null\` if validation
    succeeds.
-   **Note**: This method is more generic for MIME types, while
    \`signatureFileValidate\` focuses on detecting disguised files based
    on binary signature.

### `protected getContext(): string`

-   **Description**: Protected method inherited from
    `AbstractMediaValidator`. It is implemented here to return the
    specific validation context (in this case, \'image\').
-   **Returns**: The string \`\'image\'\`.

### `protected getFileDimensions(file: File) Promise <{ width: number; height: number; }>`{.language-typescript}

-   **Description**: Protected method inherited from
    `AbstractMediaValidator`. This image-specific implementation loads
    the image file into an \`Image\` object to extract its actual
    dimensions.
-   **Parameters**:
    -   `file`: The \`File\` object of the image.
-   **Returns**: A \`Promise\` that resolves to an object \`{ width:
    number; height: number; }\` containing the image\'s dimensions. It
    rejects in case of an image loading error.

\-\--

## Private Methods

### `private detecteMimetype(hexasignatureFile: string, uint8Array: Uint8Array): string | null`{.language-typescript}

-   **Description**: This internal function determines the true MIME
    type of an image file based on its hexadecimal signature. For SVGs,
    it checks the initial textual content.
-   **Parameters**:
    -   `hexasignatureFile`: The hexadecimal signature string from the
        beginning of the image file.
    -   `uint8Array`: The \`Uint8Array\` of the file, necessary for SVG
        detection.
-   **Returns**: A string representing the detected MIME type (e.g.,
    \'image/jpeg\', \'image/png\') or \`null\` if the type cannot be
    determined.

### `private getExtensions(allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']): string[]`{.language-typescript}

-   **Description**: This function converts a list of allowed MIME types
    into a list of corresponding file extensions.
-   **Parameters**:
    -   `allowedMimeTypes` (optional): An array of MIME type strings
        (default: \`\[\'image/jpeg\', \'image/png\', \'image/jpg\'\]\`).
-   **Returns**: An array of strings containing the file extensions
    (e.g., \`\[\'jpeg\', \'png\', \'jpg\'\]\`). It ensures \'jpg\' is
    always included.
-   **Note**: This method also updates the allowed extensions via
    \`this.setAllowedExtension()\`, an inherited method.

\-\--

## Usage Example

Here\'s how you might use the `ImageValidator` class in your application
to validate an image upload field.

### HTML (Example):

``` html
<form id="imageUploadForm">
                <label for="profileImage">Upload a profile image:</label>
                <input type="file" id="profileImage" name="profileImage" accept="image/*">
                <div id="profileImageError" style="color: red;"></div>
                <button type="submit">Upload Image</button>
            </form>
            
```

### TypeScript (Example):

``` typescript
import { ImageValidator,OptionsImage } from '@wlindabla/form_validator' // Adjust path 
            const imageValidator = ImageValidator.getInstance();
            
            document.getElementById('imageUploadForm')?.addEventListener('submit', async function (event) {
                event.preventDefault(); // Prevent default form submission
            
                const fileInput = document.getElementById('profileImage') as HTMLInputElement;
                const errorDiv = document.getElementById('profileImageError') as HTMLDivElement;
            
                errorDiv.textContent = ''; // Reset error messages
                imageValidator.clearErrors(); // Clear previous validator errors
            
                if (!fileInput.files || fileInput.files.length === 0) {
                    errorDiv.textContent = 'Please select an image to upload.';
                    return;
                }
            
                const imageFile = fileInput.files[0];
                const options: OptionsImage = {
                    allowedMimeTypeAccept: ['image/jpeg', 'image/png', 'image/webp'],
                    maxsizeFile: 2, // 2 MiB
                    unityMaxSizeFile: 'MiB',
                    minWidth: 100, // Minimum 100px width
                    minHeight: 100, // Minimum 100px height
                    maxWidth: 1000, // Maximum 1000px width
                    maxHeight: 1000, // Maximum 1000px height
                    extensions: ['jpeg', 'png', 'webp'], // Explicitly allowed extensions
                    errorMessageInput: "The image file is invalid or does not meet the required criteria."
                };
            
                try {
                    await imageValidator.validate(imageFile, 'profileImage', options);
            
                    if (imageValidator.hasErrors()) {
                        const errors = imageValidator.  getFieldErrors();
                        // Display the first error found for 'profileImage'
                        if (errors['profileImage']) {
                            errorDiv.textContent = errors['profileImage'];
                        } else {
                            // If the error is not directly related to targetInputname, inspect further
                            errorDiv.textContent = 'Image validation errors: ' + Object.values(errors).join(', ');
                        }
                        console.error("Validation failed:", errors);
                    } else {
                        alert('Image validated successfully! Ready for upload.');
                        console.log('Image validated:', imageFile.name, 'Type:', imageFile.type, 'Size:', imageFile.size);
                        // Here, you can proceed with sending the file to the server
                    }
                } catch (error) {
                    console.error("An unexpected error occurred during validation:", error);
                    errorDiv.textContent = 'An unexpected error occurred.';
                }
            });
            
            
```
:::

::: {#DocumentValidator .section}
# Class `DocumentValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`DocumentValidator\` class specializes in validating document files
(e.g., PDF, Word, Excel, TXT, CSV) uploaded through web forms. It
ensures that uploaded files match expected file types and can perform
signature-based validation for enhanced security and integrity checks.
This validator extends \`AbstractMediaValidator\` for common media
validation functionalities and implements \`MediaValidatorInterface\`.
As a \*\*singleton\*\*, it provides a single, efficient instance for all
your document validation needs.

\-\--

## Key Features:

-   **Singleton Pattern:** Ensures a unique instance for centralized
    document validation.
-   **MIME Type Validation:** Checks the file\'s MIME type against a
    predefined list of allowed document types.
-   **File Extension Validation:** Verifies that the file\'s extension
    is appropriate for the detected MIME type.
-   **File Signature (Magic Number) Validation:** Performs a deeper
    check by reading the file\'s initial bytes (hexadecimal signature)
    to confirm its true format, mitigating cases where files are merely
    renamed.
-   **Support for Common Document Types:** Pre-configured to validate
    PDFs, Microsoft Word (DOC, DOCX), Excel (XLS, XLSX), OpenDocument
    Text (ODT), OpenDocument Spreadsheet (ODS), plain text (TXT), and
    CSV files.
-   **Configurable Allowed Types:** Allows customizing the list of
    accepted MIME types.
-   **Inherited from \`AbstractMediaValidator\`:** Benefits from shared
    logic for handling multiple files and reporting errors.
-   **Comprehensive Error Reporting:** Provides detailed error messages
    if a file fails validation, including the file name and specific
    reason.

\-\--

## Usage:

To validate document files, first get the singleton instance of
\`DocumentValidator\`. Then, call the \`fileValidator\` method,
providing the \`File\` object(s) (or \`FileList\`), an optional input
name, and an \`OptionsFile\` object to define specific validation rules
like allowed MIME types.

### Getting an Instance:

``` typescript
import { documentValidator } from '@wlindabla/form_validator';
            
           
            
```

### Validating Document Files:

``` typescript
import { OptionsFile } from '@wlindabla/form_validator'; // Adjust path
            
            // Assume 'fileInput' is an HTML input element of type 'file'
            const fileInput = document.getElementById('documentUpload') as HTMLInputElement;
            
            // Simulate a file selection
            const mockPdfFile = new File(['%PDF-1.4\n...'], 'document.pdf', { type: 'application/pdf' });
            const mockDocxFile = new File(['PK\x03\x04...'], 'report.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const mockInvalidFile = new File(['Fake content'], 'image.jpg', { type: 'image/jpeg' }); // This should fail
            
            // Example 1: Validating a single PDF file
            const options1: OptionsFile = {
                allowedMimeTypeAccept: ['application/pdf']
            };
            await documentValidator.validate(mockPdfFile, 'userDocument', options1);
            
            if (documentValidator. isFieldValid('userDocument')) {
                console.log('PDF Validation Error:', documentValidator.  getFieldErrors());
            } else {
                console.log('PDF is valid.'); // Output: PDF is valid.
            }
            
            // Example 2: Validating multiple document files (PDF and DOCX)
            const fileList = new DataTransfer();
            fileList.items.add(mockPdfFile);
            fileList.items.add(mockDocxFile);
            // fileInput.files = fileList.files; // Assign to a real input if needed
            
            const options2: OptionsFile = {
                allowedMimeTypeAccept: [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ]
            };
            await documentValidator.validate(fileList.files, 'uploadDocuments', options2);
            
            if (documentValidator. isFieldValid('uploadDocuments')) {
                console.log('Multiple Docs Validation Errors:', documentValidator.  getFieldErrors());
            } else {
                console.log('All documents are valid.'); // Output: All documents are valid.
            }
            
            // Example 3: Validating with an invalid file (wrong MIME type or signature)
            const options3: OptionsFile = {
                allowedMimeTypeAccept: ['application/pdf', 'application/msword']
            };
            await documentValidator.validate(mockInvalidFile, 'invoice', options3);
            
            if (documentValidator. isFieldValid('invoice')) {
                console.log('Invalid File Error:', documentValidator.  getFieldErrors());
                // Output: Invalid File Error: { invoice: ["Invalid extension for file image.jpg. Only PDF, Word are allowed."] }
                // Or a signature error if the extension was allowed but content didn't match: "Invalid PDF file signature for file image.jpg."
            }
            
```

### Parameters for `validate`:

-   `medias` (`File | FileList`): The file(s) to be validated. This can
    be a single \`File\` object or a \`FileList\` object (e.g., from an
    \`\`).
-   `targetInputname` (`string`, optional): The name of the input field
    or a custom identifier for reporting errors. Defaults to
    \`\'doc\'\`.
-   `optionsdoc` (`OptionsFile`): An object containing the validation
    rules for the documents. This includes:
    -   `allowedMimeTypeAccept?: string[]`: An array of MIME types that
        are explicitly allowed. If not provided, a default set of common
        document MIME types (PDF, Word, Excel, etc.) will be used.
    -   Other options inherited from \`AbstractMediaValidator\` might
        also be available (e.g., \`minFileSize\`, \`maxFileSize\`).

The method returns a Promise that resolves to the current instance of
\`DocumentValidator\`, allowing for asynchronous file reading and method
chaining.
:::

::: {#VideoValidator .section}
# Class `VideoValidator`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`VideoValidator\` class is dedicated to validating video files
uploaded through web forms. It provides comprehensive checks including
file extension, size, MIME type, and importantly, video metadata such as
dimensions (width, height) and duration. This validator extends
\`AbstractMediaValidator\` for common media validation functionalities
and implements \`MediaValidatorInterface\`. Following the \*\*singleton
pattern\*\*, it ensures a single, efficient instance for all your video
validation requirements.

\-\--

## Key Features:

-   **Singleton Pattern:** Guarantees a unique instance for centralized
    video validation.
-   **File Extension Validation:** Checks the file\'s extension against
    a list of allowed video formats (e.g., MP4, MKV).
-   **File Size Validation:** Ensures the video file does not exceed a
    specified maximum size, with support for different units (KiB, MiB,
    GiB).
-   **MIME Type Validation:** Verifies the file\'s MIME type against a
    list of accepted video MIME types.
-   **Metadata Validation:** Crucially, it can validate video dimensions
    (minimum/maximum width and height) and duration, ensuring the video
    meets specific playback requirements.
-   **Configurable Options:** Allows extensive customization of allowed
    extensions, MIME types, file size limits, and metadata constraints.
-   **Inherited from \`AbstractMediaValidator\`:** Benefits from shared
    logic for handling multiple files and robust error reporting.
-   **Detailed Error Reporting:** Provides specific error messages for
    various validation failures, including file name and the nature of
    the issue (e.g., invalid extension, oversized, bad MIME type,
    metadata mismatch).

\-\--

## Usage:

To validate video files, first get the singleton instance of
\`VideoValidator\`. Then, call the \`fileValidator\` method, providing
the \`File\` object(s) (or \`FileList\`), an optional input name, and an
\`OptionsMediaVideo\` object to define specific validation rules.

### Getting an Instance:

``` typescript
import { videoValidator } from '@wlindabla/form_validator';
            
          
            
```

### Validating Video Files:

``` typescript
import { OptionsMediaVideo } from '@wlindabla/form_validator'; // Adjust path
            
            // Assume 'videoInput' is an HTML input element of type 'file'
            const videoInput = document.getElementById('videoUpload') as HTMLInputElement;
            
            // Simulate a file selection (You'd get actual files from an input event)
            // Note: Metadata validation (dimensions, duration) typically requires reading the file,
            // which is abstracted away by the internal implementation. For a true test, use actual File objects.
            const mockVideoFile = new File(['mock video content'], 'my_movie.mp4', { type: 'video/mp4' });
            const mockTooLargeVideoFile = new File(new ArrayBuffer(12 * 1024 * 1024), 'large_video.mp4', { type: 'video/mp4' }); // 12 MiB
            
            // Example 1: Validating a single MP4 video file with default options (max 5 MiB)
            const options1: OptionsMediaVideo = {}; // Using default options
            await videoValidator.validate(mockVideoFile, 'userVideo', options1);
            
            if (videoValidator. isFieldValid('userVideo')) {
                console.log('Video Validation Error:', videoValidator.  getFieldErrors());
            } else {
                console.log('Video is valid.'); // Output: Video is valid.
            }
            
            // Example 2: Validating a video with custom size and allowed extensions
            const options2: OptionsMediaVideo = {
                extensions: ['webm', 'avi'],
                allowedMimeTypeAccept: ['video/webm', 'video/x-msvideo'],
                maxsizeFile: 20, // Max 20 MiB
                unityMaxSizeFile: 'MiB'
            };
            // const mockWebmFile = new File(['mock webm content'], 'my_clip.webm', { type: 'video/webm' });
            // await videoValidator.validate(mockWebmFile, 'webmVideo', options2);
            // ... check errors
            
            // Example 3: Validating a video with metadata requirements (min dimensions, max duration)
            // IMPORTANT: Actual metadata validation would depend on external libraries
            // or browser APIs capable of parsing video streams to get dimensions/duration.
            // The example below assumes the internal `metadataValidate` correctly handles this.
            const options3: OptionsMediaVideo = {
                minWidth: 640,
                minHeight: 480,
                maxWidth: 1920,
                maxHeight: 1080,
                maxDuration: 300, // seconds (5 minutes)
                extensions: ['mp4'],
                allowedMimeTypeAccept: ['video/mp4']
            };
            // const mockHighResShortVideo = new File(['...'], 'holiday.mp4', { type: 'video/mp4' }); // Assume 1280x720, 60s
            // await videoValidator.validate(mockHighResShortVideo, 'hdVideo', options3);
            // ... check errors
            
            // Example 4: Validating a video that is too large
            const options4: OptionsMediaVideo = {
                maxsizeFile: 10, // Max 10 MiB
                unityMaxSizeFile: 'MiB'
            };
            await videoValidator.validate(mockTooLargeVideoFile, 'largeVideo', options4);
            
            if (videoValidator. isFieldValid('largeVideo')) {
                console.log('Large Video Validation Error:', videoValidator.  getFieldErrors());
                // Output: { largeVideo: ["File large_video.mp4 exceeds maximum allowed size of 10 MiB."] }
            }
            
```

### Parameters for `validate`:

-   `medias` (`File | FileList`): The video file(s) to be validated.
    This can be a single \`File\` object or a \`FileList\` object (e.g.,
    from an \`\`).
-   `targetInputname` (`string`, optional): The name of the input field
    or a custom identifier for reporting errors. Defaults to
    \`\'videofile\'\`.
-   `optionsmedia` (`OptionsMediaVideo`, optional): An object containing
    the validation rules for the videos. This includes:
    -   `extensions?: string[]`: An array of allowed file extensions
        (e.g., \`\[\'mp4\', \'webm\'\]\`). Defaults to common video
        extensions.
    -   `allowedMimeTypeAccept?: string[]`: An array of allowed MIME
        types (e.g., \`\[\'video/mp4\', \'video/webm\'\]\`). Defaults to
        common video MIME types.
    -   `maxsizeFile?: number`: The maximum allowed file size. Defaults
        to \`5\`.
    -   `` unityMaxSizeFile?: "KiB" | "MiB" | "GiB"`: The unit for `maxsizeFile`. Defaults to `"MiB"`.                              ``
    -   `minWidth?: number`: Minimum allowed video width in pixels.
    -   `maxWidth?: number`: Maximum allowed video width in pixels.
    -   `minHeight?: number`: Minimum allowed video height in pixels.
    -   `maxHeight?: number`: Maximum allowed video height in pixels.
    -   `minDuration?: number`: Minimum allowed video duration in
        seconds.
    -   `maxDuration?: number`: Maximum allowed video duration in
        seconds.
    -   Other options inherited from \`AbstractMediaValidator\` might
        also be available.

The method returns a Promise that resolves to the current instance of
\`VideoValidator\`, allowing for asynchronous file reading and method
chaining.
:::

::: {#FieldInputController .section}
# Class `FieldInputController`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`FieldInputController\` class provides a dynamic and intelligent
way to validate individual form input fields (excluding file inputs
which are handled by \`FileValidator\`). It automatically infers
validation rules based on HTML attributes present on the input elements,
making it incredibly flexible and easy to use without extensive
JavaScript configuration. It extends \`AbstractFieldInputController\`
for shared functionality and implements
\`FormChildrenValidateInterface\` for consistent interaction.

\-\--

## Key Features:

-   **Automatic Rule Inference:** Automatically detects validation rules
    (e.g., \`minlength\`, \`maxlength\`, \`required\`, \`pattern\`,
    \`data-\*\` attributes) directly from the HTML attributes of the
    input field.
-   **Supports Various Input Types:** Handles a wide range of input
    types including:
    -   Text fields (\`text\`, \`tel\`, \`textarea\`)
    -   Password fields
    -   Number fields
    -   Date fields
    -   URL fields
    -   Select dropdowns
    -   Checkboxes
    -   Radio buttons
    -   Image, Document, and Video (file input types, with options
        inferred from attributes)
-   **Integrated Validation Logic:** Uses internal validator instances
    (like \`formInputValidator\`) to perform the actual validation
    checks based on the inferred options.
-   **Error Handling Integration:** Connects with the
    \`FormErrorInterface\` to manage and retrieve validation errors for
    the specific field.
-   **Event-Driven Validation:** Provides methods to define which events
    trigger validation and error clearing.
-   **Flexible Configuration:** Allows overriding inferred options by
    providing explicit \`OptionsValidate\` during instantiation.
-   **Checkbox and Radio Group Management:** Enforces proper HTML
    structure for checkbox and radio button groups by requiring them to
    be wrapped in a container with a matching \`id\` attribute.

\-\--

## Usage:

The primary purpose of \`FieldInputController\` is to encapsulate the
validation logic for a single HTML form element. You typically
instantiate this class for each input field you want to validate within
a larger form validation system.

### Constructor:

``` typescript
new FieldInputController(childrenInput: HTMLFormChildrenElement, optionsValidate?: OptionsValidate)
            
```

Initializes a new instance of the validator for a specific form input
field.

-   \`childrenInput\` (\`HTMLFormChildrenElement\`): The jQuery-wrapped
    HTML element (e.g., \`\<input\>\`, \`\<textarea\>\`, \`\<select\>\`)
    to be validated.
-   \`optionsValidate\` (\`OptionsValidate\`, optional): An object to
    explicitly define validation rules, overriding any inferred from
    HTML attributes.

### Public Methods:

#### \`validate(): Promise\<void\>\`

Executes the validation logic for the associated form input field. This
method automatically determines the appropriate validation rules based
on the input\'s type and its HTML attributes, then applies them using
the \`formInputValidator\`. It\'s an asynchronous method, making it
suitable for operations that might involve file reading or other async
tasks (e.g., for file inputs, though the core logic for non-file inputs
is synchronous).

``` typescript
// Assuming 'myInputField' is a jQuery object representing an HTML input element
            const myInputField = $('input[name="username"]');
            const fieldValidator = new FieldInputController(myInputField);
            
            // Trigger validation for the field
            await fieldValidator.validate();
            
            // After validation, you can check if it's valid
            if (fieldValidator.isValid()) {
                console.log('Field is valid!');
            } else {
                console.log('Field has errors:', fieldValidator.getFormError().  getFieldErrors());
            }
            
```

#### \`isValid(): boolean\`

Checks whether the input field currently has any validation errors. It
returns \`true\` if no errors are present, \`false\` otherwise.

``` typescript
const fieldValidator = new FieldInputController($('input[name="email"]'));
            await fieldValidator.validate(); // Run validation first
            
            if (fieldValidator.isValid()) {
                console.log('Email is correctly formatted.');
            } else {
                console.log('Email has issues.');
            }
            
```

#### \`getFormError(): FormErrorInterface\`

Retrieves the \`FormErrorInterface\` instance associated with this input
field. This instance holds all validation error messages for the field.

``` typescript
const fieldValidator = new FormChildrenValidate($('input[name="password"]'));
            await fieldValidator.validate();
            
            const errors = fieldValidator.getFormError().  getFieldErrors();
            if (errors) {
                console.log('Password errors:', errors);
            }
            
```

#### \`getOptionsValidate(): OptionsValidate\`

Returns the \`OptionsValidate\` object currently being used for
validation. If options were not explicitly provided in the constructor,
this method will infer them from the input\'s HTML attributes (e.g.,
\`minlength\`, \`maxlength\`, \`required\`, \`pattern\`, \`data-\*\`
attributes) the first time it\'s called.

``` typescript
const fieldValidator = new FormChildrenValidate($('input[name="age"]'));
            const currentOptions = fieldValidator.getOptionsValidate();
            console.log('Validation options for age:', currentOptions);
            // Output might include { typeInput: 'number', min: 18, max: 120 } if inferred from HTML
            
```

#### \`eventValidate(): EventValidate\`

Returns the event type (e.g., \`\'blur\'\`, \`\'change\'\`) that should
trigger validation for this field. This value is typically inferred from
a \`data-event-validate\` HTML attribute on the input, or defaults to a
standard event.

``` typescript
const fieldValidator = new FormChildrenValidate($('input[name="username"]'));
            const validationEvent = fieldValidator.eventValidate();
            console.log(`This field should validate on: ${validationEvent}`); // e.g., 'blur' or 'input'
            
```

#### \`eventClearError(): EventValidate\`

Returns the event type that should trigger the clearing of validation
errors for this field. This value is typically inferred from a
\`data-event-clear-error\` HTML attribute on the input, or defaults to
\`\'change\'\`.

``` typescript
const fieldValidator = new FormChildrenValidate($('input[name="username"]'));
            const clearErrorEvent = fieldValidator.eventClearError();
            console.log(`Errors for this field should clear on: ${clearErrorEvent}`); // e.g., 'change'
            
```

#### \`clearErrorField(): void\`

Clears any visual error states and associated messages for the field.
This method is usually called when the user starts typing again after an
error, or when validation passes.

``` typescript
const fieldValidator = new FormChildrenValidate($('input[name="email"]'));
            // Simulate an error
            // fieldValidator.getFormError().setValidatorStatus(false, 'Invalid email', 'email'); 
            
            // Clear the error
            fieldValidator.clearErrorField();
            console.log('Error message for email field should now be cleared.');
            
```

\-\--

## HTML Attribute Inference Examples:

\`FormChildrenValidate\` is designed to work seamlessly with standard
HTML5 attributes and custom \`data-\*\` attributes for defining
validation rules. Below are examples of how various HTML attributes are
interpreted:

### Text/Tel/Textarea Inputs:

``` html
<input type="text" name="username" minlength="3" maxlength="20" required pattern="[a-zA-Z0-9]+" data-error-message-input="Username must be alphanumeric." data-escapestrip-html-and-php-tags="true" data-eg-await="john.doe">
            
            <textarea name="comments" minlength="10" maxlength="500" data-escapestrip-html-and-php-tags="true"></textarea>
            
```

-   \`minlength\`, \`maxlength\`: Sets minimum and maximum allowed input
    length.
-   \`required\`: Marks the field as mandatory.
-   \`pattern\`: Provides a regular expression for value validation.
-   \`data-error-message-input\`: Custom error message.
-   \`data-escapestrip-html-and-php-tags\`: If \`true\`, HTML/PHP tags
    in the input are stripped.
-   \`data-eg-await\`: An example value to display in error messages.

### Password Inputs:

``` html
<input type="password" name="newPassword" minlength="8" data-min-uppercase="1" data-min-number="1" data-symbol-allow="true" data-enable-scoring="true">
            
```

-   \`minlength\`, \`maxlength\`, \`required\`: Same as text inputs.
-   \`data-upper-case-allow\`, \`data-lower-case-allow\`,
    \`data-symbol-allow\`, \`data-number-allow\`,
    \`data-puntuation-allow\`: Allow/disallow specific character types.
-   \`data-min-uppercase\`, \`data-min-lowercase\`, \`data-min-number\`,
    \`data-min-symbol\`: Minimum count for character types.
-   \`data-enable-scoring\`: Enables password strength scoring (if
    supported by underlying validator).
-   \`data-custom-upper-regex\`, etc.: Custom regex for character types.

### URL Inputs:

``` html
<input type="url" name="website" required data-allowed-protocols="http,https" data-allow-ip="false" data-require-tld="true">
            
```

-   \`data-allowed-protocols\`: Comma-separated list of allowed URL
    protocols.
-   \`data-allow-localhost\`, \`data-allow-ip\`,
    \`data-allow-query-params\`, \`data-allow-hash\`: Boolean flags to
    control URL components.
-   \`data-required-tld\`: If \`true\`, requires a top-level domain.

### Date Inputs:

``` html
<input type="date" name="eventDate" data-format-date="YYYY/MM/DD" data-min-date="2023-01-01" data-allow-future="false">
            
```

-   \`data-format-date\`: Expected date format.
-   \`data-min-date\`, \`data-max-date\`: Minimum and maximum allowed
    dates.
-   \`data-allow-future\`, \`data-allow-past\`: Boolean flags to
    allow/disallow future or past dates.

### Select Inputs:

``` html
<select name="country" data-escapestrip-html-and-php-tags="true">
                <option value="">-- Select Country --</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
            </select>
            
```

-   \`data-escapestrip-html-and-php-tags\`: If \`true\`, selected option
    value is stripped. Options values are automatically collected.

### Number Inputs:

``` html
<input type="number" name="quantity" min="1" max="100" step="1">
            
```

-   \`min\`, \`max\`, \`step\`: Standard HTML attributes for number
    validation.

### Checkbox Groups:

``` html
<div id="hobbies" data-min-allowed="1" data-max-allowed="3" required>
                <input type="checkbox" name="hobbies" value="reading"> Reading
                <input type="checkbox" name="hobbies" value="gaming"> Gaming
                <input type="checkbox" name="hobbies" value="hiking"> Hiking
                <input type="checkbox" name="hobbies" value="cooking"> Cooking
            </div>
            
```

\*\*Important:\*\* All checkboxes within a group must be wrapped in a
container element (e.g., \`\<div\>\`) with an \`id\` that matches the
\`name\` attribute of the checkboxes.

-   Container \`id\`: Must match the \`name\` of the checkboxes.
-   \`data-min-allowed\`, \`data-max-allowed\`: Minimum and maximum
    number of selected checkboxes.
-   \`required\`: If \`true\`, at least one checkbox must be selected.

### Radio Button Groups:

``` html
<div id="gender" required>
                <input type="radio" name="gender" value="male"> Male
                <input type="radio" name="gender" value="female"> Female
            </div>
            
```

\*\*Important:\*\* All radio buttons within a group must be wrapped in a
container element (e.g., \`\<div\>\`) with an \`id\` that matches the
\`name\` attribute of the radio buttons.

-   Container \`id\`: Must match the \`name\` of the radio buttons.
-   \`required\`: If \`true\`, a radio option must be selected.

### File Inputs (Image, Document, Video):

``` html
<input type="file" name="profilePic" accept="image/*" data-maxsize-file="5" data-unity-max-size-file="MiB" data-min-width="100" data-max-height="500">
            
            <input type="file" name="resume" accept="application/pdf" data-extentions='["pdf","doc"]' data-allowed-mime-type-accept='["application/pdf","application/msword"]'>
            
            <input type="file" name="introVideo" accept="video/mp4" data-duration="60" data-unity-duration-media="seconds" data-min-width="640">
            
```

-   \`data-maxsize-file\`: Maximum file size.
-   \`data-unity-max-size-file\`: Unit for \`maxsize-file\` (e.g.,
    \"KiB\", \"MiB\", \"GiB\").
-   \`data-extentions\`: JSON array of allowed file extensions (e.g.,
    \`\[\"pdf\",\"doc\"\]\`).
-   \`data-allowed-mime-type-accept\`: JSON array of allowed MIME types.
-   For Images (\`type=\"image\"\`):
    -   \`data-min-width\`, \`data-max-width\`: Min/max image width.
    -   \`data-min-height\`, \`data-max-height\`: Min/max image height.
-   For Videos (\`type=\"video\"\`):
    -   \`data-duration\`: Max duration for video.
    -   \`data-unity-duration-media\`: Unit for \`duration\` (e.g.,
        \"seconds\", \"minutes\").
    -   \`data-min-width\`, \`data-max-width\`, \`data-min-height\`,
        \`data-max-height\`: Min/max video dimensions.
:::

::: {#FormValidateController .section}
# Class `FormValidateController`

**Author:** AGBOKOUDJO Franck \<franckagbokoudjo301@gmail.com\>\
**Package:**
[https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The \`FormValidate\` class provides a robust and flexible solution for
managing form validation on the frontend. It simplifies the process of
integrating validation into HTML forms by automatically identifying form
fields, inferring validation rules from HTML attributes, and
orchestrating validation across multiple inputs. It\'s designed to
streamline event handling and provide centralized control over form
validation, leveraging jQuery for DOM manipulation.

\-\--

## Key Features:

-   **Automated Field Detection:** Automatically identifies all relevant
    input, select, and textarea elements within a specified HTML form,
    excluding common non-validatable types (e.g., hidden, submit).
-   **Dynamic Validator Instantiation:** On demand, it creates
    appropriate validator instances (\`FormChildrenValidate\` for most
    inputs, or specialized file validators for \`type=\"file\"\` inputs
    based on their \`media-type\` attribute).
-   **Event-Driven Validation Management:** Categorizes form fields by
    the DOM event (e.g., \`blur\`, \`input\`, \`change\`, \`focus\`)
    that should trigger their validation, based on custom
    \`data-event-validate-\*\` attributes. This optimizes event listener
    attachment.
-   **Batch and Individual Validation:** Supports validating all fields
    in a form at once or triggering validation for a single, specific
    field.
-   **Centralized Error Handling:** Provides mechanisms to clear
    validation errors for individual fields.
-   **jQuery Integration:** Built on jQuery for efficient DOM traversal
    and manipulation.

\-\--

## Usage:

To use \`FormValidateController\`, instantiate it by providing a CSS
selector for your target form. Once initialized, you can use its methods
to trigger validation, access form children, and manage error states.

### Constructor:

``` typescript
constructor(formCssSelector: string = ".form-validate")
```

Initializes a new \`FormValidateController\` instance for a specific
HTML form.

-   \`formCssSelector\` (\`string\`, optional): A CSS selector suffix to
    identify the form. By default, it targets forms with the class
    \`form-validate\` (e.g., \`
    \`). If no suffix is provided, it attempts to select all \`
    \` elements.
-   **Throws:** An error if no form element is found matching the
    provided selector.

``` typescript
// Example 1: Validate a form with the class 'my-contact-form'
const contactFormValidator = new FormValidateController('.my-contact-form');

// Example 2: Validate all forms on the page (if no specific class is needed)
const allFormsValidator = new FormValidateController('.form-validate');
```

### Public Methods:

#### \`autoValidateAllFields(): Promise\<void\>\`

Initiates an asynchronous validation process for all applicable fields
within the form. It builds a validator instance for each field and then
triggers their individual validation.

``` typescript
const myFormValidator = new FormValidate('.user-registration-form');

// Typically called when the form is submitted
jQuery('.user-registration-form').on('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    try {
        await myFormValidator.autoValidateAllFields();
        // If no errors were thrown, the form is valid.
        console.log('All fields are valid! Submitting form...');
        this.submit(); // Programmatically submit the form
    } catch (error) {
        console.error('Form validation failed:', error);
        // Errors are already displayed by individual field validators
    }
});
```

#### \`validateChildrenForm(target: HTMLFormChildrenElement): Promise\<void\>\`

Validates a single specified child field within the form. This is useful
for real-time validation (e.g., on \`blur\` or \`input\` events) where
you only need to check the field currently being interacted with.

-   \`target\` (\`HTMLFormChildrenElement\`): The jQuery-wrapped HTML
    input, select, or textarea element to validate.

``` typescript
const myFormValidator = new FormValidateController('.user-profile-form');

// Validate an input field on blur
myFormValidator.idChildrenUsingEventBlur.forEach(id => {
jQuery(`#${id}`).on('blur', async function() {
    await myFormValidator.validateChildrenForm(jQuery(this));
});
});
```

Constructs and returns an array of \`FormChildrenValidateInterface\`
instances, one for each relevant child input element in the form. This
method prepares all field validators but does not trigger their
validation. It\'s primarily used internally but can be accessed if you
need to work with all field validator instances directly.

#### \`clearErrorDataChildren(target: HTMLFormChildrenElement): void\`

Clears any validation errors associated with the specified child field.
This is typically used when a user starts re-entering data into a field
that previously had an error, removing the error message.

-   \`target\` (\`HTMLFormChildrenElement\`): The jQuery-wrapped HTML
    input, select, or textarea element whose errors should be cleared.

``` typescript
const myFormValidator = new FormValidateController('.feedback-form');

// Clear errors on change
myFormValidator.idChildrenUsingEventChange.forEach(id => {
jQuery(`#${id}`).on('change', function() {
    myFormValidator.clearErrorDataChildren(jQuery(this));
});
});
```

### Form Children Accessors (with Event-Based Grouping):

These getters provide convenient ways to retrieve specific groups of
form fields (identified by their \`id\` attributes) based on the DOM
event that should trigger their validation. This grouping is determined
by custom HTML attributes on the input fields.

\*\*Required HTML attributes for event-based grouping:\*\*

-   \`data-event-validate-blur=\"blur\"\`: Field validates on \`blur\`
    event.
-   \`data-event-validate-input=\"input\"\`: Field validates on
    \`input\` event (for real-time typing validation).
-   \`data-event-validate-change=\"change\"\`: Field validates on
    \`change\` event (for select, checkbox, radio).
-   \`data-event-validate-focus=\"focus\"\`: Field validates on
    \`focus\` event.

This setup allows for efficient attachment of event listeners, ensuring
that validation logic is only bound to relevant fields for specific
events.

#### \`childrens: JQuery\<HTMLFormChildrenElement\>\`

Returns a jQuery collection of all input, select, and textarea elements
found within the form, excluding types like \`hidden\`, \`submit\`,
\`datetime\`, \`datetime-local\`, \`time\`, and \`month\`.

``` typescript
const myFormValidator = new FormValidateController('.my-form');
const allVisibleInputs = myFormValidator.childrens;
console.log(`Total relevant fields: ${allVisibleInputs.length}`);
```

#### \`idChildrenUsingEventBlur: string\[\]\`

Returns an array of IDs of child fields that have the
\`data-event-validate-blur=\"blur\"\` attribute.

``` typescript
const myFormValidator = new FormValidateController('.my-form');
    myFormValidator.idChildrenUsingEventBlur.forEach(id => {
        console.log(`Field with ID '${id}' will validate on blur.`);
        // Attach event listeners here
        jQuery(`#${id}`).on('blur', async function() {
            await myFormValidator.validateChildrenForm(jQuery(this));
        });
    });
    
```

#### \`idChildrenUsingEventInput: string\[\]\`

Returns an array of IDs of child fields that have the
\`data-event-validate-input=\"input\"\` attribute.

``` typescript
const myFormValidator = new FormValidateController('.my-form');
        myFormValidator.idChildrenUsingEventInput.forEach(id => {
            console.log(`Field with ID '${id}' will validate on input.`);
        });
        
```

#### \`idChildrenUsingEventChange: string\[\]\`

Returns an array of IDs of child fields that have the
\`data-event-validate-change=\"change\"\` attribute.

``` typescript
const myFormValidator = new FormValidateController('.my-form');
        myFormValidator.idChildrenUsingEventChange.forEach(id => {
            console.log(`Field with ID '${id}' will validate on change.`);
        });
        
```

#### \`idChildrenUsingEventFocus: string\[\]\`

Returns an array of IDs of child fields that have the
\`data-event-validate-focus=\"focus\"\` attribute.

``` typescript
const myFormValidator = new FormValidateController('.my-form');
        myFormValidator.idChildrenUsingEventFocus.forEach(id => {
            console.log(`Field with ID '${id}' will validate on focus.`);
        });
        
```

Returns a cached array of IDs for all relevant input, select, and
textarea elements within the form. This list is generated during
initialization.

``` typescript
const myFormValidator = new FormValidateController('.my-form');
console.log('All validatable field IDs:', myFormValidator.idChildrens);
```

#### \`form: JQuery\<HTMLFormElement\>\`

Returns the jQuery-wrapped HTML form element that this \`FormValidate\`
instance is managing.

``` typescript
const myFormValidator = new FormValidateController('.my-form');
const formElement = myFormValidator.form;
console.log('Managed form element:', formElement);
```

#### \`idChildrens: string\[\]\`

\-\--

## Required Attributes in the Form and on Fields:

For \`FormValidate\` to properly function and infer validation rules,
ensure your HTML elements have the following attributes:

  Attribute Name                   Where to Add                                               Purpose / Usage
  -------------------------------- ---------------------------------------------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------
  \`id\`                           On every \`\<input\>\`, \`\<select\>\`, \`\<textarea\>\`   Unique identifier used for mapping validators and event listeners. **Crucial for functionality.**
  \`name\`                         On every \`\<input\>\`, \`\<select\>\`, \`\<textarea\>\`   Required for correct form submission and for the validator to identify fields.
  \`media-type\`                   On \`\<input type=\"file\"\>\` fields                      Defines the media type for files (\`image\`, \`video\`, or \`document\`) to select the correct specific file validator. **Mandatory for file inputs.**
  \`data-event-validate-blur\`     On any field needing \`blur\` validation                   Set to \`\"blur\"\` to trigger validation when the field loses focus.
  \`data-event-validate-input\`    On any field needing \`input\` validation                  Set to \`\"input\"\` to trigger real-time validation as the user types.
  \`data-event-validate-change\`   On any field needing \`change\` validation                 Set to \`\"change\"\` to trigger validation when the field\'s value changes (common for \`select\`, \`checkbox\`, \`radio\`).
  \`data-event-validate-focus\`    On any field needing \`focus\` validation                  Set to \`\"focus\"\` to trigger validation when the field gains focus.

\-\--

## Example of Usage:

This example demonstrates how to integrate \`FormValidate\` into your
application using jQuery to listen for validation events and manage
error messages.

::: {style="background-color:#fff; color:#000;font-family: Arial, sans-serif; line-height: 1.6; max-width: 900px; margin: 20px auto; padding: 20px; border: 1px solid #ddd;"}
# Documentation Update: Caching Validation Options

We\'ve implemented a robust, pluggable caching system to accelerate
repeated field validations.

------------------------------------------------------------------------

## 1. Integrating an Options Cache Adapter

To boost performance and accelerate repetitive field validations, the
**`FormValidateController`** supports injecting a caching mechanism for
field validation options. This avoids the expensive process of
re-reading HTML attributes and recalculating options on every validation
event.

The `FormValidateController` constructor now accepts an optional second
argument:

``` {style=" padding: 10px; border-radius: 5px; overflow-x: auto;"}
new FormValidateController(selector: string, cacheAdapter?: FieldOptionsValidateCacheAdapterInterface);
```

### Architectural Principle: The Adapter Pattern

Your library remains **agnostic to external cache technologies** (like
Dexie.js, Redis, etc.). Instead, it relies on the **Adapter Pattern**.
Any class provided to the constructor must implement the interface
contract: **`FieldOptionsValidateCacheAdapterInterface`**.

If no adapter is provided (the default behavior), the value is
`undefined`, and the system operates in its standard mode, calculating
options directly from the DOM on demand.

------------------------------------------------------------------------

## 2. Default Usage: The Built-in `LocalStorageCacheAdapter`

For most applications, you can gain immediate, persistent performance
benefits using the built-in default adapter,
**`LocalStorageCacheAdapter`**.

💡 **Key Advantage:** This adapter utilizes the native browser
`localStorage` API. It is included in the library and requires **zero
external dependencies**, maintaining your low-dependency philosophy.

### Implementation Example

To activate caching, simply instantiate the default adapter and pass it
to the controller:

``` {style="padding: 15px; border-radius: 5px; overflow-x: auto;"}
        // Example of standard usage, now with caching enabled.
import { FormValidateController, LocalStorageCacheAdapter } from '@wlindabla/form_validator'; 
// ... (other imports)

jQuery(function testvalidateInputWithCache() {
  
  // 1. Instantiate the LocalStorage cache adapter
  const cacheAdapter = new LocalStorageCacheAdapter();

  // 2. Initialize FormValidate, injecting the adapter
  const formValidate = new FormValidateController('#form_validate', cacheAdapter);
     const form=formValidate.form
  // 2. Prepare selectors for fields based on their validation events
  //    addHashToIds is a utility function that converts ['id1', 'id2'] to ['#id1', '#id2']
  //    and then joins them into a comma-separated string for jQuery event delegation.
  const idsBlur = addHashToIds(formValidate.idChildrenUsingEventBlur).join(",");
  const idsInput = addHashToIds(formValidate.idChildrenUsingEventInput).join(",");
  const idsChange = addHashToIds(formValidate.idChildrenUsingEventChange).join(",");

  // 3. Attach event listener for 'blur' event to trigger validation
  //    This listener is delegated to the form element to efficiently handle blur events
  //    on multiple input, textarea elements specified by `idsBlur`.
  form.on("blur", `${idsBlur}`, async (event: JQuery.BlurEvent) => {
    const target = event.target;
    // Ensure the event target is an HTML input or textarea element before validating
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      // Validate the specific child field that triggered the blur event
      await formValidate.validateChildrenForm(event.target as HTMLFormChildrenElement);
      Logger.log("Blur event triggered validation:", event);
    }
  });

  // 4. Attach event listener for custom 'FieldValidationFailed' event
  //    This event is dispatched by the FormChildrenValidate class when a field fails validation.
  form.on(FieldValidationFailed, (event: JQuery.TriggeredEvent) => {
    // Access the custom event data containing details about the validation failure
    const data = (event.originalEvent as CustomEvent).detail;
    // Use a utility function to display the error message in the DOM
    addErrorMessageFieldDom(jQuery(data.targetChildrenForm), data.message);
    Logger.log("Field validation failed:", data);
  });

  // 5. Attach event listener for custom 'FieldValidationSuccess' event
  //    This event is dispatched when a field successfully passes validation.
    form.on(FieldValidationSuccess, (event: JQuery.TriggeredEvent) => {
    const data = (event.originalEvent as CustomEvent).detail;
    Logger.log("Field validation succeeded:", data);
  });

  // 6. Attach event listener for 'input' event to clear errors in real-time
  //    This clears the error message as the user types, providing immediate feedback.
    form.on('input', `${idsInput}`, (event: JQuery.Event | any) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      if (target) {
        // Use utility functions to clear visual error states and internal error data
        clearErrorInput(jQuery(target));
        formValidate.clearErrorDataChildren(target);
      }
    }
  });

  // 7. Attach event listener for 'change' event to clear errors
  //    Similar to 'input', but typically used for select, checkbox, and radio inputs.
    form.on('change', `${idsChange}`, (event: JQuery.ChangeEvent) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) { // Added HTMLSelectElement for completeness
      if (target) {
        clearErrorInput(jQuery(target));
        
      }
    }
    Logger.log("Change event triggered error clearing:", event);
  });

});
    
```

------------------------------------------------------------------------

## 3. Advanced Usage: Implementing a Custom Adapter

If your project requires more robust or specific caching (e.g., using
**Dexie.js** for IndexedDB, or a custom API), you must create a class
that strictly implements the interface contract.

### Contract Interface

``` {style=" padding: 10px; border-radius: 5px; overflow-x: auto;"}
        export interface FieldOptionsValidateCacheAdapterInterface {
    /** Reads options from the cache. Must be ASYNCHRONOUS. */
    getItem(key: string): Promise<OptionsValidate | undefined>;
    
    /** Writes options to the cache. Must be ASYNCHRONOUS. */
    setItem(key: string, options: OptionsValidate): Promise<void>;
}
    
```

### Custom Implementation Example

``` {style="padding: 15px; border-radius: 5px; overflow-x: auto;"}
        // Note: You must manually import and handle any external cache dependencies (like Dexie.js).
class CustomDexieAdapter implements FieldOptionsValidateCacheAdapterInterface {
    
    async getItem(key: string): Promise<OptionsValidate | undefined> {
        // Your logic to read data from Dexie.js
        // ...
    }

    async setItem(key: string, options: OptionsValidate): Promise<void> {
        // Your logic to write data to Dexie.js
        // Recommended: Avoid 'await' on setItem and use .catch() for non-blocking writes.
    }
}

// Initialization with the Custom Adapter
const customCache = new CustomDexieAdapter();
const formValidate = new FormValidateController('#form_advanced', customCache);
// ...
    
```
:::

## Summary:

The \`FormValidate\` class is a central component of the form validation
library. It acts as an orchestrator, simplifying complex form validation
tasks by:

-   Intelligently identifying and categorizing form fields.
-   Dynamically assigning appropriate validation logic based on HTML
    attributes.
-   Providing easy-to-use methods for triggering validation across the
    entire form or on individual fields.
-   Facilitating efficient event listener management.
-   Streamlining the process of managing and clearing validation errors.

By leveraging \`FormValidate\`, you can implement sophisticated and
user-friendly form validation with minimal JavaScript code, keeping your
HTML clean and declarative.
:::

::: {#TextInputOptions .section}
## Options for Simple Text Fields (`<input type="text">`, etc.)

These options apply to generic text input fields.

### Corresponding HTML Attributes:

-   `max-length="[number]"`:

    Sets the \*\*maximum\*\* allowed text length. By default, \`255\`
    characters.

    ``` html
    <input type="text" max-length="100">
    ```

-   `min-length="[number]"`:

    Sets the \*\*minimum length\*\* required for the text. By default,
    \`1\` character.

    ``` html
    <input type="text" min-length="5">
    ```

-   `required`:

    Indicates whether the field is \*\*required\*\*.

    ``` html
    <input type="text" required>
    ```

-   `data-escapestrip-html-and-php-tags="true/false"`:

    If set to `"true"`, HTML and PHP tags will be escaped/removed from
    the text.

    ``` html
    <input type="text" data-escapestrip-html-and-php-tags="true">
    ```

-   `data-error-message-input="[custom message]"`:

    A \*\*custom error message\*\* to display if validation fails.

    ``` html
    <input type="text" data-error-message-input="Invalid name.">
    ```

-   `data-eg-await="[expected example]"`:

    An example of the expected format of the input, often used in error
    messages to guide the user.

    ``` html
    <input type="text" data-eg-await="e.g., John Doe">
    ```

-   `pattern="[regular expression]"`: or `data-pattern`: A regex pattern
    that the password must match. Use `data-pattern` for cross-browser
    compatibility.

    Provides a \*\*custom regular expression\*\* that the input must
    match. This is one of the most powerful ways to validate specific
    formats (phone numbers, postal codes, etc.).

    ``` html
    <input type="text" pattern="^[0-9]{5}$">
    ```
:::

::: {#FQDNOptions .section}
## 📌 FQDNOptions

The `FQDNOptions` interface extends the basic `TextInputOptions` and is
specifically used to validate Fully Qualified Domain Names (FQDN), like
**example.com** or **www.google.fr**. It provides fine-grained control
over what constitutes a valid domain name structure.

**⚠️ Important:** To enable FQDN validation, developers **MUST** add the
attribute `data-type="fqdn"` to their input element. This allows the
validation engine to recognize and apply the correct validator.

### 🧩 Available Options:

-   `allowWildcard?: boolean`\
    [If set to `false`, domains like `*.example.com` will be
    rejected.]{.small}
-   `allowNumericTld?: boolean`\
    [Rejects TLDs that are purely numeric (e.g., `domain.123`) when set
    to `false`.]{.small}
-   `allowedUnderscores?: boolean`\
    [Allows underscores (`_`) in domain labels when set to
    `true`.]{.small}
-   `requireTLD?: boolean`\
    [Requires a top-level domain such as `.com`, `.org`. If `false`,
    domains like `localhost` are accepted.]{.small}
-   `allowTrailingDot?: boolean`\
    [Accepts a trailing dot at the end of the domain (e.g.,
    `example.com.`).]{.small}
-   `ignoreMaxLength?: boolean`\
    [Disables the maximum length validation of 63 characters per label
    and 255 characters total.]{.small}

### ✅ Example HTML Input:

    <input type="text"
                         name="domain"
                         data-type="fqdn"
                         data-error-message-input="Please enter a valid domain."
                         data-allow-wildcard="false"
                         data-allow-numeric-tld="false"
                         data-allowed-underscores="false"
                         data-require-tld="true"
                         data-allow-trailing-dot="false"
                         data-ignore-max-length="false"
                         required />
                    

### 🧪 Behavior:

The validator will automatically read these attributes and apply
FQDN-specific rules when `data-type="fqdn"` is present. This allows
dynamic detection of the correct validator without any manual
configuration in your code.
:::

::: {#OptionsValidateTextarea .section}
## Options for `<textarea>` Fields

These options are extracted from HTML attributes of a `<textarea>`
element and are used to validate textual content in forms.

### Supported HTML Attributes:

-   `max-length="[number]"`:

    Specifies the **maximum length** allowed for the input. If not set,
    the default is `1000` characters.

    ``` html
    <textarea max-length="500"></textarea>
    ```

-   `min-length="[number]"`:

    Specifies the **minimum length** required for the input. If not set,
    the default is `10` characters.

    ``` html
    <textarea min-length="20"></textarea>
    ```

-   `data-escapestrip-html-and-php-tags="true/false"`:

    If set to `"true"`, all HTML and PHP tags will be stripped or
    escaped from the content before validation. This helps prevent XSS
    attacks.

    ``` html
    <textarea data-escapestrip-html-and-php-tags="true"></textarea>
    ```

-   `required`:

    Indicates whether the field is **mandatory**. Simply adding
    `required` or `required="true"` makes the field required.

    ``` html
    <textarea required></textarea>
    ```

-   `pattern="[regex]"` or `data-pattern="[regex]"`:

    Defines a **custom regular expression** that the input must match.\
    **Important:** Some browsers *do not support* the `pattern`
    attribute on `<textarea>`. To ensure full compatibility, use the
    `data-pattern` attribute instead.

    ``` html
    <textarea data-pattern="^[A-Za-z0-9\s]+$"></textarea>
    ```

-   **Additional notes:**
    -   `typeInput` is implicitly set to `"textarea"`.
    -   `errorMessageInput` can be customized using
        `data-error-message-input`.

### Automatic Detection

In order for the correct validator to be invoked, you must set:\
`data-type="textarea"` on the HTML element.

``` html
<textarea data-type="textarea" required data-pattern="^[a-zA-Z\s]+$"></textarea>
```
:::

::: {#EventClearError .section}
## Option for Error Clearing Event

This attribute specifies the event that should trigger the clearing of
error messages for the form field.

### Corresponding HTML Attribute (on the input element):

-   `event-clear-error="[event]"`:

    Defines the JavaScript event that will reset the field\'s error
    state. For example, \"change\" to react to value changes, \"focus\"
    when the user clicks on the field, etc. The default value is
    \"change\".

    ``` html
    <input type="text" event-clear-error="focus">
    ```
:::

::: {#OptionsFile .section}
## Basic File Validation Options (`getBaseOptionsValidate`)

These options are common to all file types (images, videos, documents,
etc.) and are often inherited.

### Corresponding HTML Attributes:

-   `data-extentions="["ext1","ext2",...]"`:

    A JSON array of \*\*allowed file extension strings\*\* (e.g.,
    `'["jpg","png","gif"]'`). Note that the array must be a valid JSON
    string.

    ``` html
    <input type="file" data-extentions='["pdf", "docx"]'>
    ```

-   `data-allowed-mime-type-accept="[mime1],[mime2],..."`:

    A comma-separated list of \*\*allowed MIME types\*\* (e.g.,
    \"image/jpeg, image/png\").

    ``` html
    <input type="file" data-allowed-mime-type-accept="application/pdf,text/plain">
    ```

-   `data-maxsize-file="[number]"`:

    The \*\*maximum size\*\* allowed for the file. Defaults to 2 units
    (depends on `data-unity-max-size-file`).

    ``` html
    <input type="file" data-maxsize-file="5">
    ```

-   `data-unity-max-size-file="[unit]"`:

    The unit of measurement for the maximum file size (e.g., \"KiB\",
    \"MiB\", \"GiB\").

    ``` html
    <input type="file" data-unity-max-size-file="MiB">
    ```

-   `data-unity-dimensions="[unit]"`:

    The unit of measurement for dimensions (e.g., \"pixels\", \"cm\",
    \"mm\"). Used primarily for display or advanced calculations.
    Internal validation typically uses pixels.

    ``` html
    <input type="file" data-unity-dimensions="pixels">
    ```
:::

::: {#EmailInputOptions .section}
## Options for `<input type="email">` Fields

These options are extracted from the `<input>` tag with
`data-type="email"` and used to validate email addresses. It extends
from `FQDNOptions`, meaning all domain validation rules apply as well.

### Required Setup

To activate this validation logic, make sure to include:

``` html
<input type="text" data-type="email" />
```

This ensures the system routes the validator to `EmailInputValidator`.

### Supported HTML Attributes:

-   `data-allow-utf8-local-part="true/false"`:

    Allows UTF-8 characters in the local part (before the `@`). Default
    is `false`.

    ``` html
    <input data-allow-utf8-local-part="true">
    ```

-   `data-allow-ip-domain="true/false"`:

    If `true`, allows email domains in the form of an IP address, e.g.,
    `user@[192.168.0.1]`. Default is `false`.

-   `data-allow-quoted-local="true/false"`:

    Allows quoted strings in the local part (e.g.
    `"user.name"@domain.com`). Default is `false`.

-   `data-ignore-max-length="true/false"`:

    Ignore the maximum length of email (254 characters). Default is
    `false`.

-   `data-host-blacklist="domain1.com,domain2.com"`:

    Comma-separated list of blacklisted domains. Emails from these
    domains will be rejected.

-   `data-host-whitelist="domain1.com,domain2.com"`:

    Only emails from these domains will be accepted. Takes precedence
    over blacklist.

-   `data-blacklisted-chars="!"`:

    List of characters forbidden in the email address (especially the
    local part). Example: `data-blacklisted-chars="!%$"`

-   `data-require-display-name="true/false"`:

    Requires the email to have a display name like
    `John Doe <john@example.com>`. Default is `false`.

-   `data-allow-display-name="true/false"`:

    Allows display names in email. If `false`, display names are
    rejected.

-   **Inherited from `FQDNOptions`:**
    -   `data-allow-wildcard`
    -   `data-allow-numeric-tld`
    -   `data-allowed-underscores`
    -   `data-require-tld`
    -   `data-allow-trailing-dot`

-   `max-length` / `min-length`:

    Define length constraints on the entire input string.

-   `required`:

    Makes the field mandatory.

-   `pattern` or `data-pattern`:

    Custom regular expression validation. As some browsers don't support
    `pattern` for all input types, use `data-pattern` for compatibility.

### Example

``` html
<input 
        type="text"
        data-type="email"
        required
        min-length="6"
        max-length="254"
        data-allow-ip-domain="true"
        data-host-whitelist="gmail.com,yahoo.com"
        data-blacklisted-chars="!"
        data-error-message-input="Please enter a valid email address"
        />
```
:::

::: {#URLOptions .section style="padding: 2rem; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;"}
## URL Field Validation Options {#url-field-validation-options style="color: #333;"}

This section describes the supported `<input type="url">` validation
options. These are automatically detected by setting the attribute
`data-type="url"` on your input field. These attributes allow full
control over the behavior of the URL validator.

### Required HTML Attribute {#required-html-attribute style="color: #555; margin-top: 1.5rem;"}

-   `data-type="url"` -- Triggers the correct validator for URL inputs.

### Supported `data-*` Attributes {#supported-data--attributes style="color: #555; margin-top: 1.5rem;"}

-   `data-allowed-protocols` -- A comma-separated list of allowed
    protocols (default: `https`).
-   `data-allow-localhost` -- Allow `localhost` domains (default:
    `false`).
-   `data-allow-ip` -- Allow IP addresses as hostnames.
-   `data-allow-query-params` -- Accept URLs with `?key=value` queries.
-   `data-allow-hash` -- Accept URLs with `#fragment`.
-   `data-validate-length` -- Enable length validation (default:
    `true`).
-   `data-max-allowed-length` -- Maximum URL length allowed (default:
    `2084`).
-   `data-require-port` -- Require a port (e.g., `:3000`) in the URL.
-   `data-disallow-auth` -- Disallow user:pass@host in URLs.
-   `data-allow-protocol-relative-urls` -- Allow protocol-relative URLs
    like `//example.com`.
-   `data-require-host` -- Require a valid host (e.g., `example.com`).
-   `data-require-valid-protocol` -- Only accept URLs with known
    protocols.
-   `data-require-protocol` -- Force presence of `http://` or
    `https://`.
-   `data-host-whitelist` -- A comma-separated list of allowed domains
    (can include regex).
-   `data-host-blacklist` -- A comma-separated list of blocked domains.
-   `data-allow-wildcard` -- Allow wildcards like `*.example.com`.
-   `data-allow-numeric-tld` -- Allow numeric TLDs like `.123`.
-   `data-allowed-underscores` -- Allow underscores in domains.
-   `data-require-tld` -- Require a TLD like `.com`.
-   `data-allow-trailing-dot` -- Allow URLs that end with a dot.
-   `data-ignore-max-length` -- Skip FQDN length validations.
-   `data-pattern` -- Custom regular expression (useful for
    compatibility with some browsers that ignore `pattern` on
    `<textarea>`).

### Example {#example-1 style="color: #555; margin-top: 2rem;"}

``` {style="background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto;"}
  
  <input
    type="url"
    name="website"
    data-type="url"
    required
    max-length="2084"
    data-allowed-protocols="https,http"
    data-allow-localhost="true"
    data-allow-query-params="true"
    data-host-blacklist="badsite.com"
    data-error-message-input="Please enter a valid URL!"
    data-validate-length="true"
  />
  
    
```

⚠️ If you need to ensure compatibility for `pattern` in older or
non-standard browsers, consider using `data-pattern` instead of the
standard `pattern` attribute.
:::

::: {#PassworkRuleOptions .section style="padding: 1.5rem; border: 1px solid #ccc; border-radius: 6px; background-color: #fefefe;"}
## Password Field Validation Options {#password-field-validation-options style="color: #333;"}

These options are extracted from a password input\'s HTML attributes and
determine the password strength and rule validation. The validator is
activated when the input field includes `data-type="password"`.

### Supported `data-*` Attributes:

-   `data-upper-case-allow`: Allow uppercase letters (A-Z).
-   `data-lower-case-allow`: Allow lowercase letters (a-z).
-   `data-symbol-allow`: Allow special symbols (e.g., @, #, \$, etc.).
-   `data-number-allow`: Allow numeric characters (0-9).
-   `data-puntuation-allow`: Allow punctuation characters (e.g., ., !,
    ?).
-   `data-min-lowercase`: Minimum number of lowercase letters required.
-   `data-min-uppercase`: Minimum number of uppercase letters required.
-   `data-min-number`: Minimum number of numeric characters required.
-   `data-min-symbol`: Minimum number of symbols required.
-   `data-enable-scoring`: Enable password scoring/strength calculation.
-   `data-custom-upper-regex`: Provide a custom regex to match uppercase
    characters.
-   `data-custom-lower-regex`: Provide a custom regex to match lowercase
    characters.
-   `data-custom-number-regex`: Provide a custom regex to match numeric
    characters.
-   `data-custom-symbol-regex`: Provide a custom regex to match special
    symbols.
-   `data-custom-punctuation-regex`: Provide a custom regex to match
    punctuation characters.
-   `data-error-message-input`: Custom error message to display on
    failure.
-   `required`: Makes the field mandatory.
-   `min-length`: Minimum allowed character count (default: 8).
-   `max-length`: Maximum allowed character count (default: 255).
-   `pattern` or `data-pattern`: A regex pattern that the password must
    match. Use `data-pattern` for cross-browser compatibility.

### Example:

``` {style="background: #f8f8f8; padding: 1rem; border-radius: 5px;"}
  
  <input
    type="password"
    name="user_password"
    data-type="password"
    required
    min-length="8"
    max-length="128"
    data-upper-case-allow="true"
    data-lower-case-allow="true"
    data-number-allow="true"
    data-symbol-allow="true"
    data-enable-scoring="true"
    data-error-message-input="Password must include letters, numbers, and symbols."
  />
  
    
```

**Note:** For complete validation, it\'s recommended to define
`data-type="password"` and specify at least `min-length` and character
rules.
:::

::: {#NumberOptions .section}
## Number Field Options (`<input type="number">`)

These options define numeric constraints for number input fields.

### Corresponding HTML Attributes:

-   `min="[number]"`:

    The \*\*minimum numeric value\*\* allowed.

    ``` html
    <input type="number" min="0">
    ```

-   `max="[number]"`:

    The \*\*maximum numeric value\*\* allowed.

    ``` html
    <input type="number" max="100">
    ```

-   `step="[number]"`:

    The \*\*increment/decrement step\*\* allowed. For example,
    `step="0.01"` for decimal values.

    ``` html
    <input type="number" step="0.5">
    ```

-   `pattern="[regular expression]"`: `data-pattern`: A regex pattern
    that the password must match. Use `data-pattern` for cross-browser
    compatibility.

    Provides a \*\*custom regular expression\*\* that the number must
    match. Can be used for specific number formats (e.g., only integers,
    or numbers with a certain number of decimal places).

    ``` html
    <input type="number" pattern="^\d+$">
    ```
:::

::: {#DateInputOptions .section style="padding: 1.5rem; border: 1px solid #ccc; border-radius: 8px; background-color: #fcfcfc;"}
## Date Input Field Validation Options {#date-input-field-validation-options style="color: #2c3e50;"}

The following options are automatically retrieved from the HTML
attributes of a `<input type="text">` or `<input type="date">` element
used for date entry. To trigger the date validator, include the
attribute `data-type="date"` on your field.

### Supported HTML Attributes

-   `data-format-date`: Expected format (e.g., `YYYY-MM-DD`,
    `DD/MM/YYYY`).
-   `data-min-date`: The earliest valid date (e.g., `2000-01-01`).
-   `data-max-date`: The latest valid date (e.g., `2099-12-31`).
-   `data-allow-future`: Whether dates in the future are allowed
    (`true/false`).
-   `data-allow-past`: Whether past dates are allowed (`true/false`).
-   `data-strict-mode`: If `true`, the length must strictly match the
    format pattern.
-   `data-delimiters`: List of allowed delimiters for the date string
    (e.g., `/-`, or `,`).
-   `required`: Marks the field as mandatory.
-   `min-length`: Minimum character length (default: `10`).
-   `max-length`: Maximum character length (default: `21`).
-   `data-error-message-input`: Custom error message for invalid date
    input.
-   `pattern` or `data-pattern`: Regex to enforce custom format. Use
    `data-pattern` for better browser compatibility.

### HTML Example

``` {style="background-color: #f4f4f4; padding: 1rem; border-left: 4px solid #2980b9;"}
      
      <input 
        type="text"
        name="birth_date"
        data-type="date"
        required
        data-format-date="YYYY-MM-DD"
        data-min-date="1990-01-01"
        data-max-date="2025-12-31"
        data-allow-past="true"
        data-allow-future="false"
        data-strict-mode="true"
        data-delimiters="-"
      />
      
        
```

**Note:** Always use `data-type="date"` to ensure the validator uses the
proper logic for date fields.
:::

::: {#OptionsMediaVideo .section}
## Options for Video Files (`<input type="file">` for videos)

These options apply to validations specific to video files. They also
include basic file options.

### Corresponding HTML Attributes:

-   `data-duration="[number]"`:

    The \*\*maximum duration\*\* allowed for the video. Defaults to 10
    units (depends on `data-unity-duration-media`).

    ``` html
    <input type="file" accept="video/*" data-duration="60" data-unity-duration-media="seconds">
    ```

-   `data-min-width="[pixels]"`:

    The \*\*minimum width\*\* required in pixels. Defaults to 10.

    ``` html
    <input type="file" accept="video/*" data-min-width="640">
    ```

-   `data-max-width="[pixels]"`:

    The \*\*maximum width\*\* allowed in pixels. Default: \`1600\`.

    ``` html
    <input type="file" accept="video/*" data-max-width="1920">
    ```

-   `data-min-height="[pixels]"`:

    The \*\*minimum height\*\* required in pixels. Default: \`10\`.

    ``` html
    <input type="file" accept="video/*" data-min-height="480">
    ```

-   `data-max-height="[pixels]"`:

    The \*\*maximum height\*\* allowed in pixels. Default is \`2500\`.

    ``` html
    <input type="file" accept="video/*" data-max-height="1080">
    ```

-   `data-unity-duration-media="[unit]"`:

    The unit of measurement for duration (e.g., \"seconds\",
    \"minutes\", \"hours\").

    ``` html
    <input type="file" accept="video/*" data-unity-duration-media="minutes">
    ```

-   \*\*Attributes inherited from `OptionsFile` (see next section):\*\*
    `data-extentions`, `data-allowed-mime-type-accept`,
    `data-maxsize-file`, `data-unity-max-size-file`,
    `data-unity-dimensions`.
:::

::: {#OptionsImage .section}
## Image File Options (`<input type="file">` for images)

These options apply to validations specific to image files. They also
include basic file options.

### Corresponding HTML Attributes:

-   `data-min-width="[pixels]"`:

    The \*\*minimum width\*\* required in pixels. Defaults to \`10\`.

    ``` html
    <input type="file" accept="image/*" data-min-width="150">
    ```

-   `data-max-width="[pixels]"`:

    The \*\*maximum width\*\* allowed in pixels. Default: \`1600\`.

    ``` html
    <input type="file" accept="image/*" data-max-width="800">
    ```

-   `data-min-height="[pixels]"`:

    The \*\*minimum height\*\* required in pixels. Default: \`10\`.

    ``` html
    <input type="file" accept="image/*" data-min-height="150">
    ```

-   `data-max-height="[pixels]"`:

    The \*\*maximum height\*\* allowed in pixels. Defaults to \`2500\`.

    ``` html
    <input type="file" accept="image/*" data-max-height="800">
    ```

-   \*\*Attributes inherited from `getBaseOptionsValidate` (see next
    section):\*\* `data-extentions`, `data-allowed-mime-type-accept`,
    `data-maxsize-file`, `data-unity-max-size-file`,
    `data-unity-dimensions`.
:::

::: {#TelInputOptions .section style="padding: 1.5rem; border: 1px solid #ccc; border-radius: 8px; background-color: #fefefe;"}
## Telephone Input Validation Options {#telephone-input-validation-options style="color: #2c3e50;"}

This validator is intended for validating international phone numbers
based on country codes. To trigger the correct validator logic, you must
specify the attribute `data-type="tel"` in your input field.

### Supported HTML Attributes {#supported-html-attributes-3 style="margin-top: 1rem;"}

-   `data-default-country`:

    Defines the default country for the phone number format. Use the
    **ISO 3166-1 alpha-2** country code (e.g., `FR`, `US`, `BJ`).

-   `required`:

    If present, the input field must not be empty.

-   `min-length` and `max-length`:

    Defines the acceptable character length of the phone number input.
    If not provided, defaults are used.

-   `data-error-message-input`:

    Custom message to display in case of validation failure (e.g.,
    \"Please enter a valid phone number\").

-   `pattern` or `data-pattern`:

    Optional regex to override default validation logic. It's
    recommended to use `data-pattern` instead of `pattern` for
    compatibility with older browsers.

-   `data-escapestrip-html-and-php-tags`:

    If `true`, strips HTML or PHP tags from input before validation
    (useful for sanitization).

### Example HTML Usage {#example-html-usage style="margin-top: 1rem;"}

``` {style="background-color: #f4f4f4; padding: 1rem; border-left: 4px solid #27ae60;"}
              
              <input 
                type="text"
                name="user_phone"
                data-type="tel"
                data-default-country="BJ"
                required
                data-error-message-input="Please enter a valid phone number"
                min-length="8"
                max-length="15"
              />
              
                
```

### Developer Note {#developer-note style="margin-top: 1rem;"}

Internally, the validator will use the specified `defaultCountry` to
normalize and validate international numbers. Make sure to integrate a
library such as `libphonenumber-js` or similar if custom validation is
required based on region.
:::

::: {#SelectOptions .section style="padding: 1.5rem; border: 1px solid #ccc; border-radius: 8px; background-color: #fefefe;"}
## Select Field Validation Options {#select-field-validation-options style="color: #2c3e50;"}

This section describes the options automatically extracted from a
`<select>` element for validation purposes. The validator checks if the
selected value exists in the predefined list of choices.

### Supported HTML Attributes {#supported-html-attributes-4 style="margin-top: 1rem;"}

-   `<option>`:

    Each option's `value` attribute is collected. If `value` is missing,
    the option's text content will be used instead.

    ``` html
                  <select name="category">
                    <option value="tech">Tech</option>
                    <option value="science">Science</option>
                    <option>Other</option> <!-- Will use text "Other" -->
                  </select>
                        
    ```

-   `data-escapestrip-html-and-php-tags`:

    If set to `"true"`, any HTML or PHP tags in selected values will be
    stripped for sanitization.

    ``` html
                  <select data-escapestrip-html-and-php-tags="true">...</select>
                        
    ```

### Expected Output Structure {#expected-output-structure style="margin-top: 1rem;"}

``` {style="background-color: #f4f4f4; padding: 1rem; border-left: 4px solid #3498db;"}
              
              {
                optionsChoices: ['tech', 'science', 'Other'],
                escapestripHtmlAndPhpTags: true
              }
              
                
```

### HTML Example {#html-example-2 style="margin-top: 1rem;"}

``` {style="background-color: #f4f4f4; padding: 1rem; border-left: 4px solid #27ae60;"}
              
              <select name="subject" data-type="select" data-escapestrip-html-and-php-tags="true">
                <option value="math">Mathematics</option>
                <option value="bio">Biology</option>
                <option>Other</option>
              </select>
              
                
```

### Developer Note {#developer-note-1 style="margin-top: 1rem;"}

Internally, the validator collects all valid choices from the options
list and verifies if the selected value matches one of them. This is
especially useful to prevent tampering with submitted values.
:::

::: {#OptionsCheckBox .section style="padding: 1.5rem; border: 1px solid #ccc; border-radius: 8px; background-color: #fefefe; margin-bottom: 2rem;"}
## Checkbox Group Validation Options {#checkbox-group-validation-options style="color: #2c3e50;"}

These options apply to groups of `<input type="checkbox">` elements and
define how many items can or must be selected.

### Supported HTML Attributes (Container Level) {#supported-html-attributes-container-level style="margin-top: 1rem;"}

-   `data-max-allowed`:

    Specifies the maximum number of checkboxes that can be selected.

    ``` html
    <div data-max-allowed="3">...checkboxes...</div>
    ```

-   `data-min-allowed`:

    Specifies the minimum number of checkboxes that must be selected.

    ``` html
    <div data-min-allowed="1">...checkboxes...</div>
    ```

-   `required`:

    Indicates that at least one checkbox must be selected.

    ``` html
    <div required>...checkboxes...</div>
    ```

### Generated Options Object {#generated-options-object style="margin-top: 1rem;"}

``` {style="background-color: #f4f4f4; padding: 1rem; border-left: 4px solid #3498db;"}
              
              {
                maxAllowed: 3,
                minAllowed: 1,
                required: true,
                dataChoices: ['value1', 'value2'],
                optionsChoicesCheckbox: ['value1', 'value2', 'value3']
              }
              
                
```

### Example Markup {#example-markup style="margin-top: 1rem;"}

``` {style="background-color: #f4f4f4; padding: 1rem; border-left: 4px solid #27ae60;"}
              
              <div data-type="checkbox" data-min-allowed="1" data-max-allowed="3" required>
                <label><input type="checkbox" name="topics[]" value="math"> Math</label>
                <label><input type="checkbox" name="topics[]" value="bio"> Biology</label>
                <label><input type="checkbox" name="topics[]" value="chem"> Chemistry</label>
              </div>
              
                
```
:::

::: {#OptionsRadio .section style="padding: 1.5rem; border: 1px solid #ccc; border-radius: 8px; background-color: #fefefe;"}
## Radio Button Group Validation Options {#radio-button-group-validation-options style="color: #2c3e50;"}

This option applies to groups of `<input type="radio">` and ensures that
one option must be selected.

### Supported HTML Attribute {#supported-html-attribute style="margin-top: 1rem;"}

-   `required`:

    If present, the validator enforces that at least one radio button in
    the group must be selected.

    ``` html
    <div data-type="radio" required>...radio buttons...</div>
    ```

### Generated Options Object {#generated-options-object-1 style="margin-top: 1rem;"}

``` {style="background-color: #f4f4f4; padding: 1rem; border-left: 4px solid #3498db;"}
              
              {
                required: true
              }
              
                
```

### Example Markup {#example-markup-1 style="margin-top: 1rem;"}

``` {style="background-color: #f4f4f4; padding: 1rem; border-left: 4px solid #27ae60;"}
              
              <div data-type="radio" required>
                <label><input type="radio" name="gender" value="male"> Male</label>
                <label><input type="radio" name="gender" value="female"> Female</label>
              </div>
              
                
```
:::

::: {#OptionsCheckBox .section style="padding: 1.5rem; border: 1px solid #ccc; border-radius: 8px; background-color: #fefefe; margin-bottom: 2rem;"}
## Checkbox Group Validation Options {#checkbox-group-validation-options-1 style="color: #2c3e50;"}

These options apply to groups of `<input type="checkbox">` elements and
define how many items can or must be selected.

### Supported HTML Attributes (Container Level) {#supported-html-attributes-container-level-1 style="margin-top: 1rem;"}

-   `data-max-allowed`:

    Specifies the maximum number of checkboxes that can be selected.

    ``` html
    <div data-max-allowed="3">...checkboxes...</div>
    ```

-   `data-min-allowed`:

    Specifies the minimum number of checkboxes that must be selected.

    ``` html
    <div data-min-allowed="1">...checkboxes...</div>
    ```

-   `required`:

    Indicates that at least one checkbox must be selected.

    ``` html
    <div required>...checkboxes...</div>
    ```

### Generated Options Object {#generated-options-object-2 style="margin-top: 1rem;"}

``` {style="background-color: #f4f4f4; padding: 1rem; border-left: 4px solid #3498db;"}
              
              {
                maxAllowed: 3,
                minAllowed: 1,
                required: true,
                dataChoices: ['value1', 'value2'],
                optionsChoicesCheckbox: ['value1', 'value2', 'value3']
              }
              
                
```

### Example Markup {#example-markup-2 style="margin-top: 1rem;"}

``` {style="background-color: #f4f4f4; padding: 1rem; border-left: 4px solid #27ae60;"}
              
              <div data-type="checkbox" data-min-allowed="1" data-max-allowed="3" required>
                <label><input type="checkbox" name="topics[]" value="math"> Math</label>
                <label><input type="checkbox" name="topics[]" value="bio"> Biology</label>
                <label><input type="checkbox" name="topics[]" value="chem"> Chemistry</label>
              </div>
              
                
```
:::
:::
:::
