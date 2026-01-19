/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          main: '#B8860B',
          dark: '#8B6914',
          pale: 'rgba(184, 134, 11, 0.3)',
        },
        cream: '#FDF8E8',
        brown: {
          dark: '#4A3728',
          text: '#5C4033',
        },
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        reem: ['Reem Kufi', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-stiff': 'cubic-bezier(0.4, 1.4, 0.4, 1)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-subtle': {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' },
          '50%': { filter: 'drop-shadow(0 0 8px rgba(255,255,255,1))' },
        },
        'fly-return': {
          '0%': { transform: 'translateX(0) translateY(0) rotate(0deg)' },
          '20%': { transform: 'translateX(8px) translateY(-8px) rotate(-25deg)' },
          '40%': { transform: 'translateX(20px) translateY(-5px) rotate(-15deg)', opacity: '0' },
          '41%': { transform: 'translateX(-20px) translateY(5px) rotate(15deg)', opacity: '0' },
          '60%': { transform: 'translateX(-8px) translateY(3px) rotate(10deg)', opacity: '1' },
          '100%': { transform: 'translateX(0) translateY(0) rotate(0deg)' },
        },
        'page-flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '25%': { transform: 'rotateY(-15deg)' },
          '50%': { transform: 'rotateY(15deg)' },
          '75%': { transform: 'rotateY(-10deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'glow-subtle': 'glow-subtle 2s ease-in-out infinite',
        'fly-return': 'fly-return 1.2s ease-in-out',
        'page-flip': 'page-flip 0.8s ease-in-out',
        'moving-border': 'moving-border 3s linear infinite',
      }
    },
    extend: {
      keyframes: {
        'moving-border': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
