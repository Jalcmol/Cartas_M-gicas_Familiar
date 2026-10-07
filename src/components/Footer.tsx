import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenArchitecture: () => void;
  onNavigate: (view: 'landing' | 'studio') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenArchitecture, onNavigate }) => {
  return (
    <footer className="border-t border-stone-200/80 bg-stone-100/60 py-10 px-4 text-xs text-stone-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-base font-bold text-stone-900 font-['Cinzel',serif] mb-1">
            Cartas Mágicas
          </div>
          <p className="text-stone-500 max-w-sm">
            Diseñado con cariño para familias en España. La magia de los Reyes Magos, Papá Noel y el Ratoncito Pérez en alta definición.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="hover:text-stone-900 transition-colors"
          >
            Inicio
          </button>
          <button
            onClick={() => onNavigate('studio')}
            className="hover:text-stone-900 transition-colors"
          >
            Personalizador
          </button>
          <button
            onClick={onOpenArchitecture}
            className="hover:text-stone-900 transition-colors underline decoration-dotted"
          >
            Documentación Arquitectura Vercel
          </button>
        </div>

        <div className="text-center md:text-right text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} Cartas Mágicas. Filosofía "Cero Timo".</p>
          <p className="mt-0.5">Vercel Serverless + Upstash Redis REST API.</p>
        </div>
      </div>
    </footer>
  );
};
