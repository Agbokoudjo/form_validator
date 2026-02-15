import { HTMLSubmitterElement } from "../_Utils"
import { DelegateFormSubmissionInterface, FormSubmissionInterface } from "./contracts"
import { FetchResponseInterface } from "@wlindabla/http_client"

export class DefaultNavigator implements DelegateFormSubmissionInterface {
    
    submitForm(form:HTMLFormElement, submitter:HTMLSubmitterElement) {
        
    }

    stop() {
       
    }

    formSubmissionStarted(formSubmission:FormSubmissionInterface) {
        
    }

    async formSubmissionSucceededWithResponse(formSubmission: FormSubmissionInterface, fetchResponse: FetchResponseInterface) {
        
    }

    async formSubmissionFailedWithResponse(formSubmission: FormSubmissionInterface, fetchResponse:FetchResponseInterface) {
        
    }

    public formSubmissionErrored(formSubmission: FormSubmissionInterface, error:Error) {
        console.error(error)
    }

    public formSubmissionFinished(formSubmission:FormSubmissionInterface) {
       
    }
}