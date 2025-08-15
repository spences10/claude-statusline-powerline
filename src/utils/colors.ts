import { SegmentTheme } from '../types';

/**
 * Convert hex color to ANSI background code
 */
export function hex_to_ansi_bg(hex: string): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `\x1b[48;2;${r};${g};${b}m`;
}

/**
 * Convert hex color to ANSI foreground code
 */
export function hex_to_ansi_fg(hex: string): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `\x1b[38;2;${r};${g};${b}m`;
}

/**
 * Convert hex color to ANSI escape code (legacy support)
 */
export function hex_to_ansi(
	hex_color: string,
	is_background = false,
): string {
	// If it's already an ANSI code, return as-is
	if (hex_color.startsWith('\x1b[')) {
		return hex_color;
	}

	// If it's not a hex color, return as-is
	if (!hex_color.startsWith('#') || hex_color.length !== 7) {
		return hex_color;
	}

	// Use the dedicated functions for consistency
	return is_background
		? hex_to_ansi_bg(hex_color)
		: hex_to_ansi_fg(hex_color);
}

/**
 * Create segment theme from palette colors
 */
export function create_segment_theme(
	bg_color: string,
	fg_color: string,
): SegmentTheme {
	return {
		background: hex_to_ansi_bg(bg_color),
		foreground: hex_to_ansi_fg(fg_color),
		separator_color: hex_to_ansi_fg(bg_color),
	};
}
