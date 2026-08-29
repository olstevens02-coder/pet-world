import React, { useState, useEffect, useRef } from 'react';
import { Pet } from '../../types/game';
import { PetAvatar } from '../PetAvatar';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Zap, Trophy, Play } from 'lucide-react';

interface PetAgilityCourseProps {
  pet: Pet;
  onGameOver: (score: number, coinsEarned: number) => void;
  onExit: () => void;
}

interface Obstacle {
  id: number;
  x: number; // distance down track (0 to 100)
  type: 'hurdle' | 'ring' | 'tunnel';
  passed: boolean;
}

export const PetAgilityCourse: React.FC<PetAgilityCourseProps> = ({ pet, onGameOver, onExit }) => {
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([
    { id: 1, x: 80, type: 'hurdle', passed: false },
    { id: 2, x: 140, type: 'ring', passed: false },
    { id: 3, x: 200, type: 'tunnel', passed: false },
    { id: 4, x: 260, type: 'hurdle', passed: false },
    { id: 5, x: 320, type: 'ring', passed: false }
  ]);

  const handleJump = () => {
    if (isJumping || isGameOver) return;
    setIsJumping(true);
    soundManager.playPop();
    setTimeout(() => {
      setIsJumping(false);
    }, 600);
  };

  useEffect(() => {
    soundManager.startBGM('driving');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w') {
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Track loop
    const trackLoop = setInterval(() => {
      if (isGameOver) return;

      setDistance(d => {
        const nextDist = d + 1.2;

        // Check obstacles
        setObstacles(obs =>
          obs.map(o => {
            const relX = o.x - nextDist;
            // Near pet jump zone (relX around 15-25)
            if (!o.passed && relX >= 15 && relX <= 25) {
              if (isJumping) {
                // Successfully cleared hurdle!
                soundManager.playHeart();
                setScore(s => s + 20);
                return { ...o, passed: true };
              }
            }
            return o;
          })
        );

        // Finish track after 400m
        if (nextDist >= 360) {
          setIsGameOver(true);
          soundManager.playFanfare();
          confetti({ particleCount: 100, spread: 80 });
          return 360;
        }

        return nextDist;
      });
    }, 1000 / 60);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(trackLoop);
      soundManager.stopBGM();
    };
  }, [isJumping, isGameOver]);

  return (
    <div className="relative w-full h-[540px] bg-gradient-to-b from-sky-400 via-emerald-100 to-green-600 rounded-3xl border-4 border-amber-400/50 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
      {/* HUD */}
      <div className="relative z-20 bg-white/85 backdrop-blur-md px-6 py-3 border-b border-amber-300/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center border border-amber-300">
            <PetAvatar pet={pet} size="xs" interactive={false} />
          </div>
          <div>
            <h3 className="font-black text-sm text-slate-800">Agility Hurdle Course</h3>
            <p className="text-[11px] text-emerald-700 font-bold">Jump over obstacles with {pet.name}!</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-emerald-500/20 px-4 py-1 rounded-2xl border border-emerald-400/40 text-center">
            <span className="text-[10px] uppercase font-black text-emerald-800 block">Score</span>
            <span className="text-xl font-black text-emerald-700">{score}</span>
          </div>
        </div>
      </div>

      {/* Course Viewport */}
      <div
        onClick={handleJump}
        className="relative flex-1 w-full overflow-hidden cursor-pointer flex items-end pb-12"
      >
        {/* Grass Ground Layer */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-emerald-700 border-t-4 border-amber-400" />

        {/* Hurdles & Rings */}
        {obstacles.map(o => {
          const screenX = ((o.x - distance) / 100) * 100;
          if (screenX < -20 || screenX > 120) return null;

          return (
            <div
              key={o.id}
              className="absolute bottom-16 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${screenX}%` }}
            >
              {o.type === 'hurdle' && (
                <div className="w-12 h-14 border-4 border-amber-400 bg-amber-200/50 rounded-t-lg flex items-center justify-center font-black text-slate-800 text-xs shadow-md">
                  🚧
                </div>
              )}
              {o.type === 'ring' && (
                <div className="w-16 h-20 rounded-full border-4 border-rose-500 bg-rose-200/30 flex items-center justify-center text-xl shadow-lg">
                  🔥
                </div>
              )}
              {o.type === 'tunnel' && (
                <div className="w-16 h-12 bg-indigo-500 rounded-t-2xl border-2 border-white flex items-center justify-center text-xs font-black text-white">
                  🎪
                </div>
              )}
            </div>
          );
        })}

        {/* Player Pet Running / Jumping */}
        <div
          className={`absolute left-[20%] bottom-16 transform -translate-x-1/2 transition-all duration-200 ${
            isJumping ? '-translate-y-28 scale-110' : 'translate-y-0'
          }`}
        >
          <PetAvatar pet={pet} size="lg" interactive={false} expression={isJumping ? 'excited' : 'happy'} />
        </div>
      </div>

      {/* Jump Control Banner */}
      <div className="relative z-20 bg-white/90 backdrop-blur-md px-6 py-4 border-t border-amber-300/40 flex items-center justify-between">
        <span className="text-xs font-black text-slate-500">Tap screen or Spacebar to Jump!</span>

        <button
          onClick={handleJump}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black text-base shadow-xl active:scale-95 flex items-center gap-2"
        >
          <Zap size={20} />
          <span>JUMP! ⚡</span>
        </button>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-amber-400 text-center animate-scaleUp">
            <span className="text-5xl mb-2 block">🏆</span>
            <h2 className="text-3xl font-black text-slate-800 mb-1">Course Complete!</h2>
            <p className="text-sm font-bold text-slate-500 mb-4">{pet.name} is a superstar athlete!</p>

            <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-200 space-y-1">
              <div className="flex justify-between font-bold text-sm">
                <span>Agility Points:</span>
                <span className="text-emerald-700 font-black">{score} pts</span>
              </div>
              <div className="flex justify-between font-bold text-sm">
                <span>Coins Won:</span>
                <span className="text-emerald-600 font-black">+{score + 25} 🪙</span>
              </div>
            </div>

            <button
              onClick={() => onGameOver(score, score + 25)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black text-base shadow-xl active:scale-95"
            >
              Collect Trophies ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
