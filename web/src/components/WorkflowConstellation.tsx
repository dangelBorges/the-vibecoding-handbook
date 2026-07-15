import { useRef, useEffect } from 'react';

interface Node {
  x: number;
  y: number;
  label: string;
  color: string;
  radius: number;
  pulsePhase: number;
}

interface Particle {
  t: number; // 0 to 1 along the path
  speed: number;
  fromNode: number;
  toNode: number;
  size: number;
  brightness: number;
  offsetY: number; // slight vertical oscillation
}

const NODE_COLORS = ['#58A6B2', '#C792EA', '#C3E88D', '#58A6B2'];
const NODE_LABELS = ['PROMPT', 'GENERATE', 'REVIEW', 'REFINE'];

export default function WorkflowConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let nodes: Node[] = [];
    let particles: Particle[] = [];
    let time = 0;
    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas!.offsetWidth;
      h = canvas!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);

      // Position 4 nodes in a diamond/wave formation
      const cx = w / 2;
      const cy = h / 2;
      const spreadX = Math.min(w * 0.35, 300);
      const spreadY = Math.min(h * 0.25, 120);

      nodes = [
        { x: cx - spreadX * 1.2, y: cy - spreadY, label: NODE_LABELS[0], color: NODE_COLORS[0], radius: 5, pulsePhase: 0 },
        { x: cx - spreadX * 0.4, y: cy + spreadY * 0.3, label: NODE_LABELS[1], color: NODE_COLORS[1], radius: 5, pulsePhase: Math.PI * 0.5 },
        { x: cx + spreadX * 0.4, y: cy - spreadY * 0.3, label: NODE_LABELS[2], color: NODE_COLORS[2], radius: 5, pulsePhase: Math.PI },
        { x: cx + spreadX * 1.2, y: cy + spreadY, label: NODE_LABELS[3], color: NODE_COLORS[3], radius: 5, pulsePhase: Math.PI * 1.5 },
      ];
    }

    function createParticle(): Particle {
      const fromNode = Math.floor(Math.random() * 3); // 0→1, 1→2, 2→3
      return {
        t: 0,
        speed: 0.003 + Math.random() * 0.004,
        fromNode,
        toNode: fromNode + 1,
        size: 1.5 + Math.random() * 2,
        brightness: 0.5 + Math.random() * 0.5,
        offsetY: (Math.random() - 0.5) * 20,
      };
    }

    // Initialize particles
    for (let i = 0; i < 40; i++) {
      const p = createParticle();
      p.t = Math.random(); // spread them along the paths
      particles.push(p);
    }

    function getPathPoint(from: Node, to: Node, t: number, offsetY: number) {
      // Quadratic bezier with control point below/above for curve
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const curveStrength = 40 * Math.sin(t * Math.PI); // arch the curve

      const x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * midX + t * t * to.x;
      const y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * (midY + curveStrength) + t * t * to.y;

      return { x, y: y + offsetY * Math.sin(t * Math.PI) };
    }

    function draw() {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx!.clearRect(0, 0, w, h);
      time += 0.016;

      // Draw connection lines (faint, with gradient)
      for (let i = 0; i < nodes.length - 1; i++) {
        const from = nodes[i];
        const to = nodes[i + 1];

        const gradient = ctx!.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, `${from.color}15`);
        gradient.addColorStop(0.5, `${from.color}30`);
        gradient.addColorStop(1, `${to.color}15`);

        ctx!.beginPath();
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 1.5;

        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2 + 40;
        ctx!.moveTo(from.x, from.y);
        ctx!.quadraticCurveTo(midX, midY, to.x, to.y);
        ctx!.stroke();

        // Draw animated flow arrows on the line
        const arrowT = (time * 0.3 + i * 0.25) % 1;
        const arrowPos = getPathPoint(from, to, arrowT, 0);
        const arrowNext = getPathPoint(from, to, Math.min(arrowT + 0.02, 1), 0);
        const angle = Math.atan2(arrowNext.y - arrowPos.y, arrowNext.x - arrowPos.x);

        ctx!.save();
        ctx!.translate(arrowPos.x, arrowPos.y);
        ctx!.rotate(angle);
        ctx!.fillStyle = `${from.color}60`;
        ctx!.beginPath();
        ctx!.moveTo(4, 0);
        ctx!.lineTo(-3, -3);
        ctx!.lineTo(-3, 3);
        ctx!.closePath();
        ctx!.fill();
        ctx!.restore();
      }

      // Update and draw particles
      for (const p of particles) {
        p.t += p.speed;
        if (p.t >= 1) {
          // Reset to next connection or loop back
          p.fromNode = (p.fromNode + 1) % 3;
          p.toNode = p.fromNode + 1;
          p.t = 0;
          p.offsetY = (Math.random() - 0.5) * 20;
        }

        const from = nodes[p.fromNode];
        const to = nodes[p.toNode];
        const pos = getPathPoint(from, to, p.t, p.offsetY);

        // Mouse interaction — gentle repulsion
        const dx = pos.x - mouseRef.current.x;
        const dy = pos.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          pos.x += (dx / dist) * force * 15;
          pos.y += (dy / dist) * force * 15;
        }

        // Trail
        const trailLength = 8;
        for (let j = 1; j <= trailLength; j++) {
          const trailT = Math.max(0, p.t - j * 0.015);
          const trailPos = getPathPoint(from, to, trailT, p.offsetY);
          const alpha = p.brightness * (1 - j / trailLength) * 0.3;
          const size = p.size * (1 - j / trailLength * 0.5);

          ctx!.beginPath();
          ctx!.arc(trailPos.x, trailPos.y, size, 0, Math.PI * 2);
          ctx!.fillStyle = `${from.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
          ctx!.fill();
        }

        // Main particle glow
        const glowSize = p.size * 3;
        const glow = ctx!.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowSize);
        glow.addColorStop(0, `${from.color}${Math.floor(p.brightness * 200).toString(16).padStart(2, '0')}`);
        glow.addColorStop(1, `${from.color}00`);
        ctx!.fillStyle = glow;
        ctx!.fillRect(pos.x - glowSize, pos.y - glowSize, glowSize * 2, glowSize * 2);

        // Core
        ctx!.beginPath();
        ctx!.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `${from.color}${Math.floor(p.brightness * 255).toString(16).padStart(2, '0')}`;
        ctx!.fill();
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 0.7;

        // Outer halo
        const haloSize = node.radius * 8 * pulse;
        const halo = ctx!.createRadialGradient(node.x, node.y, 0, node.x, node.y, haloSize);
        halo.addColorStop(0, `${node.color}20`);
        halo.addColorStop(0.5, `${node.color}08`);
        halo.addColorStop(1, `${node.color}00`);
        ctx!.fillStyle = halo;
        ctx!.fillRect(node.x - haloSize, node.y - haloSize, haloSize * 2, haloSize * 2);

        // Middle ring
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.radius * 3 * pulse, 0, Math.PI * 2);
        ctx!.strokeStyle = `${node.color}40`;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        // Core
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx!.fillStyle = node.color;
        ctx!.fill();

        // Label
        ctx!.font = '600 11px "Space Grotesk", sans-serif';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'top';

        // Label glow
        ctx!.fillStyle = '#0B0C10';
        const textWidth = ctx!.measureText(node.label).width;
        ctx!.fillRect(node.x - textWidth / 2 - 4, node.y + 18, textWidth + 8, 16);

        ctx!.fillStyle = node.color;
        ctx!.fillText(node.label, node.x, node.y + 20);

        // Step number
        ctx!.font = '500 9px "Space Grotesk", sans-serif';
        ctx!.fillStyle = `${node.color}80`;
        ctx!.fillText(`0${i + 1}`, node.x, node.y - 28);
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
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
