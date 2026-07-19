/**
 * i18n configuration for VS Code extension
 * Supports: English, Spanish, Portuguese, Chinese
 */

export type Locale = 'en' | 'es' | 'pt' | 'zh';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'es', 'pt', 'zh'];

export const LOCALE_ALIASES: Record<string, Locale> = {
  'en-US': 'en',
  'en-GB': 'en',
  'es-ES': 'es',
  'es-MX': 'es',
  'es-AR': 'es',
  'pt-BR': 'pt',
  'pt-PT': 'pt',
  'zh-CN': 'zh',
  'zh-TW': 'zh',
  'zh-HK': 'zh',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  zh: '中文',
};

/**
 * Resolve locale from VS Code's language identifier
 */
export function resolveLocale(vscodeLocale: string): Locale {
  // Check exact match first
  if (SUPPORTED_LOCALES.includes(vscodeLocale as Locale)) {
    return vscodeLocale as Locale;
  }
  // Check aliases (e.g., en-US -> en)
  const base = vscodeLocale.split('-')[0];
  if (base && SUPPORTED_LOCALES.includes(base as Locale)) {
    return base as Locale;
  }
  // Check full locale with alias map
  const resolved = LOCALE_ALIASES[vscodeLocale];
  if (resolved) {
    return resolved;
  }
  // Default to English
  return 'en';
}
