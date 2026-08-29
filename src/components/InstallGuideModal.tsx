import React from 'react';
import { Share, PlusSquare, Smartphone, Laptop, X, CheckCircle, Sparkles } from 'lucide-react';

interface InstallGuideModalProps {
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-4 border-orange-400 relative text-slate-800 animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-black mb-2">
            <Sparkles size={14} />
            <span>DIRECT IPAD & MOBILE INSTALL</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">Play on Your iPad!</h2>
          <p className="text-slate-600 text-xs md:text-sm font-medium mt-1">
            Install Pet World directly to your iPad or iPhone home screen with zero app store hassle!
          </p>
        </div>

        {/* Step-by-Step for iPad / Safari */}
        <div className="space-y-4 mb-6">
          <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-xl font-black text-lg flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                <span>Tap the Share Button</span>
                <Share size={16} className="text-blue-500" />
              </h3>
              <p className="text-slate-600 text-xs font-medium mt-0.5">
                Open this game in Safari on your iPad, then tap the <strong>Share</strong> icon in the top toolbar.
              </p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-200 flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-500 text-white rounded-xl font-black text-lg flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                <span>Select "Add to Home Screen"</span>
                <PlusSquare size={16} className="text-orange-600" />
              </h3>
              <p className="text-slate-600 text-xs font-medium mt-0.5">
                Scroll down the share menu options and tap <strong>"Add to Home Screen"</strong>.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-200 flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl font-black text-lg flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                <span>Tap "Add" & Enjoy!</span>
                <CheckCircle size={16} className="text-emerald-600" />
              </h3>
              <p className="text-slate-600 text-xs font-medium mt-0.5">
                Pet World will appear with its custom Ferrari icon on your home screen and open in full-screen standalone mode!
              </p>
            </div>
          </div>
        </div>

        {/* GitHub Repository info */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center mb-6">
          <span className="text-[11px] font-bold text-slate-500 block">
            GitHub Pages Ready • PWA Enabled • Offline Capable
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-base shadow-xl active:scale-95"
        >
          Got It! Let's Play ➔
        </button>
      </div>
    </div>
  );
};
