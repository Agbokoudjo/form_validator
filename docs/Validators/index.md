# @wlindabla/form_validator

> **Bibliothèque de validation de formulaires puissante et indépendante de tout framework JavaScript/TypeScript**

Une bibliothèque de validation complète pour les formulaires HTML supportant `text`, `email`, `tel`, `password`, `URL`, `date`, `number`, `select`, `checkbox`, `radio`, et les types de fichiers enrichis : **images**, **PDFs**, **documents Word**, **Excel**, **CSV**, **ODF/RTF** et **vidéos** — avec inspection binaire des signatures (magic bytes), validation de métadonnées réelles, et un store d'erreurs centralisé.

**Auteur :** [AGBOKOUDJO Franck](https://www.linkedin.com/in/internationales-web-apps-services-120520193/)  
**Entreprise :** INTERNATIONALES WEB APPS & SERVICES  
**GitHub :** [https://github.com/Agbokoudjo/form_validator](https://github.com/Agbokoudjo/form_validator)  
**Issues :** [https://github.com/Agbokoudjo/form_validator/issues](https://github.com/Agbokoudjo/form_validator/issues)

---

## Table des Matières

- [@wlindabla/form\_validator](#wlindablaform_validator)
  - [Table des Matières](#table-des-matières)
  - [Installation](#installation)
  - [Architecture](#architecture)
  - [Démarrage Rapide](#démarrage-rapide)
    - [Utilisation du Routeur Central (recommandé)](#utilisation-du-routeur-central-recommandé)
    - [Utilisation du Contrôleur de Formulaire Complet (piloté par HTML)](#utilisation-du-contrôleur-de-formulaire-complet-piloté-par-html)
  - [Validateurs Texte](#validateurs-texte)
    - [TextInputValidator](#textinputvalidator)
    - [TextareaValidator](#textareavalidator)
    - [EmailInputValidator](#emailinputvalidator)
    - [PasswordInputValidator](#passwordinputvalidator)
    - [TelInputValidator](#telinputvalidator)
    - [URLInputValidator](#urlinputvalidator)
    - [FQDNInputValidator](#fqdninputvalidator)
    - [DateInputValidator](#dateinputvalidator)
    - [NumberInputValidator](#numberinputvalidator)
  - [Validateurs de Choix](#validateurs-de-choix)
    - [SelectValidator](#selectvalidator)
    - [CheckBoxValidator](#checkboxvalidator)
    - [RadioValidator](#radiovalidator)
  - [Validateurs de Fichiers](#validateurs-de-fichiers)
    - [ImageValidator](#imagevalidator)
    - [VideoValidator](#videovalidator)
    - [PdfValidator](#pdfvalidator)
    - [ExcelValidator](#excelvalidator)
    - [CsvValidator](#csvvalidator)
    - [MicrosoftWordValidator](#microsoftwordvalidator)
    - [OdtValidator](#odtvalidator)
  - [Routeur Central : FormInputValidator](#routeur-central--forminputvalidator)
  - [Orchestrateur : FormValidateController](#orchestrateur--formvalidatecontroller)
  - [Store d'Erreurs : FormErrorStore](#store-derreurs--formerrorstore)
  - [Événements de Validation](#événements-de-validation)
  - [Cache Adapter](#cache-adapter)
  - [Validation par Attributs HTML](#validation-par-attributs-html)
  - [Intégration par Framework](#intégration-par-framework)
    - [Vanilla JS / TypeScript](#vanilla-js--typescript)
    - [React / Next.js](#react--nextjs)
    - [Angular](#angular)
    - [Vue.js](#vuejs)
    - [jQuery](#jquery)
    - [Symfony + Twig](#symfony--twig)
  - [Référence API](#référence-api)
    - [Table des exports](#table-des-exports)
    - [Méthodes communes à tous les validateurs](#méthodes-communes-à-tous-les-validateurs)
    - [FormValidateController — Méthodes publiques](#formvalidatecontroller--méthodes-publiques)
  - [Licence](#licence)

---

## Installation

```bash
# npm
npm install @wlindabla/form_validator

# yarn
yarn add @wlindabla/form_validator

# pnpm
pnpm add @wlindabla/form_validator
```

---

## Architecture

```
@wlindabla/form_validator
src/Validation/
├── Core
│   ├── Adapter
│   │   ├── Dom
│   │   │   ├── AbstractFieldController.ts
│   │   │   ├── Cache
│   │   │   │   ├── index.ts
│   │   │   │   └── LocalStorageCacheAdapter.ts
│   │   │   ├── FieldInputController.ts
│   │   │   └── index.ts
│   │   ├── FieldOptionsValidateCacheAdapter.ts
│   │   ├── FieldValidationEvent.ts
│   │   └── index.ts
│   ├── index.ts
│   └── Router
│       ├── FormInputValidator.ts
│       └── index.ts
├── FormValidateController.ts
├── index.ts
├── Rules
│   ├── Choice
│   │   ├── CheckBoxValidator.ts
│   │   ├── RadioValidator.ts
│   │   └── SelectValidator.ts
│   ├── FieldValidator.ts
│   ├── File
│   │   ├── AbstractMediaValidator.ts
│   │   ├── DocumentValidator.ts  (PdfValidator, ExcelValidator, CsvValidator,
│   │   │                          MicrosoftWordValidator, OdtValidator)
│   │   ├── ImageValidator.ts
│   │   ├── InterfaceMedia.ts
│   │   └── VideoValidator.ts
│   └── Text
│       ├── DateInputValidator.ts
│       ├── EmailInputValidator.ts
│       ├── FQDNInputValidator.ts
│       ├── NumberInputValidator.ts
│       ├── PasswordInputValidator.ts
│       ├── TelInputValidator.ts
│       ├── TextareaValidator.ts
│       ├── TextInputValidator.ts
│       └── URLInputValidator.ts
└── Store
    └── index.ts
```

**Principes de conception clés :**
- **Validators Singleton** — chaque classe de validateur expose une instance unique partagée via `getInstance()`.
- **Store d'erreurs centralisé** — tous les résultats de validation sont stockés dans `FormErrorStore`, source unique de vérité.
- **Orienté événements** — les résultats de validation sont diffusés comme `CustomEvent` sur l'élément `<form>` parent.
- **Indépendant du framework** — fonctionne avec Vanilla JS, React, Angular, Vue, jQuery, ou tout template côté serveur.
- **Détection de type de document automatique** — `DocumentTypeResolver` détecte automatiquement le type réel de chaque fichier uploadé et applique le validateur approprié.

---

## Démarrage Rapide

### Utilisation du Routeur Central (recommandé)

```typescript
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';

// Champ texte
await formInputValidator.allTypesValidator(
  'Jean Dupont',
  'fullName',
  'text',
  { minLength: 2, maxLength: 100, requiredInput: true }
);

// Vérifier le résultat
const validator = formInputValidator.getValidator('fullName');
if (validator?.formErrorStore.isFieldValid('fullName')) {
  console.log('Valide !');
} else {
  console.log(validator?.formErrorStore.getFieldErrors('fullName'));
}
```

### Utilisation du Contrôleur de Formulaire Complet (piloté par HTML)

```html
<form name="registrationForm" class="form-validate">
  <input
    id="email"
    name="email"
    type="email"
    required
    data-event-validate="blur"
    data-event-validate-blur="blur"
    data-error-message-input="Veuillez entrer un email valide."
  />
</form>
```

```typescript
import { FormValidateController } from '@wlindabla/form_validator';

const controller = new FormValidateController('.form-validate');

// Valider tous les champs à la fois (ex. au submit)
const isValid = await controller.isFormValid();

// Valider un seul champ
const input = document.querySelector<HTMLInputElement>('#email')!;
await controller.validateChildrenForm(input);
```

---

## Validateurs Texte

### TextInputValidator

Valide les champs texte avec regex, contraintes de longueur, suppression de tags HTML/PHP, et vérification de champ requis.

**Import :**
```typescript
import { textInputValidator, TextInputOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Options (`TextInputOptions`) :**

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `requiredInput` | `boolean` | `true` | Champ obligatoire |
| `minLength` | `number` | `1` | Nombre minimum de caractères |
| `maxLength` | `number` | `255` | Nombre maximum de caractères |
| `regexValidator` | `RegExp` | `/^\p{L}+$/iu` | Pattern à tester |
| `match` | `boolean` | `true` | `true` = la valeur doit correspondre au regex ; `false` = ne doit pas correspondre |
| `escapestripHtmlAndPhpTags` | `boolean` | `true` | Supprimer les tags HTML/PHP avant validation |
| `errorMessageInput` | `string` | — | Message d'erreur personnalisé |
| `egAwait` | `string` | — | Exemple de valeur affiché dans l'erreur |
| `typeInput` | `FormInputType` | `'text'` | Indication pour les messages d'erreur |

**Exemple :**
```typescript
textInputValidator.validate('Jean-Pierre', 'firstName', {
  minLength: 2,
  maxLength: 50,
  requiredInput: true,
  regexValidator: /^[\p{L}\s\-']+$/u,
  match: true,
  errorMessageInput: 'Uniquement des lettres, espaces, tirets et apostrophes.',
  egAwait: 'Jean-Pierre'
});

const errors = textInputValidator.formErrorStore.getFieldErrors('firstName');
```

---

### TextareaValidator

Délègue à `TextInputValidator` avec `ignoreMergeWithDefaultOptions: true`. Utilisez-le pour les textes longs.

```typescript
import { textareaInputValidator } from '@wlindabla/form_validator/validation/rules/text';

textareaInputValidator.validate(
  userInput,
  'bio',
  {
    minLength: 20,
    maxLength: 2000,
    requiredInput: true,
    typeInput: 'textarea',
    escapestripHtmlAndPhpTags: true
  }
);
```

---

### EmailInputValidator

Validation complète conforme RFC : regex, noms d'affichage, vérification FQDN du domaine, parties locales UTF-8, listes noires/blanches d'hôtes.

**Import :**
```typescript
import { emailInputValidator, EmailInputOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Options clés (`EmailInputOptions`) :**

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `allowUtf8LocalPart` | `boolean` | `true` | Autoriser Unicode dans la partie locale |
| `allowIpDomain` | `boolean` | `false` | Autoriser les domaines IP |
| `allowDisplayName` | `boolean` | `false` | Autoriser le format `"Jean Doe <jean@example.com>"` |
| `requireDisplayName` | `boolean` | `false` | Exiger le nom d'affichage |
| `hostBlacklist` | `(string\|RegExp)[]` | `[]` | Domaines bloqués |
| `hostWhitelist` | `(string\|RegExp)[]` | `[]` | Domaines autorisés uniquement |
| `blacklistedChars` | `string` | `''` | Caractères interdits dans la partie locale |
| `ignoreMaxLength` | `boolean` | `false` | Ignorer la vérification de longueur max |

**Exemple :**
```typescript
await emailInputValidator.validate('franckagbokoudjo301@gmail.com', 'userEmail', {
  requiredInput: true,
  allowUtf8LocalPart: true,
  hostBlacklist: ['tempmail.com', 'guerrillamail.com'],
  errorMessageInput: 'Veuillez entrer une adresse email professionnelle valide.'
});

if (!emailInputValidator.formErrorStore.isFieldValid('userEmail')) {
  const errors = emailInputValidator.formErrorStore.getFieldErrors('userEmail');
}
```

---

### PasswordInputValidator

Valide les mots de passe selon des règles de caractères (majuscules, minuscules, chiffres, symboles, ponctuation), la longueur, et un scoring de force optionnel. Déclenche un `CustomEvent` avec le score si activé.

**Import :**
```typescript
import { passwordInputValidator, PassworkRuleOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Options clés (`PassworkRuleOptions`) :**

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `minLength` | `number` | `8` | Longueur minimale |
| `maxLength` | `number` | `256` | Longueur maximale |
| `upperCaseAllow` | `boolean` | `true` | Exiger une majuscule |
| `lowerCaseAllow` | `boolean` | `true` | Exiger une minuscule |
| `numberAllow` | `boolean` | `true` | Exiger un chiffre |
| `symbolAllow` | `boolean` | `true` | Exiger un caractère spécial |
| `enableScoring` | `boolean` | `true` | Déclencher l'événement de score |
| `regexValidator` | `RegExp` | regex fort | Remplacer le pattern |

**Événement de scoring :**
```typescript
document.addEventListener('scoreAnalysisPassword', (e: CustomEvent) => {
  const { score, analysis, input } = e.detail;
  console.log(`Champ: ${input}, Score de force: ${score}`);
});

passwordInputValidator.validate('MonP@ssw0rd!', 'password', {
  minLength: 10,
  upperCaseAllow: true,
  numberAllow: true,
  symbolAllow: true,
  enableScoring: true
});
```

---

### TelInputValidator

Valide les numéros de téléphone internationaux via [`libphonenumber-js`](https://gitlab.com/catamphetamine/libphonenumber-js). Formate automatiquement les numéros valides dans le champ DOM.

**Import :**
```typescript
import { telInputValidator, TelInputOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Exemple :**
```typescript
telInputValidator.validate('+22901672518 86', 'phone', {
  defaultCountry: 'BJ',
  egAwait: '+229 01 67 25 18 86',
  requiredInput: true
});

// Numéro français :
telInputValidator.validate('+33612345678', 'mobile', {
  defaultCountry: 'FR',
  minLength: 10,
  maxLength: 20
});
```

> Le numéro doit commencer par `+`. Le validateur formate automatiquement les numéros valides en format international (ex. `+229 01 67 25 18 86`).

---

### URLInputValidator

Valide les URLs selon les règles de protocole, hôte, IP, localhost, paramètres de requête, fragments, port, identifiants d'authentification, et listes noires/blanches.

**Import :**
```typescript
import { urlInputValidator, URLOptions } from '@wlindabla/form_validator/validation/rules/text';
```

**Options clés :**

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `allowedProtocols` | `string[]` | `['http','https','file','blob','url','data']` | Protocoles acceptés |
| `requireProtocol` | `boolean` | `false` | L'URL doit inclure un protocole |
| `requireValidProtocol` | `boolean` | `true` | Le protocole doit être dans `allowedProtocols` |
| `allowLocalhost` | `boolean` | `false` | Autoriser `localhost` / `127.0.0.1` |
| `allowIP` | `boolean` | `false` | Autoriser les hôtes IP |
| `allowQueryParams` | `boolean` | `true` | Autoriser `?key=value` |
| `allowHash` | `boolean` | `true` | Autoriser `#fragment` |
| `disallowAuth` | `boolean` | `false` | Rejeter `user:pass@host` |
| `maxAllowedLength` | `number` | `2048` | Longueur max de l'URL |
| `hostBlacklist` | `(string\|RegExp)[]` | `[]` | Hôtes bloqués |
| `hostWhitelist` | `(string\|RegExp)[]` | `[]` | Hôtes autorisés uniquement |

**Exemple :**
```typescript
await urlInputValidator.validate('https://proticeditions.com/catalogue', 'website', {
  allowedProtocols: ['https'],
  requireProtocol: true,
  allowQueryParams: true,
  hostBlacklist: ['spam.com'],
  disallowAuth: true
});
```

---

### FQDNInputValidator

Valide les Fully Qualified Domain Names (FQDN) : exigence TLD, underscores, wildcards, point final, longueur des labels.

```typescript
import { fqdnInputValidator, FQDNOptions } from '@wlindabla/form_validator/validation/rules/text';

await fqdnInputValidator.validate('mail.example.com', 'domain', {
  requireTLD: true,
  allowedUnderscores: false,
  allowWildcard: false
});
```

---

### DateInputValidator

Parse et valide les chaînes de date par rapport à des templates de format, des plages de dates, et des restrictions futur/passé.

**Options (`DateInputOptions`) :**

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `format` | `string` | `'YYYY/MM/DD'` | Template de format de date |
| `strictMode` | `boolean` | `false` | Imposer une correspondance exacte de longueur |
| `delimiters` | `string[]` | `['/', '-']` | Séparateurs autorisés |
| `minDate` | `Date` | — | Date minimale autorisée |
| `maxDate` | `Date` | — | Date maximale autorisée |
| `allowFuture` | `boolean` | — | Autoriser les dates futures |
| `allowPast` | `boolean` | — | Autoriser les dates passées |

**Exemple :**
```typescript
import { dateInputValidator } from '@wlindabla/form_validator/validation/rules/text';

dateInputValidator.validate('25/12/1990', 'birthdate', {
  format: 'DD/MM/YYYY',
  allowFuture: false,
  minDate: new Date('1900-01-01')
});
```

---

### NumberInputValidator

Valide les valeurs numériques avec contraintes min, max, step et regex.

```typescript
import { numberInputValidator } from '@wlindabla/form_validator/validation/rules/text';

numberInputValidator.validate('42', 'age', {
  min: 18,
  max: 120,
  step: 1
});

numberInputValidator.validate('9.99', 'price', {
  min: 0,
  max: 10000,
  step: 0.01
});
```

---

## Validateurs de Choix

### SelectValidator

Valide que les valeurs sélectionnées appartiennent à l'ensemble d'options déclaré.

```typescript
import { selectValidator } from '@wlindabla/form_validator/validation/rules/choice';

// Sélection unique
selectValidator.validate('fr', 'country', {
  optionsChoices: ['fr', 'en', 'bj', 'de']
});

// Sélection multiple
selectValidator.validate(['react', 'vue'], 'frameworks', {
  optionsChoices: ['react', 'vue', 'angular', 'svelte']
});
```

---

### CheckBoxValidator

Valide les groupes de cases à cocher : état requis, nombre min/max de sélections.

```typescript
import { checkboxValidator } from '@wlindabla/form_validator/validation/rules/choice';

// 2 cases cochées sur 5
checkboxValidator.validate(2, 'interests', {
  required: true,
  minAllowed: 1,
  maxAllowed: 3,
  dataChoices: ['sports', 'music'],
  optionsChoicesCheckbox: ['sports', 'music', 'art', 'tech', 'travel']
});
```

---

### RadioValidator

Valide qu'un groupe de boutons radio a une sélection quand requis.

```typescript
import { radioValidator } from '@wlindabla/form_validator/validation/rules/choice';

radioValidator.validate('male', 'gender', { required: true });
radioValidator.validate(undefined, 'gender', { required: true });
// → Erreur : "Please select an option in the 'gender' group."
```

---

## Validateurs de Fichiers

Tous les validateurs de fichiers effectuent les vérifications dans cet ordre : **extension → taille → type MIME → signature binaire (magic bytes) → inspection approfondie du contenu/métadonnées**.

### ImageValidator

Valide les images : extension, taille, type MIME (chargement navigateur), magic bytes, et dimensions en pixels.

Formats supportés : `jpg`, `jpeg`, `png`, `gif`, `bmp`, `webp`, `svg`

```typescript
import { imageValidator } from '@wlindabla/form_validator/validation/rules/file';

const file = inputElement.files[0];

await imageValidator.validate(file, 'avatar', {
  allowedMimeTypeAccept: ['image/jpeg', 'image/png', 'image/webp'],
  maxsizeFile: 2,
  unityMaxSizeFile: 'MiB',
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
  minWidth: 100,
  maxWidth: 2000,
  minHeight: 100,
  maxHeight: 2000
});

if (!imageValidator.formErrorStore.isFieldValid('avatar')) {
  console.log(imageValidator.formErrorStore.getFieldErrors('avatar'));
}
```

---

### VideoValidator

Valide les fichiers vidéo avec vérification de signature binaire, type MIME, et métadonnées (durée, largeur, hauteur) via un élément `<video>` caché.

Formats supportés : `mp4`, `webm`, `mkv`, `avi`, `mov`, `flv`, `wmv`, `3gp`, `ogv`, et plus.

```typescript
import { videoValidator } from '@wlindabla/form_validator/validation/rules/file';

await videoValidator.validate(file, 'presentation', {
  allowedExtensions: ['mp4', 'webm'],
  allowedMimeTypeAccept: ['video/mp4', 'video/webm'],
  maxsizeFile: 50,
  unityMaxSizeFile: 'MiB',
  minWidth: 320,
  maxWidth: 1920,
  minHeight: 240,
  maxHeight: 1080
});
```

---

### PdfValidator

Valide les fichiers PDF : magic bytes (`%PDF` = `25504446`), type MIME, et nombre de pages via `pdfjs-dist`.

**Pipeline de validation :**
1. Extension (`.pdf`)
2. Type MIME (soft check)
3. Signature binaire (`25504446`)
4. Structure PDF via `pdfjs-dist` (nombre de pages > 0)

```typescript
import { pdfValidator } from '@wlindabla/form_validator/validation/rules/file';

await pdfValidator.validate(file, 'contract', {
  allowedExtensions: ['pdf'],
  allowedMimeTypeAccept: ['application/pdf', 'application/x-pdf'],
  maxsizeFile: 10,
  unityMaxSizeFile: 'MiB'
});
```

---

### ExcelValidator

Valide les fichiers Excel (`.xls`/`.xlsx`) : magic bytes (OLE2 ou ZIP), type MIME (vérification douce multi-plateforme), structure du workbook via SheetJS, nombre de feuilles, colonnes requises.

**Note multi-plateforme :** Windows peut rapporter `application/vnd.ms-excel` pour `.xls` ET `.xlsx`. Linux/macOS rapportent parfois `application/octet-stream` pour `.xls`. Les magic bytes sont donc la vérification de format faisant autorité.

**Magic bytes :**
- `d0cf11e0` : OLE2 Compound Document (`.xls`)
- `504b0304` : ZIP local file header (`.xlsx`)

```typescript
import { excelValidator } from '@wlindabla/form_validator/validation/rules/file';

await excelValidator.validate(file, 'importFile', {
  allowedExtensions: ['xlsx', 'xls'],
  maxsizeFile: 5,
  unityMaxSizeFile: 'MiB',
  minSheets: 1,
  maxSheets: 10,
  rejectEmptySheet: true,
  sheetIndex: 0,
  requiredColumns: ['Name', 'Email', 'Phone']
});
```

**Options (`OptionsExcelFile`) :**

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `minSheets` | `number` | `1` | Nombre minimum de feuilles |
| `maxSheets` | `number` | — | Nombre maximum de feuilles |
| `requiredColumns` | `string[]` | `[]` | Colonnes obligatoires dans la feuille cible |
| `rejectEmptySheet` | `boolean` | `true` | Rejeter une feuille sans données |
| `sheetIndex` | `number` | `0` | Index de la feuille cible (0 = première) |

---

### CsvValidator

Valide les fichiers CSV : pré-vérification binaire/BOM, parsing structurel via PapaParse, headers requis, nombre de lignes, validation de type par colonne.

**Types de colonnes supportés :** `'string'`, `'number'`, `'date'`, `'boolean'`, `'email'`

**Note multi-plateforme :** Windows rapporte `text/csv`, macOS `text/csv` ou `text/comma-separated-values`, Linux `text/plain` ou `application/csv`. Le MIME est traité comme un avertissement seulement.

```typescript
import { csvValidator } from '@wlindabla/form_validator/validation/rules/file';

await csvValidator.validate(file, 'dataImport', {
  allowedExtensions: ['csv'],
  maxsizeFile: 5,
  unityMaxSizeFile: 'MiB',
  requiredHeaders: ['Name', 'Email', 'Age'],
  columnTypes: {
    Age: 'number',
    Email: 'email',
    CreatedAt: 'date'
  },
  minRows: 1,
  maxRows: 10000,
  maxRowErrors: 5,
  skipEmptyLines: true
});
```

**Options (`OptionsCsvFile`) :**

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `requiredHeaders` | `string[]` | `[]` | En-têtes obligatoires |
| `columnTypes` | `Record<string, CsvColumnType>` | `{}` | Types attendus par colonne |
| `useFirstLineAsHeaders` | `boolean` | `true` | Première ligne = en-têtes |
| `skipEmptyLines` | `boolean` | `true` | Ignorer les lignes vides |
| `delimiter` | `string` | auto-détecté | Séparateur de colonnes |
| `minRows` | `number` | `1` | Nombre minimum de lignes de données |
| `maxRows` | `number` | — | Nombre maximum de lignes de données |
| `maxRowErrors` | `number` | `2` | Arrêter après N erreurs de ligne |
| `worker` | `boolean` | `false` | Utiliser un Web Worker PapaParse |

---

### MicrosoftWordValidator

Valide les fichiers `.docx` et `.doc` : magic bytes (OLE2/ZIP), structure OOXML (`[Content_Types].xml`, `word/document.xml`), règles de contenu (document vide, nombre de paragraphes, texte requis).

**Pipeline de validation :**

```
1. Extension          .docx / .doc
2. Taille de fichier
3. Type MIME          (avertissement doux — peu fiable selon l'OS)
4. Magic bytes        OLE2 (d0cf11e0) | ZIP/PK (504b0304)
5. .docx uniquement — Intégrité ZIP (JSZip)
6. .docx uniquement — Structure OOXML ([Content_Types].xml présent)
7. .docx uniquement — word/document.xml présent et parseable
8. .docx uniquement — Règles de contenu (doc vide, minParagraphs, …)
9. .docx uniquement — requiredTextFragments
```

> **Note :** Les fichiers `.doc` s'arrêtent à l'étape 4. Le format OLE2 est un format binaire propriétaire qui ne peut pas être inspecté de manière fiable dans le navigateur.

```typescript
import { microsoftWordValidator } from '@wlindabla/form_validator/validation/rules/file';

await microsoftWordValidator.validate(file, 'report', {
  allowedExtensions: ['docx', 'doc'],
  maxsizeFile: 10,
  unityMaxSizeFile: 'MiB',
  rejectEmptyDocument: true,
  minParagraphs: 3,
  allowLegacyDoc: true,
  requiredTextFragments: ['TERMES ET CONDITIONS', 'Signature']
});
```

**Options (`OptionsWordFile`) :**

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `rejectEmptyDocument` | `boolean` | `true` | Rejeter un document sans texte |
| `minParagraphs` | `number` | — | Nombre minimum de paragraphes |
| `allowLegacyDoc` | `boolean` | `true` | Autoriser les fichiers `.doc` (OLE2) |
| `requiredTextFragments` | `string[]` | `[]` | Fragments de texte obligatoires dans le document |

---

### OdtValidator

Valide les fichiers OpenDocument Format (`.odt`, `.ods`, `.odp`, `.odg`, `.rtf`, etc.) : intégrité ZIP, entrée `mimetype` interne, `content.xml`, règles de contenu.

**Formats supportés :**

| Extension | Format |
|-----------|--------|
| `.odt` | OpenDocument Text (LibreOffice Writer) |
| `.ott` | Modèle ODT |
| `.ods` | OpenDocument Spreadsheet (LibreOffice Calc) |
| `.ots` | Modèle ODS |
| `.odp` | OpenDocument Presentation (LibreOffice Impress) |
| `.otp` | Modèle ODP |
| `.odg` | OpenDocument Drawing (LibreOffice Draw) |
| `.rtf` | Rich Text Format |

**Pipeline de validation ODF :**

```
1. Extension
2. Taille de fichier
3. Type MIME (avertissement doux)
4. Magic bytes : ODF → 504b0304 (ZIP) | RTF → 7b5c7274 ({\rt)
5. Intégrité ZIP (JSZip)
6. Entrée "mimetype" interne — auto-identification ODF
7. "mimetype" correspond à l'extension déclarée
8. content.xml présent et XML valide
9. Règles de contenu (doc vide, minParagraphs, requiredFragments)
```

> **Insight clé :** Chaque fichier ODF stocke son type MIME exact comme entrée NON COMPRESSÉE nommée `mimetype` au début de l'archive ZIP. C'est l'identifiant de format le plus fiable — plus sûr que le `file.type` rapporté par l'OS ou même l'extension.

```typescript
import { odtValidator } from '@wlindabla/form_validator/validation/rules/file';

await odtValidator.validate(file, 'document', {
  allowedExtensions: ['odt', 'ods', 'rtf'],
  maxsizeFile: 10,
  unityMaxSizeFile: 'MiB',
  rejectEmptyDocument: true,
  minParagraphs: 2,
  allowRtf: true,
  requiredTextFragments: ['Introduction']
});
```

**Options (`OptionsOdfFile`) :**

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `rejectEmptyDocument` | `boolean` | `true` | Rejeter un document sans texte |
| `minParagraphs` | `number` | — | Nombre minimum de paragraphes |
| `allowRtf` | `boolean` | `true` | Autoriser les fichiers `.rtf` |
| `requiredTextFragments` | `string[]` | `[]` | Fragments de texte obligatoires |

---

## Routeur Central : FormInputValidator

`FormInputValidator` est la **façade** qui dispatche tout input vers le validateur spécialisé correct. Utilisez-le quand vous voulez gérer tous les types uniformément.

```typescript
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';

// Texte
await formInputValidator.allTypesValidator('Alice', 'username', 'text', {
  minLength: 3, maxLength: 30, requiredInput: true
});

// Email
await formInputValidator.allTypesValidator('alice@example.com', 'email', 'email', {
  requiredInput: true
});

// Mot de passe
await formInputValidator.allTypesValidator('Secur3P@ss!', 'password', 'password', {
  minLength: 10, upperCaseAllow: true, symbolAllow: true
});

// Fichier image
await formInputValidator.allTypesValidator(file, 'photo', 'image', {
  maxsizeFile: 2, unityMaxSizeFile: 'MiB'
});

// Récupérer l'état
const v = formInputValidator.getValidator('username');
console.log(v?.formErrorStore.isFieldValid('username'));
console.log(v?.formErrorStore.getFieldErrors('username'));
```

**Valeurs `type_field` supportées :**

| Type | Nature de l'input |
|------|-------------------|
| `'text'` | Champ texte |
| `'email'` | Champ email |
| `'password'` | Champ mot de passe |
| `'tel'` | Numéro de téléphone |
| `'url'` | Champ URL |
| `'date'` | Champ date |
| `'textarea'` | Zone de texte |
| `'number'` | Champ numérique |
| `'select'` | Liste déroulante |
| `'checkbox'` | Groupe de cases à cocher |
| `'radio'` | Groupe de boutons radio |
| `'image'` | Fichier image |
| `'video'` | Fichier vidéo |
| `'pdf'` | Fichier PDF |
| `'excel'` | Fichier Excel |
| `'csv'` | Fichier CSV |
| `'word'` | Document Word |
| `'odf'` | Document ODF / RTF |
| `'document'` | Document auto-détecté |

> **Note sur le type `'document'` :** Quand vous utilisez le type `'document'` via `FieldInputController`, le système utilise `DocumentTypeResolver` pour détecter automatiquement le type réel de chaque fichier (pdf, excel, csv, word, odf) par son extension et applique le validateur approprié. Cela permet de gérer des champs acceptant plusieurs types de documents en un seul input.

---

## Orchestrateur : FormValidateController

`FormValidateController` encapsule un élément `<form>` entier et gère toutes les validations de champs, le groupement d'événements, et l'adaptateur de cache optionnel.

**Changements importants par rapport à la version précédente :**
- Plus de dépendance à jQuery — utilise uniquement l'API DOM native.
- Nouvelle méthode `isFormValid()` pour valider le formulaire entier en une fois.
- La propriété `form` retourne maintenant un `HTMLFormElement` natif (non plus un objet jQuery).
- `addErrorMessageChildrenForm` accepte maintenant un `HTMLElement` natif.
- Les attributs d'événement sont maintenant `data-event-validate-blur`, `data-event-validate-input`, etc.

```typescript
import { FormValidateController } from '@wlindabla/form_validator';
import { LocalStorageCacheAdapter } from '@wlindabla/form_validator/cache';

const controller = new FormValidateController(
  '.registration-form',
  new LocalStorageCacheAdapter() // optionnel : cache des options de validation
);

// IDs des champs groupés par événement déclencheur
console.log(controller.idChildrenUsingEventBlur);      // data-event-validate-blur
console.log(controller.idChildrenUsingEventInput);     // data-event-validate-input
console.log(controller.idChildrenUsingEventChange);    // data-event-validate-change
console.log(controller.idChildrenUsingEventDragenter); // data-event-validate-dragenter
console.log(controller.idChildrenUsingEventFocus);     // data-event-validate-focus

// Valider tous les champs (ex. au submit)
const isValid = await controller.isFormValid();

// Valider un seul champ
await controller.validateChildrenForm(inputElement);

// Afficher les erreurs d'un champ
controller.addErrorMessageChildrenForm(
  targetElement,
  ['Message d\'erreur'],
  'container-div-error-message' // className optionnel du conteneur d'erreur
);

// Effacer l'état d'erreur d'un champ
controller.clearErrorDataChildren(inputElement);
```

---

## Store d'Erreurs : FormErrorStore

Le `FormErrorStore` est un **singleton** qui agit comme source unique de vérité pour tous les états de validation. Tous les validateurs y lisent et écrivent.

```typescript
import { formErrorStore } from '@wlindabla/form_validator/validation';

// Vérifier la validité du formulaire
formErrorStore.isFormValid(); // false si un champ a des erreurs

// Vérifier un champ spécifique
formErrorStore.isFieldValid('email');

// Obtenir les erreurs d'un champ
formErrorStore.getFieldErrors('email'); // string[]

// Définir manuellement un champ comme invalide
formErrorStore.setFieldValid('email', false);
formErrorStore.addFieldError('email', 'Format invalide.');

// Effacer l'état d'un champ
formErrorStore.clearFieldState('email');

// Supprimer une erreur spécifique
formErrorStore.removeFieldError('email', 'Format invalide.');
```

---

## Événements de Validation

`FieldInputController` déclenche deux événements personnalisés sur l'élément `<form>` parent après chaque validation de champ :

| Nom d'événement | Quand déclenché |
|-----------------|-----------------|
| `field:validation:failed` | Validation échouée — `event.detail.message` contient le tableau d'erreurs |
| `field:validation:success` | Validation réussie |

**Structure du détail d'événement (`FieldValidationEventData`) :**

| Propriété | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Attribut `id` du champ |
| `name` | `string` | Attribut `name` du champ |
| `value` | `DataInput` | Valeur courante du champ |
| `formParentName` | `string` | Attribut `name` du formulaire parent |
| `message` | `string[]` | Messages d'erreur (en cas d'échec) |
| `targetChildrenForm` | `HTMLElement` | L'élément champ du DOM |

**Utilisation :**
```typescript
const form = document.querySelector('form[name="registrationForm"]')!;

form.addEventListener('field:validation:failed', (e: CustomEvent) => {
  const { name, message, targetChildrenForm } = e.detail;

  // Afficher les erreurs via le contrôleur
  controller.addErrorMessageChildrenForm(
    targetChildrenForm,
    message,
    'container-div-error-message'
  );

  targetChildrenForm.classList.add('is-invalid');
});

form.addEventListener('field:validation:success', (e: CustomEvent) => {
  const { targetChildrenForm } = e.detail;
  targetChildrenForm.classList.remove('is-invalid');
  targetChildrenForm.classList.add('is-valid');
});
```

---

## Cache Adapter

Le `LocalStorageCacheAdapter` met en cache les options de validation résolues dans `localStorage`, indexées par nom de formulaire + nom de champ. Cela évite de recalculer les options à partir des attributs DOM à chaque appel de validation.

```typescript
import { FormValidateController } from '@wlindabla/form_validator';
import { LocalStorageCacheAdapter } from '@wlindabla/form_validator/cache';

const controller = new FormValidateController(
  '.my-form',
  new LocalStorageCacheAdapter()
);
```

Pour implémenter un adaptateur personnalisé (ex. IndexedDB, session storage) :

```typescript
import type { FieldOptionsValidateCacheAdapterInterface } from '@wlindabla/form_validator/validation/core/adapter';
import type { OptionsValidate } from '@wlindabla/form_validator/validation/core/router';

class SessionStorageAdapter implements FieldOptionsValidateCacheAdapterInterface {
  async getItem(key: string): Promise<OptionsValidate | undefined> {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  }
  async setItem(key: string, options: OptionsValidate): Promise<void> {
    sessionStorage.setItem(key, JSON.stringify(options));
  }
}
```

---

## Validation par Attributs HTML

`FieldInputController` peut inférer toutes les options de validation directement depuis les attributs HTML `data-*`, vous permettant de configurer la validation entièrement dans votre template sans écrire de JS.

**Attributs principaux :**

| Attribut | Rôle |
|----------|------|
| `type` | Type d'input (`text`, `email`, `password`, `url`, `date`, `tel`, `number`, `file`) |
| `data-type` | Remplacement pour types personnalisés (`fqdn`, `textarea`) |
| `data-media-type` | Pour `type="file"` : `image`, `video`, `document` |
| `required` / `data-required` | Champ obligatoire |
| `data-event-validate` | Événement déclenchant la validation (`blur`, `input`, `change`, `focus`) |
| `data-event-validate-blur` | Enregistrer le champ dans le groupe blur |
| `data-event-validate-input` | Enregistrer le champ dans le groupe input |
| `data-event-validate-change` | Enregistrer le champ dans le groupe change |
| `data-event-validate-dragenter` | Enregistrer le champ dans le groupe dragenter (fichiers) |
| `data-event-clear-error` | Événement qui efface les erreurs (défaut : `change`) |
| `data-error-message-input` | Message d'erreur personnalisé |
| `data-min-length` / `data-max-length` | Contraintes de longueur |
| `minLength` / `maxLength` | Contraintes de longueur natives HTML |
| `pattern` / `data-flag-pattern` | Pattern regex + flags |
| `data-match-regex` | `true`/`false` — correspondre ou rejeter le pattern |
| `data-eg-await` | Exemple de valeur affiché dans l'erreur |
| `data-escapestrip-html-and-php-tags` | Supprimer les tags avant validation |
| `data-default-country` | Code pays pour validation téléphone (ex. `BJ`, `FR`) |
| `data-format-date` | Format de date (ex. `DD/MM/YYYY`) |
| `data-allow-future` / `data-allow-past` | Restriction de plage de date |
| `data-min-date` / `data-max-date` | Limites de date min/max |
| `data-extentions` | Extensions de fichier autorisées (séparées par virgule) |
| `data-allowed-mime-type-accept` | Types MIME autorisés (séparés par virgule) |
| `data-maxsize-file` | Taille max du fichier (numérique) |
| `data-unity-max-size-file` | Unité de taille (`B`, `KiB`, `MiB`, `GiB`) |
| `data-min-width` / `data-max-width` | Contraintes de dimensions image/vidéo |
| `data-min-height` / `data-max-height` | Contraintes de dimensions image/vidéo |
| `data-required-columns` | Colonnes requises pour Excel (séparées par virgule) |
| `data-required-headers` | Headers requis pour CSV (séparés par virgule) |
| `data-column-types` | JSON de types de colonnes CSV ex. `{"Age":"number","Email":"email"}` |
| `data-reject-empty-sheet` | Rejeter feuille Excel vide (défaut: `true`) |
| `data-min-sheets` | Nombre minimum de feuilles Excel |
| `data-required-text-fragments` | Fragments de texte requis dans Word/ODF (JSON array ou CSV) |
| `data-reject-empty-document` | Rejeter document Word/ODF vide (défaut: `true`) |
| `data-min-paragraphs` | Nombre minimum de paragraphes Word/ODF |
| `data-allow-rtf` | Autoriser les fichiers RTF dans OdtValidator (défaut: `true`) |
| `data-allow-legacy-doc` | Autoriser les fichiers `.doc` dans MicrosoftWordValidator (défaut: `true`) |

**Exemple de formulaire HTML complet avec validation par attributs :**

```html
<form name="contactForm" class="form-validate" novalidate>

  <!-- Champ texte -->
  <input
    id="fullName"
    name="fullName"
    type="text"
    required
    minLength="2"
    maxLength="100"
    data-event-validate="blur"
    data-event-validate-blur="blur"
    data-error-message-input="Veuillez entrer votre nom complet."
    data-eg-await="Jean Dupont"
  />

  <!-- Champ email -->
  <input
    id="email"
    name="email"
    type="email"
    required
    data-event-validate="blur"
    data-event-validate-blur="blur"
    data-allow-display-name="false"
    data-host-blacklist="tempmail.com,guerrillamail.com"
  />

  <!-- Champ téléphone -->
  <input
    id="phone"
    name="phone"
    type="tel"
    required
    data-default-country="BJ"
    data-eg-await="+229 01 67 25 18 86"
    data-event-validate="blur"
    data-event-validate-blur="blur"
  />

  <!-- Mot de passe -->
  <input
    id="password"
    name="password"
    type="password"
    required
    data-upper-case-allow="true"
    data-number-allow="true"
    data-symbol-allow="true"
    data-min-length="10"
    data-enable-scoring="true"
    data-event-validate="input"
    data-event-validate-input="input"
  />

  <!-- Upload image -->
  <input
    id="avatar"
    name="avatar"
    type="file"
    data-media-type="image"
    data-extentions="jpg,jpeg,png,webp"
    data-maxsize-file="2"
    data-unity-max-size-file="MiB"
    data-max-width="2000"
    data-max-height="2000"
    data-event-validate="change"
    data-event-validate-change="change"
    data-event-validate-dragenter="dragenter"
  />

  <!-- Upload document (PDF, Word, Excel, CSV auto-détectés) -->
  <input
    id="document"
    name="document"
    type="file"
    data-media-type="document"
    data-maxsize-file="10"
    data-unity-max-size-file="MiB"
    data-reject-empty-document="true"
    data-event-validate="change"
    data-event-validate-change="change"
  />

  <!-- Upload Excel avec options avancées -->
  <input
    id="importFile"
    name="importFile"
    type="file"
    data-media-type="document"
    data-extentions="xlsx,xls"
    data-maxsize-file="5"
    data-required-columns="Name,Email,Phone"
    data-reject-empty-sheet="true"
    data-event-validate="change"
    data-event-validate-change="change"
  />

  <!-- Upload CSV avec validation de colonnes -->
  <input
    id="csvData"
    name="csvData"
    type="file"
    data-media-type="document"
    data-extentions="csv"
    data-maxsize-file="5"
    data-required-headers="Name,Email,Age"
    data-column-types='{"Age":"number","Email":"email"}'
    data-max-row-errors="5"
    data-event-validate="change"
    data-event-validate-change="change"
  />

  <button type="submit">Envoyer</button>
</form>
```

---

## Intégration par Framework

### Vanilla JS / TypeScript

```typescript
import { FormValidateController } from '@wlindabla/form_validator';
import {
  FieldValidationFailed,
  FieldValidationSuccess
} from '@wlindabla/form_validator';

document.addEventListener('DOMContentLoaded', () => {
  const formExist = document.querySelector('form.form-validate');
  if (!formExist) return;

  const controller = new FormValidateController('.form-validate');
  const form = controller.form; // HTMLFormElement natif

  // Attacher les événements blur
  controller.idChildrenUsingEventBlur.forEach(id => {
    document.getElementById(id)?.addEventListener('blur', async (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.type !== 'file') {
        await controller.validateChildrenForm(target);
      }
    });
  });

  // Attacher les événements input (nettoyage erreurs)
  controller.idChildrenUsingEventInput.forEach(id => {
    document.getElementById(id)?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.type !== 'file') {
        controller.clearErrorDataChildren(target);
      }
    });
  });

  // Attacher les événements change (fichiers, selects, checkboxes)
  controller.idChildrenUsingEventChange.forEach(id => {
    document.getElementById(id)?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'file') {
        await controller.validateChildrenForm(target);
      }
    });
  });

  // Dragenter sur les fichiers (nettoyage erreurs)
  controller.idChildrenUsingEventDragenter.forEach(id => {
    document.getElementById(id)?.addEventListener('dragenter', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'file') {
        controller.clearErrorDataChildren(target);
      }
    });
  });

  // Écouter les événements de validation
  form.addEventListener(FieldValidationFailed, (e: Event) => {
    const { targetChildrenForm, message } = (e as CustomEvent).detail;
    controller.addErrorMessageChildrenForm(
      targetChildrenForm,
      message,
      'container-div-error-message'
    );
    targetChildrenForm.classList.add('is-invalid');
  });

  form.addEventListener(FieldValidationSuccess, (e: Event) => {
    const { targetChildrenForm } = (e as CustomEvent).detail;
    targetChildrenForm.classList.remove('is-invalid');
    targetChildrenForm.classList.add('is-valid');
  });

  // Soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isValid = await controller.isFormValid();
    if (isValid) {
      (e.target as HTMLFormElement).submit();
    }
  });
});
```

---

### React / Next.js

```tsx
import React, { useRef, useState } from 'react';
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';

interface FormErrors {
  email?: string;
  password?: string;
  phone?: string;
}

export function LoginForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const validateField = async (
    fieldName: keyof FormErrors,
    value: string,
    type: string,
    options: object
  ) => {
    await formInputValidator.allTypesValidator(value, fieldName, type as any, options as any);
    const v = formInputValidator.getValidator(fieldName);
    const fieldErrors = v?.formErrorStore.getFieldErrors(fieldName) ?? [];
    setErrors(prev => ({ ...prev, [fieldName]: fieldErrors[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value ?? '';
    const password = passwordRef.current?.value ?? '';
    const phone = phoneRef.current?.value ?? '';

    await validateField('email', email, 'email', { requiredInput: true });
    await validateField('password', password, 'password', {
      minLength: 8, upperCaseAllow: true
    });
    await validateField('phone', phone, 'tel', {
      defaultCountry: 'BJ', requiredInput: true
    });

    const allValid = ['email', 'password', 'phone'].every(f => {
      const v = formInputValidator.getValidator(f);
      return v?.formErrorStore.isFieldValid(f) ?? true;
    });

    if (allValid) {
      console.log('Formulaire valide, envoi en cours...');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <input
          ref={emailRef}
          type="email"
          name="email"
          placeholder="Email"
          onBlur={async (e) => {
            await validateField('email', e.target.value, 'email', { requiredInput: true });
          }}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          ref={passwordRef}
          type="password"
          name="password"
          placeholder="Mot de passe"
          onInput={async (e) => {
            const val = (e.target as HTMLInputElement).value;
            await validateField('password', val, 'password', {
              minLength: 8, upperCaseAllow: true, enableScoring: true
            });
          }}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <input
          ref={phoneRef}
          type="tel"
          name="phone"
          placeholder="+229 01 67 25 18 86"
          onBlur={async (e) => {
            await validateField('phone', e.target.value, 'tel', {
              defaultCountry: 'BJ', requiredInput: true
            });
          }}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <button type="submit">Se connecter</button>
    </form>
  );
}
```

**Upload de fichier en React :**
```tsx
import { imageValidator } from '@wlindabla/form_validator/validation/rules/file';

function AvatarUpload() {
  const [error, setError] = useState<string>('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await imageValidator.validate(file, 'avatar', {
      allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
      allowedMimeTypeAccept: ['image/jpeg', 'image/png', 'image/webp'],
      maxsizeFile: 2,
      unityMaxSizeFile: 'MiB',
      maxWidth: 1500,
      maxHeight: 1500
    });

    const errors = imageValidator.formErrorStore.getFieldErrors('avatar');
    setError(errors[0] ?? '');
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

---

### Angular

```typescript
// validation.service.ts
import { Injectable } from '@angular/core';
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';
import type { OptionsValidate } from '@wlindabla/form_validator/validation/core/router';

@Injectable({ providedIn: 'root' })
export class FormValidationService {
  async validate(
    value: any,
    fieldName: string,
    type: string,
    options: OptionsValidate
  ): Promise<string[]> {
    await formInputValidator.allTypesValidator(value, fieldName, type as any, options);
    const v = formInputValidator.getValidator(fieldName);
    return v?.formErrorStore.getFieldErrors(fieldName) ?? [];
  }

  isValid(fieldName: string): boolean {
    const v = formInputValidator.getValidator(fieldName);
    return v?.formErrorStore.isFieldValid(fieldName) ?? true;
  }
}
```

```typescript
// register.component.ts
import { Component } from '@angular/core';
import { FormValidationService } from './validation.service';

@Component({
  selector: 'app-register',
  template: `
    <form (ngSubmit)="onSubmit()" novalidate>
      <div>
        <input
          type="email"
          name="email"
          [(ngModel)]="email"
          (blur)="validate('email', email, 'email', { requiredInput: true })"
        />
        <span *ngIf="errors['email']" class="error">{{ errors['email'][0] }}</span>
      </div>
      <div>
        <input
          type="password"
          name="password"
          [(ngModel)]="password"
          (input)="validate('password', password, 'password', { minLength: 8 })"
        />
        <span *ngIf="errors['password']" class="error">{{ errors['password'][0] }}</span>
      </div>
      <button type="submit">S'inscrire</button>
    </form>
  `
})
export class RegisterComponent {
  email = '';
  password = '';
  errors: Record<string, string[]> = {};

  constructor(private validationService: FormValidationService) {}

  async validate(field: string, value: any, type: string, options: any) {
    this.errors[field] = await this.validationService.validate(value, field, type, options);
  }

  async onSubmit() {
    await this.validate('email', this.email, 'email', { requiredInput: true });
    await this.validate('password', this.password, 'password', {
      minLength: 8, upperCaseAllow: true, symbolAllow: true
    });
    const valid = ['email', 'password'].every(f => !this.errors[f]?.length);
    if (valid) console.log('Envoi en cours...');
  }
}
```

---

### Vue.js

```vue
<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <div>
      <input
        v-model="form.email"
        type="email"
        name="email"
        @blur="validateField('email', form.email, 'email', { requiredInput: true })"
      />
      <p v-if="errors.email" class="error">{{ errors.email }}</p>
    </div>

    <div>
      <input
        v-model="form.password"
        type="password"
        name="password"
        @input="validateField('password', form.password, 'password', { minLength: 8 })"
      />
      <p v-if="errors.password" class="error">{{ errors.password }}</p>
    </div>

    <div>
      <input
        type="file"
        accept="image/*"
        @change="handleFileChange"
      />
      <p v-if="errors.avatar" class="error">{{ errors.avatar }}</p>
    </div>

    <button type="submit">Envoyer</button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { formInputValidator } from '@wlindabla/form_validator/validation/core/router';
import { imageValidator } from '@wlindabla/form_validator/validation/rules/file';

const form = reactive({ email: '', password: '' });
const errors = reactive<Record<string, string>>({});

async function validateField(name: string, value: any, type: string, options: any) {
  await formInputValidator.allTypesValidator(value, name, type, options);
  const v = formInputValidator.getValidator(name);
  const fieldErrors = v?.formErrorStore.getFieldErrors(name) ?? [];
  errors[name] = fieldErrors[0] ?? '';
}

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  await imageValidator.validate(file, 'avatar', {
    maxsizeFile: 2, unityMaxSizeFile: 'MiB',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp']
  });
  const fieldErrors = imageValidator.formErrorStore.getFieldErrors('avatar');
  errors['avatar'] = fieldErrors[0] ?? '';
}

async function handleSubmit() {
  await validateField('email', form.email, 'email', { requiredInput: true });
  await validateField('password', form.password, 'password', { minLength: 8 });

  const isValid = ['email', 'password', 'avatar'].every(f => !errors[f]);
  if (isValid) console.log('Envoi en cours...');
}
</script>
```

---

### jQuery

```javascript
import {
  FormValidateController,
  addHashToIds,
  FieldValidationFailed,
  FieldValidationSuccess
} from '@wlindabla/form_validator';

window.addEventListener('DOMContentLoaded', () => {
  const formExist = document.querySelector('form.form-validate');
  if (formExist === null) return;

  const form_validate = new FormValidateController('.form-validate');
  const __form = $(form_validate.form); // Wrap le HTMLFormElement natif avec jQuery

  const idsBlur = addHashToIds(form_validate.idChildrenUsingEventBlur).join(',');
  const idsInput = addHashToIds(form_validate.idChildrenUsingEventInput).join(',');
  const idsChange = addHashToIds(form_validate.idChildrenUsingEventChange).join(',');
  const idsDragenter = addHashToIds(form_validate.idChildrenUsingEventDragenter).join(',');

  // Validation au blur (champs texte, email, tel, etc.)
  __form.on('blur', idsBlur, async (event) => {
    const target = event.target;
    if (
      (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
      && target.type !== 'file'
    ) {
      await form_validate.validateChildrenForm(target);
    }
  });

  // Événement de validation échouée → afficher les erreurs
  __form.on(FieldValidationFailed, (event) => {
    const data = event.originalEvent.detail;
    form_validate.addErrorMessageChildrenForm(
      jQuery(data.targetChildrenForm),
      data.message,
      'container-div-error-message'
    );
  });

  // Événement de validation réussie → nettoyer les erreurs
  __form.on(FieldValidationSuccess, (event) => {
    const data = event.originalEvent.detail;
    jQuery(data.targetChildrenForm)
      .removeClass('is-invalid')
      .addClass('is-valid');
  });

  // Input → nettoyage des erreurs en temps réel
  __form.on('input', idsInput, (event) => {
    const target = event.target;
    if (
      (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
      && target.type !== 'file'
    ) {
      form_validate.clearErrorDataChildren(target);
    }
  });

  // Change → validation des fichiers, selects, checkboxes
  __form.on('change', idsChange, async (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === 'file') {
      await form_validate.validateChildrenForm(target);
    }
  });

  // Dragenter → nettoyage erreurs pour les fichiers
  __form.on('dragenter', idsDragenter, (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === 'file') {
      form_validate.clearErrorDataChildren(target);
    }
  });

  // Soumission du formulaire
  __form.on('submit', async (e) => {
    e.preventDefault();
    const isValid = await form_validate.isFormValid();
    if (isValid) {
      __form.off('submit').submit();
    }
  });
});
```

---

### Symfony + Twig

Utilisez les attributs HTML `data-*` pour configurer la validation, puis initialisez le contrôleur dans votre point d'entrée JS principal.

**Template Twig :**
```twig
{# templates/registration/register.html.twig #}
{{ form_start(registrationForm, {
    'attr': {
        'name': 'registrationForm',
        'class': 'form-validate',
        'novalidate': true
    }
}) }}

{{ form_row(registrationForm.email, {
    'attr': {
        'data-event-validate': 'blur',
        'data-event-validate-blur': 'blur',
        'data-host-blacklist': 'tempmail.com,guerrillamail.com',
        'data-error-message-input': 'Veuillez entrer une adresse email valide.'
    }
}) }}

{{ form_row(registrationForm.password.first, {
    'attr': {
        'data-event-validate': 'input',
        'data-event-validate-input': 'input',
        'data-upper-case-allow': 'true',
        'data-number-allow': 'true',
        'data-symbol-allow': 'true',
        'data-min-length': '10',
        'data-enable-scoring': 'true'
    }
}) }}

{{ form_row(registrationForm.avatar, {
    'attr': {
        'data-media-type': 'image',
        'data-extentions': 'jpg,jpeg,png,webp',
        'data-maxsize-file': '2',
        'data-unity-max-size-file': 'MiB',
        'data-max-width': '2000',
        'data-max-height': '2000',
        'data-event-validate': 'change',
        'data-event-validate-change': 'change',
        'data-event-validate-dragenter': 'dragenter'
    }
}) }}

{{ form_row(registrationForm.document, {
    'attr': {
        'data-media-type': 'document',
        'data-maxsize-file': '10',
        'data-unity-max-size-file': 'MiB',
        'data-reject-empty-document': 'true',
        'data-event-validate': 'change',
        'data-event-validate-change': 'change'
    }
}) }}

<button type="submit" class="btn btn-primary">S'inscrire</button>
{{ form_end(registrationForm) }}
```

**assets/app.js :**
```javascript
import {
  FormValidateController,
  addHashToIds,
  FieldValidationFailed,
  FieldValidationSuccess
} from '@wlindabla/form_validator';

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('form.form-validate')) return;

  const controller = new FormValidateController('.form-validate');
  const form = controller.form;

  const idsBlur = addHashToIds(controller.idChildrenUsingEventBlur).join(',');
  const idsInput = addHashToIds(controller.idChildrenUsingEventInput).join(',');
  const idsChange = addHashToIds(controller.idChildrenUsingEventChange).join(',');
  const idsDragenter = addHashToIds(controller.idChildrenUsingEventDragenter).join(',');

  // Blur validation
  controller.idChildrenUsingEventBlur.forEach(id => {
    document.getElementById(id)?.addEventListener('blur', async (e) => {
      const target = e.target;
      if (
        (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
        && target.type !== 'file'
      ) {
        await controller.validateChildrenForm(target);
      }
    });
  });

  // Input → nettoyage
  controller.idChildrenUsingEventInput.forEach(id => {
    document.getElementById(id)?.addEventListener('input', (e) => {
      const target = e.target;
      if (
        (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
        && target.type !== 'file'
      ) {
        controller.clearErrorDataChildren(target);
      }
    });
  });

  // Change → fichiers
  controller.idChildrenUsingEventChange.forEach(id => {
    document.getElementById(id)?.addEventListener('change', async (e) => {
      const target = e.target;
      if (target instanceof HTMLInputElement && target.type === 'file') {
        await controller.validateChildrenForm(target);
      }
    });
  });

  // Dragenter → nettoyage fichiers
  controller.idChildrenUsingEventDragenter.forEach(id => {
    document.getElementById(id)?.addEventListener('dragenter', (e) => {
      const target = e.target;
      if (target instanceof HTMLInputElement && target.type === 'file') {
        controller.clearErrorDataChildren(target);
      }
    });
  });

  // Validation failed → classes Bootstrap
  form.addEventListener(FieldValidationFailed, (e) => {
    const { targetChildrenForm, message } = e.detail;
    targetChildrenForm.classList.add('is-invalid');
    controller.addErrorMessageChildrenForm(
      targetChildrenForm,
      message,
      'invalid-feedback'
    );
  });

  // Validation success → classes Bootstrap
  form.addEventListener(FieldValidationSuccess, (e) => {
    const { targetChildrenForm } = e.detail;
    targetChildrenForm.classList.remove('is-invalid');
    targetChildrenForm.classList.add('is-valid');
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (await controller.isFormValid()) {
      e.target.submit();
    }
  });
});
```

---

## Référence API

### Table des exports

| Chemin d'import | Exports |
|-----------------|---------|
| `@wlindabla/form_validator` | `FormValidateController`, `FieldValidationFailed`, `FieldValidationSuccess`, `addHashToIds` |
| `@wlindabla/form_validator/validation/core/router` | `formInputValidator`, `FormInputValidator`, `OptionsValidate` |
| `@wlindabla/form_validator/validation` | `formErrorStore`, `FormErrorStore` |
| `@wlindabla/form_validator/validation/rules/text` | `textInputValidator`, `emailInputValidator`, `passwordInputValidator`, `telInputValidator`, `urlInputValidator`, `fqdnInputValidator`, `dateInputValidator`, `numberInputValidator`, `textareaInputValidator` |
| `@wlindabla/form_validator/validation/rules/choice` | `selectValidator`, `checkboxValidator`, `radioValidator` |
| `@wlindabla/form_validator/validation/rules/file` | `imageValidator`, `videoValidator`, `pdfValidator`, `excelValidator`, `csvValidator`, `microsoftWordValidator`, `odtValidator` |
| `@wlindabla/form_validator/validation/core/adapter` | `FieldOptionsValidateCacheAdapterInterface` |
| `@wlindabla/form_validator/cache` | `LocalStorageCacheAdapter` |

### Méthodes communes à tous les validateurs

| Méthode | Description |
|---------|-------------|
| `formErrorStore.isFieldValid(name)` | Retourne `true` si aucune erreur enregistrée |
| `formErrorStore.getFieldErrors(name)` | Retourne `string[]` des messages d'erreur |
| `formErrorStore.clearFieldState(name)` | Efface tout l'état d'un champ |
| `formErrorStore.isFormValid()` | Retourne `true` si aucun champ n'est invalide |
| `formErrorStore.setFieldValid(name, bool)` | Définit manuellement la validité d'un champ |
| `formErrorStore.addFieldError(name, msg)` | Ajoute manuellement un message d'erreur |
| `formErrorStore.removeFieldError(name, msg)` | Supprime un message d'erreur spécifique |

### FormValidateController — Méthodes publiques

| Méthode | Description |
|---------|-------------|
| `isFormValid(): Promise<boolean>` | Valide tous les champs et retourne `true` si le formulaire est valide |
| `validateChildrenForm(target): Promise<void>` | Valide un seul champ |
| `clearErrorDataChildren(target): void` | Efface l'état d'erreur d'un champ |
| `addErrorMessageChildrenForm(el, messages, className?)` | Affiche les messages d'erreur dans le DOM |
| `autoValidateAllFields(): Promise<void>` | Valide tous les champs sans vérification du résultat global |
| `form` | `HTMLFormElement` natif (non plus jQuery) |
| `childrens` | `HTMLFormChildrenElement[]` natif |
| `idChildrenUsingEventBlur` | IDs des champs avec `data-event-validate-blur` |
| `idChildrenUsingEventInput` | IDs des champs avec `data-event-validate-input` |
| `idChildrenUsingEventChange` | IDs des champs avec `data-event-validate-change` |
| `idChildrenUsingEventDragenter` | IDs des champs avec `data-event-validate-dragenter` |
| `idChildrenUsingEventFocus` | IDs des champs avec `data-event-validate-focus` |

---

## Licence

MIT © [AGBOKOUDJO Franck](https://github.com/Agbokoudjo) — INTERNATIONALES WEB APPS & SERVICES