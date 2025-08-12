import { BaseTheme, ColorPalette, SegmentTheme } from './base';

export class DarkTheme extends BaseTheme {
	name = 'dark';

	colors: ColorPalette = {
		bg: {
			blue: '\x1b[44m',      // Bright blue background
			green: '\x1b[42m',     // Bright green background
			yellow: '\x1b[43m',    // Bright yellow background
			red: '\x1b[41m',       // Bright red background
			purple: '\x1b[45m',    // Bright purple background
			cyan: '\x1b[46m',      // Bright cyan background
			gray: '\x1b[100m',     // Dark gray background
			black: '\x1b[40m',     // Black background
			white: '\x1b[47m',     // White background
		},
		fg: {
			blue: '\x1b[34m',      // Blue foreground
			green: '\x1b[32m',     // Green foreground
			yellow: '\x1b[33m',    // Yellow foreground
			red: '\x1b[31m',       // Red foreground
			purple: '\x1b[35m',    // Purple foreground
			cyan: '\x1b[36m',      // Cyan foreground
			gray: '\x1b[90m',      // Dark gray foreground
			black: '\x1b[30m',     // Black foreground
			white: '\x1b[97m',     // Bright white foreground
		},
	};

	segments = {
		model: {
			background: this.colors.bg.blue,
			foreground: this.colors.fg.white,
			separatorColor: this.colors.fg.blue,
		} as SegmentTheme,
		directory: {
			background: this.colors.bg.gray,
			foreground: this.colors.fg.white,
			separatorColor: this.colors.fg.gray,
		} as SegmentTheme,
		git: {
			clean: {
				background: this.colors.bg.green,
				foreground: this.colors.fg.black,
				separatorColor: this.colors.fg.green,
			} as SegmentTheme,
			dirty: {
				background: this.colors.bg.yellow,
				foreground: this.colors.fg.black,
				separatorColor: this.colors.fg.yellow,
			} as SegmentTheme,
		},
		session: {
			background: this.colors.bg.purple,
			foreground: this.colors.fg.white,
			separatorColor: this.colors.fg.purple,
		} as SegmentTheme,
	};
}