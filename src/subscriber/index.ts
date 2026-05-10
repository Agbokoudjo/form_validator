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
        protected readonly fetchRequestErrorTranslator: FetchErrorTranslatorInterface
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

import {
    FormSubmitRequestEvents,
    FormSubmitFailedEvent,
    FormSubmitSuccessEvent,
    PrepareRequestFormSubmitEvent,
    showLoadingDialog,
    showSuccessDialog,
    handleErrorsManyForm,
    AppTranslation,
} from '@wlindabla/form_validator';

import { FetchResponse } from "@wlindabla/http_client/core";
import { BadResponseHttp } from '@wlindabla/http_client/exceptions';

/**
 * @example Twig block to add to your template:
 *
 * {% block meta_sonata_translation %}
 *   {% set translations = {
 *     CONFIRM_EXIT: 'confirm_exit'|trans({}, 'SonataAdminBundle', app.locale),
 *     LABEL_BTN_CONFIRM: 'label_btn_confirm'|trans({}, 'SonataAdminBundle', app.locale),
 *     LABEL_BTN_CANCEL: 'label_btn_cancel'|trans({}, 'SonataAdminBundle', app.locale),
 *     ACTION_CANCELLED_SUCCESS: 'action_cancelled_success'|trans({}, 'SonataAdminBundle', app.locale),
 *     FORM_SUBMISSION_PROGRESS_MESSAGE: 'form_submission_progress_message'|trans({}, 'SonataAdminBundle', app.locale),
 *     FORM_SUBMISSION_PROGRESS_TITLE: 'form_submission_progress_title'|trans({}, 'SonataAdminBundle', app.locale),
 *     ACTION_PENDING_RESEND_EMAIL_VERIFCATION_MESSAGE: 'action_pending_resend_verification_message'|trans({}, 'SonataUserBundle', app.locale),
 *     ACTION_PENDING_TITLE: 'action.pending.title'|trans({}, 'SonataAdminBundle', app.locale),
 *     ACTION_PENDING_MESSAGE: 'action.pending.message'|trans({}, 'SonataAdminBundle', app.locale),
 *   } %}
 *   <meta name="sonata-translations" content='{{ translations|json_encode()|e('html_attr')}}'>
 *   <meta name="sonata-translations-hash" content="{{ TRANSLATION_HASH }}">
 * {% endblock %}
 *
 * @example Initialization in your entry point (e.g. main.ts / app.ts):
 *
 * document.addEventListener('DOMContentLoaded', async () => {
 *   window.SonataTranslator = appTranslation;
 *
 *   const currentHash = jQuery('meta[name="sonata-translations-hash"]').attr('content');
 *   const cachedHash = localStorage.getItem('sonata_translations_hash');
 *
 *   if (currentHash && cachedHash !== currentHash) {
 *     Admin.log('Translation keys changed - clearing cache');
 *     await appTranslation.clearCache();
 *     localStorage.setItem('sonata_translations_hash', currentHash);
 *   }
 *
 *   await appTranslation.preload('sonata-translations');
 *   window.fetchErrorTranslator = fetchErrorTranslator;
 * });
 */

/**
 * Extend the Window interface to expose SonataTranslator and fetchErrorTranslator globally.
 * Place this declaration in a global.d.ts file in your project.
 *
 * declare global {
 *   interface Window {
 *     SonataTranslator: typeof appTranslation;
 *   }
 * }
 */

/**
 * Abstract base subscriber for Sonata Admin form submissions.
 *
 * Handles the full lifecycle of a form submission:
 *  - Shows a loading dialog when the request is being prepared
 *  - Shows a success dialog on a successful response
 *  - Shows an error dialog and maps field violations on a failed response
 *
 *
 * @abstract
 * @extends HttpRequestSubscriber
 */
export abstract class AbstractFormSubmissionSubscriber implements EventSubscriberInterface {

    protected constructor(
    protected readonly appTranslation:AppTranslation,
    protected readonly metaName:string ="sonata-translations") {}

