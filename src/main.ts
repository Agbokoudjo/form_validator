import "./style.css";
import debounce from "lodash.debounce";
import viteLogo from "./vite.svg";

import typescriptLogo from "./typescript.svg";
import Swal from "sweetalert2";
import {
  addHashToIds, translate, clearErrorInput, Logger,
  addErrorMessageFieldDom, HTMLFormChildrenElement,
  mergeArrayValues, MergeArrayStrategy, deepMerge, deepMergeAll, CustomURL
} from "./_Utils";
import { FormFormattingEvent } from "./Formatting";
import { uploadedMedia } from './MediaUpload/upload';
import { addParamToUrl, httpFetchHandler, mapStatusToResponseType } from "./_Utils";
import { FieldValidationEventData, FieldValidationFailed, FieldValidationSuccess, FormValidate, MediaUploadEventListener } from ".";

const BASE_URL_UPLOADMEDIA = 'http://127.0.0.1:8001';
let logger = Logger.getInstance();
logger.APP_ENV = "dev";
logger.DEBUG = true;
document.querySelector<HTMLDivElement>('#app-header')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h4>Vite + TypeScript</h4>
  </div>
`
jQuery(function TestLogger() {
  // 1. Sélectionner le bouton de test et les autres éléments avec jQuery
  const $testLoggerButton = $('#testLogger');
  // 2. Attacher un écouteur d'événement 'click' au bouton
  $testLoggerButton.on('click', function () {
    const $loggerMessageInput = $('#loggerMessage');
    const $loggerLevelSelect = $('#loggerLevel');
    const $loggerContextTextarea = $('#loggerContext');
    const $resultLoggerDiv = $('#resultLogger');
    // Réinitialiser le div de résultat
    $resultLoggerDiv.html('<p class="mb-0 text-muted">Exécution du log...</p>');
    $resultLoggerDiv.attr('class', 'mt-3 p-3 border rounded text-muted'); // Réinitialiser les classes Bootstrap

    const message = $loggerMessageInput.val() as string; // val() retourne string | number | string[]
    const level = $loggerLevelSelect.val() as string;
    let context: Record<string, any> | undefined = undefined;

    // Tenter de parser le contexte JSON
    const contextValue = $loggerContextTextarea.val() as string;
    if (contextValue.trim() !== '') {
      try {
        context = JSON.parse(contextValue);
        if (typeof context !== 'object' || context === null || Array.isArray(context)) {
          throw new Error("Le contexte doit être un objet JSON valide.");
        }
      } catch (e: any) {
        $resultLoggerDiv.html(`<p class="mb-0 text-danger">Erreur de Parsing JSON du Contexte: ${e.message}</p>`);
        $resultLoggerDiv.attr('class', 'mt-3 p-3 border rounded border-danger text-danger');
        console.error("Erreur de Parsing JSON du Contexte:", e);
        return; // Arrêter l'exécution si le JSON est invalide
      }
    }

    // Exécuter la méthode du Logger en fonction du niveau sélectionné
    try {
      switch (level) {
        case 'log':
          Logger.log(message, context);
          break;
        case 'info':
          Logger.info(message, context);
          break;
        case 'warn':
          Logger.warn(message, context);
          break;
        case 'error':
          // Pour les erreurs, on peut créer un objet Error si le message est une simple chaîne
          if (context) {
            Logger.error(new Error(message), context);
          } else {
            Logger.error(new Error(message));
          }
          break;
        default:
          console.error('Niveau de log inconnu:', level);
          $resultLoggerDiv.html(`<p class="mb-0 text-danger">Niveau de log "${level}" inconnu.</p>`);
          $resultLoggerDiv.attr('class', 'mt-3 p-3 border rounded border-danger text-danger');
          return;
      }

      // Afficher un message de succès
      $resultLoggerDiv.html(`<p class="mb-0 text-success">Log de niveau "${level}" envoyé avec succès !</p><p class="mb-0 text-success">Vérifiez la console de votre navigateur pour le résultat.</p>`);
      $resultLoggerDiv.attr('class', 'mt-3 p-3 border rounded border-success text-success');

    } catch (err: any) {
      // Gérer les erreurs inattendues lors de l'appel du Logger
      console.error('Erreur lors de l\'appel de Logger:', err);
      $resultLoggerDiv.html(`<p class="mb-0 text-danger">Erreur lors de l'appel de Logger: ${err.message}</p>`);
      $resultLoggerDiv.attr('class', 'mt-3 p-3 border rounded border-danger text-danger');
    }
  });
})
jQuery(function TestURL() {
  const customURL = new CustomURL("https://anonymous:flabada@www.norldfinance.com:4438/privacy-policy?_locale=fr&slug=how-loan-application&name=Jonathan%20Smith&age=18&tag=js&tag=ts&level=senior#fragements");

  Logger.log('customUrl', customURL);
  Logger.log('searchURLParams', customURL.searchParams.getAll())
})
jQuery(function TestDeepMerge() {
  const testMergeFunctions = $("#testMergeFunctions");
  testMergeFunctions.on('click', function () {

    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    // 1. Strategy 'concat'
    const resultConcat = mergeArrayValues(arr1, arr2, 'concat');
    Logger.log('Concat:', resultConcat);
    const resultReplace = mergeArrayValues(arr1, arr2, 'replace');
    Logger.log('Replace:', resultReplace);
    const customStrategy: MergeArrayStrategy<number> = (t, s) => {
      const evenNumbersFromSource = s.filter((item: any) => typeof item === 'number' && item % 2 === 0);
      return [...t, ...evenNumbersFromSource];
    };
    const resultCustom = mergeArrayValues(arr1, arr2, customStrategy);
    Logger.log('Custom:', resultCustom);
    const numbers1 = [1, 2, 3];
    const numbers2 = [3, 4, 5];

    const uniqueNumbers = mergeArrayValues(numbers1, numbers2, 'mergeUnique');
    Logger.log('Unique Numbers:', uniqueNumbers); // Output: Unique Numbers: [1, 2, 3, 4, 5]
    type Options = {
      security: {
        csrf: boolean;
        xss: boolean;
      };
      caching: {
        enabled: boolean;
        ttl: number;
      };
    };

    const userOptions = {
      security: {
        csrf: true
      }
    };

    const defaultOptions: Options = {
      security: {
        csrf: false,
        xss: true
      },
      caching: {
        enabled: true,
        ttl: 300
      }
    };

    const merged = deepMerge(userOptions, defaultOptions);
    Logger.log('deeMerge:', merged);

    interface AppConfig {
      name: string;
      version: string;
      settings: {
        theme?: string;
        notifications?: boolean;
      };
      features: string[];
      users: { id: number; name: string }[];
    }

    const defaultConfig: Partial<AppConfig> = {
      name: 'My App',
      version: '1.0.0',
      settings: {
        theme: 'dark',
        notifications: true,
      },
      features: ['dashboard', 'reports'],
      users: [{ id: 1, name: 'Alice' }],
    };

    const userConfig: Partial<AppConfig> = {
      settings: {
        theme: 'light', // écrase 'dark'
      },
      features: ['charts', 'export'],
      users: [{ id: 2, name: 'Bob' }],
    };

    const adminOverrides: Partial<AppConfig> = {
      version: '1.0.1-beta', // écrase '1.0.0'
      settings: {
        notifications: false, // écrase 'true'
      },
      features: ['admin-panel'],
      users: [{ id: 3, name: 'Charlie' }],
    };
    const finalConfigReplace = deepMergeAll<AppConfig>(
      undefined, // Or 'replace' explicitly
      defaultConfig,
      userConfig,
      adminOverrides
    );
    Logger.log('--- Example 1: Default Strategy (replace) --:-', finalConfigReplace);
    const finalConfigConcat = deepMergeAll<AppConfig>(
      'concat',
      defaultConfig,
      userConfig,
      adminOverrides
    );
    Logger.log('--- Example 2: Array Concatenation Strategy ---', finalConfigConcat);
  })
})
jQuery(function TestFormatting() {
  const formFormattingEvent = FormFormattingEvent.getInstance();
  formFormattingEvent.lastnameToUpperCase(document, 'en');
  formFormattingEvent.capitalizeUsername(document, " ", " ", 'en')
  formFormattingEvent.usernameFormatDom(document, " ", " ", "en")
})

