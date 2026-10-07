export interface ChildProfile {
  id: string;
  treat: 'Querido' | 'Querida';
  name: string;
  achv: string;
  extra: string;
  achievement?: string;
  behavior?: string;
  customNote?: string;
  city?: string;
  giftMention?: string;
}

export type DocumentId =
  | 'reyes'
  | 'santa'
  | 'ratoncito'
  | 'hada'
  | 'olentzero'
  | 'tio'
  | 'elfo'
  | 'diploma';

export interface DocumentInfo {
  id: DocumentId;
  name: string;
  emo: string;
  kicker: string;
  title: string;
  script: string;
  seal: string;
  sigCap: string;
  sig: string;
  sigSmall?: boolean;
}

export type ThemeId =
  | 'pergamino'
  | 'rojo'
  | 'azul'
  | 'nordico'
  | 'bosque'
  | 'infantil'
  | 'deco'
  | 'acuarela'
  | 'vintage'
  | 'hadas'
  | 'kraft'
  | 'comic';

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  corner: 'classic' | 'deco' | 'none';
  sw: string;
}

// Compatibilidad con componentes auxiliares
export interface CharacterInfo {
  id: string;
  name: string;
  category: 'navidad' | 'dientes' | 'magia';
  shortTitle: string;
  description: string;
  tagline: string;
  emblem: string;
  signature: string;
  sealIcon: string;
  sealLabel: string;
  postmark: string;
  primaryColor: string;
  badge: string;
}

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  theme: string;
  previewBg: string;
  borderStyle: string;
  fontDisplay: string;
}

export interface LicenseStatus {
  valid: boolean;
  isNew?: boolean;
  email?: string | null;
  totalDownloads: number;
  usedDownloads: number;
  remainingDownloads: number;
  registeredChildren: string[];
  maxChildren: number;
  nameEditsRemaining: number;
  isDemo?: boolean;
  redisConnected?: boolean;
  error?: string;
}
