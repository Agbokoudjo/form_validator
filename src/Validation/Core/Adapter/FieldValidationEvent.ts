/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */
import type { FieldValidationEventDataInterface } from "../../types";

/**
 * Class to encapsulate and provide read-only access to validation data.
 * This class is typically used in custom validation event payloads.
 */
export class FieldValidationEventData {

    constructor(protected readonly data: FieldValidationEventDataInterface) { }

    /** The ID of the validated field. */
    public get id(): string { return this.data.id; }

    /** The name of the validated field. */
    public get name(): string { return this.data.name; }

    /** The validation message(s), if any. */
    public get message(): string[] | undefined { return this.data.message; }

    /** The current value of the field at the time of validation. */
    public get value() { return this.data.value; }

    /** The name of the parent form or container. */
    public get formParentName(): string { return this.data.formParentName; }

    public get targetChildrenForm() { return this.data.target; }
}