import React, { useState } from 'react';
import { Pet, Item, AnimalType } from '../types/game';
import { SPECIES_CATALOG } from '../data/animals';
import { SHOP_ITEMS } from '../data/items';
import { PetAvatar } from './PetAvatar';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Stethoscope, Droplets, Utensils, Award, Car, Check, ChevronRight } from 'lucide-react';

interface AnimalShelterProps {
  shelterPets: Pet[];
  coins: number;
  inventory: { [itemId: string]: number };
  onAdoptPet: (pet: Pet, customName: string) => void;
  onFeedPet: (petId: string, item: Item) => void;
  onGroomPet: (petId: string, type: 'wash' | 'brush' | 'heal') => void;
  onDriveHomeWithPet: (pet: Pet) => void;
}

export const AnimalShelter: React.FC<AnimalShelterProps> = ({
  shelterPets,
  coins,
  inventory,
  onAdoptPet,
  onFeedPet,
  onGroomPet,
  onDriveHomeWithPet
}) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(shelterPets[0] || null);
  const [activeTab, setActiveTab] = useState<'adopt' | 'vet' | 'bath' | 'feed'>('adopt');
  const [customNameInput, setCustomNameInput] = useState('');
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [selectedSpeciesFilter, setSelectedSpeciesFilter] = useState<string>('all');

  const speciesList: AnimalType[] = [
    'puppy', 'cat', 'kitten', 'parrot', 'gecko', 'ferret', 'axolotl', 'hedgehog', 'snake', 'hamster', 'guinea_pig'
  ];

  const filteredPets = shelterPets.filter(p => {
    if (selectedSpeciesFilter === 'all') return true;
    return p.species === selectedSpeciesFilter;
  });

  const handleOpenAdopt = (pet: Pet) => {
    setSelectedPet(pet);
    setCustomNameInput(pet.name);
    setShowAdoptionModal(true);
    soundManager.playPop();
  };

  const handleConfirmAdopt = () => {
    if (!selectedPet) return;
    const finalName = customNameInput.trim() || selectedPet.name;
    
    soundManager.playFanfare();
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });

    onAdoptPet(selectedPet, finalName);
    setShowAdoptionModal(false);
  };

  const handlePerformGroom = (type: 'wash' | 'brush' | 'heal') => {
    if (!selectedPet) return;
    if (type === 'wash') soundManager.playWaterSplash();
    if (type === 'brush') soundManager.playBrush();
    if (type === 'heal') soundManager.playHeart();

    onGroomPet(selectedPet.id, type);
  };

  const handleFeed = (item: Item) => {
    if (!selectedPet) return;
    soundManager.playMunch();
    soundManager.playPetSound(selectedPet.species);
    onFeedPet(selectedPet.id, item);
  };

  const availableFoods = SHOP_ITEMS.filter(item => item.category === 'food');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 select-none animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white/30">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-black border border-white/30">
            <span>🐾 Sunshine Rescue & Adoption Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-md">
            Find Your Dream Pet!
          </h1>
          <p className="text-sky-100 font-bold max-w-xl text-sm md:text-base">
            All 11 lovely animals are waiting for a loving home! Feed them treats, give them a warm bath, and drive them home in your Orange Ferrari!
          </p>
        </div>

        {/* Shelter Quick Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/30 p-2 rounded-2xl border border-white/20 backdrop-blur-md">
          <button
            onClick={() => { setActiveTab('adopt'); soundManager.playClick(); }}
            className={`px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
              activeTab === 'adopt' ? 'bg-amber-400 text-slate-900 shadow-lg scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            <Heart size={18} className="fill-current" />
            <span>Adoption Floor</span>
          </button>

          <button
            onClick={() => { setActiveTab('vet'); soundManager.playClick(); }}
            className={`px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
              activeTab === 'vet' ? 'bg-amber-400 text-slate-900 shadow-lg scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            <Stethoscope size={18} />
            <span>Vet Clinic</span>
          </button>

          <button
            onClick={() => { setActiveTab('bath'); soundManager.playClick(); }}
            className={`px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
              activeTab === 'bath' ? 'bg-amber-400 text-slate-900 shadow-lg scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            <Droplets size={18} />
            <span>Grooming Spa</span>
          </button>

          <button
            onClick={() => { setActiveTab('feed'); soundManager.playClick(); }}
            className={`px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
              activeTab === 'feed' ? 'bg-amber-400 text-slate-900 shadow-lg scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            <Utensils size={18} />
            <span>Treat Bar</span>
          </button>
        </div>
      </div>

      {/* Main Shelter Workspace */}
      {activeTab === 'adopt' && (
        <div className="space-y-6">
          {/* Species Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedSpeciesFilter('all')}
              className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all shadow-sm ${
                selectedSpeciesFilter === 'all'
                  ? 'bg-orange-500 text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-amber-100'
              }`}
            >
              🌟 All Pets ({shelterPets.length})
            </button>

            {speciesList.map(sp => {
              const info = SPECIES_CATALOG[sp];
              const count = shelterPets.filter(p => p.species === sp).length;
              return (
                <button
                  key={sp}
                  onClick={() => setSelectedSpeciesFilter(sp)}
                  className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap flex items-center gap-1.5 transition-all shadow-sm ${
                    selectedSpeciesFilter === sp
                      ? 'bg-orange-500 text-white shadow-md scale-105'
                      : 'bg-white text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  <span>{info.emoji}</span>
                  <span>{info.displayName}</span>
                  <span className="text-xs opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Shelter Pets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map(pet => {
              const specInfo = SPECIES_CATALOG[pet.species];
              const isSelected = selectedPet?.id === pet.id;

              return (
                <div
                  key={pet.id}
                  onClick={() => {
                    setSelectedPet(pet);
                    soundManager.playPetSound(pet.species);
                  }}
                  className={`bg-white rounded-3xl p-6 shadow-md border-4 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-xl ${
                    isSelected ? 'border-orange-500 ring-4 ring-orange-200 scale-[1.02]' : 'border-slate-100 hover:border-amber-300'
                  }`}
                >
                  <div>
                    {/* Top Pet Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-black text-slate-800">{pet.name}</h3>
                          <span className="text-xl">{specInfo.emoji}</span>
                        </div>
                        <p className="text-xs font-bold text-orange-600 tracking-wide uppercase">
                          {pet.breedVariant}
                        </p>
                      </div>

                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-full">
                        Ready for Home
                      </span>
                    </div>

                    {/* Pet Avatar Display */}
                    <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-2xl p-4 flex items-center justify-center my-3 border border-amber-100 h-44">
                      <PetAvatar pet={pet} size="lg" expression="happy" />
                    </div>

                    {/* Bio & Quirks */}
                    <p className="text-slate-600 text-sm italic mb-4 line-clamp-2">
                      "{pet.bio}"
                    </p>

                    {/* Needs Bar Preview */}
                    <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                        <span>Happiness:</span>
                        <span className="text-rose-500 font-black">{pet.needs.happiness}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
                          style={{ width: `${pet.needs.happiness}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Adoption Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAdopt(pet);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-black text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform"
                    >
                      <Heart size={20} className="fill-white" />
                      <span>Adopt {pet.name} ➔</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vet Clinic Tab */}
      {activeTab === 'vet' && selectedPet && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-sky-100 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 bg-gradient-to-b from-sky-50 to-blue-100 rounded-3xl flex items-center justify-center p-6 border-2 border-sky-200 shadow-inner">
              <PetAvatar pet={selectedPet} size="xl" expression="normal" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mt-3">{selectedPet.name}</h2>
            <p className="text-sm font-bold text-sky-600">{selectedPet.breedVariant}</p>
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Stethoscope className="text-sky-600" />
                <span>Pet Wellness & Check-Up</span>
              </h3>
              <p className="text-slate-600 text-sm font-medium">
                Keep {selectedPet.name} strong and energetic! Perform checkups and healing drops.
              </p>
            </div>

            {/* Health Status Bar */}
            <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 space-y-2">
              <div className="flex justify-between font-black text-sm">
                <span className="text-slate-700">Overall Health Score:</span>
                <span className="text-emerald-600">{selectedPet.needs.health}%</span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${selectedPet.needs.health}%` }}
                />
              </div>
            </div>

            {/* Interactive Vet Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => handlePerformGroom('heal')}
                className="p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex flex-col items-center gap-2 text-center active:scale-95 transition-transform"
              >
                <span className="text-3xl">🩺</span>
                <span className="font-extrabold text-sm text-emerald-900">Health Scan</span>
                <span className="text-xs text-emerald-700 font-bold">+25 Health</span>
              </button>

              <button
                onClick={() => handlePerformGroom('heal')}
                className="p-4 bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 rounded-2xl flex flex-col items-center gap-2 text-center active:scale-95 transition-transform"
              >
                <span className="text-3xl">🩹</span>
                <span className="font-extrabold text-sm text-rose-900">Gentle Bandage</span>
                <span className="text-xs text-rose-700 font-bold">+20 Happiness</span>
              </button>

              <button
                onClick={() => handlePerformGroom('heal')}
                className="p-4 bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 rounded-2xl flex flex-col items-center gap-2 text-center active:scale-95 transition-transform"
              >
                <span className="text-3xl">🧪</span>
                <span className="font-extrabold text-sm text-sky-900">Vitamin Tonic</span>
                <span className="text-xs text-sky-700 font-bold">+30 Energy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grooming & Bath Spa Tab */}
      {activeTab === 'bath' && selectedPet && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-cyan-100 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 bg-gradient-to-b from-cyan-50 to-teal-100 rounded-3xl flex items-center justify-center p-6 border-2 border-cyan-200 shadow-inner relative overflow-hidden">
              <PetAvatar pet={selectedPet} size="xl" expression="excited" />
              {/* Floating Bubbles */}
              <span className="absolute top-4 left-6 text-2xl animate-float">🫧</span>
              <span className="absolute bottom-6 right-6 text-xl animate-float">🫧</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mt-3">{selectedPet.name}</h2>
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Droplets className="text-cyan-500" />
                <span>Bubble Spa & Grooming Salon</span>
              </h3>
              <p className="text-slate-600 text-sm font-medium">
                Make {selectedPet.name}'s coat shiny and clean with warm bubbly suds and soft brushes!
              </p>
            </div>

            {/* Cleanliness Bar */}
            <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100 space-y-2">
              <div className="flex justify-between font-black text-sm">
                <span className="text-slate-700">Sparkle Cleanliness:</span>
                <span className="text-cyan-600">{selectedPet.needs.cleanliness}%</span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${selectedPet.needs.cleanliness}%` }}
                />
              </div>
            </div>

            {/* Spa Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => handlePerformGroom('wash')}
                className="p-4 bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-300 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <span className="text-3xl">🧼</span>
                <span className="font-extrabold text-sm text-cyan-900">Bubble Bath</span>
                <span className="text-xs text-cyan-700 font-bold">+35 Cleanliness</span>
              </button>

              <button
                onClick={() => handlePerformGroom('brush')}
                className="p-4 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <span className="text-3xl">🪮</span>
                <span className="font-extrabold text-sm text-amber-900">Velvet Brush</span>
                <span className="text-xs text-amber-700 font-bold">+30 Happiness</span>
              </button>

              <button
                onClick={() => handlePerformGroom('wash')}
                className="p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <span className="text-3xl">💨</span>
                <span className="font-extrabold text-sm text-purple-900">Fluff Dryer</span>
                <span className="text-xs text-purple-700 font-bold">+25 Cleanliness</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Treat Snack Bar Tab */}
      {activeTab === 'feed' && selectedPet && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-amber-100 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl flex items-center justify-center p-6 border-2 border-amber-200 shadow-inner">
              <PetAvatar pet={selectedPet} size="xl" expression="eating" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mt-3">{selectedPet.name}</h2>
            <p className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full mt-1">
              Favorite: {selectedPet.favoriteFood}
            </p>
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Utensils className="text-orange-500" />
                <span>Gourmet Treat Buffet</span>
              </h3>
              <p className="text-slate-600 text-sm font-medium">
                Feed delicious snacks tailored for {selectedPet.species}s!
              </p>
            </div>

            {/* Hunger Bar */}
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 space-y-2">
              <div className="flex justify-between font-black text-sm">
                <span className="text-slate-700">Fullness & Energy:</span>
                <span className="text-orange-600">{selectedPet.needs.hunger}%</span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${selectedPet.needs.hunger}%` }}
                />
              </div>
            </div>

            {/* Food Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableFoods.map(food => {
                const isFav = selectedPet.favoriteFood.toLowerCase().includes(food.name.toLowerCase().split(' ')[0]);

                return (
                  <button
                    key={food.id}
                    onClick={() => handleFeed(food)}
                    className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between active:scale-95 transition-transform ${
                      isFav ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-200' : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{food.icon}</span>
                      {isFav && <span className="text-xs bg-orange-500 text-white font-extrabold px-2 py-0.5 rounded-full">Fav! ⭐</span>}
                    </div>
                    <span className="font-bold text-xs text-slate-800 line-clamp-1 mt-2">{food.name}</span>
                    <span className="text-xs text-emerald-600 font-extrabold">+{food.effect?.hunger || 25} Hunger</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Official Adoption Modal & Certificate Preparation */}
      {showAdoptionModal && selectedPet && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-400 text-slate-800 animate-scaleUp">
            <div className="text-center space-y-3">
              <div className="w-24 h-24 bg-gradient-to-b from-amber-100 to-orange-100 rounded-full mx-auto flex items-center justify-center p-3 border-2 border-amber-300">
                <PetAvatar pet={selectedPet} size="md" />
              </div>

              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-black">
                <Award size={14} />
                <span>OFFICIAL PET ADOPTION PLEDGE</span>
              </div>

              <h2 className="text-3xl font-black">
                Adopt {selectedPet.name}!
              </h2>
              <p className="text-slate-600 text-sm font-medium">
                Give your new friend a sweet name and ride together in your Orange Ferrari to the Dream House!
              </p>
            </div>

            {/* Custom Name Input */}
            <div className="my-6 space-y-2 text-left">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Pet Name:
              </label>
              <input
                type="text"
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                placeholder="Enter a sweet name..."
                className="w-full px-4 py-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 font-black text-lg text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-200"
                maxLength={20}
              />
            </div>

            {/* Adoption Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAdoptionModal(false)}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 font-extrabold text-slate-600 rounded-2xl text-sm transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAdopt}
                className="flex-[2] py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-black text-white rounded-2xl text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Check size={18} />
                <span>Sign Adoption Certificate! 🐾</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
