import { useRef, useEffect } from 'react';

interface VerticalLoopScrollProps {
  items: string[];
}

export default function VerticalLoopScroll({ items }: VerticalLoopScrollProps) {
  const listRefs = useRef<(HTMLUListElement | null)[]>([]);
  const currentScroll = useRef(0);

  useEffect(() => {
    let animationFrame: number;
    const speed = 0.5;

    function update() {
      currentScroll.current += speed;
      const wrapHeight = listRefs.current[0]?.offsetHeight || 0;
      listRefs.current.forEach((ref) => {
        if (ref) {
          ref.style.transform = `translateY(${-currentScroll.current}px)`;
          ref.style.willChange = 'transform';
        }
      });
      if (currentScroll.current > wrapHeight / 2) {
        currentScroll.current = 0;
      }
      animationFrame = requestAnimationFrame(update);
    }

    update();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="loop-wrapper">
      {[0, 1].map((i) => (
        <ul
          key={i}
          ref={(el) => { listRefs.current[i] = el; }}
          className="loop-list"
        >
          {items.map((item, idx) => (
            <li key={`${i}-${idx}`} className="loop-item">
              {item}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
