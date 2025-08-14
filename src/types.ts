export interface ClaudeStatusInput {
	session_id: string;
	transcript_path?: string;
	cwd?: string;
	model: {
		id?: string;
		display_name: string;
	};
	workspace: {
		current_dir: string;
		project_dir?: string;
	};
}

export interface StatusSegment {
	content: string;
	bg_color: string;
	fg_color: string;
}

export type SeparatorStyle =
	| 'thick'
	| 'thin'
	| 'flame'
	| 'wave'
	| 'lightning'
	| 'curvy'
	| 'angly'
	| 'angly2'
	| 'double_chevron'
	| 'none';

// Base segment types that can be extended
export type SegmentType = 'model' | 'directory' | 'git' | 'session';

// Theme types that can be extended
export type ThemeType =
	| 'minimal'
	| 'expressive'
	| 'subtle'
	| 'electric'
	| 'curvy'
	| 'angular'
	| 'custom';

// Color theme types that can be extended
export type ColorTheme = 'dark' | 'electric' | 'night-owl';

// Font profile types that can be extended
export type FontProfile = 'powerline' | 'nerd-font';

// Git state keys that can have different separator styles
export type GitState =
	| 'clean'
	| 'dirty'
	| 'ahead'
	| 'behind'
	| 'conflicts'
	| 'staged'
	| 'untracked';

export interface SeparatorConfig {
	model: SeparatorStyle;
	directory: SeparatorStyle;
	git: Record<GitState, SeparatorStyle>;
	session: SeparatorStyle;
}

export interface SeparatorProfile {
	default?: SeparatorStyle;
	overrides?: {
		model?: SeparatorStyle;
		directory?: SeparatorStyle;
		session?: SeparatorStyle;
	} & {
		[K in GitState as `git_${K}`]?: SeparatorStyle;
	};
}

export interface SegmentVisibility
	extends Record<SegmentType, boolean> {}

export interface LineSegments
	extends Partial<Record<SegmentType, boolean>> {}

export interface DisplayLine {
	segments: LineSegments;
}

export interface DisplayConfig {
	lines: DisplayLine[];
}

export interface TruncationConfig
	extends Partial<Record<SegmentType, number>> {
	model_length?: number;
	directory_length?: number;
	git_length?: number;
	session_length?: number;
}

export interface StatuslineConfig {
	separators: SeparatorConfig;
	separatorProfile?: SeparatorProfile;
	segments: SegmentVisibility;
	display?: DisplayConfig;
	theme: ThemeType;
	color_theme?: ColorTheme;
	current_theme?: any; // Will be populated with actual theme object
	// Font profile
	font_profile?: FontProfile;
	// New flexible segment configuration
	segment_config?: SegmentsConfiguration;
	// Truncation configuration
	truncation?: TruncationConfig;
}

export interface SessionUsage {
	totalInputTokens: number;
	totalOutputTokens: number;
	totalCacheTokens: number;
	totalCost: number;
	modelUsed?: string;
	sessionDuration?: number;
}

export interface ModelPricing {
	name?: string;
	input_tokens: number;
	output_tokens: number;
	cache_tokens: number;
	context_window: number;
}

export interface SegmentStyleConfig {
	bg_color?: string;
	fg_color?: string;
	separator?: {
		style?: SeparatorStyle;
		color?: string;
	};
	icons?: {
		[key: string]: string;
	};
	truncation_length?: number;
}

export interface SegmentConfig {
	type: SegmentType;
	enabled: boolean;
	order: number;
	style?: SegmentStyleConfig;
}

export interface SegmentsConfiguration {
	segments: SegmentConfig[];
}
