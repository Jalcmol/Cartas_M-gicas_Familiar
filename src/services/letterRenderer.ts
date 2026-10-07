// src/services/letterRenderer.ts
// Motor de renderizado de Cartas Mágicas oficiales para impresión A4 de alta definición (300 DPI)
// Genera el documento HTML completo y autosuficiente sin marcas de agua ni scripts externos.

import { ChildProfile, DocumentId, ThemeInfo } from '../types';
import { CORNER_SVGS, DOCUMENTS, buildLetterContent, generateSealSvg } from '../data/letterTemplates';

/**
 * Genera el HTML de una hoja de carta limpia en formato A4
 */
export function renderCleanSheetHtml(
  docId: DocumentId,
  theme: ThemeInfo,
  kids: ChildProfile[],
  joint: boolean,
  date: string,
  parentSign: string = '',
  sealIdx: number = 0
): string {
  const content = buildLetterContent(docId, kids, joint, date, parentSign);

  let cornersHtml = '';
  if (theme.corner === 'classic' || theme.corner === 'deco') {
    const tmpl = CORNER_SVGS[theme.corner];
    if (tmpl) {
      cornersHtml = ['c1', 'c2', 'c3', 'c4']
        .map((pos) => tmpl.replace('%c', pos))
        .join('');
    }
  }

  const sealHtml = generateSealSvg(content.seal, sealIdx);

  return `
    <article class="sheet" data-theme="${theme.id}">
      <div class="frame"></div>
      ${cornersHtml ? `<div class="corners-wrap">${cornersHtml}</div>` : ''}
      <div class="inner">
        <div class="crest-wrap">${content.icon}</div>
        <div class="kicker">${content.kicker}</div>
        <h2 class="title">${content.title}</h2>
        <div class="script">${content.script}</div>
        <div class="divider">
          <i></i><span>✦</span><i></i>
        </div>
        <div class="body ${content.diploma ? 'diploma' : ''}">${content.body}</div>
        <div class="footer">
          <div class="f-block">
            <div class="val">${content.date || '—'}</div>
            <div class="cap">${content.dateCap}</div>
          </div>
          <div class="seal-wrap">${sealHtml}</div>
          <div class="f-block sig">
            <div class="val" ${content.sigSmall ? 'style="font-size:2.5cqw"' : ''}>${content.sig}</div>
            <div class="cap">${content.sigCap}</div>
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * Genera el documento HTML completo e independiente, listo para imprimir en A4
 */
export function generateFullPrintableHtml(
  sheets: string[],
  docTitle: string = 'Carta Mágica Oficial'
): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Cinzel+Decorative:wght@700&family=Great+Vibes&family=Marcellus&family=Meddon&family=Montserrat:wght@400;600;700&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Quicksand:wght@500;600;700&family=Special+Elite&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      background: #f0ede6;
      font-family: 'Quicksand', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 12px;
      gap: 32px;
      min-height: 100vh;
    }

    /* BARRA SUPERIOR DE ACCIONES (NO SE IMPRIME) */
    .print-actions {
      position: sticky;
      top: 12px;
      z-index: 100;
      background: #1c2540;
      color: #fff;
      padding: 12px 24px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      font-family: system-ui, -apple-system, sans-serif;
    }

    .print-btn {
      background: linear-gradient(135deg, #c8202d, #8f0e18);
      color: #fff;
      border: none;
      padding: 8px 18px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.15s ease;
    }
    .print-btn:hover {
      transform: scale(1.04);
    }

    /* FORMATO DE HOJA A4 */
    .sheet {
      --script-font: 'Pinyon Script', cursive;
      --body-font: 'Quicksand', sans-serif;
      --kicker-font: 'Cinzel', serif;
      --title-font: 'Cinzel', serif;
      --body-size: 2.3cqw;
      --body-weight: 500;
      --lh: 1.62;
      --title-size: 5.4cqw;
      --title-case: uppercase;
      --title-weight: 700;
      --title-spacing: .04em;
      --title-style: normal;

      position: relative;
      width: 210mm;
      max-width: 100%;
      height: 296mm;
      max-height: 296mm;
      aspect-ratio: 210 / 297;
      container-type: inline-size;
      overflow: hidden;
      background: var(--paper);
      color: var(--ink);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
      font-family: var(--body-font);
      box-sizing: border-box;
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-after: page;
      break-after: page;
    }

    .sheet:last-child,
    .sheet:last-of-type {
      page-break-after: avoid;
      break-after: avoid;
    }

    .frame {
      position: absolute;
      inset: 3.2cqw;
      border: .4cqw solid var(--accent);
      pointer-events: none;
    }
    .frame::after {
      content: "";
      position: absolute;
      inset: .9cqw;
      border: .15cqw solid var(--accent2);
    }

    .corner {
      position: absolute;
      width: 11cqw;
      height: 11cqw;
      color: var(--accent);
      z-index: 2;
      pointer-events: none;
    }
    .c1 { top: 2.2cqw; left: 2.2cqw; }
    .c2 { top: 2.2cqw; right: 2.2cqw; transform: scaleX(-1); }
    .c3 { bottom: 2.2cqw; left: 2.2cqw; transform: scaleY(-1); }
    .c4 { bottom: 2.2cqw; right: 2.2cqw; transform: scale(-1, -1); }

    .inner {
      position: absolute;
      inset: 6.5cqw 8cqw 6.2cqw;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      z-index: 3;
    }

    .crest {
      width: 8.5cqw;
      height: 8.5cqw;
      color: var(--accent);
      margin-bottom: 1cqw;
      flex: none;
    }

    .kicker {
      font-family: var(--kicker-font);
      font-size: 1.55cqw;
      letter-spacing: .32em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 600;
    }

    .title {
      font-family: var(--title-font);
      font-weight: var(--title-weight);
      font-style: var(--title-style);
      font-size: var(--title-size);
      letter-spacing: var(--title-spacing);
      text-transform: var(--title-case);
      line-height: 1.1;
      margin: .6cqw 0 .3cqw;
      color: var(--ink);
    }

    .script {
      font-family: var(--script-font);
      font-size: 4cqw;
      color: var(--accent);
      margin-bottom: .6cqw;
      line-height: 1.05;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 1.8cqw;
      width: 58%;
      margin: .4cqw 0 1.8cqw;
      color: var(--accent);
      opacity: .85;
    }
    .divider i {
      flex: 1;
      height: .14cqw;
      background: currentColor;
    }
    .divider span {
      font-size: 1.5cqw;
    }

    .body {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: var(--body-size);
      font-weight: var(--body-weight);
      line-height: var(--lh);
      color: var(--ink);
      text-align: justify;
      hyphens: auto;
    }
    .body p {
      margin: 0 0 .9cqw;
    }
    .body p:last-child {
      margin-bottom: 0;
    }
    .body .greet {
      font-family: var(--title-font);
      font-weight: 700;
      font-size: 1.18em;
      color: var(--accent);
      margin-bottom: .9cqw;
      text-align: left;
    }
    .body .close {
      margin-top: .9cqw;
      font-style: italic;
      text-align: right;
    }
    .body .hl {
      color: var(--accent);
      font-weight: 700;
    }
    .body .kidline {
      margin-bottom: .6cqw;
      padding-left: 2cqw;
      border-left: .25cqw solid var(--accent);
      text-align: left;
    }
    .body .kidline .kn {
      font-weight: 700;
      color: var(--accent);
    }

    .footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      width: 100%;
      margin-top: 1.4cqw;
      padding-top: 1.2cqw;
      border-top: .15cqw dashed var(--accent);
      opacity: .95;
    }
    .f-block {
      text-align: left;
      flex: 1;
    }
    .f-block.sig {
      text-align: right;
    }
    .f-block .val {
      font-family: var(--title-font);
      font-weight: 700;
      font-size: 1.9cqw;
      color: var(--accent);
      line-height: 1.2;
    }
    .f-block .cap {
      font-size: 1.18cqw;
      text-transform: uppercase;
      letter-spacing: .2em;
      opacity: .65;
      margin-top: .2cqw;
    }

    .seal-wrap {
      flex: none;
      margin: 0 2cqw;
    }
    .seal {
      width: 14cqw;
      height: 14cqw;
      display: block;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, .25));
    }

    /* VARIABLES DE TEMAS */
    [data-theme="pergamino"] {
      --paper: #f8f1de;
      --ink: #3b2816;
      --accent: #8b261b;
      --accent2: #b8860b;
      --seal: #8b181b;
      --seal-ink: #f8f1de;
    }
    [data-theme="rojo"] {
      --paper: #fffaf3;
      --ink: #2a201c;
      --accent: #a8111c;
      --accent2: #1e4d2b;
      --seal: #a8111c;
      --seal-ink: #fffaf3;
    }
    [data-theme="azul"] {
      --paper: #0c1c38;
      --ink: #f0f4fc;
      --accent: #d4af37;
      --accent2: #5b8cd6;
      --seal: #d4af37;
      --seal-ink: #0c1c38;
    }
    [data-theme="nordico"] {
      --paper: #fbfaf6;
      --ink: #1a2421;
      --accent: #3d5a4f;
      --accent2: #c48259;
      --seal: #3d5a4f;
      --seal-ink: #fbfaf6;
    }
    [data-theme="bosque"] {
      --paper: #0d281e;
      --ink: #f0f7f3;
      --accent: #d4af37;
      --accent2: #48a97c;
      --seal: #d4af37;
      --seal-ink: #0d281e;
    }
    [data-theme="infantil"] {
      --paper: #fffef7;
      --ink: #2b2b2b;
      --accent: #e63946;
      --accent2: #457b9d;
      --seal: #e63946;
      --seal-ink: #fffef7;
      --body-font: 'Quicksand', sans-serif;
    }
    [data-theme="deco"] {
      --paper: #0f0f12;
      --ink: #f4edd4;
      --accent: #d4af37;
      --accent2: #997b24;
      --seal: #d4af37;
      --seal-ink: #0f0f12;
    }
    [data-theme="acuarela"] {
      --paper: #f8fafc;
      --ink: #1e293b;
      --accent: #0284c7;
      --accent2: #ec4899;
      --seal: #0284c7;
      --seal-ink: #f8fafc;
    }
    [data-theme="vintage"] {
      --paper: #f4ede1;
      --ink: #2d2621;
      --accent: #9b2226;
      --accent2: #005f73;
      --seal: #9b2226;
      --seal-ink: #f4ede1;
      --body-font: 'Special Elite', monospace;
    }
    [data-theme="hadas"] {
      --paper: #faf5ff;
      --ink: #3b1d54;
      --accent: #9333ea;
      --accent2: #ec4899;
      --seal: #9333ea;
      --seal-ink: #faf5ff;
    }
    [data-theme="kraft"] {
      --paper: #dfc8a7;
      --ink: #2e2318;
      --accent: #6b2d20;
      --accent2: #8b5a2b;
      --seal: #6b2d20;
      --seal-ink: #dfc8a7;
    }
    [data-theme="comic"] {
      --paper: #ffffff;
      --ink: #111111;
      --accent: #e63946;
      --accent2: #1d3557;
      --seal: #e63946;
      --seal-ink: #ffffff;
    }

    /* REGLAS DE IMPRESIÓN OFICIAL A4 */
    @page {
      size: A4 portrait;
      margin: 0mm;
    }

    @media print {
      html, body {
        background: #fff !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 210mm !important;
        height: auto !important;
        overflow: visible !important;
      }
      .no-print, .print-actions {
        display: none !important;
      }
      .sheet {
        width: 210mm !important;
        height: 296mm !important;
        max-height: 296mm !important;
        aspect-ratio: auto !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-after: page !important;
        break-after: page !important;
      }
      .sheet:last-child,
      .sheet:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions no-print">
    <span style="font-size:14px; font-weight:600;">✨ Carta Mágica Oficial (Lista para imprimir o guardar en PDF)</span>
    <button class="print-btn" onclick="triggerPrint()">
      🖨️ Imprimir / Guardar en PDF
    </button>
  </div>

  ${sheets.join('\n')}

  <script>
    // Ajuste dinámico de texto para asegurar que NUNCA desborde de 1 sola hoja A4
    function fitSheets() {
      document.querySelectorAll('.sheet').forEach(function(sh) {
        var box = sh.querySelector('.body');
        if (!box) return;
        box.style.fontSize = '';
        var base = parseFloat(window.getComputedStyle(sh).getPropertyValue('--body-size')) || 2.2;
        var size = base;
        var guard = 0;
        function overflow() {
          return box.scrollHeight > box.clientHeight + 1;
        }
        while (overflow() && size > base * 0.45 && guard++ < 60) {
          size -= 0.04;
          box.style.fontSize = size.toFixed(2) + 'cqw';
        }
      });
    }

    function triggerPrint() {
      fitSheets();
      window.print();
    }

    window.addEventListener('load', function() {
      fitSheets();
      setTimeout(function() {
        fitSheets();
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
}

/**
 * Lanza el diálogo de impresión directamente usando un iframe posicionado fuera de pantalla (cero bloqueos de popup y dimensiones A4 exactas)
 */
export function printViaHiddenIframe(htmlContent: string) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  iframe.style.zIndex = '-9999';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    return false;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.warn('Error al imprimir por iframe:', e);
      }
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }, 450);
  };

  return true;
}

/**
 * Descarga el archivo HTML completo directamente
 */
export function downloadHtmlFile(htmlContent: string, filename: string) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
