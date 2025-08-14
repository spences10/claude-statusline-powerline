import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ClaudeStatusInput, SeparatorConfig } from '../types';

// Mock session usage scenarios
const USAGE_SCENARIOS = {
	light: {
		input_tokens: 800,
		output_tokens: 400,
		cache_tokens: 200,
		description: 'Light usage',
	},
	medium: {
		input_tokens: 5000,
		output_tokens: 3200,
		cache_tokens: 1500,
		description: 'Medium usage',
	},
	heavy: {
		input_tokens: 45000,
		output_tokens: 32000,
		cache_tokens: 8000,
		description: 'Heavy usage',
	},
};

function create_mock_transcript(
	usage: typeof USAGE_SCENARIOS.light,
): string {
	const now = new Date();
	const earlier = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago

	const mock_transcript = [
		{
			type: 'user',
			timestamp: earlier.toISOString(),
			message: { role: 'user', content: 'Help me with my project' },
		},
		{
			type: 'assistant',
			timestamp: now.toISOString(),
			message: {
				role: 'assistant',
				model: 'claude-sonnet-4-20250514',
				usage: {
					input_tokens: usage.input_tokens,
					output_tokens: usage.output_tokens,
					cache_creation_input_tokens: Math.floor(
						usage.cache_tokens * 0.3,
					),
					cache_read_input_tokens: Math.floor(
						usage.cache_tokens * 0.7,
					),
				},
				content: 'Here is my response...',
			},
		},
	];

	return mock_transcript
		.map((entry) => JSON.stringify(entry))
		.join('\n');
}

const BASE_DATA: ClaudeStatusInput = {
	session_id: 'demo-session',
	model: {
		id: 'claude-sonnet-4-20250514',
		display_name: 'Claude Sonnet 4',
	},
	workspace: {
		current_dir: process.cwd(),
	},
	// This will be overridden per demo with mock data
	transcript_path: '',
};

interface DemoConfig {
	_demo_config?: boolean;
	color_theme?: string;
	theme?: string;
	font_profile?: string;
	display?: {
		lines: Array<{
			segments: {
				model?: boolean;
				directory?: boolean;
				git?: boolean;
				session?: boolean;
			};
		}>;
	};
	segments?: {
		model?: boolean;
		directory?: boolean;
		git?: boolean;
		session?: boolean;
	};
	separators?: SeparatorConfig;
}

const TEMP_CONFIG_PATH = path.join(
	__dirname,
	'.temp-demo-config.json',
);

