/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'special-day-light': "url('/bg-buddhism-light.webp')",
        'special-day-dark': "url('/bg-buddhism-dark.webp')",
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
