/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emby: {
          primary: '#52B54B',
          secondary: '#43A047',
          accent: '#4CAF50',
          background: '#000000',
          surface: '#1a1a1a',
          text: '#ffffff',
          'text-secondary': '#b3b3b3'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
