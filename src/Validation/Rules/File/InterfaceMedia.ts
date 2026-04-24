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

export type UnityMaxSizeTypeFile = 'B' | 'KiB' | 'MiB' | 'GiB';

/**
 * Options for validating generic files (e.g., documents, PDFs).
 * 
 * @property allowedMimeTypeAccept - List of accepted MIME types (e.g., ["application/pdf", "text/plain"]).
 * @property maxsizeFile - Maximum file size allowed (in units defined by `unityMaxSizeFile`).
 * @property unityMaxSizeFile - Unit used for `maxsizeFile` (e.g., "KB", "MB").
 * @property extensions - Allowed file extensions (e.g., ["pdf", "docx"]).
 * @property unityDimensions - Optional label for dimensions (for display or reporting).
 */
export interface OptionsFile {
    allowedMimeTypeAccept?: string[];
    maxsizeFile?: number;
    unityMaxSizeFile?: UnityMaxSizeTypeFile ;
    allowedExtensions?: string[];
    unityDimensions?: string;
}

export interface DimensionsMediaOption {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
}
/**
 * Options for validating image files.
 * Extends OptionsFile with image-specific constraints.
 * 
 * @property minWidth - Minimum image width in pixels.
 * @property maxWidth - Maximum image width in pixels.
 * @property minHeight - Minimum image height in pixels.
 * @property maxHeight - Maximum image height in pixels.
 */
export interface OptionsImage extends OptionsFile, DimensionsMediaOption {

}

/**
 * Options for validating video files.
 * Extends OptionsFile with video-specific constraints.
 * 
 * @property duration - Maximum duration allowed for the video (in units defined by `unityDurationMedia`).
 * @property unityDurationMedia - Unit for duration (e.g., "seconds", "minutes").
 * @property minWidth - Minimum video width in pixels.
 * @property maxWidth - Maximum video width in pixels.
 * @property minHeight - Minimum video height in pixels.
 * @property maxHeight - Maximum video height in pixels.
 */
export interface OptionsMediaVideo extends OptionsFile, DimensionsMediaOption {
    duration?: number;
    unityDurationMedia?: string;
    validateBySignature?: boolean;
}

/**
 * Options specific to Excel file validation.
 * Extends the base file options with spreadsheet-level constraints.
 */
export interface OptionsExcelFile extends OptionsFile {
    /** Minimum number of sheets the workbook must contain. Default: 1 */
    minSheets?: number;
    /** Maximum number of sheets allowed in the workbook. */
    maxSheets?: number;
    /** Column headers that must be present in the first sheet. */
    requiredColumns?: string[];
    /** If true, rejects files whose first sheet contains no data rows. Default: true */
    rejectEmptySheet?: boolean;
    /** Index of the sheet to inspect for columns/data (0-based). Default: 0 */
    sheetIndex?: number;
}

/**
 * Supported column data types for CSV validation.
 *
 * - `"string"`  : non-empty text value
 * - `"number"`  : parseable as a finite JavaScript number
 * - `"date"`    : parseable by Date.parse()
 * - `"boolean"` : one of true / false / 1 / 0 (case-insensitive)
 * - `"email"`   : basic RFC-5322 email format
 */
export type CsvColumnType = 'string' | 'number' | 'date' | 'boolean' | 'email';

/**
 * Options specific to CSV file validation.
 */
export interface OptionsCsvFile extends OptionsFile{
    /**
    * Field delimiter.
    * PapaParse will auto-detect if omitted (recommended).
    */
    delimiter?: string;

    /**
     * Column headers that MUST be present in the first row.
     * Validation stops immediately if any are missing.
     */
    requiredHeaders?: string[];

    /**
     * Expected data type per column header.
     * Only the columns listed here are type-checked.
     *
     * @example { Age: 'number', Email: 'email', CreatedAt: 'date' }
     */
    columnTypes?: Record<string, CsvColumnType>;

    /**
     * If true, use the first line as column headers.
     * Default: true.
     */
    useFirstLineAsHeaders?: boolean;

    /**
     * If true, skip blank lines during parsing.
     * Default: true.
     */
    skipEmptyLines?: boolean;

