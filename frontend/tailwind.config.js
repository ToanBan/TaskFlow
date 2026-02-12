/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // scan tất cả file trong src
  theme: {
    extend: {}, // có thể thêm custom colors, spacing… sau này
  },
  plugins: [], // thêm plugin nếu cần
};
