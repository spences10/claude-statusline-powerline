import * as fs from 'node:fs';
import * as path from 'node:path';
import { get_font_profile, get_symbol } from '../font-profiles';
import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { BaseSegment, SegmentData } from './base';

interface ContextInfo {
	cache_hit_rate: number;
	total_cache_tokens: number;
	session_type: 'warm' | 'cold';
}

export class ContextSegment extends BaseSegment {
	name = 'context';
	priority = 45;

	is_enabled(config: StatuslineConfig): boolean {
		return config.segments.context;
	}

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		const context_info = this.get_context_info(data);
		if (!context_info) return null;

		const style_override = this.getSegmentConfig(config);
		const font_profile = get_font_profile(config.font_profile);
		const brain_icon = get_symbol(
			font_profile,
			'brain',
			style_override?.icons,
		);

		let display = '';
		if (context_info.session_type === 'cold') {
			display = `${brain_icon} Cold`;
		} else {
			const format_tokens = (tokens: number): string => {
				if (tokens >= 1000000) {
					return `${(tokens / 1000000).toFixed(1)}M`;
				} else if (tokens >= 1000) {
					return `${(tokens / 1000).toFixed(1)}k`;
				} else {
					return tokens.toString();
				}
			};

			const formatted_tokens = format_tokens(
				context_info.total_cache_tokens,
			);
			display = `${brain_icon} ${formatted_tokens} cached (${context_info.cache_hit_rate}% reused)`;
		}

		const theme = config.current_theme?.segments.context;
		if (!theme) {
			// Fallback if theme is not available
			return this.createSegment(
				display,
				'\x1b[46m', // teal bg fallback
				'\x1b[97m', // white fg fallback
				'\x1b[36m', // teal separator fallback
				config.separators.context,
				style_override,
			);
		}

		return this.createSegment(
			display,
			theme.background,
			theme.foreground,
			theme.separator_color,
			config.separators.context,
			style_override,
		);
	}

	private get_context_info(
		data: ClaudeStatusInput,
	): ContextInfo | null {
		if (!data.session_id) return null;

		// Direct session file path using session ID - no discovery needed
		const session_file = path.join(
			process.env.HOME || '',
			'.claude/projects',
			data.workspace.current_dir.replace(/\//g, '-'),
			`${data.session_id}.jsonl`,
		);

		try {
			const content = fs.readFileSync(session_file, 'utf8');
			let total_cache_read = 0;
			let total_cache_creation = 0;

			// Simple parsing - just sum the cache usage
			for (const line of content.trim().split('\n')) {
				try {
					const entry = JSON.parse(line);
					const usage = entry.message?.usage;
					if (usage) {
						total_cache_read += usage.cache_read_input_tokens || 0;
						total_cache_creation +=
							usage.cache_creation_input_tokens || 0;
					}
				} catch {
					// Skip malformed lines
				}
			}

			const total_cache_tokens =
				total_cache_read + total_cache_creation;
			if (total_cache_tokens === 0) return null;

			const cache_hit_rate = Math.round(
				(total_cache_read / total_cache_tokens) * 100,
			);
			const session_type: 'warm' | 'cold' =
				total_cache_read > 10000 ? 'warm' : 'cold';

			return {
				cache_hit_rate,
				total_cache_tokens: total_cache_read,
				session_type,
			};
		} catch {
			// File doesn't exist or can't be read
			return null;
		}
	}
}
