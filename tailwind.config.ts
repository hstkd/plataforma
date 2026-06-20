import type { Config } from 'tailwindcss'

/**
 * Sistema de diseño HS TKD Academy — Negro / Blanco / Amarillo.
 * Estética: marca deportiva premium (Nike-like) + tipografía geométrica condensada.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de marca
        ink: {
          DEFAULT: '#0a0a0b',
          soft: '#111114',
          card: '#16161a',
          line: 'rgba(255,255,255,0.08)',
        },
        bone: {
          DEFAULT: '#f5f5f3',
          muted: '#a1a1aa',
          faint: '#6b6b73',
        },
        gold: {
          DEFAULT: '#ffd400',
          soft: '#ffe45c',
          deep: '#caa700',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Oswald', 'sans-serif'],
        heading: ['var(--font-heading)', 'Montserrat', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(255,212,0,0.5), 0 20px 60px -20px rgba(255,212,0,0.35)',
        card: '0 24px 60px -24px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, rgba(255,212,0,0.06), transparent 40%)',
        'gold-radial':
          'radial-gradient(60% 60% at 50% 0%, rgba(255,212,0,0.18), transparent 70%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        marquee: 'marquee 28s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
