//src/compiler.ts
import {
    BrowserEventDispatcher,
} from '@wlindabla/event_dispatcher/browser';

import { FetchErrorTranslator } from "@wlindabla/http_client";

import { detectLanguageFromDom } from './_Utils';

import { LocalStorageCacheTranslationAdapter } from './Translation';

if (!window.eventDispatcherBrowser) {
    window.eventDispatcherBrowser = new BrowserEventDispatcher(window, {bubbles: true});
}

export const eventDispatcherBrowser: BrowserEventDispatcher = window.eventDispatcherBrowser;

if (!window.fetchErrorTranslator) {
    window.fetchErrorTranslator = new FetchErrorTranslator({
        defaultLanguage: detectLanguageFromDom(),
        cacheAdapter: new LocalStorageCacheTranslationAdapter(),
        debug: false
    });
}

export const fetchErrorTranslator: FetchErrorTranslator = window.fetchErrorTranslator;

