#!/usr/bin/env node

import { execSync } from 'child_process';
import * as path from 'path';
import {
	DEFAULT_PRICING,
	load_config,
	MODEL_PRICING,
} from './config';
import { get_font_profile } from './font-profiles';
import {
	ClaudeStatusInput,
	GitInfo,
	SeparatorStyle,
	SessionUsage,
} from './types';

// Get the current font profile (Victor Mono by default)
const font_profile = get_font_profile();

// ANSI color codes
const COLORS = {
	reset: '\x1b[0m',
	// Backgrounds
	bg: {
		blue: '\x1b[44m',
		green: '\x1b[42m',
		yellow: '\x1b[43m',
		red: '\x1b[41m',
		purple: '\x1b[45m',
		cyan: '\x1b[46m',
		gray: '\x1b[100m',
	},
	// Foregrounds (for separators)
	fg: {
		blue: '\x1b[34m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		red: '\x1b[31m',
		purple: '\x1b[35m',
		cyan: '\x1b[36m',
		gray: '\x1b[90m',
	},
	white: '\x1b[97m',
	black: '\x1b[30m',
} as const;

function get_git_info(cwd: string): GitInfo | null {
	try {
		// Check if in git repo
		execSync('git rev-parse --git-dir', { cwd, stdio: 'pipe' });

		// Get branch name
		const branch = execSync('git rev-parse --abbrev-ref HEAD', {
			cwd,
			encoding: 'utf8',
		}).trim();

		// Get status
		const status = execSync('git status --porcelain', {
			cwd,
			encoding: 'utf8',
		});
		const is_dirty = status.trim().length > 0;

		return { branch, is_dirty };
	} catch (error) {
		return null;
	}
}

function create_segment(
	content: string,
	bg_color: string,
	fg_color: string = COLORS.white,
): string {
	return `${bg_color}${fg_color} ${content} ${COLORS.reset}`;
}

function create_styled_separator(
	from_color: string,
	to_color: string = '',
	style: SeparatorStyle = 'thick',
): string {
	const separators = font_profile.separators;

	switch (style) {
		case 'thin':
			return `${to_color}${from_color}${separators.basic.rightThin}${COLORS.reset}`;
		case 'thick':
			return `${to_color}${from_color}${separators.basic.right}${COLORS.reset}`;
		case 'flame':
			// Use angly2 since flame glyphs don't work in Victor Mono
			return `${to_color}${from_color}${separators.extra.angly2 || separators.basic.right}${COLORS.reset}`;
		case 'wave':
			// Using curvy separators for wave effect
			return `${to_color}${from_color}${separators.extra.curvy || separators.basic.right}${COLORS.reset}`;
		case 'lightning':
			// Using angular separators for lightning effect
			return `${to_color}${from_color}${separators.extra.angly || separators.basic.right}${COLORS.reset}`;
		case 'curvy':
			return `${to_color}${from_color}${separators.extra.curvy || separators.basic.right}${COLORS.reset}`;
		case 'angly':
			return `${to_color}${from_color}${separators.extra.angly || separators.basic.right}${COLORS.reset}`;
		case 'angly2':
			return `${to_color}${from_color}${separators.extra.angly2 || separators.basic.right}${COLORS.reset}`;
		case 'none':
			return '';
		default:
			return `${to_color}${from_color}${separators.basic.right}${COLORS.reset}`;
	}
}

function build_statusline(data: ClaudeStatusInput): string {
	const cwd = data.workspace?.current_dir || process.cwd();
	const model = data.model?.display_name || 'Claude';
	const config = load_config();

	const segments: string[] = [];

	// Model segment (blue background)
	segments.push(create_segment(` ${model}`, COLORS.bg.blue));
	segments.push(
		create_styled_separator(
			COLORS.fg.blue,
			COLORS.bg.gray,
			config.separators.model,
		),
	);

	// Directory segment (gray background)
	const dir_name = path.basename(cwd);
	segments.push(
		create_segment(
			`${font_profile.symbols.folder} ${dir_name}`,
			COLORS.bg.gray,
		),
	);

	// Git segment (green/red background)
	const git_info = get_git_info(cwd);
	if (git_info) {
		const git_bg = git_info.is_dirty
			? COLORS.bg.yellow
			: COLORS.bg.green;
		const git_fg = git_info.is_dirty
			? COLORS.fg.yellow
			: COLORS.fg.green;
		const status_icon = git_info.is_dirty
			? font_profile.symbols.dirty
			: font_profile.symbols.clean;

		// Use configured separator based on git status
		const dir_to_git_style = git_info.is_dirty
			? config.separators.directory.dirty
			: config.separators.directory.clean;

		const git_end_style = git_info.is_dirty
			? config.separators.git.dirty
			: config.separators.git.clean;

		segments.push(
			create_styled_separator(
				COLORS.fg.gray,
				git_bg,
				dir_to_git_style,
			),
		);
		segments.push(
			create_segment(
				`${font_profile.symbols.branch} ${git_info.branch} ${status_icon}`,
				git_bg,
				COLORS.black,
			),
		);
		segments.push(
			create_styled_separator(
				git_fg,
				COLORS.bg.purple,
				git_end_style,
			),
		);
	} else {
		// No git repo uses configured noGit separator
		segments.push(
			create_styled_separator(
				COLORS.fg.gray,
				COLORS.bg.purple,
				config.separators.directory.noGit,
			),
		);
	}

	// Session segment (purple background) - show usage if available
	if (data.transcript_path) {
		const usage = parse_session_usage(data.transcript_path);

		if (usage) {
			const totalTokens =
				usage.totalInputTokens + usage.totalOutputTokens;
			const costStr =
				usage.totalCost < 0.01
					? '<$0.01'
					: `$${usage.totalCost.toFixed(2)}`;

			segments.push(
				create_segment(
					`💰 ${(totalTokens / 1000).toFixed(0)}k • ${costStr}`,
					COLORS.bg.purple,
				),
			);
		} else {
			segments.push(
				create_segment(`💰 No usage data`, COLORS.bg.purple),
			);
		}

		segments.push(
			create_styled_separator(COLORS.fg.purple, '', 'thick'),
		);
	}

	return segments.join('');
}

function parse_session_usage(
	transcript_path: string,
): SessionUsage | null {
	try {
		const fs = require('fs');
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
		const input_cost =
			(total_input_tokens / 1000000) * pricing.inputTokens;
		const output_cost =
			(total_output_tokens / 1000000) * pricing.outputTokens;
		const cache_cost =
			(total_cache_tokens / 1000000) * pricing.cacheTokens;
		const total_cost = input_cost + output_cost + cache_cost;

		// Calculate session duration in minutes
		let session_duration = 0;
		if (first_timestamp && last_timestamp) {
			session_duration = Math.round(
				(last_timestamp.getTime() - first_timestamp.getTime()) /
					(1000 * 60),
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

function main(): void {
	let input = '';

	// Read from stdin
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', (chunk: string) => {
		input += chunk;
	});

	process.stdin.on('end', () => {
		try {
			const data: ClaudeStatusInput = JSON.parse(input);

			const statusline = build_statusline(data);
			console.log(statusline);
		} catch (error) {
			// Fallback if JSON parsing fails
			console.log(
				`${COLORS.bg.red}${COLORS.white} Error parsing input ${COLORS.reset}`,
			);
		}
	});
}

if (require.main === module) {
	main();
}
