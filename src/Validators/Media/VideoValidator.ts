import { AbstractMediaValidator } from './AbstractMediaValidator';
import {OptionsMediaVideo } from './MediaValidatorInterface';
interface VideoDimensions{
    width: number;
    height: number
}
export class VideoValidator extends AbstractMediaValidator {
    private m_dimension: Record<string, VideoDimensions>;
	private static m_instance_media: VideoValidator;
	private constructor() {
		super();
        this.m_dimension = {};
	}
	public static getInstance = (): VideoValidator => {
		if (!VideoValidator.m_instance_media) {
			VideoValidator.m_instance_media = new VideoValidator();
		}
		return VideoValidator.m_instance_media;
    }
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
	public fileValidator = async (
        medias: File | FileList,
        targetInputname: string = 'videofile',
        optionsmedia: OptionsMediaVideo = {
            extensions: ["avi", "flv", "wmv", "mp4", "mov", "mkv", "webm", "3gp", "3g2", "m4v", "mpg", "mpeg", "ts", "ogv", "asf", "rm", "divx"],
            allowedMimeTypeAccept: ["video/x-msvideo", "video/x-flv", "video/x-ms-wmv", "video/mp4", "video/quicktime", "video/x-matroska", "video/webm", "video/3gpp", "video/3gpp2", "video/x-m4v", "video/mpeg", "video/mp2t", "video/ogg", "video/x-ms-asf", "application/vnd.rn-realmedia", "video/divx"]
        }
    ): Promise<this> => {
        const files = medias instanceof FileList ? Array.from(medias) : [medias];
        const extensions = optionsmedia.extensions || ["avi", "flv", "wmv", "mp4", "mov", "mkv", "webm", "3gp", "3g2", "m4v", "mpg", "mpeg", "ts", "ogv", "asf", "rm", "divx"];
        const allowedMimeTypeAccept = optionsmedia.allowedMimeTypeAccept || ["video/x-msvideo", "video/x-flv", "video/x-ms-wmv", "video/mp4", "video/quicktime", "video/x-matroska", "video/webm", "video/3gpp", "video/3gpp2", "video/x-m4v", "video/mpeg", "video/mp2t", "video/ogg", "video/x-ms-asf", "application/vnd.rn-realmedia", "video/divx"];
        for (const file of files) {
            // 1. Validation de l'extension
            this.extensionValidate(file, targetInputname, extensions);
            // 2. Validation de la taille du fichier
            this.sizeValidate(file, targetInputname, optionsmedia.maxsizeFile || 5, optionsmedia.unityMaxSizeFile || 'MiB');
            // 3. Validation du type MIME
            const mimeError = await this.mimeTypeFileValidate(file, allowedMimeTypeAccept);
            if (mimeError) {
                this.handleValidationError(targetInputname, file.name, `MIME type error: ${mimeError}`);
                continue;  // Passer au fichier suivant si erreur de type MIME
            }
            // 4. Validation des métadonnées (dimensions, durée, etc.)
            try {
                await this.metadataValidate(file, targetInputname, optionsmedia);
            } catch (error) {
                this.handleValidationError(targetInputname, file.name, `Metadata validation failed: ${error}`);
            }
        }
        return this;
    };
    protected signatureFileValidate=async (file: File, uint8Array?: Uint8Array): Promise<string | null>=> {
        return null;
    }
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
        allowedMimeTypeAccept: string[] = [
            "video/x-msvideo", "video/x-flv", "video/x-ms-wmv", "video/mp4", 
            "video/quicktime", "video/x-matroska", "video/webm", "video/3gpp", 
            "video/3gpp2", "video/x-m4v", "video/mpeg", "video/mp2t", "video/ogg", 
            "video/x-ms-asf", "application/vnd.rn-realmedia", "video/divx"
        ]
    ): Promise<string | null> {
        return new Promise((resolve, reject) => {
            // Vérification de la présence du type MIME et si c'est un type vidéo autorisé
            if (!media.type || !media.type.startsWith("video/") || !allowedMimeTypeAccept.includes(media.type)) {
                resolve(`Invalid MIME type ${media.type} for video ${media.name}. Authorized types are: ${allowedMimeTypeAccept.join(', ')}`);
            } else {
                resolve(null); // Aucun problème, le type MIME est valide
            }
        });
    }
    protected getFileDimensions(file: File): Promise<{ width: number; height: number }> {
        return new Promise<{ width: number; height: number }>((resolve, reject) => {
            // Si les dimensions sont déjà stockées, les retourner
            if (this.m_dimension[file.name]) {
                return resolve(this.m_dimension[file.name]);
            }
            // Autrement, rejeter si les dimensions ne sont pas disponibles
            reject(`Dimensions not available for file: ${file.name}`);
        });
    }
    private metadataValidate = async (media: File, targetInputname: string, optionsvideo?: OptionsMediaVideo): Promise<this> => {
    return new Promise<this>((resolve, reject) => {
        // Création d'un élément vidéo pour analyser les métadonnées
        const video = document.createElement('video') as HTMLVideoElement;
        video.preload = "metadata";
        video.onloadedmetadata = () => {
            // Révoquer l'URL de l'objet pour libérer la mémoire
            window.URL.revokeObjectURL(video.src);
            // Vérification si la vidéo a une durée valide
            console.log(video.duration )
            if (video.duration < 0 || Number.isNaN(video.duration)) {
                this.setValidatorStatus(false, 
                    `The file "${media.name}" is not a valid video file or is corrupted.`, 
                    targetInputname);
                return reject();  // Rejeter la promesse en cas de fichier vidéo invalide
            }
            // Sauvegarder les dimensions de la vidéo pour utilisation future
            this.m_dimension = {
                ...this.m_dimension,
                [media.name]: { width: video.videoWidth, height: video.videoHeight }
            };
            // Validation avec les options fournies si disponibles
            if (optionsvideo) {
                // Validation de la hauteur
                this.heightValidate(media, targetInputname, optionsvideo.minHeight, optionsvideo.maxHeight)
                    .then(() => {
                        // Validation de la largeur
                        return this.widthValidate(media, targetInputname, optionsvideo.minWidth, optionsvideo.maxWidth);
                    })
                    .then(() => resolve(this))  // Résoudre la promesse si toutes les validations passent
                    .catch((error) => reject(error));  // Rejeter la promesse si une validation échoue
            } else {
                // Résoudre immédiatement si aucune option n'est spécifiée
                resolve(this);
            }
        };
        // Gestion des erreurs de chargement
        video.onerror = () => {
            this.setValidatorStatus(false, 
                `Failed to load the metadata for the video file "${media.name}". It might not be a valid video file.`, 
                targetInputname);
            reject();  // Rejeter la promesse en cas d'erreur de chargement
        };
        // Définir la source de la vidéo
        video.src = URL.createObjectURL(media);
    });
};
}