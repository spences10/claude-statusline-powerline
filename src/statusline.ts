#!/usr/bin/env node

import { execSync } from 'child_process';
import * as path from 'path';
import { load_config } from './config';
import { ClaudeStatusInput, GitInfo, SeparatorStyle } from './types';

// Powerline symbols (using Unicode escape sequences like claude-powerline)
const SEPARATORS = {
	left: '\uE0B2',
	right: '\uE0B0',
	leftThin: '\uE0B3',
	rightThin: '\uE0B1',
} as const;

// Git symbols that work with most powerline fonts
const SYMBOLS = {
	branch: '\uE0A0', // Git branch symbol (same as claude-powerline)
	folder: '📁',
} as const;

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
	switch (style) {
		case 'thin':
			return `${to_color}${from_color}${SEPARATORS.rightThin}${COLORS.reset}`;
		case 'thick':
			return `${to_color}${from_color}${SEPARATORS.right}${COLORS.reset}`;
		case 'flame':
			// Double separator for "flame" effect
			return `${to_color}${from_color}${SEPARATORS.right}${SEPARATORS.rightThin}${COLORS.reset}`;
		case 'wave':
			// Alternating thick/thin for wave effect
			return `${to_color}${from_color}${SEPARATORS.rightThin}${SEPARATORS.right}${COLORS.reset}`;
		case 'lightning':
			// Triple separator for lightning effect
			return `${to_color}${from_color}${SEPARATORS.right}${SEPARATORS.rightThin}${SEPARATORS.right}${COLORS.reset}`;
		case 'none':
			return '';
		default:
			return `${to_color}${from_color}${SEPARATORS.right}${COLORS.reset}`;
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
			config.separators.modelToDirectory,
		),
	);

	// Directory segment (gray background)
	const dir_name = path.basename(cwd);
	segments.push(
		create_segment(`${SYMBOLS.folder} ${dir_name}`, COLORS.bg.gray),
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
		const status_icon = git_info.is_dirty ? '±' : '✓';

		// Use configured separator based on git status
		const dir_to_git_style = git_info.is_dirty
			? config.separators.directoryToGit.dirty
			: config.separators.directoryToGit.clean;

		const git_end_style = git_info.is_dirty
			? config.separators.gitEnd.dirty
			: config.separators.gitEnd.clean;

		segments.push(
			create_styled_separator(
				COLORS.fg.gray,
				git_bg,
				dir_to_git_style,
			),
		);
		segments.push(
			create_segment(
				`${SYMBOLS.branch} ${git_info.branch} ${status_icon}`,
				git_bg,
				COLORS.black,
			),
		);
		segments.push(create_styled_separator(git_fg, '', git_end_style));
	} else {
		// No git repo uses configured noGit separator
		segments.push(
			create_styled_separator(
				COLORS.fg.gray,
				'',
				config.separators.noGit,
			),
		);
	}

	return segments.join('');
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
