/** 
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APP & SERVICES
 *
 * For more information, please feel free to contact the author.
 */
import {
    MediaValidatorInterface,
    UnityMaxSizeTypeFile,
    OptionsValidateTypeFile
} from './InterfaceMedia';
import { AbstractFieldValidator, } from '../FieldValidator';
import { convertOctetToMo } from "../../../_Utils"

/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
*/
export abstract class AbstractMediaValidator extends AbstractFieldValidator implements MediaValidatorInterface {

    protected constructor() { super(); }

    public abstract validate: (media: File | FileList, targetInputname: string, optionsfile: OptionsValidateTypeFile) => Promise<this>;

    /**
     * Handles validation errors by setting error messages and flags.
     * Gère les erreurs de validation en définissant les messages d'erreur et les indicateurs.
     */
    protected handleValidationError = (targetInputname: string, filename: string, errorMessage: string): void => {

        this.setValidationState(false, errorMessage, targetInputname);
    }

    protected abstract getContext(): string;

    /**
     * Validates the size of the image file against the maximum allowed size.
     * Valide la taille du fichier image par rapport à la taille maximale autorisée.
     */
    protected sizeValidate = (
        file: File,
        targetInputname: string = 'photofile',
        sizeMax: number = 5,
        unitysize: UnityMaxSizeTypeFile = 'MiB'
    ): this => {
        const fileSizeInUnit = convertBytesToUnit(file.size, unitysize);

        if (fileSizeInUnit > sizeMax) {
            this.setValidationState(
                false,
                `The ${this.getContext()} "${file.name}" is too large. ` +
                `Maximum allowed size is ${sizeMax} ${unitysize} ` +
                `(current: ${fileSizeInUnit.toFixed(2)} ${unitysize}).`,
                targetInputname
            );
        }

        return this;
    }

    /**
     * Valide l'extension du fichier image.
     * @param targetInputname Le nom du champ input.
     * @param allowedExtensions Un tableau des extensions autorisées.
     * @returns L'instance de la classe.
     */
    protected isValidExtension = (file: File,allowedExtensions?: string[]): string | null=> {
        const fileExtension = this.getFileExtension(file);
        if (!fileExtension || !allowedExtensions){ return null ;}

        if (!allowedExtensions.includes(fileExtension)) {
            return `The ${this.getContext()} ${file.name} extension .${fileExtension} is not allowed.`;
        }

        return null;
    }

    protected getFileExtension(file: File): string | undefined {
        return file.name.split('.').pop()?.toLowerCase() || undefined;
    }

    protected async signatureFileValidate(file: File, uint8Array: Uint8Array): Promise<string | null> {
        return null;     
    }

    /**
     * the children class can modify this method 
     */
    protected validateDocumentSignature(uint8Array: Uint8Array, allowedSignatures: string[]): boolean {
        if (uint8Array.length < 4) return false;
        const header = Array.from(uint8Array.subarray(0, 4))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        return allowedSignatures.some(sig => header.startsWith(sig.toLowerCase()));
    }

    protected  async mimeTypeFileValidate(file: File, allowedMimeTypeAccept?: string[] | undefined): Promise<string | null> {
        return null;
    }

    /**
     * the children class (VideoValidator and ImageValidator can modify this)
     */
    protected async getFileDimensions(file: File): Promise<{ width: number, height: number }>{
        return {
            width: 0,
            height: 0
        }
    }

    /**
    * Valide la hauteur de l'image.
    * @param targetInputname Le nom du champ input.
    * @param minHeight La hauteur minimale.
    * @param maxHeight La hauteur maximale.
    * @returns Une promesse qui se résout à l'instance de la classe.
    */
    protected heightValidate = async (file: File, targetInputname: string, minHeight?: number, maxHeight?: number, unity_dimensions: string = "px"): Promise<this> => {
        const dimensions = await this.getFileDimensions(file);
        if (minHeight && dimensions.height < minHeight) {
            this.setValidationState(false, `The image ${file.name} height is less than ${minHeight}${unity_dimensions}`, targetInputname);
        }
        if (maxHeight && dimensions.height > maxHeight) {
            this.setValidationState(false, `The image ${file.name} height is greater than ${maxHeight}${unity_dimensions}`, targetInputname);
        }
        return this;
    }

    /**
     * Validates the width of the image against the specified minimum and maximum values.
     * Valide la largeur de l'image par rapport aux valeurs minimales et maximales spécifiées.
     */
    protected widthValidate = async (file: File, targetInputname: string, minWidth?: number, maxWidth?: number, unity_dimensions: string = "px"): Promise<this> => {
        const dimensions = await this.getFileDimensions(file);
        if (minWidth && dimensions.width < minWidth) {
            this.setValidationState(false, `The width of the ${this.getContext()} ${file.name} is less than ${minWidth}${unity_dimensions}`, targetInputname);
        }
        if (maxWidth && dimensions.width > maxWidth) {
            this.setValidationState(false, `The width of the ${this.getContext()} ${file.name} is greater than ${maxWidth}${unity_dimensions}`, targetInputname);
        }
        return this;
    }

    protected async readFileAsUint8Array(file: File): Promise<Uint8Array> {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
            reader.onerror = () => reject(`Failed to read file: ${file.name}`);
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Attempts to parse an XML string using DOMParser.
     * Returns an error string if the XML is malformed, null otherwise.
     *
     * @param xml      - The XML string to validate.
     * @param filename - Used in the error message.
     */
    protected validateXml(xml: string, filename: string, context: string ="word/document.xml"): string | null {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'application/xml');
            const parseError = doc.querySelector('parsererror');
            if (parseError) {
                return (
                    `The "${context}" in "${filename}" is malformed XML: ` +
                    `${parseError.textContent?.slice(0, 200)}`
                );
            }
        } catch (error) {
            return `Failed to parse "${context}" in "${filename}": ${error}`;
        }
        return null;
    }

}

/**
 * Converts bytes to the specified unit.
 */
function convertBytesToUnit(bytes: number, unit: UnityMaxSizeTypeFile): number {
    switch (unit) {
        case 'B': return bytes;
        case 'KiB': return bytes / 1024;
        case 'MiB': return bytes / (1024 ** 2);
        case 'GiB': return bytes / (1024 ** 3);
        default: return bytes / (1024 ** 2); // fallback MiB
    }
}