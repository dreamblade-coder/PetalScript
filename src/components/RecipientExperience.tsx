import React, { useState, useEffect } from 'react';
import { BouquetShareConfig, WaxSealSymbol, RibbonColor } from '../types/bouquet';
import { getSketchBouquetById } from '../data/sketchBouquets';
import { soundManager } from '../utils/soundEffects';
import { BouquetParticles } from './BouquetParticles';
import { PolaroidKeepsake } from './PolaroidKeepsake';
import {
  Heart,
  PlusCircle,
  X,
  Volume2,
  VolumeX,
  Mail,
  Music,
  Disc,
  RotateCw,
  Sparkles,
  Lock,
  Clock,
} from 'lucide-react';

interface RecipientExperienceProps {
  config: BouquetShareConfig;
  onEditOrReturn: () => void;
  isEditorPreview?: boolean;
}

export const RecipientExperience: React.FC<RecipientExperienceProps> = ({
  config,
  onEditOrReturn,
  isEditorPreview = false,
}) => {
  // Real-time ticking state for date-lock countdown
  const unlockTimestamp = config.unlockDate ? new Date(config.unlockDate).getTime() : 0;
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());
  const [overrideLock, setOverrideLock] = useState<boolean>(false);
  const [lockShake, setLockShake] = useState<boolean>(false);
  const [showLockedToast, setShowLockedToast] = useState<boolean>(false);

  useEffect(() => {
    if (!unlockTimestamp) return;
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [unlockTimestamp]);

  const isLocked = Boolean(
    unlockTimestamp > 0 && unlockTimestamp > currentTime && !overrideLock
  );

  const diffMs = Math.max(0, unlockTimestamp - currentTime);
  const countdown = {
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diffMs % (1000 * 60)) / 1000),
  };

  const formattedUnlockDate = config.unlockDate
    ? new Date(config.unlockDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  // Trigger bloom chime when timer naturally reaches zero
  useEffect(() => {
    if (unlockTimestamp > 0 && currentTime >= unlockTimestamp && !isLocked && !overrideLock) {
      soundManager.playBloomChime();
    }
  }, [unlockTimestamp, currentTime, isLocked, overrideLock]);

  // Note opened state & breaking wax seal animation
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBreakingSeal, setIsBreakingSeal] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(
    Boolean(config.ambientMusic && config.ambientMusic !== 'none')
  );

  const bouquet = getSketchBouquetById(config.sketchId);
  const { note } = config;

  // Auto-start ambient music if configured
  useEffect(() => {
    if (config.ambientMusic && config.ambientMusic !== 'none' && soundEnabled) {
      soundManager.startAmbientMusic(config.ambientMusic);
      setIsPlayingMusic(true);
    }
    return () => {
      soundManager.stopAmbientMusic();
    };
  }, [config.ambientMusic, soundEnabled]);

  const handleOpenNote = () => {
    setIsBreakingSeal(true);
    soundManager.playWaxSealCrack();

    // Start music on first tap if not yet playing
    if (config.ambientMusic && config.ambientMusic !== 'none' && !isPlayingMusic) {
      soundManager.startAmbientMusic(config.ambientMusic);
      setIsPlayingMusic(true);
    }

    setTimeout(() => {
      setIsBreakingSeal(false);
      setIsOpen(true);
    }, 450);
  };

  const handleCloseNote = () => {
    setIsOpen(false);
    soundManager.playSoftClick();
  };

  const toggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      if (config.ambientMusic && config.ambientMusic !== 'none') {
        soundManager.startAmbientMusic(config.ambientMusic);
        setIsPlayingMusic(true);
      }
    } else {
      soundManager.stopAmbientMusic();
      setIsPlayingMusic(false);
    }
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      soundManager.stopAmbientMusic();
      setIsPlayingMusic(false);
    } else if (config.ambientMusic && config.ambientMusic !== 'none') {
      soundManager.startAmbientMusic(config.ambientMusic);
      setIsPlayingMusic(true);
    }
  };

  const getFontFamilyClass = (f: string) => {
    switch (f) {
      case 'handwriting':
        return 'font-handwriting text-2xl sm:text-3xl leading-relaxed';
      case 'script':
        return 'font-script text-3xl sm:text-4xl leading-relaxed';
      case 'dancing':
        return 'font-dancing text-2xl sm:text-3xl leading-relaxed';
      case 'indie':
        return 'font-indie text-xl sm:text-2xl leading-relaxed';
      case 'cinzel':
        return 'font-cinzel text-lg sm:text-xl tracking-wide leading-relaxed';
      case 'sacramento':
        return 'font-sacramento text-3xl sm:text-4xl leading-relaxed';
      case 'serif':
        return 'font-serif-display text-base sm:text-lg leading-relaxed';
      case 'garamond':
        return 'font-garamond text-xl sm:text-2xl leading-relaxed';
      case 'modern':
      default:
        return 'font-sans text-sm sm:text-base leading-relaxed';
    }
  };

  const getPaperBgClass = (p: string) => {
    switch (p) {
      case 'vintage-parchment':
        return 'bg-[#faf0ca] border-amber-300 shadow-2xl';
      case 'blush-petal':
        return 'bg-rose-50 border-rose-200 shadow-2xl';
      case 'midnight-gold':
        return 'bg-stone-900 border-amber-500/40 text-amber-200 shadow-2xl';
      case 'sage-botanical':
        return 'bg-emerald-50 border-emerald-200 shadow-2xl';
      case 'lavender-haze':
        return 'bg-purple-50 border-purple-200 shadow-2xl';
      case 'sky-vellum':
        return 'bg-sky-50 border-sky-200 shadow-2xl';
      case 'terracotta-clay':
        return 'bg-orange-50 border-orange-200 shadow-2xl';
      case 'washi-rice':
        return 'bg-[#fffdf7] border-stone-300 shadow-2xl';
      case 'cream-pressed':
      default:
        return 'bg-[#faf8f5] border-stone-200 shadow-2xl';
    }
  };

  const getRibbonBg = (r?: RibbonColor) => {
    switch (r) {
      case 'gold':
        return 'bg-amber-500';
      case 'rose':
        return 'bg-pink-400';
      case 'sage':
        return 'bg-emerald-600';
      case 'navy':
        return 'bg-blue-800';
      case 'white':
        return 'bg-stone-100 border border-stone-300';
      case 'twine':
        return 'bg-amber-800';
      case 'crimson':
      default:
        return 'bg-rose-600';
    }
  };

  const getSealIcon = (s?: WaxSealSymbol) => {
    switch (s) {
      case 'heart':
        return '💖';
      case 'leaf':
        return '🌿';
      case 'star':
        return '⭐';
      case 'crown':
        return '👑';
      case 'blossom':
        return '🌸';
      case 'butterfly':
        return '🦋';
      case 'infinity':
        return '♾️';
      case 'rose':
      default:
        return '🌹';
    }
  };

  const inkColor =
    note.paperStyle === 'midnight-gold'
      ? note.textColor === '#1c1917'
        ? '#fef08a'
        : note.textColor || '#fef08a'
      : note.textColor || '#1c1917';

  return (
    <div className="min-h-screen relative flex flex-col justify-between items-center p-4 sm:p-6 bg-[#faf8f5] text-stone-900 overflow-x-hidden selection:bg-amber-200">
      {/* Particle Atmosphere Layer */}
      <BouquetParticles type={config.ambientParticles || 'petals'} />

      {/* Top Simple Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between z-40 py-2">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span className="font-serif-display font-semibold text-stone-900 text-base tracking-wide">
            Petalscript
          </span>
          {isLocked && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Locked until {formattedUnlockDate}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Ambient Music Toggle widget if track is selected */}
          {config.ambientMusic && config.ambientMusic !== 'none' && (
            <button
              onClick={toggleMusic}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isPlayingMusic
                  ? 'bg-indigo-600 text-white shadow-indigo-200'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
              title={isPlayingMusic ? 'Pause Music' : 'Play Ambient Music'}
            >
              <Disc
                className={`w-3.5 h-3.5 ${isPlayingMusic ? 'animate-spin' : ''}`}
                style={{ animationDuration: '3s' }}
              />
              <span className="hidden sm:inline capitalize">
                {config.ambientMusic.replace('-', ' ')}
              </span>
            </button>
          )}

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {isEditorPreview ? (
            <button
              onClick={onEditOrReturn}
              className="px-4 py-2 rounded-full bg-stone-900 text-white font-medium text-xs shadow-md transition-all cursor-pointer hover:bg-stone-800"
            >
              Back to Studio
            </button>
          ) : (
            <button
              onClick={onEditOrReturn}
              className="px-4 py-2 rounded-full bg-stone-900 text-white font-medium text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:bg-stone-800"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Send a Bouquet Back</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Center Stage: Floating Bouquet with Tied Wax-Sealed Note & Stickers */}
      <div className="relative w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-auto py-6">
        {/* Floating Bouquet Container */}
        <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[3/4] flex items-center justify-center animate-float-bouquet select-none">
          {/* Pure Bouquet Image */}
          <img
            src={bouquet.imageSrc}
            alt={bouquet.name}
            className="w-full h-full object-contain select-none drop-shadow-md pointer-events-none"
          />

          {/* Note Card Tied Directly on the Bouquet (Visible when note is closed) */}
          {!isOpen && (
            isLocked ? (
              /* Visual Countdown Display replacing Note Preview when locked */
              <div
                onClick={() => {
                  setLockShake(true);
                  setShowLockedToast(true);
                  soundManager.playSoftClick();
                  setTimeout(() => setLockShake(false), 500);
                  setTimeout(() => setShowLockedToast(false), 3000);
                }}
                className={`absolute bottom-[16%] sm:bottom-[15%] right-1 sm:right-4 z-30 cursor-pointer animate-tag-sway select-none ${
                  lockShake ? 'animate-shake' : ''
                }`}
                title={`Locked until ${formattedUnlockDate}`}
              >
                {/* String / Ribbon connecting to bouquet */}
                <div
                  className={`w-1 h-6 mx-auto -mb-1 rounded-t-sm shadow-xs ${getRibbonBg(
                    note.ribbonColor
                  )}`}
                />

                {/* Tied Note Card Tag with Visual Countdown Display */}
                <div className="relative bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-amber-300/90 shadow-2xl transition-all max-w-[270px] sm:max-w-[290px] text-left">
                  {/* Header: Padlock + Locked until [Date] */}
                  <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-stone-200/60">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow-md text-white shrink-0"
                      style={{
                        backgroundColor: note.seal?.color || '#be123c',
                      }}
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-amber-900 tracking-tight leading-tight">
                        Locked until {formattedUnlockDate}
                      </div>
                      <div className="text-[9px] text-stone-500 truncate">
                        {note.recipient ? `For ${note.recipient}` : 'Personal Note'}
                      </div>
                    </div>
                  </div>

                  {/* Visual Live Countdown Display Grid */}
                  <div className="grid grid-cols-4 gap-1.5 text-center my-1.5">
                    <div className="bg-amber-50/90 rounded-lg p-1 border border-amber-200/70 shadow-2xs">
                      <span className="font-serif-display font-bold text-sm sm:text-base text-stone-900 block leading-tight">
                        {String(countdown.days).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] uppercase font-semibold text-stone-400 block tracking-wider">
                        Days
                      </span>
                    </div>
                    <div className="bg-amber-50/90 rounded-lg p-1 border border-amber-200/70 shadow-2xs">
                      <span className="font-serif-display font-bold text-sm sm:text-base text-stone-900 block leading-tight">
                        {String(countdown.hours).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] uppercase font-semibold text-stone-400 block tracking-wider">
                        Hours
                      </span>
                    </div>
                    <div className="bg-amber-50/90 rounded-lg p-1 border border-amber-200/70 shadow-2xs">
                      <span className="font-serif-display font-bold text-sm sm:text-base text-stone-900 block leading-tight">
                        {String(countdown.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] uppercase font-semibold text-stone-400 block tracking-wider">
                        Mins
                      </span>
                    </div>
                    <div className="bg-amber-50/90 rounded-lg p-1 border border-amber-200/70 shadow-2xs">
                      <span className="font-serif-display font-bold text-sm sm:text-base text-amber-700 block leading-tight animate-pulse">
                        {String(countdown.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] uppercase font-semibold text-stone-400 block tracking-wider">
                        Secs
                      </span>
                    </div>
                  </div>

                  {/* Bottom explanation */}
                  <div className="mt-2 text-[10px] text-stone-500 text-center flex items-center justify-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Blooms when countdown ends</span>
                  </div>

                  {/* Early preview option for testing */}
                  {isEditorPreview && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOverrideLock(true);
                        soundManager.playBloomChime();
                      }}
                      className="mt-2 w-full py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      Preview Unlocked Note
                    </button>
                  )}
                </div>

                {/* Floating toast notification when tapped while locked */}
                {showLockedToast && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[11px] px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap animate-fade-in pointer-events-none z-40">
                    🔒 Locked until {formattedUnlockDate}
                  </div>
                )}
              </div>
            ) : (
              /* Regular Unlocked Note Preview Tag */
              <div
                onClick={handleOpenNote}
                className="absolute bottom-[20%] sm:bottom-[18%] right-2 sm:right-6 z-30 cursor-pointer animate-tag-sway group"
                title="Click to break wax seal and read note"
              >
                {/* String / Ribbon connecting to bouquet */}
                <div
                  className={`w-1 h-7 mx-auto -mb-1 rounded-t-sm shadow-xs ${getRibbonBg(
                    note.ribbonColor
                  )}`}
                />

                {/* Tied Note Card Tag with 3D Wax Seal */}
                <div className="relative bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-stone-300 shadow-2xl group-hover:scale-105 group-hover:border-amber-400 transition-all flex items-center gap-3">
                  {/* 3D Wax Seal Badge */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border border-white/40 transition-transform ${
                      isBreakingSeal ? 'scale-150 rotate-45' : 'group-hover:rotate-12'
                    }`}
                    style={{
                      backgroundColor: note.seal?.color || '#be123c',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.4)',
                    }}
                  >
                    <span className="text-base select-none">
                      {getSealIcon(note.seal?.symbol)}
                    </span>
                  </div>

                  <div className="text-left">
                    <div className="text-[11px] font-semibold text-stone-900 leading-tight">
                      {note.recipient ? `For ${note.recipient}` : 'Personal Note'}
                    </div>
                    <div className="text-[10px] text-amber-700 font-medium">
                      Tap to break seal & open 💌
                    </div>
                  </div>

                  {/* Subtle pulse badge */}
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping absolute -top-1 -right-1" />
                </div>
              </div>
            )
          )}
        </div>

        {/* Opened Note Dialog with Opening Animation */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/45 backdrop-blur-xs animate-fade-in overflow-y-auto">
            <div
              className={`relative w-full max-w-lg p-6 sm:p-9 rounded-3xl border animate-unfold-note select-none my-auto max-h-[92vh] overflow-y-auto ${getPaperBgClass(
                note.paperStyle
              )}`}
              style={{ color: inkColor }}
            >
              {/* Close button */}
              <button
                onClick={handleCloseNote}
                className="absolute top-4 right-4 p-1.5 rounded-full text-current opacity-60 hover:opacity-100 hover:bg-black/5 transition-all cursor-pointer"
                title="Tie note back onto bouquet"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Broken Wax Seal Emblem & Ribbon Top Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-current/15">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shadow-md text-xs"
                    style={{ backgroundColor: note.seal?.color || '#be123c' }}
                  >
                    <span>{getSealIcon(note.seal?.symbol)}</span>
                  </div>
                  <span className="text-xs font-serif uppercase tracking-widest opacity-70">
                    {note.occasion || 'A Special Bouquet'}
                  </span>
                </div>
                {note.ribbonColor && (
                  <span className="text-[10px] opacity-50 uppercase tracking-wider">
                    {note.ribbonColor} Ribbon
                  </span>
                )}
              </div>

              {/* To field */}
              {note.recipient && (
                <div className="text-lg sm:text-xl font-semibold mb-4 opacity-90">
                  To {note.recipient},
                </div>
              )}

              {/* Message text with handwritten font & ink color */}
              <div
                className={`min-h-[100px] whitespace-pre-wrap leading-relaxed ${getFontFamilyClass(
                  note.font
                )}`}
              >
                {note.message || 'Thinking of you with love and warmth.'}
              </div>

              {/* From field */}
              {note.sender && (
                <div className="mt-6 pt-4 border-t border-current/15 text-right">
                  <span className="text-xs opacity-60 block">With love,</span>
                  <span
                    className={`font-semibold ${getFontFamilyClass(
                      note.font
                    )} text-xl sm:text-2xl`}
                  >
                    {note.sender}
                  </span>
                </div>
              )}

              {/* Polaroid Keepsake Attachment if included */}
              {note.polaroid && (
                <div className="mt-6 pt-5 border-t border-current/15 flex flex-col items-center">
                  <span className="text-xs uppercase tracking-wider opacity-60 mb-2 font-serif flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Memory Keepsake (Tap to flip)</span>
                  </span>
                  <PolaroidKeepsake polaroid={note.polaroid} interactive={true} />
                </div>
              )}

              {/* Hint to tie back */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseNote}
                  className="text-xs opacity-60 hover:opacity-100 underline underline-offset-4 transition-opacity cursor-pointer"
                >
                  Tie note back to bouquet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl text-center py-2 text-xs text-stone-400">
        Petalscript • Digital flowers that never fade
      </div>
    </div>
  );
};
