import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FileCode, Brain, Layers, AlertTriangle, Zap, ArrowRight } from 'lucide-react';
import { useNamespace } from '../i18n/useNamespace';
import contextEngineering from '../i18n/translations/contextEngineering';

export default function ContextEngineeringSection() {
  const { t } = useNamespace(contextEngineering);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const strategies = [
    {
      title: t('strategy1Title'),
      description: t('strategy1Description'),
      icon: FileCode,
      color: '#58A6B2',
      tag: t('strategy1Tag'),
    },
    {
      title: t('strategy2Title'),
      description: t('strategy2Description'),
      icon: Zap,
      color: '#C792EA',
      tag: t('strategy2Tag'),
    },
    {
      title: t('strategy3Title'),
      description: t('strategy3Description'),
      icon: Brain,
      color: '#C3E88D',
      tag: t('strategy3Tag'),
    },
    {
      title: t('strategy4Title'),
      description: t('strategy4Description'),
      icon: Layers,
      color: '#58A6B2',
      tag: t('strategy4Tag'),
    },
    {
      title: t('strategy5Title'),
      description: t('strategy5Description'),
      icon: AlertTriangle,
      color: '#ef4444',
      tag: t('strategy5Tag'),
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B0C10 0%, #0f1118 50%, #0B0C10 100%)' }}
    >
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2
            className="font-display text-[#F0F2F5] uppercase"
            style={{ fontSize: 'clamp(28px, 5vw, 72px)' }}
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-cyan font-heading text-lg">
            {t('subtitle')}
          </p>
          <p className="mt-4 text-[#8B92A8] max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {strategies.map((strategy, index) => {
            const Icon = strategy.icon;
            return (
              <div
                key={strategy.title}
                className={`group relative p-8 rounded-xl bg-surface/80 card-shadow border border-white/5 transition-all duration-700 hover:card-shadow-hover hover:-translate-y-1 hover:border-cyan/20 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${index === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Tag */}
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-heading mb-4"
                  style={{
                    backgroundColor: `${strategy.color}15`,
                    color: strategy.color,
                  }}
                >
                  {strategy.tag}
                </span>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${strategy.color}10` }}
                >
                  <Icon size={24} style={{ color: strategy.color }} />
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-semibold text-[#F0F2F5] mb-2">
                  {strategy.title}
                </h3>

                {/* Description */}
                <p className="text-[#8B92A8] text-sm leading-relaxed">
                  {strategy.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/docs"
            className="group inline-flex items-center gap-2 px-6 py-3 border border-cyan/40 text-cyan font-heading rounded-full hover:bg-cyan/10 hover:border-cyan transition-all duration-300"
          >
            {t('cta')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
