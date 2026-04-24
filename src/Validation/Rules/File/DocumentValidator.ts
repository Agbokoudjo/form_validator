/** 
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { AbstractMediaValidator } from './AbstractMediaValidator';
import * as pdfjsLib from 'pdfjs-dist';
import { OptionsFile, MediaValidatorInterface} from './InterfaceMedia';
 
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.5.207/build/pdf.worker.min.mjs';

/**
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 */
export class PdfValidator extends AbstractMediaValidator implements MediaValidatorInterface {
    protected readonly signatureHexadecimalFormatDocument: string[] = ['25504446'];

    private static instance: PdfValidator;

    private constructor() { super(); }

    public static getInstance(): PdfValidator {
        if (!PdfValidator.instance) {
            PdfValidator.instance = new PdfValidator();
        }
        return PdfValidator.instance;
    }

    public validate = async (medias: File | FileList, targetInputname: string, optionsdoc: OptionsFile): Promise<this> => {

        const files = medias instanceof FileList ? Array.from(medias) : [medias];
        const mimeTypeMap = optionsdoc.allowedMimeTypeAccept || ['application/pdf', 'application/x-pdf']

        this.formErrorStore.clearFieldState(targetInputname);

        for (const filepdf of files) {
            const isValidFileExtension = this.isValidExtension(filepdf, optionsdoc.allowedExtensions || ['pdf']);
            if (isValidFileExtension) {
                this.handleValidationError(targetInputname, filepdf.name, isValidFileExtension);
                break;
            }

            if (filepdf.type && !mimeTypeMap.includes(filepdf.type)) {
                this.handleValidationError(targetInputname, filepdf.name, `Unexpected MIME type for ${filepdf.name}: ${filepdf.type}`);
                break;
            }

            const signatureErrorPdf = await this.filevalidate(filepdf);
            if (signatureErrorPdf) {
                this.handleValidationError(targetInputname, filepdf.name, `${signatureErrorPdf} name_document: ${filepdf.name}`);
                break;
            }
        }
        return this;
    }

    private async filevalidate(file: File): Promise<string | null> {

        const uint8Array = await this.readFileAsUint8Array(file);

        if (!this.validateDocumentSignature(uint8Array, this.signatureHexadecimalFormatDocument)) {
            return `The file ${file.name} has an invalid signature.`;
        }

        return this.validatePdf(file, uint8Array);
    }

    private async validatePdf(file: File, uint8Array: Uint8Array): Promise<string | null> {
        try {
            const pdfDocument = await pdfjsLib.getDocument(uint8Array).promise;
            if (pdfDocument.numPages <= 0) {
                return `The file ${file.name} contains no pages.`;
            }

            return null; //`The file ${file.name} is not a valid PDF.`;
        } catch (error) {
            // Error while parsing PDF
            console.log('Error while parsing PDF', error)
            return `Failed to parse ${file.name}: ${error}`;
        }
    }

    protected getContext(): string {
        return 'document pdf';
    }
}

export const pdfValidator = PdfValidator.getInstance();

import * as XLSX from 'xlsx';
import { OptionsExcelFile } from "./InterfaceMedia"

/**
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class ExcelValidator
 *
 * Validates Excel files (.xls / .xlsx) coming from any OS (Windows, Linux, macOS)
 * by performing the following checks in order:
 *
 *  1. File extension  (.xls | .xlsx)
 *  2. File size
 *  3. MIME type       (declared by the browser/OS)
 *  4. Binary signature (magic bytes — OLE2 for .xls, ZIP/PK for .xlsx)
 *  5. Workbook structure via SheetJS:
 *       - at least one sheet exists
 *       - sheet count within allowed range
 *       - target sheet is not empty (optional)
 *       - required columns are present (optional)
 *
 * Cross-platform note:
 *  - Windows may report "application/vnd.ms-excel" for both .xls and .xlsx.
 *  - Linux / macOS sometimes report "application/octet-stream" for .xls files.
 *  - Magic bytes are therefore the authoritative format check, not the MIME type.
 *
 * @extends AbstractMediaValidator
 * @implements MediaValidatorInterface
 */
export class ExcelValidator extends AbstractMediaValidator implements MediaValidatorInterface {

    /**
    * Known MIME types for Excel files, grouped by extension.
    *
    * Cross-platform reality:
    *  - Windows declares "application/vnd.ms-excel" for .xls AND sometimes for .xlsx.
    *  - macOS / Linux may declare "application/octet-stream" for .xls.
    *  - "application/zip" can appear for .xlsx (it is a ZIP container).
    * We accept all of these and rely on magic bytes for the real check.
    */
    private readonly mimeTypeMap: Record<string, string[]> = {
        xls: [
            'application/vnd.ms-excel',         // Windows standard
            'application/msexcel',              // Legacy alias
            'application/x-msexcel',            // Legacy alias
            'application/octet-stream',         // Linux / macOS fallback
        ],
        xlsx: [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Standard
            'application/vnd.ms-excel',         // Windows sometimes reports this for .xlsx
            'application/zip',                  // .xlsx is a ZIP container
            'application/octet-stream',         // Fallback
        ],
    };

    /**
     * Magic bytes for Excel formats:
     *  - 'd0cf11e0' : OLE2 Compound Document (used by .xls, .doc, .ppt, …)
     *  - '504b0304' : ZIP local file header (used by .xlsx, .docx, .pptx, …)
     *
     * Note: '504b0304' alone does not guarantee an Excel file — any ZIP-based
     * Office format shares this signature. The workbook structure check (step 5)
     * is therefore essential to confirm it is actually an Excel workbook.
     */
    private readonly signatureHexadecimalFormatDocument: string[] = [
        'd0cf11e0', // OLE2 — .xls (also .doc, .ppt — filtered by extension + workbook parse)
        '504b0304', // ZIP  — .xlsx (also .docx, .pptx — filtered by workbook parse)
    ];

    private static instance: ExcelValidator;

    private constructor() { super(); }

    public static getInstance(): ExcelValidator {
        if (!ExcelValidator.instance) {
            ExcelValidator.instance = new ExcelValidator();
        }
        return ExcelValidator.instance;
    }

