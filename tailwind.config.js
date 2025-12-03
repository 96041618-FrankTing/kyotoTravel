/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E63946',
        secondary: '#F1FAEE',
        accent: '#A8DADC',
        dark: '#1D3557',
        light: '#F8F9FA'
      }
    },
  },
  plugins: [],
}