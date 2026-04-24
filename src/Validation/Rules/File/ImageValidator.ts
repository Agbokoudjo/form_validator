/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { AbstractMediaValidator } from './AbstractMediaValidator';
import { MediaValidatorInterface, OptionsImage } from './InterfaceMedia';

/**
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class ImageValidator
 *
 * This class validates image files by checking their extensions, dimensions,
 * MIME types, and binary signatures (magic bytes).
 * It ensures that uploaded files meet specific criteria such as allowed file
 * types, sizes, and dimensions.
 *
 * @extends AbstractMediaValidator
 * @implements MediaValidatorInterface
 */
export class ImageValidator extends AbstractMediaValidator implements MediaValidatorInterface {

    /**
     * Map of allowed image extensions to their expected hexadecimal magic bytes.
     * Used to detect the real file type regardless of the declared extension or MIME type.
     */
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

    private constructor() { super(); }

    /**
     * Returns the single shared instance of ImageValidator (Singleton pattern).
     */
    public static getInstance(): ImageValidator {
        if (!ImageValidator.m_instance_image_validator) {
            ImageValidator.m_instance_image_validator = new ImageValidator();
        }
        return ImageValidator.m_instance_image_validator;
    }

    /**
     * Validates a single File or a FileList of image files against the given options.
     *
     * Checks performed per file (in order):
     *  1. File extension
     *  2. File size
     *  3. MIME type (browser-side image loading)
     *  4. Binary signature (magic bytes)
     *  5. Image dimensions (height / width)
     */
    public validate = async (
        medias: File | FileList,
        targetInputname: string = 'photofile',
        optionsimg: OptionsImage = {
            allowedMimeTypeAccept: ['image/jpeg', 'image/png', 'image/jpg']
        }
    ): Promise<this> => {
        const files = medias instanceof FileList ? Array.from(medias) : [medias];
        const allowedMimeTypeAccept = optionsimg.allowedMimeTypeAccept ?? [
            'image/jpeg',
            'image/png',
            'image/jpg',
        ];

        this.formErrorStore.clearFieldState(targetInputname);

        for (const file of files) {
            const extensionError = this.isValidExtension(
                file,
                optionsimg.allowedExtensions ?? ['jpeg', 'png', 'jpg', 'webp']
            );
            if (extensionError) {
                this.handleValidationError(targetInputname, file.name, extensionError);
                break;
            }

            this.sizeValidate(
                file,
                targetInputname,
                optionsimg.maxsizeFile ?? 5,
                optionsimg.unityMaxSizeFile ?? 'MiB'
            );

            const mimeError = await this.mimeTypeFileValidate(file, allowedMimeTypeAccept);
            const signatureError = await this.signatureFileValidate(file);

            if (mimeError || signatureError) {
                this.handleValidationError(
                    targetInputname,
                    file.name,
                    `${mimeError ?? ''} ${signatureError ?? ''} name_image: ${file.name}`.trim()
                );
                break;
            }

            await this.heightValidate(
                file,
                targetInputname,
                optionsimg.minHeight,
                optionsimg.maxHeight,
                optionsimg.unityDimensions
            );
            await this.widthValidate(
                file,
                targetInputname,
                optionsimg.minWidth,
                optionsimg.maxWidth,
                optionsimg.unityDimensions
            );

            if (!this.formErrorStore.isFieldValid(targetInputname)) { break; }
        }

        return this;
    }

    /**
    * Validates the binary signature of an image file.
    *
    * Reads the first 12 bytes of the file as hexadecimal and compares them
    * against the known signatures for each supported format.
    * Also detects SVG via UTF-8 text inspection.
    *
    * @param file - The image file to validate.
    * @returns A promise resolving to an error string, or null if valid.
    */
    protected async signatureFileValidate(file: File, uint8Array?: Uint8Array): Promise<string | null> {
        return new Promise<string | null>((resolve) => {
            const readerImg = new FileReader();
            readerImg.onload = async (event: ProgressEvent<FileReader>) => {
                try {
                    const arrayBuffer = event.target?.result as ArrayBuffer;

                    if (!arrayBuffer) {
                        resolve(`Unable to process the file ${file.name}. It might be empty or corrupted.`);
                        return;
                    }

                    uint8Array = uint8Array ?? new Uint8Array(arrayBuffer);
                    // Read 12 bytes to cover all formats (webp needs bytes 8–11)
                    const hexSignature = Array.from(uint8Array.subarray(0, 12))
                        .map(byte => byte.toString(16).padStart(2, '0'))
                        .join('');

                    const detectedMime = this.detectMimeType(hexSignature, uint8Array);

                    if (detectedMime !== file.type) {
                        resolve(
                            `The file ${file.name} appears to be disguised as an image. ` +
                            `Detected type: ${detectedMime ?? 'unknown'}, ` +
                            `declared type: ${file.type}. Please choose a valid image file.`
                        );
                    } else {
                        resolve(null);
                    }

                } catch (error) {
                    console.error(`An error occurred while processing the file ${file.name}: ${error}`);
                    resolve(`An error occurred while processing the file ${file.name}: ${error}`);
                }
            };
            readerImg.onerror = async (errorEvent: ProgressEvent<FileReader>) => {
                const error = errorEvent.target?.error;  
                resolve(`File reading error: ${error?.message} name_image: ${file.name}`);
            };
            readerImg.readAsArrayBuffer(file);
        });
    }

