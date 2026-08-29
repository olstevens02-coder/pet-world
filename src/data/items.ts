import { Item, PetAccessory } from '../types/game';

export const SHOP_ITEMS: Item[] = [
  // FOOD ITEMS
  {
    id: 'food_bone',
    name: 'Crunchy Bone Treat',
    category: 'food',
    price: 15,
    icon: '🦴',
    description: 'Savory crispy bone for puppies. Boosts hunger and happiness!',
    effect: { hunger: 30, happiness: 20 },
    suitableFor: ['puppy']
  },
  {
    id: 'food_salmon',
    name: 'Fresh Salmon Flakes',
    category: 'food',
    price: 18,
    icon: '🐟',
    description: 'Tender wild-caught salmon snack for cats and kittens.',
    effect: { hunger: 35, happiness: 25 },
    suitableFor: ['cat', 'kitten']
  },
  {
    id: 'food_milk',
    name: 'Warm Kitten Milk',
    category: 'food',
    price: 12,
    icon: '🥛',
    description: 'Creamy wholesome formula packed with vitamins.',
    effect: { hunger: 25, happiness: 30, energy: 15 },
    suitableFor: ['kitten', 'cat']
  },
  {
    id: 'food_papaya',
    name: 'Sweet Papaya Bites',
    category: 'food',
    price: 16,
    icon: '🥭',
    description: 'Tropical sweet fruit cubes loved by parrots and geckos.',
    effect: { hunger: 28, happiness: 24 },
    suitableFor: ['parrot', 'gecko']
  },
  {
    id: 'food_cricket',
    name: 'Honey Drops & Fruit Flies',
    category: 'food',
    price: 14,
    icon: '🍯',
    description: 'Delicacy nectar drops for happy geckos.',
    effect: { hunger: 30, happiness: 20 },
    suitableFor: ['gecko']
  },
  {
    id: 'food_ferret_oil',
    name: 'Salmon Oil Drops',
    category: 'food',
    price: 20,
    icon: '🧪',
    description: 'Irresistible treat that makes ferret fur silky smooth!',
    effect: { hunger: 30, happiness: 35, cleanliness: 10 },
    suitableFor: ['ferret']
  },
  {
    id: 'food_bloodworm',
    name: 'Bloodworm Jelly Cubes',
    category: 'food',
    price: 18,
    icon: '🪱',
    description: 'Nutritious aquatic snack for smiling axolotls.',
    effect: { hunger: 35, happiness: 25 },
    suitableFor: ['axolotl']
  },
  {
    id: 'food_apple_puree',
    name: 'Golden Apple Puree',
    category: 'food',
    price: 15,
    icon: '🍎',
    description: 'Sweet apple puree that gets hedgehogs uncurled and smiling!',
    effect: { hunger: 30, happiness: 25 },
    suitableFor: ['hedgehog']
  },
  {
    id: 'food_snake_gel',
    name: 'Pastel Nutrient Gel Drops',
    category: 'food',
    price: 20,
    icon: '🧪',
    description: 'Special wholesome jelly drops formulated for gentle snakes.',
    effect: { hunger: 40, happiness: 20 },
    suitableFor: ['snake']
  },
  {
    id: 'food_sunflower',
    name: 'Giant Sunflower Seeds',
    category: 'food',
    price: 10,
    icon: '🌻',
    description: 'Huge crunchy seeds that hamsters pouch into their chubby cheeks!',
    effect: { hunger: 25, happiness: 25 },
    suitableFor: ['hamster']
  },
  {
    id: 'food_lettuce',
    name: 'Crisp Romaine Lettuce',
    category: 'food',
    price: 12,
    icon: '🥬',
    description: 'Fresh crunchy green leaf that triggers happy "WHEEK WHEEK" squeaks!',
    effect: { hunger: 30, happiness: 30 },
    suitableFor: ['guinea_pig']
  },
  {
    id: 'food_mojo_steak',
    name: 'Prime Wagyu Pet Steak Bites',
    category: 'food',
    price: 35,
    icon: '🥩',
    description: 'Delicious flame-grilled steak bites fit for a Mojo Dojo champion!',
    effect: { hunger: 60, happiness: 45, energy: 25 }
  },
  {
    id: 'food_universal_feast',
    name: 'Grand Rainbow Pet Buffet',
    category: 'food',
    price: 45,
    icon: '🍲',
    description: 'A luxurious master feast that any animal will adore! Restores all hunger.',
    effect: { hunger: 70, happiness: 50, energy: 30 }
  },

  // GROOMING & SPA SUPPLIES
  {
    id: 'groom_bubble_soap',
    name: 'Cedar & Amber Pet Shampoo',
    category: 'grooming',
    price: 20,
    icon: '🧼',
    description: 'Creates warm rich lather that cleans coats with a fresh woody scent.',
    effect: { cleanliness: 45, happiness: 15 }
  },
  {
    id: 'groom_soft_brush',
    name: 'Silky Velvet Pet Brush',
    category: 'grooming',
    price: 25,
    icon: '🪮',
    description: 'Gentle detangling brush that induces deep purrs and tail wags.',
    effect: { cleanliness: 25, happiness: 35 }
  },
  {
    id: 'groom_warm_dryer',
    name: 'Cozy Fluff Warm Air Dryer',
    category: 'grooming',
    price: 30,
    icon: '💨',
    description: 'Dries fur softly into ultra-fluffy perfection!',
    effect: { cleanliness: 30, happiness: 25 }
  },
  {
    id: 'groom_vet_tonic',
    name: 'Rainbow Vitamin Miracle Tonic',
    category: 'medicine',
    price: 35,
    icon: '💊',
    description: 'Instantly cures tummy aches, snuffles, and brings health to 100%!',
    effect: { health: 60, happiness: 20, energy: 30 }
  },

  // TOYS & INTERACTIVE ITEMS
  {
    id: 'toy_laser',
    name: 'Cosmic Laser Pointer',
    category: 'toy',
    price: 25,
    icon: '🔴',
    description: 'Shines a dancing red dot that pets chase across the Mojo Dojo house!',
    effect: { happiness: 40, energy: -15 }
  },
  {
    id: 'toy_tennis_ball',
    name: 'Neon Bounce Tennis Ball',
    category: 'toy',
    price: 20,
    icon: '🎾',
    description: 'Throw it across the hardwood floor for an epic game of fetch!',
    effect: { happiness: 35, energy: -10 }
  },
  {
    id: 'toy_bubble_wand',
    name: 'Magic Rainbow Bubble Blower',
    category: 'toy',
    price: 22,
    icon: '🫧',
    description: 'Blows floating non-toxic bubbles that pets love to pop with their noses!',
    effect: { happiness: 40 }
  },

  // KEN MOJO DOJO CASA HOUSE FURNITURE
  {
    id: 'furn_leather_chesterfield',
    name: 'Cognac Leather Chesterfield Sectional',
    category: 'furniture',
    price: 90,
    icon: '🛋️',
    description: 'Deep button-tufted cognac leather couch where all pets love to nap.',
    furnitureRoom: 'mojo_living_lounge',
    furniturePlacement: { x: 30, y: 55, width: 40, height: 25 }
  },
  {
    id: 'furn_stallion_statue',
    name: 'Golden Stallion Horse Sculpture',
    category: 'furniture',
    price: 120,
    icon: '🐎',
    description: 'Majestic horse sculpture that gives maximum Mojo Dojo mojo energy!',
    furnitureRoom: 'mojo_living_lounge',
    furniturePlacement: { x: 75, y: 35, width: 25, height: 35 }
  },
  {
    id: 'furn_infinity_pool_lounge',
    name: 'Teak Sun Lounger & Infinity Pool',
    category: 'furniture',
    price: 140,
    icon: '🏊',
    description: 'Heated infinity pool with teak wood sun deck overlooking the mountains.',
    furnitureRoom: 'deck_infinity_pool',
    furniturePlacement: { x: 50, y: 45, width: 45, height: 35 }
  },
  {
    id: 'furn_bbq_smoker',
    name: 'Master Smoker BBQ Grill',
    category: 'furniture',
    price: 95,
    icon: '🥩',
    description: 'Flame smoker grill for cooking delicious pet wagyu steaks.',
    furnitureRoom: 'deck_infinity_pool',
    furniturePlacement: { x: 20, y: 60, width: 30, height: 30 }
  },
  {
    id: 'furn_foosball_table',
    name: 'Tournament Foosball Table',
    category: 'furniture',
    price: 85,
    icon: '⚽',
    description: 'Classic game table for friendly pet tournaments.',
    furnitureRoom: 'garage_showroom_lounge',
    furniturePlacement: { x: 70, y: 50, width: 35, height: 30 }
  },
  {
    id: 'furn_mini_fridge',
    name: 'Glass Door Mini-Fridge Bar',
    category: 'furniture',
    price: 75,
    icon: '🧃',
    description: 'Stocked with fresh cold beverages and pet treat pouches.',
    furnitureRoom: 'garage_showroom_lounge',
    furniturePlacement: { x: 20, y: 45, width: 25, height: 35 }
  },
  {
    id: 'furn_king_leather_bed',
    name: 'King Leather Headboard Bed',
    category: 'furniture',
    price: 110,
    icon: '🛏️',
    description: 'Spacious memory foam bed with rustic leather headboard and warm throws.',
    furnitureRoom: 'master_suite_bedroom',
    furniturePlacement: { x: 45, y: 55, width: 45, height: 35 }
  },
  {
    id: 'furn_granite_kitchen_island',
    name: 'Black Granite Chef Island',
    category: 'furniture',
    price: 115,
    icon: '🍽️',
    description: 'Luxury stone kitchen island with automatic water fountains and feeder bowls.',
    furnitureRoom: 'gourmet_kitchen_bar',
    furniturePlacement: { x: 50, y: 45, width: 40, height: 35 }
  }
];

