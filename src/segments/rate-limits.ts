import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { BaseSegment, SegmentData } from './base';

export class RateLimitsSegment extends BaseSegment {
	name = 'rate_limits';

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		if (!data.rate_limits) return null;

		const five_hour = data.rate_limits.five_hour;
		const seven_day = data.rate_limits.seven_day;

		if (!five_hour && !seven_day) return null;

		const { style_override, get_icon } = this.setup_segment(config);
		const warning_icon = get_icon('warning');

		const parts: string[] = [];
		if (five_hour) {
			parts.push(`5h: ${Math.round(five_hour.used_percentage)}%`);
		}
		if (seven_day) {
			parts.push(`7d: ${Math.round(seven_day.used_percentage)}%`);
		}

		const content = this.apply_minimum_width(
			`${warning_icon} ${parts.join(' | ')}`,
			style_override,
		);

		const theme = config.current_theme?.segments.rate_limits;

		return this.create_segment_with_fallback(
			content,
			theme,
			'session',
			config.separators.rate_limits || config.separators.session,
			style_override,
		);
	}
}
