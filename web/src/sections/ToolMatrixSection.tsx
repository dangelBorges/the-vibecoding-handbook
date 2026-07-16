import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNamespace } from '../i18n/useNamespace';
import toolMatrix from '../i18n/translations/toolMatrix';
import VerticalLoopScroll from '../components/VerticalLoopScroll';

const tools = [
  'Cursor',
  'Claude Code',
  'Windsurf',
  'v0',
  'Lovable',
  'Replit Agent',
  'Zed',
  'Aider',
  'Bolt',
  'GitHub Copilot',
];

export default function ToolMatrixSection() {
  const { t } = useNamespace(toolMatrix);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Column - Text */}
          <div
            className={`lg:w-2/5 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 mb-6">
              <Sparkles size={14} className="text-cyan" />
              <span className="text-cyan text-xs font-heading">{t('badge')}</span>
            </div>

            <h2
              className="font-display text-[#F0F2F5] uppercase leading-[0.95]"
              style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
            >
              {t('titleLine1')}
              <br />
              <span className="text-gradient-cyan">{t('titleLine2')}</span>
            </h2>

            <p className="mt-6 text-[#8B92A8] text-base leading-relaxed max-w-md">
              {t('description')}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
                  <span className="text-cyan text-sm font-heading font-bold">10</span>
                </div>
                <span className="text-[#8B92A8] text-sm">{t('toolsCompared')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-code/10 flex items-center justify-center">
                  <span className="text-purple-code text-sm font-heading font-bold">6</span>
                </div>
                <span className="text-[#8B92A8] text-sm">{t('categories')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-mint-code/10 flex items-center justify-center">
                  <span className="text-mint-code text-sm font-heading font-bold">3</span>
                </div>
                <span className="text-[#8B92A8] text-sm">{t('skillLevels')}</span>
              </div>
            </div>

            <Link
              to="/tools"
              className="group mt-8 inline-flex items-center gap-2 px-6 py-3 bg-cyan text-[#0B0C10] font-heading font-semibold rounded-full hover:bg-cyan/90 transition-all duration-300"
            >
              {t('cta')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Column - Loop Scroll */}
          <div
            className={`lg:w-3/5 w-full transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <VerticalLoopScroll items={tools} />
          </div>
        </div>
      </div>
    </section>
  );
}
