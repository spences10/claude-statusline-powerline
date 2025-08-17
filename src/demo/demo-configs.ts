import type {
	ColorTheme,
	DisplayConfig,
	SegmentsConfiguration,
} from '../types.js';

// Configuration interface matching the JSON structure used in .claude/claude-statusline-powerline.json
interface DemoConfigEntry {
	description: string;
	color_theme: ColorTheme;
	display: DisplayConfig;
	segment_config: SegmentsConfiguration;
}

export const DEMO_CONFIGS: DemoConfigEntry[] = [
	{
		description: 'Night Owl + 3-line layout',
		color_theme: 'night-owl',
		display: {
			lines: [
				{
					segments: {
						directory: true,
						git: true,
					},
				},
				{
					segments: {
						model: true,
						session: true,
					},
				},
				{
					segments: {
						context: true,
					},
				},
			],
		},
		segment_config: {
			segments: [
				{
					type: 'model',
					enabled: true,
					order: 1,
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
					enabled: true,
					order: 2,
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
					enabled: true,
					order: 3,
					style: {
						truncation_length: 30,
						separator: {
							style: 'curvy',
						},
					},
				},
				{
					type: 'session',
					enabled: true,
					order: 4,
					style: {
						separator: {
							style: 'curvy',
						},
					},
				},
				{
					type: 'context',
					enabled: true,
					order: 5,
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
		description: 'Dark + Minimal single line',
		color_theme: 'dark',
		display: {
			lines: [
				{
					segments: {
						model: true,
						directory: true,
						git: true,
						session: true,
					},
				},
			],
		},
		segment_config: {
			segments: [
				{
					type: 'model',
					enabled: true,
					order: 1,
					style: {
						separator: {
							style: 'none',
						},
					},
				},
				{
					type: 'directory',
					enabled: true,
					order: 2,
					style: {
						separator: {
							style: 'none',
						},
					},
				},
				{
					type: 'git',
					enabled: true,
					order: 3,
					style: {
						separator: {
							style: 'none',
						},
					},
				},
				{
					type: 'session',
					enabled: true,
					order: 4,
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
		display: {
			lines: [
				{
					segments: {
						model: true,
						directory: true,
						git: true,
						session: true,
					},
				},
			],
		},
		segment_config: {
			segments: [
				{
					type: 'model',
					enabled: true,
					order: 1,
					style: {
						separator: {
							style: 'wave',
						},
					},
				},
				{
					type: 'directory',
					enabled: true,
					order: 2,
					style: {
						separator: {
							style: 'thick',
						},
					},
				},
				{
					type: 'git',
					enabled: true,
					order: 3,
					style: {
						separator: {
							style: 'lightning',
						},
					},
				},
				{
					type: 'session',
					enabled: true,
					order: 4,
					style: {
						separator: {
							style: 'wave',
						},
					},
				},
			],
		},
	},
];
