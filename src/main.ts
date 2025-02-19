import "./style.css";

/**
 * test
 */
import debounce from "lodash.debounce";

import viteLogo from "../public/vite.svg";
import {
  clearErrorInput,
  serviceInternclass,
} from "./module_fonction/function_dom";
import typescriptLogo from "./typescript.svg";
import formInputValidator from "./validators/FormInputValidator";
import documentValidator from "./validators/Media/DocumentValidator";
import imageValidator from "./validators/Media/ImageValidator";

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
    jQuery(function validateInput(){
      jQuery(this).on('blur','#fullname_test,#email_test,#tel_test,#message_test',(event: JQuery.BlurEvent)=>{
          const target=jQuery<HTMLTextAreaElement|HTMLInputElement>(event.target)!;
          if(target.length>0){
            if(target.attr('id') ==='#fullname_test'){
              formInputValidator.validatorInputTypeText(
                target.val() as string, target.attr('name') as string, {
                  regexValidator: /^[a-zA-ZÀ-ÿ\s]+$/i,// by default  /^[a-zA-ZÀ-ÿ\s]+$/i
                  requiredInput: true,// by default tue
                  escapestripHtmlAndPhpTags:true,// by default tue
                  maxLength: 200,
                  minLength: 6,
                  typeInput:'text', //by default, 'text'
                  errorMessageInput: "The content of this field must contain only alphabetical letters  and must not null Eg:AGBOKOUDJO Hounha Franck" // by default"The content of this field must contain only alphabetical letters  and must not null Eg:AGBOKOUDJO Hounha Franck"
                })
            } else if (target.attr('id') === 'message_test') {
              formInputValidator.validatorInputTypeText(
                target.val() as string, target.attr('name') as string, {
                  regexValidator: /^[a-zA-ZÀ-ÿ\s]+$/i,// by default  /^[a-zA-ZÀ-ÿ\s]+$/i
                  requiredInput: true,// by default tue
                  escapestripHtmlAndPhpTags:false,// by default tue
                  maxLength: 10000,
                  minLength: 20,
                  typeInput:'textarea', //by default, 'text'
                  errorMessageInput: "The content of this field is invalid"
                })
            }
             else if (target.attr('id') === 'email_test') {
              formInputValidator.validatorInputEmail(
                target.val() as string, target.attr('name') as string, {
                  regexValidator: /^([a-zA-ZÀ-ÿ0-9._-]{2,})+(@[a-zA-ZÀ-ÿ0-9._-]{2,})+(\.[a-z]{2,6})+$/i,// by default  /^([a-zA-ZÀ-ÿ0-9._-]{2,})+(@[a-zA-ZÀ-ÿ0-9._-]{2,})+(\.[a-z]{2,6})+$/i;
                  requiredInput: true,// by default tue
                  escapestripHtmlAndPhpTags:false,// by default tue
                  maxLength: 180,
                  minLength: 6,
                  errorMessageInput: "email is invalid  Eg:franckagbokoudjo301@gmail.com" // by dfault "email is invalid  Eg:franckagbokoudjo301@gmail.com"
                })
            }else if (target.attr('id') === 'tel_test') {
              formInputValidator.validatorInputTel(
                target.val() as string, target.attr('name') as string, {
                  regexValidator: /^([\+]{1})([0-9\s]{1,})+$/i,// by default  /^([\+]{1})([0-9\s]{1,})+$/i;
                  requiredInput: true,// by default tue
                  maxLength: 30,
                  minLength: 8,
                  errorMessageInput:'The content of this field must contain only number ,one symbol +,of spaces and must not null ,Eg: +229 67 25 18 86' // by dfault 'The content of this field must contain only number ,one symbol +,of spaces and must not null ,Eg: +229 67 25 18 86'
                })
            }
            if (formInputValidator.getIsValidFieldWithKey(target.attr('name') as string)=== false) {
              serviceInternclass(jQuery(target), formInputValidator);
            }
          }
      })
      jQuery(this).on('change', '#fullname_test,#email_test,#tel_test,#message_test',(event: JQuery.ChangeEvent) => {
    const target = event.target as HTMLInputElement|HTMLTextAreaElement;
    if (target) {
      clearErrorInput(jQuery(target), formInputValidator);
    }
  });
    })
jQuery(function documentLoad() {
  const imagesAll = jQuery<HTMLInputElement>('input#img_test');
  let instance = imageValidator;
  const validateImage = debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instance = await imageValidator.validatorFile(target.files as FileList, target.name);
      if (!instance.getIsValidFieldWithKey(target.name)) {
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
  const pdfAll = jQuery<HTMLInputElement>('input#pdf_test');
  let instanceValidatorpdf = documentValidator;
  const validatePdf= debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instanceValidatorpdf = await documentValidator.validatorFile(
        target.files as FileList, target.name,
        {
          allowedMimeTypeAccept: ['application/pdf', 'text/csv', 'text/plain',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.text'
          ]
        });
      if (!instanceValidatorpdf.getIsValidFieldWithKey(target.name)) {
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
});
