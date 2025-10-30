/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS &  SERVICES
 *
 * For more information, please feel free to contact the author.
 */
import { AbstractFieldValidator } from "../FieldValidator";
import { textInputValidator, TextInputOptions } from "./TextInputValidator";
import {
    WordScoringOptions,
    deepMerge,
    lowerRegex,
    punctuationRegex,
    numberRegex,
    symbolRegex,
    upperRegex,
    strongPasswordWithUpperRegex,
    analyzeWord,
    scoreWord
} from "../../../_Utils";

export const SCOREANALYSISPASSWORD = "scoreAnalysisPassword";

export interface PassworkRuleOptions extends TextInputOptions {
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

/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class PasswordInputValidator
 * @extends AbstractFieldValidator
 * @implements PasswordInputValidatorInterface
 */
export class PasswordInputValidator extends AbstractFieldValidator {

    private static __instanceValidator: PasswordInputValidator
    private constructor() { super(); }

    public static getInstance(): PasswordInputValidator {
        if (!PasswordInputValidator.__instanceValidator) {
            PasswordInputValidator.__instanceValidator = new PasswordInputValidator();
        }
        return PasswordInputValidator.__instanceValidator;
    }

    /**
        * Validates a password field with customizable rules and scoring.
        *
        * This method checks whether the input password satisfies character requirements such as
        * uppercase, lowercase, numbers, symbols, and punctuation. It also validates the length and 
        * an optional custom regular expression. Additionally, it can analyze the password and 
        * calculate a strength score.
        *
        * 🔐 If scoring is enabled, a `CustomEvent` named `SCOREANALYSISPASSWORD` is dispatched on the document,
        * containing the analysis result, calculated score, and input field name.
        *
        * @param datainput - The password input string to validate.
        * @param targetInputname - The identifier of the field being validated (used as a key for errors).
        * @param optionsinputtext - Validation options of type `PassworkRuleOptions`. Includes:
        * - `minLength` / `maxLength` – Password length constraints
        * - `upperCaseAllow`, `lowerCaseAllow`, `numberAllow`, `symbolAllow`, `punctuationAllow` – Character requirements
        * - `regexValidator` – Optional custom regex
        * - `requiredInput` – Whether the input is mandatory
        * - `enableScoring` – Enables strength analysis and scoring if `true`
        * @param ignoreMergeWithDefaultOptions - If `true`, skips merging with default options and uses the input options as-is.
        * @param ananalyzePasswordOptions - Optional configuration for customizing how the password is analyzed (regex overrides per character type).
        * @param scoringPasswordOptions - Optional scoring rules used if `enableScoring` is set to true.
        *
        * @returns The current validator instance (`this`) to allow method chaining.
        *
        * @example
        * ```ts
        * validator.validate("MySecur3P@ss!", "newPassword", {
        *   minLength: 12,
        *   upperCaseAllow: true,
        *   numberAllow: true,
        *   enableScoring: true
        * });
        *
        * document.addEventListener("SCOREANALYSISPASSWORD", (event) => {
        *   const { input, score, analysis } = event.detail;
        *   console.log(`Field: ${input}, Score: ${score}`, analysis);
        * });
        * ```
        *
        * @fires SCOREANALYSISPASSWORD – A `CustomEvent` dispatched when password scoring is enabled.
        * The `event.detail` object includes:
        * - `input` – Name of the validated input field
        * - `score` – Numeric score of password strength
        * - `analysis` – Character analysis result
    */
    public validate = (
        value: string | undefined,
        targetInputname: string,
        optionsValidate: PassworkRuleOptions,
        ignoreMergeWithDefaultOptions: boolean = false
    ): this => {

        const {
            minLength,
            maxLength,
            upperCaseAllow,
            lowerCaseAllow,
            numberAllow,
            symbolAllow,
            punctuationAllow,
            customUpperRegex,
            customLowerRegex,
            customNumberRegex,
            customSymbolRegex,
            customPunctuationRegex,
            regexValidator,
            requiredInput,
            errorMessageInput,
            enableScoring,
            scoringPasswordOptions
        } = this.mergeOptions(optionsValidate, ignoreMergeWithDefaultOptions);

        textInputValidator.validate(
            value,
            targetInputname,
            {
                minLength: minLength,
                maxLength: maxLength,
                requiredInput: requiredInput,
                regexValidator: regexValidator,
                typeInput: "password",
                errorMessageInput: errorMessageInput ?? "Password does not match the required pattern. ",
            },
            true
        )

        if (!this.formErrorStore.isFieldValid(targetInputname)) { return this; }

        const datainput = this.getRawStringValue(value);

        if (upperCaseAllow &&
            customUpperRegex &&
            !customUpperRegex.test(datainput)) {
            return this.setValidationState(false, "Password must contain at least one uppercase letter.", targetInputname);
        }

        if (lowerCaseAllow &&
            customLowerRegex &&
            !customLowerRegex.test(datainput)) {
            return this.setValidationState(false, "Password must contain at least one lowercase letter.", targetInputname);
        }

        if (numberAllow &&
            customNumberRegex &&
            !customNumberRegex.test(datainput)) {
            return this.setValidationState(false, "Password must contain at least one digit.", targetInputname);
        }

        if (symbolAllow &&
            customSymbolRegex &&
            !customSymbolRegex.test(datainput)) {
            return this.setValidationState(false, "Password must contain at least one special character.", targetInputname);
        }

        if (punctuationAllow &&
            customPunctuationRegex &&
            !customPunctuationRegex.test(datainput)) {
            return this.setValidationState(false, "Password must contain at least one punctuation character.", targetInputname);
        }

        // ✅ Analyse du mot et scoring si demandé
        if (enableScoring) {
            const analysis = analyzeWord(datainput, {
                customUpperRegex: customUpperRegex,
                customLowerRegex: customLowerRegex,
                customNumberRegex: customNumberRegex,
                customSymbolRegex: customSymbolRegex,
                customPunctuationRegex: customPunctuationRegex,
                analyzeCharTypes: {
                    allowedLower: lowerCaseAllow,
                    allowedNumber: numberAllow,
                    allowedPunctuation: punctuationAllow,
                    allowedSymbol: symbolAllow,
                    allowedUpper: upperCaseAllow
                }
            });
            const score = scoreWord(analysis, scoringPasswordOptions);
            document.dispatchEvent(new CustomEvent(typeof SCOREANALYSISPASSWORD, {
                cancelable: true,
                bubbles: false,
                detail: {
                    score,
                    analysis,
                    input: targetInputname
                }
            }))
        }

        return this;
    }

    private mergeOptions(
        optionsinputtext: PassworkRuleOptions,
        ignoreDefaults: boolean
    ): PassworkRuleOptions {

        if (ignoreDefaults) {
            return optionsinputtext;
        }

        return deepMerge(optionsinputtext, {
            minLength: 8,
            maxLength: 256,
            upperCaseAllow: true,
            lowerCaseAllow: true,
            numberAllow: true,
            specialChar: true,
            customUpperRegex: upperRegex,
            customLowerRegex: lowerRegex,
            customNumberRegex: numberRegex,
            customSymbolRegex: symbolRegex,
            customPunctuationRegex: punctuationRegex,
            regexValidator: strongPasswordWithUpperRegex,
            requiredInput: true,
            enableScoring: true,

        })
    }
}

export const passwordInputValidator = PasswordInputValidator.getInstance();