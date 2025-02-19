import { bytesToMegabytes } from '../../module_fonction/function';
import { ErrorMessageHandle } from '../ErrorMessageHandle';

/** 
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */
export abstract class AbstractMediaValidator extends ErrorMessageHandle{
	protected m_is_file_deguise: Map<string, boolean>;
	protected m_allowedExtension: string[];
	protected m_mimeType: Map<string, string>;
	protected constructor() {
		super()
		this.m_allowedExtension = [];
		this.m_is_file_deguise = new Map<string, boolean>();
		this.m_mimeType = new Map<string, string>();
	}
	protected setMimeType = (id:string,mimeType: string): this => {
        this.m_mimeType.set(id,mimeType);
        return this;
    }
	protected getMimeType = (id: string): string => {
		const mimeType = this.m_mimeType.get(id);
		if (!mimeType) {throw new Error(`${id} no exist in Map`);}
		return mimeType;
		
	}
	protected setIsFileDiguise = (id:string,isfileDiguise: boolean): this => {
        this.m_is_file_deguise.set(id,isfileDiguise);
        return this;
    }
	protected getIsFileDiguise = (id: string): boolean|undefined => {
		return this.m_is_file_deguise.get(id);
	}
	/**
     * Handles validation errors by setting error messages and flags.
     * Gère les erreurs de validation en définissant les messages d'erreur et les indicateurs.
     */
	protected handleValidationError=(targetInputname: string, filename: string, errorMessage: string):void=> {
		this.setIsFileDiguise(filename, true);
		this.setIsValidFieldWithKey(targetInputname, false);
		this.setErrorMessageFieldWithKey(targetInputname, errorMessage);
	}
	public setAllowedExtension = (allowedExtension: string[]): this => {
        this.m_allowedExtension = allowedExtension;
        return this;
    }
	protected getAllowedextension = (): string[] => { return this.m_allowedExtension; }
	protected abstract getFileId(id_or_filename: string): File;
	protected abstract getContext(): string;
	/**
     * Validates the size of the image file against the maximum allowed size.
     * Valide la taille du fichier image par rapport à la taille maximale autorisée.
     */
	protected validatorSize = (targetInputname: string = 'photofile',filename:string, sizeImg: number = 5, unitysize = 'MiB'): this => {
        if (bytesToMegabytes(this.getFileId(filename).size) > sizeImg) {
            this.setIsValidFieldWithKey(targetInputname, false);
            this.setErrorMessageFieldWithKey(targetInputname, `the ${this.getContext()} ${filename} file is too large, maximum recommended size is ${sizeImg} ${unitysize}`)
        }
        return this;
	}
	/**
     * Valide l'extension du fichier image.
     * @param targetInputname Le nom du champ input.
     * @param allowedExtensions Un tableau des extensions autorisées.
     * @returns L'instance de la classe.
     */
    public validatorExtension = (targetInputname: string,filename:string, allowedExtensions: string[] = ['jpg', 'jpeg', 'png']):string => {
        const fileExtension = this.getExtensionFile(this.getFileId(filename));
        if (fileExtension && !allowedExtensions.includes(fileExtension)) {
            this.setIsValidFieldWithKey(targetInputname, false);
            this.setErrorMessageFieldWithKey(targetInputname, `The ${this.getContext()} ${filename} extension .${fileExtension} is not allowed.`);
        }
        return fileExtension;
	}
	protected getExtensionFile(file: File): string{
		return file.name.split('.').pop()?.toLowerCase() as string;
	}
 }