    /**
     * Validates a File or FileList of Excel files.
     *
     * @param medias          - A single File or a FileList.
     * @param targetInputname - The name of the input field (used as the error key).
     * @param optionsfile     - Validation options (extensions, size, required columns, …).
     */
    public validate = async (
        medias: File | FileList,
        targetInputname: string = 'excelfile',
        optionsfile: OptionsExcelFile = {}
    ): Promise<this> => {
        this.formErrorStore.clearFieldState(targetInputname);

        const files = medias instanceof FileList ? Array.from(medias) : [medias];

        const {
            allowedExtensions = ['xls', 'xlsx'],
            maxsizeFile = 5,
            unityMaxSizeFile = 'MiB',
        } = optionsfile;

        for (const file of files) {
            const extensionError = this.isValidExtension(file, allowedExtensions);
            if (extensionError) {
                this.handleValidationError(targetInputname, file.name, extensionError);
                break; 
            }

            this.sizeValidate(file, targetInputname, maxsizeFile, unityMaxSizeFile);

            //  MIME type (cross-platform — soft check, warning only)
            const mimeWarning = this.checkMimeType(file);
            if (mimeWarning) {
                // Not a hard block: MIME is unreliable across OSes.
                // The magic bytes check below is authoritative.
                console.warn(`[ExcelValidator] ${mimeWarning}`);
            }

            //  Binary signature (magic bytes)
            let uint8Array: Uint8Array;
            try {
                uint8Array = await this.readFileAsUint8Array(file);
            } catch {
                this.handleValidationError(
                    targetInputname,
                    file.name,
                    `Unable to read file "${file.name}".`
                );
                break;
            }

            if (!this.validateDocumentSignature(uint8Array, this.signatureHexadecimalFormatDocument)) {
                this.handleValidationError(
                    targetInputname,
                    file.name,
                    `The file "${file.name}" does not have a valid Excel signature (OLE2 or ZIP). ` +
                    `It may be corrupt or not a real Excel file.`
                );
                break;
            }

            // Workbook structure via SheetJS
            const workbookError = await this.validateExcel(file, uint8Array, optionsfile);
            if (workbookError) {
                this.handleValidationError(targetInputname, file.name, workbookError);
                break;
            }
        }

        return this;
    };

    protected getContext(): string {
        return 'Excel file';
    }

    /**
     * Soft MIME type check.
     *
     * Returns a warning string if the declared MIME type is not in any of the
     * known lists, but does NOT block validation (magic bytes are authoritative).
     *
     * @param file - The file to check.
     * @returns A warning string or null.
     */
    private checkMimeType(file: File): string | null {
        if (!file.type) {
            // Empty MIME type is common on Linux for .xls — not an error
            return null;
        }

        const allKnownMimes = [
            ...this.mimeTypeMap.xls,
            ...this.mimeTypeMap.xlsx,
        ];

        if (!allKnownMimes.includes(file.type)) {
            return (
                `Unexpected MIME type "${file.type}" for file "${file.name}". ` +
                `This may be normal on some operating systems. ` +
                `Binary signature will be used as the authoritative check.`
            );
        }

        return null;
    }

    /**
     * Parses the Excel file with SheetJS and validates its structure.
     *
     * Checks performed:
     *  - The workbook can be parsed without throwing.
     *  - At least one sheet exists (or `minSheets` if specified).
     *  - Sheet count does not exceed `maxSheets` if specified.
     *  - The target sheet (default: first) is not empty if `rejectEmptySheet` is true.
     *  - All `requiredColumns` are present as headers in the target sheet.
     *
     * @param file        - The original File object (for error messages).
     * @param uint8Array  - Raw bytes of the file.
     * @param options     - Excel-specific validation options.
     * @returns An error string, or null if the workbook is valid.
     */
    private async validateExcel(
        file: File,
        uint8Array: Uint8Array,
        options: OptionsExcelFile = {}
    ): Promise<string | null> {
        const {
            minSheets = 1,
            maxSheets,
            requiredColumns = [],
            rejectEmptySheet = true,
            sheetIndex = 0,
        } = options;

        let workbook: XLSX.WorkBook;

        try {
            // Use a copy of the buffer to avoid detached ArrayBuffer issues
            workbook = XLSX.read(uint8Array.slice(0).buffer, { type: 'array' });
        } catch (error) {
            return `The file "${file.name}" could not be parsed as an Excel workbook: ${error}`;
        }

        const sheetCount = workbook.SheetNames.length;

        // Sheet count — minimum
        if (sheetCount < minSheets) {
            return (
                `The file "${file.name}" contains ${sheetCount} sheet(s), ` +
                `but at least ${minSheets} is required.`
            );
        }

        // Sheet count — maximum
        if (maxSheets !== undefined && sheetCount > maxSheets) {
            return (
                `The file "${file.name}" contains ${sheetCount} sheet(s), ` +
                `but the maximum allowed is ${maxSheets}.`
            );
        }

        // Target sheet existence
        if (sheetIndex >= sheetCount) {
            return (
                `The file "${file.name}" does not have a sheet at index ${sheetIndex}. ` +
                `It only contains ${sheetCount} sheet(s).`
            );
        }

        const targetSheetName = workbook.SheetNames[sheetIndex];
        const targetSheet = workbook.Sheets[targetSheetName];

        // Convert sheet to JSON (empty cells become empty strings)
        const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(targetSheet, {
            defval: '',
        });

        // Empty sheet check
        if (rejectEmptySheet && rows.length === 0) {
            return (
                `The sheet "${targetSheetName}" in "${file.name}" contains no data rows.`
            );
        }

        // Required columns check
        if (requiredColumns.length > 0 && rows.length > 0) {
            const presentColumns = Object.keys(rows[0]);
            const missingColumns = requiredColumns.filter(col => !presentColumns.includes(col));

            if (missingColumns.length > 0) {
                return (
                    `The sheet "${targetSheetName}" in "${file.name}" is missing ` +
                    `required column(s): ${missingColumns.join(', ')}.`
                );
            }
        }

        return null; // all checks passed
    }
}

export const excelValidator = ExcelValidator.getInstance();

import * as Papa from 'papaparse';
import { OptionsCsvFile, CsvColumnType } from './InterfaceMedia';

/**
 * Per-row validation error returned by the CSV validator.
 */
export interface CsvRowError {
    /** 1-based row number (header = row 1, first data row = row 2). */
    row: number;
    /** Column header name. */
    column: string;
    /** Human-readable description of the problem. */
    message: string;
}

/**
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class CsvValidator
 *
 * Validates CSV files (File objects) in the browser using PapaParse.
 *
 * Checks performed in order:
 *  1. File extension           (.csv)
 *  2. File size
 *  3. MIME type                (soft check — unreliable across OSes)
 *  4. Binary / BOM check       (detects non-text files early)
 *  5. PapaParse structural check (parse errors reported by PapaParse)
 *  6. Header presence          (required columns)
 *  7. Row count                (minRows / maxRows)
 *  8. Column data types        (per-cell type validation)
 *
 * Cross-platform MIME reality:
 *  - Windows : "text/csv"
 *  - macOS   : "text/csv" or "text/comma-separated-values"
 *  - Linux   : "text/plain" or "application/csv"
 * → MIME is therefore treated as a warning only; the BOM / parse checks
 *   are the authoritative format verification.
 *
 * @extends AbstractMediaValidator
 * @implements MediaValidatorInterface
 */
export class CsvValidator extends AbstractMediaValidator implements MediaValidatorInterface {

    private static instance: CsvValidator;
    /**
     * All known MIME types for CSV files across operating systems.
     */
    private readonly mimeTypeMap: string[] = [
        'text/csv',                        // Standard (Windows, macOS)
        'text/comma-separated-values',     // macOS alternative
        'text/plain',                      // Linux fallback
        'application/csv',                 // Linux alternative
        'application/vnd.ms-excel',        // Windows — Excel sometimes assigns this to .csv
        'application/octet-stream',        // Generic binary fallback
    ];

    private constructor() { super(); }

