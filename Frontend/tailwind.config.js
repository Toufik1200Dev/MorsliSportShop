/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00d4ff',
          dark: '#00b8d4',
          light: '#00e5ff',
        },
        dark: {
          DEFAULT: '#000000',
          light: '#0a0a0a',
          lighter: '#111111',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        arabic: ['Cairo', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

