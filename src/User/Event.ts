import { HttpMethod } from "@wlindabla/http_client";

/**
 * Custom event detail structure
 * Event detail structure from CRUDAction
 */
export interface CRUDActionEventDetail {
    /** CRUDAction data including status and additional data */
    data: { [key: string]: unknown; };
    /** Action URL for HTTP request confirmation */
    urlActionRequest: string;
    /** Source DOM element */
    sourceElement: HTMLElement;
    /** Event timestamp */
    timestamp: string;
    httpMethodRequestAction: HttpMethod

}

export const CRUD_ACTION_CONFIRMED_EVENT = "crud:action:confirmed"