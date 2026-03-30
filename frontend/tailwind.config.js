
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: '#0f172a',     
        darker: '#020617',   
        panel: '#1e293b',    
        primary: '#3b82f6', 
        danger: '#ef4444',  
      }
    },
  },
  plugins: [],
}