    public static getInstance(): CsvValidator {
        if (!CsvValidator.instance) {
            CsvValidator.instance = new CsvValidator();
        }
        return CsvValidator.instance;
    }

    /**
     * Validates a File or FileList of CSV files.
     *
     * @param medias          - A single File or a FileList.
     * @param targetInputname - The name of the input field (error key).
     * @param optionsfile     - Validation options.
     */
    public validate = async (
        medias: File | FileList,
        targetInputname: string = 'csvfile',
        optionsfile: OptionsCsvFile = {}
    ): Promise<this> => {
        this.formErrorStore.clearFieldState(targetInputname);

        const files = medias instanceof FileList ? Array.from(medias) : [medias];

        const {
            allowedExtensions = ['csv'],
            maxsizeFile = 5,
            unityMaxSizeFile = 'MiB',
        } = optionsfile;

        for (const file of files) {
            const extensionError = this.isValidExtension(file, allowedExtensions);
            if (extensionError) {
                this.handleValidationError(targetInputname, file.name, extensionError);
                break;
            }

            this.sizeValidate(file, targetInputname, maxsizeFile, unityMaxSizeFile);

            // MIME type — soft warning only (unreliable across OSes)
            const mimeWarning = this.checkMimeType(file);
            if (mimeWarning) {
                console.warn(`[CsvValidator] ${mimeWarning}`);
            }

            // Binary / BOM pre-check (read first bytes)
            let uint8Array: Uint8Array;
            try {
                uint8Array = await this.readFileAsUint8Array(file);
            } catch {
                this.handleValidationError(
                    targetInputname,
                    file.name,
                    `Unable to read file "${file.name}".`
                );
                break;
            }

            const binaryError = this.checkNotBinaryFile(file, uint8Array);
            if (binaryError) {
                this.handleValidationError(targetInputname, file.name, binaryError);
                break;
            }

            //Full CSV validation via PapaParse
            const csvError = await this.validateCsv(file, optionsfile);
            if (csvError) {
                this.handleValidationError(targetInputname, file.name, csvError);
                break;
            }
        }

        return this;
    };

    protected getContext(): string {
        return 'CSV file';
    }

    /**
    * Soft MIME type check — returns a warning string if the MIME type is
    * unexpected, but does NOT block validation (unreliable across OSes).
    */
    private checkMimeType(file: File): string | null {
        if (!file.type) {
            // Empty MIME type is common on Linux for .csv — not an error
            return null;
        }
        if (!this.mimeTypeMap.includes(file.type)) {
            return (
                `Unexpected MIME type "${file.type}" for "${file.name}". ` +
                `This may be normal on some operating systems.`
            );
        }
        return null;
    }

     /**
     * Full CSV validation using PapaParse.
     *
     * Steps:
     *  5. PapaParse structural check (parse errors)
     *  6. Required headers
     *  7. Row count (minRows / maxRows)
     *  8. Column data types (per cell)
     *
     * @param file    - The CSV file.
     * @param options - Validation options.
     * @returns A formatted error string, or null if the file is valid.
     */
    private  validateCsv(file: File, options: OptionsCsvFile): Promise<string | null> {
        const {
            requiredHeaders  = [],
            columnTypes      = {},
            useFirstLineAsHeaders = true,
            skipEmptyLines   = true,
            delimiter,           // undefined → PapaParse auto-detects
            minRows          = 1,
            maxRows,
            worker,
            maxRowErrors=2
        } = options;

        return new Promise<string | null>((resolve) => {
            const rowErrors: CsvRowError[] = [];
            let headers: string[] = [];
            let dataRowCount = 0;
            let headersValidated = false;
            let abortedEarly = false;

            Papa.parse<Record<string, string>>(file, {
                header:         useFirstLineAsHeaders,
                skipEmptyLines: skipEmptyLines ? 'greedy' : false,
                delimiter:      delimiter ?? '',   // '' = auto-detect
                dynamicTyping:  false,             // we validate types ourselves
                worker:  worker  ??  false,             // keep synchronous for simplicity in browser

                /**
                 * step() is called once per data row, enabling streaming validation.
                 * This avoids loading the entire file into memory at once.
                 */
                step: (results, parser) => {
                    // PapaParse structural errors (e.g. unmatched quotes)
                    if (results.errors.length > 0 && dataRowCount === 0) {
                        const parseErrMsgs = results.errors
                            .map(e => e.message)
                            .join('; ');
                        rowErrors.push({
                            row: dataRowCount + 2,
                            column: '—',
                            message: `Parse error: ${parseErrMsgs}`,
                        });
                    }

                    //  Header validation (only once, on the first row)
                    if (!headersValidated && useFirstLineAsHeaders) {
                        headers = (results.meta.fields ?? []) as string[];
                        const missingHeaders = requiredHeaders.filter(
                            h => !headers.includes(h)
                        );
                        if (missingHeaders.length > 0) {
                            // Missing required headers → abort immediately, no point continuing
                            abortedEarly = true;
                            parser.abort();
                            resolve(
                                `The file "${file.name}" is missing required column(s): ` +
                                `${missingHeaders.map(h => `"${h}"`).join(', ')}.`
                            );
                            return;
                        }
                        headersValidated = true;
                    }

                    dataRowCount++;
                    const row = results.data as Record<string, string>;
                    const rowNumber = dataRowCount + 1; // +1 for header line

                    // Column data type validation
                    if (rowErrors.length < maxRowErrors) {
                        for (const header of headers) {
                            const expectedType = columnTypes[header];
                            if (!expectedType) { continue; }

                            const rawValue = row[header]?.toString().trim() ?? '';
                            const typeError = this.validateCellType(
                                rawValue,
                                expectedType,
                                header,
                                rowNumber
                            );
                            if (typeError) {
                                rowErrors.push(typeError);
                            }
                        }
                    }

                    // Stop early if too many errors have been accumulated
                    if (rowErrors.length >= maxRowErrors) {
                        abortedEarly = true;
                        parser.abort();
                    }
                },

                complete: () => {
                    if (abortedEarly && rowErrors.length === 0) {
                        // abortedEarly was set because of missing headers (already resolved)
                        return;
                    }

                    // Row count checks
                    if (dataRowCount < minRows) {
                        resolve(
                            `The file "${file.name}" contains ${dataRowCount} data row(s), ` +
                            `but at least ${minRows} is required.`
                        );
                        return;
                    }

                    if (maxRows !== undefined && dataRowCount > maxRows) {
                        resolve(
                            `The file "${file.name}" contains ${dataRowCount} data row(s), ` +
                            `but the maximum allowed is ${maxRows}.`
                        );
                        return;
                    }

                    if (rowErrors.length === 0) {
                        resolve(null); //all checks passed
                        return;
                    }

                    // Format collected row errors into a single readable message
                    const errorLines = rowErrors
                        .slice(0, maxRowErrors)
                        .map(e => `Row ${e.row}, column "${e.column}": ${e.message}`)
                        .join('\n');

                    const truncationNote =
                        abortedEarly || rowErrors.length >= maxRowErrors
                            ? `\n  (validation stopped after ${maxRowErrors} errors)`
                            : '';

                    resolve(
                        `The file "${file.name}" contains data errors:\n` +
                        errorLines +
                        truncationNote
                    );
                },

                error: (error) => {
                    resolve(
                        `Failed to parse the CSV file "${file.name}": ${error.message}`
                    );
                },
            });
        });
    }

