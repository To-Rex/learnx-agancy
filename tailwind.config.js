/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'blob': 'blob 7s infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-100',
    'bg-green-100', 
    'bg-purple-100',
    'bg-orange-100',
    'bg-indigo-100',
    'bg-pink-100',
    'text-blue-600',
    'text-green-600',
    'text-purple-600', 
    'text-orange-600',
    'text-indigo-600',
    'text-pink-600',
    'border-blue-200',
    'border-green-200',
    'border-purple-200',
    'border-orange-200',
    'border-indigo-200',
    'border-pink-200',
    'from-blue-500',
    'from-green-500',
    'from-purple-500',
    'from-orange-500',
    'to-blue-600',
    'to-green-600',
    'to-purple-600',
    'to-orange-600'
  ]
}