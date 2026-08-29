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
    id: 'food_barbie_cupcake',
    name: 'Barbie Pink Strawberry Cupcake',
    category: 'food',
    price: 24,
    icon: '🧁',
    description: 'Sparkling pink frosted treat with rainbow sprinkles that every pet adores!',
    effect: { hunger: 45, happiness: 40 }
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
    name: 'Barbie Bubble Sparkle Soap',
    category: 'grooming',
    price: 20,
    icon: '🧼',
    description: 'Creates warm pink bubbly suds that wash away dirt and give a glossy coat.',
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
    description: 'Shines a dancing red dot that pets chase across the Barbie Dreamhouse!',
    effect: { happiness: 40, energy: -15 }
  },
  {
    id: 'toy_tennis_ball',
    name: 'Neon Bounce Tennis Ball',
    category: 'toy',
    price: 20,
    icon: '🎾',
    description: 'Throw it across the room for an epic game of fetch!',
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

  // BARBIE DREAMHOUSE FURNITURE
  {
    id: 'furn_barbie_heart_sofa',
    name: 'Plush Barbie Pink Heart Sofa',
    category: 'furniture',
    price: 85,
    icon: '🛋️',
    description: 'Signature hot pink velvet sofa where all your pets can cuddle together.',
    furnitureRoom: 'glam_living_room',
    furniturePlacement: { x: 30, y: 55, width: 40, height: 25 }
  },
  {
    id: 'furn_barbie_chandelier',
    name: 'Golden Crystal Palace Chandelier',
    category: 'furniture',
    price: 110,
    icon: '💎',
    description: 'Dazzling chandelier that casts sparkling light over the living room.',
    furnitureRoom: 'glam_living_room',
    furniturePlacement: { x: 50, y: 15, width: 25, height: 25 }
  },
  {
    id: 'furn_spiral_slide_pool',
    name: 'Pink Spiral Pool Water Slide',
    category: 'furniture',
    price: 150,
    icon: '🎢',
    description: 'Giant spiral slide descending right into the turquoise swimming pool!',
    furnitureRoom: 'pool_patio_slide',
    furniturePlacement: { x: 20, y: 40, width: 35, height: 50 }
  },
  {
    id: 'furn_flamingo_float',
    name: 'Giant Pink Flamingo Pool Float',
    category: 'furniture',
    price: 90,
    icon: '🦩',
    description: 'Inflatable luxury flamingo lounger for sunbathing pets.',
    furnitureRoom: 'pool_patio_slide',
    furniturePlacement: { x: 65, y: 65, width: 30, height: 30 }
  },
  {
    id: 'furn_hollywood_vanity',
    name: 'Hollywood Lighted Glam Vanity',
    category: 'furniture',
    price: 130,
    icon: '🪞',
    description: 'Lighted vanity mirror with beauty brushes and pet perfume mist.',
    furnitureRoom: 'glam_salon_vanity',
    furniturePlacement: { x: 50, y: 45, width: 40, height: 35 }
  },
  {
    id: 'furn_gold_jacuzzi',
    name: 'Golden Hydro Bubble Jacuzzi',
    category: 'furniture',
    price: 140,
    icon: '🛁',
    description: 'Heated bubble massage tub with fragrant rose petals.',
    furnitureRoom: 'glam_salon_vanity',
    furniturePlacement: { x: 20, y: 60, width: 35, height: 30 }
  },
  {
    id: 'furn_canopy_bed',
    name: 'Hot Pink Silk Canopy Bed',
    category: 'furniture',
    price: 95,
    icon: '🛏️',
    description: 'The softest memory foam bed in the universe with warm fleece blankets.',
    furnitureRoom: 'dream_bedroom',
    furniturePlacement: { x: 45, y: 55, width: 45, height: 35 }
  },
  {
    id: 'furn_disco_deck',
    name: 'Rooftop DJ Dance Stage & Disco Ball',
    category: 'furniture',
    price: 125,
    icon: '🪩',
    description: 'Spinning disco lights and DJ booth for pet dance parties under the stars!',
    furnitureRoom: 'rooftop_party_deck',
    furniturePlacement: { x: 50, y: 40, width: 40, height: 30 }
  }
];

export const PET_ACCESSORIES: PetAccessory[] = [
  // HATS & TIARAS
  { id: 'hat_crown', name: 'Barbie Sparkle Tiara Crown', type: 'hat', icon: '👑', color: '#ec4899', price: 60 },
  { id: 'hat_flower', name: 'Pink Rose Flower Crown', type: 'hat', icon: '🌸', color: '#f43f5e', price: 45 },
  { id: 'hat_party', name: 'Party Sparkle Hat', type: 'hat', icon: '🥳', color: '#ec4899', price: 40 },
  { id: 'hat_tophat', name: 'Fancy Gentleman Top Hat', type: 'hat', icon: '🎩', color: '#1e293b', price: 60 },
  { id: 'hat_chef', name: 'Master Chef Toque', type: 'hat', icon: '👨‍🍳', color: '#ffffff', price: 50 },
  { id: 'hat_goggles', name: 'Ferrari Pilot Aviator Goggles', type: 'hat', icon: '🥽', color: '#ff5500', price: 80 },
  { id: 'hat_detective', name: 'Sherlock Detective Cap', type: 'hat', icon: '🕵️', color: '#78350f', price: 55 },

  // GLASSES
  { id: 'glass_heart', name: 'Barbie Pink Heart Glasses', type: 'glasses', icon: '💖', color: '#ec4899', price: 45 },
  { id: 'glass_cool', name: 'VIP Aviator Shades', type: 'glasses', icon: '🕶️', color: '#0f172a', price: 50 },
  { id: 'glass_star', name: 'Star-Eye Glam Glasses', type: 'glasses', icon: '⭐', color: '#eab308', price: 55 },

  // NECK & OUTFITS
  { id: 'neck_bowtie', name: 'Barbie Magenta Satin Bowtie', type: 'neck', icon: '🎀', color: '#ec4899', price: 35 },
  { id: 'neck_bandana', name: 'Ferrari Racing Bandana', type: 'neck', icon: '🧣', color: '#ff5500', price: 40 },
  { id: 'neck_medal', name: 'Gold Champion Medal', type: 'neck', icon: '🥇', color: '#fbbf24', price: 90 },
  { id: 'outfit_cape', name: 'Super Pet Flying Cape', type: 'outfit', icon: '🦸', color: '#ec4899', price: 85 }
];

export const FERRARI_UPGRADES = {
  paints: [
    { id: '#ff5500', name: 'Sunset Racing Orange', price: 0, tag: 'Signature' },
    { id: '#ff2a85', name: 'Barbie Glam Hot Pink', price: 60, tag: 'Dreamhouse' },
    { id: '#ff2200', name: 'Ferrari Corsa Red', price: 60, tag: 'Classic' },
    { id: '#ffaa00', name: 'Gold Blaze Metallic', price: 80, tag: 'Prestige' },
    { id: '#00d2ff', name: 'Electric Miami Cyan', price: 90, tag: 'Special' },
    { id: '#d946ef', name: 'Neon Cyber Magenta', price: 100, tag: 'Hyper' }
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
    { id: 'pink', name: 'Barbie Glam Pink Glow', price: 50 },
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
