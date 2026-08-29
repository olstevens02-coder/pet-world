import React, { useState } from 'react';
import { Pet, PhotoMemory } from '../types/game';
import { PetAvatar } from './PetAvatar';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Camera, X, Sparkles, Heart, Star, Check } from 'lucide-react';

interface PhotoBoothModalProps {
  pets: Pet[];
  activePetId: string | null;
  currentRoom: string;
  onSavePhoto: (photo: PhotoMemory) => void;
  onClose: () => void;
}

export const PhotoBoothModal: React.FC<PhotoBoothModalProps> = ({
  pets,
  activePetId,
  currentRoom,
  onSavePhoto,
  onClose
}) => {
  const [selectedPetId, setSelectedPetId] = useState<string>(activePetId || pets[0]?.id || '');
  const [selectedFilter, setSelectedFilter] = useState<'normal' | 'vintage' | 'rainbow' | 'sparkle'>('sparkle');
  const [stickers, setStickers] = useState<string[]>(['💖', '⭐', '🏎️']);
  const [photoTitle, setPhotoTitle] = useState('Best Friends Forever!');
  const [isSnapped, setIsSnapped] = useState(false);

  const selectedPet = pets.find(p => p.id === selectedPetId) || pets[0];

  const availableStickers = ['💖', '⭐', '🏎️', '🦴', '👑', '🌈', '🐾', '🎀', '🥳'];

  const toggleSticker = (stk: string) => {
    if (stickers.includes(stk)) {
      setStickers(stickers.filter(s => s !== stk));
    } else {
      if (stickers.length < 5) {
        setStickers([...stickers, stk]);
      }
    }
  };

  const handleSnap = () => {
    soundManager.playPop();
    soundManager.playFanfare();
    setIsSnapped(true);
    confetti({ particleCount: 80, spread: 70 });

    const newPhoto: PhotoMemory = {
      id: 'photo_' + Date.now(),
      date: new Date().toLocaleDateString(),
      title: photoTitle.trim() || 'Sweet Memory',
      petName: selectedPet.name,
      species: selectedPet.species,
      roomOrLocation: currentRoom,
      stickers,
      filter: selectedFilter
    };

    onSavePhoto(newPhoto);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-4 border-amber-400 relative text-slate-800 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-black mb-2">
            <Camera size={14} />
            <span>PET PHOTO BOOTH</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">Snap A Polaroid!</h2>
        </div>

        {/* Polaroid Preview Frame */}
        <div className="bg-slate-100 p-4 rounded-3xl border-2 border-slate-300 shadow-inner mb-6">
          <div
            className={`relative w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-md transition-all ${
              selectedFilter === 'vintage'
                ? 'bg-amber-100/90 sepia'
                : selectedFilter === 'rainbow'
                ? 'bg-gradient-to-tr from-pink-200 via-amber-200 to-sky-200'
                : selectedFilter === 'sparkle'
                ? 'bg-gradient-to-b from-sky-100 to-purple-100'
                : 'bg-white'
            }`}
          >
            {/* Active Pet Avatar */}
            <PetAvatar pet={selectedPet} size="xl" interactive={false} expression="excited" />

            {/* Placed Stickers */}
            <div className="absolute inset-0 pointer-events-none p-4 flex justify-between items-start">
              <div className="flex flex-col gap-2 text-2xl animate-float">
                {stickers.slice(0, 2).map((s, idx) => (
                  <span key={idx}>{s}</span>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-2xl animate-float">
                {stickers.slice(2).map((s, idx) => (
                  <span key={idx}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Title Label */}
          <input
            type="text"
            value={photoTitle}
            onChange={(e) => setPhotoTitle(e.target.value)}
            placeholder="Write a sweet caption..."
            className="w-full text-center mt-3 bg-transparent font-black text-slate-700 text-sm focus:outline-none border-b border-dashed border-slate-300 pb-1"
          />
        </div>

        {/* Sticker Selector */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-black uppercase text-slate-500">Pick Stickers:</label>
          <div className="flex flex-wrap gap-2">
            {availableStickers.map(stk => {
              const isSelected = stickers.includes(stk);
              return (
                <button
                  key={stk}
                  onClick={() => toggleSticker(stk)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    isSelected ? 'bg-amber-400 scale-110 shadow-md ring-2 ring-orange-300' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {stk}
                </button>
              );
            })}
          </div>
        </div>

        {/* Snap / Save Button */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 font-extrabold text-slate-600 rounded-2xl text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSnap}
            className="flex-[2] py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Camera size={18} />
            <span>Save to Album 📸</span>
          </button>
        </div>
      </div>
    </div>
  );
};
