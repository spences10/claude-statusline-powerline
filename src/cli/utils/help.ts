export function show_help(): void {
	console.log('Claude Statusline Powerline');
	console.log('==========================\n');

	console.log('Usage:');
	console.log('  claude-statusline [command] [options]\n');

	console.log('Commands:');
	console.log(
		'  (no args)                    Run statusline (reads JSON from stdin)',
	);
	console.log(
		'  --help, -h                   Show this help message',
	);
	console.log(
		'  --version, -v                Show version information\n',
	);

	console.log('Configuration:');
	console.log(
		'  --config                     Open config file in editor',
	);
	console.log(
		'  --config-create              Create default config file',
	);
	console.log(
		'  --config-path                Show config file location',
	);
	console.log(
		'  --config-info                Show config information',
	);
	console.log(
		'  --reset-config               Reset config to defaults',
	);
	console.log(
		'  --validate-config            Validate current config file\n',
	);

	console.log('Themes & Demo:');
	console.log('  --demo                       Run demo mode');
	console.log('  --demo-theme <theme>         Demo specific theme');
	console.log(
		'  --test-segments              Test all segments with current config',
	);
	console.log(
		'  --list-themes                Show available color themes',
	);
	console.log(
		'  --preview-theme <theme>      Preview specific theme',
	);
	console.log(
		'  --list-separators            Show available separator styles\n',
	);

	console.log('Usage Analytics:');
	console.log('  --stats                      Show usage statistics');
	console.log(
		'  --stats-daily                Show daily usage breakdown',
	);
	console.log(
		'  --stats-project              Show per-project usage',
	);
	console.log(
		'  --stats-cache                Show cache efficiency analysis',
	);
	console.log(
		'  --stats-tools                Show tool usage analytics',
	);
	console.log(
		'  --export-data <format>       Export usage data (json/csv)\n',
	);

	console.log('Database Management:');
	console.log(
		'  --database-info              Show database statistics',
	);
	console.log(
		'  --clean-database             Clean old database entries',
	);
	console.log(
		'  --reset-database             Reset/recreate database\n',
	);

	console.log('Installation:');
	console.log(
		'  --install                    Install statusline to Claude settings',
	);
	console.log(
		'  --uninstall                  Remove statusline from Claude settings\n',
	);

	console.log('Examples:');
	console.log('  claude-statusline --demo');
	console.log('  claude-statusline --stats');
	console.log('  claude-statusline --preview-theme electric');
	console.log('  claude-statusline --export-data json > usage.json');
}

export function show_version(): void {
	try {
		const package_json = require('../../../package.json');
		console.log(
			`claude-statusline-powerline v${package_json.version}`,
		);
	} catch {
		console.log('claude-statusline-powerline (version unknown)');
	}
}
