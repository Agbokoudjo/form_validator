import {
    FormInputType,
    WordScoringOptions,
    DataInput,
    HTMLFormChildrenElement
} from "../../_Utils";
import { CountryCode } from "libphonenumber-js";

export interface BaseInputOptions {
    requiredInput?: boolean;
    minLength?: number;
    maxLength?: number;
    escapestripHtmlAndPhpTags?: boolean;
    errorMessageInput?: string;
    typeInput?: FormInputType;
    regexValidator?: RegExp;
    match?: boolean;
}

export interface TextInputOptions extends BaseInputOptions {
    egAwait?: string;
}


export interface TelInputOptions extends TextInputOptions {
    defaultCountry: CountryCode;
}

export interface NumberOptions {
    min?: number;
    max?: number;
    step?: number;
    regexValidator?: RegExp;
}

export interface FQDNOptions {
    allowWildcard?: boolean; // interdit les domaines de type *.example.com
    allowNumericTld?: boolean; // interdit les TLD purement numériques
    allowedUnderscores?: boolean; //if set to true, the validator will allow underscores in the URL.
    requireTLD?: boolean;         // Exige un TLD comme .com, .org
    allowTrailingDot?: boolean; // if set to true, the validator will allow the domain to end with a `.` character.
    ignoreMaxLength?: boolean; // vérifie que chaque partie ≤ 63 caractères
    allowHyphens?: boolean; // Les tirets sont la norme DNS, donc la valeur par défaut est TRUE.
}

export interface PasswordRuleOptions extends TextInputOptions {
    upperCaseAllow?: boolean;
    lowerCaseAllow?: boolean;
    symbolAllow?: boolean;
    numberAllow?: boolean;
    punctuationAllow?: boolean;
    minLowercase?: number;
    minUppercase?: number;
    minNumbers?: number;
    minSymbols?: number;
    customUpperRegex?: RegExp;
    customLowerRegex?: RegExp;
    customNumberRegex?: RegExp;
    customSymbolRegex?: RegExp;
    customPunctuationRegex?: RegExp;
    enableScoring?: boolean;
    scoringPasswordOptions?: WordScoringOptions
}

export interface DateInputOptions extends TextInputOptions {
    format?: string;       // Format attendu (ex: "YYYY-MM-DD", "DD/MM/YYYY")
    minDate?: Date;      // Date minimale
    maxDate?: Date;      // Date maximale
    allowFuture?: boolean; // Autoriser les dates futures
    allowPast?: boolean;   // Autoriser les dates passées
    delimiters?: string[]; // Délimiteurs autorisés
    strictMode?: boolean; //Si true, la date doit respecter strictement la longueur du format.
}

export interface EmailInputOptions extends FQDNOptions, TextInputOptions {
    allowUtf8LocalPart?: boolean;
    allowIpDomain?: boolean;
    allowQuotedLocal?: boolean;
    ignoreMaxLength?: boolean;
    hostBlacklist?: Array<string | RegExp>;
    hostWhitelist?: Array<string | RegExp>;
    blacklistedChars?: string;
    requireDisplayName?: boolean,
    allowDisplayName?: boolean,
}

export interface URLOptions extends FQDNOptions, TextInputOptions {
    allowedProtocols?: string[];  // Ex: ['http', 'https']
    allowLocalhost?: boolean;     // Autoriser localhost
    allowIP?: boolean;            // Accepter les adresses IP
    allowQueryParams?: boolean;   // Accepter ?key=value
    allowHash?: boolean;           // Accepter #section
    validateLength?: boolean;   //if set to false isURL will skip string length validation. `max_allowed_length` will be ignored if this is set as `false`.
    maxAllowedLength?: number;  //if set, isURL will not allow URLs longer than the specified value (default is 2084 that IE maximum URL length).
    requirePort?: boolean;
    disallowAuth?: boolean; // Exclure user:pass@host
    allowProtocolRelativeUrls?: boolean; // Ex : //example.com
    hostWhitelist?: (string | RegExp)[];
    hostBlacklist?: (string | RegExp)[];
    requireHost?: boolean;
    requireValidProtocol?: boolean;
    requireProtocol?: boolean;
}

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
    unityMaxSizeFile?: UnityMaxSizeTypeFile;
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
export interface OptionsCsvFile extends OptionsFile {
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

