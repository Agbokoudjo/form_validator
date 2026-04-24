// src/global.d.ts
import { BrowserEventDispatcher } from '@wlindabla/event_dispatcher';
import { FetchErrorTranslator } from '@wlindabla/http_client';

declare global {
    interface Window {
      eventDispatcherBrowser: BrowserEventDispatcher;
      fetchErrorTranslator: FetchErrorTranslator;
    }
}