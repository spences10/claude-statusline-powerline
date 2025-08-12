import {
	ModelPricing,
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
			noGit: 'thin',
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
			noGit: 'thin',
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
			noGit: 'thin',
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
			noGit: 'flame',
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
			noGit: 'curvy',
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
			noGit: 'angly',
		},
		git: {
			clean: 'angly',
			dirty: 'flame',
		},
	},
};

// Default configuration
export const DEFAULT_CONFIG: StatuslineConfig = {
	separators: SEPARATOR_THEMES.expressive,
	theme: 'expressive',
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
			noGit: overrides.directory_no_git || default_style,
		},
		git: {
			clean: overrides.git_clean || default_style,
			dirty: overrides.git_dirty || default_style,
		},
	};
}

// Load configuration from environment or use default
export function load_config(): StatuslineConfig {
	const theme_from_env = process.env
		.STATUSLINE_THEME as keyof typeof SEPARATOR_THEMES;
	const separator_profile_from_env =
		process.env.STATUSLINE_SEPARATOR_PROFILE;

	// Get base theme
	let config: StatuslineConfig;
	if (theme_from_env && SEPARATOR_THEMES[theme_from_env]) {
		config = {
			separators: SEPARATOR_THEMES[theme_from_env],
			theme: theme_from_env as any,
		};
	} else {
		config = { ...DEFAULT_CONFIG };
	}

	// Apply separator profile override if specified
	if (
		separator_profile_from_env &&
		SEPARATOR_PROFILES[separator_profile_from_env]
	) {
		const profile = SEPARATOR_PROFILES[separator_profile_from_env];
		config.separators = apply_separator_profile(
			config.separators,
			profile,
		);
		config.separatorProfile = profile;
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
