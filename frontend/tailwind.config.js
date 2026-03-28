/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: '#0f172a',     // Slate 900
        darker: '#020617',   // Slate 950
        panel: '#1e293b',    // Slate 800
        primary: '#3b82f6',  // Blue 500
        danger: '#ef4444',   // Red 500
      }
    },
  },
  plugins: [],
}