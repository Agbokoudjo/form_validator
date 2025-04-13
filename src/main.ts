import "./style.css";

/**
 * test
 */
import debounce from "lodash.debounce";

import viteLogo from "./vite.svg";
import {
  clearErrorInput,
  serviceInternclass,
} from "./_Functions/dom";
import typescriptLogo from "./typescript.svg";
import { FormInputValidator } from "./Validators/FormInputValidator";
import { DocumentValidator } from "./Validators/Media/DocumentValidator";
import { VideoValidator } from "./Validators/Media/VideoValidator";
import { ImageValidator } from "./Validators/Media/ImageValidator";
import { FormFormattingEvent } from "./Formatting/FormFormattingEvent";
const formInputValidator = FormInputValidator.getInstance();
const documentValidator = DocumentValidator.getInstance();
const videoValidator = VideoValidator.getInstance();
const formFormattingEvent = FormFormattingEvent.getInstance();
const imageValidator = ImageValidator.getInstance();
window.$ = jQuery;
window.jQuery = jQuery;
document.querySelector<HTMLDivElement>('#app-header')!.innerHTML=`
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
  formFormattingEvent.usernameFormatDom(this," "," ","en")
      jQuery(this).on('blur','#username,#email,#tel,#message',(event: JQuery.BlurEvent)=>{
        const target = jQuery<HTMLTextAreaElement | HTMLInputElement>(event.target)!;
        console.log(target.val())
        console.log(target.attr('id'));
          if(target.length>0 && target.val() && target.val()!.length>0){
            if (target.attr('id') === 'username') {
              formInputValidator.textValidator(
                target.val() as string, target.attr('name') as string, {
                  regexValidator: /^[a-zA-ZÀ-ÿ\s]+$/i,// by default  /^[a-zA-ZÀ-ÿ\s]+$/i
                  requiredInput: true,// by default tue
                  escapestripHtmlAndPhpTags:true,// by default tue
                  maxLength: 200,
                  minLength: 6,
                  typeInput:'text', //by default, 'text'
                  errorMessageInput: "The content of this field must contain only alphabetical letters  and must not null " // by default"The content of this field must contain only alphabetical letters  and must not null Eg:AGBOKOUDJO Hounha Franck"
                })
            } else if (target.attr('id') === 'message') {
              formInputValidator.textValidator(
                target.val() as string, target.attr('name') as string, {
                  regexValidator: /^[a-zA-ZÀ-ÿ0-9\s.,!?'-]+$/i,// by default  /^[a-zA-ZÀ-ÿ\s]+$/i
                  requiredInput: true,// by default tue
                  escapestripHtmlAndPhpTags:false,// by default tue
                  maxLength: 10000,
                  minLength: 20,
                  typeInput:'textarea', //by default, 'text'
                  errorMessageInput: "The content of this field is invalid"
                })
            }
             else if (target.attr('id') === 'email') {
              formInputValidator.emailValidator(
                target.val() as string, target.attr('name') as string, {
                  regexValidator: /^([a-zA-ZÀ-ÿ0-9._-]{2,})+(@[a-zA-ZÀ-ÿ0-9._-]{2,})+(\.[a-z]{2,6})+$/i,// by default  /^([a-zA-ZÀ-ÿ0-9._-]{2,})+(@[a-zA-ZÀ-ÿ0-9._-]{2,})+(\.[a-z]{2,6})+$/i;
                  requiredInput: true,// by default tue
                  escapestripHtmlAndPhpTags:false,// by default tue
                  maxLength: 180,
                  minLength: 6,
                  errorMessageInput: "email is invalid  Eg:franckagbokoudjo301@gmail.com" // by dfault "email is invalid  Eg:franckagbokoudjo301@gmail.com"
                })
            }else if (target.attr('id') === 'tel') {
              formInputValidator.telValidator(
                target.val() as string,
                target.attr('name') as string, {
                  regexValidator: /^([\+]{1})([0-9\s]{1,})+$/i,// by default  /^([\+]{1})([0-9\s]{1,})+$/i;
                  requiredInput: true,// by default tue
                  maxLength: 30,
                  minLength: 8,
                  errorMessageInput:'The content of this field must contain only number ,one symbol +,of spaces and must not null ,Eg: +229 67 25 18 86' // by dfault 'The content of this field must contain only number ,one symbol +,of spaces and must not null ,Eg: +229 67 25 18 86'
                })
            }
            if (!formInputValidator.hasErrorsField(target.attr('name') as string)) {
              serviceInternclass(jQuery(target), formInputValidator);
            }
          }
      })
      jQuery(this).on('input', '#username,#email,#tel,#message',(event: JQuery.Event|any) => {
    const target = event.target as HTMLInputElement|HTMLTextAreaElement;
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
  const validatePdf= debounce(async (event: JQuery.BlurEvent) => {
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
      clearErrorInput(jQuery(target),instanceValidatorpdf);
    }
  });
  const videoAll = jQuery<HTMLInputElement>('input#video');
  let instanceValidatorvideo = videoValidator;
  const validatevideo= debounce(async (event: JQuery.BlurEvent) => {
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
      clearErrorInput(jQuery(target),instanceValidatorvideo);
    }
  });
});
