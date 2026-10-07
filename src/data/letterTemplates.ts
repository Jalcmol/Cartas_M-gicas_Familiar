import { ChildProfile, DocumentId, DocumentInfo, ThemeId, ThemeInfo } from '../types';

export const THEMES: ThemeInfo[] = [
  { id: 'pergamino', name: 'Pergamino Clásico', corner: 'classic', sw: 'linear-gradient(135deg,#f8ecc9,#d9b872)' },
  { id: 'rojo', name: 'Rojo Navidad', corner: 'classic', sw: 'linear-gradient(135deg,#fffaf3 45%,#a8111c 46%)' },
  { id: 'azul', name: 'Azul Mágico del Norte', corner: 'classic', sw: 'linear-gradient(135deg,#0b1d4a,#2a58b0)' },
  { id: 'nordico', name: 'Nórdico Minimalista', corner: 'none', sw: 'linear-gradient(135deg,#fbfaf6 55%,#4f6f64 56%)' },
  { id: 'bosque', name: 'Bosque Encantado', corner: 'none', sw: 'linear-gradient(180deg,#0c3325 60%,#072419 61%)' },
  { id: 'infantil', name: 'Infantil Divertido', corner: 'none', sw: 'linear-gradient(135deg,#ffd23f,#ff7aa8 55%,#4cc9f0)' },
  { id: 'deco', name: 'Art Déco Dorado', corner: 'deco', sw: 'linear-gradient(135deg,#0f0f0f 55%,#d4af37 56%)' },
  { id: 'acuarela', name: 'Acuarela Invernal', corner: 'none', sw: 'linear-gradient(135deg,#9cc4ee,#f2b3c4 55%,#a8d8c8)' },
  { id: 'vintage', name: 'Correo Vintage', corner: 'none', sw: 'repeating-linear-gradient(135deg,#c1272d 0 6px,#f5e7c8 6px 12px,#1f3f8f 12px 18px,#f5e7c8 18px 24px)' },
  { id: 'hadas', name: 'Cuento de Hadas', corner: 'none', sw: 'linear-gradient(135deg,#f6dcf5,#c9dcff)' },
  { id: 'kraft', name: 'Kraft Artesanal', corner: 'none', sw: 'linear-gradient(135deg,#dcbf90,#c9a66f)' },
  { id: 'comic', name: 'Cómic Pop', corner: 'none', sw: 'radial-gradient(circle,#e63946 0 25%,#fff3b0 26%) 0 0/8px 8px' },
];

export const DOCUMENTS: Record<DocumentId, DocumentInfo> = {
  reyes: {
    id: 'reyes',
    name: 'Reyes Magos',
    emo: '👑',
    kicker: 'Correo Real de Oriente',
    title: 'Carta de los Reyes Magos',
    script: 'Desde Oriente, con ilusión',
    seal: 'CORREO REAL DE ORIENTE ✦ ',
    sigCap: 'Sus Majestades',
    sig: 'Melchor, Gaspar y Baltasar',
    sigSmall: true,
  },
  santa: {
    id: 'santa',
    name: 'Papá Noel',
    emo: '🎅',
    kicker: 'Taller Oficial del Polo Norte',
    title: 'Carta de Papá Noel',
    script: '¡Jo, jo, jo!',
    seal: 'TALLER OFICIAL DEL POLO NORTE ✦ ',
    sigCap: 'Desde el Polo Norte',
    sig: 'Papá Noel',
  },
  ratoncito: {
    id: 'ratoncito',
    name: 'Ratoncito Pérez',
    emo: '🐭',
    kicker: 'Casa del Ratoncito Pérez',
    title: 'Carta del Ratoncito Pérez',
    script: 'Con un abrazo de bigotes',
    seal: 'CASA DEL RATONCITO PÉREZ ✦ ',
    sigCap: 'Tu amigo de los dientes',
    sig: 'Ratoncito Pérez',
  },
  hada: {
    id: 'hada',
    name: 'Hada de los Dientes',
    emo: '🧚',
    kicker: 'Reino de las Hadas del Diente',
    title: 'Carta del Hada de los Dientes',
    script: 'Con polvo de estrellas',
    seal: 'REINO DE LAS HADAS DEL DIENTE ✦ ',
    sigCap: 'Con alas y cariño',
    sig: 'El Hada de los Dientes',
  },
  olentzero: {
    id: 'olentzero',
    name: 'Olentzero',
    emo: '🏔️',
    kicker: 'Desde las montañas de Euskal Herria',
    title: 'Carta de Olentzero',
    script: '¡Eguberri on!',
    seal: 'OLENTZERO ✦ CARBONERO DEL MONTE ✦ ',
    sigCap: 'Carbonero del monte',
    sig: 'Olentzero',
  },
  tio: {
    id: 'tio',
    name: 'Tió de Nadal',
    emo: '🪵',
    kicker: 'Bosque del Tió de Nadal',
    title: 'Carta del Tió de Nadal',
    script: '¡Bon Nadal!',
    seal: 'TIÓ DE NADAL ✦ TRONCO MÁGICO ✦ ',
    sigCap: 'Tu tronco de Navidad',
    sig: 'El Tió de Nadal',
  },
  elfo: {
    id: 'elfo',
    name: 'Duende Travieso',
    emo: '🧝',
    kicker: 'Patrulla de Duendes · Polo Norte',
    title: 'Carta del Duende Travieso',
    script: '¡Hihi, soy yo!',
    seal: 'PATRULLA DE DUENDES ✦ ',
    sigCap: 'Tu duende espía',
    sig: 'Tu Duende Travieso',
  },
  diploma: {
    id: 'diploma',
    name: 'Certificado',
    emo: '🏅',
    kicker: 'Comité Oficial de Navidad',
    title: 'Certificado',
    script: 'de Buen Comportamiento',
    seal: 'COMITÉ DE BUEN COMPORTAMIENTO ✦ ',
    sigCap: 'Firma',
    sig: 'Mamá y Papá',
  },
};

