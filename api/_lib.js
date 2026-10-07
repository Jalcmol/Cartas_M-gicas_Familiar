// api/_lib.js
// Utilidades de verificación de Gumroad, normalización lingüística y protección inteligente de nombres

const GUMROAD_VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';
const DEMO_KEYS = ['DEMO-FAMILIA-2026', 'MAGIA-REYES-2026', 'TEST-GUMROAD-KEY'];

/**
 * Normaliza nombres para comparación insensible a mayúsculas y acentos
 */
export function normalizeName(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Calcula la distancia de Levenshtein para detectar erratas leves (ej: Lucia vs Lucía)
 */
export function calculateLevenshtein(a, b) {
  const s1 = normalizeName(a);
  const s2 = normalizeName(b);
  if (s1 === s2) return 0;
  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;

  const matrix = [];
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // sustitución
          matrix[i][j - 1] + 1,     // inserción
          matrix[i - 1][j] + 1      // eliminación
        );
      }
    }
  }
  return matrix[s2.length][s1.length];
}

/**
 * Escapa texto plano para inyección segura en HTML
 */
export function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Verifica una licencia con la API v2 de Gumroad.
 * Incluye tolerancia para claves de demostración en desarrollo/pruebas.
 */
export async function verifyGumroadLicense(licenseKey) {
  const cleanKey = String(licenseKey || '').trim();
  if (!cleanKey) {
    return { success: false, error: 'Por favor, introduce tu código de licencia de Gumroad.' };
  }

  // Soporte para claves demo/test sin necesidad de compra real durante pruebas
  const upperKey = cleanKey.toUpperCase();
  if (DEMO_KEYS.includes(upperKey) || upperKey.startsWith('DEMO-')) {
    return {
      success: true,
      isDemo: true,
      purchase: {
        email: 'familia.demo@ejemplo.es',
        variants: 'Pack Total 10 Descargas',
        refunded: false,
        chargebacked: false,
      },
    };
  }

  const permalink = process.env.GUMROAD_PRODUCT_PERMALINK || 'cartas-magicas-pack';
  const productId = process.env.GUMROAD_PRODUCT_ID;

  try {
    const params = new URLSearchParams();
    if (productId) {
      params.append('product_id', productId);
    } else {
      params.append('product_permalink', permalink);
    }
    params.append('license_key', cleanKey);
    params.append('increment_uses_count', 'false'); // Controlamos el monedero en Upstash

    const response = await fetch(GUMROAD_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'CartasMagicas-Verifier/2.0',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const msg = data.message || 'Código de licencia no válido o no encontrado en Gumroad.';
      return { success: false, error: msg };
    }

    // Validación rigurosa de reembolsos y contracargos
    const purchase = data.purchase || {};
    if (purchase.refunded) {
      return { success: false, error: 'Esta licencia fue reembolsada y ha quedado desactivada.' };
    }
    if (purchase.chargebacked) {
      return { success: false, error: 'Esta licencia tiene un contracargo asociado y no es válida.' };
    }

    return {
      success: true,
      isDemo: false,
      uses: data.uses || 0,
      purchase: {
        email: purchase.email,
        variants: purchase.variants,
        refunded: false,
        chargebacked: false,
        created_at: purchase.created_at,
      },
    };
  } catch (err) {
    console.error('[Gumroad Verify Error]:', err);
    return {
      success: false,
      error: 'Error temporal al conectar con Gumroad. Por favor, reintenta en unos instantes.',
    };
  }
}
