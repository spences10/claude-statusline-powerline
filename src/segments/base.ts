import {
	ClaudeStatusInput,
	SegmentStyleConfig,
	StatuslineConfig,
} from '../types';

// Convert hex color to ANSI escape code
function hex_to_ansi(hex_color: string, is_background = false): string {
	// If it's already an ANSI code, return as-is
	if (hex_color.startsWith('\x1b[')) {
		return hex_color;
	}
	
	// If it's not a hex color, return as-is
	if (!hex_color.startsWith('#') || hex_color.length !== 7) {
		return hex_color;
	}
	
	// Parse hex color
	const r = parseInt(hex_color.slice(1, 3), 16);
	const g = parseInt(hex_color.slice(3, 5), 16);
	const b = parseInt(hex_color.slice(5, 7), 16);
	
	// Convert to ANSI 256-color code
	const prefix = is_background ? '48;5;' : '38;5;';
	const color_code = 16 + (36 * Math.round(r / 255 * 5)) + (6 * Math.round(g / 255 * 5)) + Math.round(b / 255 * 5);
	
	return `\x1b[${prefix}${color_code}m`;
}

export interface SegmentData {
	content: string;
	bg_color: string;
	fg_color: string;
	separator_from_color: string;
	separator_style?: string;
}

export interface SegmentBuilder {
	name: string;
	priority: number; // Lower numbers appear first
	is_enabled(config: StatuslineConfig): boolean;
	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null;
}

export abstract class BaseSegment implements SegmentBuilder {
	abstract name: string;
	abstract priority: number;

	abstract is_enabled(config: StatuslineConfig): boolean;
	abstract build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null;

	protected createSegment(
		content: string,
		bg_color: string,
		fg_color: string,
		separator_from_color: string,
		separator_style?: string,
		style_override?: SegmentStyleConfig,
	): SegmentData {
		// Apply style overrides if provided
		const final_bg = style_override?.bg_color || bg_color;
		const final_fg = style_override?.fg_color || fg_color;
		const final_separator_color =
			style_override?.separator?.color || separator_from_color;
		const final_separator_style =
			style_override?.separator?.style || separator_style;

		// Convert hex colors to ANSI codes if needed
		const ansi_bg = hex_to_ansi(final_bg, true);
		const ansi_fg = hex_to_ansi(final_fg, false);
		const ansi_separator = hex_to_ansi(final_separator_color, false);

		return {
			content,
			bg_color: ansi_bg,
			fg_color: ansi_fg,
			separator_from_color: ansi_separator,
			separator_style: final_separator_style,
		};
	}

	// Helper method to get segment config for this segment type
	protected getSegmentConfig(
		config: StatuslineConfig,
	): SegmentStyleConfig | undefined {
		if (!config.segment_config?.segments) return undefined;

		const segment_config = config.segment_config.segments.find(
			(s) => s.type === this.name.toLowerCase(),
		);

		return segment_config?.style;
	}
}
