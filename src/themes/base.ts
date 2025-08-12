export interface ColorPalette {
	// Background colors
	bg: {
		blue: string;
		green: string;
		yellow: string;
		red: string;
		purple: string;
		cyan: string;
		gray: string;
		black: string;
		white: string;
	};
	// Foreground colors
	fg: {
		blue: string;
		green: string;
		yellow: string;
		red: string;
		purple: string;
		cyan: string;
		gray: string;
		black: string;
		white: string;
	};
}

export interface SegmentTheme {
	background: string;
	foreground: string;
	separator_color: string;
}

export interface StatuslineTheme {
	name: string;
	colors: ColorPalette;
	segments: {
		model: SegmentTheme;
		directory: SegmentTheme;
		git: {
			clean: SegmentTheme;
			dirty: SegmentTheme;
		};
		session: SegmentTheme;
	};
}

export abstract class BaseTheme implements StatuslineTheme {
	abstract name: string;
	abstract colors: ColorPalette;
	abstract segments: {
		model: SegmentTheme;
		directory: SegmentTheme;
		git: {
			clean: SegmentTheme;
			dirty: SegmentTheme;
		};
		session: SegmentTheme;
	};
}
