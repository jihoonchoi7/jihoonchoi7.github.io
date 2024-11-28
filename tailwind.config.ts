import type { Config } from "tailwindcss";

const config: Config = {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  		extend: {
  			colors: {
  				background: "#f6f9fc",
  				text: "#000000",
  			},
  			fontFamily: {
  				sans: ["Times New Roman", "serif"],
  			},
  			keyframes: {
  				scroll: {
  					'0%': { transform: 'translateY(0)' },
  					'100%': { transform: 'translateY(-50%)' },
  				}
  			},
  			animation: {
  				scroll: 'scroll 20s linear infinite',
  			}
  		}
  },
  plugins: [],
};
export default config;
