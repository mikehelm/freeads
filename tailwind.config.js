/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: '#000000',
          secondary: '#0c1030',
          tertiary: '#060912',
        },
        accent: {
          purple: '#ba7fe6',
          pink: '#cf58a9',
          orange: '#fc822b',
          blue: '#4b1ee2',
        },
        text: {
          primary: '#ffffff',
          muted: '#e0e4ed',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #ba7fe6, #cf58a9, #fc822b)',
      }
    },
  },
  plugins: [],
};