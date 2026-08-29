import React, { useState } from 'react';
import { FerrariCustomization, Pet } from '../types/game';
import { FERRARI_UPGRADES } from '../data/items';
import { FerrariCar } from './FerrariCar';
import { soundManager } from '../utils/audio';
import { Wrench, Zap, Sparkles, Volume2, ShieldCheck, Check, Car } from 'lucide-react';

interface FerrariGarageProps {
  ferrari: FerrariCustomization;
  coins: number;
  passengerPet: Pet | null;
  onUpdateFerrari: (updated: FerrariCustomization, cost: number) => void;
  onStartDrive: () => void;
}

export const FerrariGarage: React.FC<FerrariGarageProps> = ({
  ferrari,
  coins,
  passengerPet,
  onUpdateFerrari,
  onStartDrive
}) => {
  const [activeTab, setActiveTab] = useState<'paint' | 'spoilers' | 'rims' | 'underglow' | 'horn' | 'engine'>('paint');
  const [viewMode, setViewMode] = useState<'top' | 'side'>('top');

  const handleApplyPaint = (paintHex: string, paintName: string, price: number) => {
    if (ferrari.paintColor === paintHex) return;
    if (price > 0 && coins < price) {
      soundManager.playPop();
      return;
    }
    soundManager.playFanfare();
    onUpdateFerrari({ ...ferrari, paintColor: paintHex, paintName }, price);
  };

  const handleApplySpoiler = (spoilerId: any, price: number) => {
    if (ferrari.spoiler === spoilerId) return;
    if (price > 0 && coins < price) {
      soundManager.playPop();
      return;
    }
    soundManager.playFanfare();
    onUpdateFerrari({ ...ferrari, spoiler: spoilerId }, price);
  };

  const handleApplyRims = (rimsId: any, price: number) => {
    if (ferrari.rims === rimsId) return;
    if (price > 0 && coins < price) {
      soundManager.playPop();
      return;
    }
    soundManager.playFanfare();
    onUpdateFerrari({ ...ferrari, rims: rimsId }, price);
  };

  const handleApplyUnderglow = (glowId: any, price: number) => {
    if (ferrari.underglow === glowId) return;
    if (price > 0 && coins < price) {
      soundManager.playPop();
      return;
    }
    soundManager.playFanfare();
    onUpdateFerrari({ ...ferrari, underglow: glowId }, price);
  };

  const handleApplyHorn = (hornId: any, price: number) => {
    soundManager.playHorn(hornId);
    if (ferrari.hornSound === hornId) return;
    if (price > 0 && coins < price) return;
    onUpdateFerrari({ ...ferrari, hornSound: hornId }, price);
  };

  const handleUpgradeSpeed = () => {
    const cost = (ferrari.topSpeedLevel + 1) * 75;
    if (coins < cost || ferrari.topSpeedLevel >= 5) return;
    soundManager.playFanfare();
    onUpdateFerrari({ ...ferrari, topSpeedLevel: ferrari.topSpeedLevel + 1 }, cost);
  };

  const handleUpgradeBoost = () => {
    const cost = (ferrari.boostLevel + 1) * 60;
    if (coins < cost || ferrari.boostLevel >= 5) return;
    soundManager.playFanfare();
    onUpdateFerrari({ ...ferrari, boostLevel: ferrari.boostLevel + 1 }, cost);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 select-none animate-fadeIn">
      {/* Garage Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-amber-400/40">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-black/30 px-4 py-1.5 rounded-full text-xs font-black border border-amber-400/30">
            <span>🏎️ Ferrari Custom Workshop & Showroom</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg">
            Your Orange Ferrari
          </h1>
          <p className="text-amber-100 font-bold max-w-xl text-sm md:text-base">
            Upgrade your signature sports car with aerodynamic GT wings, gold rims, neon underglow, and Italian horns!
          </p>
        </div>

        {/* Start Drive CTA */}
        <button
          onClick={onStartDrive}
          className="px-8 py-4 bg-gradient-to-r from-amber-300 to-yellow-400 hover:from-amber-200 hover:to-yellow-300 text-slate-950 rounded-2xl font-black text-lg shadow-2xl flex items-center gap-3 active:scale-95 transition-transform border-2 border-white"
        >
          <Car size={24} />
          <span>HIT THE ROAD! ➔</span>
        </button>
      </div>

      {/* Main Garage Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Showroom Display (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-8 border-4 border-amber-500/40 shadow-2xl flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden">
          {/* Showroom Spotlight Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900 to-slate-950 pointer-events-none" />

          {/* View Mode Toggle Buttons */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button
              onClick={() => { setViewMode('top'); soundManager.playClick(); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                viewMode === 'top' ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Top View
            </button>
            <button
              onClick={() => { setViewMode('side'); soundManager.playClick(); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                viewMode === 'side' ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Side View
            </button>
          </div>

          {/* Test Horn & Nitro preview */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={() => soundManager.playHorn(ferrari.hornSound)}
              className="px-4 py-2 bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400/40 text-amber-300 rounded-xl font-extrabold text-xs flex items-center gap-1.5 active:scale-95"
            >
              <Volume2 size={16} />
              <span>Test Horn</span>
            </button>
          </div>

          {/* Live Car Model */}
          <div className="my-8 transform scale-110 md:scale-125 transition-transform duration-300">
            <FerrariCar
              customization={ferrari}
              passengerPet={passengerPet}
              view={viewMode}
              size="lg"
            />
          </div>

          {/* Passenger Status Bar */}
          <div className="mt-4 bg-slate-800/80 px-6 py-2.5 rounded-2xl border border-amber-400/30 text-center flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Co-Pilot Passenger:</span>
            {passengerPet ? (
              <span className="text-sm font-black text-amber-300 flex items-center gap-1.5">
                <span>🐾</span>
                <span>{passengerPet.name} ({passengerPet.species})</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-500">No pet in passenger seat</span>
            )}
          </div>
        </div>

        {/* Right: Customization Controls & Shop (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-100 space-y-6">
          {/* Tab Selector */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            {[
              { id: 'paint', label: '🎨 Paint' },
              { id: 'spoilers', label: '🚀 Spoilers' },
              { id: 'rims', label: '⚙️ Rims' },
              { id: 'underglow', label: '✨ Neon' },
              { id: 'horn', label: '📢 Horn' },
              { id: 'engine', label: '⚡ Power' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); soundManager.playClick(); }}
                className={`px-3.5 py-2 rounded-xl font-black text-xs transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {/* Paint Shop */}
          {activeTab === 'paint' && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 text-lg">Custom Paint Finishes</h3>
              <div className="grid grid-cols-2 gap-3">
                {FERRARI_UPGRADES.paints.map(p => {
                  const isEquipped = ferrari.paintColor === p.id;
                  const canAfford = coins >= p.price;

                  return (
                    <button
                      key={p.id}
                      onClick={() => handleApplyPaint(p.id, p.name, p.price)}
                      className={`p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                        isEquipped
                          ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                          : 'border-slate-200 hover:border-amber-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: p.id }}
                        />
                        <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                          {p.tag}
                        </span>
                      </div>
                      <span className="font-bold text-xs text-slate-800">{p.name}</span>
                      <span className="text-xs font-black text-slate-500 mt-1">
                        {isEquipped ? '✓ Installed' : p.price === 0 ? 'Free' : `🪙 ${p.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spoilers Shop */}
          {activeTab === 'spoilers' && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 text-lg">Aerodynamic Wings</h3>
              <div className="space-y-3">
                {FERRARI_UPGRADES.spoilers.map(sp => {
                  const isEquipped = ferrari.spoiler === sp.id;
                  return (
                    <button
                      key={sp.id}
                      onClick={() => handleApplySpoiler(sp.id, sp.price)}
                      className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        isEquipped
                          ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                          : 'border-slate-200 hover:border-amber-400 bg-white'
                      }`}
                    >
                      <div className="font-extrabold text-sm text-slate-800">{sp.name}</div>
                      <div className="font-black text-xs text-amber-600">
                        {isEquipped ? '✓ Equipped' : sp.price === 0 ? 'Free' : `🪙 ${sp.price}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rims Shop */}
          {activeTab === 'rims' && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 text-lg">High Speed Wheel Rims</h3>
              <div className="space-y-3">
                {FERRARI_UPGRADES.rims.map(r => {
                  const isEquipped = ferrari.rims === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleApplyRims(r.id, r.price)}
                      className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        isEquipped
                          ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                          : 'border-slate-200 hover:border-amber-400 bg-white'
                      }`}
                    >
                      <div className="font-extrabold text-sm text-slate-800">{r.name}</div>
                      <div className="font-black text-xs text-amber-600">
                        {isEquipped ? '✓ Equipped' : r.price === 0 ? 'Free' : `🪙 ${r.price}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Neon Underglow */}
          {activeTab === 'underglow' && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 text-lg">Neon Underglow Lights</h3>
              <div className="space-y-3">
                {FERRARI_UPGRADES.underglow.map(u => {
                  const isEquipped = ferrari.underglow === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleApplyUnderglow(u.id, u.price)}
                      className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        isEquipped
                          ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                          : 'border-slate-200 hover:border-amber-400 bg-white'
                      }`}
                    >
                      <div className="font-extrabold text-sm text-slate-800">{u.name}</div>
                      <div className="font-black text-xs text-amber-600">
                        {isEquipped ? '✓ Equipped' : u.price === 0 ? 'Free' : `🪙 ${u.price}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Horn Tunes */}
          {activeTab === 'horn' && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 text-lg">Horn Melodies & Fanfares</h3>
              <div className="space-y-3">
                {FERRARI_UPGRADES.horns.map(h => {
                  const isEquipped = ferrari.hornSound === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => handleApplyHorn(h.id, h.price)}
                      className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        isEquipped
                          ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                          : 'border-slate-200 hover:border-amber-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-extrabold text-sm text-slate-800">
                        <Volume2 size={18} className="text-orange-500" />
                        <span>{h.name}</span>
                      </div>
                      <div className="font-black text-xs text-amber-600">
                        {isEquipped ? '✓ Selected' : h.price === 0 ? 'Free' : `🪙 ${h.price}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Engine Power Upgrades */}
          {activeTab === 'engine' && (
            <div className="space-y-6">
              <h3 className="font-black text-slate-800 text-lg">Performance Tuning</h3>

              {/* Speed Boost */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center font-black text-sm">
                  <span>Top Speed Tuning:</span>
                  <span className="text-orange-500">Lv. {ferrari.topSpeedLevel} / 5</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <div
                      key={lvl}
                      className={`flex-1 h-3 rounded-full ${
                        lvl <= ferrari.topSpeedLevel ? 'bg-orange-500' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                {ferrari.topSpeedLevel < 5 && (
                  <button
                    onClick={handleUpgradeSpeed}
                    disabled={coins < (ferrari.topSpeedLevel + 1) * 75}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md"
                  >
                    Upgrade Speed (🪙 {(ferrari.topSpeedLevel + 1) * 75})
                  </button>
                )}
              </div>

              {/* Nitro Boost Level */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center font-black text-sm">
                  <span>Nitro Boost Acceleration:</span>
                  <span className="text-cyan-500">Lv. {ferrari.boostLevel} / 5</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <div
                      key={lvl}
                      className={`flex-1 h-3 rounded-full ${
                        lvl <= ferrari.boostLevel ? 'bg-cyan-500' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                {ferrari.boostLevel < 5 && (
                  <button
                    onClick={handleUpgradeBoost}
                    disabled={coins < (ferrari.boostLevel + 1) * 60}
                    className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md"
                  >
                    Upgrade Nitro (🪙 {(ferrari.boostLevel + 1) * 60})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
