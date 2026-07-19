import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Wand2, ChevronDown, Code2, Terminal } from 'lucide-react';
import { useNamespace } from '../i18n/useNamespace';
import hero from '../i18n/translations/hero';
import NeuralAurora from '../components/NeuralAurora';

export default function HeroSection() {
  const { t } = useNamespace(hero);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setScrollY(Math.max(0, -rect.top));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = Math.max(0, 1 - scrollY / 600);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-end overflow-hidden"
      style={{ background: '#0B0C10' }}
    >
      {/* WebGL Background */}
      <NeuralAurora />

      {/* Content */}
      <div
        className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-24"
        style={{ opacity, transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/20">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="text-cyan text-xs font-heading font-medium tracking-wide">
              {t('badge')}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display text-[#F0F2F5] uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(36px, 8vw, 120px)' }}
          >
            {t('titleLine1')}
            <br />
            {t('titleLine2')}
            <br />
            <span className="text-gradient-cyan">{t('titleLine3')}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 md:mt-8 text-[#8B92A8] text-lg md:text-xl max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap gap-3">
            {/* Primary CTA */}
            <Link
              to="/wizard"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 bg-cyan text-[#0B0C10] font-heading font-semibold rounded-full hover:bg-cyan/90 hover:glow-cyan-strong transition-all duration-300"
            >
              <Wand2 size={16} />
              {t('launchWizard')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* VS Code Extension */}
            <a
              href="https://marketplace.visualstudio.com/items?itemName=TheVibecoder.the-vibecoding-handbook"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 border border-purple-code/30 text-purple-code font-heading rounded-full hover:border-purple-code/60 hover:bg-purple-code/10 transition-all duration-300"
            >
              <Code2 size={16} />
              {t('installVsCodeExtension')}
            </a>

            {/* CLI */}
            <button
              onClick={() => document.getElementById('cli-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 border border-mint-code/30 text-mint-code font-heading rounded-full hover:border-mint-code/60 hover:bg-mint-code/10 transition-all duration-300 cursor-pointer"
            >
              <Terminal size={16} />
              {t('installCli')}
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 md:mt-16 flex gap-8 md:gap-12">
            <div>
              <div className="text-2xl md:text-3xl font-heading font-bold text-[#F0F2F5]">10+</div>
              <div className="text-xs text-[#8B92A8] mt-1">{t('chapters')}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-heading font-bold text-[#F0F2F5]">50+</div>
              <div className="text-xs text-[#8B92A8] mt-1">{t('prompts')}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-heading font-bold text-[#F0F2F5]">50+</div>
              <div className="text-xs text-[#8B92A8] mt-1">{t('pages')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
      >
        <span className="text-[#8B92A8] text-xs tracking-widest uppercase">{t('scroll')}</span>
        <ChevronDown size={20} className="text-[#8B92A8] animate-bounce" />
      </div>
    </section>
  );
}
