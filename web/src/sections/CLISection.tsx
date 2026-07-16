import { useRef, useEffect, useState } from 'react';
import { Terminal, ArrowRight, Copy, Check, Zap, Sparkles } from 'lucide-react';
import { useNamespace } from '../i18n/useNamespace';
import cli from '../i18n/translations/cli';

export default function CLISection() {
  const { t } = useNamespace(cli);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(t('command'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = t('command');
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="cli-section"
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B0C10 0%, #0d1018 50%, #0B0C10 100%)' }}
    >
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <div
            className={`lg:w-1/2 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 mb-6">
              <Terminal size={14} className="text-cyan" />
              <span className="text-cyan text-xs font-heading">{t('badge')}</span>
            </div>

            <h2
              className="font-display text-[#F0F2F5] uppercase leading-[0.95]"
              style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}
            >
              {t('titleLine1')}
              <br />
              <span className="text-gradient-cyan">{t('titleLine2')}</span>
            </h2>

            <p className="mt-6 text-[#8B92A8] leading-relaxed max-w-md">
              {t('description')}
            </p>

            {/* Feature badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['vibe init', 'vibe context --auto', 'vibe review', 'vibe optimize', 'vibe chat', 'vibe check', 'vibe sync'].map((cmd) => (
                <span
                  key={cmd}
                  className="px-2.5 py-1 rounded-md bg-surface border border-white/5 text-[#8B92A8] text-xs font-mono"
                >
                  {cmd}
                </span>
              ))}
            </div>

            {/* Install command */}
            <div className="mt-8">
              <div className="flex items-center gap-2 text-xs text-[#8B92A8] mb-2">
                <Zap size={12} />
                <span>{t('installLabel')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-4 rounded-xl bg-[#0B0C10] border border-cyan/20 font-mono text-sm text-cyan">
                  {t('command')}
                </div>
                <button
                  onClick={handleCopy}
                  className="p-3 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan/20 transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <a
              href="https://github.com/dangelBorges/the-vibecoding-handbook/tree/main/cli"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 text-cyan font-heading text-sm hover:underline"
            >
              {t('viewSource')}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Right: Terminal mockup */}
          <div
            className={`lg:w-1/2 w-full transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0B0C10] card-shadow">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-[#8B92A8] font-mono">{t('terminalTitle')}</span>
              </div>

              {/* Terminal content */}
              <div className="p-6 font-mono text-sm space-y-5">
                {/* Command 1: context --auto */}
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-purple" />
                    <span className="text-cyan">$</span>
                    <span className="text-[#F0F2F5]">vibe context --auto</span>
                  </div>
                  <div className="mt-1.5 pl-6 text-[#8B92A8] leading-relaxed">
                    <span className="text-purple dim-pulse">{t('scanning')}</span><br />
                    <span className="text-green-400">&#10003;</span> {t('detected')} Next.js + TypeScript<br />
                    <span className="text-green-400">&#10003;</span> {t('auth')}: NextAuth.js &nbsp;
                    <span className="text-green-400">&#10003;</span> {t('db')}: PostgreSQL (Prisma)<br />
                    <span className="text-green-400">&#10003;</span> {t('payments')}: Stripe &nbsp;
                    <span className="text-green-400">&#10003;</span> {t('tests')}: Vitest<br />
                    <span className="text-green-400">&#10003;</span> {t('updatedAgents')}<br />
                    <span className="text-green-400">&#10003;</span> {t('updatedIdeRules')}<br />
                    <span className="text-cyan">&#8594;</span> <span className="text-mint-code">{t('agentUnderstands')}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* Command 2: review */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan">$</span>
                    <span className="text-[#F0F2F5]">vibe review -s</span>
                  </div>
                  <div className="mt-1.5 pl-6 text-[#8B92A8] leading-relaxed">
                    {t('score')}: <span className="text-green-400">87%</span><br />
                    <span className="text-yellow-400">&#9888;</span> console.log at src/lib/auth.ts:42<br />
                    <span className="text-yellow-400">&#9888;</span> <span className="text-[#8B92A8]">`any` type at src/app/page.tsx:17</span><br />
                    <span className="text-cyan">&#8594;</span> {t('resultSummary')}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* Command 3: chat */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan">$</span>
                    <span className="text-[#F0F2F5]">vibe chat</span>
                  </div>
                  <div className="mt-1.5 pl-6 text-[#8B92A8] leading-relaxed">
                    <span className="text-purple">{t('chatDetected')}</span><br />
                    <span className="text-[#8B92A8]">{t('question1')}</span> <span className="text-[#F0F2F5]">create dashboard</span><br />
                    <span className="text-[#8B92A8]">{t('question2')}</span> <span className="text-[#F0F2F5]">sidebar, charts</span><br />
                    <span className="text-green-400">&#10003;</span> {t('planSaved')}<br />
                    <span className="text-green-400">&#10003;</span> {t('promptSaved')}<br />
                    <span className="text-cyan">&#8594;</span> <span className="text-mint-code">{t('pasteInstruction')}</span>
                  </div>
                </div>

                {/* Blinking cursor */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-cyan">$</span>
                  <span className="w-2 h-4 bg-cyan animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
