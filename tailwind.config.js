/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Dark Backgrounds
                'north-pole': {
                    950: '#020617', // Deepest night
                    900: '#0B1120', // Night sky
                    800: '#151E32', // Deep aesthetic blue
                    700: '#1E293B',
                    600: '#334155',
                },
                // Sophisticated Reds
                'festive-red': {
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C', // Rich crimson
                    800: '#991B1B',
                    900: '#7F1D1D',
                    glow: '#FF5A5F',
                },
                // Elegant Greens
                'evergreen': {
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857', // Royal green
                    800: '#065F46',
                    900: '#064E3B',
                },
                // Magical Golds
                'stardust': {
                    100: '#FEF9C3',
                    300: '#FDE047',
                    400: '#FACC15', // Gold
                    500: '#EAB308',
                    600: '#CA8A04', // Antique gold
                },
                // Icy Whites
                'frost': {
                    50: '#F8FAFC',
                    100: '#F1F5F9', // Ice white
                    200: '#E2E8F0',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'], // Premium modern feel
                display: ['Cinzel', 'Playfair Display', 'serif'], // Magical headings
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'neon-red': '0 0 20px rgba(220, 38, 38, 0.5)',
                'neon-gold': '0 0 20px rgba(250, 204, 21, 0.4)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'christmas-magic': 'linear-gradient(135deg, #0B1120 0%, #151E32 50%, #1E1B4B 100%)',
                'card-gloss': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'float': 'float 6s ease-in-out infinite',
                'twinkle': 'twinkle 4s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'snow-fall': 'fall 10s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                twinkle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.3' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                fall: { // Redefined here to be sure
                    '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '0.8' },
                    '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
                }
            },
        },
    },
    plugins: [],
}
