// src/services/upstashService.ts
// Conexión directa a Upstash Redis REST API desde el navegador (con soporte CORS nativo)
// Permite que la app funcione al 100% en Netlify (hosting gratuito estático) o Vercel sin requerir servidor backend.

import { LicenseStatus } from '../types';

const UPSTASH_URL = 'https://refined-sawfly-209108.upstash.io';
const UPSTASH_TOKEN = 'gQAAAAAAAzDUAAIgcDE5NmJmNTU4OGNlMWI0OWFlYjM2ZDE0YTU1NzYwZWRkNw';

const DEMO_KEYS = ['DEMO-FAMILIA-2026', 'DEMO-2026', 'DEMO-MAGIA', 'TEST-GUMROAD-KEY', 'DEMO'];
const TOTAL_QUOTA = 10;
const MAX_CHILDREN = 6;
const MAX_EDITS = 2;

/**
 * Ejecuta un comando en Upstash Redis via REST API
 */
async function runRedisCommand(commandArray: any[]): Promise<any> {
  try {
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commandArray),
    });

    if (!res.ok) {
      console.warn('[Upstash REST error]', res.status);
      return null;
    }

    const data = await res.json();
    return data.result;
  } catch (err) {
    console.warn('[Upstash Fetch error]', err);
    return null;
  }
}

/**
 * Consulta el estado de una licencia en Upstash Redis
 */
export async function verifyLicense(key: string): Promise<LicenseStatus> {
  const cleanKey = (key || '').trim().toUpperCase();

  if (!cleanKey) {
    return {
      valid: false,
      totalDownloads: 0,
      usedDownloads: 0,
      remainingDownloads: 0,
      registeredChildren: [],
      maxChildren: MAX_CHILDREN,
      nameEditsRemaining: 0,
      error: 'Por favor, introduce tu código de compra.',
    };
  }

  // Soporte de códigos de prueba y demostración
  const isDemo = DEMO_KEYS.includes(cleanKey) || cleanKey.startsWith('DEMO-');

  // Primero intentar consultar en Upstash Redis
  const rawRecord = await runRedisCommand(['GET', `license:${cleanKey}`]);

  let record: any = null;
  if (rawRecord) {
    try {
      record = typeof rawRecord === 'string' ? JSON.parse(rawRecord) : rawRecord;
    } catch (e) {
      record = null;
    }
  }

  const now = new Date().toISOString();

  if (!record) {
    // Si no existía, inicializamos un registro nuevo de 10 descargas
    record = {
      licenseKey: cleanKey,
      email: isDemo ? 'demo@cartas-magicas.es' : 'cliente@gumroad.com',
      registeredChildren: [],
      nameEditsCount: 0,
      maxNameEdits: MAX_EDITS,
      usedDownloads: 0,
      totalDownloads: TOTAL_QUOTA,
      firstUsedAt: now,
      lastUsedAt: now,
      isDemo,
    };

    // Guardar en Redis
    await runRedisCommand(['SET', `license:${cleanKey}`, JSON.stringify(record)]);
  }

  const used = record.usedDownloads || 0;
  const total = record.totalDownloads || TOTAL_QUOTA;
  const remaining = Math.max(0, total - used);
  const editsUsed = record.nameEditsCount || 0;
  const editsRemaining = Math.max(0, (record.maxNameEdits ?? MAX_EDITS) - editsUsed);

  return {
    valid: true,
    isNew: used === 0,
    email: record.email,
    totalDownloads: total,
    usedDownloads: used,
    remainingDownloads: remaining,
    registeredChildren: record.registeredChildren || [],
    maxChildren: MAX_CHILDREN,
    nameEditsRemaining: editsRemaining,
    isDemo,
    redisConnected: true,
  };
}

/**
 * Descuenta 1 descarga del monedero en Upstash Redis y registra los nombres de los niños
 */
export async function deductDownload(key: string, childNames: string[]): Promise<{
  success: boolean;
  remainingDownloads: number;
  usedDownloads: number;
  error?: string;
}> {
  const cleanKey = (key || '').trim().toUpperCase();
  const current = await verifyLicense(cleanKey);

  if (!current.valid) {
    return {
      success: false,
      remainingDownloads: 0,
      usedDownloads: 0,
      error: current.error || 'Licencia no válida',
    };
  }

  if (current.remainingDownloads <= 0) {
    return {
      success: false,
      remainingDownloads: 0,
      usedDownloads: current.usedDownloads,
      error: `Has utilizado todas las descargas (${current.totalDownloads} de ${current.totalDownloads}) de tu pack.`,
    };
  }

  // Actualizar registro en Upstash Redis
  const rawRecord = await runRedisCommand(['GET', `license:${cleanKey}`]);
  let record: any = null;
  if (rawRecord) {
    try {
      record = typeof rawRecord === 'string' ? JSON.parse(rawRecord) : rawRecord;
    } catch (e) {}
  }

  const now = new Date().toISOString();
  if (!record) {
    record = {
      licenseKey: cleanKey,
      registeredChildren: [],
      usedDownloads: 0,
      totalDownloads: TOTAL_QUOTA,
    };
  }

  // Registrar nuevos nombres respetando el límite de 6 niños
  const existingNames = new Set((record.registeredChildren || []).map((n: string) => n.toLowerCase().trim()));
  for (const name of childNames) {
    if (name && name.trim()) {
      const lower = name.toLowerCase().trim();
      if (!existingNames.has(lower) && (record.registeredChildren || []).length < MAX_CHILDREN) {
        record.registeredChildren = [...(record.registeredChildren || []), name.trim()];
        existingNames.add(lower);
      }
    }
  }

  record.usedDownloads = (record.usedDownloads || 0) + 1;
  record.lastUsedAt = now;

  // Persistir en Upstash Redis
  await runRedisCommand(['SET', `license:${cleanKey}`, JSON.stringify(record)]);

  const newRemaining = Math.max(0, (record.totalDownloads || TOTAL_QUOTA) - record.usedDownloads);

  return {
    success: true,
    remainingDownloads: newRemaining,
    usedDownloads: record.usedDownloads,
  };
}
