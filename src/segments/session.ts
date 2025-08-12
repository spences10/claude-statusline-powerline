import { BaseSegment, SegmentData } from './base';
import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { MODEL_PRICING, DEFAULT_PRICING } from '../config';
import * as fs from 'fs';

// ANSI color codes
const COLORS = {
	bg: {
		purple: '\x1b[45m',
	},
	fg: {
		purple: '\x1b[35m',
	},
	white: '\x1b[97m',
};

interface SessionUsage {
	totalInputTokens: number;
	totalOutputTokens: number;
	totalCacheTokens: number;
	totalCost: number;
	modelUsed?: string;
	sessionDuration?: number;
}

export class SessionSegment extends BaseSegment {
	name = 'session';
	priority = 40;

	is_enabled(config: StatuslineConfig): boolean {
		return config.segments.session;
	}

	build(data: ClaudeStatusInput, config: StatuslineConfig): SegmentData | null {
		if (!data.transcript_path) {
			return null; // Hide segment if no session data
		}

		const usage = this.parseSessionUsage(data.transcript_path);
		if (!usage) {
			return null; // Hide segment if parsing fails
		}

		const total_tokens = usage.totalInputTokens + usage.totalOutputTokens;
		const cost_str = usage.totalCost < 0.01
			? '< $0.01'
			: `$${usage.totalCost.toFixed(2)}`;

		// Calculate context usage
		const pricing = MODEL_PRICING[usage.modelUsed || ''] || DEFAULT_PRICING;
		const context_used = total_tokens;
		const context_remaining = pricing.contextWindow - context_used;
		const context_percent = Math.round((context_used / pricing.contextWindow) * 100);

		// Format context display
		let context_display = '';
		if (context_percent >= 90) {
			context_display = ` !${context_percent}%`;
		} else if (context_percent >= 75) {
			context_display = ` ${context_percent}%`;
		} else {
			context_display = ` ${Math.round(context_remaining / 1000)}k left`;
		}

		const theme = config.currentTheme?.segments.session;
		if (!theme) {
			// Fallback colors
			return this.createSegment(
				`💰 ${(total_tokens / 1000).toFixed(0)}k • ${cost_str}${context_display}`,
				COLORS.bg.purple,
				COLORS.white,
				COLORS.fg.purple,
			);
		}

		return this.createSegment(
			`💰 ${(total_tokens / 1000).toFixed(0)}k • ${cost_str}${context_display}`,
			theme.background,
			theme.foreground,
			theme.separatorColor,
		);
	}

	private parseSessionUsage(transcript_path: string): SessionUsage | null {
		try {
			if (!fs.existsSync(transcript_path)) {
				return null;
			}

			const content = fs.readFileSync(transcript_path, 'utf8');
			const lines = content.trim().split('\n');

			let total_input_tokens = 0;
			let total_output_tokens = 0;
			let total_cache_tokens = 0;
			let model_used = '';
			let first_timestamp: Date | null = null;
			let last_timestamp: Date | null = null;

			for (const line of lines) {
				try {
					const entry = JSON.parse(line);

					// Track session timing
					if (entry.timestamp) {
						const timestamp = new Date(entry.timestamp);
						if (!first_timestamp || timestamp < first_timestamp) {
							first_timestamp = timestamp;
						}
						if (!last_timestamp || timestamp > last_timestamp) {
							last_timestamp = timestamp;
						}
					}

					if (entry.type === 'assistant' && entry.message?.usage) {
						const usage = entry.message.usage;
						total_input_tokens += usage.input_tokens || 0;
						total_output_tokens += usage.output_tokens || 0;
						total_cache_tokens +=
							(usage.cache_creation_input_tokens || 0) +
							(usage.cache_read_input_tokens || 0);

						// Extract model info
						if (entry.message.model && !model_used) {
							model_used = entry.message.model;
						}
					}
				} catch (parseError) {
					// Skip malformed lines
					continue;
				}
			}

			// Get pricing for the model used
			const pricing = MODEL_PRICING[model_used] || DEFAULT_PRICING;

			// Calculate cost using model-specific pricing
			const input_cost = (total_input_tokens / 1000000) * pricing.inputTokens;
			const output_cost = (total_output_tokens / 1000000) * pricing.outputTokens;
			const cache_cost = (total_cache_tokens / 1000000) * pricing.cacheTokens;
			const total_cost = input_cost + output_cost + cache_cost;

			// Calculate session duration in minutes
			let session_duration = 0;
			if (first_timestamp && last_timestamp) {
				session_duration = Math.round(
					(last_timestamp.getTime() - first_timestamp.getTime()) / (1000 * 60),
				);
			}

			return {
				totalInputTokens: total_input_tokens,
				totalOutputTokens: total_output_tokens,
				totalCacheTokens: total_cache_tokens,
				totalCost: total_cost,
				modelUsed: model_used,
				sessionDuration: session_duration,
			};
		} catch (error) {
			return null;
		}
	}
}