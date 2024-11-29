/** @type {import('tailwindcss').Config} */
import {XS_SCREEN_SIZE} from "./src/utils/constants";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'xs': `${XS_SCREEN_SIZE}px`,
        // => @media (min-width: 480px) { ... }
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
