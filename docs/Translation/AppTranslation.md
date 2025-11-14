# AppTranslation - Application Translation Manager

Enterprise-grade translation management system with intelligent caching, meta tag integration, and multi-framework support. Perfect for Symfony Sonata Admin and modern web applications.

---

## 📋 Table of Contents

### Quick Start
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Why AppTranslation?](#why-apptranslation)

### Core Concepts
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Caching Strategy](#caching-strategy)

### API Documentation
- [AppTranslation Class](#apptranslation-class)
  - [Constructor](#constructor)
  - [trans()](#trans) - Main translation method
  - [getTranslationInfo()](#gettranslationinfo) - Get translation with metadata
  - [has()](#has) - Check if key exists
  - [preload()](#preload) - Preload translations
  - [clearCache()](#clearcache) - Clear cache
  - [reload()](#reload) - Reload translations
  - [getCurrentLanguage()](#getcurrentlanguage) - Get current language
  - [getAvailableKeys()](#getavailablekeys) - Get all keys
  - [configAdapter](#configadapter) - Configure cache adapter

### Advanced Topics
- [Configuration Options](#configuration-options)
- [Parameter Interpolation](#parameter-interpolation)
- [Custom Cache Adapters](#custom-cache-adapters)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)

### Integration Guides
- [Symfony Sonata Admin](#symfony-sonata-admin-integration)
- [React](#react-integration)
- [Vue.js](#vuejs-integration)
- [Angular](#angular-integration)

### Reference
- [TypeScript Types](#typescript-types)
- [Error Classes](#error-classes)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Installation

### NPM / Yarn

```bash
npm install @wlindabla/form_validator
# or
yarn add @wlindabla/form_validator
```

### Import

```typescript
// Import singleton instance (recommended)
import { appTranslation } from '@wlindabla/form_validator';

// Or import class
import { AppTranslation } from '@wlindabla/form_validator';

// Create custom instance
const translation = new AppTranslation({
    defaultLanguage: 'fr',
    debug: true
});
```

---

## Basic Usage

### HTML Setup (Symfony Twig)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Translation meta tag -->
    <meta name="sonata-translations" 
          content='{{ {
              CONFIRM_EXIT: "confirm_exit"|trans({}, "SonataAdminBundle"),
              LABEL_BTN_CONFIRM: "label_btn_confirm"|trans({}, "SonataAdminBundle"),
              LABEL_BTN_CANCEL: "label_btn_cancel"|trans({}, "SonataAdminBundle"),
              ACTION_CANCELLED_SUCCESS: "action_cancelled_success"|trans({}, "SonataAdminBundle"),
              FORM_SUBMISSION_PROGRESS_MESSAGE: "form_submission_progress_message"|trans({}, "SonataAdminBundle"),
              FORM_SUBMISSION_PROGRESS_TITLE: "form_submission_progress_title"|trans({}, "SonataAdminBundle"),
              ACTION_PENDING_TITLE: "action.pending.title"|trans({}, "SonataAdminBundle"),
              ACTION_PENDING_MESSAGE: "action.pending.message"|trans({}, "SonataAdminBundle")
          }|json_encode()|e("html_attr")}}'>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

### JavaScript/TypeScript Usage

```typescript
import { appTranslation } from '@wlindabla/form_validator';

// Simple translation
const confirmText = await appTranslation.trans('LABEL_BTN_CONFIRM');
console.log(confirmText); // "Confirm"

// With custom meta tag name
const text = await appTranslation.trans('MY_KEY', 'custom-translations');

// With parameters
const greeting = await appTranslation.trans('HELLO_USER', 'app-translations', {
    name: 'John',
    age: 25
});
console.log(greeting); // "Hello John, you are 25 years old"

// Check if key exists
if (await appTranslation.has('LABEL_BTN_CONFIRM')) {
    console.log('Translation exists');
}

// Preload for better performance
await appTranslation.preload();
```

---

## Why AppTranslation?

### ✨ Key Features

✅ **Intelligent Caching** - Automatic caching with configurable adapters  
✅ **Meta Tag Integration** - Load translations from HTML meta tags  
✅ **Parameter Interpolation** - Dynamic translations with placeholders  
✅ **Multi-Language Support** - Automatic language detection  
✅ **Type-Safe** - Full TypeScript support with strict typing  
✅ **Error Resilient** - Graceful fallbacks and detailed error messages  
✅ **Framework Agnostic** - Works with any JavaScript framework  
✅ **Zero Dependencies** - Only requires the cache adapter module  
✅ **Production Ready** - Battle-tested in enterprise applications  

### 🎯 Use Cases

- ✅ Symfony Sonata Admin translations
- ✅ Multi-language web applications
- ✅ SPAs with server-side translation loading
- ✅ Progressive Web Apps (PWA)
- ✅ Micro-frontends with shared translations
- ✅ Admin panels and dashboards
- ✅ E-commerce platforms

---

## Architecture

### Component Diagram

```
┌────────────────────────────────────────┐
│     Your Application                   │
│  (React, Vue, Angular, Vanilla)        │
└──────────────┬─────────────────────────┘
               │
               │ uses
               ▼
┌────────────────────────────────────────┐
│     AppTranslation                     │
│  • trans()                             │
│  • preload()                           │
│  • clearCache()                        │
└──────────────┬─────────────────────────┘
               │
               ├─→ Meta Tag Loader
               │
               └─→ Cache Adapter
                      │
                      ├─→ localStorage
                      ├─→ IndexedDB/Dexie
                      └─→ Custom Adapter
```

### Data Flow

```
1. Application calls trans('KEY')
         ↓
2. Check memory cache
         ├─ HIT → Return translation
         │
         └─ MISS → Check storage cache
                     ├─ HIT → Load to memory, return
                     │
                     └─ MISS → Load from meta tag
                                  ↓
                              Store in cache
                                  ↓
                              Return translation
```

---

## How It Works

### 1. Initialization

```typescript
import { appTranslation } from '@wlindabla/form_validator';

// Singleton is automatically initialized
// - Detects language from document.documentElement.lang
// - Creates cache adapter (localStorage by default)
// - Prepares memory cache
```

### 2. First Translation Request

```typescript
const text = await appTranslation.trans('LABEL_BTN_CONFIRM');

// Process:
// 1. Check if translations loaded in memory → NO
// 2. Check localStorage cache → NO
// 3. Load from meta tag 'app-translations'
// 4. Parse JSON
// 5. Store in localStorage
// 6. Store in memory
// 7. Return translation
```

### 3. Subsequent Requests

```typescript
const text2 = await appTranslation.trans('LABEL_BTN_CANCEL');

// Process:
// 1. Check if translations loaded in memory → YES
// 2. Return translation immediately (< 1ms)
```

### 4. Page Reload

```typescript
// On new page load
const text = await appTranslation.trans('LABEL_BTN_CONFIRM');

// Process:
// 1. Check if translations loaded in memory → NO
// 2. Check localStorage cache → YES
// 3. Load from cache (fast!)
// 4. Store in memory
// 5. Return translation
```

---

## Caching Strategy

### Three-Level Cache

1. **Memory Cache** (Map)
   - Fastest access (<1ms)
   - Cleared on page reload
   - Limited to current session

2. **Storage Cache** (localStorage/IndexedDB)
   - Fast access (~1-5ms)
   - Persists across sessions
   - Survives page reloads

3. **Source** (Meta Tag)
   - Slowest (~10-50ms including parsing)
   - Only accessed when caches miss
   - Contains latest translations

### Cache Invalidation

```typescript
// Clear all caches
await appTranslation.clearCache();

// Reload from source
await appTranslation.reload();

// Or use versioning in meta tag name
await appTranslation.trans('KEY', 'app-translations-v2');
```

---

## API Documentation

### AppTranslation Class

Main class for managing translations.

#### Constructor

Creates a new AppTranslation instance.

```typescript
constructor(config?: TranslationConfig)
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `config` | `TranslationConfig` | `{}` | Optional configuration object |

**Configuration Options:**

```typescript
interface TranslationConfig {
    defaultMetaName?: string;          // Default: 'app-translations'
    defaultLanguage?: string;          // Default: 'en'
    cacheAdapter?: CacheTranslationInterface;  // Default: LocalStorageAdapter
    debug?: boolean;                   // Default: false
    fallbackTranslations?: TranslationMessages;  // Default: {}
}
```

**Examples:**

```typescript
// Default configuration
const translation = new AppTranslation();

// Custom configuration
const translation = new AppTranslation({
    defaultLanguage: 'fr',
    debug: true,
    fallbackTranslations: {
        'ERROR': 'Une erreur est survenue',
        'LOADING': 'Chargement...'
    }
});

// With custom cache adapter
import { DexieCacheAdapter } from './adapters';

const translation = new AppTranslation({
    cacheAdapter: new DexieCacheAdapter()
});
```

---

#### trans()

Main method for retrieving translations.

```typescript
async trans(
    key: string,
    metaName?: string,
    params?: TranslationParams
): Promise<string>
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | `string` | ✅ Yes | - | Translation key to look up |
| `metaName` | `string` | ❌ No | `'app-translations'` | Meta tag name |
| `params` | `TranslationParams` | ❌ No | `undefined` | Parameters for interpolation |

**Returns:** `Promise<string>` - The translated text

**Throws:**
- `TypeError` - If key is invalid
- `TranslationKeyNotFoundError` - If key not found and no fallback
- `TranslationLoadError` - If translations cannot be loaded

**Examples:**

```typescript
// Simple translation
const text = await appTranslation.trans('LABEL_BTN_CONFIRM');
console.log(text); // "Confirm"

// Custom meta tag
const text = await appTranslation.trans('MY_KEY', 'custom-translations');

// With parameters
const greeting = await appTranslation.trans('WELCOME_MESSAGE', 'app-translations', {
    name: 'John',
    role: 'Admin'
});
// If WELCOME_MESSAGE = "Welcome {name}, you are {role}"
// Result: "Welcome John, you are Admin"

// Complex example
const message = await appTranslation.trans('ORDER_STATUS', 'app-translations', {
    orderId: '12345',
    status: 'Shipped',
    date: '2024-01-15'
});
```

**HTML Setup for Parameters:**

```html
<meta name="app-translations" 
      content='{
          "WELCOME_MESSAGE": "Welcome {name}, you are {role}",
          "ORDER_STATUS": "Order #{orderId} is {status} on {date}"
      }'>
```

---

#### getTranslationInfo()

Retrieves translation with detailed metadata.

```typescript
async getTranslationInfo(
    key: string,
    metaName?: string,
    params?: TranslationParams
): Promise<TranslationResult>
```

**Returns:** `Promise<TranslationResult>`

```typescript
interface TranslationResult {
    text: string;       // The translated text
    language: string;   // Language code used
    fromCache: boolean; // Whether it came from cache
    isFallback: boolean;// Whether it's a fallback
}
```

**Example:**

```typescript
const result = await appTranslation.getTranslationInfo('LABEL_BTN_CONFIRM');

console.log(result.text);       // "Confirm"
console.log(result.language);   // "en"
console.log(result.fromCache);  // true
console.log(result.isFallback); // false

// Use metadata for analytics
if (result.fromCache) {
    analytics.track('translation_cache_hit');
}
```

---

#### has()

Checks if a translation key exists.

```typescript
async has(key: string, metaName?: string): Promise<boolean>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | `string` | ✅ Yes | Translation key to check |
| `metaName` | `string` | ❌ No | Optional meta tag name |

**Returns:** `Promise<boolean>` - `true` if key exists

**Examples:**

```typescript
// Check if key exists
if (await appTranslation.has('LABEL_BTN_CONFIRM')) {
    console.log('Translation exists');
}

// Conditional translation
const key = isPremium ? 'PREMIUM_MESSAGE' : 'STANDARD_MESSAGE';
if (await appTranslation.has(key)) {
    const message = await appTranslation.trans(key);
} else {
    const message = 'Default message';
}

// Validate all required keys
const requiredKeys = ['CONFIRM', 'CANCEL', 'SAVE', 'DELETE'];
const missingKeys = [];

for (const key of requiredKeys) {
    if (!await appTranslation.has(key)) {
        missingKeys.push(key);
    }
}

if (missingKeys.length > 0) {
    console.error('Missing translations:', missingKeys);
}
```

---

#### preload()

Preloads translations for better performance.

```typescript
async preload(metaName?: string): Promise<void>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `metaName` | `string` | Optional meta tag name to preload |

**Examples:**

```typescript
// Preload at app startup
async function initApp() {
    await appTranslation.preload();
    console.log('Translations loaded!');
    
    // Now all translations are instant
    const text = await appTranslation.trans('LABEL_BTN_CONFIRM'); // < 1ms
}

// Preload multiple meta tags
await appTranslation.preload('app-translations');
await appTranslation.preload('admin-translations');
await appTranslation.preload('error-messages');

// React example
function App() {
    useEffect(() => {
        appTranslation.preload().then(() => {
            console.log('Ready!');
        });
    }, []);
    
    return <div>...</div>;
}
```

---

#### clearCache()

Clears all cached translations.

```typescript
async clearCache(): Promise<void>
```

**Example:**

```typescript
// Clear cache manually
await appTranslation.clearCache();

// Clear cache on app version change
const APP_VERSION = '2.0.0';
const cachedVersion = localStorage.getItem('app_version');

if (cachedVersion !== APP_VERSION) {
    await appTranslation.clearCache();
    localStorage.setItem('app_version', APP_VERSION);
}

// Clear cache button
async function handleClearCache() {
    await appTranslation.clearCache();
    alert('Cache cleared! Page will reload.');
    location.reload();
}
```

---

#### reload()

Reloads translations from source (meta tag).

```typescript
async reload(metaName?: string): Promise<void>
```

**Example:**

```typescript
// Force reload from meta tag
await appTranslation.reload();

// Reload specific meta tag
await appTranslation.reload('admin-translations');

// Reload button
async function handleReload() {
    await appTranslation.reload();
    console.log('Translations reloaded from source');
}
```

---

#### getCurrentLanguage()

Gets the current language code.

```typescript
getCurrentLanguage(): string
```

**Example:**

```typescript
const lang = appTranslation.getCurrentLanguage();
console.log(lang); // "en"

// Use in logic
if (appTranslation.getCurrentLanguage() === 'fr') {
    // French-specific logic
}

// Display to user
document.getElementById('current-lang').textContent = 
    `Language: ${appTranslation.getCurrentLanguage()}`;
```

---

#### getAvailableKeys()

Gets all loaded translation keys.

```typescript
getAvailableKeys(metaName?: string): string[]
```

**Example:**

```typescript
const keys = appTranslation.getAvailableKeys();
console.log(keys);
// ['LABEL_BTN_CONFIRM', 'LABEL_BTN_CANCEL', 'ACTION_PENDING_TITLE', ...]

// Display available translations
const keysList = appTranslation.getAvailableKeys();
console.log(`${keysList.length} translations loaded`);

// Debugging
if (process.env.NODE_ENV === 'development') {
    console.table(appTranslation.getAvailableKeys());
}
```

---

#### configAdapter

Gets or sets the cache adapter.

```typescript
// Getter
get configAdapter(): CacheTranslationInterface

// Setter
set configAdapter(adapter: CacheTranslationInterface)
```

**Examples:**

```typescript
// Get current adapter
const adapter = appTranslation.configAdapter;
console.log(adapter.constructor.name); // "LocalStorageCacheTranslationAdapter"

// Set custom adapter
import { DexieCacheAdapter } from './adapters';

appTranslation.configAdapter = new DexieCacheAdapter();

// Conditional adapter
if (supportsIndexedDB()) {
    appTranslation.configAdapter = new DexieCacheAdapter();
} else {
    appTranslation.configAdapter = new LocalStorageCacheTranslationAdapter();
}
```

---

## Configuration Options

### TranslationConfig Interface

```typescript
interface TranslationConfig {
    /**
     * Default meta tag name for translations
     * @default 'app-translations'
     */
    defaultMetaName?: string;

    /**
     * Default language code
     * @default 'en'
     */
    defaultLanguage?: string;

    /**
     * Cache adapter instance
     * @default LocalStorageCacheTranslationAdapter
     */
    cacheAdapter?: CacheTranslationInterface;

    /**
     * Enable debug logging
     * @default false
     */
    debug?: boolean;

    /**
     * Fallback translations for critical keys
     * @default {}
     */
    fallbackTranslations?: TranslationMessages;
}
```

### Complete Configuration Example

```typescript
import { AppTranslation, LocalStorageCacheTranslationAdapter } from '@wlindabla/form_validator';

const translation = new AppTranslation({
    // Meta tag name
    defaultMetaName: 'sonata-translations',
    
    // Default language
    defaultLanguage: 'fr',
    
    // Custom cache adapter
    cacheAdapter: new LocalStorageCacheTranslationAdapter(),
    
    // Enable debug mode
    debug: process.env.NODE_ENV === 'development',
    
    // Fallback translations
    fallbackTranslations: {
        'ERROR_GENERIC': 'An error occurred',
        'LOADING': 'Loading...',
        'CONFIRM': 'Confirm',
        'CANCEL': 'Cancel'
    }
});
```

---

## Parameter Interpolation

### Basic Interpolation

```typescript
// HTML
<meta name="app-translations" content='{
    "HELLO_USER": "Hello {name}!"
}'>

// JavaScript
const greeting = await appTranslation.trans('HELLO_USER', 'app-translations', {
    name: 'John'
});
console.log(greeting); // "Hello John!"
```

### Multiple Parameters

```typescript
// HTML
<meta name="app-translations" content='{
    "USER_INFO": "{name} is {age} years old and works as {job}"
}'>

// JavaScript
const info = await appTranslation.trans('USER_INFO', 'app-translations', {
    name: 'Alice',
    age: 30,
    job: 'Developer'
});
console.log(info); // "Alice is 30 years old and works as Developer"
```

### Dynamic Content

```typescript
// Order status message
const status = await appTranslation.trans('ORDER_STATUS', 'app-translations', {
    orderId: order.id,
    status: order.status,
    total: order.total.toFixed(2),
    currency: 'USD'
});
// "Order #12345 is Shipped. Total: $99.99 USD"

// Email template
const emailBody = await appTranslation.trans('EMAIL_WELCOME', 'app-translations', {
    username: user.username,
    activationLink: generateLink(user.id),
    expiryDate: formatDate(expiryDate)
});
```

---

## Custom Cache Adapters

### Creating a Custom Adapter

Implement the `CacheTranslationInterface`:

```typescript
import { CacheTranslationInterface, TranslationMessages } from '@wlindabla/form_validator';

class CustomCacheAdapter implements CacheTranslationInterface {
    async getItem(key: string): Promise<TranslationMessages | null> {
        // Your implementation
        return null;
    }

    async setItem(key: string, messages: TranslationMessages): Promise<void> {
        // Your implementation
    }

    async clear(): Promise<void> {
        // Your implementation
    }

    async has(key: string): Promise<boolean> {
        // Your implementation
        return false;
    }

    async delete(key: string): Promise<void> {
        // Your implementation
    }
}
```

### Dexie (IndexedDB) Adapter Example

```typescript
import Dexie, { Table } from 'dexie';
import { CacheTranslationInterface, TranslationMessages } from '@wlindabla/form_validator';

interface TranslationCache {
    key: string;
    messages: TranslationMessages;
    timestamp: number;
}

class DexieCacheAdapter implements CacheTranslationInterface {
    private db: Dexie;
    private translations!: Table<TranslationCache, string>;

    constructor() {
        this.db = new Dexie('AppTranslationsDB');
        this.db.version(1).stores({
            translations: 'key, timestamp'
        });
        this.translations = this.db.table('translations');
    }

    async getItem(key: string): Promise<TranslationMessages | null> {
        try {
            const item = await this.translations.get(key);
            return item ? item.messages : null;
        } catch (error) {
            console.error('Dexie getItem error:', error);
            return null;
        }
    }

    async setItem(key: string, messages: TranslationMessages): Promise<void> {
        try {
            await this.translations.put({
                key,
                messages,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('Dexie setItem error:', error);
        }
    }

    async clear(): Promise<void> {
        try {
            await this.translations.clear();
        } catch (error) {
            console.error('Dexie clear error:', error);
        }
    }

    async has(key: string): Promise<boolean> {
        try {
            const count = await this.translations.where('key').equals(key).count();
            return count > 0;
        } catch (error) {
            return false;
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.translations.delete(key);
        } catch (error) {
            console.error('Dexie delete error:', error);
        }
    }
}

// Usage
import { appTranslation } from '@wlindabla/form_validator';

appTranslation.configAdapter = new DexieCacheAdapter();
```

---

## Error Handling

### Error Classes

#### TranslationCacheError

Thrown for cache-related issues.

```typescript
try {
    await appTranslation.clearCache();
} catch (error) {
    if (error instanceof TranslationCacheError) {
        console.error('Cache operation failed');
    }
}
```

### Comprehensive Error Handling

```typescript
import {
    appTranslation,
    TranslationKeyNotFoundError,
    TranslationLoadError,
    TranslationCacheError
} from '@wlindabla/form_validator';

async function safeTranslate(key: string): Promise<string> {
    try {
        return await appTranslation.trans(key);
    } catch (error) {
        if (error instanceof TranslationKeyNotFoundError) {
            console.warn(`Translation missing: ${key}`);
            return key; // Return key as fallback
        }
        
        if (error instanceof TranslationLoadError) {
            console.error('Failed to load translations');
            return 'Translation unavailable';
        }
        
        if (error instanceof TranslationCacheError) {
            console.error('Cache error - translations may be slow');
            return await appTranslation.trans(key); // Retry without cache
        }
        
        console.error('Unexpected error:', error);
        return key;
    }
}
```

---

## Performance Optimization

### 1. Preload at Startup

```typescript
// React
function App() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        appTranslation.preload().then(() => {
            setReady(true);
        });
    }, []);

    if (!ready) {
        return <div>Loading translations...</div>;
    }

    return <YourApp />;
}

// Vue
export default {
    async created() {
        await appTranslation.preload();
    }
}

// Angular
export class AppComponent implements OnInit {
    async ngOnInit() {
        await appTranslation.preload();
    }
}
```

### 2. Batch Translations

```typescript
// ❌ Bad - Multiple await calls
const confirm = await appTranslation.trans('CONFIRM');
const cancel = await appTranslation.trans('CANCEL');
const save = await appTranslation.trans('SAVE');

// ✅ Good - Preload once, then sync access
await appTranslation.preload();
const confirm = await appTranslation.trans('CONFIRM'); // Fast
const cancel = await appTranslation.trans('CANCEL');   // Fast
const save = await appTranslation.trans('SAVE');       // Fast
```

### 3. Use IndexedDB for Large Datasets

```typescript
// For apps with 100+ translations
import { DexieCacheAdapter } from './adapters';

appTranslation.configAdapter = new DexieCacheAdapter();
```

### 4. Implement Translation Helper

```typescript
class TranslationHelper {
    private cache = new Map<string, string>();

    async t(key: string): Promise<string> {
        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        const text = await appTranslation.trans(key);
        this.cache.set(key, text);
        return text;
    }

    clear() {
        this.cache.clear();
    }
}

const helper = new TranslationHelper();
const text = await helper.t('KEY'); // Cached!
```

---

## Integration Guides

### Symfony Sonata Admin Integration

**Twig Template:**

```html
{# base.html.twig #}
<!DOCTYPE html>
<html lang="{{ app.request.locale }}">
<head>
    <meta name="sonata-translations" 
          content='{{ {
              CONFIRM_EXIT: "confirm_exit"|trans({}, "SonataAdminBundle"),
              LABEL_BTN_CONFIRM: "label_btn_confirm"|trans({}, "SonataAdminBundle"),
              LABEL_BTN_CANCEL: "label_btn_cancel"|trans({}, "SonataAdminBundle"),
              ACTION_CANCELLED_SUCCESS: "action_cancelled_success"|trans({}, "SonataAdminBundle"),
              FORM_SUBMISSION_PROGRESS_MESSAGE: "form_submission_progress_message"|trans({}, "SonataAdminBundle"),
              FORM_SUBMISSION_PROGRESS_TITLE: "form_submission_progress_title"|trans({}, "SonataAdminBundle"),
              ACTION_PENDING_TITLE: "action.pending.title"|trans({}, "SonataAdminBundle"),
              ACTION_PENDING_MESSAGE: "action.pending.message"|trans({}, "SonataAdminBundle")
          }|json_encode()|e("html_attr")}}'>
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>
```

**JavaScript:**

```typescript
import { appTranslation } from '@wlindabla/form_validator';

// Initialize
await appTranslation.preload('sonata-translations');

// Use in SweetAlert
Swal.fire({
    title: await appTranslation.trans('ACTION_PENDING_TITLE', 'sonata-translations'),
    text: await appTranslation.trans('ACTION_PENDING_MESSAGE', 'sonata-translations'),
    confirmButtonText: await appTranslation.trans('LABEL_BTN_CONFIRM', 'sonata-translations'),
    cancelButtonText: await appTranslation.trans('LABEL_BTN_CANCEL', 'sonata-translations')
});
```

---

### React Integration

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { appTranslation } from '@wlindabla/form_validator';

// Context
const TranslationContext = createContext<{
    t: (key: string, params?: Record<string, any>) => Promise<string>;
    ready: boolean;
}>({
    t: async () => '',
    ready: false
});

// Provider
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        appTranslation.preload().then(() => {
            setReady(true);
        });
    }, []);

    const t = async (key: string, params?: Record<string, any>) => {
        return await appTranslation.trans(key, 'app-translations', params);
    };

    return (
        <TranslationContext.Provider value={{ t, ready }}>
            {ready ? children : <div>Loading...</div>}
        </TranslationContext.Provider>
    );
};

// Hook
export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within TranslationProvider');
    }
    return context;
};

// Component usage
function MyComponent() {
    const { t } = useTranslation();
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        t('LABEL_BTN_CONFIRM').then(setConfirmText);
    }, []);

    return <button>{confirmText}</button>;
}

// App setup
function App() {
    return (
        <TranslationProvider>
            <MyComponent />
        </TranslationProvider>
    );
}
```

---

### Vue.js Integration

```typescript
// translation-plugin.ts
import { App, Plugin } from 'vue';
import { appTranslation } from '@wlindabla/form_validator';

export const TranslationPlugin: Plugin = {
    install(app: App) {
        // Add global method
        app.config.globalProperties.$t = async (key: string, params?: Record<string, any>) => {
            return await appTranslation.trans(key, 'app-translations', params);
        };

        // Add provide/inject
        app.provide('appTranslation', appTranslation);

        // Preload on install
        appTranslation.preload();
    }
};

// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { TranslationPlugin } from './translation-plugin';

const app = createApp(App);
app.use(TranslationPlugin);
app.mount('#app');

// Component usage
/*
<template>
  <div>
    <button @click="handleClick">{{ buttonText }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';

const buttonText = ref('');
const appTranslation = inject('appTranslation');

onMounted(async () => {
    buttonText.value = await appTranslation.trans('LABEL_BTN_CONFIRM');
});
</script>
*/
```

---

### Angular Integration

```typescript
// translation.service.ts
import { Injectable } from '@angular/core';
import { appTranslation, TranslationParams } from '@wlindabla/form_validator';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private ready = false;

    async initialize(): Promise<void> {
        await appTranslation.preload();
        this.ready = true;
    }

    async trans(key: string, params?: TranslationParams): Promise<string> {
        if (!this.ready) {
            await this.initialize();
        }
        return await appTranslation.trans(key, 'app-translations', params);
    }

    isReady(): boolean {
        return this.ready;
    }
}

// app.component.ts
import { Component, OnInit } from '@angular/core';
import { TranslationService } from './services/translation.service';

@Component({
    selector: 'app-root',
    template: `
        <div *ngIf="ready">
            <button>{{ confirmText }}</button>
        </div>
    `
})
export class AppComponent implements OnInit {
    ready = false;
    confirmText = '';

    constructor(private translationService: TranslationService) {}

    async ngOnInit() {
        await this.translationService.initialize();
        this.confirmText = await this.translationService.trans('LABEL_BTN_CONFIRM');
        this.ready = true;
    }
}
```

---

## TypeScript Types

### Core Types

```typescript
// Translation messages
type TranslationMessages = Record<string, string>;

// Translation parameters
type TranslationParams = Record<string, string | number>;

// Configuration
interface TranslationConfig {
    defaultMetaName?: string;
    defaultLanguage?: string;
    cacheAdapter?: CacheTranslationInterface;
    debug?: boolean;
    fallbackTranslations?: TranslationMessages;
}

// Translation result
interface TranslationResult {
    text: string;
    language: string;
    fromCache: boolean;
    isFallback: boolean;
}
```

### Usage with Types

```typescript
import {
    AppTranslation,
    TranslationConfig,
    TranslationParams,
    TranslationResult
} from '@wlindabla/form_validator';

// Typed configuration
const config: TranslationConfig = {
    defaultLanguage: 'fr',
    debug: true
};

const translation = new AppTranslation(config);

// Typed parameters
const params: TranslationParams = {
    name: 'John',
    age: 25
};

// Typed result
const result: TranslationResult = await translation.getTranslationInfo('KEY', 'app-translations', params);
```

---

## Best Practices

### 1. Always Preload

```typescript
// ✅ Good - Preload at app start
async function initApp() {
    await appTranslation.preload();
    renderApp();
}

// ❌ Bad - Load on each request
async function renderButton() {
    const text = await appTranslation.trans('CONFIRM'); // Slow first time
    return <button>{text}</button>;
}
```

### 2. Use Fallback Translations

```typescript
// ✅ Good - Provide fallbacks
const translation = new AppTranslation({
    fallbackTranslations: {
        'ERROR': 'An error occurred',
        'LOADING': 'Loading...',
        'CONFIRM': 'Confirm',
        'CANCEL': 'Cancel'
    }
});

// ❌ Bad - No fallbacks
const translation = new AppTranslation(); // May crash if key missing
```

### 3. Handle Errors Gracefully

```typescript
// ✅ Good - Handle errors
async function getTranslation(key: string): Promise<string> {
    try {
        return await appTranslation.trans(key);
    } catch (error) {
        console.error('Translation error:', error);
        return key; // Fallback to key
    }
}

// ❌ Bad - Let errors propagate
async function getTranslation(key: string): Promise<string> {
    return await appTranslation.trans(key); // May crash app
}
```

### 4. Use Constants for Keys

```typescript
// ✅ Good - Use constants
const TRANSLATION_KEYS = {
    CONFIRM: 'LABEL_BTN_CONFIRM',
    CANCEL: 'LABEL_BTN_CANCEL',
    SAVE: 'LABEL_BTN_SAVE'
} as const;

const text = await appTranslation.trans(TRANSLATION_KEYS.CONFIRM);

// ❌ Bad - Magic strings
const text = await appTranslation.trans('LABEL_BTN_CONFIRM'); // Typo-prone
```

### 5. Cache Wrapper for Performance

```typescript
// ✅ Good - Create cached wrapper
class CachedTranslation {
    private cache = new Map<string, string>();

    async t(key: string): Promise<string> {
        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        const text = await appTranslation.trans(key);
        this.cache.set(key, text);
        return text;
    }
}

const cached = new CachedTranslation();
const text = await cached.t('KEY'); // Super fast on subsequent calls
```

---

## Troubleshooting

### Issue: "Translation key not found"

**Problem:** Key doesn't exist in meta tag

**Solution:**
```typescript
// Check if key exists first
if (await appTranslation.has('MY_KEY')) {
    const text = await appTranslation.trans('MY_KEY');
} else {
    console.error('Key MY_KEY not found');
}

// Or use fallback
const translation = new AppTranslation({
    fallbackTranslations: {
        'MY_KEY': 'Default value'
    }
});
```

### Issue: "Failed to load translations"

**Problem:** Meta tag doesn't exist or has invalid JSON

**Solution:**
```html
<!-- Ensure meta tag exists -->
<meta name="app-translations" content='{"KEY":"Value"}'>

<!-- Check JSON validity -->
<meta name="app-translations" 
      content='{{ translations|json_encode()|e("html_attr") }}'>
```

### Issue: Slow first load

**Problem:** Loading translations on first use

**Solution:**
```typescript
// Preload at app startup
await appTranslation.preload();

// Or show loading indicator
const [loading, setLoading] = useState(true);

useEffect(() => {
    appTranslation.preload().then(() => {
        setLoading(false);
    });
}, []);
```

### Issue: Translations not updating

**Problem:** Cache contains old translations

**Solution:**
```typescript
// Force reload
await appTranslation.reload();

// Or clear cache
await appTranslation.clearCache();

// Or use versioning
await appTranslation.trans('KEY', 'app-translations-v2');
```

---

## FAQ

### Q: Can I use this without Symfony?

**A:** Yes! It works with any framework that can output JSON in meta tags:

```html
<meta name="app-translations" content='{"KEY":"Value"}'>
```

### Q: How do I handle multiple languages?

**A:** Create separate meta tags per language and initialize per language:

```html
<!-- English -->
<html lang="en">
    <meta name="app-translations" content='{"HELLO":"Hello"}'>
</html>

<!-- French -->
<html lang="fr">
    <meta name="app-translations" content='{"HELLO":"Bonjour"}'>
</html>
```

### Q: Can I load translations from an API?

**A:** Yes, create a custom adapter:

```typescript
class ApiCacheAdapter implements CacheTranslationInterface {
    async getItem(key: string) {
        const response = await fetch(`/api/translations/${key}`);
        return response.json();
    }
    
    async setItem(key: string, messages: TranslationMessages) {
        await fetch(`/api/translations/${key}`, {
            method: 'POST',
            body: JSON.stringify(messages)
        });
    }
}
```

---

## License

MIT License

Copyright (c) 2024 AGBOKOUDJO Franck

---

## Credits

**Author:** AGBOKOUDJO Franck  
**Email:** internationaleswebservices@gmail.com  
**Company:** INTERNATIONALES WEB APPS & SERVICES  
**Phone:** +229 0167 25 18 86  
**LinkedIn:** [View Profile](https://www.linkedin.com/in/internationales-web-apps-services-120520193/)  
**GitHub:** https://github.com/Agbokoudjo/  
**Package:** @wlindabla/form_validator

---

## Quick Reference

```typescript
// Import
import { appTranslation } from '@wlindabla/form_validator';

// Basic usage
const text = await appTranslation.trans('KEY');

// With parameters
const text = await appTranslation.trans('KEY', 'app-translations', {
    name: 'John'
});

// Check existence
if (await appTranslation.has('KEY')) { /* ... */ }

// Preload
await appTranslation.preload();

// Clear cache
await appTranslation.clearCache();

// Reload
await appTranslation.reload();

// Get language
const lang = appTranslation.getCurrentLanguage();

// Get all keys
const keys = appTranslation.getAvailableKeys();

// Custom adapter
appTranslation.configAdapter = new CustomAdapter();
```

---

**Made with ❤️ by AGBOKOUDJO Franck**

*Last Updated: 2024*

---

[⬆ Back to Top](#apptranslation---application-translation-manager)KeyNotFoundError

Thrown when a translation key doesn't exist.

```typescript
try {
    const text = await appTranslation.trans('NON_EXISTENT_KEY');
} catch (error) {
    if (error instanceof TranslationKeyNotFoundError) {
        console.error(`Key "${error.key}" not found in "${error.metaName}"`);
    }
}
```

#### TranslationLoadError

Thrown when translations cannot be loaded from meta tag.

```typescript
try {
    const text = await appTranslation.trans('KEY', 'invalid-meta-tag');
} catch (error) {
    if (error instanceof TranslationLoadError) {
        console.error(`Failed to load from "${error.metaName}"`);
    }
}
```

#### Translation