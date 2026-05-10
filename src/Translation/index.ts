export type { CacheTranslationInterface } from "./cache";
export {
    LocalStorageCacheTranslationAdapter
 } from "./cache";
export type {
    TranslationConfig,
    TranslationParams,
    TranslationResult
} from "./AppTranslation";

export {
    AppTranslation,
    appTranslation,
    TranslationCacheError,
    TranslationKeyNotFoundError,
    TranslationLoadError
} from "./AppTranslation";