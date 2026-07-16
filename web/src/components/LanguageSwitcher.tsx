import { Globe } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { SUPPORTED_LOCALES, type Locale } from '../i18n/config';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as Locale);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Globe size={14} className="text-[#8B92A8]" />
      <select
        value={locale}
        onChange={handleChange}
        aria-label="Select language"
        className="bg-transparent text-[#8B92A8] text-sm font-heading focus:outline-none cursor-pointer hover:text-[#F0F2F5] transition-colors"
      >
        {SUPPORTED_LOCALES.map((config) => (
          <option key={config.value} value={config.value} className="bg-[#0B0C10]">
            {config.label}
          </option>
        ))}
      </select>
    </div>
  );
}
