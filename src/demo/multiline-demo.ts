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

interface DemoConfig {
	colorTheme?: string;
	separatorTheme?: string;
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
}

class MultilineDemo {
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
		];

		fs.writeFileSync(
			'demo-transcript.jsonl',
			transcript.map((line) => JSON.stringify(line)).join('\n'),
		);
	}

	private async runStatusline(
		data: ClaudeStatusInput,
		config: DemoConfig = {},
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
				console.error(
					`DEBUG: Created config file:`,
					JSON.stringify(configData, null, 2),
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

	async run(): Promise<void> {
		this.createDemoTranscript();

		console.log('🔸 Multi-line Layout Support Demo');
		console.log('='.repeat(50));

		// Single line (default)
		console.log('\n--- 🔸 Single Line (Default) ---');
		const singleLineResult = await this.runStatusline(BASE_DATA, {
			colorTheme: 'electric',
			separatorTheme: 'expressive',
		});
		console.log(singleLineResult);

		// Two line layout
		console.log(
			'\n--- 🔸 Two Lines: [Directory, Git, Model] + [Session] ---',
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

		// Three line layout
		console.log(
			'\n--- 🔸 Three Lines: Directory | Git + Model | Session ---',
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

		// Cleanup
		const fs = require('fs');
		if (fs.existsSync('demo-transcript.jsonl')) {
			fs.unlinkSync('demo-transcript.jsonl');
		}

		console.log('\n🎉 Multiline Demo Complete!');
	}
}

// Run the demo
if (require.main === module) {
	const demo = new MultilineDemo();
	demo.run().catch(console.error);
}
