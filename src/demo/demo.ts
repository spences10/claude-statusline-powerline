#!/usr/bin/env node

import { spawn } from 'child_process';
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
	separator_theme?: string;
	separator_profile?: string;
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
}

class StatuslineDemo {
	private createDemoTranscript(): void {
		const fs = require('fs');
		const transcript = [
			{
				type: 'user',
				timestamp: '2025-01-15T10:00:00Z',
				message: { role: 'user', content: 'Hello!' },
			},
			{
				type: 'assistant',
				timestamp: '2025-01-15T10:00:05Z',
				message: {
					role: 'assistant',
					content: 'Hi there!',
					model: 'claude-sonnet-4-20250514',
					usage: {
						input_tokens: 1200,
						output_tokens: 350,
						cache_creation_input_tokens: 0,
						cache_read_input_tokens: 500,
					},
				},
			},
			{
				type: 'user',
				timestamp: '2025-01-15T10:01:00Z',
				message: { role: 'user', content: 'Can you help me code?' },
			},
			{
				type: 'assistant',
				timestamp: '2025-01-15T10:01:10Z',
				message: {
					role: 'assistant',
					content:
						"Absolutely! I'd be happy to help you with coding.",
					model: 'claude-sonnet-4-20250514',
					usage: {
						input_tokens: 1500,
						output_tokens: 420,
						cache_creation_input_tokens: 200,
						cache_read_input_tokens: 300,
					},
				},
			},
		];

		fs.writeFileSync(
			'demo-transcript.jsonl',
			transcript.map((line) => JSON.stringify(line)).join('\n'),
		);
	}

	private async runStatusline(
		data: ClaudeStatusInput,
		config: DemoConfig = {},
		options: { font_profile?: string } = {},
	): Promise<string> {
		return new Promise((resolve, reject) => {
			const fs = require('fs');
			const env = { ...process.env };

			// Create a temporary config file if multiline display is specified
			let config_file_path: string | undefined;
			if (config.display) {
				config_file_path = 'temp-multiline-config.json';
				const configData = {
					display: config.display,
					color_theme: config.color_theme || 'electric',
					theme: config.separator_theme || 'expressive',
				};
				fs.writeFileSync(
					config_file_path,
					JSON.stringify(configData, null, 2),
				);
				env.STATUSLINE_CONFIG = config_file_path;
			}

			if (config.color_theme && !config.display)
				env.STATUSLINE_COLOR_THEME = config.color_theme;
			if (config.separator_theme && !config.display)
				env.STATUSLINE_THEME = config.separator_theme;
			if (config.separator_profile)
				env.STATUSLINE_SEPARATOR_PROFILE = config.separator_profile;
			if (options.font_profile)
				env.STATUSLINE_FONT_PROFILE = options.font_profile;
			if (config.segments?.model === false)
				env.STATUSLINE_SHOW_MODEL = 'false';
			if (config.segments?.directory === false)
				env.STATUSLINE_SHOW_DIRECTORY = 'false';
			if (config.segments?.git === false)
				env.STATUSLINE_SHOW_GIT = 'false';
			if (config.segments?.session === false)
				env.STATUSLINE_SHOW_SESSION = 'false';

			// Debug: log environment variables being passed
			if (config.separator_theme) {
				console.error(
					`DEBUG: Setting STATUSLINE_THEME=${config.separator_theme}`,
				);
			}
			if (options.font_profile) {
				console.error(
					`DEBUG: Setting STATUSLINE_FONT_PROFILE=${options.font_profile}`,
				);
			}
			if (config_file_path) {
				console.error(
					`DEBUG: Using multiline config file: ${config_file_path}`,
				);
			}

			const child = spawn('node', ['dist/statusline.js'], {
				env,
				stdio: ['pipe', 'pipe', 'pipe'],
			});

			let output = '';
			let error = '';

			child.stdout.on('data', (data) => {
				output += data.toString();
			});

			child.stderr.on('data', (data) => {
				error += data.toString();
			});

			child.on('close', (code) => {
				// Cleanup temporary config file
				if (config_file_path && fs.existsSync(config_file_path)) {
					fs.unlinkSync(config_file_path);
				}

				if (code === 0) {
					resolve(output.trim());
				} else {
					reject(new Error(`Exit code ${code}: ${error}`));
				}
			});

			child.stdin.write(JSON.stringify(data));
			child.stdin.end();
		});
	}

