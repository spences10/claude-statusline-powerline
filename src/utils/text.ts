import { SegmentStyleConfig, StatuslineConfig } from '../types';

/**
 * Truncate text with ellipsis if it exceeds the maximum length
 */
export function truncate_text(
	text: string,
	max_length: number,
	ellipsis = '...',
): string {
	if (text.length <= max_length) {
		return text;
	}

	const truncate_to = max_length - ellipsis.length;
	if (truncate_to <= 0) {
		return ellipsis.slice(0, max_length);
	}

	return text.slice(0, truncate_to) + ellipsis;
}

/**
 * Get the maximum length for a segment from config with fallbacks
 */
export function get_segment_max_length(
	segment_type: 'model' | 'directory' | 'git' | 'session' | 'context',
	style_override: SegmentStyleConfig | undefined,
	config: StatuslineConfig,
): number {
	// Use style override if provided, otherwise use sensible defaults
	if (style_override?.truncation_length) {
		return style_override.truncation_length;
	}

	// Sensible defaults for each segment type
	switch (segment_type) {
		case 'model':
			return 15;
		case 'directory':
			return 25;
		case 'git':
			return 25;
		case 'session':
			return 30;
		case 'context':
			return 20;
		default:
			return 20;
	}
}

/**
 * Truncate text for a specific segment type using config
 */
export function truncate_segment_text(
	text: string,
	segment_type: 'model' | 'directory' | 'git',
	style_override: SegmentStyleConfig | undefined,
	config: StatuslineConfig,
): string {
	const max_length = get_segment_max_length(
		segment_type,
		style_override,
		config,
	);
	return truncate_text(text, max_length);
}
