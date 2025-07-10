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
import {
    AnalyzeWordOptions, WordScoringOptions, deepMerge, lowerRegex,
    punctuationRegex, numberRegex, symbolRegex, upperRegex,
    strongPasswordWithUpperRegex, analyzeWord, scoreWord
} from "../../_Utils";
import { FormError } from "../FormError";
import { textInputValidator, TextInputOptions } from "./TextInputValidator";
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
}

export interface PasswordInputValidatorInterface {
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
 * validator.passwordValidator("MySecur3P@ss!", "newPassword", {
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

    passwordValidator: (
        datainput: string,
        targetInputname: string,
        optionsinputtext: PassworkRuleOptions,
        ignoreMergeWithDefaultOptions: boolean, // if you give options all ,you can to pass the option at true for that the function not call deepMerge for performance
        ananalyzeWordOptionsPassword?: AnalyzeWordOptions,
        scoringOptions?: WordScoringOptions,
    ) => this;
}
/**
 * @author AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * @package <https://github.com/Agbokoudjo/form_validator>
 * @class PasswordInputValidator
 * @extends FormError
 * @implements PasswordInputValidatorInterface
 */
export class PasswordInputValidator extends FormError implements PasswordInputValidatorInterface {
    private static __instanceValidator: PasswordInputValidator
    private constructor() { super(); }

    public static getInstance = (): PasswordInputValidator => {
        if (!PasswordInputValidator.__instanceValidator) {
            PasswordInputValidator.__instanceValidator = new PasswordInputValidator();
        }
        return PasswordInputValidator.__instanceValidator;
    }
    passwordValidator = (datainput: string,
        targetInputname: string,
        optionsinputtext: PassworkRuleOptions,
        ignoreMergeWithDefaultOptions: boolean = false,
        ananalyzePasswordOptions?: AnalyzeWordOptions | undefined,
        scoringPasswordOptions?: WordScoringOptions | undefined): this => {
        datainput = datainput.trim();
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
            enableScoring
        } = ignoreMergeWithDefaultOptions ? optionsinputtext : deepMerge(optionsinputtext, {
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
            enableScoring: true
        })
        if (upperCaseAllow &&
            customUpperRegex &&
            !customUpperRegex.test(datainput)) {
            return this.setValidatorStatus(false, "Password must contain at least one uppercase letter.", targetInputname);
        }
        if (lowerCaseAllow &&
            customLowerRegex &&
            !customLowerRegex.test(datainput)) {
            return this.setValidatorStatus(false, "Password must contain at least one lowercase letter.", targetInputname);
        }
        if (numberAllow &&
            customNumberRegex &&
            !customNumberRegex.test(datainput)) {
            return this.setValidatorStatus(false, "Password must contain at least one digit.", targetInputname);
        }
        if (symbolAllow &&
            customSymbolRegex &&
            !customSymbolRegex.test(datainput)) {
            return this.setValidatorStatus(false, "Password must contain at least one special character.", targetInputname);
        }
        if (punctuationAllow &&
            customPunctuationRegex &&
            !customPunctuationRegex.test(datainput)) {
            return this.setValidatorStatus(false, "Password must contain at least one punctuation character.", targetInputname);
        }
        textInputValidator.textValidator(datainput,
            targetInputname,
            {
                minLength: minLength,
                maxLength: maxLength,
                requiredInput: requiredInput,
                regexValidator: regexValidator,
                typeInput: "password",
                errorMessageInput: "Password does not match the required pattern. ",
            },
            true
        )
        if (!this.hasErrorsField(targetInputname)) { return this; }
        // ✅ Analyse du mot et scoring si demandé
        if (enableScoring) {
            const analysis = analyzeWord(datainput, ananalyzePasswordOptions);
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
}
export const passwordValidator = PasswordInputValidator.getInstance();