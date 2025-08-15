import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { get_theme } from './themes';
import {
	GitState,
	ModelPricing,
	SegmentsConfiguration,
	SegmentVisibility,
	SeparatorConfig,
	SeparatorProfile,
	SeparatorStyle,
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
			directory: 'lightning',
			git_dirty: 'flame',
		},
	},
	'minimal-clean': {
		default: 'thin',
		overrides: {
			directory: 'thick',
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

// Helper function to create separator theme with base style and overrides
function create_separator_theme(
	base_style: SeparatorStyle,
	overrides: {
		model?: SeparatorStyle;
		directory?: SeparatorStyle;
		git?: Partial<Record<GitState, SeparatorStyle>>;
		session?: SeparatorStyle;
		context?: SeparatorStyle;
	} = {},
): SeparatorConfig {
	const base_theme: SeparatorConfig = {
		model: base_style,
		directory: base_style,
		git: {
			clean: base_style,
			dirty: base_style,
			ahead: base_style,
			behind: base_style,
			conflicts: base_style,
			staged: base_style,
			untracked: base_style,
		},
		session: base_style,
		context: base_style,
	};

	return {
		...base_theme,
		...overrides,
		git: {
			...base_theme.git,
			...overrides.git,
		},
	};
}

// Separator theme presets
export const SEPARATOR_THEMES: Record<string, SeparatorConfig> = {
	minimal: create_separator_theme('thin', {
		git: {
			dirty: 'thick',
			conflicts: 'thick',
		},
	}),

	expressive: create_separator_theme('wave', {
		git: {
			clean: 'thick',
			dirty: 'lightning',
			ahead: 'flame',
			conflicts: 'lightning',
			staged: 'thick',
			untracked: 'thin',
		},
		context: 'curvy',
	}),

	subtle: create_separator_theme('thick', {
		git: {
			dirty: 'flame',
			conflicts: 'flame',
			untracked: 'thin',
		},
	}),

	// Fun experimental preset
	electric: create_separator_theme('lightning', {
		directory: 'flame',
		git: {
			clean: 'wave',
			behind: 'wave',
			conflicts: 'flame',
			untracked: 'flame',
		},
	}),

	// Powerline-extra-symbols themes for Victor Mono compatibility
	curvy: create_separator_theme('curvy', {
		git: {
			dirty: 'flame',
			conflicts: 'flame',
		},
	}),

	angular: create_separator_theme('angly', {
		git: {
			dirty: 'flame',
			conflicts: 'flame',
		},
	}),
};

// Default segment visibility
export const DEFAULT_SEGMENTS: SegmentVisibility = {
	model: true,
	directory: true,
	git: true,
	session: true,
	context: true, // enabled by default
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
		directory: overrides.directory || default_style,
		git: {
			clean: overrides.git_clean || default_style,
			dirty: overrides.git_dirty || default_style,
			ahead: overrides.git_ahead || default_style,
			behind: overrides.git_behind || default_style,
			conflicts: overrides.git_conflicts || default_style,
			staged: overrides.git_staged || default_style,
			untracked: overrides.git_untracked || default_style,
		},
		session: overrides.session || default_style,
		context: overrides.context || default_style,
	};
}

// Default segment visibility
function get_default_segment_visibility(): SegmentVisibility {
	return DEFAULT_SEGMENTS;
}

// Load config from JSON file
function load_config_from_file(): Partial<StatuslineConfig> | null {
	// If STATUSLINE_CONFIG is set (demo mode), use only that config
	if (process.env.STATUSLINE_CONFIG) {
		try {
			if (fs.existsSync(process.env.STATUSLINE_CONFIG)) {
				const file_content = fs.readFileSync(
					process.env.STATUSLINE_CONFIG,
					'utf8',
				);
				return JSON.parse(file_content);
			}
		} catch (error) {
			console.error(
				`Failed to load config from ${process.env.STATUSLINE_CONFIG}:`,
				error,
			);
		}
		return null;
	}

	// Normal config loading hierarchy
	const config_sources = [
		{
			name: 'global',
			path: path.join(
				os.homedir(),
				'.claude',
				'claude-statusline-powerline.json',
			),
		},
		{
			name: 'project',
			path: path.join(
				process.cwd(),
				'.claude',
				'claude-statusline-powerline.json',
			),
		},
	];

	let merged_config: Partial<StatuslineConfig> = {};

	// Load configs in order, with later ones overriding earlier ones
	for (const source of config_sources) {
		try {
			if (fs.existsSync(source.path)) {
				const file_content = fs.readFileSync(source.path, 'utf8');
				const parsed_config = JSON.parse(file_content);
				merged_config = { ...merged_config, ...parsed_config };
			}
		} catch (error) {
			console.error(
				`Failed to load config from ${source.path}:`,
				error,
			);
		}
	}

	return Object.keys(merged_config).length > 0 ? merged_config : null;
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
		name: 'Claude Opus 4.1',
		input_tokens: 15,
		output_tokens: 75,
		cache_tokens: 1.5,
		context_window: 200000,
	},

	// Claude Opus 4 (Max plan only)
	'claude-opus-4-20250514': {
		name: 'Claude Opus 4',
		input_tokens: 15,
		output_tokens: 75,
		cache_tokens: 1.5,
		context_window: 200000,
	},

	// Claude Sonnet 4 - 1M context support with tiered pricing
	'claude-sonnet-4-20250514': {
		name: 'Claude Sonnet 4',
		input_tokens: 3, // ≤200K tokens, 6 for >200K
		output_tokens: 15, // ≤200K tokens, 22.5 for >200K
		cache_tokens: 0.3,
		context_window: 1000000, // 1M tokens
	},

	// Claude Sonnet 4 (simplified alias)
	'claude-sonnet-4': {
		name: 'Claude Sonnet 4',
		input_tokens: 3, // ≤200K tokens, 6 for >200K
		output_tokens: 15, // ≤200K tokens, 22.5 for >200K
		cache_tokens: 0.3,
		context_window: 1000000, // 1M tokens
	},

	// Claude Sonnet 3.7
	'claude-3-7-sonnet-20250219': {
		name: 'Claude Sonnet 3.7',
		input_tokens: 3,
		output_tokens: 15,
		cache_tokens: 0.3,
		context_window: 200000,
	},

	// Claude Haiku 3.5
	'claude-3-5-haiku-20241022': {
		name: 'Claude Haiku 3.5',
		input_tokens: 0.8,
		output_tokens: 4,
		cache_tokens: 0.08,
		context_window: 200000,
	},
};

// Default pricing for unknown models (Sonnet rates)
export const DEFAULT_PRICING: ModelPricing = {
	name: 'Unknown 🤷',
	input_tokens: 3,
	output_tokens: 15,
	cache_tokens: 0.3,
	context_window: 200000,
};
