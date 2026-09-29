import {
  BouquetShareConfig,
  PersonalNote,
  AmbientMusicTrack,
  AmbientParticleType,
} from '../types/bouquet';

const DRAFT_STORAGE_KEY = 'petalscript_bouquet_draft_v2';

export interface BouquetDraftData {
  sketchId: string;
  note: PersonalNote;
  ambientParticles: AmbientParticleType;
  ambientMusic?: AmbientMusicTrack;
  unlockDate?: string | null;
  lastSavedAt: number;
}

/**
 * Persists the current bouquet configuration and note draft to localStorage.
 */
export function saveBouquetDraft(config: BouquetShareConfig): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    const draft: BouquetDraftData = {
      sketchId: config.sketchId,
      note: config.note,
      ambientParticles: config.ambientParticles,
      ambientMusic: config.ambientMusic,
      unlockDate: config.unlockDate,
      lastSavedAt: Date.now(),
    };
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch (error) {
    console.warn('Failed to save bouquet draft to localStorage:', error);
    return false;
  }
}

/**
 * Loads the saved bouquet draft from localStorage if present and valid.
 */
export function loadBouquetDraft(): BouquetDraftData | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  try {
    const item = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!item) return null;

    const parsed: BouquetDraftData = JSON.parse(item);
    if (!parsed || !parsed.sketchId || !parsed.note) return null;

    return parsed;
  } catch (error) {
    console.warn('Failed to parse bouquet draft from localStorage:', error);
    return null;
  }
}

/**
 * Clears the saved bouquet draft from localStorage.
 */
export function clearBouquetDraft(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear bouquet draft:', error);
  }
}

/**
 * Checks if a draft exists in localStorage.
 */
export function hasBouquetDraft(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    return !!window.localStorage.getItem(DRAFT_STORAGE_KEY);
  } catch {
    return false;
  }
}

/**
 * Formats the last saved timestamp into a friendly human-readable string.
 */
export function formatDraftTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
