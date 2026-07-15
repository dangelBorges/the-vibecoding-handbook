import { useEffect, useState, useCallback } from 'react';
import { Github, Sparkles, X, ArrowRight } from 'lucide-react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export default function KonamiEasterEgg() {
  const [show, setShow] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (show) return;

    const nextSequence = [...sequence, e.key];
    // Keep only last N keys where N = konami code length
    const trimmed = nextSequence.slice(-KONAMI_CODE.length);
    setSequence(trimmed);

    // Check match
    if (trimmed.length === KONAMI_CODE.length &&
        trimmed.every((key, i) => key === KONAMI_CODE[i])) {
      setShow(true);
      // Confetti-like particles via CSS
      launchConfetti();
    }
  }, [sequence, show]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center"
      style={{ background: 'rgba(11,12,16,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={() => setShow(false)}
    >
      <div
        className="relative p-8 md:p-12 rounded-2xl max-w-md w-[90%] text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(88,166,178,0.1), rgba(199,146,234,0.1))',
          border: '1px solid rgba(88,166,178,0.3)',
          boxShadow: '0 0 60px rgba(88,166,178,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-[#8B92A8] hover:text-[#F0F2F5] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} className="text-cyan" />
        </div>

        <h2
          className="font-display text-[#F0F2F5] uppercase mb-2"
          style={{ fontSize: 'clamp(18px, 3vw, 28px)' }}
        >
          You Found The Secret!
        </h2>
        <p className="text-[#8B92A8] text-sm mb-6">
          Konami code unlocked. You are a true vibe coder. Welcome to the inner circle.
        </p>

        <div className="p-4 rounded-xl bg-[#0B0C10] border border-white/5 mb-6">
          <div className="font-mono text-xs text-cyan mb-2">Your vibe coder rank:</div>
          <div className="font-display text-lg text-[#F0F2F5]">
            LEVEL 99 ARCHITECT
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="https://github.com/dangelBorges/the-vibecoding-handbook"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan text-[#0B0C10] font-heading font-semibold rounded-full hover:bg-cyan/90 transition-all"
          >
            <Github size={18} />
            Star on GitHub
            <ArrowRight size={16} />
          </a>
          <button
            onClick={() => setShow(false)}
            className="text-[#8B92A8] text-sm hover:text-[#F0F2F5] transition-colors"
          >
            Close and keep exploring
          </button>
        </div>
      </div>

      {/* Confetti particles injected via inline styles */}
      <style>{`
        @keyframes konami-confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .konami-particle {
          position: fixed;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          pointer-events: none;
          z-index: 9991;
          animation: konami-confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function launchConfetti() {
  const colors = ['#58A6B2', '#C792EA', '#C3E88D', '#F0F2F5', '#f59e0b'];
  for (let i = 0; i < 50; i++) {
    const el = document.createElement('div');
    el.className = 'konami-particle';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `-${Math.random() * 20}px`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = `${4 + Math.random() * 8}px`;
    el.style.height = `${4 + Math.random() * 8}px`;
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.animationDelay = `${Math.random() * 2}s`;
    el.style.animationDuration = `${2 + Math.random() * 3}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}