    /**
     * Maximum number of data rows allowed.
     * No limit if omitted.
     */
    maxRows?: number;

    /**
     * Minimum number of data rows required.
     * Default: 1 (file must not be empty).
     */
    minRows?: number;

    /**
     * Stop accumulating row errors after this many have been collected.
     * Prevents extremely verbose output on large malformed files.
     * Default: 2.
     */
    maxRowErrors?: number;

    worker?:boolean;
}

/**
 * Options specific to Word file validation.
 */
export interface OptionsWordFile extends OptionsFile {
    /**
     * If true, rejects .docx files whose body contains no text at all.
     * Default: true.
     */
    rejectEmptyDocument?: boolean;

    /**
     * Minimum number of paragraphs the document must contain.
     * Only applies to .docx files. No check if omitted.
     */
    minParagraphs?: number;

    /**
     * Maximum number of pages allowed.
     * NOTE: Page count is NOT reliably computable in the browser
     * (it depends on font metrics and printer settings).
     * This option is intentionally NOT implemented to avoid false results.
     */
    maxPages?: number; // ← intentionally omitted

    /**
     * If true, also validates legacy .doc files (OLE2 format).
     * For .doc files only the magic bytes and MIME type are verified —
     * deep structural inspection is not possible in the browser without
     * a heavy native parser.
     * Default: true.
     */
    allowLegacyDoc?: boolean;

    /**
     * Strings that MUST appear somewhere in the document text.
     * Only applies to .docx files.
     * Useful for template compliance checks.
     */
    requiredTextFragments?: string[];
}

/**
 * Options for ODF / RTF file validation.
 */
export interface OptionsOdfFile extends OptionsFile {
    /**
     * Reject documents whose body contains no text at all.
     * Default: true.
     */
    rejectEmptyDocument?: boolean;

    /**
     * Minimum number of text paragraphs the document must contain.
     * Only applies to ODF files. No check if omitted.
     */
    minParagraphs?: number;

    /**
     * Text fragments that MUST appear somewhere in the document.
     * Only applies to ODF files (RTF text extraction is limited).
     */
    requiredTextFragments?: string[];

    /**
     * Also accept RTF files (.rtf).
     * RTF is a plain-text format — validated by magic bytes + text heuristic.
     * Default: true.
     */
    allowRtf?: boolean;
}

/**
 * A union type that represents all possible validation option types
 * for supported media files (file, image, or video).
 */
export type OptionsValidateTypeFile = OptionsFile | OptionsImage 
                                      | OptionsMediaVideo | OptionsExcelFile 
                                      | OptionsCsvFile | OptionsWordFile | OptionsOdfFile;

/**
 * Interface representing a validator that can validate various types of media.
 * 
 * @property fileValidator - A function that takes a media file or list,
 * validates it based on the provided options, and returns a Promise of the current instance.
 */
export interface MediaValidatorInterface {
    validate: (
        media: File | FileList,
        targetInputname: string,
        optionsfile: OptionsValidateTypeFile
    ) => Promise<this>;
}

/**
 * Représente les métadonnées d'un fichier multimédia (stocké dans IndexedDB ou sur un serveur distant).
 * Cette interface est utilisée pour la gestion des fichiers vidéo, audio ou autres médias dans l'application.
 */
export interface MediaMetadataProperty {
    /** URL du fichier multimédia (peut être local ou distant). */
    mediaFileUrl: string;

    /** ID renvoyé par le serveur après l'enregistrement des métadonnées. */
    mediaId?: number;

    /** Nom du fichier multimédia. */
    mediaFileName: string;

    /** Taille du fichier en octets. */
    mediaFileSize: number;

    /** Type MIME du fichier (ex. : video/mp4). */
    mediaFileMimeType: string;

    /** Timestamp indiquant la dernière modification du fichier. */
    mediaFileLastModified?: number;

    /** Objet File représentant le fichier multimédia. */
    mediaFile: File;

    /** ID généré dans la base de données IndexedDB. */
    id?: number;
    mediaFileDuration?: number; // Durée en secondes
    mediaFileResolution?: string; // Résolution, ex : "1920x1080"
    mediaFileThumbnailUrl?: string; // URL d'une miniature générée
}

