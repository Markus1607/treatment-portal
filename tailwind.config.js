/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xxs: '.70rem',
        cxs: '.85rem',
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        blue: {
          dark: '#1e477f',
          DEFAULT: '#005392',
          lighter: '#4da0e6',
          navy: '#013258',
          faded: '#dfeaf3',
        },
        black: {
          DEFAULT: '#303c45',
          light: '#696f83',
          lighter: '#89959f',
          lightest: '#72788C',
        },
        dashboard: '#f4f8fb',
        gray: {
          DEFAULT: '#c1cad1',
          light: '#d9E4ee',
          lightest: '#f7f9fc',
          new: '#ededed',
        },
        warning: {
          DEFAULT: '#ec3d40',
          light: '#EC3D401F',
        },
        orange: {
          DEFAULT: '#fe991d',
          light: '#FACD68',
          lighter: '#FEF4E6',
        },
        SmartPDTorange: '#F2971B',
        green: {
          DEFAULT: '#70D953',
          forecast: '#66C61C',
        },
      },
      screens: {
        '3xl': '1600px',
        '4xl': '1800px',
        print: { raw: 'print' },
      },
      gridTemplateColumns: {
        forms: '1.7fr 2fr',
        billing: '2fr 1fr',
        schedulingXL: '2.5fr 3fr',
        scheduling2XL: '2fr 3fr',
      },
      outline: {
        blue: '1px solid #005392',
      },
      animation: {
        'reverse-spin': 'reverse-spin 1s linear infinite',
      },
      keyframes: {
        'reverse-spin': {
          from: {
            transform: 'rotate(360deg)',
          },
        },
      },
    },
  },
  plugins: [],
};
