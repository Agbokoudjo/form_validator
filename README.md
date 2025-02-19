##

- This file is part of the project by AGBOKOUDJO Franck.
-
- (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
- Phone: +229 67 25 18 86
- LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
- Company: INTERNATIONALES WEB SERVICES
-
- For more information, please feel free to contact the author.

##

# Form Validator

## **Form Validator** est une bibliothèque JavaScript/TypeScript permettant la validation de différents types de fichiers dans des formulaires HTML. Elle prend en charge les validations pour les entrées input de type text,email,tel,password,ainsi que les fichiers de type file comme image, PDF, Word, CSV,excel, et bien plus, avec des configurations personnalisables.

## 📋 Fonctionnalités principales

- **Validation des entrées de types tel que text,email,password,tel**:c'est la class typescript FormInputValidator qui est le gestionnaires des validations de ces types de champps input, -**Utilisation de FormInputValidator**:
<div class="container" id="app">
      <div class="form-group">
        <form class="form">
          <label for="fullname_test">Fullname</label><br/>
          <input type="text" class="form-control"
          placeholder="Eg:AGBOKOUDJO Hounha Franck" id="fullname_test" name="fullname_test"/><br/>
           <label for="email_test">Email</label><br/>
          <input type="email" class="email form-control" 
          placeholder="Eg:franckagbokoudjo301@gmail.com" id="email_test" name="email_test"/><br/>
          <label for="tel_test">Phone:</label>
            <input type="tel" class="tel form-control" 
          placeholder="Eg:+22967251886" id="tel_test" name="tel_test"/><br/>
          <label for="message_test">Message:</label>
          <textarea id="message_test" placeholder="write the message here"></textarea>
          <button type="submit" class="btn-submit btn">Valid</button>
        </form>
      </div>
    </div>
  <script type="text/javascript">
    import jQuery from "jquery";
    import { debounce } from "lodash";
    import { formInputValidator } from "./validators";
    jQuery(function validateInput(){
      const fullname=jQuery<HTMLInputElement>('#fullname_test');
      const email=jQuery<HTMLInputElement>('#email_test');
      const tel=jQuery<HTMLInputElement>('#tel_test')
      const message=jQuery<HTMLTextAreaElement>('#message_test');
      const instance_validator_form=formInputValidator;
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
  </script>

## In react component it do

  <script type="text/javascript">
      
  </script>

- **Validation d'images** : Assure que le fichier image respecte les dimensions, taille maximale et type MIME autorisés.
- **Validation de documents (PDF, Word, CSV, etc.)** : Vérifie le type MIME, le contenu des fichiers CSV et les métadonnées des vidéos.
- **Personnalisation des règles de validation** : Définit des limites spécifiques comme la durée, les dimensions, ou encore la taille des fichiers.
- **Utilisation de classes spécialisées** : Les classes comme `ImageValidator` ou `DocumentValidator` offrent des méthodes puissantes et flexibles pour valider différents fichiers.
- **Support jQuery** : Facilité d'intégration avec des événements jQuery (`blur`, `change`, etc.) pour la validation en temps réel.

---

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants :

- **Node.js** : v16 ou supérieur.
- **jQuery** : v3.6 ou supérieur.
- **TypeScript** (optionnel) : Si vous souhaitez utiliser ou modifier le code TypeScript.
- **npm** ou **yarn** : Pour la gestion des dépendances.

---

## 🚀 Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/username/form-validator.git
   cd form-validator
   2-Installez les dépendances nécessaires :
   npm install
   ```

# ou

yarn install

📖 Exemple d'utilisation

Voici un exemple pour valider des fichiers d'image et de document dans un formulaire HTML.
HTML

 <div class="container" id="app">
      <div id="app-header"></div>
      <div class="form-group">
        <form class="form">
          <label for="image_test">Uploader des images</label><br/>
          <input type="file" class="images form-control" multiple 
          placeholder="choose images many or one" id="img_test" name="images_test"/><br/>
           <label for="pdf_test">Uploader des documents pdf</label><br/>
          <input type="file" class="pdf form-control" multiple 
          placeholder="choose pdf many or one" id="pdf_test" name="pdf_test"/><br/>
          
          <button type="submit" class="btn-submit btn ">Valider</button>
        </form>
      </div>
    </div>

    <script type="text/javascript">
      import jQuery from "jquery";
          import { debounce } from "lodash";
          import { ImageValidator, DocumentValidator } from "./validators";

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
</script>
🔧 Configuration
Délais pour la validation

Vous pouvez modifier le délai pour les fonctions de validation avec le paramètre debounce :

debounce(validateImage, 300); // Défaut : 300 ms
👥 Contributeurs

    AGBOKOUDJO Franck - Créateur principal
