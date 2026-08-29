/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ferrari: {
          light: '#ff8533',
          DEFAULT: '#ff5500',
          dark: '#cc3700',
          accent: '#ffaa00'
        },
        shelter: {
          light: '#e0f2fe',
          DEFAULT: '#0284c7',
          dark: '#0369a1'
        },
        house: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#d97706'
        }
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-4%)' },
          '50%': { transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 10px rgba(255,100,0,0.8))' },
          '50%': { opacity: 0.8, filter: 'drop-shadow(0 0 4px rgba(255,100,0,0.4))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 1.5s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
