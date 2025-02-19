/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */
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