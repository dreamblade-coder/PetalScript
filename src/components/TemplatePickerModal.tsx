import React, { useState } from 'react';
import { SKETCH_BOUQUETS, getSketchBouquetById } from '../data/sketchBouquets';
import { OCCASION_TEMPLATES } from '../data/occasionTemplates';
import { FullOccasionTemplate } from '../types/bouquet';
import { X, Check, Sparkles, Flower2, HeartHandshake, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface TemplatePickerModalProps {
  isOpen: boolean;
  selectedId: string;
  onClose: () => void;
  onSelect: (sketchId: string) => void;
  onApplyFullTemplate: (template: FullOccasionTemplate) => void;
  initialTab?: 'occasions' | 'bouquets';
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  selectedId,
  onClose,
  onSelect,
  onApplyFullTemplate,
  initialTab = 'occasions',
}) => {
  const [activeTab, setActiveTab] = useState<'occasions' | 'bouquets'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-stone-200 shadow-2xl p-5 sm:p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
          <div>
            <h3 className="font-serif-display font-semibold text-lg sm:text-xl text-stone-900">
              Templates & Bouquet Atelier
            </h3>
            <p className="text-xs text-stone-500">
              Select a complete occasion preset (with written note & bouquet) or choose from 16 colored sketch bouquets
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-stone-100">
          <button
            type="button"
            onClick={() => setActiveTab('occasions')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'occasions'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            <span>Occasion Presets (Bouquet + Note)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bouquets')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bouquets'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Flower2 className="w-4 h-4 text-rose-400" />
            <span>All Bouquets ({SKETCH_BOUQUETS.length})</span>
          </button>
        </div>

        {/* Tab 1: Occasion Presets (Bouquet + Note) */}
        {activeTab === 'occasions' && (
          <div className="flex-1 overflow-y-auto pt-3 grid grid-cols-1 md:grid-cols-2 gap-3.5 pr-1">
            {OCCASION_TEMPLATES.map((tmpl) => {
              const pairedBouquet = getSketchBouquetById(tmpl.sketchId);
              return (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    onApplyFullTemplate(tmpl);
                    soundManager.playBloomChime();
                    onClose();
                  }}
                  className="group relative p-3.5 sm:p-4 rounded-2xl border border-stone-200 hover:border-amber-400 bg-stone-50/60 hover:bg-white transition-all cursor-pointer shadow-xs hover:shadow-md flex gap-3.5 items-start"
                >
                  {/* Bouquet Thumbnail */}
                  <div className="w-20 sm:w-24 aspect-[3/4] shrink-0 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs relative">
                    <img
                      src={pairedBouquet.imageSrc}
                      alt={pairedBouquet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details & Note preview */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tmpl.badgeBg}`}
                        >
                          {tmpl.categoryLabel}
                        </span>
                        <span className="text-[10px] text-stone-400 truncate">
                          {pairedBouquet.primaryBloom}
                        </span>
                      </div>
                      <h4 className="font-serif-display font-semibold text-sm text-stone-900 group-hover:text-amber-800 transition-colors">
                        {tmpl.title}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1 mb-1.5">
                        {tmpl.tagline}
                      </p>
                      <div className="p-2 rounded-xl bg-white border border-stone-200/80 text-[11px] text-stone-600 italic line-clamp-2 font-serif">
                        "{tmpl.note.message}"
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-stone-400">
                        {tmpl.note.paperStyle.replace('-', ' ')} • {tmpl.note.font}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700 group-hover:text-amber-900">
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: All Bouquets Gallery */}
        {activeTab === 'bouquets' && (
          <div className="flex-1 overflow-y-auto pt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-1">
            {SKETCH_BOUQUETS.map((b) => {
              const isSelected = b.id === selectedId;
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    onSelect(b.id);
                    soundManager.playBloomChime();
                    onClose();
                  }}
                  className={`group relative p-2 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/40 shadow-sm'
                      : 'border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-white'
                  }`}
                >
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 mb-2">
                    <img
                      src={b.imageSrc}
                      alt={b.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-xs text-stone-800 line-clamp-1">
                    {b.name}
                  </h4>
                  <span className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                    {b.badgeText}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
