/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#001440',
          50: '#e6e8ee',
          100: '#ccd1dd',
          200: '#99a3bb',
          300: '#667499',
          400: '#334677',
          500: '#001440',
          600: '#00123a',
          700: '#000f2d',
          800: '#000b20',
          900: '#000713',
        },
        secondary: {
          DEFAULT: '#ddcdc0',
          50: '#f9f7f5',
          100: '#f3efea',
          200: '#e7dfd5',
          300: '#ddcdc0',
          400: '#c6b3a3',
          500: '#b09a87',
          600: '#9a826b',
          700: '#7a6554',
          800: '#5a493d',
          900: '#3a2d26',
        },
      },
    },
  },
  plugins: [],
} 