import { OptionsMediaVideo } from '../../interfaces';
import { AbstractMediaValidator } from './AbstractMediaValidator';
import { MediaValidatorInterface } from './MediaValidatorInterface';

class VideoValidator extends AbstractMediaValidator implements MediaValidatorInterface{
	private m_video_media: Map<string, File>;
	private static m_instance_media: VideoValidator;
	private constructor() {
		super();
		this.m_video_media = new Map<string,File>(); // Initialize the map here 
	}
	public static getInstance = (): VideoValidator => {
		if (!VideoValidator.m_instance_media) {
			VideoValidator.m_instance_media = new VideoValidator();
		}
		return VideoValidator.m_instance_media;
	}
	public validatorFile= async (
		medias: File | FileList,
		targetInputname: string = 'videofile',
		optionsmedia: OptionsMediaVideo = {
			extensions: ["avi", "flv", "wmv", "mp4", "mov", "mkv", "webm", "3gp", "3g2", "m4v", "mpg", "mpeg", "ts", "ogv", "asf", "rm", "divx"],
			allowedMimeTypeAccept: ["video/x-msvideo", "video/x-flv", "video/x-ms-wmv", "video/mp4", "video/quicktime", "video/x-matroska", "video/webm", "video/3gpp", "video/3gpp2", "video/x-m4v", "video/mpeg", "video/mp2t", "video/ogg", "video/x-ms-asf", "application/vnd.rn-realmedia", "video/divx"]
		}
	): Promise<this> => {
		const files = medias instanceof FileList ? Array.from(medias) : [medias];
		const extensions=optionsmedia.extensions || ["avi", "flv", "wmv", "mp4", "mov", "mkv", "webm", "3gp", "3g2", "m4v", "mpg", "mpeg", "ts", "ogv", "asf", "rm", "divx"];
		const allowedMimeTypeAccept = optionsmedia.allowedMimeTypeAccept || ["video/x-msvideo", "video/x-flv", "video/x-ms-wmv", "video/mp4", "video/quicktime", "video/x-matroska", "video/webm", "video/3gpp", "video/3gpp2", "video/x-m4v", "video/mpeg", "video/mp2t", "video/ogg", "video/x-ms-asf", "application/vnd.rn-realmedia", "video/divx"];
        for (const file of files) {
            this.m_video_media.set(file.name, file);
			this.validatorExtension(targetInputname, file.name, extensions); // Validation de l'extension dans la même boucle
           this.validatorSize(targetInputname,file.name, optionsmedia.maxsizeFile || 5, optionsmedia.unityMaxSizeFile || 'MiB')
            const mimeError =this.validateFileMimeType(file, allowedMimeTypeAccept);
            const signatureError = await this.validateMetadata(file,optionsmedia);

            if (mimeError || signatureError) {
               this.handleValidationError(targetInputname,file.name,`${mimeError ?? ''} ${signatureError ?? ''} name_video: ${file.name}`)
            }
        }
		return this;
    }
	protected getContext(): string {
        return 'video';
	}
	protected getFileId(id: string): File {
        const video_file = this.m_video_media.get(id);
        if (!video_file) {
            throw new Error(`Video file with ID ${id} does not exist in store.`);
        }
        return video_file;
    }
	protected validateFileMimeType(media: File,
		allowedMimeTypeAccept: string[] = ["video/x-msvideo", "video/x-flv", "video/x-ms-wmv", "video/mp4", "video/quicktime", "video/x-matroska", "video/webm", "video/3gpp", "video/3gpp2", "video/x-m4v", "video/mpeg", "video/mp2t", "video/ogg", "video/x-ms-asf", "application/vnd.rn-realmedia", "video/divx"]): string | null {
        if (!media.type.startsWith("video/") || !allowedMimeTypeAccept.includes(media.type)) {
            return `Invalid MIME type ${media.type} for video ${media.name}. Authorized types are: ${allowedMimeTypeAccept.join(', ')}`;
        }
        return null;
    }
	protected validateMetadata = (
    media: File,
    optionsvideo: OptionsMediaVideo | undefined
): Promise<string | null> => {
    return new Promise<string | null>((resolve, reject) => {
        // Création d'un élément vidéo pour analyser les métadonnées
        const video = document.createElement('video') as HTMLVideoElement;
        video.preload = "metadata";

        video.onloadedmetadata = () => {
            // Révoquer l'URL de l'objet pour libérer la mémoire
            window.URL.revokeObjectURL(video.src);

            // Vérifier si la vidéo a une durée valide
            if (video.duration > 0) {
                if (optionsvideo) {
                    // Validation de la durée maximale
                    if (optionsvideo.duration && optionsvideo.duration < video.duration) {
                        return reject(
                            `The length of the video exceeds the allowed limit (${optionsvideo.duration} ${
                                optionsvideo.unityDurationMedia || "s"
                            }).`
                        );
                    }

                    // Validation de la largeur maximale
                    if (optionsvideo.width && optionsvideo.width < video.videoWidth) {
                        return reject(
                            `The width of the video exceeds the allowed limit (${optionsvideo.width}px).`
                        );
                    }

                    // Validation de la hauteur maximale
                    if (optionsvideo.height && optionsvideo.height < video.videoHeight) {
                        return reject(
                            `The height of the video exceeds the allowed limit (${optionsvideo.height}px).`
                        );
                    }
                }

                // Si toutes les validations passent
                return resolve(null);
            } else {
                // Si la durée est invalide
                return reject(
                    `The file "${media.name}" is not a valid video file or is corrupted.`
                );
            }
        };
        // Gestion des erreurs de chargement
        video.onerror = () => {
            reject(
                `Failed to load the metadata for the video file "${media.name}". It might not be a valid video file.`
            );
        };
        // Définir la source de la vidéo
        video.src = URL.createObjectURL(media);
    });
};

}
export default VideoValidator.getInstance();