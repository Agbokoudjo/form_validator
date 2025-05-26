/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { validateImage } from 'image-validator';

import { AbstractMediaValidator } from './AbstractMediaValidator';
import { MediaValidatorInterface, OptionsImage } from './InterfaceMedia';
/**
 * ImageValidator Class
 * This class validates image files by checking their extensions, dimensions, MIME types, and other characteristics.
 * It ensures that uploaded files meet specific criteria, such as allowed file types and sizes.
 * Implements the FileValidatorInterface and extends the ErrorMessageHandle class.
 */
export class ImageValidator extends AbstractMediaValidator implements MediaValidatorInterface {
    protected readonly signatureHexadecimalFormatFile: Record<string, string[]> = {
        // Image formats
        jpg: ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
        jpeg: ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
        png: ['89504e47'],
        gif: ['47494638'],
        bmp: ['424d'],
        webp: ['52494646'],
        svg: ['3c3f786d6c2076657273696f6e3d', '3c737667'],
    }
    private static m_instance_image_validator: ImageValidator;
    private m_Image: Map<string, File>;
    private constructor() {
        super();
        this.m_Image = new Map<string, File>();
    }
    /**
     * Singleton method to get the single instance of the class.
     * Méthode singleton pour obtenir l'instance unique de la classe.
     */
    public static getInstance = (): ImageValidator => {
        if (!ImageValidator.m_instance_image_validator) {
            ImageValidator.m_instance_image_validator = new ImageValidator();
        }
        return ImageValidator.m_instance_image_validator;
    }
    /**
     * Validates an image file or a list of image files against the specified options.
     * Valide un fichier image ou une liste de fichiers image selon les options spécifiées.
     */
    public fileValidator = async (
        medias: File | FileList,
        targetInputname: string = 'photofile',
        optionsimg: OptionsImage = { allowedMimeTypeAccept: ['image/jpeg', 'image/png', 'image/jpg'] }
    ): Promise<this> => {
        const files = medias instanceof FileList ? Array.from(medias) : [medias];
        const allowedMimeTypeAccept = optionsimg.allowedMimeTypeAccept || ['image/jpeg', 'image/png', 'image/jpg'];

        for (const file of files) {
            this.extensionValidate(file, targetInputname, optionsimg.extensions || this.getExtensions(allowedMimeTypeAccept)); // Validation de l'extension dans la même boucle
            this.sizeValidate(file, targetInputname, optionsimg.maxsizeFile || 5, optionsimg.unityMaxSizeFile || 'MiB')
            const mimeError = await this.mimeTypeFileValidate(file, allowedMimeTypeAccept);
            const signatureError = await this.signatureFileValidate(file);
            if (mimeError || signatureError) {
                this.handleValidationError(targetInputname, file.name, `${mimeError ?? ''} ${signatureError ?? ''} name_image: ${file.name}`)
                continue;
            }
            if (this.getValidateFile(file.name) === true) {
                await this.heightValidate(file, targetInputname, optionsimg.minHeight, optionsimg.maxHeight, optionsimg.unityDimensions);
                await this.widthValidate(file, targetInputname, optionsimg.minWidth, optionsimg.maxWidth, optionsimg.unityDimensions);
            }
        }
        return this;
    }
    /**
     * Validates the file signature to ensure the file is not disguised as another type.
     * Valide la signature du fichier pour s'assurer qu'il ne s'agit pas d'un fichier déguisé.
     */
    protected async signatureFileValidate(file: File, uint8Array?: Uint8Array): Promise<string | null> {
        const readerImg = new FileReader();
        return new Promise<string | null>((resolve) => {
            readerImg.onload = async (event: ProgressEvent<FileReader>) => {
                try {
                    const arrayBuffer = event.target!.result as ArrayBuffer;
                    if (!arrayBuffer) {
                        resolve(`Unable to process the file ${file.name}. It might be empty or corrupted.`);
                        return;
                    }
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const hexasignatureFile = uint8Array.subarray(0, 4).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
                    // Obtention du vrai MimeType d'un fichier image
                    if (this.detecteMimetype(hexasignatureFile, uint8Array) !== file.type) {
                        resolve(`The file ${file.name} you selected appears to be disguised as an image. Please choose a valid image file to continue.`)
                    } else {
                        resolve(null);
                    }

                } catch (error) {
                    console.log('onload', error);
                    console.error(`An error occurred while processing the file ${file.name}: ${error}`);
                    resolve(`An error occurred while processing the file ${file.name}: ${error}`);
                }
            };
            readerImg.onerror = async (errorEvent: ProgressEvent<FileReader>) => {
                const error = errorEvent.target?.error;  // Accès à l'objet d'erreur spécifique
                console.log('onerror:   ', error);
                resolve(`File reading error: ${error?.message} name_image: ${file.name}`);
            };
            readerImg.readAsArrayBuffer(file);
        });
    }
    /**
     * Validates the MIME type of the file against the allowed MIME types.
     * Valide le type MIME du fichier par rapport aux types MIME autorisés.
     */
    protected async mimeTypeFileValidate(file: File, allowedMimeTypeAccept?: string[] | undefined): Promise<string | null> {
        try {
            await validateImage(file, { throw: true });
        } catch (error) {
            return `${error} name_image: ${file.name}`;
        }
        return null;
    }
    protected getContext(): string {
        return 'image';
    }
    /**
     * Récupère les dimensions de l'image.
     * @returns Une promesse qui se résout aux dimensions de l'image.
     */
    protected getFileDimensions(file: File): Promise<{ width: number; height: number; }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }
    /**
     * cette fonction determine le vrai MimeType du fichier image
     * @param hexasignatureFile la signature haxadecimal du fichier image
     * @param uint8Array 
     * @returns string return le vrai type du fichier
     */
    private detecteMimetype = (hexasignatureFile: string, uint8Array: Uint8Array): string | null => {
        let mimeType = null;
        if (this.signatureHexadecimalFormatFile.jpg.includes(hexasignatureFile.substring(0, 8)) || this.signatureHexadecimalFormatFile.jpeg.includes(hexasignatureFile.substring(0, 8))) {
            mimeType = 'image/jpeg';
        } else if (this.signatureHexadecimalFormatFile.png.includes(hexasignatureFile)) {
            mimeType = 'image/png';
        } else if (this.signatureHexadecimalFormatFile.gif.includes(hexasignatureFile)) {
            mimeType = 'image/gif';
        } else if (this.signatureHexadecimalFormatFile.bmp.includes(hexasignatureFile.substring(0, 4))) {
            mimeType = 'image/bmp';
        } else if (this.signatureHexadecimalFormatFile.webp.includes(hexasignatureFile)) {
            mimeType = 'image/webp';
        } else {
            // Check for SVG by looking at the first few characters
            const textDecoder = new TextDecoder();
            const text = textDecoder.decode(uint8Array.subarray(0, 100)).toLowerCase();
            if (text.includes('<svg') && text.includes('xmlns="http://www.w3.org/2000/svg"')) {
                mimeType = 'image/svg+xml';
            }
        }
        return mimeType;
    }

    /**
     *Cette fonction vous permettra de convertir une liste de types MIME en une liste d'extensions de fichier correspondantes. 
     * @param allowedMimeTypes une liste de type MiMe
     * @returns string[] return un tableau contenant les extensions
     */
    private getExtensions = (allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']): string[] => {
        let extensions = [];
        for (let index = 0; index < allowedMimeTypes.length; index++) {
            const mimeType = allowedMimeTypes[index];
            const extensionitem = mimeType.split('/').pop()?.toLowerCase();
            if (extensionitem && extensionitem !== undefined && extensionitem !== "*") {
                extensions.push(extensionitem);
            }
        }
        if (!extensions.includes('jpg')) {
            extensions.push('jpg');
        }
        this.setAllowedExtension(extensions);
        return extensions;
    }
}