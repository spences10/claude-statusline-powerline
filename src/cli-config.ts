#!/usr/bin/env node

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { DEFAULT_CONFIG_TEMPLATE, get_config_path } from './config';

function ensure_claude_directory(): void {
	const claude_dir = path.dirname(get_config_path());
	if (!fs.existsSync(claude_dir)) {
		fs.mkdirSync(claude_dir, { recursive: true });
		console.log(`Created Claude directory: ${claude_dir}`);
	}
}

function create_default_config(): void {
	const config_path = get_config_path();
	ensure_claude_directory();

	fs.writeFileSync(
		config_path,
		JSON.stringify(DEFAULT_CONFIG_TEMPLATE, null, 2),
	);

	console.log(`Created default config at: ${config_path}`);
}

function open_config_in_editor(): void {
	const config_path = get_config_path();

	// Create config if it doesn't exist
	if (!fs.existsSync(config_path)) {
		create_default_config();
	}

	// Try to open in user's preferred editor
	const editor =
		process.env.EDITOR || process.env.VISUAL || 'code' || 'nano';

	console.log(`Opening config in ${editor}: ${config_path}`);

	const child = spawn(editor, [config_path], {
		stdio: 'inherit',
		detached: true,
	});

	child.on('error', (error) => {
		console.error(`Failed to open editor: ${error.message}`);
		console.log(`You can manually edit: ${config_path}`);
	});
}

function show_config_info(): void {
	const config_path = get_config_path();

	console.log('Claude Statusline Powerline Configuration');
	console.log('=====================================');
	console.log(`Config location: ${config_path}`);
	console.log(`Exists: ${fs.existsSync(config_path) ? 'Yes' : 'No'}`);
	console.log('');
	console.log('Commands:');
	console.log(
		'  claude-statusline --config         Open config in editor',
	);
	console.log(
		'  claude-statusline --config-create  Create default config',
	);
	console.log(
		'  claude-statusline --config-path    Show config file path',
	);
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--config')) {
	open_config_in_editor();
} else if (args.includes('--config-create')) {
	create_default_config();
} else if (args.includes('--config-path')) {
	console.log(get_config_path());
} else if (args.includes('--config-info')) {
	show_config_info();
} else {
	show_config_info();
}
