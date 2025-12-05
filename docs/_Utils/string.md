# @wlindabla/form_validator

**A Comprehensive Utility Library for String Validation and Text Manipulation**

> Professional-grade string validation, formatting, and analysis tools designed for modern frontend applications.

---

## Table of Contents

- [@wlindabla/form\_validator](#wlindablaform_validator)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
  - [Core Concepts](#core-concepts)
    - [Design Philosophy](#design-philosophy)
    - [Type Handling](#type-handling)
  - [HTML Escaping \& Security](#html-escaping--security)
    - [escapeHtmlBalise()](#escapehtmlbalise)
    - [unescapeHtmlBalise()](#unescapehtmlbalise)
  - [String Formatting Functions](#string-formatting-functions)
    - [ucfirst()](#ucfirst)
    - [capitalizeString()](#capitalizestring)
    - [usernameFormat()](#usernameformat)
    - [nl2br()](#nl2br)
  - [Type Conversion](#type-conversion)
    - [toBoolean()](#toboolean)
  - [Utilities](#utilities)
    - [addHashToIds()](#addhashtoids)
    - [isByteLength()](#isbytelength)
    - [countChars()](#countchars)
    - [pad()](#pad)
    - [hasProperty()](#hasproperty)
  - [Advanced Analysis](#advanced-analysis)
    - [analyzeWord()](#analyzeword)
    - [scoreWord()](#scoreword)
  - [Best Practices](#best-practices)
    - [1. Security First - Always Escape User Input](#1-security-first---always-escape-user-input)
    - [2. Validate Before Formatting](#2-validate-before-formatting)
    - [3. Handle Null/Undefined Gracefully](#3-handle-nullundefined-gracefully)
    - [4. Avoid Double Escaping](#4-avoid-double-escaping)
    - [5. Use Custom Regex for International Text](#5-use-custom-regex-for-international-text)
    - [6. Combine Functions for Validation Pipelines](#6-combine-functions-for-validation-pipelines)
  - [Performance Considerations](#performance-considerations)
    - [1. String Length Limits](#1-string-length-limits)
    - [2. Optimization Tips](#2-optimization-tips)
    - [3. Object Recursion Impact](#3-object-recursion-impact)
    - [4. Regex Performance](#4-regex-performance)
  - [Security Guidelines](#security-guidelines)
    - [1. XSS Prevention](#1-xss-prevention)
    - [2. Prototype Pollution Prevention](#2-prototype-pollution-prevention)
    - [3. Byte-Length Validation](#3-byte-length-validation)
    - [4. Type Validation](#4-type-validation)
    - [5. Locale-Aware Capitalization](#5-locale-aware-capitalization)
  - [Troubleshooting](#troubleshooting)
    - ["Input too long for countChars()"](#input-too-long-for-countchars)
    - [Double Unescaping](#double-unescaping)
    - [Missing Multibyte Characters in Analysis](#missing-multibyte-characters-in-analysis)
    - [Locale Issues](#locale-issues)
  - [Contributing \& Support](#contributing--support)
  - [License](#license)
  - [Version History](#version-history)

---

## Introduction

`@wlindabla/form_validator` is a production-ready utility library designed to handle common frontend validation and string manipulation tasks. It provides robust tools for:

- **Security**: HTML escaping and XSS prevention
- **Formatting**: Professional string capitalization and username formatting
- **Analysis**: Character-level analysis and word complexity scoring
- **Validation**: Byte-length validation, type checking, and content analysis

This library prioritizes security, performance, and developer experience with a minimal learning curve.

---

## Installation

```bash
npm install @wlindabla/form_validator
```

Or with yarn:

```bash
yarn add @wlindabla/form_validator
```

---

## Core Concepts

### Design Philosophy

This library operates on a principle of **explicit input validation** and **flexible output handling**. Each function:

1. **Validates input types** - Throws errors for invalid inputs
2. **Handles null/undefined gracefully** - Converts unsafe values to safe defaults
3. **Supports recursive operations** - Works with strings, arrays, and nested objects
4. **Provides customization** - Allows locale-specific and regex-based customization

### Type Handling

Most functions accept multiple input types:

- **String**: Single value processing
- **Array**: Batch processing of string arrays
- **Object**: Recursive processing of object properties
- **Null/Undefined**: Returns empty string by default; throws error if strict

---

## HTML Escaping & Security

### escapeHtmlBalise()

**Purpose**: Escapes HTML special characters to prevent XSS attacks and safely embed user content.

**Signature**:
```typescript
function escapeHtmlBalise(
    content: string | string[] | Record<string, any> | undefined | null,
    stripHtmlTags: boolean = true
): string | string[] | Record<string, any>
```

**Parameters**:
- `content` - Input string, array, or object to escape
- `stripHtmlTags` - If `true`, removes HTML tags before escaping (default: `true`)

**Returns**: Escaped version of input, preserving its structure

**Character Mapping**:
| Character | Escaped Form |
|-----------|--------------|
| `&` | `&amp;` |
| `"` | `&quot;` |
| `'` | `&#x27;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `/` | `&#x2F;` |
| `\` | `&#x5C;` |
| `` ` `` | `&#96;` |

**Examples**:

```typescript
import { escapeHtmlBalise } from '@wlindabla/form_validator';

// Escape a simple string
escapeHtmlBalise('<script>alert("XSS")</script>');
// Output: "&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;"

// Escape an array of strings
escapeHtmlBalise(['<b>Bold</b>', 'Normal text']);
// Output: ["&lt;b&gt;Bold&lt;&#x2F;b&gt;", "Normal text"]

// Escape nested object
escapeHtmlBalise({
    title: '<h1>Welcome</h1>',
    meta: { description: 'User input: "Hello"' }
});
// Output: {
//   title: "&lt;h1&gt;Welcome&lt;&#x2F;h1&gt;",
//   meta: { description: "User input: &quot;Hello&quot;" }
// }

// Disable HTML tag stripping
escapeHtmlBalise('<p>Safe content</p>', false);
// Output: "&lt;p&gt;Safe content&lt;&#x2F;p&gt;"
```

**Important Rules**:
- **Always use before inserting user input** into dynamic HTML content
- **Encode order matters**: `&amp;` replacement must occur last to prevent double-encoding
- **Nested objects** are processed recursively; non-string values pass through unchanged
- **Throws error** if content is `null` or `undefined`

**Internal Processing**:
1. Validates input type
2. Optionally removes HTML tags using regex: `/<\/?[^>]+(>|$)/g`
3. Sequentially replaces special characters (order preserved)
4. Recursively processes array and object contents

---

### unescapeHtmlBalise()

**Purpose**: Reverses HTML entity escaping to restore original content.

**Signature**:
```typescript
function unescapeHtmlBalise(
    content: string | string[] | Record<string, any> | undefined | null
): string | string[] | Record<string, any>
```

**Parameters**: Same as `escapeHtmlBalise()`

**Returns**: Unescaped version of input

**Examples**:

```typescript
import { unescapeHtmlBalise } from '@wlindabla/form_validator';

// Unescape a simple string
unescapeHtmlBalise('&lt;b&gt;Bold&lt;&#x2F;b&gt;');
// Output: "<b>Bold</b>"

// Unescape an array
unescapeHtmlBalise(['&amp;copy;', '&quot;Hello&quot;']);
// Output: ["©", '"Hello"']

// Unescape nested object
unescapeHtmlBalise({
    name: '&lt;John&gt;',
    meta: { desc: '&quot;Developer&quot;' }
});
// Output: {
//   name: "<John>",
//   meta: { desc: '"Developer"' }
// }
```

**Critical Rule - Replacement Order**:
The `&amp;` replacement **must be last** to prevent double-unescaping:
```typescript
// WRONG: &amp; first → double-unescaping
'&amp;lt;'.replace(/&amp;/g, '&') // '&lt;' → '<' (incorrect!)

// CORRECT: &amp; last → accurate unescaping
// Process &quot;, &lt;, etc. first, then &amp; last
```

**Use Case**: When restoring user-submitted content from an escaped database or API response.

---

## String Formatting Functions

### ucfirst()

**Purpose**: Capitalizes the first letter and converts remaining letters to lowercase.

**Signature**:
```typescript
function ucfirst(
    str: string,
    escapeHtmlBalise_string: boolean = true,
    locales?: string | string[]
): string
```

**Parameters**:
- `str` - Input string to format
- `escapeHtmlBalise_string` - If `true`, escapes HTML before processing (default: `true`)
- `locales` - Locale(s) for uppercase conversion (e.g., 'en-US', 'fr-FR')

**Returns**: Formatted string

**Examples**:

```typescript
import { ucfirst } from '@wlindabla/form_validator';

ucfirst('hOLLO');
// Output: "Hello"

ucfirst('<b>john</b>');
// Output: "&lt;B&gt;john&lt;&#x2F;b&gt;" (HTML escaped)

ucfirst('<b>john</b>', false);
// Output: "<b>john</b>" (HTML preserved, first char capitalized)

// With locale (Turkish)
ucfirst('istanbul', true, 'tr-TR');
// Output: "İstanbul" (Turkish capital İ)
```

**Internal Processing**:
1. Returns input unchanged if empty
2. Optionally escapes HTML tags
3. Converts first character using `toLocaleUpperCase()`
4. Converts remaining characters to lowercase

---

### capitalizeString()

**Purpose**: Capitalizes each word in a string (title case).

**Signature**:
```typescript
function capitalizeString(
    data: string,
    separator_toString: string = " ",
    finale_separator_toString: string = " ",
    escapeHtmlBalise_string: boolean = true,
    locales?: string | string[]
): string
```

**Parameters**:
- `data` - Input string containing words
- `separator_toString` - Delimiter between words (default: space)
- `finale_separator_toString` - Delimiter for joined output (default: space)
- `escapeHtmlBalise_string` - If `true`, escapes HTML tags (default: `true`)
- `locales` - Locale(s) for uppercase conversion

**Returns**: String with each word capitalized

**Examples**:

```typescript
import { capitalizeString } from '@wlindabla/form_validator';

// Basic usage
capitalizeString('hello world developers');
// Output: "Hello World Developers"

// Custom separator
capitalizeString('john-doe-smith', '-', '-');
// Output: "John-Doe-Smith"

// With HTML escaping
capitalizeString('john<script>alert(1)</script>doe');
// Output: "John&lt;script&gt;alert(1)&lt;&#x2F;script&gt;Doe"

// Single word
capitalizeString('hello');
// Output: "Hello" (delegates to ucfirst)

// Multiple spaces normalized
capitalizeString('john    doe');
// Output: "John Doe" (extra spaces reduced to single space)
```

**Internal Processing**:
1. Normalizes multiple spaces to single space: `replace(/\s+/g, " ")`
2. Splits by `separator_toString`
3. If single word, delegates to `ucfirst()`
4. If multiple words:
   - Escapes all words (if enabled)
   - Maps each word through `ucfirst()` with `escapeHtmlBalise_string = false`
   - Joins with `finale_separator_toString`

---

### usernameFormat()

**Purpose**: Formats a full name with separate first name(s) and last name positioning.

**Signature**:
```typescript
function usernameFormat(
    value_username: string,
    position_lastname: "left" | "right" = "left",
    separator_toString: string = " ",
    finale_separator_toString: string = " ",
    locales?: string | string[]
): string
```

**Parameters**:
- `value_username` - Full name string
- `position_lastname` - Where to place the last name: `"left"` or `"right"` (default: `"left"`)
- `separator_toString` - Word delimiter (default: space)
- `finale_separator_toString` - Output word delimiter (default: space)
- `locales` - Locale for uppercase conversion

**Returns**: Formatted full name

**Examples**:

```typescript
import { usernameFormat } from '@wlindabla/form_validator';

// Basic usage - last name on left
usernameFormat('hounha franck empedocle agbokoudjo');
// Output: "AGBOKOUDJO Hounha Franck Empedocle"

// Last name on right
usernameFormat('hounha franck empedocle agbokoudjo', 'right');
// Output: "Hounha Franck Empedocle AGBOKOUDJO"

// Custom separators
usernameFormat('john-doe-smith', 'left', '-', '-');
// Output: "SMITH-John-Doe"

// Single name (no formatting applied)
usernameFormat('John');
// Output: "John"

// With extra spaces
usernameFormat('john    doe    smith', 'right');
// Output: "John Doe SMITH" (spaces normalized internally)
```

**Processing Logic**:

| `position_lastname` | Last Name Source | First Names | Result Format |
|---------------------|------------------|-------------|---------------|
| `"left"` | First word (uppercase) | Remaining words (title case) | `LASTNAME FirstName MiddleName` |
| `"right"` | Last word (uppercase) | All preceding words (title case) | `FirstName MiddleName LASTNAME` |

**Internal Processing**:
1. Trims and normalizes spaces
2. Validates minimum 2 words required
3. Escapes all words for security
4. Extracts lastname based on `position_lastname`
5. Extracts firstname(s) based on position
6. Capitalizes firstname(s) using `capitalizeString()`
7. Joins lastname and firstnames with `finale_separator_toString`

---

### nl2br()

**Purpose**: Converts newline characters to HTML `<br>` tags.

**Signature**:
```typescript
function nl2br(str: string): string
```

**Parameters**: `str` - Input string with newlines

**Returns**: String with newlines converted to `<br>` tags

**Examples**:

```typescript
import { nl2br } from '@wlindabla/form_validator';

nl2br('Hello\nWorld');
// Output: "Hello<br>\nWorld"

nl2br('Line 1\r\nLine 2\nLine 3');
// Output: "Line 1<br>\r\nLine 2<br>\nLine 3"

nl2br('Unix\nWindows\r\nMac\r');
// Output: "Unix<br>\nWindows<br>\r\nMac<br>\r"
```

**Supported Newline Types**:
- `\n` (Unix/Linux)
- `\r\n` (Windows CRLF)
- `\n\r` (old Mac)
- `\r` (legacy)

**Regex Pattern**: `([^>\r\n]?)(\r\n|\n\r|\r|\n)/g`

**Rule**: Always use this before inserting user-generated multiline text into HTML.

---

## Type Conversion

### toBoolean()

**Purpose**: Converts string representations to boolean values safely.

**Signature**:
```typescript
function toBoolean(value: string | null | undefined): boolean
```

**Parameters**: `value` - String to convert

**Returns**: `true` or `false`

**Recognized Values**:

| Input (case-insensitive) | Result |
|--------------------------|--------|
| `"true"`, `"1"`, `"yes"` | `true` |
| `"false"`, `"0"`, `"no"` | `false` |
| Any other string | `false` (with console warning) |
| `null`, `undefined` | `false` |

**Examples**:

```typescript
import { toBoolean } from '@wlindabla/form_validator';

toBoolean('true');     // true
toBoolean('YES');      // true (case-insensitive)
toBoolean('1');        // true
toBoolean('false');    // false
toBoolean('0');        // false
toBoolean('maybe');    // false (logs warning)
toBoolean(null);       // false
toBoolean(undefined);  // false
```

**Use Case**: Parsing HTML data attributes, form checkboxes, or API response flags.

---

## Utilities

### addHashToIds()

**Purpose**: Prefixes array elements with `#` for CSS selector generation.

**Signature**:
```typescript
function addHashToIds(ids: string[]): string[]
```

**Parameters**: `ids` - Array of element IDs

**Returns**: Array with `#` prefixed to each element

**Examples**:

```typescript
import { addHashToIds } from '@wlindabla/form_validator';

addHashToIds(['name', 'email', 'submit']);
// Output: ['#name', '#email', '#submit']

// Use in DOM queries
const ids = ['form-input-1', 'form-input-2'];
const selectors = addHashToIds(ids);
document.querySelectorAll(selectors.join(', '));
// Queries: #form-input-1, #form-input-2
```

**Internal Processing**:
1. Validates input is array; returns empty array if not
2. Maps each element: `id => #${id}`

---

### isByteLength()

**Purpose**: Validates that a string's byte length falls within specified range.

**Signature**:
```typescript
function isByteLength(
    str: string,
    options: ByteLengthOptions = {}
): boolean
```

**Parameters**:
- `str` - String to validate
- `options.min` - Minimum byte length (default: 0)
- `options.max` - Maximum byte length (optional)

**Returns**: `true` if within range, `false` otherwise

**Examples**:

```typescript
import { isByteLength } from '@wlindabla/form_validator';

// ASCII characters (1 byte each)
isByteLength('hello', { min: 3, max: 10 });     // true
isByteLength('hello', { min: 6 });              // false

// Multibyte characters (UTF-8)
isByteLength('é', { min: 1, max: 1 });          // false (é = 2 bytes)
isByteLength('François', { max: 9 });           // true (ç = 2 bytes, total = 9)
isByteLength('你好', { max: 4 });               // false (each char = 3 bytes, total = 6)

// Only minimum
isByteLength('test', { min: 2 });               // true

// Only maximum
isByteLength('test', { max: 10 });              // true
```

**Critical Rule - UTF-8 Encoding**:
```
ASCII characters (a-z, 0-9): 1 byte
Extended Latin (àáâäéè): 2 bytes
CJK characters (中文, 日本): 3 bytes
Emoji: 4 bytes
```

**Internal Processing**:
1. Encodes string using `encodeURI()`: converts special bytes to `%XX` format
2. Splits result and counts segments
3. Compares: `byteLength >= min && (max === undefined || byteLength <= max)`

**Use Case**: Validating database field constraints, email lengths, or API payload size requirements.

---

### countChars()

**Purpose**: Counts frequency of each character in a string.

**Signature**:
```typescript
function countChars(str: string): Map<string, number>
```

**Parameters**: `str` - Input string (max 255 characters)

**Returns**: Map where keys are characters and values are occurrence counts

**Examples**:

```typescript
import { countChars } from '@wlindabla/form_validator';

countChars('hello');
// Map(4) { 'h' => 1, 'e' => 1, 'l' => 2, 'o' => 1 }

countChars('mississippi');
// Map(4) { 'm' => 1, 'i' => 4, 's' => 4, 'p' => 2 }

countChars('aaa');
// Map(1) { 'a' => 3 }

// Convert to object
const charMap = countChars('hello');
const obj = Object.fromEntries(charMap);
// { h: 1, e: 1, l: 2, o: 1 }
```

**Constraints**:
- **Maximum length**: 255 characters (throws error if exceeded)
- Use `analyzeWord()` for longer strings

**Internal Processing**:
1. Validates string length ≤ 255
2. Trims whitespace
3. Iterates each character, incrementing count in Map
4. Returns Map for efficient O(1) lookups

---

### pad()

**Purpose**: Pads single-digit strings with leading zero.

**Signature**:
```typescript
function pad(val: string): string
```

**Parameters**: `val` - String to pad

**Returns**: Padded string

**Examples**:

```typescript
import { pad } from '@wlindabla/form_validator';

pad('5');       // "05"
pad('12');      // "12" (unchanged)
pad('0');       // "00"
pad('');        // "" (unchanged)
pad('123');     // "123" (unchanged)
```

**Use Case**: Formatting time (hours, minutes, seconds) and dates.

```typescript
const hours = pad('9');    // "09"
const mins = pad('5');     // "05"
const time = `${hours}:${mins}:00`;  // "09:05:00"
```

---

### hasProperty()

**Purpose**: Safely checks if object has a property (prevents prototype pollution).

**Signature**:
```typescript
function hasProperty(
    obj: object,
    prop: string | number | symbol
): boolean
```

**Parameters**:
- `obj` - Object to check
- `prop` - Property name/symbol to test

**Returns**: `true` if object has property as own property, `false` otherwise

**Examples**:

```typescript
import { hasProperty } from '@wlindabla/form_validator';

const user = { name: 'John', age: 30 };

hasProperty(user, 'name');       // true
hasProperty(user, 'age');        // true
hasProperty(user, 'toString');   // false (inherited, not own)

// Prototype pollution prevention
const polluted = { value: 10 };
polluted.hasOwnProperty = () => false;  // Override built-in

hasProperty(polluted, 'value');  // true (correctly identifies own property)
```

**Security Features**:
- Uses `Object.hasOwn()` if available (modern environment)
- Falls back to `Object.prototype.hasOwnProperty.call()` (secure method)
- Prevents prototype pollution attacks
- Ignores overridden `hasOwnProperty` method

**Rule**: Always use this instead of direct property access when checking object contents.

---

## Advanced Analysis

### analyzeWord()

**Purpose**: Analyzes character composition of a string (counts character types).

**Signature**:
```typescript
function analyzeWord(
    word: string,
    analyzeWordOptions?: AnalyzeWordOptions
): AnalysisWordInterface
```

**Parameters**:
- `word` - String to analyze
- `analyzeWordOptions` - Optional configuration object

**Returns**: Analysis object with character type counts

**Return Interface**:
```typescript
interface AnalysisWordInterface {
    length: number;              // Total characters
    uniqueChars: number;         // Count of distinct characters
    uppercaseCount: number;      // Uppercase letters (A-Z)
    lowercaseCount: number;      // Lowercase letters (a-z)
    numberCount: number;         // Digits (0-9)
    symbolCount: number;         // Special characters (@, #, etc.)
    punctuationCount: number;    // Punctuation marks (., !, ?, etc.)
}
```

**Examples**:

```typescript
import { analyzeWord } from '@wlindabla/form_validator';

// Basic analysis
analyzeWord('Hello123!');
// {
//   length: 9,
//   uniqueChars: 8,
//   uppercaseCount: 1,
//   lowercaseCount: 4,
//   numberCount: 3,
//   symbolCount: 1,
//   punctuationCount: 0
// }

// Password strength analysis
analyzeWord('SecureP@ss123');
// {
//   length: 14,
//   uniqueChars: 12,
//   uppercaseCount: 2,
//   lowercaseCount: 8,
//   numberCount: 3,
//   symbolCount: 1,
//   punctuationCount: 0
// }

// Only lowercase
analyzeWord('hello');
// {
//   length: 5,
//   uniqueChars: 4,
//   uppercaseCount: 0,
//   lowercaseCount: 5,
//   numberCount: 0,
//   symbolCount: 0,
//   punctuationCount: 0
// }
```

**Advanced Options - Custom Regex**:

```typescript
// Analyze with custom regex patterns (for international characters)
analyzeWord('Café Français!', {
    customLowerRegex: /^[a-zàâäéèêëïîôöùûüç]$/i,
    customUpperRegex: /^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ]$/,
    analyzeCharTypes: {
        allowedUpper: true,
        allowedLower: true,
        allowedNumber: true,
        allowedSymbol: true,
        allowedPunctuation: true
    }
});
```

**Configuration Options**:

```typescript
interface AnalyzeWordOptions {
    // Custom regex patterns for character classification
    customUpperRegex?: RegExp;
    customLowerRegex?: RegExp;
    customNumberRegex?: RegExp;
    customSymbolRegex?: RegExp;
    customPunctuationRegex?: RegExp;
    
    // Toggle character types to count
    analyzeCharTypes?: {
        allowedUpper?: boolean;
        allowedLower?: boolean;
        allowedNumber?: boolean;
        allowedSymbol?: boolean;
        allowedPunctuation?: boolean;
    };
}
```

**Internal Processing**:
1. Validates input is string (throws TypeError if not)
2. Counts character frequency using `countChars()`
3. Merges custom options with defaults using `deepMerge()`
4. Iterates character map, testing each against regex patterns
5. Accumulates counts for enabled character types
6. Returns structured analysis object

**Constraints**:
- Input string cannot exceed 255 characters (inherited from `countChars()`)
- Each character tested against regex patterns in order: uppercase → lowercase → number → symbol → punctuation

---

### scoreWord()

**Purpose**: Calculates a complexity/strength score for analyzed text.

**Signature**:
```typescript
function scoreWord(
    analysis: AnalysisWordInterface,
    scoringOptions: WordScoringOptions = {}
): ScoredWord
```

**Parameters**:
- `analysis` - Output from `analyzeWord()`
- `scoringOptions` - Custom scoring configuration

**Returns**: Scored word object

**Return Interface**:
```typescript
interface ScoredWord {
    score: number;           // Numeric score (typically 0-100+)
    level: WordScoreLevel;   // 'weak' | 'medium' | 'strong'
}
```

**Scoring Configuration**:

```typescript
interface WordScoringOptions {
    pointsPerLength?: number;              // Points per character (default: 1)
    pointsPerUniqueChar?: number;          // Points per unique character (default: 2)
    pointsPerRepeatChar?: number;          // Points per repeated character (default: 0.5)
    
    // Bonuses for character type presence (if count > 0)
    bonusForContainingLower?: number;      // Bonus for lowercase presence (default: 10)
    bonusForContainingUpper?: number;      // Bonus for uppercase presence (default: 10)
    bonusForContainingNumber?: number;     // Bonus for digit presence (default: 10)
    bonusForContainingSymbol?: number;     // Bonus for symbol presence (default: 10)
    bonusForContainingPunctuation?: number; // Bonus for punctuation presence (default: 10)
}
```

**Score Level Thresholds**:
- **Strong**: score ≥ 80
- **Medium**: 50 ≤ score < 80
- **Weak**: score < 50

**Examples**:

```typescript
import { analyzeWord, scoreWord } from '@wlindabla/form_validator';

// Example 1: Strong password
const strongAnalysis = analyzeWord('MyP@ssw0rd!');
const strongScore = scoreWord(strongAnalysis);
// {
//   score: 95,
//   level: 'strong'
// }

// Example 2: Weak password
const weakAnalysis = analyzeWord('password');
const weakScore = scoreWord(weakAnalysis);
// {
//   score: 25,
//   level: 'weak'
// }

// Example 3: Custom scoring
const analysis = analyzeWord('Test123');
const customScore = scoreWord(analysis, {
    pointsPerLength: 2,           // 2 points per character
    pointsPerUniqueChar: 3,       // 3 points per unique character
    pointsPerRepeatChar: 0.2,     // Lower penalty for repetition
    bonusForContainingLower: 15,
    bonusForContainingUpper: 15,
    bonusForContainingNumber: 20,
    bonusForContainingSymbol: 25
});
// Returns higher score with aggressive bonuses
```

**Scoring Formula**:

```
score = (length × pointsPerLength)
      + (uniqueChars × pointsPerUniqueChar)
      + ((length - uniqueChars) × pointsPerRepeatChar)
      + bonusForContainingLower (if lowercaseCount > 0)
      + bonusForContainingUpper (if uppercaseCount > 0)
      + bonusForContainingNumber (if numberCount > 0)
      + bonusForContainingSymbol (if symbolCount > 0)
      + bonusForContainingPunctuation (if punctuationCount > 0)
```

**Use Cases**:

1. **Password Strength Indicator**:
```typescript
const analysis = analyzeWord(userPassword);
const scored = scoreWord(analysis);
console.log(`Your password strength: ${scored.level}`);
```

2. **Form Validation**:
```typescript
const analysis = analyzeWord(username);
const scored = scoreWord(analysis, {
    pointsPerLength: 1,
    bonusForContainingNumber: 20
});
if (scored.score < 40) {
    showError('Username too simple');
}
```

**Internal Processing**:
1. Extracts all scoring parameters with defaults
2. Calculates base score from length and unique characters
3. Adds repetition points (characters - unique)
4. Adds bonuses for each character type present
5. Determines level based on score thresholds
6. Returns structured result

---

## Best Practices

### 1. Security First - Always Escape User Input

```typescript
import { escapeHtmlBalise } from '@wlindabla/form_validator';

// ❌ WRONG: Direct user input into HTML
const userComment = '<script>stealData()</script>';
document.innerHTML = userComment;  // XSS vulnerability!

// ✅ CORRECT: Escape before insertion
const safeComment = escapeHtmlBalise(userComment);
document.innerHTML = safeComment;  // Safe
```

### 2. Validate Before Formatting

```typescript
import { capitalizeString, isByteLength } from '@wlindabla/form_validator';

// ✅ Validate constraints, then format
function formatUsername(input: string) {
    if (!isByteLength(input, { min: 3, max: 50 })) {
        throw new Error('Username must be 3-50 bytes');
    }
    return capitalizeString(input);
}
```

### 3. Handle Null/Undefined Gracefully

```typescript
import { analyzeWord } from '@wlindabla/form_validator';

// ❌ WRONG: No null check
const analysis = analyzeWord(userInput);  // Crashes if userInput is null

// ✅ CORRECT: Validate before passing
function analyzeUserText(input?: string) {
    if (!input || input.trim().length === 0) {
        return null;  // Handle gracefully
    }
    return analyzeWord(input);
}
```

### 4. Avoid Double Escaping

```typescript
import { escapeHtmlBalise, unescapeHtmlBalise } from '@wlindabla/form_validator';

// ❌ WRONG: Escaping twice
const text = 'User said: "Hello"';
const escaped1 = escapeHtmlBalise(text);      // &quot;
const escaped2 = escapeHtmlBalise(escaped1);  // &amp;quot; (DOUBLE ESCAPED)

// ✅ CORRECT: Escape once, insert once
const text = 'User said: "Hello"';
const safeText = escapeHtmlBalise(text);
element.innerHTML = safeText;  // Insert only once
```

### 5. Use Custom Regex for International Text

```typescript
import { analyzeWord } from '@wlindabla/form_validator';

// For French/accented characters
const analysis = analyzeWord('Café Français', {
    customLowerRegex: /^[a-zàâäéèêëïîôöùûüçœæ]$/i,
    customUpperRegex: /^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜÇŒÆ]$/
});
```

### 6. Combine Functions for Validation Pipelines

```typescript
import { 
    escapeHtmlBalise, 
    capitalizeString, 
    isByteLength,
    analyzeWord,
    scoreWord 
} from '@wlindabla/form_validator';

// Complete form validation pipeline
function validateAndFormatName(input: string) {
    // Step 1: Validate byte length
    if (!isByteLength(input, { min: 2, max: 100 })) {
        throw new Error('Name too long or too short');
    }
    
    // Step 2: Escape potentially harmful content
    const safe = escapeHtmlBalise(input);
    
    // Step 3: Format properly
    const formatted = capitalizeString(safe);
    
    // Step 4: Analyze quality (optional)
    const analysis = analyzeWord(formatted);
    
    return { formatted, analysis };
}
```

---

## Performance Considerations

### 1. String Length Limits

| Function | Max Length | Reason |
|----------|-----------|--------|
| `countChars()` | 255 chars | Character frequency map memory |
| `analyzeWord()` | 255 chars | Uses `countChars()` internally |
| `escapeHtmlBalise()` | Unlimited | Character-by-character replacement |
| `capitalizeString()` | Unlimited | Word-based processing |

### 2. Optimization Tips

```typescript
// ❌ INEFFICIENT: Processing same string multiple times
const escaped = escapeHtmlBalise(input);
const formatted = capitalizeString(escaped);
const analyzed = analyzeWord(formatted);  // 3 iterations!

// ✅ EFFICIENT: Single pass where possible
const escaped = escapeHtmlBalise(input);
const formatted = capitalizeString(escaped);
// Only analyze if necessary
if (needsAnalysis) {
    const analyzed = analyzeWord(formatted);
}
```

### 3. Object Recursion Impact

```typescript
// Large nested objects processed recursively
const largeObject = {
    level1: {
        level2: {
            level3: {
                // ... many nested levels
                content: '<script>dangerous</script>'
            }
        }
    }
};

// This traverses entire object tree
const escaped = escapeHtmlBalise(largeObject);

// Better: Escape only specific fields
const escaped = {
    ...largeObject,
    level1: {
        ...largeObject.level1,
        level3: escapeHtmlBalise(largeObject.level1.level2.level3.content)
    }
};
```

### 4. Regex Performance

```typescript
// Custom regex patterns should be compiled once
import { analyzeWord } from '@wlindabla/form_validator';

// ✅ GOOD: Regex compiled once
const customRegex = /^[a-z]$/i;
const analysis = analyzeWord(input, {
    customLowerRegex: customRegex
});

// ❌ AVOID: Creating regex in loop
for (const word of words) {
    analyzeWord(word, {
        customLowerRegex: /^[a-z]$/i  // Recompiled each iteration
    });
}
```

---

## Security Guidelines

### 1. XSS Prevention

The library provides built-in XSS protection through HTML escaping:

```typescript
import { escapeHtmlBalise } from '@wlindabla/form_validator';

// User input from untrusted source
const userInput = req.body.comment;

// Escape before any use
const safe = escapeHtmlBalise(userInput, true);

// Now safe to insert into HTML
element.innerHTML = safe;
```

**Escaped Characters**:
- `<`, `>` → `&lt;`, `&gt;` (prevent tag injection)
- `"`, `'` → `&quot;`, `&#x27;` (prevent attribute injection)
- `/` → `&#x2F;` (prevent regex escape)
- `\` → `&#x5C;` (prevent escape sequences)
- `` ` `` → `&#96;` (prevent template injection)

### 2. Prototype Pollution Prevention

Always use `hasProperty()` for object checks:

```typescript
import { hasProperty } from '@wlindabla/form_validator';

// ❌ VULNERABLE: Can be tricked by prototype pollution
if ('admin' in userObject) {
    grantAdmin(user);  // Polluted prototype can fake this
}

// ✅ SAFE: Checks only own properties
if (hasProperty(userObject, 'admin')) {
    grantAdmin(user);  // Safe from prototype attacks
}
```

### 3. Byte-Length Validation

Protect against oversized inputs:

```typescript
import { isByteLength } from '@wlindabla/form_validator';

function acceptUserInput(input: string) {
    // Database field is VARCHAR(255) - max 255 bytes
    if (!isByteLength(input, { max: 255 })) {
        throw new Error('Input too long for database');
    }
    
    // Prevents buffer overflow, injection attacks, etc.
    saveToDatabase(input);
}
```

### 4. Type Validation

Functions validate input types internally:

```typescript
import { analyzeWord, ucfirst } from '@wlindabla/form_validator';

// analyzeWord() throws TypeError if not string
try {
    analyzeWord(123);  // Throws: "argument must be a string"
} catch (e) {
    console.error('Type validation failed:', e.message);
}

// ucfirst() handles gracefully
ucfirst(null);  // Returns: ''
ucfirst('');    // Returns: ''
```

### 5. Locale-Aware Capitalization

Prevent incorrect case conversion in international contexts:

```typescript
import { ucfirst, capitalizeString } from '@wlindabla/form_validator';

// ❌ WRONG: Assumes English casing rules
ucfirst('istanbul');  // "Istanbul" (wrong for Turkish)

// ✅ CORRECT: Use proper locale
ucfirst('istanbul', true, 'tr-TR');  // "İstanbul" (correct Turkish capital)

// Company name formatting
const name = 'internationales web services';
const formatted = capitalizeString(name, ' ', ' ', true, 'en-US');
```

---

## Troubleshooting

### "Input too long for countChars()"

```typescript
// Error: "Input is too long. Maximum allowed is 255 characters."

// Solution: Use analyzeWord() which handles longer strings
// OR truncate before analysis
const text = veryLongString.substring(0, 255);
const analysis = analyzeWord(text);
```

### Double Unescaping

```typescript
// Problem: Running unescapeHtmlBalise() multiple times
const text = '&amp;lt;';
const once = unescapeHtmlBalise(text);      // '&lt;'
const twice = unescapeHtmlBalise(once);    // '<' (wrong context)

// Solution: Unescape only once, at the right layer
const fromDatabase = '&lt;script&gt;';
const display = unescapeHtmlBalise(fromDatabase);  // One pass only
```

### Missing Multibyte Characters in Analysis

```typescript
// Problem: Emoji not counted properly
analyzeWord('Hello 😀');
// May not recognize emoji if regex doesn't include it

// Solution: Use custom regex
analyzeWord('Hello 😀', {
    customSymbolRegex: /[\p{Emoji}]/u  // Unicode emoji pattern
});
```

### Locale Issues

```typescript
// Problem: Inconsistent casing across locales
capitalizeString('straße', ' ', ' ', true, 'de-DE');  // Handles German ß

// Solution: Always specify locale if needed
capitalizeString(text, ' ', ' ', true, ['de-DE', 'en-US']);
```

---

## Contributing & Support

For issues, feature requests, or contributions:

- **Author**: AGBOKOUDJO Franck
- **Email**: franckagbokoudjo301@gmail.com
- **Phone**: +229 0167 25 18 86
- **Company**: INTERNATIONALES WEB APPS & SERVICES
- **LinkedIn**: https://www.linkedin.com/in/internationales-web-apps-services-120520193/

---

## License

This library is maintained by AGBOKOUDJO Franck and INTERNATIONALES WEB SERVICES. Please contact the author for licensing information.

---

## Version History

| Version | Changes |
|---------|---------|
| 2.4.0 | Initial release with core HTML escaping, formatting, and analysis functions |

---

**Last Updated**: December 2025
**Stability**: Production Ready