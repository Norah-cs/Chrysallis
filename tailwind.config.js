/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: "#8a85fe",
        secondary: "#acabfb",
        accent1: "#d2d2f8",
        accent2: "#b6b6f8",
        support1: "#f8b6f8",
        support2: "#f8d2f8",
        neutralLight: "#f5f7ff",
        neutralDark: "#2d2d48",
      },
    },
  },
  plugins: [],
};
