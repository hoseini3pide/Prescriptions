/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        'custom-border': '#E4E2F3', 
      },
      backgroundImage: {
        'custom-gradient': "radial-gradient(27.06% 26.4% at 82.22% 20.8%, rgba(27, 9, 185, 0.14) 0%, rgba(247, 247, 248, 0.20) 100%), radial-gradient(44.5% 44.45% at 50% 50%, rgba(108, 74, 210, 0.20) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #F7F6F9 0%, #F1EEF8 100%)",
        'custom-overlay': "linear-gradient(180deg, rgba(246, 245, 250, 0.26) 0%, rgba(255, 255, 255, 0.32) 100%)",
        'combined-gradient': "linear-gradient(180deg, rgba(246, 245, 250, 0.26) 0%, rgba(255, 255, 255, 0.32) 100%), radial-gradient(27.06% 26.4% at 82.22% 20.8%, rgba(27, 9, 185, 0.14) 0%, rgba(247, 247, 248, 0.20) 100%), radial-gradient(44.5% 44.45% at 50% 50%, rgba(108, 74, 210, 0.20) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #F7F6F9 0%, #F1EEF8 100%)"
      },
      blur: {
        '9px': '9px', 
      }
    },
  },
  plugins: [],
}