import React, { useState, useEffect, useRef } from 'react';
import {
  PersonalNote,
  PaperStyle,
  CardFont,
  WaxSealSymbol,
  RibbonColor,
  AmbientMusicTrack,
  AmbientParticleType,
  PolaroidPhoto,
} from '../types/bouquet';
import { PolaroidKeepsake } from './PolaroidKeepsake';
import {
  Sparkles,
  RefreshCw,
  Check,
  ArrowRight,
  Undo2,
  X,
  ChevronDown,
  Music,
  Stamp,
  Camera,
  Lock,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Palette,
  ChevronUp,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface CardEditorProps {
  note: PersonalNote;
  onChange: (updated: PersonalNote) => void;
  ambientParticles: AmbientParticleType;
  onChangeParticles: (particles: AmbientParticleType) => void;
  ambientMusic: AmbientMusicTrack;
  onChangeMusic: (track: AmbientMusicTrack) => void;
  unlockDate: string | null;
  onChangeUnlockDate: (date: string | null) => void;
}

type MoodOption = 'joyful' | 'nostalgic' | 'apologetic' | 'romantic' | 'grateful' | 'poetic';

export const CardEditor: React.FC<CardEditorProps> = ({
  note,
  onChange,
  ambientParticles,
  onChangeParticles,
  ambientMusic,
  onChangeMusic,
  unlockDate,
  onChangeUnlockDate,
}) => {
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{
    suggestedNote: string;
    alternativeNote?: string;
  } | null>(null);
  const [showImproveModal, setShowImproveModal] = useState<boolean>(false);
  const [emptyWarning, setEmptyWarning] = useState<string | null>(null);
  const [previousNote, setPreviousNote] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Active drawer/tab in extra customizations
  const [activeAccordion, setActiveAccordion] = useState<
    'none' | 'seal' | 'photo' | 'music' | 'lock'
  >('none');

  // Font dropdown state and outside click detection
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState<boolean>(false);
  const fontDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(e.target as Node)) {
        setIsFontDropdownOpen(false);
      }
    };
    if (isFontDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFontDropdownOpen]);

  const handleImproveNote = async () => {
    if (!note.message.trim()) {
      setEmptyWarning('Write your note first, then tap to improve!');
      setTimeout(() => setEmptyWarning(null), 3000);
      return;
    }
    setEmptyWarning(null);
    setIsAiLoading(true);
    setAiError(null);
    soundManager.playSoftClick();

    try {
      const response = await fetch('/api/ai/improve-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalNote: note.message,
          mood: 'poetic',
          action: 'rewrite',
          recipient: note.recipient,
          sender: note.sender,
          occasion: note.occasion,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to improve note');
      }

      const data = await response.json();
      setAiResult(data);
      setShowImproveModal(true);
      soundManager.playBloomChime();
    } catch (err: any) {
      console.error('AI improvement error:', err);
      setAiError('Could not connect to Gemini. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyNote = (newText: string) => {
    setPreviousNote(note.message);
    onChange({ ...note, message: newText });
    soundManager.playSoftClick();
  };

  const handleUndo = () => {
    if (previousNote !== null) {
      onChange({ ...note, message: previousNote });
      setPreviousNote(null);
      soundManager.playSoftClick();
    }
  };

  const paperStyles: Array<{ id: PaperStyle; name: string; preview: string }> = [
    { id: 'cream-pressed', name: 'Cream Cotton', preview: 'bg-[#faf8f5] text-stone-900 border-stone-300' },
    { id: 'vintage-parchment', name: 'Warm Parchment', preview: 'bg-[#faf0ca] text-amber-950 border-amber-300' },
    { id: 'blush-petal', name: 'Blush Rose', preview: 'bg-rose-50 text-rose-950 border-rose-200' },
    { id: 'sage-botanical', name: 'Sage Linen', preview: 'bg-emerald-50 text-emerald-950 border-emerald-200' },
    { id: 'lavender-haze', name: 'Lavender Mist', preview: 'bg-purple-50 text-purple-950 border-purple-200' },
    { id: 'sky-vellum', name: 'Sky Vellum', preview: 'bg-sky-50 text-sky-950 border-sky-200' },
    { id: 'terracotta-clay', name: 'Terracotta Clay', preview: 'bg-amber-50 text-amber-950 border-amber-200' },
    { id: 'washi-rice', name: 'Washi Paper', preview: 'bg-[#fffdf7] text-stone-900 border-stone-300' },
    { id: 'midnight-gold', name: 'Midnight', preview: 'bg-stone-900 text-amber-200 border-stone-800' },
  ];

  // Available fonts for the bouquet note with preview labels
  const fontOptions: Array<{
    id: CardFont;
    name: string;
    label: string;
    fontClass: string;
    previewText: string;
  }> = [
    { id: 'handwriting', name: 'Caveat', label: 'Handwriting', fontClass: 'font-handwriting', previewText: 'Dearest Love' },
    { id: 'script', name: 'Alex Brush', label: 'Script', fontClass: 'font-script', previewText: 'Forever Bloom' },
    { id: 'dancing', name: 'Dancing Script', label: 'Dancing', fontClass: 'font-dancing', previewText: 'Sweet Moments' },
    { id: 'serif', name: 'Playfair', label: 'Serif', fontClass: 'font-serif-display', previewText: 'Grace & Beauty' },
    { id: 'garamond', name: 'Cormorant', label: 'Garamond', fontClass: 'font-garamond', previewText: 'Timeless Elegance' },
    { id: 'sacramento', name: 'Sacramento', label: 'Cursive', fontClass: 'font-sacramento', previewText: 'From My Heart' },
    { id: 'indie', name: 'Indie Flower', label: 'Whimsical', fontClass: 'font-indie', previewText: 'Thinking of You' },
    { id: 'cinzel', name: 'Cinzel', label: 'Imperial', fontClass: 'font-cinzel', previewText: 'A Special Gift' },
    { id: 'modern', name: 'Sans', label: 'Modern', fontClass: 'font-sans', previewText: 'Clean & Warm' },
  ];

  const currentFont = fontOptions.find((f) => f.id === note.font) || fontOptions[0];

  const textColors: Array<{ name: string; hex: string }> = [
    { name: 'Classic Ink', hex: '#1c1917' },
    { name: 'Deep Sepia', hex: '#451a03' },
    { name: 'Burgundy Wine', hex: '#881337' },
    { name: 'Forest Evergreen', hex: '#064e3b' },
    { name: 'Royal Navy', hex: '#0f172a' },
    { name: 'Regal Plum', hex: '#581c87' },
    { name: 'Warm Terracotta', hex: '#9a3412' },
    { name: 'Antique Gold', hex: '#b45309' },
    { name: 'Slate Charcoal', hex: '#475569' },
  ];

  // Wax Seal symbols & colors
  const sealEmblems: Array<{ id: WaxSealSymbol; label: string; icon: string }> = [
    { id: 'rose', label: 'Rose', icon: '🌹' },
    { id: 'heart', label: 'Heart', icon: '💖' },
    { id: 'leaf', label: 'Leaf', icon: '🌿' },
    { id: 'star', label: 'Star', icon: '⭐' },
    { id: 'crown', label: 'Crown', icon: '👑' },
    { id: 'blossom', label: 'Sakura', icon: '🌸' },
    { id: 'butterfly', label: 'Butterfly', icon: '🦋' },
    { id: 'infinity', label: 'Forever', icon: '♾️' },
  ];

  const sealColors: Array<{ name: string; hex: string }> = [
    { name: 'Crimson Velvet', hex: '#be123c' },
    { name: 'Antique Gold', hex: '#b45309' },
    { name: 'Forest Emerald', hex: '#047857' },
    { name: 'Royal Navy', hex: '#1d4ed8' },
    { name: 'Dusty Rose', hex: '#db2777' },
    { name: 'Midnight Plum', hex: '#7e22ce' },
    { name: 'Honey Amber', hex: '#d97706' },
    { name: 'Warm Terracotta', hex: '#c2410c' },
  ];

  const ribbonColors: Array<{ id: RibbonColor; name: string; hex: string }> = [
    { id: 'crimson', name: 'Silk Crimson', hex: '#be123c' },
    { id: 'gold', name: 'Golden Amber', hex: '#d97706' },
    { id: 'rose', name: 'Blush Rose', hex: '#f472b6' },
    { id: 'sage', name: 'Botanical Sage', hex: '#059669' },
    { id: 'navy', name: 'Classic Navy', hex: '#1e3a8a' },
    { id: 'white', name: 'Pristine White', hex: '#f8fafc' },
    { id: 'twine', name: 'Rustic Twine', hex: '#78350f' },
  ];

  const musicTracks: Array<{ id: AmbientMusicTrack; name: string; icon: string; desc: string }> = [
    { id: 'none', name: 'None (Mute)', icon: '🔇', desc: 'No background audio' },
    { id: 'piano', name: 'Romantic Piano', icon: '🎹', desc: 'Gentle polyphonic chords' },
    { id: 'guitar-rain', name: 'Acoustic Guitar', icon: '🎸', desc: 'Warm nylon arpeggios' },
    { id: 'garden-breeze', name: 'Garden Wind Chimes', icon: '🍃', desc: 'Soft pentatonic breeze' },
    { id: 'lofi-musicbox', name: 'Vintage Music Box', icon: '🔔', desc: 'Nostalgic celesta bells' },
  ];

  const particleOptions: Array<{ id: AmbientParticleType; name: string; icon: string }> = [
    { id: 'petals', name: 'Rose Petals', icon: '🌹' },
    { id: 'sakura', name: 'Sakura Drift', icon: '🌸' },
    { id: 'sparkles', name: 'Starlight', icon: '✨' },
    { id: 'hearts', name: 'Warm Hearts', icon: '💖' },
    { id: 'glow', name: 'Fireflies', icon: '🌟' },
    { id: 'none', name: 'None', icon: '🚫' },
  ];

  const samplePhotos = [
    {
      name: 'Rose Garden',
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sunset Sky',
      url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Coffee & Petals',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Forest Walk',
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange({
          ...note,
          polaroid: {
            photoUrl: result,
            caption: note.polaroid?.caption || 'Our sweetest memory ✨',
            date: note.polaroid?.date || 'Summer 2026',
          },
        });
        soundManager.playStickerPop();
      }
    };
    reader.readAsDataURL(file);
  };

  const getFontFamilyClass = (f: CardFont) => {
    switch (f) {
      case 'handwriting':
        return 'font-handwriting text-xl sm:text-2xl';
      case 'script':
        return 'font-script text-2xl sm:text-3xl';
      case 'dancing':
        return 'font-dancing text-xl sm:text-2xl';
      case 'indie':
        return 'font-indie text-lg sm:text-xl';
      case 'cinzel':
        return 'font-cinzel text-base sm:text-lg tracking-wide';
      case 'sacramento':
        return 'font-sacramento text-2xl sm:text-3xl';
      case 'serif':
        return 'font-serif-display text-base sm:text-lg';
      case 'garamond':
        return 'font-garamond text-lg sm:text-xl';
      case 'modern':
      default:
        return 'font-sans text-sm';
    }
  };

  const getPaperBgClass = (p: PaperStyle) => {
    switch (p) {
      case 'vintage-parchment':
        return 'bg-[#faf0ca] border-amber-300';
      case 'blush-petal':
        return 'bg-rose-50 border-rose-200';
      case 'midnight-gold':
        return 'bg-stone-900 border-amber-500/40 text-amber-200';
      case 'sage-botanical':
        return 'bg-emerald-50 border-emerald-200';
      case 'lavender-haze':
        return 'bg-purple-50 border-purple-200';
      case 'sky-vellum':
        return 'bg-sky-50 border-sky-200';
      case 'terracotta-clay':
        return 'bg-orange-50 border-orange-200';
      case 'washi-rice':
        return 'bg-[#fffdf7] border-stone-200';
      case 'cream-pressed':
      default:
        return 'bg-[#faf8f5] border-stone-200';
    }
  };

  const currentColor =
    note.paperStyle === 'midnight-gold'
      ? note.textColor === '#1c1917'
        ? '#fef08a'
        : note.textColor || '#fef08a'
      : note.textColor || '#1c1917';

  return (
    <div className="space-y-3.5">
      {/* Note Card Form (Paper style) */}
      <div
        className={`p-5 sm:p-7 rounded-3xl border shadow-sm transition-all ${getPaperBgClass(
          note.paperStyle
        )}`}
        style={{ color: currentColor }}
      >
        {/* To field */}
        <div className="mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1 block">
            To
          </label>
          <input
            type="text"
            value={note.recipient}
            onChange={(e) => onChange({ ...note, recipient: e.target.value })}
            placeholder="Recipient's Name..."
            style={{ color: currentColor }}
            className="w-full bg-black/5 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:opacity-40"
          />
        </div>

        {/* Personal Note Box */}
        <div className="mb-3">
          {/* Header Controls above typing box */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            {/* TOP LEFT: Just the AI Note Improver button */}
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={handleImproveNote}
                disabled={isAiLoading}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                title="Polish eloquence and flow while strictly preserving your literal meaning"
              >
                {isAiLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>AI Note Improver</span>
              </button>

              {previousNote !== null && (
                <button
                  type="button"
                  onClick={handleUndo}
                  className="text-stone-600 hover:text-stone-900 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer bg-black/5 hover:bg-black/10 px-2.5 py-1 rounded-xl"
                  title="Revert to your previous draft"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Undo</span>
                </button>
              )}

              {/* Empty warning toast */}
              {emptyWarning && (
                <span className="absolute left-0 -bottom-8 z-30 text-[10.5px] text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 shadow-sm whitespace-nowrap animate-fade-in">
                  ✍️ {emptyWarning}
                </span>
              )}
            </div>

            {/* TOP RIGHT: Font Selector with Live Preview Labels */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] font-medium opacity-60">Font:</span>

              {/* Custom Font Dropdown with Small Preview Labels */}
              <div className="relative inline-flex items-center" ref={fontDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsFontDropdownOpen(!isFontDropdownOpen);
                    soundManager.playSoftClick();
                  }}
                  className="pl-2.5 pr-2 py-1 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 text-xs font-medium text-stone-800 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
                  aria-label="Font selection dropdown with preview"
                  aria-haspopup="listbox"
                  aria-expanded={isFontDropdownOpen}
                >
                  <span className="font-semibold text-stone-800">{currentFont.label}</span>
                  {/* Small preview label inside dropdown trigger */}
                  <span
                    className={`px-1.5 py-0.5 rounded-md bg-white/80 border border-stone-200/80 text-xs leading-none text-stone-900 font-normal ${currentFont.fontClass}`}
                    title={`Current font style preview (${currentFont.name})`}
                  >
                    {currentFont.previewText}
                  </span>
                  {isFontDropdownOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 opacity-60 text-stone-600" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 text-stone-600" />
                  )}
                </button>

                {/* Font Dropdown Menu with Individual Preview Labels */}
                {isFontDropdownOpen && (
                  <div
                    role="listbox"
                    className="absolute top-full right-0 mt-1.5 w-64 sm:w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl py-1.5 z-50 animate-fade-in max-h-72 overflow-y-auto"
                  >
                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-stone-400 tracking-wider border-b border-stone-100 flex items-center justify-between">
                      <span>Font Style</span>
                      <span>Preview</span>
                    </div>
                    {fontOptions.map((f) => {
                      const isSelected = note.font === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            onChange({ ...note, font: f.id });
                            setIsFontDropdownOpen(false);
                            soundManager.playSoftClick();
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50/90 text-amber-950 font-medium'
                              : 'hover:bg-stone-50 text-stone-700 hover:text-stone-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 stroke-[2.5]" />
                            ) : (
                              <span className="w-3.5 shrink-0" />
                            )}
                            <div className="truncate">
                              <span className="font-semibold text-stone-800">{f.label}</span>
                              <span className="text-[10px] text-stone-400 ml-1 font-normal">({f.name})</span>
                            </div>
                          </div>

                          {/* Small preview label showing actual font style */}
                          <span
                            className={`px-2 py-0.5 rounded-md bg-stone-100/90 border border-stone-200/80 text-xs sm:text-sm text-stone-900 shrink-0 leading-tight ${f.fontClass}`}
                          >
                            {f.previewText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Note Improver result popup banner (shown directly beneath top-left button when improved) */}
          {showImproveModal && aiResult && (
            <div className="mb-2.5 p-3 rounded-2xl bg-white/95 border border-amber-300 shadow-md animate-fade-in text-stone-900 backdrop-blur-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  <span>Improved Note (Literal Meaning Preserved):</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowImproveModal(false)}
                  className="text-stone-400 hover:text-stone-700 p-0.5 rounded-md cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-stone-800 text-[12.5px] font-serif italic mb-2.5 leading-relaxed bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                "{aiResult.suggestedNote}"
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    handleApplyNote(aiResult.suggestedNote);
                    setShowImproveModal(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span>Apply to Note</span>
                </button>

                {aiResult.alternativeNote && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApplyNote(aiResult.alternativeNote!);
                      setShowImproveModal(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Use Alternate Phrasing
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowImproveModal(false)}
                  className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800 cursor-pointer ml-auto"
                >
                  Keep My Original
                </button>
              </div>
            </div>
          )}

          {/* Clean, Full-Width Chat / Typing Box */}
          <div className="relative">
            <textarea
              rows={6}
              value={note.message}
              onChange={(e) => onChange({ ...note, message: e.target.value })}
              placeholder="Write your note here... (Click 'AI Note Improver' above on the top-left to polish flow without changing what you mean!)"
              style={{ color: currentColor }}
              className={`w-full bg-black/5 rounded-2xl p-3.5 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed placeholder:opacity-40 transition-all ${getFontFamilyClass(
                note.font
              )}`}
            />

            {/* Typing Box Footer: Word Counter */}
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-400 px-1">
              <span>
                {note.message.trim() ? `${note.message.trim().split(/\s+/).length} words` : '0 words'}
              </span>

              {previousNote !== null && (
                <button
                  type="button"
                  onClick={handleUndo}
                  className="text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 transition-colors cursor-pointer bg-black/5 hover:bg-black/10 px-2 py-0.5 rounded-lg"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Revert to original</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* From field */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1 block">
            From
          </label>
          <input
            type="text"
            value={note.sender}
            onChange={(e) => onChange({ ...note, sender: e.target.value })}
            placeholder="Your Name..."
            style={{ color: currentColor }}
            className="w-full bg-black/5 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:opacity-40"
          />
        </div>
      </div>

      {/* Style selections: Paper themes & Ink colors */}
      <div className="space-y-2 pt-1 text-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Paper style selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-stone-400 font-medium shrink-0">Paper:</span>
            <div className="flex gap-1.5 flex-wrap">
              {paperStyles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChange({ ...note, paperStyle: p.id })}
                  className={`w-6 h-6 rounded-full border shadow-xs transition-transform cursor-pointer ${
                    p.preview
                  } ${
                    note.paperStyle === p.id
                      ? 'ring-2 ring-stone-900 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title={p.name}
                />
              ))}
            </div>
          </div>

          {/* Text color selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-stone-400 font-medium shrink-0">Ink:</span>
            <div className="flex gap-1.5 flex-wrap">
              {textColors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onChange({ ...note, textColor: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-5 h-5 rounded-full border border-black/10 shadow-xs transition-transform cursor-pointer ${
                    (note.textColor || '#1c1917') === c.hex
                      ? 'ring-2 ring-amber-500 scale-125'
                      : 'hover:scale-110'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          ACCORDION FEATURE TOOLBARS (Wax Seal, Photo, Music, Lock)
         ======================================================== */}
      <div className="border border-stone-200 rounded-2xl bg-white/70 overflow-hidden shadow-xs divide-y divide-stone-100 text-xs">
        {/* Tab Buttons Row */}
        <div className="grid grid-cols-4 bg-stone-50/70 p-1 gap-1 text-[11px] font-semibold text-stone-600">
          <button
            type="button"
            onClick={() =>
              setActiveAccordion(activeAccordion === 'seal' ? 'none' : 'seal')
            }
            className={`py-1.5 px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeAccordion === 'seal'
                ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                : 'hover:bg-white/60'
            }`}
          >
            <Stamp className="w-3.5 h-3.5 text-rose-600" />
            <span className="truncate">Seal & Ribbon</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveAccordion(activeAccordion === 'photo' ? 'none' : 'photo')
            }
            className={`py-1.5 px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeAccordion === 'photo'
                ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                : 'hover:bg-white/60'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate">Polaroid</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveAccordion(activeAccordion === 'music' ? 'none' : 'music')
            }
            className={`py-1.5 px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeAccordion === 'music'
                ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                : 'hover:bg-white/60'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-indigo-600" />
            <span className="truncate">Music & FX</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveAccordion(activeAccordion === 'lock' ? 'none' : 'lock')
            }
            className={`py-1.5 px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeAccordion === 'lock'
                ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                : 'hover:bg-white/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate">Date Lock</span>
          </button>
        </div>

        {/* Panel 1: Wax Seal & Ribbon Customizer */}
        {activeAccordion === 'seal' && (
          <div className="p-3.5 space-y-3 bg-white animate-fade-in">
            {/* Seal Emblem */}
            <div>
              <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                Wax Seal Stamp Emblem:
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {sealEmblems.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...note,
                        seal: { ...note.seal, symbol: s.id },
                      });
                      soundManager.playSoftClick();
                    }}
                    className={`px-2 py-1 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                      note.seal.symbol === s.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Seal Color */}
            <div>
              <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                Wax Seal Color:
              </span>
              <div className="flex gap-2 flex-wrap items-center">
                {sealColors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...note,
                        seal: { ...note.seal, color: c.hex },
                      });
                      soundManager.playSoftClick();
                    }}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full border border-black/10 shadow-xs transition-transform cursor-pointer ${
                      note.seal.color === c.hex
                        ? 'ring-2 ring-stone-900 scale-125'
                        : 'hover:scale-110'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Ribbon Color */}
            <div>
              <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                Tied Ribbon Color:
              </span>
              <div className="flex gap-2 flex-wrap items-center">
                {ribbonColors.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...note,
                        ribbonColor: r.id,
                      });
                      soundManager.playSoftClick();
                    }}
                    style={{ backgroundColor: r.hex }}
                    className={`w-6 h-6 rounded-full border border-black/15 shadow-xs transition-transform cursor-pointer ${
                      (note.ribbonColor || 'crimson') === r.id
                        ? 'ring-2 ring-stone-900 scale-125'
                        : 'hover:scale-110'
                    }`}
                    title={r.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Panel 2: Polaroid Keepsake Photo */}
        {activeAccordion === 'photo' && (
          <div className="p-3.5 space-y-3 bg-white animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-stone-900">
                  Attach Polaroid Keepsake Photo
                </h4>
                <p className="text-[11px] text-stone-500">
                  Adds a vintage 3D flippable photo keepsake to the bouquet
                </p>
              </div>
              {note.polaroid ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange({ ...note, polaroid: undefined });
                    soundManager.playSoftClick();
                  }}
                  className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-[11px] hover:bg-rose-100"
                >
                  Remove Photo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...note,
                      polaroid: {
                        photoUrl: samplePhotos[0].url,
                        caption: 'Our sweetest memory ✨',
                        date: 'Summer 2026',
                      },
                    });
                    soundManager.playStickerPop();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950 font-semibold text-xs shadow-xs hover:bg-amber-400"
                >
                  + Add Polaroid
                </button>
              )}
            </div>

            {note.polaroid && (
              <div className="pt-2 border-t border-stone-100 space-y-2.5">
                {/* Upload or Pick Sample */}
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-medium flex items-center gap-1.5 shadow-2xs">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload Your Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[10px] text-stone-400">or pick sample:</span>
                  <div className="flex gap-1.5">
                    {samplePhotos.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          onChange({
                            ...note,
                            polaroid: {
                              ...note.polaroid,
                              photoUrl: s.url,
                            },
                          })
                        }
                        className="w-7 h-7 rounded-md overflow-hidden border border-stone-300 hover:scale-110 transition-transform"
                        title={s.name}
                      >
                        <img src={s.url} alt={s.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caption & Date Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-stone-500 block mb-0.5">
                      Handwritten Caption
                    </label>
                    <input
                      type="text"
                      value={note.polaroid.caption || ''}
                      onChange={(e) =>
                        onChange({
                          ...note,
                          polaroid: {
                            ...note.polaroid,
                            caption: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Our sweetest memory ✨"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-stone-500 block mb-0.5">
                      Date Stamp
                    </label>
                    <input
                      type="text"
                      value={note.polaroid.date || ''}
                      onChange={(e) =>
                        onChange({
                          ...note,
                          polaroid: {
                            ...note.polaroid,
                            date: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. October 2026"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Live Flip Preview */}
                <div className="pt-2 text-center flex flex-col items-center">
                  <span className="text-[10px] text-stone-400 mb-1.5">
                    Live Polaroid Preview (Click to test 3D flip):
                  </span>
                  <PolaroidKeepsake polaroid={note.polaroid} interactive={true} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Panel 3: Music Soundscapes & Particle Atmosphere */}
        {activeAccordion === 'music' && (
          <div className="p-3.5 space-y-3 bg-white animate-fade-in">
            {/* Ambient Music Track */}
            <div>
              <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                Background Music Soundscape:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {musicTracks.map((trk) => {
                  const isActive = ambientMusic === trk.id;
                  return (
                    <button
                      key={trk.id}
                      type="button"
                      onClick={() => {
                        onChangeMusic(trk.id);
                        if (trk.id !== 'none') {
                          soundManager.startAmbientMusic(trk.id);
                        } else {
                          soundManager.stopAmbientMusic();
                        }
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-950 font-semibold shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{trk.icon}</span>
                        <div>
                          <div className="text-xs">{trk.name}</div>
                          <div className="text-[10px] text-stone-400 font-normal">
                            {trk.desc}
                          </div>
                        </div>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Falling Particles FX */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                Bouquet Particle Atmosphere:
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {particleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChangeParticles(opt.id);
                      soundManager.playBloomChime();
                    }}
                    className={`px-2.5 py-1 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      ambientParticles === opt.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Panel 4: Scheduled Reveal / Date Lock */}
        {activeAccordion === 'lock' && (
          <div className="p-3.5 space-y-3 bg-white animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-stone-900">
                  Scheduled Date Lock (Birthday / Anniversary)
                </h4>
                <p className="text-[11px] text-stone-500">
                  Locks the bouquet with a live countdown clock until this date!
                </p>
              </div>

              {unlockDate ? (
                <button
                  type="button"
                  onClick={() => {
                    onChangeUnlockDate(null);
                    soundManager.playSoftClick();
                  }}
                  className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-[11px] hover:bg-rose-100"
                >
                  Remove Lock
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    // Default to tomorrow at 9:00 AM
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(9, 0, 0, 0);
                    onChangeUnlockDate(tomorrow.toISOString());
                    soundManager.playSoftClick();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950 font-semibold text-xs shadow-xs hover:bg-amber-400"
                >
                  + Set Date Lock
                </button>
              )}
            </div>

            {unlockDate && (
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <label className="text-[11px] font-medium text-stone-600 block">
                  Unlock Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={unlockDate ? unlockDate.substring(0, 16) : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const d = new Date(e.target.value);
                      onChangeUnlockDate(d.toISOString());
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  🔒 If the recipient visits the link before this time, they will see a locked
                  silhouette and a live ticking countdown clock with your occasion greeting!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
