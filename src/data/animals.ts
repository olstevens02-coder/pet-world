import { Pet, AnimalType } from '../types/game';

export interface SpeciesInfo {
  type: AnimalType;
  displayName: string;
  emoji: string;
  tagline: string;
  defaultBio: string;
  favoriteFoods: string[];
  favoriteToys: string[];
  specialQuirks: string[];
}

export const SPECIES_CATALOG: Record<AnimalType, SpeciesInfo> = {
  puppy: {
    type: 'puppy',
    displayName: 'Puppy',
    emoji: '🐶',
    tagline: 'Boundless joyful energy & endless tail wags!',
    defaultBio: 'Always ready for a zoom around the yard and a ride in the Ferrari with the top down!',
    favoriteFoods: ['Crunchy Bone Treat', 'Golden Peanut Butter Biscuit', 'Beefy Nibbles'],
    favoriteToys: ['Squeaky Tennis Ball', 'Rope Tug', 'Chew Slipper'],
    specialQuirks: ['Tail wags at 200 RPM', 'Ears flap in the convertible Ferrari wind', 'Loves giving puppy kisses']
  },
  cat: {
    type: 'cat',
    displayName: 'Cat',
    emoji: '🐱',
    tagline: 'Graceful aristocrat of napping and acrobatics.',
    defaultBio: 'Purrs like an idling Ferrari engine and loves basking in sunny spots on comfy sofas.',
    favoriteFoods: ['Fresh Salmon Flakes', 'Tuna Temptations', 'Catnip Biscuit'],
    favoriteToys: ['Red Laser Pointer', 'Feather Wand', 'Cardboard Castle'],
    specialQuirks: ['Purrs rhythmically', 'Judges your parking skills lovingly', 'Master of high jumps']
  },
  kitten: {
    type: 'kitten',
    displayName: 'Kitten',
    emoji: '🐱',
    tagline: 'Tiny ball of fluff with enormous curiosity!',
    defaultBio: 'Can fit right in your pocket or the Ferrari cup holder! Loves pouncing on fuzzy slippers.',
    favoriteFoods: ['Warm Milk Treat', 'Kitten Crunchies', 'Mashed Chicken Treat'],
    favoriteToys: ['Yarn Ball', 'Mini Bell Ball', 'Mouse Puppet'],
    specialQuirks: ['Tiny squeaky mews', 'Falls asleep mid-play', 'Climbs on your shoulder']
  },
  parrot: {
    type: 'parrot',
    displayName: 'Parrot',
    emoji: '🦜',
    tagline: 'Vibrant conversationalist with dazzling feathers!',
    defaultBio: 'Loves singing along with the Ferrari radio and doing funny backflips on his perch.',
    favoriteFoods: ['Sweet Papaya Bites', 'Sunflower Seed Mix', 'Crisp Apple Slices'],
    favoriteToys: ['Hanging Bell', 'Wooden Chew Block', 'Mirror Perch'],
    specialQuirks: ['Mimics the Ferrari horn beep', 'Dances to the beat', 'Flaps wings happily']
  },
  gecko: {
    type: 'gecko',
    displayName: 'Gecko',
    emoji: '🦎',
    tagline: 'Smiling reptile buddy with sticky toe-pads!',
    defaultBio: 'A gentle little companion with an adorable permanent smile and cute spots!',
    favoriteFoods: ['Mango Puree Treat', 'Honey Drops', 'Crunchy Crickets'],
    favoriteToys: ['Smooth Basking Pebble', 'Mini Terrarium Cave', 'Vine Swing'],
    specialQuirks: ['Licks eyes instead of blinking', 'Climbs smooth glass windows', 'Always looks like it knows a funny secret']
  },
  ferret: {
    type: 'ferret',
    displayName: 'Ferret',
    emoji: '🦡',
    tagline: 'Curious noodle bandit of high-speed fun!',
    defaultBio: 'A bouncy, noodle-shaped rascal who loves sneaking through tunnels and hiding socks.',
    favoriteFoods: ['Salmon Oil Drops', 'Crunchy Ferret Bites', 'Egg Yolk Treat'],
    favoriteToys: ['Crinkle Tunnel', 'Ball Pit', 'Sock Thief Sack'],
    specialQuirks: ['Does the famous Ferret War Dance', 'Can bend like boiled spaghetti', 'Stashes toys under the sofa']
  },
  axolotl: {
    type: 'axolotl',
    displayName: 'Axolotl',
    emoji: '🦎',
    tagline: 'Magical underwater smiling water dragon!',
    defaultBio: 'An aquatic marvel with lovely feathery pink gills and a gentle heart. Floating bliss!',
    favoriteFoods: ['Bloodworm Jelly', 'Water Pellet Nibbles', 'Tiny Shrimp Treats'],
    favoriteToys: ['Floating Moss Ball', 'Ceramic Castle', 'Bubble Stream Ring'],
    specialQuirks: ['Permanent sweet smile', 'Floats weightlessly', 'Feathery gills pulse with joy']
  },
  hedgehog: {
    type: 'hedgehog',
    displayName: 'Hedgehog',
    emoji: '🦔',
    tagline: 'Spiky outside, pure sweetness on the inside!',
    defaultBio: 'A shy cutie who curls into a cute little pincushion until offered a yummy fruit snack.',
    favoriteFoods: ['Mealworm Crunchies', 'Mashed Sweet Potato', 'Apple Puree'],
    favoriteToys: ['Solid Running Wheel', 'Fleece Snuggle Pouch', 'Mini Ping Pong Ball'],
    specialQuirks: ['Curles into a soft spike-ball when sleepy', 'Tiny wet nose that snuffles', 'Loves running on wheels at midnight']
  },
  snake: {
    type: 'snake',
    displayName: 'Snake',
    emoji: '🐍',
    tagline: 'Gentle pastel rainbow slither buddy!',
    defaultBio: 'An affectionate and calm ball python that loves wrapping around your wrist like a warm bracelet.',
    favoriteFoods: ['Special Reptile Treat', 'Nutrient Gel', 'Warm Water Drops'],
    favoriteToys: ['Hollow Tree Branch', 'Heated Stone Hugger', 'Colorful Tunnel'],
    specialQuirks: ['Looks ultra stylish wearing miniature top hats', 'Gentle slithering loops', 'Soft flickering tongue']
  },
  hamster: {
    type: 'hamster',
    displayName: 'Hamster',
    emoji: '🐹',
    tagline: 'Champion cheek-poucher and speed runner!',
    defaultBio: 'Can fit entire carrots in cheek pouches and break land speed records on the hamster wheel!',
    favoriteFoods: ['Big Sunflower Seed', 'Dried Banana Chip', 'Walnut Kernel'],
    favoriteToys: ['Glowing Spinner Wheel', 'Clear Maze Tube', 'Wooden Chewy Carrot'],
    specialQuirks: ['Puffs cheeks with 10 snacks at once', 'Runs marathons while looking adorable', 'Sleeps like a fluffy dumpling']
  },
  guinea_pig: {
    type: 'guinea_pig',
    displayName: 'Guinea Pig',
    emoji: '🐹',
    tagline: 'Squeaking potato of wholesome love & lettuce!',
    defaultBio: 'Whistles enthusiastically whenever the fridge opens or the Ferrari rolls up with treats!',
    favoriteFoods: ['Crisp Romaine Lettuce', 'Sweet Bell Pepper', 'Timothy Hay Bunches'],
    favoriteToys: ['Hay Tunnel Castle', 'Chewable Willow Ball', 'Snuggle Tunnel'],
    specialQuirks: ['Loud joyous "WHEEK WHEEK!" whistles', 'Popcorn jumping when excited', 'Loves gentle chin scratches']
  }
};

