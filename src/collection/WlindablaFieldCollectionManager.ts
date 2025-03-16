/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 01 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

if (typeof window.jQuery === 'undefined') {
    throw new Error("jQuery is required for usage of the class WlindablaFieldCollectionManager");
}
/**
 * Interface définissant les méthodes pour gérer une collection de champs dans un formulaire.
 */
export interface FieldCollectionInterface {
    /**
     * Ajoute un champ à la collection.
     *
     * @param target le bouton déclencheur de l'action click.
     * @returns 
     */
    addFieldToCollection: (target: JQuery<HTMLElement>) => void;  // Ajouter un champ à la collection

    /**
     * Ajoute un bouton de suppression à un champ spécifique.
     *
     * @param containerRow le conteneur du champ auquel le bouton sera ajouté.
     */
    addRemoveButtonToField: (containerRow: JQuery<HTMLDivElement | HTMLElement>) => void;  // Ajouter un bouton de suppression à un champ

    /**
     * Retire un champ de la collection.
     *
     * @param target_remove le bouton déclencheur de l'action à retirer.
     */
    removeFieldFromCollection: (target_remove: JQuery<HTMLDivElement | HTMLElement>) => void;  // Retirer un champ de la collection
}
/**
 * Cette classe gère automatiquement les collections de champs input dans un formulaire
 * en fonction d'un certain hypothèse fourni.
 *
 * This class automatically manages input field collections in a form based on a given assumption.
 */
export class WlindablaFieldCollectionManager implements FieldCollectionInterface{
    private static m_instance_Manager: WlindablaFieldCollectionManager;
    protected collectionCounters: Record<string, number>;
    // Constructeur privé pour empêcher l'instantiation directe
    private constructor() {
        this.collectionCounters={}
    }

    /**
     * Obtenir l'instance unique de la classe.
     * 
     * Get the singleton instance of the class.
     * 
     * @returns L'instance de la classe
     */
    public static getInstance(): WlindablaFieldCollectionManager {
        if (!WlindablaFieldCollectionManager.m_instance_Manager) {
            WlindablaFieldCollectionManager.m_instance_Manager = new WlindablaFieldCollectionManager();
        }
        return WlindablaFieldCollectionManager.m_instance_Manager;
    }
    public init=(class_btn: string='.wlindabla-collection-add',subject:any): void=>{
        jQuery(subject).on('click', `${class_btn}`, (event: JQuery.ClickEvent) => {
            event.preventDefault();
            this.addFieldToCollection(jQuery(event.target))
        })
        jQuery(subject).on('click', '.wlindabla-collection-delete', (event: JQuery.ClickEvent) => {
            this.removeFieldFromCollection(jQuery(event.target))
    });
    }
    public addFieldToCollection=(target: JQuery<HTMLElement>):void=>{
        const container = target.closest('[data-prototype]');//
        const container_id = container.attr('id') as string;
        const counter = this.setCollectionCounters(container_id);
        let proto = container.data('prototype');
        const protoName = container.data('prototype-name') || '__name__';
        // Set field id
        const idRegexp = new RegExp(`${container_id}_${protoName}`, 'g');
        proto = proto.replace(idRegexp, `${container_id}_${counter}`);
      // Set field name
        const parts = container_id.split('_');
        const nameRegexp = new RegExp(`${parts[parts.length - 1]}\\]\\[${protoName}`, 'g');
        proto = proto.replace(nameRegexp, `${parts[parts.length - 1]}][${counter}`);
        this.addRemoveButtonToField(jQuery(proto))
        jQuery(proto)
        .insertBefore(target.parent())
        .addClass('wlindabla-collection-row  row')
        .trigger('wlindabla-admin-append-form-element');
        target.trigger('wlindabla-collection-item-added');
    }
    public addRemoveButtonToField(containerRow: JQuery<HTMLDivElement | HTMLElement>): void{
        const remove_btn = jQuery('<button class="btn my-2 btn-danger wlindabla-collection-delete">delete</button>');
        remove_btn.attr({ type: 'button' })
            .prepend('<i class="fas fa-trash" aria-hidden="true"></i>');
        const containerRemoveBtn = jQuery('<div class="panel-footer text-end mt-2"></div>');
        containerRemoveBtn.append(remove_btn);
        containerRow.prepend(containerRemoveBtn);
    }
    public removeFieldFromCollection(target_remove: JQuery<HTMLDivElement | HTMLElement>): void{
        target_remove.trigger('wlindabla-collection-item-deleted');
        target_remove.closest('.wlindabla-collection-row').slideUp(1000, () => {
            jQuery(this).remove();
        });
         jQuery(document).trigger('wlindabla-collection-item-deleted-successful');
    }
    protected setCollectionCounters = (container_id: string): number => {
        if (this.collectionCounters.hasOwnProperty(container_id) === true) {
            this.collectionCounters[container_id] += 1;
        } else {
              this.collectionCounters[container_id]= 0;
        }
        return this.collectionCounters[container_id];
    }
    public getCollectionCounters=(container_id:string):number=>{return this.collectionCounters[container_id]|| -1}
}
export default WlindablaFieldCollectionManager.getInstance();
