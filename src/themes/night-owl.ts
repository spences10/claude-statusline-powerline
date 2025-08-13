import { BaseTheme, ColorPalette, SegmentTheme } from './base';

export class NightOwlTheme extends BaseTheme {
	name = 'night-owl';

	colors: ColorPalette = {
		bg: {
			blue: '\x1b[48;5;24m',
			green: '\x1b[48;5;29m',
			yellow: '\x1b[48;5;172m',
			red: '\x1b[48;5;167m',
			purple: '\x1b[48;5;141m',
			cyan: '\x1b[48;5;80m',
			gray: '\x1b[48;5;238m',
			black: '\x1b[48;5;16m',
			white: '\x1b[48;5;231m',
		},
		fg: {
			blue: '\x1b[38;5;74m',
			green: '\x1b[38;5;114m',
			yellow: '\x1b[38;5;222m',
			red: '\x1b[38;5;204m',
			purple: '\x1b[38;5;176m',
			cyan: '\x1b[38;5;117m',
			gray: '\x1b[38;5;145m',
			black: '\x1b[38;5;16m',
			white: '\x1b[38;5;231m',
		},
	};

	segments = {
		model: {
			background: '\x1b[48;2;95;139;207m', // Softer Night Owl blue (#5f8bcf)
			foreground: '\x1b[38;2;240;240;240m', // Light text
			separator_color: '\x1b[38;2;95;139;207m',
		} as SegmentTheme,
		directory: {
			background: '\x1b[48;2;236;196;141m', // Softer Night Owl orange (#ecc48d)
			foreground: '\x1b[38;2;1;22;39m', // Dark text
			separator_color: '\x1b[38;2;236;196;141m',
		} as SegmentTheme,
		git: {
			clean: {
				background: '\x1b[48;2;127;219;202m', // Night Owl teal (#7fdbca)
				foreground: '\x1b[38;2;1;22;39m', // Dark text
				separator_color: '\x1b[38;2;127;219;202m',
			} as SegmentTheme,
			dirty: {
				background: '\x1b[48;2;255;88;116m', // Night Owl red (#ff5874)
				foreground: '\x1b[38;2;240;240;240m', // Light text
				separator_color: '\x1b[38;2;255;88;116m',
			} as SegmentTheme,
		},
		session: {
			background: '\x1b[48;2;199;146;234m', // Night Owl purple (#c792ea)
			foreground: '\x1b[38;2;1;22;39m', // Dark background (#011627)
			separator_color: '\x1b[38;2;199;146;234m',
		} as SegmentTheme,
	};
}