export const PET_ACCESSORIES: PetAccessory[] = [
  // HATS
  { id: 'hat_goggles', name: 'Ferrari Pilot Aviator Goggles', type: 'hat', icon: '🥽', color: '#ff5500', price: 80 },
  { id: 'hat_detective', name: 'Sherlock Detective Cap', type: 'hat', icon: '🕵️', color: '#78350f', price: 55 },
  { id: 'hat_tophat', name: 'Fancy Gentleman Top Hat', type: 'hat', icon: '🎩', color: '#1e293b', price: 60 },
  { id: 'hat_crown', name: 'Golden Royal Crown', type: 'hat', icon: '👑', color: '#eab308', price: 100 },
  { id: 'hat_party', name: 'Party Sparkle Hat', type: 'hat', icon: '🥳', color: '#ec4899', price: 40 },
  { id: 'hat_chef', name: 'Master Chef Toque', type: 'hat', icon: '👨‍🍳', color: '#ffffff', price: 50 },
  { id: 'hat_flower', name: 'Rainbow Flower Crown', type: 'hat', icon: '🌸', color: '#f43f5e', price: 45 },

  // GLASSES
  { id: 'glass_cool', name: 'VIP Aviator Shades', type: 'glasses', icon: '🕶️', color: '#0f172a', price: 50 },
  { id: 'glass_star', name: 'Star-Eye Glam Glasses', type: 'glasses', icon: '⭐', color: '#eab308', price: 55 },
  { id: 'glass_heart', name: 'Ruby Heart Glasses', type: 'glasses', icon: '💖', color: '#f43f5e', price: 45 },

  // NECK & OUTFITS
  { id: 'neck_bandana', name: 'Ferrari Racing Bandana', type: 'neck', icon: '🧣', color: '#ff5500', price: 40 },
  { id: 'neck_medal', name: 'Gold Champion Medal', type: 'neck', icon: '🥇', color: '#fbbf24', price: 90 },
  { id: 'neck_bowtie', name: 'Scarlet Satin Bowtie', type: 'neck', icon: '🎀', color: '#ef4444', price: 35 },
  { id: 'outfit_cape', name: 'Super Pet Flying Cape', type: 'outfit', icon: '🦸', color: '#3b82f6', price: 85 }
];

