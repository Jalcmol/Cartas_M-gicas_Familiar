// api/pdf.js
// Endpoint Serverless de Vercel para generar la Carta Mágica limpia
// con el sistema visual exacto de 12 temas, esquinas ornamentales y sellos oficiales

import fs from 'fs';
import path from 'path';
import { calculateLevenshtein, normalizeName, sanitizeHtml, verifyGumroadLicense } from './_lib.js';
import { getLicenseRecord, saveLicenseRecord } from './_store.js';

const TOTAL_QUOTA = parseInt(process.env.TOTAL_DOWNLOADS_PER_PACK || '10', 10);
const MAX_EDITS = parseInt(process.env.MAX_NAME_EDITS || '2', 10);
const MAX_CHILDREN = 6;

const CRESTS = {
  reyes: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M3 18.5 2 7.5l5.2 4.3L12 4l4.8 7.8L22 7.5l-1 11z" fill="currentColor" fill-opacity=".14"/><path d="M3.5 21h17"/><circle cx="12" cy="3.4" r="1" fill="currentColor"/><circle cx="2" cy="6.6" r="1" fill="currentColor"/><circle cx="22" cy="6.6" r="1" fill="currentColor"/></svg>`,
  santa: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"><path d="M4 18c0-7 4-13 12-14 1.5 3 1 6-1 8l5 6z" fill="currentColor" fill-opacity=".14"/><path d="M3 18.5h18v2.6H3z" fill="currentColor" fill-opacity=".3"/><circle cx="18" cy="4" r="2" fill="currentColor"/></svg>`,
  diploma: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><circle cx="12" cy="9.5" r="6.5" fill="currentColor" fill-opacity=".12"/><path d="m12 5.2 1.3 2.7 3 .4-2.2 2.1.6 3L12 11.9 9.3 13.4l.6-3L7.7 8.3l3-.4z" fill="currentColor"/><path d="M8.2 15 6.5 22l5.5-2.6 5.5 2.6-1.7-7"/></svg>`,
  ratoncito: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.8" cy="7.6" r="3.4" fill="currentColor" fill-opacity=".16"/><circle cx="17.2" cy="7.6" r="3.4" fill="currentColor" fill-opacity=".16"/><ellipse cx="12" cy="14" rx="7" ry="6" fill="currentColor" fill-opacity=".1"/><circle cx="9.4" cy="12.6" r=".9" fill="currentColor"/><circle cx="14.6" cy="12.6" r=".9" fill="currentColor"/><circle cx="12" cy="15" r="1" fill="currentColor"/><path d="M11 17.2h2v2h-2z" fill="#fff" fill-opacity=".9"/><path d="M5 14.6 1.6 14M5 16l-3 1.4M19 14.6l3.4-.6M19 16l3 1.4"/></svg>`,
  hada: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13c-5-7-10-6-9.4-1.6C3.2 15 8 15.4 12 13z" fill="currentColor" fill-opacity=".14"/><path d="M12 13c5-7 10-6 9.4-1.6C20.8 15 16 15.4 12 13z" fill="currentColor" fill-opacity=".14"/><path d="M12 13c-3 2-4 5-3.4 8M12 13c3 2 4 5 3.4 8" opacity=".7"/><path d="m12 2.4.9 1.9 2 .3-1.5 1.4.4 2L12 7l-1.8 1 .4-2-1.5-1.4 2-.3z" fill="currentColor"/></svg>`,
  olentzero: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="8.5" rx="8.4" ry="3.8" fill="currentColor" fill-opacity=".16"/><path d="M12 4.7V3.2"/><path d="M6.2 11.6c.8 4.4 3 6.9 5.8 6.9s5-2.5 5.8-6.9" fill="currentColor" fill-opacity=".08"/><circle cx="9.6" cy="13.4" r=".8" fill="currentColor"/><circle cx="14.4" cy="13.4" r=".8" fill="currentColor"/><path d="M10 16.6c1.3.9 2.7.9 4 0"/><path d="M15.6 18.4h3.4a2 2 0 0 1 0 4h-1"/></svg>`,
  tio: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.4" y="9" width="15" height="9" rx="4.4" fill="currentColor" fill-opacity=".14"/><path d="M6 9.4v-1.8M6 18.4v2M13 18.4v2"/><circle cx="19.2" cy="13.6" r="3" fill="currentColor" fill-opacity=".1"/><circle cx="18.4" cy="12.8" r=".6" fill="currentColor"/><circle cx="20.2" cy="12.8" r=".6" fill="currentColor"/><path d="M18.2 14.6c.6.5 1.4.5 2 0"/><path d="M16.6 11.4c.4-2.6 4-2.6 5.2 0z" fill="currentColor" fill-opacity=".5"/></svg>`,
  elfo: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.4 17.4 12H6.6z" fill="currentColor" fill-opacity=".16"/><circle cx="12" cy="2.6" r="1.1" fill="currentColor"/><path d="M6.4 12.8h11.2"/><circle cx="12" cy="16.4" r="4.4" fill="currentColor" fill-opacity=".08"/><path d="M7.8 15.4 4.4 13.6l1.8 4.2M16.2 15.4l3.4-1.8-1.8 4.2"/><circle cx="10.4" cy="15.8" r=".7" fill="currentColor"/><circle cx="13.6" cy="15.8" r=".7" fill="currentColor"/><path d="M10.6 18.2c.9.6 1.9.6 2.8 0"/></svg>`,
};

