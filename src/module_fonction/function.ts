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
 * Échappe les balises HTML contenues dans la chaîne ou dans chaque chaîne d'un tableau ou objet.
 *
 * @param content - La chaîne, le tableau de chaînes, ou l'objet à traiter.
 * @param stripHtmlTags - Si vrai, supprime les balises HTML avant d'échapper. Par défaut, c'est vrai.
 * @return - La chaîne échappée, le tableau de chaînes échappées, ou un objet avec valeurs échappées.
 * @throws - Si la chaîne ou le tableau est vide.
 */
export function escapeHtmlBalise(
    content: string | string[] | Record<string, any>,
    stripHtmlTags: boolean = true
): string | string[] | Record<string, any> {
    if (content === undefined || content === null || Object.keys(content).length === 0) {throw new Error("I expected a string no empty,array or object but it is not yet");}
    const escapeString = (str: string | null | undefined): string => {
        if (str === null || str === undefined) {
            return '';
        }
        str = str.trim();
        if (stripHtmlTags) {
            str = str.replace(/<\/?[^>]+(>|$)/g, '');
        }
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');
    };

    if (Array.isArray(content)) {
        return content.map(escapeString);
    } else if (typeof content === 'object') {
        const escapedObject: Record<string, any> = {};
        for (const key in content) {
            if (Object.prototype.hasOwnProperty.call(content, key)) {
                const value = content[key];
                escapedObject[key] = typeof value === 'object' && value !== null
                    ? escapeHtmlBalise(value, stripHtmlTags)
                    : escapeString(value);
            }
        }
        return escapedObject;
    }

    return escapeString(content);
}
export function bytesToMegabytes(bytes: number) {
    return bytes / (1024 * 1024);
}
 /**
* cette fonction met la lettre d'un mot en majuscule et le reste en miniscule
* @param  str
* @returns {string} elle retourn une chaine sous form la forme Agbokoudjo
*/
export function  ucfirst(str:string):string {
   if (!str) return str; // Retourne la chaîne telle quelle si elle est vide ou nulle
   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
/**
 * Ajoute des sauts de ligne automatiquement sur une chaine
 *
 * @param str
 * @return string
 */
export function nl2br (str:string) {
  return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2')
}

