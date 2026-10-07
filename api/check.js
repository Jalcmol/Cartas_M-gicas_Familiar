// api/check.js
// Endpoint Serverless universal (compatible con Vercel, Netlify Functions y Express)
// Valida un código de Gumroad sin consumir descargas y devuelve el saldo en Upstash Redis.

import { verifyGumroadLicense } from './_lib.js';
import { getLicenseRecord, isRedisConfigured } from './_store.js';

export default async function handler(req, res) {
  const isNetlify = !res || typeof res.status !== 'function';

  // Manejo de CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  const method = isNetlify ? req.method : req.method;
  if (method === 'OPTIONS') {
    if (isNetlify) return new Response(null, { status: 200, headers: corsHeaders });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const sendResponse = (statusCode, data) => {
    if (isNetlify) {
      return new Response(JSON.stringify(data), {
        status: statusCode,
        headers: corsHeaders,
      });
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(statusCode).json(data);
  };

  try {
    let cleanKey = '';
    if (isNetlify) {
      const url = new URL(req.url, 'http://localhost');
      cleanKey = url.searchParams.get('key') || '';
      if (!cleanKey && method === 'POST') {
        try {
          const body = await req.json();
          cleanKey = body?.licenseKey || body?.key || '';
        } catch (e) {}
      }
    } else {
      const raw = (req.method === 'POST' ? req.body?.licenseKey : req.query?.key) || '';
      cleanKey = String(raw).trim();
    }

    cleanKey = String(cleanKey).trim();

    if (!cleanKey) {
      return sendResponse(400, {
        valid: false,
        error: 'Por favor, proporciona un código de licencia válido de Gumroad.',
      });
    }

    // 1. Validar contra la API de Gumroad
    const gumroadResult = await verifyGumroadLicense(cleanKey);
    if (!gumroadResult.success) {
      return sendResponse(401, {
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
      return sendResponse(200, {
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

    const used = record.usedDownloads || 0;
    const remaining = Math.max(0, (record.totalDownloads || TOTAL_QUOTA) - used);
    const editsUsed = record.nameEditsCount || 0;
    const editsRemaining = Math.max(0, (record.maxNameEdits ?? MAX_EDITS) - editsUsed);

    return sendResponse(200, {
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
    return sendResponse(500, {
      valid: false,
      error: 'Error interno del servidor al verificar la licencia.',
    });
  }
}
