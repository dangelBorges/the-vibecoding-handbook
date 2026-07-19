import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  BookOpen,
  Code2,
  MessageSquareCode,
  Wrench,
  FileDown,
  CheckCircle,
  Globe,
  ArrowRight,
  Sparkles,
  Wand2,
  Terminal,
} from 'lucide-react';
import { useNamespace } from '../i18n/useNamespace';
import features from '../i18n/translations/features';

export default function FeaturesSection() {
  const { t } = useNamespace(features);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const items = [
    {
      icon: Terminal,
      title: t('cliTitle'),
      description: t('cliDescription'),
      href: 'https://github.com/dangelBorges/the-vibecoding-handbook/tree/main/cli',
      color: '#58A6B2',
    },
    {
      icon: Code2,
      title: t('vscodeTitle'),
      description: t('vscodeDescription'),
      href: 'https://marketplace.visualstudio.com/items?itemName=TheVibecoder.the-vibecoding-handbook',
      color: '#58A6B2',
    },
    {
      icon: Wand2,
      title: t('wizardTitle'),
      description: t('wizardDescription'),
      href: '/wizard',
      color: '#58A6B2',
    },
    {
      icon: BookOpen,
      title: t('chaptersTitle'),
      description: t('chaptersDescription'),
      href: '/docs',
      color: '#58A6B2',
    },
    {
      icon: MessageSquareCode,
      title: t('promptsTitle'),
      description: t('promptsDescription'),
      href: '/prompts',
      color: '#C792EA',
    },
    {
      icon: Wrench,
      title: t('toolsTitle'),
      description: t('toolsDescription'),
      href: '/tools',
      color: '#C3E88D',
    },
    {
      icon: FileDown,
      title: t('templatesTitle'),
      description: t('templatesDescription'),
      href: '/templates',
      color: '#58A6B2',
    },
    {
      icon: CheckCircle,
      title: t('checklistsTitle'),
      description: t('checklistsDescription'),
      href: '/docs',
      color: '#C792EA',
    },
    {
      icon: Globe,
      title: t('i18nTitle'),
      description: t('i18nDescription'),
      href: '/docs',
      color: '#C3E88D',
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
      className="relative py-32 md:py-40 overflow-hidden"
      style={{ background: '#0B0C10' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 mb-6">
            <Sparkles size={14} className="text-cyan" />
            <span className="text-cyan text-xs font-heading">{t('badge')}</span>
          </div>
          <h2
            className="font-display text-[#F0F2F5] uppercase"
            style={{ fontSize: 'clamp(28px, 5vw, 64px)' }}
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-[#8B92A8] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.href}
                className={`group relative p-8 rounded-xl bg-surface/50 card-shadow border border-white/5 transition-all duration-700 hover:card-shadow-hover hover:-translate-y-1 hover:bg-surface ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}10` }}
                >
                  <Icon size={24} style={{ color: feature.color }} />
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-semibold text-[#F0F2F5] mb-2 group-hover:text-cyan transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#8B92A8] text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Link arrow */}
                <div className="flex items-center gap-1 text-cyan text-sm font-heading opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{t('explore')}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