    /**
     * Checks the first bytes of the file to detect obviously non-text (binary) content.
     *
     * A CSV file must be a plain text file. We check whether the content
     * starts with known binary magic bytes that cannot belong to a text file.
     * We also allow UTF-8 BOM (EF BB BF), which is legal at the start of a CSV.
     *
     * @param file       - The file object (for error messages).
     * @param uint8Array - Raw bytes of the file.
     * @returns An error string if binary content is detected, null otherwise.
     */
    private checkNotBinaryFile(file: File, uint8Array: Uint8Array): string | null {
        if (uint8Array.length === 0) {
            return `The file "${file.name}" is empty.`;
        }

        // UTF-8 BOM (EF BB BF) is valid at the start of a CSV — skip it
        const offset = (
            uint8Array[0] === 0xEF &&
            uint8Array[1] === 0xBB &&
            uint8Array[2] === 0xBF
        ) ? 3 : 0;

        // Known binary magic bytes that cannot appear in a valid CSV
        const knownBinarySignatures: number[][] = [
            [0x25, 0x50, 0x44, 0x46],  // PDF  : %PDF
            [0xD0, 0xCF, 0x11, 0xE0],  // OLE2 : .xls / .doc / .ppt
            [0x50, 0x4B, 0x03, 0x04],  // ZIP  : .xlsx / .docx / .pptx
            [0xFF, 0xD8, 0xFF],         // JPEG
            [0x89, 0x50, 0x4E, 0x47],  // PNG
            [0x47, 0x49, 0x46, 0x38],  // GIF
            [0x1A, 0x45, 0xDF, 0xA3],  // WebM / MKV
            [0x46, 0x4C, 0x56],         // FLV
        ];

        const head = uint8Array.subarray(offset, offset + 8);

        for (const sig of knownBinarySignatures) {
            if (sig.every((byte, i) => head[i] === byte)) {
                return (
                    `The file "${file.name}" appears to be a binary file, not a CSV. ` +
                    `Please select a plain text CSV file.`
                );
            }
        }

        // Heuristic: if more than 10% of the first 512 bytes are non-printable
        // (excluding common whitespace), it's likely a binary file
        const sample = uint8Array.subarray(offset, offset + 512);
        let nonPrintable = 0;
        for (const byte of sample) {
            if (byte < 0x09 || (byte > 0x0D && byte < 0x20)) {
                nonPrintable++;
            }
        }
        if (nonPrintable / sample.length > 0.10) {
            return (
                `The file "${file.name}" contains too many non-printable characters ` +
                `to be a valid CSV file.`
            );
        }

        return null;
    }

    /**
    * Validates the value of a single cell against its expected type.
    *
    * @param value       - Raw string value from the CSV cell.
    * @param type        - Expected CsvColumnType.
    * @param header      - Column name (for the error message).
    * @param rowNumber   - 1-based row number including the header row.
    * @returns A CsvRowError if invalid, null if valid.
    */
    private validateCellType(
        value: string,
        type: CsvColumnType,
        header: string,
        rowNumber: number
    ): CsvRowError | null {
        switch (type) {
            case 'string':
                if (!value || value.length === 0) {
                    return {
                        row: rowNumber,
                        column: header,
                        message: `Expected a non-empty text value but found an empty cell.`,
                    };
                }
                break;

            case 'number': {
                const num = Number(value);
                if (value === '' || !isFinite(num) || isNaN(num)) {
                    return {
                        row: rowNumber,
                        column: header,
                        message: `Expected a number but got "${value}".`,
                    };
                }
                break;
            }

            case 'date': {
                if (!value || isNaN(Date.parse(value))) {
                    return {
                        row: rowNumber,
                        column: header,
                        message: `Expected a valid date but got "${value}".`,
                    };
                }
                break;
            }

            case 'boolean': {
                const lower = value.toLowerCase();
                if (!['true', 'false', '1', '0', 'yes', 'no'].includes(lower)) {
                    return {
                        row: rowNumber,
                        column: header,
                        message: `Expected a boolean (true/false/1/0) but got "${value}".`,
                    };
                }
                break;
            }

            case 'email': {
                // Basic RFC-5322 email regex — sufficient for CSV validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    return {
                        row: rowNumber,
                        column: header,
                        message: `Invalid email format: "${value || 'empty'}"`,
                    };
                }
                break;
            }
        }

        return null; //cell is valid
    }
}

export const csvValidator = CsvValidator.getInstance();

import JSZip from 'jszip';
import { OptionsWordFile } from './InterfaceMedia';

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
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class MicrosoftWordValidator
 *
 * Validates Microsoft Word files (.docx / .doc) in the browser.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Validation pipeline                                            │
 * │                                                                 │
 * │  1. Extension          .docx / .doc                            │
 * │  2. File size                                                   │
 * │  3. MIME type          (soft warning — unreliable across OSes)  │
 * │  4. Magic bytes        OLE2 (d0cf11e0) | ZIP/PK (504b0304)      │
 * │  5. .docx only ─ ZIP integrity   (JSZip)                       │
 * │  6. .docx only ─ OOXML structure ([Content_Types].xml present) │
 * │  7. .docx only ─ word/document.xml present and parseable       │
 * │  8. .docx only ─ content rules (empty doc, minParagraphs, …)  │
 * │  9. .docx only ─ requiredTextFragments                         │
 * │                                                                 │
 * │  .doc files stop at step 4 — OLE2 is a proprietary binary      │
 * │  format that cannot be reliably parsed in the browser.          │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Cross-platform MIME reality:
 *  - Windows : application/msword (.doc) |
 *              application/vnd.openxmlformats-officedocument.wordprocessingml.document (.docx)
 *  - macOS   : same as Windows, sometimes application/octet-stream
 *  - Linux   : application/octet-stream or text/plain for both
 *
 * Dependency: jszip  →  npm install jszip
 *
 * @extends AbstractMediaValidator
 * @implements MediaValidatorInterface
 */
export class MicrosoftWordValidator extends AbstractMediaValidator implements MediaValidatorInterface {
    /**
     * Known MIME types for Word files, keyed by extension.
     * Used for the soft MIME warning only — not a hard block.
     */
    private readonly mimeTypeMap: Record<string, string[]> = {
        doc: [
            'application/msword',               // Standard
            'application/vnd.ms-word',          // Alias
            'application/x-msword',             // Legacy alias
            'application/octet-stream',         // Linux / macOS fallback
        ],
        docx: [
            'application/wps-office.docx',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Standard
            'application/msword',               // Windows sometimes reports this for .docx
            'application/zip',                  // .docx is a ZIP container
            'application/octet-stream',         // Linux / macOS fallback
        ],
    };

