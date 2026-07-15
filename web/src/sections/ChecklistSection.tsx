import { useRef, useEffect, useState } from 'react';
import { Check, Shield, Lock, FileSearch, Users, Terminal, AlertOctagon } from 'lucide-react';

const checklistItems = [
  {
    id: 'secrets',
    title: 'Secrets Detection',
    description: 'Scan for API keys, tokens, and credentials in generated code',
    icon: Lock,
    checked: false,
  },
  {
    id: 'dependencies',
    title: 'Dependency Audit',
    description: 'Review all new packages for known vulnerabilities',
    icon: FileSearch,
    checked: false,
  },
  {
    id: 'auth',
    title: 'Human-in-the-loop',
    description: 'Manual review for auth, payments, and PII handling',
    icon: Users,
    checked: false,
  },
  {
    id: 'owasp',
    title: 'OWASP Compliance',
    description: 'Verify against top 10 web application security risks',
    icon: Shield,
    checked: false,
  },
  {
    id: 'tests',
    title: 'Test Coverage',
    description: 'Ensure generated code has adequate unit and integration tests',
    icon: Terminal,
    checked: false,
  },
  {
    id: 'architecture',
    title: 'Architecture Review',
    description: 'Verify consistency with existing patterns and conventions',
    icon: AlertOctagon,
    checked: false,
  },
];

export default function ChecklistSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleItem = (id: string, e: React.MouseEvent) => {
    const newChecked = new Set(checked);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setBurstPos({ x: rect.left + rect.width / 2, y: rect.top });
      setTimeout(() => setBurstPos(null), 600);
    }
    setChecked(newChecked);
  };

  const progress = Math.round((checked.size / checklistItems.length) * 100);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
      style={{ background: '#0B0C10' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column - Checklist */}
          <div
            className={`lg:w-3/5 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2
              className="font-display text-[#F0F2F5] uppercase mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}
            >
              Ship With
              <br />
              <span className="text-gradient-cyan">Confidence</span>
            </h2>

            <p className="text-[#8B92A8] mb-8 max-w-lg">
              Before merging AI-generated code, run through this production checklist. 
              Each item represents a critical security or quality gate.
            </p>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#8B92A8] font-heading">Checklist Progress</span>
                <span className="text-xs text-cyan font-heading">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan to-purple-code rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {checklistItems.map((item, index) => {
                const Icon = item.icon;
                const isChecked = checked.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-500 cursor-pointer ${
                      isChecked
                        ? 'bg-cyan/5 border-cyan/30'
                        : 'bg-surface/50 border-white/5 hover:border-white/10'
                    } ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                    onClick={(e) => toggleItem(item.id, e)}
                  >
                    {/* Checkbox */}
                    <div
                      className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isChecked
                          ? 'bg-cyan border-cyan'
                          : 'border-[#8B92A8]/30 group-hover:border-cyan/50'
                      }`}
                    >
                      {isChecked && <Check size={14} className="text-[#0B0C10]" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={isChecked ? 'text-cyan' : 'text-[#8B92A8]'} />
                        <h4 className={`font-heading text-sm font-semibold transition-colors ${
                          isChecked ? 'text-cyan line-through' : 'text-[#F0F2F5]'
                        }`}>
                          {item.title}
                        </h4>
                      </div>
                      <p className={`text-xs mt-1 transition-colors ${
                        isChecked ? 'text-cyan/60' : 'text-[#8B92A8]'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div
            className={`lg:w-2/5 flex items-center justify-center transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative">
              {/* Shield SVG */}
              <svg
                viewBox="0 0 200 240"
                className="w-64 h-80 md:w-80 md:h-96"
                fill="none"
              >
                {/* Shield outline */}
                <path
                  d="M100 10 L180 50 V120 C180 170 100 220 100 220 C100 220 20 170 20 120 V50 Z"
                  stroke="#58A6B2"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.3"
                />
                {/* Inner shield */}
                <path
                  d="M100 30 L160 60 V115 C160 155 100 195 100 195 C100 195 40 155 40 115 V60 Z"
                  stroke="#58A6B2"
                  strokeWidth="1"
                  fill="rgba(88, 166, 178, 0.05)"
                  opacity="0.5"
                />
                {/* Checkmark */}
                <path
                  d="M70 110 L90 130 L130 80"
                  stroke={progress === 100 ? '#58A6B2' : '#8B92A8'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="transition-all duration-500"
                  style={{
                    filter: progress === 100 ? 'drop-shadow(0 0 8px rgba(88, 166, 178, 0.6))' : 'none',
                  }}
                />
                {/* Decorative lines */}
                <line x1="60" y1="40" x2="80" y2="55" stroke="#58A6B2" strokeWidth="1" opacity="0.2" />
                <line x1="140" y1="40" x2="120" y2="55" stroke="#58A6B2" strokeWidth="1" opacity="0.2" />
                <circle cx="100" cy="105" r="45" stroke="#58A6B2" strokeWidth="0.5" opacity="0.1" />
              </svg>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-surface border border-cyan/20 text-cyan text-xs font-heading animate-pulse">
                {progress === 100 ? 'Ready to ship!' : `${checked.size}/${checklistItems.length} checked`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Particle burst effect */}
      {burstPos && (
        <div
          className="fixed pointer-events-none z-50"
          style={{ left: burstPos.x, top: burstPos.y }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-cyan"
              style={{
                animation: `burst 0.6s ease-out forwards`,
                animationDelay: `${i * 0.05}s`,
                transform: `rotate(${i * 60}deg)`,
              }}
            />
          ))}
          <style>{`
            @keyframes burst {
              0% { transform: translate(0, 0) scale(1); opacity: 1; }
              100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </section>
  );
}
