import { load_config } from '../config';
import { create_styled_separator } from '../separators/styles';
import {
	ClaudeStatusInput,
	DisplayLine,
	StatuslineConfig,
} from '../types';
import { segmentRegistry } from './registry';

// ANSI color codes
const COLORS = {
	reset: '\x1b[0m',
};

function create_segment(
	content: string,
	bg_color: string,
	fg_color: string,
): string {
	return `${bg_color}${fg_color}${content} ${COLORS.reset}`;
}

function build_line_segments(
	data: ClaudeStatusInput,
	config: StatuslineConfig,
	line_config: DisplayLine,
): string {
	const segments = [];

	// Build segments for this line based on line configuration
	const enabled_segment_builders = segmentRegistry.get_all_segments();

	for (const segment_builder of enabled_segment_builders) {
		const segment_name =
			segment_builder.name.toLowerCase() as keyof typeof line_config.segments;
		if (line_config.segments[segment_name]) {
			const segment = segment_builder.build(data, config);
			if (segment) {
				segments.push(segment);
			}
		}
	}

	// Build output with dynamic separators for this line
	const output = [];
	for (let i = 0; i < segments.length; i++) {
		const current = segments[i];
		const next = segments[i + 1];

		// Add the segment content
		output.push(
			create_segment(
				current.content,
				current.bg_color,
				current.fg_color,
			),
		);

		// Add separator to next segment (if there is one)
		if (next) {
			const separator_style = current.separator_style || 'thick';
			output.push(
				create_styled_separator(
					current.separator_from_color,
					next.bg_color,
					separator_style as any,
					config.font_profile,
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
					config.font_profile,
				),
			);
		}
	}

	return output.join('');
}

export function build_statusline(data: ClaudeStatusInput): string {
	const config = load_config();

	// Check if multiline display configuration exists
	if (
		config.display &&
		config.display.lines &&
		config.display.lines.length > 0
	) {
		// Build multiline output
		const lines = [];
		for (const line_config of config.display.lines) {
			const line_output = build_line_segments(
				data,
				config,
				line_config,
			);
			if (line_output) {
				lines.push(line_output);
			}
		}
		return lines.join('\n');
	}

	// Fallback to original single-line behavior
	const enabled_segments =
		segmentRegistry.get_enabled_segments(config);
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
			create_segment(
				current.content,
				current.bg_color,
				current.fg_color,
			),
		);

		// Add separator to next segment (if there is one)
		if (next) {
			const separator_style = current.separator_style || 'thick';
			output.push(
				create_styled_separator(
					current.separator_from_color,
					next.bg_color,
					separator_style as any,
					config.font_profile,
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
					config.font_profile,
				),
			);
		}
	}

	return output.join('');
}
