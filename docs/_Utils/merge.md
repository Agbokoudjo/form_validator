<div>

# mergeArrayValues Documentation

</div>

## Table of Contents

-   [mergeArrayValues](#mergeArrayValues)
-   [Available Merge Strategies](#merge-strategies)
-   [Examples](#examples)
-   [deepMerge](#deepMerge)
-   [deepMergeAll](#deepMergeAll)
-   [deepMergeAllExtended](#deepMergeAllExtended)

::: {#mergeArrayValues .section}
## mergeArrayValues

**Function:** Merges two arrays based on the specified strategy.

### Signature

    function mergeArrayValues<T>(
      target: T[],
      source: T[],
      strategy?: MergeArrayStrategy<T>
    ): T[]
        

### Parameters

-   **target**: The original array (T\[\])
-   **source**: The new array to merge (T\[\])
-   **strategy** *(optional)*: The merge strategy to apply

### Return

A new array of type T\[\] after applying the chosen merge strategy.

### Throws

Throws an `Error` if an unknown strategy is provided.
:::

::: {#merge-strategies .section}
## Available Merge Strategies

  Strategy                    Description
  --------------------------- -------------------------------------------------------------------
  `'concat'`                  Concatenates `target` and `source` arrays.
  `'replace'`                 Replaces the entire `target` array with `source`.
  `'mergeUnique'`             Merges both arrays and removes duplicate values (based on `Set`).
  `(target, source) => T[]`   Custom merging function that returns a new array.
:::

::: {#examples .section}
## Examples

    // Example 1: concat strategy
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    const result1 = mergeArrayValues(arr1, arr2, 'concat');
    console.log(result1); // [1, 2, 3, 4, 5, 6]

    // Example 2: replace strategy
    const result2 = mergeArrayValues(arr1, arr2, 'replace');
    console.log(result2); // [4, 5, 6]

    // Example 3: mergeUnique strategy
    const result3 = mergeArrayValues([1, 2, 3], [3, 4, 5], 'mergeUnique');
    console.log(result3); // [1, 2, 3, 4, 5]

    // Example 4: Custom strategy
    const customStrategy = (t, s) => [...t, ...s.filter(n => n % 2 === 0)];
    const result4 = mergeArrayValues([1, 2, 3], [4, 5, 6], customStrategy);
    console.log(result4); // [1, 2, 3, 4, 6]
        
:::

::: {#deepMerge .section}
## deepMerge

**Function:** Deeply merges a user-defined object with default values
recursively.

### Signature

      function deepMerge<T extends object, D extends Partial<T>>(
        obj: T | Partial<T>,
        defaults: D,
        mergeArrays: MergeArrayStrategy = 'replace'
      ): T
        

### Parameters

-   **obj**: The user-provided object (may be partial).
-   **defaults**: A full default object that provides fallback values.
-   **mergeArrays** *(optional)*: Strategy for merging arrays. Default
    is `'replace'`.

### Return

Returns a new object where missing or undefined properties in `obj` are
filled in using values from `defaults`. Nested objects, arrays, Maps,
Sets, and Dates are handled appropriately.

### Merge Behavior

-   **Objects**: merged recursively.
-   **Arrays**: merged based on `mergeArrays` strategy (e.g., replace,
    concat, mergeUnique).
-   **Maps**: merged using spread into a new `Map`.
-   **Sets**: merged into a new `Set` with unique values.
-   **Dates**: replaced with a copy of the default date.

### Example

      // Type definition
      type Options = {
        security: {
          csrf: boolean;
          xss: boolean;
        };
        caching: {
          enabled: boolean;
          ttl: number;
        };
      };
      
      const userOptions = {
        security: {
          csrf: true
        }
      };
      
      const defaultOptions: Options = {
        security: {
          csrf: false,
          xss: true
        },
        caching: {
          enabled: true,
          ttl: 300
        }
      };
      
      const merged = deepMerge(userOptions, defaultOptions);
      
      console.log(merged);
      
      /*
      Output:
      {
        security: {
          csrf: true,
          xss: true
        },
        caching: {
          enabled: true,
          ttl: 300
        }
      }
      */
        
:::

::: {#deepMergeAll .section}
## deepMergeAll

**Function:** Deeply merges multiple objects into a single one using a
configurable array merge strategy.

### Signature

      function deepMergeAll<T>(
        mergeStrategy: MergeArrayStrategy<T> = 'replace',
        ...objects: Partial<T>[]
      ): T
        

### Parameters

-   **mergeStrategy** *(optional)*: Strategy to merge arrays. Options
    include:
    -   `'replace'`: replaces arrays completely (default)
    -   `'concat'`: concatenates arrays
    -   `'mergeUnique'`: merges arrays while removing duplicates
    -   `(target: T[], source: T[]) => T[]`: a custom merge function
-   **\...objects**: List of objects to merge (must be at least one).

### Returns

A new object resulting from deeply merging all provided objects using
the specified array strategy.

### Examples

#### Example 1: Default (replace strategy)

      const finalConfig = deepMergeAll('replace', defaultConfig, userConfig, adminOverrides);
      
      /*
      {
        name: "My App",
        version: "1.0.1-beta",
        settings: {
          theme: "light",
          notifications: false
        },
        features: ["admin-panel"],
        users: [{ id: 3, name: "Charlie" }]
      }
      */
        

#### Example 2: Concat strategy

      const finalConcat = deepMergeAll('concat', defaultConfig, userConfig, adminOverrides);
      
      /*
      {
        name: "My App",
        version: "1.0.1-beta",
        settings: {
          theme: "light",
          notifications: false
        },
        features: ["dashboard", "reports", "charts", "export", "admin-panel"],
        users: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
          { id: 3, name: "Charlie" }
        ]
      }
      */
        

#### Example 3: Unique merging strategy

      const finalUnique = deepMergeAll('mergeUnique', defaultConfig, userConfig, configWithDuplicateFeatures, adminOverrides);
      
      /*
      {
        name: "My App",
        version: "1.0.1-beta",
        settings: {
          theme: "light",
          notifications: false
        },
        features: ["dashboard", "reports", "charts", "export", "admin-panel"],
        users: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
          { id: 3, name: "Charlie" }
        ]
      }
      */
        

#### Example 4: Custom array strategy

      const customStrategy: MergeArrayStrategy = (target, source) => {
        return [...target, ...source].filter(s => typeof s === 'string' && s.length > 5);
      };
      
      const finalCustom = deepMergeAll(customStrategy, defaultConfig, userConfig, adminOverrides);
      
      /*
      {
        name: "My App",
        version: "1.0.1-beta",
        settings: {
          theme: "light",
          notifications: false
        },
        features: ["dashboard", "reports", "charts", "export", "admin-panel"],
        users: [...]
      }
      */
        

#### Example 5: Real-world config merge

      const defaultOptions = {
        logging: {
          level: 'info',
          formats: ['json'],
        },
        features: {
          auth: true,
          payment: true,
        }
      };
      
      const userOptions = {
        logging: {
          formats: ['text'],
        },
        features: {
          payment: false,
        }
      };
      
      const merged = deepMergeAll('concat', defaultOptions, userOptions);
      
      /*
      {
        logging: {
          level: 'info',
          formats: ['json', 'text']
        },
        features: {
          auth: true,
          payment: false
        }
      }
      */
        

### Errors

-   Throws an error if no objects are passed to the function.
:::

::: {#deepMergeAllExtended .section}
## deepMergeAllExtended

**Function:** Deeply merges multiple objects recursively using a
specified array merging strategy. The final return type is inferred as
the intersection of all input object types.

### Signature

      function deepMergeAllExtended<T extends object[]>(
        mergeArrays: MergeArrayStrategy<T>,
        ...objects: T
      ): MergeObjects<T>
        

### Parameters

-   **mergeArrays**: Strategy for merging arrays.
    -   `'replace'`: replaces arrays completely
    -   `'concat'`: concatenates arrays
    -   `'mergeUnique'`: merges arrays keeping only unique values
    -   `(target: T[], source: T[]) => T[]`: custom array merging
        function
-   **\...objects**: A variadic list of objects to merge.

### Returns

A new object of type `MergeObjects<T>`, which is the intersection of all
input types with proper typing and full deep merge behavior.

### Supported Features

-   ✅ Recursive deep object merging
-   ✅ TypeScript intersection inference
-   ✅ Array strategy support (replace, concat, unique, custom)
-   ✅ Native support for `Map`, `Set`, and `Date`
-   ✅ Multiple object merge (variadic)

### Example

      const defaults = {
        env: 'prod',
        security: {
          headers: ['X-Frame-Options'],
        },
        cache: new Map([['enabled', true]]),
        lastModified: new Date('2023-01-01'),
      };
      
      const userConfig = {
        env: 'dev',
        security: {
          headers: ['Content-Security-Policy'],
        },
        cache: new Map([['ttl', 300]]),
      };
      
      const final = deepMergeAllExtended('concat', defaults, userConfig);
      
      /*
      Typed result:
      {
        env: "prod",
        security: {
          headers: ["X-Frame-Options", "Content-Security-Policy"]
        },
        cache: Map(2),
        lastModified: Date
      }
      */
        

### Example of inferred type

      type Config1 = { name: string; };
      type Config2 = { debug: boolean; };
      
      const merged = deepMergeAllExtended('replace', { name: "App" }, { debug: true });
      
      // Type of 'merged' is: { name: string; debug: boolean; }
        

### Errors

-   Throws an error if no objects are provided.

### Summary Table

  Feature                       Included
  ----------------------------- ----------
  Recursive merging             ✅
  Custom array strategy         ✅
  Supports Map / Set / Date     ✅
  Unlimited number of objects   ✅
  Type inference                ✅
:::