function write_temp_config(config: DemoConfig): string {
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
	config: DemoConfig,
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

// Comprehensive combinations covering all variations
const ALL_COMBINATIONS = [
	// Basic theme combinations
	{
		color: 'dark',
		style: 'minimal',
		desc: 'Dark + Minimal',
		layout: 'single',
	},
	{
		color: 'dark',
		style: 'expressive',
		desc: 'Dark + Expressive',
		layout: 'single',
	},
	{
		color: 'dark',
		style: 'curvy',
		desc: 'Dark + Curvy',
		layout: 'single',
	},
	{
		color: 'dark',
		style: 'angular',
		desc: 'Dark + Angular',
		layout: 'single',
	},
	{
		color: 'dark',
		style: 'double_chevron',
		desc: 'Dark + Double Chevron',
		layout: 'single',
	},

	{
		color: 'electric',
		style: 'minimal',
		desc: 'Electric + Minimal',
		layout: 'single',
	},
	{
		color: 'electric',
		style: 'expressive',
		desc: 'Electric + Expressive',
		layout: 'single',
	},
	{
		color: 'electric',
		style: 'electric',
		desc: 'Electric + Electric',
		layout: 'single',
	},
	{
		color: 'electric',
		style: 'subtle',
		desc: 'Electric + Subtle',
		layout: 'single',
	},

	{
		color: 'night-owl',
		style: 'minimal',
		desc: 'Night Owl + Minimal',
		layout: 'single',
	},
	{
		color: 'night-owl',
		style: 'expressive',
		desc: 'Night Owl + Expressive',
		layout: 'single',
	},
	{
		color: 'night-owl',
		style: 'curvy',
		desc: 'Night Owl + Curvy',
		layout: 'single',
	},
	{
		color: 'night-owl',
		style: 'angular',
		desc: 'Night Owl + Angular',
		layout: 'single',
	},

	// Multi-line layouts
	{
		color: 'dark',
		style: 'minimal',
		desc: 'Dark + Minimal (2-line)',
		layout: 'two-line',
	},
	{
		color: 'electric',
		style: 'expressive',
		desc: 'Electric + Expressive (2-line)',
		layout: 'two-line',
	},
	{
		color: 'night-owl',
		style: 'curvy',
		desc: 'Night Owl + Curvy (2-line)',
		layout: 'two-line',
	},

	// Minimal segment combinations
	{
		color: 'dark',
		style: 'minimal',
		desc: 'Dark + Minimal (model only)',
		layout: 'minimal',
	},
	{
		color: 'electric',
		style: 'electric',
		desc: 'Electric + Electric (git focus)',
		layout: 'git-focus',
	},
	{
		color: 'night-owl',
		style: 'expressive',
		desc: 'Night Owl + Expressive (workspace)',
		layout: 'workspace',
	},
] as Array<{
	color: string;
	style: string;
	desc: string;
	layout: string;
}>;

async function demo_powerline() {
	console.log('==================================================');
	console.log('🎨 Powerline Font Demo');
	console.log('==================================================\n');

	for (const [index, combo] of ALL_COMBINATIONS.entries()) {
		console.log(`--- ${combo.desc} ---`);

		// Cycle through different usage scenarios for variety in session costs
		const scenarios = Object.keys(USAGE_SCENARIOS) as Array<
			keyof typeof USAGE_SCENARIOS
		>;
		const scenario = scenarios[index % scenarios.length];
		const usage = USAGE_SCENARIOS[scenario];

		// Create temporary mock transcript file
		const temp_transcript_path = path.join(
			__dirname,
			`.temp-demo-transcript-${Date.now()}.jsonl`,
		);
		fs.writeFileSync(
			temp_transcript_path,
			create_mock_transcript(usage),
		);

		const demo_data = {
			...BASE_DATA,
			transcript_path: temp_transcript_path,
		};

		const config: DemoConfig = {
			color_theme: combo.color,
			theme: combo.style,
			font_profile: 'powerline',
		};

		// Manual separator configurations based on style
		if (combo.style === 'minimal') {
			config.separators = {
				model: 'none',
				directory: 'none',
				git: {
					clean: 'none',
					dirty: 'none',
					ahead: 'none',
					behind: 'none',
					conflicts: 'none',
					staged: 'none',
					untracked: 'none',
				},
				session: 'none',
			};
		} else if (combo.style === 'expressive') {
			// Mix of separators with git status changes
			config.separators = {
				model: 'wave',
				directory: 'thick',
				git: {
					clean: 'thick',
					dirty: 'lightning',
					ahead: 'flame',
					behind: 'wave',
					conflicts: 'lightning',
					staged: 'thick',
					untracked: 'thin',
				},
				session: 'wave',
			};
		} else if (combo.style === 'curvy') {
			// All separators should be curvy
			config.separators = {
				model: 'curvy',
				directory: 'curvy',
				git: {
					clean: 'curvy',
					dirty: 'curvy',
					ahead: 'curvy',
					behind: 'curvy',
					conflicts: 'curvy',
					staged: 'curvy',
					untracked: 'curvy',
				},
				session: 'curvy',
			};
		} else if (combo.style === 'angular') {
			// All separators should be angular
			config.separators = {
				model: 'angly',
				directory: 'angly',
				git: {
					clean: 'angly',
					dirty: 'angly',
					ahead: 'angly',
					behind: 'angly',
					conflicts: 'angly',
					staged: 'angly',
					untracked: 'angly',
				},
				session: 'angly',
			};
		} else if (combo.style === 'double_chevron') {
			// Bonus double chevron theme
			config.separators = {
				model: 'double_chevron',
				directory: 'double_chevron',
				git: {
					clean: 'double_chevron',
					dirty: 'double_chevron',
					ahead: 'double_chevron',
					behind: 'double_chevron',
					conflicts: 'double_chevron',
					staged: 'double_chevron',
					untracked: 'double_chevron',
				},
				session: 'double_chevron',
			};
		}

		// Add layout-specific configurations
		switch (combo.layout) {
			case 'single':
				// Default single-line layout with all segments
				config.segments = {
					model: true,
					directory: true,
					git: true,
					session: true,
				};
				break;

			case 'two-line':
				config.display = {
					lines: [
						{ segments: { directory: true, git: true } },
						{ segments: { model: true, session: true } },
					],
				};
				break;

			case 'minimal':
				config.segments = {
					model: true,
					directory: false,
					git: false,
					session: false,
				};
				break;

			case 'git-focus':
				config.segments = {
					model: false,
					directory: true,
					git: true,
					session: true,
				};
				break;

			case 'workspace':
				config.display = {
					lines: [
						{
							segments: { directory: true, git: true, session: true },
						},
					],
				};
				break;
		}

		try {
			const output = await run_statusline_with_config(
				demo_data,
				config,
			);
			console.log(output);
		} catch (error) {
			console.error(`Error:`, error);
		} finally {
			// Clean up temporary transcript file
			if (fs.existsSync(temp_transcript_path)) {
				fs.unlinkSync(temp_transcript_path);
			}
		}
		console.log('');
	}
}

async function demo_nerd_font() {
	console.log('==================================================');
	console.log('⚡ Nerd Font Demo');
	console.log('==================================================\n');

	for (const [index, combo] of ALL_COMBINATIONS.entries()) {
		console.log(`--- ${combo.desc} ---`);

		// Cycle through different usage scenarios for variety in session costs
		const scenarios = Object.keys(USAGE_SCENARIOS) as Array<
			keyof typeof USAGE_SCENARIOS
		>;
		const scenario = scenarios[index % scenarios.length];
		const usage = USAGE_SCENARIOS[scenario];

		// Create temporary mock transcript file
		const temp_transcript_path = path.join(
			__dirname,
			`.temp-demo-transcript-${Date.now()}.jsonl`,
		);
		fs.writeFileSync(
			temp_transcript_path,
			create_mock_transcript(usage),
		);

		const demo_data = {
			...BASE_DATA,
			transcript_path: temp_transcript_path,
		};

		const config: DemoConfig = {
			color_theme: combo.color,
			theme: combo.style,
			font_profile: 'nerd-font',
		};

		// Manual separator configurations based on style
		if (combo.style === 'minimal') {
			config.separators = {
				model: 'none',
				directory: 'none',
				git: {
					clean: 'none',
					dirty: 'none',
					ahead: 'none',
					behind: 'none',
					conflicts: 'none',
					staged: 'none',
					untracked: 'none',
				},
				session: 'none',
			};
		} else if (combo.style === 'expressive') {
			// Mix of separators with git status changes
			config.separators = {
				model: 'wave',
				directory: 'thick',
				git: {
					clean: 'thick',
					dirty: 'lightning',
					ahead: 'flame',
					behind: 'wave',
					conflicts: 'lightning',
					staged: 'thick',
					untracked: 'thin',
				},
				session: 'wave',
			};
		} else if (combo.style === 'curvy') {
			// All separators should be curvy
			config.separators = {
				model: 'curvy',
				directory: 'curvy',
				git: {
					clean: 'curvy',
					dirty: 'curvy',
					ahead: 'curvy',
					behind: 'curvy',
					conflicts: 'curvy',
					staged: 'curvy',
					untracked: 'curvy',
				},
				session: 'curvy',
			};
		} else if (combo.style === 'angular') {
			// All separators should be angular
			config.separators = {
				model: 'angly',
				directory: 'angly',
				git: {
					clean: 'angly',
					dirty: 'angly',
					ahead: 'angly',
					behind: 'angly',
					conflicts: 'angly',
					staged: 'angly',
					untracked: 'angly',
				},
				session: 'angly',
			};
		} else if (combo.style === 'double_chevron') {
			// Bonus double chevron theme
			config.separators = {
				model: 'double_chevron',
				directory: 'double_chevron',
				git: {
					clean: 'double_chevron',
					dirty: 'double_chevron',
					ahead: 'double_chevron',
					behind: 'double_chevron',
					conflicts: 'double_chevron',
					staged: 'double_chevron',
					untracked: 'double_chevron',
				},
				session: 'double_chevron',
			};
		}

		// Add layout-specific configurations
		switch (combo.layout) {
			case 'single':
				// Default single-line layout with all segments
				config.segments = {
					model: true,
					directory: true,
					git: true,
					session: true,
				};
				break;

			case 'two-line':
				config.display = {
					lines: [
						{ segments: { directory: true, git: true } },
						{ segments: { model: true, session: true } },
					],
				};
				break;

			case 'minimal':
				config.segments = {
					model: true,
					directory: false,
					git: false,
					session: false,
				};
				break;

			case 'git-focus':
				config.segments = {
					model: false,
					directory: true,
					git: true,
					session: true,
				};
				break;

			case 'workspace':
				config.display = {
					lines: [
						{
							segments: { directory: true, git: true, session: true },
						},
					],
				};
				break;
		}

		try {
			const output = await run_statusline_with_config(
				demo_data,
				config,
			);
			console.log(output);
		} catch (error) {
			console.error(`Error:`, error);
		} finally {
			// Clean up temporary transcript file
			if (fs.existsSync(temp_transcript_path)) {
				fs.unlinkSync(temp_transcript_path);
			}
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

export { demo_nerd_font, demo_powerline };
