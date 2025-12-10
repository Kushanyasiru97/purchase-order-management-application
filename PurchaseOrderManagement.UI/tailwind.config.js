/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"  // Important: Include your Angular files
  ],
  theme: {
    extend: {
        colors: {
        customgray: '#E5E6E6',
      },
    },
  },
  plugins: [],
  mode: 'jit',
}