    /**
     * Magic bytes (first 4 bytes as hex) identifying the two Word formats:
     *
     * - d0cf11e0 : OLE2 Compound Document header → .doc (also .xls, .ppt)
     * - 504b0304 : ZIP local file header          → .docx (also .xlsx, .pptx)
     *
     * The extension + OOXML structure check (steps 5–7) disambiguate between
     * Office formats that share the same magic bytes.
     */
    private readonly signatureHexadecimalFormatDocument: string[] = [
        'd0cf11e0', // OLE2 — .doc
        '504b0304', // ZIP  — .docx
    ];

    /**
     * Mandatory OOXML entry that must be present in any valid .docx ZIP.
     * Its absence means the file is a ZIP archive, not a Word document.
     */
    private static readonly CONTENT_TYPES_ENTRY = '[Content_Types].xml';

    /**
     * The main document XML entry inside a .docx archive.
     */
    private static readonly DOCUMENT_XML_ENTRY = 'word/document.xml';

    /**
     * OOXML content type that identifies the main Word document part.
     * Present in [Content_Types].xml of every valid .docx file.
     */
    private static readonly WORD_DOCUMENT_CONTENT_TYPE =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml';

    private static instance: MicrosoftWordValidator;

    private constructor() { super(); }

    public static getInstance(): MicrosoftWordValidator {
        if (!MicrosoftWordValidator.instance) {
            MicrosoftWordValidator.instance = new MicrosoftWordValidator();
        }
        return MicrosoftWordValidator.instance;
    }

     /**
     * Validates a File or FileList of Word documents.
     *
     * @param medias          - A single File or a FileList.
     * @param targetInputname - The name of the input field (error key).
     * @param optionsfile     - Validation options.
     */
    public validate = async (
        medias: File | FileList,
        targetInputname: string = 'wordfile',
        optionsfile: OptionsWordFile = {}
    ): Promise<this> => {
        this.formErrorStore.clearFieldState(targetInputname);

        const files = medias instanceof FileList ? Array.from(medias) : [medias];

        const {
            allowedExtensions = ['docx', 'doc'],
            maxsizeFile       = 10,
            unityMaxSizeFile  = 'MiB',
            allowLegacyDoc    = true,
        } = optionsfile;

        // Filter out .doc if legacy support is disabled
        const activeExtensions = allowLegacyDoc
            ? allowedExtensions
            : allowedExtensions.filter(e => e !== 'doc');

        for (const file of files) {
            // 1. Extension
            const extensionError = this.isValidExtension(file, activeExtensions);
            if (extensionError) {
                this.handleValidationError(targetInputname, file.name, extensionError);
                break;
            }

            // 2. Size
            this.sizeValidate(file, targetInputname, maxsizeFile, unityMaxSizeFile);

            // 3. MIME type — soft warning only
            const mimeWarning = this.checkMimeType(file);
            if (mimeWarning) {
                console.warn(`[WordValidator] ${mimeWarning}`);
            }

            // 4. Read raw bytes + magic byte check
            let uint8Array: Uint8Array;
            try {
                uint8Array = await this.readFileAsUint8Array(file);
            } catch {
                this.handleValidationError(
                    targetInputname,
                    file.name,
                    `Unable to read file "${file.name}".`
                );
                break;
            }

            const signatureError = this.checkMagicBytes(file, uint8Array);
            if (signatureError) {
                this.handleValidationError(targetInputname, file.name, signatureError);
                break;
            }

            // Determine actual format from magic bytes
            const isDocx = this.isZipBased(uint8Array);
            const isDoc  = !isDocx && this.isOle2Based(uint8Array);

            // 5–9. Deep inspection — only possible for .docx (ZIP-based)
            if (isDocx) {
                const docxError = await this.validateDocx(file, uint8Array, optionsfile);
                if (docxError) {
                    this.handleValidationError(targetInputname, file.name, docxError);
                    break;
                }
            } else if (isDoc) {
                // .doc (OLE2): magic bytes verified — no further browser-side inspection possible
                console.info(
                    `[WordValidator] "${file.name}" is a legacy .doc file. ` +
                    `Only magic bytes have been verified — deep content inspection ` +
                    `is not available for OLE2 files in the browser.`
                );
            }
        }

        return this;
    }

    protected getContext(): string {
        return 'Word document';
    }

    /**
     * Soft MIME type check.
     * Returns a warning string if the MIME type is not in any known list,
     * but does NOT block validation.
     */
    private checkMimeType(file: File): string | null {
        if (!file.type) {
            return null; // Empty MIME type is common on Linux — not an error
        }

        const allKnownMimes = [
            ...this.mimeTypeMap.doc,
            ...this.mimeTypeMap.docx,
        ];

        if (!allKnownMimes.includes(file.type)) {
            return (
                `Unexpected MIME type "${file.type}" for "${file.name}". ` +
                `This may be normal on some operating systems. ` +
                `Binary signature will be used as the authoritative check.`
            );
        }

        return null;
    }

    /**
     * Validates the binary signature (magic bytes) of the file.
     *
     * Accepts:
     *  - d0cf11e0 → OLE2 (.doc)
     *  - 504b0304 → ZIP  (.docx)
     *
     * @returns An error string if unrecognised, null otherwise.
     */
    private checkMagicBytes(file: File, uint8Array: Uint8Array): string | null {
        if (this.isZipBased(uint8Array) || this.isOle2Based(uint8Array)) {
            return null;
        }
        return (
            `The file "${file.name}" does not have a recognised Word document signature. ` +
            `Expected an OLE2 (.doc) or OOXML/ZIP (.docx) header. ` +
            `The file may be corrupt or not a real Word document.`
        );
    }

