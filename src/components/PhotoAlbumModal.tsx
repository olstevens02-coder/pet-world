import React from 'react';
import { PhotoMemory } from '../types/game';
import { SPECIES_CATALOG } from '../data/animals';
import { BookOpen, X, Sparkles, Heart } from 'lucide-react';

interface PhotoAlbumModalProps {
  photos: PhotoMemory[];
  onClose: () => void;
}

export const PhotoAlbumModal: React.FC<PhotoAlbumModalProps> = ({ photos, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-amber-50 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border-4 border-amber-400 relative text-slate-800 animate-scaleUp max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-amber-200/60 hover:bg-amber-200 rounded-full flex items-center justify-center text-slate-700"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-black mb-2">
            <BookOpen size={14} />
            <span>PET MEMORY SCRAPBOOK</span>
          </div>
          <h2 className="text-3xl font-black">Pet Photo Album</h2>
          <p className="text-slate-600 text-xs font-bold mt-1">
            Cherished moments captured with your furry, feathery, and scaly companions!
          </p>
        </div>

        {/* Photos Grid */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {photos.length === 0 ? (
            <div className="bg-white/80 rounded-2xl p-8 text-center border-2 border-dashed border-amber-300">
              <span className="text-4xl block mb-2">📸</span>
              <h3 className="font-black text-lg text-slate-700">No Polaroids Yet!</h3>
              <p className="text-slate-500 text-xs font-medium mt-1">
                Open the Photo Booth in the Dream Pet House to snap fun polaroids!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photos.map(photo => {
                const specInfo = SPECIES_CATALOG[photo.species];

                return (
                  <div
                    key={photo.id}
                    className="bg-white rounded-2xl p-4 shadow-md border-2 border-amber-200 flex flex-col justify-between transform hover:scale-[1.02] transition-transform"
                  >
                    {/* Polaroid Picture area */}
                    <div className="w-full h-36 bg-gradient-to-tr from-sky-100 via-amber-50 to-pink-100 rounded-xl flex items-center justify-center relative border border-slate-200 shadow-inner">
                      <div className="text-5xl">{specInfo?.emoji || '🐾'}</div>
                      {/* Stickers */}
                      <div className="absolute top-2 right-2 flex gap-1 text-lg">
                        {photo.stickers.map((s, idx) => (
                          <span key={idx}>{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <h4 className="font-black text-sm text-slate-800">{photo.title}</h4>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-2 border-t border-slate-100 pt-1">
                        <span>🐾 {photo.petName}</span>
                        <span>📅 {photo.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-sm shadow-lg"
        >
          Close Album
        </button>
      </div>
    </div>
  );
};
