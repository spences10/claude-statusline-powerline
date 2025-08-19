import { DEFAULT_PRICING, MODEL_PRICING } from '../config';
import {
	ClaudeStatusInput,
	SessionUsage,
	StatuslineConfig,
} from '../types';
import { format_tokens } from '../utils/token-formatting';
import { get_usage_db } from '../utils/usage-db';
import { BaseSegment, SegmentData } from './base';

export class SessionSegment extends BaseSegment {
	name = 'session';

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		// First try to get session data from database
		const usage = this.get_session_usage(data);
		if (!usage) {
			return null; // Hide segment if no session data available
		}

		const total_tokens =
			usage.totalInputTokens + usage.totalOutputTokens;
		const cost_str =
			usage.totalCost < 0.01
				? '< $0.01'
				: `$${usage.totalCost.toFixed(2)}`;

		// Calculate context usage
		const pricing =
			MODEL_PRICING[usage.modelUsed || ''] || DEFAULT_PRICING;
		const context_used = total_tokens;
		const context_remaining = pricing.context_window - context_used;
		const context_percent = Math.round(
			(context_used / pricing.context_window) * 100,
		);

		// Format context display
		let context_display = '';
		if (context_percent >= 90) {
			context_display = ` !${context_percent}%`;
		} else if (context_percent >= 75) {
			context_display = ` ${context_percent}%`;
		} else {
			context_display = ` ${Math.round(context_remaining / 1000)}k left`;
		}

		const { style_override, get_icon } = this.setup_segment(config);
		const theme = config.current_theme?.segments.session;
		const cost_icon = get_icon('cost');
		const content = `${cost_icon} ${format_tokens(total_tokens)} • ${cost_str}${context_display}`;

		return this.create_segment_with_fallback(
			content,
			theme,
			'session',
			config.separators.session,
			style_override,
		);
	}

	private get_session_usage(
		data: ClaudeStatusInput,
	): SessionUsage | null {
		try {
			// Query database for session data
			const db = get_usage_db();
			const session = db.get_session(data.session_id);

			if (session) {
				// Convert database record to SessionUsage format
				return {
					totalInputTokens: session.input_tokens,
					totalOutputTokens: session.output_tokens,
					totalCacheTokens: session.cache_tokens,
					totalCost: session.cost,
					modelUsed: session.model,
					sessionDuration: this.calculate_session_duration(
						session.start_time,
						session.end_time,
					),
				};
			}

			// No session found in database
			return null;
		} catch (error) {
			// Database error - don't show segment
			return null;
		}
	}

	private calculate_session_duration(
		start_time: string,
		end_time?: string,
	): number {
		if (!start_time || !end_time) {
			return 0;
		}

		const start = new Date(start_time);
		const end = new Date(end_time);
		return Math.round(
			(end.getTime() - start.getTime()) / (1000 * 60),
		); // duration in minutes
	}
}
