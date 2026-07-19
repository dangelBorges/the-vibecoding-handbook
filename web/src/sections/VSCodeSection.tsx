import { useRef, useEffect, useState } from 'react';
import {
  Code2,
  ArrowRight,
  Puzzle,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Wand2,
  BookOpen,
  Rocket,
  Eye,
  MessagesSquare,
} from 'lucide-react';
import { useNamespace } from '../i18n/useNamespace';
import vscode from '../i18n/translations/vscode';

export default function VSCodeSection() {
  const { t } = useNamespace(vscode);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    { icon: Puzzle, label: t('feature1Label'), desc: t('feature1Desc') },
    { icon: ShieldCheck, label: t('feature2Label'), desc: t('feature2Desc') },
    { icon: Sparkles, label: t('feature3Label'), desc: t('feature3Desc') },
    { icon: RefreshCw, label: t('feature4Label'), desc: t('feature4Desc') },
    { icon: Wand2, label: t('feature5Label'), desc: t('feature5Desc') },
    { icon: BookOpen, label: t('feature6Label'), desc: t('feature6Desc') },
    { icon: Rocket, label: t('feature7Label'), desc: t('feature7Desc') },
    { icon: Eye, label: t('feature8Label'), desc: t('feature8Desc') },
    { icon: MessagesSquare, label: t('feature9Label'), desc: t('feature9Desc') },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
      style={{ background: '#0B0C10' }}
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-code/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Left: Mockup */}
          <div
            className={`lg:w-3/5 w-full transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0B0C10] card-shadow">
              {/* VS Code header */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1e1e1e] border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="ml-3 text-[10px] text-[#8B92A8]">VS Code — project-name</span>
              </div>

              <div className="flex" style={{ height: 360 }}>
                {/* Activity bar */}
                <div className="w-10 bg-[#181818] flex flex-col items-center py-3 gap-4">
                  <div className="w-6 h-6 rounded flex items-center justify-center text-[#8B92A8]"><Code2 size={16} /></div>
                  <div className="w-6 h-6 rounded flex items-center justify-center text-[#8B92A8]"><BookOpen size={16} /></div>
                  <div className="w-6 h-6 rounded bg-cyan/20 flex items-center justify-center text-cyan"><Sparkles size={16} /></div>
                  <div className="w-6 h-6 rounded flex items-center justify-center text-[#8B92A8]"><Puzzle size={16} /></div>
                </div>

                {/* Sidebar — Vibe Coding panel */}
                <div className="w-48 bg-[#181818] border-r border-white/5 flex flex-col">
                  <div className="px-3 py-2 text-[10px] font-semibold text-[#8B92A8] uppercase tracking-wider">{t('panelTitle')}</div>

                  <div className="px-2 py-1.5 mx-2 rounded bg-white/5">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#F0F2F5]">
                      <ShieldCheck size={12} className="text-cyan" />
                      {t('policies')}
                    </div>
                    <div className="ml-5 mt-1 space-y-0.5">
                      <div className="text-[10px] text-[#8B92A8]">{t('gitPolicy')}</div>
                      <div className="text-[10px] text-[#8B92A8]">{t('security')}</div>
                      <div className="text-[10px] text-[#8B92A8]">{t('testing')}</div>
                    </div>
                  </div>

                  <div className="px-2 py-1.5 mx-2 mt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#F0F2F5]">
                      <BookOpen size={12} className="text-purple-code" />
                      {t('decisions')}
                    </div>
                    <div className="ml-5 mt-1">
                      <div className="text-[10px] text-[#8B92A8]">{t('adr001')}</div>
                    </div>
                  </div>

                  <div className="px-2 py-1.5 mx-2 mt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#F0F2F5]">
                      <Puzzle size={12} className="text-mint-code" />
                      {t('stack')}
                    </div>
                    <div className="ml-5 mt-1 space-y-0.5">
                      <div className="text-[10px] text-[#8B92A8]">Next.js</div>
                      <div className="text-[10px] text-[#8B92A8]">TypeScript</div>
                      <div className="text-[10px] text-[#8B92A8]">Supabase</div>
                    </div>
                  </div>

                  <div className="mt-auto p-2">
                    <div className="text-[9px] text-[#8B92A8] bg-cyan/10 rounded px-2 py-1 text-center">
                      {t('score')} <span className="text-cyan font-semibold">{t('scoreValue')}</span>
                    </div>
                  </div>
                </div>

                {/* Main editor area */}
                <div className="flex-1 bg-[#1e1e1e] p-4">
                  <div className="text-[11px] text-[#8B92A8] mb-2">{t('fileName')}</div>
                  <div className="font-mono text-[10px] text-[#C792EA] space-y-0.5 opacity-80">
                    <div><span className="text-[#8B92A8]">#</span> {t('projectContext')}</div>
                    <div><span className="text-[#8B92A8]">##</span> {t('techStack')}</div>
                    <div className="pl-3 text-[#F0F2F5]">| Framework | Next.js |</div>
                    <div className="pl-3 text-[#F0F2F5]">| Language | TypeScript |</div>
                    <div className="pl-3 text-[#F0F2F5]">| Database | Supabase |</div>
                    <div><span className="text-[#8B92A8]">##</span> {t('codingStandards')}</div>
                    <div className="pl-3 text-[#F0F2F5]">- Strict mode enabled</div>
                    <div className="pl-3 text-[#F0F2F5]">- Named exports preferred</div>
                    <div><span className="text-[#8B92A8]">##</span> {t('securityRules')}</div>
                    <div className="pl-3 text-[#F0F2F5]">- Input validation on ALL inputs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div
            className={`lg:w-2/5 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-code/10 border border-purple-code/20 mb-6">
              <Code2 size={14} className="text-purple-code" />
              <span className="text-purple-code text-xs font-heading">{t('badge')}</span>
            </div>

            <h2
              className="font-display text-[#F0F2F5] uppercase leading-[0.95]"
              style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}
            >
              {t('titleLine1')}
              <br />
              <span className="text-gradient-cyan">{t('titleLine2')}</span>
            </h2>

            <p className="mt-6 text-[#8B92A8] leading-relaxed">
              {t('description')}
            </p>

            {/* Feature grid */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-start gap-2.5 p-3 rounded-lg bg-surface/30 border border-white/5">
                    <Icon size={16} className="text-cyan mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-heading text-[#F0F2F5]">{f.label}</div>
                      <div className="text-[10px] text-[#8B92A8]">{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="https://marketplace.visualstudio.com/items?itemName=TheVibecoder.the-vibecoding-handbook"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2 text-cyan font-heading text-sm hover:underline"
            >
              {t('viewSource')}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
