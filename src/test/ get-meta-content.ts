/**
 * Unit Tests for getMetaContent Utility
 * 
 * @module MetaContentTests
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 */

import {
    getMetaContent,
    getMetaContentSafe,
    hasMetaTag,
    getMultipleMetaContents,
    getMetaContentAsJSON,
    getMetaContentAsNumber,
    getMetaContentAsBoolean,
    MetaTagNotFoundError,
    EmptyContentError
} from '../_Utils/dom';
import { JQueryNotAvailableError } from "../_Utils/jQueryExtension";
// ============================================================================
// TEST SETUP UTILITIES
// ============================================================================

/**
 * Helper pour créer un meta tag dans le DOM
 */
function createMetaTag(name: string, content: string): HTMLMetaElement {
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
    return meta;
}

/**
 * Helper pour supprimer un meta tag du DOM
 */
function removeMetaTag(name: string): void {
    const meta = document.querySelector(`meta[name="${name}"]`);
    if (meta) {
        meta.remove();
    }
}

/**
 * Helper pour nettoyer tous les meta tags de test
 */
function cleanupTestMetaTags(): void {
    document.querySelectorAll('meta[name^="test-"]').forEach(meta => {
        meta.remove();
    });
}

// ============================================================================
// TEST SUITE 1: BASIC FUNCTIONALITY
// ============================================================================

describe('getMetaContent - Basic Functionality', () => {
    beforeEach(() => {
        cleanupTestMetaTags();
    });

    afterEach(() => {
        cleanupTestMetaTags();
    });

    test('should retrieve meta content successfully', () => {
        createMetaTag('test-meta', 'test-value');

        const content = getMetaContent('test-meta');

        expect(content).toBe('test-value');
    });

    test('should trim whitespace by default', () => {
        createMetaTag('test-meta', '  test-value  ');

        const content = getMetaContent('test-meta');

        expect(content).toBe('test-value');
    });

    test('should not trim when trim option is false', () => {
        createMetaTag('test-meta', '  test-value  ');

        const content = getMetaContent('test-meta', { trim: false });

        expect(content).toBe('  test-value  ');
    });

    test('should throw MetaTagNotFoundError when meta tag does not exist', () => {
        expect(() => {
            getMetaContent('non-existent-meta');
        }).toThrow(MetaTagNotFoundError);
    });

    test('should throw EmptyContentError when content is empty', () => {
        createMetaTag('test-meta', '');

        expect(() => {
            getMetaContent('test-meta');
        }).toThrow(EmptyContentError);
    });

    test('should throw EmptyContentError when content is only whitespace', () => {
        createMetaTag('test-meta', '   ');

        expect(() => {
            getMetaContent('test-meta');
        }).toThrow(EmptyContentError);
    });
});

// ============================================================================
// TEST SUITE 2: OPTIONS HANDLING
// ============================================================================

describe('getMetaContent - Options Handling', () => {
    beforeEach(() => {
        cleanupTestMetaTags();
    });

    afterEach(() => {
        cleanupTestMetaTags();
    });

    test('should return default value when meta not found', () => {
        const content = getMetaContent('non-existent', {
            defaultValue: 'default-value'
        });

        expect(content).toBe('default-value');
    });

    test('should return default value when content is empty and throwOnEmpty is true', () => {
        createMetaTag('test-meta', '');

        const content = getMetaContent('test-meta', {
            defaultValue: 'default-value',
            throwOnEmpty: true
        });

        expect(content).toBe('default-value');
    });

    test('should return empty string when throwOnEmpty is false', () => {
        createMetaTag('test-meta', '');

        const content = getMetaContent('test-meta', {
            throwOnEmpty: false
        });

        expect(content).toBe('');
    });

    test('should combine multiple options correctly', () => {
        createMetaTag('test-meta', '  ');

        const content = getMetaContent('test-meta', {
            trim: true,
            throwOnEmpty: false,
            defaultValue: 'default'
        });

        expect(content).toBe('');
    });
});

// ============================================================================
// TEST SUITE 3: VALIDATION
// ============================================================================

