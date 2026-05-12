/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { FormAttributeNoFoundException, hasProperty } from "../../_Utils";
import { OptionsValidate } from "../types";
import { FieldOptionsValidateCacheAdapterInterface } from "../Contracts";

/**
 * AbstractCacheAdapter
 *
 * Base class for form validation cache adapters.
 * Factorizes common logic for localStorage and sessionStorage implementations:
 * - Resolving the storage key from the parent form (getFormParentName)
 * - Reading / deserializing a form's cache (getFormOptionsValidateCache)
 *
 * Subclasses must only declare which Storage object to use
 * via the abstract method getStorage().
 *
 * Cache Architecture:
 * storage['<prefix>_<formName>'] = { '<inputName>': { ...OptionsValidate } }
 *
 * @abstract
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package https://github.com/Agbokoudjo/form_validator
 */
export abstract class AbstractCacheAdapter implements FieldOptionsValidateCacheAdapterInterface {

    /**
     * Returns the native Storage object to use (localStorage or sessionStorage).
     * Both localStorage and sessionStorage implement the native Storage 
     * interface, which allows this class to handle them transparently 
     * via this.getStorage().
     */
    protected abstract getStorage(): Storage;

    /**
     * Prefix added to the storage key to avoid collisions with
     * other entries in the application's storage.
     * Subclasses may override this property if necessary.
     */
    protected readonly storageKeyPrefix: string = "form_cache_";

    public async getItem(fieldName: string): Promise<OptionsValidate | undefined> {
        return new Promise(resolve => {
            try {
                const formCache = this.getFormOptionsValidateCache(fieldName);

                if (formCache && hasProperty(formCache, fieldName)) {
                    return resolve(formCache[fieldName]);
                }

                resolve(undefined);
            } catch (e) {
                console.error(`[${this.constructor.name}] read error for "${fieldName}":`, e);
                resolve(undefined);
            }
        });
    }

    /**
      * Reads and deserializes the validation options cache for the form 
      * to which the given input belongs.
      *
      * Returns undefined on a cache miss or if deserialization fails,
      * allowing the controller to recalculate options from the DOM 
      * (fallback mechanism).
      */
    public async setItem(targetInputName: string, options: OptionsValidate): Promise<void> {
        return new Promise(resolve => {
            try {
                const parentKey = this.getFormParentName(targetInputName);
                const formCache = this.getFormOptionsValidateCache(targetInputName) ?? {};

                formCache[targetInputName] = options;

                this.getStorage().setItem(
                    parentKey,
                    JSON.stringify(formCache, AbstractCacheAdapter.replacer)
                );
                resolve();
            } catch (e) {
                console.error(`[${this.constructor.name}] write error for "${targetInputName}":`, e);
                resolve();
            }
        });
    }

    protected getFormOptionsValidateCache(
        targetInputName: string
    ): Record<string, OptionsValidate> | undefined {
        try {
            const parentKey = this.getFormParentName(targetInputName);
            const existingJson = this.getStorage().getItem(parentKey);

            if (!existingJson) return undefined;

            return JSON.parse(
                existingJson,
                AbstractCacheAdapter.reviver // ← reviver
            ) as Record<string, OptionsValidate>;
        } catch (error) {
            console.error(
                `[${this.constructor.name}] cache read failed for "${targetInputName}". Recalculating from DOM.`,
                error
            );
            return undefined;
        }
    }

    /**
      * Resolves the storage key for the parent form of a given input.
      * Format: "<storageKeyPrefix><formName|formId>"
      *
      * Uses the native DOM API to traverse up to the nearest <form>,
      * then retrieves its name or id attribute.
      *
      * @throws Error if the input does not exist in the DOM
      * @throws Error if the input is not inside a <form>
      * @throws FormAttributeNoFoundException if the <form> has neither a name nor an id
      */
    protected getFormParentName(targetInputName: string): string {
        const input = document.querySelector(`[name="${targetInputName}"]`);

        if (!input) {
            throw new Error(
                `Input with name "${targetInputName}" not found in the DOM.`
            );
        }

        const form = input.closest('form');

        if (!form) {
            throw new Error(
                `The input "${targetInputName}" is not associated with any <form>.`
            );
        }

        const id_or_name = form.getAttribute('name') ?? form.getAttribute('id');

        if (!id_or_name) {
            throw new FormAttributeNoFoundException(form, 'name', targetInputName);
        }

        return `${this.storageKeyPrefix}${id_or_name}`;
    }

    /**
     * JSON replacer: serializes non-JSON-native types found in OptionsValidate
     * to a tagged plain object that JSON.stringify can handle.
     *
     * Handles:
     * - RegExp  → { __type: 'RegExp', source: string, flags: string }
     * - Date    → { __type: 'Date', iso: string }
     * - Array<string | RegExp> → each RegExp element is tagged individually
     */
    private static replacer(_key: string, value: unknown): unknown {
        // RegExp → plain object with __type tag
        if (value instanceof RegExp) {
            return {
                __type: 'RegExp',
                source: value.source,
                flags: value.flags
            };
        }

        if (value instanceof Date) {
            return {
                __type: 'Date',
                iso: value.toISOString()
            };
        }

        return value;
    }

    /**
     * JSON reviver: reconstructs non-JSON-native types from their tagged form.
     *
     * Handles:
     * - { __type: 'RegExp', source, flags } → new RegExp(source, flags)
     * - { __type: 'Date', iso }             → new Date(iso)
     */
    private static reviver(_key: string, value: unknown): unknown {
        if (
            typeof value === 'object' &&
            value !== null &&
            '__type' in value
        ) {
            const tagged = value as Record<string, unknown>;

            switch (tagged.__type) {
                case 'RegExp':
                    return new RegExp(
                        tagged.source as string,
                        tagged.flags as string
                    );

                case 'Date':
                    return new Date(tagged.iso as string);
            }
        }

        return value;
    }
}

/**
 * LocalStorageCacheAdapter
 *
 * Persists validation options in localStorage.
 * Data survives the closing of the tab and the browser.
 *
 * To be used only when the HTML is stable between sessions
 * (no frequent changes to data-* attributes).
 * Risk of stale cache after a deployment that modifies validation
 * constraints in the HTML — prefer SessionStorageCacheAdapter by default.
 *
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package https://github.com/Agbokoudjo/form_validator
 */
export class LocalStorageCacheAdapter extends AbstractCacheAdapter {

    protected getStorage(): Storage {
        return localStorage;
    }
}

/**
 * SessionStorageCacheAdapter
 *
 * Persists validation options in sessionStorage.
 * Data is automatically cleared when the tab is closed.
 *
 * This is the default implementation in FormValidateController because:
 * - Options are derived from the current DOM and valid for one session only.
 * - No risk of stale cache after a deployment modifying data-* attributes.
 * - Natural logic: if the DOM is reloaded, the options are recalculated.
 *
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package https://github.com/Agbokoudjo/form_validator
 */
export class SessionStorageCacheAdapter extends AbstractCacheAdapter {

    protected getStorage(): Storage {
        return sessionStorage;
    }
}