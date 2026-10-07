import React, { useState } from 'react';
import { ChildProfile, DocumentId, ThemeId, ThemeInfo, LicenseStatus } from '../types';
import { DOCUMENTS, THEMES } from '../data/letterTemplates';
import { LetterPreview } from './LetterPreview';

interface StudioViewProps {
  docId: DocumentId;
  setDocId: (d: DocumentId) => void;
  theme: ThemeInfo;
  setTheme: (t: ThemeInfo) => void;
  mode: 'individual' | 'joint';
  setMode: (m: 'individual' | 'joint') => void;
  kids: ChildProfile[];
  setKids: React.Dispatch<React.SetStateAction<ChildProfile[]>>;
  date: string;
  setDate: (d: string) => void;
  parentSign: string;
  setParentSign: (s: string) => void;
  licenseStatus: LicenseStatus | null;
  onOpenDownloadModal: () => void;
  onDownloadDirect?: (onlyIndex?: number | null) => void;
  licenseKey: string;
  setLicenseKey: (k: string) => void;
  onCheckLicense: (key: string) => void;
  isCheckingLicense: boolean;
  licMsg: { text: string; ok: boolean } | null;
}

const MAX_KIDS = 6;

export const StudioView: React.FC<StudioViewProps> = ({
  docId,
  setDocId,
  theme,
  setTheme,
  mode,
  setMode,
  kids,
  setKids,
  date,
  setDate,
  parentSign,
  setParentSign,
  licenseStatus,
  onOpenDownloadModal,
  onDownloadDirect,
  licenseKey,
  setLicenseKey,
  onCheckLicense,
  isCheckingLicense,
  licMsg,
}) => {
  const [animKey, setAnimKey] = useState(0);

  const triggerAnim = () => {
    setAnimKey((k) => k + 1);
  };

  const handleUpdateKid = (index: number, field: keyof ChildProfile, val: string) => {
    setKids((prev) =>
      prev.map((k, i) => (i === index ? { ...k, [field]: val } : k))
    );
  };

  const handleAddKid = () => {
    if (kids.length >= MAX_KIDS) return;
    const newK: ChildProfile = {
      id: `kid-${Date.now()}`,
      treat: 'Querido',
      name: '',
      achv: '',
      extra: '',
    };
    setKids((prev) => [...prev, newK]);
    triggerAnim();
  };

  const handleRemoveKid = (index: number) => {
    if (kids.length <= 1) return;
    setKids((prev) => prev.filter((_, i) => i !== index));
    triggerAnim();
  };

  const handleFillExample = () => {
    setKids([
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
    setParentSign('Mamá y Papá');
    triggerAnim();
  };

  const handleResetData = () => {
    setKids([
      {
        id: 'k1',
        treat: 'Querido',
        name: '',
        achv: '',
        extra: '',
      },
    ]);
    setParentSign('');
    triggerAnim();
  };

  const handleDocChange = (newDoc: DocumentId) => {
    setDocId(newDoc);
    triggerAnim();
  };

  const handleThemeChange = (newTheme: ThemeInfo) => {
    setTheme(newTheme);
    triggerAnim();
  };

  const isJoint = mode === 'joint' && kids.length > 1;

  return (
    <div className="w-full">
      {/* PANEL DE CONTROL SUPERIOR */}
      <div className="panel max-w-[1100px] mx-auto px-4 pt-6 pb-2 no-print">
        {/* PESTAÑAS DE PERSONAJES / DOCUMENTOS */}
        <nav
          className="tabs flex gap-2 flex-wrap mb-4"
          role="tablist"
          aria-label="Tipo de documento"
        >
          {(Object.values(DOCUMENTS) as typeof DOCUMENTS[DocumentId][]).map((d) => (
            <button
              key={d.id}
              onClick={() => handleDocChange(d.id)}
              className="tab flex-1 basis-[150px] border border-white/20 bg-white/10 hover:bg-white/15 text-white py-2.5 px-3 rounded-xl font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 transition-all"
              style={
                docId === d.id
                  ? {
                      background: 'linear-gradient(135deg, #f3d77a, #d4a937)',
                      color: '#3b1212',
                      borderColor: 'transparent',
                      boxShadow: '0 8px 22px rgba(212, 169, 55, 0.35)',
                    }
                  : undefined
              }
              role="tab"
              aria-selected={docId === d.id}
            >
              <span className="emo text-base">{d.emo}</span>
              <span>{d.name}</span>
            </button>
          ))}
        </nav>

        {/* CONTENEDOR DE CONTROLES */}
        <section
          className="controls bg-white rounded-2xl p-5 shadow-2xl text-stone-900"
          aria-label="Datos de la carta"
        >
          {/* TÍTULO Y SELECTOR DE MODO */}
          <div className="sec-title flex items-center gap-3 flex-wrap mb-3">
            <h2 className="font-['Cinzel',serif] text-base font-bold tracking-wider text-stone-900">
              NIÑOS Y NIÑAS
            </h2>
            <div className="flex-1" />
            <div
              className="seg inline-flex bg-stone-100 p-1 rounded-xl gap-1 text-xs font-bold"
              role="group"
              aria-label="Modo"
            >
              <button
                type="button"
                onClick={() => {
                  setMode('individual');
                  triggerAnim();
                }}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  mode === 'individual'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                aria-pressed={mode === 'individual'}
              >
                Una hoja por niño/a
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('joint');
                  triggerAnim();
                }}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  mode === 'joint'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                aria-pressed={mode === 'joint'}
              >
                Carta conjunta
              </button>
            </div>
          </div>

          {/* LISTA DE NIÑOS */}
          <div id="kids" className="flex flex-col gap-3 mb-3">
            {kids.map((k, i) => (
              <div
                key={k.id || i}
                className="kid-card border border-stone-200 rounded-xl p-3 bg-stone-50/60"
              >
                <div className="kid-head flex items-center gap-2.5 mb-2.5 flex-wrap">
                  <span className="badge w-6 h-6 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 text-stone-900 font-bold grid place-items-center text-xs">
                    {i + 1}
                  </span>
                  <strong className="text-sm text-stone-900 font-bold">
                    {k.name.trim() || `Niño/a ${i + 1}`}
                  </strong>
                  <div className="flex-1" />
                  {kids.length > 1 && mode === 'individual' && (
                    <button
                      type="button"
                      onClick={() => onDownloadDirect && onDownloadDirect(i)}
                      className="mini border-0 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors"
                    >
                      🖨️ Solo esta hoja
                    </button>
                  )}
                  {kids.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveKid(i)}
                      className="mini danger border-0 bg-stone-200 hover:bg-red-100 text-red-700 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors"
                    >
                      ✕ Quitar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                  <div className="field md:col-span-2 flex flex-col gap-1">
                    <label className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                      Tratamiento
                    </label>
                    <select
                      value={k.treat}
                      onChange={(e) =>
                        handleUpdateKid(i, 'treat', e.target.value as 'Querido' | 'Querida')
                      }
                      className="bg-white border border-stone-300 rounded-lg px-2.5 py-2 font-medium"
                    >
                      <option value="Querido">Querido</option>
                      <option value="Querida">Querida</option>
                    </select>
                  </div>

                  <div className="field md:col-span-4 flex flex-col gap-1">
                    <label className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                      Nombre
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      placeholder="Ej.: Lucía"
                      value={k.name}
                      onChange={(e) => handleUpdateKid(i, 'name', e.target.value)}
                      className="bg-white border border-stone-300 rounded-lg px-2.5 py-2 font-medium"
                    />
                  </div>

                  <div className="field md:col-span-6 flex flex-col gap-1">
                    <label className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                      Logro o comportamiento{' '}
                      <span className="text-stone-400 font-normal lowercase">(en 2ª persona)</span>
                    </label>
                    <textarea
                      maxLength={240}
                      rows={2}
                      placeholder="Ej.: has ayudado en casa, has compartido tus juguetes y has sacado muy buenas notas"
                      value={k.achv}
                      onChange={(e) => handleUpdateKid(i, 'achv', e.target.value)}
                      className="bg-white border border-stone-300 rounded-lg px-2.5 py-2 font-medium resize-y"
                    />
                  </div>

                  <div className="field col-span-12 flex flex-col gap-1">
                    <label className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                      Mensaje personal (opcional)
                    </label>
                    <textarea
                      maxLength={240}
                      rows={1}
                      placeholder="Ej.: Este año te hemos preparado una sorpresa muy especial."
                      value={k.extra}
                      onChange={(e) => handleUpdateKid(i, 'extra', e.target.value)}
                      className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium resize-y"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddKid}
            disabled={kids.length >= MAX_KIDS}
            className="btn btn-add w-full py-2.5 px-4 bg-white border-2 border-dashed border-stone-300 hover:border-amber-500 hover:bg-amber-50/50 rounded-xl text-stone-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {kids.length >= MAX_KIDS ? `Máximo ${MAX_KIDS} niños/as` : '＋ Añadir otro niño/a'}
          </button>

          <hr className="border-0 border-t border-stone-200 my-4" />

          {/* CAMPOS ADICIONALES Y PLANTILLAS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
            <div className="field md:col-span-4 flex flex-col gap-1">
              <label className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-2.5 py-2 font-medium"
              />
            </div>

            <div className="field md:col-span-8 flex flex-col gap-1">
              <label className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                Firma de los padres (certificado)
              </label>
              <input
                type="text"
                maxLength={40}
                placeholder="Mamá y Papá"
                value={parentSign}
                onChange={(e) => setParentSign(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-2.5 py-2 font-medium"
              />
            </div>

            <div className="field col-span-12 mt-1">
              <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px] block mb-1.5">
                Plantilla visual ({THEMES.length} diseños profesionales)
              </span>
              <div className="themes grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleThemeChange(t)}
                    className={`theme-btn flex items-center gap-2.5 p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      theme.id === t.id
                        ? 'border-amber-500 bg-amber-50/60 shadow-xs ring-2 ring-amber-400/50'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                    aria-pressed={theme.id === t.id}
                  >
                    <span
                      className="swatch w-7 h-9 rounded-sm border border-black/20 shrink-0"
                      style={{ background: t.sw }}
                    />
                    <span className="text-xs font-semibold text-stone-800 line-clamp-1">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-0 border-t border-stone-200 my-4" />

          {/* ZONA DE LICENCIA Y ACCIONES */}
          <div className="license">
            <div className="lic-row flex items-end gap-2.5 flex-wrap">
              <div className="field flex-1 min-w-[240px] flex flex-col gap-1">
                <label className="font-bold uppercase tracking-wider text-stone-600 text-xs flex items-center gap-1">
                  🔑 Tu código de compra Gumroad
                </label>
                <input
                  type="text"
                  placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono uppercase"
                  spellCheck="false"
                />
              </div>
              <button
                type="button"
                onClick={() => onCheckLicense(licenseKey)}
                disabled={isCheckingLicense}
                className="btn btn-ghost border-0 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
              >
                {isCheckingLicense ? 'Comprobando…' : 'Comprobar'}
              </button>
            </div>

            {licMsg && (
              <p
                className={`licmsg text-xs mt-2 font-bold ${
                  licMsg.ok ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {licMsg.text}
              </p>
            )}
          </div>

          <div className="actions flex items-center gap-2.5 flex-wrap mt-4">
            <button
              type="button"
              onClick={onOpenDownloadModal}
              className="btn btn-primary py-3 px-5 rounded-xl font-bold text-sm text-white cursor-pointer transition-transform shadow-md"
              style={{
                background: 'linear-gradient(135deg, #c8202d, #8f0e18)',
                boxShadow: '0 8px 20px rgba(179, 18, 31, 0.35)',
              }}
            >
              ⬇️ Descargar PDF sin marca de agua
            </button>
            <button
              type="button"
              onClick={onOpenDownloadModal}
              className="btn btn-ghost py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs cursor-pointer transition-colors"
            >
              🛒 Comprar mi pack (4,99 €)
            </button>
            <button
              type="button"
              onClick={handleFillExample}
              className="btn btn-ghost py-2.5 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs cursor-pointer transition-colors"
            >
              ✨ Rellenar con ejemplo
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="btn btn-ghost py-2.5 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs cursor-pointer transition-colors"
            >
              Borrar datos
            </button>
            <span className="hint text-[11px] text-stone-500 ml-auto hidden md:inline">
              La vista previa lleva marca de agua. Con tu código descargas el PDF limpio, listo para imprimir.
            </span>
          </div>
        </section>
      </div>

      {/* ESCENARIO / VISTA PREVIA EXACTA */}
      <main className="stage py-8 px-4 flex flex-col items-center gap-8">
        {isJoint ? (
          <div className="sheet-wrap w-full max-w-[794px]">
            <div className="sheet-label text-white font-bold text-sm tracking-wide mb-2 opacity-90 no-print">
              Carta conjunta ·{' '}
              {kids.map((k) => k.name.trim() || 'Niño/a').join(' y ')}
            </div>
            <LetterPreview
              key={`joint-${animKey}`}
              docId={docId}
              theme={theme}
              kids={kids}
              joint={true}
              date={date}
              parentSign={parentSign}
              watermarked={!licenseStatus?.valid}
              anim={true}
              sealIdx={0}
            />
          </div>
        ) : (
          kids.map((kid, idx) => (
            <div key={`ind-${idx}-${animKey}`} className="sheet-wrap w-full max-w-[794px]">
              <div className="sheet-label text-white font-bold text-sm tracking-wide mb-2 opacity-90 no-print flex items-center justify-between">
                <span>
                  Hoja {idx + 1} · {kid.name.trim() || `Niño/a ${idx + 1}`}
                </span>
                <span className="text-xs text-amber-300/80 font-normal">
                  Formato A4 (210 x 297 mm)
                </span>
              </div>
              <LetterPreview
                docId={docId}
                theme={theme}
                kids={[kid]}
                joint={false}
                date={date}
                parentSign={parentSign}
                watermarked={!licenseStatus?.valid}
                anim={true}
                sealIdx={idx}
              />
            </div>
          ))
        )}
      </main>
    </div>
  );
};
