// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Modern Dark & Lime Theme Colors ---
        'primary-bg': '#1a1a1a',     // Dark background for the overall page
        'secondary-bg': '#2a2a2a',   // Slightly lighter dark background for cards/sections
        'dark-border': '#444444',    // Darker border color
        'light-text': '#e0e0e0',     // Light text color for contrast
        'medium-text': '#b0b0b0',    // Medium gray text for less emphasis
        'dark-text': '#777777',      // Darker gray text (less used)
        'accent-500': '#CCFF66',     // PRIMARY ACCENT COLOR: Brighter Lime Green
        'accent-600': '#99CC33',     // HOVER ACCENT COLOR: Slightly darker, but still vibrant lime
        // Add any other default Tailwind colors if you want to explicitly override them,
        // otherwise, Tailwind's defaults like 'black', 'white', 'red-500', etc., will still be available.
      },
    },
  },
  plugins: [],
}