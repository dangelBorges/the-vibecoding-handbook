import type { Locale } from './config';

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export type Namespace<T extends Record<string, string>> = Record<Locale, T>;
