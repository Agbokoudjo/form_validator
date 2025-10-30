# Form Validator Documentation

## Table of Contents

### Getting Started
- [Introduction](#introduction)
- [Installation](#installation)
- [Quick Start](#quick-start)

### Core Validators

#### Text & Password
- [TextInputValidator](#TextInputValidator)
- [PasswordInputValidator](#PasswordInputValidator)

#### Numeric & Contact
- [NumberInputValidator](#NumberInputValidator)
- [TelInputValidator](#TelInputValidator)
- [EmailInputValidator](#EmailInputValidator)

#### Web & Network
- [URLInputValidator](#URLInputValidator)
- [FQDNInputValidator](#FQDNInputValidator)

#### Date & Selection
- [DateInputValidator](#DateInputValidator)
- [ChoiceInputValidator](#ChoiceInputValidator)

#### Media & Files
- [ImageValidator](#ImageValidator)
- [DocumentValidator](#DocumentValidator)
- [VideoValidator](#VideoValidator)

### Controllers
- [FieldInputController](#FieldInputController)
- [FormValidateController](#FormValidateController)

### Configuration Options

#### Input Validators Options
- [TextInputOptions](#TextInputOptions)
- [PasswordRuleOptions](#PasswordRuleOptions)
- [NumberOptions](#NumberOptions)
- [TelInputOptions](#TelInputOptions)
- [EmailInputOptions](#EmailInputOptions)
- [URLOptions](#URLOptions)
- [FQDNOptions](#FQDNOptions)
- [DateInputOptions](#DateInputOptions)

#### Form Elements Options
- [SelectOptions](#SelectOptions)
- [OptionsCheckbox](#OptionsCheckbox)
- [OptionsRadio](#OptionsRadio)
- [OptionsValidateTextarea](#OptionsValidateTextarea)

#### Media Options
- [OptionsImage](#OptionsImage)
- [OptionsMediaVideo](#OptionsMediaVideo)
- [OptionsFile](#OptionsFile)

### Events & Utilities
- [EventClearError](#EventClearError)
- [AbstractFieldValidator](#AbstractFieldValidator)

---

## Class `TextInputValidator` {#TextInputValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `TextInputValidator` class is a specialized validator for text-based input fields. It extends `FormError` for error management and implements `TextInputValidatorInterface`, ensuring it adheres to a contract for text input validation. This class follows the **singleton pattern**, meaning only one instance of it exists throughout your application, providing a centralized and efficient way to handle text input validation.

### Key Features

- **Singleton Pattern:** Ensures a single, globally accessible instance for consistent validation.
- **Required Field Validation:** Checks if an input field is mandatory and has a value.
- **Length Validation:** Validates the minimum and maximum length of the input string.
- **Regular Expression Validation:** Allows custom regex patterns for specific input formats (e.g., email, phone number).
- **HTML/PHP Tag Stripping:** Can escape or strip HTML and PHP tags from input to prevent XSS vulnerabilities.
- **Customizable Error Messages:** Provides flexible options to define user-friendly error messages.

### Usage

To use the `TextInputValidator`, you first obtain its singleton instance. Then, you can call the `validate` method, passing the input data, the target field name, and an options object to define the validation rules.

#### Getting an Instance

```typescript
import { textInputValidator } from '@wlindabla/form_validator'
```

#### Validating Text Input

```typescript
import { TextInputOptions } from '@wlindabla/form_validator';

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

if (!textInputValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = textInputValidator.getState();
    console.log(`Validation errors for ${fieldName}:`, errors);
} else {
    console.log(`${fieldName} is valid.`);
}
```

#### Parameters for `validate`

- **`datainput`** (`string | undefined`): The string value from the input field to be validated.
- **`targetInputname`** (`string`): The name of the input field, used for error reporting.
- **`optionsinputtext`** (`TextInputOptions`): An object containing validation rules:
  - `requiredInput?: boolean` - If `true`, the field cannot be empty.
  - `minLength?: number` - The minimum allowed length of the input.
  - `maxLength?: number` - The maximum allowed length of the input.
  - `regexValidator?: RegExp` - A regular expression to test the input against.
  - `errorMessageInput?: string` - A custom error message to display if validation fails.
  - `escapestripHtmlAndPhpTags?: boolean` - If `true`, HTML and PHP tags are escaped/stripped before validation.
  - `egAwait?: string` - An example of the expected format, often appended to error messages.
- **`ignoreMergeWithDefaultOptions`** (`boolean`, optional): If `true`, default options will not be merged with provided `optionsinputtext`. Defaults to `false`.

The method returns the current instance of `TextInputValidator`, allowing for method chaining.

---

## Abstract Class `AbstractFieldValidator` {#AbstractFieldValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `AbstractFieldValidator` class serves as the foundational base class for all field validators in the form validation system. It implements the `FieldValidatorInterface` and provides common validation utilities, error state management, and core validation rules that are inherited and extended by specialized validators.

### Key Features

- **Central Error Store Integration:** Direct access to the global error management store for consistent error tracking.
- **Validation State Management:** Methods to set and retrieve the validation state of any field.
- **Built-in Validation Rules:** Pre-implemented validators for required fields and length constraints.
- **Extensible Architecture:** Abstract `validate` method allows specialized validators to implement custom validation logic.
- **Method Chaining:** All methods return `this` for fluent API usage.

### Core Methods

#### `setValidationState(isValid, errorMessage, fieldName): this`

Sets the validation state (validity status and error messages) for a field.

**Parameters:**
- **`isValid`** (`boolean`): The validation status (`true` for valid, `false` for invalid).
- **`errorMessage`** (`string | string[]`): The error message(s) to associate with the field if invalid.
- **`fieldName`** (`string`): The name of the input field to update.

**Returns:** The current instance for method chaining.

#### `getState(fieldName): FieldStateValidating`

Retrieves the current validation state of a field.

**Parameters:**
- **`fieldName`** (`string`): The name of the input field to check.

**Returns:** An object containing:
- `isValid` (`boolean`) - The validity status of the field.
- `errors` (`string[]`) - An array of error messages associated with the field.

#### `validate(value, fieldName, optionsValidate, ignoreMergeWithDefaultOptions?): Promise<this> | this`

Abstract method that executes the specific validation logic for a field. This method supports both synchronous and asynchronous validation.

**Parameters:**
- **`value`** (`DataInput`): The value to be validated.
- **`fieldName`** (`string`): The name of the field.
- **`optionsValidate`** (`any`): Configuration object containing validation rules.
- **`ignoreMergeWithDefaultOptions?`** (`boolean`): If `true`, default options will not be merged with provided options.

**Returns:** The instance (`this`) for synchronous validation, or a Promise resolving to the instance for asynchronous validation.

### Protected Helper Methods

#### `requiredValidator(value, fieldName, required?): this`

Built-in validation rule that checks if the field value is present when marked as required.

**Parameters:**
- **`value`** (`string | undefined`): The field value to validate.
- **`fieldName`** (`string`): The name of the field.
- **`required?`** (`boolean`): If `true`, the field cannot be empty.

**Returns:** The current instance for method chaining.

#### `lengthValidator(value, fieldName, minLength?, maxLength?): this`

Built-in validation rule that checks if the field value respects minimum and maximum length constraints.

**Parameters:**
- **`value`** (`string`): The field value to validate.
- **`fieldName`** (`string`): The name of the field.
- **`minLength?`** (`number`): The minimum allowed length.
- **`maxLength?`** (`number`): The maximum allowed length.

**Returns:** The current instance for method chaining.

#### `getRawStringValue(value?): string`

Converts any input value to a raw string representation, handling `null` and `undefined` gracefully.

**Parameters:**
- **`value?`** (`string | any`): The value to convert.

**Returns:** A string representation of the input, or an empty string if the input is `null` or `undefined`.

### Properties

- **`formErrorStore`** (read-only): Provides access to the central error management store (`FormErrorStoreInterface`).

## Class `TextareaValidator` {#TextareaValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `TextareaValidator` class is a specialized validator for textarea input fields. It extends `AbstractFieldValidator` and follows the **singleton pattern** to provide a single, globally accessible instance for consistent textarea validation throughout your application.

### Key Features

- **Singleton Pattern:** Ensures only one instance exists globally for efficient resource management.
- **Textarea-Specific Validation:** Delegates to `TextInputValidator` for robust text validation.
- **Consistent Error Handling:** Inherits error state management from the base abstract class.
- **Method Chaining:** Returns `this` for fluent API usage.

### Getting an Instance

```typescript
import { textareaInputValidator } from '@wlindabla/form_validator'
```

### Validating Textarea Input

```typescript
import { TextInputOptions } from '@wlindabla/form_validator';

const textareaValue = "This is a longer text for textarea field";
const fieldName = "message";
const options = {
    requiredInput: true,
    minLength: 10,
    maxLength: 500,
    errorMessageInput: "Message must be between 10 and 500 characters."
};

textareaInputValidator.validate(textareaValue, fieldName, options);

if (!textareaInputValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = textareaInputValidator.getState(fieldName);
    console.log(`Validation errors for ${fieldName}:`, errors);
} else {
    console.log(`${fieldName} is valid.`);
}
```

### Methods

#### `validate(value, targetInputname, optionsinputtext, ignoreMergeWithDefaultOptions?): this`

Executes validation logic for the textarea field using text input validation rules.

**Parameters:**
- **`value`** (`string | undefined`): The textarea value to be validated.
- **`targetInputname`** (`string`): The name of the textarea field for error reporting.
- **`optionsinputtext`** (`TextInputOptions`): An object containing validation rules (same as `TextInputValidator`):
  - `requiredInput?: boolean` - If `true`, the field cannot be empty.
  - `minLength?: number` - The minimum allowed length.
  - `maxLength?: number` - The maximum allowed length.
  - `regexValidator?: RegExp` - A custom regex pattern to validate against.
  - `errorMessageInput?: string` - Custom error message for validation failures.
  - `escapestripHtmlAndPhpTags?: boolean` - If `true`, HTML and PHP tags are escaped/stripped.
  - `egAwait?: string` - Example of expected format.
- **`ignoreMergeWithDefaultOptions?`** (`boolean`, optional): If `true`, default options will not be merged. Defaults to `false`.

**Returns:** The current instance for method chaining.

### Exported Instance

- **`textareaInputValidator`**: The singleton instance ready for immediate use throughout your application.

## Class `TelInputValidator` {#TelInputValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `TelInputValidator` class is a specialized validator for international phone numbers. It extends `AbstractFieldValidator` and uses the `libphonenumber-js` library to validate phone numbers in international format. This class follows the **singleton pattern** to ensure a single, globally accessible instance for consistent phone number validation.

### Key Features

- **International Format Validation:** Enforces phone numbers in international format (starting with '+').
- **libphonenumber-js Integration:** Validates phone numbers against international phone number standards.
- **Country-Specific Validation:** Supports default country code for more accurate validation.
- **Auto-Formatting:** Automatically formats valid phone numbers to international format.
- **jQuery Integration:** Updates the input field with formatted number (if jQuery is available).
- **Flexible Error Messages:** Customizable error messages with format examples.
- **Length Constraints:** Supports minimum and maximum length validation.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Getting an Instance

```typescript
import { telInputValidator } from '@wlindabla/form_validator'
```

### Validating Phone Numbers

```typescript
const phone = "+229016725186";
const fieldName = "phone";
const options = {
    defaultCountry: 'BJ',
    egAwait: '+229 01 67 25 18 86',
    requiredInput: true
};

telInputValidator.validate(phone, fieldName, options);

if (!telInputValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = telInputValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Phone number is valid.`);
}
```

### Additional Examples

#### French Phone Number

```typescript
telInputValidator.validate('+33612345678', 'mobile', {
    defaultCountry: 'FR',
    errorMessageInput: 'Ce numéro de téléphone est invalide.',
    minLength: 10,
    maxLength: 20
});
```

#### With Custom Format Example

```typescript
telInputValidator.validate('+1234567890', 'contact_phone', {
    defaultCountry: 'US',
    egAwait: '+1 (234) 567-8900',
    minLength: 7,
    maxLength: 15
});
```

### Interface

#### `TelInputOptions`

Extends `TextInputOptions` with phone-specific configuration:

- **`defaultCountry`** (`CountryCode`): ISO 2-letter country code (e.g., `'FR'`, `'BJ'`, `'US'`). Used as fallback for parsing.

Inherited from `TextInputOptions`:
- `requiredInput?: boolean` - If `true`, the field cannot be empty.
- `minLength?: number` - Minimum number of characters (default: 8).
- `maxLength?: number` - Maximum number of characters (default: 80).
- `errorMessageInput?: string` - Custom error message.
- `egAwait?: string` - Example format to display on error.

### Methods

#### `validate(value, targetInputname, optionsinputTel): this`

Validates a phone number in international format using `libphonenumber-js`.

**Parameters:**
- **`value`** (`string | undefined`): The phone number input string (should be trimmed and preferably start with '+').
- **`targetInputname`** (`string`): The name of the form field to validate.
- **`optionsinputTel`** (`TelInputOptions`): Configuration object for validation:
  - `defaultCountry` - ISO 2-letter country code for fallback validation.
  - `egAwait?: string` - Example format to show on validation failure.
  - `errorMessageInput?: string` - Custom error message.
  - `minLength?: number` - Minimum allowed characters.
  - `maxLength?: number` - Maximum allowed characters.
  - `requiredInput?: boolean` - Whether the field is mandatory.

**Returns:** The current instance for method chaining.

**Validation Flow:**
1. Checks if number starts with '+' (international format requirement).
2. Validates using `libphonenumber-js` with optional country fallback.
3. Auto-formats valid numbers to international format.
4. Updates input field with formatted number (if jQuery available).
5. Validates length constraints and required status.

### Exported Instance

- **`telInputValidator`**: The singleton instance ready for immediate use throughout your application.

### External Resources

For more information about phone number formatting capabilities, see [libphonenumber-js documentation](https://gitlab.com/catamphetamine/libphonenumber-js).

## Class `PasswordInputValidator` {#PasswordInputValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `PasswordInputValidator` class is a specialized validator for password fields with advanced security features. It extends `AbstractFieldValidator` and follows the **singleton pattern**. This validator checks character requirements (uppercase, lowercase, numbers, symbols, punctuation), validates length constraints, and can analyze and score password strength using custom analysis algorithms.

### Key Features

- **Comprehensive Character Requirements:** Validate uppercase, lowercase, numbers, symbols, and punctuation separately.
- **Custom Regex Support:** Override default character validation patterns with custom regex expressions.
- **Password Strength Scoring:** Analyzes password complexity and calculates a strength score.
- **Custom Events:** Dispatches `SCOREANALYSISPASSWORD` event with detailed strength analysis.
- **Flexible Configuration:** Highly customizable rules with intelligent default merging.
- **Method Chaining:** Returns `this` for fluent API usage.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Getting an Instance

```typescript
import { passwordInputValidator } from '@wlindabla/form_validator'
```

### Basic Password Validation

```typescript
const password = "MySecur3P@ss!";
const fieldName = "newPassword";

passwordInputValidator.validate(password, fieldName, {
    minLength: 12,
    upperCaseAllow: true,
    lowerCaseAllow: true,
    numberAllow: true,
    symbolAllow: true,
    requiredInput: true
});

if (!passwordInputValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = passwordInputValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Password is valid.`);
}
```

### Password Validation with Scoring

```typescript
const password = "MySecurePassword123!@#";
const fieldName = "password";

passwordInputValidator.validate(password, fieldName, {
    minLength: 10,
    maxLength: 128,
    upperCaseAllow: true,
    lowerCaseAllow: true,
    numberAllow: true,
    symbolAllow: true,
    punctuationAllow: true,
    enableScoring: true
});

// Listen to password strength score event
document.addEventListener(SCOREANALYSISPASSWORD, (event) => {
    const { input, score, analysis } = event.detail;
    console.log(`Field: ${input}`);
    console.log(`Strength Score: ${score}`);
    console.log(`Analysis:`, analysis);
});
```

### Advanced Configuration with Custom Regex

```typescript
const customUpperRegex = /[A-Z]/;
const customNumberRegex = /\d{2,}/; // Requires at least 2 digits

passwordInputValidator.validate("Password123", "secureField", {
    minLength: 8,
    maxLength: 64,
    upperCaseAllow: true,
    lowerCaseAllow: true,
    numberAllow: true,
    symbolAllow: false,
    customUpperRegex: customUpperRegex,
    customNumberRegex: customNumberRegex,
    enableScoring: true,
    requiredInput: true
});
```

### Interface

#### `PassworkRuleOptions`

Extends `TextInputOptions` with password-specific configuration:

**Character Type Allowances:**
- `upperCaseAllow?: boolean` - Allow uppercase letters.
- `lowerCaseAllow?: boolean` - Allow lowercase letters.
- `numberAllow?: boolean` - Allow numeric digits.
- `symbolAllow?: boolean` - Allow special symbols.
- `punctuationAllow?: boolean` - Allow punctuation characters.

**Custom Regex Patterns:**
- `customUpperRegex?: RegExp` - Custom pattern for uppercase validation.
- `customLowerRegex?: RegExp` - Custom pattern for lowercase validation.
- `customNumberRegex?: RegExp` - Custom pattern for number validation.
- `customSymbolRegex?: RegExp` - Custom pattern for symbol validation.
- `customPunctuationRegex?: RegExp` - Custom pattern for punctuation validation.

**Scoring Options:**
- `enableScoring?: boolean` - Enable password strength analysis and scoring.
- `scoringPasswordOptions?: WordScoringOptions` - Custom scoring configuration.

**Inherited from `TextInputOptions`:**
- `minLength?: number` - Minimum password length (default: 8).
- `maxLength?: number` - Maximum password length (default: 256).
- `regexValidator?: RegExp` - Custom regex for overall password format.
- `requiredInput?: boolean` - Whether password is mandatory.
- `errorMessageInput?: string` - Custom error message.

### Methods

#### `validate(value, targetInputname, optionsValidate, ignoreMergeWithDefaultOptions?): this`

Validates a password field with customizable rules and optional strength scoring.

**Parameters:**
- **`value`** (`string | undefined`): The password input string to validate.
- **`targetInputname`** (`string`): The name/identifier of the password field.
- **`optionsValidate`** (`PassworkRuleOptions`): Configuration object for password validation.
- **`ignoreMergeWithDefaultOptions?`** (`boolean`, optional): If `true`, skips merging with default options. Defaults to `false`.

**Returns:** The current instance for method chaining.

**Validation Flow:**
1. Merges provided options with smart defaults.
2. Validates length constraints using `TextInputValidator`.
3. Checks each required character type (uppercase, lowercase, numbers, symbols, punctuation).
4. If scoring is enabled, analyzes password complexity and dispatches `SCOREANALYSISPASSWORD` event.

### Events

#### `SCOREANALYSISPASSWORD`

A custom event dispatched when password scoring is enabled. The event detail object contains:

```typescript
{
    input: string,           // Name of the validated password field
    score: number,          // Numeric strength score
    analysis: {             // Detailed character analysis
        uppercase: number,
        lowercase: number,
        numbers: number,
        symbols: number,
        punctuation: number
    }
}
```

**Listening to the Event:**

```typescript
document.addEventListener('scoreAnalysisPassword', (event) => {
    const { input, score, analysis } = event.detail;
    
    if (score > 80) {
        console.log('Strong password');
    } else if (score > 50) {
        console.log('Medium password');
    } else {
        console.log('Weak password');
    }
});
```

### Default Options

When options are merged with defaults:

- `minLength`: 8
- `maxLength`: 256
- `upperCaseAllow`: true
- `lowerCaseAllow`: true
- `numberAllow`: true
- `symbolAllow`: true
- `punctuationAllow`: true
- `requiredInput`: true
- `enableScoring`: true

### Exported Instance

- **`passwordInputValidator`**: The singleton instance ready for immediate use throughout your application.

## Class `NumberInputValidator` {#NumberInputValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `NumberInputValidator` class is a specialized validator for numeric input fields. It extends `AbstractFieldValidator` and follows the **singleton pattern**. This validator checks numeric constraints such as minimum/maximum values, step multiples, and can validate against custom regex patterns for format validation.

### Key Features

- **Type-Flexible Input:** Accepts both string and number types; automatically parses strings to floats.
- **Min/Max Validation:** Enforces minimum and maximum numeric boundaries.
- **Step Validation:** Ensures values are valid multiples of a specified step.
- **Regex Pattern Support:** Optional custom regex validation for format checking.
- **Precision Handling:** Uses epsilon comparison for accurate floating-point validation.
- **Clear Error Messages:** Provides contextual error messages with validation constraints.
- **Method Chaining:** Returns `this` for fluent API usage.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Getting an Instance

```typescript
import { numberInputValidator } from '@wlindabla/form_validator'
```

### Basic Number Validation

```typescript
const value = 25;
const fieldName = "age";

numberInputValidator.validate(value, fieldName, {
    min: 18,
    max: 100
});

if (!numberInputValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = numberInputValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Age is valid.`);
}
```

### Validation with Step Constraint

```typescript
// Only allows values: 0, 5, 10, 15, 20, etc.
numberInputValidator.validate("15", "quantity", {
    min: 0,
    max: 100,
    step: 5
});
```

### Validation with Custom Regex

```typescript
// Validate a price format (e.g., "19.99")
const priceRegex = /^\d+(\.\d{2})?$/;

numberInputValidator.validate("29.99", "price", {
    min: 0,
    max: 999999,
    regexValidator: priceRegex
});
```

### String Input Parsing

```typescript
// String inputs are automatically parsed to float
numberInputValidator.validate("42.5", "score", {
    min: 0,
    max: 100
});

// Invalid numbers are caught
numberInputValidator.validate("abc", "value", {
    min: 0,
    max: 100
});
// Error: "Please enter a valid number."
```

### Interface

#### `NumberOptions`

Configuration object for numeric validation:

- **`min?: number`** - Minimum allowable value (inclusive).
- **`max?: number`** - Maximum allowable value (inclusive).
- **`step?: number`** - Required step multiple. Values must be `min + (n * step)` where n ≥ 0.
- **`regexValidator?: RegExp`** - Optional regex pattern to validate the input format.

### Methods

#### `validate(val, targetInputname, options_number?): this`

Validates a numeric input value against configurable constraints.

**Parameters:**
- **`val`** (`string | number`): The value to validate. Strings are automatically parsed to floats.
- **`targetInputname`** (`string`): The name/identifier of the numeric field.
- **`options_number?`** (`NumberOptions`): Optional configuration object containing validation rules.

**Returns:** The current instance for method chaining.

**Validation Flow:**
1. Converts string input to float via `parseFloat()`.
2. Checks if the value is a valid number (`!isNaN`).
3. Validates against minimum and maximum bounds (if specified).
4. Validates step constraint with floating-point precision tolerance (epsilon: 1e-8).
5. Validates against custom regex pattern (if provided).

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Input is not a number | "Please enter a valid number." |
| Value below min or above max | "Value must be between [min] and [max]." |
| Not a multiple of step | "The value [val] must be a multiple of [step]." |
| Fails regex validation | "The input does not match the expected format." |

### Examples

#### Range Validation

```typescript
numberInputValidator.validate(50, "age", {
    min: 0,
    max: 150
});
```

#### Step-Based Validation (Shopping Cart)

```typescript
// Only allow quantities in increments of 6 (eggs per carton)
numberInputValidator.validate(12, "quantity", {
    min: 6,
    max: 120,
    step: 6  // Valid: 6, 12, 18, 24...
});
```

#### Temperature Validation

```typescript
numberInputValidator.validate(-5.5, "temperature", {
    min: -50,
    max: 50,
    step: 0.5
});
```

### Exported Instance

- **`numberInputValidator`**: The singleton instance ready for immediate use throughout your application.


## Class `DateInputValidator` {#DateInputValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `DateInputValidator` class is a specialized validator for date input fields. It extends `AbstractFieldValidator` and implements `DateInputValidatorInterface`. This validator follows the **singleton pattern** and provides comprehensive date validation including format checking, date range validation, and temporal constraints (past/future dates).

### Key Features

- **Flexible Format Support:** Validates dates against custom format patterns (e.g., "YYYY/MM/DD", "DD-MM-YYYY").
- **Strict Mode:** Optional strict format matching that validates exact string length.
- **Multi-Delimiter Support:** Handles various delimiters (/, -, etc.) automatically.
- **Date Range Validation:** Enforces minimum and maximum date boundaries.
- **Temporal Constraints:** Control whether past/future dates are allowed.
- **Two-Digit Year Handling:** Intelligently converts 2-digit years (e.g., "24" → "2024").
- **Invalid Day Detection:** Validates actual calendar dates (e.g., prevents February 30th).
- **Comprehensive Error Messages:** Contextual feedback for each validation failure.
- **Method Chaining:** Returns `this` for fluent API usage.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Getting an Instance

```typescript
import { dateInputValidator } from '@wlindabla/form_validator'
```

### Basic Date Validation

```typescript
const dateString = "2024/06/30";
const fieldName = "eventDate";

dateInputValidator.validate(dateString, fieldName, {
    format: 'YYYY/MM/DD'
});

if (!dateInputValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = dateInputValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Date is valid.`);
}
```

### Birthdate Validation (No Future Dates)

```typescript
dateInputValidator.validate("1990-06-15", "birthdate", {
    format: 'YYYY-MM-DD',
    allowFuture: false,
    maxDate: new Date('2006-01-01') // Must be at least 18 years old
});
```

### Date Range Validation

```typescript
const minDate = new Date('2024-01-01');
const maxDate = new Date('2024-12-31');

dateInputValidator.validate("2024/06/30", "projectDate", {
    format: 'YYYY/MM/DD',
    minDate: minDate,
    maxDate: maxDate
});
```

### Strict Mode Validation

```typescript
// Requires exact format length match
dateInputValidator.validate("01/06/2024", "strictDate", {
    format: 'DD/MM/YYYY',
    strictMode: true,
    delimiters: ['/']
});
```

### Two-Digit Year Handling

```typescript
// "24" is converted to "2024", "95" to "1995"
dateInputValidator.validate("30/06/24", "dateShort", {
    format: 'DD/MM/YY',
    delimiters: ['/']
});
```

### Future-Only Dates

```typescript
dateInputValidator.validate("2025-12-25", "futureEvent", {
    format: 'YYYY-MM-DD',
    allowPast: false
});
```

### Interface

#### `DateInputOptions`

Configuration object for date validation:

- **`format?: string`** - Expected date format pattern (default: 'YYYY/MM/DD'). Examples: 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM-DD-YYYY'.
- **`minDate?: Date`** - Minimum allowable date (inclusive).
- **`maxDate?: Date`** - Maximum allowable date (inclusive).
- **`allowFuture?: boolean`** - If `false`, rejects dates in the future.
- **`allowPast?: boolean`** - If `false`, rejects dates in the past.
- **`delimiters?: string[]`** - Array of allowed delimiters (default: ['/', '-']).
- **`strictMode?: boolean`** - If `true`, the date string length must exactly match the format length.

### Methods

#### `validate(date_input, targetInputname, date_options?): this`

Validates a date string or Date object based on provided formatting and business rules.

**Parameters:**
- **`date_input`** (`string | Date`): The date to validate. Strings are parsed according to the format option.
- **`targetInputname`** (`string`): The name/identifier of the date field.
- **`date_options?`** (`DateInputOptions`): Optional configuration object containing validation rules.

**Returns:** The current instance for method chaining.

**Validation Flow:**
1. Detects delimiter in both format and input string.
2. Compares date and format part counts.
3. Validates each part length matches format (strict or loose mode).
4. Handles two-digit year conversion using pivot logic (current year as reference).
5. Creates ISO Date object with UTC timezone.
6. Validates date exists on actual calendar (catches invalid dates like Feb 30).
7. Checks minimum and maximum date boundaries.
8. Validates temporal constraints (past/future allowance).

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Invalid format pattern | Throws `Error` during development |
| Length mismatch (strict mode) | "Date does not match required length in strict mode." |
| Delimiter not found | "Could not detect delimiter in date." |
| Part count mismatch | "Mismatch between date and format parts." |
| Part length mismatch | "Invalid part: '[value]' does not match '[format]'" |
| Negative year | "Negative years are not supported." |
| Invalid date creation | "Invalid date created from input." |
| Invalid calendar day | "Day mismatch (invalid day in month)." |
| Before min date | "The date must be after [minDate]." |
| After max date | "The date must be before [maxDate]." |
| Future not allowed | "The date '[date]' cannot be in the future." |
| Past not allowed | "The date '[date]' cannot be in the past." |

### Format Patterns

Supported format tokens:

- **`YYYY`** - 4-digit year
- **`YY`** - 2-digit year (auto-converted)
- **`MM`** - 2-digit month (01-12)
- **`DD`** - 2-digit day (01-31)

### Examples

#### Event Registration Date

```typescript
const minEvent = new Date('2024-12-01');
const maxEvent = new Date('2024-12-31');

dateInputValidator.validate("15/12/2024", "eventDate", {
    format: 'DD/MM/YYYY',
    delimiters: ['/'],
    minDate: minEvent,
    maxDate: maxEvent,
    allowFuture: true
});
```

#### Conference Date (Today or Future Only)

```typescript
dateInputValidator.validate("2024-12-25", "conferenceDate", {
    format: 'YYYY-MM-DD',
    allowPast: false,
    minDate: new Date() // Must be today or later
});
```

#### Project Deadline (Strict Format)

```typescript
dateInputValidator.validate("31/12/2024", "deadline", {
    format: 'DD/MM/YYYY',
    strictMode: true,
    delimiters: ['/'],
    allowFuture: true
});
```

### Exported Instance

- **`dateInputValidator`**: The singleton instance ready for immediate use throughout your application.

## Class `FQDNInputValidator` {#FQDNInputValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `FQDNInputValidator` class is a specialized validator for Fully Qualified Domain Names (FQDN). It extends `AbstractFieldValidator` and implements `FQDNInputValidatorInterface`. This class follows the **singleton pattern** and provides comprehensive domain name validation including DNS standards compliance, TLD validation, and internationalization support.

### Key Features

- **DNS Standards Compliance:** Validates domain names according to strict DNS rules.
- **TLD Validation:** Ensures valid top-level domains with optional alphanumeric restrictions.
- **Internationalization Support:** Supports internationalized domain names (IDN) and Punycode (xn--).
- **Label Length Validation:** Enforces maximum 63-character limit per domain label.
- **Character Validation:** Detects invalid characters and full-width character sequences.
- **Flexible Hyphen Rules:** Configurable hyphen allowance with DNS standard compliance.
- **Wildcard Support:** Optional wildcard domain support (e.g., *.example.com).
- **Trailing Dot Handling:** Optional support for trailing dots in FQDN notation.
- **HTML/PHP Tag Stripping:** Automatically escapes dangerous HTML and PHP tags.
- **Asynchronous Validation:** Returns a Promise for consistency with async operations.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Getting an Instance

```typescript
import { fqdnInputValidator } from '@wlindabla/form_validator'
```

### Basic Domain Validation

```typescript
const domain = "example.com";
const fieldName = "website";

await fqdnInputValidator.validate(domain, fieldName, {
    requireTLD: true
});

if (!fqdnInputValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = fqdnInputValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Domain is valid.`);
}
```

### Subdomain Validation

```typescript
await fqdnInputValidator.validate("api.example.com", "subdomain", {
    requireTLD: true,
    allowHyphens: true
});
```

### Internationalized Domain Name

```typescript
// IDN support: münchen.de or Punycode: xn--mnchen-3ya.de
await fqdnInputValidator.validate("münchen.de", "idn_domain", {
    requireTLD: true,
    allowNumericTld: false
});
```

### Wildcard Domain

```typescript
await fqdnInputValidator.validate("*.example.com", "wildcard_domain", {
    allowWildcard: true,
    requireTLD: true
});
```

### With Trailing Dot (FQDN Notation)

```typescript
await fqdnInputValidator.validate("example.com.", "fqdn_with_dot", {
    requireTLD: true,
    allowTrailingDot: true
});
```

### Hyphen-Restricted Domain

```typescript
// Rejects domains containing hyphens
await fqdnInputValidator.validate("my-domain.com", "hyphen_free", {
    requireTLD: true,
    allowHyphens: false
});
```

### Interface

#### `FQDNOptions`

Configuration object for domain name validation:

- **`requireTLD?: boolean`** - If `true`, domain must end with a valid TLD (default: `true`).
- **`allowedUnderscores?: boolean`** - If `true`, underscores are allowed in domain labels (default: `false`).
- **`allowTrailingDot?: boolean`** - If `true`, trailing dot notation (e.g., `example.com.`) is permitted (default: `false`).
- **`allowNumericTld?: boolean`** - If `true`, allows numeric-only TLDs (default: `false`).
- **`allowWildcard?: boolean`** - If `true`, wildcard domains (e.g., `*.example.com`) are allowed (default: `false`).
- **`ignoreMaxLength?: boolean`** - If `true`, bypasses the 63-character-per-label limit (default: `false`).
- **`allowHyphens?: boolean`** - If `true`, hyphens are allowed in domain labels (default: `true`). Note: DNS standard permits hyphens only in the middle of labels.

### Methods

#### `validate(input, targetInputname, fqdnOptions?, ignoreMergeWithDefaultOptions?): Promise<this>`

Validates a Fully Qualified Domain Name (FQDN) input field.

**Parameters:**
- **`input`** (`string`): The input string representing the domain name (e.g., `example.com`).
- **`targetInputname`** (`string`): The name/identifier of the domain field for error reporting.
- **`fqdnOptions?`** (`FQDNOptions`): Optional configuration object containing validation rules.
- **`ignoreMergeWithDefaultOptions?`** (`boolean`, optional): If `true`, default options are not merged. Defaults to `false`.

**Returns:** A Promise resolving to the current instance for method chaining.

**Validation Flow:**
1. Clears previous field state.
2. Merges provided options with defaults.
3. Escapes HTML and PHP tags from input.
4. Removes trailing dot (if enabled).
5. Removes wildcard prefix (if enabled).
6. Extracts and validates TLD format and content.
7. For each domain label:
   - Validates label length (≤ 63 characters).
   - Checks for invalid characters and full-width sequences.
   - Enforces DNS hyphen rules (no leading/trailing hyphens, except `xn--`).
   - Validates hyphen allowance setting.
   - Validates underscore restrictions.

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Missing or invalid TLD | "the hostname [domain] does not contain a valid top-level domain." |
| Invalid TLD format | "[domain] has an invalid top-level domain (TLD). Only alphabetic or internationalized TLDs are allowed." |
| TLD contains spaces | "[domain] must not use a TLD with spaces" |
| Numeric TLD not allowed | "[domain] must not use a numeric TLD." |
| Label exceeds 63 characters | "[domain] contains a label longer than 63 characters." |
| Invalid characters | "[domain] contains invalid characters." |
| Full-width characters | "[domain] contains full-width characters." |
| Hyphen at start/end | "[domain] contains a label starting or ending with '-'." |
| Hyphens not allowed | "[domain] must not contain hyphens ('-') as this is disallowed by settings." |
| Underscores not allowed | "[domain] must not contain underscores." |

### Default Options

When options are merged with defaults:

```typescript
{
    requireTLD: true,           // Domain must have a TLD (.com, .org, etc.)
    allowedUnderscores: false,  // Underscores forbidden (DNS standard)
    allowTrailingDot: false,    // Trailing dot forbidden
    allowNumericTld: false,     // Numeric-only TLDs forbidden
    allowWildcard: false,       // Wildcard domains forbidden
    ignoreMaxLength: false,     // Enforce 63-char-per-label limit
    allowHyphens: true          // Hyphens allowed (DNS standard)
}
```

### Examples

#### Corporate Email Domain

```typescript
await fqdnInputValidator.validate("company.com", "email_domain", {
    requireTLD: true,
    allowHyphens: true,
    allowWildcard: false
});
```

#### API Subdomain with Strict Rules

```typescript
await fqdnInputValidator.validate("api.production.example.com", "api_domain", {
    requireTLD: true,
    allowHyphens: false,
    allowedUnderscores: false,
    ignoreMaxLength: false
});
```

#### Internationalized Domain Support

```typescript
// Supports both unicode and Punycode (xn--)
await fqdnInputValidator.validate("日本.jp", "intl_domain", {
    requireTLD: true,
    allowNumericTld: false
});
```

#### Production DNS Record

```typescript
await fqdnInputValidator.validate("example.com.", "dns_record", {
    requireTLD: true,
    allowTrailingDot: true,
    allowHyphens: true
});
```

### DNS Standards Reference

- **Label**: Part of domain between dots (max 63 characters)
- **TLD**: Top-level domain (e.g., .com, .org, .fr)
- **IDN**: Internationalized Domain Names (Unicode support)
- **Punycode**: ASCII-compatible encoding of IDN (xn-- prefix)
- **FQDN**: Fully Qualified Domain Name with trailing dot

### Exported Instance

- **`fqdnInputValidator`**: The singleton instance ready for immediate use throughout your application.

## Class `EmailInputValidator` {#EmailInputValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `EmailInputValidator` class is a specialized validator for email addresses. It extends `AbstractFieldValidator` and implements `EmailInputValidatorInterface`. This class follows the **singleton pattern** and provides comprehensive email validation including RFC 2822 compliance, display name support, domain validation, IP address support, and host whitelist/blacklist functionality.

### Key Features

- **RFC 2822 Compliance:** Validates email format according to RFC 2822 standards.
- **Display Name Support:** Optional validation for display names (e.g., "John Doe <john@example.com>").
- **UTF-8 Local Part Support:** Supports internationalized email addresses.
- **Quoted Local Part:** Validates quoted email local parts.
- **IP Address Domains:** Optional support for email domains using IP addresses (e.g., user@[192.168.1.1]).
- **Host Whitelist/Blacklist:** Control which domains are allowed or forbidden.
- **Blacklisted Characters:** Define forbidden characters in email local parts.
- **FQDN Validation:** Delegates domain validation to `FQDNInputValidator`.
- **Length Constraints:** Validates RFC-compliant length limits (64 chars local, 254 chars total).
- **Asynchronous Validation:** Returns a Promise for domain verification.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Getting an Instance

```typescript
import { emailInputValidator } from '@wlindabla/form_validator'
```

### Basic Email Validation

```typescript
const email = "john.doe@example.com";
const fieldName = "email";

await emailInputValidator.validate(email, fieldName, {
    requiredInput: true
});

if (!emailInputValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = emailInputValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Email is valid.`);
}
```

### Email with Display Name

```typescript
await emailInputValidator.validate(
    "John Doe <john@example.com>",
    "contact_email",
    {
        allowDisplayName: true,
        requiredInput: true
    }
);
```

### Required Display Name

```typescript
await emailInputValidator.validate(
    "Jane Smith <jane.smith@company.com>",
    "sender_email",
    {
        requireDisplayName: true
    }
);
// Error if no display name present
```

### Email with Host Whitelist

```typescript
// Only allow corporate domain emails
await emailInputValidator.validate("employee@company.com", "work_email", {
    hostWhitelist: ["company.com", "subsidiary.com"],
    requiredInput: true
});
```

### Email with Host Blacklist

```typescript
// Reject disposable email services
await emailInputValidator.validate("user@gmail.com", "registration_email", {
    hostBlacklist: ["tempmail.com", "10minutemail.com", /^.*\.temporary\..*$/],
    requiredInput: true
});
```

### IP Address Domain Support

```typescript
await emailInputValidator.validate("user@[192.168.1.100]", "server_email", {
    allowIpDomain: true,
    requiredInput: true
});
```

### UTF-8 Local Part (Internationalized)

```typescript
await emailInputValidator.validate("françois@example.fr", "intl_email", {
    allowUtf8LocalPart: true
});
```

### Quoted Local Part

```typescript
// Supports special characters when quoted
await emailInputValidator.validate(
    '"john..doe"@example.com',
    "quoted_email",
    {
        allowQuotedLocal: true
    }
);
```

### Blacklisted Characters

```typescript
// Reject emails containing specific characters in local part
await emailInputValidator.validate("user@example.com", "filtered_email", {
    blacklistedChars: "*#!",
    requiredInput: true
});
```

### Interface

#### `EmailInputOptions`

Extends `FQDNOptions` and `TextInputOptions` with email-specific configuration:

**Email-Specific Options:**
- **`allowUtf8LocalPart?: boolean`** - Allow non-ASCII characters in local part (default: `true`).
- **`allowIpDomain?: boolean`** - Allow IP addresses as email domain (default: `false`).
- **`allowQuotedLocal?: boolean`** - Allow quoted local part syntax (default: `true`).
- **`ignoreMaxLength?: boolean`** - Bypass RFC length limits (default: `false`).
- **`hostBlacklist?: Array<string | RegExp>`** - Array of forbidden domains or patterns.
- **`hostWhitelist?: Array<string | RegExp>`** - Array of allowed domains or patterns (if set, only these are allowed).
- **`blacklistedChars?: string`** - String of forbidden characters in local part.
- **`requireDisplayName?: boolean`** - If `true`, display name is mandatory (default: `false`).
- **`allowDisplayName?: boolean`** - If `true`, display name is optional but allowed (default: `false`).

**Inherited from FQDNOptions:**
- `requireTLD`, `allowedUnderscores`, `allowTrailingDot`, `allowNumericTld`, `allowWildcard`, `allowHyphens`

**Inherited from TextInputOptions:**
- `requiredInput`, `minLength`, `maxLength`, `errorMessageInput`, `egAwait`

### Methods

#### `validate(datainput, targetInputname, optionsinputemail): Promise<this>`

Validates an email address with comprehensive RFC 2822 compliance and configurable rules.

**Parameters:**
- **`datainput`** (`string`): The email address to validate.
- **`targetInputname`** (`string`): The name/identifier of the email field.
- **`optionsinputemail`** (`EmailInputOptions`): Configuration object containing validation rules.

**Returns:** A Promise resolving to the current instance for method chaining.

**Validation Flow:**
1. Clears previous field state.
2. Merges provided options with defaults.
3. Extracts and validates display name (if enabled).
4. Validates email format using regex.
5. Validates length constraints (6-254 characters default).
6. Splits email into local and domain parts.
7. Checks host whitelist/blacklist.
8. Validates part lengths (local ≤ 64, domain ≤ 254).
9. Handles IP address domains (if enabled).
10. Validates FQDN domain via `FQDNInputValidator`.
11. Checks blacklisted characters.
12. Validates local part format (quoted or standard).

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Missing display name (required) | "field must include a display name like \"John Doe <example@email.com>\"" |
| Invalid display name format | "Display name contains illegal characters and must be enclosed in double quotes." |
| Blacklisted domain | "field contains a blacklisted domain: \"[domain]\"." |
| Domain not in whitelist | "[domain] must belong to one of the allowed domains." |
| Part length exceeded | "[email] is too long. The local part must be ≤ 64 characters and the domain ≤ 254 characters." |
| IP domain not allowed | "[domain] must not contain an IP domain." |
| Invalid IP address | "[ip] contains an invalid IP address in domain." |
| Invalid local part | "The segment \"[part]\" in the local part of the email is invalid." |
| Blacklisted character | "[local] must not contain the forbidden character(s): [chars]" |

### Display Name Format

Supported display name formats (RFC 2822):

```
John Doe <john@example.com>
"John, Doe" <john@example.com>
john@example.com  (no display name)
```

Special characters in display names require:
- Enclosure in double quotes: `"John; Doe" <john@example.com>`
- Proper escaping of internal quotes: `"John \"Doc\" Doe" <john@example.com>`

### Local Part Variants

**Standard Format:**
```
user@example.com
john.doe@example.com
test+tag@example.com
```

**Quoted Format:**
```
"user name"@example.com
"user+special"@example.com
```

**UTF-8 (International):**
```
françois@example.fr
用户@example.cn
```

### Default Options

When options are merged with defaults:

```typescript
{
    allowUtf8LocalPart: true,
    allowIpDomain: false,
    allowQuotedLocal: true,
    ignoreMaxLength: false,
    hostBlacklist: [],
    hostWhitelist: [],
    blacklistedChars: '',
    requireDisplayName: false,
    allowDisplayName: false,
    requiredInput: true,
    minLength: 6,
    maxLength: 254
}
```

### Examples

#### Corporate Email with Whitelist

```typescript
await emailInputValidator.validate("employee@acme.com", "work_email", {
    hostWhitelist: ["acme.com", "subsidiary.acme.com"],
    requireDisplayName: false,
    requiredInput: true
});
```

#### Newsletter Signup (Avoid Disposables)

```typescript
await emailInputValidator.validate("user@domain.com", "newsletter", {
    hostBlacklist: [
        /^.*\.temp\..*$/,
        "10minutemail.com",
        "guerrillamail.com"
    ],
    allowDisplayName: true
});
```

#### Internationalized Email

```typescript
await emailInputValidator.validate(
    "用户@example.cn",
    "intl_contact",
    {
        allowUtf8LocalPart: true,
        allowDisplayName: false
    }
);
```

#### Government Agency Email (Strict)

```typescript
await emailInputValidator.validate(
    "John Smith <jsmith@agency.gov>",
    "official_email",
    {
        requireDisplayName: true,
        hostWhitelist: /^.*\.gov$/,
        allowUtf8LocalPart: false,
        blacklistedChars: "*#!@"
    }
);
```

### RFC References

- **RFC 2822:** Internet Message Format - [https://tools.ietf.org/html/rfc2822](https://tools.ietf.org/html/rfc2822)
- **Display Name Syntax:** Appendix A.1.2

### Exported Instance

- **`emailInputValidator`**: The singleton instance ready for immediate use throughout your application.
  ## Class `URLInputValidator` {#URLInputValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `URLInputValidator` class is a specialized validator for URL input fields. It extends `AbstractFieldValidator` and implements `URLInputValidatorInterface`. This class follows the **singleton pattern** and provides comprehensive URL validation including protocol enforcement, host validation, IP/localhost support, query parameter control, and host whitelist/blacklist functionality.

### Key Features

- **Protocol Validation:** Enforce specific protocols (http, https, ftp, etc.).
- **Host Validation:** Validate hostnames using FQDN standards via `FQDNInputValidator`.
- **IP Address Support:** Optional validation of IPv4 and IPv6 addresses.
- **Localhost Handling:** Configurable support for localhost and 127.0.0.1.
- **Query Parameter Control:** Allow or deny query strings (?key=value).
- **URL Fragment Control:** Allow or deny URL fragments (#section).
- **Port Validation:** Optional requirement for port specification.
- **Authentication Control:** Reject or allow credentials (user:pass@host).
- **Protocol-Relative URLs:** Optional support for //example.com syntax.
- **Host Whitelist/Blacklist:** Control which domains are allowed or forbidden.
- **Length Validation:** RFC-compliant URL length checks (default 2048 chars).
- **Comprehensive Error Messages:** Contextual feedback for each validation failure.
- **Asynchronous Validation:** Returns a Promise for async domain verification.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Getting an Instance

```typescript
import { urlInputValidator } from '@wlindabla/form_validator'
```

### Basic URL Validation

```typescript
const url = "https://example.com";
const fieldName = "website";

await urlInputValidator.validate(url, fieldName, {
    requireProtocol: true
});

if (!urlInputValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = urlInputValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`URL is valid.`);
}
```

### HTTPS-Only Validation

```typescript
await urlInputValidator.validate("https://secure-api.example.com", "api_url", {
    requireProtocol: true,
    requireValidProtocol: true,
    allowedProtocols: ["https"]
});
```

### URL with Query Parameters

```typescript
await urlInputValidator.validate(
    "https://example.com/search?q=validator&sort=desc",
    "search_url",
    {
        allowQueryParams: true,
        allowHash: true
    }
);
```

### URL with Port Requirement

```typescript
await urlInputValidator.validate("http://localhost:8080/api", "dev_url", {
    allowLocalhost: true,
    requirePort: true,
    requireValidProtocol: true,
    allowedProtocols: ["http"]
});
```

### IP Address URL

```typescript
await urlInputValidator.validate("http://192.168.1.1:3000", "ip_url", {
    allowIP: true,
    requirePort: true
});
```

### URL with Host Whitelist

```typescript
await urlInputValidator.validate("https://api.company.com/data", "corporate_url", {
    hostWhitelist: ["api.company.com", "cdn.company.com"],
    requireProtocol: true
});
```

### URL with Host Blacklist

```typescript
await urlInputValidator.validate("https://example.com", "filtered_url", {
    hostBlacklist: [
        "malware.com",
        /^.*\.suspicious\..*$/
    ],
    requireProtocol: true
});
```

### Protocol-Relative URL

```typescript
await urlInputValidator.validate("//cdn.example.com/assets/style.css", "cdn_url", {
    allowProtocolRelativeUrls: true,
    requireProtocol: false
});
```

### Interface

#### `URLOptions`

Extends `FQDNOptions` and `TextInputOptions` with URL-specific configuration:

**URL-Specific Options:**
- **`allowedProtocols?: string[]`** - Array of allowed protocols (e.g., `["http", "https", "ftp"]`).
- **`requireProtocol?: boolean`** - If `true`, URL must include a protocol (default: `false`).
- **`requireValidProtocol?: boolean`** - If `true`, protocol must be in `allowedProtocols` (default: `true`).
- **`allowLocalhost?: boolean`** - Allow localhost and 127.0.0.1 (default: `false`).
- **`allowIP?: boolean`** - Allow IPv4 and IPv6 addresses (default: `false`).
- **`allowQueryParams?: boolean`** - Allow query parameters (?key=value) (default: `true`).
- **`allowHash?: boolean`** - Allow URL fragments (#section) (default: `true`).
- **`requireHost?: boolean`** - URL must include a hostname (default: `true`).
- **`requirePort?: boolean`** - URL must include a port (default: `false`).
- **`allowProtocolRelativeUrls?: boolean`** - Allow //example.com syntax (default: `false`).
- **`disallowAuth?: boolean`** - Reject credentials (user:pass@host) (default: `false`).
- **`validateLength?: boolean`** - Validate URL length (default: `true`).
- **`maxAllowedLength?: number`** - Maximum URL length in characters (default: `2048`).
- **`hostWhitelist?: (string | RegExp)[]`** - Array of allowed hostnames or patterns.
- **`hostBlacklist?: (string | RegExp)[]`** - Array of forbidden hostnames or patterns.

**Inherited from FQDNOptions:**
- `requireTLD`, `allowedUnderscores`, `allowTrailingDot`, `allowNumericTld`, `allowWildcard`, `allowHyphens`

**Inherited from TextInputOptions:**
- `regexValidator`, `minLength`, `maxLength`, `errorMessageInput`

### Methods

#### `validate(urlData, targetInputname, url_options): Promise<this>`

Validates a URL string according to customizable rules and constraints.

**Parameters:**
- **`urlData`** (`string`): The raw URL string to validate (e.g., "https://example.com").
- **`targetInputname`** (`string`): The name/identifier of the URL field.
- **`url_options`** (`URLOptions`): Configuration object containing validation rules.

**Returns:** A Promise resolving to the current instance for method chaining.

**Validation Flow:**
1. Checks for empty or whitespace-containing values.
2. Rejects mailto: links.
3. Validates length constraints (if enabled).
4. Validates against regex pattern (if provided).
5. Parses URL using native URL API.
6. Extracts and validates protocol.
7. Validates hostname using `FQDNInputValidator`.
8. Enforces protocol requirements and allowed protocols.
9. Checks localhost and IP address allowances.
10. Validates query parameters, fragments, and auth credentials.
11. Checks host whitelist/blacklist.
12. Validates port requirements.

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Empty or whitespace | "The value \"[url]\" is not a valid URL format." |
| mailto: protocol | "The value \"[url]\" is not a valid URL format." |
| Invalid URL format | "The value \"[url]\" is not a valid URL." |
| URL too long | Length validation error from `textInputValidator` |
| Missing protocol (required) | "Protocol is required in the URL." |
| Invalid protocol | "The protocol \"[protocol]\" is not allowed. Allowed protocols: [list]." |
| Missing host (required) | "A hostname is required in the URL." |
| Localhost not allowed | "The hostname \"localhost\" is not allowed." |
| IP addresses not allowed | "IP addresses (IPv4 or IPv6) are not allowed in URLs." |
| Query params not allowed | "Query parameters \"[params]\" are not allowed." |
| Fragments not allowed | "Fragments \"[fragment]\" are not allowed." |
| Protocol-relative not allowed | "Protocol-relative URLs (//example.com) are not allowed." |
| Port required | "The URL must specify a port." |
| Auth credentials not allowed | "Authentication credentials in URLs are not allowed." |
| Host blacklisted | "The hostname \"[host]\" is blacklisted." |
| Host not whitelisted | "The hostname \"[host]\" is not in the allowed list." |

### URL Components Reference

Example URL: `https://user:pass@example.com:443/path?query=value#fragment`

- **Protocol:** `https://`
- **Username:** `user`
- **Password:** `pass`
- **Hostname:** `example.com`
- **Port:** `443`
- **Path:** `/path`
- **Query:** `?query=value`
- **Fragment:** `#fragment`

### Default Options

When options are merged with defaults:

```typescript
{
    allowLocalhost: false,
    allowIP: false,
    allowHash: true,
    allowQueryParams: true,
    requirePort: false,
    requireHost: true,
    maxAllowedLength: 2048,
    validateLength: true,
    regexValidator: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
    allowProtocolRelativeUrls: false,
    requireValidProtocol: true,
    requireProtocol: false,
    allowedProtocols: ["ftp", "https", "http"],
    disallowAuth: false,
    hostBlacklist: [],
    hostWhitelist: []
}
```

### Examples

#### Secure API Endpoint

```typescript
await urlInputValidator.validate(
    "https://api.secure-company.com/v1/data",
    "api_endpoint",
    {
        requireProtocol: true,
        requireValidProtocol: true,
        allowedProtocols: ["https"],
        allowQueryParams: true,
        hostWhitelist: [/^api\..+\.com$/],
        disallowAuth: true
    }
);
```

#### Development Server

```typescript
await urlInputValidator.validate(
    "http://localhost:3000/admin",
    "dev_server",
    {
        allowLocalhost: true,
        requirePort: false,
        allowQueryParams: true,
        allowHash: true,
        requireValidProtocol: true,
        allowedProtocols: ["http"]
    }
);
```

#### Public Website with CDN

```typescript
await urlInputValidator.validate(
    "https://cdn.mysite.com/images/photo.jpg",
    "cdn_resource",
    {
        requireProtocol: true,
        allowedProtocols: ["https"],
        hostWhitelist: ["cdn.mysite.com", "static.mysite.com"],
        allowQueryParams: false,
        allowHash: false
    }
);
```

#### Protocol-Relative URL

```typescript
await urlInputValidator.validate(
    "//example.com/resource",
    "adaptive_url",
    {
        allowProtocolRelativeUrls: true,
        requireProtocol: false
    }
);
```

### Exported Instance

- **`urlInputValidator`**: The singleton instance ready for immediate use throughout your application.

## Class `SelectValidator` {#SelectValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `SelectValidator` class is a specialized validator for select/dropdown input fields. It extends `AbstractFieldValidator` and implements `SelectValidatorInterface`. This class follows the **singleton pattern** and provides validation to ensure that selected values belong to a predefined list of allowed options. Supports both single and multiple selections.

### Key Features

- **Single Selection Validation:** Validates individual selected values against allowed options.
- **Multiple Selection Support:** Validates arrays of selected values (multi-select dropdowns).
- **HTML/PHP Tag Stripping:** Automatically escapes dangerous tags from input.
- **Efficient Lookup:** Uses Set-based lookups for fast validation of multiple selections.
- **Detailed Error Messages:** Lists both invalid values and valid options.
- **Method Chaining:** Returns `this` for fluent API usage.
- **Synchronous Validation:** Immediate validation without async overhead.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Getting an Instance

```typescript
import { selectValidator } from '@wlindabla/form_validator'
```

### Basic Single Select Validation

```typescript
const selectedValue = "apple";
const fieldName = "fruitChoice";

selectValidator.validate(selectedValue, fieldName, {
    optionsChoices: ["apple", "banana", "orange", "grape"]
});

if (!selectValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = selectValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Selection is valid.`);
}
```

### Multi-Select Validation

```typescript
const selectedValues = ["red", "blue"];
const fieldName = "colors";

selectValidator.validate(selectedValues, fieldName, {
    optionsChoices: ["red", "blue", "green", "yellow", "purple"]
});
```

### Invalid Selection (Single)

```typescript
selectValidator.validate("invalid", "fruitChoice", {
    optionsChoices: ["apple", "banana", "orange"]
});
// Error: "The selected value \"invalid\" is not included in the available options: apple | banana | orange"
```

### Invalid Selections (Multiple)

```typescript
selectValidator.validate(
    ["red", "invalid1", "green", "invalid2"],
    "colors",
    {
        optionsChoices: ["red", "green", "blue", "yellow"]
    }
);
// Error: "The selected values \"invalid1, invalid2\" are not included in the available options: red | green | blue | yellow"
```

### With HTML Tag Escaping (Default)

```typescript
selectValidator.validate(
    "<script>alert('xss')</script>",
    "userInput",
    {
        optionsChoices: ["valid1", "valid2", "valid3"],
        escapestripHtmlAndPhpTags: true  // Default: true
    }
);
// Input is escaped before validation
```

### Without HTML Tag Escaping

```typescript
selectValidator.validate(
    "plain_text_value",
    "plainField",
    {
        optionsChoices: ["plain_text_value", "option2"],
        escapestripHtmlAndPhpTags: false
    }
);
```

### Category Selection

```typescript
const userCategory = "premium";
const fieldName = "userLevel";

selectValidator.validate(userCategory, fieldName, {
    optionsChoices: ["free", "standard", "premium", "enterprise"]
});
```

### Status Selection

```typescript
const statuses = ["active", "pending"];

selectValidator.validate(statuses, fieldName, {
    optionsChoices: ["active", "inactive", "pending", "archived", "deleted"]
});
```

### Interface

#### `SelectOptions`

Configuration object for select validation:

- **`optionsChoices`** (`string[]`) - Array of allowed/valid option values.
- **`escapestripHtmlAndPhpTags?: boolean`** - If `true`, escapes HTML and PHP tags from input (default: `true`).

### Methods

#### `validate(value_index, targetInputname, options_select): this`

Validates if the selected value(s) exist within the predefined choices.

**Parameters:**
- **`value_index`** (`string | string[]`): The selected value(s) to validate. Can be a single string or array of strings for multi-select.
- **`targetInputname`** (`string`): The name/identifier of the select field.
- **`options_select`** (`SelectOptions`): Configuration object containing:
  - `optionsChoices` - List of allowed values for selection.
  - `escapestripHtmlAndPhpTags` - Whether to escape HTML/PHP tags (optional).

**Returns:** The current instance for method chaining.

**Validation Flow:**
1. Clears previous field state.
2. Optionally escapes HTML and PHP tags from input.
3. For string input:
   - Checks if value is included in `optionsChoices`.
4. For array input:
   - Uses Set for efficient lookup.
   - Filters out values not in `optionsChoices`.
   - Reports all invalid values together.
5. Sets validation state with appropriate error message if validation fails.

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Single invalid value | "The selected value \"[value]\" is not included in the available options: [choices separated by \|]" |
| Multiple invalid values | "The selected values \"[value1, value2, ...]\" are not included in the available options: [choices separated by \|]" |

### Performance Considerations

- **Single Selection:** O(n) lookup with simple `.includes()` check.
- **Multiple Selection:** O(n + m) using Set-based lookup where n = options count, m = selected values count.

### Security Features

- **XSS Prevention:** Automatically escapes HTML and PHP tags by default.
- **Tag Stripping:** Uses `escapeHtmlBalise` utility for sanitization.
- **Safe Array Validation:** No code execution risk from selected values.

### Usage Examples

#### Country/Region Selector

```typescript
selectValidator.validate("US", "country", {
    optionsChoices: ["US", "CA", "MX", "GB", "FR", "DE"],
    escapestripHtmlAndPhpTags: true
});
```

#### Role-Based Permission Selector

```typescript
const userRoles = ["user", "moderator"];

selectValidator.validate(userRoles, "roles", {
    optionsChoices: ["admin", "user", "moderator", "guest", "banned"],
    escapestripHtmlAndPhpTags: true
});
```

#### Product Category Selection

```typescript
selectValidator.validate("electronics", "category", {
    optionsChoices: [
        "electronics",
        "clothing",
        "books",
        "furniture",
        "sports"
    ]
});
```

#### Language Preference

```typescript
const languages = ["en", "fr", "es"];

selectValidator.validate(languages, "supportedLanguages", {
    optionsChoices: ["en", "fr", "es", "de", "it", "pt", "ja", "zh"],
    escapestripHtmlAndPhpTags: false  // Simple language codes
});
```

#### Payment Method Selection

```typescript
selectValidator.validate("credit_card", "paymentMethod", {
    optionsChoices: [
        "credit_card",
        "debit_card",
        "paypal",
        "bank_transfer",
        "cryptocurrency"
    ]
});
```

### Exported Instance

- **`selectValidator`**: The singleton instance ready for immediate use throughout your application.

## Class `CheckBoxValidator` {#CheckBoxValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `CheckBoxValidator` class is a specialized validator for checkbox input groups. It extends `AbstractFieldValidator` and implements `CheckBoxValidatorInterface`. This class follows the **singleton pattern** and provides validation to ensure that checkbox groups meet specified selection criteria such as minimum/maximum selections and required selections. Delegates to `SelectValidator` for option validation.

### Key Features

- **Minimum Selection Enforcement:** Ensure a minimum number of checkboxes are selected.
- **Maximum Selection Limit:** Enforce a maximum number of checkboxes that can be selected.
- **Required Selection:** Validate that at least one checkbox is selected when required.
- **Option Validation:** Validates selected values against a predefined list of allowed options.
- **Group-Level Validation:** Manages validation across entire checkbox groups.
- **Detailed Error Messages:** Clear feedback on why validation failed.
- **Method Chaining:** Returns `this` for fluent API usage.
- **Synchronous Validation:** Immediate validation without async overhead.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Getting an Instance

```typescript
import { checkboxValidator } from '@wlindabla/form_validator'
```

### Basic Checkbox Group Validation

```typescript
const selectedCount = 2;
const groupName = "interests";

checkboxValidator.validate(selectedCount, groupName, {
    minAllowed: 1,
    maxAllowed: 5,
    optionsChoicesCheckbox: ["sports", "music", "reading", "gaming", "cooking"]
});

if (!checkboxValidator.isFieldValid(groupName)) {
    const {isValid, errors} = checkboxValidator.getState(groupName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Checkbox group is valid.`);
}
```

### Required Checkbox Selection

```typescript
checkboxValidator.validate(0, "termsAccepted", {
    required: true,
    optionsChoicesCheckbox: ["terms_agreed"]
});
// Error: "Please select at least one option in the \"termsAccepted\" group."
```

### Minimum Selection Requirement

```typescript
checkboxValidator.validate(1, "skillsGroup", {
    minAllowed: 2,
    optionsChoicesCheckbox: ["javascript", "typescript", "python", "java", "go"]
});
// Error: "You must select at least 2 options in the \"skillsGroup\" group."
```

### Maximum Selection Limit

```typescript
checkboxValidator.validate(4, "colorsGroup", {
    maxAllowed: 3,
    optionsChoicesCheckbox: ["red", "blue", "green", "yellow", "purple", "orange"]
});
// Error: "You can only select up to 3 options in the \"colorsGroup\" group."
```

### Exact Range Validation

```typescript
const selectedFeatures = 3;

checkboxValidator.validate(selectedFeatures, "featureSelection", {
    minAllowed: 2,
    maxAllowed: 5,
    optionsChoicesCheckbox: ["feature_a", "feature_b", "feature_c", "feature_d", "feature_e"]
});
```

### Single Required Checkbox

```typescript
checkboxValidator.validate(1, "newsletter", {
    required: true,
    dataChoices: "subscribe_newsletter",
    optionsChoicesCheckbox: ["subscribe_newsletter"]
});
```

### Multiple Checkbox Values Validation

```typescript
checkboxValidator.validate(2, "notificationTypes", {
    dataChoices: ["email", "sms"],
    minAllowed: 1,
    maxAllowed: 3,
    optionsChoicesCheckbox: ["email", "sms", "push", "webhook"]
});
```

### Interface

#### `OptionsCheckbox`

Configuration object for checkbox group validation:

- **`minAllowed?: number`** - Minimum number of checkboxes that must be selected.
- **`maxAllowed?: number`** - Maximum number of checkboxes that can be selected.
- **`required?: boolean`** - If `true`, at least one checkbox must be selected (equivalent to `minAllowed: 1`).
- **`dataChoices`** (`string | string[]`) - The selected checkbox value(s) to validate.
- **`optionsChoicesCheckbox`** (`string[]`) - Array of allowed checkbox values/options.

### Methods

#### `validate(checkCount, groupName, options_checkbox?): this`

Validates a group of checkbox inputs based on provided options.

**Parameters:**
- **`checkCount`** (`number`): The number of checkboxes currently selected in the group.
- **`groupName`** (`string`): The name attribute shared by the checkbox inputs in the group (used for error reporting).
- **`options_checkbox?`** (`OptionsCheckbox`): Optional configuration object containing:
  - `minAllowed` - Minimum required selections.
  - `maxAllowed` - Maximum allowed selections.
  - `required` - Whether at least one selection is required.
  - `dataChoices` - Selected values to validate.
  - `optionsChoicesCheckbox` - List of valid checkbox options.

**Returns:** The current instance for method chaining.

**Validation Flow:**
1. Clears previous field state for the group.
2. Returns early if no options provided.
3. Checks if required and count is zero.
4. Checks if count exceeds maximum allowed.
5. Checks if count is below minimum required.
6. Delegates to `SelectValidator` to validate selected values against allowed options.
7. Sets validation state with appropriate error message if any check fails.

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Required but none selected | "Please select at least one option in the \"[groupName]\" group." |
| Exceeds max allowed | "You can only select up to [maxAllowed] options in the \"[groupName]\" group." |
| Below min required | "You must select at least [minAllowed] options in the \"[groupName]\" group." |
| Invalid option selected | (Delegated to `SelectValidator`) |

### Common Use Cases

#### Terms and Conditions Checkbox

```typescript
const isTermsChecked = 1; // 1 checkbox selected

checkboxValidator.validate(isTermsChecked, "agreements", {
    required: true,
    dataChoices: "terms_agreed",
    optionsChoicesCheckbox: ["terms_agreed", "privacy_agreed"]
});
```

#### Multi-Skill Selection (2-4 required)

```typescript
const skillCount = 3;

checkboxValidator.validate(skillCount, "technicalSkills", {
    minAllowed: 2,
    maxAllowed: 4,
    dataChoices: ["javascript", "react", "node"],
    optionsChoicesCheckbox: [
        "javascript",
        "typescript",
        "python",
        "java",
        "go",
        "rust",
        "react",
        "node"
    ]
});
```

#### Notification Preferences (At least 1, up to 3)

```typescript
const notificationMethods = 2;

checkboxValidator.validate(notificationMethods, "notifications", {
    minAllowed: 1,
    maxAllowed: 3,
    dataChoices: ["email", "sms"],
    optionsChoicesCheckbox: ["email", "sms", "push", "in_app"]
});
```

#### Access Level Selection (Exactly 1-2 required)

```typescript
const accessLevels = 1;

checkboxValidator.validate(accessLevels, "accessRoles", {
    minAllowed: 1,
    maxAllowed: 2,
    dataChoices: "viewer",
    optionsChoicesCheckbox: ["viewer", "editor", "admin", "owner"]
});
```

#### Feature Flags Selection (No limit)

```typescript
const enabledFeatures = 4;

checkboxValidator.validate(enabledFeatures, "featureFlags", {
    minAllowed: 0,
    dataChoices: [
        "dark_mode",
        "beta_features",
        "notifications",
        "analytics"
    ],
    optionsChoicesCheckbox: [
        "dark_mode",
        "beta_features",
        "notifications",
        "analytics",
        "export_data",
        "api_access"
    ]
});
```

#### Dietary Restrictions (At least 1 required)

```typescript
const dietaryCount = 2;

checkboxValidator.validate(dietaryCount, "dietary_restrictions", {
    required: true,
    minAllowed: 1,
    maxAllowed: 5,
    dataChoices: ["vegetarian", "gluten_free"],
    optionsChoicesCheckbox: [
        "vegetarian",
        "vegan",
        "gluten_free",
        "dairy_free",
        "nut_free",
        "kosher"
    ]
});
```

### Best Practices

- **Always provide `optionsChoicesCheckbox`** - Define the complete list of valid checkbox options.
- **Use `required` for mandatory groups** - Clearer than `minAllowed: 1`.
- **Set realistic ranges** - Ensure `minAllowed ≤ maxAllowed` when both are specified.
- **Pass actual selected values** - Use `dataChoices` to validate against allowed options.
- **Test boundary conditions** - Verify behavior at min, max, and edge cases.

### Exported Instance

- **`checkboxValidator`**: The singleton instance ready for immediate use throughout your application.

## Class `RadioValidator` {#RadioValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `RadioValidator` class is a specialized validator for radio button input groups. It extends `AbstractFieldValidator` and follows the **singleton pattern**. This validator provides validation to ensure that a radio button selection is made when required. Since radio buttons enforce single selection by design, this validator focuses on the required selection constraint.

### Key Features

- **Required Selection Enforcement:** Validate that a radio button selection is made when required.
- **Null/Undefined Detection:** Properly detects unselected radio button groups.
- **Simple and Lightweight:** Minimal configuration needed for radio validation.
- **Group-Level Validation:** Manages validation across entire radio button groups.
- **Clear Error Messages:** Contextual feedback when validation fails.
- **Method Chaining:** Returns `this` for fluent API usage.
- **Synchronous Validation:** Immediate validation without async overhead.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Getting an Instance

```typescript
import { radioValidator } from '@wlindabla/form_validator'
```

### Basic Radio Group Validation

```typescript
const selectedValue = "option_a";
const groupName = "preference";

radioValidator.validate(selectedValue, groupName, {
    required: true
});

if (!radioValidator.isFieldValid(groupName)) {
    const {isValid, errors} = radioValidator.getState(groupName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Radio selection is valid.`);
}
```

### Required Radio Selection

```typescript
radioValidator.validate(null, "gender", {
    required: true
});
// Error: "Please select an option in the \"gender\" group."
```

### Optional Radio Selection

```typescript
radioValidator.validate(null, "newsletter", {
    required: false
});
// Validation passes - selection is optional
```

### With Selected Value

```typescript
radioValidator.validate("premium", "accountType", {
    required: true
});
// Valid - a radio button is selected
```

### Undefined Selection

```typescript
radioValidator.validate(undefined, "colorScheme", {
    required: true
});
// Error: "Please select an option in the \"colorScheme\" group."
```

### Interface

#### `OptionsRadio`

Configuration object for radio button validation:

- **`required?: boolean`** - If `true`, a radio button selection is mandatory (default: `false`).

### Methods

#### `validate(selectedValue, groupName, options_radio?): this`

Validates a radio button group selection.

**Parameters:**
- **`selectedValue`** (`string | null | undefined`): The currently selected radio button value. `null` or `undefined` indicates no selection.
- **`groupName`** (`string`): The name attribute shared by all radio buttons in the group (used for error reporting).
- **`options_radio?`** (`OptionsRadio`): Optional configuration object containing:
  - `required` - Whether a selection is mandatory.

**Returns:** The current instance for method chaining.

**Validation Flow:**
1. Clears previous field state for the group.
2. Returns early if no options provided.
3. If required and no value selected (`null` or `undefined`), sets validation error.
4. Returns instance for method chaining.

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Required but not selected | "Please select an option in the \"[groupName]\" group." |

### Common Use Cases

#### Gender Selection (Required)

```typescript
radioValidator.validate(selectedGender, "gender", {
    required: true
});
```

#### Account Type (Required)

```typescript
radioValidator.validate(userAccountType, "accountType", {
    required: true
});
// Options: "free", "standard", "premium", "enterprise"
```

#### Subscription Frequency (Optional)

```typescript
radioValidator.validate(subscriptionFrequency, "frequency", {
    required: false
});
// Options: "monthly", "quarterly", "annually"
```

#### Shipping Method (Required)

```typescript
radioValidator.validate(shippingChoice, "shippingMethod", {
    required: true
});
// Options: "standard", "express", "overnight"
```

#### Color Preference (Optional)

```typescript
radioValidator.validate(userTheme, "colorScheme", {
    required: false
});
// Options: "light", "dark", "auto"
```

#### Payment Method (Required)

```typescript
radioValidator.validate(paymentMethod, "paymentOption", {
    required: true
});
// Options: "credit_card", "paypal", "bank_transfer"
```

#### Notification Frequency (Required)

```typescript
radioValidator.validate(notificationPreference, "emailFrequency", {
    required: true
});
// Options: "never", "daily", "weekly", "monthly"
```

### Best Practices

- **Always set `required: true` for mandatory choices** - Ensures user makes an explicit selection.
- **Set `required: false` for optional preferences** - Allows users to skip the question if it doesn't apply.
- **Provide clear radio button labels** - Help users understand each option.
- **Display grouped radio buttons together** - Maintain clear visual grouping.
- **Use consistent naming** - Keep group names and value names consistent throughout your form.

### Radio Button vs Checkbox Differences

| Feature | Radio Button | Checkbox |
|---------|--------------|----------|
| Selection | Single only | Multiple |
| Validator | `RadioValidator` | `CheckBoxValidator` |
| Unselect | Requires new selection | Can uncheck individually |
| Validation | Required/Optional | Min/Max/Required |
| Complexity | Simple | More configurable |

### Example Form Implementation

```typescript
// Gender field (required)
const genderValue = document.querySelector('input[name="gender"]:checked')?.value;
radioValidator.validate(genderValue, "gender", {
    required: true
});

// Account type field (required)
const accountValue = document.querySelector('input[name="accountType"]:checked')?.value;
radioValidator.validate(accountValue, "accountType", {
    required: true
});

// Theme preference (optional)
const themeValue = document.querySelector('input[name="theme"]:checked')?.value;
radioValidator.validate(themeValue, "theme", {
    required: false
});
```

### Exported Instance

- **`radioValidator`**: The singleton instance ready for immediate use throughout your application.

## Abstract Class `AbstractMediaValidator` {#AbstractMediaValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `AbstractMediaValidator` class serves as the foundational base class for all media file validators (images, videos, documents). It extends `AbstractFieldValidator` and implements `MediaValidatorInterface`. This abstract class provides common utilities for validating media files including size validation, extension checking, MIME type validation, file signatures, and dimensional constraints (width/height).

### Key Features

- **File Size Validation:** Validates file sizes against maximum allowed limits with unit conversion.
- **Extension Validation:** Checks file extensions against whitelisted types.
- **MIME Type Validation:** Validates file MIME types (abstract method for subclasses).
- **File Signature Validation:** Verifies file signatures/magic bytes (abstract method for subclasses).
- **Dimension Validation:** Checks image/video width and height constraints.
- **Comprehensive Error Handling:** Structured error reporting with contextual messages.
- **Context-Aware Messages:** Subclasses provide context (image, video, document) in error messages.
- **Asynchronous Support:** Supports async validation for dimension checking.
- **Abstract Methods:** Enforces implementation in subclasses for media-specific logic.

### Protected Helper Methods

#### `sizeValidate(file, targetInputname?, sizeImg?, unitysize?): this`

Validates the size of the media file against a maximum allowed size.

**Parameters:**
- **`file`** (`File`): The file object to validate.
- **`targetInputname?`** (`string`): The name of the input field (default: `'photofile'`).
- **`sizeImg?`** (`number`): Maximum allowed file size (default: `5`).
- **`unitysize?`** (`string`): Unit of measurement (default: `'MiB'`).

**Returns:** The current instance for method chaining.

**Example:**
```typescript
this.sizeValidate(file, "profilePicture", 2, "MiB");
```

#### `extensionValidate(file, targetInputname, allowedExtensions?): string | undefined`

Validates the file extension against a whitelist of allowed extensions.

**Parameters:**
- **`file`** (`File`): The file object to validate.
- **`targetInputname`** (`string`): The name of the input field for error reporting.
- **`allowedExtensions?`** (`string[]`): Array of allowed file extensions (e.g., `["jpg", "png", "gif"]`).

**Returns:** The file extension in lowercase, or `undefined` if not found.

**Example:**
```typescript
this.extensionValidate(file, "avatar", ["jpg", "png", "webp"]);
```

#### `heightValidate(file, targetInputname, minHeight?, maxHeight?, unity_dimensions?): Promise<this>`

Validates the media height against minimum and maximum constraints.

**Parameters:**
- **`file`** (`File`): The file object to validate.
- **`targetInputname`** (`string`): The name of the input field.
- **`minHeight?`** (`number`): Minimum allowed height.
- **`maxHeight?`** (`number`): Maximum allowed height.
- **`unity_dimensions?`** (`string`): Unit of measurement for dimensions (default: `"px"`).

**Returns:** A Promise resolving to the current instance for method chaining.

**Example:**
```typescript
await this.heightValidate(file, "thumbnail", 100, 500, "px");
```

#### `widthValidate(file, targetInputname, minWidth?, maxWidth?, unity_dimensions?): Promise<this>`

Validates the media width against minimum and maximum constraints.

**Parameters:**
- **`file`** (`File`): The file object to validate.
- **`targetInputname`** (`string`): The name of the input field.
- **`minWidth?`** (`number`): Minimum allowed width.
- **`maxWidth?`** (`number`): Maximum allowed width.
- **`unity_dimensions?`** (`string`): Unit of measurement for dimensions (default: `"px"`).

**Returns:** A Promise resolving to the current instance for method chaining.

**Example:**
```typescript
await this.widthValidate(file, "banner", 1200, 2400, "px");
```

#### `handleValidationError(targetInputname, filename, errorMessage): void`

Handles validation errors by setting error messages and validation flags.

**Parameters:**
- **`targetInputname`** (`string`): The name of the input field.
- **`filename`** (`string`): The name of the media file.
- **`errorMessage`** (`string`): The error message to display.

**Returns:** `void`

**Example:**
```typescript
this.handleValidationError("profilePic", "photo.jpg", "Image must be at least 512x512 pixels");
```

#### `getFileExtension(file): string | undefined`

Extracts the file extension from the file name.

**Parameters:**
- **`file`** (`File`): The file object.

**Returns:** The file extension in lowercase, or `undefined` if not present.

**Example:**
```typescript
const ext = this.getFileExtension(file);  // Returns "jpg", "png", etc.
```

### Abstract Methods (for Subclasses)

#### `validate(media, targetInputname, optionsfile): Promise<this>`

Abstract method that subclasses must implement to perform specific media validation logic.

**Parameters:**
- **`media`** (`File | FileList`): The media file(s) to validate.
- **`targetInputname`** (`string`): The name of the input field.
- **`optionsfile`** (`OptionsValidateTypeFile`): Configuration options for validation.

**Returns:** A Promise resolving to the current instance.

#### `getContext(): string`

Abstract method that subclasses must implement to provide context about the media type.

**Returns:** A string describing the media type (e.g., "image", "video", "document").

**Example (in subclass):**
```typescript
protected getContext(): string {
    return "image";
}
```

#### `mimeTypeFileValidate(file, allowedMimeTypeAccept?): Promise<string | null>`

Abstract method for validating MIME types (implementation varies by media type).

**Parameters:**
- **`file`** (`File`): The file to validate.
- **`allowedMimeTypeAccept?`** (`string[]`): Array of allowed MIME types.

**Returns:** A Promise resolving to error message if invalid, or `null` if valid.

#### `signatureFileValidate(file, uint8Array?): Promise<string | null>`

Abstract method for validating file signatures/magic bytes (implementation varies by media type).

**Parameters:**
- **`file`** (`File`): The file to validate.
- **`uint8Array?`** (`Uint8Array`): The file's byte array for signature checking.

**Returns:** A Promise resolving to error message if invalid, or `null` if valid.

#### `getFileDimensions(file): Promise<{ width: number, height: number }>`

Abstract method for extracting file dimensions (implementation varies by media type).

**Parameters:**
- **`file`** (`File`): The file to analyze.

**Returns:** A Promise resolving to an object containing `width` and `height` properties.

### Typical Subclass Implementation Pattern

```typescript
export class ImageValidator extends AbstractMediaValidator {
    protected getContext(): string {
        return "image";
    }

    protected async mimeTypeFileValidate(
        file: File,
        allowedMimeTypeAccept?: string[]
    ): Promise<string | null> {
        // Implement image MIME type validation
        if (allowedMimeTypeAccept && !allowedMimeTypeAccept.includes(file.type)) {
            return `Invalid MIME type: ${file.type}`;
        }
        return null;
    }

    protected async signatureFileValidate(
        file: File,
        uint8Array?: Uint8Array
    ): Promise<string | null> {
        // Implement image signature validation (PNG, JPEG, etc.)
        return null;
    }

    protected async getFileDimensions(
        file: File
    ): Promise<{ width: number; height: number }> {
        // Implement dimension extraction from image
        return { width: 800, height: 600 };
    }

    public async validate(
        media: File | FileList,
        targetInputname: string,
        optionsfile: OptionsValidateTypeFile
    ): Promise<this> {
        // Implement complete image validation logic
        return this;
    }
}
```

### Typical Usage Flow in Subclasses

```typescript
async validate(file: File, targetInputname: string, options: OptionsValidateTypeFile): Promise<this> {
    // 1. Validate file size
    this.sizeValidate(file, targetInputname, options.maxSize);

    // 2. Validate extension
    this.extensionValidate(file, targetInputname, options.allowedExtensions);

    // 3. Validate MIME type
    const mimeError = await this.mimeTypeFileValidate(file, options.allowedMimeTypes);
    if (mimeError) {
        this.handleValidationError(targetInputname, file.name, mimeError);
    }

    // 4. Validate file signature
    const uint8Array = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const signError = await this.signatureFileValidate(file, uint8Array);
    if (signError) {
        this.handleValidationError(targetInputname, file.name, signError);
    }

    // 5. Validate dimensions (if applicable)
    await this.widthValidate(file, targetInputname, options.minWidth, options.maxWidth);
    await this.heightValidate(file, targetInputname, options.minHeight, options.maxHeight);

    return this;
}
```

### Error Message Examples

- **Size Error:** "the image photo.jpg file is too large, maximum recommended size is 5 MiB"
- **Extension Error:** "The image photo.bmp extension .bmp is not allowed."
- **Width Error:** "The width of the image photo.jpg is less than 800px"
- **Height Error:** "The image photo.jpg height is greater than 2400px"

### Inheritance Hierarchy

```
AbstractFieldValidator
    ↓
AbstractMediaValidator
    ├── ImageValidator
    ├── DocumentValidator
    └── VideoValidator
```

### Key Design Patterns

- **Template Method Pattern:** Abstract methods define the skeleton, subclasses fill in details.
- **Protected Methods:** Provide reusable validation logic for subclasses.
- **Async Support:** Handles I/O operations for file analysis.
- **Fluent API:** Method chaining with `return this`.

## Class `ImageValidator` {#ImageValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `ImageValidator` class is a specialized validator for image file uploads. It extends `AbstractMediaValidator` and implements `MediaValidatorInterface`. This class follows the **singleton pattern** and provides comprehensive image validation including file signature verification, MIME type checking, dimension constraints, size limits, and extension filtering. Detects image file spoofing through hexadecimal signature analysis.

### Key Features

- **File Signature Verification:** Validates file signatures (magic bytes) to detect spoofed images.
- **MIME Type Validation:** Checks file MIME types against allowed types.
- **Extension Filtering:** Validates file extensions against whitelist.
- **Image Dimension Validation:** Enforces minimum and maximum width/height constraints.
- **File Size Validation:** Checks file size against maximum allowed limits.
- **Multiple Format Support:** JPEG, PNG, GIF, BMP, WebP, SVG image formats.
- **Batch Processing:** Validates single File or FileList with multiple images.
- **Spoof Detection:** Detects disguised files through hexadecimal signature analysis.
- **Detailed Error Messages:** Contextual feedback with file names and specific issues.
- **Asynchronous Processing:** Handles file reading and image dimension extraction asynchronously.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Supported Image Formats

| Format | MIME Type | Signature (Hex) |
|--------|-----------|-----------------|
| JPEG | image/jpeg | ffd8ffe0, ffd8ffe1, ffd8ffe2, ffd8ffe3, ffd8ffe8 |
| PNG | image/png | 89504e47 |
| GIF | image/gif | 47494638 |
| BMP | image/bmp | 424d |
| WebP | image/webp | 52494646 |
| SVG | image/svg+xml | 3c3f786d6c | 3c737667 |

### Getting an Instance

```typescript
import { imageValidator } from '@wlindabla/form_validator'
```

### Basic Image Validation

```typescript
const imageFile = document.getElementById('imageInput').files[0];
const fieldName = "profilePicture";

await imageValidator.validate(imageFile, fieldName, {
    extensions: ["jpg", "png"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png"],
    maxsizeFile: 2,
    unityMaxSizeFile: "MiB"
});

if (!imageValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = imageValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Image is valid.`);
}
```

### Image with Dimension Constraints

```typescript
await imageValidator.validate(imageFile, "thumbnail", {
    extensions: ["jpg", "png", "webp"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png", "image/webp"],
    minWidth: 512,
    maxWidth: 1024,
    minHeight: 512,
    maxHeight: 1024,
    unityDimensions: "px",
    maxsizeFile: 1,
    unityMaxSizeFile: "MiB"
});
```

### Multiple Images Validation (FileList)

```typescript
const imageFiles = document.getElementById('galleryInput').files;

await imageValidator.validate(imageFiles, "gallery", {
    extensions: ["jpg", "png"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png"],
    maxsizeFile: 5,
    minWidth: 800,
    maxWidth: 4000
});
```

### Avatar Validation (Square Image)

```typescript
await imageValidator.validate(avatarFile, "userAvatar", {
    extensions: ["jpg", "png", "webp"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png", "image/webp"],
    minWidth: 512,
    maxWidth: 512,
    minHeight: 512,
    maxHeight: 512,
    maxsizeFile: 500,
    unityMaxSizeFile: "KiB"
});
```

### Banner Image Validation

```typescript
await imageValidator.validate(bannerFile, "bannerImage", {
    extensions: ["jpg", "png", "webp"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png", "image/webp"],
    minWidth: 1200,
    maxWidth: 2400,
    minHeight: 300,
    maxHeight: 800,
    maxsizeFile: 2,
    unityMaxSizeFile: "MiB"
});
```

### Strict Spoof Detection

```typescript
// Validates against file spoofing (e.g., .exe renamed to .jpg)
await imageValidator.validate(suspiciousFile, "verifiedImage", {
    extensions: ["jpg", "png"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png"],
    maxsizeFile: 3
});
// Will reject if file signatures don't match JPEG/PNG headers
```

### Interface

#### `OptionsImage`

Configuration object for image validation:

- **`extensions?: string[]`** - Allowed file extensions (e.g., `["jpg", "png", "webp"]`).
- **`allowedMimeTypeAccept?: string[]`** - Allowed MIME types (default: `["image/jpeg", "image/png", "image/jpg"]`).
- **`maxsizeFile?: number`** - Maximum file size (default: `5`).
- **`unityMaxSizeFile?: string`** - Size unit: "B", "KiB", "MiB", "GiB" (default: `"MiB"`).
- **`minWidth?: number`** - Minimum image width in pixels.
- **`maxWidth?: number`** - Maximum image width in pixels.
- **`minHeight?: number`** - Minimum image height in pixels.
- **`maxHeight?: number`** - Maximum image height in pixels.
- **`unityDimensions?: string`** - Unit for dimensions (default: `"px"`).

### Methods

#### `validate(medias, targetInputname?, optionsimg?): Promise<this>`

Validates one or more image files against specified constraints.

**Parameters:**
- **`medias`** (`File | FileList`): Single image file or collection of files to validate.
- **`targetInputname?`** (`string`): The name of the input field (default: `'photofile'`).
- **`optionsimg?`** (`OptionsImage`): Configuration object for validation rules.

**Returns:** A Promise resolving to the current instance for method chaining.

**Validation Flow:**
1. Clears previous field state.
2. Converts FileList to array for uniform processing.
3. For each image file:
   - Validates file extension.
   - Validates file size.
   - Validates MIME type.
   - Validates file signature (magic bytes).
   - Validates image dimensions (width/height).
4. Stops validation on first error.
5. Returns instance for method chaining.

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Invalid extension | "The image [filename] extension .[ext] is not allowed." |
| File too large | "the image [filename] file is too large, maximum recommended size is [size] [unit]" |
| Invalid MIME type | "The media resource is either invalid, corrupt or unsuitable name_image: [filename]" |
| File spoofed/disguised | "The file [filename] you selected appears to be disguised as an image. Please choose a valid image file to continue." |
| Width too small | "The width of the image [filename] is less than [minWidth]px" |
| Width too large | "The width of the image [filename] is greater than [maxWidth]px" |
| Height too small | "The image [filename] height is less than [minHeight]px" |
| Height too large | "The image [filename] height is greater than [maxHeight]px" |
| File read error | "File reading error: [error message] name_image: [filename]" |
| Corrupted file | "Unable to process the file [filename]. It might be empty or corrupted." |

### Protected Methods

#### `signatureFileValidate(file, uint8Array?): Promise<string | null>`

Validates image file signatures (magic bytes) to detect file spoofing.

**Returns:** Error message if invalid, `null` if valid.

**Security Details:**
- Reads first 4 bytes of file.
- Compares against known image format signatures.
- Detects disguised files (e.g., .exe renamed to .jpg).
- Checks MIME type consistency with actual file content.

#### `mimeTypeFileValidate(file, allowedMimeTypeAccept?): Promise<string | null>`

Validates file MIME type against allowed types.

**Returns:** Error message if invalid, `null` if valid.

#### `getFileDimensions(file): Promise<{ width: number, height: number }>`

Extracts actual image dimensions by loading the image.

**Returns:** Promise with width and height in pixels.

### Default Options

When options are merged with defaults:

```typescript
{
    allowedMimeTypeAccept: ["image/jpeg", "image/png", "image/jpg"],
    extensions: undefined,
    maxsizeFile: 5,
    unityMaxSizeFile: "MiB",
    minWidth: undefined,
    maxWidth: undefined,
    minHeight: undefined,
    maxHeight: undefined,
    unityDimensions: "px"
}
```

### Security Features

- **Spoof Detection:** Validates file signatures against hexadecimal patterns.
- **MIME Type Checking:** Ensures file type matches declared MIME type.
- **Dimension Verification:** Confirms image actually loads and has valid dimensions.
- **Empty File Detection:** Rejects empty or corrupted files.
- **File Reading Errors:** Handles and reports file reading failures.

### Performance Considerations

- **Batch Processing:** Validates multiple images efficiently.
- **Early Exit:** Stops on first validation error.
- **Asynchronous:** Uses async/await for non-blocking file operations.
- **Memory Efficient:** Processes files individually from FileList.

### Examples

#### Profile Picture Upload

```typescript
await imageValidator.validate(profileFile, "profile_pic", {
    extensions: ["jpg", "png"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png"],
    minWidth: 400,
    maxWidth: 2000,
    minHeight: 400,
    maxHeight: 2000,
    maxsizeFile: 1,
    unityMaxSizeFile: "MiB"
});
```

#### Product Gallery Images

```typescript
await imageValidator.validate(galleryFiles, "product_gallery", {
    extensions: ["jpg", "png", "webp"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png", "image/webp"],
    minWidth: 800,
    minHeight: 600,
    maxsizeFile: 3,
    unityMaxSizeFile: "MiB"
});
```

#### Thumbnail Generation

```typescript
await imageValidator.validate(thumbnailFile, "thumbnail", {
    extensions: ["jpg", "png"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png"],
    minWidth: 150,
    maxWidth: 300,
    minHeight: 150,
    maxHeight: 300,
    maxsizeFile: 200,
    unityMaxSizeFile: "KiB"
});
```

#### Document Scan (Photos)

```typescript
await imageValidator.validate(scanFile, "document_scan", {
    extensions: ["jpg", "png"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png"],
    minWidth: 1000,
    minHeight: 1400,
    maxsizeFile: 5,
    unityMaxSizeFile: "MiB"
});
```

### File Signature Reference

```
JPEG: FF D8 FF E0/E1/E2/E3/E8
PNG:  89 50 4E 47
GIF:  47 49 46 38
BMP:  42 4D
WebP: 52 49 46 46
SVG:  3C 3F 78 6D 6C 76 or 3C 73 76 67
```

### Exported Instance

- **`imageValidator`**: The singleton instance ready for immediate use throughout your application.

## Class `DocumentValidator` {#DocumentValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `DocumentValidator` class is a specialized validator for document file uploads. It extends `AbstractMediaValidator` and follows the **singleton pattern**. This validator provides comprehensive document validation including file signature verification, MIME type checking, and format-specific parsing for PDF, Excel, Word, CSV, and plain text files. Uses industry-standard libraries: pdfjs-dist, xlsx, and papaparse.

### Key Features

- **Multi-Format Support:** Validates PDF, Word (DOC/DOCX), Excel (XLS/XLSX), CSV, and text files.
- **File Signature Verification:** Detects file spoofing through hexadecimal signature analysis.
- **PDF Validation:** Parses and validates PDF structure using pdfjs-dist.
- **Excel Validation:** Reads and validates Excel workbooks using xlsx library.
- **CSV Validation:** Parses CSV files using PapaParse with header detection.
- **Text File Validation:** Validates plain text files and detects empty files.
- **Extension Filtering:** Validates extensions against whitelisted types.
- **Batch Processing:** Validates single File or FileList with multiple documents.
- **Content Parsing:** Ensures files are not just valid by signature, but actually parseable.
- **Comprehensive Error Reporting:** Detailed error messages for each validation failure.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Supported Document Formats

| Format | MIME Type | Signature (Hex) | Library |
|--------|-----------|-----------------|---------|
| PDF | application/pdf | 25504446 | pdfjs-dist |
| DOC | application/msword | 504b0304, d0cf11e0 | xlsx |
| DOCX | application/vnd.openxmlformats-officedocument.wordprocessingml.document | 504b0304 | Built-in |
| XLS | application/vnd.ms-excel | 504b0304, d0cf11e0 | xlsx |
| XLSX | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | 504b0304 | xlsx |
| ODT | application/vnd.oasis.opendocument.text | 504b0304 | Built-in |
| ODS | application/vnd.oasis.opendocument.spreadsheet | 504b0304 | Built-in |
| CSV | text/csv | N/A | papaparse |
| TXT | text/plain | N/A | Built-in |

### Getting an Instance

```typescript
import { documentValidator } from '@wlindabla/form_validator'
```

### Basic PDF Validation

```typescript
const pdfFile = document.getElementById('pdfInput').files[0];
const fieldName = "reportFile";

await documentValidator.validate(pdfFile, fieldName, {
    allowedMimeTypeAccept: ["application/pdf"],
    maxsizeFile: 5,
    unityMaxSizeFile: "MiB"
});

if (!documentValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = documentValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`PDF is valid.`);
}
```

### Excel File Validation

```typescript
const excelFile = document.getElementById('excelInput').files[0];

await documentValidator.validate(excelFile, "spreadsheet", {
    allowedMimeTypeAccept: [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ],
    maxsizeFile: 10,
    unityMaxSizeFile: "MiB"
});
```

### Word Document Validation

```typescript
const wordFile = document.getElementById('wordInput').files[0];

await documentValidator.validate(wordFile, "document", {
    allowedMimeTypeAccept: [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    maxsizeFile: 5,
    unityMaxSizeFile: "MiB"
});
```

### CSV File Validation

```typescript
const csvFile = document.getElementById('csvInput').files[0];

await documentValidator.validate(csvFile, "csvData", {
    allowedMimeTypeAccept: ["text/csv"],
    maxsizeFile: 50,
    unityMaxSizeFile: "MiB"
});
```

### Multiple Document Upload

```typescript
const documentFiles = document.getElementById('multiDocInput').files;

await documentValidator.validate(documentFiles, "supportingDocs", {
    allowedMimeTypeAccept: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ],
    maxsizeFile: 5,
    unityMaxSizeFile: "MiB"
});
```

### Mixed Office Documents

```typescript
await documentValidator.validate(documentFile, "officeDoc", {
    allowedMimeTypeAccept: [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.oasis.opendocument.text",
        "application/vnd.oasis.opendocument.spreadsheet"
    ],
    maxsizeFile: 10,
    unityMaxSizeFile: "MiB"
});
```

### Text and CSV Only

```typescript
await documentValidator.validate(textFile, "plainText", {
    allowedMimeTypeAccept: ["text/plain", "text/csv"],
    maxsizeFile: 100,
    unityMaxSizeFile: "MiB"
});
```

### Interface

#### `OptionsFile`

Configuration object for document validation:

- **`allowedMimeTypeAccept?: string[]`** - Array of allowed MIME types. Defaults to `["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]`.
- **`maxsizeFile?: number`** - Maximum file size (default: `5`).
- **`unityMaxSizeFile?: string`** - Size unit: "B", "KiB", "MiB", "GiB" (default: `"MiB"`).

### Methods

#### `validate(medias, targetInputname, optionsdoc): Promise<this>`

Validates one or more document files against specified constraints.

**Parameters:**
- **`medias`** (`File | FileList`): Single document file or collection of files to validate.
- **`targetInputname`** (`string`): The name of the input field for error reporting.
- **`optionsdoc`** (`OptionsFile`): Configuration object for validation rules.

**Returns:** A Promise resolving to the current instance for method chaining.

**Validation Flow:**
1. Clears previous field state.
2. Converts FileList to array for uniform processing.
3. For each document file:
   - Validates file extension.
   - Determines document format (PDF, Excel, CSV, etc.).
   - Validates file signature.
   - Performs format-specific validation.
4. Stops validation on first error.
5. Returns instance for method chaining.

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Invalid extension | "The document [filename] extension .[ext] is not allowed." |
| File too large | "the document [filename] file is too large, maximum recommended size is [size] [unit]" |
| Invalid signature | "The file [filename] has an invalid signature. name_document: [filename]" |
| Invalid PDF | "The file [filename] is not a valid PDF." |
| Invalid Excel | "The file [filename] is not a valid Excel file." |
| Empty file | "The file [filename] is empty." |
| Empty/malformed CSV | "The CSV file \"[filename]\" is empty or poorly formatted!" |
| File read error | "Failed to read file: [filename]" |
| Parse error | "Failed to parse [filename]: [error]" |

### Protected Validation Methods

#### `validatePdf(file, uint8Array): Promise<string | null>`

Validates PDF file structure and content using pdfjs-dist.

**Returns:** Error message if invalid, `null` if valid.

**Features:**
- Parses PDF document structure.
- Verifies PDF contains at least one page.
- Validates MIME type consistency.

#### `validateExcel(file, uint8Array): Promise<string | null>`

Validates Excel workbook structure using xlsx library.

**Returns:** Error message if invalid, `null` if valid.

**Features:**
- Reads Excel workbook from binary data.
- Verifies workbook contains at least one sheet.
- Validates spreadsheet structure.

#### `validateCsv(file): Promise<string | null>`

Validates CSV file structure using PapaParse.

**Returns:** Error message if invalid, `null` if valid.

**Features:**
- Parses CSV with headers.
- Skips empty lines.
- Validates data rows exist.
- Reports parsing errors.

#### `validateText(file): Promise<string | null>`

Validates plain text files.

**Returns:** Error message if invalid (empty file), `null` if valid.

**Features:**
- Detects empty files.
- Validates text encoding.

### Security Features

- **Spoof Detection:** Validates file signatures against hexadecimal patterns.
- **Content Validation:** Ensures files are actually parseable, not just valid signatures.
- **Format-Specific Parsing:** Each format has dedicated validation logic.
- **Error Handling:** Catches and reports parsing exceptions.

### External Dependencies

- **pdfjs-dist** (v5.4.296+) - PDF parsing and validation
- **xlsx** - Excel workbook reading and validation
- **papaparse** - CSV parsing and validation

### Default Configuration

When no options provided:

```typescript
{
    allowedMimeTypeAccept: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    maxsizeFile: 5,
    unityMaxSizeFile: "MiB"
}
```

### Examples

#### Legal Document Upload

```typescript
await documentValidator.validate(legalFile, "legalDoc", {
    allowedMimeTypeAccept: ["application/pdf"],
    maxsizeFile: 10,
    unityMaxSizeFile: "MiB"
});
```

#### Financial Report Submission

```typescript
await documentValidator.validate(reportFile, "financialReport", {
    allowedMimeTypeAccept: [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ],
    maxsizeFile: 20,
    unityMaxSizeFile: "MiB"
});
```

#### CSV Data Import

```typescript
await documentValidator.validate(importFile, "dataImport", {
    allowedMimeTypeAccept: ["text/csv"],
    maxsizeFile: 100,
    unityMaxSizeFile: "MiB"
});
```

#### Resume/CV Upload

```typescript
await documentValidator.validate(resumeFile, "resume", {
    allowedMimeTypeAccept: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
    ],
    maxsizeFile: 5,
    unityMaxSizeFile: "MiB"
});
```

#### Multi-Format Document Repository

```typescript
await documentValidator.validate(documentFiles, "repository", {
    allowedMimeTypeAccept: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.oasis.opendocument.text",
        "application/vnd.oasis.opendocument.spreadsheet",
        "text/csv",
        "text/plain"
    ],
    maxsizeFile: 50,
    unityMaxSizeFile: "MiB"
});
```

### File Signature Reference

```
PDF:   25 50 44 46 (%)PDF
Word:  50 4B 03 04 (PK..) or D0 CF 11 E0 (Ñ...)
Excel: 50 4B 03 04 (PK..) or D0 CF 11 E0 (Ñ...)
```

### Performance Considerations

- **Batch Processing:** Validates multiple files sequentially.
- **Early Exit:** Stops on first validation error.
- **Asynchronous:** Uses async/await for non-blocking operations.
- **Memory Efficient:** Reads files as byte arrays efficiently.

### Browser Compatibility

- Requires modern browser with FileReader API.
- Requires Web Workers for PDF processing (CDN-hosted).

### Exported Instance

- **`documentValidator`**: The singleton instance ready for immediate use throughout your application.

## Class `VideoValidator` {#VideoValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `VideoValidator` class is a specialized validator for video file uploads. It extends `AbstractMediaValidator` and implements `VideoValidatorInterface`. This class follows the **singleton pattern** and provides comprehensive video validation including file extension checking, MIME type verification, file size limits, and metadata validation (dimensions and duration).

### Key Features

- **Multi-Format Support:** Validates 16+ video formats including MP4, MKV, WebM, MOV, AVI, FLV, and more.
- **Extension Filtering:** Validates file extensions against whitelisted types.
- **File Size Validation:** Enforces maximum file size constraints.
- **MIME Type Checking:** Verifies file MIME types against allowed types.
- **Metadata Extraction:** Loads video metadata to extract dimensions and duration.
- **Dimension Validation:** Enforces minimum/maximum width and height constraints.
- **Corruption Detection:** Detects invalid or corrupted video files.
- **Batch Processing:** Validates single File or FileList with multiple videos.
- **Memory Efficient:** Uses HTML5 video element for metadata parsing.
- **Comprehensive Error Reporting:** Detailed error messages for each validation failure.
- **Singleton Pattern:** Single globally accessible instance for resource efficiency.

### Supported Video Formats

| Format | Extension | MIME Type |
|--------|-----------|-----------|
| MPEG | mpg, mpeg | video/mpeg |
| MP4 | mp4 | video/mp4 |
| QuickTime | mov | video/quicktime |
| Matroska | mkv | video/x-matroska |
| WebM | webm | video/webm |
| Ogg | ogv | video/ogg |
| AVI | avi | video/x-msvideo |
| FLV | flv | video/x-flv |
| Windows Media | wmv | video/x-ms-wmv |
| 3GP | 3gp | video/3gpp |
| 3G2 | 3g2 | video/3gpp2 |
| M4V | m4v | video/x-m4v |
| MPEG-TS | ts | video/mp2t |
| ASF | asf | video/x-ms-asf |
| RealMedia | rm | application/vnd.rn-realmedia |
| DivX | divx | video/divx |

### Getting an Instance

```typescript
import { videoValidator } from '@wlindabla/form_validator'
```

### Basic Video Validation

```typescript
const videoFile = document.getElementById('videoInput').files[0];
const fieldName = "uploadedVideo";

await videoValidator.validate(videoFile, fieldName, {
    extensions: ["mp4"],
    allowedMimeTypeAccept: ["video/mp4"],
    maxsizeFile: 100,
    unityMaxSizeFile: "MiB"
});

if (!videoValidator.isFieldValid(fieldName)) {
    const {isValid, errors} = videoValidator.getState(fieldName);
    console.log(`Validation errors:`, errors);
} else {
    console.log(`Video is valid.`);
}
```

### Video with Dimension Constraints

```typescript
await videoValidator.validate(videoFile, "videoContent", {
    extensions: ["mp4", "webm"],
    allowedMimeTypeAccept: ["video/mp4", "video/webm"],
    minWidth: 1280,
    maxWidth: 3840,
    minHeight: 720,
    maxHeight: 2160,
    maxsizeFile: 200,
    unityMaxSizeFile: "MiB"
});
```

### HD Video Validation (1080p)

```typescript
await videoValidator.validate(videoFile, "hdVideo", {
    extensions: ["mp4", "mkv"],
    allowedMimeTypeAccept: ["video/mp4", "video/x-matroska"],
    minWidth: 1920,
    maxWidth: 1920,
    minHeight: 1080,
    maxHeight: 1080,
    maxsizeFile: 500,
    unityMaxSizeFile: "MiB"
});
```

### 4K Video Validation

```typescript
await videoValidator.validate(videoFile, "videoFile4K", {
    extensions: ["mp4", "mkv", "webm"],
    allowedMimeTypeAccept: ["video/mp4", "video/x-matroska", "video/webm"],
    minWidth: 3840,
    minHeight: 2160,
    maxsizeFile: 1000,
    unityMaxSizeFile: "MiB"
});
```

### Mobile Video Format

```typescript
await videoValidator.validate(videoFile, "mobileVideo", {
    extensions: ["mp4", "webm"],
    allowedMimeTypeAccept: ["video/mp4", "video/webm"],
    minWidth: 480,
    maxWidth: 1080,
    minHeight: 360,
    maxHeight: 1920,
    maxsizeFile: 50,
    unityMaxSizeFile: "MiB"
});
```

### Multiple Video Upload

```typescript
const videoFiles = document.getElementById('videoGallery').files;

await videoValidator.validate(videoFiles, "videoGallery", {
    extensions: ["mp4", "mkv", "webm"],
    allowedMimeTypeAccept: ["video/mp4", "video/x-matroska", "video/webm"],
    maxsizeFile: 100,
    unityMaxSizeFile: "MiB"
});
```

### Minimal Validation (Default Options)

```typescript
// Uses default options if none provided
await videoValidator.validate(videoFile, "video");
```

### Interface

#### `OptionsMediaVideo`

Configuration object for video validation:

- **`extensions?: string[]`** - Allowed video file extensions. Defaults to 16 common formats.
- **`allowedMimeTypeAccept?: string[]`** - Allowed MIME types. Defaults to all common video MIME types.
- **`maxsizeFile?: number`** - Maximum file size (default: `5`).
- **`unityMaxSizeFile?: string`** - Size unit: "B", "KiB", "MiB", "GiB" (default: `"MiB"`).
- **`minWidth?: number`** - Minimum video width in pixels.
- **`maxWidth?: number`** - Maximum video width in pixels.
- **`minHeight?: number`** - Minimum video height in pixels.
- **`maxHeight?: number`** - Maximum video height in pixels.
- **`unityDimensions?: string`** - Unit for dimensions (default: `"px"`).

### Methods

#### `validate(medias, targetInputname?, optionsmedia?): Promise<this>`

Validates one or more video files against specified constraints.

**Parameters:**
- **`medias`** (`File | FileList`): Single video file or collection of files to validate.
- **`targetInputname?`** (`string`): The name of the input field (default: `'videofile'`).
- **`optionsmedia?`** (`OptionsMediaVideo`): Configuration object for validation rules.

**Returns:** A Promise resolving to the current instance for method chaining.

**Validation Flow:**
1. Clears previous field state.
2. Converts FileList to array for uniform processing.
3. For each video file:
   - Validates file extension.
   - Validates file size.
   - Validates MIME type format.
   - Loads video metadata (dimensions, duration).
   - Validates width and height constraints (if specified).
4. Stops validation on first error.
5. Returns instance for method chaining.

**Error Scenarios:**

| Condition | Error Message |
|-----------|---------------|
| Invalid extension | "The video [filename] extension .[ext] is not allowed." |
| File too large | "the video [filename] file is too large, maximum recommended size is [size] [unit]" |
| Invalid MIME type | "Invalid MIME type [type] for video [filename]. Authorized types are: [list]" |
| Corrupted video | "The file \"[filename]\" is not a valid video file or is corrupted." |
| Metadata load failed | "Failed to load the metadata for the video file \"[filename]\". It might not be a valid video file." |
| Width too small | "The width of the video [filename] is less than [minWidth]px" |
| Width too large | "The width of the video [filename] is greater than [maxWidth]px" |
| Height too small | "The video [filename] height is less than [minHeight]px" |
| Height too large | "The video [filename] height is greater than [maxHeight]px" |

### Protected Methods

#### `mimeTypeFileValidate(media, allowedMimeTypeAccept): Promise<string | null>`

Validates video file MIME type against allowed types.

**Returns:** Error message if invalid, `null` if valid.

**Features:**
- Checks MIME type starts with "video/".
- Validates MIME type is in allowed list.
- Provides helpful error message with authorized types.

#### `getFileDimensions(file): Promise<{ width: number, height: number }>`

Retrieves cached video dimensions from metadata cache.

**Returns:** Promise with width and height in pixels.

**Note:** Uses cached dimensions from metadata validation phase.

### Default Options

When options are not provided:

```typescript
{
    extensions: [
        "avi", "flv", "wmv", "mp4", "mov", "mkv", "webm",
        "3gp", "3g2", "m4v", "mpg", "mpeg", "ts", "ogv",
        "asf", "rm", "divx"
    ],
    allowedMimeTypeAccept: [
        "video/x-msvideo",
        "video/x-flv",
        "video/x-ms-wmv",
        "video/mp4",
        "video/quicktime",
        "video/x-matroska",
        "video/webm",
        "video/3gpp",
        "video/3gpp2",
        "video/x-m4v",
        "video/mpeg",
        "video/mp2t",
        "video/ogg",
        "video/x-ms-asf",
        "application/vnd.rn-realmedia",
        "video/divx"
    ]
}
```

### Security Features

- **MIME Type Validation:** Ensures file type matches "video/" prefix.
- **Corruption Detection:** Detects invalid duration or malformed video files.
- **Metadata Verification:** Uses browser video parser for validation.
- **Memory Management:** Revokes object URLs to prevent memory leaks.

### Performance Considerations

- **Metadata Caching:** Stores dimensions for reuse across validations.
- **Lazy Loading:** Only loads metadata when needed.
- **Memory Efficient:** Properly cleans up object URLs.
- **Batch Processing:** Validates multiple files sequentially.

### Browser Compatibility

- Requires HTML5 Video element support.
- Requires File API and Blob URL support.
- Works in all modern browsers (Chrome, Firefox, Safari, Edge).

### Examples

#### YouTube-Style Video Upload

```typescript
await videoValidator.validate(videoFile, "youtubeUpload", {
    extensions: ["mp4", "webm", "mkv", "flv"],
    allowedMimeTypeAccept: [
        "video/mp4",
        "video/webm",
        "video/x-matroska",
        "video/x-flv"
    ],
    maxsizeFile: 128000,  // 128 GB limit like YouTube
    minWidth: 1280,
    maxWidth: 7680,
    minHeight: 720,
    maxHeight: 4320
});
```

#### Streaming Platform (1080p)

```typescript
await videoValidator.validate(videoFile, "streamingVideo", {
    extensions: ["mp4", "mkv"],
    allowedMimeTypeAccept: ["video/mp4", "video/x-matroska"],
    minWidth: 1920,
    minHeight: 1080,
    maxsizeFile: 500,
    unityMaxSizeFile: "MiB"
});
```

#### Social Media Video

```typescript
await videoValidator.validate(videoFile, "socialMedia", {
    extensions: ["mp4", "webm"],
    allowedMimeTypeAccept: ["video/mp4", "video/webm"],
    maxsizeFile: 4,
    unityMaxSizeFile: "GiB",
    minWidth: 480,
    maxWidth: 1080,
    minHeight: 360,
    maxHeight: 1920
});
```

#### Professional Video Production

```typescript
await videoValidator.validate(videoFile, "proProduction", {
    extensions: ["mov", "mkv", "mp4"],
    allowedMimeTypeAccept: [
        "video/quicktime",
        "video/x-matroska",
        "video/mp4"
    ],
    minWidth: 3840,
    minHeight: 2160,
    maxsizeFile: 2000,
    unityMaxSizeFile: "MiB"
});
```

### Exported Instance

- **`videoValidator`**: The singleton instance ready for immediate use throughout your application.

## Class `FormInputValidator` {#FormInputValidator}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `FormInputValidator` class is the central router and facade of the entire validation system. It implements `FormInputValidatorInterface` and `ContainerValidatorInterface`, following the **singleton pattern**. This class dispatches input data to the appropriate specialized validator based on field type and maintains a registry of validators for centralized error state management.

### Key Features

- **Universal Dispatcher:** Routes validation requests to specialized validators based on field type.
- **Type-Based Routing:** Supports 15+ input field types (text, email, password, date, tel, URL, number, select, checkbox, radio, textarea, image, video, document, FQDN).
- **Centralized State Management:** Maintains registry of all validators and their states.
- **Async/Sync Support:** Handles both asynchronous (file, email, URL) and synchronous validations.
- **Unified Options API:** Accepts unified options object for all field types.
- **Validator Registry:** Store and retrieve validators by field name.
- **Method Chaining Compatible:** Returns promises for async operations.
- **Singleton Pattern:** Single globally accessible instance.
- **Extensible Design:** Easy to add new validators to the routing logic.

### Getting an Instance

```typescript
import { formInputValidator } from '@wlindabla/form_validator'
```

### Basic Text Validation

```typescript
const inputValue = "Hello World";
const fieldName = "username";

await formInputValidator.allTypesValidator(inputValue, fieldName, "text", {
    minLength: 3,
    maxLength: 50,
    requiredInput: true
});

const validator = formInputValidator.getValidator(fieldName);
if (validator && !validator.isFieldValid(fieldName)) {
    const {errors} = validator.getState(fieldName);
    console.log("Validation errors:", errors);
}
```

### Email Validation

```typescript
await formInputValidator.allTypesValidator(
    "user@example.com",
    "userEmail",
    "email",
    {
        requiredInput: true,
        allowDisplayName: false
    }
);
```

### Password Validation with Scoring

```typescript
await formInputValidator.allTypesValidator(
    "SecurePass123!@#",
    "newPassword",
    "password",
    {
        minLength: 12,
        upperCaseAllow: true,
        numberAllow: true,
        symbolAllow: true,
        enableScoring: true
    }
);

// Listen to password strength score
document.addEventListener('scoreAnalysisPassword', (event) => {
    console.log(`Score: ${event.detail.score}`);
});
```

### Phone Number Validation

```typescript
await formInputValidator.allTypesValidator(
    "+229016725186",
    "phoneNumber",
    "tel",
    {
        defaultCountry: 'BJ',
        requiredInput: true
    }
);
```

### URL Validation

```typescript
await formInputValidator.allTypesValidator(
    "https://api.example.com/endpoint",
    "apiUrl",
    "url",
    {
        requireProtocol: true,
        allowedProtocols: ["https"],
        requireValidProtocol: true
    }
);
```

### Date Validation

```typescript
await formInputValidator.allTypesValidator(
    "2024/06/15",
    "eventDate",
    "date",
    {
        format: 'YYYY/MM/DD',
        allowFuture: true,
        allowPast: false,
        minDate: new Date()
    }
);
```

### Number Validation

```typescript
await formInputValidator.allTypesValidator(
    42,
    "quantity",
    "number",
    {
        min: 1,
        max: 100,
        step: 5
    }
);
```

### Select/Dropdown Validation

```typescript
await formInputValidator.allTypesValidator(
    "option_a",
    "userChoice",
    "select",
    {
        optionsChoices: ["option_a", "option_b", "option_c"]
    }
);
```

### Checkbox Validation (Multiple Selection)

```typescript
await formInputValidator.allTypesValidator(
    2,  // Number of checkboxes selected
    "interestGroup",
    "checkbox",
    {
        minAllowed: 1,
        maxAllowed: 5,
        optionsChoicesCheckbox: ["sports", "music", "reading", "gaming", "cooking"],
        dataChoices: ["sports", "music"]
    }
);
```

### Radio Button Validation

```typescript
await formInputValidator.allTypesValidator(
    "premium",
    "accountType",
    "radio",
    {
        required: true
    }
);
```

### Textarea Validation

```typescript
await formInputValidator.allTypesValidator(
    "This is a longer text for textarea field",
    "message",
    "textarea",
    {
        minLength: 10,
        maxLength: 500,
        requiredInput: true
    }
);
```

### Image File Validation

```typescript
const imageFile = document.getElementById('imageInput').files[0];

await formInputValidator.allTypesValidator(imageFile, "profilePicture", "image", {
    extensions: ["jpg", "png"],
    allowedMimeTypeAccept: ["image/jpeg", "image/png"],
    minWidth: 512,
    maxWidth: 2048,
    minHeight: 512,
    maxHeight: 2048,
    maxsizeFile: 2,
    unityMaxSizeFile: "MiB"
});
```

### Video File Validation

```typescript
const videoFile = document.getElementById('videoInput').files[0];

await formInputValidator.allTypesValidator(videoFile, "uploadedVideo", "video", {
    extensions: ["mp4", "webm"],
    allowedMimeTypeAccept: ["video/mp4", "video/webm"],
    minWidth: 1280,
    minHeight: 720,
    maxsizeFile: 100,
    unityMaxSizeFile: "MiB"
});
```

### Document File Validation

```typescript
const pdfFile = document.getElementById('documentInput').files[0];

await formInputValidator.allTypesValidator(pdfFile, "reportFile", "document", {
    allowedMimeTypeAccept: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    maxsizeFile: 10,
    unityMaxSizeFile: "MiB"
});
```

### FQDN Domain Validation

```typescript
await formInputValidator.allTypesValidator(
    "example.com",
    "domainField",
    "fqdn",
    {
        requireTLD: true,
        allowHyphens: true
    }
);
```

### Interface

#### `FormInputValidatorInterface`

Main validation interface:

- **`allTypesValidator(datainput, targetInputname, type_field, options_validator): Promise<void>`** - Universal validator for all field types.

#### `ContainerValidatorInterface`

Registry management interface:

- **`setValidator(targetInputname, validator): void`** - Register a validator instance for a field.
- **`getValidator(targetInputname): FieldValidatorInterface | undefined`** - Retrieve a validator for a field.

### Methods

#### `allTypesValidator(datainput, targetInputname, type_field, options_validator): Promise<void>`

Universally validates any input type by routing to the appropriate specialized validator.

**Parameters:**
- **`datainput`** (`DataInput`): The input value to validate. Can be string, number, File, FileList, array, or null/undefined.
- **`targetInputname`** (`string`): The name/identifier of the input field.
- **`type_field`** (`FormInputType | MediaType`): The type of field being validated.
- **`options_validator`** (`OptionsValidate`): Type-specific configuration options.

**Returns:** A Promise that resolves after validation completes.

**Supported Field Types:**

| Type | Input Type | Validator | Async |
|------|-----------|-----------|-------|
| text | string | TextInputValidator | No |
| email | string | EmailInputValidator | Yes |
| password | string | PasswordInputValidator | No |
| tel | string | TelInputValidator | No |
| url | string | URLInputValidator | Yes |
| date | string | DateInputValidator | No |
| fqdn | string | FQDNInputValidator | Yes |
| number | string \| number | NumberInputValidator | No |
| textarea | string | TextareaValidator | No |
| select | string \| string[] | SelectValidator | No |
| checkbox | number | CheckBoxValidator | No |
| radio | string \| null \| undefined | RadioValidator | No |
| image | File \| FileList | ImageValidator | Yes |
| video | File \| FileList | VideoValidator | Yes |
| document | File \| FileList | DocumentValidator | Yes |

#### `setValidator(targetInputname, validator): void`

Registers a validator instance in the internal registry.

**Parameters:**
- **`targetInputname`** (`string`): The field name for registration.
- **`validator`** (`FieldValidatorInterface`): The validator instance to store.

**Returns:** `void`

#### `getValidator(targetInputname): FieldValidatorInterface | undefined`

Retrieves a registered validator by field name.

**Parameters:**
- **`targetInputname`** (`string`): The field name to look up.

**Returns:** The registered validator instance, or `undefined` if not found.

### Type Union

#### `OptionsValidate`

Union of all available option types:

```typescript
TextInputOptions
| EmailInputOptions
| DateInputOptions
| FQDNOptions
| SelectOptions
| OptionsRadio
| OptionsCheckbox
| PassworkRuleOptions
| URLOptions
| NumberOptions
| TelInputOptions
| OptionsFile
| OptionsImage
| OptionsMediaVideo
```

### Routing Logic

The `allTypesValidator` method routes input data as follows:

1. **File Input Detection:**
   - If input is `File` or `FileList`:
     - Route to `ImageValidator` for type "image"
     - Route to `VideoValidator` for type "video"
     - Route to `DocumentValidator` for all other types

2. **Text-Based Routing:**
   - Route to specialized validator based on `type_field` parameter
   - Each field type delegates to its singleton validator instance

3. **Validator Registration:**
   - After validation, the validator is registered in the internal registry
   - Enables later retrieval via `getValidator()`

### Usage Patterns

#### Pattern 1: Validate and Check

```typescript
await formInputValidator.allTypesValidator(value, "field", "email", options);

const validator = formInputValidator.getValidator("field");
if (validator && !validator.isFieldValid("field")) {
    const {errors} = validator.getState("field");
    // Handle errors
}
```

#### Pattern 2: Chain Multiple Validations

```typescript
await formInputValidator.allTypesValidator(email, "email", "email", emailOptions);
await formInputValidator.allTypesValidator(password, "password", "password", pwOptions);
await formInputValidator.allTypesValidator(image, "avatar", "image", imageOptions);

// Check all fields
const emailValidator = formInputValidator.getValidator("email");
const passwordValidator = formInputValidator.getValidator("password");
const imageValidator = formInputValidator.getValidator("avatar");
```

#### Pattern 3: Conditional Validation

```typescript
const fieldType = userPreference === 'phone' ? 'tel' : 'email';
const value = userPreference === 'phone' ? phoneValue : emailValue;

await formInputValidator.allTypesValidator(value, "contact", fieldType, options);
```

### Performance Considerations

- **Lazy Loading:** Each validator is a singleton, loaded on first use.
- **Registry Caching:** Validators are cached in the internal map.
- **Async Optimization:** Async validators (email, URL, file) only when needed.
- **Efficient Routing:** O(1) dispatcher logic for field type routing.

### Error Handling

All validators return errors through their state management. Access errors via:

```typescript
const validator = formInputValidator.getValidator(fieldName);
const {isValid, errors} = validator.getState(fieldName);
```

### Integration Example

```typescript
// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all form fields
    await formInputValidator.allTypesValidator(
        emailInput.value,
        "email",
        "email",
        { requiredInput: true }
    );

    await formInputValidator.allTypesValidator(
        passwordInput.value,
        "password",
        "password",
        { minLength: 8, enableScoring: true }
    );

    await formInputValidator.allTypesValidator(
        avatarFile,
        "avatar",
        "image",
        { maxsizeFile: 2, extensions: ["jpg", "png"] }
    );

    // Check all validations
    const emailValidator = formInputValidator.getValidator("email");
    const passwordValidator = formInputValidator.getValidator("password");
    const imageValidator = formInputValidator.getValidator("avatar");

    if (
        emailValidator?.isFieldValid("email") &&
        passwordValidator?.isFieldValid("password") &&
        imageValidator?.isFieldValid("avatar")
    ) {
        // All valid - submit form
        console.log("All validations passed!");
    } else {
        // Show errors
        console.log("Validation failed");
    }
}
```

### Exported Instance

- **`formInputValidator`**: The singleton instance serving as the central validator router for the entire application.

## Class `FieldInputController` {#FieldInputController}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `FieldInputController` class is the DOM adapter/controller for individual form fields. It extends `AbstractFieldController` and implements `FormChildrenValidateInterface`. This class acts as the high-level interface between HTML form elements and the validation engine, managing field validation by routing to the central `FormInputValidator` and automatically inferring validation rules from HTML attributes.

### Key Features

- **DOM Attribute Parsing:** Automatically extracts validation rules from HTML data attributes.
- **Type-Based Routing:** Routes validation to appropriate validators based on input type.
- **Intelligent Defaults:** Provides sensible defaults for all field types.
- **Group Management:** Handles checkbox and radio button groups with container validation.
- **Field State Management:** Tracks and manages validation state through the error store.
- **Event Handling:** Emits validation events and supports custom error clearing.
- **HTML5 Integration:** Supports native HTML5 attributes (min, max, required, pattern, etc.).
- **Flexible Configuration:** Supports both explicit options and HTML attribute-based configuration.
- **Method Chaining:** Returns promises for async operations.

### Getting an Instance

```typescript
// Single field validation
const controller = new FieldInputController(
    document.getElementById('emailField'),
    { requiredInput: true }
);

// Or let it infer options from attributes
const controller = new FieldInputController(
    document.getElementById('passwordField')
);
```

### Basic Field Validation

```typescript
const emailController = new FieldInputController(
    document.getElementById('email')
);

await emailController.validate();

if (!emailController.isValid()) {
    emailController.clearErrorField();
}
```

### HTML Attribute Configuration

```html
<!-- Text field with custom rules -->
<input 
    type="text" 
    name="username" 
    data-min-length="3"
    data-max-length="50"
    pattern="^[a-zA-Z0-9_]+$"
    required
/>

<!-- Email field with display name support -->
<input 
    type="email" 
    name="userEmail" 
    data-allow-display-name="true"
    data-require-display-name="false"
/>

<!-- Password with scoring -->
<input 
    type="password" 
    name="password" 
    data-enable-scoring="true"
    data-upper-case-allow="true"
    data-number-allow="true"
    data-min-length="12"
/>

<!-- Date field -->
<input 
    type="date" 
    name="eventDate" 
    data-format-date="YYYY/MM/DD"
    data-allow-future="true"
    data-allow-past="false"
/>

<!-- URL field -->
<input 
    type="url" 
    name="website" 
    data-allowed-protocols="https,http"
    data-allow-query-params="true"
/>

<!-- Phone number -->
<input 
    type="tel" 
    name="phone" 
    data-default-country="BJ"
    data-min-length="7"
    data-max-length="25"
/>

<!-- Number field -->
<input 
    type="number" 
    name="quantity" 
    min="1"
    max="100"
    step="5"
/>

<!-- Textarea -->
<textarea 
    name="message" 
    data-min-length="10"
    data-max-length="500"
></textarea>

<!-- Select dropdown -->
<select name="choice">
    <option value="">-- Select --</option>
    <option value="option_a">Option A</option>
    <option value="option_b">Option B</option>
</select>

<!-- Checkboxes grouped in container -->
<div id="interests" data-min-allowed="1" data-max-allowed="5">
    <label><input type="checkbox" name="interests" value="sports" /> Sports</label>
    <label><input type="checkbox" name="interests" value="music" /> Music</label>
    <label><input type="checkbox" name="interests" value="reading" /> Reading</label>
</div>

<!-- Radios grouped in container -->
<div id="accountType">
    <label><input type="radio" name="accountType" value="free" /> Free</label>
    <label><input type="radio" name="accountType" value="premium" /> Premium</label>
</div>

<!-- Image field -->
<input 
    type="file" 
    name="avatar" 
    data-allowed-mime-type-accept="image/jpeg,image/png"
    data-extentions="jpg,png"
    data-maxsize-file="2"
    data-min-width="512"
    data-max-width="2048"
    data-min-height="512"
    data-max-height="2048"
/>

<!-- Video field -->
<input 
    type="file" 
    name="video" 
    data-allowed-mime-type-accept="video/mp4,video/webm"
    data-extentions="mp4,webm"
    data-maxsize-file="100"
    data-min-width="1280"
    data-min-height="720"
/>

<!-- Document field -->
<input 
    type="file" 
    name="document" 
    data-allowed-mime-type-accept="application/pdf,application/msword"
    data-maxsize-file="10"
/>
```

### Interface

#### `FormChildrenValidateInterface`

Main validation interface for form fields:

- **`isValid(): boolean`** - Checks if field has no validation errors.
- **`fieldOptionsValidate: OptionsValidate`** - Gets current validation options.
- **`validate(): Promise<void>`** - Runs validation asynchronously.
- **`eventValidate(): EventValidate`** - Returns validation trigger event.
- **`eventClearError(): EventValidate`** - Returns error clearing event.
- **`clearErrorField(): void`** - Clears visual error state and message.

### Methods

#### `constructor(childrenInput, optionsValidate?)`

Creates a new field controller instance.

**Parameters:**
- **`childrenInput`** (`HTMLFormChildrenElement`): The DOM element to validate.
- **`optionsValidate?`** (`OptionsValidate`): Optional explicit validation options.

#### `validate(): Promise<void>`

Runs validation on the field by routing to appropriate validator.

**Behavior:**
1. Skips validation if field is empty and not required.
2. Collects validation options (from HTML attributes or defaults).
3. Routes to `FormInputValidator.allTypesValidator()`.
4. Emits validation event with result.

#### `fieldOptionsValidate: OptionsValidate`

Getter that provides validation options inferred from HTML attributes.

**Type-Specific Option Generation:**
- `text` - TextInputOptions
- `email` - EmailInputOptions
- `password` - PasswordRuleOptions with scoring
- `tel` - TelInputOptions
- `url` - URLOptions with protocol control
- `date` - DateInputOptions with format
- `number` - NumberOptions with min/max/step
- `select` - SelectOptions from option elements
- `checkbox` - OptionsCheckbox from container
- `radio` - OptionsRadio from container
- `textarea` - TextInputOptions
- `image` - OptionsImage with dimensions
- `video` - OptionsMediaVideo with dimensions
- `document` - OptionsFile
- `fqdn` - FQDNOptions

#### `isValid(): boolean`

Checks if field validation passed.

**Returns:** `true` if no errors, `false` if validation failed.

### HTML Data Attributes

#### Common Attributes (All Fields)

- **`data-min-length`** - Minimum string length
- **`data-max-length`** - Maximum string length
- **`data-error-message`** - Custom error message
- **`data-escape-strip-html-php-tags`** - Whether to escape HTML/PHP (default: true)
- **`pattern`** - Regex pattern validation
- **`required`** - Field is mandatory
- **`event-clear-error`** - Event to clear errors (default: "change")

#### Email-Specific Attributes

- **`data-allow-utf8-local-part`** - Allow UTF-8 in local part (default: true)
- **`data-allow-ip-domain`** - Allow IP addresses (default: false)
- **`data-allow-quoted-local`** - Allow quoted format (default: true)
- **`data-allow-display-name`** - Allow display names (default: false)
- **`data-require-display-name`** - Require display names (default: false)
- **`data-host-whitelist`** - Comma-separated allowed domains
- **`data-host-blacklist`** - Comma-separated forbidden domains
- **`data-blacklisted-chars`** - Forbidden characters in local part

#### URL-Specific Attributes

- **`data-allowed-protocols`** - Comma-separated protocols (default: https)
- **`data-allow-localhost`** - Allow localhost (default: false)
- **`data-allow-ip`** - Allow IP addresses (default: false)
- **`data-allow-query-params`** - Allow query strings (default: true)
- **`data-allow-hash`** - Allow fragments (default: true)
- **`data-allow-protocol-relative-urls`** - Allow //example.com (default: false)
- **`data-require-protocol`** - Protocol required (default: false)
- **`data-require-valid-protocol`** - Protocol must be in allowed list (default: true)
- **`data-require-host`** - Host required (default: true)
- **`data-require-port`** - Port required (default: false)
- **`data-disallow-auth`** - Reject credentials (default: false)
- **`data-max-allowed-length`** - Max URL length (default: 2084)
- **`data-validate-length`** - Validate length (default: true)

#### Password-Specific Attributes

- **`data-upper-case-allow`** - Require uppercase (default: true)
- **`data-lower-case-allow`** - Require lowercase (default: true)
- **`data-number-allow`** - Require numbers (default: true)
- **`data-symbol-allow`** - Require symbols (default: true)
- **`data-puntuation-allow`** - Require punctuation (default: true)
- **`data-enable-scoring`** - Enable strength scoring (default: true)
- **`data-min-lowercase`** - Minimum lowercase count
- **`data-min-uppercase`** - Minimum uppercase count
- **`data-min-number`** - Minimum number count
- **`data-min-symbol`** - Minimum symbol count
- **`data-custom-upper-regex`** - Custom uppercase regex
- **`data-custom-lower-regex`** - Custom lowercase regex
- **`data-custom-number-regex`** - Custom number regex
- **`data-custom-symbol-regex`** - Custom symbol regex
- **`data-custom-punctuation-regex`** - Custom punctuation regex
- **`data-points-per-length`** - Scoring points per character
- **`data-points-per-unique-char`** - Points for unique chars
- **`data-points-per-repeat-char`** - Points for repeated chars
- **`data-bonus-containing-lower`** - Bonus for lowercase
- **`data-bonus-containing-upper`** - Bonus for uppercase
- **`data-bonus-containing-number`** - Bonus for numbers
- **`data-bonus-containing-symbol`** - Bonus for symbols
- **`data-bonus-containing-punctuation`** - Bonus for punctuation

#### Date-Specific Attributes

- **`data-format-date`** - Date format (e.g., YYYY/MM/DD)
- **`data-allow-future`** - Allow future dates (default: false)
- **`data-allow-past`** - Allow past dates (default: false)
- **`data-strict-mode`** - Enforce exact format length (default: false)
- **`min`** - Minimum date (ISO format)
- **`max`** - Maximum date (ISO format)

#### Phone-Specific Attributes

- **`data-default-country`** - Country code (e.g., BJ, US, FR)

#### FQDN-Specific Attributes

- **`data-require-tld`** - TLD required (default: true)
- **`data-allow-numeric-tld`** - Allow numeric TLDs (default: false)
- **`data-allowed-underscores`** - Allow underscores (default: false)
- **`data-allow-wildcard`** - Allow wildcards (default: false)
- **`data-allow-trailing-dot`** - Allow trailing dot (default: false)
- **`data-ignore-max-length`** - Ignore 63-char limit (default: false)

#### Media-Specific Attributes

- **`data-allowed-mime-type-accept`** - Comma-separated MIME types
- **`data-extentions`** - Comma-separated extensions
- **`data-maxsize-file`** - Max file size (default: 2)
- **`data-unity-max-size-file`** - Size unit (B, KiB, MiB, GiB)
- **`data-min-width`** - Minimum width in pixels
- **`data-max-width`** - Maximum width in pixels
- **`data-min-height`** - Minimum height in pixels
- **`data-max-height`** - Maximum height in pixels
- **`data-unity-dimensions`** - Dimension unit (default: px)

#### Video-Specific Attributes

- **`data-duration`** - Expected duration in seconds
- **`data-unity-duration-media`** - Duration unit

#### Checkbox Group Attributes

Container must have `id` matching field `name`:

```html
<div id="interests" data-min-allowed="1" data-max-allowed="5">
    <input type="checkbox" name="interests" value="..." />
</div>
```

- **`data-min-allowed`** - Minimum selections required
- **`data-max-allowed`** - Maximum selections allowed

#### Radio Group Attributes

Container must have `id` matching field `name`:

```html
<div id="accountType">
    <input type="radio" name="accountType" value="..." />
</div>
```

### Examples

#### Form with Multiple Fields

```html
<form id="registrationForm">
    <!-- Username -->
    <input 
        type="text" 
        name="username" 
        data-min-length="3"
        data-max-length="50"
        pattern="^[a-zA-Z0-9_]+$"
        required
    />

    <!-- Email -->
    <input 
        type="email" 
        name="email" 
        data-allow-display-name="true"
        required
    />

    <!-- Password with scoring -->
    <input 
        type="password" 
        name="password" 
        data-enable-scoring="true"
        data-min-length="12"
        required
    />

    <!-- Phone -->
    <input 
        type="tel" 
        name="phone" 
        data-default-country="BJ"
        required
    />

    <!-- Website -->
    <input 
        type="url" 
        name="website" 
        data-allowed-protocols="https"
    />

    <!-- Profile image -->
    <input 
        type="file" 
        name="avatar" 
        data-allowed-mime-type-accept="image/jpeg,image/png"
        data-maxsize-file="2"
        data-min-width="512"
        data-min-height="512"
    />

    <!-- Interests checkboxes -->
    <div id="interests" data-min-allowed="1" data-max-allowed="5">
        <label><input type="checkbox" name="interests" value="sports" /> Sports</label>
        <label><input type="checkbox" name="interests" value="music" /> Music</label>
        <label><input type="checkbox" name="interests" value="reading" /> Reading</label>
    </div>

    <!-- Account type radio -->
    <div id="accountType">
        <label><input type="radio" name="accountType" value="free" required /> Free</label>
        <label><input type="radio" name="accountType" value="premium" required /> Premium</label>
    </div>

    <button type="submit">Register</button>
</form>
```

#### JavaScript Integration

```typescript
import { FieldInputController } from '@wlindabla/form_validator';

// Validate individual fields
const usernameController = new FieldInputController(
    document.getElementById('username')
);

const emailController = new FieldInputController(
    document.getElementById('email')
);

// Listen to changes and validate
document.getElementById('username').addEventListener('blur', async () => {
    await usernameController.validate();
});

document.getElementById('email').addEventListener('blur', async () => {
    await emailController.validate();
});

// Form submission
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    await usernameController.validate();
    await emailController.validate();

    if (usernameController.isValid() && emailController.isValid()) {
        console.log('Form is valid!');
        // Submit form
    } else {
        console.log('Form has errors');
    }
});
```

### Key Design Patterns

- **Facade Pattern:** Simplifies interaction with complex validation engine.
- **Adapter Pattern:** Adapts HTML form elements to validation interface.
- **Singleton Access:** Uses singleton `FormInputValidator` internally.
- **Attribute-Based Configuration:** Leverages HTML5 data attributes for flexibility.
- **Lazy Option Resolution:** Options computed on-demand from attributes.

### Best Practices

1. **Container Grouping:** Always wrap checkbox/radio groups in containers with matching `id`.
2. **Consistent Naming:** Use same `name` for input and `id` for container in groups.
3. **Explicit Validation:** Call `validate()` on blur or form submission.
4. **Error Handling:** Check `isValid()` before processing data.
5. **Clear Errors:** Call `clearErrorField()` before new validation.
6. **Use HTML5 Attributes:** Leverage native attributes (min, max, required, pattern).

### Browser Compatibility

- Works with modern browsers supporting HTML5 File API.
- Requires jQuery for DOM manipulation.
- Supports all HTML5 input types.


## Class `FormValidateController` {#FormValidateController}

**Author:** AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>  
**Package:** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator){target="_blank"}

The `FormValidateController` class is the form orchestrator and main entry point for managing HTML form validation. It manages the entire lifecycle of form field validation, instantiates field controllers, organizes fields by validation events, and provides centralized error management for all form fields using jQuery.

### Key Features

- **Centralized Form Management:** Single point of entry for entire form validation.
- **Automatic Field Discovery:** Identifies and catalogs all form fields automatically.
- **Event-Based Organization:** Groups fields by validation trigger events (blur, input, change, focus).
- **Field Controller Caching:** Maintains instances of `FieldInputController` for quick access.
- **Validator Instantiation:** Dynamically creates appropriate validators based on field type.
- **Error Management:** Centralized error clearing and state management.
- **Cache Adapter Support:** Optional validation options caching for performance.
- **Media Type Support:** Handles file inputs with media type detection (image, video, document).
- **Excluded Type Filtering:** Automatically excludes certain input types (hidden, submit, datetime).
- **jQuery Integration:** Works seamlessly with jQuery for DOM manipulation.

### Getting an Instance

```typescript
// Basic form validation
const formController = new FormValidateController();

// With specific form selector
const formController = new FormValidateController(".registration-form");

// With options cache adapter
const formController = new FormValidateController(
    ".contact-form",
    cacheAdapter
);
```

### Basic Form Validation

```typescript
const formController = new FormValidateController(".form-validate");

// Get all form fields
const fields = formController.childrens;

// Validate all fields
await formController.autoValidateAllFields();

// Validate single field
const emailField = document.getElementById("email");
await formController.validateChildrenForm(emailField);
```

### HTML Form Structure

```html
<!-- Form with fields for validation -->
<form class="form-validate" id="mainForm">
    
    <!-- Text field with blur validation -->
    <input 
        type="text" 
        id="username" 
        name="username"
        data-event-validate-blur="blur"
        data-min-length="3"
        required
    />

    <!-- Email field with blur validation -->
    <input 
        type="email" 
        id="email" 
        name="email"
        data-event-validate-blur="blur"
        required
    />

    <!-- Password field with input validation -->
    <input 
        type="password" 
        id="password" 
        name="password"
        data-event-validate-input="input"
        data-enable-scoring="true"
        required
    />

    <!-- Phone field with blur validation -->
    <input 
        type="tel" 
        id="phone" 
        name="phone"
        data-event-validate-blur="blur"
        data-default-country="BJ"
    />

    <!-- Select field with change validation -->
    <select 
        id="country" 
        name="country"
        data-event-validate-change="change"
        required
    >
        <option value="">-- Select --</option>
        <option value="BJ">Benin</option>
        <option value="FR">France</option>
    </select>

    <!-- Checkbox group with change validation -->
    <div id="interests" data-event-validate-change="change" data-min-allowed="1" data-max-allowed="3">
        <label><input type="checkbox" name="interests" value="sports" /> Sports</label>
        <label><input type="checkbox" name="interests" value="music" /> Music</label>
        <label><input type="checkbox" name="interests" value="reading" /> Reading</label>
    </div>

    <!-- Radio group with change validation -->
    <div id="accountType" data-event-validate-change="change">
        <label><input type="radio" name="accountType" value="free" required /> Free</label>
        <label><input type="radio" name="accountType" value="premium" required /> Premium</label>
    </div>

    <!-- Image file with change validation -->
    <input 
        type="file" 
        id="avatar" 
        name="avatar"
        media-type="image"
        data-event-validate-change="change"
        data-maxsize-file="2"
        data-allowed-mime-type-accept="image/jpeg,image/png"
    />

    <!-- Video file with change validation -->
    <input 
        type="file" 
        id="video" 
        name="video"
        media-type="video"
        data-event-validate-change="change"
        data-maxsize-file="100"
    />

    <!-- Document file with change validation -->
    <input 
        type="file" 
        id="document" 
        name="document"
        media-type="document"
        data-event-validate-change="change"
        data-maxsize-file="10"
    />

    <!-- Textarea with input validation -->
    <textarea 
        id="message" 
        name="message"
        data-event-validate-input="input"
        data-min-length="10"
        data-max-length="500"
        required
    ></textarea>

    <button type="submit">Submit</button>
</form>
```

### JavaScript Integration

```typescript
import { FormValidateController } from '@wlindabla/form_validator';

// Initialize form controller
const formController = new FormValidateController(".form-validate");

// Setup event listeners for each field based on validation event
formController.idChildrenUsingEventBlur.forEach(fieldId => {
    document.getElementById(fieldId)?.addEventListener('blur', async () => {
        const field = document.getElementById(fieldId);
        if (field) {
            await formController.validateChildrenForm(field);
        }
    });
});

formController.idChildrenUsingEventInput.forEach(fieldId => {
    document.getElementById(fieldId)?.addEventListener('input', async () => {
        const field = document.getElementById(fieldId);
        if (field) {
            await formController.validateChildrenForm(field);
        }
    });
});

formController.idChildrenUsingEventChange.forEach(fieldId => {
    document.getElementById(fieldId)?.addEventListener('change', async () => {
        const field = document.getElementById(fieldId);
        if (field) {
            await formController.validateChildrenForm(field);
        }
    });
});

// Form submission
document.getElementById('mainForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    await formController.autoValidateAllFields();
    
    // Check if form is valid
    const allValid = Array.from(formController.childrens).every(field => {
        const validator = formController.getValidator?.(field.name);
        return validator?.isFieldValid?.(field.name) ?? true;
    });

    if (allValid) {
        console.log('Form is valid - submitting...');
        // Submit form
    } else {
        console.log('Form has validation errors');
    }
});
```

### Constructor

```typescript
constructor(
    formCssSelector?: string,
    optionsValidatorCacheAdapter?: FieldOptionsValidateCacheAdapterInterface
)
```

**Parameters:**
- **`formCssSelector?`** (`string`) - CSS selector suffix for targeting form (default: `".form-validate"`). Selects `form.form-validate`.
- **`optionsValidatorCacheAdapter?`** (`FieldOptionsValidateCacheAdapterInterface`) - Optional cache adapter for validation options.

**Throws:** Error if no form found for given selector.

### Methods

#### `autoValidateAllFields(): Promise<void>`

Validates all form fields automatically by instantiating and invoking validators for each field.

**Behavior:**
1. Iterates through all form fields.
2. Creates `FieldInputController` for each field.
3. Runs validation asynchronously for each field.
4. Handles errors gracefully with console warnings.

**Example:**
```typescript
await formController.autoValidateAllFields();
```

#### `validateChildrenForm(target): Promise<void>`

Validates a single form field.

**Parameters:**
- **`target`** (`HTMLFormChildrenElement`) - The form field to validate.

**Behavior:**
1. Checks cache adapter for validation options (if available).
2. Creates `FieldInputController` with cached or inferred options.
3. Runs validation on the field.
4. Stores validator instance in internal cache.
5. Updates cache with computed options (non-blocking).

**Example:**
```typescript
const emailField = document.getElementById('email');
await formController.validateChildrenForm(emailField);
```

#### `clearErrorDataChildren(target): void`

Clears validation error state for a specific field.

**Parameters:**
- **`target`** (`HTMLFormChildrenElement`) - The field whose errors to clear.

**Behavior:**
1. Retrieves cached validator for field.
2. Calls `clearErrorField()` to clear visual errors.
3. Removes validator from cache.

**Example:**
```typescript
const field = document.getElementById('username');
formController.clearErrorDataChildren(field);
```

### Properties

#### `childrens: JQuery<HTMLFormChildrenElement>`

Returns all input, select, and textarea elements inside the form, excluding excluded types.

**Example:**
```typescript
const allFields = formController.childrens;
allFields.each((index, field) => {
    console.log(field.name);
});
```

#### `idChildrenUsingEventBlur: string[]`

Returns IDs of fields that trigger validation on blur event.

**Example:**
```typescript
formController.idChildrenUsingEventBlur.forEach(fieldId => {
    document.getElementById(fieldId)?.addEventListener('blur', validateField);
});
```

#### `idChildrenUsingEventInput: string[]`

Returns IDs of fields that trigger validation on input event.

#### `idChildrenUsingEventChange: string[]`

Returns IDs of fields that trigger validation on change event.

#### `idChildrenUsingEventFocus: string[]`

Returns IDs of fields that trigger validation on focus event.

#### `idChildrens: string[]`

Returns cached array of IDs for all form fields.

**Example:**
```typescript
const fieldIds = formController.idChildrens;
console.log(`Form has ${fieldIds.length} fields`);
```

#### `form: JQuery<HTMLFormElement>`

Returns the jQuery-wrapped form element.

**Example:**
```typescript
const $form = formController.form;
$form.addClass('validating');
```

### Required HTML Attributes

#### On Every Form Field

- **`id`** - Unique identifier (required for field lookup and mapping)
- **`name`** - Field name for validator instance mapping

#### On File Input Fields (`<input type="file">`)

- **`media-type`** - Must be `"image"`, `"video"`, or `"document"` to select correct validator
- Throws error if missing

#### Validation Event Attributes

Choose ONE or more:

- **`data-event-validate-blur="blur"`** - Validate on blur event
- **`data-event-validate-input="input"`** - Validate on input event
- **`data-event-validate-change="change"`** - Validate on change event
- **`data-event-validate-focus="focus"`** - Validate on focus event

#### Type-Specific Data Attributes

See `FieldInputController` documentation for all available `data-*` attributes for different field types.

### Excluded Input Types

The following input types are automatically excluded from validation:

```
hidden
submit
datetime
datetime-local
time
month
```

### Cache Adapter Interface

Optional caching for validation options:

```typescript
interface FieldOptionsValidateCacheAdapterInterface {
    getItem(key: string): Promise<OptionsValidate | undefined>;
    setItem(key: string, value: OptionsValidate): Promise<void>;
}
```

### Event-Based Organization

Fields are automatically organized by their validation trigger event:

| Event | Attribute | Use Case |
|-------|-----------|----------|
| blur | `data-event-validate-blur="blur"` | Validate when field loses focus |
| input | `data-event-validate-input="input"` | Validate as user types |
| change | `data-event-validate-change="change"` | Validate when value changes (selects, checkboxes) |
| focus | `data-event-validate-focus="focus"` | Validate when field receives focus |

### Complete Example: Registration Form

```typescript
import { FormValidateController } from '@wlindabla/form_validator';

class RegistrationFormManager {
    private formController: FormValidateController;

    constructor() {
        this.formController = new FormValidateController(".registration-form");
        this.setupEventListeners();
        this.setupFormSubmission();
    }

    private setupEventListeners(): void {
        // Blur validation (username, email, phone)
        this.formController.idChildrenUsingEventBlur.forEach(fieldId => {
            this.setupFieldValidation(fieldId, 'blur');
        });

        // Input validation (password)
        this.formController.idChildrenUsingEventInput.forEach(fieldId => {
            this.setupFieldValidation(fieldId, 'input');
        });

        // Change validation (select, checkbox, radio, file)
        this.formController.idChildrenUsingEventChange.forEach(fieldId => {
            this.setupFieldValidation(fieldId, 'change');
        });
    }

    private setupFieldValidation(fieldId: string, event: string): void {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.addEventListener(event, async () => {
            try {
                await this.formController.validateChildrenForm(field as HTMLFormChildrenElement);
            } catch (error) {
                console.error(`Validation error for ${fieldId}:`, error);
            }
        });
    }

    private setupFormSubmission(): void {
        const form = this.formController.form;
        form.on('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            await this.formController.autoValidateAllFields();

            // Check validation status
            const isFormValid = this.isFormValid();

            if (isFormValid) {
                console.log('Form is valid - ready to submit!');
                // Submit form to server
                form.get(0)?.submit();
            } else {
                console.log('Form has validation errors');
            }
        });
    }

    private isFormValid(): boolean {
        // Implementation depends on your validator instance storage
        // This is a simplified check
        return true;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationFormManager();
});
```

### Key Design Patterns

- **Orchestrator Pattern:** Manages entire form validation lifecycle.
- **Event-Based Organization:** Groups fields by validation trigger events for efficient event binding.
- **Lazy Instantiation:** Creates validators on-demand during validation.
- **Caching Strategy:** Stores validators and supports optional options caching.
- **Error Handling:** Centralizes error management and clearing.

### Best Practices

1. **Unique IDs:** Ensure every form field has a unique `id` attribute.
2. **Media Type Specification:** Always specify `media-type` on file inputs.
3. **Event Attribute Selection:** Choose appropriate validation event for each field.
4. **Error Handling:** Always handle promises in event listeners.
5. **Cache Management:** Use cache adapter for performance optimization in large forms.
6. **Container Grouping:** Wrap checkbox/radio groups in containers with matching IDs.

### Performance Considerations

- **Field Filtering:** Excluded types filtered at initialization for faster lookups.
- **Event-Based Organization:** Pre-organized fields reduce event listener attachment overhead.
- **Optional Caching:** Cache adapter support for validating large forms multiple times.
- **Non-Blocking Writes:** Cache writes performed asynchronously to avoid blocking validation.

### Exported Instance

The class is typically instantiated per form instance, not as a singleton:

```typescript
const formController = new FormValidateController(".form-validate");
```

## jQuery Integration Example

**Complete example of form validation setup using jQuery with event delegation and error handling.**

### Basic Setup with jQuery

```typescript
import {
    FormValidateController,
    FieldValidationFailed,
    FieldValidationSuccess,
    FieldValidationEventData
} from "../Validation";

import {
    addErrorMessageFieldDom,
    addHashToIds,
    HTMLFormChildrenElement,
    clearErrorInput
} from "../_Utils";

jQuery(function TestvalidateInput() {
    // Initialize form controller
    const formValidate = new FormValidateController('#form_validate');
    
    // Convert field IDs to jQuery selectors with hash prefix
    const idsBlur = addHashToIds(formValidate.idChildrenUsingEventBlur).join(",");
    const idsInput = addHashToIds(formValidate.idChildrenUsingEventInput).join(",");
    const idsChange = addHashToIds(formValidate.idChildrenUsingEventChange).join(",");
    
    // Get form reference
    const __form = formValidate.form;

    // ============================================
    // BLUR EVENT VALIDATION
    // ============================================
    __form.on("blur", `${idsBlur}`, async (event: JQuery.BlurEvent) => {
        const target = event.target;

        if ((target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
            await formValidate.validateChildrenForm(event.target as HTMLFormChildrenElement);
        }
    });

    // ============================================
    // VALIDATION FAILED EVENT
    // ============================================
    __form.on(FieldValidationFailed, (event: JQuery.TriggeredEvent) => {
        const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
        
        // Add error message to the DOM
        addErrorMessageFieldDom(jQuery(data.targetChildrenForm), data.message);
    });

    // ============================================
    // VALIDATION SUCCESS EVENT
    // ============================================
    __form.on(FieldValidationSuccess, (event: JQuery.TriggeredEvent) => {
        const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
        
        // Handle successful validation (e.g., remove error styling, show success indicator)
        // Implementation depends on your UI
    });

    // ============================================
    // INPUT EVENT (Real-time Error Clearing)
    // ============================================
    __form.on('input', `${idsInput}`, (event: JQuery.Event | any) => {
        const target = event.target;
        
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            // Clear error messages as user types
            clearErrorInput(jQuery(target));
        }
    });

    // ============================================
    // CHANGE EVENT (For Select, Checkbox, Radio, File)
    // ============================================
    __form.on('change', `${idsChange}`, async (event: JQuery.ChangeEvent) => {
        const target = event.target;
        
        // Clear previous errors
        clearErrorInput(jQuery(target));

        // Validate file inputs on change
        if (target instanceof HTMLInputElement && target.type === "file") {
            await formValidate.validateChildrenForm(event.target);
        }
    });
});
```

### How It Works

#### 1. **Form Controller Initialization**
```typescript
const formValidate = new FormValidateController('#form_validate');
```
- Creates controller for form with selector `#form_validate`
- Automatically discovers all form fields and their event attributes

#### 2. **Event Selector Preparation**
```typescript
const idsBlur = addHashToIds(formValidate.idChildrenUsingEventBlur).join(",");
const idsInput = addHashToIds(formValidate.idChildrenUsingEventInput).join(",");
const idsChange = addHashToIds(formValidate.idChildrenUsingEventChange).join(",");
```
- Converts field IDs to jQuery selectors: `#fieldId`
- Joins multiple selectors with commas: `#field1, #field2, #field3`
- Creates efficient selector string for event delegation

#### 3. **Event Delegation**
Uses jQuery's event delegation pattern for dynamic field handling:
```typescript
__form.on("blur", `${idsBlur}`, handler);  // Delegates blur event
__form.on("input", `${idsInput}`, handler);  // Delegates input event
__form.on("change", `${idsChange}`, handler);  // Delegates change event
```

### Event Flow Diagram

```
User interacts with field
        ↓
jQuery event listener triggered (blur/input/change)
        ↓
Event handler runs validation
        ↓
FormValidateController.validateChildrenForm()
        ↓
FieldInputController validates field
        ↓
Validation success/failure
        ↓
Custom event emitted (FieldValidationSuccess/FieldValidationFailed)
        ↓
Event listener handles UI updates
```

### HTML Form Structure

```html
<form id="form_validate">
    <!-- Blur validation -->
    <input 
        type="text" 
        id="username" 
        name="username"
        data-event-validate-blur="blur"
        required
    />

    <!-- Input validation (password) -->
    <input 
        type="password" 
        id="password" 
        name="password"
        data-event-validate-input="input"
        required
    />

    <!-- Change validation (select) -->
    <select 
        id="country" 
        name="country"
        data-event-validate-change="change"
        required
    >
        <option value="">-- Select --</option>
        <option value="BJ">Benin</option>
        <option value="FR">France</option>
    </select>

    <!-- Change validation (file) -->
    <input 
        type="file" 
        id="avatar" 
        name="avatar"
        media-type="image"
        data-event-validate-change="change"
    />

    <button type="submit">Submit</button>
</form>
```

### Key Helper Functions

#### `addHashToIds(ids: string[]): string[]`
Converts field IDs to jQuery selectors with hash prefix.

**Example:**
```typescript
addHashToIds(['username', 'email']) 
// Returns: ['#username', '#email']
```

#### `addErrorMessageFieldDom(element: JQuery, message: string): void`
Adds error message to field's DOM element.

**Example:**
```typescript
addErrorMessageFieldDom(jQuery('#email'), 'Invalid email format')
// Displays error message next to email field
```

#### `clearErrorInput(element: JQuery): void`
Removes error styling and messages from field.

**Example:**
```typescript
clearErrorInput(jQuery('#password'))
// Clears error state as user types
```

### Advanced Configuration with Multiple Forms

```typescript
jQuery(function() {
    // Setup validation for multiple forms
    const forms = [
        { selector: '#contactForm', name: 'Contact' },
        { selector: '#registrationForm', name: 'Registration' },
        { selector: '#loginForm', name: 'Login' }
    ];

    forms.forEach(formConfig => {
        const formValidate = new FormValidateController(formConfig.selector);
        setupFormValidation(formValidate);
    });
});

function setupFormValidation(formValidate: FormValidateController): void {
    const idsBlur = addHashToIds(formValidate.idChildrenUsingEventBlur).join(",");
    const idsInput = addHashToIds(formValidate.idChildrenUsingEventInput).join(",");
    const idsChange = addHashToIds(formValidate.idChildrenUsingEventChange).join(",");
    
    const __form = formValidate.form;

    // Setup event listeners
    __form.on("blur", idsBlur, handleBlurValidation(formValidate));
    __form.on("input", idsInput, handleInputValidation());
    __form.on("change", idsChange, handleChangeValidation(formValidate));
    __form.on(FieldValidationFailed, handleValidationFailed());
    __form.on(FieldValidationSuccess, handleValidationSuccess());
}

function handleBlurValidation(formValidate: FormValidateController) {
    return async function(event: JQuery.BlurEvent) {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            await formValidate.validateChildrenForm(event.target as HTMLFormChildrenElement);
        }
    };
}

function handleInputValidation() {
    return function(event: JQuery.Event) {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            clearErrorInput(jQuery(target));
        }
    };
}

function handleChangeValidation(formValidate: FormValidateController) {
    return async function(event: JQuery.ChangeEvent) {
        const target = event.target;
        clearErrorInput(jQuery(target));

        if (target instanceof HTMLInputElement && target.type === "file") {
            await formValidate.validateChildrenForm(event.target);
        }
    };
}

function handleValidationFailed() {
    return function(event: JQuery.TriggeredEvent) {
        const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
        addErrorMessageFieldDom(jQuery(data.targetChildrenForm), data.message);
    };
}

function handleValidationSuccess() {
    return function(event: JQuery.TriggeredEvent) {
        const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
        // Handle success
    };
}
```

### Custom Error Display Handler

```typescript
__form.on(FieldValidationFailed, (event: JQuery.TriggeredEvent) => {
    const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
    const $field = jQuery(data.targetChildrenForm);

    // Add error class for styling
    $field.addClass('is-invalid');

    // Create error message element
    const $errorDiv = jQuery('<div>')
        .addClass('error-message')
        .text(data.message);

    // Remove existing error messages
    $field.siblings('.error-message').remove();

    // Insert error message after field
    $field.after($errorDiv);

    // Show error in tooltip (optional)
    $field.attr('title', data.message);
    $field.tooltip('update');
});

__form.on(FieldValidationSuccess, (event: JQuery.TriggeredEvent) => {
    const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
    const $field = jQuery(data.targetChildrenForm);

    // Remove error class
    $field.removeClass('is-invalid');

    // Remove error message
    $field.siblings('.error-message').remove();

    // Clear tooltip
    $field.removeAttr('title');
});
```

### Form Submission Validation

```typescript
jQuery(function() {
    const formValidate = new FormValidateController('#form_validate');
    const $form = formValidate.form;

    $form.on('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        await formValidate.autoValidateAllFields();

        // Check if form is valid by examining field states
        const isFormValid = checkFormValidity(formValidate);

        if (isFormValid) {
            console.log('Form is valid - submitting...');
            // Submit form via AJAX or allow default submission
            $form.get(0)?.submit();
        } else {
            console.log('Form has validation errors');
            // Optional: scroll to first error
            const firstError = $form.find('.is-invalid:first');
            if (firstError.length) {
                jQuery('html, body').animate({
                    scrollTop: firstError.offset()?.top - 100
                }, 300);
            }
        }
    });
});

function checkFormValidity(formValidate: FormValidateController): boolean {
    // Implementation depends on your validator storage
    // This checks all fields have been validated without errors
    let allValid = true;
    
    formValidate.childrens.each(function() {
        const $field = jQuery(this);
        if ($field.hasClass('is-invalid')) {
            allValid = false;
            return false; // Break loop
        }
    });

    return allValid;
}
```

### Event Names Reference

| Event Constant | Value | Triggered When |
|---|---|---|
| `FieldValidationFailed` | `"fieldValidationFailed"` | Validation fails for a field |
| `FieldValidationSuccess` | `"fieldValidationSuccess"` | Validation passes for a field |

### Best Practices

1. **Use Event Delegation:** Attach handlers to form, not individual fields
2. **Clear Errors on Input:** Give immediate visual feedback as user corrects errors
3. **Validate on Multiple Events:** Use blur for submission-like, input for real-time feedback
4. **Handle Async Carefully:** Use `async/await` for file validation
5. **Type Safety:** Ensure proper type checking for DOM elements
6. **Error Messages:** Display clear, actionable error messages to users
7. **Accessibility:** Add ARIA labels for screen readers on errors