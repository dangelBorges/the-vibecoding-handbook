import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Check,
  X,
  Wrench,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useNamespace } from '../i18n/useNamespace';
import { useI18n } from '../i18n/useI18n';
import toolsPage from '../i18n/translations/toolsPage';
import {
  getLocalizedTools,
  getCategories,
  getFeatureLabels,
  getCategoryLabels,
} from '../i18n/localizers/tools';
import type { Tool } from '../data/tools';

function FeatureBar({ value, label, max = 5 }: { value: number; label: string; max?: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#8B92A8] w-28 text-right flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan to-purple-code transition-all duration-700"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className="text-xs text-[#F0F2F5] font-heading w-6">{value}</span>
    </div>
  );
}

function ToolCard({
  tool,
  index,
  featureLabels,
  categoryLabels,
}: {
  tool: Tool;
  index: number;
  featureLabels: ReturnType<typeof getFeatureLabels>;
  categoryLabels: ReturnType<typeof getCategoryLabels>;
}) {
  const { t } = useNamespace(toolsPage);
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const categoryColors: Record<string, string> = {
    ide: '#58A6B2',
    cli: '#C792EA',
    'app-builder': '#C3E88D',
  };

  return (
    <div
      ref={cardRef}
      className={`bg-surface/50 rounded-xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-cyan/20 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-heading font-medium"
                style={{
                  backgroundColor: `${categoryColors[tool.category]}15`,
                  color: categoryColors[tool.category],
                }}
              >
                {categoryLabels[tool.category]}
              </span>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-[#F0F2F5] font-heading">{tool.rating}</span>
              </div>
            </div>
            <h3 className="font-heading text-xl font-semibold text-[#F0F2F5]">{tool.name}</h3>
            <p className="text-[#8B92A8] text-sm mt-1">{tool.tagline}</p>
          </div>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Feature Bars */}
        <div className="mt-4 space-y-2">
          <FeatureBar value={tool.features.contextAwareness} label={featureLabels.context} />
          <FeatureBar value={tool.features.multiFile} label={featureLabels.multiFile} />
          <FeatureBar value={tool.features.terminal} label={featureLabels.terminal} />
          <FeatureBar value={tool.features.uiGeneration} label={featureLabels.uiGeneration} />
          <FeatureBar value={tool.features.speed} label={featureLabels.speed} />
        </div>

        {/* Best For */}
        <div className="mt-4 p-3 rounded-lg bg-cyan/5 border border-cyan/10">
          <span className="text-xs text-cyan font-heading">{t('bestForLabel')}</span>
          <span className="text-xs text-[#8B92A8] ml-2">{tool.bestFor}</span>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1 text-sm text-cyan hover:text-cyan/80 transition-colors"
        >
          {expanded ? (
            <>{t('lessDetails')} <ChevronUp size={14} /></>
          ) : (
            <>{t('moreDetails')} <ChevronDown size={14} /></>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-white/5 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros */}
            <div>
              <h4 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-3 flex items-center gap-2">
                <Check size={14} className="text-mint-code" />
                {t('pros')}
              </h4>
              <ul className="space-y-2">
                {tool.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#8B92A8]">
                    <span className="text-mint-code mt-1 flex-shrink-0">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div>
              <h4 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-3 flex items-center gap-2">
                <X size={14} className="text-red-400" />
                {t('cons')}
              </h4>
              <ul className="space-y-2">
                {tool.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#8B92A8]">
                    <span className="text-red-400 mt-1 flex-shrink-0">&minus;</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-[#8B92A8]">{t('pricingLabel')}</span>
            <span className="text-xs text-[#F0F2F5] font-heading">{tool.pricing}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Tools() {
  const { locale } = useI18n();
  const { t, plural } = useNamespace(toolsPage);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const tools = getLocalizedTools(locale);
  const categories = getCategories(locale);
  const featureLabels = getFeatureLabels(locale);
  const categoryLabels = getCategoryLabels(locale);

  const filtered = tools.filter((toolItem) => {
    if (categoryFilter === 'all') return true;
    return toolItem.category === categoryFilter;
  });

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: '#0B0C10' }}>
      <Navigation />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[#8B92A8] hover:text-cyan text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={14} />
              {t('backToHome')}
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20">
                <Sparkles size={14} className="text-cyan" />
                <span className="text-cyan text-xs font-heading">{t('badge')}</span>
              </div>
            </div>
            <h1
              className="font-display text-[#F0F2F5] uppercase"
              style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}
            >
              {t('title')}
            </h1>
            <p className="mt-3 text-[#8B92A8] max-w-2xl">
              {t('subtitle')}
            </p>
          </div>

          {/* Category Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-heading transition-all ${
                  categoryFilter === cat.value
                    ? 'bg-cyan text-[#0B0C10]'
                    : 'bg-surface text-[#8B92A8] border border-white/10 hover:border-cyan/30 hover:text-[#F0F2F5]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="mb-6 flex items-center gap-2 text-sm text-[#8B92A8]">
            <Wrench size={16} />
            <span>
              {plural(filtered.length, {
                one: t('resultCount_one', { count: filtered.length }),
                other: t('resultCount_other', { count: filtered.length }),
              })}
            </span>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={index}
                featureLabels={featureLabels}
                categoryLabels={categoryLabels}
              />
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-semibold text-[#F0F2F5] mb-6">
              {t('matrixTitle')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-[#8B92A8] font-heading font-medium">{t('matrixTool')}</th>
                    <th className="text-center py-3 px-4 text-[#8B92A8] font-heading font-medium">{t('matrixCategory')}</th>
                    <th className="text-center py-3 px-4 text-[#8B92A8] font-heading font-medium">{t('matrixContext')}</th>
                    <th className="text-center py-3 px-4 text-[#8B92A8] font-heading font-medium">{t('matrixMultiFile')}</th>
                    <th className="text-center py-3 px-4 text-[#8B92A8] font-heading font-medium">{t('matrixSpeed')}</th>
                    <th className="text-center py-3 px-4 text-[#8B92A8] font-heading font-medium">{t('matrixRating')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tool) => (
                    <tr
                      key={tool.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <a
                          href={tool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-heading font-semibold text-[#F0F2F5] hover:text-cyan transition-colors flex items-center gap-2"
                        >
                          {tool.name}
                          <ExternalLink size={12} className="opacity-50" />
                        </a>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-heading"
                          style={{
                            backgroundColor: `${categoryColors[tool.category]}15`,
                            color: categoryColors[tool.category],
                          }}
                        >
                          {categoryLabels[tool.category]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-[#8B92A8]">{tool.features.contextAwareness}/5</td>
                      <td className="py-3 px-4 text-center text-[#8B92A8]">{tool.features.multiFile}/5</td>
                      <td className="py-3 px-4 text-center text-[#8B92A8]">{tool.features.speed}/5</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-[#F0F2F5] font-heading">{tool.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const categoryColors: Record<string, string> = {
  ide: '#58A6B2',
  cli: '#C792EA',
  'app-builder': '#C3E88D',
};
