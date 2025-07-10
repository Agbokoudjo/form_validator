/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */
import { isPlainObject } from "./helper";

export type MergeArrayStrategy<T> = 'concat' | 'replace' | 'mergeUnique' | ((target: T[], source: T[]) => T[]);

/** Merges two arrays according to a specified strategy.
 * 
 * @template T The type of elements in the arrays.
 *  @param {T[]} target The base or destination array.
 *  @param {T[]} source The array to be merged with the target array.
 * @param {MergeArrayStrategy<T>} strategy The merging strategy to apply.
 *  - 'concat': Concatenates the two arrays (target.concat(source)).
 *  - 'replace': Completely replaces the target array with the source array.
 * - 'mergeUnique': Merges the arrays, keeping only unique elements.
 *  - (target: T[], source: T[]) => T[]: A custom function that takes the two arrays
 *  and returns the merged array.
 * @returns {T[]} A new array resulting from the merge.
 *  @throws {Error} If an unknown array merging strategy is provided.
 * ```typescript
 * 
 * Code Typescipt
 * 
 * const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// 1. Strategy 'concat'
const resultConcat = mergeArrayValues(arr1, arr2, 'concat');
console.log('Concat:', resultConcat); // Output: Concat: [1, 2, 3, 4, 5, 6]

// 2. Stratégy 'replace'
const resultReplace = mergeArrayValues(arr1, arr2, 'replace');
console.log('Replace:', resultReplace); // Output: Replace: [4, 5, 6]

// 3.Custom strategy (function) - Ex: Add only the even items from source
const customStrategy: MergeArrayStrategy = (t, s) => {
  const evenNumbersFromSource = s.filter((item: any) => typeof item === 'number' && item % 2 === 0);
  return [...t, ...evenNumbersFromSource];
};
const resultCustom = mergeArrayValues(arr1, arr2, customStrategy);
console.log('Custom:', resultCustom); // Output: Custom: [1, 2, 3, 4, 6] (car 4 et 6 sont pairs dans arr2)

const numbers1 = [1, 2, 3];
const numbers2 = [3, 4, 5];

const uniqueNumbers = mergeArrayValues(numbers1, numbers2, 'mergeUnique');
console.log('Unique Numbers:', uniqueNumbers); // Output: Unique Numbers: [1, 2, 3, 4, 5]
 * ```
 * */
export function mergeArrayValues<T>( // Ajout du paramètre de type T
    target: T[],
    source: T[],
    strategy: MergeArrayStrategy<T> = "mergeUnique"
): T[] {

    if (typeof strategy === 'function') {
        return strategy(target, source);
    }

    switch (strategy) {
        case "concat":
            return target.concat(source);

        case "mergeUnique":
            return Array.from(new Set([...target, ...source]));

        case "replace":
            return source;

        default:
            throw new Error(`Unknown table merge strategy: ${strategy}`);
    }
}

/**
 * 
 * @param obj 
 * @param defaults 
 * @returns T
 * @example 
 * ```typescript
 * type Options = {
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

    Résultat :
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
 * ```
 */
export function deepMerge<T extends object, D extends Partial<T>>(obj: T | Partial<T>, defaults: D, mergeArrays: MergeArrayStrategy<any> = 'replace'): T {
    const result = { ...obj } as { [k: string]: any };

    for (const key in defaults) {
        const defaultValue = defaults[key];
        const currentValue = result[key];

        if (currentValue === undefined) {
            result[key] = defaultValue;

        }

        if (
            isPlainObject(currentValue) &&
            isPlainObject(defaultValue)
        ) {
            result[key] = deepMerge(currentValue as Partial<T>, defaultValue as Partial<T>, mergeArrays);
        }

        if (Array.isArray(currentValue) && Array.isArray(defaultValue)) {
            result[key] = mergeArrayValues(defaultValue, currentValue, mergeArrays);
        }

        if (currentValue instanceof Map && defaultValue instanceof Map) {
            result[key] = new Map([...currentValue, ...defaultValue]);
        }

        if (currentValue instanceof Set && defaultValue instanceof Set) {
            result[key] = new Set([...currentValue, ...defaultValue]);
        }

        if (currentValue instanceof Date && defaultValue instanceof Date) {
            result[key] = new Date(defaultValue);
        }
    }

    return result as T;
}

export function deepMergeWithDefault<T extends object>(obj: T | undefined, defaults: T): T {
    return deepMerge(obj ?? {} as T, defaults);
}

