/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { validateImage } from 'image-validator';

import { OptionsFile } from '../../interfaces';
import { AbstractMediaValidator } from './AbstractMediaValidator';
import { MediaValidatorInterface } from './MediaValidatorInterface';

export interface OptionsImage extends OptionsFile {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
}
/**
 * ImageValidator Class
 * This class validates image files by checking their extensions, dimensions, MIME types, and other characteristics.
 * It ensures that uploaded files meet specific criteria, such as allowed file types and sizes.
 * Implements the FileValidatorInterface and extends the ErrorMessageHandle class.
 * 
 * Classe ImageValidator
 * Cette classe valide les fichiers image en vérifiant leurs extensions, dimensions, types MIME et autres caractéristiques.
 * Elle garantit que les fichiers téléchargés respectent des critères spécifiques, tels que les types de fichiers et tailles autorisés.
 * Implémente l'interface FileValidatorInterface et hérite de la classe ErrorMessageHandle.
 */
class ImageValidator extends AbstractMediaValidator implements MediaValidatorInterface {
    protected readonly signatureHexadecimalFormatFile:Record<string, string[]> = {
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
	private m_Image: Map<string,File>;
	private constructor() {
		super();
		this.m_Image = new Map<string, File>();
	}
	/**
     * Singleton method to get the single instance of the class.
     * Méthode singleton pour obtenir l'instance unique de la classe.
     */
	public static getInstance= (): ImageValidator => {
		if (!ImageValidator.m_instance_image_validator) {
			ImageValidator.m_instance_image_validator = new ImageValidator();
		}
		return ImageValidator.m_instance_image_validator;
	}
	/**
     * Validates an image file or a list of image files against the specified options.
     * Valide un fichier image ou une liste de fichiers image selon les options spécifiées.
     */
	public validatorFile= async (
		medias: File | FileList,
		targetInputname: string = 'photofile',
		optionsimg: OptionsImage = { allowedMimeTypeAccept: ['image/jpeg', 'image/png', 'image/jpg'] }
	): Promise<this> => {
        const files = medias instanceof FileList ? Array.from(medias) : [medias];
		const allowedMimeTypeAccept = optionsimg.allowedMimeTypeAccept || ['image/jpeg', 'image/png', 'image/jpg'];
		const extension_media = this.getExtensions(allowedMimeTypeAccept);
        for (const file of files) {
            this.m_Image.set(file.name, file);
			this.validatorExtension(targetInputname, file.name, extension_media); // Validation de l'extension dans la même boucle
           this.validatorSize(targetInputname,file.name, optionsimg.maxsizeFile || 5, optionsimg.unityMaxSizeFile || 'MiB')
            const mimeError = await this.validateFileMimeType(file, allowedMimeTypeAccept);
            const signatureError = await this.validateFileSignature(file);

            if (mimeError || signatureError) {
               this.handleValidationError(targetInputname,file.name,`${mimeError ?? ''} ${signatureError ?? ''} name_image: ${file.name}`)
            }
            if (this.getIsFileDiguise(file.name) === false) {
                this.validatorHeight(targetInputname,file.name, optionsimg.minHeight, optionsimg.maxHeight);
               this.validatorWidth(targetInputname, file.name,optionsimg.minWidth, optionsimg.maxWidth);
            }
        }
		return this;
    }
    protected setFile=(files: File[]): this=> {
        for (const file of files) {
            this.m_Image.set(file.name, file);
        }
        return this;
    }

	/**
     * Validates the file signature to ensure the file is not disguised as another type.
     * Valide la signature du fichier pour s'assurer qu'il ne s'agit pas d'un fichier déguisé.
     */
	private async validateFileSignature(file: File): Promise<string | null> {
		const readerImg = new FileReader();
		 return new Promise<string|null>((resolve) => {
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
                    this.detecteMimetype(file.name,hexasignatureFile, uint8Array);
                    if (this.getMimeType(file.name) !== file.type) {
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
	 private async validateFileMimeType(file: File, allowedMimeTypeAccept: string[]): Promise<string | null> {
        try {
            await validateImage(file, { throw: true });
        } catch (error) {
            return `${error} name_image: ${file.name}`;
        }

        /*const result = await validateMIMEType(file.name, {
            originalFilename: file.name,
            allowMimeTypes: allowedMimeTypeAccept
        });

        if (!result.ok) {
            return `${result.error?.message} name_image: ${file.name}`;
        }*/
        return null;
	 }
	/**
     * Validates the width of the image against the specified minimum and maximum values.
     * Valide la largeur de l'image par rapport aux valeurs minimales et maximales spécifiées.
     */
	protected validatorWidth = async (targetInputname: string,filename:string, minWidth: number | null | undefined, maxWidth: number | null | undefined): Promise<this> => {
        const dimensions = await this.getImageDimensions(filename);
        if (minWidth && dimensions.width < minWidth) {
            this.setIsValidFieldWithKey(targetInputname, false);
            this.setErrorMessageFieldWithKey(targetInputname, `The width of the image ${filename} is less than ${minWidth}`);
        }
        if (maxWidth && dimensions.width > maxWidth) {
            this.setIsValidFieldWithKey(targetInputname, false);
            this.setErrorMessageFieldWithKey(targetInputname, `The width of the image ${filename} is greater than ${maxWidth}`);
        }
        return this;
	}
	
	  /**
     * Retrieves a stored image file by its ID.
     * Récupère un fichier image stocké par son ID.
     */
	protected getFileId=(id: string): File =>{
		const image_file = this.m_Image.get(id);
		if (!image_file) {throw new Error(`the image ${id} no exist in store`);}
		return image_file;
	}
	protected getContext(): string {
        return 'image';
    }
	 /**
     * Valide la hauteur de l'image.
     * @param targetInputname Le nom du champ input.
     * @param minHeight La hauteur minimale.
     * @param maxHeight La hauteur maximale.
     * @returns Une promesse qui se résout à l'instance de la classe.
     */
    protected validatorHeight = async (targetInputname: string, filename:string,minHeight: number | null | undefined, maxHeight: number | null | undefined): Promise<this> => {
        const dimensions = await this.getImageDimensions(filename);
        if (minHeight && dimensions.height < minHeight) {
            this.setIsValidFieldWithKey(targetInputname, false);
            this.setErrorMessageFieldWithKey(targetInputname, `The image ${filename} height is less than ${minHeight}`);
        }
        if (maxHeight && dimensions.height > maxHeight) {
            this.setIsValidFieldWithKey(targetInputname, false);
            this.setErrorMessageFieldWithKey(targetInputname, `The image ${filename} height is greater than ${maxHeight}`);
        }
        return this;
    }
	/**
     * Récupère les dimensions de l'image.
     * @returns Une promesse qui se résout aux dimensions de l'image.
     */
    private getImageDimensions = (id:string): Promise<{filename:string, width: number, height: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({filename:id, width: img.width, height: img.height });
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(this.getFileId(id));
        });
    }
	/**
     * cette fonction determine le vrai MimeType du fichier image
     * @param hexasignatureFile la signature haxadecimal du fichier image
     * @param uint8Array 
     * @returns string return le vrai type du fichier
     */
    public detecteMimetype = (id_or_filename:string,hexasignatureFile: string, uint8Array: Uint8Array): this => {
        let mimeType = 'unknown';
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
			this.setMimeType(id_or_filename,mimeType);
            return this;
    }
	
	/**
     *Cette fonction vous permettra de convertir une liste de types MIME en une liste d'extensions de fichier correspondantes. 
     * @param allowedMimeTypes une liste de type MiMe
     * @returns string[] return un tableau contenant les extensions
     */
    public getExtensions = (allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']): string[] => {
        let extensions = [];
        for (let index = 0; index < allowedMimeTypes.length; index++) {
            const mimeType = allowedMimeTypes[index];
            const extensionitem = mimeType.split('/').pop()?.toLowerCase();
            if (extensionitem && extensionitem !==undefined) {
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
export default ImageValidator.getInstance();