/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

export interface OptionsInputField {
    typeInput?: string;
    errorMessageInput?: string;
    regexValidator?: RegExp;
    minLength?: number;
    maxLength?: number;
    requiredInput?: boolean;
    escapestripHtmlAndPhpTags?: boolean;
}
export interface OptionsFile{
    allowedMimeTypeAccept?: string[];
     maxsizeFile?: number;
    unityMaxSizeFile?: string;
    extensions?: string[];
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
export interface OptionsMediaVideo extends OptionsFile{
    duration?: number;
    height?: number;
    width?: number;
    unityDurationMedia?: string;
}