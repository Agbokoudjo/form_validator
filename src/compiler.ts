//src/compiler.ts
import {
    BrowserEventDispatcher,
} from '@wlindabla/event_dispatcher';

import { FetchErrorTranslator } from "@wlindabla/http_client";

import { HttpRequestSubscriber } from './subscriber';
import { detectLanguageFromDom } from './_Utils';

import { LocalStorageCacheTranslationAdapter } from './Translation';

if (!window.eventDispatcherBrowser) {
    window.eventDispatcherBrowser = new BrowserEventDispatcher(window);
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

eventDispatcherBrowser.addSubscriber(new HttpRequestSubscriber(fetchErrorTranslator));