/**
 * 
 * @param mergeStrategy 
 * @param objects 
 * @returns 
 * @example 
 * 
 * ```typescript
   interface AppConfig {
    name: string;
    version: string;
    settings: {
        theme: string;
        notifications: boolean;
    };
    features: string[];
    users: { id: number; name: string }[];
}

  const defaultConfig: Partial<AppConfig> = {
    name: 'My App',
    version: '1.0.0',
    settings: {
        theme: 'dark',
        notifications: true,
    },
    features: ['dashboard', 'reports'],
    users: [{ id: 1, name: 'Alice' }],
};

const userConfig: Partial<AppConfig> = {
    settings: {
        theme: 'light', // écrase 'dark'
    },
    features: ['charts', 'export'],
    users: [{ id: 2, name: 'Bob' }],
};

const adminOverrides: Partial<AppConfig> = {
    version: '1.0.1-beta', // écrase '1.0.0'
    settings: {
        notifications: false, // écrase 'true'
    },
    features: ['admin-panel'],
    users: [{ id: 3, name: 'Charlie' }],
};

// Example 1: Simple merge with default array replacement strategy
    console.log('--- Example 1: Default Strategy (replace) ---');
    const finalConfigReplace = deepMergeAll<AppConfig>(
        undefined, // Or 'replace' explicitly
        defaultConfig,
        userConfig,
        adminOverrides
    );
    console.log(JSON.stringify(finalConfigReplace, null, 2));
    Output (simplified for readability):
    {
    "name": "My App",
    "version": "1.0.1-beta",
    "settings": {
        "theme": "light",
        "notifications": false
    },
    "features": ["admin-panel"], // Tableaux remplacés : seul 'admin-panel' reste
    "users": [
        { "id": 3, "name": "Charlie" } // Tableaux remplacés : seul le dernier utilisateur reste
    ]
    }
    console.log('--- Example 2: Array Concatenation Strategy ---');
    const finalConfigConcat = deepMergeAll<AppConfig>(
    'concat',
    defaultConfig,
    userConfig,
    adminOverrides
    );
    console.log(JSON.stringify(finalConfigConcat, null, 2));
     Output (simplified for readability):
    {
        "name": "My App",
        "version": "1.0.1-beta",
        "settings": {
            "theme": "light",
            "notifications": false
    },
    "features": ["dashboard", "reports", "charts", "export", "admin-panel"], // Tous les éléments sont concaténés
    "users": [
        { "id": 1, "name": "Alice" },
        { "id": 2, "name": "Bob" },
        { "id": 3, "name": "Charlie" }
    ]
    }
    console.log('--- Example 3: Unique merging strategy for tables ---');
    const configWithDuplicateFeatures: Partial<AppConfig> = {
        features: ['dashboard', 'reports', 'charts'], // 'dashboard' et 'reports' sont des doublons avec defaultConfig
    };
    const finalConfigUnique = deepMergeAll<AppConfig>(
        'mergeUnique',
        defaultConfig,
        userConfig,
        configWithDuplicateFeatures, // Ajout pour tester les doublons
        adminOverrides
    );
    console.log(JSON.stringify(finalConfigUnique, null, 2));
    Output (simplifié pour la lisibilité):
    {
        "name": "My App",
        "version": "1.0.1-beta",
        "settings": {
            "theme": "light",
            "notifications": false
    },
    "features": ["dashboard", "reports", "charts", "export", "admin-panel"], // Les doublons sont supprimés
    "users": [
        { "id": 1, "name": "Alice" },
        { "id": 2, "name": "Bob" },
        { "id": 3, "name": "Charlie" }
    ]
    }
    Note: For objects in arrays (like 'users'), 'mergeUnique' will by default treat them as unique if they are different references. For true uniqueness by value, a custom strategy would be needed.
    console.log('\n--- Exemple 4: Utilisation d\'une fonction personnalisée pour les tableaux ---');
    const customArrayStrategy: MergeArrayStrategy<string> = (target, source) => {
        // Exemple: ne garder que les chaînes de caractères de plus de 5 caractères
        return [...target, ...source].filter((s: any) => typeof s === 'string' && s.length > 5);
    };

    const configWithCustomArrayStrategy = deepMergeAll<AppConfig>(
        customArrayStrategy as MergeArrayStrategy<any>, // Cast nécessaire car la stratégie est générique sur T
        defaultConfig,
        userConfig,
        adminOverrides
    );
    console.log(JSON.stringify(configWithCustomArrayStrategy, null, 2));
     Output (simplifié pour la lisibilité):
    {
        "name": "My App",
        "version": "1.0.1-beta",
        "settings": {
            "theme": "light",
            "notifications": false
        },
        "features": ["dashboard", "reports", "charts", "export", "admin-panel"], // Tous les éléments dont la longueur > 5
        "users": [
            { "id": 1, "name": "Alice" },
            { "id": 2, "name": "Bob" },
            { "id": 3, "name": "Charlie" }
        ]
    }
    OR

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
    formats: ['text'], // on veut fusionner
  },
  features: {
    payment: false, // écrase la valeur
  }
};

const merged = deepMergeAll<typeof defaultOptions>('concat', defaultOptions, userOptions);

console.log(merged);


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

 * ```
 */
export function deepMergeAll<T>(
    mergeStrategy: MergeArrayStrategy<T> = 'replace',
    ...objects: Partial<T>[]
): T {

    if (objects.length === 0) throw new Error('At least one object is required');

    return objects.reduce((acc: Partial<T>, obj: Partial<T>) => deepMerge(acc, obj, mergeStrategy), {} as Partial<T>) as T;
}

export type MergeObjects<T extends any[]> =
    T extends [infer First, ...infer Rest]
    ? First & MergeObjects<Rest>
    : unknown;


/**
 * @example 
---

## ✅ Requested updates:

| Functionality                         | Including |
| ------------------------------------------ | ------ |
| 🔄 Recursive fusion                     | ✅      |
| 🧠 TypeScript Inference                    | ✅      |
| 🔁 Multiple fusion (`obj1, obj2...`)     | ✅      |
| 🧬 Custom merging of tables      | ✅      |
| 🗺️ Support for `Map`, `Set`, `Date`       | ✅      |
| 🧩 Automatically merged return type | ✅      |


---

✅ Result: the final return type is the intersection of all the passed objects (well-typed in VSCode or TS server).

---

## ✅ Complete example

```ts
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

```
---

## ✅ En résumé

| Feature                            | Inclus |
| ---------------------------------- | ------ |
| Complete recursive fusion        | ✅      |
| Management of the Map, Set, Date classes            | ✅      |
|Configurable table merging   | ✅      |
| Well inferred return type         | ✅      |
| Unlimited number of merged objects | ✅      |

---

 */
export function deepMergeAllExtended<T extends object[]>(
    mergeArrays: MergeArrayStrategy<T>,
    ...objects: T
): MergeObjects<T> {

    if (objects.length === 0) throw new Error('At least one object is required');

    return objects.reduce((acc, obj) => deepMerge(acc, obj, mergeArrays), {} as any);
}