export const CRESTS: Record<string, string> = {
  reyes: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M3 18.5 2 7.5l5.2 4.3L12 4l4.8 7.8L22 7.5l-1 11z" fill="currentColor" fill-opacity=".14"/><path d="M3.5 21h17"/><circle cx="12" cy="3.4" r="1" fill="currentColor"/><circle cx="2" cy="6.6" r="1" fill="currentColor"/><circle cx="22" cy="6.6" r="1" fill="currentColor"/></svg>`,
  santa: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"><path d="M4 18c0-7 4-13 12-14 1.5 3 1 6-1 8l5 6z" fill="currentColor" fill-opacity=".14"/><path d="M3 18.5h18v2.6H3z" fill="currentColor" fill-opacity=".3"/><circle cx="18" cy="4" r="2" fill="currentColor"/></svg>`,
  diploma: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><circle cx="12" cy="9.5" r="6.5" fill="currentColor" fill-opacity=".12"/><path d="m12 5.2 1.3 2.7 3 .4-2.2 2.1.6 3L12 11.9 9.3 13.4l.6-3L7.7 8.3l3-.4z" fill="currentColor"/><path d="M8.2 15 6.5 22l5.5-2.6 5.5 2.6-1.7-7"/></svg>`,
  ratoncito: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.8" cy="7.6" r="3.4" fill="currentColor" fill-opacity=".16"/><circle cx="17.2" cy="7.6" r="3.4" fill="currentColor" fill-opacity=".16"/><ellipse cx="12" cy="14" rx="7" ry="6" fill="currentColor" fill-opacity=".1"/><circle cx="9.4" cy="12.6" r=".9" fill="currentColor"/><circle cx="14.6" cy="12.6" r=".9" fill="currentColor"/><circle cx="12" cy="15" r="1" fill="currentColor"/><path d="M11 17.2h2v2h-2z" fill="#fff" fill-opacity=".9"/><path d="M5 14.6 1.6 14M5 16l-3 1.4M19 14.6l3.4-.6M19 16l3 1.4"/></svg>`,
  hada: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13c-5-7-10-6-9.4-1.6C3.2 15 8 15.4 12 13z" fill="currentColor" fill-opacity=".14"/><path d="M12 13c5-7 10-6 9.4-1.6C20.8 15 16 15.4 12 13z" fill="currentColor" fill-opacity=".14"/><path d="M12 13c-3 2-4 5-3.4 8M12 13c3 2 4 5 3.4 8" opacity=".7"/><path d="m12 2.4.9 1.9 2 .3-1.5 1.4.4 2L12 7l-1.8 1 .4-2-1.5-1.4 2-.3z" fill="currentColor"/></svg>`,
  olentzero: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="8.5" rx="8.4" ry="3.8" fill="currentColor" fill-opacity=".16"/><path d="M12 4.7V3.2"/><path d="M6.2 11.6c.8 4.4 3 6.9 5.8 6.9s5-2.5 5.8-6.9" fill="currentColor" fill-opacity=".08"/><circle cx="9.6" cy="13.4" r=".8" fill="currentColor"/><circle cx="14.4" cy="13.4" r=".8" fill="currentColor"/><path d="M10 16.6c1.3.9 2.7.9 4 0"/><path d="M15.6 18.4h3.4a2 2 0 0 1 0 4h-1"/></svg>`,
  tio: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.4" y="9" width="15" height="9" rx="4.4" fill="currentColor" fill-opacity=".14"/><path d="M6 9.4v-1.8M6 18.4v2M13 18.4v2"/><circle cx="19.2" cy="13.6" r="3" fill="currentColor" fill-opacity=".1"/><circle cx="18.4" cy="12.8" r=".6" fill="currentColor"/><circle cx="20.2" cy="12.8" r=".6" fill="currentColor"/><path d="M18.2 14.6c.6.5 1.4.5 2 0"/><path d="M16.6 11.4c.4-2.6 4-2.6 5.2 0z" fill="currentColor" fill-opacity=".5"/></svg>`,
  elfo: `<svg class="crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.4 17.4 12H6.6z" fill="currentColor" fill-opacity=".16"/><circle cx="12" cy="2.6" r="1.1" fill="currentColor"/><path d="M6.4 12.8h11.2"/><circle cx="12" cy="16.4" r="4.4" fill="currentColor" fill-opacity=".08"/><path d="M7.8 15.4 4.4 13.6l1.8 4.2M16.2 15.4l3.4-1.8-1.8 4.2"/><circle cx="10.4" cy="15.8" r=".7" fill="currentColor"/><circle cx="13.6" cy="15.8" r=".7" fill="currentColor"/><path d="M10.6 18.2c.9.6 1.9.6 2.8 0"/></svg>`,
};

