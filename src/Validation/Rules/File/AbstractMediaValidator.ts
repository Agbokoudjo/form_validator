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
import { MediaValidatorInterface, OptionsValidateTypeFile } from './InterfaceMedia';
import { AbstractFieldValidator, } from '../FieldValidator';
import { convertOctetToMo } from "../../../_Utils"

/**
* @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
* @package <https://github.com/Agbokoudjo/form_validator>
*/
export abstract class AbstractMediaValidator extends AbstractFieldValidator implements MediaValidatorInterface {

    protected constructor() {
        super();
    }

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
    protected sizeValidate = (file: File, targetInputname: string = 'photofile', sizeImg: number = 5, unitysize = 'MiB'): this => {
        if (convertOctetToMo(file.size) > sizeImg) {
            this.setValidationState(false, `the ${this.getContext()} ${file.name} file is too large, maximum recommended size is ${sizeImg} ${unitysize}`, targetInputname)
        }
        return this;
    }

    /**
     * Valide l'extension du fichier image.
     * @param targetInputname Le nom du champ input.
     * @param allowedExtensions Un tableau des extensions autorisées.
     * @returns L'instance de la classe.
     */
    protected extensionValidate = (file: File, targetInputname: string, allowedExtensions?: string[]): string | undefined => {
        const fileExtension = this.getFileExtension(file);
        if (fileExtension && allowedExtensions && !allowedExtensions.includes(fileExtension)) {
            this.setValidationState(false, `The ${this.getContext()} ${file.name} extension .${fileExtension} is not allowed.`, targetInputname);
        }
        return fileExtension;
    }

    protected getFileExtension(file: File): string | undefined {
        return file.name.split('.').pop()?.toLowerCase() || undefined;
    }

    protected abstract mimeTypeFileValidate(file: File, allowedMimeTypeAccept?: string[]): Promise<string | null>
    protected abstract signatureFileValidate(file: File, uint8Array?: Uint8Array): Promise<string | null>;
    protected abstract getFileDimensions(file: File): Promise<{ width: number, height: number }>

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
}