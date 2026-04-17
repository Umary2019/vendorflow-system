/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        ink: '#0f172a',
        paper: '#f8fafc',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(2, 8, 23, 0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #072f38 0%, #0b4d5b 45%, #06b6d4 100%)',
      },
    },
  },
  plugins: [],
};
