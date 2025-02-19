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
export interface addParamToUrlConfig {
  [key: string]: any;
}
/**
 * 
 * @param urlparam 
 * @param addparamUrlDependencie 
 * @param returnUrl un boolean qui permet de dire que si il faut renvoyer url sous forme de chaine de caractere ou sous 
 * sous forme instance de URL par default c'est true 
 * si @default returnUrl =true on envoie sous forme de chaine de caractere sinon on envoie le nouveau URL construire sous forme
 * d'instance de URL
 * @param baseUrl 
 * @returns string |URL
 */
export const addParamToUrl = (urlparam: string, 
                              addparamUrlDependencie: addParamToUrlConfig|null=null,
                              returnUrl:boolean=true,
                              baseUrl: string | URL = window.location.origin): string|URL => {
  const url = new URL(urlparam, baseUrl);
  if (addparamUrlDependencie) {
      for (const [keyparam, valueparam] of Object.entries(addparamUrlDependencie)) {
    url.searchParams.set(keyparam, valueparam);
  }
  }
    return returnUrl ? url.toString() :url;
};
/**
 * Crée une URL avec des paramètres à partir des données de formulaire.
 * 
 * @param formElement - L'élément de formulaire dont les données sont extraites.
 * @param baseUrl - L'URL de base pour laquelle les paramètres doivent être ajoutés.
 * @param returnUrl - Si vrai, retourne une chaîne de caractères représentant l'URL, sinon retourne une instance de URL.
 * @returns Une chaîne de caractères ou une instance de URL avec les paramètres ajoutés.
 */
export const buildUrlFromForm = (
    formElement: HTMLFormElement,
    addparamUrlDependencie: addParamToUrlConfig|null,
     returnUrl: boolean = true,
    baseUrl: string | URL = window.location.origin
): string | URL => {
    const formData = new FormData(formElement);
    const searchParamsInstance = new URLSearchParams();

    formData.forEach((value, key) => {
        searchParamsInstance.append(key, value.toString());
    });

    const url = new URL(formElement.action || baseUrl.toString(), baseUrl);

    // Ajouter les paramètres au URL
    searchParamsInstance.forEach((value, key) => {
        url.searchParams.set(key, value);
    });
    const urlWithAddedParams = addParamToUrl(url.toString(), addparamUrlDependencie, returnUrl, baseUrl);
    return returnUrl ? urlWithAddedParams.toString() : urlWithAddedParams;
};
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
interface FetchOptions {
  url: string | URL;
  methodSend?: string;
  data?: any;
  optionsheaders?: HeadersInit;
  timeout?: number;
  retryCount?: number;
  responseType?: 'json' | 'text' | 'blob';
}
export async function jsonLdFetch({
  url,
  methodSend = "GET",
  data = null,
  optionsheaders = {
    'Accept': "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout =5000, // 5 secondes par défaut
  retryCount = 3, // 3 tentatives par défaut
  responseType = 'json',
}: FetchOptions): Promise<any> {
  const params: RequestInit = {
    method: methodSend.toUpperCase(),
    headers: optionsheaders,
  };

  if (data) {
    params.body = JSON.stringify(data);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  params.signal = controller.signal;

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      const response = await fetch(url, params);
      clearTimeout(timeoutId);

      if (response.status == 500) {
        console.error('Error:', `Internal Server Error message:${response.statusText}`);
         console.error('Error:',response);
        throw new Error( `Internal Server Error message:${response.statusText}`);
      }
      if (!response.ok && response.status !=500) {
        return response;
      }

      switch (responseType) {
        case 'json':
          return await response.json();
        case 'text':
          return await response.text();
        case 'blob':
          return await response.blob();
        default:
          throw new Error('Unsupported response type');
      }
    } catch (error:any) {
      if (error.name === 'AbortError') {
         throw new Error("Request timed out");
        
      } else if (attempt === retryCount) {
        console.log('Network error occurred',error);
        throw error;
      }
    }
  }
}