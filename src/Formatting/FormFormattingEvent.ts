import { capitalizeString, escapeHtmlBalise, usernameFormat } from "../_Utils/string";

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

export interface OptionsFormattingEvent {
    inputlastnameModule?: boolean;
    inputfirstnameModule?: boolean;
    usernameModule?: boolean;
    locales?: string | string[];
}
export class FormFormattingEvent {
    private m_option_module: OptionsFormattingEvent;
    private static m_instance_formatting: FormFormattingEvent;
    private constructor() { this.m_option_module = {} }
    public static getInstance = (): FormFormattingEvent => {
        if (!FormFormattingEvent.m_instance_formatting) {
            FormFormattingEvent.m_instance_formatting = new FormFormattingEvent();
        }
        return FormFormattingEvent.m_instance_formatting;
    }
    public init = (subject: any,
        separator_toString?: string,
        finale_separator_toString?: string,
        option_module: OptionsFormattingEvent = {
            inputlastnameModule: true,
            inputfirstnameModule: true,
            usernameModule: true,
        }): this => {
        this.m_option_module = option_module;
        if (this.m_option_module.inputlastnameModule === true) {
            this.lastnameToUpperCase(subject, this.m_option_module.locales);
        }
        if (this.m_option_module.inputfirstnameModule === true) {
            this.capitalizeUsername(subject, separator_toString, finale_separator_toString, this.m_option_module.locales);
        }
        if (this.m_option_module.usernameModule === true) {
            this.usernameFormatDom(subject, separator_toString, finale_separator_toString, this.m_option_module.locales);
        }
        return this;
    }
    /**
     * Converts the last name input field's value to uppercase in real-time.
     * 
     * This function listens for input events on an input field with the class `.lastname` 
     * and automatically converts its value to uppercase. It ensures that the specified 
     * input field exists before applying the transformation.
     * 
     * **Usage Example:**
     * ```typescript
     * formHandler.lastnameToUpperCase(document);
     * ```
     * 
     * @param {any} subject - The DOM element or context within which to search for the `.lastname` input field.
     * @param {string | string[]} [locales] - Optional locale settings for uppercase transformation.
     * @throws {Error} If the `.lastname` input field does not exist in the provided subject.
     */

    public lastnameToUpperCase(subject: HTMLElement | Document, locales?: string | string[]): void {
        let target: HTMLInputElement;
        let lastname: string | undefined;
        const lastnameInput = jQuery('input.lastname', subject);
        if (lastnameInput.length === 0) {
            throw new Error(`The input field dedicated to entering the last name with the CSS selector .lastname does not exist.  
            Did you forget to add "lastname" to the class attribute of the input field?`);
        }
        lastnameInput.off("blur").on("blur", function (event: JQuery.BlurEvent) {
            target = event.target as HTMLInputElement;
            lastname = jQuery(target).val();
            if (!lastname) { return }
            lastname = escapeHtmlBalise(lastname) as string
            jQuery(target).val(lastname.toLocaleUpperCase(locales))
        })
    }
    /**
     * Capitalizes each word in the first name field when the user finishes typing.
     *
     * This function ensures that every word in the first name input field starts with an uppercase letter,
     * followed by lowercase letters. It is triggered when the user leaves the input field (`blur` event).
     *
     * **Use case:**
     * - Helps in formatting names correctly in form fields (e.g., "john doe" → "John Doe").
     * - Prevents inconsistent capitalization in user-entered data.
     *
     * **Example Usage:**
     * - Input: "john DOE"
     * - Output: "John Doe"
     *
     * @param {any} subject - The parent container where the input field is located.
     * @param {string} [separator_toString=" "] - The separator for words in the input field.
     * @param {string} [finale_separator_toString=" "] - The final separator used when formatting.
     * @param {string | string[]} [locales] - The locale(s) used for capitalization.
     * @throws {Error} If the input field with the `.firstname` class is not found.
     */

    public capitalizeUsername(subject: any,
        separator_toString: string = " ",
        finale_separator_toString: string = " ",
        locales?: string | string[]): void {
        let target: HTMLInputElement;
        let username: string | undefined;
        if (!this.hasExistElement('input.firstname', subject)) {
            throw new Error(`The input field for entering first names with the CSS selector '.firstname' does not exist.  
            Did you forget to add 'firstname' to the class attribute of the input field?`);
        }
        jQuery('input.firstname', subject)
            .off("blur")
            .on("blur", function (event: JQuery.BlurEvent) {
                target = event.target as HTMLInputElement;
                username = jQuery(target).val()?.toString().trim();
                if (!username) return;
                jQuery(target).val(
                    capitalizeString(username, separator_toString, finale_separator_toString, true, locales)
                );
            });
    }
    /**
     * Automatically formats the input field for first and last names by applying the correct formatting.
     * 
     * This function listens for the `blur` event on `input.username` fields and applies the `usernameFormat` function,
     * respecting the order of the last name (either on the left or right) based on the `position-lastname` attribute.
     * 
     * @param subject HTML element or jQuery selector containing the relevant fields.
     * @param separator_toString Separator for words in the initial string (default: `" "`).
     * @param finale_separator_toString Final separator for words after processing (default: `" "`).
     * @param locales Locale used for formatting (optional).
     * @throws {Error} If no `input.username` field is found within the `subject`.
     */

    public usernameFormatDom = (
        subject: any,
        separator_toString: string = " ",
        finale_separator_toString: string = " ",
        locales?: string | string[]
    ): void => {
        let target: HTMLInputElement;
        let username: string | undefined;
        if (!this.hasExistElement('input.username', subject)) {
            throw new Error(
                `The input field dedicated to entering the first and last names with the CSS selector .username cannot be found. 
                Did you forget to add "username" to the input field's class attribute? 
                Also, don't forget to add the "position-lastname" attribute with possible values "left" | "right". 
                By default, the value is "left".`
            );
        }
        // Attachement de l'événement de manière optimisée (délégation)
        jQuery(subject).on("blur", "input.username", (event: JQuery.BlurEvent) => {
            target = event.target as HTMLInputElement;
            username = jQuery(target).val() as string;
            if (!username) return;
            jQuery(target).val(usernameFormat(
                username, jQuery(target).attr('data-position-lastname') as 'left' | 'right',
                separator_toString, finale_separator_toString, locales
            ));
        });
    }
    protected hasExistElement(selector_css: string, subject: Document | HTMLElement): boolean {
        const elmt = jQuery(selector_css, subject);
        return elmt.length !== 0;
    }
}