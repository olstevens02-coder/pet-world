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
  const [blink, setBlink] = useState(false);

  const species = pet.species;
  const colors = (pet as Pet).colorScheme || {
    primary: '#f59e0b',
    secondary: '#fef3c7',
    accent: '#d97706',
    eyeColor: '#92400e',
    bellyColor: '#ffffff'
  };
  const accessories = (pet as Pet).accessories || {};

  // Natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800 + Math.random() * 2200);

    return () => clearInterval(blinkInterval);
  }, []);

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

  const uid = React.useId().replace(/:/g, '');

  // Render 3D Pixar / Blender Render Style Characters with Clay Gradients, Marshmallow Paws & Blue Bandana
  const renderSpeciesSVG = () => {
    const isWagging = expression === 'excited' || isPatted;

    switch (species) {
      case 'puppy':
        // Exact 3D Beagle/Puppy from user reference image!
        return (
          <g>
            <defs>
              {/* Warm Honey Tan 3D Fur Gradient */}
              <linearGradient id={`pupFur_${uid}`} x1="20%" y1="10%" x2="80%" y2="90%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
              {/* White Blaze & Muzzle Porcelain Gradient */}
              <linearGradient id={`pupWhite_${uid}`} x1="30%" y1="10%" x2="70%" y2="90%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="80%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              {/* Inner Ear Warm Gradient */}
              <linearGradient id={`pupEarIn_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              {/* 3D Glossy Nose Gradient */}
              <radialGradient id={`pupNose_${uid}`} cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="35%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#090d16" />
              </radialGradient>
              {/* 3D Eye Amber Iris */}
              <radialGradient id={`pupEye_${uid}`} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#92400e" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>
              {/* Soft Drop Shadow under paws */}
              <radialGradient id={`pupShadow_${uid}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
              {/* Blue Bandana Gradient */}
              <linearGradient id={`pupBandana_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              {/* Gold Tag Gradient */}
              <radialGradient id={`pupGold_${uid}`} cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </radialGradient>
            </defs>

            {/* Ambient Ground Shadow */}
            <ellipse cx="50" cy="88" rx="38" ry="7" fill={`url(#pupShadow_${uid})`} />

            {/* Wagging Tail with Dark Brown Tip */}
            <path
              d="M 72 68 Q 88 64 86 46 Q 80 56 68 64 Z"
              fill="#78350f"
              className={isWagging || isWalking ? 'animate-wiggle origin-bottom-left' : ''}
            />

            {/* Smooth 3D Tan Body */}
            <path
              d="M 38 48 C 30 60, 28 78, 42 82 C 50 84, 62 84, 70 80 C 76 74, 76 60, 64 48 Z"
              fill={`url(#pupFur_${uid})`}
            />
            {/* Dark Saddle Patch on back */}
            <path
              d="M 60 52 Q 74 62 70 75 Q 60 74 54 62 Z"
              fill="#451a03"
              opacity="0.75"
            />

            {/* Creamy White Chest */}
            <path
              d="M 44 48 C 38 60, 40 76, 50 80 C 58 76, 60 60, 56 48 Z"
              fill={`url(#pupWhite_${uid})`}
            />

            {/* 3D Marshmallow Front Paws (with 4 rounded distinct toes resting forward) */}
            <g>
              {/* Left Paw */}
              <g transform="translate(18, 76)">
                <ellipse cx="6" cy="7" rx="3.5" ry="4.5" fill={`url(#pupWhite_${uid})`} />
                <ellipse cx="11" cy="7" rx="3.5" ry="5.2" fill={`url(#pupWhite_${uid})`} />
                <ellipse cx="16" cy="7" rx="3.5" ry="5.2" fill={`url(#pupWhite_${uid})`} />
                <ellipse cx="21" cy="7" rx="3.5" ry="4.5" fill={`url(#pupWhite_${uid})`} />
                <line x1="8.5" y1="5" x2="8.5" y2="10" stroke="#cbd5e1" strokeWidth="0.8" />
                <line x1="13.5" y1="4" x2="13.5" y2="11" stroke="#cbd5e1" strokeWidth="0.8" />
                <line x1="18.5" y1="5" x2="18.5" y2="10" stroke="#cbd5e1" strokeWidth="0.8" />
              </g>

              {/* Right Paw */}
              <g transform="translate(56, 76)">
                <ellipse cx="6" cy="7" rx="3.5" ry="4.5" fill={`url(#pupWhite_${uid})`} />
                <ellipse cx="11" cy="7" rx="3.5" ry="5.2" fill={`url(#pupWhite_${uid})`} />
                <ellipse cx="16" cy="7" rx="3.5" ry="5.2" fill={`url(#pupWhite_${uid})`} />
                <ellipse cx="21" cy="7" rx="3.5" ry="4.5" fill={`url(#pupWhite_${uid})`} />
                <line x1="8.5" y1="5" x2="8.5" y2="10" stroke="#cbd5e1" strokeWidth="0.8" />
                <line x1="13.5" y1="4" x2="13.5" y2="11" stroke="#cbd5e1" strokeWidth="0.8" />
                <line x1="18.5" y1="5" x2="18.5" y2="10" stroke="#cbd5e1" strokeWidth="0.8" />
              </g>
            </g>

            {/* Blue Bandana with Tied Ribbon Knot & Gold Bell Tag */}
            <g>
              <path d="M 32 46 Q 50 56 68 46 L 66 52 Q 50 62 34 52 Z" fill={`url(#pupBandana_${uid})`} />
              {/* Tied Ribbon Knot on Right */}
              <path d="M 66 48 Q 74 44 76 52 Q 70 54 66 50 Z" fill={`url(#pupBandana_${uid})`} />
              <path d="M 67 50 Q 75 56 73 62 Q 67 58 66 52 Z" fill={`url(#pupBandana_${uid})`} />
              {/* Gold Hanging Bell */}
              <circle cx="50" cy="58" r="4.5" fill={`url(#pupGold_${uid})`} stroke="#854d0e" strokeWidth="0.6" />
              <circle cx="50" cy="59.5" r="1" fill="#713f12" />
            </g>

            {/* 3D Beagle Head with Tilted Angle */}
            <g transform="rotate(1 50 30)">
              {/* Tan Head Base */}
              <ellipse cx="50" cy="28" rx="22" ry="20" fill={`url(#pupFur_${uid})`} />

              {/* White Blaze Stripe Up Forehead */}
              <path
                d="M 45 10 C 47 16, 44 26, 38 34 C 46 36, 54 36, 62 34 C 56 26, 53 16, 55 10 Z"
                fill={`url(#pupWhite_${uid})`}
              />

              {/* Floppy Tan Ears with Smooth Bevels */}
              {/* Left Ear */}
              <path
                d="M 30 16 C 14 14, 8 36, 18 46 C 24 44, 28 32, 30 18 Z"
                fill={`url(#pupFur_${uid})`}
              />
              <path d="M 22 24 C 15 28, 14 38, 20 42" stroke="#9a3412" strokeWidth="1.5" fill="none" opacity="0.6" />

              {/* Right Ear */}
              <path
                d="M 70 16 C 86 14, 92 36, 82 46 C 76 44, 72 32, 70 18 Z"
                fill={`url(#pupFur_${uid})`}
              />
              <path d="M 78 24 C 85 28, 86 38, 80 42" stroke="#9a3412" strokeWidth="1.5" fill="none" opacity="0.6" />

              {/* 3D Rounded White Muzzle */}
              <ellipse cx="50" cy="36" rx="14" ry="10" fill={`url(#pupWhite_${uid})`} />

              {/* Big Glossy Rubbery Button Nose */}
              <ellipse cx="50" cy="31" rx="8" ry="5.5" fill={`url(#pupNose_${uid})`} />
              <ellipse cx="47.5" cy="29" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.85" />

              {/* Open Cheerful Smiling Mouth with Pink Tongue */}
              <path
                d="M 41 36 Q 50 48 59 36"
                fill="#881337"
                stroke="#1e293b"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Pink Tongue Hanging Out */}
              <path
                d="M 45 38 C 45 48, 55 48, 55 38 Z"
                fill="#fb7185"
                stroke="#e11d48"
                strokeWidth="0.8"
              />
              {/* White Upper Tooth Bar */}
              <path d="M 46 36 L 54 36 L 52 38 L 48 38 Z" fill="#ffffff" />

              {/* Dark Expressive Curved Eyebrows */}
              <path d="M 34 16 Q 40 12 46 16" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 54 16 Q 60 12 66 16" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Big Friendly Glossy Cartoon Eyes */}
              {!blink ? (
                <g>
                  {/* Left Eye */}
                  <ellipse cx="40" cy="24" rx="6.5" ry="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
                  <ellipse cx="41" cy="24" rx="4.5" ry="5" fill={`url(#pupEye_${uid})`} />
                  <ellipse cx="41.5" cy="24" rx="2.8" ry="3.2" fill="#000000" />
                  <circle cx="43" cy="21.5" r="1.8" fill="#ffffff" />
                  <circle cx="39.5" cy="25.5" r="0.8" fill="#ffffff" />

                  {/* Right Eye */}
                  <ellipse cx="60" cy="24" rx="6.5" ry="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
                  <ellipse cx="59" cy="24" rx="4.5" ry="5" fill={`url(#pupEye_${uid})`} />
                  <ellipse cx="58.5" cy="24" rx="2.8" ry="3.2" fill="#000000" />
                  <circle cx="60" cy="21.5" r="1.8" fill="#ffffff" />
                  <circle cx="56.5" cy="25.5" r="0.8" fill="#ffffff" />
                </g>
              ) : (
                <g>
                  <path d="M 35 25 Q 40 30 45 25" stroke="#451a03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 55 25 Q 60 30 65 25" stroke="#451a03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </g>
              )}
            </g>
          </g>
        );

      case 'cat':
        // 3D Fluffy British Shorthair / Calico Cat
        return (
          <g>
            <defs>
              <linearGradient id={`cat3d_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <radialGradient id={`catEye3d_${uid}`} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="55%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#064e3b" />
              </radialGradient>
            </defs>

            {/* Plump Curved Tail */}
            <path
              d="M 72 75 Q 92 78 88 56 Q 84 66 70 72 Z"
              fill={`url(#cat3d_${uid})`}
              className={isWagging || isWalking ? 'animate-wiggle' : ''}
            />

            {/* Round Body */}
            <ellipse cx="50" cy="60" rx="30" ry="26" fill={`url(#cat3d_${uid})`} />
            <ellipse cx="50" cy="64" rx="18" ry="16" fill="#f8fafc" />

            {/* Marshmallow Paws */}
            <ellipse cx="42" cy="82" rx="6" ry="4" fill="#ffffff" />
            <ellipse cx="58" cy="82" rx="6" ry="4" fill="#ffffff" />

            {/* Blue Bandana */}
            <path d="M 34 48 Q 50 56 66 48 L 64 54 Q 50 62 36 54 Z" fill="#38bdf8" />
            <circle cx="50" cy="58" r="3.5" fill="#facc15" />

            {/* Head */}
            <circle cx="50" cy="34" r="22" fill={`url(#cat3d_${uid})`} />

            {/* Ears */}
            <polygon points="28,26 22,8 40,18" fill={`url(#cat3d_${uid})`} />
            <polygon points="29,24 25,12 38,18" fill="#fda4af" />
            <polygon points="72,26 78,8 60,18" fill={`url(#cat3d_${uid})`} />
            <polygon points="71,24 75,12 62,18" fill="#fda4af" />

            {/* Muzzle & Whiskers */}
            <ellipse cx="50" cy="38" rx="10" ry="7" fill="#ffffff" />
            <polygon points="48,36 52,36 50,39" fill="#fb7185" />
            <path d="M 47 40 Q 50 43 53 40" stroke="#334155" strokeWidth="1.2" fill="none" />
            <line x1="20" y1="38" x2="36" y2="39" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="80" y1="38" x2="64" y2="39" stroke="#cbd5e1" strokeWidth="1" />

            {/* Big Glossy Eyes */}
            {!blink ? (
              <g>
                <circle cx="39" cy="28" r="6" fill="#ffffff" />
                <circle cx="39" cy="28" r="4.2" fill={`url(#catEye3d_${uid})`} />
                <ellipse cx="39" cy="28" rx="1.6" ry="3.8" fill="#0f172a" />
                <circle cx="40.5" cy="26" r="1.3" fill="#ffffff" />

                <circle cx="61" cy="28" r="6" fill="#ffffff" />
                <circle cx="61" cy="28" r="4.2" fill={`url(#catEye3d_${uid})`} />
                <ellipse cx="61" cy="28" rx="1.6" ry="3.8" fill="#0f172a" />
                <circle cx="62.5" cy="26" r="1.3" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <path d="M 34 28 Q 39 32 44 28" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 56 28 Q 61 32 66 28" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>
            )}
          </g>
        );

      case 'kitten':
        // 3D Fluffy Ginger Kitten
        return (
          <g>
            <defs>
              <linearGradient id={`kit3d_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="62" rx="20" ry="18" fill={`url(#kit3d_${uid})`} />
            <ellipse cx="50" cy="65" rx="12" ry="10" fill="#ffffff" />
            <ellipse cx="41" cy="78" rx="5" ry="3.5" fill="#ffffff" />
            <ellipse cx="59" cy="78" rx="5" ry="3.5" fill="#ffffff" />
            <circle cx="50" cy="34" r="22" fill={`url(#kit3d_${uid})`} />
            <polygon points="30,24 24,8 40,18" fill={`url(#kit3d_${uid})`} />
            <polygon points="31,22 27,11 38,18" fill="#fda4af" />
            <polygon points="70,24 76,8 60,18" fill={`url(#kit3d_${uid})`} />
            <polygon points="69,22 73,11 62,18" fill="#fda4af" />
            <circle cx="50" cy="39" r="2.2" fill="#fb7185" />
            <path d="M 47 42 Q 50 45 53 42" stroke="#7c2d12" strokeWidth="1.2" fill="none" />
            {!blink ? (
              <g>
                <circle cx="39" cy="29" r="7" fill="#ffffff" />
                <circle cx="39" cy="29" r="5" fill="#0284c7" />
                <circle cx="41" cy="26.5" r="1.8" fill="#ffffff" />
                <circle cx="61" cy="29" r="7" fill="#ffffff" />
                <circle cx="61" cy="29" r="5" fill="#0284c7" />
                <circle cx="63" cy="26.5" r="1.8" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <path d="M 33 29 Q 39 34 45 29" stroke="#7c2d12" strokeWidth="2" fill="none" />
                <path d="M 55 29 Q 61 34 67 29" stroke="#7c2d12" strokeWidth="2" fill="none" />
              </g>
            )}
          </g>
        );

      case 'parrot':
        // 3D Glossy Conure / Macaw
        return (
          <g>
            <path d="M 50 70 L 44 94 L 50 90 L 56 94 Z" fill="#3b82f6" />
            <ellipse cx="50" cy="54" rx="20" ry="24" fill="#22c55e" />
            <ellipse cx="50" cy="56" rx="13" ry="16" fill="#fef08a" />
            <path d="M 31 46 Q 18 60 28 76 Q 38 66 36 48 Z" fill="#eab308" />
            <path d="M 69 46 Q 82 60 72 76 Q 62 66 64 48 Z" fill="#ef4444" />
            <ellipse cx="44" cy="78" rx="4" ry="2.5" fill="#f59e0b" />
            <ellipse cx="56" cy="78" rx="4" ry="2.5" fill="#f59e0b" />
            <circle cx="50" cy="30" r="16" fill="#22c55e" />
            <circle cx="43" cy="28" r="6.5" fill="#ffffff" />
            <circle cx="57" cy="28" r="6.5" fill="#ffffff" />
            <path d="M 45 30 Q 50 30 55 30 Q 53 44 50 44 Q 47 44 45 30 Z" fill="#1e293b" />
            {!blink ? (
              <g>
                <circle cx="43" cy="28" r="3.5" fill="#0f172a" />
                <circle cx="44" cy="27" r="1.3" fill="#ffffff" />
                <circle cx="57" cy="28" r="3.5" fill="#0f172a" />
                <circle cx="58" cy="27" r="1.3" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <line x1="39" y1="28" x2="47" y2="28" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                <line x1="53" y1="28" x2="61" y2="28" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
          </g>
        );

      case 'gecko':
        // 3D Smiling Leopard Gecko
        return (
          <g>
            <path d="M 58 68 Q 82 76 76 92 Q 62 90 56 75 Z" fill="#facc15" />
            <ellipse cx="50" cy="58" rx="22" ry="19" fill="#facc15" />
            <ellipse cx="50" cy="61" rx="14" ry="12" fill="#fffbeb" />
            <circle cx="42" cy="54" r="2.5" fill="#78350f" opacity="0.5" />
            <circle cx="58" cy="56" r="3" fill="#78350f" opacity="0.5" />
            <circle cx="28" cy="56" r="3.5" fill="#facc15" />
            <circle cx="72" cy="56" r="3.5" fill="#facc15" />
            <ellipse cx="50" cy="35" rx="22" ry="16" fill="#facc15" />
            <circle cx="36" cy="25" r="7.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="36" cy="25" r="5.5" fill="#451a03" />
            <circle cx="37.5" cy="23" r="1.5" fill="#ffffff" />
            <circle cx="64" cy="25" r="7.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="64" cy="25" r="5.5" fill="#451a03" />
            <circle cx="65.5" cy="23" r="1.5" fill="#ffffff" />
            <path d="M 38 40 Q 50 48 62 40" stroke="#78350f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'ferret':
        // 3D Noodle Ferret
        return (
          <g>
            <path d="M 64 60 Q 80 68 86 54 Q 84 74 66 72 Z" fill="#94a3b8" />
            <ellipse cx="50" cy="62" rx="20" ry="22" fill="#94a3b8" />
            <ellipse cx="50" cy="65" rx="12" ry="14" fill="#ffffff" />
            <ellipse cx="38" cy="80" rx="5" ry="4" fill="#475569" />
            <ellipse cx="62" cy="80" rx="5" ry="4" fill="#475569" />
            <ellipse cx="50" cy="35" rx="20" ry="16" fill="#94a3b8" />
            <path d="M 32 33 Q 50 38 68 33 Q 64 27 50 31 Q 36 27 32 33 Z" fill="#334155" />
            <circle cx="34" cy="22" r="5" fill="#94a3b8" />
            <circle cx="66" cy="22" r="5" fill="#94a3b8" />
            <polygon points="48,39 52,39 50,42" fill="#fb7185" />
            <path d="M 48 43 Q 50 45 52 43" stroke="#1e293b" strokeWidth="1" fill="none" />
            {!blink ? (
              <g>
                <circle cx="40" cy="32" r="3.5" fill="#0f172a" />
                <circle cx="41" cy="31" r="1.2" fill="#ffffff" />
                <circle cx="60" cy="32" r="3.5" fill="#0f172a" />
                <circle cx="61" cy="31" r="1.2" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <line x1="37" y1="32" x2="43" y2="32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="57" y1="32" x2="63" y2="32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}
          </g>
        );

      case 'axolotl':
        // 3D Smiling Pink Axolotl
        return (
          <g>
            <g className="animate-wiggle origin-center">
              <path d="M 30 28 Q 12 18 16 26 Q 22 28 30 32 Z" fill="#fb7185" />
              <path d="M 28 34 Q 8 33 13 40 Q 20 39 28 37 Z" fill="#fda4af" />
              <path d="M 70 28 Q 88 18 84 26 Q 78 28 70 32 Z" fill="#fb7185" />
              <path d="M 72 34 Q 92 33 87 40 Q 80 39 72 37 Z" fill="#fda4af" />
            </g>
            <path d="M 50 68 Q 62 88 56 94 Q 46 84 50 68 Z" fill="#f472b6" opacity="0.85" />
            <ellipse cx="50" cy="62" rx="18" ry="16" fill="#f472b6" />
            <ellipse cx="50" cy="64" rx="12" ry="10" fill="#fff1f2" />
            <ellipse cx="50" cy="38" rx="23" ry="17" fill="#f472b6" />
            <circle cx="34" cy="42" r="4" fill="#fb7185" opacity="0.7" />
            <circle cx="66" cy="42" r="4" fill="#fb7185" opacity="0.7" />
            <path d="M 43 42 Q 50 48 57 42" stroke="#be185d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            {!blink ? (
              <g>
                <circle cx="39" cy="33" r="4.5" fill="#0f172a" />
                <circle cx="40.5" cy="31.5" r="1.6" fill="#ffffff" />
                <circle cx="61" cy="33" r="4.5" fill="#0f172a" />
                <circle cx="62.5" cy="31.5" r="1.6" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <path d="M 35 34 Q 39 38 43 34" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 57 34 Q 61 38 65 34" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>
            )}
          </g>
        );

      case 'hedgehog':
        // 3D Hedgehog
        return (
          <g>
            <circle cx="50" cy="48" r="28" fill="#b45309" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 50 + Math.cos(rad) * 26;
              const y1 = 48 + Math.sin(rad) * 26;
              const x2 = 50 + Math.cos(rad) * 34;
              const y2 = 48 + Math.sin(rad) * 34;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />;
            })}
            <ellipse cx="50" cy="54" rx="20" ry="18" fill="#fef3c7" />
            <ellipse cx="50" cy="58" rx="14" ry="12" fill="#fed7aa" />
            <ellipse cx="50" cy="46" rx="4.5" ry="3.5" fill="#1e293b" />
            <circle cx="49" cy="45" r="1.2" fill="#ffffff" />
            <path d="M 48 49 Q 50 51 52 49" stroke="#1e293b" strokeWidth="1.2" fill="none" />
            {!blink ? (
              <g>
                <circle cx="42" cy="40" r="3.5" fill="#0f172a" />
                <circle cx="43" cy="39" r="1.2" fill="#ffffff" />
                <circle cx="58" cy="40" r="3.5" fill="#0f172a" />
                <circle cx="59" cy="39" r="1.2" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <line x1="39" y1="40" x2="45" y2="40" stroke="#0f172a" strokeWidth="1.5" />
                <line x1="55" y1="40" x2="61" y2="40" stroke="#0f172a" strokeWidth="1.5" />
              </g>
            )}
          </g>
        );

      case 'snake':
        // 3D Pastel Python
        return (
          <g>
            <ellipse cx="50" cy="68" rx="28" ry="12" fill="#f472b6" />
            <path d="M 28 68 Q 22 54 35 48 Q 50 46 65 50 Q 78 54 72 68" stroke="#f472b6" strokeWidth="14" fill="none" strokeLinecap="round" />
            <ellipse cx="50" cy="34" rx="17" ry="14" fill="#f472b6" />
            <ellipse cx="50" cy="38" rx="11" ry="8" fill="#fefce8" />
            <path d="M 50 43 L 50 50 L 47 54 M 50 50 L 53 54" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
            {!blink ? (
              <g>
                <circle cx="41" cy="30" r="5" fill="#ffffff" />
                <circle cx="41" cy="30" r="3.5" fill="#0f172a" />
                <circle cx="42.5" cy="28.5" r="1.5" fill="#ffffff" />
                <circle cx="59" cy="30" r="5" fill="#ffffff" />
                <circle cx="59" cy="30" r="3.5" fill="#0f172a" />
                <circle cx="60.5" cy="28.5" r="1.5" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <path d="M 37 30 Q 41 34 45 30" stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M 55 30 Q 59 34 63 30" stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>
            )}
          </g>
        );

      case 'hamster':
        // 3D Hamster
        return (
          <g>
            <ellipse cx="50" cy="60" rx="25" ry="22" fill="#fbbf24" />
            <ellipse cx="50" cy="63" rx="16" ry="15" fill="#ffffff" />
            <ellipse cx="50" cy="67" rx="3.5" ry="5.5" fill="#78350f" />
            <circle cx="32" cy="22" r="6" fill="#fbbf24" />
            <circle cx="68" cy="22" r="6" fill="#fbbf24" />
            <circle cx="50" cy="38" r="19" fill="#fbbf24" />
            <circle cx="35" cy="42" r="10" fill="#fef3c7" />
            <circle cx="65" cy="42" r="10" fill="#fef3c7" />
            <ellipse cx="50" cy="40" rx="3" ry="2" fill="#fb7185" />
            <path d="M 48 42 Q 50 44 52 42" stroke="#1e293b" strokeWidth="1.2" fill="none" />
            {!blink ? (
              <g>
                <circle cx="42" cy="32" r="4.5" fill="#0f172a" />
                <circle cx="43.5" cy="30.5" r="1.6" fill="#ffffff" />
                <circle cx="58" cy="32" r="4.5" fill="#0f172a" />
                <circle cx="59.5" cy="30.5" r="1.6" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <line x1="38" y1="32" x2="46" y2="32" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                <line x1="54" y1="32" x2="62" y2="32" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
          </g>
        );

      case 'guinea_pig':
        // 3D Guinea Pig
        return (
          <g>
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
            {!blink ? (
              <g>
                <circle cx="38" cy="35" r="4.5" fill="#0f172a" />
                <circle cx="39.5" cy="33.5" r="1.6" fill="#ffffff" />
                <circle cx="62" cy="35" r="4.5" fill="#0f172a" />
                <circle cx="63.5" cy="33.5" r="1.6" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <path d="M 34 35 Q 38 39 42 35" stroke="#0f172a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M 58 35 Q 62 39 66 35" stroke="#0f172a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              </g>
            )}
          </g>
        );

      default:
        return <circle cx="50" cy="50" r="30" fill={colors.primary} />;
    }
  };

  // Render Wearable Accessories
  const renderAccessories = () => {
    return (
      <g>
        {accessories.outfit === 'outfit_cape' && (
          <path d="M 32 50 Q 20 70 24 85 Q 50 78 76 85 Q 80 70 68 50 Z" fill="#3b82f6" opacity="0.9" />
        )}
        {accessories.neck === 'neck_bowtie' && (
          <g>
            <polygon points="44,50 50,54 44,58" fill="#ef4444" />
            <polygon points="56,50 50,54 56,58" fill="#ef4444" />
            <circle cx="50" cy="54" r="2.5" fill="#b91c1c" />
          </g>
        )}
        {accessories.neck === 'neck_bandana' && (
          <polygon points="38,48 62,48 50,64" fill="#ff5500" stroke="#ffffff" strokeWidth="1" />
        )}
        {accessories.neck === 'neck_medal' && (
          <g>
            <line x1="42" y1="48" x2="50" y2="58" stroke="#3b82f6" strokeWidth="2" />
            <line x1="58" y1="48" x2="50" y2="58" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="50" cy="60" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <text x="50" y="62" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#78350f">1</text>
          </g>
        )}
        {accessories.glasses === 'glass_cool' && (
          <g>
            <rect x="33" y="22" width="14" height="9" rx="2" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
            <rect x="53" y="22" width="14" height="9" rx="2" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
            <line x1="47" y1="25" x2="53" y2="25" stroke="#d97706" strokeWidth="1.5" />
          </g>
        )}
        {accessories.glasses === 'glass_heart' && (
          <g>
            <path d="M 40 23 C 36 20 32 24 40 30 C 48 24 44 20 40 23 Z" fill="#f43f5e" />
            <path d="M 60 23 C 56 20 52 24 60 30 C 68 24 64 20 60 23 Z" fill="#f43f5e" />
          </g>
        )}
        {accessories.hat === 'hat_party' && (
          <g>
            <polygon points="50,2 40,18 60,18" fill="#ec4899" />
            <circle cx="50" cy="2" r="3" fill="#facc15" />
          </g>
        )}
        {accessories.hat === 'hat_crown' && (
          <polygon points="36,16 40,6 45,12 50,4 55,12 60,6 64,16" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
        )}
        {accessories.hat === 'hat_tophat' && (
          <g>
            <rect x="40" y="4" width="20" height="15" fill="#1e293b" />
            <rect x="32" y="17" width="36" height="4" rx="2" fill="#1e293b" />
          </g>
        )}
        {accessories.hat === 'hat_goggles' && (
          <g>
            <rect x="33" y="14" width="34" height="6" rx="3" fill="#ff5500" />
            <circle cx="42" cy="17" r="5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="58" cy="17" r="5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
          </g>
        )}
      </g>
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
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full drop-shadow-2xl ${
            isPatted ? 'animate-bounce' : isWalking ? 'animate-bounce-subtle' : 'animate-float'
          }`}
        >
          {renderSpeciesSVG()}
          {renderAccessories()}
        </svg>

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
          <div className="font-black text-xs text-slate-800 tracking-wide drop-shadow-sm">
            {(pet as Pet).name}
          </div>
          {(pet as Pet).needs && (
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-0.5 overflow-hidden">
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
