/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */
export class FormSubmissionError {
    private readonly FORM_SUBMISSION_ERROR_EVENT = 'formSubmissionError';
    constructor() { }
    get type() { return this.FORM_SUBMISSION_ERROR_EVENT; }
    get event() { return "i' am not implemented";}
}