/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#1e3a8a", // navy blue
        light: "#1d4ed8",
        dark: "#172554",
      },
    },
  },
},
  plugins: [],
};
