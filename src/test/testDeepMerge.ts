import {
    MergeArrayStrategy,
    deepMerge, deepMergeAll,
    mergeArrayValues,
    Logger
} from "../_Utils";

jQuery(function testDeepMerge() {

    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    // 1. Strategy 'concat'
    const resultConcat = mergeArrayValues(arr1, arr2, 'concat');
    Logger.log('Concat:', resultConcat);
    const resultReplace = mergeArrayValues(arr1, arr2, 'replace');
    Logger.log('Replace:', resultReplace);
    const customStrategy: MergeArrayStrategy<number> = (t, s) => {
        const evenNumbersFromSource = s.filter((item: any) => typeof item === 'number' && item % 2 === 0);
        return [...t, ...evenNumbersFromSource];
    };
    const resultCustom = mergeArrayValues(arr1, arr2, customStrategy);
    Logger.log('Custom:', resultCustom);
    const numbers1 = [1, 2, 3];
    const numbers2 = [3, 4, 5];

    const uniqueNumbers = mergeArrayValues(numbers1, numbers2, 'mergeUnique');
    Logger.log('Unique Numbers:', uniqueNumbers); // Output: Unique Numbers: [1, 2, 3, 4, 5]
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
    Logger.log('deeMerge:', merged);

    interface AppConfig {
        name: string;
        version: string;
        settings: {
            theme?: string;
            notifications?: boolean;
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
    const finalConfigReplace = deepMergeAll<AppConfig>(
        'replace',
        adminOverrides,
        defaultConfig,
        userConfig,
    );
    const finalConfigReplace_deep_Merge = deepMerge(
        adminOverrides,
        defaultConfig,
        'replace', // Or 'replace' explicitly
    );

    Logger.log('--- Example 1: Default Strategy (replace) --:-', finalConfigReplace);
    Logger.log('--- Example 2: Default Strategy (replace) deepMerge--:-', finalConfigReplace_deep_Merge);
    const finalConfigConcat = deepMergeAll<AppConfig>(
        'concat',
        defaultConfig,
        userConfig,
        adminOverrides
    );
    Logger.log('--- Example 2: Array Concatenation Strategy ---', finalConfigConcat);

})

