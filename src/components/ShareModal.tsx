import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Share2, Eye, QrCode, X, Heart } from 'lucide-react';
import { BouquetShareConfig } from '../types/bouquet';
import { getShareUrl } from '../utils/urlSharing';
import { soundManager } from '../utils/soundEffects';

interface ShareModalProps {
  config: BouquetShareConfig;
  isOpen: boolean;
  onClose: () => void;
  onPreviewRecipient: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  config,
  isOpen,
  onClose,
  onPreviewRecipient,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const url = getShareUrl(config);
    setShareUrl(url);

    // Generate QR Code
    QRCode.toDataURL(
      url,
      {
        width: 240,
        margin: 2,
        color: {
          dark: '#1c1917',
          light: '#ffffff',
        },
      },
      (err, dataUrl) => {
        if (!err && dataUrl) {
          setQrDataUrl(dataUrl);
        }
      }
    );
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      soundManager.playSoftClick();
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🌸 I sent you a digital bouquet with a personal note! Open your gift here: ${shareUrl}`
  )}`;

  const emailUrl = `mailto:?subject=${encodeURIComponent(
    `A Digital Bouquet from ${config.note.sender || 'a friend'}`
  )}&body=${encodeURIComponent(
    `Dear ${config.note.recipient || 'Friend'},\n\nI created a digital flower bouquet with a handwritten card for you.\n\nOpen your gift here:\n${shareUrl}\n\nWith love,\n${config.note.sender || 'Sender'}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Decorative floral aura */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif-display font-semibold text-xl text-stone-100">
            Your DigiBouquet is Ready to Gift!
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            Anyone with this unique link can open, unwrap, and admire your chosen sketch bouquet and note.
          </p>
        </div>

        {/* Link Copy Box */}
        <div className="mb-5">
          <label className="text-xs font-medium text-stone-300 mb-1.5 block">
            Unique Recipient Link
          </label>
          <div className="flex items-center gap-2 bg-stone-950 p-2 rounded-xl border border-stone-800">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-stone-300 px-2 font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-stone-950 shadow-sm'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-stone-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR Code & Recipient Preview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* QR Code Card */}
          <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800 flex flex-col items-center justify-center text-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Bouquet QR Code"
                className="w-32 h-32 rounded-xl shadow-md p-1 bg-white mb-2"
              />
            ) : (
              <div className="w-32 h-32 bg-stone-800 animate-pulse rounded-xl mb-2" />
            )}
            <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              Scan with phone camera
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col justify-between space-y-2.5">
            <button
              onClick={onPreviewRecipient}
              className="w-full py-2.5 px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700/80 text-xs font-semibold text-stone-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Preview Unboxing</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-all"
            >
              <span>💬</span>
              <span>Send via WhatsApp</span>
            </a>

            <a
              href={emailUrl}
              className="w-full py-2.5 px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700/80 text-xs font-semibold text-stone-200 flex items-center justify-center gap-2 transition-all"
            >
              <span>✉️</span>
              <span>Send via Email</span>
            </a>
          </div>
        </div>

        {/* Recipient Experience Highlights */}
        <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Wax-sealed envelope with unboxing reveal
          </span>
          <span className="text-stone-500">100% saved in link</span>
        </div>
      </div>
    </div>
  );
};
