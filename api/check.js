// api/check.js
// Endpoint Serverless de Vercel para validar un código de Gumroad sin consumir descargas.
// Devuelve el estado actual de la licencia, saldo restante de descargas y nombres de niños vinculados.

import { verifyGumroadLicense } from './_lib.js';
import { getLicenseRecord, isRedisConfigured } from './_store.js';

export default async function handler(req, res) {
  // CORS básico y métodos permitidos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const licenseKey = (req.method === 'POST' ? req.body?.licenseKey : req.query?.key) || '';
    const cleanKey = String(licenseKey).trim();

    if (!cleanKey) {
      return res.status(400).json({
        valid: false,
        error: 'Por favor, proporciona un código de licencia válido de Gumroad.',
      });
    }

    // 1. Validar contra la API de Gumroad
    const gumroadResult = await verifyGumroadLicense(cleanKey);
    if (!gumroadResult.success) {
      return res.status(401).json({
        valid: false,
        error: gumroadResult.error || 'Código de licencia no válido o caducado.',
      });
    }

    // 2. Consultar el estado persistente en Upstash Redis
    const TOTAL_QUOTA = parseInt(process.env.TOTAL_DOWNLOADS_PER_PACK || '10', 10);
    const MAX_EDITS = parseInt(process.env.MAX_NAME_EDITS || '2', 10);
    const MAX_CHILDREN = parseInt(process.env.MAX_CHILDREN_PER_PACK || '6', 10);

    const record = await getLicenseRecord(cleanKey);

    if (!record) {
      // Licencia válida pero aún no utilizada (primer acceso)
      return res.status(200).json({
        valid: true,
        isNew: true,
        email: gumroadResult.purchase?.email || null,
        totalDownloads: TOTAL_QUOTA,
        usedDownloads: 0,
        remainingDownloads: TOTAL_QUOTA,
        registeredChildren: [],
        maxChildren: MAX_CHILDREN,
        nameEditsRemaining: MAX_EDITS,
        isDemo: gumroadResult.isDemo || false,
        redisConnected: isRedisConfigured(),
      });
    }

    // Licencia con historial registrado
    const used = record.usedDownloads || 0;
    const remaining = Math.max(0, (record.totalDownloads || TOTAL_QUOTA) - used);
    const editsUsed = record.nameEditsCount || 0;
    const editsRemaining = Math.max(0, (record.maxNameEdits ?? MAX_EDITS) - editsUsed);

    return res.status(200).json({
      valid: true,
      isNew: false,
      email: record.email || gumroadResult.purchase?.email,
      totalDownloads: record.totalDownloads || TOTAL_QUOTA,
      usedDownloads: used,
      remainingDownloads: remaining,
      registeredChildren: record.registeredChildren || [],
      maxChildren: MAX_CHILDREN,
      nameEditsRemaining: editsRemaining,
      firstUsedAt: record.firstUsedAt,
      lastUsedAt: record.lastUsedAt,
      isDemo: gumroadResult.isDemo || false,
      redisConnected: isRedisConfigured(),
    });
  } catch (err) {
    console.error('[api/check Error]:', err);
    return res.status(500).json({
      valid: false,
      error: 'Error interno del servidor al verificar la licencia. Inténtalo de nuevo.',
    });
  }
}
