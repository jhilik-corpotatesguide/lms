/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#5b21b6',
          indigo: '#4f46e5',
          light: '#eef1fb',
        },
      },
    },
  },
  plugins: [],
}
