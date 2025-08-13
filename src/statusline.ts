#!/usr/bin/env node

import './segments'; // Auto-register segments
import { build_statusline } from './core/statusline';
import { ClaudeStatusInput } from './types';

function show_help(): void {
	console.log('Claude Statusline Powerline');
	console.log('==========================');
	console.log('');
	console.log('Usage:');
	console.log('  claude-statusline                    Run statusline (reads JSON from stdin)');
	console.log('  claude-statusline --config           Open config file in editor');
	console.log('  claude-statusline --config-create    Create default config file');
	console.log('  claude-statusline --config-path      Show config file location');
	console.log('  claude-statusline --help             Show this help');
	console.log('');
	console.log('Config file: ~/.claude/claude-statusline-powerline.json');
}

function main() {
	// Check for CLI flags first
	const args = process.argv.slice(2);
	
	if (args.includes('--help') || args.includes('-h')) {
		show_help();
		return;
	}
	
	if (args.includes('--config') || args.includes('--config-create') || args.includes('--config-path')) {
		// Delegate to config CLI
		require('./cli-config');
		return;
	}

	let input = '';

	// Read from stdin
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', (chunk) => {
		input += chunk;
	});

	process.stdin.on('end', () => {
		try {
			const data: ClaudeStatusInput = JSON.parse(input);
			const statusline = build_statusline(data);
			console.log(statusline);
		} catch (error) {
			// Fallback if JSON parsing fails
			const COLORS = {
				bg: { red: '\x1b[41m' },
				white: '\x1b[97m',
				reset: '\x1b[0m',
			};
			console.log(`${COLORS.bg.red}${COLORS.white} Error parsing input ${COLORS.reset}`);
		}
	});
}

if (require.main === module) {
	main();
}