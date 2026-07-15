import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  BookOpen,
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

const features = [
  {
    icon: Terminal,
    title: 'CLI Tool',
    description: 'npm install -g @vibecoding/cli. Run vibe init, vibe check, vibe context, and vibe optimize from your terminal.',
    href: 'https://github.com/dangelBorges/the-vibecoding-handbook/tree/main/cli',
    color: '#58A6B2',
  },
  {
    icon: Wand2,
    title: 'Project Wizard',
    description: 'Answer a few questions and get a complete governance setup: AGENTS.md, .cursorrules, Git policy, Security policy, and more.',
    href: '/wizard',
    color: '#58A6B2',
  },
  {
    icon: BookOpen,
    title: '10+ Chapters',
    description: 'From fundamentals to advanced multi-agent workflows. Structured guides covering every aspect of vibe coding.',
    href: '/docs',
    color: '#58A6B2',
  },
  {
    icon: MessageSquareCode,
    title: '50+ Prompts',
    description: 'Copy-paste prompts for features, bugfixes, refactors, tests, and documentation. Filtered by tool and stack.',
    href: '/prompts',
    color: '#C792EA',
  },
  {
    icon: Wrench,
    title: 'Tool Comparisons',
    description: 'Honest, detailed comparisons of Cursor, Claude Code, Windsurf, v0, and more. Matched to your skill level.',
    href: '/tools',
    color: '#C3E88D',
  },
  {
    icon: FileDown,
    title: 'Templates',
    description: 'Download AGENTS.md, .cursorrules, project starters, and checklists. Ready to drop into your repo.',
    href: '/templates',
    color: '#58A6B2',
  },
  {
    icon: CheckCircle,
    title: 'Production Checklists',
    description: 'Security gates, review checklists, and deployment guides. Ship AI-generated code with confidence.',
    href: '/docs',
    color: '#C792EA',
  },
  {
    icon: Globe,
    title: 'English + Español',
    description: 'Full i18n support from day one. The guide is available in both English and Spanish.',
    href: '/docs',
    color: '#C3E88D',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
            <span className="text-cyan text-xs font-heading">What&apos;s Inside</span>
          </div>
          <h2
            className="font-display text-[#F0F2F5] uppercase"
            style={{ fontSize: 'clamp(28px, 5vw, 64px)' }}
          >
            Everything You Need
          </h2>
          <p className="mt-4 text-[#8B92A8] max-w-2xl mx-auto">
            A complete toolkit for AI-first development. From your first prompt 
            to production deployment.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => {
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
                  <span>Explore</span>
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
