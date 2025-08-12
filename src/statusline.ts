#!/usr/bin/env node

import './segments'; // Auto-register segments
import { build_statusline } from './core/statusline';
import { ClaudeStatusInput } from './types';

function main() {
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