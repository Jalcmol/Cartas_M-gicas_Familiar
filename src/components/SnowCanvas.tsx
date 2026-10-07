import React, { useEffect, useRef } from 'react';

interface SnowCanvasProps {
  enabled: boolean;
}

export const SnowCanvas: React.FC<SnowCanvasProps> = ({ enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const flakeCount = Math.min(70, Math.round(W / 18));
    const flakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1 + Math.random() * 2.6,
      v: 0.35 + Math.random() * 0.9,
      s: Math.random() * 6.28,
    }));

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';

      for (const f of flakes) {
        f.y += f.v;
        f.s += 0.01;
        f.x += Math.sin(f.s) * 0.4;
        if (f.y > H + 5) {
          f.y = -5;
          f.x = Math.random() * W;
        }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, 6.283);
        ctx.fill();
      }

      animId = requestAnimationFrame(tick);
    };

    if (enabled) {
      tick();
    } else {
      ctx.clearRect(0, 0, W, H);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 no-print"
      aria-hidden="true"
    />
  );
};
