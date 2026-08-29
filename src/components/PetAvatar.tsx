import React, { useState } from 'react';
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
}

export const PetAvatar: React.FC<PetAvatarProps> = ({
  pet,
  size = 'md',
  showMood = false,
  interactive = true,
  onPetClick,
  className = '',
  expression = 'normal'
}) => {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isPatted, setIsPatted] = useState(false);

  const species = pet.species;
  const colors = (pet as Pet).colorScheme || {
    primary: '#f59e0b',
    secondary: '#fef3c7',
    accent: '#d97706',
    eyeColor: '#1e293b',
    bellyColor: '#fffbeb'
  };
  const accessories = (pet as Pet).accessories || {};

  const sizeMap = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
    '2xl': 'w-64 h-64'
  };

  const handleInteraction = (e: React.MouseEvent) => {
    if (!interactive) return;
    
    soundManager.playPetSound(species);
    soundManager.playHeart();
    setIsPatted(true);
    setTimeout(() => setIsPatted(false), 600);

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

  // Render SVG Bodies for each of the 11 animals
  const renderSpeciesSVG = () => {
    const isWagging = expression === 'excited' || isPatted;
    
    switch (species) {
      case 'puppy':
        return (
          <g>
            {/* Wagging Tail */}
            <path
              d="M 68 60 Q 82 50 86 36 Q 80 45 68 56 Z"
              fill={colors.accent}
              className={isWagging ? 'animate-wiggle origin-bottom-left' : ''}
            />
            {/* Body */}
            <ellipse cx="50" cy="62" rx="24" ry="20" fill={colors.primary} />
            <ellipse cx="50" cy="65" rx="15" ry="12" fill={colors.bellyColor || colors.secondary} />
            
            {/* Paws */}
            <ellipse cx="36" cy="78" rx="7" ry="5" fill={colors.secondary} stroke={colors.accent} strokeWidth="1" />
            <ellipse cx="64" cy="78" rx="7" ry="5" fill={colors.secondary} stroke={colors.accent} strokeWidth="1" />

            {/* Head */}
            <circle cx="50" cy="38" r="22" fill={colors.primary} />

            {/* Floppy Ears */}
            <path d="M 32 26 C 20 28, 18 45, 26 50 C 30 46, 34 35, 34 28 Z" fill={colors.accent} />
            <path d="M 68 26 C 80 28, 82 45, 74 50 C 70 46, 66 35, 66 28 Z" fill={colors.accent} />

            {/* Snout */}
            <ellipse cx="50" cy="44" rx="10" ry="8" fill={colors.secondary} />
            <path d="M 46 41 Q 50 44 54 41 Q 50 48 46 41 Z" fill="#1e293b" />
            {/* Mouth & Tongue */}
            {isPatted || expression === 'excited' ? (
              <path d="M 50 45 Q 50 52 54 52 Q 54 47 50 45 Z" fill="#f43f5e" />
            ) : (
              <path d="M 47 45 Q 50 48 53 45" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            )}

            {/* Eyes */}
            <circle cx="41" cy="34" r="4" fill={colors.eyeColor} />
            <circle cx="42" cy="32.5" r="1.5" fill="#ffffff" />
            <circle cx="59" cy="34" r="4" fill={colors.eyeColor} />
            <circle cx="60" cy="32.5" r="1.5" fill="#ffffff" />
          </g>
        );

      case 'cat':
        return (
          <g>
            {/* Curved Cat Tail */}
            <path
              d="M 66 65 Q 85 62 82 42 Q 88 44 80 68 Q 70 72 65 67 Z"
              fill={colors.accent}
              className={isWagging ? 'animate-wiggle' : ''}
            />
            {/* Body */}
            <ellipse cx="50" cy="62" rx="22" ry="19" fill={colors.primary} />
            <ellipse cx="50" cy="65" rx="14" ry="13" fill={colors.bellyColor || colors.secondary} />

            {/* Paws */}
            <ellipse cx="38" cy="77" rx="6" ry="4" fill={colors.secondary} />
            <ellipse cx="62" cy="77" rx="6" ry="4" fill={colors.secondary} />

            {/* Head */}
            <circle cx="50" cy="38" r="20" fill={colors.primary} />

            {/* Pointed Cat Ears */}
            <polygon points="32,32 30,16 43,26" fill={colors.primary} />
            <polygon points="33,30 32,19 41,26" fill="#fda4af" />
            <polygon points="68,32 70,16 57,26" fill={colors.primary} />
            <polygon points="67,30 68,19 59,26" fill="#fda4af" />

            {/* Whiskers */}
            <line x1="26" y1="41" x2="38" y2="42" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
            <line x1="25" y1="45" x2="38" y2="44" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
            <line x1="74" y1="41" x2="62" y2="42" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
            <line x1="75" y1="45" x2="62" y2="44" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />

            {/* Nose & Mouth */}
            <polygon points="48,40 52,40 50,43" fill="#fb7185" />
            <path d="M 47 43 Q 50 46 53 43" stroke="#334155" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Eyes */}
            <ellipse cx="42" cy="35" rx="3.5" ry="4.5" fill={colors.eyeColor} />
            <circle cx="43" cy="33.5" r="1.3" fill="#ffffff" />
            <ellipse cx="58" cy="35" rx="3.5" ry="4.5" fill={colors.eyeColor} />
            <circle cx="59" cy="33.5" r="1.3" fill="#ffffff" />
          </g>
        );

      case 'kitten':
        return (
          <g>
            {/* Tiny Kitten Tail */}
            <path d="M 64 64 Q 78 60 76 46 Q 73 58 64 66 Z" fill={colors.accent} />
            {/* Petite Body */}
            <ellipse cx="50" cy="63" rx="18" ry="16" fill={colors.primary} />
            <ellipse cx="50" cy="65" rx="11" ry="10" fill={colors.bellyColor || colors.secondary} />
            {/* Little Paws */}
            <ellipse cx="40" cy="76" rx="5" ry="3.5" fill={colors.secondary} />
            <ellipse cx="60" cy="76" rx="5" ry="3.5" fill={colors.secondary} />

            {/* Big Round Head */}
            <circle cx="50" cy="36" r="22" fill={colors.primary} />

            {/* Big Cute Ears */}
            <polygon points="32,28 26,12 41,22" fill={colors.primary} />
            <polygon points="33,26 29,15 39,22" fill="#fda4af" />
            <polygon points="68,28 74,12 59,22" fill={colors.primary} />
            <polygon points="67,26 71,15 61,22" fill="#fda4af" />

            {/* Whiskers */}
            <line x1="28" y1="41" x2="37" y2="41" stroke="#94a3b8" strokeWidth="1" />
            <line x1="72" y1="41" x2="63" y2="41" stroke="#94a3b8" strokeWidth="1" />

            {/* Nose & Cute Little Mouth */}
            <circle cx="50" cy="40" r="2" fill="#fb7185" />
            <path d="M 47 42 Q 50 45 53 42" stroke="#334155" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Extra Large Shiny Kitten Eyes */}
            <circle cx="41" cy="33" r="5.5" fill={colors.eyeColor} />
            <circle cx="42.5" cy="31" r="2.2" fill="#ffffff" />
            <circle cx="39.5" cy="35" r="1" fill="#ffffff" />
            <circle cx="59" cy="33" r="5.5" fill={colors.eyeColor} />
            <circle cx="60.5" cy="31" r="2.2" fill="#ffffff" />
            <circle cx="57.5" cy="35" r="1" fill="#ffffff" />
          </g>
        );

      case 'parrot':
        return (
          <g>
            {/* Colorful Tail Feathers */}
            <path d="M 50 70 L 45 92 L 50 88 L 55 92 Z" fill={colors.accent} />
            <path d="M 48 70 L 40 90 L 48 85 Z" fill={colors.primary} />
            <path d="M 52 70 L 60 90 L 52 85 Z" fill={colors.secondary} />

            {/* Body */}
            <ellipse cx="50" cy="54" rx="19" ry="24" fill={colors.primary} />
            <ellipse cx="50" cy="56" rx="13" ry="17" fill={colors.bellyColor || colors.secondary} />

            {/* Wings */}
            <path d="M 33 46 Q 22 60 30 75 Q 38 65 37 48 Z" fill={colors.secondary} />
            <path d="M 67 46 Q 78 60 70 75 Q 62 65 63 48 Z" fill={colors.accent} />

            {/* Little Perch Feet */}
            <ellipse cx="44" cy="77" rx="4" ry="2.5" fill="#f59e0b" />
            <ellipse cx="56" cy="77" rx="4" ry="2.5" fill="#f59e0b" />

            {/* Crest Feather Crown */}
            <path d="M 50 24 Q 48 10 40 14 Q 47 18 48 24 Z" fill={colors.primary} />
            <path d="M 50 24 Q 52 8 56 12 Q 52 17 50 24 Z" fill={colors.accent} />

            {/* Head */}
            <circle cx="50" cy="32" r="16" fill={colors.primary} />
            {/* White Eye Patch */}
            <circle cx="43" cy="30" r="6" fill="#ffffff" />
            <circle cx="57" cy="30" r="6" fill="#ffffff" />

            {/* Eyes */}
            <circle cx="43" cy="30" r="3" fill={colors.eyeColor} />
            <circle cx="44" cy="29" r="1" fill="#ffffff" />
            <circle cx="57" cy="30" r="3" fill={colors.eyeColor} />
            <circle cx="58" cy="29" r="1" fill="#ffffff" />

            {/* Curved Parrot Beak */}
            <path d="M 46 32 Q 50 32 54 32 Q 52 44 50 44 Q 48 44 46 32 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
          </g>
        );

      case 'gecko':
        return (
          <g>
            {/* Curled Spotted Tail */}
            <path d="M 58 68 Q 80 75 75 90 Q 64 88 56 75 Z" fill={colors.primary} stroke={colors.secondary} strokeWidth="1" />
            {/* S-curve Body */}
            <ellipse cx="50" cy="58" rx="20" ry="18" fill={colors.primary} />
            <ellipse cx="50" cy="60" rx="13" ry="12" fill={colors.bellyColor || colors.secondary} />

            {/* Cute Spotted Dots */}
            <circle cx="42" cy="54" r="2" fill={colors.accent} />
            <circle cx="58" cy="56" r="2.5" fill={colors.accent} />
            <circle cx="50" cy="66" r="2" fill={colors.accent} />

            {/* Sticky Toes */}
            <circle cx="30" cy="54" r="3" fill={colors.primary} />
            <circle cx="28" cy="59" r="3" fill={colors.primary} />
            <circle cx="70" cy="54" r="3" fill={colors.primary} />
            <circle cx="72" cy="59" r="3" fill={colors.primary} />

            {/* Gecko Head with Wide Smile */}
            <ellipse cx="50" cy="35" rx="21" ry="15" fill={colors.primary} />
            {/* Big Smiling Gecko Eyes on Top */}
            <circle cx="36" cy="26" r="7" fill={colors.primary} stroke={colors.accent} strokeWidth="1" />
            <circle cx="36" cy="26" r="5" fill={colors.eyeColor} />
            <circle cx="37" cy="24.5" r="1.5" fill="#ffffff" />

            <circle cx="64" cy="26" r="7" fill={colors.primary} stroke={colors.accent} strokeWidth="1" />
            <circle cx="64" cy="26" r="5" fill={colors.eyeColor} />
            <circle cx="65" cy="24.5" r="1.5" fill="#ffffff" />

            {/* Permanent Sweet Smile */}
            <path d="M 40 40 Q 50 47 60 40" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="39" cy="40" r="1" fill="#78350f" />
            <circle cx="61" cy="40" r="1" fill="#78350f" />
          </g>
        );

      case 'ferret':
        return (
          <g>
            {/* Long Noodle Body */}
            <path d="M 62 60 Q 76 68 84 55 Q 82 72 65 72 Z" fill={colors.primary} />
            <ellipse cx="50" cy="62" rx="20" ry="22" fill={colors.primary} />
            <ellipse cx="50" cy="64" rx="12" ry="15" fill={colors.bellyColor || colors.accent} />

            {/* Paws */}
            <ellipse cx="38" cy="79" rx="5" ry="4" fill={colors.secondary} />
            <ellipse cx="62" cy="79" rx="5" ry="4" fill={colors.secondary} />

            {/* Head */}
            <ellipse cx="50" cy="36" rx="19" ry="16" fill={colors.primary} />

            {/* Bandit Eye Mask */}
            <path d="M 33 34 Q 50 39 67 34 Q 63 28 50 32 Q 37 28 33 34 Z" fill={colors.secondary} />

            {/* Round Ears */}
            <circle cx="34" cy="24" r="5.5" fill={colors.primary} />
            <circle cx="34" cy="24" r="3" fill="#fda4af" />
            <circle cx="66" cy="24" r="5.5" fill={colors.primary} />
            <circle cx="66" cy="24" r="3" fill="#fda4af" />

            {/* Snout & Nose */}
            <ellipse cx="50" cy="42" rx="7" ry="5.5" fill={colors.accent} />
            <polygon points="48,40 52,40 50,43" fill="#fb7185" />
            <path d="M 48 44 Q 50 46 52 44" stroke="#1e293b" strokeWidth="1" fill="none" />

            {/* Eyes in Mask */}
            <circle cx="41" cy="33" r="3" fill={colors.eyeColor} />
            <circle cx="41.8" cy="32" r="1" fill="#ffffff" />
            <circle cx="59" cy="33" r="3" fill={colors.eyeColor} />
            <circle cx="59.8" cy="32" r="1" fill="#ffffff" />
          </g>
        );

      case 'axolotl':
        return (
          <g>
            {/* Feathery Coral Gills */}
            {/* Left Gills */}
            <path d="M 32 30 Q 14 20 18 28 Q 24 30 32 34 Z" fill={colors.secondary} className="animate-wiggle" />
            <path d="M 30 36 Q 10 35 15 42 Q 22 41 30 39 Z" fill={colors.accent} />
            <path d="M 32 42 Q 16 50 22 54 Q 26 49 32 44 Z" fill={colors.secondary} />

            {/* Right Gills */}
            <path d="M 68 30 Q 86 20 82 28 Q 76 30 68 34 Z" fill={colors.secondary} className="animate-wiggle" />
            <path d="M 70 36 Q 90 35 85 42 Q 78 41 70 39 Z" fill={colors.accent} />
            <path d="M 68 42 Q 84 50 78 54 Q 74 49 68 44 Z" fill={colors.secondary} />

            {/* Swimmer Tail */}
            <path d="M 50 68 Q 62 88 56 94 Q 46 84 50 68 Z" fill={colors.accent} opacity="0.8" />

            {/* Soft Body */}
            <ellipse cx="50" cy="62" rx="18" ry="16" fill={colors.primary} />
            <ellipse cx="50" cy="64" rx="12" ry="10" fill={colors.bellyColor || '#ffe4e6'} />

            {/* Tiny Front Feet */}
            <ellipse cx="38" cy="74" rx="4" ry="3" fill={colors.primary} />
            <ellipse cx="62" cy="74" rx="4" ry="3" fill={colors.primary} />

            {/* Wide Smiling Face */}
            <ellipse cx="50" cy="38" rx="22" ry="16" fill={colors.primary} />

            {/* Blush Cheeks */}
            <circle cx="35" cy="42" r="3.5" fill="#fb7185" opacity="0.6" />
            <circle cx="65" cy="42" r="3.5" fill="#fb7185" opacity="0.6" />

            {/* Big Beady Smiling Eyes */}
            <circle cx="40" cy="34" r="4" fill={colors.eyeColor} />
            <circle cx="41.2" cy="32.8" r="1.3" fill="#ffffff" />
            <circle cx="60" cy="34" r="4" fill={colors.eyeColor} />
            <circle cx="61.2" cy="32.8" r="1.3" fill="#ffffff" />

            {/* Happy Curved Smile */}
            <path d="M 44 42 Q 50 48 56 42" stroke="#be185d" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'hedgehog':
        return (
          <g>
            {/* Spiky Quill Shell */}
            <circle cx="50" cy="48" r="28" fill={colors.secondary} />
            {/* Outer Spikes */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 50 + Math.cos(rad) * 26;
              const y1 = 48 + Math.sin(rad) * 26;
              const x2 = 50 + Math.cos(rad) * 33;
              const y2 = 48 + Math.sin(rad) * 33;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={colors.accent || '#78350f'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Soft Peach Face & Belly */}
            <ellipse cx="50" cy="54" rx="20" ry="18" fill={colors.primary} />
            <ellipse cx="50" cy="58" rx="14" ry="12" fill={colors.bellyColor || '#fef3c7'} />

            {/* Tiny Soft Ears */}
            <circle cx="34" cy="36" r="4" fill={colors.primary} />
            <circle cx="34" cy="36" r="2.5" fill="#fda4af" />
            <circle cx="66" cy="36" r="4" fill={colors.primary} />
            <circle cx="66" cy="36" r="2.5" fill="#fda4af" />

            {/* Tiny Paws */}
            <ellipse cx="38" cy="71" rx="4" ry="3" fill="#fed7aa" />
            <ellipse cx="62" cy="71" rx="4" ry="3" fill="#fed7aa" />

            {/* Shiny Snuffle Nose */}
            <ellipse cx="50" cy="46" rx="4" ry="3" fill="#1e293b" />
            <circle cx="49" cy="45" r="1" fill="#ffffff" />
            <path d="M 48 49 Q 50 51 52 49" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Beady Eyes */}
            <circle cx="42" cy="41" r="3.2" fill={colors.eyeColor} />
            <circle cx="43" cy="40" r="1" fill="#ffffff" />
            <circle cx="58" cy="41" r="3.2" fill={colors.eyeColor} />
            <circle cx="59" cy="40" r="1" fill="#ffffff" />
          </g>
        );

      case 'snake':
        return (
          <g>
            {/* Gracefully Coiled Body */}
            <ellipse cx="50" cy="68" rx="28" ry="12" fill={colors.primary} />
            <ellipse cx="50" cy="68" rx="22" ry="7" fill={colors.bellyColor || '#fefce8'} />
            <path
              d="M 28 68 Q 22 55 35 50 Q 50 48 65 52 Q 78 56 72 68"
              stroke={colors.primary}
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
            />
            {/* Pastel Stripes */}
            <circle cx="36" cy="54" r="3" fill={colors.accent} opacity="0.8" />
            <circle cx="50" cy="50" r="3" fill={colors.secondary} opacity="0.8" />
            <circle cx="64" cy="55" r="3" fill={colors.accent} opacity="0.8" />

            {/* Friendly Round Snake Head */}
            <ellipse cx="50" cy="34" rx="16" ry="13" fill={colors.primary} />
            <ellipse cx="50" cy="38" rx="11" ry="8" fill={colors.bellyColor || '#fefce8'} />

            {/* Forked Tongue */}
            <path d="M 50 43 L 50 49 L 47 53 M 50 49 L 53 53" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />

            {/* Big Friendly Eyes */}
            <circle cx="42" cy="31" r="4.5" fill={colors.eyeColor} />
            <circle cx="43.2" cy="29.8" r="1.5" fill="#ffffff" />
            <circle cx="58" cy="31" r="4.5" fill={colors.eyeColor} />
            <circle cx="59.2" cy="29.8" r="1.5" fill="#ffffff" />
          </g>
        );

      case 'hamster':
        return (
          <g>
            {/* Tiny Tail */}
            <circle cx="50" cy="77" r="4" fill={colors.secondary} />
            {/* Round Chubby Body */}
            <ellipse cx="50" cy="60" rx="24" ry="20" fill={colors.primary} />
            <ellipse cx="50" cy="62" rx="15" ry="14" fill={colors.bellyColor || '#ffffff'} />

            {/* Paws Holding Seed */}
            <ellipse cx="42" cy="68" rx="4" ry="3" fill="#fed7aa" />
            <ellipse cx="58" cy="68" rx="4" ry="3" fill="#fed7aa" />
            <ellipse cx="50" cy="67" rx="3.5" ry="5" fill="#78350f" /> {/* Sunflower seed */}

            {/* Round Ears */}
            <circle cx="33" cy="24" r="6" fill={colors.primary} />
            <circle cx="33" cy="24" r="3.5" fill="#fda4af" />
            <circle cx="67" cy="24" r="6" fill={colors.primary} />
            <circle cx="67" cy="24" r="3.5" fill="#fda4af" />

            {/* Giant Puffed Cheeks Head */}
            <circle cx="50" cy="38" r="18" fill={colors.primary} />
            <circle cx="36" cy="42" r="9" fill={colors.secondary} />
            <circle cx="64" cy="42" r="9" fill={colors.secondary} />

            {/* Snout & Whiskers */}
            <line x1="24" y1="42" x2="33" y2="42" stroke="#94a3b8" strokeWidth="1" />
            <line x1="76" y1="42" x2="67" y2="42" stroke="#94a3b8" strokeWidth="1" />
            <ellipse cx="50" cy="40" rx="3" ry="2" fill="#fb7185" />
            <path d="M 48 42 Q 50 44 52 42" stroke="#1e293b" strokeWidth="1.2" fill="none" />

            {/* Shiny Beady Eyes */}
            <circle cx="43" cy="33" r="4" fill={colors.eyeColor} />
            <circle cx="44.2" cy="31.8" r="1.4" fill="#ffffff" />
            <circle cx="57" cy="33" r="4" fill={colors.eyeColor} />
            <circle cx="58.2" cy="31.8" r="1.4" fill="#ffffff" />
          </g>
        );

      case 'guinea_pig':
        return (
          <g>
            {/* Oblong Fluff-Potato Body */}
            <ellipse cx="50" cy="56" rx="28" ry="22" fill={colors.primary} />
            {/* Calico Patch */}
            <path d="M 50 34 Q 68 36 72 58 Q 60 76 44 76 Z" fill={colors.secondary} />
            <ellipse cx="50" cy="62" rx="14" ry="12" fill={colors.bellyColor || '#ffffff'} />

            {/* Tiny Paws */}
            <ellipse cx="32" cy="74" rx="5" ry="3.5" fill="#fed7aa" />
            <ellipse cx="68" cy="74" rx="5" ry="3.5" fill="#fed7aa" />

            {/* Guinea Pig Round Ears */}
            <ellipse cx="30" cy="32" rx="5" ry="4" fill={colors.primary} />
            <ellipse cx="30" cy="32" rx="3" ry="2" fill="#fda4af" />
            <ellipse cx="70" cy="32" rx="5" ry="4" fill={colors.secondary} />
            <ellipse cx="70" cy="32" rx="3" ry="2" fill="#fda4af" />

            {/* Snout & Whiskers */}
            <ellipse cx="50" cy="44" rx="7" ry="5.5" fill="#fffbeb" />
            <polygon points="48,42 52,42 50,45" fill="#fb7185" />
            {/* Squeaking "Wheek" mouth */}
            <path d="M 47 46 Q 50 49 53 46" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Eyes */}
            <circle cx="39" cy="36" r="4.2" fill={colors.eyeColor} />
            <circle cx="40.2" cy="34.8" r="1.4" fill="#ffffff" />
            <circle cx="61" cy="36" r="4.2" fill={colors.eyeColor} />
            <circle cx="62.2" cy="34.8" r="1.4" fill="#ffffff" />
          </g>
        );

      default:
        return (
          <circle cx="50" cy="50" r="30" fill={colors.primary} />
        );
    }
  };

  // Render Wearable Accessories
  const renderAccessories = () => {
    return (
      <g>
        {/* Outfits: Super Cape */}
        {accessories.outfit === 'outfit_cape' && (
          <path d="M 32 50 Q 20 70 24 85 Q 50 78 76 85 Q 80 70 68 50 Z" fill="#3b82f6" opacity="0.9" />
        )}

        {/* Neck Accessories */}
        {accessories.neck === 'neck_bowtie' && (
          <g>
            <polygon points="44,52 50,56 44,60" fill="#ef4444" />
            <polygon points="56,52 50,56 56,60" fill="#ef4444" />
            <circle cx="50" cy="56" r="2.5" fill="#b91c1c" />
          </g>
        )}
        {accessories.neck === 'neck_bandana' && (
          <polygon points="38,52 62,52 50,66" fill="#ff5500" stroke="#ffffff" strokeWidth="1" />
        )}
        {accessories.neck === 'neck_medal' && (
          <g>
            <line x1="42" y1="52" x2="50" y2="60" stroke="#3b82f6" strokeWidth="2" />
            <line x1="58" y1="52" x2="50" y2="60" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="50" cy="62" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <text x="50" y="64" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#78350f">1</text>
          </g>
        )}

        {/* Glasses */}
        {accessories.glasses === 'glass_cool' && (
          <g>
            <rect x="34" y="30" width="13" height="8" rx="2" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
            <rect x="53" y="30" width="13" height="8" rx="2" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
            <line x1="47" y1="33" x2="53" y2="33" stroke="#d97706" strokeWidth="1.5" />
          </g>
        )}
        {accessories.glasses === 'glass_heart' && (
          <g>
            <path d="M 40 31 C 36 28 32 32 40 38 C 48 32 44 28 40 31 Z" fill="#f43f5e" />
            <path d="M 60 31 C 56 28 52 32 60 38 C 68 32 64 28 60 31 Z" fill="#f43f5e" />
            <line x1="45" y1="33" x2="55" y2="33" stroke="#f43f5e" strokeWidth="1.5" />
          </g>
        )}
        {accessories.glasses === 'glass_star' && (
          <g>
            <polygon points="40,28 42,33 47,33 43,36 45,41 40,38 35,41 37,36 33,33 38,33" fill="#eab308" />
            <polygon points="60,28 62,33 67,33 63,36 65,41 60,38 55,41 57,36 53,33 58,33" fill="#eab308" />
          </g>
        )}

        {/* Hats */}
        {accessories.hat === 'hat_party' && (
          <g>
            <polygon points="50,6 40,24 60,24" fill="#ec4899" />
            <circle cx="50" cy="5" r="3" fill="#facc15" />
            <circle cx="45" cy="18" r="1.5" fill="#38bdf8" />
            <circle cx="54" cy="15" r="1.5" fill="#4ade80" />
          </g>
        )}
        {accessories.hat === 'hat_crown' && (
          <g>
            <polygon points="36,22 40,10 45,18 50,8 55,18 60,10 64,22" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="40" cy="10" r="1.5" fill="#ef4444" />
            <circle cx="50" cy="8" r="2" fill="#3b82f6" />
            <circle cx="60" cy="10" r="1.5" fill="#10b981" />
          </g>
        )}
        {accessories.hat === 'hat_tophat' && (
          <g>
            <rect x="40" y="8" width="20" height="15" fill="#1e293b" />
            <rect x="32" y="21" width="36" height="4" rx="2" fill="#1e293b" />
            <rect x="40" y="19" width="20" height="2.5" fill="#ef4444" />
          </g>
        )}
        {accessories.hat === 'hat_chef' && (
          <g>
            <path d="M 40 22 C 32 14 42 6 50 8 C 58 6 68 14 60 22 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <rect x="41" y="20" width="18" height="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
          </g>
        )}
        {accessories.hat === 'hat_goggles' && (
          <g>
            <rect x="33" y="18" width="34" height="6" rx="3" fill="#ff5500" />
            <circle cx="42" cy="21" r="5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="58" cy="21" r="5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
          </g>
        )}
        {accessories.hat === 'hat_flower' && (
          <g>
            <circle cx="38" cy="20" r="4" fill="#f43f5e" />
            <circle cx="46" cy="17" r="4" fill="#fbbf24" />
            <circle cx="54" cy="17" r="4" fill="#a855f7" />
            <circle cx="62" cy="20" r="4" fill="#38bdf8" />
          </g>
        )}
        {accessories.hat === 'hat_detective' && (
          <g>
            <path d="M 34 22 Q 50 14 66 22 L 64 24 Q 50 20 36 24 Z" fill="#78350f" />
            <path d="M 38 20 Q 50 10 62 20 Z" fill="#92400e" />
          </g>
        )}
      </g>
    );
  };

  return (
    <div
      onClick={handleInteraction}
      className={`relative inline-block select-none ${interactive ? 'cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-200' : ''} ${className}`}
    >
      <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full drop-shadow-md ${isPatted ? 'animate-bounce' : 'animate-float'}`}
        >
          {renderSpeciesSVG()}
          {renderAccessories()}
        </svg>

        {/* Floating Heart Particles */}
        {hearts.map(h => (
          <div
            key={h.id}
            className="absolute pointer-events-none text-rose-500 font-bold text-lg animate-ping"
            style={{ left: `${h.x}px`, top: `${h.y - 15}px` }}
          >
            💖
          </div>
        ))}
      </div>

      {/* Optional Mood / Name Tag */}
      {showMood && (pet as Pet).name && (
        <div className="text-center mt-1">
          <div className="font-bold text-xs text-slate-800 tracking-wide">
            {(pet as Pet).name}
          </div>
          {(pet as Pet).needs && (
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-0.5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${(pet as Pet).needs.happiness}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
