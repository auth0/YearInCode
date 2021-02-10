module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxWidth: {
        52: '13rem',
      },
      height: {
        100: '28rem',
        '90vh': '90vh',
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        flamingo: {
          100: '#fbddd3',
          200: '#f7bba7',
          300: '#f3987c',
          400: '#ef7650',
          500: '#eb5424',
          600: '#bc431d',
          700: '#8d3216',
          800: '#5e220e',
          900: '#2f1107',
        },
        'dark-slate-gray': {
          100: '#d4d5d7',
          200: '#aaabae',
          300: '#7f8286',
          400: '#55585d',
          500: '#2a2e35',
          600: '#22252a',
          700: '#191c20',
          800: '#111215',
          900: '#08090b',
        },
      },
      textColor: {
        'text-base': 'var(--text-base)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      keyframes: {
        fadeIn: {
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},
        },
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
      },
    },
    fontFamily: {
      display: 'var(--font-display)',
    },
    debugScreens: {
      position: ['bottom', 'right'],
    },
    fontSize: {
      xs: ['0.75rem', {lineHeight: '1rem'}],
      sm: ['0.875rem', {lineHeight: '1.25rem'}],
      base: ['1rem', {lineHeight: '2rem'}],
      lg: ['1.125rem', {lineHeight: '2rem'}],
      xl: ['1.25rem', {lineHeight: '2rem'}],
      '2xl': ['1.5rem', {lineHeight: '2rem'}],
      '3xl': ['1.875rem', {lineHeight: '2rem'}],
      '4xl': ['2.7rem', {lineHeight: '3rem'}],
      '5xl': ['3rem', {lineHeight: '3.5rem'}],
      '6xl': ['3.75rem', {lineHeight: '5rem'}],
      '7xl': ['4.5rem', {lineHeight: '5rem'}],
      '8xl': ['6rem', {lineHeight: '5rem'}],
      '9xl': ['8rem', {lineHeight: '5rem'}],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [require('tailwindcss-debug-screens')],
}
