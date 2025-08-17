import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { BaseSegment, SegmentData } from './base';

export class ModelSegment extends BaseSegment {
	name = 'model';
	priority = 10;

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		const { style_override, get_icon } = this.setup_segment(config);

		const model = data.model?.display_name || 'Claude';
		const display_model = this.truncate_text(
			model,
			config,
			style_override,
		);
		const ai_icon = get_icon('ai');
		const theme = config.current_theme?.segments.model;

		return this.create_segment_with_fallback(
			`${ai_icon} ${display_model}`,
			theme,
			'model',
			config.separators.model,
			style_override,
		);
	}
}
