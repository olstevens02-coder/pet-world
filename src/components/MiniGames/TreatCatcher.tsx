import React, { useState, useEffect, useRef } from 'react';
import { Pet } from '../../types/game';
import { PetAvatar } from '../PetAvatar';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Trophy, RefreshCw } from 'lucide-react';

interface TreatCatcherProps {
  pet: Pet;
  onGameOver: (score: number, coinsEarned: number) => void;
  onExit: () => void;
}

interface FallingTreat {
  id: number;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  icon: string;
  points: number;
  speed: number;
}

export const TreatCatcher: React.FC<TreatCatcherProps> = ({ pet, onGameOver, onExit }) => {
  const [basketX, setBasketX] = useState(50);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [fallingTreats, setFallingTreats] = useState<FallingTreat[]>([]);

  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const treatIcons = ['🦴', '🐟', '🥭', '🌻', '🍎', '🥬', '⭐', '🍓'];

  useEffect(() => {
    soundManager.startBGM('driving');

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Timer Countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          soundManager.playFanfare();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(timer);
      soundManager.stopBGM();
    };
  }, []);

  // Main game loop
  useEffect(() => {
    if (isGameOver) return;

    const gameLoop = setInterval(() => {
      // Move basket
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a'] || keysPressed.current['A']) {
        setBasketX(x => Math.max(10, x - 2.5));
      }
      if (keysPressed.current['ArrowRight'] || keysPressed.current['d'] || keysPressed.current['D']) {
        setBasketX(x => Math.min(90, x + 2.5));
      }

      // Spawn treats
      if (Math.random() < 0.08) {
        const icon = treatIcons[Math.floor(Math.random() * treatIcons.length)];
        const isStar = icon === '⭐';
        setFallingTreats(prev => [
          ...prev,
          {
            id: Math.random(),
            x: 10 + Math.random() * 80,
            y: 0,
            icon,
            points: isStar ? 30 : 10,
            speed: 1.2 + Math.random() * 1.5
          }
        ]);
      }

      // Update falling treats
      setFallingTreats(prev =>
        prev
          .map(t => ({ ...t, y: t.y + t.speed }))
          .filter(t => {
            // Collision with Pet basket at bottom (y around 80-90)
            if (t.y >= 78 && t.y <= 88 && Math.abs(t.x - basketX) < 12) {
              soundManager.playMunch();
              setScore(s => s + t.points);
              return false;
            }
            // Remove if fell past screen
            return t.y < 100;
          })
      );
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [basketX, isGameOver]);

  const handleFinishGame = () => {
    const coinsEarned = Math.round(score * 0.8);
    onGameOver(score, coinsEarned);
  };

  return (
    <div className="relative w-full h-[540px] bg-gradient-to-b from-sky-300 via-amber-100 to-emerald-200 rounded-3xl border-4 border-amber-400/50 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
      {/* Top HUD */}
      <div className="relative z-20 bg-white/80 backdrop-blur-md px-6 py-3 border-b border-amber-300/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center border border-amber-300">
            <PetAvatar pet={pet} size="xs" interactive={false} />
          </div>
          <div>
            <h3 className="font-black text-sm text-slate-800">Treat Catcher</h3>
            <p className="text-[11px] text-orange-600 font-bold">Catch the falling treats for {pet.name}!</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] uppercase font-black text-slate-400 block">Time</span>
            <span className={`text-xl font-black ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>
              {timeLeft}s
            </span>
          </div>

          <div className="text-center bg-amber-500/20 px-4 py-1 rounded-2xl border border-amber-400/40">
            <span className="text-[10px] uppercase font-black text-amber-800 block">Score</span>
            <span className="text-xl font-black text-amber-700">{score}</span>
          </div>
        </div>
      </div>

      {/* Playfield */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Falling Treats */}
        {fallingTreats.map(t => (
          <div
            key={t.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-3xl filter drop-shadow-md animate-bounce-subtle pointer-events-none"
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
          >
            {t.icon}
          </div>
        ))}

        {/* Player Basket with Pet */}
        <div
          className="absolute bottom-6 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
          style={{ left: `${basketX}%` }}
        >
          {/* Catching Bowl */}
          <div className="w-24 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center -mb-2 z-20">
            <span className="text-[10px] font-black text-white uppercase tracking-wider">Catch!</span>
          </div>
          <PetAvatar pet={pet} size="md" interactive={false} expression="eating" />
        </div>
      </div>

      {/* iPad Touch Controls */}
      <div className="relative z-20 bg-white/90 backdrop-blur-md px-6 py-3 border-t border-amber-300/40 flex items-center justify-between">
        <button
          onPointerDown={() => { keysPressed.current['ArrowLeft'] = true; }}
          onPointerUp={() => { keysPressed.current['ArrowLeft'] = false; }}
          className="w-16 h-12 bg-slate-800 active:bg-orange-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg border border-slate-700"
        >
          <ArrowLeft size={24} />
        </button>

        <span className="text-xs font-black text-slate-500">Tap arrows or use A / D keys</span>

        <button
          onPointerDown={() => { keysPressed.current['ArrowRight'] = true; }}
          onPointerUp={() => { keysPressed.current['ArrowRight'] = false; }}
          className="w-16 h-12 bg-slate-800 active:bg-orange-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg border border-slate-700"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-amber-400 text-center animate-scaleUp">
            <span className="text-5xl mb-2 block">🎉</span>
            <h2 className="text-3xl font-black text-slate-800 mb-1">Time's Up!</h2>
            <p className="text-sm font-bold text-slate-500 mb-4">{pet.name} caught a ton of treats!</p>

            <div className="bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-200 space-y-1">
              <div className="flex justify-between font-bold text-sm">
                <span>Final Score:</span>
                <span className="text-amber-700 font-black">{score} pts</span>
              </div>
              <div className="flex justify-between font-bold text-sm">
                <span>Coins Won:</span>
                <span className="text-emerald-600 font-black">+{Math.round(score * 0.8)} 🪙</span>
              </div>
            </div>

            <button
              onClick={handleFinishGame}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-base shadow-xl active:scale-95"
            >
              Collect Rewards ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
