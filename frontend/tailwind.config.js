/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        sand: '#ECE4D6',
        charcoal: '#121212',
        ink: '#1A1A1A',
        stone: '#5C5C5C',
        gold: '#A88151',
        deepblue: '#182A40',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
};
