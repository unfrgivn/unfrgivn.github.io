/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				bg: '#0B0F17',
				'surface-1': '#0F1623',
				'surface-2': '#131D2E',
				border: 'rgba(255,255,255,0.08)',
				text: '#EAF0FF',
				muted: '#A7B0C3',
				faint: '#6B748A',
				primary: {
					DEFAULT: '#7C5CFC',
					2: '#4CC9F0',
				},
				accent: '#22C55E',
				warning: '#FBBF24',
				danger: '#FB7185',
                // Catppuccin Macchiato
                ctp: {
                    rosewater: '#f4dbd6',
                    flamingo: '#f0c6c6',
                    pink: '#f5bde6',
                    mauve: '#c6a0f6',
                    red: '#ed8796',
                    maroon: '#ee99a0',
                    peach: '#f5a97f',
                    yellow: '#eed49f',
                    green: '#a6da95',
                    teal: '#8bd5ca',
                    sky: '#91d7e3',
                    sapphire: '#7dc4e4',
                    blue: '#8aadf4',
                    lavender: '#b7bdf8',
                    text: '#cad3f5',
                    subtext1: '#b8c0e0',
                    subtext0: '#a5adcb',
                    overlay2: '#939ab7',
                    overlay1: '#8087a2',
                    overlay0: '#6e738d',
                    surface2: '#5b6078',
                    surface1: '#494d64',
                    surface0: '#363a4f',
                    base: '#24273a',
                    mantle: '#1e2030',
                    crust: '#181926',
                },
			},
			fontFamily: {
				sans: ['"Inter Variable"', 'sans-serif'],
				mono: ['"JetBrains Mono"', 'monospace'],
			},
			backgroundImage: {
				'gradient-aurora': 'linear-gradient(135deg, rgba(124,92,252,0.35), rgba(76,201,240,0.22), rgba(34,197,94,0.08))',
			},
		},
	},
	plugins: [
        typography,
    ],
};
