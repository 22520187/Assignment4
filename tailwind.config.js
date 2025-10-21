/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f6fe',
          100: '#b9e7fc',
          200: '#8dd7fa',
          300: '#66c8f7',
          400: '#50bbf5',
          500: '#46aff2',
          600: '#41a1e3',
          700: '#3991d1',
          800: '#3181bf',
          900: '#2971ad',
          950: '#21619b'
        }
      }
    },
  },
  plugins: [],
}

