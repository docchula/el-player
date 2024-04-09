/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'special-day-light': "url('/bg-songkran-light.png')",
        'special-day-dark': "url('/bg-songkran-dark.png')",
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
