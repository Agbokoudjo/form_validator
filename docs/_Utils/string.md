::: container
# 📚 Documentation des fonctions de chaînes

## 📌 Table des matières

-   [escapeHtmlBalise()](#escapeHtmlBalise)
-   [ucfirst()](#ucfirst)
-   [nl2br()](#nl2br)
-   [capitalizeString](#capitalizeString)
-   [usernameFormat](#usernameFormat)
-   [toBoolean](#toBoolean)
-   [addHashToIds](#addHashToIds)
-   [isByteLength](#isByteLength)
-   [countChars](#countChars)
-   [analyzeWord](#analyzeWord)
-   [scoreWord](#scoreWord)

::: {#escapeHtmlBalise .section}
## 🔹 escapeHtmlBalise()

**Description:**

Escapes HTML tags within a string, array, or object. Also removes HTML
tags if requested.

**Parameters:**

-   `content` --- String, array, or object containing strings to be
    cleaned.
-   `stripHtmlTags` --- Boolean, indicates whether to remove HTML tags
    before escaping (default: `true`).

**Returns:** Cleaned string or structure.

**Error:** If empty or undefined.

**Examples:**

    escapeHtmlBalise("<b>Hello</b>");
        // "Hello"
:::

------------------------------------------------------------------------

::: {#ucfirst .section}
## 🔹 ucfirst()

**Description:**

Capitalizes the first letter and converts the rest to lowercase. Can
also escape HTML tags beforehand.

**Parameters:**

-   `str` --- The string to transform.
-   `escapeHtmlBalise_string` --- If true, escapes HTML tags first
    (default: `true`).
-   `locales` --- Optional. Specifies the locale to use (e.g.,
    \"en-US\").

**Returns:** A string with the first letter capitalized.

**Example:**

    ucfirst("agbOkoudjo");
        // "Agbokoudjo"
:::

------------------------------------------------------------------------

::: {#nl2br .section}
## 🔹 nl2br()

**Description:**

Inserts HTML `<br>` tags before all newlines in a string.

**Parameters:**

-   `str` --- The string containing newlines.

**Returns:** String with `\n` converted to `<br>`.

**Example:**

    nl2br("Hello\nEveryone");
        // "Hello<br>\nEveryone"
:::

------------------------------------------------------------------------

::: {#capitalizeString .section .doc-section}
## capitalizeString

**Description:**\
Capitalizes each word in a string. This function transforms each word by
making the first letter uppercase and the rest lowercase. Useful for
formatting names or titles.

**Usage examples:**

-   `"hounha franck empedocle"` → `"Hounha Franck Empedocle"`
-   `"internationales web services"` → `"Internationales Web Services"`

#### Parameters:

-   `data: string` -- The input string to be transformed.
-   `separator_toString: string` (optional, default = `" "`) -- Word
    separator.
-   `finale_separator_toString: string` (optional, default = `" "`) --
    Final join separator.
-   `escapeHtmlBalise_string: boolean` (optional, default = `true`) --
    Escapes HTML tags if true.
-   `locales: string | string[]` (optional) -- Locale(s) to use for case
    transformation.

#### Returns:

`string` -- The formatted string with each word capitalized.
:::

------------------------------------------------------------------------

::: {#usernameFormat .section .doc-section}
## usernameFormat

**Description:**\
Formats a string into a structured full name by capitalizing the first
name(s) and uppercasing the last name. You can choose the position of
the last name (left or right).

**Examples of usage:**

-   `usernameFormat("Agbokoudjo hounha franck empedocle hounha franck empedocle Agbokoudjo", "left")`
    → `"Hounha Franck Empedocle AGBOKOUDJO"`
-   `usernameFormat("Agbokoudjo hounha franck empedocle hounha franck empedocle Agbokoudjo", "right")`
    → `"AGBOKOUDJO Hounha Franck Empedocle"`

#### Parameters:

-   `value_username: string` -- The input full name string.
-   `position_lastname: "left" | "right"` (optional, default = `"left"`)
    -- Position of the last name.
-   `separator_toString: string` (optional, default = `" "`) --
    Separator for words.
-   `finale_separator_toString: string` (optional, default = `" "`) --
    Final separator for joining.
-   `locales: string | string[]` (optional) -- Locales for case
    transformation.

#### Returns:

`string` -- A formatted full name with first names capitalized and last
name uppercased.
:::

------------------------------------------------------------------------

::: {#toBoolean .section .doc-section}
## toBoolean

**Description:**\
Converts a string value to a boolean. Handles common truthy and falsy
representations.

**Truthy values:** `"true"`, `"1"`, `"yes"`

**Falsy values:** `"false"`, `"0"`, `"no"`

#### Parameters:

-   `value: string | null | undefined` -- The input string to convert.

#### Returns:

`boolean` -- The boolean representation of the input string.
:::

------------------------------------------------------------------------

::: {#addHashToIds .section .doc-section}
## addHashToIds

**Description:**\
Adds a hash symbol (`#`) at the beginning of each string in an array.
Commonly used for generating CSS selectors from a list of element IDs.

#### Example:

          const ids = ['name', 'email', 'submit'];
          const result = addHashToIds(ids);
          console.log(result); // ['#name', '#email', '#submit']
            

#### Parameters:

-   `ids: string[]` -- An array of element IDs.

#### Returns:

`string[]` -- A new array where each ID is prefixed with `#`.
:::

------------------------------------------------------------------------

::: {#toBoolean .section .doc-section}
## toBoolean

**Description:**\
Converts a string value to a boolean. Handles common truthy and falsy
representations.

**Truthy values:** `"true"`, `"1"`, `"yes"`

**Falsy values:** `"false"`, `"0"`, `"no"`

#### Parameters:

-   `value: string | null | undefined` -- The input string to convert.

#### Returns:

`boolean` -- The boolean representation of the input string.
:::

------------------------------------------------------------------------

::: {#addHashToIds .section .doc-section}
## addHashToIds

**Description:**\
Adds a hash symbol (`#`) at the beginning of each string in an array.
Commonly used for generating CSS selectors from a list of element IDs.

#### Example:

            const ids = ['name', 'email', 'submit'];
            const result = addHashToIds(ids);
            console.log(result); // ['#name', '#email', '#submit']
              

#### Parameters:

-   `ids: string[]` -- An array of element IDs.

#### Returns:

`string[]` -- A new array where each ID is prefixed with `#`.
:::

::: {#isByteLength .section}
## isByteLength

**Function:** Checks if the byte length (UTF-8) of a string falls within
a given range.

This function encodes the string using \`encodeURI\` to calculate the
actual byte size, making it useful for validating:

-   form fields sensitive to byte size (like email addresses,
    usernames),
-   database columns with size limits,
-   or in network transmission contexts.

### Signature

    isByteLength(str: string, options?: ByteLengthOptions): boolean

### Parameters

-   **str** *(string)*: The string to evaluate.
-   **options** *(ByteLengthOptions)* (optional):
    -   **min** *(number)*: Minimum byte length (default: 0).
    -   **max** *(number)*: Maximum byte length (optional).

### Returns

**(boolean)**: Returns \`true\` if the byte length is within the
specified range, otherwise \`false\`.

### Examples

    // Correct length: 5 ASCII letters = 5 bytes
            isByteLength("hello", { min: 3, max: 10 }); // true
            
            // é = 2 bytes → exceeds max
            isByteLength("é", { min: 1, max: 1 }); // false
            
            // Each character = 3 bytes, total = 6
            isByteLength("你好", { max: 4 }); // false
            
            // ç = 2 bytes, total = 9
            isByteLength("François", { max: 9 }); // true
              

### See also

-   [encodeURI -
    MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI){target="_blank"}
:::

::: {#countChars .section}
## countChars

**Function:** Counts the number of occurrences of each character in a
string.

This function returns a JavaScript `Map`, where each distinct character
is a key and its frequency is the associated value.\
It\'s optimized for short strings (less than 255 characters) and throws
an error if this limit is exceeded, suggesting using `countWord()` for
longer texts or word analyses.

### Signature

    countChars(str: string): Map<string, number>

### Parameters

-   **str** *(string)*: The string to analyze.

### Returns

**(Map\<string, number\>)**: A Map containing each unique character as a
key, and its frequency as a value.

### Exceptions

-   **Error**: If the string contains more than 255 characters.\
    Message:
    `<string> is too long. Maximum allowed is 255 characters. Use countWord() instead for processing.`

### Examples

    // Simple example with repeated letters
            countChars("hello"); // Result: Map { 'h' => 1, 'e' => 1, 'l' => 2, 'o' => 1 }
            
            // Example with spaces and punctuation
            countChars("Hi! Hi!");
            // Result: Map { 'H' => 2, 'i' => 2, '!' => 2, ' ' => 1 }
              

### Notes

-   Special characters, uppercase/lowercase letters, and spaces are all
    counted as is.
-   For analyzing words or long sentences, use the `countWord()`
    function instead (not included here).
:::

::: {#analyzeWord .section}
## analyzeWord

**Function:** Analyzes the composition of a word or phrase by counting
the types of characters present.

This function returns an object containing the total number of
characters, the number of unique characters, as well as the distribution
by type (uppercase, lowercase, digits, symbols, punctuation).\
It is customizable via regular expressions and options to enable or
disable certain categories.

### Signature

    analyzeWord(word: string, analyzeWordOptions?: AnalyzeWordOptions): WordAnalysisResult

### Parameters

-   **word** *(string)*: The string to analyze.
-   **analyzeWordOptions** *(optional)*: A configuration object allowing
    to:
    -   Provide custom regex: `customUpperRegex`, `customLowerRegex`,
        etc.
    -   Enable/disable character types to analyze via
        `analyzeCharTypes`.

### Returns

**WordAnalysisResult**: An object containing:

-   `length`: Total length of the word.
-   `uniqueChars`: Number of distinct characters.
-   `uppercaseCount`: Number of uppercase letters.
-   `lowercaseCount`: Number of lowercase letters.
-   `numberCount`: Number of digits.
-   `symbolCount`: Number of symbols.
-   `punctuationCount`: Number of punctuation marks.

### Exceptions

-   **TypeError**: If the `word` argument is not a string.
-   **Error**: If `countChars` fails (e.g., text too long).

### Examples

    // Basic analysis
            analyzeWord("Hello123!");
            // Result:
            {
              length: 9,
              uniqueChars: 8,
              uppercaseCount: 1,
              lowercaseCount: 4,
              numberCount: 3,
              symbolCount: 1,
              punctuationCount: 0
            }
            
            // Analysis with custom regex
            analyzeWord("ça c'est génial!", {
              customLowerRegex: /^[a-zàâäéèêëïîôöùûüç]$/i,
              customUpperRegex: /^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ]$/
            });
            
            // Analysis with allowed type filtering
            analyzeWord("User@domain.com!", {
              analyzeCharTypes: {
                allowedUpper: true,
                allowedLower: true,
                allowedNumber: false,
                allowedSymbol: true,
                allowedPunctuation: true
              }
            });
              

### Notes

-   Custom regex allows handling non-Latin or accented alphabets.
-   Categories do not overlap: a character is counted in only one
    category according to priority order.
-   The result is useful for advanced input validations or linguistic
    statistics.
:::

::: {#scoreWord .section}
## scoreWord

**Function:** Calculates a richness or complexity score for a word based
on its characteristic analysis, considering its length, the number of
unique characters, repetitions, and the presence of specific types
(uppercase, digits, symbols, punctuation, etc.).

### Signature

            scoreWord(analysis: WordAnalysisResult, scoringOptions?: WordScoringOptions): ScoredWord
              

### Parameters

-   **analysis** *(WordAnalysisResult)*: Result from `analyzeWord`
    containing character counts.
-   **scoringOptions** *(optional)*: Options to customize the score
    calculation. See the `WordScoringOptions` interface below.

### Returns

**ScoredWord**: Object containing:

-   `score`: The numeric score obtained.
-   `level`: Assessed complexity level: `'weak'`, `'medium'`, or
    `'strong'`.

### Associated Interfaces

#### WordAnalysis

            interface WordAnalysis {
              length: number;
              uniqueChars: number;
              lowercaseCount: number;
              uppercaseCount: number;
              numberCount: number;
              symbolCount: number;
              punctuationCount: number;
            }
              

#### WordScoringOptions

            interface WordScoringOptions {
              pointsPerLength?: number;      // Points per total character
              pointsPerUniqueChar?: number;    // Points per unique character
              pointsPerRepeatChar?: number;    // Points for each repeated character
            
              bonusForContainingLower?: number;  // Bonus for lowercase letters
              bonusForContainingUpper?: number;  // Bonus for uppercase letters
              bonusForContainingNumber?: number; // Bonus for digits
              bonusForContainingSymbol?: number; // Bonus for symbols
              bonusForContainingPunctuation?: number; // Bonus for punctuation
            }
              

#### ScoredWord

            interface ScoredWord {
              score: number;
              level: 'weak' | 'medium' | 'strong';
            }
              

### Example

            const analysis = analyzeWord("Bonjour123!");
            const result = scoreWord(analysis, {
              pointsPerLength: 2,
              pointsPerUniqueChar: 2,
              pointsPerRepeatChar: 1,
              bonusForContainingLower: 10,
              bonusForContainingUpper: 10,
              bonusForContainingNumber: 10,
              bonusForContainingSymbol: 10
            });
            
            console.log(result);
            // { score: 95, level: 'strong' }
              

### Scoring Logic

-   Points are awarded for:
    -   Each total character (`length`)
    -   Each unique character
    -   Each repetition (calculated as `length - uniqueChars`)
-   Bonuses are added if the word contains at least one:
    -   Lowercase letter
    -   Uppercase letter
    -   Digit
    -   Symbol
    -   Punctuation (if present in the analysis)
-   The complexity level is determined by the score:
    -   `score ≥ 80` → **strong**
    -   `50 ≤ score < 80` → **medium**
    -   `score < 50` → **weak**

### Typical Usage

Ideal for evaluating the strength of passwords, identifiers, or any
input requiring a good balance of length, variety, and complexity.
:::
:::
