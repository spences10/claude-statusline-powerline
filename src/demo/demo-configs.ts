import type { ColorTheme, SegmentsConfiguration } from '../types.js';

// Configuration interface matching the JSON structure used in .claude/claude-statusline-powerline.json
interface DemoConfigEntry {
	description: string;
	color_theme: ColorTheme;
	segment_config: SegmentsConfiguration;
}

export const DEMO_CONFIGS: DemoConfigEntry[] = [
	{
		description: 'Default Config',
		color_theme: 'dark',
		segment_config: {
			lines: [
				{
					model: true,
					directory: true,
					git: true,
					session: true,
				},
			],
			segments: [],
		},
	},
	{
		description: 'Night Owl + 3-line layout',
		color_theme: 'night-owl',
		segment_config: {
			lines: [
				{
					directory: true,
					git: true,
				},
				{
					model: true,
					session: true,
				},
				{
					context: true,
				},
			],
			segments: [
				{
					type: 'model',
					style: {
						separator: {
							style: 'double_chevron',
						},
						icons: {
							ai: '🤖',
						},
					},
				},
				{
					type: 'directory',
					style: {
						truncation_length: 30,
						separator: {
							style: 'double_chevron',
						},
						icons: {
							folder: '🗄️',
						},
					},
				},
				{
					type: 'git',
					style: {
						truncation_length: 30,
						separator: {
							style: 'curvy',
						},
					},
				},
				{
					type: 'session',
					style: {
						separator: {
							style: 'curvy',
						},
					},
				},
				{
					type: 'context',
					style: {
						separator: {
							style: 'curvy',
						},
					},
				},
			],
		},
	},
	{
		description: 'Dark + Minimal',
		color_theme: 'dark',
		segment_config: {
			lines: [
				{
					directory: true,
					git: true,
					model: true,
					session: true,
				},
				{
					context: true,
				},
			],
			segments: [
				{
					type: 'model',
					style: {
						separator: {
							style: 'none',
						},
					},
				},
				{
					type: 'directory',
					style: {
						separator: {
							style: 'none',
						},
					},
				},
				{
					type: 'git',
					style: {
						separator: {
							style: 'none',
						},
					},
				},
				{
					type: 'session',
					style: {
						separator: {
							style: 'none',
						},
					},
				},
				{
					type: 'context',
					style: {
						separator: {
							style: 'none',
						},
					},
				},
			],
		},
	},
	{
		description: 'Electric + Mixed separators',
		color_theme: 'electric',
		segment_config: {
			lines: [
				{
					directory: true,
					git: true,
					model: true,
					session: true,
				},
				{
					context: true,
				},
			],
			segments: [
				{
					type: 'model',
					style: {
						separator: {
							style: 'wave',
						},
					},
				},
				{
					type: 'directory',
					style: {
						separator: {
							style: 'thick',
						},
					},
				},
				{
					type: 'git',
					style: {
						separator: {
							style: 'lightning',
						},
					},
				},
				{
					type: 'session',
					style: {
						separator: {
							style: 'wave',
						},
					},
				},
				{
					type: 'context',
					style: {
						separator: {
							style: 'flame',
						},
					},
				},
			],
		},
	},
];
