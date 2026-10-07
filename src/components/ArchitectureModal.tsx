import React, { useState } from 'react';
import { Copy, Check, Terminal, Database, ShieldAlert, Cpu, Sparkles, BookOpen } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'api_check' | 'api_pdf' | 'api_store' | 'api_lib' | 'gumroad' | 'deploy'>('overview');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 text-stone-100 rounded-xl border border-stone-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-['Cinzel',serif]">
                Arquitectura Técnica: Vercel Serverless + Upstash Redis + Gumroad
              </h2>
              <p className="text-xs text-stone-400">
                Archivos de producción listos para desplegar · Filosofía "Cero Timo"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-lg p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-stone-950/50 border-b border-stone-800 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: '1. Resumen y Flujo' },
            { id: 'api_check', label: 'api/check.js' },
            { id: 'api_pdf', label: 'api/pdf.js' },
            { id: 'api_store', label: 'api/_store.js' },
            { id: 'api_lib', label: 'api/_lib.js' },
            { id: 'gumroad', label: '2. Verificación Gumroad' },
            { id: 'deploy', label: '3. Pasos Despliegue' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido según pestaña */}
        <div className="p-6 overflow-y-auto flex-1 text-sm leading-relaxed text-stone-300 space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-lg text-amber-200">
                <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Filosofía de Negocio "Cero Timo" y Rentabilidad
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  A diferencia de servicios que cobran por cada carta individual o imponen caducidades de apenas unos días en enero, Cartas Mágicas ofrece un <strong>Pack de Acceso Total (10 descargas por 4,99 €)</strong>. El saldo se conserva todo el año, permitiendo amortizar la compra para el Ratoncito Pérez o la siguiente Navidad.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-800/40 border border-stone-800 rounded-lg">
                  <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" /> Protección Inteligente
                  </h5>
                  <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
                    <li>Cada compra se vincula en su primer uso a los nombres introducidos (hasta 6 niños por familia).</li>
                    <li>
                      <strong>Tolerancia a erratas leves:</strong> Cálculo de Levenshtein para "Lucia" vs "Lucía" o "Matheo" vs "Mateo" sin coste de edición.
                    </li>
                    <li>
                      Límite de <code className="text-amber-300">MAX_NAME_EDITS = 2</code> para evitar reventas masivas a grupos de 50 desconocidos.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-stone-800/40 border border-stone-800 rounded-lg">
                  <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-cyan-400" /> Rendimiento Serverless
                  </h5>
                  <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
                    <li>Upstash Redis REST API en Node.js 18+ nativo (sin dependencias npm pesadas).</li>
                    <li>Latencia sub-10ms para comprobaciones de licencia con <code className="text-amber-300">api/check.js</code>.</li>
                    <li>Renderizado limpio en <code className="text-amber-300">api/pdf.js</code> con tipografías Google Fonts y CSS para impresión A4 perfecta a 300 DPI.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api_check' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-stone-400 font-mono">api/check.js · Validador sin consumo de saldo</span>
                <button
                  onClick={() => handleCopy(`// api/check.js...`, 'check')}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded inline-flex items-center gap-1"
                >
                  {copied === 'check' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copiar
                </button>
              </div>
              <pre className="p-4 bg-stone-950 rounded-lg text-xs font-mono text-stone-300 overflow-x-auto border border-stone-800">
{`// api/check.js
import { verifyGumroadLicense } from './_lib.js';
import { getLicenseRecord } from './_store.js';

export default async function handler(req, res) {
  const licenseKey = (req.method === 'POST' ? req.body?.licenseKey : req.query?.key) || '';
  const cleanKey = String(licenseKey).trim();

  // 1. Validar contra la API de Gumroad
  const gumroadResult = await verifyGumroadLicense(cleanKey);
  if (!gumroadResult.success) {
    return res.status(401).json({ valid: false, error: gumroadResult.error });
  }

  // 2. Consultar el estado en Upstash Redis
  const record = await getLicenseRecord(cleanKey);
  const TOTAL_QUOTA = 10;
  const used = record?.usedDownloads || 0;

  return res.status(200).json({
    valid: true,
    totalDownloads: TOTAL_QUOTA,
    usedDownloads: used,
    remainingDownloads: Math.max(0, TOTAL_QUOTA - used),
    registeredChildren: record?.registeredChildren || [],
    nameEditsRemaining: Math.max(0, 2 - (record?.nameEditsCount || 0))
  });
}`}
              </pre>
            </div>
          )}

          {activeTab === 'api_pdf' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-stone-400 font-mono">api/pdf.js · Descuenta 1 descarga y entrega la carta limpia</span>
                <button
                  onClick={() => handleCopy(`// api/pdf.js...`, 'pdf')}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded inline-flex items-center gap-1"
                >
                  {copied === 'pdf' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copiar
                </button>
              </div>
              <pre className="p-4 bg-stone-950 rounded-lg text-xs font-mono text-stone-300 overflow-x-auto border border-stone-800">
{`// api/pdf.js
// 1. Valida licencia con Gumroad
// 2. Protege nombres de niños (hasta 6) y descuenta 1 descarga en Upstash Redis
// 3. Renderiza api/_render.html sin marcas de agua y sirve la carta oficial`}
              </pre>
            </div>
          )}

          {activeTab === 'api_store' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-stone-400 font-mono">api/_store.js · Conector Upstash Redis REST</span>
                <button
                  onClick={() => handleCopy(`// api/_store.js...`, 'store')}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded inline-flex items-center gap-1"
                >
                  {copied === 'store' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copiar
                </button>
              </div>
              <pre className="p-4 bg-stone-950 rounded-lg text-xs font-mono text-stone-300 overflow-x-auto border border-stone-800">
{`// api/_store.js
// Utiliza fetch() nativo de Node.js contra UPSTASH_REDIS_REST_URL.
// Cero dependencias npm para una inicialización fría instantánea en Vercel.`}
              </pre>
            </div>
          )}

          {activeTab === 'gumroad' && (
            <div className="space-y-3 text-xs">
              <h4 className="text-sm font-bold text-white">Integración Oficial con Gumroad v2</h4>
              <p className="text-stone-400">
                Gumroad proporciona el endpoint <code className="text-amber-300">POST https://api.gumroad.com/v2/licenses/verify</code>.
              </p>
              <div className="bg-stone-950 p-4 rounded-lg border border-stone-800 font-mono">
                {`curl -X POST https://api.gumroad.com/v2/licenses/verify \\
  -d "product_permalink=cartas-magicas-pack" \\
  -d "license_key=XXXX-XXXX-XXXX" \\
  -d "increment_uses_count=false"`}
              </div>
              <p className="text-stone-400">
                <strong>Clave técnica:</strong> Configuramos <code className="text-amber-300">increment_uses_count=false</code> porque la gestión granular del monedero (saldo restante, niños vinculados y correcciones ortográficas) la gestionamos en Upstash Redis con nuestra lógica de "Cero Timo".
              </p>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-3 text-xs">
              <h4 className="text-sm font-bold text-white">Pasos Rápidos de Despliegue (5 Minutos)</h4>
              <ol className="space-y-2 list-decimal list-inside text-stone-400">
                <li>
                  <strong className="text-stone-200">Crear base de datos en Upstash:</strong> Entra en <a href="https://console.upstash.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">Upstash Console</a>, crea una base de datos Redis gratuita (región Frankfurt/GCP Europa) y copia el <code className="text-amber-300">REST URL</code> y <code className="text-amber-300">REST TOKEN</code>.
                </li>
                <li>
                  <strong className="text-stone-200">Configurar producto en Gumroad:</strong> En tu panel de Gumroad, crea tu producto "Pack Cartas Mágicas (4,99 €)". En la pestaña de configuración, activa la opción <em>"Generate a unique license key per sale"</em>.
                </li>
                <li>
                  <strong className="text-stone-200">Variables de Entorno en Vercel:</strong> En el proyecto en Vercel (Settings &gt; Environment Variables), añade:
                  <div className="p-2 bg-stone-950 rounded mt-1 font-mono text-[11px] text-amber-300">
                    UPSTASH_REDIS_REST_URL=https://...upstash.io<br/>
                    UPSTASH_REDIS_REST_TOKEN=AX...<br/>
                    GUMROAD_PRODUCT_PERMALINK=cartas-magicas-pack
                  </div>
                </li>
                <li>
                  <strong className="text-stone-200">Desplegar:</strong> Ejecuta <code className="text-amber-300">vercel --prod</code> o conecta tu repositorio Git. Vercel detectará la carpeta <code className="text-amber-300">api/</code> y montará las Serverless Functions automáticamente.
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