    worker?: boolean;
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
 * Result of the Word document content inspection.
 * Only available for .docx files (ZIP-based format).
 */
export interface WordDocumentInfo {
    /** Number of paragraphs found in the document body. */
    paragraphCount: number;
    /** Number of tables found in the document body. */
    tableCount: number;
    /** Number of images embedded in the document. */
    imageCount: number;
    /** Extracted plain text (first 500 chars, for preview / content rules). */
    textPreview: string;
    /** Whether the document body contains any non-empty text. */
    hasContent: boolean;
    /** Word/Office application version string found in app.xml, if any. */
    appVersion?: string;
}

/**
 * Structural information extracted from an ODF document's content.xml.
 * Available after a successful deep inspection.
 */
export interface OdfDocumentInfo {
    /** Detected ODF MIME type from the in-archive "mimetype" entry. */
    detectedMimeType: string;
    /** Number of text paragraphs (<text:p> elements). */
    paragraphCount: number;
    /** Number of tables (<table:table> elements). */
    tableCount: number;
    /** Number of embedded images (<draw:image> elements). */
    imageCount: number;
    /** Extracted plain text preview (first 500 chars). */
    textPreview: string;
    /** Whether the document contains any non-empty text. */
    hasContent: boolean;
    /** LibreOffice / app version string from meta.xml, if present. */
    appVersion?: string;
}

export interface VideoDimensions {
    width: number;
    height: number
}

export interface SelectOptions {
    optionsChoices: string[];
    escapestripHtmlAndPhpTags?: boolean;
}

/**
 * Options for validating checkbox input fields.
 *
 * This interface defines the configuration used to validate groups of checkbox inputs,
 * such as the minimum and maximum number of boxes that must or can be selected.
 */
export interface OptionsCheckbox {
    /**
     * The maximum number of checkboxes that can be selected.
     * If defined, selecting more than this number will be considered invalid.
     */
    maxAllowed?: number;

    /**
     * The minimum number of checkboxes that must be selected.
     * If defined, selecting fewer than this number will be considered invalid.
     */
    minAllowed?: number;

    /**
     * Indicates whether at least one checkbox is required to be selected.
     * This is equivalent to setting minAllowed to 1 if true.
     */
    required?: boolean;
    dataChoices: string | string[];
    optionsChoicesCheckbox: string[];
}

export interface OptionsRadio {
    required?: boolean
}

/**
 * A union type that represents all possible validation option types
 * for supported media files (file, image, or video).
 */
export type OptionsValidateTypeFile = OptionsFile | OptionsImage
    | OptionsMediaVideo | OptionsExcelFile
    | OptionsCsvFile | OptionsWordFile | OptionsOdfFile;

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

export type OptionsValidate = TextInputOptions
    | EmailInputOptions
    | DateInputOptions
    | FQDNOptions
    | SelectOptions
    | OptionsRadio
    | OptionsCheckbox
    | PasswordRuleOptions
    | URLOptions
    | NumberOptions
    | TelInputOptions
    | OptionsFile
    | OptionsImage
    | OptionsMediaVideo
    | OptionsWordFile
    | OptionsOdfFile
    | OptionsCsvFile
    | OptionsExcelFile
    ;
export interface FieldStateValidating {
    errors: string[];
    isValid: boolean;
}

/**
 * Interface representing the data passed with a validation event.
 */
export interface FieldValidationEventDataInterface {
    /** The ID attribute of the validated field. */
    id: string;

    /** The name attribute of the validated field. */
    name: string;

    /** Optional error message(s) describing the validation issue(s). */
    message?: string[];

    /** The current value of the validated field. */
    value: DataInput;

    /** The name of the form or parent container. */
    formParentName: string;

    target: HTMLFormChildrenElement;
}

/**
 * @event Validate
 * Custom event names for field validation result.
 */
export const FieldValidationFailed = 'field:validation:failed';

export const FieldValidationSuccess = 'field:validation:success';

export type FormChildrenValidateEvent =
    | typeof FieldValidationFailed
    | typeof FieldValidationSuccess;

export type EventValidate = 'change' | 'blur' | 'input' | 'focus';

