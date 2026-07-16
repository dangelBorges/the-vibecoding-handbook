import { useRef, useEffect, useState } from 'react';
import { MessageSquare, Cpu, ShieldCheck, RefreshCw } from 'lucide-react';
import { useNamespace } from '../i18n/useNamespace';
import workflow from '../i18n/translations/workflow';
import WorkflowConstellation from '../components/WorkflowConstellation';

export default function WorkflowSection() {
  const { t } = useNamespace(workflow);
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  const steps = [
    {
      number: '01',
      title: t('step1Title'),
      description: t('step1Description'),
      icon: MessageSquare,
      color: '#58A6B2',
    },
    {
      number: '02',
      title: t('step2Title'),
      description: t('step2Description'),
      icon: Cpu,
      color: '#C792EA',
    },
    {
      number: '03',
      title: t('step3Title'),
      description: t('step3Description'),
      icon: ShieldCheck,
      color: '#C3E88D',
    },
    {
      number: '04',
      title: t('step4Title'),
      description: t('step4Description'),
      icon: RefreshCw,
      color: '#58A6B2',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards((prev) => [...new Set([...prev, idx])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll('.workflow-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-40 md:py-60 overflow-hidden"
      style={{ background: '#0B0C10' }}
    >
      {/* Canvas Background */}
      <WorkflowConstellation />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2
            className="font-display text-[#F0F2F5] uppercase"
            style={{ fontSize: 'clamp(32px, 6vw, 80px)' }}
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-cyan font-heading text-lg md:text-xl tracking-wide">
            {t('subtitle')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isVisible = visibleCards.includes(index);
            return (
              <div
                key={step.number}
                data-index={index}
                className={`workflow-card group relative p-8 md:p-10 rounded-xl bg-surface card-shadow border-t-2 transition-all duration-700 hover:card-shadow-hover hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  borderTopColor: step.color,
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {/* Step Number */}
                <div
                  className="text-5xl md:text-6xl font-display font-bold opacity-20 mb-4"
                  style={{ color: step.color }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <Icon size={20} style={{ color: step.color }} />
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-semibold text-[#F0F2F5] mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[#8B92A8] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
