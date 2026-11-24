/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        }
      },
    },
  },
  plugins: [],
}
