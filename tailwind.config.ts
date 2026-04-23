import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: '#2F4F6F',
          support: '#3E6A8E',
          accent: '#5B8DEF',
        },
        surface: {
          DEFAULT: '#F5F7FA',
          secondary: '#E4E8EE',
        },
        text: {
          dark: '#1F2933',
          mid: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
