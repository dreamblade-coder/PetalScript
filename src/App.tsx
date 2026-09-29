import React, { useState, useEffect } from 'react';
import {
  BouquetShareConfig,
  FullOccasionTemplate,
} from './types/bouquet';
import { SKETCH_BOUQUETS } from './data/sketchBouquets';
import { CardEditor } from './components/CardEditor';
import { TemplatePickerModal } from './components/TemplatePickerModal';
import { ShareModal } from './components/ShareModal';
import { RecipientExperience } from './components/RecipientExperience';
import { BouquetParticles } from './components/BouquetParticles';
import { decodeBouquetFromUrl } from './utils/urlSharing';
import { soundManager } from './utils/soundEffects';
import {
  saveBouquetDraft,
  loadBouquetDraft,
} from './utils/draftStorage';
import {
  Heart,
  Share2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

const DEFAULT_CONFIG: BouquetShareConfig = {
  id: `bouquet-${Date.now()}`,
  sketchId: SKETCH_BOUQUETS[0].id,
  ambientParticles: 'petals',
  ambientMusic: 'none',
  unlockDate: null,
  note: {
    recipient: '',
    sender: '',
    occasion: 'Special Moment',
    message: 'Just a little bouquet to brighten your day and remind you how special you are.',
    paperStyle: 'cream-pressed',
    font: 'handwriting',
    textColor: '#1c1917',
    seal: {
      symbol: 'rose',
      color: '#be123c',
    },
    ribbonColor: 'crimson',
  },
  createdAt: Date.now(),
};

export default function App() {
  // If ?b=... is present in URL, open in recipient mode
  const [sharedConfig, setSharedConfig] = useState<BouquetShareConfig | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Initialize config from localStorage draft if available (unless recipient URL present)
  const [config, setConfig] = useState<BouquetShareConfig>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const bCode = params.get('b') || window.location.hash.replace(/^#b=/, '');
      if (!bCode) {
        const saved = loadBouquetDraft();
        if (saved) {
          return {
            id: `bouquet-${Date.now()}`,
            sketchId: saved.sketchId || SKETCH_BOUQUETS[0].id,
            ambientParticles: saved.ambientParticles || 'petals',
            ambientMusic: saved.ambientMusic || 'none',
            unlockDate: saved.unlockDate || null,
            note: saved.note,
            createdAt: Date.now(),
          };
        }
      }
    }
    return DEFAULT_CONFIG;
  });

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [templateModalTab, setTemplateModalTab] = useState<'occasions' | 'bouquets'>('occasions');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(true);

  // Touch swipe detection for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Check URL on load for recipient link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bCode = params.get('b') || window.location.hash.replace(/^#b=/, '');
    if (bCode) {
      const decoded = decodeBouquetFromUrl(bCode);
      if (decoded) {
        setSharedConfig(decoded);
      }
    }
  }, []);

  // Automatic localStorage draft persistence in background
  useEffect(() => {
    if (sharedConfig) return; // Don't overwrite draft when viewing recipient bouquet
    const timer = setTimeout(() => {
      saveBouquetDraft(config);
    }, 500);

    return () => clearTimeout(timer);
  }, [config, sharedConfig]);

  const currentIndex = SKETCH_BOUQUETS.findIndex((b) => b.id === config.sketchId);
  const currentBouquet = SKETCH_BOUQUETS[currentIndex >= 0 ? currentIndex : 0];

  const handleNextBouquet = () => {
    const nextIdx = (currentIndex + 1) % SKETCH_BOUQUETS.length;
    setConfig((prev) => ({ ...prev, sketchId: SKETCH_BOUQUETS[nextIdx].id }));
    soundManager.playSoftClick();
  };

  const handlePrevBouquet = () => {
    const prevIdx = (currentIndex - 1 + SKETCH_BOUQUETS.length) % SKETCH_BOUQUETS.length;
    setConfig((prev) => ({ ...prev, sketchId: SKETCH_BOUQUETS[prevIdx].id }));
    soundManager.playSoftClick();
  };

  const handleSelectBouquet = (sketchId: string) => {
    setConfig((prev) => ({ ...prev, sketchId }));
  };

  const handleApplyFullTemplate = (tmpl: FullOccasionTemplate) => {
    setConfig((prev) => ({
      ...prev,
      sketchId: tmpl.sketchId,
      note: {
        ...prev.note,
        occasion: tmpl.note.occasion,
        message: tmpl.note.message,
        paperStyle: tmpl.note.paperStyle,
        font: tmpl.note.font,
        textColor: tmpl.note.textColor,
        seal: {
          symbol: tmpl.note.sealSymbol,
          color: tmpl.note.sealColor,
        },
        ribbonColor: tmpl.note.ribbonColor || prev.note.ribbonColor || 'crimson',
      },
    }));
  };

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNextBouquet();
    } else if (distance < -minSwipeDistance) {
      handlePrevBouquet();
    }
  };

  // Recipient view
  if (sharedConfig) {
    return (
      <RecipientExperience
        config={sharedConfig}
        onEditOrReturn={() => {
          setConfig(sharedConfig);
          setSharedConfig(null);
          window.history.replaceState({}, '', window.location.pathname);
        }}
      />
    );
  }

  // Preview mode
  if (isPreviewMode) {
    return (
      <RecipientExperience
        config={config}
        isEditorPreview={true}
        onEditOrReturn={() => setIsPreviewMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-[#faf8f5] text-stone-900 selection:bg-amber-200">
      {/* Real-time Studio Particles layer */}
      <BouquetParticles type={config.ambientParticles || 'petals'} />

      {/* Top Simple Bar */}
      <header className="px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-200/60 bg-white/70 backdrop-blur-xs sticky top-0 z-30 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <div>
            <h1 className="font-serif-display font-semibold text-lg sm:text-xl text-stone-900 tracking-tight leading-none">
              Petalscript
            </h1>
            <span className="text-[10px] text-stone-400 font-sans block">
              Digital Floral Atelier
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Templates Button for Sorry, Thank You, Birthday, etc. */}
          <button
            onClick={() => {
              setTemplateModalTab('occasions');
              setIsTemplateModalOpen(true);
              soundManager.playSoftClick();
            }}
            className="px-3 sm:px-3.5 py-1.5 rounded-full border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Browse full occasion templates (Sorry, Thank You, Birthday, Romance, etc.)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Occasion Presets</span>
          </button>

          <button
            onClick={() => {
              soundManager.enabled = !soundActive;
              setSoundActive(!soundActive);
            }}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title={soundActive ? 'Mute' : 'Unmute'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setIsPreviewMode(true);
              soundManager.playUnwrapSound();
            }}
            className="px-3.5 py-1.5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={() => {
              setIsShareModalOpen(true);
              soundManager.playBloomChime();
            }}
            className="px-4 sm:px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Share Bouquet</span>
          </button>
        </div>
      </header>

      {/* Main Studio Workspace: Bouquet Showcase + Card Editor */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-1">
        {/* Left Column: Bouquet Showcase */}
        <div className="w-full flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] flex items-center justify-center">
            {/* PC Desktop Previous Button */}
            <button
              onClick={handlePrevBouquet}
              className="hidden md:flex absolute -left-6 z-30 w-11 h-11 rounded-full bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-800 shadow-lg border border-stone-200 items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Previous Bouquet"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Bouquet Display with Touch Swipe Support */}
            <div
              className="w-full flex flex-col items-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative w-full aspect-[3/4] flex items-center justify-center animate-float-bouquet select-none">
                <img
                  src={currentBouquet.imageSrc}
                  alt={currentBouquet.name}
                  onClick={() => {
                    setTemplateModalTab('bouquets');
                    setIsTemplateModalOpen(true);
                  }}
                  className="w-full h-full object-contain select-none drop-shadow-sm cursor-pointer"
                  title="Click to view all 16 bouquets"
                />
              </div>

              {/* Action Buttons underneath Bouquet: Change Bouquet Style */}
              <div className="mt-3 flex items-center gap-2 flex-wrap justify-center z-20">
                <button
                  type="button"
                  onClick={() => {
                    setTemplateModalTab('bouquets');
                    setIsTemplateModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-stone-800 hover:text-stone-950 border border-stone-200 text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    Style: {currentBouquet.name} ({currentIndex + 1}/{SKETCH_BOUQUETS.length})
                  </span>
                </button>
              </div>

              <span className="block md:hidden text-[10px] text-stone-400 mt-1">
                (Swipe sideways to browse bouquets)
              </span>
            </div>

            {/* PC Desktop Next Button */}
            <button
              onClick={handleNextBouquet}
              className="hidden md:flex absolute -right-6 z-30 w-11 h-11 rounded-full bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-800 shadow-lg border border-stone-200 items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Next Bouquet"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* The Note Card Editor & Full Feature Suite */}
        <div className="w-full flex flex-col justify-center">
          <CardEditor
            note={config.note}
            onChange={(updatedNote) =>
              setConfig((prev) => ({ ...prev, note: updatedNote }))
            }
            ambientParticles={config.ambientParticles}
            onChangeParticles={(ambientParticles) =>
              setConfig((prev) => ({ ...prev, ambientParticles }))
            }
            ambientMusic={config.ambientMusic || 'none'}
            onChangeMusic={(ambientMusic) =>
              setConfig((prev) => ({ ...prev, ambientMusic }))
            }
            unlockDate={config.unlockDate || null}
            onChangeUnlockDate={(unlockDate) =>
              setConfig((prev) => ({ ...prev, unlockDate }))
            }
          />

          {/* Share Button directly underneath the note */}
          <div className="mt-5">
            <button
              onClick={() => {
                setIsShareModalOpen(true);
                soundManager.playBloomChime();
              }}
              className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-300" />
              <span>Share Bouquet with Link</span>
            </button>
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="py-3 text-center text-xs text-stone-400 border-t border-stone-200/60">
        Petalscript • Digital flowers that never fade
      </footer>

      {/* Template Selection Modal (Occasions + Bouquets) */}
      <TemplatePickerModal
        isOpen={isTemplateModalOpen}
        selectedId={config.sketchId}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleSelectBouquet}
        onApplyFullTemplate={handleApplyFullTemplate}
        initialTab={templateModalTab}
      />

      {/* Share Link Modal */}
      <ShareModal
        config={config}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onPreviewRecipient={() => {
          setIsShareModalOpen(false);
          setIsPreviewMode(true);
        }}
      />
    </div>
  );
}