    /**
     * Deep structural and content validation for .docx files.
     *
     * Steps:
     *  5. ZIP integrity (JSZip can open the archive)
     *  6. [Content_Types].xml present + Word content type declared
     *  7. word/document.xml present and parseable as XML
     *  8. Content rules (empty document, minParagraphs)
     *  9. Required text fragments
     *
     * @param file       - The .docx file.
     * @param uint8Array - Raw bytes.
     * @param options    - Validation options.
     * @returns An error string, or null if valid.
     */
    private async validateDocx(
        file: File,
        uint8Array: Uint8Array,
        options: OptionsWordFile
    ): Promise<string | null> {
        const {
            rejectEmptyDocument = true,
            minParagraphs,
            requiredTextFragments = [],
        } = options;

        // ZIP integrity
        let zip: JSZip;
        try {
            zip = await JSZip.loadAsync(uint8Array);
        } catch (error) {
            return (
                `The file "${file.name}" cannot be opened as a ZIP archive. ` +
                `It may be corrupt or password-protected: ${error}`
            );
        }

        // [Content_Types].xml must exist
        const contentTypesEntry = zip.file(MicrosoftWordValidator.CONTENT_TYPES_ENTRY);
        if (!contentTypesEntry) {
            return (
                `The file "${file.name}" is a ZIP archive but is missing ` +
                `"${MicrosoftWordValidator.CONTENT_TYPES_ENTRY}". ` +
                `It is not a valid OOXML Word document.`
            );
        }

        // 6b. [Content_Types].xml must declare the Word document content type
        let contentTypesXml: string;
        try {
            contentTypesXml = await contentTypesEntry.async('string');
        } catch {
            return `Unable to read "[Content_Types].xml" in "${file.name}".`;
        }

        if (!contentTypesXml.includes(MicrosoftWordValidator.WORD_DOCUMENT_CONTENT_TYPE)) {
            return (
                `The file "${file.name}" is a ZIP archive but does not declare ` +
                `a Word document content type in "[Content_Types].xml". ` +
                `It may be an Excel, PowerPoint, or other OOXML file.`
            );
        }

        // word/document.xml must exist
        const documentXmlEntry = zip.file(MicrosoftWordValidator.DOCUMENT_XML_ENTRY);
        if (!documentXmlEntry) {
            return (
                `The file "${file.name}" is missing "word/document.xml". ` +
                `The document body is absent — the file is likely corrupt.`
            );
        }

        // word/document.xml must be parseable as XML
        let documentXml: string;
        try {
            documentXml = await documentXmlEntry.async('string');
        } catch {
            return `Unable to read "word/document.xml" in "${file.name}".`;
        }

        const xmlParseError = this.validateXml(documentXml, file.name);
        if (xmlParseError) { return xmlParseError; }

        // Content inspection
        const docInfo = this.inspectDocumentXml(documentXml);

        // Empty document check
        if (rejectEmptyDocument && !docInfo.hasContent) {
            return `The Word document "${file.name}" appears to be empty (no text content found).`;
        }

        // Minimum paragraph count
        if (minParagraphs !== undefined && docInfo.paragraphCount < minParagraphs) {
            return (
                `The document "${file.name}" contains ${docInfo.paragraphCount} paragraph(s), ` +
                `but at least ${minParagraphs} is required.`
            );
        }

        // Required text fragments
        if (requiredTextFragments.length > 0) {
            const fullText = docInfo.textPreview; // limited preview
            const missing = requiredTextFragments.filter(
                fragment => !fullText.includes(fragment)
            );
            if (missing.length > 0) {
                return (
                    `The document "${file.name}" is missing required text fragment(s): ` +
                    `${missing.map(f => `"${f}"`).join(', ')}.`
                );
            }
        }

        return null; // all checks passed
    }

    /**
     * Inspects the raw word/document.xml string to extract structural metadata.
     *
     * Uses lightweight string/regex inspection rather than a full XML DOM walk
     * to keep this fast even for large documents.
     *
     * OOXML element reference:
     *  - <w:p>   = paragraph
     *  - <w:tbl> = table
     *  - <w:t>   = text run
     *  - <w:drawing> or <a:blip> = embedded image reference
     *
     * @param xml - Content of word/document.xml as a string.
     * @returns A WordDocumentInfo summary.
     */
    private inspectDocumentXml(xml: string): WordDocumentInfo {
        // Count structural elements via simple regex on the XML string.
        // This avoids a full DOM parse of potentially large documents.
        const paragraphCount = (xml.match(/<w:p[ >]/g) ?? []).length;
        const tableCount = (xml.match(/<w:tbl[ >]/g) ?? []).length;
        const imageCount = (xml.match(/<w:drawing[ >]|<a:blip[ >]/g) ?? []).length;

        // Extract text content from <w:t> elements
        // Each <w:t> contains a plain text fragment; we join them with a space.
        const textFragments: string[] = [];
        const wtRegex = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
        let match: RegExpExecArray | null;

        while ((match = wtRegex.exec(xml)) !== null) {
            const text = match[1].trim();
            if (text) { textFragments.push(text); }

            // Collect up to 1000 chars for the preview to keep memory usage low
            if (textFragments.join(' ').length >= 1000) { break; }
        }

        const textPreview = textFragments.join(' ').slice(0, 500);
        const hasContent = textPreview.length > 0;

        return {
            paragraphCount,
            tableCount,
            imageCount,
            textPreview,
            hasContent,
        };
    }

    /** Returns true if the file starts with the ZIP magic bytes (504b0304). */
    private isZipBased(uint8Array: Uint8Array): boolean {
        return (
            uint8Array[0] === 0x50 &&  // P
            uint8Array[1] === 0x4B &&  // K
            uint8Array[2] === 0x03 &&
            uint8Array[3] === 0x04
        );
    }

    /** Returns true if the file starts with the OLE2 magic bytes (d0cf11e0). */
    private isOle2Based(uint8Array: Uint8Array): boolean {
        return (
            uint8Array[0] === 0xD0 &&
            uint8Array[1] === 0xCF &&
            uint8Array[2] === 0x11 &&
            uint8Array[3] === 0xE0
        );
    }
}

export const microsoftWordValidator = MicrosoftWordValidator.getInstance();

import { OptionsOdfFile } from './InterfaceMedia';

/**
 * Official IANA MIME types for OpenDocument Format (ODF) files.
 *
 * These strings are stored inside the ODF ZIP archive itself
 * (in the uncompressed "mimetype" entry at offset 0) and are
 * also what LibreOffice / OpenOffice report to the OS.
 */
const ODF_MIME_TYPES: Record<string, string> = {
    odt: 'application/vnd.oasis.opendocument.text',
    ott: 'application/vnd.oasis.opendocument.text-template',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    ots: 'application/vnd.oasis.opendocument.spreadsheet-template',
    odp: 'application/vnd.oasis.opendocument.presentation',
    otp: 'application/vnd.oasis.opendocument.presentation-template',
    odg: 'application/vnd.oasis.opendocument.graphics',
    odf: 'application/vnd.oasis.opendocument.formula',
};

/**
 * All MIME types that the OS/browser may report for ODF files.
 * Less reliable than the in-archive "mimetype" entry — used for soft warning only.
 */