export const CORNER_SVGS: Record<string, string> = {
  classic: `<svg class="corner %c" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 56V14C3 7.4 7.4 3 14 3h42"/><path d="M10 40V19c0-5 4-9 9-9h21"/><path d="M17 3c0 8-4 12-14 14" opacity=".6"/><circle cx="14" cy="14" r="2.6" fill="currentColor" stroke="none"/><circle cx="52" cy="3" r="1.4" fill="currentColor" stroke="none"/><circle cx="3" cy="52" r="1.4" fill="currentColor" stroke="none"/></svg>`,
  deco: `<svg class="corner %c" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square"><path d="M3 3H40M3 3V40"/><path d="M9 9H30M9 9V30"/><path d="M3 22 22 3M3 32 32 3M3 42 42 3" opacity=".75"/><rect x="1" y="1" width="5" height="5" fill="currentColor" transform="rotate(45 3.5 3.5)"/></svg>`,
};

export function generateSealSvg(text: string, idx: number = 0): string {
  const cx = 60, cy = 60, n = 28, pts: string[] = [];
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

const esc = (s: string) =>
  String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));

const nl = (s: string) => esc(s).replace(/\n/g, '<br>');
const nm = (k: ChildProfile) => (k.name ? k.name.trim() : 'Pequeño Tesoro');

