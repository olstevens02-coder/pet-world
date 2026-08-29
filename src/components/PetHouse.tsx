import React, { useState, useEffect } from 'react';
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
  Car,
  Flame,
  Wine,
  Trophy,
  Droplets,
  Wind,
  Smile,
  Zap,
  Radio
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
  action: 'idle' | 'walking' | 'sniffing' | 'napping' | 'playing';
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

  // Interactive Wash & Grooming State
  const [showWashModal, setShowWashModal] = useState(false);
  const [washStep, setWashStep] = useState<'soap' | 'rinse' | 'dry' | 'brush'>('soap');
  const [cleanlinessProgress, setCleanlinessProgress] = useState(0);
  const [sudsCount, setSudsCount] = useState<number>(0);

  // Ferrari Quick Ride Simulation in Room
  const [showFerrariRideModal, setShowFerrariRideModal] = useState(false);
  const [ferrariSpeed, setFerrariSpeed] = useState(0);
  const [isNitroOn, setIsNitroOn] = useState(false);

  const activePet = adoptedPets.find(p => p.id === (selectedPetId || activePetId)) || adoptedPets[0] || null;
  const baseUrl = import.meta.env.BASE_URL || '/';

  // Realistic Ken Mojo Dojo Casa House Rooms with High-Definition Photography
  const mojoRooms: {
    id: HouseRoomType;
    name: string;
    icon: string;
    tagline: string;
    imagePath: string;
  }[] = [
    {
      id: 'mojo_living_lounge',
      name: "Ken's Mojo Dojo Great Room",
      icon: '🛋️',
      tagline: 'Cognac leather Chesterfield couches, stone fireplace, and stallion statues.',
      imagePath: `${baseUrl}rooms/mojo_living_lounge.jpg`
    },
    {
      id: 'deck_infinity_pool',
      name: 'Outdoor Infinity Deck & Pool',
      icon: '🏊',
      tagline: 'Teak wood sun deck, crystal infinity pool, and mountain sunset view.',
      imagePath: `${baseUrl}rooms/deck_infinity_pool.jpg`
    },
    {
      id: 'garage_showroom_lounge',
      name: 'Ferrari Garage & Game Bay',
      icon: '🏎️',
      tagline: 'Glass-walled Ferrari showroom bay, foosball table, and mini-fridge.',
      imagePath: `${baseUrl}rooms/garage_showroom_lounge.jpg`
    },
    {
      id: 'master_suite_bedroom',
      name: 'Mojo Master Suite',
      icon: '🛏️',
      tagline: 'King leather headboard bed, cowhide throws, and stone wall fireplace.',
      imagePath: `${baseUrl}rooms/master_suite_bedroom.jpg`
    },
    {
      id: 'gourmet_kitchen_bar',
      name: 'Granite Kitchen & Snack Bar',
      icon: '🍽️',
      tagline: 'Black granite countertops, stainless steel appliances, and chef pet feast island.',
      imagePath: `${baseUrl}rooms/gourmet_kitchen_bar.jpg`
    }
  ];

  const currentRoomInfo = mojoRooms.find(r => r.id === currentRoom) || mojoRooms[0];

  // Autonomous Roaming State for all Adopted Pets
  const [petStates, setPetStates] = useState<Record<string, PetRoamState>>({});

  useEffect(() => {
    setPetStates(prev => {
      const next: Record<string, PetRoamState> = { ...prev };
      adoptedPets.forEach((p, idx) => {
        if (!next[p.id]) {
          const initX = 22 + (idx * 16) % 55;
          const initY = 62 + (idx * 6) % 20;
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

  // Main Movement Loop
  useEffect(() => {
    const moveLoop = setInterval(() => {
      setPetStates(prev => {
        const updated: Record<string, PetRoamState> = { ...prev };
        let hasChanges = false;

        adoptedPets.forEach(pet => {
          const state = updated[pet.id];
          if (!state) return;

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
            hasChanges = true;
            updated[pet.id] = {
              ...state,
              x: state.targetX,
              y: state.targetY,
              isWalking: false,
              action: Math.random() < 0.4 ? 'sniffing' : Math.random() < 0.3 ? 'napping' : 'idle'
            };
          } else {
            // Autonomous random wander on hardwood floors
            if (Math.random() < 0.025) {
              hasChanges = true;
              const wanderX = 15 + Math.random() * 68;
              const wanderY = 58 + Math.random() * 24;
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

  // Tap floor to guide active pet or shine laser
  const handleRoomClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeTab === 'toys') {
      soundManager.playPop();
      setLaserTarget({ x: clickX, y: clickY });
      setTimeout(() => setLaserTarget(null), 1800);

      // All pets dash toward laser
      setPetStates(prev => {
        const next = { ...prev };
        adoptedPets.forEach((pet, i) => {
          if (next[pet.id]) {
            next[pet.id] = {
              ...next[pet.id],
              targetX: Math.max(12, Math.min(85, clickX + (i - 1) * 6)),
              targetY: Math.max(52, Math.min(84, clickY)),
              isWalking: true,
              facing: clickX < next[pet.id].x ? 'left' : 'right',
              action: 'playing'
            };
          }
        });
        return next;
      });
    } else {
      if (activePet) {
        soundManager.playPop();
        setPetStates(prev => {
          if (!prev[activePet.id]) return prev;
          return {
            ...prev,
            [activePet.id]: {
              ...prev[activePet.id],
              targetX: Math.max(12, Math.min(85, clickX)),
              targetY: Math.max(52, Math.min(84, clickY)),
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
    const ballTargetY = 60 + Math.random() * 20;

    setBouncingBall({ x: 50, y: 35 });
    setTimeout(() => setBouncingBall({ x: ballTargetX, y: ballTargetY }), 350);
    setTimeout(() => setBouncingBall(null), 2500);

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

  // WASHING & CLEANING INTERACTIONS
  const handleApplySoap = () => {
    soundManager.playSoapSuds();
    setSudsCount(prev => Math.min(12, prev + 2));
    setCleanlinessProgress(prev => Math.min(100, prev + 20));
  };

  const handleRinseShower = () => {
    soundManager.playWaterSplash();
    setSudsCount(0);
    setCleanlinessProgress(prev => Math.min(100, prev + 30));
  };

  const handleBlowDry = () => {
    soundManager.playBlowDryer();
    setCleanlinessProgress(prev => Math.min(100, prev + 25));
  };

  const handleBrush = () => {
    soundManager.playHeart();
    soundManager.playPetSound(activePet?.species || 'puppy');
    setCleanlinessProgress(100);
    confetti({ particleCount: 60, spread: 80 });
  };

  // FERRARI QUICK RIDE ACCELERATION
  const handleFerrariGas = () => {
    soundManager.startEngine();
    setFerrariSpeed(prev => {
      const nextSpeed = Math.min(100, prev + 25);
      soundManager.setEngineRPM(nextSpeed / 100);
      return nextSpeed;
    });
  };

  const handleFerrariNitro = () => {
    setIsNitroOn(true);
    soundManager.playNitroBoost();
    confetti({ particleCount: 70, spread: 100, colors: ['#ff5500', '#38bdf8', '#fbbf24'] });
    setFerrariSpeed(100);
    soundManager.setEngineRPM(1.0);
    setTimeout(() => setIsNitroOn(false), 1200);
  };

  const handleEquip = (acc: PetAccessory) => {
    if (!activePet) return;
    soundManager.playFanfare();
    confetti({ particleCount: 50, spread: 60 });
    onEquipAccessory(activePet.id, acc);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 select-none animate-fadeIn">
      {/* Ken Mojo Dojo Casa Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-zinc-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-amber-600/50">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-1.5 rounded-full text-xs font-black border border-amber-500/40 text-amber-300">
            <span>🎸 ROCKIN' KEN MOJO DOJO CASA HOUSE 🏎️</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-xl font-['Fredoka']">
            Mojo Dojo Casa House
          </h1>
          <p className="text-amber-100/80 font-bold max-w-xl text-sm md:text-base">
            Turn up the rock music, give your pet a warm bubbly wash, and hop in the Orange Ferrari to go for a high-speed ride!
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Wash & Clean Him CTA */}
          <button
            onClick={() => {
              setShowWashModal(true);
              setCleanlinessProgress(40);
              setSudsCount(0);
              soundManager.playSoapSuds();
            }}
            className="px-5 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-black text-sm rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 transition-all border border-sky-300"
          >
            <Droplets size={20} className="text-sky-200 animate-bounce" />
            <span>🧼 Clean & Wash Him!</span>
          </button>

          {/* Ride Orange Ferrari CTA */}
          <button
            onClick={() => {
              setShowFerrariRideModal(true);
              soundManager.startEngine();
            }}
            className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 transition-all border border-amber-300 animate-pulse"
          >
            <Car size={20} className="text-yellow-200" />
            <span>🏎️ Ride Orange Ferrari!</span>
          </button>
        </div>
      </div>

      {/* Room Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {mojoRooms.map(r => (
          <button
            key={r.id}
            onClick={() => {
              onChangeRoom(r.id);
              soundManager.playClick();
            }}
            className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2.5 whitespace-nowrap transition-all shadow-md ${
              currentRoom === r.id
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white ring-4 ring-amber-400/40 scale-105 shadow-xl'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-700'
            }`}
          >
            <span className="text-xl">{r.icon}</span>
            <div className="text-left">
              <span className="block font-black">{r.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Realistic Photographic Interior Room Canvas */}
      <div
        onClick={handleRoomClick}
        className="relative w-full h-[620px] rounded-3xl border-8 border-stone-800 shadow-2xl overflow-hidden cursor-pointer flex flex-col justify-between"
      >
        {/* Photorealistic High-Definition Room Background */}
        <img
          src={currentRoomInfo.imagePath}
          alt={currentRoomInfo.name}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Subtle Vignette Gradient for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Ambient Room Header Tag */}
        <div className="absolute top-4 left-6 z-30 bg-stone-950/85 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-amber-500/40 shadow-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl border border-amber-500/40 text-amber-400">
            {currentRoomInfo.icon}
          </div>
          <div>
            <h3 className="text-base font-black text-amber-100 flex items-center gap-2">
              <span>{currentRoomInfo.name}</span>
            </h3>
            <p className="text-xs text-amber-300/80 font-bold">{currentRoomInfo.tagline}</p>
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

        {/* ALL ADOPTED PETS FREELY ROAMING ON REALISTIC FLOORS */}
        <div className="absolute inset-0 pointer-events-none">
          {adoptedPets.map(pet => {
            const state = petStates[pet.id] || {
              x: 50,
              y: 70,
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
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-stone-900/90 text-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-md border border-amber-500/40">
                    💤 Resting on rug...
                  </div>
                )}

                {/* Co-Pilot Badge */}
                {isSelected && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-md border border-white whitespace-nowrap">
                    🏎️ Ferrari Co-Pilot
                  </div>
                )}

                {/* 3D Pixar/Blender Render Character */}
                <div className={`p-1.5 rounded-3xl ${isSelected ? 'bg-amber-500/20 ring-2 ring-amber-400' : ''}`}>
                  <PetAvatar
                    pet={pet}
                    size="xl"
                    isWalking={state.isWalking}
                    facing={state.facing}
                    expression={state.action === 'playing' ? 'excited' : isSelected ? 'happy' : 'normal'}
                  />
                </div>

                {/* Name Tag */}
                <div className="bg-stone-950/90 backdrop-blur-md px-3 py-0.5 rounded-full shadow-md text-center border border-amber-500/30 -mt-1 mx-auto w-fit">
                  <span className="font-extrabold text-[11px] text-amber-100">{pet.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Interactive Toolbar (Clean, Ride Ferrari, Toys, Laser) */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 bg-stone-950/85 backdrop-blur-md p-3 rounded-2xl border border-amber-500/30 shadow-2xl text-white m-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowWashModal(true);
                setCleanlinessProgress(40);
                soundManager.playSoapSuds();
              }}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95 border border-sky-300"
            >
              <span>🧼 Wash & Clean Him</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFerrariRideModal(true);
                soundManager.startEngine();
              }}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95 border border-amber-300"
            >
              <span>🏎️ Ride Ferrari</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleThrowBall();
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>🎾 Throw Ball</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('toys');
                soundManager.playPop();
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95 ${
                activeTab === 'toys'
                  ? 'bg-rose-600 text-white border-2 border-amber-300'
                  : 'bg-stone-800 text-amber-200 hover:bg-stone-700'
              }`}
            >
              <span>🔴 Laser Pointer</span>
            </button>
          </div>

          <span className="text-xs font-black text-amber-300/80 hidden sm:block">
            💡 Tap any spot on the floor to call {activePet?.name || 'your pet'}!
          </span>
        </div>
      </div>

      {/* INTERACTIVE CLEAN & WASH MODAL ("CLEAN HIM") */}
      {showWashModal && activePet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border-4 border-sky-400 rounded-3xl p-6 md:p-8 max-w-2xl w-full text-white shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-700 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🧼</span>
                <div>
                  <h3 className="text-2xl font-black text-sky-300">
                    Mojo Spa: Wash & Clean {activePet.name}!
                  </h3>
                  <p className="text-xs text-stone-300">
                    Lather soap, rinse with warm water, blow dry, and brush his silky fur!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWashModal(false)}
                className="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-black flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Spa Bath Tub Area with Pet */}
            <div className="relative h-64 bg-gradient-to-b from-sky-900/60 to-stone-950 rounded-2xl border-2 border-sky-500/40 flex items-center justify-center overflow-hidden">
              {/* Bath Bubbles Overlay */}
              {Array.from({ length: sudsCount }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-4xl animate-bounce"
                  style={{
                    left: `${25 + (i * 7) % 55}%`,
                    top: `${30 + (i * 9) % 45}%`,
                    animationDelay: `${i * 0.15}s`
                  }}
                >
                  🫧
                </div>
              ))}

              <div className="relative z-10 scale-125">
                <PetAvatar pet={activePet} size="xl" expression="excited" interactive={false} />
              </div>
            </div>

            {/* Cleanliness Progress Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-black text-sky-200">
                <span>Cleanliness Level:</span>
                <span>{cleanlinessProgress}%</span>
              </div>
              <div className="w-full h-4 bg-stone-800 rounded-full overflow-hidden border border-sky-500/40">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-teal-400 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.8)]"
                  style={{ width: `${cleanlinessProgress}%` }}
                />
              </div>
            </div>

            {/* 4 Interactive Spa Tools */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleApplySoap}
                className="p-3.5 bg-sky-950/80 hover:bg-sky-900 border-2 border-sky-400 rounded-2xl text-center active:scale-95 transition-all flex flex-col items-center gap-1.5"
              >
                <span className="text-3xl">🧼</span>
                <span className="font-black text-xs text-sky-200">1. Lather Soap</span>
              </button>

              <button
                onClick={handleRinseShower}
                className="p-3.5 bg-sky-950/80 hover:bg-sky-900 border-2 border-sky-400 rounded-2xl text-center active:scale-95 transition-all flex flex-col items-center gap-1.5"
              >
                <span className="text-3xl">🚿</span>
                <span className="font-black text-xs text-sky-200">2. Warm Shower</span>
              </button>

              <button
                onClick={handleBlowDry}
                className="p-3.5 bg-sky-950/80 hover:bg-sky-900 border-2 border-sky-400 rounded-2xl text-center active:scale-95 transition-all flex flex-col items-center gap-1.5"
              >
                <span className="text-3xl">💨</span>
                <span className="font-black text-xs text-sky-200">3. Fluff Dryer</span>
              </button>

              <button
                onClick={handleBrush}
                className="p-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl text-center active:scale-95 transition-all flex flex-col items-center gap-1.5 shadow-lg border border-teal-300"
              >
                <span className="text-3xl">🪮</span>
                <span className="font-black text-xs">4. Velvet Brush</span>
              </button>
            </div>

            {cleanlinessProgress === 100 && (
              <div className="bg-emerald-950/80 border border-emerald-400 p-4 rounded-2xl text-center space-y-2">
                <p className="font-black text-emerald-300 text-sm">
                  ✨ {activePet.name} is sparkling clean, smelling amazing, and super happy!
                </p>
                <button
                  onClick={() => setShowWashModal(false)}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-lg"
                >
                  Done Washing! 🎉
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE FERRARI RIDE SIMULATOR MODAL ("RIDE THE ORANGE FERRARI") */}
      {showFerrariRideModal && activePet && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border-4 border-orange-500 rounded-3xl p-6 md:p-8 max-w-3xl w-full text-white shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-700 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🏎️</span>
                <div>
                  <h3 className="text-2xl font-black text-orange-400">
                    Riding with {activePet.name} in the Orange Ferrari!
                  </h3>
                  <p className="text-xs text-stone-300">
                    Hit the gas, rev the V8 engine, and trigger NITRO BOOST!
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.stopEngine();
                  setShowFerrariRideModal(false);
                }}
                className="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-black flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Convertible Cockpit Ride Stage */}
            <div
              className={`relative h-72 bg-gradient-to-b from-amber-950 via-stone-900 to-black rounded-2xl border-4 border-orange-500/50 flex items-center justify-around overflow-hidden ${
                isNitroOn ? 'animate-wiggle shadow-[0_0_40px_rgba(249,115,22,1)]' : ''
              }`}
            >
              {/* Fast Moving Highway Lines in Background */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent 0px, transparent 40px, rgba(249,115,22,0.6) 40px, rgba(249,115,22,0.6) 80px)',
                  backgroundSize: '100% 120px',
                  animation: `roadMove ${Math.max(0.15, 0.8 - (ferrariSpeed / 100) * 0.65)}s linear infinite`
                }}
              />

              {/* Nitro Flame Exhaust Particles */}
              {isNitroOn && (
                <div className="absolute inset-x-0 bottom-4 flex justify-between px-16 text-5xl animate-ping">
                  <span>🔥</span>
                  <span>⚡</span>
                  <span>🔥</span>
                </div>
              )}

              {/* Driver & Co-Pilot Pet in Convertible Seat */}
              <div className="relative z-10 flex items-center gap-8">
                {/* 3D Pet Wearing Aviator Glasses in Passenger Seat */}
                <div className="text-center space-y-1">
                  <div className="transform rotate-3">
                    <PetAvatar pet={activePet} size="xl" expression="excited" interactive={false} />
                  </div>
                  <div className="bg-orange-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg border border-white">
                    🏎️ Co-Pilot {activePet.name}
                  </div>
                </div>

                {/* Dashboard Speedometer */}
                <div className="bg-stone-950/90 border-2 border-orange-500 p-4 rounded-2xl text-center space-y-2 shadow-2xl">
                  <span className="text-xs font-black text-orange-400 uppercase tracking-widest block">
                    Speedometer
                  </span>
                  <div className="text-4xl font-black text-white font-mono">
                    {Math.round(45 + ferrariSpeed * 1.55)} <span className="text-xs text-orange-400">MPH</span>
                  </div>
                  <div className="w-28 h-3 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-200"
                      style={{ width: `${ferrariSpeed}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Dashboard Driving Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleFerrariGas}
                  className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 border-2 border-white"
                >
                  <Flame size={20} className="text-yellow-200" />
                  <span>🏎️ Hit the Gas!</span>
                </button>

                <button
                  onClick={handleFerrariNitro}
                  className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black text-sm rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 border-2 border-white"
                >
                  <Zap size={20} className="text-yellow-300" />
                  <span>🚀 NITRO BOOST!</span>
                </button>

                <button
                  onClick={() => soundManager.playFerrariHorn('classic')}
                  className="px-5 py-3.5 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-white font-black text-sm rounded-2xl shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Radio size={18} className="text-orange-400" />
                  <span>🎺 Horn</span>
                </button>
              </div>

              <button
                onClick={() => {
                  soundManager.stopEngine();
                  setShowFerrariRideModal(false);
                  onStartDrive();
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl active:scale-95 flex items-center gap-2 border border-white"
              >
                <span>🛣️ Full Highway Mini-Game →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wardrobe & Mojo Dojo Pet Lounge */}
      {activePet && (
        <div className="bg-stone-900 rounded-3xl p-6 md:p-8 shadow-xl border-4 border-stone-800 space-y-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-700 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center border-2 border-amber-500/40">
                <PetAvatar pet={activePet} size="sm" interactive={false} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-amber-100">
                  {activePet.name}'s Mojo Lounge
                </h3>
                <p className="text-xs font-extrabold text-amber-400">
                  {activePet.breedVariant} • Level {activePet.level}
                </p>
              </div>
            </div>

            {/* Subnav */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('wardrobe')}
                className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 ${
                  activeTab === 'wardrobe' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-800 text-stone-300'
                }`}
              >
                <Shirt size={16} />
                <span>Bandanas & Aviators</span>
              </button>

              <button
                onClick={() => setActiveTab('shop')}
                className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 ${
                  activeTab === 'shop' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-800 text-stone-300'
                }`}
              >
                <Utensils size={16} />
                <span>Mojo Snack Bar</span>
              </button>
            </div>
          </div>

          {/* Wardrobe Grid */}
          {activeTab === 'wardrobe' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-amber-200">Equip Aviator Shades, Ferrari Bandanas & Champion Medals:</h4>
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
                          ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-400/40'
                          : 'bg-stone-800/80 border-stone-700 hover:border-amber-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{acc.icon}</span>
                        <span className="text-[10px] uppercase font-black bg-stone-900 text-amber-400 px-2 py-0.5 rounded-full border border-stone-700">
                          {acc.type}
                        </span>
                      </div>
                      <span className="font-bold text-xs text-amber-100 line-clamp-1">{acc.name}</span>
                      <span className="text-xs font-black text-amber-400 mt-1">
                        {isEquipped ? '✓ Equipped' : 'Equip'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Snack Bar Grid */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-amber-200">Get Gourmet Pet Treats & Snacks:</h4>
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
                    className="p-3 rounded-2xl border-2 border-stone-700 hover:border-amber-500 bg-stone-800 text-left flex flex-col justify-between active:scale-95 transition-transform"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-xs font-black text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-600/40">
                        🪙 {item.price}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-amber-100 line-clamp-1 mt-2">{item.name}</span>
                    <span className="text-[11px] text-stone-400 line-clamp-2 mt-1">{item.description}</span>
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
