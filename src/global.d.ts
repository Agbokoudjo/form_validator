// src/global.d.ts
import { BrowserEventDispatcher } from '@wlindabla/event_dispatcher';
import { FetchErrorTranslator } from '@wlindabla/http_client';

import jQuery from 'jquery';

declare global {
    interface Window {
		jQuery: typeof jQuery;
      $: typeof jQuery;
      eventDispatcherBrowser: BrowserEventDispatcher;
      fetchErrorTranslator: FetchErrorTranslator;
    }
}