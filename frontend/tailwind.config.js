// tailwind.config.js

module.exports = {
  content: [
    // This tells Tailwind to scan your React components for class names
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'DarkGreen': {
          '50': '#F0F5F0',
          '100': '#DDE8DE',
          '200': '#BDD1BE',
          '300': '#9CBBA4',
          '400': '#7BA58A',
          '500': '#5A8F70',
          '600': '#385A3A', 
          '700': '#2D482E',
          '800': '#223623',
          '900': '#172418',
          '950': '#0F1710',
        },
      },
    },
  },
  plugins: [],
}