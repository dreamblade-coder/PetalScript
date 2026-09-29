export type PaperStyle =
  | 'cream-pressed'
  | 'vintage-parchment'
  | 'blush-petal'
  | 'midnight-gold'
  | 'sage-botanical'
  | 'lavender-haze'
  | 'sky-vellum'
  | 'terracotta-clay'
  | 'washi-rice';

export type CardFont =
  | 'handwriting'
  | 'serif'
  | 'script'
  | 'dancing'
  | 'indie'
  | 'cinzel'
  | 'sacramento'
  | 'garamond'
  | 'modern';

export type WaxSealSymbol =
  | 'rose'
  | 'heart'
  | 'leaf'
  | 'star'
  | 'crown'
  | 'blossom'
  | 'butterfly'
  | 'infinity';

export type RibbonColor =
  | 'crimson'
  | 'gold'
  | 'rose'
  | 'sage'
  | 'navy'
  | 'white'
  | 'twine';

export interface WaxSeal {
  symbol: WaxSealSymbol;
  color: string;
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number;
  rotation: number;
  customEmoji?: string;
  customName?: string;
  customImageUrl?: string;
}

export interface PolaroidPhoto {
  photoUrl?: string;
  caption?: string;
  date?: string;
}

export type AmbientMusicTrack =
  | 'none'
  | 'piano'
  | 'guitar-rain'
  | 'garden-breeze'
  | 'lofi-musicbox';

export type AmbientParticleType =
  | 'petals'
  | 'sakura'
  | 'sparkles'
  | 'hearts'
  | 'glow'
  | 'none';

export interface PersonalNote {
  recipient: string;
  sender: string;
  occasion: string;
  message: string;
  paperStyle: PaperStyle;
  font: CardFont;
  textColor?: string;
  seal: WaxSeal;
  ribbonColor?: RibbonColor;
  polaroid?: PolaroidPhoto;
}

export interface FullOccasionTemplate {
  id: string;
  title: string;
  category: 'sorry' | 'thankyou' | 'birthday' | 'love' | 'sympathy' | 'cheer' | 'congrats' | 'recovery';
  categoryLabel: string;
  badgeBg: string;
  sketchId: string;
  tagline: string;
  previewNote: string;
  note: {
    recipient?: string;
    sender?: string;
    occasion: string;
    message: string;
    paperStyle: PaperStyle;
    font: CardFont;
    textColor: string;
    sealSymbol: WaxSealSymbol;
    sealColor: string;
    ribbonColor?: RibbonColor;
  };
}

export interface SketchBouquet {
  id: string;
  name: string;
  occasion: string;
  tagline: string;
  description: string;
  imageSrc: string;
  primaryBloom: string;
  flowersIncluded: string[];
  flowerMeaning: string;
  themeGradient: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  defaultMessage: string;
}

export interface BouquetShareConfig {
  id: string;
  sketchId: string;
  note: PersonalNote;
  ambientParticles: AmbientParticleType;
  ambientMusic?: AmbientMusicTrack;
  unlockDate?: string | null; // ISO string e.g. "2026-10-14T09:00:00"
  stickers?: PlacedSticker[];
  createdAt: number;
}
