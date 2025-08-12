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
	colorTheme?: string;
	separatorTheme?: string;
	separatorProfile?: string;
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
		options: { fontProfile?: string } = {},
	): Promise<string> {
		return new Promise((resolve, reject) => {
			const fs = require('fs');
			const env = { ...process.env };

			// Create a temporary config file if multiline display is specified
			let configFilePath: string | undefined;
			if (config.display) {
				configFilePath = 'temp-multiline-config.json';
				const configData = {
					display: config.display,
					colorTheme: config.colorTheme || 'electric',
					theme: config.separatorTheme || 'expressive',
				};
				fs.writeFileSync(
					configFilePath,
					JSON.stringify(configData, null, 2),
				);
				env.STATUSLINE_CONFIG = configFilePath;
			}

			if (config.colorTheme && !config.display)
				env.STATUSLINE_COLOR_THEME = config.colorTheme;
			if (config.separatorTheme && !config.display)
				env.STATUSLINE_THEME = config.separatorTheme;
			if (config.separatorProfile)
				env.STATUSLINE_SEPARATOR_PROFILE = config.separatorProfile;
			if (options.fontProfile)
				env.STATUSLINE_FONT_PROFILE = options.fontProfile;
			if (config.segments?.model === false)
				env.STATUSLINE_SHOW_MODEL = 'false';
			if (config.segments?.directory === false)
				env.STATUSLINE_SHOW_DIRECTORY = 'false';
			if (config.segments?.git === false)
				env.STATUSLINE_SHOW_GIT = 'false';
			if (config.segments?.session === false)
				env.STATUSLINE_SHOW_SESSION = 'false';

			// Debug: log environment variables being passed
			if (config.separatorTheme) {
				console.error(
					`DEBUG: Setting STATUSLINE_THEME=${config.separatorTheme}`,
				);
			}
			if (options.fontProfile) {
				console.error(
					`DEBUG: Setting STATUSLINE_FONT_PROFILE=${options.fontProfile}`,
				);
			}
			if (configFilePath) {
				console.error(
					`DEBUG: Using multiline config file: ${configFilePath}`,
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
				if (configFilePath && fs.existsSync(configFilePath)) {
					fs.unlinkSync(configFilePath);
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
			colorTheme: 'dark',
		});
		console.log(darkResult);

		this.printSubheader('⚡ Electric Theme (Purple/Cyan/Red)');
		const electricResult = await this.runStatusline(BASE_DATA, {
			colorTheme: 'electric',
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
					colorTheme: 'dark',
					separatorTheme,
				},
				{ fontProfile: 'nerd-font' },
			);
			console.log(result);
		}

		// 3. Separator Profiles (with Electric theme)
		this.printHeader('3. ⚡ Separator Profiles');
		for (const separatorProfile of SEPARATOR_PROFILES) {
			this.printSubheader(`Profile: ${separatorProfile}`);
			const result = await this.runStatusline(BASE_DATA, {
				colorTheme: 'electric',
				separatorProfile,
			});
			console.log(result);
		}

		// 4. Font Profile Comparison
		this.printHeader('4. 🔤 Font Profile Comparison');
		this.printSubheader(
			'Powerline vs Nerd Font profiles with new separator variations',
		);

		for (const fontProfile of FONT_PROFILES) {
			this.printSubheader(`📝 ${fontProfile} profile`);
			for (const separatorTheme of ['curvy', 'angular', 'electric']) {
				const result = await this.runStatusline(
					BASE_DATA,
					{
						colorTheme: 'electric',
						separatorTheme,
					},
					{ fontProfile },
				);
				console.log(`  ${separatorTheme}:`, result);
			}
		}

		// 5. Theme + Style Combinations
		this.printHeader('5. 🎭 Theme + Style Combinations');
		const combinations = [
			{
				colorTheme: 'dark',
				separatorTheme: 'minimal',
				label: 'Dark + Minimal',
			},
			{
				colorTheme: 'dark',
				separatorTheme: 'electric',
				label: 'Dark + Electric Separators',
			},
			{
				colorTheme: 'electric',
				separatorTheme: 'expressive',
				label: 'Electric + Expressive',
			},
			{
				colorTheme: 'electric',
				separatorTheme: 'curvy',
				label: 'Electric + Curvy',
			},
		];

		for (const combo of combinations) {
			this.printSubheader(`🎨 ${combo.label}`);
			const result = await this.runStatusline(BASE_DATA, combo);
			console.log(result);
		}

		// 6. Segment Visibility
		this.printHeader('6. 👁️ Segment Visibility');

		const segmentConfigs = [
			{ segments: {}, label: 'All segments (default)' },
			{ segments: { session: false }, label: 'Hide session segment' },
			{ segments: { git: false }, label: 'Hide git segment' },
			{
				segments: { model: false, session: false },
				label: 'Only directory + git',
			},
			{
				segments: { git: false, session: false },
				label: 'Only model + directory',
			},
		];

		for (const config of segmentConfigs) {
			this.printSubheader(`📋 ${config.label}`);
			const result = await this.runStatusline(BASE_DATA, {
				colorTheme: 'electric',
				...config,
			});
			console.log(result);
		}

		// 7. Multi-line Layout Support
		this.printHeader('7. 📏 Multi-line Layout Support');
		this.printSubheader(
			'Demonstrating multi-line powerline layouts to prevent segment cutoff',
		);

		// Single line (default)
		this.printSubheader('🔸 Single Line (Default)');
		const singleLineResult = await this.runStatusline(BASE_DATA, {
			colorTheme: 'electric',
			separatorTheme: 'expressive',
		});
		console.log(singleLineResult);

		// Two line layout - First line: directory, git, model; Second line: session
		this.printSubheader(
			'🔸 Two Lines: [Directory, Git, Model] + [Session]',
		);
		const twoLineResult = await this.runStatusline(BASE_DATA, {
			colorTheme: 'electric',
			separatorTheme: 'expressive',
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
			colorTheme: 'dark',
			separatorTheme: 'curvy',
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

		// 8. Different Models
		this.printHeader('8. 🤖 Different Models');
		const models = [
			{ display_name: 'Claude Sonnet 4' },
			{ display_name: 'Claude Opus 4' },
			{ display_name: 'Claude Haiku 3.5' },
			{ display_name: 'Very Long Model Name That Gets Truncated' },
		];

		for (const model of models) {
			this.printSubheader(`🤖 ${model.display_name}`);
			const data = { ...BASE_DATA, model };
			const result = await this.runStatusline(data, {
				colorTheme: 'electric',
			});
			console.log(result);
		}

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
		console.log(
			'  • Double chevron separators (doubleChevron style)',
		);
		console.log(
			'  • Powerline-extra-symbols support (curvy, angly, angly2)',
		);
		console.log('  • Victor Mono font compatibility improvements');
	}
}

// Run the demo
if (require.main === module) {
	const demo = new StatuslineDemo();
	demo.run().catch(console.error);
}
