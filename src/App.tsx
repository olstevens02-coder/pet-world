import React, { useState, useEffect } from 'react';
import { GameState, LocationType, HouseRoomType, Pet, Item, PetAccessory, FerrariCustomization, PhotoMemory } from './types/game';
import { INITIAL_SHELTER_PETS } from './data/animals';
import { soundManager } from './utils/audio';
import { Navbar } from './components/Navbar';
import { AnimalShelter } from './components/AnimalShelter';
import { DrivingGame } from './components/DrivingGame';
import { PetHouse } from './components/PetHouse';
import { FerrariGarage } from './components/FerrariGarage';
import { MiniGameHub } from './components/MiniGames/MiniGameHub';
import { AdoptionCertificateModal } from './components/AdoptionCertificateModal';
import { PhotoBoothModal } from './components/PhotoBoothModal';
import { PhotoAlbumModal } from './components/PhotoAlbumModal';
import { InstallGuideModal } from './components/InstallGuideModal';

const SAVE_KEY = 'pet_world_save_v1';

const defaultFerrari: FerrariCustomization = {
  paintColor: '#ff5500',
  paintName: 'Sunset Racing Orange',
  spoiler: 'none',
  rims: 'standard',
  underglow: 'orange',
  hornSound: 'classic',
  stripe: 'none',
  topSpeedLevel: 1,
  boostLevel: 1
};

