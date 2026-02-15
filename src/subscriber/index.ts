import { EventSubscriberInterface } from "@wlindabla/event_dispatcher";
import {
    FetchRequestErrorEvent,
    HttpClientEvents,
    HttpFetchError,
    FetchErrorTranslatorInterface
} from "@wlindabla/http_client";

import {showErrorDialog } from "../_Utils";


export class HttpRequestSubscriber implements EventSubscriberInterface{

    public constructor(
        private readonly fetchRequestErrorTranslator: FetchErrorTranslatorInterface
    ) {
        
    }

    public getSubscribedEvents(): Record<string, string | { listener: string; priority?: number | undefined; }> {
        return {
            [HttpClientEvents.ERROR]:{listener:"onRequestError",priority:10}
        }
    }

    public async onRequestError(event: FetchRequestErrorEvent): Promise<void>{

        if (typeof window === "undefined") {
            return;
        }

        if (event.isPropagationStopped() || event.isDefaultPrevented()) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const error = event.getError();
        if (!(error instanceof HttpFetchError) || !(error.cause instanceof Error)) {
            return;
        }
        
        const errorName = error.cause.name;
        const messageError = this.fetchRequestErrorTranslator.trans(errorName, error);
        
        await showErrorDialog({
            title: errorName,
            message: messageError,
        })

        return;
    }
}