// api/_store.js
// Gestor de persistencia ultrarrápido para Vercel Serverless con Upstash Redis REST API.
// Compatible nativo con Node.js 18+ (cero dependencias de npm requeridas).

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Almacén en memoria volátil de respaldo para desarrollo local o cuando aún no se configuran las claves de Upstash
const memoryStore = new Map();

/**
 * Ejecuta un comando en Upstash Redis usando su API REST HTTP.
 * @param {Array<string|number>} commandArray - Ej: ['GET', 'license:ABC']
 */
async function runRedisCommand(commandArray) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return runMemoryCommand(commandArray);
  }

  try {
    const response = await fetch(`${UPSTASH_URL.replace(/\/$/, '')}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commandArray),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Redis Error ${response.status}]:`, errText);
      throw new Error(`Upstash Redis HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.warn('[Redis] Falló la conexión con Upstash, usando respaldo en memoria:', error.message);
    return runMemoryCommand(commandArray);
  }
}

/**
 * Respaldo en memoria para entorno de desarrollo local o fallas temporales.
 */
function runMemoryCommand(commandArray) {
  const [cmd, key, val] = commandArray;
  const upperCmd = String(cmd).toUpperCase();

  if (upperCmd === 'GET') {
    return memoryStore.has(key) ? memoryStore.get(key) : null;
  }
  if (upperCmd === 'SET') {
    memoryStore.set(key, typeof val === 'string' ? val : JSON.stringify(val));
    return 'OK';
  }
  if (upperCmd === 'DEL') {
    const existed = memoryStore.delete(key);
    return existed ? 1 : 0;
  }
  return null;
}

/**
 * Obtiene el registro de una licencia guardado en Redis.
 * @param {string} licenseKey 
 * @returns {Promise<Object|null>}
 */
export async function getLicenseRecord(licenseKey) {
  const clean = String(licenseKey).trim().toUpperCase();
  const raw = await runRedisCommand(['GET', `cm_lic:${clean}`]);
  if (!raw) return null;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    console.error('Error parseando JSON de licencia:', e);
    return null;
  }
}

/**
 * Guarda o actualiza el registro de una licencia en Redis.
 * @param {string} licenseKey 
 * @param {Object} data 
 */
export async function saveLicenseRecord(licenseKey, data) {
  const clean = String(licenseKey).trim().toUpperCase();
  const serialized = JSON.stringify(data);
  await runRedisCommand(['SET', `cm_lic:${clean}`, serialized]);
  return data;
}

export const isRedisConfigured = () => Boolean(UPSTASH_URL && UPSTASH_TOKEN);
