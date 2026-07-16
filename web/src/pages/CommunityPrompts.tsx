import { useState, useEffect, useRef } from 'react';
import { Search, Copy, Check, Filter, ThumbsUp, Plus } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { communityPrompts, type CommunityPrompt } from '../data/communityPrompts';
import { prompts as curatedPrompts, categories, tools, stacks } from '../data/prompts';

const UPVOTES_KEY = 'vibe-upvotes';

type UnifiedPrompt = CommunityPrompt & { source: 'curated' | 'community' };

const unifiedPrompts: UnifiedPrompt[] = [
  ...curatedPrompts.map((p) => ({ ...p, author: 'The Vibe Coding Handbook', submittedAt: '', votes: 0, source: 'curated' as const })),
  ...communityPrompts.map((p) => ({ ...p, source: 'community' as const })),
];

const categoryColors: Record<string, string> = {
  feature: '#58A6B2',
  bugfix: '#ef4444',
  refactor: '#C792EA',
  test: '#C3E88D',
  docs: '#f59e0b',
};

const categoryLabels: Record<string, string> = {
  feature: 'Feature',
  bugfix: 'Bugfix',
  refactor: 'Refactor',
  test: 'Test',
  docs: 'Docs',
};

function CommunityPromptCard({
  prompt,
  index,
  hasVoted,
  onVote,
}: {
  prompt: UnifiedPrompt;
  index: number;
  hasVoted: boolean;
  onVote: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
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
                {categoryLabels[prompt.category]}
              </span>
              <span className="text-[#8B92A8]/50 text-xs">{prompt.stack}</span>
              {prompt.source === 'curated' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-heading font-medium bg-cyan/10 text-cyan">
                  Official
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
            title="Copy prompt"
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
            {expanded ? 'Show less' : 'Show more'}
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
              {hasVoted ? 'Upvoted' : 'Upvote'}
              <span className="ml-1">{prompt.votes + (hasVoted ? 1 : 0)}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading bg-cyan/10 text-cyan">
              Curated
            </span>
          )}
          <span className="text-xs text-[#8B92A8]/60">by {prompt.author}</span>
        </div>
        <div className="text-xs text-[#8B92A8]/60">{prompt.whenToUse}</div>
      </div>
    </div>
  );
}

export default function CommunityPrompts() {
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

  const filtered = unifiedPrompts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesTool = toolFilter === 'all' || p.tool === toolFilter;
    const matchesStack = stackFilter === 'all' || p.stack === stackFilter;
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
              Prompt Library
            </h1>
            <p className="text-[#8B92A8] text-lg max-w-3xl">
              Curated prompts plus community submissions. Upvote the ones you find useful, copy them
              into your agent, or submit your own via GitHub.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B92A8]/50" size={18} />
              <input
                type="text"
                placeholder="Search community prompts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-[#F0F2F5] placeholder-[#8B92A8]/50 focus:outline-none focus:border-cyan/50 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-surface/50 border border-white/10 rounded-xl text-[#F0F2F5] hover:border-cyan/50 transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>
            <a
              href={submitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-cyan/10 border border-cyan/30 rounded-xl text-cyan hover:bg-cyan/20 transition-colors"
            >
              <Plus size={18} />
              Submit a prompt
            </a>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-surface/30 rounded-xl border border-white/5">
              <div>
                <label className="block text-xs text-[#8B92A8] mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-3 py-2 text-[#F0F2F5] focus:outline-none focus:border-cyan/50"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#8B92A8] mb-2">Tool</label>
                <select
                  value={toolFilter}
                  onChange={(e) => setToolFilter(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-3 py-2 text-[#F0F2F5] focus:outline-none focus:border-cyan/50"
                >
                  {tools.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#8B92A8] mb-2">Stack</label>
                <select
                  value={stackFilter}
                  onChange={(e) => setStackFilter(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-3 py-2 text-[#F0F2F5] focus:outline-none focus:border-cyan/50"
                >
                  {stacks.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="mb-4 text-[#8B92A8] text-sm">
            {filtered.length} community prompt{filtered.length !== 1 ? 's' : ''}
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
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#8B92A8] mb-4">No community prompts match your filters.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                  setToolFilter('all');
                  setStackFilter('all');
                }}
                className="text-cyan hover:text-cyan/80 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
