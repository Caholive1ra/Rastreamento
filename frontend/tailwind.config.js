/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                accent: {
                    DEFAULT: '#EA580C',
                    hover: '#C2410C',
                    light: '#FB923C',
                },
                dark: {
                    DEFAULT: '#0A0A0A',
                    lighter: '#171717',
                    card: '#1C1C1C',
                    border: '#2A2A2A',
                }
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