const OS_REPORTED_MIME_TYPES: string[] = [
    ...Object.values(ODF_MIME_TYPES),
    'application/octet-stream',         // Linux generic fallback
    'application/zip',                  // ODF is a ZIP — sometimes reported as such
    'application/x-zip-compressed',     // Windows ZIP alias
];

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

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class OdtValidator
 *
 * Validates OpenDocument Format (ODF) files and RTF files in the browser.
 *
 * Supported formats:
 *  ┌──────────┬────────────────────────────────────────────────────────┐
 *  │ .odt     │ OpenDocument Text      (LibreOffice Writer)            │
 *  │ .ott     │ ODT Template           (LibreOffice Writer)            │
 *  │ .ods     │ OpenDocument Spreadsheet (LibreOffice Calc)            │
 *  │ .ots     │ ODS Template           (LibreOffice Calc)              │
 *  │ .odp     │ OpenDocument Presentation (LibreOffice Impress)        │
 *  │ .otp     │ ODP Template           (LibreOffice Impress)           │
 *  │ .odg     │ OpenDocument Drawing   (LibreOffice Draw)              │
 *  │ .rtf     │ Rich Text Format       (cross-platform)                │
 *  └──────────┴────────────────────────────────────────────────────────┘
 *
 * Validation pipeline:
 *  ┌────────────────────────────────────────────────────────────────────┐
 *  │  1. Extension                                                      │
 *  │  2. File size                                                      │
 *  │  3. MIME type (soft warning — unreliable across OSes)              │
 *  │  4. Magic bytes:                                                   │
 *  │       ODF  → 504b0304 (ZIP)                                        │
 *  │       RTF  → 7b5c727466 ({\rtf)                                   │
 *  │                                                                    │
 *  │  For ODF files (steps 5–9):                                        │
 *  │  5. ZIP integrity (JSZip)                                          │
 *  │  6. In-archive "mimetype" entry — ODF self-identification          │
 *  │  7. "mimetype" matches the declared file extension                 │
 *  │  8. content.xml present and valid XML                              │
 *  │  9. Content rules (empty doc, minParagraphs, requiredFragments)    │
 *  │                                                                    │
 *  │  For RTF files (step 5 only):                                      │
 *  │  5. RTF text heuristic (non-empty, valid RTF header present)       │
 *  └────────────────────────────────────────────────────────────────────┘
 *
 * Key insight — ODF "mimetype" entry:
 *  Every ODF file stores its exact MIME type as an UNCOMPRESSED entry
 *  named "mimetype" at the very beginning of the ZIP archive (offset 38).
 *  This is the most reliable format identifier — more trustworthy than
 *  the OS-reported file.type or even the file extension.
 *
 * Dependency: jszip  →  npm install jszip
 *
 * @extends AbstractMediaValidator
 * @implements MediaValidatorInterface
 */
export class OdtValidator extends AbstractMediaValidator implements MediaValidatorInterface {

    /** All OS-reported MIME types we accept without warning. */
    private readonly acceptedOsMimeTypes: string[] = OS_REPORTED_MIME_TYPES;

    /**
     * Magic bytes for supported formats (first 4–5 bytes as hex):
     *  - 504b0304          → ZIP  (all ODF formats)
     *  - 7b5c727466 ({\rtf) → RTF
     */
    private readonly signatureHexadecimalFormatDocument: string[] = [
        '504b0304', // ZIP / ODF
        '7b5c7274', // RTF: {\rt  (first 4 bytes of {\rtf)
    ];

    private static instance: OdtValidator;

    public static LIBREOFFICE_EXTENSIONS=['odt', 'ott', 'ods', 'ots', 'odp', 'otp', 'odg', 'rtf'];

    private constructor() { super(); }

    public static getInstance(): OdtValidator {
        if (!OdtValidator.instance) {
            OdtValidator.instance = new OdtValidator();
        }
        return OdtValidator.instance;
    }

    /**
     * Validates a File or FileList of ODF / RTF documents.
     *
     * @param medias          - A single File or a FileList.
     * @param targetInputname - The name of the input field (error key).
     * @param optionsfile     - Validation options.
     */
    public validate = async (
        medias: File | FileList,
        targetInputname: string = 'odtfile',
        optionsfile: OptionsOdfFile = {}
    ): Promise<this> => {
        this.formErrorStore.clearFieldState(targetInputname);

        const files = medias instanceof FileList ? Array.from(medias) : [medias];

        const {
            allowedExtensions = OdtValidator.LIBREOFFICE_EXTENSIONS ,
            maxsizeFile = 10,
            unityMaxSizeFile = 'MiB',
            allowRtf = true,
        } = optionsfile;

        const activeExtensions = allowRtf
            ? allowedExtensions
            : allowedExtensions.filter(e => e !== 'rtf');

        for (const file of files) {
            const extensionError = this.isValidExtension(file, activeExtensions);
            if (extensionError) {
                this.handleValidationError(targetInputname, file.name, extensionError);
                break;
            }

            this.sizeValidate(file, targetInputname, maxsizeFile, unityMaxSizeFile);

            //MIME type — soft warning only
            const mimeWarning = this.checkMimeType(file);
            if (mimeWarning) {
                console.warn(`[OdtValidator] ${mimeWarning}`);
            }

            // Read bytes + magic byte check
            let uint8Array: Uint8Array;
            try {
                uint8Array = await this.readFileAsUint8Array(file);
            } catch {
                this.handleValidationError(
                    targetInputname,
                    file.name,
                    `Unable to read file "${file.name}".`
                );
                break;
            }

            const fileExtension = this.getFileExtension(file) ?? '';

            if (fileExtension === 'rtf') {
                // RTF path
                const rtfError = this.validateRtf(file, uint8Array);
                if (rtfError) {
                    this.handleValidationError(targetInputname, file.name, rtfError);
                    break;
                }
            }

            // ODF path — must be ZIP-based
            if (!this.isZipBased(uint8Array)) {
                this.handleValidationError(
                    targetInputname,
                    file.name,
                    `The file "${file.name}" does not start with a ZIP signature (504b0304). ` +
                    `All ODF files (.odt, .ods, .odp, …) must be ZIP archives.`
                );
                break;
            }

            //Deep ODF inspection
            const odfError = await this.validateOdf(file, uint8Array, fileExtension, optionsfile);
            if (odfError) {
                this.handleValidationError(targetInputname, file.name, odfError);
                break;
            }
        }

        return this;
    };


    protected getContext(): string {
        return 'OpenDocument file';
    }

    /**
     * Soft MIME type check — warns if the OS-reported type is unexpected
     * but does NOT block validation (unreliable across OSes).
     */
    private checkMimeType(file: File): string | null {
        if (!file.type) {
            return null; // Common on Linux — not an error
        }
        if (!this.acceptedOsMimeTypes.includes(file.type)) {
            return (
                `Unexpected MIME type "${file.type}" for "${file.name}". ` +
                `This may be normal depending on the OS and application. ` +
                `The in-archive "mimetype" entry will be used for authoritative format detection.`
            );
        }
        return null;
    }

    /**
     * Validates an RTF file.
     *
     * RTF is a plain-text format. A valid RTF file:
     *  - Starts with "{\rtf" (magic bytes 7b 5c 72 74 66)
     *  - Contains at least some text content
     *
     * Deep content extraction from RTF is intentionally NOT implemented:
     * RTF uses a complex escape-code system that would require a full parser.
     * The magic bytes + non-empty check is the reliable browser-side limit.
     *
     * @param file       - The RTF file object.
     * @param uint8Array - Raw bytes.
     * @returns An error string, or null if valid.
     */
    private validateRtf(file: File, uint8Array: Uint8Array): string | null {
        // Check RTF magic bytes: { \ r t f  = 0x7B 0x5C 0x72 0x74 0x66
        const isRtf = (
            uint8Array[0] === 0x7B &&  // {
            uint8Array[1] === 0x5C &&  // \
            uint8Array[2] === 0x72 &&  // r
            uint8Array[3] === 0x74 &&  // t
            uint8Array[4] === 0x66     // f
        );

        if (!isRtf) {
            return (
                `The file "${file.name}" does not start with the RTF header ({\\rtf). ` +
                `It may be corrupt or not a valid RTF file.`
            );
        }

        // Basic non-empty check
        if (uint8Array.length < 10) {
            return `The RTF file "${file.name}" is too small to contain valid content.`;
        }

        // Heuristic: RTF must contain at least one \par or \pard control word
        // (paragraph markers) — a valid RTF document always has these
        const sample = new TextDecoder('utf-8', { fatal: false })
            .decode(uint8Array.subarray(0, Math.min(uint8Array.length, 4096)));

        if (!sample.includes('\\par') && !sample.includes('\\pard')) {
            return (
                `The file "${file.name}" appears to be an empty or malformed RTF file ` +
                `(no paragraph control words found in the first 4 KB).`
            );
        }

        console.info(
            `[OdtValidator] "${file.name}" is a valid RTF file. ` +
            `Deep text extraction is not available for RTF in the browser.`
        );

        return null; //RTF magic bytes + structure verified
    }

    /**
     * Deep structural and content validation for ODF files.
     *
     * Steps:
     *  5. ZIP integrity (JSZip)
     *  6. "mimetype" entry — present and readable
     *  7. "mimetype" value matches the file extension
     *  8. "content.xml" present and valid XML
     *  9. Content rules (empty, minParagraphs, requiredTextFragments)
     */
    private async validateOdf(
        file: File,
        uint8Array: Uint8Array,
        fileExtension: string,
        options: OptionsOdfFile
    ): Promise<string | null> {
        const {
            rejectEmptyDocument = true,
            minParagraphs,
            requiredTextFragments = [],
        } = options;

        // ZIP integrity
        let zip: JSZip;
        try {
            zip = await JSZip.loadAsync(uint8Array);
        } catch (error) {
            return (
                `The file "${file.name}" cannot be opened as a ZIP/ODF archive. ` +
                `It may be corrupt or password-protected: ${error}`
            );
        }

        // "mimetype" entry — the ODF self-identification mechanism
        // Per the ODF spec (section 2.2.1), the "mimetype" entry MUST be:
        //  - the first file in the ZIP
        //  - stored UNCOMPRESSED (method 0)
        //  - contain exactly the ODF MIME type string with NO newline
        const mimetypeEntry = zip.file('mimetype');
        if (!mimetypeEntry) {
            return (
                `The file "${file.name}" is a ZIP archive but is missing the "mimetype" entry. ` +
                `All ODF files must contain this entry as their first uncompressed ZIP member.`
            );
        }

        let detectedMimeType: string;
        try {
            detectedMimeType = (await mimetypeEntry.async('string')).trim();
        } catch {
            return `Unable to read the "mimetype" entry in "${file.name}".`;
        }

        // Verify the detected MIME type is a known ODF type
        const knownOdfMimes = Object.values(ODF_MIME_TYPES);
        if (!knownOdfMimes.includes(detectedMimeType)) {
            return (
                `The file "${file.name}" declares an unrecognised ODF MIME type: "${detectedMimeType}". ` +
                `Expected one of: ${knownOdfMimes.join(', ')}.`
            );
        }

        // Verify MIME type matches the file extension
        const expectedMimeForExtension = ODF_MIME_TYPES[fileExtension];
        if (expectedMimeForExtension && detectedMimeType !== expectedMimeForExtension) {
            return (
                `The file "${file.name}" has extension ".${fileExtension}" ` +
                `but its internal "mimetype" entry declares: "${detectedMimeType}". ` +
                `Expected: "${expectedMimeForExtension}". ` +
                `The file extension does not match the actual ODF format.`
            );
        }

        // content.xml — the document body
        const contentXmlEntry = zip.file('content.xml');
        if (!contentXmlEntry) {
            return (
                `The file "${file.name}" is missing "content.xml". ` +
                `This is the document body — its absence indicates a corrupt ODF file.`
            );
        }

        let contentXml: string;
        try {
            contentXml = await contentXmlEntry.async('string');
        } catch {
            return `Unable to read "content.xml" in "${file.name}".`;
        }

        // Validate content.xml as well-formed XML
        const xmlError = this.validateXml(contentXml, file.name,"content.xml");
        if (xmlError) { return xmlError; }

        // Content inspection
        const docInfo = this.inspectContentXml(contentXml, detectedMimeType);

        // Empty document
        if (rejectEmptyDocument && !docInfo.hasContent) {
            return (
                `The ODF document "${file.name}" appears to be empty ` +
                `(no text content found in "content.xml").`
            );
        }

        // Minimum paragraph count
        if (minParagraphs !== undefined && docInfo.paragraphCount < minParagraphs) {
            return (
                `The document "${file.name}" contains ${docInfo.paragraphCount} paragraph(s), ` +
                `but at least ${minParagraphs} is required.`
            );
        }

        // Required text fragments
        if (requiredTextFragments.length > 0) {
            const missing = requiredTextFragments.filter(
                f => !docInfo.textPreview.includes(f)
            );
            if (missing.length > 0) {
                return (
                    `The document "${file.name}" is missing required text fragment(s): ` +
                    `${missing.map(f => `"${f}"`).join(', ')}.`
                );
            }
        }

        return null; // all checks passed
    }

    /**
     * Inspects the content.xml of an ODF file to extract structural metadata.
     *
     * ODF XML namespace reference:
     *  - <text:p>       = text paragraph  (Writer / Impress)
     *  - <text:h>       = heading         (Writer)
     *  - <table:table>  = table           (Writer / Calc)
     *  - <draw:image>   = embedded image  (Writer / Impress / Draw)
     *  - <text:span>    = inline text run
     *
     * For Calc (.ods) files, text lives in <table:table-cell> elements.
     *
     * @param xml              - Content of content.xml as a string.
     * @param detectedMimeType - The ODF MIME type from the "mimetype" entry.
     * @returns An OdfDocumentInfo summary.
     */
    private inspectContentXml(xml: string, detectedMimeType: string): OdfDocumentInfo {
        // Paragraph / heading count (Writer, Impress)
        const paragraphCount =
            (xml.match(/<text:p[ >]/g) ?? []).length +
            (xml.match(/<text:h[ >]/g) ?? []).length;

        // Table count (Writer, Calc)
        const tableCount = (xml.match(/<table:table[ >]/g) ?? []).length;

        // Image count (all ODF formats)
        const imageCount = (xml.match(/<draw:image[ >]/g) ?? []).length;

        // Extract visible text
        // ODF text lives in: <text:p>, <text:h>, <text:span>, <text:s>
        // For Calc: in <text:p> inside <table:table-cell>
        const textFragments: string[] = [];
        // Match any element that directly wraps text — capture inner text
        const textRegex = /<text:(?:p|h|span)(?:\s[^>]*)?>([^<]*)<\/text:(?:p|h|span)>/g;
        let match: RegExpExecArray | null;
        let totalLength = 0;

        while ((match = textRegex.exec(xml)) !== null) {
            const text = match[1].trim();
            if (text) {
                textFragments.push(text);
                totalLength += text.length;
            }
            if (totalLength >= 1000) { break; }
        }

        const textPreview = textFragments.join(' ').slice(0, 500);
        const hasContent = textPreview.length > 0;

        return {
            detectedMimeType,
            paragraphCount,
            tableCount,
            imageCount,
            textPreview,
            hasContent,
        };
    }

    /** Returns true if the file starts with ZIP magic bytes (504b0304). */
    private isZipBased(uint8Array: Uint8Array): boolean {
        return (
            uint8Array[0] === 0x50 &&
            uint8Array[1] === 0x4B &&
            uint8Array[2] === 0x03 &&
            uint8Array[3] === 0x04
        );
    }
}

export const odtValidator = OdtValidator.getInstance();

