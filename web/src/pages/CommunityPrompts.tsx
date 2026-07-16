import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Copy, Check, Filter, ThumbsUp, Plus } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useI18n } from '../i18n/useI18n';
import { useNamespace } from '../i18n/useNamespace';
import communityPromptsNamespace from '../i18n/translations/communityPrompts';
import {
  getCategories,
  getLocalizedPrompts,
  getStacks,
  getTools,
} from '../i18n/localizers/prompts';
import { communityPrompts, type CommunityPrompt } from '../data/communityPrompts';

const UPVOTES_KEY = 'vibe-upvotes';

type UnifiedPrompt = CommunityPrompt & { source: 'curated' | 'community' };

const categoryColors: Record<string, string> = {
  feature: '#58A6B2',
  bugfix: '#ef4444',
  refactor: '#C792EA',
  test: '#C3E88D',
  docs: '#f59e0b',
};

function CommunityPromptCard({
  prompt,
  index,
  hasVoted,
  onVote,
  getCategoryLabel,
}: {
  prompt: UnifiedPrompt;
  index: number;
  hasVoted: boolean;
  onVote: (id: string) => void;
  getCategoryLabel: (value: string) => string;
}) {
  const { t } = useNamespace(communityPromptsNamespace);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt.prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`group bg-surface/50 rounded-xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-cyan/20 hover:card-shadow-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-heading font-medium"
                style={{
                  backgroundColor: `${categoryColors[prompt.category]}15`,
                  color: categoryColors[prompt.category],
                }}
              >
                {getCategoryLabel(prompt.category)}
              </span>
              <span className="text-[#8B92A8]/50 text-xs">{prompt.stack}</span>
              {prompt.source === 'curated' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-heading font-medium bg-cyan/10 text-cyan">
                  {t('official')}
                </span>
              )}
            </div>
            <h3 className="font-heading text-lg font-semibold text-[#F0F2F5] group-hover:text-cyan transition-colors">
              {prompt.title}
            </h3>
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors"
            title={t('copyPrompt')}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
        <p className="mt-2 text-[#8B92A8] text-sm">{prompt.description}</p>
      </div>

      <div className="px-6">
        <div
          className={`relative bg-[#0B0C10] rounded-lg border border-white/5 overflow-hidden transition-all ${
            expanded ? '' : 'max-h-40'
          }`}
        >
          <pre className="p-4 text-sm font-mono text-[#C792EA] overflow-x-auto whitespace-pre-wrap">
            {prompt.prompt}
          </pre>
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0B0C10] to-transparent" />
          )}
        </div>
        {prompt.prompt.length > 300 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-xs text-cyan hover:text-cyan/80 transition-colors"
          >
            {expanded ? t('showLess') : t('showMore')}
          </button>
        )}
      </div>

      <div className="p-6 pt-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {prompt.source === 'community' ? (
            <button
              onClick={() => onVote(prompt.id)}
              disabled={hasVoted}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading transition-colors ${
                hasVoted
                  ? 'bg-cyan/20 text-cyan cursor-default'
                  : 'bg-white/5 text-[#8B92A8] hover:bg-cyan/10 hover:text-cyan'
              }`}
            >
              <ThumbsUp size={14} />
              {hasVoted ? t('upvoted') : t('upvote')}
              <span className="ml-1">{prompt.votes + (hasVoted ? 1 : 0)}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading bg-cyan/10 text-cyan">
              {t('curated')}
            </span>
          )}
          <span className="text-xs text-[#8B92A8]/60">
            {t('byAuthor', { author: prompt.author })}
          </span>
        </div>
        <div className="text-xs text-[#8B92A8]/60">{prompt.whenToUse}</div>
      </div>
    </div>
  );
}

