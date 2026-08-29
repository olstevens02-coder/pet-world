import React from 'react';
import { Pet } from '../types/game';
import { PetAvatar } from './PetAvatar';
import { Award, X, Printer, Heart } from 'lucide-react';

interface AdoptionCertificateModalProps {
  pet: Pet;
  onClose: () => void;
}

export const AdoptionCertificateModal: React.FC<AdoptionCertificateModalProps> = ({ pet, onClose }) => {
  const dateStr = pet.adoptionDate || new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-amber-50 rounded-3xl max-w-xl w-full p-8 shadow-2xl border-8 border-amber-400 relative text-slate-800 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-amber-200/60 hover:bg-amber-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Certificate Frame Content */}
        <div className="border-4 border-dashed border-amber-300 rounded-2xl p-6 text-center space-y-4 bg-white/70">
          {/* Header */}
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">
            <Award size={16} />
            <span>Official Certificate of Adoption</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-amber-950 font-['Fredoka']">
            🐾 Sunshine Pet Registry 🐾
          </h2>

          <p className="text-slate-600 text-sm italic">
            This certifies that
          </p>

          <div className="my-2">
            <h1 className="text-4xl font-black text-orange-600 tracking-wide underline decoration-amber-300 decoration-4">
              {pet.name}
            </h1>
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mt-1">
              Species: {pet.species.toUpperCase()} ({pet.breedVariant})
            </p>
          </div>

          {/* Center Pet Avatar Stamp */}
          <div className="w-28 h-28 mx-auto bg-gradient-to-b from-amber-100 to-orange-100 rounded-full flex items-center justify-center p-2 border-4 border-amber-400 shadow-md">
            <PetAvatar pet={pet} size="md" interactive={false} />
          </div>

          <p className="text-slate-700 text-xs font-bold max-w-md mx-auto">
            has been officially adopted into a loving home and is legally entitled to unlimited cuddles, delicious snacks, and rides in the Orange Ferrari!
          </p>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t border-amber-200 flex items-center justify-between px-4 text-left">
            <div>
              <span className="text-[10px] uppercase font-black text-slate-400 block">Date of Adoption:</span>
              <span className="text-xs font-black text-slate-800">{dateStr}</span>
            </div>

            {/* Official Gold Seal Stamp */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-600 shadow-lg flex flex-col items-center justify-center text-slate-950 transform rotate-12">
              <Award size={20} />
              <span className="text-[8px] font-black uppercase">Official</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-black text-slate-400 block">Adopted By:</span>
              <span className="text-xs font-black text-orange-600">Best Pet Parent 💖</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-transform"
          >
            Keep in Heart & Close ➔
          </button>
        </div>
      </div>
    </div>
  );
};
