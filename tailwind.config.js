/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}", // nếu dùng Next.js
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  