/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#15803d',
          600: '#166534',
          700: '#14532d',
          800: '#14532d',
        },
        senior: {
          warm: '#FDFBF7',
          card: '#FFFFFF',
          border: '#E2E8F0',
          blue: '#1E40AF',
          green: '#15803D',
          amber: '#B45309',
          sos: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'Urdu Typesetting', 'Jameel Noori Nastaleeq', 'Amiri', 'Tahoma', 'sans-serif'],
      },
      fontSize: {
        'senior-sm': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
        'senior-base': ['1.25rem', { lineHeight: '1.875rem' }], // 20px
        'senior-lg': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        'senior-xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px
        'senior-2xl': ['2.25rem', { lineHeight: '2.75rem' }],   // 36px
        'senior-3xl': ['3rem', { lineHeight: '1.2' }],          // 48px
      },
      minHeight: {
        'touch': '56px',
        'touch-lg': '68px',
      },
      minWidth: {
        'touch': '56px',
        'touch-lg': '68px',
      }
    },
  },
  plugins: [],
}
