import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1B2C74',
          300: '#6377C9',
          400: '#3D55B8',
          500: '#24357F',
          600: '#16255F',
          700: '#111C48',
        },
        gold: {
          DEFAULT: '#C2A56C',
          soft: '#D8C49A',
        },
        ink: {
          DEFAULT: '#0E1633',
          soft: '#39415E',
          mute: '#767E97',
        },
        paper: {
          DEFAULT: '#F6F7F9',
          soft: '#EEF0F4',
        },
        line: '#DDE1EA',
      },
      fontFamily: {
        sans: ['var(--font-brand)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(14,22,51,0.05), 0 12px 40px -18px rgba(14,22,51,0.20)',
        lift: '0 2px 4px rgba(14,22,51,0.06), 0 30px 60px -24px rgba(14,22,51,0.32)',
        'glow-navy': '0 0 60px -12px rgba(27,44,116,0.45)',
      },
      keyframes: {
        'marquee-rtl': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(50%)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        'marquee-rtl': 'marquee-rtl 40s linear infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
