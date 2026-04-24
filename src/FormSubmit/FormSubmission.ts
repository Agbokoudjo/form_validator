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

import {
    getAttr,
    HTMLSubmitterElement,
    SubmitterHandle,
    HttpMethod,
    handleErrorsManyForm,
    Logger,
} from "../_Utils";

import {
    FormSubmitEndEvent,
    FormSubmitRequestErrorEvent,
    FormSubmitRequestEvents,
    FormSubmitStartEvent,
    FormSubmitSuccessEvent,
    PrepareRequestFormSubmitEvent,
    FormSubmitFailedEvent
} from "./events";

import {
    DelegateFormSubmissionInterface,
    FormSubmissionInterface
} from "./contracts";

export const FormSubmissionState = {
    initialized: "initialized",
    requesting: "requesting",
    waiting: "waiting",
    receiving: "receiving",
    stopping: "stopping",
    stopped: "stopped",
    error: "error" 
}

import {
    FetchRequest,
    FetchRequestOptions,
} from "@wlindabla/http_client";

import type { FetchResponseInterface } from "@wlindabla/http_client/contracts"
import { EventTargetType, RequestType } from "@wlindabla/http_client/types";

import {
    EventDispatcherInterface,
    BrowserEventDispatcher
} from "@wlindabla/event_dispatcher";

import { DefaultNavigator } from "./Navigator";

export class FormSubmission extends SubmitterHandle implements FormSubmissionInterface {
    public state: string;
    private _result: Record<string, boolean | FetchResponseInterface | Error>;
    private readonly fetchRequest: FetchRequest;
    private isHandleErrorsManyForm:boolean /* est ce que vous voulez gerer automatiquement les message d'erreurs de chaque champs renvoyer par le serveur par exemple le cas du framework symfony*/

    private _confirmMethod: (message: string, form: HTMLFormElement, submitter: HTMLSubmitterElement) => Promise<boolean> = FormSubmission.confirmMethod;

    public constructor(
        private readonly form: HTMLFormElement,
        private fetchRequestOptions: FetchRequestOptions,
        private readonly mustRedirect: boolean = false,
        private readonly formEventDispatcher: EventDispatcherInterface = new BrowserEventDispatcher(window),
        private readonly delegateFormSubmission: DelegateFormSubmissionInterface = new DefaultNavigator()
    ) {
        super(form);
        this.state = FormSubmissionState.initialized
        this._result = {};

        if (!this.fetchRequestOptions.methodSend) {
            this.fetchRequestOptions.methodSend = this.fetchRequestOptions.method
                ? this.fetchRequestOptions.method.toUpperCase() as HttpMethod
                : this.method;
        }

        if (!this.fetchRequestOptions.data && ['POST', 'PUT', 'PATCH'].includes(this.fetchRequestOptions.methodSend)) {
            this.fetchRequestOptions.data = new FormData(this.form, this.submitter);
        }

        this.fetchRequest = new FetchRequest(
            this,
            formEventDispatcher,
            this.fetchRequestOptions,
            RequestType.MAIN,
            {
                type: EventTargetType.WINDOW, 
                instance: window
            }
        );

        this.isHandleErrorsManyForm = true;
       
    }

    withHandleErrorsManyForm(_value: boolean): void{
        this.isHandleErrorsManyForm = _value;
    }

    static confirmMethod(message: string) {
        return Promise.resolve(confirm(message))
    }

    //permettre au developpeur de modifier le header
    public prepareRequest(request: Request): void {
        this.formEventDispatcher.dispatch(
            new PrepareRequestFormSubmitEvent(request, this.form),
            FormSubmitRequestEvents.FORM_SUBMIT_PREPARE_REQUEST
        )
    }

    public requestStarted(_request: Request): void {
        this.state = FormSubmissionState.waiting
        FormSubmission.beforeSubmit(this.submitter);

        this.formEventDispatcher.dispatch(
            new FormSubmitStartEvent(this.form, this),
            FormSubmitRequestEvents.FORM_SUBMIT_START
        );
        
        this.delegateFormSubmission.formSubmissionStarted(this)
    }

