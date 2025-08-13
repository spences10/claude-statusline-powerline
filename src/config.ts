import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { get_theme } from './themes';
import {
	ModelPricing,
	SegmentsConfiguration,
	SegmentVisibility,
	SeparatorConfig,
	SeparatorProfile,
	StatuslineConfig,
} from './types';

// Separator profile presets for easy customization
export const SEPARATOR_PROFILES: Record<string, SeparatorProfile> = {
	'all-curvy': {
		default: 'curvy',
	},
	'all-angly': {
		default: 'angly',
	},
	'mixed-dynamic': {
		default: 'curvy',
		overrides: {
			directory_dirty: 'lightning',
			git_dirty: 'flame',
		},
	},
	'minimal-clean': {
		default: 'thin',
		overrides: {
			directory_dirty: 'thick',
			git_dirty: 'thick',
		},
	},
	'electric-chaos': {
		default: 'lightning',
		overrides: {
			model: 'flame',
			git_clean: 'angly2',
			git_dirty: 'lightning',
		},
	},
};

// Separator theme presets
export const SEPARATOR_THEMES: Record<string, SeparatorConfig> = {
	minimal: {
		model: 'thin',
		directory: {
			clean: 'thin',
			dirty: 'thick',
			no_git: 'thin',
		},
		git: {
			clean: 'thin',
			dirty: 'thick',
		},
	},

	expressive: {
		model: 'wave',
		directory: {
			clean: 'wave',
			dirty: 'flame',
			no_git: 'thin',
		},
		git: {
			clean: 'thick',
			dirty: 'lightning',
		},
	},

	subtle: {
		model: 'thick',
		directory: {
			clean: 'thick',
			dirty: 'wave',
			no_git: 'thin',
		},
		git: {
			clean: 'thick',
			dirty: 'flame',
		},
	},

	// Fun experimental preset
	electric: {
		model: 'lightning',
		directory: {
			clean: 'flame',
			dirty: 'lightning',
			no_git: 'flame',
		},
		git: {
			clean: 'wave',
			dirty: 'lightning',
		},
	},

	// Powerline-extra-symbols themes for Victor Mono compatibility
	curvy: {
		model: 'curvy',
		directory: {
			clean: 'curvy',
			dirty: 'angly',
			no_git: 'curvy',
		},
		git: {
			clean: 'curvy',
			dirty: 'flame',
		},
	},

	angular: {
		model: 'angly',
		directory: {
			clean: 'angly',
			dirty: 'angly2',
			no_git: 'angly',
		},
		git: {
			clean: 'angly',
			dirty: 'flame',
		},
	},
};

// Default segment visibility
export const DEFAULT_SEGMENTS: SegmentVisibility = {
	model: true,
	directory: true,
	git: true,
	session: true,
};

// Default segments configuration with ordering and basic styling
export const DEFAULT_SEGMENTS_CONFIG: SegmentsConfiguration = {
	segments: [
		{
			type: 'model',
			enabled: true,
			order: 1,
		},
		{
			type: 'directory',
			enabled: true,
			order: 2,
		},
		{
			type: 'git',
			enabled: true,
			order: 3,
		},
		{
			type: 'session',
			enabled: true,
			order: 4,
		},
	],
};

// Default configuration
export const DEFAULT_CONFIG: StatuslineConfig = {
	separators: SEPARATOR_THEMES.expressive,
	segments: DEFAULT_SEGMENTS,
	theme: 'expressive',
	segment_config: DEFAULT_SEGMENTS_CONFIG,
};

// Apply separator profile to override theme separators
export function apply_separator_profile(
	base_config: SeparatorConfig,
	profile: SeparatorProfile,
): SeparatorConfig {
	const default_style = profile.default || 'thick';
	const overrides = profile.overrides || {};

	return {
		model: overrides.model || default_style,
		directory: {
			clean: overrides.directory_clean || default_style,
			dirty: overrides.directory_dirty || default_style,
			no_git: overrides.directory_no_git || default_style,
		},
		git: {
			clean: overrides.git_clean || default_style,
			dirty: overrides.git_dirty || default_style,
		},
	};
}

