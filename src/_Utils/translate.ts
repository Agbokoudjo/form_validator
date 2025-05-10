type TranslateCallback = (message: string) => string;

const config = {
  translate: undefined as TranslateCallback | undefined,
};
export function setTranslationCallback(callback: TranslateCallback): void {
  config.translate = callback;
}
export function translate(message: string): string {
  return config.translate ? config.translate(message) : message;
}
