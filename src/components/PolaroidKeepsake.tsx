import React, { useState } from 'react';
import { PolaroidPhoto } from '../types/bouquet';
import { soundManager } from '../utils/soundEffects';
import { RotateCw, Heart, Sparkles, Image as ImageIcon } from 'lucide-react';

interface PolaroidKeepsakeProps {
  polaroid: PolaroidPhoto;
  interactive?: boolean;
  className?: string;
  onRemove?: () => void;
}

export const PolaroidKeepsake: React.FC<PolaroidKeepsakeProps> = ({
  polaroid,
  interactive = true,
  className = '',
  onRemove,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;
    setIsFlipped(!isFlipped);
    soundManager.playSoftClick();
  };

  const defaultPhoto =
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80';
  const photoSrc = polaroid.photoUrl || defaultPhoto;

  return (
    <div
      onClick={handleFlip}
      className={`relative inline-block select-none cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${className}`}
      style={{ perspective: '1000px' }}
      title={interactive ? 'Click to flip photo keepsake' : undefined}
    >
      {/* Brass Binder Clip Graphic at top center */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-8 h-5 flex flex-col items-center pointer-events-none">
        <div className="w-5 h-2 rounded-t-sm bg-gradient-to-b from-amber-300 to-amber-600 shadow-xs" />
        <div className="w-6 h-3 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 rounded-xs shadow-md border-t border-amber-200" />
      </div>

      {/* 3D Flip Container */}
      <div
        className="relative w-56 sm:w-64 transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of Polaroid */}
        <div
          className="bg-white p-3 pb-5 rounded-md shadow-xl border border-stone-200/80 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Photo frame */}
          <div className="relative w-full aspect-square bg-stone-100 rounded-xs overflow-hidden shadow-inner border border-stone-200/50">
            <img
              src={photoSrc}
              alt={polaroid.caption || 'Memory photo'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Subtle vintage photo glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-amber-100/15 pointer-events-none" />
          </div>

          {/* Handwritten Caption & Date */}
          <div className="mt-3 text-center px-1">
            <div className="font-handwriting text-lg sm:text-xl text-stone-800 leading-tight">
              {polaroid.caption || 'Sweetest memory ✨'}
            </div>
            {polaroid.date && (
              <div className="font-sans text-[10px] text-stone-400 mt-0.5 tracking-wider uppercase">
                {polaroid.date}
              </div>
            )}
          </div>

          {interactive && (
            <div className="mt-1 text-center">
              <span className="text-[9px] text-amber-700/80 font-medium inline-flex items-center gap-1 hover:underline">
                <RotateCw className="w-2.5 h-2.5" />
                <span>Tap to flip over</span>
              </span>
            </div>
          )}
        </div>

        {/* Back of Polaroid (Vintage Postcard style) */}
        <div
          className="absolute inset-0 bg-[#faf6ee] p-4 rounded-md shadow-xl border border-amber-200/80 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Vintage Postcard Header */}
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <div className="flex items-center gap-1 text-amber-800 text-[10px] font-serif uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Petalscript Memory</span>
            </div>
            {/* Stamp graphic */}
            <div className="w-7 h-9 border border-dashed border-rose-400/80 rounded-xs bg-rose-50 flex flex-col items-center justify-center p-0.5 shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span className="text-[7px] text-rose-600 font-sans font-bold">LOVE</span>
            </div>
          </div>

          {/* Postcard message area */}
          <div className="my-auto py-2 text-center">
            <p className="font-handwriting text-xl text-stone-700 leading-relaxed">
              "Photographs fade, but the warmth of moments we shared blooms forever."
            </p>
            <div className="mt-2 text-[10px] text-stone-400 font-serif italic">
              Keepsake Edition • Petalscript
            </div>
          </div>

          {/* Footer flip prompt */}
          <div className="border-t border-amber-200/80 pt-2 text-center">
            <span className="text-[10px] text-stone-500 font-medium inline-flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-amber-600" />
              <span>Tap to flip photo back</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
