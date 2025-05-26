export function get_attr<T = unknown>(
    element: HTMLElement | null | undefined | JQuery<HTMLElement>,
    name: string,
    defaults: unknown = null,
    toJson = false,
): T {
    if (!element) {
        return defaults as T;
    }
    if (element instanceof HTMLElement) {
        element = jQuery<HTMLElement>(element)
    }
    let value = element.attr(name);
    if (!value) { return defaults as T }

    if (toJson) {
        try {
            value = JSON.parse(value);
        } catch (error) {
            return defaults as T;
        }
    }
    return value as T;
}