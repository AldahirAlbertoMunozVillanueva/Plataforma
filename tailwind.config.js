/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.blue.500'),
              '&:hover': {
                color: theme('colors.blue.700'),
              },
            },
            h1: { color: theme('colors.gray.900') },
            h2: { color: theme('colors.gray.900') },
            h3: { color: theme('colors.gray.900') },
            'ol > li::before': { color: theme('colors.gray.700') },
            'ul > li::before': { backgroundColor: theme('colors.gray.700') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Agrega el plugin de tipografía
  ],
};
