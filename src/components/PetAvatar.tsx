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
    eyeColor: '#1e293b',
    bellyColor: '#fffbeb'
  };
  const accessories = (pet as Pet).accessories || {};

  // Natural blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3500 + Math.random() * 2500);

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

  // Render 3D CGI "Secret Life of Pets" Inspired Vector Character Illustrations
  const renderSpeciesSVG = () => {
    const isWagging = expression === 'excited' || isPatted;

    switch (species) {
      case 'puppy':
        // Max (Secret Life of Pets Jack Russell Terrier style)
        return (
          <g>
            <defs>
              <linearGradient id={`pupBody_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="85%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id={`pupPatch_${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="60%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <radialGradient id={`pupNose_${uid}`} cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="40%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#090d16" />
              </radialGradient>
              <radialGradient id={`pupEye_${uid}`} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#92400e" />
                <stop offset="50%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
            </defs>

            {/* Wagging Fluffy Tail */}
            <path
              d="M 68 64 Q 84 56 88 42 Q 82 52 70 60 Z"
              fill={`url(#pupBody_${uid})`}
              stroke="#cbd5e1"
              strokeWidth="0.8"
              className={isWagging || isWalking ? 'animate-wiggle origin-bottom-left' : ''}
            />

            {/* Back Hind Legs & Sitting Body */}
            <ellipse cx="64" cy="74" rx="14" ry="12" fill={`url(#pupBody_${uid})`} />
            <ellipse cx="36" cy="74" rx="14" ry="12" fill={`url(#pupBody_${uid})`} />

            {/* Slender Sleek White Chest & Body */}
            <path
              d="M 40 50 C 38 65, 34 76, 42 82 C 48 84, 52 84, 58 82 C 66 76, 62 65, 60 50 Z"
              fill={`url(#pupBody_${uid})`}
            />

            {/* Front Paws with cute toe lines */}
            <ellipse cx="44" cy="84" rx="5" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            <ellipse cx="56" cy="84" rx="5" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />

            {/* Blue Collar with Golden Bone Tag */}
            <path d="M 38 48 Q 50 54 62 48" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="53" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="50" cy="53" r="1.5" fill="#eab308" />

            {/* Distinctive Expressive Tilted Head */}
            <g transform={expression === 'excited' || isPatted ? 'rotate(-4 50 32)' : 'rotate(2 50 32)'}>
              {/* White Head Base */}
              <ellipse cx="50" cy="32" rx="19" ry="17" fill={`url(#pupBody_${uid})`} />

              {/* Big Brown Eye Patch (Left side) */}
              <path
                d="M 33 22 C 30 16, 48 14, 48 24 C 48 35, 30 38, 33 22 Z"
                fill={`url(#pupPatch_${uid})`}
              />

              {/* Floppy Tan/Brown Ear (Left) */}
              <path
                d="M 33 20 C 18 18, 14 36, 24 44 C 28 40, 32 30, 34 20 Z"
                fill={`url(#pupPatch_${uid})`}
              />
              <path d="M 28 26 C 22 28, 20 38, 26 40" stroke="#78350f" strokeWidth="1.2" fill="none" opacity="0.6" />

              {/* White Perky Ear (Right) */}
              <path
                d="M 67 20 C 78 16, 82 32, 74 38 C 70 34, 68 26, 67 20 Z"
                fill={`url(#pupBody_${uid})`}
                stroke="#cbd5e1"
                strokeWidth="0.8"
              />
              <polygon points="69,22 75,32 70,34" fill="#fda4af" opacity="0.7" />

              {/* Glossy Rubbery Button Nose & Muzzle */}
              <ellipse cx="50" cy="38" rx="10" ry="8" fill="#ffffff" />
              {/* Nose */}
              <ellipse cx="50" cy="35" rx="6.5" ry="4.5" fill={`url(#pupNose_${uid})`} />
              <ellipse cx="48" cy="33.5" rx="2" ry="1.2" fill="#ffffff" opacity="0.85" />

              {/* Mouth & Tongue */}
              {isPatted || expression === 'excited' ? (
                <g>
                  <path d="M 45 39 Q 50 43 55 39" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M 48 40 Q 50 49 53 48 Q 54 44 48 40 Z" fill="#f43f5e" />
                </g>
              ) : (
                <path d="M 45 39 Q 50 43 55 39" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              )}

              {/* Expressive Glossy Eyes */}
              {!blink ? (
                <g>
                  {/* Left Eye in Patch */}
                  <circle cx="41" cy="27" r="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
                  <circle cx="42" cy="27" r="3.2" fill={`url(#pupEye_${uid})`} />
                  <circle cx="43" cy="25.5" r="1.3" fill="#ffffff" />
                  <circle cx="40.8" cy="28.5" r="0.7" fill="#ffffff" />

                  {/* Right Eye */}
                  <circle cx="59" cy="27" r="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
                  <circle cx="58" cy="27" r="3.2" fill={`url(#pupEye_${uid})`} />
                  <circle cx="59" cy="25.5" r="1.3" fill="#ffffff" />
                  <circle cx="56.8" cy="28.5" r="0.7" fill="#ffffff" />
                </g>
              ) : (
                <g>
                  <path d="M 37 28 Q 41 32 45 28" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 55 28 Q 59 32 63 28" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                </g>
              )}
            </g>
          </g>
        );

      case 'cat':
        // Chloe the Plump Blue/Gray Cat (Secret Life of Pets style)
        return (
          <g>
            <defs>
              <linearGradient id={`catFur_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <radialGradient id={`catBelly_${uid}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="80%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </radialGradient>
              <radialGradient id={`catEye_${uid}`} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="60%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#064e3b" />
              </radialGradient>
            </defs>

            {/* Lazy Plump Curved Tail */}
            <path
              d="M 72 75 Q 92 78 88 56 Q 84 66 70 72 Z"
              fill={`url(#catFur_${uid})`}
              className={isWagging || isWalking ? 'animate-wiggle' : ''}
            />

            {/* Giant Iconic Round Pear/Egg Cat Body */}
            <ellipse cx="50" cy="58" rx="32" ry="28" fill={`url(#catFur_${uid})`} />
            <ellipse cx="50" cy="62" rx="20" ry="18" fill={`url(#catBelly_${uid})`} opacity="0.8" />

            {/* Tiny Front Paws under huge fluff */}
            <ellipse cx="44" cy="83" rx="5" ry="3.5" fill="#cbd5e1" />
            <ellipse cx="56" cy="83" rx="5" ry="3.5" fill="#cbd5e1" />

            {/* Pointy Cat Ears */}
            <polygon points="28,30 22,12 40,24" fill={`url(#catFur_${uid})`} />
            <polygon points="29,28 25,16 38,24" fill="#fda4af" opacity="0.75" />
            <polygon points="72,30 78,12 60,24" fill={`url(#catFur_${uid})`} />
            <polygon points="71,28 75,16 62,24" fill="#fda4af" opacity="0.75" />

            {/* Head Silhouette blended into body */}
            <ellipse cx="50" cy="38" rx="24" ry="18" fill={`url(#catFur_${uid})`} />

            {/* Whiskers */}
            <line x1="18" y1="42" x2="34" y2="43" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
            <line x1="16" y1="46" x2="34" y2="45" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
            <line x1="82" y1="42" x2="66" y2="43" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
            <line x1="84" y1="46" x2="66" y2="45" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />

            {/* Tiny Soft Pink Nose */}
            <polygon points="47,40 53,40 50,44" fill="#fb7185" />
            <path d="M 46 44 Q 50 47 54 44" stroke="#334155" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Sassy SOTP Cat Eyes (Half-lidded with attitude) */}
            {!blink ? (
              <g>
                {/* Left Eye */}
                <ellipse cx="38" cy="34" rx="6" ry="6" fill="#ffffff" />
                <ellipse cx="38" cy="34" rx="4" ry="4" fill={`url(#catEye_${uid})`} />
                <ellipse cx="38" cy="34" rx="1.8" ry="3.5" fill="#0f172a" />
                <circle cx="39.5" cy="32" r="1.2" fill="#ffffff" />
                {/* Half Eyelid drooping sassily */}
                <path d="M 32 32 Q 38 35 44 32 L 44 28 L 32 28 Z" fill={`url(#catFur_${uid})`} />

                {/* Right Eye */}
                <ellipse cx="62" cy="34" rx="6" ry="6" fill="#ffffff" />
                <ellipse cx="62" cy="34" rx="4" ry="4" fill={`url(#catEye_${uid})`} />
                <ellipse cx="62" cy="34" rx="1.8" ry="3.5" fill="#0f172a" />
                <circle cx="63.5" cy="32" r="1.2" fill="#ffffff" />
                {/* Half Eyelid */}
                <path d="M 56 32 Q 62 35 68 32 L 68 28 L 56 28 Z" fill={`url(#catFur_${uid})`} />
              </g>
            ) : (
              <g>
                <path d="M 32 34 Q 38 38 44 34" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 56 34 Q 62 38 68 34" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>
            )}
          </g>
        );

      case 'kitten':
        // Sweet Tiny Kitten with oversized glassy Disney/Illumination eyes
        return (
          <g>
            <defs>
              <linearGradient id={`kitFur_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="60%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <radialGradient id={`kitEye_${uid}`} cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#082f49" />
              </radialGradient>
            </defs>

            {/* Tiny Curved Tail */}
            <path d="M 68 66 Q 82 60 80 46 Q 76 56 68 64 Z" fill={`url(#kitFur_${uid})`} />

            {/* Soft Petite Body */}
            <ellipse cx="50" cy="62" rx="20" ry="18" fill={`url(#kitFur_${uid})`} />
            <ellipse cx="50" cy="65" rx="12" ry="11" fill="#ffffff" />

            {/* Little Paws */}
            <ellipse cx="41" cy="78" rx="5" ry="3.5" fill="#ffffff" />
            <ellipse cx="59" cy="78" rx="5" ry="3.5" fill="#ffffff" />

            {/* Oversized Kitten Head */}
            <circle cx="50" cy="34" r="22" fill={`url(#kitFur_${uid})`} />

            {/* Fluffy Pointed Ears */}
            <polygon points="30,26 24,10 40,20" fill={`url(#kitFur_${uid})`} />
            <polygon points="31,24 27,13 38,20" fill="#fda4af" />
            <polygon points="70,26 76,10 60,20" fill={`url(#kitFur_${uid})`} />
            <polygon points="69,24 73,13 62,20" fill="#fda4af" />

            {/* Cheeks & Whiskers */}
            <ellipse cx="36" cy="40" rx="6" ry="4" fill="#ffffff" opacity="0.6" />
            <ellipse cx="64" cy="40" rx="6" ry="4" fill="#ffffff" opacity="0.6" />
            <line x1="24" y1="41" x2="35" y2="41" stroke="#ffffff" strokeWidth="1" />
            <line x1="76" y1="41" x2="65" y2="41" stroke="#ffffff" strokeWidth="1" />

            {/* Tiny Pink Nose & Smile */}
            <polygon points="48,39 52,39 50,42" fill="#fb7185" />
            <path d="M 47 43 Q 50 46 53 43" stroke="#7c2d12" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Gigantic Glassy Shiny Kitten Eyes */}
            {!blink ? (
              <g>
                <circle cx="39" cy="30" r="7" fill="#ffffff" />
                <circle cx="39" cy="30" r="5.5" fill={`url(#kitEye_${uid})`} />
                <circle cx="39" cy="30" r="3.2" fill="#0f172a" />
                <circle cx="41" cy="27.5" r="2" fill="#ffffff" />
                <circle cx="37" cy="32.5" r="1" fill="#ffffff" />

                <circle cx="61" cy="30" r="7" fill="#ffffff" />
                <circle cx="61" cy="30" r="5.5" fill={`url(#kitEye_${uid})`} />
                <circle cx="61" cy="30" r="3.2" fill="#0f172a" />
                <circle cx="63" cy="27.5" r="2" fill="#ffffff" />
                <circle cx="59" cy="32.5" r="1" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <path d="M 33 30 Q 39 36 45 30" stroke="#7c2d12" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 55 30 Q 61 36 67 30" stroke="#7c2d12" strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>
            )}
          </g>
        );

      case 'parrot':
        // Sweetpea the energetic vibrant parrot
        return (
          <g>
            <defs>
              <linearGradient id={`parBody_${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="60%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
              <linearGradient id={`parWing_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="40%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Long Exotic Tail Feathers */}
            <path d="M 50 70 L 44 94 L 50 90 L 56 94 Z" fill={`url(#parWing_${uid})`} />

            {/* Plump Body */}
            <ellipse cx="50" cy="54" rx="20" ry="24" fill={`url(#parBody_${uid})`} />
            <ellipse cx="50" cy="56" rx="13" ry="16" fill="#fef08a" />

            {/* Gradient Wings */}
            <path d="M 31 46 Q 18 60 28 76 Q 38 66 36 48 Z" fill={`url(#parWing_${uid})`} />
            <path d="M 69 46 Q 82 60 72 76 Q 62 66 64 48 Z" fill={`url(#parWing_${uid})`} />

            {/* Golden Feet */}
            <ellipse cx="44" cy="78" rx="4" ry="2.5" fill="#f59e0b" />
            <ellipse cx="56" cy="78" rx="4" ry="2.5" fill="#f59e0b" />

            {/* Head with Perky Crest Feather */}
            <path d="M 50 22 Q 48 8 40 12 Q 46 16 48 22 Z" fill="#ef4444" />
            <path d="M 50 22 Q 52 6 56 10 Q 52 16 50 22 Z" fill="#eab308" />
            <circle cx="50" cy="30" r="16" fill={`url(#parBody_${uid})`} />

            {/* White Eye Patch Mask */}
            <circle cx="43" cy="28" r="6.5" fill="#ffffff" />
            <circle cx="57" cy="28" r="6.5" fill="#ffffff" />

            {/* Glossy Black Beak */}
            <path d="M 45 30 Q 50 30 55 30 Q 53 44 50 44 Q 47 44 45 30 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            <ellipse cx="49" cy="33" rx="1.5" ry="0.8" fill="#64748b" />

            {/* Bright Eyes */}
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
        // Smiling Leopard Gecko with 3D spotted skin & sticky toe pads
        return (
          <g>
            <defs>
              <linearGradient id={`gekFur_${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>

            {/* Chubby Leopard Tail */}
            <path d="M 58 68 Q 82 76 76 92 Q 62 90 56 75 Z" fill={`url(#gekFur_${uid})`} />
            <circle cx="70" cy="80" r="3" fill="#78350f" opacity="0.6" />
            <circle cx="64" cy="85" r="2.5" fill="#78350f" opacity="0.6" />

            {/* Smooth Body */}
            <ellipse cx="50" cy="58" rx="22" ry="19" fill={`url(#gekFur_${uid})`} />
            <ellipse cx="50" cy="61" rx="14" ry="12" fill="#fffbeb" />

            {/* Leopard Spots */}
            <circle cx="42" cy="54" r="2.5" fill="#78350f" opacity="0.5" />
            <circle cx="58" cy="56" r="3" fill="#78350f" opacity="0.5" />

            {/* Sticky Toes */}
            <circle cx="28" cy="56" r="3.5" fill="#facc15" />
            <circle cx="26" cy="62" r="3.5" fill="#facc15" />
            <circle cx="72" cy="56" r="3.5" fill="#facc15" />
            <circle cx="74" cy="62" r="3.5" fill="#facc15" />

            {/* Wide Smiling Head */}
            <ellipse cx="50" cy="35" rx="22" ry="16" fill={`url(#gekFur_${uid})`} />

            {/* Big Expressive Dome Eyes */}
            <circle cx="36" cy="25" r="7.5" fill={`url(#gekFur_${uid})`} stroke="#ca8a04" strokeWidth="1" />
            <circle cx="36" cy="25" r="5.5" fill="#451a03" />
            <ellipse cx="36" cy="25" rx="1.5" ry="4" fill="#000000" />
            <circle cx="37.5" cy="23" r="1.5" fill="#ffffff" />

            <circle cx="64" cy="25" r="7.5" fill={`url(#gekFur_${uid})`} stroke="#ca8a04" strokeWidth="1" />
            <circle cx="64" cy="25" r="5.5" fill="#451a03" />
            <ellipse cx="64" cy="25" rx="1.5" ry="4" fill="#000000" />
            <circle cx="65.5" cy="23" r="1.5" fill="#ffffff" />

            {/* Sweet Permanent Cartoon Smile */}
            <path d="M 38 40 Q 50 48 62 40" stroke="#78350f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <circle cx="37" cy="39" r="1.5" fill="#78350f" />
            <circle cx="63" cy="39" r="1.5" fill="#78350f" />
          </g>
        );

      case 'ferret':
        // Noodle Ferret with masked bandit eyes and pink nose
        return (
          <g>
            <defs>
              <linearGradient id={`ferFur_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* Long Noodle Body & Fuzzy Tail */}
            <path d="M 64 60 Q 80 68 86 54 Q 84 74 66 72 Z" fill={`url(#ferFur_${uid})`} />
            <ellipse cx="50" cy="62" rx="20" ry="22" fill={`url(#ferFur_${uid})`} />
            <ellipse cx="50" cy="65" rx="12" ry="14" fill="#ffffff" />

            {/* Paws */}
            <ellipse cx="38" cy="80" rx="5" ry="4" fill="#475569" />
            <ellipse cx="62" cy="80" rx="5" ry="4" fill="#475569" />

            {/* Head */}
            <ellipse cx="50" cy="35" rx="20" ry="16" fill={`url(#ferFur_${uid})`} />

            {/* Bandit Mask */}
            <path d="M 32 33 Q 50 38 68 33 Q 64 27 50 31 Q 36 27 32 33 Z" fill="#334155" />

            {/* Cute Round Ears */}
            <circle cx="34" cy="22" r="6" fill={`url(#ferFur_${uid})`} />
            <circle cx="34" cy="22" r="3.5" fill="#fda4af" />
            <circle cx="66" cy="22" r="6" fill={`url(#ferFur_${uid})`} />
            <circle cx="66" cy="22" r="3.5" fill="#fda4af" />

            {/* Pink Button Nose */}
            <ellipse cx="50" cy="41" rx="8" ry="6" fill="#ffffff" />
            <polygon points="48,39 52,39 50,42" fill="#fb7185" />
            <path d="M 48 43 Q 50 45 52 43" stroke="#1e293b" strokeWidth="1" fill="none" />

            {/* Shiny Beady Eyes */}
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
        // Pink Smiling Water Dragon with feathery coral gills
        return (
          <g>
            <defs>
              <linearGradient id={`axoFur_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="60%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>

            {/* Feathery Coral Gills */}
            <g className="animate-wiggle origin-center">
              <path d="M 30 28 Q 12 18 16 26 Q 22 28 30 32 Z" fill="#fb7185" />
              <path d="M 28 34 Q 8 33 13 40 Q 20 39 28 37 Z" fill="#fda4af" />
              <path d="M 30 40 Q 14 48 20 52 Q 24 47 30 42 Z" fill="#fb7185" />

              <path d="M 70 28 Q 88 18 84 26 Q 78 28 70 32 Z" fill="#fb7185" />
              <path d="M 72 34 Q 92 33 87 40 Q 80 39 72 37 Z" fill="#fda4af" />
              <path d="M 70 40 Q 86 48 80 52 Q 76 47 70 42 Z" fill="#fb7185" />
            </g>

            {/* Swimmer Tail */}
            <path d="M 50 68 Q 62 88 56 94 Q 46 84 50 68 Z" fill="#f472b6" opacity="0.85" />

            {/* Body */}
            <ellipse cx="50" cy="62" rx="18" ry="16" fill={`url(#axoFur_${uid})`} />
            <ellipse cx="50" cy="64" rx="12" ry="10" fill="#fff1f2" />

            {/* Tiny Hands */}
            <ellipse cx="38" cy="74" rx="4" ry="3" fill="#f472b6" />
            <ellipse cx="62" cy="74" rx="4" ry="3" fill="#f472b6" />

            {/* Wide Smiling Face */}
            <ellipse cx="50" cy="38" rx="23" ry="17" fill={`url(#axoFur_${uid})`} />

            {/* Cheerful Blush */}
            <circle cx="34" cy="42" r="4" fill="#fb7185" opacity="0.7" />
            <circle cx="66" cy="42" r="4" fill="#fb7185" opacity="0.7" />

            {/* Happy Curved Smile */}
            <path d="M 43 42 Q 50 48 57 42" stroke="#be185d" strokeWidth="2.2" fill="none" strokeLinecap="round" />

            {/* Shiny Beady Eyes */}
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
        // Cute Hedgehog with soft peach face and depth quills
        return (
          <g>
            <defs>
              <radialGradient id={`hedgQuill_${uid}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="70%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>
            </defs>

            {/* Spiky Shell */}
            <circle cx="50" cy="48" r="28" fill={`url(#hedgQuill_${uid})`} />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 50 + Math.cos(rad) * 26;
              const y1 = 48 + Math.sin(rad) * 26;
              const x2 = 50 + Math.cos(rad) * 34;
              const y2 = 48 + Math.sin(rad) * 34;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#78350f"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Soft Peach Face & Belly */}
            <ellipse cx="50" cy="54" rx="20" ry="18" fill="#fef3c7" />
            <ellipse cx="50" cy="58" rx="14" ry="12" fill="#fed7aa" />

            {/* Ears */}
            <circle cx="34" cy="36" r="4.5" fill="#fef3c7" />
            <circle cx="34" cy="36" r="2.5" fill="#fda4af" />
            <circle cx="66" cy="36" r="4.5" fill="#fef3c7" />
            <circle cx="66" cy="36" r="2.5" fill="#fda4af" />

            {/* Paws */}
            <ellipse cx="38" cy="72" rx="4" ry="3" fill="#fed7aa" />
            <ellipse cx="62" cy="72" rx="4" ry="3" fill="#fed7aa" />

            {/* Snuffle Nose */}
            <ellipse cx="50" cy="46" rx="4.5" ry="3.5" fill="#1e293b" />
            <circle cx="49" cy="45" r="1.2" fill="#ffffff" />
            <path d="M 48 49 Q 50 51 52 49" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Eyes */}
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
        // Friendly Pastel Rainbow Python with shiny 3D coils
        return (
          <g>
            <defs>
              <linearGradient id={`snkFur_${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Smooth Coils */}
            <ellipse cx="50" cy="68" rx="28" ry="12" fill={`url(#snkFur_${uid})`} />
            <path
              d="M 28 68 Q 22 54 35 48 Q 50 46 65 50 Q 78 54 72 68"
              stroke={`url(#snkFur_${uid})`}
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
            />

            {/* Round Friendly Head */}
            <ellipse cx="50" cy="34" rx="17" ry="14" fill={`url(#snkFur_${uid})`} />
            <ellipse cx="50" cy="38" rx="11" ry="8" fill="#fefce8" />

            {/* Forked Tongue */}
            <path d="M 50 43 L 50 50 L 47 54 M 50 50 L 53 54" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />

            {/* Big Friendly Eyes */}
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
        // Chubby Cheek-Stuffed Hamster
        return (
          <g>
            <defs>
              <linearGradient id={`hamFur_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Round Chubby Body */}
            <ellipse cx="50" cy="60" rx="25" ry="22" fill={`url(#hamFur_${uid})`} />
            <ellipse cx="50" cy="63" rx="16" ry="15" fill="#ffffff" />

            {/* Paws Holding Big Seed */}
            <ellipse cx="42" cy="68" rx="4" ry="3" fill="#fed7aa" />
            <ellipse cx="58" cy="68" rx="4" ry="3" fill="#fed7aa" />
            <ellipse cx="50" cy="67" rx="3.5" ry="5.5" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />

            {/* Round Ears */}
            <circle cx="32" cy="22" r="6.5" fill={`url(#hamFur_${uid})`} />
            <circle cx="32" cy="22" r="4" fill="#fda4af" />
            <circle cx="68" cy="22" r="6.5" fill={`url(#hamFur_${uid})`} />
            <circle cx="68" cy="22" r="4" fill="#fda4af" />

            {/* Giant Puffed Cheeks Head */}
            <circle cx="50" cy="38" r="19" fill={`url(#hamFur_${uid})`} />
            <circle cx="35" cy="42" r="10" fill="#fef3c7" />
            <circle cx="65" cy="42" r="10" fill="#fef3c7" />

            {/* Pink Nose & Whiskers */}
            <line x1="22" y1="42" x2="33" y2="42" stroke="#94a3b8" strokeWidth="1" />
            <line x1="78" y1="42" x2="67" y2="42" stroke="#94a3b8" strokeWidth="1" />
            <ellipse cx="50" cy="40" rx="3" ry="2" fill="#fb7185" />
            <path d="M 48 42 Q 50 44 52 42" stroke="#1e293b" strokeWidth="1.2" fill="none" />

            {/* Shiny Eyes */}
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
        // Norman the Guinea Pig (Secret Life of Pets style)
        return (
          <g>
            <defs>
              <linearGradient id={`gpFur_${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Fluffy Potato Body */}
            <ellipse cx="50" cy="56" rx="29" ry="23" fill={`url(#gpFur_${uid})`} />
            {/* White Calico Patch */}
            <path d="M 48 34 Q 68 36 72 58 Q 60 78 44 78 Z" fill="#ffffff" />
            <ellipse cx="50" cy="62" rx="14" ry="12" fill="#fffbeb" />

            {/* Paws */}
            <ellipse cx="32" cy="75" rx="5" ry="3.5" fill="#fed7aa" />
            <ellipse cx="68" cy="75" rx="5" ry="3.5" fill="#fed7aa" />

            {/* Ears */}
            <ellipse cx="28" cy="32" rx="5.5" ry="4" fill="#b45309" />
            <ellipse cx="28" cy="32" rx="3.5" ry="2.2" fill="#fda4af" />
            <ellipse cx="72" cy="32" rx="5.5" ry="4" fill="#ffffff" />
            <ellipse cx="72" cy="32" rx="3.5" ry="2.2" fill="#fda4af" />

            {/* Snout & Whiskers */}
            <ellipse cx="50" cy="44" rx="8" ry="6" fill="#fffbeb" />
            <polygon points="48,42 52,42 50,45" fill="#fb7185" />
            {/* Squeak mouth */}
            <path d="M 46 46 Q 50 50 54 46" stroke="#1e293b" strokeWidth="1.6" fill="none" strokeLinecap="round" />

            {/* Expressive Glossy Eyes */}
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
        {/* Outfits: Super Cape */}
        {accessories.outfit === 'outfit_cape' && (
          <path d="M 32 50 Q 20 70 24 85 Q 50 78 76 85 Q 80 70 68 50 Z" fill="#3b82f6" opacity="0.9" />
        )}

        {/* Neck Accessories */}
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

        {/* Glasses */}
        {accessories.glasses === 'glass_cool' && (
          <g>
            <rect x="33" y="26" width="14" height="9" rx="2" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
            <rect x="53" y="26" width="14" height="9" rx="2" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
            <line x1="47" y1="29" x2="53" y2="29" stroke="#d97706" strokeWidth="1.5" />
          </g>
        )}
        {accessories.glasses === 'glass_heart' && (
          <g>
            <path d="M 40 27 C 36 24 32 28 40 34 C 48 28 44 24 40 27 Z" fill="#f43f5e" />
            <path d="M 60 27 C 56 24 52 28 60 34 C 68 28 64 24 60 27 Z" fill="#f43f5e" />
            <line x1="45" y1="29" x2="55" y2="29" stroke="#f43f5e" strokeWidth="1.5" />
          </g>
        )}
        {accessories.glasses === 'glass_star' && (
          <g>
            <polygon points="40,24 42,29 47,29 43,32 45,37 40,34 35,37 37,32 33,29 38,29" fill="#eab308" />
            <polygon points="60,24 62,29 67,29 63,32 65,37 60,34 55,37 57,32 53,29 58,29" fill="#eab308" />
          </g>
        )}

        {/* Hats */}
        {accessories.hat === 'hat_party' && (
          <g>
            <polygon points="50,4 40,22 60,22" fill="#ec4899" />
            <circle cx="50" cy="3" r="3" fill="#facc15" />
            <circle cx="45" cy="16" r="1.5" fill="#38bdf8" />
            <circle cx="54" cy="13" r="1.5" fill="#4ade80" />
          </g>
        )}
        {accessories.hat === 'hat_crown' && (
          <g>
            <polygon points="36,20 40,8 45,16 50,6 55,16 60,8 64,20" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="40" cy="8" r="1.5" fill="#ef4444" />
            <circle cx="50" cy="6" r="2" fill="#3b82f6" />
            <circle cx="60" cy="8" r="1.5" fill="#10b981" />
          </g>
        )}
        {accessories.hat === 'hat_tophat' && (
          <g>
            <rect x="40" y="6" width="20" height="15" fill="#1e293b" />
            <rect x="32" y="19" width="36" height="4" rx="2" fill="#1e293b" />
            <rect x="40" y="17" width="20" height="2.5" fill="#ef4444" />
          </g>
        )}
        {accessories.hat === 'hat_chef' && (
          <g>
            <path d="M 40 20 C 32 12 42 4 50 6 C 58 4 68 12 60 20 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <rect x="41" y="18" width="18" height="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
          </g>
        )}
        {accessories.hat === 'hat_goggles' && (
          <g>
            <rect x="33" y="16" width="34" height="6" rx="3" fill="#ff5500" />
            <circle cx="42" cy="19" r="5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="58" cy="19" r="5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
          </g>
        )}
        {accessories.hat === 'hat_flower' && (
          <g>
            <circle cx="38" cy="18" r="4" fill="#f43f5e" />
            <circle cx="46" cy="15" r="4" fill="#fbbf24" />
            <circle cx="54" cy="15" r="4" fill="#a855f7" />
            <circle cx="62" cy="18" r="4" fill="#38bdf8" />
          </g>
        )}
        {accessories.hat === 'hat_detective' && (
          <g>
            <path d="M 34 20 Q 50 12 66 20 L 64 22 Q 50 18 36 22 Z" fill="#78350f" />
            <path d="M 38 18 Q 50 8 62 18 Z" fill="#92400e" />
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
          className={`w-full h-full drop-shadow-xl ${
            isPatted ? 'animate-bounce' : isWalking ? 'animate-bounce-subtle' : 'animate-float'
          }`}
        >
          {renderSpeciesSVG()}
          {renderAccessories()}
        </svg>

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

      {/* Optional Mood / Name Tag */}
      {showMood && (pet as Pet).name && (
        <div className={`text-center mt-1 ${facing === 'left' ? 'scale-x-[-1]' : ''}`}>
          <div className="font-black text-xs text-slate-800 tracking-wide drop-shadow-sm">
            {(pet as Pet).name}
          </div>
          {(pet as Pet).needs && (
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-0.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                style={{ width: `${(pet as Pet).needs.happiness}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