export const FERRARI_UPGRADES = {
  paints: [
    { id: '#ff5500', name: 'Sunset Racing Orange', price: 0, tag: 'Signature' },
    { id: '#ff2200', name: 'Ferrari Corsa Red', price: 60, tag: 'Classic' },
    { id: '#ffaa00', name: 'Gold Blaze Metallic', price: 80, tag: 'Prestige' },
    { id: '#00d2ff', name: 'Electric Miami Cyan', price: 90, tag: 'Special' },
    { id: '#d946ef', name: 'Neon Cyber Magenta', price: 100, tag: 'Hyper' },
    { id: '#10b981', name: 'Emerald Speed Mint', price: 75, tag: 'Sleek' }
  ],
  spoilers: [
    { id: 'none', name: 'Clean Stock Wing', price: 0 },
    { id: 'sport', name: 'Sport Carbon Wing', price: 70 },
    { id: 'gt_wing', name: 'GT Pro High Aero Wing', price: 120 },
    { id: 'rocket', name: 'Rocket Twin Boost Wing', price: 180 }
  ],
  rims: [
    { id: 'standard', name: 'Alloy 5-Spoke', price: 0 },
    { id: 'golden_star', name: '24K Gold Star Rims', price: 90 },
    { id: 'chrome_spin', name: 'Hyper Chrome Turbines', price: 110 },
    { id: 'neon_glow', name: 'RGB Glow Ring Rims', price: 140 }
  ],
  underglow: [
    { id: 'none', name: 'No Underglow', price: 0 },
    { id: 'orange', name: 'Inferno Orange Glow', price: 50 },
    { id: 'cyan', name: 'Electric Cyan Glow', price: 60 },
    { id: 'purple', name: 'Night Cyber Purple', price: 65 },
    { id: 'rainbow', name: 'Hyper Rainbow Pulse', price: 120 }
  ],
  horns: [
    { id: 'classic', name: 'Ferrari Dual Tone', price: 0 },
    { id: 'fanfare', name: 'Italian Victory Fanfare', price: 40 },
    { id: 'melody', name: 'Sweet Pet Harmony Horn', price: 50 },
    { id: 'turbo_honk', name: 'Hyper Turbo Blast', price: 75 }
  ]
};
