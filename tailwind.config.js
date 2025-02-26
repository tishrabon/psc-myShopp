/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maincolor: "rgb(5, 1, 15)",
        activefont: "rgb(236, 236, 105)",
        subcolor: "rgb(7, 172, 7)",
        dontcolor: "rgb(204, 14, 14)",
        opcolor: "rgb(11, 82, 17)",
        litemarsh: "rgb(243, 236, 236)",
      },
      fontFamily: {
        myfont: ["Poppins", "sans-serif"],
      }
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1280px",
      xl: "1700px",
    }
  },
  plugins: [],
}

