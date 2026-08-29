import React, { useState, useEffect } from 'react';
import { Pet, AnimalType } from '../types/game';
import { soundManager } from '../utils/audio';

interface PetAvatarProps {
  pet: Pet | { species: AnimalType; colorScheme?: any; accessories?: any; name?: string };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showMood?: boolean;
  interactive?: boolean;
  onPetClick?: () => void;
  className?: string;
  expression?: 'normal' | 'happy' | 'excited' | 'sleepy' | 'eating' | 'driving';
  isWalking?: boolean;
  facing?: 'left' | 'right';
}

const baseUrl = import.meta.env.BASE_URL || '/';

const PET_IMAGE_MAP: Partial<Record<AnimalType, string>> = {
  puppy: `${baseUrl}pets/puppy.png`,
  cat: `${baseUrl}pets/cat.png`,
  kitten: `${baseUrl}pets/kitten.png`,
  parrot: `${baseUrl}pets/parrot.png`,
  gecko: `${baseUrl}pets/gecko.png`,
  ferret: `${baseUrl}pets/ferret.png`,
  axolotl: `${baseUrl}pets/axolotl.png`,
  hedgehog: `${baseUrl}pets/hedgehog.png`,
  snake: `${baseUrl}pets/snake.png`
};

export const PetAvatar: React.FC<PetAvatarProps> = ({
  pet,
  size = 'md',
  showMood = false,
  interactive = true,
  onPetClick,
  className = '',
  expression = 'normal',
  isWalking = false,
  facing = 'right'
}) => {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isPatted, setIsPatted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const species = pet.species;
  const accessories = (pet as Pet).accessories || {};
  const imageSrc = PET_IMAGE_MAP[species];

  const sizeMap = {
    xs: 'w-12 h-12',
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-52 h-52',
    '2xl': 'w-64 h-64'
  };

  const handleInteraction = (e: React.MouseEvent) => {
    if (!interactive) return;

    soundManager.playPetSound(species);
    soundManager.playHeart();
    setIsPatted(true);
    setTimeout(() => setIsPatted(false), 700);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now() + Math.random(), x, y };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);

    if (onPetClick) {
      onPetClick();
    }
  };

  // Fallback 3D SVG for species without pre-rendered PNG
  const renderFallbackSVG = () => {
    if (species === 'hamster') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          <ellipse cx="50" cy="60" rx="25" ry="22" fill="#f59e0b" />
          <ellipse cx="50" cy="63" rx="16" ry="15" fill="#ffffff" />
          <ellipse cx="50" cy="67" rx="3.5" ry="5.5" fill="#78350f" />
          <circle cx="32" cy="22" r="6" fill="#f59e0b" />
          <circle cx="68" cy="22" r="6" fill="#f59e0b" />
          <circle cx="50" cy="38" r="19" fill="#f59e0b" />
          <circle cx="35" cy="42" r="10" fill="#fef3c7" />
          <circle cx="65" cy="42" r="10" fill="#fef3c7" />
          <ellipse cx="50" cy="40" rx="3" ry="2" fill="#fb7185" />
          <path d="M 48 42 Q 50 44 52 42" stroke="#1e293b" strokeWidth="1.2" fill="none" />
          {/* Blue Bandana with Gold Bell */}
          <path d="M 34 50 Q 50 56 66 50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="56" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="42" cy="32" r="4.5" fill="#0f172a" />
          <circle cx="43.5" cy="30.5" r="1.6" fill="#ffffff" />
          <circle cx="58" cy="32" r="4.5" fill="#0f172a" />
          <circle cx="59.5" cy="30.5" r="1.6" fill="#ffffff" />
        </svg>
      );
    }

    if (species === 'guinea_pig') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          <ellipse cx="50" cy="56" rx="29" ry="23" fill="#d97706" />
          <path d="M 48 34 Q 68 36 72 58 Q 60 78 44 78 Z" fill="#ffffff" />
          <ellipse cx="50" cy="62" rx="14" ry="12" fill="#fffbeb" />
          <ellipse cx="32" cy="75" rx="5" ry="3.5" fill="#fed7aa" />
          <ellipse cx="68" cy="75" rx="5" ry="3.5" fill="#fed7aa" />
          <ellipse cx="28" cy="32" rx="5.5" ry="4" fill="#b45309" />
          <ellipse cx="72" cy="32" rx="5.5" ry="4" fill="#ffffff" />
          <ellipse cx="50" cy="44" rx="8" ry="6" fill="#fffbeb" />
          <polygon points="48,42 52,42 50,45" fill="#fb7185" />
          <path d="M 46 46 Q 50 50 54 46" stroke="#1e293b" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* Blue Bandana with Gold Bell */}
          <path d="M 34 50 Q 50 58 66 50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="58" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="38" cy="35" r="4.5" fill="#0f172a" />
          <circle cx="39.5" cy="33.5" r="1.6" fill="#ffffff" />
          <circle cx="62" cy="35" r="4.5" fill="#0f172a" />
          <circle cx="63.5" cy="33.5" r="1.6" fill="#ffffff" />
        </svg>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center text-4xl">
        🐾
      </div>
    );
  };

  return (
    <div
      onClick={handleInteraction}
      className={`relative inline-block select-none ${
        interactive ? 'cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-200' : ''
      } ${facing === 'left' ? 'scale-x-[-1]' : ''} ${className}`}
    >
      <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={pet.species}
            onError={() => setImgError(true)}
            className={`w-full h-full object-contain filter drop-shadow-2xl ${
              isPatted ? 'animate-bounce' : isWalking ? 'animate-bounce-subtle' : 'animate-float'
            }`}
            draggable={false}
          />
        ) : (
          <div
            className={`w-full h-full ${
              isPatted ? 'animate-bounce' : isWalking ? 'animate-bounce-subtle' : 'animate-float'
            }`}
          >
            {renderFallbackSVG()}
          </div>
        )}

        {/* Wearable Accessories Badges */}
        {accessories.hat && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-2xl filter drop-shadow-lg z-20 pointer-events-none">
            {accessories.hat === 'hat_goggles' && '🥽'}
            {accessories.hat === 'hat_detective' && '🕵️'}
            {accessories.hat === 'hat_tophat' && '🎩'}
            {accessories.hat === 'hat_crown' && '👑'}
            {accessories.hat === 'hat_party' && '🥳'}
            {accessories.hat === 'hat_chef' && '👨‍🍳'}
            {accessories.hat === 'hat_flower' && '🌸'}
          </div>
        )}

        {accessories.glasses && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl filter drop-shadow-lg z-20 pointer-events-none">
            {accessories.glasses === 'glass_cool' && '🕶️'}
            {accessories.glasses === 'glass_star' && '⭐'}
            {accessories.glasses === 'glass_heart' && '💖'}
          </div>
        )}

        {/* Floating Heart Particles */}
        {hearts.map(h => (
          <div
            key={h.id}
            className="absolute pointer-events-none text-rose-500 font-bold text-lg animate-ping z-30"
            style={{ left: `${h.x}px`, top: `${h.y - 15}px` }}
          >
            💖
          </div>
        ))}
      </div>

      {showMood && (pet as Pet).name && (
        <div className={`text-center mt-1 ${facing === 'left' ? 'scale-x-[-1]' : ''}`}>
          <div className="font-black text-xs text-amber-100 tracking-wide drop-shadow-md">
            {(pet as Pet).name}
          </div>
          {(pet as Pet).needs && (
            <div className="w-12 h-1.5 bg-stone-800 rounded-full mx-auto mt-0.5 overflow-hidden border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                style={{ width: `${(pet as Pet).needs.happiness}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