describe('getMetaContent - Input Validation', () => {
    test('should throw TypeError when name is not a string', () => {
        expect(() => {
            // @ts-expect-error Testing invalid input
            getMetaContent(123);
        }).toThrow(TypeError);
    });

    test('should throw TypeError when name is empty string', () => {
        expect(() => {
            getMetaContent('');
        }).toThrow(TypeError);
    });

    test('should throw TypeError when name is only whitespace', () => {
        expect(() => {
            getMetaContent('   ');
        }).toThrow(TypeError);
    });

    test('should throw JQueryNotAvailableError when jQuery is not available', () => {
        const originalJQuery = window.jQuery;
        // @ts-expect-error Testing jQuery unavailability
        delete window.jQuery;

        expect(() => {
            getMetaContent('test-meta');
        }).toThrow(JQueryNotAvailableError);

        window.jQuery = originalJQuery;
    });
});

// ============================================================================
// TEST SUITE 4: SAFE VERSION
// ============================================================================

describe('getMetaContentSafe - Safe Version', () => {
    beforeEach(() => {
        cleanupTestMetaTags();
    });

    afterEach(() => {
        cleanupTestMetaTags();
    });

    test('should return success result when meta exists', () => {
        createMetaTag('test-meta', 'test-value');

        const result = getMetaContentSafe('test-meta');

        expect(result.success).toBe(true);
        expect(result.content).toBe('test-value');
        expect(result.error).toBeUndefined();
    });

    test('should return error result when meta does not exist', () => {
        const result = getMetaContentSafe('non-existent');

        expect(result.success).toBe(false);
        expect(result.content).toBeUndefined();
        expect(result.error).toBeDefined();
    });

    test('should return error result when content is empty', () => {
        createMetaTag('test-meta', '');

        const result = getMetaContentSafe('test-meta');

        expect(result.success).toBe(false);
        expect(result.error).toContain('empty');
    });
});

// ============================================================================
// TEST SUITE 5: HAS META TAG
// ============================================================================

describe('hasMetaTag - Existence Check', () => {
    beforeEach(() => {
        cleanupTestMetaTags();
    });

    afterEach(() => {
        cleanupTestMetaTags();
    });

    test('should return true when meta tag exists', () => {
        createMetaTag('test-meta', 'value');

        expect(hasMetaTag('test-meta')).toBe(true);
    });

    test('should return false when meta tag does not exist', () => {
        expect(hasMetaTag('non-existent')).toBe(false);
    });

    test('should return true even if content is empty', () => {
        createMetaTag('test-meta', '');

        expect(hasMetaTag('test-meta')).toBe(true);
    });

    test('should return false when jQuery is not available', () => {
        const originalJQuery = window.jQuery;
        // @ts-expect-error Testing jQuery unavailability
        delete window.jQuery;

        expect(hasMetaTag('test-meta')).toBe(false);

        window.jQuery = originalJQuery;
    });
});

// ============================================================================
// TEST SUITE 6: MULTIPLE META CONTENTS
// ============================================================================

describe('getMultipleMetaContents - Batch Retrieval', () => {
    beforeEach(() => {
        cleanupTestMetaTags();
    });

    afterEach(() => {
        cleanupTestMetaTags();
    });

    test('should retrieve multiple meta contents', () => {
        createMetaTag('test-meta-1', 'value-1');
        createMetaTag('test-meta-2', 'value-2');
        createMetaTag('test-meta-3', 'value-3');

        const result = getMultipleMetaContents([
            'test-meta-1',
            'test-meta-2',
            'test-meta-3'
        ]);

        expect(result['test-meta-1']).toBe('value-1');
        expect(result['test-meta-2']).toBe('value-2');
        expect(result['test-meta-3']).toBe('value-3');
    });

    test('should return null for non-existent meta tags', () => {
        createMetaTag('test-meta-1', 'value-1');

        const result = getMultipleMetaContents([
            'test-meta-1',
            'non-existent'
        ]);

        expect(result['test-meta-1']).toBe('value-1');
        expect(result['non-existent']).toBeNull();
    });

    test('should throw TypeError when names is not an array', () => {
        expect(() => {
            // @ts-expect-error Testing invalid input
            getMultipleMetaContents('not-an-array');
        }).toThrow(TypeError);
    });
});