const initialGameState: GameState = {
  coins: 200,
  stars: 5,
  currentLocation: 'shelter',
  activePetId: null,
  shelterPets: INITIAL_SHELTER_PETS,
  adoptedPets: [],
  ferrari: defaultFerrari,
  inventory: {
    food_bone: 3,
    food_salmon: 2,
    groom_bubble_soap: 2
  },
  placedFurniture: [],
  currentRoom: 'glam_living_room',
  unlockedRooms: ['glam_living_room', 'pool_patio_slide', 'glam_salon_vanity', 'dream_bedroom', 'rooftop_party_deck'],
  photoAlbum: [],
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.5,
  highScoreAgility: 0,
  highScoreTreatCatcher: 0,
  stats: {
    totalTripsDriven: 0,
    petsAdopted: 0,
    treatsFed: 0,
    bathsGiven: 0
  }
};

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Fallback
    }
    return initialGameState;
  });

  // Modal States
  const [certificatePet, setCertificatePet] = useState<Pet | null>(null);
  const [showPhotoBooth, setShowPhotoBooth] = useState(false);
  const [showPhotoAlbum, setShowPhotoAlbum] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [drivingTarget, setDrivingTarget] = useState<'shelter' | 'house'>('house');

  // Save to LocalStorage on State Change
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    } catch (e) {
      // Storage error ignored
    }
  }, [gameState]);

  // Handle Location Change & Music
  useEffect(() => {
    if (gameState.currentLocation === 'driving') {
      soundManager.startBGM('driving');
    } else if (gameState.currentLocation === 'house') {
      soundManager.startBGM('house');
    } else {
      soundManager.startBGM('main');
    }
  }, [gameState.currentLocation]);

  const activePet =
    gameState.adoptedPets.find(p => p.id === gameState.activePetId) ||
    gameState.adoptedPets[0] ||
    null;

  // Adoption Handler
  const handleAdoptPet = (pet: Pet, customName: string) => {
    const adopted: Pet = {
      ...pet,
      name: customName,
      isAdopted: true,
      adoptionDate: new Date().toLocaleDateString(),
      needs: { hunger: 90, happiness: 100, energy: 90, cleanliness: 90, health: 100 }
    };

    setGameState(prev => ({
      ...prev,
      shelterPets: prev.shelterPets.filter(p => p.id !== pet.id),
      adoptedPets: [adopted, ...prev.adoptedPets],
      activePetId: adopted.id,
      coins: prev.coins + 50,
      stats: { ...prev.stats, petsAdopted: prev.stats.petsAdopted + 1 }
    }));

    setCertificatePet(adopted);
  };

  // Feeding Handler
  const handleFeedPet = (petId: string, item: Item) => {
    setGameState(prev => {
      const currentCount = prev.inventory[item.id] || 0;
      const newInventory = { ...prev.inventory };
      if (currentCount > 1) {
        newInventory[item.id] = currentCount - 1;
      } else {
        delete newInventory[item.id];
      }

      const hungerBoost = item.effect?.hunger || 25;
      const happyBoost = item.effect?.happiness || 20;

      const updatedAdopted = prev.adoptedPets.map(p => {
        if (p.id === petId) {
          return {
            ...p,
            needs: {
              ...p.needs,
              hunger: Math.min(100, p.needs.hunger + hungerBoost),
              happiness: Math.min(100, p.needs.happiness + happyBoost)
            }
          };
        }
        return p;
      });

      const updatedShelter = prev.shelterPets.map(p => {
        if (p.id === petId) {
          return {
            ...p,
            needs: {
              ...p.needs,
              hunger: Math.min(100, p.needs.hunger + hungerBoost),
              happiness: Math.min(100, p.needs.happiness + happyBoost)
            }
          };
        }
        return p;
      });

      return {
        ...prev,
        inventory: newInventory,
        adoptedPets: updatedAdopted,
        shelterPets: updatedShelter,
        stats: { ...prev.stats, treatsFed: prev.stats.treatsFed + 1 }
      };
    });
  };

  // Grooming Handler
  const handleGroomPet = (petId: string, type: 'wash' | 'brush' | 'heal') => {
    setGameState(prev => {
      const updateNeeds = (p: Pet): Pet => {
        if (p.id !== petId) return p;
        if (type === 'wash') {
          return {
            ...p,
            needs: {
              ...p.needs,
              cleanliness: Math.min(100, p.needs.cleanliness + 35),
              happiness: Math.min(100, p.needs.happiness + 15)
            }
          };
        }
        if (type === 'brush') {
          return {
            ...p,
            needs: {
              ...p.needs,
              cleanliness: Math.min(100, p.needs.cleanliness + 20),
              happiness: Math.min(100, p.needs.happiness + 30)
            }
          };
        }
        // Heal
        return {
          ...p,
          needs: {
            ...p.needs,
            health: 100,
            happiness: Math.min(100, p.needs.happiness + 20),
            energy: Math.min(100, p.needs.energy + 25)
          }
        };
      };

      return {
        ...prev,
        adoptedPets: prev.adoptedPets.map(updateNeeds),
        shelterPets: prev.shelterPets.map(updateNeeds),
        stats: { ...prev.stats, bathsGiven: prev.stats.bathsGiven + 1 }
      };
    });
  };

  // Wardrobe Accessory Equip Handler
  const handleEquipAccessory = (petId: string, accessory: PetAccessory) => {
    setGameState(prev => ({
      ...prev,
      adoptedPets: prev.adoptedPets.map(p => {
        if (p.id === petId) {
          const currentAcc = { ...p.accessories };
          if (currentAcc[accessory.type] === accessory.id) {
            delete currentAcc[accessory.type]; // Unequip
          } else {
            currentAcc[accessory.type] = accessory.id; // Equip
          }
          return { ...p, accessories: currentAcc };
        }
        return p;
      })
    }));
  };

  // Buy Shop Item Handler
  const handleBuyItem = (item: Item) => {
    setGameState(prev => {
      if (prev.coins < item.price) return prev;
      return {
        ...prev,
        coins: prev.coins - item.price,
        inventory: {
          ...prev.inventory,
          [item.id]: (prev.inventory[item.id] || 0) + 1
        }
      };
    });
  };

  // Ferrari Customization Handler
  const handleUpdateFerrari = (updatedFerrari: FerrariCustomization, cost: number) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins - cost,
      ferrari: updatedFerrari
    }));
  };

  // Start Driving Mini-Game
  const handleStartDriving = (target?: 'shelter' | 'house') => {
    const dest = target || (gameState.currentLocation === 'shelter' ? 'house' : 'shelter');
    setDrivingTarget(dest);
    setGameState(prev => ({
      ...prev,
      currentLocation: 'driving'
    }));
    soundManager.playPop();
  };

  // Arrival After Driving
  const handleArriveDestination = (destination: 'shelter' | 'house', earnedCoins: number, collectedTreats: string[]) => {
    setGameState(prev => {
      const newInventory = { ...prev.inventory };
      collectedTreats.forEach(tName => {
        newInventory['food_bone'] = (newInventory['food_bone'] || 0) + 1;
      });

      return {
        ...prev,
        coins: prev.coins + earnedCoins,
        inventory: newInventory,
        currentLocation: destination,
        stats: { ...prev.stats, totalTripsDriven: prev.stats.totalTripsDriven + 1 }
      };
    });
  };

  // Mini-Game Reward Handler
  const handleMiniGameReward = (coinsEarned: number, starsEarned: number) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + coinsEarned,
      stars: prev.stars + starsEarned
    }));
  };

  // Save Photo to Album
  const handleSavePhoto = (photo: PhotoMemory) => {
    setGameState(prev => ({
      ...prev,
      photoAlbum: [photo, ...prev.photoAlbum]
    }));
    setShowPhotoBooth(false);
  };

  return (
    <div className="min-h-screen bg-[#fffbeb] text-slate-800 flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar
        currentLocation={gameState.currentLocation}
        coins={gameState.coins}
        stars={gameState.stars}
        adoptedCount={gameState.adoptedPets.length}
        activePet={activePet}
        soundMuted={gameState.soundEnabled === false}
        musicMuted={gameState.musicEnabled === false}
        onNavigate={(loc) => {
          if (loc === 'driving') {
            handleStartDriving();
          } else {
            setGameState(prev => ({ ...prev, currentLocation: loc }));
          }
        }}
        onToggleSound={() => {
          soundManager.isMuted = !soundManager.isMuted;
          setGameState(prev => ({ ...prev, soundEnabled: !soundManager.isMuted }));
        }}
        onToggleMusic={() => {
          soundManager.isMusicMuted = !soundManager.isMusicMuted;
          if (soundManager.isMusicMuted) {
            soundManager.stopBGM();
          } else {
            soundManager.startBGM('main');
          }
          setGameState(prev => ({ ...prev, musicEnabled: !soundManager.isMusicMuted }));
        }}
        onOpenAlbum={() => setShowPhotoAlbum(true)}
        onOpenInstallGuide={() => setShowInstallGuide(true)}
      />

      {/* Main Location Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {gameState.currentLocation === 'shelter' && (
          <AnimalShelter
            shelterPets={gameState.shelterPets}
            coins={gameState.coins}
            inventory={gameState.inventory}
            onAdoptPet={handleAdoptPet}
            onFeedPet={handleFeedPet}
            onGroomPet={handleGroomPet}
            onDriveHomeWithPet={(pet) => {
              setGameState(prev => ({ ...prev, activePetId: pet.id }));
              handleStartDriving('house');
            }}
          />
        )}

        {gameState.currentLocation === 'driving' && (
          <DrivingGame
            ferrari={gameState.ferrari}
            passengerPet={activePet}
            targetDestination={drivingTarget}
            onArriveDestination={handleArriveDestination}
            onCancelDrive={() => setGameState(prev => ({ ...prev, currentLocation: 'house' }))}
          />
        )}

        {gameState.currentLocation === 'house' && (
          <PetHouse
            adoptedPets={gameState.adoptedPets}
            activePetId={gameState.activePetId}
            coins={gameState.coins}
            inventory={gameState.inventory}
            currentRoom={gameState.currentRoom}
            onChangeRoom={(room) => setGameState(prev => ({ ...prev, currentRoom: room }))}
            onSelectActivePet={(petId) => setGameState(prev => ({ ...prev, activePetId: petId }))}
            onFeedPet={handleFeedPet}
            onEquipAccessory={handleEquipAccessory}
            onBuyItem={handleBuyItem}
            onOpenPhotoBooth={() => setShowPhotoBooth(true)}
            onStartDrive={() => handleStartDriving('shelter')}
          />
        )}

        {gameState.currentLocation === 'garage' && (
          <FerrariGarage
            ferrari={gameState.ferrari}
            coins={gameState.coins}
            passengerPet={activePet}
            onUpdateFerrari={handleUpdateFerrari}
            onStartDrive={() => handleStartDriving()}
          />
        )}

        {gameState.currentLocation === 'minigames' && (
          <MiniGameHub
            pets={gameState.adoptedPets}
            activePetId={gameState.activePetId}
            onRewardEarned={handleMiniGameReward}
            onBackToHouse={() => setGameState(prev => ({ ...prev, currentLocation: 'house' }))}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      {certificatePet && (
        <AdoptionCertificateModal
          pet={certificatePet}
          onClose={() => setCertificatePet(null)}
        />
      )}

      {showPhotoBooth && (
        <PhotoBoothModal
          pets={gameState.adoptedPets}
          activePetId={gameState.activePetId}
          currentRoom={gameState.currentRoom}
          onSavePhoto={handleSavePhoto}
          onClose={() => setShowPhotoBooth(false)}
        />
      )}

      {showPhotoAlbum && (
        <PhotoAlbumModal
          photos={gameState.photoAlbum}
          onClose={() => setShowPhotoAlbum(false)}
        />
      )}

      {showInstallGuide && (
        <InstallGuideModal
          onClose={() => setShowInstallGuide(false)}
        />
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-bold text-slate-500 border-t border-amber-200/50 mt-8">
        <p>🐾 Pet World: Ferrari Rescue & Dream House 🏎️ • Made for iPad & Web</p>
      </footer>
    </div>
  );
};

export default App;