	private async runStatuslineWithConfig(
		data: ClaudeStatusInput,
		config_path: string,
	): Promise<string> {
		return new Promise((resolve, reject) => {
			const env = { ...process.env };
			env.STATUSLINE_CONFIG = config_path;

			const child = spawn('node', ['dist/statusline.js'], {
				env,
				stdio: ['pipe', 'pipe', 'pipe'],
			});

			let output = '';
			let error = '';

			child.stdout.on('data', (data) => {
				output += data.toString();
			});

			child.stderr.on('data', (data) => {
				error += data.toString();
			});

			child.on('close', (code) => {
				if (code === 0) {
					resolve(output.trim());
				} else {
					reject(new Error(`Exit code ${code}: ${error}`));
				}
			});

			child.stdin.write(JSON.stringify(data));
			child.stdin.end();
		});
	}

	private printHeader(title: string): void {
		console.log(`\n\x1b[36m${'='.repeat(50)}\x1b[0m`);
		console.log(`\x1b[1m\x1b[36m${title}\x1b[0m`);
		console.log(`\x1b[36m${'='.repeat(50)}\x1b[0m`);
	}

	private printSubheader(title: string): void {
		console.log(`\n\x1b[33m--- ${title} ---\x1b[0m`);
	}

	async run(): Promise<void> {
		this.createDemoTranscript();

		console.log(
			'\x1b[1m\x1b[35m🎨 Claude Statusline Powerline Demo\x1b[0m',
		);
		console.log(
			'This demo showcases various configuration options for the statusline.',
		);

		// 1. Color Theme Showcase
		this.printHeader('1. 🎨 Color Themes');

		this.printSubheader('🌑 Dark Theme (Classic Blue/Gray/Yellow)');
		const darkResult = await this.runStatusline(BASE_DATA, {
			color_theme: 'dark',
		});
		console.log(darkResult);

		this.printSubheader('⚡ Electric Theme (Purple/Cyan/Red)');
		const electricResult = await this.runStatusline(BASE_DATA, {
			color_theme: 'electric',
		});
		console.log(electricResult);

		// 2. Separator Styles (with Dark theme + Nerd Font)
		this.printHeader('2. 🔗 Separator Styles');
		this.printSubheader(
			'Using nerd-font profile to show separator differences',
		);
		for (const separatorTheme of SEPARATOR_THEMES) {
			this.printSubheader(`Style: ${separatorTheme}`);
			const result = await this.runStatusline(
				BASE_DATA,
				{
					color_theme: 'dark',
					separator_theme: separatorTheme,
				},
				{ font_profile: 'nerd-font' },
			);
			console.log(result);
		}

		// 3. Separator Profiles (with Electric theme)
		this.printHeader('3. ⚡ Separator Profiles');
		for (const separatorProfile of SEPARATOR_PROFILES) {
			this.printSubheader(`Profile: ${separatorProfile}`);
			const result = await this.runStatusline(BASE_DATA, {
				color_theme: 'electric',
				separator_profile: separatorProfile,
			});
			console.log(result);
		}

		// 4. Font Profile Comparison
		this.printHeader('4. 🔤 Font Profile Comparison');
		this.printSubheader(
			'Powerline vs Nerd Font profiles with new separator variations',
		);

		for (const font_profile of FONT_PROFILES) {
			this.printSubheader(`📝 ${font_profile} profile`);
			for (const separatorTheme of ['curvy', 'angular', 'electric']) {
				const result = await this.runStatusline(
					BASE_DATA,
					{
						color_theme: 'electric',
						separator_theme: separatorTheme,
					},
					{ font_profile },
				);
				console.log(`  ${separatorTheme}:`, result);
			}
		}

		// 5. Theme + Style Combinations
		this.printHeader('5. 🎭 Theme + Style Combinations');
		const combinations = [
			{
				color_theme: 'dark',
				separator_theme: 'minimal',
				label: 'Dark + Minimal',
			},
			{
				color_theme: 'dark',
				separator_theme: 'electric',
				label: 'Dark + Electric Separators',
			},
			{
				color_theme: 'electric',
				separator_theme: 'expressive',
				label: 'Electric + Expressive',
			},
			{
				color_theme: 'electric',
				separator_theme: 'curvy',
				label: 'Electric + Curvy',
			},
		];

		for (const combo of combinations) {
			this.printSubheader(`🎨 ${combo.label}`);
			const result = await this.runStatusline(BASE_DATA, combo);
			console.log(result);
		}

		// 6. Multi-line Layout Support
		this.printHeader('6. 📏 Multi-line Layout Support');
		this.printSubheader(
			'Demonstrating multi-line powerline layouts to prevent segment cutoff',
		);

		// Single line (default)
		this.printSubheader('🔸 Single Line (Default)');
		const singleLineResult = await this.runStatusline(BASE_DATA, {
			color_theme: 'electric',
			separator_theme: 'expressive',
		});
		console.log(singleLineResult);

		// Two line layout - First line: directory, git, model; Second line: session
		this.printSubheader(
			'🔸 Two Lines: [Directory, Git, Model] + [Session]',
		);
		const twoLineResult = await this.runStatusline(BASE_DATA, {
			color_theme: 'electric',
			separator_theme: 'expressive',
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
		});
		console.log(twoLineResult);

		// Three line layout - Each segment on its own line
		this.printSubheader(
			'🔸 Three Lines: Directory | Git + Model | Session',
		);
		const threeLineResult = await this.runStatusline(BASE_DATA, {
			color_theme: 'dark',
			separator_theme: 'curvy',
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
		});
		console.log(threeLineResult);

		// 7. Flexible Segment Configuration
		this.printHeader('7. 🔧 Flexible Segment Configuration');
		this.printSubheader(
			'NEW: JSON-based segment ordering and per-segment styling',
		);

		// Custom segment ordering
		this.printSubheader(
			'🔄 Custom Segment Ordering (Git → Model → Directory)',
		);
		const customOrderResult = await this.runStatuslineWithConfig(
			BASE_DATA,
			'src/demo/example-segment-config.json',
		);
		console.log(customOrderResult);

		// Radical reordering with custom styling
		this.printSubheader(
			'🎨 Radical Reordering + Custom Colors (Session → Directory, No Model)',
		);
		const radicalResult = await this.runStatuslineWithConfig(
			BASE_DATA,
			'src/demo/custom-order-config.json',
		);
		console.log(radicalResult);

		// Show that old env vars still work
		this.printSubheader(
			'🔄 Environment Variables Still Work (Backward Compatible)',
		);
		const envResult = await this.runStatusline(BASE_DATA, {
			color_theme: 'electric',
			separator_theme: 'minimal',
			segments: { model: false, git: false },
		});
		console.log(envResult);

		// Cleanup
		const fs = require('fs');
		if (fs.existsSync('demo-transcript.jsonl')) {
			fs.unlinkSync('demo-transcript.jsonl');
		}

		this.printHeader('🎉 Demo Complete!');
		console.log(
			'\x1b[32mAll examples have been demonstrated.\x1b[0m',
		);
		console.log(
			'\x1b[36mYou can now experiment with your own configurations!\x1b[0m',
		);
		console.log('');
		console.log('\x1b[33mAvailable environment variables:\x1b[0m');
		console.log('  STATUSLINE_COLOR_THEME: dark, electric');
		console.log(
			'  STATUSLINE_THEME: minimal, expressive, subtle, electric, curvy, angular',
		);
		console.log(
			'  STATUSLINE_SEPARATOR_PROFILE: all-curvy, all-angly, mixed-dynamic, minimal-clean, electric-chaos',
		);
		console.log('  STATUSLINE_FONT_PROFILE: powerline, nerd-font');
		console.log('  STATUSLINE_SHOW_MODEL: true/false');
		console.log('  STATUSLINE_SHOW_DIRECTORY: true/false');
		console.log('  STATUSLINE_SHOW_GIT: true/false');
		console.log('  STATUSLINE_SHOW_SESSION: true/false');
		console.log('\x1b[32m\\nNew features:\x1b[0m');
		console.log('  • Flexible segment configuration with JSON files');
		console.log('  • Custom segment ordering (any order you want)');
		console.log('  • Per-segment styling (colors and separators)');
		console.log(
			'  • Double chevron separators (doubleChevron style)',
		);
		console.log(
			'  • Powerline-extra-symbols support (curvy, angly, angly2)',
		);
		console.log('  • Victor Mono font compatibility improvements');
		console.log('');
		console.log('\x1b[33mJSON Configuration Files:\x1b[0m');
		console.log('  Set STATUSLINE_CONFIG=/path/to/config.json');
		console.log(
			'  Or use: ./statusline.config.json, ./.statusline.json',
		);
		console.log('  Examples available in src/demo/ directory');
	}
}

// Run the demo
if (require.main === module) {
	const demo = new StatuslineDemo();
	demo.run().catch(console.error);
}
