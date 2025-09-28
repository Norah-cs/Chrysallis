/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: "#5b55d4",      // darker purple (was #8a85fe)
        secondary: "#7a78e0",    // muted secondary purple (was #acabfb)
        accent1: "#a5a3f2",      // soft lavender accent
        accent2: "#8987e1",      // deeper lavender
        support1: "#d88bd8",     // darker pink (was #f8b6f8)
        support2: "#e5aee5",     // supporting pink
        neutralLight: "#eaeaf7", // lighter, but more muted than before
        neutralDark: "#1f1f33",  // deeper dark blue-grey (was #2d2d48)
      },
    },
  },
  plugins: [],
};