    async processStart(): Promise<FetchResponseInterface | null> {
        const { initialized, requesting } = FormSubmissionState;
        const confirmationMessage = getAttr<string>(
            this.submitter,
            "data-iwas-confirm",
            "Are you sure you want to confirm to send of this formular");

        const answer = await this._confirmMethod(confirmationMessage, this.form, this.submitter)
        if (!answer) {
            return null;
        }

        if (this.state == initialized) {
            this.state = requesting
            return await this.fetchRequest.handle()
        }

        return null;
    }

    processStop() {
        const { stopping, stopped, initialized } = FormSubmissionState;
         if (this.state === initialized) {
            this.state = stopped;
            return;
         }
        
        if (this.state != stopping && this.state != stopped) {
            this.state = stopping;
            this.fetchRequest.cancel();
        }
    }

    public requestSucceededWithResponse(request: Request, fetchResponse: FetchResponseInterface): void {
        this.state = FormSubmissionState.receiving
        this._result = { success: true, fetchResponse: fetchResponse };

        this.formEventDispatcher.dispatch(
            new FormSubmitSuccessEvent(
                this._result as Record<string, boolean | FetchResponseInterface>,
                this.form),
            FormSubmitRequestEvents.FORM_SUBMIT_SUCCESS
        );

        this.delegateFormSubmission.formSubmissionSucceededWithResponse(this, fetchResponse);
        Logger.log(this.mustRedirect);
    }

    public requestPreventedHandlingResponse(request: Request, fetchResponse: FetchResponseInterface): void {
        this._result = { success: fetchResponse.succeeded, fetchResponse: fetchResponse }
    }

    public requestFailedWithResponse(request: Request, response: FetchResponseInterface) {
        this.state = FormSubmissionState.error;
        this._result = { success: false, fetchResponse: response }
        
        if (response.statusCode === 422 && this.isHandleErrorsManyForm) {
            const errorData = response.data;
            if (errorData.violations) {
                handleErrorsManyForm(
                    this.formName,
                    this.formId,
                    errorData.violations
                )

                console.info(
                    `
                consulting documentation https://github.com/Agbokoudjo/form_validator/blob/master/docs/_Utils/form.md#handleerrorsmanyform
                for infos more on using of function  handleErrorsManyForm
                `
                );
            } else {
                this.isHandleErrorsManyForm = false;
            }
        }
        
        this.formEventDispatcher.dispatch(
            new FormSubmitFailedEvent(request, response, this.form),
            FormSubmitRequestEvents.FORM_SUBMIT_FAILED
        );

        this.delegateFormSubmission.formSubmissionFailedWithResponse(this, response)

        Logger.error('requestFailedWithResponse:', request);
    }

    //Manager of the errors because by fetch api (Network,Abort,timeout,cancel)
    //you can use Modal SweetAlert for display modal information or customed your modal 
    public requestErrored(request: Request, error: Error): void {
        this.state = FormSubmissionState.error;
        this._result = { success: false, requestError: error };

        this.formEventDispatcher.dispatch(
            new FormSubmitRequestErrorEvent(error, this.form),
            FormSubmitRequestEvents.FORM_SUBMIT_ERROR
        );

        this.delegateFormSubmission.formSubmissionErrored(this, error)
        Logger.log(request);
    }

    public requestFinished(_request: Request): void {
        this.state = FormSubmissionState.stopped;

        FormSubmission.afterSubmit(this.submitter);
        this.resetSubmitterText();

        this.formEventDispatcher.dispatch(
            new FormSubmitEndEvent(this.form, this, this._result),
            FormSubmitRequestEvents.FORM_SUBMIT_END
        );

        this.delegateFormSubmission.formSubmissionFinished(this)
    }

    public set confirmMethodRequest(
        confirmMethod: (message: string, form: HTMLFormElement, submitter: HTMLSubmitterElement) => Promise<boolean>
    ) {
        this._confirmMethod = confirmMethod;
    }

    private get method(): HttpMethod {
        return getAttr<string>(this.form, "method", "POST").toUpperCase() as HttpMethod;
    }

    private get formId(): string{
        return getAttr(this.form, 'id', 'form');
    }

    private get formName(): string {
        return getAttr(this.form, 'name', 'form');
    }
}