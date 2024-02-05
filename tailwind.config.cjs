/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'valentine-light': "url('/bg-valentine-light.webp')",
        'valentine-dark': "url('/bg-valentine-dark.webp')",
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
