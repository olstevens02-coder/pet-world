import React, { useState, useEffect, useRef } from 'react';
import { Pet, HouseRoomType, Item, PetAccessory } from '../types/game';
import { SHOP_ITEMS, PET_ACCESSORIES } from '../data/items';
import { PetAvatar } from './PetAvatar';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  Utensils,
  Camera,
  Shirt,
  Volume2,
  Tv,
  ArrowUpCircle,
  ArrowDownCircle,
  Radio,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface PetHouseProps {
  adoptedPets: Pet[];
  activePetId: string | null;
  coins: number;
  inventory: { [itemId: string]: number };
  currentRoom: HouseRoomType;
  onChangeRoom: (room: HouseRoomType) => void;
  onSelectActivePet: (petId: string) => void;
  onFeedPet: (petId: string, item: Item) => void;
  onEquipAccessory: (petId: string, accessory: PetAccessory) => void;
  onBuyItem: (item: Item) => void;
  onOpenPhotoBooth: () => void;
  onStartDrive: () => void;
}

interface PetRoamState {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isWalking: boolean;
  facing: 'left' | 'right';
  action: 'idle' | 'walking' | 'sniffing' | 'napping' | 'playing' | 'sliding';
  bubbleText?: string;
}

export const PetHouse: React.FC<PetHouseProps> = ({
  adoptedPets,
  activePetId,
  coins,
  inventory,
  currentRoom,
  onChangeRoom,
  onSelectActivePet,
  onFeedPet,
  onEquipAccessory,
  onBuyItem,
  onOpenPhotoBooth,
  onStartDrive
}) => {
  const [activeTab, setActiveTab] = useState<'roam' | 'wardrobe' | 'shop' | 'toys'>('roam');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(activePetId || (adoptedPets[0]?.id ?? null));
  const [laserTarget, setLaserTarget] = useState<{ x: number; y: number } | null>(null);
  const [bouncingBall, setBouncingBall] = useState<{ x: number; y: number } | null>(null);
  const [isDiscoActive, setIsDiscoActive] = useState(false);
  const [isElevatorMoving, setIsElevatorMoving] = useState(false);

  const activePet = adoptedPets.find(p => p.id === (selectedPetId || activePetId)) || adoptedPets[0] || null;

  // Barbie Dreamhouse Rooms & Locations
  const dreamhouseRooms: {
    id: HouseRoomType;
    floor: string;
    name: string;
    icon: string;
    tagline: string;
    bgGradient: string;
  }[] = [
    {
      id: 'glam_living_room',
      floor: 'Floor 1',
      name: 'Glam Pink Living Room',
      icon: '🛋️',
      tagline: 'Plush heart sofas, golden chandelier, and pink fireplace lounge!',
      bgGradient: 'from-pink-200 via-rose-100 to-pink-300'
    },
    {
      id: 'pool_patio_slide',
      floor: 'Floor 1 Patio',
      name: 'Dream Pool & Spiral Slide',
      icon: '🏊',
      tagline: 'Turquoise heated pool with pink flamingo floats and spiral water slide!',
      bgGradient: 'from-sky-300 via-pink-200 to-teal-200'
    },
    {
      id: 'glam_salon_vanity',
      floor: 'Floor 2',
      name: 'Barbie Glam Vanity & Spa',
      icon: '💄',
      tagline: 'Hollywood lighted mirror, golden bubble jacuzzi, and beauty makeover salon!',
      bgGradient: 'from-fuchsia-200 via-pink-100 to-purple-200'
    },
    {
      id: 'dream_bedroom',
      floor: 'Floor 2',
      name: 'Dream Canopy Bedroom',
      icon: '🛏️',
      tagline: 'Hot pink silk canopy bed, plush pillows, and sparkling fairy lights!',
      bgGradient: 'from-pink-300 via-purple-100 to-pink-200'
    },
    {
      id: 'rooftop_party_deck',
      floor: 'Rooftop',
      name: 'Rooftop Disco Party Deck',
      icon: '🪩',
      tagline: 'Spinning disco ball, DJ dance floor, hot tub, and sunset city views!',
      bgGradient: 'from-purple-400 via-pink-400 to-rose-400'
    }
  ];

  const currentRoomInfo = dreamhouseRooms.find(r => r.id === currentRoom) || dreamhouseRooms[0];

  // Autonomous Roaming State for all Adopted Pets
  const [petStates, setPetStates] = useState<Record<string, PetRoamState>>({});

  // Initialize roaming positions
  useEffect(() => {
    setPetStates(prev => {
      const next: Record<string, PetRoamState> = { ...prev };
      adoptedPets.forEach((p, idx) => {
        if (!next[p.id]) {
          const initX = 18 + (idx * 16) % 65;
          const initY = 52 + (idx * 7) % 25;
          next[p.id] = {
            id: p.id,
            x: initX,
            y: initY,
            targetX: initX,
            targetY: initY,
            isWalking: false,
            facing: 'right',
            action: 'idle'
          };
        }
      });
      return next;
    });
  }, [adoptedPets]);

  // Main Movement & Autonomous Wander Loop
  useEffect(() => {
    const moveLoop = setInterval(() => {
      setPetStates(prev => {
        const updated: Record<string, PetRoamState> = { ...prev };
        let hasChanges = false;

        adoptedPets.forEach(pet => {
          const state = updated[pet.id];
          if (!state) return;

          // If walking towards target, take step
          const dx = state.targetX - state.x;
          const dy = state.targetY - state.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 1.2) {
            hasChanges = true;
            const step = 0.65;
            const newX = state.x + (dx / dist) * step;
            const newY = state.y + (dy / dist) * step;
            const newFacing = dx < 0 ? 'left' : 'right';

            updated[pet.id] = {
              ...state,
              x: newX,
              y: newY,
              isWalking: true,
              facing: newFacing
            };
          } else if (state.isWalking) {
            // Reached target destination
            hasChanges = true;
            updated[pet.id] = {
              ...state,
              x: state.targetX,
              y: state.targetY,
              isWalking: false,
              action: Math.random() < 0.4 ? 'sniffing' : Math.random() < 0.3 ? 'napping' : 'idle'
            };
          } else {
            // Chance to pick a new autonomous wandering point in the Barbie Dreamhouse
            if (Math.random() < 0.025) {
              hasChanges = true;
              const wanderX = 15 + Math.random() * 68;
              const wanderY = 48 + Math.random() * 32;
              updated[pet.id] = {
                ...state,
                targetX: wanderX,
                targetY: wanderY,
                isWalking: true,
                facing: wanderX < state.x ? 'left' : 'right',
                action: 'walking'
              };
            }
          }
        });

        return hasChanges ? updated : prev;
      });
    }, 50);

    return () => clearInterval(moveLoop);
  }, [adoptedPets]);

  // Calling Pets / Laser Pointer / Ball Throwing
  const handleRoomClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeTab === 'toys') {
      soundManager.playPop();
      setLaserTarget({ x: clickX, y: clickY });
      setTimeout(() => setLaserTarget(null), 1800);

      // Make all pets run excitedly toward the red laser dot!
      setPetStates(prev => {
        const next = { ...prev };
        adoptedPets.forEach((pet, i) => {
          if (next[pet.id]) {
            const offset = (i - 1) * 6;
            next[pet.id] = {
              ...next[pet.id],
              targetX: Math.max(12, Math.min(85, clickX + offset)),
              targetY: Math.max(45, Math.min(80, clickY)),
              isWalking: true,
              facing: clickX < next[pet.id].x ? 'left' : 'right',
              action: 'playing'
            };
          }
        });
        return next;
      });
    } else {
      // Tap floor to call selected active pet over
      if (activePet) {
        soundManager.playPop();
        setPetStates(prev => {
          if (!prev[activePet.id]) return prev;
          return {
            ...prev,
            [activePet.id]: {
              ...prev[activePet.id],
              targetX: Math.max(12, Math.min(85, clickX)),
              targetY: Math.max(45, Math.min(80, clickY)),
              isWalking: true,
              facing: clickX < prev[activePet.id].x ? 'left' : 'right',
              action: 'walking'
            }
          };
        });
      }
    }
  };

  const handleThrowBall = () => {
    soundManager.playPop();
    const ballTargetX = 20 + Math.random() * 60;
    const ballTargetY = 55 + Math.random() * 20;

    setBouncingBall({ x: 50, y: 30 });
    setTimeout(() => setBouncingBall({ x: ballTargetX, y: ballTargetY }), 350);
    setTimeout(() => setBouncingBall(null), 2500);

    // Pets run to fetch the ball!
    setPetStates(prev => {
      const next = { ...prev };
      adoptedPets.forEach((pet, i) => {
        if (next[pet.id]) {
          next[pet.id] = {
            ...next[pet.id],
            targetX: Math.max(12, Math.min(85, ballTargetX + (i - 1) * 7)),
            targetY: ballTargetY,
            isWalking: true,
            facing: ballTargetX < next[pet.id].x ? 'left' : 'right',
            action: 'playing'
          };
        }
      });
      return next;
    });
  };

  // Barbie Spiral Water Slide Ride!
  const handleRideSpiralSlide = () => {
    if (!activePet) return;
    soundManager.playWaterSplash();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });

    // Move pet down slide
    setPetStates(prev => {
      if (!prev[activePet.id]) return prev;
      return {
        ...prev,
        [activePet.id]: {
          ...prev[activePet.id],
          x: 22,
          y: 35,
          targetX: 42,
          targetY: 72,
          isWalking: true,
          action: 'sliding'
        }
      };
    });
  };

  // Barbie Pink Elevator
  const handleUseElevator = (targetRoom: HouseRoomType) => {
    soundManager.playPop();
    soundManager.playFanfare();
    setIsElevatorMoving(true);
    setTimeout(() => {
      onChangeRoom(targetRoom);
      setIsElevatorMoving(false);
    }, 600);
  };

  const handleEquip = (acc: PetAccessory) => {
    if (!activePet) return;
    soundManager.playFanfare();
    confetti({ particleCount: 50, spread: 60 });
    onEquipAccessory(activePet.id, acc);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 select-none animate-fadeIn">
      {/* Barbie Dreamhouse Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-pink-300">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/25 px-4 py-1.5 rounded-full text-xs font-black border border-white/40 shadow-inner">
            <Sparkles size={14} className="text-yellow-200" />
            <span className="tracking-wider uppercase">💖 BARBIE DREAM PET HOUSE 💖</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg font-['Fredoka']">
            Barbie Dreamhouse
          </h1>
          <p className="text-pink-100 font-bold max-w-xl text-sm md:text-base">
            Watch all your pets freely walk, play with toys, slide down the spiral pool slide, and ride the pink elevator!
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenPhotoBooth}
            className="px-5 py-3 bg-white/20 hover:bg-white/30 border-2 border-white/40 rounded-2xl font-black text-sm flex items-center gap-2 backdrop-blur-md shadow-lg active:scale-95 transition-all text-white"
          >
            <Camera size={20} className="text-yellow-200" />
            <span>Glam Photo Booth 📸</span>
          </button>

          <button
            onClick={onStartDrive}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-300 to-yellow-400 hover:from-amber-200 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 transition-all border-2 border-white"
          >
            <span>Orange Ferrari 🏎️</span>
          </button>
        </div>
      </div>

      {/* Barbie Dreamhouse Floor Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {dreamhouseRooms.map(r => (
          <button
            key={r.id}
            onClick={() => {
              handleUseElevator(r.id);
            }}
            className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2.5 whitespace-nowrap transition-all shadow-md ${
              currentRoom === r.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white ring-4 ring-pink-300 scale-105 shadow-xl'
                : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-200'
            }`}
          >
            <span className="text-xl">{r.icon}</span>
            <div className="text-left">
              <span className="block text-[10px] font-extrabold text-pink-600 uppercase tracking-wider">
                {r.floor}
              </span>
              <span className="block font-black">{r.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Barbie Dreamhouse Interactive Floor & Roaming Stage */}
      <div
        onClick={handleRoomClick}
        className={`relative w-full h-[560px] rounded-3xl p-8 bg-gradient-to-b ${currentRoomInfo.bgGradient} border-8 border-pink-400 shadow-2xl overflow-hidden cursor-pointer flex flex-col justify-between`}
      >
        {/* Room Ambient HUD Banner */}
        <div className="absolute top-4 left-6 z-30 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border-2 border-pink-300 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-2xl border border-pink-300">
            {currentRoomInfo.icon}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
              <span>{currentRoomInfo.name}</span>
              <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-extrabold">
                {currentRoomInfo.floor}
              </span>
            </h3>
            <p className="text-xs text-pink-700 font-bold">{currentRoomInfo.tagline}</p>
          </div>
        </div>

        {/* Pink Elevator Widget in Room */}
        <div className="absolute top-4 right-6 z-30 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border-2 border-pink-400 shadow-lg flex items-center gap-2">
          <div className="text-xs font-black text-pink-700 px-1">🛗 Pink Elevator</div>
          <div className="flex gap-1">
            {dreamhouseRooms.map(r => (
              <button
                key={r.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseElevator(r.id);
                }}
                title={r.name}
                className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                  currentRoom === r.id
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-pink-100 text-pink-800 hover:bg-pink-200'
                }`}
              >
                {r.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Laser Target Animation */}
        {laserTarget && (
          <div
            className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-ping"
            style={{ left: `${laserTarget.x}%`, top: `${laserTarget.y}%` }}
          >
            <div className="w-7 h-7 rounded-full bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,1)] border-2 border-white" />
          </div>
        )}

        {/* Bouncing Toy Ball */}
        {bouncingBall && (
          <div
            className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-400 text-4xl"
            style={{ left: `${bouncingBall.x}%`, top: `${bouncingBall.y}%` }}
          >
            🎾
          </div>
        )}

        {/* Barbie Dreamhouse Scenery & Visual Furnishings */}
        {currentRoom === 'glam_living_room' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Barbie Neon Wall Sign */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-pink-500/20 px-6 py-2 rounded-full border-2 border-pink-400 backdrop-blur-sm shadow-[0_0_25px_rgba(236,72,153,0.6)]">
              <span className="font-black text-pink-600 tracking-widest text-lg font-['Fredoka']">
                ✨ BARBIE DREAM LOUNGE ✨
              </span>
            </div>
            {/* Chandelier & Plush Couches */}
            <div className="text-8xl absolute left-[10%] bottom-16 filter drop-shadow-xl">🛋️</div>
            <div className="text-7xl absolute right-[12%] bottom-16 filter drop-shadow-xl">🏰</div>
            <div className="text-6xl absolute left-[48%] top-16">💎</div>
            <div className="text-6xl absolute right-[35%] bottom-20">🎀</div>
          </div>
        )}

        {currentRoom === 'pool_patio_slide' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Spiral Pool Slide on Left */}
            <div className="absolute left-[6%] top-[18%] bottom-[16%] flex flex-col items-center justify-between text-7xl">
              <span>🎢</span>
              <span>🌀</span>
              <span>💦</span>
            </div>
            {/* Pool Water & Flamingo Floats */}
            <div className="absolute right-[10%] bottom-12 text-8xl">🦩</div>
            <div className="absolute left-[38%] bottom-16 text-7xl">🏊</div>
            <div className="absolute right-[32%] bottom-14 text-6xl">🌴</div>
          </div>
        )}

        {currentRoom === 'glam_salon_vanity' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Hollywood Lighted Vanity Mirror */}
            <div className="absolute top-18 left-1/2 transform -translate-x-1/2 bg-white/70 px-8 py-3 rounded-3xl border-4 border-pink-400 shadow-xl text-center">
              <div className="text-5xl">🪞</div>
              <span className="text-xs font-black text-pink-600 tracking-wider uppercase block mt-1">
                ⭐ HOLLYWOOD GLAM VANITY ⭐
              </span>
            </div>
            <div className="text-8xl absolute left-[12%] bottom-14">🛁</div>
            <div className="text-7xl absolute right-[15%] bottom-16">💄</div>
          </div>
        )}

        {currentRoom === 'dream_bedroom' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="text-9xl absolute left-[15%] bottom-12 filter drop-shadow-2xl">🛏️</div>
            <div className="text-7xl absolute right-[18%] bottom-18">🧸</div>
            <div className="text-6xl absolute left-[52%] top-20">⭐</div>
          </div>
        )}

        {currentRoom === 'rooftop_party_deck' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Disco Ball with dynamic spinning */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <span className="text-7xl animate-spin" style={{ animationDuration: '6s' }}>🪩</span>
              <span className="bg-purple-900/80 text-yellow-300 font-black text-xs px-4 py-1 rounded-full border border-yellow-300 mt-2 shadow-lg">
                🎶 DJ PET DISCO 🎶
              </span>
            </div>
            <div className="text-7xl absolute left-[10%] bottom-14">🍹</div>
            <div className="text-7xl absolute right-[12%] bottom-14">🎵</div>
          </div>
        )}

        {/* ALL ADOPTED PETS FREELY ROAMING & WALKING AROUND THE BARBIE DREAMHOUSE */}
        <div className="absolute inset-0 pointer-events-none">
          {adoptedPets.map(pet => {
            const state = petStates[pet.id] || {
              x: 50,
              y: 65,
              isWalking: false,
              facing: 'right',
              action: 'idle'
            };
            const isSelected = activePet?.id === pet.id;

            return (
              <div
                key={pet.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPetId(pet.id);
                  onSelectActivePet(pet.id);
                  soundManager.playPetSound(pet.species);
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-300 ${
                  isSelected ? 'z-20 scale-110 drop-shadow-2xl' : 'z-10 hover:scale-105'
                }`}
                style={{
                  left: `${state.x}%`,
                  top: `${state.y}%`
                }}
              >
                {/* Floating Activity Bubble */}
                {state.action === 'napping' && (
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-black text-purple-700 shadow-md border border-purple-200">
                    💤 Snuggling...
                  </div>
                )}
                {state.action === 'sliding' && (
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black shadow-md animate-bounce">
                    🌊 Wheee!
                  </div>
                )}

                {/* Ferrari Co-Pilot Tag */}
                {isSelected && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-md border border-white whitespace-nowrap">
                    🏎️ Co-Pilot
                  </div>
                )}

                {/* Secret Life of Pets Character Model */}
                <div className={`p-1.5 rounded-3xl ${isSelected ? 'bg-pink-400/20 ring-2 ring-pink-400' : ''}`}>
                  <PetAvatar
                    pet={pet}
                    size="lg"
                    isWalking={state.isWalking}
                    facing={state.facing}
                    expression={state.action === 'playing' ? 'excited' : isSelected ? 'happy' : 'normal'}
                  />
                </div>

                {/* Name Tag */}
                <div className="bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-md text-center border border-pink-200 -mt-1 mx-auto w-fit">
                  <span className="font-extrabold text-[11px] text-slate-800">{pet.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Interactive Toolbar (Spiral Slide, Toys, Laser) */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 bg-white/85 backdrop-blur-md p-3 rounded-2xl border-2 border-pink-300 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleThrowBall();
              }}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>🎾 Throw Tennis Ball</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('toys');
                soundManager.playPop();
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95 ${
                activeTab === 'toys'
                  ? 'bg-rose-500 text-white border-2 border-white'
                  : 'bg-pink-100 text-pink-900 hover:bg-pink-200'
              }`}
            >
              <span>🔴 Laser Pointer (Tap Floor)</span>
            </button>

            {currentRoom === 'pool_patio_slide' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRideSpiralSlide();
                }}
                className="px-4 py-2 bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-500 hover:to-teal-500 text-white rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95"
              >
                <span>🌊 Ride Spiral Slide!</span>
              </button>
            )}
          </div>

          <span className="text-xs font-black text-pink-700 hidden sm:block">
            💡 Tap any spot to guide {activePet?.name || 'your pet'}!
          </span>
        </div>
      </div>

      {/* Wardrobe & Barbie Dressing Room */}
      {activePet && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-pink-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-pink-100 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center border-2 border-pink-300">
                <PetAvatar pet={activePet} size="sm" interactive={false} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">
                  {activePet.name}'s Barbie Glam Salon
                </h3>
                <p className="text-xs font-extrabold text-pink-600">
                  {activePet.breedVariant} • Level {activePet.level}
                </p>
              </div>
            </div>

            {/* Sub-Navigation */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('wardrobe')}
                className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 ${
                  activeTab === 'wardrobe' ? 'bg-pink-500 text-white shadow-md' : 'bg-pink-50 text-pink-900'
                }`}
              >
                <Shirt size={16} />
                <span>Glam Accessories</span>
              </button>

              <button
                onClick={() => setActiveTab('shop')}
                className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 ${
                  activeTab === 'shop' ? 'bg-pink-500 text-white shadow-md' : 'bg-pink-50 text-pink-900'
                }`}
              >
                <Utensils size={16} />
                <span>Barbie Snack Bar</span>
              </button>
            </div>
          </div>

          {/* Wardrobe Accessory Grid */}
          {activeTab === 'wardrobe' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-700">Equip Glam Tiara Crowns, Aviators & Bowties:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {PET_ACCESSORIES.map(acc => {
                  const isEquipped =
                    activePet.accessories.hat === acc.id ||
                    activePet.accessories.glasses === acc.id ||
                    activePet.accessories.outfit === acc.id ||
                    activePet.accessories.neck === acc.id;

                  return (
                    <button
                      key={acc.id}
                      onClick={() => handleEquip(acc)}
                      className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                        isEquipped
                          ? 'bg-pink-50 border-pink-500 ring-2 ring-pink-200'
                          : 'bg-white border-slate-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{acc.icon}</span>
                        <span className="text-[10px] uppercase font-black bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                          {acc.type}
                        </span>
                      </div>
                      <span className="font-bold text-xs text-slate-800 line-clamp-1">{acc.name}</span>
                      <span className="text-xs font-black text-pink-600 mt-1">
                        {isEquipped ? '✓ Equipped' : 'Equip Glam'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Barbie Shop Item Grid */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-700">Buy Delicious Treats & Toys:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {SHOP_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (coins >= item.price) {
                        soundManager.playCoin();
                        onBuyItem(item);
                      } else {
                        soundManager.playPop();
                      }
                    }}
                    className="p-3 rounded-2xl border-2 border-slate-200 hover:border-pink-400 bg-white text-left flex flex-col justify-between active:scale-95 transition-transform"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        🪙 {item.price}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-slate-800 line-clamp-1 mt-2">{item.name}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-2 mt-1">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
