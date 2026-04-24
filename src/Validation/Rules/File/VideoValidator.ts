/** 
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APP & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { AbstractMediaValidator } from './AbstractMediaValidator';
import { OptionsMediaVideo } from './InterfaceMedia';

interface VideoDimensions {
    width: number;
    height: number
}

export interface VideoValidatorInterface {
    /**
    * Validates one or more video files based on various criteria such as file extension, size, MIME type,
    * and metadata (dimensions and duration).
    * 
    * This function checks whether the uploaded video files meet the following requirements:
    * - The file extension must be valid and match one of the allowed extensions specified in the configuration.
    * - The file size must be less than or equal to the maximum allowed size.
    * - The MIME type of the file must be valid.
    * - The metadata of the video (dimensions and duration) must be validated.
    * 
    * If any of these criteria fail, an error will be returned, and the file will be ignored for subsequent validations.
    * 
    * @param {File | FileList} medias - The video file(s) to validate. Can be a single file or a list of files.
    * @param {string} [targetInputname='videofile'] - The name of the input field, used to personalize the error messages.
    * @param {OptionsMediaVideo} [optionsmedia] - The video file validation options, including allowed extensions, 
    *                                          allowed MIME types, and file size restrictions.
    * 
    * @returns {Promise<this>} - A promise that returns the instance of the object after validating the files, 
    *                             allowing for chaining of additional methods if necessary.
    * 
    * @example
    * const videoFiles = document.getElementById('videoInput').files;
    * await validator.fileValidator(videoFiles, 'videoInput', {
    *   extensions: ['mp4', 'mkv'],
    *   allowedMimeTypeAccept: ['video/mp4', 'video/x-matroska'],
    *   maxsizeFile: 10,
    *   unityMaxSizeFile: 'MiB'
    * });
    * 
    * @throws {Error} - Throws an error if validation fails for any of the files, with details about the encountered issue.
    * 
    * @see {@link metadataValidate} for validating metadata (dimensions, duration, etc.).
    * @see {@link sizeValidate} for validating the size of the video files.
    * @see {@link extensionValidate} for validating the extensions of the video files.
    * @see {@link mimeTypeFileValidate} for validating the MIME type of the video files.
    */
    validate: (
        medias: File | FileList,
        targetInputname: string,
        optionsmedia: OptionsMediaVideo
    ) => Promise<this>
}

/**
 * @author AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class VideoValidator
 *
 * Validates video files by checking:
 *  - file extension
 *  - file size
 *  - MIME type (declared + startsWith "video/")
 *  - binary signature (magic bytes)
 *  - video metadata (duration, width, height) via a hidden <video> element
 *
 * @extends AbstractMediaValidator
 * @implements VideoValidatorInterface
 */
export class VideoValidator extends AbstractMediaValidator implements VideoValidatorInterface {
    /**
     * Temporary cache of video dimensions, keyed by filename.
     * Populated during metadataValidate() and cleared after each validate() call
     * to prevent unbounded memory growth on large FileLists.
     */
    private m_dimension: Record<string, VideoDimensions> = {};

    private static m_instance_media: VideoValidator;

    private constructor() {
        super();
    }


    public static getInstance(): VideoValidator {
        if (!VideoValidator.m_instance_media) {
            VideoValidator.m_instance_media = new VideoValidator();
        }

        return VideoValidator.m_instance_media;
    }


    /**
     * Validates a File or FileList of video files against the given options.
     *
     * Validation order per file:
     *  1. Extension
     *  2. Size
     *  3. MIME type
     *  4. Binary signature (magic bytes)
     *  5. Metadata (duration, dimensions)
     */
    public validate = async (
        medias: File | FileList,
        targetInputname: string = 'videofile',
        optionsmedia: OptionsMediaVideo = {}
    ): Promise<this> => {
        this.formErrorStore.clearFieldState(targetInputname);
        // Reset dimension cache for this validation run
        this.m_dimension = {};
        const files = medias instanceof FileList ? Array.from(medias) : [medias];

        const {
            allowedExtensions = this.defaultOptions.allowedExtensions,
            allowedMimeTypeAccept = this.defaultOptions.allowedMimeTypeAccept,
            maxsizeFile = 50,   // 50 MiB is a more realistic default for video
            unityMaxSizeFile = 'MiB',
            validateBySignature = true 
        } = optionsmedia;

        for (const file of files) {
            const extensionError = this.isValidExtension(
                file,
                allowedExtensions 
            );

            if (extensionError) {
                this.handleValidationError(targetInputname, file.name, extensionError);
                break;
            }

            this.sizeValidate(file, targetInputname, maxsizeFile, unityMaxSizeFile);
            // Validation du type MIME
            const mimeError = await this.mimeTypeFileValidate(file, allowedMimeTypeAccept!);
            if (mimeError) {
                this.handleValidationError(
                    targetInputname,
                    file.name,
                    `MIME type error: ${mimeError}`);
                break;
            }

            if (validateBySignature) {
                // Binary signature (magic bytes)
                const signatureError = await this.signatureFileValidate(file);
                if (signatureError) {
                    this.handleValidationError(targetInputname, file.name, signatureError);
                    break;
                }
            }

            // Validation des métadonnées (dimensions, durée, etc.)
            try {
                await this.metadataValidate(file, targetInputname, optionsmedia);
            } catch (error) {
                this.handleValidationError(
                    targetInputname,
                    file.name,
                    `Metadata validation failed: ${error instanceof Error ? error.message : error}`);
                break;
            }
            
            if (!this.formErrorStore.isFieldValid(targetInputname)) { break; }
        }

        return this;
    };

