import * as fs from 'node:fs';
import { DEFAULT_PRICING, MODEL_PRICING } from '../config';
import { SessionRecord } from '../types';
import { get_usage_db } from './usage-db';

interface TranscriptEntry {
	timestamp: string;
	type: string;
	message?: {
		model?: string;
		usage?: {
			input_tokens: number;
			output_tokens: number;
			cache_creation_input_tokens?: number;
			cache_read_input_tokens?: number;
		};
	};
}

export function record_session_from_transcript(
	transcript_path: string,
	session_id: string,
	project_dir?: string,
): void {
	try {
		if (!fs.existsSync(transcript_path)) {
			return;
		}

		const content = fs.readFileSync(transcript_path, 'utf8');
		const lines = content.trim().split('\n');

		let total_input_tokens = 0;
		let total_output_tokens = 0;
		let total_cache_tokens = 0;
		let model_used = '';
		let start_time: Date | null = null;
		let end_time: Date | null = null;

		for (const line of lines) {
			try {
				const entry: TranscriptEntry = JSON.parse(line);

				// Track session timing
				if (entry.timestamp) {
					const timestamp = new Date(entry.timestamp);
					if (!start_time || timestamp < start_time) {
						start_time = timestamp;
					}
					if (!end_time || timestamp > end_time) {
						end_time = timestamp;
					}
				}

				// Extract usage data from assistant messages
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

		// Calculate cost using model-specific pricing
		const pricing = MODEL_PRICING[model_used] || DEFAULT_PRICING;
		const input_cost =
			(total_input_tokens / 1000000) * pricing.input_tokens;
		const output_cost =
			(total_output_tokens / 1000000) * pricing.output_tokens;
		const cache_cost =
			(total_cache_tokens / 1000000) * pricing.cache_tokens;
		const total_cost = input_cost + output_cost + cache_cost;

		// Record session in database
		const session: Omit<SessionRecord, 'id'> = {
			session_id,
			model: model_used || 'unknown',
			start_time:
				start_time?.toISOString() || new Date().toISOString(),
			end_time: end_time?.toISOString(),
			input_tokens: total_input_tokens,
			output_tokens: total_output_tokens,
			cache_tokens: total_cache_tokens,
			cost: total_cost,
			project_dir,
		};

		const db = get_usage_db();
		db.record_session(session);
	} catch (error) {
		// Silent fail - don't break statusline
		console.error('Failed to record session:', error);
	}
}

export function ensure_session_recorded(
	transcript_path?: string,
	session_id?: string,
	project_dir?: string,
): void {
	if (!transcript_path || !session_id) {
		return;
	}

	// Record session data asynchronously to avoid blocking
	setTimeout(() => {
		record_session_from_transcript(
			transcript_path,
			session_id,
			project_dir,
		);
	}, 0);
}
