import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ClaudeStatusInput, FontProfile } from '../types';
import { DEMO_CONFIGS } from './demo-configs';
import {
	MOCK_USAGE_SCENARIOS,
	create_mock_transcript,
} from './mock-data';

const BASE_DATA: ClaudeStatusInput = {
	session_id: 'demo-session',
	model: {
		id: 'claude-sonnet-4-20250514',
		display_name: 'Sonnet 4',
	},
	workspace: {
		current_dir: process.cwd(),
	},
	transcript_path: '',
};

const TEMP_CONFIG_PATH = path.join(
	__dirname,
	'.temp-demo-config.json',
);

function write_temp_config(config: any): string {
	const absolute_config_path = path.resolve(TEMP_CONFIG_PATH);
	fs.writeFileSync(
		absolute_config_path,
		JSON.stringify(config, null, 2),
	);
	return absolute_config_path;
}

function cleanup_temp_config(): void {
	const absolute_config_path = path.resolve(TEMP_CONFIG_PATH);
	if (fs.existsSync(absolute_config_path)) {
		fs.unlinkSync(absolute_config_path);
	}
}

function run_statusline_with_config(
	data: ClaudeStatusInput,
	config: any,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const config_file = write_temp_config(config);

		const child = spawn(
			'node',
			[path.join(__dirname, '../../dist/statusline.js')],
			{
				stdio: ['pipe', 'pipe', 'pipe'],
				cwd: process.cwd(),
				env: {
					...process.env,
					STATUSLINE_CONFIG: config_file,
				},
			},
		);

		child.stdin.write(JSON.stringify(data));
		child.stdin.end();

		let output = '';
		child.stdout.on('data', (chunk) => {
			output += chunk.toString();
		});

		child.stderr.on('data', (chunk) => {
			console.error('Error:', chunk.toString());
		});

		child.on('close', (code) => {
			cleanup_temp_config();
			if (code === 0) {
				resolve(output.trim());
			} else {
				reject(new Error(`Process exited with code ${code}`));
			}
		});
	});
}

async function run_demo(
	font_profile: FontProfile,
	title: string,
	icon: string,
): Promise<void> {
	console.log('==================================================');
	console.log(`${icon} ${title}`);
	console.log('==================================================\n');

	for (const [index, config] of DEMO_CONFIGS.entries()) {
		console.log(config.description);

		const scenario =
			MOCK_USAGE_SCENARIOS[index % MOCK_USAGE_SCENARIOS.length];

		const temp_transcript_path = path.join(
			__dirname,
			`.temp-demo-transcript-${Date.now()}.jsonl`,
		);
		fs.writeFileSync(
			temp_transcript_path,
			create_mock_transcript(scenario),
		);

		// Create mock session file for context segment
		const workspace_dir = BASE_DATA.workspace.current_dir.replace(
			/\//g,
			'-',
		);
		const session_dir = path.join(
			process.env.HOME || '',
			'.claude/projects',
			workspace_dir,
		);
		const session_file = path.join(
			session_dir,
			`${BASE_DATA.session_id}.jsonl`,
		);

		// Ensure directory exists
		fs.mkdirSync(session_dir, { recursive: true });
		fs.writeFileSync(session_file, create_mock_transcript(scenario));

		const demo_data = {
			...BASE_DATA,
			transcript_path: temp_transcript_path,
		};

		const config_with_font = {
			...config,
			font_profile: font_profile,
		};

		try {
			const output = await run_statusline_with_config(
				demo_data,
				config_with_font,
			);
			console.log(output);
		} catch (error) {
			console.error(`Error:`, error);
		} finally {
			if (fs.existsSync(temp_transcript_path)) {
				fs.unlinkSync(temp_transcript_path);
			}
			if (fs.existsSync(session_file)) {
				fs.unlinkSync(session_file);
			}
		}
		console.log('');
	}
}

async function demo_powerline() {
	return run_demo('powerline', 'Powerline Font Demo', '🎨');
}

async function demo_nerd_font() {
	return run_demo('nerd-font', 'Nerd Font Demo', '⚡');
}

async function main() {
	const args = process.argv.slice(2);
	const show_powerline = args.includes('--powerline');
	const show_nerd_font = args.includes('--nerd-font');

	if (!show_powerline && !show_nerd_font) {
		console.log('🎨 Claude Statusline Powerline Demo');
		console.log('Usage: node demo.js [--powerline] [--nerd-font]\n');
		console.log('Options:');
		console.log('  --powerline   Show powerline font combinations');
		console.log('  --nerd-font   Show nerd font combinations');
		console.log('  (both flags)  Show both demos\n');
		return;
	}

	try {
		if (show_powerline) {
			await demo_powerline();
		}

		if (show_nerd_font) {
			await demo_nerd_font();
		}
	} catch (error) {
		console.error('Demo failed:', error);
		process.exit(1);
	} finally {
		cleanup_temp_config();
	}
}

if (require.main === module) {
	main().catch(console.error);
}

export { demo_nerd_font, demo_powerline };
