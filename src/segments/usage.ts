import {
	ClaudeStatusInput,
	StatuslineConfig,
	UsageSummary,
} from '../types';
import { ensure_session_recorded } from '../utils/session-tracker';
import { format_tokens } from '../utils/token-formatting';
import { get_usage_db } from '../utils/usage-db';
import { BaseSegment, SegmentData } from './base';

export class UsageSegment extends BaseSegment {
	name = 'usage';
	priority = 35; // Between session (40) and git (30)

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		// Record current session if available
		ensure_session_recorded(
			data.transcript_path,
			data.session_id,
			data.workspace.project_dir || data.workspace.current_dir,
		);

		try {
			const db = get_usage_db();
			const summary = db.get_usage_summary();

			return this.render_usage_segment(summary, config);
		} catch (error) {
			// Gracefully fall back to error state
			return this.render_error_segment(config);
		}
	}

	private render_usage_segment(
		summary: UsageSummary,
		config: StatuslineConfig,
	): SegmentData {
		const { style_override, get_icon } = this.setup_segment(config);
		const theme = config.current_theme?.segments.usage;

		// Use week data for more meaningful display
		const week_data = summary.week;
		const total_tokens =
			week_data.total_input_tokens + week_data.total_output_tokens;

		const cost_str =
			week_data.total_cost < 0.01
				? '< $0.01'
				: `$${week_data.total_cost.toFixed(2)}`;

		const usage_icon = get_icon('cost');
		const content = `${usage_icon} ${format_tokens(total_tokens)} • ${cost_str} 7d`;

		return this.create_segment_with_fallback(
			content,
			theme,
			'session',
			config.separators.usage,
			style_override,
		);
	}

	private render_error_segment(
		config: StatuslineConfig,
	): SegmentData {
		const { style_override, get_icon } = this.setup_segment(config);
		const theme = config.current_theme?.segments.usage;
		const error_icon = get_icon('error');
		const content = `${error_icon} DB Error`;

		return this.create_segment_with_fallback(
			content,
			theme,
			'error',
			config.separators.usage,
			style_override,
		);
	}
}