// ============================================================================
// TEST SUITE 7: JSON PARSING
// ============================================================================

describe('getMetaContentAsJSON - JSON Parsing', () => {
    beforeEach(() => {
        cleanupTestMetaTags();
    });

    afterEach(() => {
        cleanupTestMetaTags();
    });

    test('should parse valid JSON', () => {
        createMetaTag('test-json', '{"key":"value","number":123}');

        const result = getMetaContentAsJSON<{ key: string, number: number }>('test-json');

        expect(result.key).toBe('value');
        expect(result.number).toBe(123);
    });

    test('should parse JSON array', () => {
        createMetaTag('test-json', '[1,2,3,4,5]');

        const result = getMetaContentAsJSON<number[]>('test-json');

        expect(Array.isArray(result)).toBe(true);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    test('should throw SyntaxError for invalid JSON', () => {
        createMetaTag('test-json', 'not-valid-json');

        expect(() => {
            getMetaContentAsJSON('test-json');
        }).toThrow(SyntaxError);
    });

    test('should parse nested JSON objects', () => {
        const jsonData = {
            user: {
                name: 'John',
                settings: {
                    theme: 'dark',
                    notifications: true
                }
            }
        };
        createMetaTag('test-json', JSON.stringify(jsonData));

        const result = getMetaContentAsJSON<typeof jsonData>('test-json');

        expect(result.user.name).toBe('John');
        expect(result.user.settings.theme).toBe('dark');
        expect(result.user.settings.notifications).toBe(true);
    });
});

// ============================================================================
// TEST SUITE 8: NUMBER CONVERSION
// ============================================================================

describe('getMetaContentAsNumber - Number Conversion', () => {
    beforeEach(() => {
        cleanupTestMetaTags();
    });

    afterEach(() => {
        cleanupTestMetaTags();
    });

    test('should convert integer string to number', () => {
        createMetaTag('test-number', '123');

        const result = getMetaContentAsNumber('test-number');

        expect(result).toBe(123);
        expect(typeof result).toBe('number');
    });

    test('should convert float string to number', () => {
        createMetaTag('test-number', '123.456');

        const result = getMetaContentAsNumber('test-number');

        expect(result).toBe(123.456);
    });

    test('should convert negative number', () => {
        createMetaTag('test-number', '-42');

        const result = getMetaContentAsNumber('test-number');

        expect(result).toBe(-42);
    });

    test('should convert scientific notation', () => {
        createMetaTag('test-number', '1.23e5');

        const result = getMetaContentAsNumber('test-number');

        expect(result).toBe(123000);
    });

    test('should throw TypeError for non-numeric string', () => {
        createMetaTag('test-number', 'not-a-number');

        expect(() => {
            getMetaContentAsNumber('test-number');
        }).toThrow(TypeError);
    });

    test('should handle zero correctly', () => {
        createMetaTag('test-number', '0');

        const result = getMetaContentAsNumber('test-number');

        expect(result).toBe(0);
    });
});

// ============================================================================
// TEST SUITE 9: BOOLEAN CONVERSION
// ============================================================================

describe('getMetaContentAsBoolean - Boolean Conversion', () => {
    beforeEach(() => {
        cleanupTestMetaTags();
    });

    afterEach(() => {
        cleanupTestMetaTags();
    });

    test('should convert "true" to true', () => {
        createMetaTag('test-bool', 'true');
        expect(getMetaContentAsBoolean('test-bool')).toBe(true);
    });

    test('should convert "TRUE" to true (case insensitive)', () => {
        createMetaTag('test-bool', 'TRUE');
        expect(getMetaContentAsBoolean('test-bool')).toBe(true);
    });

    test('should convert "1" to true', () => {
        createMetaTag('test-bool', '1');
        expect(getMetaContentAsBoolean('test-bool')).toBe(true);
    });

    test('should convert "yes" to true', () => {
        createMetaTag('test-bool', 'yes');
        expect(getMetaContentAsBoolean('test-bool')).toBe(true);
    });

    test('should convert "YES" to true (case insensitive)', () => {
        createMetaTag('test-bool', 'YES');
        expect(getMetaContentAsBoolean('test-bool')).toBe(true);
    });

    test('should convert "false" to false', () => {
        createMetaTag('test-bool', 'false');
        expect(getMetaContentAsBoolean('test-bool')).toBe(false);
    });

    test('should convert "0" to false', () => {
        createMetaTag('test-bool', '0');
        expect(getMetaContentAsBoolean('test-bool')).toBe(false);
    });

    test('should convert "no" to false', () => {
        createMetaTag('test-bool', 'no');
        expect(getMetaContentAsBoolean('test-bool')).toBe(false);
    });

    test('should convert any other value to false', () => {
        createMetaTag('test-bool', 'random-value');
        expect(getMetaContentAsBoolean('test-bool')).toBe(false);
    });
});

// ============================================================================
// TEST SUITE 10: ERROR CLASSES
// ============================================================================

describe('Error Classes - Custom Errors', () => {
    test('MetaTagNotFoundError should contain meta name', () => {
        const error = new MetaTagNotFoundError('test-meta');

        expect(error.name).toBe('MetaTagNotFoundError');
        expect(error.metaName).toBe('test-meta');
        expect(error.message).toContain('test-meta');
    });

    test('EmptyContentError should contain meta name', () => {
        const error = new EmptyContentError('test-meta');

        expect(error.name).toBe('EmptyContentError');
        expect(error.metaName).toBe('test-meta');
        expect(error.message).toContain('test-meta');
    });

    test('JQueryNotAvailableError should have appropriate message', () => {
        const error = new JQueryNotAvailableError();

        expect(error.name).toBe('JQueryNotAvailableError');
        expect(error.message).toContain('jQuery');
    });

    test('Error classes should work with instanceof', () => {
        const metaError = new MetaTagNotFoundError('test');
        const emptyError = new EmptyContentError('test');
        const jqueryError = new JQueryNotAvailableError();

        expect(metaError instanceof MetaTagNotFoundError).toBe(true);
        expect(metaError instanceof Error).toBe(true);

        expect(emptyError instanceof EmptyContentError).toBe(true);
        expect(emptyError instanceof Error).toBe(true);

        expect(jqueryError instanceof JQueryNotAvailableError).toBe(true);
        expect(jqueryError instanceof Error).toBe(true);
    });
});

// ============================================================================
// TEST SUITE 11: EDGE CASES
// ============================================================================

describe('getMetaContent - Edge Cases', () => {
    beforeEach(() => {
        cleanupTestMetaTags();
    });

    afterEach(() => {
        cleanupTestMetaTags();
    });

    test('should handle special characters in content', () => {
        createMetaTag('test-meta', 'value with spaces & special chars: @#$%');

        const content = getMetaContent('test-meta');

        expect(content).toBe('value with spaces & special chars: @#$%');
    });

    test('should handle HTML entities in content', () => {
        createMetaTag('test-meta', '&lt;html&gt;');

        const content = getMetaContent('test-meta');

        expect(content).toBe('&lt;html&gt;');
    });

    test('should handle very long content', () => {
        const longContent = 'a'.repeat(10000);
        createMetaTag('test-meta', longContent);

        const content = getMetaContent('test-meta');

        expect(content).toBe(longContent);
        expect(content.length).toBe(10000);
    });

    test('should handle unicode characters', () => {
        createMetaTag('test-meta', 'Hello 世界 🌍');

        const content = getMetaContent('test-meta');

        expect(content).toBe('Hello 世界 🌍');
    });

    test('should handle meta name with special characters', () => {
        createMetaTag('test-meta-name_123', 'value');

        const content = getMetaContent('test-meta-name_123');

        expect(content).toBe('value');
    });
});

// ============================================================================
// EXPORT TEST SUITE
// ============================================================================

export default {
    createMetaTag,
    removeMetaTag,
    cleanupTestMetaTags
};