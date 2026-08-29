export type AnimalType =
  | 'puppy'
  | 'cat'
  | 'kitten'
  | 'parrot'
  | 'gecko'
  | 'ferret'
  | 'axolotl'
  | 'hedgehog'
  | 'snake'
  | 'hamster'
  | 'guinea_pig';

export type LocationType = 'shelter' | 'driving' | 'house' | 'garage' | 'minigames';

export type HouseRoomType =
  | 'glam_living_room'
  | 'pool_patio_slide'
  | 'glam_salon_vanity'
  | 'dream_bedroom'
  | 'rooftop_party_deck';

export interface PetNeeds {
  hunger: number;     // 0 to 100
  happiness: number;  // 0 to 100
  energy: number;     // 0 to 100
  cleanliness: number;// 0 to 100
  health: number;     // 0 to 100
}

export interface PetAccessory {
  id: string;
  name: string;
  type: 'hat' | 'glasses' | 'outfit' | 'neck';
  icon: string;
  color?: string;
  price: number;
}

export interface Pet {
  id: string;
  species: AnimalType;
  name: string;
  breedVariant: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    eyeColor: string;
    bellyColor?: string;
    gradientStart?: string;
    gradientEnd?: string;
  };
  gender: 'boy' | 'girl' | 'friend';
  personality: string;
  favoriteFood: string;
  favoriteActivity: string;
  bio: string;
  adoptionDate?: string;
  isAdopted: boolean;
  needs: PetNeeds;
  level: number;
  xp: number;
  accessories: {
    hat?: string;
    glasses?: string;
    outfit?: string;
    neck?: string;
  };
  tricks: string[];
}

export interface FerrariCustomization {
  paintColor: string;
  paintName: string;
  spoiler: 'none' | 'sport' | 'gt_wing' | 'rocket';
  rims: 'standard' | 'golden_star' | 'chrome_spin' | 'neon_glow';
  underglow: 'none' | 'orange' | 'cyan' | 'purple' | 'rainbow' | 'pink';
  hornSound: 'classic' | 'fanfare' | 'melody' | 'turbo_honk';
  stripe: 'none' | 'white' | 'black' | 'dual_racing' | 'pink_glam';
  topSpeedLevel: number;
  boostLevel: number;
}

export interface Item {
  id: string;
  name: string;
  category: 'food' | 'toy' | 'grooming' | 'medicine' | 'furniture' | 'accessory' | 'car_upgrade';
  price: number;
  icon: string;
  description: string;
  effect?: {
    hunger?: number;
    happiness?: number;
    cleanliness?: number;
    health?: number;
    energy?: number;
  };
  suitableFor?: AnimalType[];
  furnitureRoom?: HouseRoomType;
  furniturePlacement?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PlacedFurniture {
  instanceId: string;
  itemId: string;
  room: HouseRoomType;
  x: number;
  y: number;
  rotation?: number;
}

export interface PhotoMemory {
  id: string;
  date: string;
  title: string;
  petName: string;
  species: AnimalType;
  roomOrLocation: string;
  stickers: string[];
  filter: string;
}

export interface GameState {
  coins: number;
  stars: number;
  currentLocation: LocationType;
  activePetId: string | null;
  shelterPets: Pet[];
  adoptedPets: Pet[];
  ferrari: FerrariCustomization;
  inventory: { [itemId: string]: number };
  placedFurniture: PlacedFurniture[];
  currentRoom: HouseRoomType;
  unlockedRooms: HouseRoomType[];
  photoAlbum: PhotoMemory[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  highScoreAgility: number;
  highScoreTreatCatcher: number;
  stats: {
    totalTripsDriven: number;
    petsAdopted: number;
    treatsFed: number;
    bathsGiven: number;
  };
}