jQuery(function TestvalidateInput() {
  const formValidate = new FormValidate('#form_validate');
  const idsBlur = addHashToIds(formValidate.idChildrenUsingEventBlur).join(",");
  const idsInput = addHashToIds(formValidate.idChildrenUsingEventInput).join(",");
  const idsChange = addHashToIds(formValidate.idChildrenUsingEventChange).join(",");
  const __form = formValidate.form
  __form.on("blur", `${idsBlur}`, async (event: JQuery.BlurEvent) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      await formValidate.validateChildrenForm(event.target as HTMLFormChildrenElement)
      Logger.log(event);
    }
  })
  __form.on(FieldValidationFailed, (event: JQuery.TriggeredEvent) => {
    const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
    addErrorMessageFieldDom(jQuery(data.targetChildrenForm), data.message)
    Logger.log(data)

  })
  __form.on(FieldValidationSuccess, (event: JQuery.TriggeredEvent) => {
    const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
    Logger.log(data);

  })
  __form.on('input', `${idsInput}`, (event: JQuery.Event | any) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      if (target) {
        clearErrorInput(jQuery(target))
        formValidate.clearErrorDataChildren(target)
      }
    }

  });
  __form.on('change', `${idsChange}`, (event: JQuery.ChangeEvent) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      if (target) {
        clearErrorInput(jQuery(target))
        formValidate.clearErrorDataChildren(target)
      }
    }
    Logger.log(event)
  });
})

