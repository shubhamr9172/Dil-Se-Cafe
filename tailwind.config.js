/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dil Se Cafe warm color palette
        primary: {
          50: '#FFF8F0',
          100: '#FFECD9',
          200: '#FFD4B3',
          300: '#FFB88C',
          400: '#FF9D66',
          500: '#FF8142', // Main warm orange
          600: '#E6681F',
          700: '#B34F0F',
          800: '#803909',
          900: '#4D2305',
        },
        secondary: {
          50: '#FAF6F1',
          100: '#F2E8DC',
          200: '#E8D5C0',
          300: '#D9BFA1',
          400: '#C8A77F',
          500: '#B58C5D', // Warm brown
          600: '#9B7144',
          700: '#7A5834',
          800: '#5A4027',
          900: '#3A2919',
        },
        accent: {
          50: '#FFFCF5',
          100: '#FFF7E6',
          200: '#FFEFC4',
          300: '#FFE599',
          400: '#FFD766',
          500: '#FFC633', // Gold accent
          600: '#E6A500',
          700: '#B38000',
          800: '#805C00',
          900: '#4D3800',
        },
        neutral: {
          50: '#FAFAF9',
          100: '#F5F4F2',
          200: '#ECEAE6',
          300: '#D9D6D1',
          400: '#B8B3AC',
          500: '#938D84',
          600: '#706A61',
          700: '#4F4A43',
          800: '#322E29',
          900: '#1A1714',
        },
      },
    },
  },
  plugins: [],
}