export const INITIAL_SHELTER_PETS: Pet[] = [
  {
    id: 'shelter_puppy_1',
    species: 'puppy',
    name: 'Sparky',
    breedVariant: 'Golden Retriever Pup',
    colorScheme: {
      primary: '#f59e0b',
      secondary: '#fef3c7',
      accent: '#d97706',
      eyeColor: '#451a03',
      bellyColor: '#fffbeb'
    },
    gender: 'boy',
    personality: 'Playful & Adventurous',
    favoriteFood: 'Crunchy Bone Treat',
    favoriteActivity: 'Riding shotgun in the Ferrari',
    bio: 'Sparky was found barking happily at butterflies. He dreams of riding in an orange sports car!',
    isAdopted: false,
    needs: { hunger: 75, happiness: 85, energy: 90, cleanliness: 80, health: 95 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['Sit', 'Tail Wag', 'High Paw']
  },
  {
    id: 'shelter_cat_1',
    species: 'cat',
    name: 'Luna',
    breedVariant: 'Calico Sweetheart',
    colorScheme: {
      primary: '#ea580c',
      secondary: '#1e293b',
      accent: '#ffffff',
      eyeColor: '#10b981',
      bellyColor: '#ffffff'
    },
    gender: 'girl',
    personality: 'Gentle & Loving',
    favoriteFood: 'Fresh Salmon Flakes',
    favoriteActivity: 'Basking on the Ferrari leather seat',
    bio: 'Luna loves gentle head pats and will purr with the rhythm of the engine.',
    isAdopted: false,
    needs: { hunger: 80, happiness: 70, energy: 65, cleanliness: 90, health: 90 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['Purr Wave', 'Laser Pounce']
  },
  {
    id: 'shelter_kitten_1',
    species: 'kitten',
    name: 'Pip',
    breedVariant: 'Ginger Fluff Kitten',
    colorScheme: {
      primary: '#fb923c',
      secondary: '#fdba74',
      accent: '#fff7ed',
      eyeColor: '#0284c7',
      bellyColor: '#ffffff'
    },
    gender: 'boy',
    personality: 'Mischievous & Squeaky',
    favoriteFood: 'Warm Milk Treat',
    favoriteActivity: 'Climbing up hoodies',
    bio: 'Pip is small enough to fit inside a teacup! His tiny mew will melt anyone’s heart.',
    isAdopted: false,
    needs: { hunger: 70, happiness: 80, energy: 85, cleanliness: 75, health: 90 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['Squeak', 'Roll Over']
  },
  {
    id: 'shelter_parrot_1',
    species: 'parrot',
    name: 'Mango',
    breedVariant: 'Sun Conure & Macaw',
    colorScheme: {
      primary: '#ef4444',
      secondary: '#eab308',
      accent: '#3b82f6',
      eyeColor: '#1e293b',
      bellyColor: '#facc15'
    },
    gender: 'friend',
    personality: 'Singing Chatterbox',
    favoriteFood: 'Sweet Papaya Bites',
    favoriteActivity: 'Mimicking the Ferrari turbo sound',
    bio: 'Mango learned how to whistle the Ferrari ignition tune! Dazzling wings and great attitude.',
    isAdopted: false,
    needs: { hunger: 85, happiness: 90, energy: 95, cleanliness: 85, health: 100 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['Vocal Horn', 'Wing Wave', 'Backflip']
  },
  {
    id: 'shelter_gecko_1',
    species: 'gecko',
    name: 'Ziggy',
    breedVariant: 'Leopard Gecko',
    colorScheme: {
      primary: '#fde047',
      secondary: '#ca8a04',
      accent: '#78350f',
      eyeColor: '#0f172a',
      bellyColor: '#fefce8'
    },
    gender: 'boy',
    personality: 'Chilled & Friendly',
    favoriteFood: 'Mango Puree Treat',
    favoriteActivity: 'Sticking to the sunroof',
    bio: 'Ziggy has the sweetest smile on earth. He loves warming up on your hand during road trips.',
    isAdopted: false,
    needs: { hunger: 75, happiness: 80, energy: 70, cleanliness: 95, health: 95 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['Smile', 'Sticky Climb']
  },
  {
    id: 'shelter_ferret_1',
    species: 'ferret',
    name: 'Noodle',
    breedVariant: 'Masked Silver Mitt',
    colorScheme: {
      primary: '#94a3b8',
      secondary: '#475569',
      accent: '#f8fafc',
      eyeColor: '#334155',
      bellyColor: '#e2e8f0'
    },
    gender: 'girl',
    personality: 'Bouncy War Dancer',
    favoriteFood: 'Salmon Oil Drops',
    favoriteActivity: 'Sliding through tunnels',
    bio: 'Noodle is 90% flexibility and 10% goofy giggle! She loves hiding shiny keys in secret spots.',
    isAdopted: false,
    needs: { hunger: 80, happiness: 90, energy: 100, cleanliness: 80, health: 95 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['War Dance', 'Tube Slither']
  },
  {
    id: 'shelter_axolotl_1',
    species: 'axolotl',
    name: 'Bubbles',
    breedVariant: 'Pink Leucistic Dragon',
    colorScheme: {
      primary: '#f472b6',
      secondary: '#fb7185',
      accent: '#fda4af',
      eyeColor: '#0f172a',
      bellyColor: '#ffe4e6'
    },
    gender: 'friend',
    personality: 'Serene & Gentle',
    favoriteFood: 'Bloodworm Jelly',
    favoriteActivity: 'Floating in the Ferrari cup aquarium',
    bio: 'Bubbles is a rare smiling pink water fairy with feathery coral gills. Loves floating peacefully!',
    isAdopted: false,
    needs: { hunger: 85, happiness: 85, energy: 75, cleanliness: 100, health: 100 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['Bubble Ring', 'Floating Spin']
  },
  {
    id: 'shelter_hedgehog_1',
    species: 'hedgehog',
    name: 'Sprout',
    breedVariant: 'Pygmy Apricot',
    colorScheme: {
      primary: '#d97706',
      secondary: '#b45309',
      accent: '#fef3c7',
      eyeColor: '#0f172a',
      bellyColor: '#fed7aa'
    },
    gender: 'boy',
    personality: 'Shy Snuggler',
    favoriteFood: 'Apple Puree',
    favoriteActivity: 'Curling into a warm blanket',
    bio: 'Sprout is spiky on top but has the softest belly and warm little paws. A true snuggle bug!',
    isAdopted: false,
    needs: { hunger: 70, happiness: 75, energy: 80, cleanliness: 85, health: 90 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['Ball Roll', 'Nose Snuffle']
  },
  {
    id: 'shelter_snake_1',
    species: 'snake',
    name: 'Peaches',
    breedVariant: 'Pastel Rainbow Python',
    colorScheme: {
      primary: '#fdba74',
      secondary: '#fbbf24',
      accent: '#f472b6',
      eyeColor: '#0f172a',
      bellyColor: '#fff7ed'
    },
    gender: 'girl',
    personality: 'Calm & Fashionable',
    favoriteFood: 'Nutrient Gel',
    favoriteActivity: 'Wearing tiny hats & sunning',
    bio: 'Peaches is super friendly and loves coiling gently around your arm. Outstanding fashion sense!',
    isAdopted: false,
    needs: { hunger: 90, happiness: 85, energy: 60, cleanliness: 95, health: 95 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['Hat Pose', 'Loop Hug']
  },
  {
    id: 'shelter_hamster_1',
    species: 'hamster',
    name: 'Cheeks',
    breedVariant: 'Roborovski Dwarf',
    colorScheme: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#ffffff',
      eyeColor: '#0f172a',
      bellyColor: '#ffffff'
    },
    gender: 'boy',
    personality: 'Speedy Snack Hoarder',
    favoriteFood: 'Big Sunflower Seed',
    favoriteActivity: 'Speeding on the spinner wheel',
    bio: 'Cheeks once fit 12 sunflower seeds into his mouth at once! Loves high-speed adventures.',
    isAdopted: false,
    needs: { hunger: 65, happiness: 85, energy: 95, cleanliness: 85, health: 95 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['Cheek Stuff', 'Speed Wheel']
  },
  {
    id: 'shelter_guinea_pig_1',
    species: 'guinea_pig',
    name: 'Waffles',
    breedVariant: 'Abyssinian Fluff-Potato',
    colorScheme: {
      primary: '#b45309',
      secondary: '#f59e0b',
      accent: '#ffffff',
      eyeColor: '#0f172a',
      bellyColor: '#fef3c7'
    },
    gender: 'friend',
    personality: 'Whistle Singer & Popcorner',
    favoriteFood: 'Crisp Romaine Lettuce',
    favoriteActivity: 'Squeaking "Wheek Wheek" during rides',
    bio: 'Waffles will do popcorn hops whenever you say the word "Lettuce". The ultimate cozy buddy!',
    isAdopted: false,
    needs: { hunger: 70, happiness: 90, energy: 80, cleanliness: 85, health: 95 },
    level: 1,
    xp: 0,
    accessories: {},
    tricks: ['Wheek Chorus', 'Popcorn Jump']
  }
];
