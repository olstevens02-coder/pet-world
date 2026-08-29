import React from 'react';
import { LocationType, Pet } from '../types/game';
import { soundManager } from '../utils/audio';
import { Home, Heart, Car, Wrench, Trophy, Volume2, VolumeX, Music, BookOpen, Smartphone, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentLocation: LocationType;
  coins: number;
  stars: number;
  adoptedCount: number;
  activePet: Pet | null;
  soundMuted: boolean;
  musicMuted: boolean;
  onNavigate: (location: LocationType) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenAlbum: () => void;
  onOpenInstallGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  coins,
  stars,
  adoptedCount,
  activePet,
  soundMuted,
  musicMuted,
  onNavigate,
  onToggleSound,
  onToggleMusic,
  onOpenAlbum,
  onOpenInstallGuide
}) => {
  const navLinks: { id: LocationType; label: string; icon: any; color: string }[] = [
    { id: 'shelter', label: 'Animal Shelter', icon: Heart, color: 'text-sky-500' },
    { id: 'driving', label: 'Drive Ferrari', icon: Car, color: 'text-orange-500' },
    { id: 'house', label: 'Dream House', icon: Home, color: 'text-amber-500' },
    { id: 'garage', label: 'Ferrari Garage', icon: Wrench, color: 'text-rose-500' },
    { id: 'minigames', label: 'Mini-Games', icon: Trophy, color: 'text-purple-500' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200/80 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={() => {
            onNavigate('house');
            soundManager.playClick();
          }}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-xl shadow-md border-2 border-white group-hover:scale-105 transition-transform">
            🏎️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg md:text-xl text-slate-900 tracking-tight">
                Pet World
              </span>
              <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                Ferrari
              </span>
            </div>
            <p className="text-[10px] font-extrabold text-orange-600 tracking-wide hidden sm:block">
              Rescue & Dream House
            </p>
          </div>
        </div>

        {/* Center Nav Location Buttons */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentLocation === link.id;

            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  soundManager.playClick();
                }}
                className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md scale-105 border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon size={16} className={isActive ? link.color : 'text-slate-500'} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Counters & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Coins Badge */}
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-300 shadow-inner">
            <span className="text-base">🪙</span>
            <span className="font-black text-xs md:text-sm text-amber-800">{coins}</span>
          </div>

          {/* Adopted Count */}
          <div className="hidden sm:flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
            <span>🐾</span>
            <span className="font-black text-xs text-rose-700">{adoptedCount}</span>
          </div>

          {/* Photo Album */}
          <button
            onClick={() => {
              onOpenAlbum();
              soundManager.playClick();
            }}
            title="Open Photo Album"
            className="w-9 h-9 bg-slate-100 hover:bg-amber-100 rounded-xl flex items-center justify-center text-slate-700 transition-colors border border-slate-200"
          >
            <BookOpen size={16} />
          </button>

          {/* Audio Controls */}
          <button
            onClick={onToggleSound}
            title={soundMuted ? 'Unmute SFX' : 'Mute SFX'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors border ${
              soundMuted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-amber-100'
            }`}
          >
            {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={onToggleMusic}
            title={musicMuted ? 'Unmute BGM Music' : 'Mute BGM Music'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors border ${
              musicMuted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-amber-100'
            }`}
          >
            <Music size={16} />
          </button>

          {/* iPad Install Prompt Button */}
          <button
            onClick={() => {
              onOpenInstallGuide();
              soundManager.playPop();
            }}
            className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs px-3 py-2 rounded-xl shadow-md active:scale-95 transition-transform"
          >
            <Smartphone size={15} />
            <span>Install to iPad</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Sub-Nav for small screens */}
      <div className="md:hidden flex items-center justify-around bg-slate-50 border-t border-slate-200 px-2 py-1.5">
        {navLinks.map(link => {
          const Icon = link.icon;
          const isActive = currentLocation === link.id;

          return (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                soundManager.playClick();
              }}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
                isActive ? 'text-orange-600 font-black' : 'text-slate-600 font-bold'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px]">{link.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