    /**
    * Validates the MIME type of the file using the browser's native image loader,
    * then verifies the declared type is within the list of allowed MIME types.
    *
    * @param file                 - The image file to validate.
    * @param allowedMimeTypeAccept - Optional list of accepted MIME types.
    * @returns A promise resolving to an error string, or null if valid.
    */
    protected async mimeTypeFileValidate(
        file: File,
        allowedMimeTypeAccept?: string[]
    ): Promise<string | null> {
        try {
            await this.validateImage(file, { throw: true });
        } catch (error) {
            return `${error} name_image: ${file.name}`;
        }

        if (allowedMimeTypeAccept && file.type && !allowedMimeTypeAccept.includes(file.type)) {
            return (
                `The MIME type "${file.type}" is not allowed for ${file.name}. ` +
                `Accepted types: ${allowedMimeTypeAccept.join(', ')}.`
            );
        }
        return null;
    }

    protected getContext(): string {
        return 'image';
    }

    /**
    * Retrieves the pixel dimensions (width × height) of an image file.
    * Revokes the object URL after loading to prevent memory leaks.
    */
    protected getFileDimensions(file: File): Promise<{ width: number; height: number; }> {
        return new Promise((resolve, reject) => {
            const objectUrl = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = (err) => {
                URL.revokeObjectURL(objectUrl);
                reject(err);
            };
            img.src = objectUrl;
        });
    }

    /**
    * Detects the real MIME type of an image file based on its magic bytes.
    *
    * - JPEG : first 4 bytes match known JPEG signatures
    * - PNG  : first 4 bytes = 89 50 4E 47
    * - GIF  : first 4 bytes = 47 49 46 38
    * - BMP  : first 2 bytes = 42 4D
    * - WebP : bytes 0–3 = 'RIFF' AND bytes 8–11 = 'WEBP'
    * - SVG  : UTF-8 text inspection (text-based format, no magic bytes)
    *
    * @param hexSignature - Hex string of the first 12 bytes of the file.
    * @param uint8Array   - Raw bytes used for SVG text detection.
    * @returns The detected MIME type string, or null if unrecognised.
    */
    private detectMimeType(hexSignature: string, uint8Array: Uint8Array): string | null {
        // JPEG — compare first 8 hex chars (= 4 bytes)
        const first8 = hexSignature.substring(0, 8);
        if (
            this.signatureHexadecimalFormatFile.jpg.includes(first8) ||
            this.signatureHexadecimalFormatFile.jpeg.includes(first8)
        ) {
            return 'image/jpeg';
        }

        // PNG — 4 bytes
        if (this.signatureHexadecimalFormatFile.png.includes(first8)) {
            return 'image/png';
        }

        // GIF — 4 bytes
        if (this.signatureHexadecimalFormatFile.gif.includes(first8)) {
            return 'image/gif';
        }

        // BMP — 2 bytes (first 4 hex chars)
        if (this.signatureHexadecimalFormatFile.bmp.includes(hexSignature.substring(0, 4))) {
            return 'image/bmp';
        }

        // WebP — 'RIFF' (bytes 0–3) + 'WEBP' (bytes 8–11)
        // Cannot rely on bytes 0–3 alone: 'RIFF' is shared with AVI, WAV, etc.
        const bytes8to11 = hexSignature.substring(16, 24); // bytes 8–11 in hex
        if (first8 === '52494646' && bytes8to11 === '57455042') {
            return 'image/webp';
        }

        // SVG — text-based, no binary magic bytes
        const text = new TextDecoder().decode(uint8Array.subarray(0, 100)).toLowerCase();
        if (text.includes('<svg') && text.includes('xmlns="http://www.w3.org/2000/svg"')) {
            return 'image/svg+xml';
        }

        return null;
    }

    /**
     * Validates a File or image URL by letting the browser attempt to load it as an image.
     * This catches corrupt, truncated, or entirely non-image files regardless of extension.
     *
     * Revokes the object URL after the load attempt to prevent memory leaks.
     *
     * @param src    - A File object or an image URL string.
     * @param config - Optional config; if `throw` is true, rejects on failure instead of resolving false.
     * @returns A promise resolving to true (valid image), false (invalid), or rejecting with an error.
     */
    private validateImage(
        src: string | File,
        config?: { throw: boolean }
    ): Promise<boolean | undefined> {
        if (typeof window === 'undefined') {
            throw new Error('Cannot use validateImage in a non-browser environment.');
        }

        const isFile = typeof src !== 'string';
        const url = isFile ? URL.createObjectURL(src as File) : (src as string);
        const image = new Image();
        image.src = url;

        return new Promise((resolve, reject) => {
            image.addEventListener('error', () => {
                if (isFile) URL.revokeObjectURL(url); 
                if (config?.throw) {
                    reject('The media resource is either invalid, corrupt or unsuitable.');
                } else {
                    resolve(false);
                }
            });

            image.addEventListener('load', () => {
                if (isFile) URL.revokeObjectURL(url); 
                resolve(true);
            }, false);
        });
    }
}
export const imageValidator = ImageValidator.getInstance();
