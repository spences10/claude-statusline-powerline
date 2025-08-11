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
};

// Default configuration
export const DEFAULT_CONFIG: StatuslineConfig = {
	separators: SEPARATOR_THEMES.expressive,
	theme: 'expressive',
};

// Load configuration from environment or use default
export function loadConfig(): StatuslineConfig {
	const themeFromEnv = process.env
		.STATUSLINE_THEME as keyof typeof SEPARATOR_THEMES;

	if (themeFromEnv && SEPARATOR_THEMES[themeFromEnv]) {
		return {
			separators: SEPARATOR_THEMES[themeFromEnv],
			theme: themeFromEnv as any,
		};
	}

	return DEFAULT_CONFIG;
}
