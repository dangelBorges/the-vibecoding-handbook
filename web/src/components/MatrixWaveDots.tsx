import { useRef, useEffect } from 'react';

interface Dot {
  x: number;
  y: number;
  r: number;
  col: string;
  initialX: number;
  initialY: number;
}

export default function MatrixWaveDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(false);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSpacing = 20;
    const dotRadius = 1.5;
    const dotColor = 'rgba(88, 166, 178, 0.6)';
    const waveSpeed = 0.05;
    const waveIntensity = 10;
    const mouseRadius = 100;

    let waveOffset = 0;
    let dots: Dot[] = [];

    function createDots() {
      dots = [];
      if (!canvas) return;
      const cols = Math.ceil(canvas.width / gridSpacing);
      const rows = Math.ceil(canvas.height / gridSpacing);
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * gridSpacing + gridSpacing / 2;
          const y = r * gridSpacing + gridSpacing / 2;
          dots.push({
            x, y, r: dotRadius, col: dotColor,
            initialX: x, initialY: y
          });
        }
      }
    }

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
      canvas.style.width = canvas.offsetWidth + 'px';
      canvas.style.height = canvas.offsetHeight + 'px';
      createDots();
    }

    resize();
    window.addEventListener('resize', resize);

    function drawDot(dot: Dot) {
      const wave = Math.sin((dot.y * 0.01) + waveOffset) * waveIntensity;
      const newX = dot.x + wave;
      const newY = dot.y + Math.cos((dot.x * 0.01) + waveOffset) * (waveIntensity * 0.3);
      ctx!.beginPath();
      ctx!.arc(newX, newY, dot.r, 0, Math.PI * 2);
      ctx!.fillStyle = dot.col;
      ctx!.fill();
      ctx!.closePath();
      dot.x = dot.initialX;
      dot.y = dot.initialY;
    }

    function animate() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      if (isVisibleRef.current) {
        waveOffset += waveSpeed;
        const mx = mouseRef.current.x - rect.left;
        const my = mouseRef.current.y - rect.top;

        dots.forEach((dot) => {
          const dist = Math.hypot(mx - dot.x, my - dot.y);
          if (dist < mouseRadius) {
            const angle = Math.atan2(dot.y - my, dot.x - mx);
            dot.x += Math.cos(angle) * 1;
            dot.y += Math.sin(angle) * 1;
            drawDot(dot);
            dot.x = dot.initialX;
            dot.y = dot.initialY;
          } else {
            drawDot(dot);
          }
        });
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
