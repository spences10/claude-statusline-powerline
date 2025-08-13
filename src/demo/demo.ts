#!/usr/bin/env node

import { spawn } from 'child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ClaudeStatusInput } from '../types';

// Demo data
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

// Available themes and configurations
const COLOR_THEMES = ['dark', 'electric'] as const;
const SEPARATOR_THEMES = [
	'minimal',
	'expressive',
	'subtle',
	'electric',
	'curvy',
	'angular',
] as const;
const FONT_PROFILES = ['powerline', 'nerd-font'] as const;
const SEPARATOR_PROFILES = [
	'all-curvy',
	'all-angly',
	'mixed-dynamic',
	'minimal-clean',
	'electric-chaos',
] as const;

interface DemoConfig {
	color_theme?: string;
	theme?: string;
	separator_profile?: string;
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
	segment_config?: {
		segments: Array<{
			type: string;
			enabled: boolean;
			order: number;
			style?: any;
		}>;
	};
}

interface DemoOptions {
	color_theme: string;
	font_profile: string;
}

// Temporary config file path
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
	options: Partial<DemoOptions> = {},
): Promise<string> {
	return new Promise((resolve, reject) => {
		const merged_config: DemoConfig = {
			color_theme: options.color_theme || 'dark',
			font_profile: options.font_profile || 'powerline',
			...config,
		};

		const config_file = write_temp_config(merged_config);

		const child = spawn(
			'node',
			[path.join(__dirname, '../statusline.js')],
			{
				stdio: ['pipe', 'pipe', 'pipe'],
				cwd: process.cwd(), // Run from project root
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

async function demo_color_themes() {
	console.log('==================================================');
	console.log('1. 🎨 Color Themes');
	console.log('==================================================\n');

	for (const color_theme of COLOR_THEMES) {
		const theme_name =
			color_theme === 'dark'
				? '🌑 Dark Theme (Classic Blue/Gray/Yellow)'
				: '⚡ Electric Theme (Purple/Cyan/Red)';

		console.log(`--- ${theme_name} ---`);

		const config: DemoConfig = {
			color_theme,
			theme: 'expressive',
		};

		try {
			const output = await run_statusline_with_config(
				BASE_DATA,
				config,
			);
			console.log(output);
		} catch (error) {
			console.error(`Error with ${color_theme} theme:`, error);
		}
		console.log('');
	}
}

async function demo_separator_styles() {
	console.log('==================================================');
	console.log('2. 🔗 Separator Styles');
	console.log('==================================================\n');

	console.log(
		'--- Using nerd-font profile to show separator differences ---\n',
	);

	for (const theme of SEPARATOR_THEMES) {
		console.log(`--- Style: ${theme} ---`);

		const config: DemoConfig = {
			color_theme: 'dark',
			theme,
			font_profile: 'nerd-font',
		};

		try {
			const output = await run_statusline_with_config(
				BASE_DATA,
				config,
			);
			console.log(output);
		} catch (error) {
			console.error(`Error with ${theme} theme:`, error);
		}
		console.log('');
	}
}

async function demo_separator_profiles() {
	console.log('==================================================');
	console.log('3. ⚡ Separator Profiles');
	console.log('==================================================\n');

	for (const profile of SEPARATOR_PROFILES) {
		console.log(`--- Profile: ${profile} ---`);

		const config: DemoConfig = {
			color_theme: 'dark',
			theme: 'expressive',
			separator_profile: profile,
		};

		try {
			const output = await run_statusline_with_config(
				BASE_DATA,
				config,
			);
			console.log(output);
		} catch (error) {
			console.error(`Error with ${profile} profile:`, error);
		}
		console.log('');
	}
}

async function demo_font_profiles() {
	console.log('==================================================');
	console.log('4. 🔤 Font Profile Comparison');
	console.log('==================================================\n');

	console.log(
		'--- Powerline vs Nerd Font profiles with new separator variations ---\n',
	);

	for (const font_profile of FONT_PROFILES) {
		console.log(`--- 📝 ${font_profile} profile ---`);

		for (const theme of ['curvy', 'angular', 'electric']) {
			const config: DemoConfig = {
				color_theme: 'dark',
				theme,
				font_profile,
			};

			try {
				const output = await run_statusline_with_config(
					BASE_DATA,
					config,
				);
				console.log(`  ${theme}: ${output}`);
			} catch (error) {
				console.error(`Error with ${theme}/${font_profile}:`, error);
			}
		}
		console.log('');
	}
}

async function demo_theme_combinations() {
	console.log('==================================================');
	console.log('5. 🎭 Theme + Style Combinations');
	console.log('==================================================\n');

	const combinations = [
		{ color: 'dark', style: 'minimal', desc: '🎨 Dark + Minimal' },
		{
			color: 'dark',
			style: 'electric',
			desc: '🎨 Dark + Electric Separators',
		},
		{
			color: 'electric',
			style: 'expressive',
			desc: '🎨 Electric + Expressive',
		},
		{
			color: 'electric',
			style: 'curvy',
			desc: '🎨 Electric + Curvy',
		},
	];

	for (const combo of combinations) {
		console.log(`--- ${combo.desc} ---`);

		const config: DemoConfig = {
			color_theme: combo.color,
			theme: combo.style,
		};

		try {
			const output = await run_statusline_with_config(
				BASE_DATA,
				config,
			);
			console.log(output);
		} catch (error) {
			console.error(`Error with combination:`, error);
		}
		console.log('');
	}
}

async function demo_multiline_layouts() {
	console.log('==================================================');
	console.log('6. 📏 Multi-line Layout Support');
	console.log('==================================================\n');

	console.log(
		'--- Demonstrating multi-line powerline layouts to prevent segment cutoff ---\n',
	);

	// Single line (default)
	console.log('--- 🔸 Single Line (Default) ---');
	const single_config: DemoConfig = {
		color_theme: 'dark',
		theme: 'expressive',
	};
	try {
		const output = await run_statusline_with_config(
			BASE_DATA,
			single_config,
		);
		console.log(output);
	} catch (error) {
		console.error('Error with single line:', error);
	}
	console.log('');

	// Two lines
	console.log(
		'--- 🔸 Two Lines: [Directory, Git, Model] + [Session] ---',
	);
	const two_line_config: DemoConfig = {
		color_theme: 'dark',
		theme: 'expressive',
		display: {
			lines: [
				{
					segments: {
						directory: true,
						git: true,
						model: true,
					},
				},
				{
					segments: {
						session: true,
					},
				},
			],
		},
	};
	try {
		const output = await run_statusline_with_config(
			BASE_DATA,
			two_line_config,
		);
		console.log(output);
	} catch (error) {
		console.error('Error with two line:', error);
	}
	console.log('');

	// Three lines
	console.log(
		'--- 🔸 Three Lines: Directory | Git + Model | Session ---',
	);
	const three_line_config: DemoConfig = {
		color_theme: 'dark',
		theme: 'curvy',
		display: {
			lines: [
				{
					segments: {
						directory: true,
					},
				},
				{
					segments: {
						git: true,
						model: true,
					},
				},
				{
					segments: {
						session: true,
					},
				},
			],
		},
	};
	try {
		const output = await run_statusline_with_config(
			BASE_DATA,
			three_line_config,
		);
		console.log(output);
	} catch (error) {
		console.error('Error with three line:', error);
	}
	console.log('');
}

async function demo_segment_configuration() {
	console.log('==================================================');
	console.log('7. 🔧 Flexible Segment Configuration');
	console.log('==================================================\n');

	console.log(
		'--- JSON-based segment ordering and per-segment styling ---\n',
	);

	// Custom ordering
	console.log(
		'--- 🔄 Custom Segment Ordering (Git → Model → Directory) ---',
	);
	const custom_order_config: DemoConfig = {
		color_theme: 'dark',
		theme: 'expressive',
		segment_config: {
			segments: [
				{ type: 'git', enabled: true, order: 1 },
				{ type: 'model', enabled: true, order: 2 },
				{ type: 'directory', enabled: true, order: 3 },
				{ type: 'session', enabled: true, order: 4 },
			],
		},
	};
	try {
		const output = await run_statusline_with_config(
			BASE_DATA,
			custom_order_config,
		);
		console.log(output);
	} catch (error) {
		console.error('Error with custom order:', error);
	}
	console.log('');

	// Radical reordering
	console.log(
		'--- 🎨 Radical Reordering + Custom Colors (Session → Directory, No Model) ---',
	);
	const radical_config: DemoConfig = {
		color_theme: 'electric',
		theme: 'minimal',
		segment_config: {
			segments: [
				{ type: 'session', enabled: true, order: 1 },
				{ type: 'directory', enabled: true, order: 2 },
				{ type: 'git', enabled: false, order: 3 },
				{ type: 'model', enabled: false, order: 4 },
			],
		},
	};
	try {
		const output = await run_statusline_with_config(
			BASE_DATA,
			radical_config,
		);
		console.log(output);
	} catch (error) {
		console.error('Error with radical config:', error);
	}
	console.log('');

	// Environment variables still work (backward compatibility)
	console.log('--- 🔄 JSON Configuration (Backward Compatible) ---');
	const backward_config: DemoConfig = {
		color_theme: 'dark',
		theme: 'minimal',
	};
	try {
		const output = await run_statusline_with_config(
			BASE_DATA,
			backward_config,
		);
		console.log(output);
	} catch (error) {
		console.error('Error with backward compatible config:', error);
	}
	console.log('');
}

async function main() {
	console.log('🎨 Claude Statusline Powerline Demo');
	console.log(
		'This demo showcases various configuration options for the statusline.\n',
	);

	try {
		await demo_color_themes();
		await demo_separator_styles();
		await demo_separator_profiles();
		await demo_font_profiles();
		await demo_theme_combinations();
		await demo_multiline_layouts();
		await demo_segment_configuration();

		console.log('==================================================');
		console.log('🎉 Demo Complete!');
		console.log('==================================================');
		console.log('All examples have been demonstrated.');
		console.log(
			'You can now experiment with your own configurations!\n',
		);

		console.log('JSON Configuration:');
		console.log(
			'  Create ~/.claude/claude-statusline-powerline.json',
		);
		console.log(
			'  Or use project-specific .claude-statusline-powerline.json\n',
		);

		console.log('Available configuration options:');
		console.log('  color_theme: "dark" | "electric"');
		console.log(
			'  theme: "minimal" | "expressive" | "subtle" | "electric" | "curvy" | "angular"',
		);
		console.log(
			'  separator_profile: "all-curvy" | "all-angly" | "mixed-dynamic" | "minimal-clean" | "electric-chaos"',
		);
		console.log('  font_profile: "powerline" | "nerd-font"');
		console.log(
			'  Plus segment configuration, multiline layouts, and custom styling\n',
		);

		console.log('New features:');
		console.log(
			'  • JSON-based configuration (no more environment variables!)',
		);
		console.log('  • Flexible segment configuration with JSON files');
		console.log('  • Custom segment ordering (any order you want)');
		console.log('  • Per-segment styling (colors and separators)');
		console.log(
			'  • Double chevron separators (doubleChevron style)',
		);
		console.log(
			'  • Powerline-extra-symbols support (curvy, angly, angly2)',
		);
		console.log('  • Victor Mono font compatibility improvements\n');

		console.log('JSON Configuration Files:');
		console.log(
			'  Primary: ~/.claude/claude-statusline-powerline.json',
		);
		console.log(
			'  Project-specific: ./.claude-statusline-powerline.json',
		);
		console.log('  Examples available in src/demo/ directory');
	} catch (error) {
		console.error('Demo failed:', error);
		process.exit(1);
	} finally {
		// Ensure cleanup
		cleanup_temp_config();
	}
}

if (require.main === module) {
	main().catch(console.error);
}