    protected getContext(): string {
        return 'video';
    }
    /**
     * Valide le type MIME d'un fichier pour vérifier s'il s'agit d'une vidéo.
     * 
     * Cette fonction vérifie si le type MIME du fichier est inclus dans la liste des types MIME acceptés pour les vidéos. 
     * Si ce n'est pas le cas, elle retourne un message d'erreur avec la liste des types autorisés.
     * 
     * @param media Le fichier à valider.
     * @param allowedMimeTypeAccept Liste des types MIME autorisés pour les vidéos.
     * @returns Une promesse contenant une chaîne d'erreur ou null si le type MIME est valide.
     */
    protected mimeTypeFileValidate(
        media: File,
        allowedMimeTypeAccept: string[]
    ): Promise<string | null> {
        return new Promise((resolve, reject) => {
            // Vérification de la présence du type MIME et si c'est un type vidéo autorisé
            if (!media.type ||
                !media.type.startsWith("video/") ||
                !allowedMimeTypeAccept.includes(media.type)) {
                resolve(`Invalid MIME type ${media.type} for video ${media.name}. Authorized types are: ${allowedMimeTypeAccept.join(', ')}`);
            } else {
                resolve(null); // Aucun problème, le type MIME est valide
            }
        });
    }

    /**
    * Returns the cached dimensions for a given file.
    * Dimensions are populated during metadataValidate() and are only
    * available after that step has completed successfully.
    *
    * @throws If dimensions are not yet cached for this file.
    */
    protected getFileDimensions(file: File): Promise<{ width: number; height: number }> {
        const cached = this.m_dimension[file.name];
        if (cached) {
            return Promise.resolve(cached);
        }
        // Dimensions are only available after metadataValidate() — this should
        // not be called before that step.
        return Promise.reject(
            new Error(
                `Dimensions not yet available for "${file.name}". ` +
                `Ensure metadataValidate() has completed first.`
            )
        );
    }

    /**
    * Loads video metadata via a hidden <video> element and validates:
    *  - duration (must be positive and finite)
    *  - height / width (if min/max options are provided)
    *
    * Caches dimensions in this.m_dimension for later use by getFileDimensions().
    * Always revokes the object URL to prevent memory leaks.
    */
    private metadataValidate = (
        media: File,
        targetInputname: string,
        optionsvideo?: OptionsMediaVideo
    ): Promise<this> => {
        return new Promise<this>((resolve, reject) => {
            const video = document.createElement('video') as HTMLVideoElement;
            video.preload = 'metadata';

            const objectUrl = URL.createObjectURL(media);

            const cleanup = () => URL.revokeObjectURL(objectUrl); //always free memory

            video.onloadedmetadata = () => {
                cleanup();

                // Duration must be a positive finite number
                if (!isFinite(video.duration) || video.duration <= 0) {
                    this.setValidationState(
                        false,
                        `The file "${media.name}" is not a valid video file or is corrupted (invalid duration).`,
                        targetInputname
                    );
                    return reject(new Error(`Invalid duration for "${media.name}".`));
                }

                // Cache dimensions so getFileDimensions() can serve them
                this.m_dimension[media.name] = {
                    width: video.videoWidth,
                    height: video.videoHeight,
                };

                if (optionsvideo) {
                    // Chain dimension validations sequentially
                    this.heightValidate(
                        media,
                        targetInputname,
                        optionsvideo.minHeight,
                        optionsvideo.maxHeight,
                        optionsvideo.unityDimensions
                    )
                        .then(() =>
                            this.widthValidate(
                                media,
                                targetInputname,
                                optionsvideo.minWidth,
                                optionsvideo.maxWidth,
                                optionsvideo.unityDimensions
                            )
                        )
                        .then(() => resolve(this))
                        .catch(reject);
                } else {
                    resolve(this);
                }
            };

            video.onerror = () => {
                cleanup(); 
                const msg = `Failed to load metadata for "${media.name}". The file may not be a valid video.`;
                this.setValidationState(false, msg, targetInputname);
                reject(new Error(msg)); // always reject with a meaningful Error
            };

            //Set src AFTER registering event handlers to avoid race conditions
            video.src = objectUrl;
        });
    };

