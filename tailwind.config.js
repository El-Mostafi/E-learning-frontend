export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['hover:scale-102'],
  theme: {
    extend: {
      scale: {
        '102': '1.02'
      },
      animation: {
        'float': 'float 10s infinite',
        'pulse-slow': 'pulse-slow 3s infinite',
        'ping-slow': 'ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: 0.7 },
          '50%': { transform: 'translateY(-20px) scale(1.5)', opacity: 0.3 },
          '100%': { transform: 'translateY(-40px) scale(0.5)', opacity: 0 }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' }
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '75%, 100%': { transform: 'scale(2)', opacity: 0 }
        }
      }
    },
  },
  plugins: [],
};