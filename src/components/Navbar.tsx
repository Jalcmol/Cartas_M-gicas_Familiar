import React from 'react';
import { KeyRound, Sparkles, BookOpen } from 'lucide-react';
import { LicenseStatus } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'studio';
  onNavigate: (view: 'landing' | 'studio') => void;
  onOpenArchitecture: () => void;
  onOpenDownloadModal: () => void;
  licenseStatus: LicenseStatus | null;
  snowEnabled: boolean;
  onToggleSnow: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenArchitecture,
  onOpenDownloadModal,
  licenseStatus,
  snowEnabled,
  onToggleSnow,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0e1b3d]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between text-white no-print">
      {/* Zona 1: Marca con logo de estrella / corona dorada */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-[#5a1010] shadow-md group-hover:scale-105 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.1 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
            </svg>
          </div>
          <div>
            <span className="font-['Cinzel',serif] font-bold text-base sm:text-lg tracking-wide block leading-tight text-white group-hover:text-amber-300 transition-colors">
              Cartas Mágicas
            </span>
            <span className="text-[11px] text-white/70 block font-['Quicksand',sans-serif]">
              Personaliza, previsualiza y descarga en segundos
            </span>
          </div>
        </button>
      </div>

      {/* Zona 2: Enlaces limpios */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-white/80">
        <button
          onClick={() => onNavigate('landing')}
          className={`hover:text-white transition-colors cursor-pointer ${
            currentView === 'landing' ? 'text-amber-400 font-bold' : ''
          }`}
        >
          Inicio
        </button>
        <button
          onClick={() => onNavigate('studio')}
          className={`hover:text-white transition-colors cursor-pointer ${
            currentView === 'studio' ? 'text-amber-400 font-bold' : ''
          }`}
        >
          Editor de Cartas
        </button>
        <button
          onClick={onOpenArchitecture}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Arquitectura Vercel
        </button>
      </nav>

      {/* Zona 3: Botones de acción y Nieve */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle de nieve */}
        <button
          onClick={onToggleSnow}
          className="snowbtn text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5"
          aria-pressed={snowEnabled}
        >
          <span>❄️</span>
          <span className="hidden sm:inline">Nieve: {snowEnabled ? 'sí' : 'no'}</span>
        </button>

        {licenseStatus?.valid ? (
          <button
            onClick={onOpenDownloadModal}
            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="tabular-nums">{licenseStatus.remainingDownloads}</span> descargas
          </button>
        ) : (
          <button
            onClick={onOpenDownloadModal}
            className="px-3 py-1.5 border border-white/20 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Activar Licencia
          </button>
        )}

        {currentView === 'landing' ? (
          <button
            onClick={() => onNavigate('studio')}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Personalizar Gratis
          </button>
        ) : (
          <button
            onClick={onOpenDownloadModal}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md cursor-pointer"
          >
            ⬇️ Descargar PDF
          </button>
        )}
      </div>
    </header>
  );
};
