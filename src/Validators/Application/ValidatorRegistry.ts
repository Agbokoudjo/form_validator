import { DocumentValidator, FormInputValidator, ImageValidator, VideoValidator } from "..";
import { Logger } from "../..";
export class ValidatorRegistry {
    private static formInputValidate?: FormInputValidator;
    private static imageValidate?: ImageValidator;
    private static documentValidate?: DocumentValidator;
    private static videoValidate?: VideoValidator;
    private static validatorInstance: ValidatorRegistry;
    private constructor() { }
    public static getInstance(): ValidatorRegistry {
        if (!ValidatorRegistry.validatorInstance) {
            ValidatorRegistry.validatorInstance = new ValidatorRegistry();
        }
        return ValidatorRegistry.validatorInstance;
    }
    public static getInstanceFormInputValidator(): FormInputValidator {
        Logger.log('Instance before FormInputValidator ', this.formInputValidate)
        if (!this.formInputValidate) { this.formInputValidate = FormInputValidator.getInstance(); }
        Logger.info('Instance after FormInputValidator ', this.formInputValidate)
        return this.formInputValidate;
    }
    public static getInstanceImageValidator(): ImageValidator {
        Logger.log('Instance before ImageValidator ', this.imageValidate)
        if (!this.imageValidate) { this.imageValidate = ImageValidator.getInstance(); }
        Logger.log('Instance after ImageValidator ', this.imageValidate)
        return this.imageValidate;
    }
    public static getInstanceDocumentValidator(): DocumentValidator {
        Logger.log('Instance before DocumentValidator ', this.documentValidate)
        if (!this.documentValidate) { this.documentValidate = DocumentValidator.getInstance(); }
        Logger.log('Instance after DocumentValidator ', this.documentValidate)
        return this.documentValidate;
    }
    public static getInstanceVideoValidator(): VideoValidator {
        Logger.log('Instance before VideoValidator ', this.videoValidate)
        if (!this.videoValidate) { this.videoValidate = VideoValidator.getInstance(); }
        Logger.log('Instance after VideoValidator ', this.videoValidate)
        return this.videoValidate;
    }
}