export type Locale = 'en' | 'es' | 'pt' | 'zh';

export interface LocaleConfig {
  value: Locale;
  label: string;
  htmlLang: string;
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  { value: 'en', label: 'EN', htmlLang: 'en' },
  { value: 'es', label: 'ES', htmlLang: 'es' },
  { value: 'pt', label: 'PT', htmlLang: 'pt' },
  { value: 'zh', label: '中文', htmlLang: 'zh-CN' },
];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_STORAGE_KEY = 'vibe-locale';

const LOCALE_ALIASES: Record<string, Locale> = {
  en: 'en',
  'en-us': 'en',
  'en-gb': 'en',
  es: 'es',
  'es-es': 'es',
  'es-mx': 'es',
  'es-ar': 'es',
  pt: 'pt',
  'pt-br': 'pt',
  'pt-pt': 'pt',
  zh: 'zh',
  'zh-cn': 'zh',
  'zh-hans': 'zh',
};

export function resolveLocale(raw: string | null | undefined): Locale {
  if (!raw) return DEFAULT_LOCALE;
  const normalized = raw.toLowerCase().trim();
  return LOCALE_ALIASES[normalized] ?? DEFAULT_LOCALE;
}

export function isSupportedLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.some((config) => config.value === value);
}
