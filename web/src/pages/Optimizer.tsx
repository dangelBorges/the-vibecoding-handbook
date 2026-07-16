import { useState, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft, Wand2, Copy, Check, Upload, Zap,
  Sparkles, ChevronDown, ChevronUp, FileCode, Target,
  TrendingUp, Layers, AlertCircle, X,
} from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useNamespace } from '../i18n/useNamespace';
import { useI18n } from '../i18n/useI18n';
import {
  getIntentLabels,
  getImprovements,
  getSectionTitles,
} from '../i18n/localizers/optimizer';
import optimizerPage from '../i18n/translations/optimizerPage';
import {
  optimizePrompt,
  extractContextFromAgentsMd,
  type OptimizedPrompt,
} from '../data/optimizer';

export default function Optimizer() {
  const { locale } = useI18n();
  const { t, plural } = useNamespace(optimizerPage);
  const intentLabels = getIntentLabels(locale);
  const sectionTitles = getSectionTitles(locale);

  const [rawPrompt, setRawPrompt] = useState('');
  const [context, setContext] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<OptimizedPrompt | null>(null);
  const [copied, setCopied] = useState(false);
  const [agentsFile, setAgentsFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleOptimize = useCallback(() => {
    if (!rawPrompt.trim()) return;
    const fullContext = [context, agentsFile].filter(Boolean).join('\n\n');
    const optimized = optimizePrompt(rawPrompt, fullContext || undefined);
    setResult(optimized);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [rawPrompt, context, agentsFile]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.optimized);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = result.optimized;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = extractContextFromAgentsMd(content);
      setAgentsFile(parsed);
    };
    reader.readAsText(file);
  };

  const clearAgentsFile = () => {
    setAgentsFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Live intent detection
  const liveIntent = rawPrompt.length > 5
    ? optimizePrompt(rawPrompt, agentsFile || undefined).intent
    : null;

  const localizedImprovements = useMemo(
    () => (result ? getImprovements(locale, result.improvements) : []),
    [locale, result]
  );

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
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20">
                <Zap size={14} className="text-cyan" />
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

          {/* Live Intent Badge */}
          {liveIntent && liveIntent.type !== 'unknown' && (
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-[#8B92A8]" />
                <span className="text-xs text-[#8B92A8]">{t('detectedLabel')}</span>
              </div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-heading font-medium"
                style={{
                  backgroundColor: intentLabels[liveIntent.type].bg,
                  color: intentLabels[liveIntent.type].color,
                }}
              >
                {intentLabels[liveIntent.type].label}
                <span className="opacity-60">({Math.round(liveIntent.confidence * 100)}%)</span>
              </div>
              {liveIntent.keywords.length > 0 && (
                <span className="text-xs text-[#8B92A8]/60">
                  {t('detectedFrom')} {liveIntent.keywords.slice(0, 3).join(', ')}
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* INPUT COLUMN */}
            <div className="space-y-6">
              {/* Raw Prompt Input */}
              <div className="p-6 rounded-xl bg-surface/50 border border-white/5">
                <label className="flex items-center gap-2 font-heading text-sm font-semibold text-[#F0F2F5] mb-3">
                  <FileCode size={16} className="text-cyan" />
                  {t('yourPromptLabel')}
                </label>
                <textarea
                  value={rawPrompt}
                  onChange={(e) => setRawPrompt(e.target.value)}
                  placeholder={t('yourPromptPlaceholder')}
                  className="w-full h-48 px-4 py-3 bg-[#0B0C10] border border-white/10 rounded-xl text-[#F0F2F5] placeholder-[#8B92A8]/40 focus:outline-none focus:border-cyan/40 transition-colors resize-none font-mono text-sm"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[#8B92A8]">
                    {t('chars', { count: rawPrompt.length })} · {t('tokens', { count: Math.round(rawPrompt.length / 4) })}
                  </span>
                  {rawPrompt && (
                    <button
                      onClick={() => setRawPrompt('')}
                      className="text-xs text-[#8B92A8] hover:text-red-400 transition-colors"
                    >
                      {t('clear')}
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Options */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-[#8B92A8] hover:text-cyan transition-colors"
                >
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {t('advancedOptions')}
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4">
                    {/* Context Textarea */}
                    <div className="p-5 rounded-xl bg-surface/30 border border-white/5">
                      <label className="flex items-center gap-2 font-heading text-sm font-semibold text-[#F0F2F5] mb-2">
                        <Layers size={14} className="text-purple-code" />
                        {t('additionalContextLabel')}
                      </label>
                      <p className="text-xs text-[#8B92A8] mb-3">
                        {t('additionalContextHint')}
                      </p>
                      <textarea
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder={t('additionalContextPlaceholder')}
                        className="w-full h-32 px-4 py-3 bg-[#0B0C10] border border-white/10 rounded-xl text-[#F0F2F5] placeholder-[#8B92A8]/40 focus:outline-none focus:border-cyan/40 transition-colors resize-none font-mono text-sm"
                      />
                    </div>

                    {/* AGENTS.md Upload */}
                    <div className="p-5 rounded-xl bg-surface/30 border border-white/5">
                      <label className="flex items-center gap-2 font-heading text-sm font-semibold text-[#F0F2F5] mb-2">
                        <Upload size={14} className="text-mint-code" />
                        {t('uploadAgentsLabel')}
                      </label>
                      <p className="text-xs text-[#8B92A8] mb-3">
                        {t('uploadAgentsHint')}
                      </p>

                      {!agentsFile ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-cyan/30 transition-colors"
                        >
                          <Upload size={24} className="mx-auto text-[#8B92A8] mb-2" />
                          <p className="text-sm text-[#8B92A8]">{t('uploadAgentsClick')}</p>
                          <p className="text-xs text-[#8B92A8]/60 mt-1">{t('uploadAgentsDrag')}</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".md,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-mint-code/10 border border-mint-code/20">
                          <div className="flex items-center gap-2">
                            <Check size={14} className="text-mint-code" />
                            <span className="text-sm text-mint-code font-heading">{t('agentsLoaded')}</span>
                          </div>
                          <button
                            onClick={clearAgentsFile}
                            className="p-1 rounded hover:bg-white/5 transition-colors"
                          >
                            <X size={14} className="text-[#8B92A8]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Optimize Button */}
              <button
                onClick={handleOptimize}
                disabled={!rawPrompt.trim()}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-heading font-semibold text-lg transition-all ${
                  rawPrompt.trim()
                    ? 'bg-gradient-to-r from-cyan to-purple-code text-[#0B0C10] hover:shadow-lg hover:shadow-cyan/20'
                    : 'bg-surface text-[#8B92A8] cursor-not-allowed'
                }`}
              >
                <Wand2 size={20} />
                {t('optimizeButton')}
              </button>
            </div>

            {/* RESULT COLUMN */}
            <div ref={resultRef}>
              {!result ? (
                <div className="h-full flex flex-col items-center justify-center p-12 rounded-xl bg-surface/30 border border-white/5 border-dashed">
                  <Sparkles size={48} className="text-[#8B92A8]/20 mb-4" />
                  <p className="text-[#8B92A8] text-center">
                    {t('emptyStateTitle', { highlight: t('emptyStateHighlight') })}
                  </p>
                  <div className="mt-6 space-y-2 text-xs text-[#8B92A8]/60">
                    <p>{t('example1')}</p>
                    <p>{t('example2')}</p>
                    <p>{t('example3')}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Intent & Stats */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-heading font-medium"
                      style={{
                        backgroundColor: intentLabels[result.intent.type].bg,
                        color: intentLabels[result.intent.type].color,
                      }}
                    >
                      <Target size={12} />
                      {intentLabels[result.intent.type].label}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#8B92A8]">
                      <TrendingUp size={12} />
                      {plural(result.improvements.length, {
                        one: t('improvementsCount_one', { count: result.improvements.length }),
                        other: t('improvementsCount_other', { count: result.improvements.length }),
                      })}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#8B92A8]">
                      <Zap size={12} />
                      {t('estimatedTokens', { count: result.tokenEstimate })}
                    </div>
                  </div>

                  {/* Optimized Prompt */}
                  <div className="rounded-xl border border-cyan/20 overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-cyan/5 border-b border-cyan/10">
                      <div className="flex items-center gap-2">
                        <Wand2 size={14} className="text-cyan" />
                        <span className="font-mono text-xs text-[#F0F2F5]">
                          {t('optimizedPromptLabel')}
                        </span>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan text-xs hover:bg-cyan/20 transition-colors"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? t('copied') : t('copy')}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 bg-[#0B0C10] max-h-[50vh] overflow-y-auto">
                      <pre className="font-mono text-sm text-[#C792EA] whitespace-pre-wrap leading-relaxed">
                        {result.optimized}
                      </pre>
                    </div>
                  </div>

                  {/* Improvements List */}
                  <div className="p-5 rounded-xl bg-surface/30 border border-white/5">
                    <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#F0F2F5] mb-3">
                      <TrendingUp size={14} className="text-mint-code" />
                      {t('improvementsApplied')}
                    </h3>
                    <ul className="space-y-2">
                      {localizedImprovements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#8B92A8]">
                          <Check size={12} className="text-mint-code mt-0.5 flex-shrink-0" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Before / After Comparison */}
                  <div className="p-5 rounded-xl bg-surface/30 border border-white/5">
                    <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#F0F2F5] mb-3">
                      <AlertCircle size={14} className="text-cyan" />
                      {t('beforeVsAfter')}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-[#8B92A8] mb-1">{t('originalLabel')}</div>
                        <div className="p-3 rounded-lg bg-[#0B0C10] border border-white/5">
                          <p className="text-xs text-[#8B92A8] line-clamp-6">{result.original}</p>
                        </div>
                        <div className="text-xs text-[#8B92A8]/60 mt-1">
                          {t('tokens', { count: Math.round(result.original.length / 4) })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-cyan mb-1">{t('optimizedLabel')}</div>
                        <div className="p-3 rounded-lg bg-[#0B0C10] border border-cyan/10">
                          <p className="text-xs text-[#C792EA] line-clamp-6">{result.optimized}</p>
                        </div>
                        <div className="text-xs text-cyan/60 mt-1">
                          {t('estimatedTokens', { count: result.tokenEstimate })}
                          <span className="text-mint-code ml-1">
                            {t('moreContext', {
                              percent: Math.round(
                                (result.tokenEstimate / Math.max(result.original.length / 4, 1) - 1) * 100
                              ),
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sections Breakdown */}
                  {result.sections.length > 0 && (
                    <div className="p-5 rounded-xl bg-surface/30 border border-white/5">
                      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#F0F2F5] mb-3">
                        <Layers size={14} className="text-purple-code" />
                        {t('structure')}
                      </h3>
                      <div className="space-y-2">
                        {result.sections.map((section, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-cyan text-xs font-heading">{i + 1}</span>
                            </div>
                            <span className="text-xs text-[#F0F2F5] font-heading">
                              {sectionTitles[section.title] ?? section.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-cyan/5 to-purple-code/5 border border-cyan/10">
            <h2 className="font-heading text-xl font-semibold text-[#F0F2F5] mb-6">
              {t('howItWorksTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Step
                number="1"
                title={t('step1Title')}
                description={t('step1Description')}
              />
              <Step
                number="2"
                title={t('step2Title')}
                description={t('step2Description')}
              />
              <Step
                number="3"
                title={t('step3Title')}
                description={t('step3Description')}
              />
              <Step
                number="4"
                title={t('step4Title')}
                description={t('step4Description')}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0">
        <span className="text-cyan font-heading text-sm font-bold">{number}</span>
      </div>
      <div>
        <h4 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-1">{title}</h4>
        <p className="text-xs text-[#8B92A8]">{description}</p>
      </div>
    </div>
  );
}
