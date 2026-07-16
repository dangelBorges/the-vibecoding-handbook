export function interpolate(
  text: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
}

export function selectPlural(
  locale: string,
  count: number,
  forms: { one: string; other: string }
): string {
  const rule = new Intl.PluralRules(locale).select(count);
  return rule === 'one' ? forms.one : forms.other;
}
