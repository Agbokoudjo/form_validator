import "./style.css";
import debounce from "lodash.debounce";
import viteLogo from "./vite.svg";
import {
  clearErrorInput,
  serviceInternclass,
} from "./Validators/_functions/dom";
import typescriptLogo from "./typescript.svg";
import Swal from "sweetalert2";
import { translate } from "./_Utils";
import { FormInputValidator } from "./Validators/FormInputValidator";
import { DocumentValidator } from "./Validators/Media/DocumentValidator";
import { VideoValidator } from "./Validators/Media/VideoValidator";
import { ImageValidator } from "./Validators/Media/ImageValidator";
import { FormFormattingEvent } from "./Formatting/FormFormattingEvent";
import { uploadedMedia } from './MediaUpload/upload';
import { addParamToUrl, httpFetchHandler, mapStatusToResponseType } from "./_Utils";
import { MediaUploadEventListener } from ".";
import { Logger } from "./_Utils/logger";
const formInputValidator = FormInputValidator.getInstance();
const documentValidator = DocumentValidator.getInstance();
const videoValidator = VideoValidator.getInstance();
const formFormattingEvent = FormFormattingEvent.getInstance();
const imageValidator = ImageValidator.getInstance();
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
jQuery(function validateInput() {
  /**
   * Text input formatting
   */
  formFormattingEvent.lastnameToUpperCase(this, 'en');
  formFormattingEvent.capitalizeUsername(this, " ", " ", 'en')
  formFormattingEvent.usernameFormatDom(this, " ", " ", "en")
  jQuery(this).on('blur', '#username,#email,#tel,#message', (event: JQuery.BlurEvent) => {
    const target = jQuery<HTMLTextAreaElement | HTMLInputElement>(event.target)!;
    console.log(target.val())
    console.log(target.attr('id'));
    if (target.length > 0 && target.val() && target.val()!.length > 0) {
      if (target.attr('id') === 'username') {
        formInputValidator.textValidator(
          target.val() as string, target.attr('name') as string, {
          regexValidator: /^[a-zA-ZÀ-ÿ\s]+$/i,// by default  /^[a-zA-ZÀ-ÿ\s]+$/i
          requiredInput: true,// by default tue
          escapestripHtmlAndPhpTags: true,// by default tue
          maxLength: 200,
          minLength: 6,
          typeInput: 'text', //by default, 'text'
          errorMessageInput: "The content of this field must contain only alphabetical letters  and must not null " // by default"The content of this field must contain only alphabetical letters  and must not null Eg:AGBOKOUDJO Hounha Franck"
        })
      } else if (target.attr('id') === 'message') {
        formInputValidator.textValidator(
          target.val() as string, target.attr('name') as string, {
          regexValidator: /^[a-zA-ZÀ-ÿ0-9\s.,!?'-]+$/i,// by default  /^[a-zA-ZÀ-ÿ\s]+$/i
          requiredInput: true,// by default tue
          escapestripHtmlAndPhpTags: false,// by default tue
          maxLength: 10000,
          minLength: 20,
          typeInput: 'textarea', //by default, 'text'
          errorMessageInput: "The content of this field is invalid"
        })
      }
      else if (target.attr('id') === 'email') {
        formInputValidator.emailValidator(
          target.val() as string, target.attr('name') as string, {
          regexValidator: /^([a-zA-ZÀ-ÿ0-9._-]{2,})+(@[a-zA-ZÀ-ÿ0-9._-]{2,})+(\.[a-z]{2,6})+$/i,// by default  /^([a-zA-ZÀ-ÿ0-9._-]{2,})+(@[a-zA-ZÀ-ÿ0-9._-]{2,})+(\.[a-z]{2,6})+$/i;
          requiredInput: true,// by default tue
          escapestripHtmlAndPhpTags: false,// by default tue
          maxLength: 180,
          minLength: 6,
          errorMessageInput: "email is invalid  Eg:franckagbokoudjo301@gmail.com" // by dfault "email is invalid  Eg:franckagbokoudjo301@gmail.com"
        })
      } else if (target.attr('id') === 'tel') {
        formInputValidator.telValidator(
          target.val() as string,
          target.attr('name') as string, {
          regexValidator: /^([\+]{1})([0-9\s]{1,})+$/i,// by default  /^([\+]{1})([0-9\s]{1,})+$/i;
          requiredInput: true,// by default tue
          maxLength: 30,
          minLength: 8,
          errorMessageInput: 'The content of this field must contain only number ,one symbol +,of spaces and must not null ,Eg: +229 67 25 18 86' // by dfault 'The content of this field must contain only number ,one symbol +,of spaces and must not null ,Eg: +229 67 25 18 86'
        })
      }
      if (!formInputValidator.hasErrorsField(target.attr('name') as string)) {
        serviceInternclass(jQuery(target), formInputValidator);
      }
    }
  })
  jQuery(this).on('input', '#username,#email,#tel,#message', (event: JQuery.Event | any) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (target) {
      clearErrorInput(jQuery(target), formInputValidator);
    }
  });
})
jQuery(function mediaLoad() {
  const imagesAll = jQuery<HTMLInputElement>('input#img');
  let instance = imageValidator;
  const validateImage = debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instance = await imageValidator.fileValidator(target.files as FileList, target.name);
      if (!instance.hasErrorsField(target.name)) {
        serviceInternclass(jQuery(target), instance);
      }
    }
  }, 300); // Délai de 300ms

  imagesAll?.on('blur', validateImage);
  imagesAll?.on('change', (event: JQuery.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      clearErrorInput(jQuery(target), instance);
    }
  });
  const pdfAll = jQuery<HTMLInputElement>('input#pdf');
  let instanceValidatorpdf = documentValidator;
  const validatePdf = debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instanceValidatorpdf = await documentValidator.fileValidator(
        target.files as FileList, target.name,
        {
          allowedMimeTypeAccept: ['application/pdf', 'text/csv', 'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.text'
          ]
        });
      if (!instanceValidatorpdf.hasErrorsField(target.name)) {
        serviceInternclass(jQuery(target), instanceValidatorpdf);
      }
    }
  }, 300); // Délai de 300ms
  pdfAll.on('blur', validatePdf);
  pdfAll.on('change', (event: JQuery.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      clearErrorInput(jQuery(target), instanceValidatorpdf);
    }
  });
  const videoAll = jQuery<HTMLInputElement>('input#video');
  let instanceValidatorvideo = videoValidator;
  const validatevideo = debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instanceValidatorvideo = await videoValidator.fileValidator(
        target.files as FileList, target.name,
        {
          extensions: [
            "avi", "flv", "wmv", "mp4", "mov", "mkv", "webm", "3gp",
            "3g2", "m4v", "mpg", "mpeg", "ts", "ogv", "asf", "rm", "divx"],
          allowedMimeTypeAccept: [
            "video/x-msvideo", "video/x-flv", "video/x-ms-wmv",
            "video/mp4", "video/quicktime", "video/x-matroska",
            "video/webm", "video/3gpp", "video/3gpp2", "video/x-m4v",
            "video/mpeg", "video/mp2t", "video/ogg", "video/x-ms-asf",
            "application/vnd.rn-realmedia", "video/divx"]
        });
      if (!instanceValidatorvideo.hasErrorsField(target.name)) {
        serviceInternclass(jQuery(target), instanceValidatorvideo);
      }
    }
  }, 300); // Délai de 300ms
  videoAll.on('blur', validatevideo);
  videoAll.on('change', (event: JQuery.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      clearErrorInput(jQuery(target), instanceValidatorvideo);
    }
  });
  /**
   * it just for test
   */
  jQuery(this).on('submit', 'form#upload-media-form', async (event: JQuery.SubmitEvent) => {
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
})
jQuery(async function eventListener() {
  const speedMbps_media = await downloadTestFileConnectivityAndSpeed();
  console.log(speedMbps_media)
  const mediaEventListener = new MediaUploadEventListener(speedMbps_media);
  await mediaEventListener.eventMediaListenerAll(this);
})
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


