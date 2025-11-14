/**
 * Custom event detail structure
 * Event detail structure from toggle confirmation
 */
export interface ToggleEventDetail {
    /** Toggle data including status and additional data */
    data: {
        status: boolean;
        [key: string]: unknown;
    };
    /** Action URL for HTTP request confirmation */
    url_action_confirm: string;
    /** Source DOM element */
    sourceElement: HTMLElement;
    /** Event timestamp */
    timestamp: string;
}