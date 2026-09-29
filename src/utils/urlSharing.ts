import {
  BouquetShareConfig,
  PersonalNote,
  PaperStyle,
  CardFont,
  WaxSealSymbol,
  RibbonColor,
  AmbientMusicTrack,
  AmbientParticleType,
  PlacedSticker,
  PolaroidPhoto,
} from '../types/bouquet';

interface CompactSketchPayload {
  s: string; // sketchId
  p: string; // particle code
  m?: AmbientMusicTrack; // music track
  u?: string; // unlockDate ISO string
  rc?: RibbonColor; // ribbon color
  po?: [string, string, string]; // [photoUrl, caption, date]
  st?: Array<[string, number, number, number, number, string?, string?]>; // [stickerId, x, y, scale, rot, customEmoji?, customName?]
  // [recipient, sender, occasion, message, paperStyle, font, sealSymbol, sealColor, textColor?]
  n: [string, string, string, string, PaperStyle, CardFont, WaxSealSymbol, string, string?];
}

export function encodeBouquetToUrl(config: BouquetShareConfig): string {
  const compact: CompactSketchPayload = {
    s: config.sketchId,
    p: config.ambientParticles || 'petals',
    m: config.ambientMusic !== 'none' ? config.ambientMusic : undefined,
    u: config.unlockDate || undefined,
    rc: config.note.ribbonColor || undefined,
    po:
      config.note.polaroid && (config.note.polaroid.photoUrl || config.note.polaroid.caption)
        ? [
            config.note.polaroid.photoUrl || '',
            config.note.polaroid.caption || '',
            config.note.polaroid.date || '',
          ]
        : undefined,
    st:
      config.stickers && config.stickers.length > 0
        ? config.stickers.map((st) => [
            st.stickerId,
            Math.round(st.x),
            Math.round(st.y),
            Math.round(st.scale * 10) / 10,
            Math.round(st.rotation || 0),
            st.customEmoji,
            st.customName,
          ])
        : undefined,
    n: [
      config.note.recipient || '',
      config.note.sender || '',
      config.note.occasion || '',
      config.note.message || '',
      config.note.paperStyle || 'cream-pressed',
      config.note.font || 'handwriting',
      config.note.seal.symbol || 'rose',
      config.note.seal.color || '#be123c',
      config.note.textColor || '#1c1917',
    ],
  };

  const jsonStr = JSON.stringify(compact);
  const base64 = btoa(
    encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
  const urlSafe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return urlSafe;
}

export function decodeBouquetFromUrl(encoded: string): BouquetShareConfig | null {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const jsonStr = decodeURIComponent(
      Array.prototype.map
        .call(binary, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const compact: CompactSketchPayload = JSON.parse(jsonStr);

    let particles: AmbientParticleType = 'petals';
    if (compact.p === 'p' || compact.p === 'petals') particles = 'petals';
    else if (compact.p === 'sakura') particles = 'sakura';
    else if (compact.p === 's' || compact.p === 'sparkles') particles = 'sparkles';
    else if (compact.p === 'hearts') particles = 'hearts';
    else if (compact.p === 'glow') particles = 'glow';
    else if (compact.p === 'n' || compact.p === 'none') particles = 'none';
    else if (compact.p === 'b') particles = 'petals';

    let polaroid: PolaroidPhoto | undefined = undefined;
    if (compact.po && Array.isArray(compact.po)) {
      polaroid = {
        photoUrl: compact.po[0] || undefined,
        caption: compact.po[1] || undefined,
        date: compact.po[2] || undefined,
      };
    }

    const stickers: PlacedSticker[] = [];
    if (compact.st && Array.isArray(compact.st)) {
      compact.st.forEach((s, idx) => {
        stickers.push({
          id: `stk-${idx}-${Date.now()}`,
          stickerId: s[0],
          x: s[1],
          y: s[2],
          scale: s[3] || 1,
          rotation: s[4] || 0,
          customEmoji: s[5] || undefined,
          customName: s[6] || undefined,
        });
      });
    }

    const note: PersonalNote = {
      recipient: compact.n[0] || '',
      sender: compact.n[1] || '',
      occasion: compact.n[2] || '',
      message: compact.n[3] || '',
      paperStyle: compact.n[4] || 'cream-pressed',
      font: compact.n[5] || 'handwriting',
      textColor: compact.n[8] || '#1c1917',
      seal: {
        symbol: (compact.n[6] as WaxSealSymbol) || 'rose',
        color: compact.n[7] || '#be123c',
      },
      ribbonColor: compact.rc,
      polaroid,
    };

    return {
      id: `shared-${Date.now()}`,
      sketchId: compact.s,
      ambientParticles: particles,
      ambientMusic: compact.m || 'none',
      unlockDate: compact.u || null,
      stickers,
      note,
      createdAt: Date.now(),
    };
  } catch (err) {
    console.error('Failed to decode bouquet payload:', err);
    return null;
  }
}

export function getShareUrl(config: BouquetShareConfig): string {
  const code = encodeBouquetToUrl(config);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?b=${code}`;
}
