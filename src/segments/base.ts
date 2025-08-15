import {
	ClaudeStatusInput,
	SegmentBuilder,
	SegmentData,
	SegmentStyleConfig,
	StatuslineConfig,
} from '../types';
import { hex_to_ansi } from '../utils/colors';

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
}