    /**
     * Declares the events this subscriber listens to, merged with
     * the parent class subscriptions.
     *
     * @returns A map of event names to listener method names (with optional priority).
     */
    public getSubscribedEvents(): Record<string, string | {
        listener: string; priority?: number 
    }
    > {
        return {
            [FormSubmitRequestEvents.FORM_SUBMIT_PREPARE_REQUEST]: {
                listener: 'onPrepareRequest',
                priority: 0,
            },
            [FormSubmitRequestEvents.FORM_SUBMIT_SUCCESS]: {
                listener: 'onFormSubmitSuccess',
                priority: 0,
            },
            [FormSubmitRequestEvents.FORM_SUBMIT_FAILED]: {
                listener: 'onFormSubmitFailed',
                priority: 0,
            }
        };
    }

    /**
     * Handles the FORM_SUBMIT_PREPARE_REQUEST event.
     *
     * Closes any open SweetAlert2 dialog and displays a loading dialog
     * while the request is in progress.
     *
     * @param event - The prepare-request event carrying the form element.
     * @returns A Promise that resolves when the loading dialog is shown.
     */
    public async onPrepareRequest(event: PrepareRequestFormSubmitEvent): Promise<void> {
        event.stopPropagation();

        const form = event.formElement as HTMLFormElement;
        let title = 'Processing...';
        let message = 'Please wait while your request is being processed.';

        if (await this.appTranslation.has('FORM_SUBMISSION_PROGRESS_TITLE')) {
            title = await this.appTranslation.trans(
                'FORM_SUBMISSION_PROGRESS_TITLE',
                this.metaName,
            );
        }

        if (await this.appTranslation.has('FORM_SUBMISSION_PROGRESS_MESSAGE')) {
            message = await this.appTranslation.trans(
                'FORM_SUBMISSION_PROGRESS_MESSAGE',
                this.metaName,
            );
        }

        showLoadingDialog({
            config: {
                title: title,
                text: message
            },
        });
    }

    /**
     * Handles the FORM_SUBMIT_SUCCESS event.
     *
     * Closes the loading dialog, resets the form, and displays
     * a success dialog with the title and message from the server response.
     *
     * @param event - The success event carrying the HTTP response.
     * @returns A Promise that resolves when the success dialog is shown.
     */
    public async onFormSubmitSuccess(event: FormSubmitSuccessEvent): Promise<void> {
        event.stopPropagation();

        const form = event.formElement as HTMLFormElement;

        const { fetchResponse } = event.resultHttpResponse;

        if (!(fetchResponse instanceof FetchResponse)) {
            throw new BadResponseHttp(
                'Expected a FetchResponseInterface instance from FetchRequest.handle()',
                fetchResponse,
            );
        }

        const { title, message } = fetchResponse?.data as { title?: string; message?: string };

        form.reset();

        await showSuccessDialog({
            title: title ?? 'Success',
            message: message ?? 'Operation completed successfully.',
        });
    }

    /**
     * Handles the FORM_SUBMIT_FAILED event.
     *
     * On a 400 or 422 response, maps field-level violations onto the form inputs.
     * Always closes the loading dialog and shows an error dialog with the
     * most relevant error information from the server response.
     *
     * @param event - The failed event carrying the HTTP response and request.
     * @returns A Promise that resolves when the error dialog is shown.
     */
    public async onFormSubmitFailed(event: FormSubmitFailedEvent): Promise<void> {
        event.stopPropagation();

        const form = event.formElement as HTMLFormElement;

        const fetchResponse = event.response;

        const {
            title,
            errorMessage,
            violations,
            details,
            message,
        } = fetchResponse.data as {
            title?: string;
            errorMessage?: string;
            violations?: Record<string, string[]>;
            details?: string;
            message?: string;
        };

        if (
            fetchResponse.statusCode === 422 ||
            fetchResponse.statusCode === 400
        ) {
            if (violations) {
                handleErrorsManyForm(
                    form.name ?? form.id,
                    form.id,
                    violations,
                );
            }
        }

        await showErrorDialog({
            title: title ?? 'Error',
            message: (errorMessage ?? details ?? message ?? fetchResponse.data) || "An error occurred. Please try again.",
        });
    }
}
