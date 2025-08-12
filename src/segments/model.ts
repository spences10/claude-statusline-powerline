import { BaseSegment, SegmentData } from './base';
import { ClaudeStatusInput, StatuslineConfig } from '../types';

// ANSI color codes
const COLORS = {
	reset: '\x1b[0m',
	bg: {
		blue: '\x1b[44m',
	},
	fg: {
		blue: '\x1b[34m',
	},
	white: '\x1b[97m',
};

export class ModelSegment extends BaseSegment {
	name = 'model';
	priority = 10;

	is_enabled(config: StatuslineConfig): boolean {
		return config.segments.model;
	}

	build(data: ClaudeStatusInput, config: StatuslineConfig): SegmentData | null {
		const model = data.model?.display_name || 'Claude';
		
		// Truncate long model names
		const display_model = model.length > 15 ? `${model.slice(0, 12)}...` : model;
		
		return this.createSegment(
			` ${display_model}`,
			COLORS.bg.blue,
			COLORS.white,
			COLORS.fg.blue,
			config.separators.model,
		);
	}
}