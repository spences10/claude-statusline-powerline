/**
 * Shared ANSI color constants and utilities
 */

// Reset codes
export const ANSI_RESET = '\x1b[0m';

// Background colors (48;2;r;g;b format for 24-bit)
export const ANSI_BG = {
	red: '\x1b[41m',
	green: '\x1b[42m',
	yellow: '\x1b[43m',
	blue: '\x1b[44m',
	purple: '\x1b[45m',
	cyan: '\x1b[46m',
	white: '\x1b[47m',
	gray: '\x1b[100m',
	bright_black: '\x1b[100m',
} as const;

// Foreground colors (38;2;r;g;b format for 24-bit)
export const ANSI_FG = {
	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	purple: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	bright_white: '\x1b[97m',
	gray: '\x1b[90m',
} as const;

// Common color combinations for fallbacks
export const FALLBACK_COLORS = {
	model: {
		bg: ANSI_BG.blue,
		fg: ANSI_FG.bright_white,
		separator: ANSI_FG.blue,
	},
	directory: {
		bg: ANSI_BG.gray,
		fg: ANSI_FG.bright_white,
		separator: ANSI_FG.gray,
	},
	git_clean: {
		bg: ANSI_BG.green,
		fg: ANSI_FG.bright_white,
		separator: ANSI_FG.green,
	},
	git_dirty: {
		bg: ANSI_BG.yellow,
		fg: ANSI_FG.black,
		separator: ANSI_FG.yellow,
	},
	session: {
		bg: ANSI_BG.purple,
		fg: ANSI_FG.bright_white,
		separator: ANSI_FG.purple,
	},
	context: {
		bg: ANSI_BG.cyan,
		fg: ANSI_FG.bright_white,
		separator: ANSI_FG.cyan,
	},
	usage: {
		bg: ANSI_BG.purple,
		fg: ANSI_FG.bright_white,
		separator: ANSI_FG.purple,
	},
	error: {
		bg: ANSI_BG.red,
		fg: ANSI_FG.bright_white,
		separator: ANSI_FG.red,
	},
} as const;

/**
 * Create a styled text with foreground and background colors
 */
export function create_styled_text(
	text: string,
	fg_color: string,
	bg_color?: string,
): string {
	const bg = bg_color || '';
	return `${bg}${fg_color}${text}${ANSI_RESET}`;
}

/**
 * Get fallback colors for a segment type
 */
export function get_fallback_colors(
	segment_type: keyof typeof FALLBACK_COLORS,
) {
	return FALLBACK_COLORS[segment_type] || FALLBACK_COLORS.model;
}