// Default segment visibility
function get_default_segment_visibility(): SegmentVisibility {
	return DEFAULT_SEGMENTS;
}

// Load config from JSON file
function load_config_from_file(): Partial<StatuslineConfig> | null {
	const config_paths = [
		// Environment variable override (for demos and testing)
		process.env.STATUSLINE_CONFIG,
		// Primary config location
		path.join(
			os.homedir(),
			'.claude',
			'claude-statusline-powerline.json',
		),
		// Project-specific override
		path.join(process.cwd(), '.claude-statusline-powerline.json'),
	].filter(Boolean) as string[]; // Remove any undefined values

	for (const config_path of config_paths) {
		try {
			if (fs.existsSync(config_path)) {
				const file_content = fs.readFileSync(config_path, 'utf8');
				return JSON.parse(file_content);
			}
		} catch (error) {
			console.error(
				`Failed to load config from ${config_path}:`,
				error,
			);
		}
	}

	return null;
}

// Get the primary config file path
export function get_config_path(): string {
	return path.join(
		os.homedir(),
		'.claude',
		'claude-statusline-powerline.json',
	);
}

// Create default config template
export const DEFAULT_CONFIG_TEMPLATE = {
	color_theme: 'dark',
	font_profile: 'powerline',
	segment_config: {
		segments: [
			{
				type: 'model',
				enabled: true,
				order: 1,
				style: {
					bg_color: '#1e40af',
					fg_color: '#ffffff',
					separator: {
						style: 'thick',
						color: '#1e40af',
					},
				},
			},
			{
				type: 'directory',
				enabled: true,
				order: 2,
			},
			{
				type: 'git',
				enabled: true,
				order: 3,
			},
			{
				type: 'session',
				enabled: true,
				order: 4,
			},
		],
	},
};

// Load configuration from JSON file or use defaults
export function load_config(): StatuslineConfig {
	// Load from JSON file
	const file_config = load_config_from_file();

	// Start with default configuration
	let config: StatuslineConfig = {
		...DEFAULT_CONFIG,
		segments: get_default_segment_visibility(),
		color_theme: 'dark',
		font_profile: 'powerline',
		current_theme: get_theme('dark'),
	};

	// Merge file config if available
	if (file_config) {
		config = {
			...config,
			...file_config,
			// Ensure theme gets updated if specified in file
			current_theme: get_theme(
				file_config.color_theme || config.color_theme || 'dark',
			),
			// Merge segment configurations if provided
			segment_config:
				file_config.segment_config || config.segment_config,
		};
	}

	return config;
}

// Model pricing configuration (per million tokens)
export const MODEL_PRICING: Record<string, ModelPricing> = {
	// Claude Opus 4.1 (Max plan only)
	'claude-opus-4-1-20250805': {
		inputTokens: 15,
		outputTokens: 75,
		cacheTokens: 1.5,
		contextWindow: 200000,
	},

	// Claude Opus 4 (Max plan only)
	'claude-opus-4-20250514': {
		inputTokens: 15,
		outputTokens: 75,
		cacheTokens: 1.5,
		contextWindow: 200000,
	},

	// Claude Sonnet 4
	'claude-sonnet-4-20250514': {
		inputTokens: 3,
		outputTokens: 15,
		cacheTokens: 0.3,
		contextWindow: 200000,
	},

	// Claude Sonnet 3.7
	'claude-3-7-sonnet-20250219': {
		inputTokens: 3,
		outputTokens: 15,
		cacheTokens: 0.3,
		contextWindow: 200000,
	},

	// Claude Haiku 3.5
	'claude-3-5-haiku-20241022': {
		inputTokens: 0.8,
		outputTokens: 4,
		cacheTokens: 0.08,
		contextWindow: 200000,
	},
};

// Default pricing for unknown models (Sonnet rates)
export const DEFAULT_PRICING: ModelPricing = {
	inputTokens: 3,
	outputTokens: 15,
	cacheTokens: 0.3,
	contextWindow: 200000,
};