const CORNER_SVGS = {
  classic: `<svg class="corner %c" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 56V14C3 7.4 7.4 3 14 3h42"/><path d="M10 40V19c0-5 4-9 9-9h21"/><path d="M17 3c0 8-4 12-14 14" opacity=".6"/><circle cx="14" cy="14" r="2.6" fill="currentColor" stroke="none"/><circle cx="52" cy="3" r="1.4" fill="currentColor" stroke="none"/><circle cx="3" cy="52" r="1.4" fill="currentColor" stroke="none"/></svg>`,
  deco: `<svg class="corner %c" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square"><path d="M3 3H40M3 3V40"/><path d="M9 9H30M9 9V30"/><path d="M3 22 22 3M3 32 32 3M3 42 42 3" opacity=".75"/><rect x="1" y="1" width="5" height="5" fill="currentColor" transform="rotate(45 3.5 3.5)"/></svg>`,
};

function generateSealSvg(text, idx = 0) {
  const cx = 60, cy = 60, n = 28, pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? 52.5 : 57.5;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push((cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2));
  }
  return `<svg class="seal" viewBox="0 0 120 120" role="img" aria-label="Sello oficial">
    <polygon points="${pts.join(' ')}" fill="var(--seal)"/>
    <circle cx="60" cy="60" r="47" fill="none" stroke="var(--seal-ink)" stroke-width="1.2" opacity=".9"/>
    <circle cx="60" cy="60" r="30" fill="none" stroke="var(--seal-ink)" stroke-width="1" opacity=".9"/>
    <defs><path id="sealPath${idx}" d="M60,60 m-36.5,0 a36.5,36.5 0 1,1 73,0 a36.5,36.5 0 1,1 -73,0"/></defs>
    <text font-family="Cinzel, serif" font-weight="700" font-size="7.6" fill="var(--seal-ink)">
      <textPath href="#sealPath${idx}" textLength="226" lengthAdjust="spacing">${text}</textPath>
    </text>
    <text x="60" y="69.5" text-anchor="middle" font-size="26" fill="var(--seal-ink)">★</text>
  </svg>`;
}

const esc = (s) =>
  String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));

const nl = (s) => esc(s).replace(/\n/g, '<br>');
const nm = (k) => (k.name ? k.name.trim() : 'Pequeño Tesoro');

