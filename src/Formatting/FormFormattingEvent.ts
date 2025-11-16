import { 
Logger, 
capitalizeString, 
escapeHtmlBalise, 
usernameFormat ,
detectLanguageFromDom
} from "../_Utils";

/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APP & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

export interface OptionsFormattingEvent {
    locales?: string | string[];
}
export class FormFormattingEvent {
    private m_option_module: OptionsFormattingEvent;
    private static m_instance_formatting: FormFormattingEvent;
    private constructor() {
        // Définir la locale par défaut ici, si non fournie via init ou des appels de méthode spécifiques
        this.m_option_module = { locales: detectLanguageFromDom() };
    }
    public static readonly getInstance = (): FormFormattingEvent => {
        if (!FormFormattingEvent.m_instance_formatting) {
            FormFormattingEvent.m_instance_formatting = new FormFormattingEvent();
        }
        return FormFormattingEvent.m_instance_formatting;
    }

    /**
    * Initialise les options globales pour le gestionnaire d'événements de formatage.
    * Cette méthode peut être utilisée pour définir une locale par défaut pour toutes les opérations de formatage
    * si elle n'est pas spécifiée directement dans d'autres méthodes de formatage.
    *
    * @param {OptionsFormattingEvent} [options={}] - Configuration optionnelle pour les événements de formatage.
    * @returns {this} L'instance actuelle de FormFormattingEvent pour le chaînage de méthodes.
    */
    public init = (options: OptionsFormattingEvent = {}): this => {
        this.m_option_module = { ...this.m_option_module, ...options };
        Logger.info("FormFormattingEvent initialisé avec les options :", this.m_option_module);
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

    public lastnameToUpperCase(subject: HTMLElement | Document | JQuery, locales?: string | string[]): void {
        const effectiveLocales = locales ?? this.m_option_module.locales;

        // Utiliser la délégation d'événements sur le sujet
        jQuery(subject).off("blur", 'input.lastname').on("blur", 'input.lastname', function (event: JQuery.BlurEvent) {
            const target = jQuery<HTMLInputElement>(event.target);
            let lastname = target.val();

            if (!lastname) {
                Logger.info("The last name input field is empty, uppercase formatting ignored.");
                return;
            }
            // S'assurer que lastname est une chaîne et la nettoyer, puis échapper le HTML avant le formatage
            let processedLastname = escapeHtmlBalise(String(lastname).trim()) as string;
            processedLastname = processedLastname.toLocaleUpperCase(effectiveLocales);

            target.val(processedLastname);
            Logger.log(`Formatted last name: "${lastname}" -> "${processedLastname}"`);
        });
        Logger.info(`The listener 'LASTNAMETOUPPERCASE' is attached to ${jQuery(subject).prop('tagName') || subject.constructor.name}.`);
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

    public capitalizeUsername(
        subject: HTMLElement | Document | JQuery,
        separator_toString: string = " ",
        finale_separator_toString: string = " ",
        locales?: string | string[]
    ): void {
        const effectiveLocales = locales ?? this.m_option_module.locales;

        // Utiliser la délégation d'événements sur le sujet
        jQuery(subject).off("blur", 'input.firstname').on("blur", 'input.firstname', function (event: JQuery.BlurEvent) {
            const target = jQuery<HTMLInputElement>(event.target);
            let username = target.val();

            if (!username) {
                Logger.info(`The first name field is empty, capitalization is ignored.`);
                return;
            }

            // S'assurer que username est une chaîne et la nettoyer
            let processedUsername = String(username).trim();
            processedUsername = capitalizeString(processedUsername, separator_toString, finale_separator_toString, true, effectiveLocales);

            target.val(processedUsername);
            Logger.log(`Formatted first name: "${username}" -> "${processedUsername}"`);
        });
        Logger.info(`The listener 'capitalizeUsername' is attached to ${jQuery(subject).prop('tagName') || subject.constructor.name}.`);
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
        subject: HTMLElement | Document | JQuery,
        separator_toString: string = " ",
        finale_separator_toString: string = " ",
        locales?: string | string[]
    ): void => {
        const effectiveLocales = locales ?? this.m_option_module.locales;

        // Utiliser la délégation d'événements sur le sujet
        jQuery(subject).off('blur', 'input.username').on("blur", 'input.username', (event: JQuery.BlurEvent) => {
            const target = jQuery<HTMLInputElement>(event.target);
            let username = target.val();

            if (!username) {
                Logger.info("The username field is empty, formatting ignored.");
                return;
            }

            // S'assurer que username est une chaîne et la nettoyer
            let processedUsername = String(username).trim();
            const positionLastname = target.attr('data-position-lastname') as 'left' | 'right' ?? 'left';

            processedUsername = usernameFormat(
                processedUsername,
                positionLastname,
                separator_toString,
                finale_separator_toString,
                effectiveLocales
            );

            target.val(processedUsername);
            Logger.log(`Formatted username: "${username}" -> "${processedUsername}"`);
        });
        Logger.info(`The listener 'usernameFormatDom' is attached to ${jQuery(subject).prop('tagName') || subject.constructor.name}.`);
    }
}
export const formatterEvent = FormFormattingEvent.getInstance();
