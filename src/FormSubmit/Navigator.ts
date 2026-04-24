import { HTMLSubmitterElement } from "../_Utils"
import { DelegateFormSubmissionInterface, FormSubmissionInterface } from "./contracts"
import { FetchResponseInterface } from "@wlindabla/http_client"

export class DefaultNavigator implements DelegateFormSubmissionInterface {
    
    submitForm(form:HTMLFormElement, submitter:HTMLSubmitterElement) {
        console.log(form, submitter);
    }

    stop() {
       
    }

    formSubmissionStarted(formSubmission:FormSubmissionInterface) {
        console.log(formSubmission);
    }

    async formSubmissionSucceededWithResponse(formSubmission: FormSubmissionInterface, fetchResponse: FetchResponseInterface) {
        console.log(formSubmission, fetchResponse);
    }

    async formSubmissionFailedWithResponse(formSubmission: FormSubmissionInterface, fetchResponse:FetchResponseInterface) {
        console.log(formSubmission, fetchResponse);
    }

    public formSubmissionErrored(formSubmission: FormSubmissionInterface, error:Error) {
        console.error(error)
        console.log(formSubmission);
    }

    public formSubmissionFinished(formSubmission:FormSubmissionInterface) {
        console.log(formSubmission);
    }
}