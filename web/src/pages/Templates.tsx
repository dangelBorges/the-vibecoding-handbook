import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft,
  Download,
  FileCode,
  ClipboardCheck,
  Rocket,
  Shield,
  Check,
  Sparkles,
  Copy,
  ThumbsUp,
  Plus,
} from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { communityTemplates } from '../data/communityTemplates';
import { useNamespace } from '../i18n/useNamespace';
import { useI18n } from '../i18n/useI18n';
import templatesPage from '../i18n/translations/templatesPage';
import {
  getLocalizedTemplates,
  getCategories,
  getCategoryLabel,
  type LocalizedTemplate,
} from '../i18n/localizers/templates';

const UPVOTES_KEY = 'vibe-template-upvotes';

type UnifiedTemplate = LocalizedTemplate & {
  source: 'curated' | 'community';
  author: string;
  submittedAt: string;
  votes: number;
};

const categoryIcons: Record<string, React.ElementType> = {
  context: FileCode,
  rules: Shield,
  checklist: ClipboardCheck,
  starter: Rocket,
};

const categoryColors: Record<string, string> = {
  context: '#58A6B2',
  rules: '#C792EA',
  checklist: '#C3E88D',
  starter: '#f59e0b',
};

type TFunction = (
  key: keyof typeof templatesPage.en,
  vars?: Record<string, string | number>
) => string;

function TemplateCard({
  template,
  index,
  hasVoted,
  onVote,
  t,
}: {
  template: UnifiedTemplate;
  index: number;
  hasVoted: boolean;
  onVote: (id: string) => void;
  t: TFunction;
}) {
  const [copied, setCopied] = useState(false);
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = template.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([template.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = template.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const Icon = categoryIcons[template.category] || FileCode;
  const color = categoryColors[template.category] || '#58A6B2';

  return (
    <div
      ref={cardRef}
      className={`bg-surface/50 rounded-xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-cyan/20 hover:card-shadow-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading text-lg font-semibold text-[#F0F2F5]">{template.name}</h3>
                {template.source === 'curated' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-heading font-medium bg-cyan/10 text-cyan">
                    {t('official')}
                  </span>
                )}
              </div>
              <p className="text-[#8B92A8] text-xs">{template.filename}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#8B92A8] text-sm mb-4">{template.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-[#8B92A8]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Preview */}
        <div className="bg-[#0B0C10] rounded-lg border border-white/5 p-4 mb-4 max-h-48 overflow-y-auto">
          <pre className="font-mono text-xs text-[#C792EA] whitespace-pre-wrap">
            {template.content.slice(0, 600)}{template.content.length > 600 ? '...' : ''}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleCopy}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan/10 text-cyan font-heading text-sm hover:bg-cyan/20 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? t('copied') : t('copy')}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 text-[#F0F2F5] font-heading text-sm hover:bg-white/10 transition-colors"
          >
            <Download size={16} />
            {t('download')}
          </button>
          {template.source === 'community' && (
            <button
              onClick={() => onVote(template.id)}
              disabled={hasVoted}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-heading text-sm transition-colors ${
                hasVoted
                  ? 'bg-cyan/20 text-cyan cursor-default'
                  : 'bg-white/5 text-[#8B92A8] hover:bg-cyan/10 hover:text-cyan'
              }`}
            >
              <ThumbsUp size={16} />
              {hasVoted ? t('upvoted') : t('upvote')}
              <span className="ml-1">{template.votes + (hasVoted ? 1 : 0)}</span>
            </button>
          )}
        </div>

        {template.source === 'community' && (
          <p className="mt-3 text-xs text-[#8B92A8]/60">
            {t('byAuthor', { author: template.author })}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Templates() {
  const { t } = useNamespace(templatesPage);
  const { locale } = useI18n();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [upvotes, setUpvotes] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(UPVOTES_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const unifiedTemplates = useMemo<UnifiedTemplate[]>(() => {
    const curated = getLocalizedTemplates(locale).map((template) => ({
      ...template,
      source: 'curated' as const,
      author: 'The Vibe Coding Handbook',
      submittedAt: '',
      votes: 0,
    }));
    const community = communityTemplates.map((template) => ({
      ...template,
      source: 'community' as const,
      categoryLabel: getCategoryLabel(locale, template.category),
    }));
    return [...curated, ...community];
  }, [locale]);

  const categories = useMemo(() => getCategories(locale), [locale]);

  const handleVote = (id: string) => {
    if (upvotes.includes(id)) return;
    const next = [...upvotes, id];
    setUpvotes(next);
    try {
      localStorage.setItem(UPVOTES_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  };

  const filtered = unifiedTemplates.filter((template) => {
    if (categoryFilter === 'all') return true;
    return template.category === categoryFilter;
  });

  const submitUrl = `https://github.com/dangelBorges/the-vibecoding-handbook/issues/new?template=community_template.yml&title=${encodeURIComponent(
    '[Community Template] '
  )}`;

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

          {/* Category Filters + Submit */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
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
            <a
              href={submitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-cyan/10 border border-cyan/30 rounded-full text-cyan hover:bg-cyan/20 transition-colors text-sm font-heading"
            >
              <Plus size={16} />
              {t('submitTemplate')}
            </a>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={index}
                hasVoted={upvotes.includes(template.id)}
                onVote={handleVote}
                t={t}
              />
            ))}
          </div>

          {/* How to Use */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-cyan/5 to-purple-code/5 border border-cyan/10">
            <h2 className="font-heading text-xl font-semibold text-[#F0F2F5] mb-4">
              {t('howToTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan font-heading text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-1">{t('step1Title')}</h4>
                  <p className="text-[#8B92A8] text-xs">{t('step1Desc')}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan font-heading text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-1">{t('step2Title')}</h4>
                  <p className="text-[#8B92A8] text-xs">{t('step2Desc')}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan font-heading text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-1">{t('step3Title')}</h4>
                  <p className="text-[#8B92A8] text-xs">{t('step3Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
