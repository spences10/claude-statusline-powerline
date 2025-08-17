import { get_font_profile, get_symbol } from '../font-profiles';
import {
	ClaudeStatusInput,
	SegmentBuilder,
	SegmentData,
	SegmentStyleConfig,
	StatuslineConfig,
} from '../types';
import { get_fallback_colors } from '../utils/ansi';
import { hex_to_ansi } from '../utils/colors';
import { truncate_segment_text } from '../utils/text';

export { SegmentBuilder, SegmentData } from '../types';

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

	/**
	 * Check if this segment is enabled in the segment config
	 */
	protected isSegmentEnabled(config: StatuslineConfig): boolean {
		if (!config.segment_config?.segments) return true; // Default to enabled

		const segment_config = config.segment_config.segments.find(
			(s) => s.type === this.name.toLowerCase(),
		);

		return segment_config?.enabled ?? true; // Default to enabled if not specified
	}

	/**
	 * Common setup pattern used by all segments
	 * Returns font profile, style override, and icon getter function
	 */
	protected setup_segment(config: StatuslineConfig) {
		const style_override = this.getSegmentConfig(config);
		const font_profile = get_font_profile(config.font_profile);

		const get_icon = (
			icon_name: keyof typeof font_profile.symbols,
		) => {
			return get_symbol(
				font_profile,
				icon_name,
				style_override?.icons,
			);
		};

		return {
			style_override,
			font_profile,
			get_icon,
		};
	}

	/**
	 * Truncate text for this segment using config
	 */
	protected truncate_text(
		text: string,
		config: StatuslineConfig,
		style_override?: SegmentStyleConfig,
	): string {
		// Only support truncation for segments that have standardized truncation
		const segment_type = this.name as 'model' | 'directory' | 'git';
		if (!['model', 'directory', 'git'].includes(segment_type)) {
			return text;
		}

		return truncate_segment_text(
			text,
			segment_type,
			style_override,
			config,
		);
	}

	/**
	 * Create segment with fallback colors for the segment type
	 */
	protected create_segment_with_fallback(
		content: string,
		theme_segment: any,
		fallback_type:
			| 'model'
			| 'directory'
			| 'git_clean'
			| 'git_dirty'
			| 'session'
			| 'context'
			| 'error',
		separator_style?: string,
		style_override?: SegmentStyleConfig,
	): SegmentData {
		if (theme_segment) {
			return this.createSegment(
				content,
				theme_segment.background,
				theme_segment.foreground,
				theme_segment.separator_color,
				separator_style,
				style_override,
			);
		}

		// Use fallback colors
		const fallback = get_fallback_colors(fallback_type);
		return this.createSegment(
			content,
			fallback.bg,
			fallback.fg,
			fallback.separator,
			separator_style,
			style_override,
		);
	}
}