     /**
     * Default validation options for video files.
     */
    private get defaultOptions(): OptionsMediaVideo {
        return {
            allowedExtensions: [
                "avi", "flv", "wmv", "mp4",
                "mov", "mkv", "webm", "3gp",
                "3g2", "m4v", "mpg", "mpeg",
                "ts", "ogv", "asf", "rm", "divx"
            ],
             allowedMimeTypeAccept: [
                'video/x-msvideo',                  // AVI
                'video/x-flv',                      // FLV
                'video/x-ms-wmv',                   // WMV
                'video/mp4',                        // MP4
                'video/quicktime',                  // MOV
                'video/x-matroska',                 // MKV
                'video/webm',                       // WebM
                'video/3gpp',                       // 3GP
                'video/3gpp2',                      // 3G2
                'video/x-m4v',                      // M4V
                'video/mpeg',                       // MPEG / MPG
                'video/mp2t',                       // TS
                'video/ogg',                        // OGV
                'video/x-ms-asf',                   // ASF
                'application/vnd.rn-realmedia',     // RM
                'video/divx',                       // DivX
            ],
        }
    }


    /**
     * Validates the binary signature (magic bytes) of a video file.
     *
     * Known video magic bytes (first 4–12 bytes):
     *  - MP4 / M4V  : 00 00 00 XX 66 74 79 70  (ftyp box, offset 4)
     *  - WebM / MKV : 1A 45 DF A3
     *  - AVI        : 52 49 46 46 ... 41 56 49  (RIFF....AVI)
     *  - MOV        : 00 00 00 XX 66 74 79 70 71 74  (ftyp qt)
     *  - MPEG / MPG : FF FB, FF F3, FF F2 (MPEG audio/video frames) | 00 00 01 Bx
     *  - FLV        : 46 4C 56
     *  - WMV / ASF  : 30 26 B2 75
     *  - OGG / OGV  : 4F 67 67 53
     *  - 3GP / 3G2  : ftyp box (same as MP4 family)
     *
     * Note: MP4-family files share the ISO Base Media File Format container
     * and are identified by the 'ftyp' atom at byte offset 4.
     *
     * @param file - The video file to validate.
     * @returns A promise resolving to an error string, or null if the signature is valid.
     */
    protected async signatureFileValidate(file: File): Promise<string | null> {
        let uint8Array: Uint8Array;

        try {
            uint8Array = await this.readFileAsUint8Array(file);
        } catch {
            return `Unable to read file "${file.name}" for signature validation.`;
        }

        // Read the first 12 bytes as a hex string
        const hex = Array.from(uint8Array.subarray(0, 12))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (this.isValidVideoSignature(hex, uint8Array)) {
            return null;
        }

        return (
            `The file "${file.name}" does not have a recognised video signature. ` +
            `It may be corrupt or disguised as a video file.`
        );
    }

    /**
     * Checks whether the hex signature matches any known video container format.
     *
     * @param hex        - Hex string of the first 12 bytes.
     * @param uint8Array - Raw bytes (used for MP4-family ftyp atom check).
     */
    private isValidVideoSignature(hex: string, uint8Array: Uint8Array): boolean {
        // WebM / MKV  : 1A 45 DF A3
        if (hex.startsWith('1a45dfa3')) return true;

        // FLV         : 46 4C 56
        if (hex.startsWith('464c56')) return true;

        // WMV / ASF   : 30 26 B2 75
        if (hex.startsWith('3026b275')) return true;

        // OGG / OGV   : 4F 67 67 53
        if (hex.startsWith('4f676753')) return true;

        // MPEG-PS     : 00 00 01 BA or 00 00 01 B3
        if (hex.startsWith('000001ba') || hex.startsWith('000001b3')) return true;

        // AVI : RIFF (52494646) at byte 0 + AVI  (41564920) at byte 8
        if (hex.startsWith('52494646') && hex.substring(16, 24) === '41564920') return true;

        // MP4 / MOV / M4V / 3GP / 3G2:
        // ISO Base Media File Format — 'ftyp' atom at byte offset 4 (bytes 4–7 = 66 74 79 70)
        const ftypHex = Array.from(uint8Array.subarray(4, 8))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        if (ftypHex === '66747970') return true;

        return false;
    }
}

export const videoValidator = VideoValidator.getInstance();