// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        'primary-377DFF': '#377DFF',
        'primary-38CB89': '#38CB89',
        'primary-3B3A3C': '#3B3A3C',
        'primary-FFB700': '#FFB700',
        'secondary-1D6AF9': '#1D6AF9',
        'secondary-26B374': '#26B374',
        'dark-primary': '#191C21',
        'dark-secondary': '#212833'
      },
      backgroundColor: {
        FAFAFD: '#FAFAFD',
        F8F8FB: '#F8F8FB',
        EEEEEE: '#EEEEEE',
        F6F6F6: '#F6F6F6'
      },
      borderRadius: {
        20: '20px',
        16: '16px',
        10: '10px',
        8: '8px',
        4: '4px'
      }
    },
    fontFamily: {
      'lotso-ecom': 'Montserrat, Arial, sans-serif'
    },
    screens: {
      xsm: '420px',
      sm: '576px',
      md: '768px',
      mmd: '868px',
      lg: '992px',
      mlg: '1120px'
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        },
        '.b-sd': {
          boxShadow:
            '0 11px 15px -7px rgb(0 0 0 / 20%), 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%)'
        },
        '.b-sd-1': {
          boxShadow:
            '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)'
        },
        '.fs-30': {
          fontSize: '30px',
          lineHeight: '44px'
        },
        '.fs-26': {
          fontSize: '26px',
          lineHeight: '32px'
        },
        '.fs-22': {
          fontSize: '22px',
          lineHeight: '32px'
        },
        '.fs-20': {
          fontSize: '20px',
          lineHeight: '32px'
        },
        '.fs-18': {
          fontSize: '18px',
          lineHeight: '26px'
        },
        '.fs-16': {
          fontSize: '16px',
          lineHeight: '24px'
        },
        '.fs-14': {
          fontSize: '14px',
          lineHeight: '22px'
        },
        '.fs-12': {
          fontSize: '12px',
          lineHeight: '18px'
        },
        '.fs-10': {
          fontSize: '10px',
          lineHeight: '16px'
        },
        '.fs-9': {
          fontSize: '9px',
          lineHeight: '14px'
        }
      })
    })
  ]
}
