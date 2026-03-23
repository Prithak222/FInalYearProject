/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'progress-shrink': {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        }
      },
      animation: {
        'progress-shrink': 'progress-shrink 4s linear forwards',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Bright Blue
          foreground: '#ffffff',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#f43f5e', // Rose
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#8b5cf6', // Violet
          foreground: '#ffffff',
        },
        background: '#f8fafc', // Slate 50
        foreground: '#0f172a', // Slate 900
        muted: {
          DEFAULT: '#f1f5f9', // Slate 100
          foreground: '#64748b', // Slate 500
        },
        border: '#e2e8f0', // Slate 200
        card: '#ffffff',
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'tactile': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        'natural-1': '0.875rem',
        'natural-2': '1.125rem',
        'natural-3': '1.375rem',
      }
    },
  },
  plugins: [],
}
