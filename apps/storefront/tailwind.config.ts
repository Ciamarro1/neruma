import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neruma: {
          bg: '#FAF8F5',
          dark: '#1A1816',
          charcoal: '#2B2824',
          muted: '#736B63',
          border: '#E8E2D8',
          sand: {
            50: '#FAF8F5',
            100: '#F4EFE6',
            200: '#E8E0D2',
            300: '#D8CDBC',
            400: '#C2B29D',
          },
          wood: {
            light: '#A68970',
            DEFAULT: '#6B5344',
            dark: '#4A3728',
            freijo: '#7A5C3E',
          },
          terracotta: {
            light: '#DE9674',
            DEFAULT: '#C46D47',
            dark: '#9E4E2C',
          },
          olive: {
            light: '#828E75',
            DEFAULT: '#5A674D',
            dark: '#3F4A34',
          },
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        neruma: '4px', // Raio sutil e elegante
        organic: '16px',
      },
      boxShadow: {
        organic: '0 10px 30px -10px rgba(43, 40, 36, 0.08)',
        card: '0 4px 20px -2px rgba(43, 40, 36, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
