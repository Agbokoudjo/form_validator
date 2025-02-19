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

import { OptionsFile } from '../../interfaces';

export interface MediaValidatorInterface{
    detecteMimetype?: (id_or_filename: string, hexasignatureFile: string, uint8Array: Uint8Array) => this;
    getExtensions?: (allowedMimeTypes: string[]) => string[];
    validatorExtension: (targetInputname: string, filename: string, allowedExtensions: string[]) => string;
    validatorFile?: (
        media: File | FileList,
        targetInputname: string,
       optionsfile:OptionsFile
    ) => Promise<this>;
    setAllowedExtension: (allowedExtension: string[]) => this;
}
