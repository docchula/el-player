/** @type {import('tailwindcss').Config} */
require('dotenv').config();
const colors = require('tailwindcss/colors');

const specialDay = process.env.VITE_SPECIAL_DAY;

let primaryColor = colors.green;
let secondaryColor = colors.emerald;

switch (specialDay) {
  case 'valentine':
    primaryColor = colors.pink;
    secondaryColor = colors.fuchsia;
    break;
  case 'songkran':
    primaryColor = colors.cyan;
    secondaryColor = colors.sky;
    break;
  case 'christmas':
    primaryColor = colors.red;
    secondaryColor = colors.red;
    break;
  case 'halloween':
    primaryColor = colors.amber;
    secondaryColor = colors.orange;
    break;
  default:
    break;
}

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
      },
      backgroundImage: {
        'special-day-light': `url('/bg-${specialDay}-light.webp')`,
        'special-day-dark': `url('/bg-${specialDay}-dark.webp')`,
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
