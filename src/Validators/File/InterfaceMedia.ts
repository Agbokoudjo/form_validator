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
    unityMaxSizeFile?: string;
    extensions?: string[];
    unityDimensions?: string;
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
export interface OptionsImage extends OptionsFile {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
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
export interface OptionsMediaVideo extends OptionsFile {
    duration?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    unityDurationMedia?: string;
}

/**
 * A union type that represents all possible validation option types
 * for supported media files (file, image, or video).
 */
export type OptionsValidateTypeFile = OptionsFile | OptionsImage | OptionsMediaVideo;

/**
 * Interface representing a validator that can validate various types of media.
 * 
 * @property fileValidator - A function that takes a media file or list,
 * validates it based on the provided options, and returns a Promise of the current instance.
 */
export interface MediaValidatorInterface {
    fileValidator: (
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

