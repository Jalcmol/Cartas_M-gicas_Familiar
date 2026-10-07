import React, { useEffect, useState } from 'react';

// Sonido mágico sintetizado con Web Audio API (cero descargas de red, instantáneo y fiable)
export function playMagicChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6 (arpegio celestial)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  } catch (e) {
    // Silencioso en caso de restricciones de autoplay de navegador
  }
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  symbol: string;
  rotation: number;
  duration: number;
}

interface MagicParticlesProps {
  particleType?: 'gold_stars' | 'snowflakes' | 'mouse_cheese' | 'fairy_dust' | 'elf_bells';
  triggerKey?: any;
}

export const MagicParticles: React.FC<MagicParticlesProps> = ({
  particleType = 'gold_stars',
  triggerKey,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const getSymbols = () => {
    switch (particleType) {
      case 'snowflakes':
        return ['❄️', '⛄', '🦌', '✨', '🎁'];
      case 'mouse_cheese':
        return ['🧀', '🦷', '🪙', '✨', '🐭'];
      case 'fairy_dust':
        return ['🧚‍♀️', '✨', '🌸', '💫', '🪄'];
      case 'elf_bells':
        return ['🔔', '🍭', '🎉', '🧝', '⭐'];
      case 'gold_stars':
      default:
        return ['✨', '⭐', '👑', '💛', '🌟'];
    }
  };

  useEffect(() => {
    const symbols = getSymbols();
    const count = 16;
    const newItems: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 14 + Math.random() * 16,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      rotation: Math.random() * 360,
      duration: 1.5 + Math.random() * 1.5,
    }));

    setParticles(newItems);
    const timer = setTimeout(() => {
      setParticles([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [triggerKey, particleType]);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-bounce transition-all opacity-85 select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            transform: `rotate(${p.rotation}deg)`,
            animationDuration: `${p.duration}s`,
            filter: 'drop-shadow(0 2px 6px rgba(255,215,0,0.4))',
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
};
