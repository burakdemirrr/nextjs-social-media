/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'modal-enter': {
          '0%': { opacity: '0', transform: 'translate(0, 20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translate(0, 0) scale(1)' }
        }
      },
      animation: {
        'modal-enter': 'modal-enter 0.2s ease-out'
      }
    },
  },
  plugins: [],
} 