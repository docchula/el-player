/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    // extend: {
    //   backgroundImage: {
    //     'special-day-light': "url('/')",
    //     'special-day-dark': "url('/')",
    //   }
    // },
  },
  plugins: [require('@tailwindcss/forms')],
};
