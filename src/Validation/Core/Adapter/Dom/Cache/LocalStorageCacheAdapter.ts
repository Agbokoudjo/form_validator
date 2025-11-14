/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { FormAttributeNoFoundException,hasProperty } from "../../../../../_Utils";
import { OptionsValidate } from "../../../Router";
import { FieldOptionsValidateCacheAdapterInterface } from "../../FieldOptionsValidateCacheAdapter";

/**
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
*   @package <https://github.com/Agbokoudjo/form_validator>
* 'formParentName'=>[
*   targetInputName=>[
*       ...options
* ]
* ]
 */
export class LocalStorageCacheAdapter implements FieldOptionsValidateCacheAdapterInterface {

    public async getItem(fieldName: string): Promise<OptionsValidate | undefined> {

        return new Promise(resolve => {
            try {
                const formCache: Record<string, OptionsValidate> = this.getFormOptionsValidateCache(fieldName) ?? {};

                resolve(hasProperty(formCache,fieldName) ? formCache[fieldName] : undefined);
            } catch (e) {
                console.error("LocalStorage read error:", e);
                resolve(undefined);
            }
        });
    }

    public async setItem(targetInputName: string, options: OptionsValidate): Promise<void> {
        const parentKey = this.getFormParentName(targetInputName);

        return new Promise(resolve => {
            try {
                //  Lire le cache existant pour ce formulaire parent et Initialiser ou Parser l'objet de cache
                let formCache: Record<string, OptionsValidate> = this.getFormOptionsValidateCache(targetInputName) ?? {};

                // Mettre à jour (ou ajouter) l'option du champ en cours
                formCache[targetInputName] = options;

                //  Réécrire l'objet complet
                localStorage.setItem(parentKey, JSON.stringify(formCache));

                resolve();
            } catch (e) {
                console.error("LocalStorage write error during merge:", e);
                resolve();
            }
        });
    }

    private getFormOptionsValidateCache(targetInputName: string): Record<string, OptionsValidate> | undefined {

        try {
            const parentKey = this.getFormParentName(targetInputName);

            const existingJson = localStorage.getItem(parentKey);

            if (!existingJson) {
                // Pas de données, donc pas d'erreur. Retourne undefined pour indiquer un "Cache Miss".
                return undefined;
            }

            // Tente la désérialisation
            const formCache: Record<string, OptionsValidate> = JSON.parse(existingJson);

            return formCache;

        } catch (error) {
            // Gestion de l'erreur : Si une erreur survient (JSON invalide, quota localStorage, etc.):
            console.error(`Cache read failed for input ${targetInputName}. Recalculating options.`, error);
            // Nous retournons UNIDEFINED. Ceci est CRUCIAL. 
            // L'adaptateur doit ÉCHOUER SILENCIEUSEMENT pour laisser le contrôleur continuer 
            // avec les options calculées à partir du DOM (mécanisme de secours).
            return undefined;
        }
    }

    private getFormParentName(targetInputName: string): string {

        const form = jQuery<HTMLFormElement>(`[name="${targetInputName}"]`).closest('form');

        const id_or_name = form.attr('name') ?? form.attr('id');

        if (!id_or_name) {

            throw new FormAttributeNoFoundException(form.get(0)!, 'name', targetInputName);
        }

        return id_or_name;
    }
}