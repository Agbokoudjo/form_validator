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
export class ApiError {
    constructor(private m_data: Record<string, unknown> | string, private m_status: number) { }
    get status() { return this.m_status; }
    /**
     * Retrieves the list of validation error messages for a specific field.
     *
     * This method filters the `violations` array to find errors related to the given field
     * and returns an array of error messages.
     *
     * @param {string} field - The name of the field for which validation errors should be retrieved.
     * @returns {string[]} An array of error messages for the specified field.
     *
     * @example
     * const apiError = new ApiError({
     *   violations: [
     *     { propertyPath: "email", message: "Invalid email format." },
     *     { propertyPath: "password", message: "Password must be at least 8 characters long." },
     *     { propertyPath: "email", message: "Email is already in use." }
     *   ]
     * }, 400);
     *
     * console.log(apiError.violationsFor("email"));
     * // Output: ["Invalid email format.", "Email is already in use."]
     *
     * console.log(apiError.violationsFor("password"));
     * // Output: ["Password must be at least 8 characters long."]
     *
     * console.log(apiError.violationsFor("username"));
     * // Output: []
     */
    violationsFor(field: string): string[] {
        if (typeof this.m_data === 'string') { return [this.m_data]; }
        const violations = this.m_data.violations as { propertyPath: string, message: string }[] | undefined;
        if (!violations) { return [] }
        return violations.filter(v => v.propertyPath === field).map(v => v.message);
    }
    /**
     * Retrieves a formatted error name from the API response.
     *
     * This getter constructs a readable error name using the `title` and `detail`
     * properties of the API response. If `title` is missing, it defaults to `"Unknown Error"`.
     * If `detail` is provided, it is appended after a colon (`:`), ensuring a clear and structured message.
     *
     * @returns {string} A formatted error message combining `title` and `detail`.
     *
     * @example
     * const apiError1 = new ApiError({ title: "Validation Error", detail: "Invalid email address" }, 400);
     * console.log(apiError1.name);
     * // Output: "Validation Error: Invalid email address"
     *
     * const apiError2 = new ApiError({ title: "Server Error" }, 500);
     * console.log(apiError2.name);
     * // Output: "Server Error"
     *
     * const apiError3 = new ApiError({}, 500);
     * console.log(apiError3.name);
     * // Output: "Unknown Error"
     */
    get name(): string {
        if (typeof this.m_data === 'string') { return this.m_data; }
        const title = this.m_data.title as string; // Default if title is missing
        const detail = this.m_data?.detail as string | undefined;
        return detail ? `${title}: ${detail}` : title; // Add ":" only if detail exists
    }
    /**
     * Retrieves all violations and organizes them by field (`propertyPath`).
     * 
     * This method returns an object where the keys represent the fields (or property paths) 
     * and the values are arrays containing the violation messages associated with those fields.
     * If no violations are present, the method returns an object with a `main` key 
     * containing an array with the name of the error.
     * 
     * @returns {Record<string, string[]>} An object with keys representing field names (`propertyPath`),
     * and values being an array of violation messages for that field. If no violations exist, 
     * the object will contain a `main` key with an array holding the name of the error.
     */
    get allViolations(): Record<string, string[]> {
        if (typeof this.m_data === 'string') { return { main: [this.name] }; }
        const violations = this.m_data.violations as { propertyPath: string, message: string }[] | undefined;
        if (!violations) { return { main: [this.name] }; }
        return violations.reduce((acc, violation) => {
            acc[violation.propertyPath] = acc[violation.propertyPath] ?? [];
            acc[violation.propertyPath].push(violation.message);
            return acc;
        }, {} as Record<string, string[]>)
    }
}
export interface ApiView {
    '@id': string,
    first: string,
    last?: string,
    previous?: string,
    next?: string
}
export class ApiSuccess { constructor() { throw new Error("I' am not implemented"); } }