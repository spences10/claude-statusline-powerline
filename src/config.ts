import { SeparatorConfig, StatuslineConfig } from './types';

// Separator theme presets
export const SEPARATOR_THEMES: Record<string, SeparatorConfig> = {
	minimal: {
		modelToDirectory: 'thin',
		directoryToGit: {
			clean: 'thin',
			dirty: 'thick',
		},
		gitEnd: {
			clean: 'thin',
			dirty: 'thick',
		},
		noGit: 'thin',
	},

	expressive: {
		modelToDirectory: 'wave',
		directoryToGit: {
			clean: 'wave',
			dirty: 'flame',
		},
		gitEnd: {
			clean: 'thick',
			dirty: 'lightning',
		},
		noGit: 'thin',
	},

	subtle: {
		modelToDirectory: 'thick',
		directoryToGit: {
			clean: 'thick',
			dirty: 'wave',
		},
		gitEnd: {
			clean: 'thick',
			dirty: 'flame',
		},
		noGit: 'thin',
	},

	// Fun experimental preset
	electric: {
		modelToDirectory: 'lightning',
		directoryToGit: {
			clean: 'flame',
			dirty: 'lightning',
		},
		gitEnd: {
			clean: 'wave',
			dirty: 'lightning',
		},
		noGit: 'flame',
	},

	// Powerline-extra-symbols themes for Victor Mono compatibility
	curvy: {
		modelToDirectory: 'curvy',
		directoryToGit: {
			clean: 'curvy',
			dirty: 'angly',
		},
		gitEnd: {
			clean: 'curvy',
			dirty: 'flame',
		},
		noGit: 'curvy',
	},

	angular: {
		modelToDirectory: 'angly',
		directoryToGit: {
			clean: 'angly',
			dirty: 'angly2',
		},
		gitEnd: {
			clean: 'angly',
			dirty: 'flame',
		},
		noGit: 'angly',
	},
};

// Default configuration
export const DEFAULT_CONFIG: StatuslineConfig = {
	separators: SEPARATOR_THEMES.expressive,
	theme: 'expressive',
};

// Load configuration from environment or use default
export function load_config(): StatuslineConfig {
	const theme_from_env = process.env
		.STATUSLINE_THEME as keyof typeof SEPARATOR_THEMES;

	if (theme_from_env && SEPARATOR_THEMES[theme_from_env]) {
		return {
			separators: SEPARATOR_THEMES[theme_from_env],
			theme: theme_from_env as any,
		};
	}

	return DEFAULT_CONFIG;
}
