/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1DB954',
          dim: '#158a3c',
          muted: '#1ed76020'
        },
        surface: {
          base: '#0f0f0f',
          raised: '#181818',
          elevated: '#242424',
          overlay: '#2a2a2a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
