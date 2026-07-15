import { useRef, useEffect } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);

  useEffect(() => {
    // Check for touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('loop-item') ||
        target.classList.contains('card-hover')
      ) {
        isHovering.current = true;
      }
    };

    const handleMouseOut = () => {
      isHovering.current = false;
    };

    function animate() {
      const d = dotRef.current;
      const r = ringRef.current;
      if (!d || !r) return;

      ringPos.current.x += (mouseRef.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouseRef.current.y - ringPos.current.y) * 0.15;

      d.style.transform = `translate(${mouseRef.current.x - 4}px, ${mouseRef.current.y - 4}px)`;
      r.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;

      if (isHovering.current) {
        r.style.width = '40px';
        r.style.height = '40px';
        r.style.borderColor = 'rgba(88, 166, 178, 0.6)';
      } else {
        r.style.width = '24px';
        r.style.height = '24px';
        r.style.borderColor = 'rgba(88, 166, 178, 0.3)';
      }

      raf = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Don't render on touch devices or reduced motion
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouch || prefersReduced) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-cyan"
        style={{ mixBlendMode: 'difference' }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-cyan/30 transition-all duration-300"
        style={{ width: 24, height: 24 }}
      />
    </>
  );
}
