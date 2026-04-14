/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                // Keep gray as slate or switch to neutral? Slate can look good against black, but true neutral might be better. Keeping slate context for now.
                gray: colors.slate,
                brand: {
                    50: '#fbf9f1',
                    100: '#f5f0db',
                    200: '#ecdfb5',
                    300: '#e0c888',
                    400: '#d4af37',  // Base Gold
                    500: '#c59b27',
                    600: '#a97c1d',
                    700: '#875c1a',
                    800: '#714a1a',
                    900: '#613e1a',
                    950: '#38210b',
                }
            }
        },
    },
    plugins: [],
}
