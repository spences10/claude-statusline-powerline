import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { BaseSegment, SegmentData } from './base';

export class SessionIdSegment extends BaseSegment {
	name = 'session_id';

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		if (!data.session_id) return null;

		const { style_override, get_icon } = this.setup_segment(config);
		const info_icon = get_icon('info');

		const content = this.finalize_content(
			`${info_icon} ${data.session_id}`,
			config,
			style_override,
		);

		const theme = config.current_theme?.segments.session_id;

		return this.create_segment_with_fallback(
			content,
			theme,
			'session',
			config.separators.session_id || config.separators.session,
			style_override,
		);
	}
}
