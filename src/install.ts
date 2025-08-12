#!/usr/bin/env node

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

const CLAUDE_SETTINGS_DIR = path.join(os.homedir(), '.claude');
const CLAUDE_SETTINGS_FILE = path.join(
	CLAUDE_SETTINGS_DIR,
	'settings.json',
);

function ensure_claude_dir(): void {
	if (!fs.existsSync(CLAUDE_SETTINGS_DIR)) {
		fs.mkdirSync(CLAUDE_SETTINGS_DIR, { recursive: true });
		console.log(
			`✅ Created .claude directory at ${CLAUDE_SETTINGS_DIR}`,
		);
	}
}

function get_statusline_command(): string {
	// Use the direct binary name - works regardless of package manager
	return 'claude-statusline';
}

function update_settings(): void {
	const statusline_command = get_statusline_command();

	let settings = {};

	// Read existing settings if they exist
	if (fs.existsSync(CLAUDE_SETTINGS_FILE)) {
		try {
			const settings_content = fs.readFileSync(
				CLAUDE_SETTINGS_FILE,
				'utf8',
			);
			settings = JSON.parse(settings_content);
		} catch (error) {
			console.warn(
				'⚠️  Could not parse existing settings.json, creating new one',
			);
		}
	}

	// Update statusLine configuration
	(settings as any).statusLine = {
		type: 'command',
		command: statusline_command,
	};

	// Write updated settings
	fs.writeFileSync(
		CLAUDE_SETTINGS_FILE,
		JSON.stringify(settings, null, 2),
	);

	console.log(
		`✅ Updated Claude settings at ${CLAUDE_SETTINGS_FILE}`,
	);
	console.log(
		`📊 Statusline configured to use: ${statusline_command}`,
	);
}

function main(): void {
	console.log('🚀 Installing claude-statusline-powerline...\n');

	try {
		ensure_claude_dir();
		update_settings();

		console.log('\n🎉 Installation complete!');
		console.log('💡 Your Claude Code statusline should now show:');
		console.log(
			'   📱 Model name  📁 Directory  🌿 Git branch & status',
		);
		console.log('\n🔄 Restart Claude Code to see the changes.');
	} catch (error) {
		console.error('❌ Installation failed:', error);
		process.exit(1);
	}
}

if (require.main === module) {
	main();
}