function longDate(iso) {
  if (!iso) return '';
  const parts = iso.split('-').map(Number);
  if (!parts[0]) return '';
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function joinNames(kids) {
  const n = kids.map(nm);
  return n.length < 2 ? n[0] : n.slice(0, -1).join(', ') + ' y ' + n[n.length - 1];
}

function hlOf(k, joint) {
  const t = (k.achv || '').trim();
  if (t) return `<span class="hl">${esc(t)}</span>`;
  return `<span class="hl">${joint ? 'un comportamiento y un corazón maravillosos' : 'tu buen comportamiento y tu gran corazón'}</span>`;
}

const extraP = (k) => (k.extra && k.extra.trim() ? `<p>${nl(k.extra.trim())}</p>` : '');

const kidLines = (kids) =>
  kids
    .map(
      (k) =>
        `<p class="kidline"><span class="kn">${esc(nm(k))}:</span> ${hlOf(k, true)}.${k.extra && k.extra.trim() ? ' ' + nl(k.extra.trim()) : ''}</p>`
    )
    .join('');

const letter = (greet, paras, close) =>
  '<div class="letter"><div class="greet">' +
  greet +
  '</div>' +
  paras
    .filter(Boolean)
    .map((p) => (p.charAt(0) === '<' ? p : '<p>' + p + '</p>'))
    .join('') +
  '<div class="close">' +
  close +
  '</div></div>';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });

  try {
    const { key, licenseKey, only, state } = req.body || {};
    const finalKey = String(key || licenseKey || '').trim();

    if (!finalKey) return res.status(400).json({ error: 'Se requiere código de compra Gumroad.' });

    // 1. Validar licencia con Gumroad
    const gumroad = await verifyGumroadLicense(finalKey);
    if (!gumroad.success) return res.status(401).json({ error: gumroad.error });

    // 2. Extraer datos del estado
    const docId = state?.doc || 'reyes';
    const themeId = state?.theme || 'pergamino';
    const mode = state?.mode || 'individual';
    const rawKids = Array.isArray(state?.kids) && state.kids.length ? state.kids : [{ name: 'Lucía', achv: '', extra: '', treat: 'Querida' }];
    const isoDate = state?.date || new Date().toISOString().slice(0, 10);
    const parentSign = state?.sign || 'Mamá y Papá';

    const joint = mode === 'joint' && rawKids.length > 1;
    const activeKids = (!joint && Number.isInteger(only) && rawKids[only]) ? [rawKids[only]] : rawKids;
    const childNames = activeKids.map((k) => k.name.trim()).filter(Boolean);

    // 3. Upstash Redis: Comprobar y descontar descargas
    let record = await getLicenseRecord(finalKey);
    const now = new Date().toISOString();

    if (!record) {
      record = {
        licenseKey: finalKey.toUpperCase(),
        email: gumroad.purchase?.email || 'cliente@gumroad.com',
        registeredChildren: childNames,
        nameEditsCount: 0,
        maxNameEdits: MAX_EDITS,
        usedDownloads: 0,
        totalDownloads: TOTAL_QUOTA,
        downloadHistory: [],
        firstUsedAt: now,
        lastUsedAt: now,
      };
    }

    const used = record.usedDownloads || 0;
    const total = record.totalDownloads || TOTAL_QUOTA;
    const remaining = Math.max(0, total - used);

    if (remaining <= 0) {
      return res.status(403).json({
        error: `Has consumido todas las descargas (${total} de ${total}) de tu pack.`,
      });
    }

    // Registrar niños respetando límite de 6 y tolerancia Levenshtein
    let regList = [...(record.registeredChildren || [])];
    for (const cName of childNames) {
      if (!cName) continue;
      const norm = normalizeName(cName);
      const match = regList.findIndex((n) => normalizeName(n) === norm);
      if (match >= 0) {
        regList[match] = cName;
      } else if (regList.length < MAX_CHILDREN) {
        regList.push(cName);
      }
    }

    record.registeredChildren = regList;
    record.usedDownloads = used + 1;
    record.lastUsedAt = now;
    record.downloadHistory.push({
      timestamp: now,
      docId,
      themeId,
      names: childNames,
    });
    await saveLicenseRecord(finalKey, record);

    // 4. Compilar plantilla HTML limpia
    const templatePath = path.join(process.cwd(), 'api', '_render.html');
    let templateHtml = fs.readFileSync(templatePath, 'utf8');

    // Construcción del contenido
    const k = activeKids[0];
    const treatJ = activeKids.every((x) => x.treat === 'Querida') ? 'Queridas' : 'Queridos';

    let kicker = 'Correo Real de Oriente';
    let title = 'Carta de los Reyes Magos';
    let script = 'Desde Oriente, con ilusión';
    let sealText = 'CORREO REAL DE ORIENTE ✦ ';
    let dateCap = 'Escrito el';
    let sigCap = 'Sus Majestades';
    let sig = 'Melchor, Gaspar y Baltasar';
    let sigSmall = true;
    let bodyHtml = '';

    if (docId === 'santa') {
      kicker = 'Taller Oficial del Polo Norte';
      title = 'Carta de Papá Noel';
      script = '¡Jo, jo, jo!';
      sealText = 'TALLER OFICIAL DEL POLO NORTE ✦ ';
      sigCap = 'Desde el Polo Norte';
      sig = 'Papá Noel';
      sigSmall = false;
      bodyHtml = joint
        ? letter(treatJ + ' ' + esc(joinNames(activeKids)) + ',', [
            '¡Jo, jo, jo! Os escribo desde mi taller en el Polo Norte, donde los elfos no paran de envolver regalos y los renos ya están practicando para el gran viaje.',
            'Mi lista de niños buenos acaba de llegar y vuestros nombres brillan en ella con estrellas doradas.',
            kidLines(activeKids),
            'Esta Nochebuena dejadme leche y galletas junto al árbol, y acostaos pronto, que Rudolph no espera. ¡Estoy muy orgulloso de todos vosotros!',
          ], 'Con mucho cariño desde el Polo Norte')
        : letter(esc(k.treat) + ' ' + esc(nm(k)) + ',', [
            '¡Jo, jo, jo! Te escribo desde mi taller en el Polo Norte, donde los elfos no paran de envolver regalos y los renos ya están practicando para el gran viaje.',
            'Mi lista de niños buenos acaba de llegar y, ¿a que no adivinas? Tu nombre brilla en ella con una estrella dorada, porque ' + hlOf(k) + '. ¡Estoy muy orgulloso de ti!',
            extraP(k),
            'Esta Nochebuena déjame un vaso de leche y unas galletas junto al árbol, y acuéstate pronto, que Rudolph no espera. Recuerda: lo más importante de la Navidad es compartirla con quienes más quieres.',
          ], 'Con mucho cariño desde el Polo Norte');
    } else if (docId === 'ratoncito') {
      kicker = 'Casa del Ratoncito Pérez';
      title = 'Carta del Ratoncito Pérez';
      script = 'Con un abrazo de bigotes';
      sealText = 'CASA DEL RATONCITO PÉREZ ✦ ';
      sigCap = 'Tu amigo de los dientes';
      sig = 'Ratoncito Pérez';
      sigSmall = false;
      bodyHtml = joint
        ? letter(treatJ + ' ' + esc(joinNames(activeKids)) + ',', [
            'Soy el Ratoncito Pérez y os escribo desde mi casita, entre libros y cajitas llenas de dientes de leche. Me han llegado noticias estupendas de vuestras sonrisas.',
            kidLines(activeKids),
            'Guardad vuestros dientes en una cajita bajo la almohada y dormid tranquilos: vendré de puntillas a recogerlos y os dejaré un pequeño regalo a cada uno.',
          ], 'Con un abrazo de bigotes')
        : letter(esc(k.treat) + ' ' + esc(nm(k)) + ',', [
            'Soy el Ratoncito Pérez y te escribo desde mi casita, entre libros y cajitas llenas de dientes de leche. Esta noche me ha llegado el aviso más importante de todos: ¡se te ha caído un diente!',
            'Mis ayudantes me han contado que ' + hlOf(k) + '. Eso me ha puesto muy contento, porque solo visito a los niños que cuidan su sonrisa y tienen un corazón valiente.',
            extraP(k),
            'Guarda tu diente en una cajita bajo la almohada y duerme tranquilo. Mientras sueñas, vendré de puntillas a recogerlo para construir con él un rinconcito de mi palacio de dientes, y a cambio te dejaré un pequeño regalo.',
          ], 'Con un abrazo de bigotes');
    } else {
      // reyes
      bodyHtml = joint
        ? letter(treatJ + ' ' + esc(joinNames(activeKids)) + ',', [
            'Desde las lejanas tierras de Oriente, siguiendo el rastro de la estrella más brillante, os escribimos estas líneas antes de que nuestros camellos emprendan el largo viaje hasta vuestra casa.',
            'Nuestros pajes reales nos han contado cosas maravillosas de cada uno de vosotros:',
            kidLines(activeKids),
            'En la noche mágica de Reyes, preparad vuestros zapatos, dejadlos limpios y bien visibles, y no olvidéis un poco de agua para nuestros camellos. Seguid siendo así de especiales: la magia solo visita los hogares donde hay ilusión.',
          ], 'Con todo nuestro cariño y bendiciones')
        : letter(esc(k.treat) + ' ' + esc(nm(k)) + ',', [
            'Desde las lejanas tierras de Oriente, siguiendo el rastro de la estrella más brillante, te escribimos estas líneas antes de que nuestros camellos emprendan el largo viaje hasta tu casa.',
            'Nuestros pajes reales nos han contado algo maravilloso: ' + hlOf(k) + '. Eso demuestra un corazón grande y generoso, y los Reyes Magos lo valoramos más que todo el oro, el incienso y la mirra que guardamos en nuestros cofres.',
            extraP(k),
            'En la noche mágica de Reyes, prepara tus zapatos, déjalos limpios y bien visibles, y no olvides un poco de agua para nuestros camellos, que llegan muy cansados. Sigue siendo así de especial: la magia solo visita los hogares donde hay ilusión.',
          ], 'Con todo nuestro cariño y bendiciones');
    }

    const cornersTmpl = (themeId === 'deco') ? CORNER_SVGS.deco : (themeId === 'pergamino' || themeId === 'rojo' || themeId === 'azul') ? CORNER_SVGS.classic : '';
    const cornersHtml = cornersTmpl ? ['c1', 'c2', 'c3', 'c4'].map((p) => cornersTmpl.replace('%c', p)).join('') : '';

    const finalHtml = templateHtml
      .replace(/\{\{THEME_ID\}\}/g, themeId)
      .replace(/\{\{CORNERS_HTML\}\}/g, cornersHtml)
      .replace(/\{\{CREST_SVG\}\}/g, CRESTS[docId] || CRESTS.reyes)
      .replace(/\{\{KICKER_TEXT\}\}/g, kicker)
      .replace(/\{\{TITLE_TEXT\}\}/g, title)
      .replace(/\{\{SCRIPT_TEXT\}\}/g, script)
      .replace(/\{\{DIPLOMA_CLASS\}\}/g, docId === 'diploma' ? 'diploma' : '')
      .replace(/\{\{BODY_HTML\}\}/g, bodyHtml)
      .replace(/\{\{DATE_TEXT\}\}/g, longDate(isoDate))
      .replace(/\{\{DATE_CAP\}\}/g, dateCap)
      .replace(/\{\{SEAL_SVG\}\}/g, generateSealSvg(sealText, 0))
      .replace(/\{\{SIG_STYLE\}\}/g, sigSmall ? 'style="font-size:2.5cqw"' : '')
      .replace(/\{\{SIG_NAME\}\}/g, sig)
      .replace(/\{\{SIG_CAP\}\}/g, sigCap);

    const newRemaining = Math.max(0, total - record.usedDownloads);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Remaining', String(newRemaining));
    return res.status(200).send(finalHtml);
  } catch (err) {
    console.error('[api/pdf Error]:', err);
    return res.status(500).json({ error: 'Error al generar la carta.' });
  }
}
