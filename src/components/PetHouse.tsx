import React, { useState } from 'react';
import { Pet, HouseRoomType, Item, PetAccessory } from '../types/game';
import { SHOP_ITEMS, PET_ACCESSORIES } from '../data/items';
import { PetAvatar } from './PetAvatar';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Home, Sparkles, Heart, Utensils, Camera, Shirt, Sofa, Plus, Sun, Moon, Volume2 } from 'lucide-react';

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

  const activePet = adoptedPets.find(p => p.id === (selectedPetId || activePetId)) || adoptedPets[0] || null;

  const rooms: { id: HouseRoomType; name: string; icon: string; bgGradient: string; description: string }[] = [
    {
      id: 'living_room',
      name: 'Living Room',
      icon: '🛋️',
      bgGradient: 'from-amber-100 via-orange-50 to-amber-200',
      description: 'Lounge on cozy velvet sofas, play with laser pointers, and relax!'
    },
    {
      id: 'backyard',
      name: 'Backyard Playground',
      icon: '🌳',
      bgGradient: 'from-emerald-100 via-green-50 to-teal-100',
      description: 'Sunny grassy field with agility tunnels and splash pools!'
    },
    {
      id: 'kitchen',
      name: 'Gourmet Kitchen',
      icon: '🍽️',
      bgGradient: 'from-orange-100 via-amber-50 to-yellow-100',
      description: 'Automatic treat snack stations and chef pet feast tables!'
    },
    {
      id: 'spa',
      name: 'Pet Spa & Bath',
      icon: '🛁',
      bgGradient: 'from-sky-100 via-cyan-50 to-blue-100',
      description: 'Warm hydro-bubble jacuzzi and grooming beauty mirrors!'
    },
    {
      id: 'bedroom',
      name: 'Cozy Bedroom',
      icon: '🛏️',
      bgGradient: 'from-indigo-100 via-purple-50 to-pink-100',
      description: 'Soft cloud canopy beds, soothing lullabies, and sweet dreams!'
    }
  ];

  const currentRoomInfo = rooms.find(r => r.id === currentRoom) || rooms[0];

  // Laser Pointer Toy Interaction
  const handleRoomClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeTab === 'toys') {
      soundManager.playPop();
      setLaserTarget({ x, y });
      setTimeout(() => setLaserTarget(null), 1500);
    }
  };

  const handleThrowBall = () => {
    soundManager.playPop();
    setBouncingBall({ x: 50, y: 30 });
    setTimeout(() => setBouncingBall({ x: 20 + Math.random() * 60, y: 60 + Math.random() * 20 }), 400);
    setTimeout(() => setBouncingBall(null), 2500);
  };

  const handleEquip = (acc: PetAccessory) => {
    if (!activePet) return;
    soundManager.playFanfare();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    onEquipAccessory(activePet.id, acc);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 select-none animate-fadeIn">
      {/* Top House Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-amber-300/40">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full text-xs font-black border border-white/20">
            <span>🏡 Dream Pet Mansion & Sanctuary</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-md">
            The Dream Pet House
          </h1>
          <p className="text-amber-100 font-bold max-w-xl text-sm md:text-base">
            Your adopted pets live together here! Dress them up, throw toys, take snapshots for your photo album, or take the Ferrari to the shelter!
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenPhotoBooth}
            className="px-5 py-3 bg-white/20 hover:bg-white/30 border border-white/40 rounded-2xl font-black text-sm flex items-center gap-2 backdrop-blur-md shadow-lg active:scale-95 transition-all"
          >
            <Camera size={20} className="text-amber-200" />
            <span>Photo Booth 📸</span>
          </button>

          <button
            onClick={onStartDrive}
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>Drive Ferrari 🏎️</span>
          </button>
        </div>
      </div>

      {/* Room Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {rooms.map(r => (
          <button
            key={r.id}
            onClick={() => {
              onChangeRoom(r.id);
              soundManager.playClick();
            }}
            className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 whitespace-nowrap transition-all shadow-md ${
              currentRoom === r.id
                ? 'bg-orange-500 text-white ring-4 ring-orange-200 scale-105'
                : 'bg-white text-slate-700 hover:bg-amber-50'
            }`}
          >
            <span className="text-xl">{r.icon}</span>
            <span>{r.name}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Room Canvas */}
      <div
        onClick={handleRoomClick}
        className={`relative w-full h-[520px] rounded-3xl p-8 bg-gradient-to-b ${currentRoomInfo.bgGradient} border-4 border-white shadow-2xl overflow-hidden cursor-crosshair flex flex-col justify-between`}
      >
        {/* Room Ambient Decoration */}
        <div className="absolute top-4 left-6 z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-200/50 shadow-sm flex items-center gap-2">
          <span className="text-2xl">{currentRoomInfo.icon}</span>
          <div>
            <h3 className="text-base font-black text-slate-800">{currentRoomInfo.name}</h3>
            <p className="text-xs text-slate-500 font-bold">{currentRoomInfo.description}</p>
          </div>
        </div>

        {/* Laser Target Animation */}
        {laserTarget && (
          <div
            className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-ping"
            style={{ left: `${laserTarget.x}%`, top: `${laserTarget.y}%` }}
          >
            <div className="w-6 h-6 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] border-2 border-white" />
          </div>
        )}

        {/* Bouncing Toy Ball */}
        {bouncingBall && (
          <div
            className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500 text-4xl"
            style={{ left: `${bouncingBall.x}%`, top: `${bouncingBall.y}%` }}
          >
            🎾
          </div>
        )}

        {/* Room Furniture Visual Elements */}
        {currentRoom === 'living_room' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-around opacity-90 p-8">
            <div className="text-7xl absolute left-[15%] bottom-16">🛋️</div>
            <div className="text-6xl absolute right-[15%] bottom-20">🏰</div>
            <div className="text-5xl absolute left-[45%] top-20">🖼️</div>
          </div>
        )}

        {currentRoom === 'backyard' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-around opacity-90 p-8">
            <div className="text-7xl absolute left-[12%] bottom-14">🎪</div>
            <div className="text-7xl absolute right-[18%] bottom-16">🏊</div>
            <div className="text-6xl absolute left-[50%] bottom-24">🌳</div>
          </div>
        )}

        {currentRoom === 'kitchen' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-around opacity-90 p-8">
            <div className="text-7xl absolute left-[20%] bottom-16">🍽️</div>
            <div className="text-7xl absolute right-[25%] bottom-16">🥘</div>
            <div className="text-5xl absolute left-[48%] top-20">🧃</div>
          </div>
        )}

        {currentRoom === 'spa' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-around opacity-90 p-8">
            <div className="text-8xl absolute left-[25%] bottom-14">🛁</div>
            <div className="text-6xl absolute right-[20%] bottom-20">🪞</div>
            <div className="text-4xl absolute left-[40%] top-24">🫧</div>
          </div>
        )}

        {currentRoom === 'bedroom' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-around opacity-90 p-8">
            <div className="text-8xl absolute left-[20%] bottom-14">🛏️</div>
            <div className="text-6xl absolute right-[25%] bottom-20">🧸</div>
            <div className="text-5xl absolute left-[50%] top-20">⭐</div>
          </div>
        )}

        {/* Adopted Pets Roaming Freely! */}
        <div className="relative z-20 w-full h-full flex flex-wrap items-end justify-center gap-8 md:gap-14 pb-8">
          {adoptedPets.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-md text-center border-4 border-amber-300 shadow-2xl my-auto">
              <span className="text-5xl mb-3 block">🏎️🐾</span>
              <h3 className="text-2xl font-black text-slate-800 mb-2">No Pets in the House Yet!</h3>
              <p className="text-slate-600 text-sm font-medium mb-6">
                Hop into your Orange Ferrari and drive to the Animal Shelter to adopt puppies, kittens, parrots, axolotls, and more!
              </p>
              <button
                onClick={onStartDrive}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-base shadow-xl active:scale-95"
              >
                Drive to Shelter in Ferrari ➔
              </button>
            </div>
          ) : (
            adoptedPets.map((pet, idx) => {
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
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-110 drop-shadow-2xl' : 'hover:scale-105 opacity-95'
                  }`}
                >
                  {/* Active Co-Pilot Badge */}
                  {isSelected && (
                    <span className="bg-orange-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full mb-1 shadow-md border border-white">
                      🏎️ Ferrari Co-Pilot
                    </span>
                  )}

                  <div className={`p-2 rounded-3xl ${isSelected ? 'bg-white/80 border-2 border-orange-400' : ''}`}>
                    <PetAvatar pet={pet} size="lg" expression={isSelected ? 'excited' : 'happy'} />
                  </div>

                  <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-md mt-1 border border-slate-200">
                    <span className="font-extrabold text-xs text-slate-800">{pet.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Room Toy Toolbar */}
        <div className="absolute bottom-4 left-6 z-30 flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleThrowBall();
            }}
            className="px-4 py-2.5 bg-white/90 hover:bg-white text-slate-800 rounded-2xl font-extrabold text-xs shadow-lg flex items-center gap-2 border border-slate-200 active:scale-95"
          >
            <span>🎾 Throw Ball</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('toys');
              soundManager.playPop();
            }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg flex items-center gap-2 border transition-all active:scale-95 ${
              activeTab === 'toys' ? 'bg-rose-500 text-white border-rose-400' : 'bg-white/90 text-slate-800 border-slate-200'
            }`}
          >
            <span>🔴 Laser Pointer (Tap Room)</span>
          </button>
        </div>
      </div>

      {/* House Management & Wardrobe Subtabs */}
      {activePet && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center border-2 border-amber-300">
                <PetAvatar pet={activePet} size="sm" interactive={false} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">
                  {activePet.name}'s Dressing Room
                </h3>
                <p className="text-xs font-bold text-orange-600">
                  {activePet.breedVariant} • Level {activePet.level}
                </p>
              </div>
            </div>

            {/* Wardrobe Subnav */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('wardrobe')}
                className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 ${
                  activeTab === 'wardrobe' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Shirt size={16} />
                <span>Accessories & Hats</span>
              </button>

              <button
                onClick={() => setActiveTab('shop')}
                className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 ${
                  activeTab === 'shop' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Utensils size={16} />
                <span>Pet Shop & Treats</span>
              </button>
            </div>
          </div>

          {/* Wardrobe Accessory Grid */}
          {activeTab === 'wardrobe' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-700">Equip Cute Hats, Glasses & Capes:</h4>
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
                          ? 'bg-amber-50 border-orange-500 ring-2 ring-orange-200'
                          : 'bg-white border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{acc.icon}</span>
                        <span className="text-[10px] uppercase font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {acc.type}
                        </span>
                      </div>
                      <span className="font-bold text-xs text-slate-800 line-clamp-1">{acc.name}</span>
                      <span className="text-xs font-black text-orange-600 mt-1">
                        {isEquipped ? '✓ Equipped' : 'Equip Now'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shop Item Grid */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-700">Buy Treats & Toys:</h4>
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
                    className="p-3 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-white text-left flex flex-col justify-between active:scale-95 transition-transform"
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
