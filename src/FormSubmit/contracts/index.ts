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
    FetchResponseInterface,
    FetchDelegateInterface
} from "@wlindabla/http_client";


export interface FormSubmissionInterface extends FetchDelegateInterface {

    processStart(): Promise<FetchResponseInterface|null>
    
    processStop(): void;

}

export interface DelegateFormSubmissionInterface {

    formSubmissionStarted(formSubmission: FormSubmissionInterface): void;

    formSubmissionSucceededWithResponse(
        formSubmission: FormSubmissionInterface,
        response: FetchResponseInterface
    ): void;

    formSubmissionFailedWithResponse(
        formSubmission: FormSubmissionInterface,
        response: FetchResponseInterface
    ): void;

    formSubmissionErrored(formSubmission: FormSubmissionInterface, error: Error): void;

    formSubmissionFinished(formSubmission: FormSubmissionInterface): void;
}

