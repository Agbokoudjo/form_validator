import "./style.css";
import debounce from "lodash.debounce";
import viteLogo from "./vite.svg";
import {
  clearErrorInput,
} from "./Validators/_functions/dom";
import typescriptLogo from "./typescript.svg";
import Swal from "sweetalert2";
import { addHashToIds, translate } from "./_Utils";
import { configurePDFWorker } from "./Validators/Media/DocumentValidator";
import { FormFormattingEvent } from "./Formatting/FormFormattingEvent";
import { uploadedMedia } from './MediaUpload/upload';
import { addParamToUrl, httpFetchHandler, mapStatusToResponseType } from "./_Utils";
import { FieldValidationEventData, FieldValidationFailed, FieldValidationSuccess, FormValidate, MediaUploadEventListener, addErrorMessageFieldDom } from ".";
import { Logger } from "./_Utils/logger";
import { HTMLFormChildrenElement } from ".";
import * as pdfjsLib from 'pdfjs-dist';
/*const formInputValidator = FormInputValidator.getInstance();*/
//const documentValidator = DocumentValidator.getInstance();
//const videoValidator = VideoValidator.getInstance();
//const imageValidator = ImageValidator.getInstance();
const formFormattingEvent = FormFormattingEvent.getInstance();
window.$ = jQuery;
window.jQuery = jQuery;
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
configurePDFWorker('public/workers/pdf.worker.min.js');
jQuery(function validateInput() {
  /**
   * Text input formatting
   */
  formFormattingEvent.lastnameToUpperCase(this, 'en');
  formFormattingEvent.capitalizeUsername(this, " ", " ", 'en')
  formFormattingEvent.usernameFormatDom(this, " ", " ", "en")
  const formValidate = new FormValidate('#form_validate');
  const idsBlur = addHashToIds(formValidate.idChildrenUsingEventBlur).join(",");
  const idsInput = addHashToIds(formValidate.idChildrenUsingEventInput).join(",");
  const idsChange = addHashToIds(formValidate.idChildrenUsingEventChange).join(",");
  formValidate.form.on("blur", `${idsBlur}`, (event: JQuery.BlurEvent) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      console.log(event);
      formValidate.validateChildrenForm(event.target as HTMLFormChildrenElement)
    }
  })
  formValidate.form.on(FieldValidationFailed, (event: JQuery.TriggeredEvent) => {
    const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
    console.log(data);
    addErrorMessageFieldDom(jQuery(data.targetChildrenForm), data.message)

  })
  formValidate.form.on(FieldValidationSuccess, (event: JQuery.TriggeredEvent) => {
    const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
    console.log(data);

  })
  formValidate.form.on('input', `${idsInput}`, (event: JQuery.Event | any) => {
    const target = event.target;
    console.log(event);
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      if (target) {
        clearErrorInput(jQuery(target))
        formValidate.clearErrorDataChildren()
      }
    }

  });
  formValidate.form.on('change', `${idsChange}`, (event: JQuery.ChangeEvent) => {
    const target = event.target;
    console.log(event);
    if (target instanceof HTMLInputElement) {
      if (target) {
        clearErrorInput(jQuery(target))
        formValidate.clearErrorDataChildren()
      }
    }

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
