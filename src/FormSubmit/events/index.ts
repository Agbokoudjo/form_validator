/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Github: https://github.com/Agbokoudjo/form_validator
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { FetchResponseInterface } from "@wlindabla/http_client";
import { FormSubmissionInterface } from "../contracts";
import { BaseEvent } from "@wlindabla/event_dispatcher";

export class FormSubmitRequestEvents {
    public static FORM_SUBMIT_PREPARE_REQUEST = "form-prepare-request";

    public static FORM_SUBMIT_START: string = "form-submit-start";

    public static FORM_SUBMIT_ERROR: string = "form-submit-error";       // timeout, network, abort

    public static FORM_SUBMIT_FAILED: string = "form-submit-failed";     // ✅ 4xx, 5xx

    public static FORM_SUBMIT_SUCCESS = "form-submit-success";

    public static FORM_SUBMIT_END = "form-submit-end";
}

export class PrepareRequestFormSubmitEvent extends BaseEvent{
    constructor(
        public readonly currentRequest:Request,
        public readonly formElement: HTMLFormElement
    ) { 
        super();
      }
}

export class FormSubmitStartEvent extends BaseEvent {
    constructor(
        private readonly formElement: HTMLFormElement,
        public readonly formSubmission: FormSubmissionInterface,
        public readonly customOptionEvent?: Record<string, string | boolean>) { 
        super();
        }

    public get target(): HTMLFormElement { return this.formElement; }
}

export class FormSubmitRequestErrorEvent extends BaseEvent {
    constructor(
        public readonly requestError:Error,
        public readonly formElement: HTMLFormElement 
    ) { super(); }
}

export class FormSubmitSuccessEvent extends BaseEvent  {
    constructor(
        public readonly resultHttpResponse: Record<string, boolean | FetchResponseInterface>,
        public readonly formElement: HTMLFormElement
    ) { super(); }
}

export class FormSubmitEndEvent extends BaseEvent {
    constructor(
        private readonly formElement: HTMLFormElement,
        public readonly formSubmission: FormSubmissionInterface,
        public readonly resultHttpResponse: Record<string, boolean | FetchResponseInterface | Error>,
        public readonly customOptionEvent?: Record<string, string | boolean>)
    {
        super();
         }

    public get target(): HTMLFormElement { return this.formElement; }
}

export class FormSubmitFailedEvent extends BaseEvent {
    constructor(
        public readonly request: Request,
        public readonly response: FetchResponseInterface,
        public readonly formElement: HTMLFormElement
    ) { super(); }
}