export function longDate(iso: string): string {
  if (!iso) return '';
  const parts = iso.split('-').map(Number);
  if (!parts[0]) return '';
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function joinNames(kids: ChildProfile[]): string {
  const n = kids.map(nm);
  return n.length < 2 ? n[0] : n.slice(0, -1).join(', ') + ' y ' + n[n.length - 1];
}

function hlOf(k: ChildProfile, joint?: boolean): string {
  const t = (k.achv || '').trim();
  if (t) return `<span class="hl">${esc(t)}</span>`;
  return `<span class="hl">${joint ? 'un comportamiento y un corazón maravillosos' : 'tu buen comportamiento y tu gran corazón'}</span>`;
}

const extraP = (k: ChildProfile) => (k.extra && k.extra.trim() ? `<p>${nl(k.extra.trim())}</p>` : '');

const kidLines = (kids: ChildProfile[]) =>
  kids
    .map(
      (k) =>
        `<p class="kidline"><span class="kn">${esc(nm(k))}:</span> ${hlOf(k, true)}.${k.extra && k.extra.trim() ? ' ' + nl(k.extra.trim()) : ''}</p>`
    )
    .join('');

const letter = (greet: string, paras: string[], close: string) =>
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

const LISTA = 'Esto es lo que he sabido de cada uno:';

export interface LetterContentResult {
  icon: string;
  kicker: string;
  title: string;
  script: string;
  seal: string;
  dateCap: string;
  sigCap: string;
  sig: string;
  sigSmall?: boolean;
  date: string;
  body: string;
  diploma?: boolean;
}

export function buildLetterContent(
  docId: DocumentId,
  kids: ChildProfile[],
  joint: boolean,
  isoDate: string,
  parentSign: string = ''
): LetterContentResult {
  const date = longDate(isoDate);
  const k: ChildProfile = kids[0] || { id: 'k1', treat: 'Querido', name: '', achv: '', extra: '' };
  const treatJ = kids.every((x) => x.treat === 'Querida') ? 'Queridas' : 'Queridos';

  if (docId === 'diploma') {
    const base = {
      icon: CRESTS.diploma,
      kicker: 'Comité Oficial de Navidad',
      title: 'Certificado',
      script: 'de Buen Comportamiento',
      seal: 'COMITÉ DE BUEN COMPORTAMIENTO ✦ ',
      dateCap: 'Entregado el',
      sigCap: 'Firma',
      sig: parentSign.trim() || 'Mamá y Papá',
      date,
      diploma: true,
    };

    if (!joint) {
      return {
        ...base,
        body: `<div class="small">Se otorga con orgullo el presente certificado a</div>
          <div class="name">${esc(k.name.trim() || 'Nombre del niño/a')}</div>
          <div class="small">en reconocimiento a su excelente comportamiento. Muy especialmente:</div>
          <div class="reason">${k.achv.trim() ? esc(k.achv.trim()) : 'su bondad, su generosidad y su gran corazón'}</div>
          ${k.extra && k.extra.trim() ? `<div class="small" style="margin-top:1cqw">${nl(k.extra.trim())}</div>` : ''}
          <div class="motto">«Los pequeños gestos de bondad son los que hacen grande la Navidad.»</div>`,
      };
    }

    return {
      ...base,
      body: `<div class="small">Se otorga con orgullo el presente certificado a:</div>
        ${kids
          .map(
            (x) =>
              `<div class="row"><div class="name">${esc(nm(x))}</div><div class="reason">${
                x.achv.trim() ? esc(x.achv.trim()) : 'su bondad, su generosidad y su gran corazón'
              }</div>${x.extra && x.extra.trim() ? `<div class="small" style="max-width:100%">${nl(x.extra.trim())}</div>` : ''}</div>`
          )
          .join('')}
        <div class="motto">«Los pequeños gestos de bondad son los que hacen grande la Navidad.»</div>`,
    };
  }

  const d = DOCUMENTS[docId] || DOCUMENTS.reyes;

  let bodyHtml = '';

  if (docId === 'reyes') {
    bodyHtml = joint
      ? letter(
          treatJ + ' ' + esc(joinNames(kids)) + ',',
          [
            'Desde las lejanas tierras de Oriente, siguiendo el rastro de la estrella más brillante, os escribimos estas líneas antes de que nuestros camellos emprendan el largo viaje hasta vuestra casa.',
            'Nuestros pajes reales nos han contado cosas maravillosas de cada uno de vosotros:',
            kidLines(kids),
            'En la noche mágica de Reyes, preparad vuestros zapatos, dejadlos limpios y bien visibles, y no olvidéis un poco de agua para nuestros camellos. Seguid siendo así de especiales: la magia solo visita los hogares donde hay ilusión.',
          ],
          'Con todo nuestro cariño y bendiciones'
        )
      : letter(
          esc(k.treat) + ' ' + esc(nm(k)) + ',',
          [
            'Desde las lejanas tierras de Oriente, siguiendo el rastro de la estrella más brillante, te escribimos estas líneas antes de que nuestros camellos emprendan el largo viaje hasta tu casa.',
            'Nuestros pajes reales nos han contado algo maravilloso: ' +
              hlOf(k) +
              '. Eso demuestra un corazón grande y generoso, y los Reyes Magos lo valoramos más que todo el oro, el incienso y la mirra que guardamos en nuestros cofres.',
            extraP(k),
            'En la noche mágica de Reyes, prepara tus zapatos, déjalos limpios y bien visibles, y no olvides un poco de agua para nuestros camellos, que llegan muy cansados. Sigue siendo así de especial: la magia solo visita los hogares donde hay ilusión.',
          ],
          'Con todo nuestro cariño y bendiciones'
        );
  } else if (docId === 'santa') {
    bodyHtml = joint
      ? letter(
          treatJ + ' ' + esc(joinNames(kids)) + ',',
          [
            '¡Jo, jo, jo! Os escribo desde mi taller en el Polo Norte, donde los elfos no paran de envolver regalos y los renos ya están practicando para el gran viaje.',
            'Mi lista de niños buenos acaba de llegar y vuestros nombres brillan en ella con estrellas doradas. ' + LISTA,
            kidLines(kids),
            'Esta Nochebuena dejadme leche y galletas junto al árbol, y acostaos pronto, que Rudolph no espera. ¡Estoy muy orgulloso de todos vosotros!',
          ],
          'Con mucho cariño desde el Polo Norte'
        )
      : letter(
          esc(k.treat) + ' ' + esc(nm(k)) + ',',
          [
            '¡Jo, jo, jo! Te escribo desde mi taller en el Polo Norte, donde los elfos no paran de envolver regalos y los renos ya están practicando para el gran viaje.',
            'Mi lista de niños buenos acaba de llegar y, ¿a que no adivinas? Tu nombre brilla en ella con una estrella dorada, porque ' +
              hlOf(k) +
              '. ¡Estoy muy orgulloso de ti!',
            extraP(k),
            'Esta Nochebuena déjame un vaso de leche y unas galletas junto al árbol, y acuéstate pronto, que Rudolph no espera. Recuerda: lo más importante de la Navidad es compartirla con quienes más quieres.',
          ],
          'Con mucho cariño desde el Polo Norte'
        );
  } else if (docId === 'ratoncito') {
    bodyHtml = joint
      ? letter(
          treatJ + ' ' + esc(joinNames(kids)) + ',',
          [
            'Soy el Ratoncito Pérez y os escribo desde mi casita, entre libros y cajitas llenas de dientes de leche. Me han llegado noticias estupendas de vuestras sonrisas. ' +
              LISTA,
            kidLines(kids),
            'Guardad vuestros dientes en una cajita bajo la almohada y dormid tranquilos: vendré de puntillas a recogerlos y os dejaré un pequeño regalo a cada uno.',
            'Y recordad: cepillaos los dientes cada noche, ¡los nuevos tienen que durar muchísimo!',
          ],
          'Con un abrazo de bigotes'
        )
      : letter(
          esc(k.treat) + ' ' + esc(nm(k)) + ',',
          [
            'Soy el Ratoncito Pérez y te escribo desde mi casita, entre libros y cajitas llenas de dientes de leche. Esta noche me ha llegado el aviso más importante de todos: ¡se te ha caído un diente!',
            'Mis ayudantes me han contado que ' +
              hlOf(k) +
              '. Eso me ha puesto muy contento, porque solo visito a los niños que cuidan su sonrisa y tienen un corazón valiente.',
            extraP(k),
            'Guarda tu diente en una cajita bajo la almohada y duerme tranquilo. Mientras sueñas, vendré de puntillas a recogerlo para construir con él un rinconcito de mi palacio de dientes, y a cambio te dejaré un pequeño regalo.',
            'Y recuerda: cepíllate los dientes cada noche, ¡los nuevos tienen que durarte muchísimo!',
          ],
          'Con un abrazo de bigotes'
        );
  } else if (docId === 'hada') {
    bodyHtml = joint
      ? letter(
          treatJ + ' ' + esc(joinNames(kids)) + ',',
          [
            'He visto brillar vuestros dientes desde mi reino de nubes y estrellas y no he podido resistirme a escribiros. ' + LISTA,
            kidLines(kids),
            'Poned vuestros dientes en un vasito o bajo la almohada. Esta noche pasaré de puntillas con mi varita para cambiarlos por un detalle mágico y una pizca de polvo de estrellas. Eso sí: si me veis, ¡la magia se rompe!',
          ],
          'Con alas y mucho cariño'
        )
      : letter(
          esc(k.treat) + ' ' + esc(nm(k)) + ',',
          [
            'He visto brillar tu diente desde mi reino de nubes y estrellas y no he podido resistirme a escribirte. ¡Enhorabuena! Un diente de leche menos es un paso más para hacerte mayor.',
            'Las hadas sabemos que ' + hlOf(k) + '. Es una razón más para que hoy te dejemos un poquito de magia.',
            extraP(k),
            'Pon tu diente en un vasito o bajo la almohada. Esta noche pasaré de puntillas con mi varita para cambiarlo por un detalle mágico y una pizca de polvo de estrellas. Eso sí: si me ves, ¡la magia se rompe!',
            'Cuida tu sonrisa: es de las más bonitas que he visto.',
          ],
          'Con alas y mucho cariño'
        );
  } else if (docId === 'olentzero') {
    bodyHtml = joint
      ? letter(
          treatJ + ' ' + esc(joinNames(kids)) + ',',
          [
            'Soy Olentzero, el carbonero que baja de lo alto de las montañas cada Nochebuena. Llevo mi txapela, mi pipa y un saco bien cargado de regalos para los niños que se portan bien. ' +
              LISTA,
            kidLines(kids),
            'Esta noche dejad junto a la puerta unas castañas y algo calentito para el camino, que el monte está muy frío. ¡Estoy muy orgulloso de todos vosotros!',
          ],
          'Con cariño desde el monte'
        )
      : letter(
          esc(k.treat) + ' ' + esc(nm(k)) + ',',
          [
            'Soy Olentzero, el carbonero que baja de lo alto de las montañas cada Nochebuena. Llevo mi txapela, mi pipa y un saco bien cargado de regalos para los niños que se portan bien.',
            'Los pastores y los pájaros del monte me han contado algo precioso de ti: ' + hlOf(k) + '. ¡Eso es tener buen corazón!',
            extraP(k),
            'Esta noche deja junto a la puerta unas castañas y algo calentito para el camino, que el monte está muy frío. Haré un alto junto a tu lumbre antes de seguir mi viaje.',
          ],
          'Con cariño desde el monte'
        );
  } else if (docId === 'tio') {
    bodyHtml = joint
      ? letter(
          treatJ + ' ' + esc(joinNames(kids)) + ',',
          [
            'Soy el Tió de Nadal, el tronquito más simpático del bosque. Llevo días calentito bajo mi mantita y comiendo de maravilla, y estoy deseando que llegue la gran noche. ' +
              LISTA,
            kidLines(kids),
            'En Nochebuena coged vuestros palitos y cantad bien fuerte: «Caga tió, avellanas y turrón…». ¡Puede que debajo de mi manta haya sorpresas para todos!',
          ],
          'Un abrazo de corteza'
        )
      : letter(
          esc(k.treat) + ' ' + esc(nm(k)) + ',',
          [
            'Soy el Tió de Nadal, el tronquito más simpático del bosque. Llevo días calentito bajo mi mantita y comiendo de maravilla, y estoy deseando que llegue la gran noche.',
            'Las hormigas del bosque me han contado que ' + hlOf(k) + '. ¡Me alegro muchísimo!',
            extraP(k),
            'En Nochebuena, cuando llegue el momento, coged vuestros palitos y cantad bien fuerte: «Caga tió, avellanas y turrón…». Si te has portado bien, ¡puede que debajo de mi manta encuentres algún regalo!',
          ],
          'Un abrazo de corteza'
        );
  } else {
    // elfo
    bodyHtml = joint
      ? letter(
          treatJ + ' ' + esc(joinNames(kids)) + ',',
          [
            '¡Hola! Soy el duende que os ha estado vigilando desde su rinconcito durante todo el mes. ¿Pensabais que no os veía? ¡Hihi! ' + LISTA,
            kidLines(kids),
            'Ya queda poco para Navidad y tengo que volver al Polo Norte para ayudar con los regalos. Pero no os preocupéis: me quedo con vosotros en el corazón y volveré el año que viene.',
          ],
          'Un abrazo muy travieso'
        )
      : letter(
          esc(k.treat) + ' ' + esc(nm(k)) + ',',
          [
            '¡Hola! Soy el duende que ha estado vigilándote desde su rinconcito durante todo el mes. ¿Pensabas que no te veía? ¡Hihi!',
            'Papá Noel me pidió que le contara todo lo que veo, y ¿sabes qué le he dicho? Que ' +
              hlOf(k) +
              '. ¡Se va a poner contentísimo!',
            extraP(k),
            'Ya queda poco para Navidad y tengo que volver al Polo Norte para ayudar con los regalos. Pero no te preocupes: me quedo contigo en el corazón y volveré el año que viene.',
          ],
          'Un abrazo muy travieso'
        );
  }

  return {
    icon: CRESTS[d.id] || CRESTS.reyes,
    kicker: d.kicker,
    title: d.title,
    script: d.script,
    seal: d.seal,
    dateCap: 'Escrito el',
    sigCap: d.sigCap,
    sig: d.sig,
    sigSmall: d.sigSmall,
    date,
    body: bodyHtml,
  };
}
