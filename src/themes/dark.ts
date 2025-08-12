import { BaseTheme, ColorPalette, SegmentTheme } from './base';

export class DarkTheme extends BaseTheme {
	name = 'dark';

	colors: ColorPalette = {
		bg: {
			blue: '\x1b[44m', // Bright blue background
			green: '\x1b[42m', // Bright green background
			yellow: '\x1b[43m', // Bright yellow background
			red: '\x1b[41m', // Bright red background
			purple: '\x1b[45m', // Bright purple background
			cyan: '\x1b[46m', // Bright cyan background
			gray: '\x1b[100m', // Dark gray background
			black: '\x1b[40m', // Black background
			white: '\x1b[47m', // White background
		},
		fg: {
			blue: '\x1b[34m', // Blue foreground
			green: '\x1b[32m', // Green foreground
			yellow: '\x1b[33m', // Yellow foreground
			red: '\x1b[31m', // Red foreground
			purple: '\x1b[35m', // Purple foreground
			cyan: '\x1b[36m', // Cyan foreground
			gray: '\x1b[90m', // Dark gray foreground
			black: '\x1b[30m', // Black foreground
			white: '\x1b[97m', // Bright white foreground
		},
	};

	segments = {
		model: {
			background: '\x1b[44m', // Bright blue background
			foreground: '\x1b[97m', // Bright white foreground
			separator_color: '\x1b[34m', // Blue foreground
		} as SegmentTheme,
		directory: {
			background: '\x1b[100m', // Dark gray background
			foreground: '\x1b[97m', // Bright white foreground
			separator_color: '\x1b[90m', // Dark gray foreground
		} as SegmentTheme,
		git: {
			clean: {
				background: '\x1b[42m', // Bright green background
				foreground: '\x1b[30m', // Black foreground
				separator_color: '\x1b[32m', // Green foreground
			} as SegmentTheme,
			dirty: {
				background: '\x1b[43m', // Bright yellow background
				foreground: '\x1b[30m', // Black foreground
				separator_color: '\x1b[33m', // Yellow foreground
			} as SegmentTheme,
		},
		session: {
			background: '\x1b[45m', // Bright purple background
			foreground: '\x1b[97m', // Bright white foreground
			separator_color: '\x1b[35m', // Purple foreground
		} as SegmentTheme,
	};
}
