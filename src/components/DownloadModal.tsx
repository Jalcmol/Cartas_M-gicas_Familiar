import React, { useState } from 'react';
import { ShieldCheck, Download, Sparkles, AlertCircle, CheckCircle2, KeyRound, ExternalLink, RefreshCw } from 'lucide-react';
import { ChildProfile, CharacterInfo, TemplateInfo, LicenseStatus } from '../types';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChild: ChildProfile;
  currentCharacter: CharacterInfo;
  currentTemplate: TemplateInfo;
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
  licenseStatus,
  onLicenseValidated,
  savedLicenseKey,
}) => {
  const [licenseKeyInput, setLicenseKeyInput] = useState(savedLicenseKey || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleValidate = async (keyToTest?: string) => {
    const key = (keyToTest ?? licenseKeyInput).trim();
    if (!key) {
      setErrorMsg('Por favor, escribe tu código de licencia de Gumroad.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/check?key=${encodeURIComponent(key)}`);
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setErrorMsg(data.error || 'Código no válido o no encontrado.');
        return;
      }

      onLicenseValidated(data, key);
      setLicenseKeyInput(key);
    } catch (err: any) {
      setErrorMsg('Error de conexión al verificar con el servidor. Revisa tu red.');
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
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licenseKey: key,
          childName: currentChild.name || 'Pequeño',
          city: currentChild.city || 'España',
          characterId: currentCharacter.id,
          templateId: currentTemplate.id,
          achievement: currentChild.achv || currentChild.achievement || '',
          behavior: currentChild.extra || currentChild.behavior || '',
          giftMention: currentChild.giftMention || '',
          customNote: currentChild.customNote || '',
          returnHtml: true,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || 'No se pudo generar la carta limpia.');
      }

      // Obtener el HTML limpio de alta resolución generado por el servidor
      const htmlText = await res.text();

      // Abrir en nueva ventana con diálogo nativo de impresión para guardar en PDF limpio a 300 DPI
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(htmlText);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 600);
      } else {
        // Fallback: descargar como archivo HTML si la ventana emergente está bloqueada
        const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Carta_Oficial_${(currentChild.name || 'Magica').replace(/\s+/g, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }

      setDownloadSuccess(true);

      // Actualizar el estado de saldo
      const remainingHeader = res.headers.get('X-Remaining-Downloads');
      if (remainingHeader && licenseStatus) {
        onLicenseValidated(
          {
            ...licenseStatus,
            remainingDownloads: parseInt(remainingHeader, 10),
            usedDownloads: (licenseStatus.usedDownloads || 0) + 1,
          },
          key
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al emitir la descarga limpia.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-stone-50 rounded-xl border border-stone-200 shadow-2xl overflow-hidden p-6 sm:p-7">
        {/* Cabecera del modal */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              ✨
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-['Cinzel',serif]">
                Descargar Carta Oficial Limpia
              </h3>
              <p className="text-xs text-stone-600">
                Para <span className="font-semibold text-stone-900">{currentChild.name || 'tu hijo/a'}</span> · Sin marcas de agua en PDF A4
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

        {/* Resumen "Filosofía Cero Timo" */}
        <div className="my-4 bg-amber-50/70 border border-amber-200/80 rounded-lg p-3.5 text-xs text-amber-950">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Filosofía "Cero Timo" de Cartas Mágicas</span>
          </div>
          <p className="text-stone-700 leading-relaxed">
            Un único pago accesible (4,99 €) por tu <strong>Pack Familiar Total</strong>. Conservas tus descargas para Navidad, Reyes y caídas de dientes del Ratoncito Pérez durante todo el año.
          </p>
        </div>

        {/* Estado de Licencia */}
        {licenseStatus?.valid ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Licencia Activa y Vinculada
                </span>
                <span className="font-mono text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  {licenseStatus.remainingDownloads} descargas restantes
                </span>
              </div>
              <p className="text-emerald-900/80 text-[11px]">
                Niños vinculados: {licenseStatus.registeredChildren?.length ? licenseStatus.registeredChildren.join(', ') : currentChild.name} (hasta 6 en el pack)
              </p>
              {licenseStatus.isDemo && (
                <span className="inline-block text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded mt-1 font-mono">
                  MODO PRUEBA ACTIVO (Demo)
                </span>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {downloadSuccess && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                ¡Carta oficial lista! Se ha abierto el diálogo de impresión para guardar como PDF a máxima calidad. Si no se abrió, revisa las ventanas emergentes del navegador.
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleExecuteDownload}
                disabled={downloading || licenseStatus.remainingDownloads <= 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
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
                title="Actualizar saldo"
                className="px-3 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                ¿Ya compraste tu Pack? Introduce tu código de licencia Gumroad:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: ABC12345-DEF67890..."
                  value={licenseKeyInput}
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono uppercase"
                />
                <button
                  onClick={() => handleValidate()}
                  disabled={loading}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  {loading ? 'Validando...' : 'Verificar'}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Accesos rápidos: Comprar en Gumroad o Probar con demo */}
            <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Comprar Pack Familiar en Gumroad (4,99 € - 10 cartas)
              </a>

              <div className="text-center">
                <button
                  onClick={() => handleValidate('DEMO-FAMILIA-2026')}
                  className="text-[11px] text-stone-500 hover:text-amber-800 underline transition-colors inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  ¿Probando la aplicación? Clic aquí para activar clave demo de prueba
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
