/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#440D70',
          indigo: '#440D70',
          light: '#A3C1E4',
        },
      },
    },
  },
  plugins: [],
}