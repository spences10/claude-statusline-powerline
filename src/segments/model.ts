import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { BaseSegment, SegmentData } from './base';

export class ModelSegment extends BaseSegment {
	name = 'model';

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		const { style_override, get_icon } = this.setup_segment(config);

		const model = data.model?.display_name || 'Claude';
		const ai_icon = get_icon('ai');
		const content = this.finalize_content(
			`${ai_icon} ${model}`,
			config,
			style_override,
		);
		const theme = config.current_theme?.segments.model;

		return this.create_segment_with_fallback(
			content,
			theme,
			'model',
			config.separators.model,
			style_override,
		);
	}
}
