/**
 * i18n module for VS Code extension
 * Provides translations for commands, tree views, and messages
 */

import { Locale, resolveLocale, LOCALE_NAMES, SUPPORTED_LOCALES } from './config';
import { en } from './en';
import { es } from './es';
import { pt } from './pt';
import { zh } from './zh';

export { Locale, LOCALE_NAMES, SUPPORTED_LOCALES };

const translations: Record<Locale, typeof en> = {
  en,
  es,
  pt,
  zh,
};

// Current locale state
let currentLocale: Locale = 'en';

/**
 * Initialize i18n with VS Code's language
 */
export function initI18n(vscodeLocale: string): void {
  currentLocale = resolveLocale(vscodeLocale);
}

/**
 * Get current locale
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Set locale manually
 */
export function setLocale(locale: Locale): void {
  if (SUPPORTED_LOCALES.includes(locale)) {
    currentLocale = locale;
  }
}

/**
 * Get translation for a key path (e.g., 'cmdInit' or 'viewPolicies')
 * Supports parameterized translations with {{variable}} syntax
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const translation = translations[currentLocale] as Record<string, string>;
  const enTranslation = translations.en as Record<string, string>;
  let text = translation[key] || enTranslation[key] || key;
  
  if (params) {
    for (const [paramKey, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(value));
    }
  }
  
  return text;
}

/**
 * Get all translations for current locale
 */
export function getTranslations(): typeof en {
  return translations[currentLocale];
}

/**
 * Get available locales for language picker
 */
export function getAvailableLocales(): Array<{ locale: Locale; name: string }> {
  return SUPPORTED_LOCALES.map(locale => ({
    locale,
    name: LOCALE_NAMES[locale],
  }));
}