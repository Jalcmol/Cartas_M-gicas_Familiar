/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { StudioView } from './components/StudioView';
import { DownloadModal } from './components/DownloadModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { SnowCanvas } from './components/SnowCanvas';
import { Footer } from './components/Footer';
import { ChildProfile, DocumentId, ThemeInfo, LicenseStatus } from './types';
import { THEMES } from './data/letterTemplates';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'studio'>('studio');

  // Estado del generador
  const [docId, setDocId] = useState<DocumentId>('reyes');
  const [theme, setTheme] = useState<ThemeInfo>(THEMES[0]);
  const [mode, setMode] = useState<'individual' | 'joint'>('individual');

  const todayStr = () => {
    const d = new Date();
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  };

  const [date, setDate] = useState<string>(todayStr());
  const [parentSign, setParentSign] = useState<string>('Mamá y Papá');

  // Lista de niños
  const [kids, setKids] = useState<ChildProfile[]>([
    {
      id: 'k1',
      treat: 'Querida',
      name: 'Lucía',
      achv: 'has ayudado en casa, has compartido tus juguetes y has sacado muy buenas notas',
      extra: 'Este año te hemos preparado una sorpresa muy especial. ¡Busca bajo el árbol!',
    },
    {
      id: 'k2',
      treat: 'Querido',
      name: 'Pablo',
      achv: 'has aprendido a atarte los cordones y has cuidado mucho de tu hermana pequeña',
      extra: '',
    },
  ]);

  // Nieve animada
  const [snowEnabled, setSnowEnabled] = useState(true);

  // Licencia y monedero
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(null);
  const [isCheckingLicense, setIsCheckingLicense] = useState(false);
  const [licMsg, setLicMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Modales
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Inicialización y persistencia local
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cartas-magicas-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.kids && parsed.kids.length) setKids(parsed.kids);
        if (parsed.docId) setDocId(parsed.docId);
        if (parsed.themeId) {
          const found = THEMES.find((t) => t.id === parsed.themeId);
          if (found) setTheme(found);
        }
        if (parsed.mode) setMode(parsed.mode);
        if (parsed.date) setDate(parsed.date);
        if (parsed.parentSign) setParentSign(parsed.parentSign);
      }

      const savedKey = localStorage.getItem('cartas-magicas-lic');
      if (savedKey) {
        setLicenseKey(savedKey);
        handleCheckLicense(savedKey);
      }
    } catch (e) {}

    const params = new URLSearchParams(window.location.search);
    if (params.get('landing') === 'true') {
      setCurrentView('landing');
    }
  }, []);

  // Guardar estado en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'cartas-magicas-state',
        JSON.stringify({
          kids,
          docId,
          themeId: theme.id,
          mode,
          date,
          parentSign,
        })
      );
    } catch (e) {}
  }, [kids, docId, theme, mode, date, parentSign]);

  const handleCheckLicense = async (keyToCheck?: string) => {
    const key = (keyToCheck ?? licenseKey).trim();
    if (!key) {
      setLicMsg({ text: 'Introduce tu código de compra Gumroad.', ok: false });
      return;
    }

    setIsCheckingLicense(true);
    try {
      const res = await fetch(`/api/check?key=${encodeURIComponent(key)}`);
      const data = await res.json();

      if (data.valid) {
        setLicenseStatus(data);
        localStorage.setItem('cartas-magicas-lic', key);
        setLicMsg({
          text: `Código válido · Te quedan ${data.remainingDownloads} de ${data.totalDownloads} descargas.`,
          ok: true,
        });
      } else {
        setLicMsg({ text: data.error || 'Código no válido o no encontrado.', ok: false });
      }
    } catch (err) {
      // Demo / fallback offline
      if (key.toUpperCase().startsWith('DEMO-')) {
        const demoStatus: LicenseStatus = {
          valid: true,
          totalDownloads: 10,
          usedDownloads: 0,
          remainingDownloads: 10,
          registeredChildren: [],
          maxChildren: 6,
          nameEditsRemaining: 2,
          isDemo: true,
        };
        setLicenseStatus(demoStatus);
        setLicMsg({
          text: 'Código demo activo · Tienes 10 descargas de prueba disponibles.',
          ok: true,
        });
      } else {
        setLicMsg({ text: 'Error al conectar con el servidor. Revisa tu red.', ok: false });
      }
    } finally {
      setIsCheckingLicense(false);
    }
  };

  const handleDownloadDirect = (onlyIndex?: number | null) => {
    setIsDownloadModalOpen(true);
  };

  // Convertir primer niño a estructura esperada por DownloadModal
  const currentChildProfile: ChildProfile = {
    id: kids[0]?.id || 'k1',
    treat: kids[0]?.treat || 'Querido',
    name: kids[0]?.name || 'Pequeño',
    achv: kids[0]?.achv || '',
    extra: kids[0]?.extra || '',
    city: 'España',
    achievement: kids[0]?.achv || '',
    behavior: kids[0]?.extra || '',
    giftMention: '',
    customNote: '',
  };

  const currentCharacterLegacy = {
    id: docId as any,
    name: docId === 'reyes' ? 'Los Reyes Magos' : 'Papá Noel',
    category: 'navidad' as const,
    shortTitle: 'Palacio Real de Oriente',
    description: '',
    tagline: '',
    emblem: '👑',
    signature: 'Sus Majestades',
    sealIcon: '⭐',
    sealLabel: 'OFICIAL',
    postmark: 'ESP-2026',
    primaryColor: 'amber',
    badge: 'Oficial',
  };

  const currentTemplateLegacy = {
    id: theme.id as any,
    name: theme.name,
    description: '',
    theme: 'dorado' as const,
    previewBg: '',
    borderStyle: '',
    fontDisplay: '',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e1b3d] text-white selection:bg-amber-300 selection:text-stone-900 relative">
      {/* Fondo de Nieve animado */}
      <SnowCanvas enabled={snowEnabled} />

      {/* Barra de Navegación superior */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        licenseStatus={licenseStatus}
        snowEnabled={snowEnabled}
        onToggleSnow={() => setSnowEnabled((s) => !s)}
      />

      {/* Contenido Principal */}
      <div className="flex-1 relative z-10">
        {currentView === 'landing' ? (
          <div className="bg-[#faf9f5] text-stone-900 min-h-screen">
            <LandingView
              onGoToApp={() => {
                setCurrentView('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
            />
          </div>
        ) : (
          <StudioView
            docId={docId}
            setDocId={setDocId}
            theme={theme}
            setTheme={setTheme}
            mode={mode}
            setMode={setMode}
            kids={kids}
            setKids={setKids}
            date={date}
            setDate={setDate}
            parentSign={parentSign}
            setParentSign={setParentSign}
            licenseStatus={licenseStatus}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            onDownloadDirect={handleDownloadDirect}
            licenseKey={licenseKey}
            setLicenseKey={setLicenseKey}
            onCheckLicense={handleCheckLicense}
            isCheckingLicense={isCheckingLicense}
            licMsg={licMsg}
          />
        )}
      </div>

      {/* Pie de Página */}
      <Footer
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        onNavigate={setCurrentView}
      />

      {/* Modal de Descarga y Licencia */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        currentChild={currentChildProfile}
        currentCharacter={currentCharacterLegacy}
        currentTemplate={currentTemplateLegacy}
        licenseStatus={licenseStatus}
        onLicenseValidated={(status, key) => {
          setLicenseStatus(status);
          setLicenseKey(key);
        }}
        savedLicenseKey={licenseKey}
      />

      {/* Modal de Arquitectura */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}