/*jQuery(this).on('submit', 'form#upload-media-form', async (event: JQuery.SubmitEvent) => {
  event.preventDefault();
  const targetInput = new FormData(event.target as HTMLFormElement);
  console.log(event)
  const speedMbps = await CallbaclSpeedMbps();
  console.log(speedMbps)
  if (!speedMbps) {
    Swal.fire({
      title: `${translate("Warning")}...`,
      icon: "warning",
      toast: true,
      position: "center",
      html: `<div class="alert alert-warning" role="alert">
              ${translate("Unable to connect, check your internet connection")}               
          </div>`,
      timer: 30000,
      animation: true,
      allowEscapeKey: false,
      background: "#283c63",
      color: "#fff",
      didOpen: () => {
        document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';
      },
      showClass: {
        popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
              `
      },
      hideClass: {
        popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
              `
      }
    })
    return;
  }
  const urlAction = addParamToUrl(
    'upload.media/sonata.admin.metadata.media',
    { 'upload_media': true, operation: 'upload_media', 'provider': 'LocalVideo' },
    true, BASE_URL_UPLOADMEDIA)
  const media = targetInput.get('media') as File
  const metadataSaveFile = new FormData();
  metadataSaveFile.append('category[name]', 'category1');
  metadataSaveFile.append('tags[name]', JSON.stringify(['tag1', 'tag2']));
  metadataSaveFile.append('filename', media.name)
  await uploadedMedia({
    urlAction: urlAction,
    metadataSaveFile: metadataSaveFile,
    target: this
  })
})
})* /
/*jQuery(async function eventListener() {
const speedMbps_media = await downloadTestFileConnectivityAndSpeed();
console.log(speedMbps_media)
const mediaEventListener = new MediaUploadEventListener(speedMbps_media);
await mediaEventListener.eventMediaListenerAll(this);
})*/
async function CallbaclSpeedMbps(): Promise<number | undefined> {
  const timeStart = new Date().getTime();
  try {
    const response = await httpFetchHandler({
      url: addParamToUrl('iws.test.callbacl.speedMbps', {}, true, BASE_URL_UPLOADMEDIA),
      timeout: 30000,
      retryCount: 2
    });
    const timeEnd = new Date().getTime();
    const durationMs = timeEnd - timeStart;
    console.log(response);
    const data: any = response.data
    if (!data.message || mapStatusToResponseType(response.status) === 'error') { return undefined; }
    // Comme ton backend ne renvoie pas de taille de fichier, on va estimer sur un petit poids fictif.
    const approximateSizeBytes = 500000; // 500 KB par exemple

    const bitsLoaded = approximateSizeBytes * 8;
    return Math.round((bitsLoaded / durationMs) / 1000);
  } catch (error) {
    console.error('Erreur lors du test de vitesse :', error);
    return undefined;
  }
}
async function downloadTestFileConnectivityAndSpeed(): Promise<number | undefined> {
  const start = Date.now();
  const response_test = await httpFetchHandler<Blob>({
    url: addParamToUrl('iws.test.callbacl.speedMbps.download-file', {}, true, BASE_URL_UPLOADMEDIA),
    responseType: "blob",
    timeout: 30000,
    retryCount: 2
  })
  const end = Date.now();
  const timeMs = end - start;
  const media = response_test.data as Blob;
  const sizeMb = media.size / (1024 * 1024);
  console.log(media)
  return Math.round((sizeMb * 8) / (timeMs / 1000)) * 27;
}
