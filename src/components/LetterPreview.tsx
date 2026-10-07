import React, { useEffect, useRef } from 'react';
import { ChildProfile, DocumentId, ThemeInfo } from '../types';
import { CORNER_SVGS, buildLetterContent, generateSealSvg } from '../data/letterTemplates';

interface LetterPreviewProps {
  docId: DocumentId;
  theme: ThemeInfo;
  kids: ChildProfile[];
  joint: boolean;
  date: string;
  parentSign?: string;
  watermarked?: boolean;
  anim?: boolean;
  sealIdx?: number;
}

const SPARKS = [
  { left: '4.5%', top: '10%', d: '0s' },
  { left: '95%', top: '18%', d: '.7s' },
  { left: '5%', top: '46%', d: '1.4s' },
  { left: '95%', top: '52%', d: '.3s' },
  { left: '4%', top: '78%', d: '1.9s' },
  { left: '96%', top: '84%', d: '1.1s' },
  { left: '50%', top: '2.4%', d: '.9s' },
];

export const LetterPreview: React.FC<LetterPreviewProps> = ({
  docId,
  theme,
  kids,
  joint,
  date,
  parentSign = '',
  watermarked = true,
  anim = true,
  sealIdx = 0,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const content = buildLetterContent(docId, kids, joint, date, parentSign);

  // Generar esquinas decorativas si el tema lo soporta
  let cornersHtml = '';
  if (theme.corner === 'classic' || theme.corner === 'deco') {
    const tmpl = CORNER_SVGS[theme.corner];
    if (tmpl) {
      cornersHtml = ['c1', 'c2', 'c3', 'c4']
        .map((pos) => tmpl.replace('%c', pos))
        .join('');
    }
  }

  // Generar Sello SVG oficial circular
  const sealHtml = generateSealSvg(content.seal, sealIdx);

  // Ajuste de texto automático (fitAll) para que nunca se desborde del formato A4
  useEffect(() => {
    const sh = sheetRef.current;
    if (!sh) return;
    const box = sh.querySelector('.body') as HTMLElement | null;
    if (!box) return;

    box.style.fontSize = '';
    const base = parseFloat(getComputedStyle(sh).getPropertyValue('--body-size')) || 2.3;
    let size = base;
    let guard = 0;

    const overflow = () => box.scrollHeight > box.clientHeight + 1;

    if (overflow()) {
      while (overflow() && size > base * 0.5 && guard++ < 60) {
        size -= 0.04;
        box.style.fontSize = size.toFixed(2) + 'cqw';
      }
    } else if (box.querySelector('.letter')) {
      while (size < base * 1.28 && guard++ < 40) {
        const next = size + 0.05;
        box.style.fontSize = next.toFixed(2) + 'cqw';
        if (overflow()) {
          box.style.fontSize = size.toFixed(2) + 'cqw';
          break;
        }
        size = next;
      }
    }
  }, [docId, theme, kids, joint, date, parentSign]);

  return (
    <div className="sheet-wrap w-full max-w-[794px] mx-auto">
      <article
        ref={sheetRef}
        className={`sheet ${anim ? 'anim' : ''}`}
        data-theme={theme.id}
      >
        {/* Marco decorativo */}
        <div className="frame" />

        {/* Esquinas ornamentales */}
        {cornersHtml && (
          <div
            dangerouslySetInnerHTML={{ __html: cornersHtml }}
            className="pointer-events-none"
          />
        )}

        {/* Marca de agua si es versión de muestra */}
        {watermarked && <div className="wm" />}

        {/* Chispas mágicas de estrellas */}
        {watermarked &&
          SPARKS.map((sp, i) => (
            <span
              key={i}
              className="sp no-print"
              style={{
                left: sp.left,
                top: sp.top,
                animationDelay: sp.d,
              }}
            >
              ✦
            </span>
          ))}

        {/* Contenido interior de la carta */}
        <div className="inner">
          {/* Escudo / Emblema vectorial */}
          <div
            className="crest-wrap"
            dangerouslySetInnerHTML={{ __html: content.icon }}
          />

          {/* Kicker superior */}
          <div className="kicker">{content.kicker}</div>

          {/* Título de la carta */}
          <h2 className="title">{content.title}</h2>

          {/* Texto script / subtítulo caligráfico */}
          <div className="script">{content.script}</div>

          {/* Divisor ornamental */}
          <div className="divider">
            <i />
            <span>✦</span>
            <i />
          </div>

          {/* Cuerpo de la carta */}
          <div
            className={`body ${content.diploma ? 'diploma' : ''}`}
            dangerouslySetInnerHTML={{ __html: content.body }}
          />

          {/* Pie: Fecha, Sello de Lacre Oficial y Firma */}
          <div className="footer">
            <div className="f-block">
              <div className="val">{content.date || '—'}</div>
              <div className="cap">{content.dateCap}</div>
            </div>

            <div
              className="seal-wrap"
              dangerouslySetInnerHTML={{ __html: sealHtml }}
            />

            <div className="f-block sig">
              <div
                className="val"
                style={content.sigSmall ? { fontSize: '2.5cqw' } : undefined}
              >
                {content.sig}
              </div>
              <div className="cap">{content.sigCap}</div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