export default function CommunityPrompts() {
  const { locale } = useI18n();
  const { t, plural } = useNamespace(communityPromptsNamespace);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toolFilter, setToolFilter] = useState('all');
  const [stackFilter, setStackFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [upvotes, setUpvotes] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(UPVOTES_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const curatedPrompts = getLocalizedPrompts(locale);
  const categories = getCategories(locale);
  const tools = getTools(locale);
  const stacks = getStacks(locale);

  const categoryLabelMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.value, category.label])),
    [categories]
  );
  const getCategoryLabel = (value: string) => categoryLabelMap[value] ?? value;

  const unifiedPrompts: UnifiedPrompt[] = [
    ...curatedPrompts.map((prompt) => ({
      ...prompt,
      author: 'The Vibe Coding Handbook',
      submittedAt: '',
      votes: 0,
      source: 'curated' as const,
    })),
    ...communityPrompts.map((prompt) => ({ ...prompt, source: 'community' as const })),
  ];

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

  const filtered = unifiedPrompts.filter((prompt) => {
    const matchesSearch =
      !search ||
      prompt.title.toLowerCase().includes(search.toLowerCase()) ||
      prompt.description.toLowerCase().includes(search.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || prompt.category === categoryFilter;
    const matchesTool = toolFilter === 'all' || prompt.tool === toolFilter;
    const matchesStack = stackFilter === 'all' || prompt.stack === stackFilter;
    return matchesSearch && matchesCategory && matchesTool && matchesStack;
  });

  const submitUrl = `https://github.com/dangelBorges/the-vibecoding-handbook/issues/new?template=community_prompt.yml&title=${encodeURIComponent(
    '[Community Prompt] '
  )}`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#F0F2F5] mb-4">
              {t('title')}
            </h1>
            <p className="text-[#8B92A8] text-lg max-w-3xl">{t('subtitle')}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B92A8]/50"
                size={18}
              />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-[#F0F2F5] placeholder-[#8B92A8]/50 focus:outline-none focus:border-cyan/50 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-surface/50 border border-white/10 rounded-xl text-[#F0F2F5] hover:border-cyan/50 transition-colors"
            >
              <Filter size={18} />
              {t('filters')}
            </button>
            <a
              href={submitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-cyan/10 border border-cyan/30 rounded-xl text-cyan hover:bg-cyan/20 transition-colors"
            >
              <Plus size={18} />
              {t('submitPrompt')}
            </a>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-surface/30 rounded-xl border border-white/5">
              <div>
                <label className="block text-xs text-[#8B92A8] mb-2">
                  {t('categoryLabel')}
                </label>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-3 py-2 text-[#F0F2F5] focus:outline-none focus:border-cyan/50"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#8B92A8] mb-2">
                  {t('toolLabel')}
                </label>
                <select
                  value={toolFilter}
                  onChange={(event) => setToolFilter(event.target.value)}
                  className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-3 py-2 text-[#F0F2F5] focus:outline-none focus:border-cyan/50"
                >
                  {tools.map((tool) => (
                    <option key={tool.value} value={tool.value}>
                      {tool.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#8B92A8] mb-2">
                  {t('stackLabel')}
                </label>
                <select
                  value={stackFilter}
                  onChange={(event) => setStackFilter(event.target.value)}
                  className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-3 py-2 text-[#F0F2F5] focus:outline-none focus:border-cyan/50"
                >
                  {stacks.map((stack) => (
                    <option key={stack.value} value={stack.value}>
                      {stack.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="mb-4 text-[#8B92A8] text-sm">
            {plural(filtered.length, {
              one: t('countOne', { count: filtered.length }),
              other: t('countOther', { count: filtered.length }),
            })}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filtered.map((prompt, index) => (
                <CommunityPromptCard
                  key={prompt.id}
                  prompt={prompt}
                  index={index}
                  hasVoted={upvotes.includes(prompt.id)}
                  onVote={handleVote}
                  getCategoryLabel={getCategoryLabel}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#8B92A8] mb-4">{t('emptyTitle')}</p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                  setToolFilter('all');
                  setStackFilter('all');
                }}
                className="text-cyan hover:text-cyan/80 transition-colors"
              >
                {t('emptyClearFilters')}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
