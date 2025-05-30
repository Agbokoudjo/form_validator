--- 
- This file is part of the project by AGBOKOUDJO Franck.
-
- (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
- Phone: +229 01 67 25 18 86
- LinkedIn:<https://www.linkedin.com/in/internationales-web-services-120520193>
- Company: INTERNATIONALES WEB SERVICES
-
- For more information, please feel free to contact the author.
---

# Sommary

- [Sommary](#sommary)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Installation](#installation)
  - [Dom](#dom)
    - [`getInputPatternRegex`](#getinputpatternregex)
    - [`addErrorMessageFieldDom`](#adderrormessagefielddom)
      - [Parameters](#parameters)
      - [Details](#details)
      - [Example](#example)
    - [`handleErrorsManyForm` Function](#handleerrorsmanyform-function)
  - [**How to Integrate and Use These Functions**](#how-to-integrate-and-use-these-functions)
  - [Validators](#validators)
    - [Input Validation Class Documentation](#input-validation-class-documentation)
      - [Overview](#overview)
  - [Methods and Explanations](#methods-and-explanations)
    - [1. `allTypesValidator` Method](#1-alltypesvalidator-method)
    - [2. `textValidator` Method](#2-textvalidator-method)
    - [3. `emailValidator` Method](#3-emailvalidator-method)
    - [4. `telValidator` Method](#4-telvalidator-method)
    - [5. `passwordValidator` Method](#5-passwordvalidator-method)
    - [6. `urlValidator` Method](#6-urlvalidator-method)
    - [7. `dateValidator` Method](#7-datevalidator-method)
    - [`selectValidator` Method](#selectvalidator-method)
      - [**Parameters**](#parameters-1)
      - [**Functionality**](#functionality)
      - [**Return Value**](#return-value)
      - [Example Usage](#example-usage)
      - [Conclusion](#conclusion)
    - [ImageValidator Class Documentation](#imagevalidator-class-documentation)
      - [Overview](#overview-1)
      - [Supported Formats](#supported-formats)
      - [Methods](#methods)
      - [`getInstance(): ImageValidator`](#getinstance-imagevalidator)
      - [`fileValidator(medias: File | FileList, targetInputname: string = 'photofile', optionsimg: OptionsImage): Promise<this>`](#filevalidatormedias-file--filelist-targetinputname-string--photofile-optionsimg-optionsimage-promisethis)
      - [`signatureFileValidate(file: File, uint8Array?: Uint8Array): Promise<string | null>`](#signaturefilevalidatefile-file-uint8array-uint8array-promisestring--null)
      - [`mimeTypeFileValidate(file: File, allowedMimeTypeAccept?: string[]): Promise<string | null>`](#mimetypefilevalidatefile-file-allowedmimetypeaccept-string-promisestring--null)
      - [`getFileDimensions(file: File): Promise<{ width: number; height: number; }>`](#getfiledimensionsfile-file-promise-width-number-height-number-)
      - [`detecteMimetype(hexasignatureFile: string, uint8Array: Uint8Array): string | null`](#detectemimetypehexasignaturefile-string-uint8array-uint8array-string--null)
      - [`getExtensions(allowedMimeTypes: string[]): string[]`](#getextensionsallowedmimetypes-string-string)
      - [Usage Example](#usage-example)
    - [DocumentValidator Class Documentation](#documentvalidator-class-documentation)
  - [Class Definition](#class-definition)
  - [Properties](#properties)
    - [`mimeTypeMap: Record<string, string[]>`](#mimetypemap-recordstring-string)
    - [`signatureHexadecimalFormatDocument: Record<string, string[]>`](#signaturehexadecimalformatdocument-recordstring-string)
    - [`private static m_instance_doc_validator: DocumentValidator`](#private-static-m_instance_doc_validator-documentvalidator)
    - [`getInstanceDocValidator(): DocumentValidator`](#getinstancedocvalidator-documentvalidator)
    - [`fileValidator(medias: File | FileList, targetInputname: string, optionsdoc: OptionsFile): Promise<this>`](#filevalidatormedias-file--filelist-targetinputname-string-optionsdoc-optionsfile-promisethis)
      - [Returns](#returns)
    - [`validate(file: File, formatValidator: string): Promise<string | null>`](#validatefile-file-formatvalidator-string-promisestring--null)
    - [`readFileAsUint8Array(file: File): Promise<Uint8Array>`](#readfileasuint8arrayfile-file-promiseuint8array)
    - [`validateSignature(file: File, formatValidator: string, uint8Array: Uint8Array): boolean`](#validatesignaturefile-file-formatvalidator-string-uint8array-uint8array-boolean)
      - [Parameters](#parameters-2)
    - [`validatePdf(file: File, uint8Array: Uint8Array): Promise<string | null>`](#validatepdffile-file-uint8array-uint8array-promisestring--null)
    - [`validateExcel(file: File, uint8Array: Uint8Array): Promise<string | null>`](#validateexcelfile-file-uint8array-uint8array-promisestring--null)
    - [`validateText(file: File): Promise<string | null>`](#validatetextfile-file-promisestring--null)
    - [`validateCsv(file: File): Promise<string | null>`](#validatecsvfile-file-promisestring--null)
    - [`detecteMimetype(filename: string, hexasignatureFile: string, uint8Array: Uint8Array): this`](#detectemimetypefilename-string-hexasignaturefile-string-uint8array-uint8array-this)
    - [`getExtensions(allowedMimeTypeAccept: string[]): string[]`](#getextensionsallowedmimetypeaccept-string-string)
  - [VideoValidator Class](#videovalidator-class)
  - [Usage](#usage)
    - [Constructor](#constructor)
      - [`fileValidator(medias, targetInputname, optionsmedia)`](#filevalidatormedias-targetinputname-optionsmedia)
      - [`mimeTypeFileValidate(media, allowedMimeTypeAccept)`](#mimetypefilevalidatemedia-allowedmimetypeaccept)
      - [`metadataValidate(media, targetInputname, optionsvideo)`](#metadatavalidatemedia-targetinputname-optionsvideo)
    - [Example with Detailed Validation](#example-with-detailed-validation)
    - [Error Handling](#error-handling)
    - [Import Example](#import-example)
    - [`FormChildrenTypeNoFileValidate` Class Documentation](#formchildrentypenofilevalidate-class-documentation)
  - [`FormChildrenValidateInterface` Interface](#formchildrenvalidateinterface-interface)
    - [`getOptionsValidate(): OptionsValidate`](#getoptionsvalidate-optionsvalidate)
      - [`validate(): Promise<void>`](#validate-promisevoid)
      - [`eventValidate(): EventValidate`](#eventvalidate-eventvalidate)
      - [`eventClearError(): EventValidate`](#eventclearerror-eventvalidate)
      - [`clearErrorField(): void`](#clearerrorfield-void)
  - [`FormChildrenTypeNoFileValidate` Class](#formchildrentypenofilevalidate-class)
    - [Validation Attributes (via HTML Attributes) and Default Values](#validation-attributes-via-html-attributes-and-default-values)
    - [**Attributes for Checkbox/Radio Containers (on the parent element with the group ID)**](#attributes-for-checkboxradio-containers-on-the-parent-element-with-the-group-id)
    - [Implemented Methods](#implemented-methods)
      - [`getOptionsValidate(): OptionsValidateNoTypeFile`](#getoptionsvalidate-optionsvalidatenotypefile)
      - [`protected getFormError(): FormErrorInterface`](#protected-getformerror-formerrorinterface)
      - [`private hasContainerCheckbox(): boolean`](#private-hascontainercheckbox-boolean)
      - [`private hasContainerRadio(): boolean`](#private-hascontainerradio-boolean)
      - [`private getAttrCheckboxContainer(attributeName: string): string | undefined`](#private-getattrcheckboxcontainerattributename-string-string--undefined)
      - [`private getAttrRadioContainer(attributeName: string): string | undefined`](#private-getattrradiocontainerattributename-string-string--undefined)
      - [`private getOptionsValidateTextarea(): OptionsInputField`](#private-getoptionsvalidatetextarea-optionsinputfield)
      - [`private getOptionsValidateUrl(): URLOptions`](#private-getoptionsvalidateurl-urloptions)
      - [`private getOptionsValidateDate(): DateOptions`](#private-getoptionsvalidatedate-dateoptions)
      - [`private getOptionsValidateSelect(): SelectOptions`](#private-getoptionsvalidateselect-selectoptions)
      - [`private getOptionsValidateNumber(): NumberOptions`](#private-getoptionsvalidatenumber-numberoptions)
      - [`private getOptionsValidateSimpleText(): OptionsInputField`](#private-getoptionsvalidatesimpletext-optionsinputfield)
      - [`private getOptionsValidatePassword(): PassworkRuleOptions`](#private-getoptionsvalidatepassword-passworkruleoptions)
      - [`private getOptionsValidateCheckBox(): OptionsCheckbox`](#private-getoptionsvalidatecheckbox-optionscheckbox)
      - [`private getOptionsValidateRadio(): OptionsRadio`](#private-getoptionsvalidateradio-optionsradio)
- [`FormChildrenTypeFileValidate` Class Documentation](#formchildrentypefilevalidate-class-documentation)
  - [Class `FormChildrenTypeFileValidate`](#class-formchildrentypefilevalidate)
    - [Private Helper Methods for Option Derivation](#private-helper-methods-for-option-derivation)
      - [`private getOptionsValidateVideo(): OptionsMediaVideo`](#private-getoptionsvalidatevideo-optionsmediavideo)
      - [`private getOptionsValidateImage(): OptionsImage`](#private-getoptionsvalidateimage-optionsimage)
      - [`private getBaseOptionsValidate(): OptionsFile`](#private-getbaseoptionsvalidate-optionsfile)
  - [`FormValidate` Class Documentation](#formvalidate-class-documentation)
  - [Class `FormValidate`](#class-formvalidate)
    - [Key Internal Attributes](#key-internal-attributes)
    - [Public Methods](#public-methods)
      - [`autoValidateAllFields(): Promise<void>`](#autovalidateallfields-promisevoid)
      - [`validateChildrenForm(target: HTMLFormChildrenElement): Promise<void>`](#validatechildrenformtarget-htmlformchildrenelement-promisevoid)
      - [`buildValidators(): FormChildrenValidateInterface[]`](#buildvalidators-formchildrenvalidateinterface)
      - [`clearErrorDataChildren(): void`](#clearerrordatachildren-void)
    - [Private Helper Method](#private-helper-method)
      - [`private getValidatorInstance(target: HTMLFormChildrenElement): FormChildrenTypeFileValidate | FormChildrenTypeNoFileValidate`](#private-getvalidatorinstancetarget-htmlformchildrenelement-formchildrentypefilevalidate--formchildrentypenofilevalidate)
    - [Public Getters](#public-getters)
      - [`childrens: JQuery<HTMLFormChildrenElement>`](#childrens-jqueryhtmlformchildrenelement)
      - [`idChildrenUsingEventBlur: string[]`](#idchildrenusingeventblur-string)
      - [`idChildrenUsingEventInput: string[]`](#idchildrenusingeventinput-string)
      - [`idChildrenUsingEventChange: string[]`](#idchildrenusingeventchange-string)
      - [`idChildrenUsingEventFocus: string[]`](#idchildrenusingeventfocus-string)
      - [`idChildrens: string[]`](#idchildrens-string)
      - [`form: JQuery<HTMLFormElement>`](#form-jqueryhtmlformelement)
    - [Using the `FormValidate` Class in Practice](#using-the-formvalidate-class-in-practice)
  - [Code Breakdown and Usage](#code-breakdown-and-usage)
  - [How to Set Up Your HTML for `FormValidate`](#how-to-set-up-your-html-for-formvalidate)
- [string function and formatting](#string-function-and-formatting)
  - [FormFormattingEvent Library](#formformattingevent-library)
    - [1. Convert Last Name to Uppercase](#1-convert-last-name-to-uppercase)
    - [2. Capitalize Username](#2-capitalize-username)
    - [3. Format Username Dom](#3-format-username-dom)
  - [Notes](#notes)
  - [License](#license)
  - [Contributing](#contributing)
  - [📖 Description](#-description)
  - [🛠️ Function Usage](#️-function-usage)
    - [📌 Signature](#-signature)
    - [📌 Parameters](#-parameters)
  - [📤 Return Value](#-return-value)
  - [📌 Example Usage](#-example-usage)
    - [🟢 Escaping a Single String](#-escaping-a-single-string)
    - [🟢 Processing an Array of Strings](#-processing-an-array-of-strings)
    - [🟢 Escaping an Object](#-escaping-an-object)
    - [🟢 Keeping HTML Tags but Escaping Special Characters](#-keeping-html-tags-but-escaping-special-characters)
  - [🔥 Error Handling](#-error-handling)
  - [💡 Additional Notes](#-additional-notes)
  - [🛠️ Related Functions](#️-related-functions)
    - [`ucfirst` Function](#ucfirst-function)
    - [`nl2br` Function](#nl2br-function)
    - [`capitalizeString` Function](#capitalizestring-function)
    - [`usernameFormat` Function](#usernameformat-function)
    - [`toBoolean`](#toboolean)
    - [`addHashToIds`](#addhashtoids)
      - [Parameters](#parameters-3)
      - [Returns](#returns-1)
      - [Example](#example-1)
- [`Logger` Class Documentation](#logger-class-documentation)
  - [Class `Logger`](#class-logger)
    - [Core Features:](#core-features)
    - [Properties](#properties-1)
    - [Constructor](#constructor-1)
    - [Public Static Methods](#public-static-methods)
      - [`static getInstance(): Logger`](#static-getinstance-logger)
      - [`static log(...args: any[]): void`](#static-logargs-any-void)
      - [`static warn(...args: any[]): void`](#static-warnargs-any-void)
      - [`static error(...args: any[]): void`](#static-errorargs-any-void)
      - [`static info(...args: any[]): void`](#static-infoargs-any-void)
  - [How to Use the `Logger` Class](#how-to-use-the-logger-class)
    - [1. Configure the Logger (Optional, but Recommended)](#1-configure-the-logger-optional-but-recommended)
    - [2. Use Logging Methods Throughout Your Code](#2-use-logging-methods-throughout-your-code)
- [The Exception](#the-exception)
    - [`AttributeException`](#attributeexception)
- [URL Utility Functions](#url-utility-functions)
  - [Features](#features-1)
    - [`addParamToUrl`](#addparamtourl)
      - [Parameters](#parameters-4)
      - [Return](#return)
      - [Example Usage](#example-usage-1)
    - [`buildUrlFromForm`](#buildurlfromform)
      - [Parameters](#parameters-5)
      - [Return](#return-1)
      - [Example Usage](#example-usage-2)
    - [**httpFetchHandler Function**](#httpfetchhandler-function)
    - [**Parameters**](#parameters-6)
    - [**Return Value**](#return-value-1)
    - [**Function Workflow**](#function-workflow)
    - [**Example Usage**](#example-usage-3)
    - [`mapStatusToResponseType(status: number): 'success' | 'info' | 'warning' | 'error'`](#mapstatustoresponsetypestatus-number-success--info--warning--error)
      - [Parameters:](#parameters-7)
      - [Returns:](#returns-2)
      - [Example usage:](#example-usage-4)
- [`ApiError` Class Documentation](#apierror-class-documentation)
  - [**Class: `ApiError`**](#class-apierror)
    - [**Constructor:**](#constructor-2)
      - [**Parameters:**](#parameters-8)
      - [**Description:**](#description)
      - [**Parameters:**](#parameters-9)
      - [**Returns:**](#returns-3)
      - [**Example Usage:**](#example-usage-5)
      - [**`name`**](#name)
      - [**Description:**](#description-1)
      - [**Returns:**](#returns-4)
      - [**Example Usage:**](#example-usage-6)
      - [**`allViolations`**](#allviolations)
      - [**Description:**](#description-2)
      - [**Returns:**](#returns-5)
      - [**Example Usage:**](#example-usage-7)
  - [**Use Cases**](#use-cases)
    - [**1. Handling Field Validation Errors**](#1-handling-field-validation-errors)
    - [**2. General Error Handling**](#2-general-error-handling)
  - [Overview](#overview-2)
  - [Usage in React](#usage-in-react)
    - [1. **Handling API Errors in React**](#1-handling-api-errors-in-react)
    - [Example Usage in a React Component](#example-usage-in-a-react-component)
    - [How It Works:](#how-it-works)
    - [Key Benefits:](#key-benefits)
  - [**Conclusion**](#conclusion-1)
  - [Chunked file upload management](#chunked-file-upload-management)
  - [`ChunkSizeConfiguration` Interface](#chunksizeconfiguration-interface)
    - [Configuration Properties:](#configuration-properties)
      - [`defaultChunkSizeMo: number`](#defaultchunksizemo-number)
      - [`slowSpeedThresholdMbps: number`](#slowspeedthresholdmbps-number)
      - [`verySlowSpeedChunkSizeMo: number`](#veryslowspeedchunksizemo-number)
      - [`fileSizeThresholds: { maxSizeMo: number; chunkSizeMo: number; }[]`](#filesizethresholds--maxsizemo-number-chunksizemo-number-)
    - [`calculateUploadChunkSize` Function](#calculateuploadchunksize-function)
      - [Parameters:](#parameters-10)
      - [Returns:](#returns-6)
      - [Functionality:](#functionality-1)
      - [Example Usage:](#example-usage-8)
    - [`createChunkFormData` Function](#createchunkformdata-function)
      - [Parameters:](#parameters-11)
      - [Returns:](#returns-7)
      - [Functionality:](#functionality-2)
      - [Example Usage:](#example-usage-9)
    - [`ChunkMediaDetailInterface`](#chunkmediadetailinterface)
      - [Properties:](#properties-2)
- [](#)
- [](#-1)
      - [Constructor:](#constructor-3)
      - [Properties (Getters):](#properties-getters)
      - [Methods:](#methods-1)
      - [Purpose:](#purpose)
    - [Media Upload/Download Events](#media-uploaddownload-events)
      - [`MEDIA_CHUNK_UPLOAD_STARTED`](#media_chunk_upload_started)
      - [`MEDIA_CHUNK_UPLOAD_FAILED`](#media_chunk_upload_failed)
      - [`MEDIA_CHUNK_UPLOAD_STATUS`](#media_chunk_upload_status)
      - [`MEDIA_CHUNK_UPLOAD_SUCCESS`](#media_chunk_upload_success)
      - [`MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE`](#media_chunk_upload_maxretry_expire)
      - [`DOWNLOAD_MEDIA_COMPLETE`](#download_media_complete)
      - [`DOWNLOAD_MEDIA_FAILURE`](#download_media_failure)
      - [`MEDIA_CHUNK_UPLOAD_RESUME`](#media_chunk_upload_resume)
      - [`DOWNLOAD_MEDIA_RESUME`](#download_media_resume)
      - [`MEDIA_METADATA_SAVE_SUCCESS`](#media_metadata_save_success)
    - [`updateProgressBarHTMLNotified` Function](#updateprogressbarhtmlnotified-function)
      - [Parameters:](#parameters-12)
      - [Returns:](#returns-8)
      - [Functionality:](#functionality-3)
      - [Usage Notes:](#usage-notes)
    - [`CustomEventOptions` Interface](#customeventoptions-interface)
      - [Properties:](#properties-3)
    - [`emitEvent` Function](#emitevent-function)
      - [Parameters:](#parameters-13)
      - [Functionality:](#functionality-4)
      - [Example Usage:](#example-usage-10)
  - [Function `uploadedMediaInChunks`](#function-uploadedmediainchunks)
    - [Parameters](#parameters-14)
    - [Backend Expected Data (JSON)](#backend-expected-data-json)
    - [Dispatched Events](#dispatched-events)
  - [Function `uploadedMedia`](#function-uploadedmedia)
    - [Parameters](#parameters-15)
    - [Workflow](#workflow)
    - [Dispatched Event](#dispatched-event)
  - [Class `MediaUploadEventListener`](#class-mediauploadeventlistener)
    - [Inheritance](#inheritance)
    - [Constructor](#constructor-4)
    - [Method `eventMediaListenerAll`](#method-eventmedialistenerall)
    - [Event Handling Methods](#event-handling-methods)
    - [Utility Methods](#utility-methods)
    - [Usage](#usage-1)
  - [Contact Information](#contact-information)
## Introduction

📌 Form Validator

**Form Validator** is a powerful JavaScript/TypeScript library designed to validate various types of fields in HTML forms. It supports input fields such as `text`, `email`, `tel`, `password`, as well as file types like `images`, `PDFs`, `Word documents`, `CSV`, `Excel`, and more. The library offers customizable configurations to suit different validation needs.

---

## Features

✅ **Validation of input fields** (`text`, `email`, `password`, `tel`): Managed by the `FormInputValidator` class.  
✅ **File validation** (`images`, `PDFs`, `Word`, `CSV`, `Excel`): Controlled by `ImageValidator` and `DocumentsValidator`.  
✅ **Custom validation rules**: Allows adding your own validation rules dynamically.  
✅ **Easy integration**: Works seamlessly with `jQuery` and `TypeScript`.  
✅ **Error handling and messages**: Provides clear error messages and custom handlers.  

---

## Installation

You can install `Form Validator`

```bash
yarn add @wlindabla/form_validator
  or 
npm i @wlindabla/form_validator
```

📋 Formulaire HTML

```html
 <div class="form-group text-center">
    <strong class="text-center fw-bolder">Text formatting and Field Data Validation</strong>
     <form class="form" method="post" action="test" name="form_validate" id="form_validate">
      <label for="lastname">Lastname</label><br/>
      <input type="text" 
        class="form-control lastname"
        placeholder="Eg:AGBOKOUDJO" 
        id="lastname" 
        name="lastname"
        event-validate-blur="blur"  
        event-validate-input="input"
        pattern="^[a-zA-ZÀ-ÿ\s]+$"
        required="true"
          escapestrip-html-and-php-tags="true"
          max-length="100"
          min-length="3"
        error-message-input="The content of this field must contain only alphabetical letters  and must not null "
        eg-await="AGBOKOUDJO"
      /><br/>
        <label for="firstname">Firstnames</label><br/>
      <input type="text" class="form-control firstname"
          placeholder="Eg:Franck Empedocle Hounha" 
          id="firstname" 
          name="firstname"
          event-validate-blur="blur"  
          event-validate-input="input"
          pattern="^[a-zA-ZÀ-ÿ\s]+$"
            required="true"
            escapestrip-html-and-php-tags="true"
            max-length="200"
            min-length="3"
          error-message-input="The content of this field must contain only alphabetical letters  and must not null "
          eg-await="Hounha Franck"
      /><br/>
      <label for="username">Fullname</label><br/>
      <input type="text" class="form-control username"
          placeholder="Eg:AGBOKOUDJO Hounha Franck or Hounha Franck AGBOKOUDJO" 
          id="username" 
          name="username"
          position-lastname="right"
          event-validate-blur="blur" 
            event-validate-input="input"
            pattern="^[a-zA-ZÀ-ÿ\s]+$"
            escapestrip-html-and-php-tags="true"
            max-length="200"
            min-length="6"
            required="true"
          error-message-input="The content of this field must contain only alphabetical letters  and must not null "
          eg-await="AGABOKOUDJO Hounha Franck"
      /><br/>
      <hr/><br/>
        <label for="email">Email</label><br/>
      <input type="email" 
          class="email form-control" 
          placeholder="Eg:franckagbokoudjo301@gmail.com" 
          id="email" name="email"
          event-validate-blur="blur"  
          event-validate-input="input"
          required="true"
            escapestrip-html-and-php-tags="false"
            max-length="180"
            min-length="6"
          error-message-input="email is invalid"
          eg-await="franckagbokoudjo301@gmail.com"
          /><br/>
          <label for="tel">Phone:</label>
            <input type="tel" class="tel form-control" 
          placeholder="Eg:+22967251886" 
          id="tel" name="tel"
          event-validate-blur="blur" 
            event-validate-input="input"
            required="true"
            pattern="^([\+]{1})([0-9\s]{1,})+$"
            escapestrip-html-and-php-tags="false"
            max-length="180"
            min-length="6"
            error-message-input="The content of this field must contain only number ,one symbol +,
            of spaces and must not null "
            eg-await="+2290167251886"
      /><br/>
      <label for="message" class="form-label">Message:</label>
      <textarea id="message"
          name="message"
          class="form-control" 
            placeholder="write the message here" 
            rows="10"
            cols="5"
            event-validate-blur="blur"  
            event-validate-input="input"
            pattern="^[a-zA-ZÀ-ÿ0-9\s.,!?'-]+$"
            escapestrip-html-and-php-tags="false"
            max-length="100000"
            min-length="20"
            required
        >
        <br>
      </textarea>
      
      <hr/><br/>
        <label for="password">Password:</label>
      <input type="password" id="password" name="password" event-validate-blur="blur" min-length="8" required upper-case-allow="true" number-allow="true">
      <div class="error-message" id="error-password"></div>
      <br>
       <label for="userType">User Type:</label>
  <select id="userType" name="user_type" event-validate-change="change" required>
    <option value="">-- Please select --</option>
    <option value="admin">Administrator</option>
    <option value="user">Regular User</option>
  </select>
  <div class="error-message" id="error-userType"></div>
  <br>
      <strong class="text-center fw-bolder">File Validation</strong><br/>
      <label for="img">Uploader des images</label><br>
      <input type="file" class="images form-control" multiple 
          id="img" 
          name="images"
          event-validate-blur="blur"  
          event-validate-change="change"
          media-type="image"
      /><br/>
        <label for="pdf">Uploader des documents pdf</label><br/>
      <input type="file" class="pdf form-control" 
          multiple 
            event-validate-blur="blur"  
            event-validate-change="change"
              media-type="document"
          allowed-mime-type-accept="application/pdf, text/csv, text/plain,application/msword,
            application/vnd.openxmlformats-officedocument.wordprocessingml.document,
            application/vnd.oasis.opendocument.text"
          extensions="jpg,jpeg,png,webp"
          id="pdf" name="pdf"/><br/>
            <label for="video">Uploader des medias video</label><br/>
          <input type="file" 
          class="video form-control" 
          multiple 
            event-validate-blur="blur"  
            event-validate-change="change"
            id="video" 
              media-type="video"
              allowed-mime-type-accept="video/x-msvideo, video/x-flv, video/x-ms-wmv,
            video/mp4, video/quicktime, video/x-matroska,
            video/webm, video/3gpp, video/3gpp2, video/x-m4v,
            video/mpeg, video/mp2t, video/ogg, video/x-ms-asf,
            application/vnd.rn-realmedia, video/divx"
            extensions=" avi, flv, wmv, mp4, mov, mkv, webm, 3gp,
            3g2, m4v, mpg, mpeg, ts, ogv, asf, rm, divx
            "
            name="video"/><br/>
      <button type="submit" class="btn-submit btn">Valider</button>
    </form>
  </div>
```

## Dom

This section describes a set of utility functions designed to manage and display form validation errors in your web application. These functions provide a structured way to highlight invalid input fields and present corresponding error messages to the user.

### `getInputPatternRegex`

```typescript
export function getInputPatternRegex(
    children: HTMLInputElement | HTMLTextAreaElement,
    formParentName: string,
    flag: string = 'i'
): RegExp | undefined
```

**Description:**

This function retrieves the `pattern` attribute from a given HTML input or textarea element and constructs a regular expression (`RegExp`) object using this pattern and the provided flags. It includes error handling for cases where the element is not found, the `pattern` attribute is missing, or the provided flags are invalid.

**Internal jQuery Dependency:**

**Internally, this function utilizes the jQuery library** to interact with the provided `children` HTML element. Specifically, it wraps the native DOM element in a jQuery object to easily access its attributes using the `.attr()` method.

**Compatibility with ReactJS:**

While this function internally depends on jQuery, **it can still be used within ReactJS projects.** ReactJS primarily manages the DOM using its virtual DOM, but it operates with standard HTML elements in the browser. As long as the `children` parameter passed to this function is a valid HTMLInputElement or HTMLTextAreaElement (which can be obtained from a React component's ref or event target), the function will work as expected.

**Important Considerations for ReactJS:**

  * Ensure that jQuery is included in your ReactJS project if you intend to use this function.
  * Be mindful of directly manipulating the DOM in React components. Using refs to access DOM nodes and passing them to utility functions like this is generally acceptable.
  * Consider if a purely React-centric approach (e.g., using React's state and event handling for validation) might be more aligned with the React philosophy for complex scenarios. However, for simple cases where you need to extract and use the `pattern` attribute, this utility can be convenient.

**Parameters:**

  * `children`: `HTMLInputElement | HTMLTextAreaElement` - The HTML input or textarea element from which to extract the `pattern` attribute. In a React context, this would typically be a DOM node obtained via a ref.
  * `formParentName`: `string` - The name or identifier of the parent form. This is used for logging and error messages to provide context.
  * `flag`: `string = 'i'` - The regular expression flags to be used when creating the `RegExp` object. The default value is `'i'` (case-insensitive matching). Allowed flags are `'g'`, `'i'`, `'m'`, `'u'`, `'y'`, and `'s'`.

**Returns:**

  * `RegExp |undefined`: A `RegExp` object created from the `pattern` attribute and the provided flags. Returns `undefined`  in the following cases:
    * The provided `children` element is not present in the DOM (jQuery selection is empty).
    * The provided `flag` string contains invalid regular expression flags.
    * The `children` element does not have a `pattern` attribute.

**Error Handling:**

  * **Warning:** If the `children` element is not found in the DOM, a warning message is logged using the `Logger.warn` method, including the `formParentName` for context.
  * **Error:** If the provided `flag` string contains invalid characters, an error message is logged using the `Logger.error` method, specifying the invalid flags and the `formParentName`. The function then returns `null`.
  * **Error:** If the `children` element does not have a `pattern` attribute, an error message is logged using the `Logger.error` method, including the field name (if available) and the `formParentName`. The function then returns `null`.
  * **Exception:** If the `pattern` attribute contains an invalid regular expression syntax that causes an error during the `RegExp` construction, an error message is logged using `Logger.error`, and the error is re-thrown.

**Example Usage (including React context):**

```tsx
import React, { useRef } from 'react';
import { getInputPatternRegex } from './utils'; // Assuming your function is in utils.ts

function MyFormComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const formName = 'myReactForm';

  const getPattern = () => {
    if (inputRef.current) {
      const regex = getInputPatternRegex(inputRef.current, formName);
      if (regex) {
        console.log('Regular expression from React input:', regex);
      } else {
        console.log('Could not get pattern from React input.');
      }
    }
  };

  return (
    <form name={formName}>
      <input type="text" name="myInput" pattern="[A-Za-z]+" ref={inputRef} />
      <button type="button" onClick={getPattern}>Get Pattern</button>
    </form>
  );
}

export default MyFormComponent;
```

---

### `addErrorMessageFieldDom`

```typescript
export function addErrorMessageFieldDom(
    elmtfield: JQuery<HTMLFormChildrenElement>,
    errormessagefield?: string[],
    className_container_ErrorMessage: string = "border border-3 border-light"
): void
```

This function is responsible for dynamically adding error messages directly into the DOM, associated with a specific form field. It creates a dedicated container for error messages, applies an `is-invalid` class to the field for visual feedback, and then appends the provided error messages.

#### Parameters

* `elmtfield`: A **JQuery object** representing the form field (e.g., `<input>`, `<select>`, `<textarea>`) to which the error messages will be added. This element **must** have an `id` attribute.

* `errormessagefield`: An **optional array of strings**. Each string in this array will be displayed as an individual error message. If this array is empty or not provided, no error messages will be added.
* `className_container_ErrorMessage`: An **optional string** representing the CSS classes to be applied to the `div` element that will contain the error messages. The default value is `"border border-3 border-light"`.

#### Details

1.  **Retrieves Field ID**:
  
 The function first extracts the `id` attribute from `elmtfield`. This `id` is crucial for uniquely identifying the error message container.
1.  **Checks for Error Messages** 
  The process only continues if `errormessagefield` is provided and contains one or more error messages.
2.  **Creates Error Container** 
  
    A new `div` element is generated. This `div` will have the classes specified by `className_container_ErrorMessage` and an `id` constructed as `container-div-error-message-{fieldId}`.
3.  **Applies `is-invalid` Class**: If the `elmtfield` does not already possess the `is-invalid` CSS class, it is added. This class is widely used in CSS frameworks (like Bootstrap) to visually indicate an invalid input state.
4.  **Generates Error Message DOM**: For each string in the `errormessagefield` array, a helper function (presumed to be `createSmallErrorMessage`) is called. This helper function is expected to return a DOM element (e.g., a `<small>` tag) formatted to display an individual error message.

5.  **Appends Error Messages**:
  
 All the generated error message DOM elements are then appended as children to the `containerDivErrorMessage`.
6.  **Inserts into DOM**: Finally, the entire `containerDivErrorMessage` is inserted into the DOM immediately after the `elmtfield`, ensuring the error messages are visible in close proximity to the problematic input.

#### Example

```typescript
// Assuming an input field with id="user_email" exists in the DOM:
// <input type="email" id="user_email" name="email" class="form-control">

// Call addErrorMessageFieldDom to display errors for 'user_email'
addErrorMessageFieldDom($('#user_email'), [
  'This field is required.',
  'Must be a valid email address.'
]);

// This will add a div with the specified border classes and two <small> error messages
// after the #user_email input, and also add the 'is-invalid' class to #user_email.
```

### `handleErrorsManyForm` Function

```typescript
export function handleErrorsManyForm(
    formName: string,
    formId: string,
    errors: Record<string, string[]>
): void
```

This function is designed to efficiently process and display multiple validation error messages across various fields within a single form. It iterates through a provided object of errors, intelligently identifies the corresponding HTML form fields, applies visual invalid states, and then leverages `addErrorMessageFieldDom` to present the specific error messages for each field.

  Parameters

* `formName`: A **string** representing the logical name of the form (e.g., "userRegistration", "productEdit"). This `formName` is used as a prefix in conjunction with the error keys to construct the expected `id` of the HTML form elements (e.g., `formName_fieldName`).
* `formId`: A **string** representing the actual `id` attribute of the HTML form element. While provided as a parameter, this particular `formId` is not directly used within the current function's logic for locating individual fields. However, it can be valuable for broader form management and context within other parts of your application.
* `errors`: A **Record (or dictionary/hash map)** where:
    * **Keys**: Represent field identifiers (e.g., "email", "address.street", "passwordConfirmation"). These keys are expected to align with the latter part of your field `id`s after the `formName` prefix.
    * **Values**: Are **arrays of strings**, with each string being an individual validation error message associated with the corresponding field.

  Details

1.  **Early Exit for No Errors**: The function performs an initial check: if the `errors` object is empty (i.e., `Object.keys(errors).length === 0`), it means there are no errors to display, and the function returns immediately without any further processing.
2.  **Iteration Through Errors**: It then iterates through each `key` (which represents a field identifier) present in the `errors` object.
3.  **Dynamic Field ID Construction**: For each error `key`, the function dynamically constructs the expected `id` of the corresponding HTML form element. It concatenates the `formName` with the `key`, replacing any periods (`.`) within the `key` with underscores (`_`). This is a common and robust convention for matching server-side validation error keys to client-side HTML element IDs.
    * **Example**: If `formName` is `"userForm"` and an error `key` is `"address.city"`, the constructed `fieldId` will be `"userForm_address_city"`.
4.  **Element Discovery**: Using jQuery, the function attempts to find the HTML element in the DOM that matches the constructed `fieldId`.
5.  **Handling Missing Elements**: If `jQuery` does not find an element for a given `fieldId` (i.e., `element.length` is `0`), a warning message is logged using `Logger.warn`. The function then skips to the next error in the loop, preventing potential runtime errors and ensuring robustness.
6.  **Applying `is-invalid` Class**: If the element is successfully found, the `is-invalid` CSS class is added to it. This provides immediate visual feedback to the user that the field contains invalid input.
7.  **Displaying Specific Error Messages**: Finally, the function calls `addErrorMessageFieldDom`, passing the found `element` and the array of specific error messages (`errors[key]`) associated with that field. This delegates the actual rendering of the error messages to the dedicated `addErrorMessageFieldDom` function.

  Example

```typescript
// Assume the following HTML structure for a registration form:
// <form id="registrationForm">
//   <input type="text" id="regForm_username" name="username">
//   <input type="email" id="regForm_email" name="email">
//   <input type="password" id="regForm_password" name="password">
//   <input type="password" id="regForm_password_confirm" name="passwordConfirm">
// </form>

// And you receive the following validation errors from a server API:
const validationErrors = {
  'username': ['Username is required.', 'Username must be at least 5 characters.'],
  'email': ['Invalid email format.'],
  'password.confirm': ['Passwords do not match.'] // Note the dot notation for nested fields
};

// Call handleErrorsManyForm to display these errors on the 'registrationForm'
handleErrorsManyForm(
  'regForm', // formName prefix used in IDs
  'registrationForm', // formId (actual ID of the form element, though not directly used in this func)
  validationErrors
);

// After execution:
// - #regForm_username will have 'is-invalid' class and two error messages below it.
// - #regForm_email will have 'is-invalid' class and one error message below it.
// - #regForm_password_confirm will have 'is-invalid' class and one error message below it.
```

## **How to Integrate and Use These Functions**

1.  **Prerequisites**:
    * Ensure that **jQuery** is included and available in your project, as these functions heavily rely on it.
    * Confirm that the `Logger` object (used in `handleErrorsManyForm` for warnings) is defined and accessible if you intend to use its logging capabilities.
    * Make sure the `createSmallErrorMessage` helper function (used by `addErrorMessageFieldDom`) is defined and returns appropriate DOM elements for displaying individual error messages.

2.  **Implementation**:
    * **Single Field Errors**: For displaying errors on individual fields, directly call `addErrorMessageFieldDom` when you have a specific field element and its corresponding error messages.
    * **Multiple Form Field Errors**: When you receive a collection of errors for multiple fields within a form (e.g., from a server-side validation response), use `handleErrorsManyForm`. Provide the common `formName` prefix used in your field IDs and the `errors` object.

3.  **Customization**:
  
    * **Styling**:
  
    *  Adjust the `className_container_ErrorMessage` parameter in `addErrorMessageFieldDom` (or modify its default value) to match your application's CSS framework or styling conventions for error message containers.
    * **Error Message Presentation**: Customize the `createSmallErrorMessage` function to control how individual error messages are rendered (e.g., using different HTML tags, icons, or specific styling).
  
    * **Field ID Naming**: Ensure that your HTML form field `id`s consistently follow the `formName_fieldName` convention if you plan to use `handleErrorsManyForm` effectively with its automatic ID construction.

## Validators

### Input Validation Class Documentation

#### Overview

This TypeScript class provides a flexible and reusable validation system for different types of input fields. It includes various validation methods to ensure data integrity and security when handling user input.

## Methods and Explanations

### 1. `allTypesValidator` Method

This is the main entry point for validating different types of input fields.

**Parameters:**

- `datainput`: The value to be validated.
- `targetInputname`: The name of the input field.
- `type_field`: The type of input field (e.g., email, password, text, etc.).
- `options_validator`: Validation options that vary depending on the field type.

**Functionality:**

- Uses a `switch` statement to determine the field type.
- Calls the appropriate validation method (e.g., `emailValidator`, `textValidator`, etc.).
- Ensures that the provided validation options are correct before executing validation.
- Throws an error if an invalid type or options are used.

---

### 2. `textValidator` Method

Validates **text input fields** according to specified rules.

**Parameters:**

- `datainput`: The text input value.
- `targetInputname`: The name of the input field.
- `optionsinputtext`: A configuration object specifying validation rules.

**Validation Steps:**

1. **Sanitization:** Trims the input and removes HTML and PHP tags if `escapestripHtmlAndPhpTags` is `true`.
2. **Regex Check:** Ensures the text matches the allowed character set (default: only letters and spaces).
3. **Length Validation:** Ensures the text meets the `minLength` and `maxLength` constraints.
4. **Required Field Validation:** Ensures the field is filled if `requiredInput` is `true`.

---

### 3. `emailValidator` Method

Validates an **email address**.

**Parameters:**

- `datavalueemail`: The email input value.
- `targetInputnameemail`: The name of the input field.
- `optionsinputemail`: A configuration object specifying validation rules.

**Functionality:**

- Calls `textValidator` with an **email regex pattern**.
- Ensures the email format is valid (e.g., `example@domain.com`).
- Checks **length constraints** (default: 6 to 180 characters).
- Ensures the field is **required** unless explicitly set otherwise.

---

### 4. `telValidator` Method

Validates a **telephone number**.

**Parameters:**

- `data_tel`: The phone number input.
- `targetInputname`: The name of the input field.
- `optionsinputTel`: A configuration object specifying validation rules.

**Functionality:**

- Calls `textValidator` with a **phone number regex**.
- Ensures it follows a valid format (e.g., `+229016725186`).
- Checks **length constraints** (default: 8 to 80 characters).
- Ensures the field is **required** unless explicitly set otherwise.

---

### 5. `passwordValidator` Method

Validates **password inputs** based on security rules.

**Parameters:**

- `datainput`: The password input.
- `targetInputname`: The name of the input field.
- `optionsinputtext`: A configuration object specifying password constraints.

**Validation Steps:**

1. **Trimming:** Removes extra spaces.
2. **Character Requirements:**
   - **Uppercase letter** check.
   - **Lowercase letter** check.
   - **Numeric digit** check.
   - **Special character** check.
   - **Custom regex validation** if provided.
3. **Length Validation:** Ensures the password meets the `minLength` and `maxLength` constraints.
4. **Required Field Validation:** Ensures the field is filled if `requiredInput` is `true`.

---

### 6. `urlValidator` Method

Validates a **URL input**.

**Parameters:**

- `urlData`: The URL string to validate.
- `targetInputname`: The name of the input field.
- `url_options`: A configuration object specifying URL constraints.

**Validation Steps:**

1. **Regex Validation:** Ensures the URL follows a valid format.
2. **Protocol Check:** Ensures the URL uses an allowed protocol (e.g., `http`, `https`, `ftp`).
3. **TLD Requirement:** Ensures the hostname contains a top-level domain (TLD) if required.
4. **Localhost Restriction:** Ensures localhost is disallowed if `allowLocalhost` is `false`.
5. **IP Restriction:** Ensures IP addresses are disallowed if `allowIP` is `false`.
6. **Query Parameter & Fragment Check:** Ensures query parameters (`?key=value`) and fragments (`#section`) are allowed or blocked.

### 7. `dateValidator` Method

Validates a **date input**.

**Parameters:**

- `date_input`: The date string.
- `targetInputname`: The name of the input field.
- `date_options`: A configuration object specifying date constraints.

**Validation Steps:**

1. **Required Check:** Ensures the field is filled if `requiredInput` is `true`.
2. **Regex Validation:** Ensures the date follows a valid format (default: `YYYY-MM-DD`).
3. **Custom Date Range:** Can enforce a valid date range (e.g., no future dates allowed).

### `selectValidator` Method  

This method validates whether a selected value exists within the available choices of a select field. If the selected value is not found in the given options, an error message is generated.  

#### **Parameters**  

- **`value_index` (string)** – The selected value that needs to be validated.  
- **`targetInputname` (string)** – The name of the input field being validated.  
- **`options_select` (SelectOptions)** – An object containing the list of valid options (`optionsChoices`).  

#### **Functionality**  

1. It checks if `value_index` exists in `options_select.optionsChoices`.  
2. If the value is not found, it updates the validator status with an error message.  
3. Finally, it calls the `textValidator` method to apply additional text-based validation on the selected value.  

#### **Return Value**  

- Returns the instance of the current class (`this`) to allow method chaining.  

#### Example Usage

```typescript
import jQuery from "jquery";
import { debounce } from "lodash";
import {
  clearErrorInput,
  addErrorMessageFieldDom,
} from "@wlindabla/form_validator";
import {FormInputValidator} from "@wlindabla/form_validator";
const formInputValidator = FormInputValidator.getInstance();

jQuery(function validateInput() {
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
              addErrorMessageFieldDom(jQuery(target), formInputValidator.getErrorMessageField(target.attr('name')));
            }
          }
      })
      jQuery(this).on('input', '#username,#email,#tel,#message',(event: JQuery.Event|any) => {
    const target = event.target as HTMLInputElement|HTMLTextAreaElement;
        if (target) {
      clearErrorInput(jQuery(target));
    }
  });
  })
```
Would you like me to adjust the wording or add more details? 😊

#### Conclusion

This class provides a **robust and reusable validation system** for multiple input types. Each validator:
- Uses **regular expressions** for pattern matching.
- Enforces **minimum and maximum lengths**.
- Checks **required fields**.
- **Sanitizes** inputs where necessary.
- Supports **custom error messages**.

This allows the validation logic to be easily integrated into **form validation systems** in **TypeScript-based** projects. 🚀

### ImageValidator Class Documentation

#### Overview

The `ImageValidator` class is responsible for validating image files based on different criteria such as MIME type, file signature, dimensions, and file size. It extends the `AbstractMediaValidator` class and follows a singleton pattern to ensure only one instance of the class is used throughout the application.

Features

- **Singleton Pattern:** 

- Ensures a single instance of the `ImageValidator` class.
  
- **File Signature Validation:** Prevents disguised files by checking hexadecimal signatures.
- **MIME Type Validation:** Ensures that the uploaded file matches the expected MIME type.
- **File Size Validation:** Checks that the file does not exceed the allowed maximum size.
- **Image Dimensions Validation:** Ensures that images meet the required width and height constraints.
- **Allowed Extensions Validation:** Ensures only specified image formats are accepted.

#### Supported Formats

The `ImageValidator` class supports the following image formats:

| Format | Hexadecimal Signature |
|--------|----------------------|
| JPG | `ffd8ffe0`, `ffd8ffe1`, `ffd8ffe2`, `ffd8ffe3`, `ffd8ffe8` |
| JPEG | `ffd8ffe0`, `ffd8ffe1`, `ffd8ffe2`, `ffd8ffe3`, `ffd8ffe8` |
| PNG | `89504e47` |
| GIF | `47494638` |
| BMP | `424d` |
| WEBP | `52494646` |
| SVG | `3c3f786d6c2076657273696f6e3d`, `3c737667` |

#### Methods

#### `getInstance(): ImageValidator`

Returns the singleton instance of the `ImageValidator` class.

#### `fileValidator(medias: File | FileList, targetInputname: string = 'photofile', optionsimg: OptionsImage): Promise<this>`

Validates an image file or a list of image files against the specified options.

- **Parameters:**
  - `medias`: The file or list of files to validate.
  - `targetInputname`: The name of the input field (default: `'photofile'`).
  - `optionsimg`: Configuration options including allowed MIME types, max file size, and dimension constraints.
- **Returns:** A promise resolving to the `ImageValidator` instance.

#### `signatureFileValidate(file: File, uint8Array?: Uint8Array): Promise<string | null>`

Validates the file signature to ensure it is not disguised as another file type.

- **Parameters:**
  - `file`: The file to validate.
  - `uint8Array`: Optional binary representation of the file.
- **Returns:** A promise resolving to an error message if the validation fails, otherwise `null`.

#### `mimeTypeFileValidate(file: File, allowedMimeTypeAccept?: string[]): Promise<string | null>`

Validates the MIME type of the file against allowed MIME types.

- **Parameters:**
  - `file`: The file to validate.
  - `allowedMimeTypeAccept`: List of accepted MIME types.
- **Returns:** A promise resolving to an error message if the validation fails, otherwise `null`.

#### `getFileDimensions(file: File): Promise<{ width: number; height: number; }>`

Retrieves the dimensions of the image file.

- **Parameters:**
  - `file`: The image file.
- **Returns:** A promise resolving to an object containing `width` and `height`.

#### `detecteMimetype(hexasignatureFile: string, uint8Array: Uint8Array): string | null`

Determines the actual MIME type of an image file based on its hexadecimal signature.

- **Parameters:**
  - `hexasignatureFile`: The hexadecimal signature of the image file.
  - `uint8Array`: The binary representation of the file.
- **Returns:** The true MIME type of the file or `null` if unknown.

#### `getExtensions(allowedMimeTypes: string[]): string[]`

Converts a list of MIME types to their corresponding file extensions.

- **Parameters:**
  - `allowedMimeTypes`: List of allowed MIME types.
- **Returns:** An array of valid file extensions.

#### Usage Example

```typescript
import {ImageValidator} from "@wlindabla/form_validator";
const imageValidator = ImageValidator.getInstance();

jQuery(function imageLoad() {
  const imagesAll = jQuery<HTMLInputElement>('input#img');
  let instance = imageValidator;
  const validateImage = debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instance = await imageValidator.fileValidator(target.files as FileList, target.name);
      if (!instance.hasErrorsField(target.name)) {
        addErrorMessageFieldDom(jQuery(target), instance.getErrorMessageField);
      }
    }
  }, 300); // Délai de 300ms

  imagesAll?.on('blur', validateImage);
  imagesAll?.on('change', (event: JQuery.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      clearErrorInput(jQuery(target));
    }
  });
```

### DocumentValidator Class Documentation

 Overview

`DocumentValidator` is a singleton class that extends `AbstractMediaValidator` and implements `MediaValidatorInterface`. It is responsible for validating different types of document files based on their MIME types and hexadecimal signatures. It supports file types including PDFs, Word documents, Excel sheets, OpenDocument formats, text files, and CSVs.

 Features

- **Singleton Pattern**: Ensures a single instance of `DocumentValidator`.
- **MIME Type Validation**: Checks if the uploaded file matches the allowed MIME types.
- **Hexadecimal Signature Validation**: Validates file format based on magic numbers.
- **Content Parsing**: Ensures the file is properly formatted for Word, Excel, CSV, and PDF.
- **Support for OpenDocument formats**: Compatible with ODT, ODS, and other Linux-specific formats.
- **Error Handling**: Provides detailed error messages when validation fails.

## Class Definition

```typescript
class DocumentValidator extends AbstractMediaValidator implements MediaValidatorInterface
```

## Properties

### `mimeTypeMap: Record<string, string[]>`

Defines the MIME types for supported document formats:

```typescript
{
    pdf: ['application/pdf'],
    doc: ['application/msword'],
    docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    xls: ['application/vnd.ms-excel'],
    xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    odt: ['application/vnd.oasis.opendocument.text'],
    ods: ['application/vnd.oasis.opendocument.spreadsheet'],
    txt: ['text/plain'],
    csv: ['text/csv']
}
```

### `signatureHexadecimalFormatDocument: Record<string, string[]>`

Defines the hexadecimal signatures for different document formats:

```typescript
{
    pdf:  ['25504446'],
    word: ['504b0304', 'd0cf11e0'],
    excel: ['504b0304', 'd0cf11e0']
}
```

### `private static m_instance_doc_validator: DocumentValidator`

Singleton instance of the `DocumentValidator` class.

  Methods

### `getInstanceDocValidator(): DocumentValidator`

Returns the singleton instance of `DocumentValidator`.

```typescript
public static getInstanceDocValidator = (): DocumentValidator => {
    if (!DocumentValidator.m_instance_doc_validator) {
        DocumentValidator.m_instance_doc_validator = new DocumentValidator();
    }
    return DocumentValidator.m_instance_doc_validator;
}
```

### `fileValidator(medias: File | FileList, targetInputname: string, optionsdoc: OptionsFile): Promise<this>`

Validates a single or multiple files.

Parameters

- `medias`: File or FileList to be validated.
- `targetInputname`: Input name associated with the file (default: `doc`).
- `optionsdoc`: Options specifying allowed MIME types.

#### Returns

- A `Promise<this>` indicating validation success or failure.

### `validate(file: File, formatValidator: string): Promise<string | null>`

Validates a file based on its format.

Parameters

- `file`: The file to validate.
- `formatValidator`: The format to validate against (pdf, word, excel, csv, text).

Returns

- A `Promise<string | null>`, returning an error message if validation fails, otherwise `null`.

### `readFileAsUint8Array(file: File): Promise<Uint8Array>`

Reads a file as a `Uint8Array`.

 Parameters

- `file`: The file to read.

 Returns

- A `Promise<Uint8Array>` containing the file data.

### `validateSignature(file: File, formatValidator: string, uint8Array: Uint8Array): boolean`

Validates a file’s signature.

#### Parameters

- `file`: The file to validate.
- `formatValidator`: Format category (pdf, word, excel, etc.).
- `uint8Array`: The binary data of the file.

 Returns

- `boolean`: `true` if valid, otherwise `false`.

### `validatePdf(file: File, uint8Array: Uint8Array): Promise<string | null>`

Validates a PDF file using `pdfjsLib`.

### `validateExcel(file: File, uint8Array: Uint8Array): Promise<string | null>`

Validates an Excel file using `XLSX`.

### `validateText(file: File): Promise<string | null>`

Checks if a text file is not empty.

### `validateCsv(file: File): Promise<string | null>`

Parses and validates a CSV file using `Papa.parse`.

### `detecteMimetype(filename: string, hexasignatureFile: string, uint8Array: Uint8Array): this`

Detects the MIME type based on the file’s signature.

### `getExtensions(allowedMimeTypeAccept: string[]): string[]`

Retrieves allowed extensions based on the MIME type map.

 Example Usage

```typescript
import {DocumentValidator} from "@wlindabla/form_validator";
const documentValidator = DocumentValidator.getInstance();
 const pdfAll = jQuery<HTMLInputElement>('input#pdf');
  let instanceValidatorpdf = documentValidator;
  const validatePdf= debounce(async (event: JQuery.BlurEvent) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      instanceValidatorpdf = await documentValidator.fileValidator(
        target.files as FileList, target.name,
        {
          allowedMimeTypeAccept: ['application/pdf', 'text/csv', 'text/plain',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
});
```

Conclusion

The `DocumentValidator` class provides a robust and extensible way to validate document files in a web application. With support for various document formats, signature verification, and content parsing, it ensures that only valid files are processed.

## VideoValidator Class

The `VideoValidator` class is a utility for validating video files based on various criteria such as file extension, size, MIME type, and video metadata (dimensions, duration). This class is designed to ensure that uploaded video files meet specific validation requirements before being processed further.

  Features

- **Singleton Design Pattern**: The class follows the singleton pattern, ensuring only one instance of the validator is used throughout your application.
  
- **File Validation**: Validates video files by checking:
  - **Extension**: Ensures the file has a valid extension (e.g., `.mp4`, `.mkv`, `.avi`, etc.).
  - **Size**: Checks that the video file size is within the allowed limit.
  - **MIME Type**: Verifies that the file's MIME type matches the expected video types.
  - **Metadata**: Validates video metadata such as dimensions and duration.

- **Error Handling**: The class provides detailed error messages to notify the user when a file does not pass the validation checks.

## Usage
  
  Example

Here’s an example of how to use the `VideoValidator` class to validate video files:

```typescript
jQuery(function mediaLoad() {
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
```

In this example, the `fileValidator` method validates the files selected in the input field `#videoInput`, checking for allowed extensions (`mp4`, `mkv`), valid MIME types, and a maximum size limit of 10 MiB.

### Constructor

The constructor is private, so the class cannot be instantiated directly. Instead, use the static `getInstance()` method to get the singleton instance.

  Methods

#### `fileValidator(medias, targetInputname, optionsmedia)`

- **Parameters**:
  - `medias`: A single video file or a list of files to validate.
  - `targetInputname`: The name of the input field to personalize error messages (default is 'videofile').
  - `optionsmedia`: An optional object with validation options (allowed extensions, MIME types, max file size, etc.).

- **Returns**: A promise that resolves after the files are validated, or rejects if any validation fails.

#### `mimeTypeFileValidate(media, allowedMimeTypeAccept)`

Validates the MIME type of the provided video file. Checks if the MIME type is one of the allowed types.

#### `metadataValidate(media, targetInputname, optionsvideo)`

Validates video metadata, including dimensions (width, height) and duration. This method ensures the video file has valid metadata before further processing.

### Example with Detailed Validation

```javascript
const videoFiles = document.getElementById('videoInput').files;

await videoValidator.fileValidator(videoFiles, 'videoInput', {
  extensions: ['mp4', 'mkv'],
  allowedMimeTypeAccept: ['video/mp4', 'video/x-matroska'],
  maxsizeFile: 10, // 10 MiB
  unityMaxSizeFile: 'MiB',
  minWidth: 640, // Minimum width
  maxWidth: 1920, // Maximum width
  minHeight: 360, // Minimum height
  maxHeight: 1080  // Maximum height
});
```

### Error Handling

If the validation fails, the class will throw an error, including the file name and the validation failure reason. For example:

- "Invalid MIME type for video file."
- "Video file size exceeds the allowed limit."
- "Video dimensions do not meet the required size."

### Import Example

```javascript
import {VideoValidator} from "@wlindabla/form_validator";
const videoValidator = VideoValidator.getInstance();
```

### `FormChildrenTypeNoFileValidate` Class Documentation

This documentation provides a detailed explanation of the `FormChildrenValidateInterface` and its implementation, the `FormChildrenTypeNoFileValidate` class. These components are designed to handle the validation of HTML form fields that are not of type `file`.

---

## `FormChildrenValidateInterface` Interface

This interface defines the contract for any form field validation component. It ensures that any class implementing it provides a standard set of methods for managing validation, retrieving validation options, and interacting with validation events.
 
 Methods

  `isValid(): boolean`

* **Description:** Checks if the form field is currently valid, meaning it has no recorded validation errors.
* **Usage:** Use this method to determine the validity state of a field without triggering a new validation. It's useful for quick checks of the current state.

### `getOptionsValidate(): OptionsValidate`

* **Description:** Retrieves the specific validation options configured for the form field. These options define the rules and criteria for validation to be applied.
* **Usage:** This method is primarily used internally by the validation process to get the rules to apply. It can also be useful if you need to inspect a field's default or custom validation options.

#### `validate(): Promise<void>`

* **Description:** Triggers the validation process for the form field. This is an asynchronous operation that performs all necessary checks and records errors if the field is invalid.
* **Usage:** Call this method to validate a form field. It's the primary method for initiating validation manually or in response to a user event (e.g., form submission, field blur).

#### `eventValidate(): EventValidate`

* **Description:** Returns the validation event associated with the field. This event is emitted when the field's validation is performed.
* **Usage:** Allows you to subscribe to validation events to react when the field's validation status changes (e.g., showing or hiding an error message).

#### `eventClearError(): EventValidate`

* **Description:** Returns the "clear error" event associated with the field. This event is emitted when validation errors for the field are cleared.
* **Usage:** Allows you to subscribe to error clearing events to react when field error messages should be hidden or the field is marked as valid.

#### `clearErrorField(): void`

* **Description:** Clears all validation errors currently associated with the form field.
* **Usage:** Use this method to reset a field's error state, for example, when the user starts typing again in an invalid field or after a successful form submission.

---

## `FormChildrenTypeNoFileValidate` Class

This class implements the `FormChildrenValidateInterface` for HTML form fields that are not of type `file`. It manages the logic for retrieving validation options based on the HTML input type and uses a form input validator (`FormInputValidator`) to perform the actual checks.

 Constructor

```typescript
constructor(
    childrenInput: HTMLFormChildrenElement,
    protected readonly formInputValidate: FormInputValidator,
    private optionsValidate?: OptionsValidateNoTypeFile
)
```

* **`childrenInput`**: The HTML element of the form field to be validated.
* **`formInputValidate`**: An instance of the form validator (`FormInputValidator`) that contains the actual validation logic.
* **`optionsValidate` (optional)**: Custom validation options. If not provided, the class will **deduce default options** based on the HTML input's type.

### Validation Attributes (via HTML Attributes) and Default Values

This class deduces validation options by reading attributes directly from the HTML element (`childrenInput`). If an attribute is not specified, a default value is used.

| HTML Attribute (on the input)     | Field Type (HTML `type` of the input) | Description                                                         | Default Value                                                |
| :-------------------------------- | :------------------------------------ | :------------------------------------------------------------------ | :----------------------------------------------------------- |
| `max-length`                      | `text`, `tel`, `textarea`, `url`, `password`, `date`, `number` | Maximum allowed length for the input.                               | `255` for `text`, `tel`, `url`, `password`; `1000` for `textarea`; `21` for `date` |
| `min-length`                      | `text`, `tel`, `textarea`, `url`, `password`, `date`, `number` | Minimum allowed length for the input.                               | `1` for `text`, `tel`; `10` for `textarea`, `date`; `6` for `url`; `8` for `password` |
| `required`                        | `text`, `tel`, `textarea`, `password` | Indicates if the field is mandatory.                                | `false`                                                      |
| `escapestrip-html-and-php-tags`   | `text`, `textarea`, `select`          | Indicates if HTML and PHP tags should be escaped/stripped.          | `false`                                                      |
| `error-message-input`             | `text`, `tel`                         | Custom error message to display.                                    | Generic non-compliance message                               |
| `regex-validator`                 | Any type                              | Custom regular expression for validation.                           | Deduced from HTML pattern if present                         |
| `eg-await`                        | `text`                                | Specific attribute for awaiting/triggering logic.                   | `undefined`                                                  |
| `upper-case-allow`                | `password`                            | Allows uppercase letters in the password.                           | `false`                                                      |
| `lower-case-allow`                | `password`                            | Allows lowercase letters in the password.                           | `false`                                                      |
| `special-char`                    | `password`                            | Allows special characters in the password.                          | `false`                                                      |
| `number-allow`                    | `password`                            | Allows numbers in the password.                                     | `false`                                                      |
| `allowed-protocols`               | `url`                                 | List of allowed URL protocols (comma-separated).                    | `['https']`                                                  |
| `required-tld`                    | `url`                                 | Requires a TLD (top-level domain) in the URL.                       | `false`                                                      |
| `allow-localhost`                 | `url`                                 | Allows `localhost` URLs.                                            | `false`                                                      |
| `allow-ip`                        | `url`                                 | Allows IP addresses as URLs.                                        | `false`                                                      |
| `allow-query-params`              | `url`                                 | Allows query parameters in the URL.                                 | `false`                                                      |
| `allow-hash`                      | `url`                                 | Allows hash anchors in the URL.                                     | `false`                                                      |
| `format-date`                     | `date`                                | Expected date format (e.g., `YYYY-MM-DD`).                          | `undefined`                                                  |
| `min-date`                        | `date`                                | Minimum allowed date.                                               | `undefined`                                                  |
| `max-date`                        | `date`                                | Maximum allowed date.                                               | `undefined`                                                  |
| `allow-future`                    | `date`                                | Allows future dates.                                                | `false`                                                      |
| `allow-past`                      | `date`                                | Allows past dates.                                                  | `false`                                                      |
| `min`                             | `number`                              | Minimum allowed numeric value.                                      | `undefined`                                                  |
| `max`                             | `number`                              | Maximum allowed numeric value.                                      | `undefined`                                                  |
| `step`                            | `number`                              | Number increment/decrement step.                                    | `undefined`                                                  |

### **Attributes for Checkbox/Radio Containers (on the parent element with the group ID)**

| HTML Attribute (on the container) | Field Type (HTML `type` of the input) | Description                                                | Default Value |
| :-------------------------------- | :------------------------------------ | :--------------------------------------------------------- | :------------ |
| `max-allowed`                     | `checkbox`                            | Maximum number of selectable checkboxes.                   | `undefined`   |
| `min-allowed`                     | `checkbox`                            | Minimum number of selectable checkboxes.                   | `undefined`   |
| `required`                        | `checkbox`, `radio`                   | Indicates that at least one option must be selected in the group. | `false`       |

### Implemented Methods

 `validate(): Promise<void>`

* **Description:** Validates the current value of the field using the injected `FormInputValidator` instance.
* **Usage:** This method is the cornerstone of validation. It's called to execute all validation rules defined by the retrieved `OptionsValidate`. It emits a validation event after execution.

  `isValid(): boolean`

* **Description:** Checks the field's error state by consulting the `FormInputValidator` instance.
* **Usage:** Allows you to know if the field currently has errors without triggering a new validation.

#### `getOptionsValidate(): OptionsValidateNoTypeFile`

* **Description:** Retrieves the validation options. If `optionsValidate` were passed to the constructor, they are used. Otherwise, this method **dynamically determines and builds the default validation options** based on the input type (`text`, `tel`, `textarea`, `password`, `url`, `date`, `select`, `number`, `checkbox`, `radio`) and the HTML attributes present on the element.
* **Usage:** This method is crucial because it adapts the validation behavior to the specific HTML field type by reading configurations directly from the DOM.

#### `protected getFormError(): FormErrorInterface`

* **Description:** Returns the `FormInputValidator` instance that manages errors.
* **Usage:** Internal method to access the error handler.

#### `private hasContainerCheckbox(): boolean`

* **Description:** Checks for the presence of a container (with an `id` matching the checkbox group's `name`) for checkbox groups and ensures all checkboxes in the group are inside it.
* **Usage:** Internal method for checkbox group validation, essential for applying `max-allowed` and `min-allowed` rules. **Throws an error if the container structure is not respected.**

#### `private hasContainerRadio(): boolean`

* **Description:** Similar to `hasContainerCheckbox`, but for radio button groups.
* **Usage:** Internal method for radio group validation. **Throws an error if the container structure is not respected.**

#### `private getAttrCheckboxContainer(attributeName: string): string | undefined`

* **Description:** Retrieves the value of a specific attribute on the checkbox group's container.
* **Usage:** Internal method to extract validation rules from the container (`max-allowed`, `min-allowed`, `required`).

#### `private getAttrRadioContainer(attributeName: string): string | undefined`

* **Description:** Retrieves the value of a specific attribute on the radio group's container.
* **Usage:** Internal method to extract the `required` rule from the container.

#### `private getOptionsValidateTextarea(): OptionsInputField`

#### `private getOptionsValidateUrl(): URLOptions`

#### `private getOptionsValidateDate(): DateOptions`

#### `private getOptionsValidateSelect(): SelectOptions`

#### `private getOptionsValidateNumber(): NumberOptions`

#### `private getOptionsValidateSimpleText(): OptionsInputField`

#### `private getOptionsValidatePassword(): PassworkRuleOptions`

#### `private getOptionsValidateCheckBox(): OptionsCheckbox`

#### `private getOptionsValidateRadio(): OptionsRadio`

* **Description:** These private methods are responsible for constructing the validation options objects (`OptionsInputField`, `URLOptions`, etc.) for each HTML input type. They read the corresponding attributes from the HTML element (`this._children` or its container) and apply default values if the attributes are not found.
* **Usage:** They are called by `getOptionsValidate()` to provide the specific validation rules for the field type.
  
# `FormChildrenTypeFileValidate` Class Documentation

This documentation provides a comprehensive explanation of the `FormChildrenTypeFileValidate` class, designed for the specific validation of HTML form fields of type `file`. This class extends `AbstractFormChildrenValidate` and implements `FormChildrenValidateInterface`, ensuring adherence to a standard validation contract while providing specialized media file validation capabilities.

## Class `FormChildrenTypeFileValidate`

This class specializes in handling validation for file input elements (`<input type="file">`). It leverages an `AbstractMediaValidator` to perform the actual file-specific checks based on various attributes defined directly on the HTML input element.

 Constructor

```typescript
constructor(
    children: HTMLInputElement,
    protected readonly mediaValidator: AbstractMediaValidator,
    protected optionsValidateMedia?: OptionsValidateTypeFile
)
```

* **`children`**: The `HTMLInputElement` representing the file input field to be validated.
* **`mediaValidator`**: An instance of `AbstractMediaValidator` responsible for executing the file and media-specific validation rules.
* **`optionsValidateMedia` (optional)**: Custom validation options for media files. If not provided, the class will **derive default options** based on the `media-type` attribute of the input element.

**Important Note**: The constructor explicitly checks for the presence of a `media-type` attribute on the input element. If this attribute is missing, it will throw an `AttributeException`, as this attribute is crucial for determining the type of media validation to perform (e.g., image, document, video).

  Validation Attributes (via HTML Attributes) and Default Values

This class determines validation rules by reading attributes directly from the HTML `input` element (`children`). If an attribute is not specified, a sensible default value is applied.

| HTML Attribute (on the input) | Applies To | Description | Default Value |
| :---------------------------- | :--------- | :---------- | :------------ |
| `media-type`                  | All file types | **Mandatory.** Specifies the type of media being uploaded (e.g., `image`, `document`, `video`). | **Required.** Throws `AttributeException` if missing. |
| `extentions`                  | All file types | A comma-separated list of allowed file extensions (e.g., `jpg,png,gif`). | `undefined` (all extensions allowed by `allowed-mime-type-accept` if specified) |
| `allowed-mime-type-accept`    | All file types | A comma-separated list of allowed MIME types (e.g., `image/jpeg,image/png`). | `undefined` (all MIME types allowed by `extentions` if specified) |
| `maxsize-file`                | All file types | The maximum allowed file size. This value is an integer. | `2` (interpreted as MB by default) |
| `unity-max-size-file`         | All file types | The unit for `maxsize-file` (e.g., `KB`, `MB`, `GB`). | Assumed to be **MB** if not specified. |
| `unity-dimensions`            | Image, Video | The unit for `min-width`, `max-width`, `min-height`, `max-height` (e.g., `px`). | `undefined` |
| `min-width`                   | Image, Video | Minimum width allowed for the media. | `10` |
| `max-width`                   | Image, Video | Maximum width allowed for the media. | `1600` |
| `min-height`                  | Image, Video | Minimum height allowed for the media. | `10` |
| `max-height`                  | Image, Video | Maximum height allowed for the media. | `2500` |
| `duration`                    | Video      | Maximum duration allowed for the video (in seconds). | `10` |
| `unity-duration-media`        | Video      | The unit for `duration` (e.g., `seconds`, `minutes`). | `undefined` |
| `event-clear-error`           | All file types | The DOM event that triggers the clearing of errors for the field. | `'change'` |

Implemented Methods

 `isValid(): boolean`

* **Description:** Checks if the file input field is currently valid, meaning it has no recorded validation errors from the `mediaValidator`.
* **Usage:** Use this method to quickly ascertain the current validity status of the file field without re-running the full validation.

 `validate(): Promise<void>`

* **Description:** Initiates the asynchronous validation process for the file input. It checks if a file (or files) has been selected. If so, it passes the file(s) and the relevant validation options to the `mediaValidator`. After validation, it emits an event.
* **Usage:** This is the primary method to call when you need to validate the selected file(s), typically on form submission or when the file input's value changes.

 `getOptionsValidate(): OptionsValidateTypeFile`

* **Description:** Retrieves the validation options for the current media type. If `optionsValidateMedia` were passed to the constructor, they are used. Otherwise, this method **dynamically constructs default validation options** based on the `_mediaType` determined from the `media-type` HTML attribute. It supports `image`, `document`, and `video` types.
* **Usage:** This method is critical for adapting the validation behavior to the specific media type, reading configuration directly from the DOM attributes. It will throw an error if an unsupported `media-type` is provided.

 `protected getFormError(): FormErrorInterface`

* **Description:** Returns the instance of `AbstractMediaValidator` which is responsible for managing validation errors for this field.
* **Usage:** This protected method provides internal access to the error handling mechanism.

 `public eventClearError(): EventValidate`

* **Description:** Returns the event that triggers the clearing of validation errors for this field. By default, this is the `'change'` event of the input, but it can be customized via the `event-clear-error` HTML attribute.
* **Usage:** Allows external components to subscribe to this event to clear error messages or reset the field's visual state when appropriate.

### Private Helper Methods for Option Derivation

The following private methods are responsible for building the specific validation option objects based on the `media-type` attribute and other HTML attributes on the input element.

#### `private getOptionsValidateVideo(): OptionsMediaVideo`

* **Description:** Constructs the `OptionsMediaVideo` object, inheriting base file options and adding video-specific attributes like `duration`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, and `unityDurationMedia`. Defaults are applied if attributes are missing.
* **Usage:** Called internally by `getOptionsValidate()` when `_mediaType` is `'video'`.

#### `private getOptionsValidateImage(): OptionsImage`

* **Description:** Constructs the `OptionsImage` object, inheriting base file options and adding image-specific attributes like `minWidth`, `maxWidth`, `minHeight`, and `maxHeight`. Defaults are applied if attributes are missing.
* **Usage:** Called internally by `getOptionsValidate()` when `_mediaType` is `'image'`.

#### `private getBaseOptionsValidate(): OptionsFile`

* **Description:** This method serves as a base to construct common file validation options (`OptionsFile`) applicable to all media types (image, document, video). It reads attributes such as `extentions`, `allowedMimeTypeAccept`, `maxsizeFile`, `unityMaxSizeFile`, and `unityDimensions`.
* **Usage:** Called by `getOptionsValidateVideo()` and `getOptionsValidateImage()` to ensure common file validation rules are always included.

## `FormValidate` Class Documentation

This documentation provides an in-depth look at the `FormValidate` class, a central component for managing and orchestrating the validation of form fields within your application. It streamlines the process of attaching validation logic to various form elements and provides convenient methods for triggering validation and retrieving field IDs based on desired DOM events.

## Class `FormValidate`

The `FormValidate` class serves as a robust controller for form validation. It initializes by identifying all relevant form fields within a specified HTML form and then dynamically creates appropriate validator instances (`FormChildrenTypeNoFileValidate` or `FormChildrenTypeFileValidate`) for each field. This class also helps in organizing form field IDs based on the DOM events that should trigger their validation, simplifying event listener setup.

  Constructor

```typescript
constructor(formCssSelector: string = "form")
```

* **`formCssSelector` (optional)**: A CSS selector string that targets the HTML `<form>` element you wish to validate.
    * **Default Value**: `"form"` (will target the first `<form>` element found in the document if no specific selector is provided).

**Initialization Logic:**

The constructor performs the following key steps:
1.  **Form Identification**: It attempts to locate the `<form>` element using the provided `formCssSelector`. If no form is found, it throws an `Error`.
2.  **Field Collection**: It identifies all `input`, `select`, and `textarea` elements within the targeted form.
3.  **Exclusion Filtering**: It filters out certain input types that typically don't require client-side validation (e.g., `hidden`, `submit`, `datetime`, `datetime-local`, `time`, `month`).
4.  **ID Extraction**: It collects the `id` attributes of all eligible form fields. These IDs are crucial for later associating fields with DOM events.

### Key Internal Attributes

* `_idChildrens`: A private array of strings containing the `id` attributes of all validatable child elements within the form.
* `_form`: A jQuery object representing the HTML `<form>` element being validated.
* `_formChildrenValidate`: A private instance of `FormChildrenValidateInterface` (either `FormChildrenTypeNoFileValidate` or `FormChildrenTypeFileValidate`), representing the validator for the *last* child element whose validation was triggered.
* `_excludedTypes`: An array of `HTMLInputElement` types that are explicitly excluded from automatic validation.

### Public Methods

#### `autoValidateAllFields(): Promise<void>`

* **Description**: Iterates through all identified form fields, builds a validator instance for each, and triggers their respective `validate()` methods. This is useful for validating the entire form, for example, during form submission.
* **Usage**: Call this method when you need to perform a comprehensive validation check on all fields in the form.
    ```typescript
    const myFormValidator = new FormValidate('#myForm');
    myFormValidator.autoValidateAllFields()
        .then(() => console.log('All fields validated successfully!'))
        .catch(error => console.error('Form validation failed:', error));
    ```

#### `validateChildrenForm(target: HTMLFormChildrenElement): Promise<void>`

* **Description**: Validates a *specific* form field based on the provided target HTML element. It gets the appropriate validator instance for the `target` and runs its `validate()` method.
* **Usage**: This method is ideal for real-time, field-specific validation, such as when a user types in a field (`input` event) or leaves a field (`blur` event).
  
```typescript
    const myFormValidator = new FormValidate('#myForm');
    const emailInput = document.getElementById('email') as HTMLInputElement;

    emailInput.addEventListener('blur', async (event) => {
        try {
            await myFormValidator.validateChildrenForm(event.target as HTMLFormChildrenElement);
            // Handle valid field (e.g., remove error message)
        } catch (error) {
            // Handle invalid field (e.g., display error message)
        }
    });
```

#### `buildValidators(): FormChildrenValidateInterface[]`

* **Description**: Generates and returns an array of validator instances, one for each validatable child element in the form. This method does *not* trigger validation; it only prepares the validator objects.
* **Usage**: Can be used if you need programmatic access to all validator instances without immediately performing validation.

#### `clearErrorDataChildren(): void`

* **Description**: Clears any validation errors associated with the *last* validated child element. This method acts on the `_formChildrenValidate` instance, if it exists.
* **Usage**: Useful for clearing error messages related to a specific field, for example, when the user starts re-typing after an error was displayed.

### Private Helper Method

#### `private getValidatorInstance(target: HTMLFormChildrenElement): FormChildrenTypeFileValidate | FormChildrenTypeNoFileValidate`

* **Description**: This crucial private method dynamically determines and returns the correct validator class (`FormChildrenTypeFileValidate` for `type="file"` inputs, `FormChildrenTypeNoFileValidate` for others) based on the input element's type and its `media-type` attribute (for file inputs). It also injects the correct validator registry instances.
* **Usage**: Called internally by `autoValidateAllFields()` and `validateChildrenForm()`. It ensures that the appropriate validation logic is applied based on the field type.
* **Important**: For `type="file"` inputs, it **requires** the `media-type` HTML attribute (e.g., `media-type="image"`, `media-type="video"`, `media-type="document"`). If `media-type` is missing or unsupported for a file input, it will throw an `AttributeException` or a generic `Error`.

### Public Getters

#### `childrens: JQuery<HTMLFormChildrenElement>`

* **Description**: Returns a jQuery collection of all validatable input, select, and textarea elements within the form (excluding the `_excludedTypes`).
* **Usage**: Provides direct access to the jQuery wrapped form children for further manipulation or querying.

#### `idChildrenUsingEventBlur: string[]`

* **Description**: Returns an array of `id`s for form fields that have the `event-validate-blur="blur"` HTML attribute.
* **Usage**: Facilitates attaching blur event listeners to specific fields.

```html
    <input type="text" id="myInput" event-validate-blur="blur">
```

#### `idChildrenUsingEventInput: string[]`

* **Description**: Returns an array of `id`s for form fields that have the `event-validate-input="input"` HTML attribute.
* **Usage**: Facilitates attaching input event listeners for real-time validation as the user types.
    
```html
    <input type="text" id="myTextArea" event-validate-input="input">
```

#### `idChildrenUsingEventChange: string[]`

* **Description**: Returns an array of `id`s for form fields that have the `event-validate-change="change"` HTML attribute.
* **Usage**: Facilitates attaching change event listeners, particularly useful for `select` elements, checkboxes, and radio buttons.
  
```html
    <select id="mySelect" event-validate-change="change"></select>
```

#### `idChildrenUsingEventFocus: string[]`

* **Description**: Returns an array of `id`s for form fields that have the `event-validate-focus="focus"` HTML attribute.
* **Usage**: Facilitates attaching focus event listeners, though validation on focus is less common. Can be used for specific UI behaviors.
  
```html
    <input type="text" id="myFocusInput" event-validate-focus="focus">
```

#### `idChildrens: string[]`

* **Description**: Returns the initial array of `id`s for all validatable child elements collected during the constructor phase.
* **Usage**: Provides a comprehensive list of all field IDs that the `FormValidate` instance is managing.

#### `form: JQuery<HTMLFormElement>`

* **Description**: Returns the jQuery object representing the HTML form associated with this `FormValidate` instance.
* **Usage**: Provides direct access to the form element itself for DOM manipulation or event handling.

### Using the `FormValidate` Class in Practice

This section demonstrates how to integrate and use the `FormValidate` class within a jQuery `$(function)` block to manage form validation dynamically based on user interactions.

 Overview

The provided code snippet illustrates a common pattern for setting up client-side form validation. It leverages the `FormValidate` class to:

1.  **Initialize Form Validation**: Create an instance of `FormValidate` targeting a specific HTML form.
2.  **Format Input Fields**: Apply custom formatting rules to certain input fields (e.g., converting last names to uppercase, capitalizing usernames).
3.  **Attach Event Listeners**: Dynamically attach `blur`, `input`, and `change` event listeners to form fields. The `FormValidate` class helps identify which fields should trigger validation on which events using custom HTML attributes.
4.  **Handle Validation Outcomes**: Listen for custom events (`FieldValidationFailed` and `FieldValidationSuccess`) emitted by the validation system to provide real-time feedback to the user.

## Code Breakdown and Usage

```javascript
jQuery(function validateInput() {
  /**
   * Initialize FormValidate for a specific form
   * The '#form_validate' selector targets the HTML form with id="form_validate"
   */
  const formValidate = new FormValidate('#form_validate');

  /**
   * Get IDs of fields configured for specific validation events
   * The addHashToIds function (from your other documentation) prefixes each ID with '#'.
   * .join(",") creates a comma-separated string of selectors (e.g., "#field1,#field2").
   * These strings are used as event delegation selectors for jQuery's .on() method.
   */
  const idsBlur = addHashToIds(formValidate.idChildrenUsingEventBlur).join(",");
  const idsInput = addHashToIds(formValidate.idChildrenUsingEventInput).join(",");
  const idsChange = addHashToIds(formValidate.idChildrenUsingEventChange).join(",");

  /**
   * Event Listener: 'blur'
   * Triggers validation when a field loses focus.
   *
   * HTML Attribute requirement: The input field must have the attribute
   * `event-validate-blur="blur"` for its ID to be included in `idsBlur`.
   */
  formValidate.form.on("blur", `${idsBlur}`, (event: JQuery.BlurEvent) => {
    const target = event.target;
    // Ensure the target is an HTML input or textarea element before validating
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      console.log("Blur event triggered for:", event);
      // Validate the specific field that triggered the blur event
      formValidate.validateChildrenForm(event.target as HTMLFormChildrenElement);
    }
  });

  /**
   * Custom Event Listener: 'FieldValidationFailed'
   * Fired when a field validation fails. This event is typically dispatched
   * by your `FormChildrenValidateInterface` implementation (e.g., `FormChildrenTypeNoFileValidate`)
   * when `validate()` finds errors.
   *
   * Data provided: A `CustomEvent` with `detail` containing `targetChildrenForm` (the HTML element)
   * and `message` (the error message).
   */
  formValidate.form.on(FieldValidationFailed, (event: JQuery.TriggeredEvent) => {
    // Cast the originalEvent to CustomEvent to access its 'detail' property
    const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
    console.log("Validation failed for:", data.targetChildrenForm, "Message:", data.message);
    // Call a utility function to display the error message next to the field
    addErrorMessageFieldDom(jQuery(data.targetChildrenForm), data.message);
  });

  /**
   * Custom Event Listener: 'FieldValidationSuccess'
   * Fired when a field validation succeeds (or no errors are found). Similar to `FieldValidationFailed`,
   * this event is dispatched by your validator implementation.
   *
   * Data provided: A `CustomEvent` with `detail` containing `targetChildrenForm` (the HTML element)
   * and potentially other data.
   */
  formValidate.form.on(FieldValidationSuccess, (event: JQuery.TriggeredEvent) => {
    const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
    console.log("Validation success for:", data.targetChildrenForm);
    // In a real application, you might hide an error message here
  });

  /**
   * Event Listener: 'input'
   * Triggers when the value of an <input> or <textarea> element is changed.
   *
   * HTML Attribute requirement: The input field must have the attribute
   * `event-validate-input="input"` for its ID to be included in `idsInput`.
   */
  formValidate.form.on('input', `${idsInput}`, (event: JQuery.Event | any) => {
    const target = event.target;
    console.log("Input event triggered for:", event);
    // Clear any previous error messages when the user starts typing
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      if (target) {
        clearErrorInput(jQuery(target)); // Utility to visually clear error
        formValidate.clearErrorDataChildren(); // Clear error data within FormValidate
      }
    }
  });

  /**
   * Event Listener: 'change'
   * Triggers when the value of an <input>, <select>, or <textarea> element changes
   * and the element loses focus (for text inputs), or immediately for select/checkbox/radio.
   *
   * HTML Attribute requirement: The input field must have the attribute
   * `event-validate-change="change"` for its ID to be included in `idsChange`.
   */
  formValidate.form.on('change', `${idsChange}`, (event: JQuery.ChangeEvent) => {
    const target = event.target;
    console.log("Change event triggered for:", event);
    // Clear any previous error messages, especially relevant for select/checkbox/radio
    if (target instanceof HTMLInputElement) { // Can also be HTMLSelectElement or HTMLTextAreaElement
      if (target) {
        clearErrorInput(jQuery(target)); // Utility to visually clear error
        formValidate.clearErrorDataChildren(); // Clear error data within FormValidate
      }
    }
  });
});
```

## How to Set Up Your HTML for `FormValidate`

To make this JavaScript code work effectively, your HTML form fields need specific `id` attributes and custom `event-validate-*` attributes.

**Required Attributes on Form Fields:**

* **`id` Attribute**: Every field you want `FormValidate` to manage **must have a unique `id` attribute**. This is how `FormValidate` identifies and tracks individual fields.

**Custom Attributes for Event-Driven Validation:**

You'll use these attributes on your `input`, `select`, and `textarea` elements to tell `FormValidate` which DOM event should trigger validation for that specific field.

* `event-validate-blur="blur"`: Add this attribute to fields that should be validated when they lose focus.

```html
    <input type="text" id="emailInput" name="email" event-validate-blur="blur" required>
```

* `event-validate-input="input"`: Add this attribute to fields that should be validated as the user types (real-time validation).

```html
    <textarea id="messageTextarea" name="message" event-validate-input="input"></textarea>
```

* `event-validate-change="change"`: Add this attribute to fields (especially `select`, `checkbox`, `radio`) that should be validated when their value changes.

```html
    <select id="countrySelect" name="country" event-validate-change="change">
      <option value="">Select a Country</option>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
    </select>

    <input type="checkbox" id="agreeTerms" name="terms" value="true" event-validate-change="change">
    <label for="agreeTerms">I agree to the terms</label>
```

* `event-validate-focus="focus"`: Although not used in this specific snippet, you could also add this attribute for validation on focus, if needed.

```html
    <input type="text" id="focusField" name="focusTest" event-validate-focus="focus">
```

**For File Inputs (`<input type="file">`):**

As per the `FormChildrenTypeFileValidate` documentation, file inputs require a `media-type` attribute:

* `media-type="image" | "video" | "document"`: This attribute is **mandatory** for `type="file"` inputs and dictates the specific type of media validation to apply.
  
```html
    <input type="file" id="profilePicture" name="profile_picture" media-type="image" event-validate-change="change">
```

**Note**: The example assumes the existence of:
* `formFormattingEvent`: An object with methods like `lastnameToUpperCase`, `capitalizeUsername`, `usernameFormatDom`.
* `addHashToIds`: A function to prefix IDs with `#`.
* `FieldValidationFailed`, `FieldValidationSuccess`: Custom event names (likely string constants).
* `FieldValidationEventData`: An interface defining the structure of the data passed with validation events.
* `addErrorMessageFieldDom`, `clearErrorInput`: Utility functions to interact with the DOM for displaying/clearing error messages.

This setup provides a highly configurable and event-driven approach to form validation, allowing you to define validation triggers and rules directly within your HTML.


# string function and formatting

## FormFormattingEvent Library

 Overview

The `FormFormattingEvent` library provides utility functions to format user input in forms, such as transforming last names to uppercase, capitalizing usernames, and ensuring a standardized username format.

Installation

Ensure that your project supports ES6 module imports. You can import the library as follows:

```javascript
import {FormFormattingEvent} from "@wlindabla/form_validator";
const formFormattingEvent = FormFormattingEvent.getInstance();
```

Usage

### 1. Convert Last Name to Uppercase

The `lastnameToUpperCase` function ensures that the last name is converted to uppercase.

**Syntax:**

```javascript
formFormattingEvent.lastnameToUpperCase(element, locale);
```

**Example:**

```javascript
jQuery(function validateInput() {
  formFormattingEvent.lastnameToUpperCase(this, 'en');
});
```

### 2. Capitalize Username

The `capitalizeUsername` function capitalizes the first letter of each word in the username while maintaining a proper name format.

**Syntax:**

```javascript
formFormattingEvent.capitalizeUsername(element, separator, finalSeparator, locale);
```

**Example:**

```javascript
jQuery(function validateInput() {
  formFormattingEvent.capitalizeUsername(this, " ", " ", 'en');
});
```

### 3. Format Username Dom

The `usernameFormatDom` function applies complete formatting to the username field, ensuring proper capitalization and spacing.

**Syntax:**

```javascript
formFormattingEvent.usernameFormatDom(element, separator, finalSeparator, locale);
```

**Example:**

```javascript
jQuery(function validateInput() {
  formFormattingEvent.usernameFormatDom(this, " ", " ", 'en');
});
```

## Notes

- These functions are designed to be used within a jQuery context.
- Ensure that your form elements trigger these functions appropriately on user input events such as `blur` or `change`.

## License

This library is licensed under MIT. Feel free to use and modify it as needed.

## Contributing

If you find any issues or have suggestions for improvements, feel free to submit a pull request or open an issue on the repository.

📌 `escapeHtmlBalise` – Escape HTML Content Securely

## 📖 Description

The `escapeHtmlBalise` function is a utility designed to sanitize and escape HTML characters in strings, arrays, and objects. It ensures that any potential HTML content is either removed or converted into a safe format to prevent XSS (Cross-Site Scripting) attacks.

---

Then, import the function into your project:

```ts
import { escapeHtmlBalise } from "@wlindabla/form_validator";
```

---

## 🛠️ Function Usage

### 📌 Signature

```ts
escapeHtmlBalise(
    content: string | string[] | Record<string, any>,
    stripHtmlTags: boolean = true
): string | string[] | Record<string, any>
```

### 📌 Parameters

| Parameter        | Type                            | Default | Description |
|-----------------|--------------------------------|---------|-------------|
| `content`       | `string | string[] | Record<string, any>` | - | The input data to be escaped. It can be a string, an array of strings, or an object containing strings. |
| `stripHtmlTags` | `boolean`                      | `true`  | If `true`, HTML tags are removed. If `false`, tags are preserved but escaped. |

---

## 📤 Return Value

The function returns:

- A **string** if the input is a single string.
  
- An **array of strings** if the input is an array.
- An **object with all values escaped** if the input is an object.

---

## 📌 Example Usage

### 🟢 Escaping a Single String

```ts
const unsafeString = "<script>alert('XSS Attack!')</script>";
const safeString = escapeHtmlBalise(unsafeString);
console.log(safeString); 
// Output: alert('XSS Attack!')
```

### 🟢 Processing an Array of Strings

```ts
const unsafeArray = ["<b>Bold</b>", "<i>Italic</i>", "<script>maliciousCode()</script>"];
const safeArray = escapeHtmlBalise(unsafeArray);
console.log(safeArray);
// Output: ["Bold", "Italic", "maliciousCode()"]
```

### 🟢 Escaping an Object

```ts
const unsafeObject = {
    name: "<h1>John Doe</h1>",
    bio: "<p>Hello <script>alert('Hacked!')</script></p>"
};
const safeObject = escapeHtmlBalise(unsafeObject);
console.log(safeObject);
// Output: { name: "John Doe", bio: "Hello alert('Hacked!')" }
```

### 🟢 Keeping HTML Tags but Escaping Special Characters

```ts
const unsafeString = "<b>Important</b>";
const safeString = escapeHtmlBalise(unsafeString, false);
console.log(safeString);
// Output: "&lt;b&gt;Important&lt;/b&gt;"
```

---

## 🔥 Error Handling

If `escapeHtmlBalise` is called with `null`, `undefined`, or an empty object, it throws the following error:

```ts
throw new Error("I expected a string no empty,array or object but it is not yet");
```

---

## 💡 Additional Notes

- This function **does not decode** escaped characters (e.g., `&lt;` stays `&lt;`).
- When `stripHtmlTags` is set to `false`, HTML tags remain but are encoded.

---

## 🛠️ Related Functions

- `formFormattingEvent.lastnameToUpperCase(this, 'en');`
- `formFormattingEvent.capitalizeUsername(this, " ", " ", 'en');`
- `formFormattingEvent.usernameFormatDom(this," "," ","en");`

### `ucfirst` Function

The `ucfirst` function capitalizes the first letter of a word and converts the rest to lowercase.

 Parameters

- **`str`** (`string`): The input string to transform. This is the word or phrase on which the function will operate.
- **`escapeHtmlBalise_string`** (`boolean`, optional, default value: `true`): If `true`, the HTML tags in the string will be escaped before applying the transformation. If `false`, the HTML tags will be left as they are.
- **`locales`** (`string | string[]`, optional): Defines the locale(s) to use for capitalization (e.g., `'fr'` for French, `'en'` for English). If not specified, the default locale will be used.

  Returns

The function returns a formatted string where the first letter is uppercase and the rest are lowercase. For example, "agbokoudjo" becomes "Agbokoudjo".

Example Usage

```typescript
import { ucfirst } from '@wlindabla/form_validator';

const result = ucfirst("agbokoudjo"); 
console.log(result); // Outputs "Agbokoudjo"

const resultWithHtmlEscape = ucfirst("<b>agbokoudjo</b>", true);
console.log(resultWithHtmlEscape); // Outputs "&lt;b&gt;Agbokoudjo&lt;/b&gt;"

const resultWithCustomLocale = ucfirst("agbokoudjo", true, 'fr');
console.log(resultWithCustomLocale); // Outputs "Agbokoudjo"
```

### `nl2br` Function

This function automatically adds line breaks (`<br>`) to a string wherever there are newlines.

Parameters

- **`str`** (`string`): The input string to which line breaks will be added.

Returns

The function returns the string with `<br>` inserted wherever newlines exist.

Example Usage

```typescript
import { nl2br } from '@wlindabla/form_validator';

const result = nl2br("Hello\nWorld");
console.log(result); // Outputs "Hello<br>World"
```

### `capitalizeString` Function

The `capitalizeString` function capitalizes the first letter of each word in a string and converts the rest to lowercase. It's ideal for formatting names or titles.

Parameters

- **`data`** (`string`): The string to be transformed.
- **`separator_toString`** (`string`, optional, default value: `" "`): The separator used to split the string into words.
- **`finale_separator_toString`** (`string`, optional, default value: `" "`): The separator used to join the formatted words.
- **`escapeHtmlBalise_string`** (`boolean`, optional, default value: `true`): If `true`, HTML tags in the string will be escaped.
- **`locales`** (`string | string[]`, optional): The locale(s) used for the capitalization.

 Returns

The function returns a string where the first letter of each word is capitalized, and the rest are in lowercase.

 Example Usage

```typescript
import { capitalizeString } from '@wlindabla/form_validator';

const result = capitalizeString("hounha franck empedocle");
console.log(result); // Outputs "Hounha Franck Empedocle"

const resultWithCustomSeparator = capitalizeString("hounha, franck, empedocle", ",");
console.log(resultWithCustomSeparator); // Outputs "Hounha, Franck, Empedocle"
```

### `usernameFormat` Function

This function formats a full name by capitalizing the first letter of each first name and last name, while placing the last name either at the beginning or the end of the string.

 Parameters

- **`value_username`** (`string`): The full name to format (e.g., first name and last name).
- **`position_lastname`** (`"left" | "right"`, optional, default value: `"left"`): The position of the last name in the formatted string (`"left"` places the last name first, `"right"` places it last).
- **`separator_toString`** (`string`, optional, default value: `" "`): The separator used to split the string into words.
- **`finale_separator_toString`** (`string`, optional, default value: `" "`): The separator used to join the formatted words.
- **`locales`** (`string | string[]`, optional): The locale(s) used for uppercase formatting.

 Returns

The function returns the formatted full name, with the last name placed according to the `position_lastname` argument. It capitalizes the first letter of each first name and last name.

 Example Usage

```typescript
import { usernameFormat } from '@wlindabla/form_validator';
const resultLeft = usernameFormat("Agbokoudjo hounha franck empedocle", "left");
console.log(resultLeft); // Outputs "AGBOKOUDJO Hounha Franck Empedocle"

const resultRight = usernameFormat("hounha franck empedocle Agbokoudjo", "right");
console.log(resultRight); // Outputs "Hounha Franck Empedocle AGBOKOUDJO"
```

### `toBoolean`

```typescript
export function toBoolean(value: string | null | undefined): boolean
````

**Description:**

This function converts a string value to its boolean representation. It recognizes a specific set of truthy and falsy string values. For any other string input, it logs a warning and defaults to returning `false`.

**Parameters:**

  * `value`: `string | null | undefined` - The string to be converted to a boolean. The function also handles `null` and `undefined` inputs by returning `false`.

**Truthy Values (case-insensitive and trimmed):**

  * `"true"`
  * `"1"`
  * `"yes"`

**Falsy Values (case-insensitive and trimmed):**

  * `"false"`
  * `"0"`
  * `"no"`

**Returns:**

  * `boolean`: The boolean representation of the input string. Returns `true` if the normalized (trimmed and lowercased) input is one of the recognized truthy values. Returns `false` if the normalized input is one of the recognized falsy values, or if the input is `null`, `undefined`, or any other unrecognized string.

**Warning:**

  * If the input `value` is a string that does not match any of the recognized truthy or falsy values, a warning message is logged using `Logger.warn`, indicating the unrecognized string. The function then returns `false`.

**Example Usage:**

```typescript
import { toBoolean } from './utils'; // Assuming your function is in utils.ts


console.log(toBoolean("true"));   // Output: true
console.log(toBoolean("1"));      // Output: true
console.log(toBoolean("yes"));    // Output: true
console.log(toBoolean("FALSE"));  // Output: false
console.log(toBoolean("0"));      // Output: false
console.log(toBoolean("No"));     // Output: false
console.log(toBoolean("  true ")); // Output: true (trimmed)
console.log(toBoolean("maybe"));   // Output: false (and logs a warning)
console.log(toBoolean(null));      // Output: false
console.log(toBoolean(undefined)); // Output: false
console.log(toBoolean(""));        // Output: false (and logs a warning)
```

### `addHashToIds`

This function takes an array of strings (typically IDs) and returns a new array where each string is prefixed with a hash symbol (`#`). This is commonly useful when preparing IDs for use as CSS selectors or URL fragments.

```typescript
export function addHashToIds(ids: string[]): string[]
```

#### Parameters

* `ids` (string[]): An array of strings that represent identifiers.

#### Returns

* `string[]`: A new array where each original `id` string is now prefixed with `#`.

#### Example

```typescript
import { addHashToIds } from './path/to/your/module'; // Adjust the import path as needed

const myRawIds = ["header", "navigation", "footer"];
const hashedIds = addHashToIds(myRawIds);

console.log(hashedIds); 
// Expected output: ["#header", "#navigation", "#footer"]
```

# `Logger` Class Documentation

This documentation provides a guide to using the `Logger` class, a simple yet effective utility for managing console output based on your application's environment and debugging settings.

## Class `Logger`

The `Logger` class is a **singleton** utility designed to provide controlled logging capabilities within your application. It allows you to output messages to the console (`log`, `warn`, `error`, `info`) while respecting different application environments (`dev`, `prod`, `test`) and a global debug flag.

### Core Features:

* **Singleton Pattern**: Ensures only one instance of the `Logger` exists throughout your application, providing a centralized logging configuration.
* **Environment-Aware Logging**: Adjusts logging behavior based on the `APP_ENV` (Application Environment) property, allowing for verbose output in development and stricter control in production.
* **Debug Control**: A `DEBUG` flag offers an additional layer of control over when messages are displayed.
* **Timestamped Messages**: All log messages are automatically prefixed with an ISO timestamp and the log type for better traceability.

### Properties

* `APP_ENV: Env`
    * **Description**: Defines the current application environment. It can be `"dev"`, `"prod"`, or `"test"`.
    * **Default Value**: `"dev"`
    * **Usage**: Controls which log messages are displayed. For instance, `info` messages might only appear in `dev` mode.

* `DEBUG: boolean`
    * **Description**: A global debug flag. When `true`, more verbose logging might occur. When `false`, certain log types might be suppressed, even in non-production environments.
    * **Default Value**: `true`
    * **Usage**: Use this to quickly toggle detailed logging on or off without changing `APP_ENV`.

### Constructor

The `Logger` class has a `private` constructor. This means you **cannot** directly create instances using `new Logger()`. This enforces the singleton pattern, ensuring you always work with the single, shared instance of the logger.

### Public Static Methods

Since `Logger` is a singleton with a private constructor, you interact with it entirely through its static methods.

#### `static getInstance(): Logger`

* **Description**: This is the **only way** to get an instance of the `Logger` class. It implements the singleton pattern, ensuring that if an instance already exists, it's returned; otherwise, a new one is created and returned.
* **Usage**: You'll typically call this once at the beginning of your application or whenever you need to configure the logger's `APP_ENV` or `DEBUG` properties.
    ```typescript
    const logger = Logger.getInstance();
    logger.APP_ENV = "prod"; // Set environment to production
    logger.DEBUG = false;    // Disable debug output
    ```

#### `static log(...args: any[]): void`

* **Description**: Logs a general message to the console using `console.log`.
* **Logging Conditions**: Messages are logged only if `DEBUG` is `true` **AND** `APP_ENV` is not `"prod"`.
* **Usage**: Use for general information, tracking flow, or debugging messages that are not critical errors.
    ```typescript
    Logger.log("User logged in:", userId);
    ```

#### `static warn(...args: any[]): void`

* **Description**: Logs a warning message to the console using `console.warn`.
* **Logging Conditions**: Messages are logged if `DEBUG` is `true` **OR** `APP_ENV` is not `"prod"`. This means warnings are more likely to appear than regular logs.
* **Usage**: Use for potential issues, deprecated features, or situations that don't break the application but warrant attention.
    ```typescript
    Logger.warn("API response was slower than expected for endpoint:", url);
    ```

#### `static error(...args: any[]): void`

* **Description**: Logs an error message to the console using `console.error`.
* **Logging Conditions**: **Always** logs the message, regardless of `DEBUG` flag or `APP_ENV`. Errors are considered critical and should always be visible.
* **Usage**: Use for critical failures, caught exceptions, or unexpected behavior that prevents an operation from completing successfully.
    ```typescript
    try {
        // Some operation
    } catch (e) {
        Logger.error("Failed to process data:", e);
    }
    ```

#### `static info(...args: any[]): void`

* **Description**: Logs an informational message to the console using `console.info`.
* **Logging Conditions**: Messages are logged only if `DEBUG` is `true` **AND** `APP_ENV` is `"dev"`. This makes `info` logs strictly for development-time debugging.
* **Usage**: Use for highly detailed debugging information that you only want to see during active development.
    ```typescript
    Logger.info("Detailed debug info:", dataObject, "from function:", funcName);
    ```

---

## How to Use the `Logger` Class

### 1. Configure the Logger (Optional, but Recommended)

At the very beginning of your application (e.g., `main.ts`, `app.ts`), get the logger instance and set its environment and debug flags.

```typescript
// app.ts or main.ts
import { Logger } from '@wlindabla/form_validator'; // Adjust path as needed

// Get the singleton instance
const logger = Logger.getInstance();

// Configure environment and debug mode
// This could be based on environment variables (e.g., process.env.NODE_ENV)
logger.APP_ENV = "dev"; // or "prod", "test"
logger.DEBUG = true;   // or false

console.log("Logger configured!");
```

### 2. Use Logging Methods Throughout Your Code

Once configured, you can call the static logging methods from anywhere in your application. You don't need to pass the `logger` instance around; just import the `Logger` class.

```typescript
import { Logger } from '@wlindabla/form_validator'; 

// In a service or component
class UserService {
    fetchUsers() {
        Logger.log("Attempting to fetch users...");
        fetch('/api/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                Logger.info("Users data received:", data);
                // Process data
            })
            .catch(error => {
                Logger.error("Error fetching users:", error);
                Logger.warn("User fetch failed, showing fallback data.");
            });
    }
}

const userService = new UserService();
userService.fetchUsers();

// Example of different log outputs based on configuration:
// If APP_ENV = "dev" and DEBUG = true:
// 2024-05-27T10:00:00.000Z [LOG] Attempting to fetch users...
// 2024-05-27T10:00:01.500Z [INFO] Users data received: [...]
// (If an error occurs) 2024-05-27T10:02:00.000Z [ERROR] Error fetching users: ...
// (If an error occurs) 2024-05-27T10:02:00.000Z [WARN] User fetch failed, showing fallback data.

// If APP_ENV = "prod" and DEBUG = false:
// (Only errors would be logged)
// 2024-05-27T10:02:00.000Z [ERROR] Error fetching users: ...
```

# The Exception

### `AttributeException`

```typescript
export class AttributeException extends Error
```

**Description:**

This class defines a custom exception that is specifically intended to be thrown when a required attribute is missing from a Document Object Model (DOM) element. It extends the built-in `Error` class and includes contextual information about the missing attribute, the element it was expected on, and its parent container. Upon instantiation, it also logs the error message using the `Logger.error` method.

**Constructor:**

```typescript
constructor(
    private readonly attributeName: string,
    private readonly childrenName: string,
    private readonly parentName: string
)
```

**Parameters:**

  * `attributeName`: `string` - The name of the missing attribute (e.g., `'pattern'`, `'value'`, `'id'`).
  * `childrenName`: `string` - The `name` or identifier of the DOM element that is missing the attribute.
  * `parentName`: `string` - The `name` or identifier of the parent container of the DOM element where the attribute is missing (e.g., a form name).

**Functionality:**

  * **Custom Error Message:** When an `AttributeException` is created, it generates a descriptive error message that includes the name of the missing attribute, the name of the child element, and the name of the parent container. This message provides clear context about the error.
  * **Correct Error Name:** The `name` property of the error object is explicitly set to `'AttributeException'`. This is helpful for identifying the type of error in `catch` blocks or during debugging.
  * **Error Logging:** Upon instantiation, the constructor automatically logs the generated error message using the `Logger.error` method (assuming a `Logger` with an `error` method is available in the scope). This ensures that missing attribute errors are immediately recorded.
  * **Prototype Correction:** The `Object.setPrototypeOf(this, AttributeException.prototype)` line is included to ensure that the prototype chain is correctly established, especially when the error might be caught in a plain JavaScript environment where class inheritance might not be fully handled as in TypeScript.

**Example Usage:**

```typescript
import { Logger } from './logger'; // Assuming you have a logger module

// Simulate a scenario where an input element is expected to have a 'pattern' attribute
const inputElement = document.createElement('input');
inputElement.name = 'myInput';
const formName = 'myForm';

if (!inputElement.getAttribute('pattern')) {
    throw new AttributeException('pattern', inputElement.name, formName);
}

// In a catch block:
try {
    // ... some code that might throw AttributeException
} catch (error) {
    if (error instanceof AttributeException) {
        console.error('Caught an AttributeException:', error.message);
        // Handle the missing attribute error specifically
    } else {
        console.error('An unexpected error occurred:', error);
    }
}
```

**Purpose in Your Codebase:**

This `AttributeException` class likely serves as a specific way to handle situations where certain HTML attributes, such as `pattern` in the context of input validation, are expected to be present on DOM elements but are not found. By throwing a custom exception, you can:

  * **Clearly identify the type of error.**
  * **Provide detailed information in error messages and logs.**
  * **Implement specific error handling logic** in `catch` blocks based on the type of exception.
````

# URL Utility Functions

This module contains utility functions to manipulate URLs by adding query parameters or creating URLs from form data.

## Features

### `addParamToUrl`

This function adds query parameters to an existing URL. It also allows you to return the modified URL either as a string or as an instance of the `URL` object.

#### Parameters

- **`urlparam`** (`string | URL`): The URL to which parameters should be added. This can be a string representing a URL or an instance of the `URL` object.
- **`addparamUrlDependencie`** (`Record<string, any> | null`, optional, default: `null`): An object representing the URL parameters to add, in key-value pairs. If `null`, no additional parameters will be added.
- **`returnUrl`** (`boolean`, optional, default: `true`): If `true`, the function returns the modified URL as a string. If `false`, it returns an instance of the `URL` object.
- **`baseUrl`** (`string | URL | undefined`, optional, default: `window.location.origin`): The base URL to use for the given `urlparam`. By default, it uses the current window's origin.

#### Return

The function returns either:
- A **string** representing the modified URL (if `returnUrl = true`), or
- An **instance of the `URL` object** representing the modified URL (if `returnUrl = false`).

#### Example Usage

```typescript
import { addParamToUrl } from '@wlindabla/form_validator';

// Adding parameters to a given URL
const updatedUrl = addParamToUrl('https://example.com', { page: 2, sort: 'asc' });
console.log(updatedUrl); // Logs the URL with the new parameters as a string

// Returning a URL instance
const urlInstance = addParamToUrl('https://example.com', { page: 2 }, false);
console.log(urlInstance instanceof URL); // Logs 'true'
```

### `buildUrlFromForm`

This function creates a URL by extracting parameters from an HTML form and adding additional parameters to it.

#### Parameters

- **`formElement`** (`HTMLFormElement`): The form element from which the data will be extracted to build the URL.
- **`form_action`** (`string | null`, optional, default: `null`): The form action URL to use as the base for the URL. If not specified, the action URL of the `formElement` is used.
- **`addparamUrlDependencie`** (`Record<string, any> | null`, optional): An object representing additional parameters to add to the URL, in key-value pairs.
- **`returnUrl`** (`boolean`, optional, default: `true`): If `true`, the function returns the URL as a string. If `false`, it returns an instance of the `URL` object.
- **`baseUrl`** (`string | URL | undefined`, optional, default: `window.location.origin`): The base URL to use for the constructed URL.

#### Return

The function returns either:
- A **string** representing the constructed URL with the form parameters and additional parameters (if `returnUrl = true`), or
- An **instance of the `URL` object** representing the constructed URL (if `returnUrl = false`).

#### Example Usage

```typescript
import { buildUrlFromForm } from '@wlindabla/form_validator';

// Assuming we have a form element in our HTML
const form = document.querySelector('form') as HTMLFormElement;
const additionalParams = { userId: 123 };

// Building the URL from the form data and adding additional parameters
const formUrl = buildUrlFromForm(form, null, additionalParams);
console.log(formUrl); // Logs the URL with form parameters and additional parameters
```

### **httpFetchHandler Function**
The `httpFetchHandler` function is an asynchronous utility for making HTTP requests with built-in timeout handling, retry attempts, and automatic response parsing.

### **Parameters**
| Parameter       | Type                                  | Default Value    | Description |
|----------------|--------------------------------------|-----------------|-------------|
| `url`          | `string | URL`                      | **Required**     | The API endpoint to send the request to. |
| `methodSend`   | `string`                             | `"GET"`          | The HTTP method (`GET`, `POST`, `PUT`, `DELETE`, etc.). |
| `data`         | `any`                                | `null`           | The data to send in the request body (supports JSON and FormData). |
| `optionsheaders` | `HeadersInit`                     | `{ 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }` | Custom headers for the request. |
| `timeout`      | `number`                             | `5000` (5 sec)   | The maximum time (in milliseconds) before the request is aborted. |
| `retryCount`   | `number`                             | `3`              | Number of times to retry the request if it fails. |
| `responseType` | `'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData' | 'stream'` | `'json'`          | The expected response format. |

### **Return Value**
The function returns a `Promise` that resolves to the requested data in the specified `responseType`.

### **Function Workflow**
1. **FormData Handling**  
   - If `data` is an instance of `FormData`, it automatically manages headers.
   - The `"Content-Type"` header is **removed** to let the browser set it correctly.

2. **Headers Handling**  
   - If the headers are a `HeadersInit` object, they are converted to a mutable object using:  
     ```ts
     Object.fromEntries(new Headers(optionsheaders).entries());
     ```
   - This avoids `TypeScript` errors when modifying headers.

3. **Data Handling with `JSON.stringify`**  
   - When sending `JSON` data, the function **automatically converts it** using `JSON.stringify(data)`.  
   - **Important:** Do not manually stringify the data before passing it, to avoid double encoding.  
   - Example:  
     ```ts
     httpFetchHandler({ url: "/api", methodSend: "POST", data: { name: "John" } });
     ```
     ✅ The function internally does:  
     ```ts
     JSON.stringify({ name: "John" });
     ```

4. **Request Timeout Handling**  
   - Uses `AbortController` to automatically cancel requests after `timeout` milliseconds.

5. **Retry Mechanism**  
   - If the request fails, the function retries up to `retryCount` times before throwing an error.

### **Example Usage**
```ts
import { httpFetchHandler } from '@wlindabla/form_validator';
const response = await httpFetchHandler({
  url: "https://api.example.com/data",
  methodSend: "POST",
  data: { username: "Alice" },
  responseType: "json"
});

console.log(response); // Parsed JSON response
```
### `mapStatusToResponseType(status: number): 'success' | 'info' | 'warning' | 'error'`

This function maps an HTTP status code to a response type, which helps in categorizing the status for easier handling in the application. The response type is returned based on the HTTP status code provided as input.

#### Parameters:
- `status` (number): The HTTP status code received from an API response. This value is used to determine the appropriate response type.

#### Returns:
- **'success'**: For status codes in the 200–299 range, indicating successful requests (e.g., `200 OK`, `201 Created`).
- **'info'**: For status codes in the 100–199 range, indicating informational responses (e.g., `100 Continue`, `101 Switching Protocols`).
- **'warning'**: For status codes in the 300–399 range, indicating redirection responses (e.g., `301 Moved Permanently`, `302 Found`).
- **'error'**: For status codes in the 400–499 range, indicating client errors (e.g., `404 Not Found`, `401 Unauthorized`), and for status codes in the 500–599 range, indicating server errors (e.g., `500 Internal Server Error`, `503 Service Unavailable`).

If the status code is not covered by the defined ranges, it defaults to `'error'` for safety.

#### Example usage:
```typescript
const responseType = mapStatusToResponseType(200);
console.log(responseType); // 'success'

const responseType = mapStatusToResponseType(404);
console.log(responseType); // 'error'
```

# `ApiError` Class Documentation

The `ApiError` class is designed to handle and process errors returned from an API, particularly focusing on violation errors, which are common in validation processes. This class makes it easier to extract specific error messages related to each field, and also provides a structured way to retrieve all violation messages.

## **Class: `ApiError`**
### **Constructor:**
```typescript
import { ApiError } from "@wlindabla/form_validator";
constructor(data: Record<string, unknown>, status: number)
```

#### **Parameters:**
- **`data`**: The data returned from the API, usually containing information about errors and violations (e.g., validation errors).
  - Type: `Record<string, unknown>`
  - Structure:
      ```json
        {
          "title": "Validation Failed",
          "detail": "Some fields failed validation.",
          "violations": [
            {
              "propertyPath": "name",
              "message": "This field is required."
            },
            {
              "propertyPath": "email",
              "message": "Invalid email format."
            }
          ]
        }
  ```

- **`status`**: The HTTP status code returned from the API, indicating the response status (e.g., 400 for bad request, 422 for unprocessable entity).
  - Type: `number`

#### **`violationsFor(field: string): string[]`**
```typescript
violationsFor(field: string): string[]
```

#### **Description:**
This method retrieves the list of violation messages for a specific field. It filters the violations by `propertyPath` and returns an array of messages related to that field.

#### **Parameters:**
- **`field`**: The name of the field for which violations are being retrieved.
  - Type: `string`

#### **Returns:**
- **`string[]`**: An array of violation messages related to the specified field. If no violations are found for the field, it returns an empty array.

#### **Example Usage:**
```typescript
const apiError = new ApiError({
    "violations": [
        { "propertyPath": "username", "message": "Username is required" },
        { "propertyPath": "email", "message": "Invalid email address" }
    ]
}, 400);

const usernameViolations = apiError.violationsFor("username");
console.log(usernameViolations); // ["Username is required"]
```
#### **`name`**
```typescript
get name(): string
```

#### **Description:**
This getter method returns a string combining the error title and detail. If the error detail is not available, it only returns the title.

#### **Returns:**
- **`string`**: The combined title and detail of the error.

#### **Example Usage:**
```typescript
const apiError = new ApiError({
    "title": "Validation Error",
    "detail": "One or more fields are invalid"
}, 400);

console.log(apiError.name); // "Validation Error One or more fields are invalid"
```
#### **`allViolations`**
```typescript
get allViolations(): Record<string, string[]>
```

#### **Description:**
This getter method organizes and retrieves all violation messages grouped by `propertyPath` (the field name). If there are no violations, it returns an object containing a `main` key with a general error message.

#### **Returns:**
- **`Record<string, string[]>`**: An object where each key is a field name (`propertyPath`), and the value is an array of violation messages for that field. If no violations are found, it returns an object with a `main` key.

#### **Example Usage:**
```typescript
const apiError = new ApiError({
    "violations": [
        { "propertyPath": "username", "message": "Username is required" },
        { "propertyPath": "email", "message": "Invalid email address" },
        { "propertyPath": "username", "message": "Username must be unique" }
    ]
}, 400);

console.log(apiError.allViolations);
// {
//   username: ["Username is required", "Username must be unique"],
//   email: ["Invalid email address"]
// }
```
## **Use Cases**

### **1. Handling Field Validation Errors**
The `ApiError` class is particularly useful when working with APIs that return field validation errors. For example, when submitting a form and the server returns violations (e.g., required fields, invalid email), you can use this class to easily access specific error messages for each field.

**Example Scenario:**
You send a request to an API that validates user input (like a registration form). If any fields (e.g., username, email) are invalid, the server returns a structured response with violation messages. You can use `ApiError` to display these errors to the user in a structured way.

**Sample Code:**
```typescript
const apiError = new ApiError(responseData, responseStatus);

// Retrieve specific field error messages
const usernameErrors = apiError.violationsFor("username");
const emailErrors = apiError.violationsFor("email");

// Display errors to the user
console.log(usernameErrors); // ["Username is required"]
console.log(emailErrors);    // ["Invalid email address"]
```

### **2. General Error Handling**
In cases where there are no specific field violations, the `ApiError` class provides a way to return a general error message that can be used for user notifications.

**Example Scenario:**
When the API returns an error without specific field violations (e.g., authentication failure, or a server error), the `ApiError` class allows you to display a generic error message.

**Sample Code:**
```typescript
const apiError = new ApiError({ "title": "Server Error", "detail": "Something went wrong" }, 500);

console.log(apiError.name); // "Server Error Something went wrong"
```

## Overview
## Usage in React

### 1. **Handling API Errors in React**

When submitting a form in React, you might want to handle errors returned from an API, particularly form validation errors. To manage this, we can use the `ApiError` class.

### Example Usage in a React Component

Here is an example of how to integrate the `ApiError` class in a React component that handles form submissions:

```jsx
import React, { useState, useEffect } from 'react';
import ValidatorErrorField from './ValidatorErrorField'; // Component to display error messages

// Function to submit form data and trigger custom event on error
async function submitForm(formData) {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    });

    const responseData = await response.json();

    // Create an instance of ApiError with the response data
    const apiError = new ApiError(responseData, response.status);

    // Dispatch a custom event with the apiError instance
    const event = new CustomEvent('formSubmissionError', {
      detail: { apiError }
    });

    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error during form submission', error);
  }
}

const YourForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    // Listen for the custom formSubmissionError event
    const handleApiError = (event) => {
      const { apiError } = event.detail;
      const violations = apiError.allViolations;

      // Map violations to errorMessages object for use in the form
      const errorMessages = {};

      Object.entries(violations).forEach(([field, messages]) => {
        errorMessages[field] = messages.join(', ');
      });

      setErrorMessages(errorMessages); // Update state with error messages
    };

    document.addEventListener('formSubmissionError', handleApiError);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('formSubmissionError', handleApiError);
    };
  }, []);

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    submitForm(formData); // Trigger form submission and handle errors
  };

  return (
    <form onSubmit={onSubmitForm}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onChangeHandle}
        />
        {errorMessages['name'] && (
          <ValidatorErrorField
            errordisplay={true}
            messageerror={errorMessages['name']}
            classnameerror={["fw-bold", "text-danger", "mt-2", "error-message"]}
          />
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChangeHandle}
        />
        {errorMessages['email'] && (
          <ValidatorErrorField
            errordisplay={true}
            messageerror={errorMessages['email']}
            classnameerror={["fw-bold", "text-danger", "mt-2", "error-message"]}
          />
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

### How It Works:

1. **Form Submission**:  
   When the user submits the form, the `submitForm` function is called. It sends the form data to the API and waits for the response.

2. **Handling Errors**:  
   If the API responds with errors (e.g., validation errors), an instance of the `ApiError` class is created and dispatched via a custom event (`formSubmissionError`).

3. **Event Listener**:  
   The `YourForm` component listens for the `formSubmissionError` event. When the event is triggered, it extracts the errors from the `ApiError` instance and updates the state with the error messages.

4. **Displaying Errors**:  
   The form renders any error messages next to the corresponding fields using the `ValidatorErrorField` component, which accepts error messages and displays them styled according to the provided classes.

### Key Benefits:

- **Separation of Concerns**: The error-handling logic is abstracted away from the React component, making the component code cleaner and easier to manage.
- **Reusability**: You can use the `ApiError` class across multiple forms and components, making it a reusable solution for handling API errors.
- **Flexibility**: By using custom events, you can easily handle errors from various parts of your application without having to pass props or states explicitly between components.

This way, the `ApiError` class integrates seamlessly with React form components and provides a structured and effective approach to handling validation errors from the API.
## **Conclusion**

The `ApiError` class is a powerful utility to handle API errors, especially when working with form validation. By structuring error messages by field and offering methods for easy access, it simplifies the process of displaying specific violations to the user. This class ensures that error handling is efficient and user-friendly.

## Chunked file upload management

## `ChunkSizeConfiguration` Interface

This interface defines the configuration object used to determine the optimal upload chunk size. It allows for dynamic adjustments based on the detected network speed and the size of the file being uploaded.

```typescript
export interface ChunkSizeConfiguration {}
```

### Configuration Properties:

#### `defaultChunkSizeMo: number`

The default chunk size, in megabytes (MB), to be used when no specific conditions based on network speed or file size are met. This value serves as the fallback.

**Example:** `50` (represents 50 MB)

#### `slowSpeedThresholdMbps: number`

The network speed threshold, in megabits per second (Mbps). If the detected upload speed is below this value, the system considers the connection to be slow and may apply more conservative (smaller) chunk sizes to improve upload reliability.

**Example:** `5` (represents 5 Mbps)

#### `verySlowSpeedChunkSizeMo: number`

The maximum chunk size, in megabytes (MB), to be used when the upload speed is considered very slow (below the `slowSpeedThresholdMbps`). This setting helps prevent timeouts and increases the likelihood of successful uploads on poor network connections.

**Example:** `2` (represents a maximum of 2 MB for slow connections)

#### `fileSizeThresholds: { maxSizeMo: number; chunkSizeMo: number; }[]`

An array of objects that define different chunk sizes to be used based on the size of the file being uploaded. Each object specifies:

* `maxSizeMo: number`: The maximum file size (in MB) for which the corresponding `chunkSizeMo` should be applied.
* `chunkSizeMo: number`: The chunk size (in MB) to be used for files up to the `maxSizeMo`.

This array should be ordered by `maxSizeMo` in ascending order. You can use `Infinity` as the `maxSizeMo` in the last element to define the chunk size for all larger files.

**Example:**

```json
[
  { "maxSizeMo": 200, "chunkSizeMo": 50 },   // For files up to 200 MB, use 50 MB chunks
  { "maxSizeMo": 400, "chunkSizeMo": 100 },  // For files up to 400 MB, use 100 MB chunks
  { "maxSizeMo": Infinity, "chunkSizeMo": 700 } // For files larger than 400 MB, use 700 MB chunks
]
```

### `calculateUploadChunkSize` Function

This function calculates the optimal chunk size (in bytes) for uploading a media file, taking into account the file size and optionally the network upload speed. It uses a provided configuration (`ChunkSizeConfiguration`) to determine the appropriate chunk size.

```typescript
export function calculateUploadChunkSize(
    media_size: number,
    speedMbps: number | undefined,
    config: ChunkSizeConfiguration = defaultChunkConfig
): number
```

#### Parameters:

* `media_size: number`: The total size of the media file to be uploaded, in bytes.
* `speedMbps: number | undefined`: (Optional) The estimated network upload speed in megabits per second (Mbps). If provided, this will influence the calculated chunk size, especially for slow connections. If `undefined`, the calculation will be based solely on the `media_size`.
* `config: ChunkSizeConfiguration = defaultChunkConfig`: (Optional) An object conforming to the `ChunkSizeConfiguration` interface. This configuration defines the default chunk size, slow speed thresholds, and chunk sizes for different file size ranges. If not provided, the `defaultChunkConfig` will be used.

#### Returns:

`number`: The calculated chunk size in bytes. This value represents the recommended size for dividing the media file into chunks for upload.

#### Functionality:

1.  **Unit Conversion**: Converts the `media_size` from bytes to megabytes (MB) for easier comparison with the thresholds defined in the `config`.
2.  **Slow Connection Management**:
    * If the `speedMbps` is provided and is less than the `slowSpeedThresholdMbps` specified in the `config`, the function returns the smaller value between the `defaultChunkSizeMo` and the `verySlowSpeedChunkSizeMo` (both converted to bytes). This ensures that smaller chunks are used on slow connections to improve reliability.
3.  **File Size Based Adjustment**:
    * The function iterates through the `fileSizeThresholds` array in the `config`.
    * For each threshold, it checks if the `media_sizeMo` is less than or equal to the `maxSizeMo` defined in the threshold.
    * If a matching threshold is found, the corresponding `chunkSizeMo` (converted to bytes) is returned. This allows for larger chunk sizes for larger files on potentially faster connections.
4.  **Default Chunk Size**:
    * If none of the above conditions are met (e.g., for smaller files on faster connections or when no specific file size threshold is matched), the function returns the `defaultChunkSizeMo` (converted to bytes) as the chunk size. The `fileSizeThresholds` should ideally include a catch-all threshold (e.g., with `maxSizeMo: Infinity`) to ensure this default is applied appropriately for all file sizes.

#### Example Usage:

```typescript
import { calculateUploadChunkSize, ChunkSizeConfiguration } from '@wlindabla/form_validator'; // Assuming the function and interface are in './utils'

const fileSize = 150 * Math.pow(1024, 2); // 150 MB in bytes
const fastNetworkSpeed = 25; // 25 Mbps
const slowNetworkSpeed = 3; // 3 Mbps

const customConfig: ChunkSizeConfiguration = {
    defaultChunkSizeMo: 30,
    slowSpeedThresholdMbps: 6,
    verySlowSpeedChunkSizeMo: 1,
    fileSizeThresholds: [
        { maxSizeMo: 100, chunkSizeMo: 20 },
        { maxSizeMo: 500, chunkSizeMo: 100 },
        { maxSizeMo: Infinity, chunkSizeMo: 200 },
    ],
};

const chunkSizeFast = calculateUploadChunkSize(fileSize, fastNetworkSpeed, customConfig);
console.log(`Chunk size for fast network: ${chunkSizeFast / Math.pow(1024, 2)} MB`);

const chunkSizeSlow = calculateUploadChunkSize(fileSize, slowNetworkSpeed, customConfig);
console.log(`Chunk size for slow network: ${chunkSizeSlow / Math.pow(1024, 2)} MB`);

const chunkSizeNoSpeed = calculateUploadChunkSize(fileSize, undefined, customConfig);
console.log(`Chunk size without speed info: ${chunkSizeNoSpeed / Math.pow(1024, 2)} MB`);

const chunkSizeDefaultConfig = calculateUploadChunkSize(fileSize, fastNetworkSpeed);
console.log(`Chunk size with default config: ${chunkSizeDefaultConfig / Math.pow(1024, 2)} MB`);
```


### `createChunkFormData` Function

This function creates a `FormData` object containing all the necessary information for uploading a single chunk of a larger media file.

```typescript
export function createChunkFormData(
    chunk_media: Blob,
    orginal_name_media: string,
    mediaIdFromServer: number,
    sizeMedia: number,
    uploadedChunks: number,
    totalChunks: number,
    provider: string = "LocalVideo",
    othersData: Record<string, string | Blob> = {}
): FormData
```

#### Parameters:

* `chunk_media: Blob`: The raw data of the current media chunk being uploaded.
* `orginal_name_media: string`: The original name of the complete media file.
* `mediaIdFromServer: number`: A unique identifier for the media file, likely assigned by the server.
* `sizeMedia: number`: The total size of the original media file in bytes.
* `uploadedChunks: number`: The index of the current chunk being uploaded (0-based).
* `totalChunks: number`: The total number of chunks the media file has been divided into.
* `provider: string = "LocalVideo"`: (Optional) The source or provider of the media. Defaults to `"LocalVideo"`.
* `othersData: Record<string, string | Blob> = {}`: (Optional) An object containing additional key-value pairs (strings or Blobs) to be included in the `FormData`.

#### Returns:

`FormData`: An object ready to be sent in an HTTP request, containing the chunk data and associated metadata.

#### Functionality:

The `createChunkFormData` function constructs a `FormData` object with the following fields:

* `"chunkMedia"`: The actual `Blob` containing the current chunk data.
* `"sizeChunk"`: The size of the current chunk in bytes (as a string).
* `"chunkIndex"`: The index of the current chunk (as a string).
* `"totalChunks"`: The total number of chunks (as a string).
* `"filename"`: The original name of the media file.
* `"mediaId"`: The unique identifier for the media file (as a string).
* `"extension"`: The file extension extracted from the original filename.
* `"sizeMedia"`: The total size of the original media file (as a string).
* `"provider"`: The media provider (defaults to `"LocalVideo"`).
* `"sizeTailChunk"`: (Only included for the last chunk) The size of the last chunk in bytes (as a string).
* Any key-value pairs from the `othersData` object (where the value is a string or a `Blob`).

This `FormData` object is typically used to send each chunk to the server via a POST request during a chunked file upload process. The server can then use the information within the `FormData` to reassemble the complete file in the correct order.

#### Example Usage:

```typescript
import { createChunkFormData } from '@wlindabla/form_validator'; 
const chunk = new Blob(['chunk data']);
const originalName = 'myvideo.mp4';
const mediaId = 123;
const totalSize = 1024 * 1024 * 5; // 5 MB
const currentChunkIndex = 0;
const totalNumberOfChunks = 5;
const additionalData = { userId: 'user123', uploadSession: 'abc-123' };

const formData = createChunkFormData(
    chunk,
    originalName,
    mediaId,
    totalSize,
    currentChunkIndex,
    totalNumberOfChunks,
    'MyUploader',
    additionalData
);

// You can then use this formData object in a fetch or XMLHttpRequest request
// fetch('/upload-chunk', {
//   method: 'POST',
//   body: formData,
// });
```


### `ChunkMediaDetailInterface`

This interface defines the structure of an object that holds details about a single chunk of a media file during an upload process.

```typescript
export interface ChunkMediaDetailInterface {}
```
#### Properties:

* `chunkIndex: number`: The index of the current chunk. Typically 0-based, indicating its position within the sequence of chunks.
* `start: number`: The starting byte position of this chunk within the original media file.
* `totalChunks: number`: The total number of chunks that the original media file has been divided into.
* `mediaName: string`: The original name of the media file.
* `mediaId?: number`: (Optional) A unique identifier for the media file, possibly assigned by the server.
* `media?: File`: (Optional) The `File` object representing the original media file (may be available in the context where chunking is initiated).
* `status?: number`: (Optional) A numerical code representing the current status of the upload for this specific chunk (e.g., 0 for pending, 1 for uploading, 2 for completed, -1 for error). The specific meaning of these numbers would be defined by your application's logic.
* `urlActionUploadFile?: string | URL`: (Optional) The URL or endpoint to which this specific chunk should be uploaded.
* `messageFromServer: string`: A message received from the server related to the upload of this chunk (e.g., success message, error details).
* `progressPercentage?: number`: (Optional) A numerical value (between 0 and 100) indicating the upload progress of this specific chunk or the overall file.
* `downloadMediaComplete?: boolean`: (Optional) A boolean flag indicating whether the entire media file download/upload process is complete.
* `provider: string`: A string indicating the source or provider of the media (e.g., "LocalVideo", "RemoteURL").

#
This interface provides a structured way to manage and track the state and information associated with each individual chunk during a potentially long-running upload process. It includes details about the chunk's position, the original file, upload status, server communication, and progress.
#

```markdown
### `ChunkMediaDetail` Class

This class provides a read-only wrapper around the `ChunkMediaDetailInterface`, offering convenient accessors to the chunk's details and a method to check for upload completion.

```typescript
export class ChunkMediaDetail {
    constructor(private readonly data_chunk: ChunkMediaDetailInterface) { }}
```

#### Constructor:

* `constructor(private readonly data_chunk: ChunkMediaDetailInterface)`: Initializes a new `ChunkMediaDetail` instance with a read-only reference to an object conforming to the `ChunkMediaDetailInterface`.

#### Properties (Getters):

* `status: number | undefined`: Returns the current status of the chunk upload, as defined in the underlying `ChunkMediaDetailInterface`.
* `message: string`: Returns the message received from the server related to this chunk's upload.
* `progressPercentage: number | undefined`: Returns the upload progress percentage for this chunk or the overall file.
* `mediaIdFromServer: number | undefined`: Returns the unique identifier for the media file, if available.
* `chunkIndex: number`: Returns the index of the current chunk, **decremented by 1**. This might be done to provide a 0-based index externally if the interface uses a 1-based index.
* `totalChunks: number`: Returns the total number of chunks for the media file.
* `mediaName: string`: Returns the original name of the media file.
* `start: number`: Returns the starting byte position of this chunk in the original file.
* `urlAction: string | URL | undefined`: Returns the URL or endpoint for uploading this chunk.
* `provider: string`: Returns the provider of the media.
* `media: File | undefined`: Returns the `File` object of the original media, if available.

#### Methods:

* `isComplete(): boolean`: Returns a boolean indicating whether the entire media file upload/download process is marked as complete based on the `downloadMediaComplete` property of the underlying `ChunkMediaDetailInterface`.

#### Purpose:

The `ChunkMediaDetail` class acts as a wrapper to provide a more convenient and potentially controlled way to access the properties of a chunk's detail information. By using getters, it can encapsulate the underlying data structure and potentially add logic or formatting to the accessed values (as seen with the `chunkIndex`). This class is likely used within the upload management logic to represent and interact with the details of each individual chunk.


### Media Upload/Download Events

These constants define the names of events that are dispatched during the media upload and download processes. You can listen for these events to track the status and handle different stages of these operations.

#### `MEDIA_CHUNK_UPLOAD_STARTED`

* **Description:** This event is dispatched when the upload process for an individual chunk of a media file has begun.
* **Purpose:** To indicate the start of a chunk upload attempt.
* **Example Usage:** You might listen to this event to update the UI to show that a new chunk is being uploaded.

#### `MEDIA_CHUNK_UPLOAD_FAILED`

* **Description:** This event is dispatched when an attempt to upload a specific chunk of the media file has failed.
* **Purpose:** To signal that a chunk upload was unsuccessful and might require a retry or error handling.
* **Example Usage:** You might listen to this event to trigger a retry mechanism or display an error message to the user.

#### `MEDIA_CHUNK_UPLOAD_STATUS`

* **Description:** This event is dispatched to provide updates on the current status of an ongoing media chunk upload.
* **Purpose:** To report intermediate progress information during the upload of a chunk.
* **Example Usage:** You might listen to this event to update a progress bar for the currently uploading chunk.

#### `MEDIA_CHUNK_UPLOAD_SUCCESS`

* **Description:** This event is dispatched when a specific chunk of the media file has been successfully uploaded to the server.
* **Purpose:** To indicate that a chunk was uploaded without any errors.
* **Example Usage:** You might listen to this event to track the number of successfully uploaded chunks and proceed to the next chunk.

#### `MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE`

* **Description:** This event is dispatched when the maximum number of retry attempts for uploading a chunk has been reached, and the upload still failed.
* **Purpose:** To signal a persistent failure in uploading a chunk after multiple retries.
* **Example Usage:** You might listen to this event to stop further retries and inform the user about a permanent upload failure for this chunk.

#### `DOWNLOAD_MEDIA_COMPLETE`

* **Description:** This event is dispatched when the entire media file download (which might have been done in chunks) has been successfully completed.
* **Purpose:** To indicate that the media file has been fully downloaded and is ready for use.
* **Example Usage:** You might listen to this event to display the downloaded media or perform post-download operations.

#### `DOWNLOAD_MEDIA_FAILURE`

* **Description:** This event is dispatched when an error occurred during the media file download process, and the download failed.
* **Purpose:** To signal that the media file download was unsuccessful.
* **Example Usage:** You might listen to this event to display an error message to the user or attempt to restart the download.

#### `MEDIA_CHUNK_UPLOAD_RESUME`

* **Description:** This event is dispatched when an interrupted upload attempt for a media chunk is being resumed.
* **Purpose:** To indicate that a previously paused or failed chunk upload is being restarted.
* **Example Usage:** You might listen to this event to update the UI to reflect the resumption of the upload.

#### `DOWNLOAD_MEDIA_RESUME`

* **Description:** This event is dispatched when an interrupted download attempt for a media file is being resumed.
* **Purpose:** To indicate that a previously paused or failed media download is being restarted.
* **Example Usage:** You might listen to this event to update the UI or manage the download progress.

#### `MEDIA_METADATA_SAVE_SUCCESS`

* **Description:** This event is dispatched when the metadata associated with the media file (e.g., title, description) has been successfully saved on the server.
* **Purpose:** To signal the successful persistence of media-related information.
* **Example Usage:** You might listen to this event to provide feedback to the user that the media information has been saved.

### `updateProgressBarHTMLNotified` Function

This function updates an existing progress bar HTML element or creates a new one if it doesn't exist, returning the HTML content as a string. It uses jQuery to manipulate the DOM structure.

```typescript
export function updateProgressBarHTMLNotified(
    progress: number,
    media_id: number,
    filename: string,
    providerName: string = "LocalVideo"
): string
```

#### Parameters:

* `progress: number`: The current upload progress percentage (between 0 and 100).
* `media_id: number`: The unique identifier of the media being uploaded. This is used to generate a unique ID for the progress bar.
* `filename: string`: The name of the file being uploaded, displayed as a label.
* `providerName: string = "LocalVideo"`: (Optional) The name of the media provider. This is included in the progress bar's ID to prevent naming conflicts if multiple providers are uploading files. Defaults to `"LocalVideo"`.

#### Returns:

`string`: A string containing the HTML content of the updated (or newly created) progress bar element.

#### Functionality:

1.  **Constructs the Progress Bar ID**: A unique ID (`progress-bar-item_${providerName}_${media_id}`) is generated for the progress bar element.

2.  **Checks for Existing Progress Bar**: The function attempts to select an HTML element with the generated ID using jQuery (`jQuery(`#${progressBarId}`))`.

3.  **Updates Existing Bar (if found)**:
    * If a progress bar element with the matching ID exists:
        * Its `width` style is updated to reflect the current `progress` percentage.
        * Its `aria-valuenow` attribute is updated with the `progress` value for accessibility.
        * Its text content is updated to display the rounded `progress` percentage.

4.  **Creates New Bar (if not found)**:
    * If no progress bar element with the matching ID is found:
        * A new `div` element containing the progress bar structure is created using a template literal and jQuery. This structure includes:
            * A `<small>` element to display the `filename` with a tooltip for the full name.
            * A `div` with the class `progress` as a container.
            * A `div` with Bootstrap classes (`progress-bar`, `bg-success`, `progress-bar-striped`, `progress-bar-animated`) to visually represent the progress. Its `width`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and text content are set based on the `progress`.

5.  **Logs Progress Information**: The current text content of the (potentially updated or newly created) progress bar is logged to the console using a `Logger.log` function (assuming this is a custom logging utility). The DOM element itself is also logged.

6.  **Returns HTML Content**: The `innerHTML` of the updated or newly created jQuery object (converted to a native DOM element using `.get(0)`) is returned as a string. This allows the calling code to insert or manipulate the progress bar element in the DOM as needed.

#### Usage Notes:

* This function relies on the presence of the jQuery library in the environment where it's executed.
* The returned HTML string can be directly inserted into the DOM using methods like `innerHTML`, `append`, or `prepend` on a target HTML element.
* The unique ID generation ensures that progress bars for different media files or providers will not conflict.
* The use of Bootstrap classes provides basic styling for the progress bar. Ensure that Bootstrap CSS is included in your project for the intended visual appearance.
* The `Logger.log` calls are for debugging purposes and might need to be adapted or removed depending on your project's logging strategy.


### `CustomEventOptions` Interface

This interface defines the optional configuration options that can be passed when emitting a custom event using the `emitEvent` function.

```typescript
export interface CustomEventOptions {}
```

#### Properties:

* `bubbles?: boolean`: (Optional) A boolean value indicating whether the event should propagate (bubble up) through the DOM tree after being dispatched on the target. Defaults to `false` if not provided.
* `cancelable?: boolean`: (Optional) A boolean value indicating whether the default action associated with the event can be prevented by calling the `preventDefault()` method on the event object in an event listener. Defaults to `true` if not provided.
* `composed?: boolean`: (Optional) A boolean value indicating whether the event should traverse the shadow DOM boundary. `true` means the event can propagate from within a shadow DOM to the normal DOM tree. Defaults to `true` if not provided.

### `emitEvent` Function

This function dispatches a custom event of a specified type on a given target (`Window` or `Document`), attaching media chunk details and optional event configuration.

```typescript
export function emitEvent(
    typeEvent: EventUploadMedia,
    target: Window | Document,
    chunk_media_detail: ChunkMediaDetail,
    eventOptions?: CustomEventOptions
): void
```

#### Parameters:

* `typeEvent: EventUploadMedia`: A string representing the type (name) of the event to be dispatched. This should be one of the event constants defined for media upload/download (e.g., `MEDIA_CHUNK_UPLOAD_STARTED`).
* `target: Window | Document`: The target object on which the event will be dispatched. This is typically the global `window` object or the `document` object.
* `chunk_media_detail: ChunkMediaDetail`: An instance of the `ChunkMediaDetail` class containing specific information about the media chunk relevant to the event. This data will be available in the `detail` property of the dispatched `CustomEvent`.
* `eventOptions?: CustomEventOptions`: (Optional) An object conforming to the `CustomEventOptions` interface, allowing you to configure the bubbling, cancelability, and composed behavior of the event.

#### Functionality:

The `emitEvent` function creates a new `CustomEvent` with the provided `typeEvent` and dispatches it on the specified `target`. The `detail` property of the `CustomEvent` is set to the `chunk_media_detail` object, allowing event listeners to access the chunk-specific information. The `bubbles`, `cancelable`, and `composed` properties of the `CustomEvent` are determined by the `eventOptions` if provided, or default to `false`, `true`, and `true` respectively.

#### Example Usage:

```typescript
import { MEDIA_CHUNK_UPLOAD_STARTED } from './events'; // Assuming events.ts
import { ChunkMediaDetail } from './chunk-media-detail'; // Assuming chunk-media-detail.ts

const chunkDetail = new ChunkMediaDetail({
    chunkIndex: 0,
    start: 0,
    totalChunks: 5,
    mediaName: 'myvideo.mp4',
    messageFromServer: '',
    provider: 'LocalVideo',
});

const customOptions: CustomEventOptions = {
    bubbles: true,
    cancelable: false,
};

emitEvent(MEDIA_CHUNK_UPLOAD_STARTED, window, chunkDetail, customOptions);

// To emit without custom options:
emitEvent(MEDIA_CHUNK_UPLOAD_STARTED, document, chunkDetail);
```

## Function `uploadedMediaInChunks`

This asynchronous function enables the upload of large media files in chunks. It handles splitting the file, progressively sending each chunk to the server, retrying failed uploads, and notifying different stages of the process via events.

### Parameters

The function takes a configuration object of type `UploadedMediaInChunksOptions` with the following properties:

* `urlActionUploadMedia` (`string`): The URL of the server endpoint responsible for receiving media chunks.
* `media` (`File`): The `File` object representing the media file to be uploaded.
* `startUpdate` (`number`, optional): The starting byte position for resuming an interrupted upload. Default: `0`.
* `uploadedChunksUpdate` (`number`, optional): The number of chunks already uploaded in case of resumption. Default: `0`.
* `mediaIdFromServer` (`number`, optional): The unique identifier of the media as known on the server (useful for tracking chunks).
* `provider` (`string`, optional): The name of the media provider (e.g., "LocalVideo"). Default: `"LocalVideo"`.
* `target` (`Window | Document`): The object on which upload events will be dispatched (usually `window` or `document`).
* `timeoutUploadByChunk` (`number`, optional): The timeout in milliseconds for uploading each chunk. If the server does not respond within this time, the request will be aborted. Default: `60000` (60 seconds).
* `speedMbps` (`number`, optional): The estimated connection speed in Mbps, used to calculate chunk size.
* `othersData` (`Record<string, any>`, optional): An object containing additional data to send with each chunk.
* `config` (`any`, optional): An additional configuration object (usage not specified here).
* `eventOptions` (`any`, optional): Additional options for events (usage not specified here).

### Backend Expected Data (JSON)

The frontend expects the backend to return data in JSON format upon receiving each chunk. An important data key expected is `"message"`, which typically contains an informative message about the chunk upload status.

Example of expected backend JSON response:

```json
{
  "message": "Chunk 1 of the file 'my_video.mp4' was successfully received.",
  "mediaId": 1678886400,
  "urlActionUploadMedia": "[https://your-server.com/api/upload-media](https://your-server.com/api/upload-media)"
}
```

Specifically, during the initial registration of file metadata (before chunk uploads), the backend is likely to return a JSON response with the following keys:

* `"message"` (`string`): A message indicating the successful registration of metadata. Example: `"The metadata for the file \"filename.mp4\" has been successfully registered."`.
* `"mediaId"` (`number`): The unique identifier assigned to the media by the server. This `mediaId` is used to associate chunks with the file.
* `"urlActionUploadMedia"` (`string`): The URL to which file chunks should be sent.

Additionally, the `"downloadMediaComplete"` key (of type `boolean`, optional) in the JSON response of a chunk upload indicates whether the server has received all chunks and the upload is complete from the server's perspective.

### Dispatched Events

The `uploadedMediaInChunks` function dispatches events on the `target` object (usually `window` or `document`) to notify about different stages of the upload process. Details for each event are passed through a `ChunkMediaDetail` object.

1.  **`MEDIA_CHUNK_UPLOAD_STARTED`**:
    * Dispatched at the beginning of the upload for each chunk (before sending the request).
    * Event details include:
        * `chunkIndex`: The index of the chunk being uploaded (starts at 1).
        * `start`: The starting byte position of the chunk within the file.
        * `totalChunks`: The total number of chunks for the file.
        * `mediaName`: The name of the media file.
        * `mediaId`: The identifier of the media on the server.
        * `messageFromServer`: An informative message indicating the start of the chunk upload.
        * `provider`: The media provider.
        * `progressPercentage`: The current overall upload percentage.
        * `attempt`: The current attempt number for uploading this chunk (starts at 1).

2.  **`MEDIA_CHUNK_UPLOAD_SUCCESS`**:
    * Dispatched when a chunk has been successfully uploaded and the server has responded without an HTTP error.
    * Event details include:
        * `chunkIndex`: The index of the chunk that was successfully uploaded (after incrementing).
        * `totalChunks`: The total number of chunks.
        * `mediaName`: The name of the media file.
        * `mediaId`: The identifier of the media on the server.
        * `status`: The HTTP status code of the server response.
        * `messageFromServer`: A message indicating the successful upload of the chunk.
        * `progressPercentage`: The current overall upload percentage.
        * `start`: The starting byte position of the chunk.
        * `provider`: The media provider.

3.  **`MEDIA_CHUNK_UPLOAD_FAILED`**:
    * Dispatched when an error occurs during the attempt to upload a chunk (e.g., network error or server error with an error HTTP status).
    * Event details include:
        * `chunkIndex`: The index of the chunk that failed.
        * `totalChunks`: The total number of chunks.
        * `start`: The starting byte position of the chunk.
        * `mediaName`: The name of the media file.
        * `mediaId`: The identifier of the media on the server.
        * `media`: The `File` object of the media.
        * `status`: The HTTP status code of the error response (if available).
        * `messageFromServer`: An error message indicating the reason for the chunk upload failure.
        * `urlActionUploadFile`: The upload URL.
        * `provider`: The media provider.
        * `attempt`: The current attempt number that failed.
        * `responseStatus`: The HTTP status of the error (if it's an `HttpFetchError`).
        * `responseBody`: The body of the error response (if it's an `HttpFetchError`).

4.  **`MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE`**:
    * Dispatched when a chunk could not be uploaded after reaching the maximum number of configured retries (`maxRetries`).
    * Event details include:
        * `chunkIndex`: The index of the chunk that failed after multiple retries.
        * `totalChunks`: The total number of chunks.
        * `start`: The starting byte position of the chunk.
        * `mediaName`: The name of the media file.
        * `mediaId`: The identifier of the media on the server.
        * `messageFromServer`: A message indicating that the chunk upload failed after the maximum number of retries.
        * `downloadMediaComplete`: `false`.
        * `progressPercentage`: The current overall upload percentage.
        * `urlActionUploadFile`: The upload URL.
        * `attempt`: The number of the last attempt (which failed).

5.  **`DOWNLOAD_MEDIA_COMPLETE`**:
    * Dispatched when all chunks have been successfully uploaded and the media upload is considered complete (based on the server response or reaching 100% progress).
    * Event details include:
        * `chunkIndex`: The index of the last uploaded chunk.
        * `totalChunks`: The total number of chunks.
        * `mediaName`: The name of the media file.
        * `mediaId`: The identifier of the media on the server.
        * `status`: The HTTP status code of the last server response.
        * `messageFromServer`: A message indicating the successful completion of the upload.
        * `progressPercentage`: `100`.
        * `downloadMediaComplete`: `true`.
        * `start`: The starting byte position of the last chunk.
        * `provider`: The media provider.

6.  **`DOWNLOAD_MEDIA_FAILURE`**:
    * Dispatched if the overall upload process fails for any reason (e.g., if not all chunks could be uploaded).
    * Event details include:
        * `chunkIndex`: The number of chunks uploaded at the time of failure.
        * `totalChunks`: The total number of chunks.
        * `mediaName`: The name of the media file.
        * `mediaId`: The identifier of the media on the server.
        * `media`: The `File` object of the media.
        * `status`: The HTTP status code of the last server response (if available).
        * `messageFromServer`: An error message indicating the overall upload failure.
        * `progressPercentage`: The overall upload percentage at the time of failure.
        * `downloadMediaComplete`: `false`.
        * `start`: The starting byte position of the last processed chunk.
        * `urlActionUploadFile`: The upload URL.
        * `provider`: The media provider.


## Function `uploadedMedia`

This asynchronous function handles sending the metadata of a media file to the server before chunked uploading. It displays a processing notification during the send operation and notifies the user upon success or failure. On success, it dispatches an event to signal that chunk uploading can begin.

### Parameters

The function takes a configuration object of type `MetadataSaveMediaOptions` with the following properties:

* `urlAction` (`string` | `URL` | `Request`): The URL of the server endpoint responsible for receiving the file's metadata.
* `metadataSaveFile` (`FormData`): A `FormData` object containing the file's metadata to be sent to the server.
* `target` (`Window` | `Document`): The object on which a custom success event will be dispatched.
* `messageBeforeDataSend` (`string`, optional): A message to display in the processing notification before sending data. Default: "Sending metadata from the file to the server. Waiting for the answer ...".
* `optionsHeaderInit` (`HeadersInit`, optional): An object containing custom HTTP headers to include in the request.
* `eventOptions` (`CustomEventOptions`, optional): An object containing options for the custom success event (`bubbles`, `cancelable`, `composed`).

### Workflow

1.  **Displaying a Processing Notification:** A SweetAlert notification is displayed to inform the user that the metadata is being sent. It includes a processing message and a progress bar with a 45-second timer. User interaction with the page is blocked during this phase.
2.  **Sending Metadata to the Server:** The function uses `httpFetchHandler` to send a `POST` request to the specified URL (`urlAction`) with the file's metadata (`metadataSaveFile`). The request expects a JSON response and has a 45-second timeout, with up to 3 retries in case of initial failure.
3.  **Handling the Server Response:**
    * **Success:** If the server responds with an HTTP status indicating success (2xx code), a success SweetAlert notification is displayed. The message for this notification comes either from the `"message"` field of the server's JSON response or from a default message.
    * **Error:** If the server responds with an HTTP status indicating an error (4xx or 5xx code), an exception is thrown. The `catch` block intercepts this error and displays an error SweetAlert notification at the top-end of the screen. The error message displayed is extracted from various sources:
        * The `message` of an `HttpFetchError` instance (our custom error class for fetch errors).
        * The `"message"` field of the server's JSON response (if the error is an instance of `HttpResponse`).
        * The name of an `ApiError` instance (if the server's error response does not contain a `"message"` field).
        * A generic error message in case of an unexpected error.
4.  **Dispatching the Success Event:** If the metadata is successfully sent to the server, a custom event named `MEDIA_METADATA_SAVE_SUCCESS` is dispatched on the specified `target` object. The details of this event contain the following information returned by the server:
    * `urlActionUploadMedia`: The URL to which the file's chunks should be uploaded. This URL will be used by the `uploadedMediaInChunks` function.
    * `mediaId`: The unique identifier assigned to the file by the server. This ID will be used to associate the chunks with the file.

### Dispatched Event

* **`MEDIA_METADATA_SAVE_SUCCESS`**: Dispatched on the `target` object upon successful sending of metadata to the server. The event details contain:
    * `urlActionUploadMedia`: The URL for chunk uploading.
    * `mediaId`: The identifier of the media on the server.

This function is a crucial preparatory step before uploading the media file's chunks. It ensures that the server is informed about the file's metadata and provides the necessary URL and identifier for the subsequent chunk uploading process.


## Class `MediaUploadEventListener`

This class extends `AbstractMediaUploadEventListener` and provides a concrete implementation for handling events related to chunked media file uploads. It uses `CustomEvent` to listen for events and `Swal.fire` to display notifications to the user regarding the upload process.

**Important:** For custom event listening logic, the final developer will need to create a new class that extends `MediaUploadEventListener` and implement their own logic within the `eventMediaListenerAll` method. The `eventMediaListenerAll` method in this class is intentionally left empty to be overridden by derived classes.

The developer can use this class in various JavaScript contexts such as **Vanilla JS**, **jQuery**, or **ReactJS**.

### Inheritance

This class inherits from `AbstractMediaUploadEventListener`, which requires it to provide a concrete implementation for the following abstract methods:

* `mediaMetadataSaveSuccessEvent(event: CustomEvent): Promise<void>`
* `mediaChunkUploadStartedEvent(event: CustomEvent<ChunkMediaDetail>): void`
* `mediaChunkUploadSuccessEvent(event: CustomEvent<ChunkMediaDetail>): void`
* `mediaChunkUploadFailedEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void>`
* `mediaChunkUploadMaxRetryExpireEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void>`
* `downloadMediaFailureEvent(event: CustomEvent<ChunkMediaDetail>): void`
* `downloadMediaCompleteEvent(event: CustomEvent<ChunkMediaDetail>): void`
* `mediaChunkUploadResumeEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void>`
* `downloadMediaResume(event: CustomEvent<ChunkMediaDetail>): Promise<void>`
* `mediaChunkUploadStatusEvent(event: CustomEvent<ChunkMediaDetail>): void`

### Constructor

```typescript
public constructor(private readonly speedMbps?: number) { super(); }
```

* Takes an optional `speedMbps` parameter (number) that could be used for calculations related to chunk size or timeouts (although its usage is not explicitly visible in this implementation).
* Calls the constructor of the parent class (`AbstractMediaUploadEventListener`).

### Method `eventMediaListenerAll`

```typescript
public eventMediaListenerAll = async (target: Window | Document = document): Promise<void> => { }
```

* This method is intended to be **overridden** in classes that extend `MediaUploadEventListener`.
* It takes a `target` (window or document) on which event listeners will be attached.
* In this base implementation, it does not contain any event listening logic. The final developer will need to add calls to `target.addEventListener()` (for Vanilla JS or ReactJS) or `jQuery(target).on()` (for jQuery) here for the specific events they want to listen to and associate with their own event handlers.

### Event Handling Methods

* **`mediaMetadataSaveSuccessEvent(event: CustomEvent): Promise<void>`**:
    * Logs a message to the console indicating that the handler for the `mediaMetadataSaveSuccessEvent` has been called.
    * **Note:** This base implementation does not contain user notification logic for this event. A derived class could add a notification informing the user about the successful saving of metadata here.

* **`mediaChunkUploadStartedEvent(event: CustomEvent<ChunkMediaDetail>): void`**:
    * Retrieves the details of the event (`ChunkMediaDetail`).
    * Displays a SweetAlert notification informing the user that the processing of the chunk has started, showing the message and the progress percentage.

* **`mediaChunkUploadSuccessEvent(event: CustomEvent<ChunkMediaDetail>): void`**:
    * Retrieves the details of the event (`ChunkMediaDetail`).
    * Displays a SweetAlert notification informing the user about the successful upload of the chunk, showing the message, status (if available), and progress percentage.

* **`mediaChunkUploadFailedEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void>`**:
    * Retrieves the details of the event (`ChunkMediaDetail`).
    * Displays a SweetAlert notification informing the user about the failed upload of the chunk, showing the message, status (if available), and progress percentage.

* **`mediaChunkUploadMaxRetryExpireEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void>`**:
    * Retrieves the details of the event (`ChunkMediaDetail`).
    * Displays a SweetAlert notification informing the user that the chunk upload failed after the maximum number of retries.
    * Offers the user the option to retry or cancel the operation. If confirmed, it calls the `resumeMediaUploadFromCache` function.

* **`downloadMediaFailureEvent(event: CustomEvent<ChunkMediaDetail>): void`**:
    * This method is currently empty. A derived class should implement the logic to handle the overall failure of the media download.

* **`downloadMediaCompleteEvent(event: CustomEvent<ChunkMediaDetail>): void`**:
    * Retrieves the details of the event (`ChunkMediaDetail`).
    * Displays a SweetAlert notification informing the user that the media download is complete, showing the message, status (if available), and progress percentage.
    * Calls the `removeAllEventListeners` method.

* **`mediaChunkUploadResumeEvent(event: CustomEvent<ChunkMediaDetail>): Promise<void>`**:
    * Retrieves the details of the event (`ChunkMediaDetail`).
    * Displays a SweetAlert notification informing the user about the resumption of the upload for a specific chunk.

* **`downloadMediaResume(event: CustomEvent<ChunkMediaDetail>): Promise<void>`**:
    * This method is currently empty. A derived class should implement the logic to handle the overall resumption of the media download.

* **`mediaChunkUploadStatusEvent(event: CustomEvent<ChunkMediaDetail>): void`**:
    * This method is currently empty. A derived class could use it to handle intermediate status updates for the chunk uploads.

### Utility Methods

* **`removeAllEventListeners(): void`**: This method is currently empty. A derived class should implement the logic here to detach all event listeners that have been attached.

* **`setTarget(target: Window | Document): this`**: Allows setting the target (window or document) on which event listeners will be attached.

* **`getTarget(): Window | Document`**: Returns the current target of the event listeners.

* **`setConfigOptions(configOptions: ChunkSizeConfiguration | undefined): this`**: Allows setting configuration options for the chunk size.

* **`getConfigOptions(): ChunkSizeConfiguration | undefined`**: Returns the configuration options for the chunk size.


### Usage

In a jQuery context:

The developer can instantiate the class and attach event listeners using jQuery, for example:
JavaScript
```ts
jQuery(async function eventListener() {
  const speedMbps_media = await downloadTestFileConnectivityAndSpeed();
  console.log(speedMbps_media);
  const mediaEventListener = new MediaUploadEventListener(speedMbps_media);
  await mediaEventListener.eventMediaListenerAll(this); // 'this' refers to the jQuery element (document in this case)
});

In a ReactJS or VanillaJS context:

The developer can create their own class that extends MediaUploadEventListener and implement their own event listening logic using the standard browser addEventListener and removeEventListener methods. Inheritance allows for the reuse of the default event handler implementations (such as those displaying SweetAlert notifications) while customizing how events are attached and managed.
JavaScript

// Example of an extended class in a ReactJS or VanillaJS context
class CustomMediaUploadEventListener extends MediaUploadEventListener {
  constructor(speedMbps?: number) {
    super(speedMbps);
  }

  async eventMediaListenerAll(target: Window | Document = window): Promise<void> {
    target.addEventListener(MEDIA_METADATA_SAVE_SUCCESS, (event) => this.mediaMetadataSaveSuccessEvent(event as CustomEvent));
    target.addEventListener(MEDIA_CHUNK_UPLOAD_STARTED, (event) => this.mediaChunkUploadStartedEvent(event as CustomEvent<ChunkMediaDetail>));
    // ... add other listeners
  }

  protected async mediaMetadataSaveSuccessEvent(event: CustomEvent): Promise<void> {
    console.log('Custom handler for mediaMetadataSaveSuccessEvent', event.detail);
    // Add your application-specific logic here
  }

  // The other event handlers can use the default implementation from MediaUploadEventListener
}
```
```tsx
// Example of usage in React (useEffect for lifecycle management)
import React, { useEffect } from 'react';

function MyUploaderComponent() {
  useEffect(() => {
    const speed = 10; // Retrieve connection speed
    const listener = new CustomMediaUploadEventListener(speed);
    listener.eventMediaListenerAll(window);

    // Cleanup of listeners when the component unmounts (optional depending on your lifecycle management)
    // return () => {
    //   window.removeEventListener(...);
    // };
  }, []);

  // ... your JSX ...
}
```

## Contact Information

This file is part of the project by AGBOKOUDJO Franck.

- (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
- Phone: +229 01 67 25 18 86
- LinkedIn: [https://www.linkedin.com/in/internationales-web-services-120520193/](https://www.linkedin.com/in/internationales-web-services-120520193/)
- Company: INTERNATIONALES WEB SERVICES

For more information, please feel free to contact the author.#
