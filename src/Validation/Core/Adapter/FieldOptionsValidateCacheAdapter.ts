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
import { OptionsValidate } from "../Router";
import { CacheItemInterface } from "../../../Cache"

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
*   @package <https://github.com/Agbokoudjo/form_validator>
 */
export interface FieldOptionsValidateCacheAdapterInterface extends CacheItemInterface {

    /**
     * Récupère les options de validation pour une clé donnée.
     */
    getItem(key: string): Promise<OptionsValidate | undefined>;

    /**
     * Stocke les options de validation.
     */
    setItem(key: string, options: OptionsValidate): Promise<void>;

}