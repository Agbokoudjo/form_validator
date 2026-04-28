/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * * This file is part of the project by AGBOKOUDJO Franck.
 * (c) INTERNATIONALES WEB SERVICES
 */

import { hasProperty } from "../_Utils";

/**
 * Interface defining methods for managing form field collections.
 */
interface FieldCollectionInterface {
    /**
     * Adds a new field to the collection.
     * @param target The trigger button element of the click action.
     */
    addFieldToCollection: (target: HTMLElement) => void;

    /**
     * Adds a remove button to a specific field row.
     * @param containerRow The field container where the button will be added.
     */
    addRemoveButtonToField: (containerRow: HTMLElement) => void;

    /**
     * Removes a field from the collection.
     * @param target_remove The button triggering the removal.
     */
    removeFieldFromCollection: (target_remove: HTMLElement) => void;
}

/**
 * Automatically manages input field collections in forms, specifically optimized 
 * for the Symfony PHP Framework prototypes.
 */
export class SymfonyFieldCollectionManager implements FieldCollectionInterface {

    private static m_instance_Manager: SymfonyFieldCollectionManager;
    protected collectionCounters: Record<string, number>;

    private constructor() {
        this.collectionCounters = {};
    }

    /**
     * Returns the singleton instance of the manager.
     */
    public static getInstance(): SymfonyFieldCollectionManager {
        if (!SymfonyFieldCollectionManager.m_instance_Manager) {
            SymfonyFieldCollectionManager.m_instance_Manager = new SymfonyFieldCollectionManager();
        }
        return SymfonyFieldCollectionManager.m_instance_Manager;
    }

    /** 
     * Initializes event listeners using event delegation.
     * * @param class_btn The CSS selector for the "Add" button.
     * @param subject The DOM context to attach listeners to (Default: document).
     */
    public init = (
        class_btn: string = '.wlindabla-collection-add',
        subject: Window | Document | HTMLElement = document
    ): void => {

        const targetSubject = subject instanceof Window ? subject.document : subject;

        targetSubject.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;

            // Handle Add Button Click
            const btnAdd = target.closest(class_btn);
            if (btnAdd) {
                event.preventDefault();
                this.addFieldToCollection(btnAdd as HTMLElement);
            }

            // Handle Delete Button Click
            const btnDelete = target.closest('.wlindabla-collection-delete');
            if (btnDelete) {
                event.preventDefault();
                this.removeFieldFromCollection(btnDelete as HTMLElement);
            }
        });
    }

    /**
     * Clones the Symfony prototype, updates indices, and injects it into the DOM.
     */
    public addFieldToCollection = (target: HTMLElement): void => {
        const container = target.closest('[data-prototype]') as HTMLElement;
        if (!container) return;

        const container_id = container.getAttribute('id') || '';
        const counter = this.setCollectionCounters(container_id);

        // Get the raw HTML prototype and placeholder name
        let proto = container.getAttribute('data-prototype') || '';
        const protoName = container.getAttribute('data-prototype-name') || '__name__';

        // Update ID attributes (e.g., form_tags___name__ -> form_tags_0)
        const idRegexp = new RegExp(`${container_id}_${protoName}`, 'g');
        proto = proto.replace(idRegexp, `${container_id}_${counter}`);

        // Update Name attributes (e.g., tags[__name__] -> tags[0])
        const parts = container_id.split('_');
        const lastNamePart = parts[parts.length - 1];
        const nameRegexp = new RegExp(`${lastNamePart}\\]\\[${protoName}`, 'g');
        proto = proto.replace(nameRegexp, `${lastNamePart}][${counter}`);

        // Create the DOM element from the sanitized string
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = proto.trim();
        const newRow = tempDiv.firstChild as HTMLElement;

        newRow.classList.add('wlindabla-collection-row', 'row');
        this.addRemoveButtonToField(newRow);

        // Insert before the button's parent container
        target.parentElement?.parentElement?.insertBefore(newRow, target.parentElement);

        // Dispatch custom events for third-party scripts (like Select2 or DatePickers)
        newRow.dispatchEvent(new CustomEvent('wlindabla-admin-append-form-element', { bubbles: true }));
        target.dispatchEvent(new CustomEvent('wlindabla-collection-item-added', { bubbles: true }));
    }

    /**
     * Injects a styled delete button into a collection row.
     */
    public addRemoveButtonToField(containerRow: HTMLElement): void {
        const containerRemoveBtn = document.createElement('div');
        containerRemoveBtn.className = 'panel-footer text-end mt-2';

        const remove_btn = document.createElement('button');
        remove_btn.type = 'button';
        remove_btn.className = 'btn my-2 btn-danger wlindabla-collection-delete';
        remove_btn.innerHTML = '<i class="fas fa-trash" aria-hidden="true"></i> delete';

        containerRemoveBtn.appendChild(remove_btn);
        containerRow.prepend(containerRemoveBtn);
    }

    /**
     * Removes a collection row with a fade-out effect.
     */
    public removeFieldFromCollection = (target_remove: HTMLElement): void => {
        const row = target_remove.closest('.wlindabla-collection-row') as HTMLElement;
        if (!row) return;

        row.dispatchEvent(new CustomEvent('wlindabla-collection-item-deleted', { bubbles: true }));

        // Vanilla JS Fade-out transition
        row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        row.style.opacity = '0';
        row.style.transform = 'scale(0.95)';

        setTimeout(() => {
            row.remove();
            document.dispatchEvent(new CustomEvent('wlindabla-collection-item-deleted-successful', { bubbles: true }));
        }, 400);
    }

    /**
     * Manages and increments the index counter for a specific collection.
     */
    protected setCollectionCounters = (container_id: string): number => {
        if (hasProperty(this.collectionCounters, container_id)) {
            this.collectionCounters[container_id] += 1;
        } else {
            // Count existing rows in the DOM to avoid index collisions on Edit forms
            const existingRows = document.querySelectorAll(`#${container_id} .wlindabla-collection-row`);
            this.collectionCounters[container_id] = existingRows.length;
        }

        return this.collectionCounters[container_id];
    }

    /**
     * Gets the current counter for a specific container ID.
     */
    public getCollectionCounters = (container_id: string): number => {
        return this.collectionCounters[container_id] ?? -1;
    }
}

export const collectionManager = SymfonyFieldCollectionManager.getInstance();