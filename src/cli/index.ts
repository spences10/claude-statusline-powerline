import {
	create_default_config,
	open_config_in_editor,
	reset_config,
	show_config_info,
	show_config_path,
	validate_config,
} from './commands/config';
import {
	clean_database,
	reset_database,
	show_database_info,
} from './commands/database';
import { demo_theme, run_demo, test_segments } from './commands/demo';
import {
	install_statusline,
	uninstall_statusline,
} from './commands/install';
import {
	export_data,
	show_cache_stats,
	show_daily_stats,
	show_project_stats,
	show_stats,
	show_tool_stats,
} from './commands/stats';
import {
	list_separators,
	list_themes,
	preview_theme,
} from './commands/themes';
import { show_help, show_version } from './utils/help';

export function run_cli(): void {
	const args = process.argv.slice(2);

	// If no args, check if stdin has data (normal statusline operation)
	if (args.length === 0) {
		// Check if we have stdin data
		if (process.stdin.isTTY) {
			// No stdin data, show help
			show_help();
			return;
		}

		// Has stdin data, run normal statusline operation
		const { main } = require('../statusline');
		main();
		return;
	}

	const command = args[0];

	switch (command) {
		// Help & Version
		case '--help':
		case '-h':
			show_help();
			break;

		case '--version':
		case '-v':
			show_version();
			break;

		// Configuration
		case '--config':
			open_config_in_editor();
			break;

		case '--config-create':
			create_default_config();
			break;

		case '--config-path':
			show_config_path();
			break;

		case '--config-info':
			show_config_info();
			break;

		case '--validate-config':
			validate_config();
			break;

		case '--reset-config':
			reset_config();
			break;

		// Demo & Testing
		case '--demo':
			run_demo();
			break;

		case '--demo-theme':
			if (args[1]) {
				demo_theme(args[1]);
			} else {
				console.error(
					'❌ Please specify a theme name: --demo-theme <theme>',
				);
				process.exit(1);
			}
			break;

		case '--test-segments':
			test_segments();
			break;

		// Themes
		case '--list-themes':
			list_themes();
			break;

		case '--preview-theme':
			if (args[1]) {
				preview_theme(args[1]);
			} else {
				console.error(
					'❌ Please specify a theme name: --preview-theme <theme>',
				);
				process.exit(1);
			}
			break;

		case '--list-separators':
			list_separators();
			break;

		// Usage Analytics
		case '--stats':
			show_stats();
			break;

		case '--stats-daily':
			show_daily_stats();
			break;

		case '--stats-project':
			show_project_stats();
			break;

		case '--stats-cache':
			show_cache_stats();
			break;

		case '--stats-tools':
			show_tool_stats();
			break;

		case '--export-data':
			if (args[1]) {
				export_data(args[1]);
			} else {
				console.error(
					'❌ Please specify a format: --export-data <json|csv>',
				);
				process.exit(1);
			}
			break;

		// Database Management
		case '--database-info':
			show_database_info();
			break;

		case '--clean-database':
			clean_database();
			break;

		case '--reset-database':
			reset_database();
			break;

		// Installation
		case '--install':
			install_statusline();
			break;

		case '--uninstall':
			uninstall_statusline();
			break;

		default:
			console.error(`❌ Unknown command: ${command}`);
			console.log('Use --help to see available commands');
			process.exit(1);
	}
}
