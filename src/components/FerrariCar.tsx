import React from 'react';
import { FerrariCustomization, Pet } from '../types/game';
import { PetAvatar } from './PetAvatar';

interface FerrariCarProps {
  customization: FerrariCustomization;
  passengerPet?: Pet | null;
  isBoosting?: boolean;
  view?: 'top' | 'isometric' | 'side';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const FerrariCar: React.FC<FerrariCarProps> = ({
  customization,
  passengerPet = null,
  isBoosting = false,
  view = 'top',
  size = 'md',
  className = ''
}) => {
  const {
    paintColor = '#ff5500',
    spoiler = 'none',
    rims = 'standard',
    underglow = 'none',
    stripe = 'none'
  } = customization;

  const sizeClasses = {
    sm: 'w-24 h-40',
    md: 'w-36 h-64',
    lg: 'w-48 h-80',
    xl: 'w-64 h-96'
  };

  // Neon Underglow Glow styles
  const underglowGlows: Record<string, string> = {
    none: 'none',
    orange: 'drop-shadow(0 0 16px rgba(255, 85, 0, 0.9))',
    cyan: 'drop-shadow(0 0 18px rgba(6, 182, 212, 0.9))',
    purple: 'drop-shadow(0 0 18px rgba(168, 85, 247, 0.9))',
    rainbow: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.95))'
  };

  if (view === 'side') {
    return (
      <div className={`relative ${className} flex items-center justify-center`}>
        <svg viewBox="0 0 240 100" className="w-full h-auto drop-shadow-xl" style={{ filter: underglowGlows[underglow] }}>
          {/* Exhaust Nitro Flame */}
          {isBoosting && (
            <path
              d="M 12 60 Q 2 64 -8 58 Q 2 68 12 66 Z"
              fill="#38bdf8"
              className="animate-pulse"
            />
          )}

          {/* Car Silhouette / Body */}
          <path
            d="M 20 62 L 35 62 Q 40 45 60 45 L 80 45 L 110 32 L 170 32 Q 195 32 208 50 L 225 58 Q 230 62 225 68 L 210 68 Q 200 50 180 50 Q 160 50 152 68 L 78 68 Q 70 50 50 50 Q 30 50 22 68 L 15 68 Q 12 64 20 62 Z"
            fill={paintColor}
          />
          {/* Windshield & Cockpit */}
          <path
            d="M 112 34 L 165 34 L 175 48 L 98 48 Z"
            fill="#0f172a"
            opacity="0.85"
          />
          {/* Side Windows tint */}
          <polygon points="115,36 142,36 142,46 104,46" fill="#38bdf8" opacity="0.6" />
          <polygon points="146,36 163,36 172,46 146,46" fill="#38bdf8" opacity="0.6" />

          {/* Ferrari Wheels */}
          {/* Rear Wheel */}
          <circle cx="50" cy="68" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <circle cx="50" cy="68" r="10" fill={rims === 'golden_star' ? '#eab308' : rims === 'neon_glow' ? '#06b6d4' : '#94a3b8'} />
          <circle cx="50" cy="68" r="4" fill="#0f172a" />

          {/* Front Wheel */}
          <circle cx="180" cy="68" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <circle cx="180" cy="68" r="10" fill={rims === 'golden_star' ? '#eab308' : rims === 'neon_glow' ? '#06b6d4' : '#94a3b8'} />
          <circle cx="180" cy="68" r="4" fill="#0f172a" />

          {/* Headlights */}
          <polygon points="215,55 228,58 220,62" fill="#fef08a" />

          {/* Spoiler */}
          {spoiler === 'sport' && (
            <path d="M 16 52 L 28 52 L 32 42 L 14 42 Z" fill="#0f172a" />
          )}
          {spoiler === 'gt_wing' && (
            <g>
              <line x1="22" y1="52" x2="20" y2="34" stroke="#0f172a" strokeWidth="3" />
              <rect x="10" y="32" width="26" height="4" rx="1" fill="#0f172a" />
            </g>
          )}
        </svg>

        {/* Passenger Pet in side view */}
        {passengerPet && (
          <div className="absolute left-[44%] top-[14%] transform -translate-x-1/2 -translate-y-1/2 scale-75">
            <PetAvatar pet={passengerPet} size="xs" interactive={false} expression="driving" />
          </div>
        )}
      </div>
    );
  }

  // Top-Down View (Standard Driving mode & Garage showcase)
  return (
    <div className={`relative ${sizeClasses[size]} select-none flex items-center justify-center ${className}`}>
      {/* Underglow Glow Effect */}
      <div
        className="absolute inset-2 rounded-full pointer-events-none transition-all duration-300"
        style={{
          boxShadow:
            underglow === 'orange'
              ? '0 0 35px 12px rgba(255, 85, 0, 0.85)'
              : underglow === 'cyan'
              ? '0 0 35px 12px rgba(6, 182, 212, 0.85)'
              : underglow === 'purple'
              ? '0 0 35px 12px rgba(168, 85, 247, 0.85)'
              : underglow === 'rainbow'
              ? '0 0 45px 16px rgba(236, 72, 153, 0.9)'
              : 'none'
        }}
      />

      <svg
        viewBox="0 0 120 220"
        className="w-full h-full drop-shadow-2xl overflow-visible transition-transform duration-200"
      >
        {/* Nitro Booster Flames */}
        {isBoosting && (
          <g className="animate-pulse">
            <polygon points="36,206 44,206 40,240" fill="#38bdf8" />
            <polygon points="38,206 42,206 40,228" fill="#ffffff" />
            <polygon points="76,206 84,206 80,240" fill="#38bdf8" />
            <polygon points="78,206 82,206 80,228" fill="#ffffff" />
          </g>
        )}

        {/* Four High Performance Wheels */}
        {/* Front Left */}
        <rect x="8" y="38" width="16" height="32" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <rect x="11" y="44" width="10" height="20" rx="3" fill={rims === 'golden_star' ? '#eab308' : rims === 'neon_glow' ? '#06b6d4' : '#64748b'} />

        {/* Front Right */}
        <rect x="96" y="38" width="16" height="32" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <rect x="99" y="44" width="10" height="20" rx="3" fill={rims === 'golden_star' ? '#eab308' : rims === 'neon_glow' ? '#06b6d4' : '#64748b'} />

        {/* Rear Left */}
        <rect x="8" y="145" width="18" height="36" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <rect x="11" y="152" width="12" height="22" rx="3" fill={rims === 'golden_star' ? '#eab308' : rims === 'neon_glow' ? '#06b6d4' : '#64748b'} />

        {/* Rear Right */}
        <rect x="94" y="145" width="18" height="36" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <rect x="97" y="152" width="12" height="22" rx="3" fill={rims === 'golden_star' ? '#eab308' : rims === 'neon_glow' ? '#06b6d4' : '#64748b'} />

        {/* Main Aerodynamic Ferrari Body */}
        <path
          d="M 60 10 
             C 42 10, 24 24, 22 45 
             C 20 65, 26 80, 24 100 
             C 22 120, 18 135, 18 165 
             C 18 190, 26 205, 40 206 
             L 80 206 
             C 94 205, 102 190, 102 165 
             C 102 135, 98 120, 96 100 
             C 94 80, 100 65, 98 45 
             C 96 24, 78 10, 60 10 Z"
          fill={paintColor}
          stroke="#000000"
          strokeWidth="2.5"
        />

        {/* Racing Stripes */}
        {stripe === 'white' && (
          <path d="M 54 10 L 66 10 L 66 206 L 54 206 Z" fill="#ffffff" opacity="0.9" />
        )}
        {stripe === 'black' && (
          <path d="M 54 10 L 66 10 L 66 206 L 54 206 Z" fill="#0f172a" opacity="0.8" />
        )}
        {stripe === 'dual_racing' && (
          <g fill="#ffffff" opacity="0.9">
            <rect x="49" y="10" width="7" height="196" />
            <rect x="64" y="10" width="7" height="196" />
          </g>
        )}

        {/* Front Hood Scoop / Vent */}
        <polygon points="50,30 70,30 65,48 55,48" fill="#1e293b" opacity="0.75" />

        {/* Sleek Ferrari Headlights */}
        <path d="M 30 22 Q 38 20 36 38 Q 28 32 30 22 Z" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
        <path d="M 90 22 Q 82 20 84 38 Q 92 32 90 22 Z" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />

        {/* Side Air Intakes */}
        <polygon points="20,118 28,124 28,142 20,146" fill="#0f172a" />
        <polygon points="100,118 92,124 92,142 100,146" fill="#0f172a" />

        {/* Open-Top Convertible Cockpit */}
        <rect x="32" y="75" width="56" height="60" rx="14" fill="#0f172a" />
        
        {/* Cockpit Windshield Curve */}
        <path d="M 32 82 Q 60 66 88 82 L 84 94 Q 60 84 36 94 Z" fill="#38bdf8" opacity="0.8" />

        {/* Interior Seats */}
        {/* Driver Seat (Left) */}
        <rect x="36" y="94" width="20" height="28" rx="5" fill="#78350f" stroke="#b45309" strokeWidth="1" />
        <circle cx="46" cy="98" r="6" fill="#451a03" /> {/* Steering wheel */}

        {/* Passenger Seat (Right - for Pet!) */}
        <rect x="64" y="94" width="20" height="28" rx="5" fill="#78350f" stroke="#b45309" strokeWidth="1" />

        {/* Rear Engine Cover / Louvers */}
        <g stroke="#0f172a" strokeWidth="2">
          <line x1="38" y1="150" x2="82" y2="150" />
          <line x1="42" y1="162" x2="78" y2="162" />
          <line x1="45" y1="174" x2="75" y2="174" />
        </g>

        {/* Round Ferrari Tail Lights */}
        <circle cx="34" cy="202" r="5.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
        <circle cx="86" cy="202" r="5.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />

        {/* Dual Exhaust Pipes */}
        <circle cx="48" cy="206" r="3.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="72" cy="206" r="3.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />

        {/* Custom Spoilers */}
        {spoiler === 'sport' && (
          <rect x="24" y="196" width="72" height="7" rx="3" fill="#0f172a" stroke="#ffffff" strokeWidth="0.8" />
        )}
        {spoiler === 'gt_wing' && (
          <g>
            <rect x="16" y="198" width="88" height="9" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
            <polygon points="12,194 20,198 12,204" fill="#ef4444" />
            <polygon points="108,194 100,198 108,204" fill="#ef4444" />
          </g>
        )}
        {spoiler === 'rocket' && (
          <g>
            <rect x="14" y="196" width="92" height="10" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Rocket Thrusters */}
            <circle cx="28" cy="204" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="92" cy="204" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
          </g>
        )}
      </svg>

      {/* Adopted Pet in Passenger Seat! */}
      {passengerPet && (
        <div className="absolute right-[22%] top-[43%] transform -translate-y-1/2 scale-75 pointer-events-none z-10">
          <PetAvatar pet={passengerPet} size="xs" interactive={false} expression="driving" />
        </div>
      )}
    </div>
  );
};
