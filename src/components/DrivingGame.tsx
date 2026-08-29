import React, { useState, useEffect, useRef } from 'react';
import { FerrariCustomization, Pet, LocationType } from '../types/game';
import { FerrariCar } from './FerrariCar';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Zap, Volume2, Sparkles, Trophy, Home, Heart, ShieldCheck } from 'lucide-react';

interface DrivingGameProps {
  ferrari: FerrariCustomization;
  passengerPet: Pet | null;
  targetDestination: 'shelter' | 'house';
  onArriveDestination: (destination: 'shelter' | 'house', earnedCoins: number, collectedTreats: string[]) => void;
  onCancelDrive: () => void;
}

interface RoadItem {
  id: number;
  type: 'coin' | 'star' | 'treat' | 'boost_pad' | 'ramp' | 'crossing';
  x: number; // 0 to 100% width of road
  y: number; // distance down the road
  name?: string;
  icon: string;
  collected?: boolean;
}

export const DrivingGame: React.FC<DrivingGameProps> = ({
  ferrari,
  passengerPet,
  targetDestination,
  onArriveDestination,
  onCancelDrive
}) => {
  // Game Driving State
  const [carX, setCarX] = useState(50); // percentage 20% to 80%
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [nitroFuel, setNitroFuel] = useState(100);
  const [isBoosting, setIsBoosting] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [treatsCollected, setTreatsCollected] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('sunset');
  const [isJumping, setIsJumping] = useState(false);
  const [tripCompleted, setTripCompleted] = useState(false);

  const totalTripLength = 2200; // units
  const maxSpeed = 12 + ferrari.topSpeedLevel * 3;
  const boostSpeed = 22 + ferrari.boostLevel * 4;

  // Road Items Generator
  const [roadItems, setRoadItems] = useState<RoadItem[]>(() => {
    const items: RoadItem[] = [];
    const treatPool = [
      { name: 'Crunchy Bone Treat', icon: '🦴' },
      { name: 'Fresh Salmon Flakes', icon: '🐟' },
      { name: 'Sweet Papaya Bites', icon: '🥭' },
      { name: 'Crisp Romaine Lettuce', icon: '🥬' },
      { name: 'Giant Sunflower Seeds', icon: '🌻' },
      { name: 'Golden Apple Puree', icon: '🍎' }
    ];

    for (let y = 300; y < totalTripLength - 200; y += 120 + Math.random() * 80) {
      const laneX = 25 + Math.random() * 50;
      const rand = Math.random();

      if (rand < 0.4) {
        items.push({ id: Math.random(), type: 'coin', x: laneX, y, icon: '🪙' });
      } else if (rand < 0.6) {
        items.push({ id: Math.random(), type: 'star', x: laneX, y, icon: '⭐' });
      } else if (rand < 0.85) {
        const treat = treatPool[Math.floor(Math.random() * treatPool.length)];
        items.push({ id: Math.random(), type: 'treat', x: laneX, y, name: treat.name, icon: treat.icon });
      } else if (rand < 0.95) {
        items.push({ id: Math.random(), type: 'boost_pad', x: laneX, y, icon: '⚡' });
      } else {
        items.push({ id: Math.random(), type: 'ramp', x: laneX, y, icon: '🚩' });
      }
    }
    return items;
  });

  // Active Key States for Smooth Controls
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    soundManager.startBGM('driving');

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      if (e.key === 'h' || e.key === 'H') {
        soundManager.playHorn(ferrari.hornSound);
      }
      if (e.code === 'Space' && nitroFuel > 10) {
        activateNitro();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
      if (e.code === 'Space') {
        setIsBoosting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      soundManager.stopBGM();
    };
  }, [ferrari.hornSound, nitroFuel]);

  const activateNitro = () => {
    if (nitroFuel > 10 && !isBoosting) {
      setIsBoosting(true);
      soundManager.playNitroBoost();
    }
  };

  // Main Game Loop (60 FPS)
  useEffect(() => {
    if (tripCompleted) return;

    const gameLoop = setInterval(() => {
      // Input processing
      const keys = keysPressed.current;
      let targetSpeed = isBoosting ? boostSpeed : 10;

      if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        targetSpeed = isBoosting ? boostSpeed : maxSpeed;
      } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        targetSpeed = 4;
      }

      // Smooth acceleration
      setSpeed(prev => {
        const nextSpeed = prev + (targetSpeed - prev) * 0.15;
        return nextSpeed;
      });

      // Steering
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        setCarX(prev => Math.max(18, prev - 1.8));
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        setCarX(prev => Math.min(82, prev + 1.8));
      }

      // Nitro fuel depletion / regeneration
      if (isBoosting) {
        setNitroFuel(prev => {
          if (prev <= 5) {
            setIsBoosting(false);
            return 0;
          }
          return prev - 1.2;
        });
      } else {
        setNitroFuel(prev => Math.min(100, prev + 0.25));
      }

      // Advance distance
      setDistance(prev => {
        const nextDist = prev + speed;

        // Check road item collisions
        setRoadItems(items =>
          items.map(item => {
            if (!item.collected && Math.abs(item.y - nextDist) < 35 && Math.abs(item.x - carX) < 14) {
              // Collected!
              if (item.type === 'coin') {
                soundManager.playCoin();
                setCoinsEarned(c => c + 5);
              } else if (item.type === 'star') {
                soundManager.playHeart();
                setCoinsEarned(c => c + 15);
              } else if (item.type === 'treat' && item.name) {
                soundManager.playPop();
                setTreatsCollected(t => [...t, item.name!]);
              } else if (item.type === 'boost_pad') {
                soundManager.playNitroBoost();
                setIsBoosting(true);
                setTimeout(() => setIsBoosting(false), 1200);
              } else if (item.type === 'ramp') {
                soundManager.playFanfare();
                setIsJumping(true);
                setTimeout(() => setIsJumping(false), 800);
              }
              return { ...item, collected: true };
            }
            return item;
          })
        );

        // Check if destination reached!
        if (nextDist >= totalTripLength) {
          setTripCompleted(true);
          soundManager.playFanfare();
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 }
          });
          return totalTripLength;
        }

        return nextDist;
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [speed, isBoosting, carX, tripCompleted, boostSpeed, maxSpeed]);

  const originName = targetDestination === 'house' ? '🐾 Animal Shelter' : '🏡 Dream Pet House';
  const destName = targetDestination === 'house' ? '🏡 Dream Pet House' : '🐾 Animal Shelter';
  const progressPercent = Math.min(100, Math.round((distance / totalTripLength) * 100));

  return (
    <div className="relative w-full h-[88vh] min-h-[580px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col select-none border-4 border-amber-400/40">
      {/* Top HUD Bar */}
      <div className="absolute top-0 inset-x-0 z-30 bg-slate-900/80 backdrop-blur-md px-6 py-3 border-b border-amber-500/30 flex items-center justify-between">
        {/* Destination & Progress */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm md:text-base">
            <span>{originName}</span>
            <span className="text-orange-400">➔</span>
            <span>{destName}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-36 h-3.5 bg-slate-700 rounded-full overflow-hidden border border-amber-400/40">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-amber-200">{progressPercent}%</span>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 text-white font-bold text-sm">
          <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
            <span className="text-base">🪙</span>
            <span className="text-amber-300">+{coinsEarned}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-400/30">
            <span>🦴 Treats:</span>
            <span className="text-rose-300">{treatsCollected.length}</span>
          </div>

          {/* Passenger Status */}
          {passengerPet && (
            <div className="hidden md:flex items-center gap-2 bg-purple-900/60 px-3 py-1 rounded-full border border-purple-400/40">
              <span className="text-xs text-purple-200">Passenger:</span>
              <span className="text-xs text-amber-300 font-extrabold">{passengerPet.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Road Viewport */}
      <div className="relative flex-1 w-full overflow-hidden bg-emerald-800">
        {/* Scenic Road Scenery Layer */}
        {/* Road Surface */}
        <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-[85%] md:w-[65%] max-w-2xl bg-slate-800 border-x-8 border-amber-400 shadow-inner">
          {/* Animated Road Lane Striping */}
          <div
            className="absolute inset-0 w-full flex justify-around pointer-events-none opacity-80"
            style={{
              backgroundImage: 'repeating-linear-gradient(to bottom, #f8fafc 0px, #f8fafc 40px, transparent 40px, transparent 100px)',
              backgroundPosition: `0px ${distance * 2.5}px`
            }}
          />

          {/* Road Items (Coins, Treats, Boosters) */}
          {roadItems.map(item => {
            const relY = item.y - distance;
            // Only render if visible in screen viewport (0 to 600px from bottom)
            if (relY < -50 || relY > 700 || item.collected) return null;

            return (
              <div
                key={item.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform"
                style={{
                  left: `${item.x}%`,
                  bottom: `${relY}px`
                }}
              >
                {item.type === 'boost_pad' ? (
                  <div className="w-16 h-12 bg-gradient-to-t from-cyan-500 to-sky-300 rounded-lg flex items-center justify-center animate-pulse shadow-lg border-2 border-white">
                    <span className="text-2xl font-black text-white">⚡ BOOST</span>
                  </div>
                ) : item.type === 'ramp' ? (
                  <div className="w-20 h-10 bg-amber-500 rounded-t-lg border-2 border-white flex items-center justify-center font-black text-slate-900 text-xs shadow-xl">
                    🏁 JUMP 🏁
                  </div>
                ) : (
                  <div className="text-3xl filter drop-shadow-lg transform hover:scale-125 animate-bounce-subtle">
                    {item.icon}
                  </div>
                )}
              </div>
            );
          })}

          {/* The Player's Ferrari */}
          <div
            className={`absolute bottom-16 transform -translate-x-1/2 transition-all duration-75 z-20 ${
              isJumping ? 'scale-125 -translate-y-12 drop-shadow-2xl' : ''
            }`}
            style={{ left: `${carX}%` }}
          >
            <FerrariCar
              customization={ferrari}
              passengerPet={passengerPet}
              isBoosting={isBoosting}
              view="top"
              size="md"
            />
          </div>
        </div>

        {/* Roadside Trees & Cute Scenery */}
        <div className="absolute inset-y-0 left-4 w-16 pointer-events-none flex flex-col justify-around text-4xl opacity-90">
          <span>🌲</span>
          <span>🌳</span>
          <span>🌺</span>
          <span>🌲</span>
        </div>
        <div className="absolute inset-y-0 right-4 w-16 pointer-events-none flex flex-col justify-around text-4xl opacity-90">
          <span>🌳</span>
          <span>🌴</span>
          <span>🌸</span>
          <span>🌲</span>
        </div>
      </div>

      {/* Touch Screen Controls for iPad & Mobile */}
      <div className="relative z-30 bg-slate-900/90 backdrop-blur-md px-6 py-4 border-t border-amber-500/30 flex items-center justify-between">
        {/* Left / Right Steering Buttons */}
        <div className="flex items-center gap-3">
          <button
            onPointerDown={() => {
              keysPressed.current['ArrowLeft'] = true;
            }}
            onPointerUp={() => {
              keysPressed.current['ArrowLeft'] = false;
            }}
            className="w-16 h-16 bg-slate-800 active:bg-orange-500 border-2 border-amber-400/50 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-transform active:scale-90"
          >
            <ArrowLeft size={32} />
          </button>

          <button
            onPointerDown={() => {
              keysPressed.current['ArrowRight'] = true;
            }}
            onPointerUp={() => {
              keysPressed.current['ArrowRight'] = false;
            }}
            className="w-16 h-16 bg-slate-800 active:bg-orange-500 border-2 border-amber-400/50 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-transform active:scale-90"
          >
            <ArrowRight size={32} />
          </button>
        </div>

        {/* Center: Horn & Nitro Gauge */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={() => soundManager.playHorn(ferrari.hornSound)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full font-black text-white text-sm shadow-lg active:scale-95 flex items-center gap-2 border border-amber-300"
          >
            <span>📢 HONK HORN</span>
          </button>

          {/* Nitro Gauge */}
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-cyan-400 fill-cyan-400" />
            <div className="w-28 h-2.5 bg-slate-800 rounded-full border border-cyan-400/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100"
                style={{ width: `${nitroFuel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Gas & Nitro Boost */}
        <div className="flex items-center gap-3">
          <button
            onPointerDown={activateNitro}
            onPointerUp={() => setIsBoosting(false)}
            disabled={nitroFuel < 10}
            className={`w-16 h-16 rounded-2xl font-black text-white text-xs flex flex-col items-center justify-center shadow-lg border-2 transition-transform active:scale-90 ${
              nitroFuel >= 10
                ? 'bg-gradient-to-tr from-cyan-600 to-blue-500 border-cyan-300 animate-pulse cursor-pointer'
                : 'bg-slate-700 border-slate-600 opacity-40'
            }`}
          >
            <Zap size={22} className="fill-white" />
            <span>NITRO</span>
          </button>

          <button
            onPointerDown={() => {
              keysPressed.current['ArrowUp'] = true;
            }}
            onPointerUp={() => {
              keysPressed.current['ArrowUp'] = false;
            }}
            className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-green-500 border-2 border-emerald-300 rounded-2xl flex flex-col items-center justify-center text-white font-extrabold text-sm shadow-lg active:scale-90"
          >
            <span>GAS</span>
            <span className="text-xs">⚡</span>
          </button>
        </div>
      </div>

      {/* Destination Arrival Victory Overlay Modal */}
      {tripCompleted && (
        <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-gradient-to-b from-amber-500 to-orange-600 rounded-3xl p-8 max-w-md w-full border-4 border-amber-300 shadow-2xl text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/40 text-4xl shadow-inner">
              🏎️
            </div>

            <h2 className="text-3xl font-black mb-1 drop-shadow-md">
              Safe Arrival!
            </h2>
            <p className="text-amber-100 font-bold mb-6">
              You pulled up to {destName} in style!
            </p>

            <div className="bg-slate-900/40 rounded-2xl p-4 mb-6 text-left space-y-2 border border-white/20">
              <div className="flex justify-between items-center font-bold">
                <span>🪙 Road Coins Earned:</span>
                <span className="text-amber-300 text-lg">+{coinsEarned}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>🦴 Pet Treats Gathered:</span>
                <span className="text-rose-300 text-lg">{treatsCollected.length}</span>
              </div>
              {passengerPet && (
                <div className="flex justify-between items-center font-bold">
                  <span>💖 {passengerPet.name}'s Joy:</span>
                  <span className="text-emerald-300 text-lg">+30 Happiness!</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onArriveDestination(targetDestination, coinsEarned, treatsCollected)}
              className="w-full py-4 bg-white text-orange-600 rounded-2xl font-black text-lg hover:bg-amber-100 active:scale-95 shadow-xl transition-transform"
            >
              Enter {destName} ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
