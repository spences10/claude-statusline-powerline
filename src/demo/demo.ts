import { spawn } from 'child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ClaudeStatusInput } from '../types';

const BASE_DATA: ClaudeStatusInput = {
	session_id: 'demo-session',
	model: {
		id: 'claude-sonnet-4-20250514',
		display_name: 'Claude Sonnet 4',
	},
	workspace: {
		current_dir: '/home/scott/repos/claude-statusline-powerline',
	},
	transcript_path: 'demo-transcript.jsonl',
};

interface DemoConfig {
	color_theme?: string;
	theme?: string;
	font_profile?: string;
}

const TEMP_CONFIG_PATH = path.join(__dirname, '.temp-demo-config.json');

function write_temp_config(config: DemoConfig): string {
	const absolute_config_path = path.resolve(TEMP_CONFIG_PATH);
	fs.writeFileSync(absolute_config_path, JSON.stringify(config, null, 2));
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
	config: DemoConfig,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const config_file = write_temp_config(config);

		const child = spawn(
			'node',
			[path.join(__dirname, '../statusline.js')],
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

async function demo_powerline() {
	console.log('==================================================');
	console.log('🎨 Powerline Font Demo');
	console.log('==================================================\n');

	const combinations = [
		{ color: 'dark', style: 'minimal', desc: 'Dark + Minimal' },
		{ color: 'dark', style: 'expressive', desc: 'Dark + Expressive' },
		{ color: 'dark', style: 'curvy', desc: 'Dark + Curvy' },
		{ color: 'electric', style: 'minimal', desc: 'Electric + Minimal' },
		{ color: 'electric', style: 'expressive', desc: 'Electric + Expressive' },
		{ color: 'electric', style: 'electric', desc: 'Electric + Electric' },
		{ color: 'night-owl', style: 'minimal', desc: 'Night Owl + Minimal' },
		{ color: 'night-owl', style: 'expressive', desc: 'Night Owl + Expressive' },
	];

	for (const combo of combinations) {
		console.log(`--- ${combo.desc} ---`);

		const config: DemoConfig = {
			color_theme: combo.color,
			theme: combo.style,
			font_profile: 'powerline',
		};

		try {
			const output = await run_statusline_with_config(BASE_DATA, config);
			console.log(output);
		} catch (error) {
			console.error(`Error:`, error);
		}
		console.log('');
	}
}

async function demo_nerd_font() {
	console.log('==================================================');
	console.log('⚡ Nerd Font Demo');
	console.log('==================================================\n');

	const combinations = [
		{ color: 'dark', style: 'minimal', desc: 'Dark + Minimal' },
		{ color: 'dark', style: 'angular', desc: 'Dark + Angular' },
		{ color: 'dark', style: 'curvy', desc: 'Dark + Curvy' },
		{ color: 'electric', style: 'subtle', desc: 'Electric + Subtle' },
		{ color: 'electric', style: 'electric', desc: 'Electric + Electric' },
		{ color: 'electric', style: 'angular', desc: 'Electric + Angular' },
		{ color: 'night-owl', style: 'curvy', desc: 'Night Owl + Curvy' },
		{ color: 'night-owl', style: 'subtle', desc: 'Night Owl + Subtle' },
	];

	for (const combo of combinations) {
		console.log(`--- ${combo.desc} ---`);

		const config: DemoConfig = {
			color_theme: combo.color,
			theme: combo.style,
			font_profile: 'nerd-font',
		};

		try {
			const output = await run_statusline_with_config(BASE_DATA, config);
			console.log(output);
		} catch (error) {
			console.error(`Error:`, error);
		}
		console.log('');
	}
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

export { demo_powerline, demo_nerd_font };
