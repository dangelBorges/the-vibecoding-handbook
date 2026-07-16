import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  resolveLocale,
  type Locale,
} from './config';
import { I18nContext } from './I18nContext';
import meta from './translations/meta';

function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get('lang');
  if (paramLang) return resolveLocale(paramLang);

  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored) return resolveLocale(stored);
  } catch {
    // Ignore storage errors (e.g. private mode).
  }

  return resolveLocale(navigator.language);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    document.title = meta[locale].title;

    const description = meta[locale].description;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', description);

    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage errors.
    }
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
