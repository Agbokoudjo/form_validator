import {
    Logger,
    capitalizeString,
    escapeHtmlBalise,
    usernameFormat,
    detectLanguageFromDom
} from "../_Utils";

export interface OptionsFormattingEvent {
    locales?: string | string[];
}

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 */
export class FormFormattingEvent {
    private m_option_module: OptionsFormattingEvent;
    private static m_instance_formatting: FormFormattingEvent;

    private m_event_listeners: Map<string, (event: Event) => void> = new Map();

    private constructor() {
        this.m_option_module = { locales: detectLanguageFromDom() };
    }

    public static readonly getInstance = (): FormFormattingEvent => {
        if (!FormFormattingEvent.m_instance_formatting) {
            FormFormattingEvent.m_instance_formatting = new FormFormattingEvent();
        }
        return FormFormattingEvent.m_instance_formatting;
    }

    public init = (options: OptionsFormattingEvent = {}): this => {
        this.m_option_module = { ...this.m_option_module, ...options };
        Logger.info("FormFormattingEvent initialisé avec les options :", this.m_option_module);
        return this;
    }

    private delegateEvent(
        subject: HTMLElement | Document,
        selector: string,
        handler: (target: HTMLInputElement) => void
    ): void {
        const eventKey = `${selector}:blur`;

        if (this.m_event_listeners.has(eventKey)) {
            subject.removeEventListener('blur', this.m_event_listeners.get(eventKey)!, true);
        }

        const listener = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target && target.matches(selector)) {
                handler(target as HTMLInputElement);
            }
        };

        subject.addEventListener('blur', listener, true);
        this.m_event_listeners.set(eventKey, listener);
    }

    public lastnameToUpperCase(subject: HTMLElement | Document, locales?: string | string[]): void {
        const effectiveLocales = locales ?? this.m_option_module.locales;

        this.delegateEvent(subject, 'input.lastname', (target) => {
            const lastname = target.value;

            if (!lastname) {
                Logger.info("The last name input field is empty, uppercase formatting ignored.");
                return;
            }

            let processedLastname = escapeHtmlBalise(String(lastname).trim()) as string;
            processedLastname = processedLastname.toLocaleUpperCase(effectiveLocales);

            target.value = processedLastname;
            Logger.log(`Formatted last name: "${lastname}" -> "${processedLastname}"`);
        });

        const subjectName = subject instanceof Document ? "Document" : subject.tagName;
        Logger.info(`The listener 'LASTNAMETOUPPERCASE' is attached to ${subjectName}.`);
    }

    public capitalizeUsername(
        subject: HTMLElement | Document,
        separator_toString: string = " ",
        finale_separator_toString: string = " ",
        locales?: string | string[]
    ): void {
        const effectiveLocales = locales ?? this.m_option_module.locales;

        this.delegateEvent(subject, 'input.firstname', (target) => {
            const username = target.value;

            if (!username) {
                Logger.info(`The first name field is empty, capitalization is ignored.`);
                return;
            }

            let processedUsername = String(username).trim();
            processedUsername = capitalizeString(processedUsername, separator_toString, finale_separator_toString, true, effectiveLocales);

            target.value = processedUsername;
            Logger.log(`Formatted first name: "${username}" -> "${processedUsername}"`);
        });

        const subjectName = subject instanceof Document ? "Document" : subject.tagName;
        Logger.info(`The listener 'capitalizeUsername' is attached to ${subjectName}.`);
    }

    public usernameFormatDom = (
        subject: HTMLElement | Document,
        separator_toString: string = " ",
        finale_separator_toString: string = " ",
        locales?: string | string[]
    ): void => {
        const effectiveLocales = locales ?? this.m_option_module.locales;

        this.delegateEvent(subject, 'input.username', (target) => {
            const username = target.value;

            if (!username) {
                Logger.info("The username field is empty, formatting ignored.");
                return;
            }

            let processedUsername = String(username).trim();
            const positionLastname = target.getAttribute('data-position-lastname') as 'left' | 'right' ?? 'left';

            processedUsername = usernameFormat(
                processedUsername,
                positionLastname,
                separator_toString,
                finale_separator_toString,
                effectiveLocales
            );

            target.value = processedUsername;
            Logger.log(`Formatted username: "${username}" -> "${processedUsername}"`);
        });

        const subjectName = subject instanceof Document ? "Document" : subject.tagName;
        Logger.info(`The listener 'usernameFormatDom' is attached to ${subjectName}.`);
    }
}

export const formatterEvent = FormFormattingEvent.getInstance();