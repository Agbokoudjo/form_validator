import Mammoth from 'mammoth';
import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

import { OptionsFile } from '../../interfaces';
import { AbstractMediaValidator } from './AbstractMediaValidator';
import { MediaValidatorInterface } from './MediaValidatorInterface';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'public/workers/pdf.worker.min.js';

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
class DocumentValidator extends AbstractMediaValidator implements MediaValidatorInterface{
	protected readonly mimeTypeMap: Record<string, string[]> = {
    pdf: ['application/pdf'],
    doc: ['application/msword'],
    docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    xls: ['application/vnd.ms-excel'],
    xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    odt: ['application/vnd.oasis.opendocument.text'],  // Spécifique à Linux/LibreOffice/ODT format
    ods: ['application/vnd.oasis.opendocument.spreadsheet'],  // Spécifique à Linux/LibreOffice/ODS format
    txt: ['text/plain'],
    csv:['text/csv']
};


    protected readonly signatureHexadecimalFormatDocument: Record<string, string[]> = {
        pdf:  ['25504446'],
        word: ['504b0304', 'd0cf11e0'],
        excel: ['504b0304', 'd0cf11e0'],
    };
	private static m_instance_doc_validator: DocumentValidator;
	private m_Document: Map<string,File>;
	private constructor() {
		super();
		this.m_Document = new Map<string, File>();
	}
	public static getInstanceDocValidator = (): DocumentValidator => {
		if (!DocumentValidator.m_instance_doc_validator) {
			DocumentValidator.m_instance_doc_validator = new DocumentValidator();
		}
		return DocumentValidator.m_instance_doc_validator;
	}
	public validatorFile = async (medias: File | FileList,targetInputname:string='doc',optionsdoc:OptionsFile): Promise<this> => {
		const files = medias instanceof FileList ? Array.from(medias) : [medias];
		const extension_media = this.getExtensions(
			optionsdoc.allowedMimeTypeAccept ||
            ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]);
		for (const filepdf of files) {
			this.m_Document.set(filepdf.name, filepdf);
			const extension_file = this.validatorExtension(targetInputname, filepdf.name, extension_media);
			let format_validator='pdf'
			if (['odt,docx,doc'].includes(extension_file)) {
				format_validator = 'word';
			} else if (['xlsx,xls'].includes(extension_file)) {
				format_validator = 'excel';
            } else if ('csv'===extension_file) {
                format_validator = 'csv';
            }
			const signatureErrorPdf = await this.validate(filepdf,format_validator);
			 if (signatureErrorPdf) {
               this.handleValidationError(targetInputname,filepdf.name,`${signatureErrorPdf} name_document: ${filepdf.name}`)
            }
        }
        return this;
	}
	
	private  validate=async (file: File, formatValidator: string): Promise<string | null>=> {
        const mimeTypes = this.mimeTypeMap[formatValidator];
        const uint8Array = await this.readFileAsUint8Array(file);

        if (!this.validateSignature(file, formatValidator, uint8Array)) {
            return `The file ${file.name} has an invalid signature.`;
        }

        switch (formatValidator) {
            case 'pdf':
                return this.validatePdf(file, uint8Array);

            case 'word':
                return this.validateWord(file, uint8Array);

            case 'excel':
                return this.validateExcel(file, uint8Array);

            case 'text':
                return this.validateText(file);

            case 'csv':
                return this.validateCsv(file);
            default:
                return `Unsupported file format: ${formatValidator}`;
        }
    }
	protected readFileAsUint8Array(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
            reader.onerror = () => reject(`Failed to read file: ${file.name}`);

            reader.readAsArrayBuffer(file);
        });
    }
    protected validateSignature = (file: File, formatValidator: string, uint8Array: Uint8Array): boolean => {
        const signatures = this.signatureHexadecimalFormatDocument[formatValidator] || [];
    
        if (signatures.length === 0 && ['csv','txt'].includes(formatValidator)===true) {
            console.log(`No signatures found for format: ${formatValidator}`);
            return true;
        }

        const fileSignature = Array.from(uint8Array.subarray(0, 4))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
            

        return signatures.some((signature) => fileSignature.startsWith(signature));
};

	protected async validatePdf(file: File, uint8Array: Uint8Array): Promise<string | null> {
        try {
            const pdfDocument = await pdfjsLib.getDocument(uint8Array).promise;
            if (pdfDocument.numPages > 0 && this.mimeTypeMap.pdf.includes(file.type)) {
                return null;
            } else {
                 return `The file ${file.name} is not a valid PDF.`;
            }
        } catch(error) {
            // Error while parsing PDF
            console.log('Error while parsing PDF', error)
            return `Failed to parse ${file.name}: ${error}`;
        }
    }

	protected async validateWord(file: File, uint8Array: Uint8Array): Promise<string | null> {
        try {
           // Convertir Uint8Array en ArrayBuffer
        const arrayBuffer = uint8Array.buffer;
        // Transmettre un objet de configuration valide à Mammoth
        const result = await Mammoth.extractRawText({ arrayBuffer: arrayBuffer as ArrayBuffer });
            if (result.value.trim()) {
                return null;
            } else {
                 return `The file ${file.name} is not a valid Word document.`;
            }
        } catch (error) {
              console.error("Error while validating Word document:", error);
           return `An error occurred while validating the Word document "${file.name}": ${error}`;
        }
    }

	protected async validateExcel(file: File, uint8Array: Uint8Array): Promise<string | null> {
        try {
            const workbook = XLSX.read(uint8Array.buffer, { type: 'array' });
            if (workbook.SheetNames.length > 0) {
                return null;
            }
        } catch {
            // Error while parsing Excel file
        }
        return `The file ${file.name} is not a valid Excel file.`;
    }
	protected validateText(file: File): Promise<string | null> {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
                const content = reader.result as string;
                resolve(content.trim() ? null : `The file ${file.name} is empty.`);
            };

            reader.onerror = () => {
                resolve(`The file ${file.name} could not be read.`);
            };

            reader.readAsText(file);
        });
    }
    protected async validateCsv(file: File): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
        Papa.parse(file, {
            header: true, // Utilise la première ligne comme en-tête
            skipEmptyLines: true, // Ignore les lignes vides
            complete: (results) => {
                console.log(results.data)
                if (results.data && results.data.length > 0 && results.errors.length ===0) {
                    resolve(null); // Fichier valide
                } else {
                    resolve(`The CSV file "${file.name}" is empty or poorly formatted!`);
                }
            },
            error: (err) => {
                console.error("Error parsing the CSV file:", err.message);
                resolve(`Error validating CSV file: ${err.message}`);
            },
        });
    });
}

	public detecteMimetype = (filename:string,hexasignatureFile: string,uint8Array: Uint8Array): this => {
        let mimeType = 'unknown';
        if (this.signatureHexadecimalFormatDocument.pdf.includes(hexasignatureFile)) {
            mimeType = 'application/pdf';
        } else if (this.signatureHexadecimalFormatDocument.doc.includes(hexasignatureFile)) {
            mimeType = 'application/msword';
        } else if (this.signatureHexadecimalFormatDocument.docx.includes(hexasignatureFile)) {
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (this.signatureHexadecimalFormatDocument.xls.includes(hexasignatureFile)) {
            mimeType = 'application/vnd.ms-excel';
        } else if (this.signatureHexadecimalFormatDocument.xlsx.includes(hexasignatureFile)) {
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if (this.signatureHexadecimalFormatDocument.ppt.includes(hexasignatureFile)) {
            mimeType = 'application/vnd.ms-powerpoint';
        } else if (this.signatureHexadecimalFormatDocument.pptx.includes(hexasignatureFile)) {
            mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        }
		this.setMimeType(filename, mimeType);
        return this;
    }
	protected getContext(): string {
        return 'document';
	}
	 /**
     * Retrieves a stored file pdf file by its ID.
     * Récupère un fichier file pdf stocké par son ID.
     */
	protected getFileId=(id: string): File =>{
		const document_file = this.m_Document.get(id);
		if (!document_file) {throw new Error(`the document pdf ${id} no exist in store`);}
		return document_file ;
	}
	public getExtensions = (allowedMimeTypeAccept: string[]): string[] => {
        const extensionsdoc = allowedMimeTypeAccept.reduce<string[]>((acc, mimeType) => {
            // Récupérer les extensions sans les points
            const extensions = Object.keys(this.mimeTypeMap).filter(ext =>
                this.mimeTypeMap[ext].includes(mimeType)
            )
            return acc.concat(extensions);
        }, []);
    this.setAllowedExtension(extensionsdoc);
    return extensionsdoc;
};


}
export default DocumentValidator.getInstanceDocValidator();