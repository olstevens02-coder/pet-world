import React, { useState } from 'react';
import { Pet } from '../../types/game';
import { PetAvatar } from '../PetAvatar';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Award, Sparkles, Star, Trophy, Heart } from 'lucide-react';

interface PetFashionShowProps {
  pet: Pet;
  onGameOver: (score: number, coinsEarned: number) => void;
  onExit: () => void;
}

export const PetFashionShow: React.FC<PetFashionShowProps> = ({ pet, onGameOver, onExit }) => {
  const [poseIndex, setPoseIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [judgeScores, setJudgeScores] = useState<number[]>([9, 10, 9.5]);

  const poses = ['Glamour Wink', 'Ferrari Pilot Stride', 'Royal Spin', 'Sparkle Bow'];

  const handleNextPose = () => {
    soundManager.playHeart();
    confetti({ particleCount: 35, spread: 50 });

    if (poseIndex < poses.length - 1) {
      setPoseIndex(i => i + 1);
    } else {
      // Finished runway!
      soundManager.playFanfare();
      setShowResults(true);
      confetti({ particleCount: 120, spread: 90 });
    }
  };

  const totalScore = 95 + Object.keys(pet.accessories).length * 15;
  const coinsEarned = 80 + Object.keys(pet.accessories).length * 20;

  return (
    <div className="relative w-full h-[540px] bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-900 rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col justify-between select-none text-white">
      {/* Top Banner */}
      <div className="relative z-20 bg-purple-950/80 backdrop-blur-md px-6 py-3 border-b border-purple-400/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="text-amber-400" size={24} />
          <div>
            <h3 className="font-black text-sm text-white">Grand Pet Fashion Runway</h3>
            <p className="text-[11px] text-purple-300 font-bold">{pet.name} is walking the red carpet!</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-1 rounded-full border border-amber-400/30">
          <Sparkles size={14} className="text-amber-300" />
          <span className="text-xs font-black text-amber-300">Pose {poseIndex + 1} / {poses.length}</span>
        </div>
      </div>

      {/* Runway Spotlight */}
      <div className="relative flex-1 flex flex-col items-center justify-center">
        {/* Red Carpet Runway */}
        <div className="absolute inset-x-[25%] bottom-0 top-[20%] bg-gradient-to-t from-rose-700 to-rose-900 border-x-4 border-amber-400 shadow-2xl transform perspective-500 rotateX-12" />

        {/* Spotlights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-300/20 via-transparent to-transparent pointer-events-none" />

        {/* Pet on Runway */}
        <div className="relative z-20 flex flex-col items-center transform scale-125 mb-6">
          <PetAvatar pet={pet} size="xl" interactive={false} expression="excited" />
          <div className="mt-2 bg-black/60 px-4 py-1 rounded-full text-xs font-black text-amber-300 border border-amber-400/40">
            {poses[poseIndex]}
          </div>
        </div>
      </div>

      {/* Runway Action Button */}
      <div className="relative z-20 bg-purple-950/90 backdrop-blur-md px-6 py-4 border-t border-purple-400/30 flex items-center justify-between">
        <span className="text-xs font-bold text-purple-300">Show off your accessories to the judges!</span>

        <button
          onClick={handleNextPose}
          className="px-8 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-2xl font-black text-base shadow-xl active:scale-95 flex items-center gap-2"
        >
          <Sparkles size={18} />
          <span>Strike A Pose! ➔</span>
        </button>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-purple-900 to-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-amber-400 text-center text-white animate-scaleUp">
            <span className="text-5xl mb-2 block">👑</span>
            <h2 className="text-3xl font-black mb-1">Runway Champion!</h2>
            <p className="text-sm font-bold text-purple-200 mb-4">The judges loved {pet.name}'s look!</p>

            <div className="bg-purple-950/60 rounded-2xl p-4 mb-6 border border-purple-400/40 space-y-2">
              <div className="flex justify-between font-bold text-sm">
                <span>Judge Ratings:</span>
                <span className="text-amber-400 font-black">⭐⭐⭐⭐⭐ 10/10</span>
              </div>
              <div className="flex justify-between font-bold text-sm">
                <span>Prize Gold:</span>
                <span className="text-amber-300 font-black">+{coinsEarned} 🪙</span>
              </div>
            </div>

            <button
              onClick={() => onGameOver(totalScore, coinsEarned)}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-2xl font-black text-base shadow-xl active:scale-95"
            >
              Claim Championship Trophy ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
