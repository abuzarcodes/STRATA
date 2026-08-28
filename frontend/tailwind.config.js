/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        strata: {
          foam: '#E8F5E9',
          pastel: '#A5D6A7',
          vibrant: '#66BB6A',
          forest: '#1B5E20',
          deep: '#0B200E',
        },
        obsidian: {
          950: '#0B200E',
          900: '#112F15',
          850: '#1B5E20',
          800: '#23702A',
          700: '#2E7D32',
        },
        neon: {
          lime: '#66BB6A',
          mint: '#A5D6A7',
          forest: '#1B5E20',
          foam: '#E8F5E9',
          rose: '#f43f5e',
          amber: '#FF8C42',
        },
        cadastre: {
          dark: '#0B200E',
          card: '#112F15',
          border: '#1B5E20',
          accent: '#66BB6A',
          mint: '#A5D6A7',
          danger: '#f43f5e',
          warning: '#FF8C42',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'hud-emerald': '0 0 20px rgba(102, 187, 106, 0.35), inset 0 0 15px rgba(102, 187, 106, 0.12)',
        'hud-mint': '0 0 20px rgba(165, 214, 167, 0.3), inset 0 0 15px rgba(165, 214, 167, 0.1)',
        'hud-lime': '0 0 20px rgba(102, 187, 106, 0.35), inset 0 0 15px rgba(102, 187, 106, 0.12)',
        'hud-rose': '0 0 25px rgba(244, 63, 94, 0.35), inset 0 0 15px rgba(244, 63, 94, 0.15)',
        'glass-card': '0 8px 32px 0 rgba(11, 32, 14, 0.65)',
      }
    },
  },
  plugins: [],
}

