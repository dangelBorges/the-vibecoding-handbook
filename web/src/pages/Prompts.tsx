import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Search, Copy, Check, Filter, MessageSquareCode, ArrowLeft, Sparkles } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { prompts, categories, tools, stacks, type Prompt } from '../data/prompts';

function PromptCard({ prompt, index }: { prompt: Prompt; index: number }) {
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

  return (
    <div
      ref={cardRef}
      className={`group bg-surface/50 rounded-xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-cyan/20 hover:card-shadow-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
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

      {/* Prompt Preview */}
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

      {/* Footer */}
      <div className="p-6 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8B92A8]/60">Tool:</span>
          <span className="text-xs text-[#8B92A8]">{prompt.tool}</span>
        </div>
        <div className="text-xs text-[#8B92A8]/60">
          {prompt.whenToUse}
        </div>
      </div>
    </div>
  );
}

export default function Prompts() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toolFilter, setToolFilter] = useState('all');
  const [stackFilter, setStackFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = prompts.filter((p) => {
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
              Back to home
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20">
                <Sparkles size={14} className="text-cyan" />
                <span className="text-cyan text-xs font-heading">Interactive Library</span>
              </div>
            </div>
            <h1
              className="font-display text-[#F0F2F5] uppercase"
              style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}
            >
              Prompt Library
            </h1>
            <p className="mt-3 text-[#8B92A8] max-w-2xl">
              50+ copy-paste prompts for every coding task. Filter by category, tool, or stack.
              Click the copy button to grab any prompt instantly.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B92A8]" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-white/10 rounded-xl text-[#F0F2F5] placeholder-[#8B92A8]/50 focus:outline-none focus:border-cyan/40 transition-colors"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 ${
                  showFilters
                    ? 'border-cyan/40 text-cyan bg-cyan/10'
                    : 'border-white/10 text-[#8B92A8] hover:border-white/20'
                }`}
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-3 p-4 bg-surface/50 rounded-xl border border-white/5">
                <div>
                  <label className="text-xs text-[#8B92A8] mb-1.5 block">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-[#0B0C10] border border-white/10 rounded-lg text-[#F0F2F5] text-sm focus:outline-none focus:border-cyan/40"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#8B92A8] mb-1.5 block">Tool</label>
                  <select
                    value={toolFilter}
                    onChange={(e) => setToolFilter(e.target.value)}
                    className="px-3 py-2 bg-[#0B0C10] border border-white/10 rounded-lg text-[#F0F2F5] text-sm focus:outline-none focus:border-cyan/40"
                  >
                    {tools.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#8B92A8] mb-1.5 block">Stack</label>
                  <select
                    value={stackFilter}
                    onChange={(e) => setStackFilter(e.target.value)}
                    className="px-3 py-2 bg-[#0B0C10] border border-white/10 rounded-lg text-[#F0F2F5] text-sm focus:outline-none focus:border-cyan/40"
                  >
                    {stacks.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mb-6 flex items-center gap-2 text-sm text-[#8B92A8]">
            <MessageSquareCode size={16} />
            <span>{filtered.length} prompt{filtered.length !== 1 ? 's' : ''} found</span>
          </div>

          {/* Prompt Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((prompt, index) => (
              <PromptCard key={prompt.id} prompt={prompt} index={index} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <MessageSquareCode size={48} className="mx-auto text-[#8B92A8]/20 mb-4" />
              <p className="text-[#8B92A8]">No prompts match your filters.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                  setToolFilter('all');
                  setStackFilter('all');
                }}
                className="mt-3 text-cyan hover:underline"
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
