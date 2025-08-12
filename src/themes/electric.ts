import { BaseTheme, ColorPalette, SegmentTheme } from './base';

export class ElectricTheme extends BaseTheme {
	name = 'electric';

	colors: ColorPalette = {
		bg: {
			blue: '\x1b[48;5;21m', // Electric blue background
			green: '\x1b[48;5;46m', // Electric green background
			yellow: '\x1b[48;5;226m', // Electric yellow background
			red: '\x1b[48;5;196m', // Electric red background
			purple: '\x1b[48;5;165m', // Electric purple background
			cyan: '\x1b[48;5;51m', // Electric cyan background
			gray: '\x1b[48;5;237m', // Dark gray background
			black: '\x1b[40m', // Black background
			white: '\x1b[47m', // White background
		},
		fg: {
			blue: '\x1b[38;5;21m', // Electric blue foreground
			green: '\x1b[38;5;46m', // Electric green foreground
			yellow: '\x1b[38;5;226m', // Electric yellow foreground
			red: '\x1b[38;5;196m', // Electric red foreground
			purple: '\x1b[38;5;165m', // Electric purple foreground
			cyan: '\x1b[38;5;51m', // Electric cyan foreground
			gray: '\x1b[38;5;237m', // Dark gray foreground
			black: '\x1b[30m', // Black foreground
			white: '\x1b[97m', // Bright white foreground
		},
	};

	segments = {
		model: {
			background: '\x1b[48;5;165m', // Electric purple background
			foreground: '\x1b[97m', // Bright white foreground
			separator_color: '\x1b[38;5;165m', // Electric purple foreground
		} as SegmentTheme,
		directory: {
			background: '\x1b[48;5;51m', // Electric cyan background
			foreground: '\x1b[30m', // Black foreground
			separator_color: '\x1b[38;5;51m', // Electric cyan foreground
		} as SegmentTheme,
		git: {
			clean: {
				background: '\x1b[48;5;46m', // Electric green background
				foreground: '\x1b[30m', // Black foreground
				separator_color: '\x1b[38;5;46m', // Electric green foreground
			} as SegmentTheme,
			dirty: {
				background: '\x1b[48;5;196m', // Electric red background
				foreground: '\x1b[97m', // Bright white foreground
				separator_color: '\x1b[38;5;196m', // Electric red foreground
			} as SegmentTheme,
		},
		session: {
			background: '\x1b[48;5;21m', // Electric blue background
			foreground: '\x1b[97m', // Bright white foreground
			separator_color: '\x1b[38;5;21m', // Electric blue foreground
		} as SegmentTheme,
	};
}
