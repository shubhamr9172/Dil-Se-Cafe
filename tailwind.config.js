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
          light: '#4B5563', // gray-600
          DEFAULT: '#1F2937', // gray-800
          dark: '#111827', // gray-900
        },
        accent: {
          DEFAULT: '#F59E0B', // amber-500
        }
      }
    },
  },
  plugins: [],
}
