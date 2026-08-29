import React, { useState } from 'react';
import { Pet } from '../../types/game';
import { TreatCatcher } from './TreatCatcher';
import { PetAgilityCourse } from './PetAgilityCourse';
import { PetFashionShow } from './PetFashionShow';
import { soundManager } from '../../utils/audio';
import { Trophy, Sparkles, Utensils, Zap, Award, ArrowLeft } from 'lucide-react';

interface MiniGameHubProps {
  pets: Pet[];
  activePetId: string | null;
  onRewardEarned: (coins: number, stars: number) => void;
  onBackToHouse: () => void;
}

export const MiniGameHub: React.FC<MiniGameHubProps> = ({
  pets,
  activePetId,
  onRewardEarned,
  onBackToHouse
}) => {
  const [selectedGame, setSelectedGame] = useState<'treat_catcher' | 'agility' | 'fashion' | null>(null);

  const activePet = pets.find(p => p.id === activePetId) || pets[0] || null;

  const handleGameOver = (score: number, coinsWon: number) => {
    onRewardEarned(coinsWon, 1);
    setSelectedGame(null);
  };

  if (!activePet) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-md mx-auto text-center border-4 border-amber-300 shadow-xl space-y-4">
        <span className="text-5xl">🐾</span>
        <h2 className="text-2xl font-black text-slate-800">Adopt a Pet First!</h2>
        <p className="text-slate-600 text-sm font-medium">
          You need at least one adopted pet buddy to participate in mini-games!
        </p>
        <button
          onClick={onBackToHouse}
          className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-black text-sm"
        >
          Back to House
        </button>
      </div>
    );
  }

  if (selectedGame === 'treat_catcher') {
    return (
      <TreatCatcher
        pet={activePet}
        onGameOver={handleGameOver}
        onExit={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'agility') {
    return (
      <PetAgilityCourse
        pet={activePet}
        onGameOver={handleGameOver}
        onExit={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'fashion') {
    return (
      <PetFashionShow
        pet={activePet}
        onGameOver={handleGameOver}
        onExit={() => setSelectedGame(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-4 border-white/30">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-black border border-white/20 mb-2">
            <Trophy size={14} />
            <span>🏆 Pet Arcade & Championship</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black">Pet Mini-Games</h1>
          <p className="text-purple-100 font-bold text-sm mt-1">
            Play with <span className="text-amber-300 font-black">{activePet.name}</span> to earn coins & trophies!
          </p>
        </div>

        <button
          onClick={onBackToHouse}
          className="px-5 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-black text-sm flex items-center gap-2 border border-white/30"
        >
          <ArrowLeft size={18} />
          <span>Back to House</span>
        </button>
      </div>

      {/* Mini-Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Game 1: Treat Catcher */}
        <div
          onClick={() => {
            setSelectedGame('treat_catcher');
            soundManager.playPop();
          }}
          className="bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 hover:border-orange-500 hover:scale-[1.03] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl mb-4 border border-amber-300">
              🦴
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-1">Treat Catcher</h3>
            <p className="text-slate-600 text-sm font-medium">
              Catch delicious falling snacks in your pet's bowl before time runs out!
            </p>
          </div>

          <div className="pt-6">
            <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-sm shadow-md">
              Play Treat Catcher ➔
            </button>
          </div>
        </div>

        {/* Game 2: Agility Course */}
        <div
          onClick={() => {
            setSelectedGame('agility');
            soundManager.playPop();
          }}
          className="bg-white rounded-3xl p-6 shadow-xl border-4 border-emerald-200 hover:border-emerald-500 hover:scale-[1.03] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-4xl mb-4 border border-emerald-300">
              ⚡
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-1">Agility Hurdles</h3>
            <p className="text-slate-600 text-sm font-medium">
              Time your jumps over obstacles, fiery rings, and hurdles!
            </p>
          </div>

          <div className="pt-6">
            <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-md">
              Play Agility Run ➔
            </button>
          </div>
        </div>

        {/* Game 3: Fashion Runway */}
        <div
          onClick={() => {
            setSelectedGame('fashion');
            soundManager.playPop();
          }}
          className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200 hover:border-purple-500 hover:scale-[1.03] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-4xl mb-4 border border-purple-300">
              👑
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-1">Fashion Runway</h3>
            <p className="text-slate-600 text-sm font-medium">
              Equip accessories, strike fabulous poses, and win the judges' grand prize!
            </p>
          </div>

          <div className="pt-6">
            <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm shadow-md">
              Play Fashion Show ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
