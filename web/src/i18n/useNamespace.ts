import { useI18n } from './useI18n';
import { interpolate, selectPlural } from './utils';
import type { Locale } from './config';
import type { Namespace } from './types';

export function useNamespace<T extends Record<string, string>>(
  namespace: Namespace<T>
) {
  const { locale } = useI18n();
  const strings = namespace[locale];

  const t = (key: keyof T, vars?: Record<string, string | number>): string => {
    const value = strings[key];
    return interpolate(typeof value === 'string' ? value : String(key), vars);
  };

  const plural = (
    count: number,
    forms: { one: string; other: string }
  ): string => selectPlural(locale === 'zh' ? 'zh-CN' : locale, count, forms);

  return { t, plural };
}

export function getLocalizedValue<T>(
  namespace: Record<Locale, T>,
  locale: Locale
): T {
  return namespace[locale];
}
