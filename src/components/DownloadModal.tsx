import React, { useState } from 'react';
import { ShieldCheck, Download, Sparkles, AlertCircle, CheckCircle2, KeyRound, ExternalLink, RefreshCw, Printer, FileText } from 'lucide-react';
import { ChildProfile, CharacterInfo, TemplateInfo, LicenseStatus, DocumentId, ThemeInfo } from '../types';
import { verifyLicense, deductDownload } from '../services/upstashService';
import { renderCleanSheetHtml, generateFullPrintableHtml, printViaHiddenIframe, downloadHtmlFile } from '../services/letterRenderer';
import { DOCUMENTS, THEMES } from '../data/letterTemplates';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChild?: ChildProfile;
  currentCharacter?: CharacterInfo;
  currentTemplate?: TemplateInfo;
  kids?: ChildProfile[];
  docId?: DocumentId;
  theme?: ThemeInfo;
  mode?: 'individual' | 'joint';
  date?: string;
  parentSign?: string;
  licenseStatus: LicenseStatus | null;
  onLicenseValidated: (status: LicenseStatus, licenseKey: string) => void;
  savedLicenseKey: string;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  currentChild,
  currentCharacter,
  currentTemplate,
  kids = [],
  docId = 'reyes',
  theme,
  mode = 'individual',
  date = new Date().toISOString().slice(0, 10),
  parentSign = 'Mamá y Papá',
  licenseStatus,
  onLicenseValidated,
  savedLicenseKey,
}) => {
  const [licenseKeyInput, setLicenseKeyInput] = useState(savedLicenseKey || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [selectedKidIndex, setSelectedKidIndex] = useState<number | 'all'>('all');
  const [lastGeneratedHtml, setLastGeneratedHtml] = useState<string | null>(null);

  if (!isOpen) return null;

  // Lista de niños activa
  const effectiveKids: ChildProfile[] = kids.length > 0 ? kids : [currentChild || {
    id: 'k1',
    treat: 'Querido',
    name: 'Pequeño',
    achv: '',
    extra: '',
  }];

  const activeTheme: ThemeInfo = theme || THEMES[0];
  const docInfo = DOCUMENTS[docId] || DOCUMENTS.reyes;

  const handleValidate = async (keyToTest?: string) => {
    const key = (keyToTest ?? licenseKeyInput).trim();
    if (!key) {
      setErrorMsg('Por favor, escribe tu código de compra o usa el botón de prueba demo.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Conexión directa a Upstash Redis REST
      const status = await verifyLicense(key);

      if (!status.valid) {
        setErrorMsg(status.error || 'Código no válido o no encontrado.');
        return;
      }

      onLicenseValidated(status, key);
      setLicenseKeyInput(key);
    } catch (err: any) {
      setErrorMsg('Error al conectar con la base de datos Upstash. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteDownload = async () => {
    const key = (savedLicenseKey || licenseKeyInput).trim();
    if (!key) {
      setErrorMsg('Introduce primero tu código de licencia.');
      return;
    }

    setDownloading(true);
    setErrorMsg(null);

    try {
      // Determinar qué niños se van a generar
      let kidsToRender: { profile: ChildProfile[]; isJoint: boolean; title: string; filename: string }[] = [];

      if (mode === 'joint' && effectiveKids.length > 1) {
        // Carta conjunta
        const jointNames = effectiveKids.map((k) => k.name.trim() || 'Niño/a').join('_y_');
        kidsToRender.push({
          profile: effectiveKids,
          isJoint: true,
          title: `Carta Conjunta Oficial - ${docInfo.name}`,
          filename: `Carta_Oficial_${docInfo.name.replace(/\s+/g, '_')}_Conjunta_${jointNames}.html`,
        });
      } else if (selectedKidIndex === 'all') {
        // Todas las cartas individuales
        effectiveKids.forEach((kid, idx) => {
          const kName = kid.name.trim() || `Hijo_${idx + 1}`;
          kidsToRender.push({
            profile: [kid],
            isJoint: false,
            title: `Carta Oficial - ${kName}`,
            filename: `Carta_Oficial_${docInfo.name.replace(/\s+/g, '_')}_${kName.replace(/\s+/g, '_')}.html`,
          });
        });
      } else {
        // Un solo niño específico
        const singleKid = effectiveKids[selectedKidIndex as number] || effectiveKids[0];
        const kName = singleKid.name.trim() || 'Oficial';
        kidsToRender.push({
          profile: [singleKid],
          isJoint: false,
          title: `Carta Oficial - ${kName}`,
          filename: `Carta_Oficial_${docInfo.name.replace(/\s+/g, '_')}_${kName.replace(/\s+/g, '_')}.html`,
        });
      }

      // Descontar en Upstash Redis
      const allNames = effectiveKids.map((k) => k.name.trim()).filter(Boolean);
      const deductionResult = await deductDownload(key, allNames);

      if (!deductionResult.success) {
        throw new Error(deductionResult.error || 'No fue posible descontar la descarga.');
      }

      // Renderizar las hojas limpias (sin marca de agua)
      const sheetsHtml = kidsToRender.map((item, idx) =>
        renderCleanSheetHtml(
          docId,
          activeTheme,
          item.profile,
          item.isJoint,
          date,
          parentSign,
          idx
        )
      );

      const fullHtmlDoc = generateFullPrintableHtml(
        sheetsHtml,
        `Cartas Mágicas Oficiales - ${docInfo.name}`
      );

      setLastGeneratedHtml(fullHtmlDoc);

      // 1. Abrir diálogo de impresión para Guardar como PDF (sin bloqueos de popup)
      printViaHiddenIframe(fullHtmlDoc);

      // 2. Descargar archivo .html de alta definición como respaldo seguro
      const mainFilename = kidsToRender.length === 1
        ? kidsToRender[0].filename
        : `Cartas_Magicas_Oficiales_${docInfo.name.replace(/\s+/g, '_')}_Pack.html`;

      downloadHtmlFile(fullHtmlDoc, mainFilename);

      setDownloadSuccess(true);

      // Actualizar estado de saldo en la app
      if (licenseStatus) {
        onLicenseValidated(
          {
            ...licenseStatus,
            remainingDownloads: deductionResult.remainingDownloads,
            usedDownloads: deductionResult.usedDownloads,
          },
          key
        );
      }
    } catch (err: any) {
      console.error('[Download error]:', err);
      setErrorMsg(err.message || 'Error al generar la carta limpia. Inténtalo de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrintAgain = () => {
    if (lastGeneratedHtml) {
      printViaHiddenIframe(lastGeneratedHtml);
    }
  };

  const handleDownloadFileAgain = () => {
    if (lastGeneratedHtml) {
      downloadHtmlFile(
        lastGeneratedHtml,
        `Carta_Magica_Oficial_${docInfo.name.replace(/\s+/g, '_')}.html`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-stone-50 rounded-2xl border border-stone-200 shadow-2xl overflow-hidden p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        {/* Cabecera del modal */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl shadow-xs">
              {docInfo.emo || '✨'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-['Cinzel',serif]">
                Descargar Carta Oficial Limpia
              </h3>
              <p className="text-xs text-stone-600">
                {docInfo.name} · Sin marcas de agua en A4 de alta resolución
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-xl font-medium p-1 leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Resumen "Garantía y Transparencia" */}
        <div className="my-4 bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 text-xs text-amber-950">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Garantía y Transparencia de Cartas Mágicas</span>
          </div>
          <p className="text-stone-700 leading-relaxed text-[11px]">
            Un único pago accesible de 4,99 € por tu <strong>Pack Familiar Total</strong>. Tienes 10 descargas oficiales para usar en Reyes Magos, Papá Noel o caídas de dientes del Ratoncito Pérez.
          </p>
        </div>

        {/* Estado de Licencia */}
        {licenseStatus?.valid ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Licencia Activa en Upstash Redis
                </span>
                <span className="font-mono text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md font-bold">
                  {licenseStatus.remainingDownloads} descargas restantes
                </span>
              </div>
              <p className="text-emerald-900/80 text-[11px]">
                Niños incluidos: {effectiveKids.map((k) => k.name.trim() || 'Sin nombre').join(', ')} (hasta 6 en el pack)
              </p>
              {licenseStatus.isDemo && (
                <span className="inline-block text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono font-bold">
                  MODO PRUEBA ACTIVO (Demo oficial)
                </span>
              )}
            </div>

            {/* Selector de qué carta descargar si hay más de 1 niño */}
            {effectiveKids.length > 1 && mode !== 'joint' && (
              <div className="bg-stone-100/70 border border-stone-200 rounded-xl p-3">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Selecciona la carta a descargar:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedKidIndex('all')}
                    className={`py-1.5 px-2.5 rounded-lg font-medium text-left transition-colors border ${
                      selectedKidIndex === 'all'
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    📄 Todas las hojas ({effectiveKids.length} niños)
                  </button>
                  {effectiveKids.map((kid, idx) => (
                    <button
                      key={kid.id || idx}
                      type="button"
                      onClick={() => setSelectedKidIndex(idx)}
                      className={`py-1.5 px-2.5 rounded-lg font-medium text-left truncate transition-colors border ${
                        selectedKidIndex === idx
                          ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      👤 Solo {kid.name.trim() || `Niño/a ${idx + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {downloadSuccess && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>¡Carta Oficial Limpia Generada!</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  Se ha enviado la orden de impresión para <strong>Guardar como PDF</strong> y se ha iniciado la descarga del archivo.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handlePrintAgain}
                    className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Abrir Impresión / Guardar PDF
                  </button>
                  <button
                    onClick={handleDownloadFileAgain}
                    className="flex-1 py-1.5 px-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Descargar Archivo HTML
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleExecuteDownload}
                disabled={downloading || licenseStatus.remainingDownloads <= 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white rounded-xl text-sm font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {downloading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generando carta oficial...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Descargar PDF Oficial Limpio (1 Descarga)
                  </>
                )}
              </button>
              <button
                onClick={() => handleValidate()}
                title="Actualizar saldo de Upstash Redis"
                className="px-3 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-xl text-xs transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Introduce tu código de compra (o pulsa abajo para probar):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: DEMO-FAMILIA-2026"
                  value={licenseKeyInput}
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono uppercase"
                />
                <button
                  onClick={() => handleValidate()}
                  disabled={loading}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  {loading ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Accesos rápidos */}
            <div className="pt-2 border-t border-stone-200 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleValidate('DEMO-FAMILIA-2026')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors border border-amber-300 cursor-pointer shadow-xs"
              >
                <KeyRound className="w-4 h-4 text-amber-700" />
                ⚡ Probar ahora mismo con código DEMO gratis
              </button>

              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Comprar Pack Familiar en Gumroad (4,99 € · 10 cartas)
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
