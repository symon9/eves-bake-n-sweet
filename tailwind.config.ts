import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair-display)', 'serif'],
      },
      colors: {
        'brand-pink': {
          50: '#fff0f6',
          100: '#ffe3ee',
          200: '#ffcce0',
          300: '#ffaad1',
          400: '#ff7db8',
          500: '#ff4f9a',
          600: '#f02d7e',
          700: '#d91d6c',
          800: '#b6195c',
          900: '#991a51',
          950: '#57082a'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
