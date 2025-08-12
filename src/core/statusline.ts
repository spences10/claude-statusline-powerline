import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { segmentRegistry } from './registry';
import { create_styled_separator } from '../separators/styles';
import { load_config } from '../config';

// ANSI color codes
const COLORS = {
	reset: '\x1b[0m',
};

function create_segment(content: string, bg_color: string, fg_color: string): string {
	return `${bg_color}${fg_color}${content} ${COLORS.reset}`;
}

export function build_statusline(data: ClaudeStatusInput): string {
	const config = load_config();
	
	// Get enabled segments in priority order
	const enabled_segments = segmentRegistry.get_enabled_segments(config);
	const segments = [];

	// Build each segment
	for (const segment_builder of enabled_segments) {
		const segment = segment_builder.build(data, config);
		if (segment) {
			segments.push(segment);
		}
	}

	// Build output with dynamic separators
	const output = [];
	for (let i = 0; i < segments.length; i++) {
		const current = segments[i];
		const next = segments[i + 1];

		// Add the segment content
		output.push(
			create_segment(current.content, current.bg_color, current.fg_color),
		);

		// Add separator to next segment (if there is one)
		if (next) {
			const separator_style = current.separator_style || 'thick';
			output.push(
				create_styled_separator(
					current.separator_from_color,
					next.bg_color,
					separator_style as any,
				),
			);
		} else {
			// Final separator
			const separator_style = current.separator_style || 'thick';
			output.push(
				create_styled_separator(
					current.separator_from_color,
					'',
					separator_style as any,
				),
			);
		}
	}

	return output.join('');
}