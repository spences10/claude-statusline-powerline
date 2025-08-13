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

export interface GitInfo {
	branch: string;
	is_dirty: boolean;
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
	| 'none';

export interface SeparatorConfig {
	model: SeparatorStyle;
	directory: {
		clean: SeparatorStyle;
		dirty: SeparatorStyle;
		no_git: SeparatorStyle;
	};
	git: {
		clean: SeparatorStyle;
		dirty: SeparatorStyle;
	};
}

export interface SeparatorProfile {
	default?: SeparatorStyle;
	overrides?: {
		model?: SeparatorStyle;
		directory_clean?: SeparatorStyle;
		directory_dirty?: SeparatorStyle;
		git_clean?: SeparatorStyle;
		git_dirty?: SeparatorStyle;
		directory_no_git?: SeparatorStyle;
	};
}

export interface SegmentVisibility {
	model: boolean;
	directory: boolean;
	git: boolean;
	session: boolean;
}

export interface LineSegments {
	model?: boolean;
	directory?: boolean;
	git?: boolean;
	session?: boolean;
}

export interface DisplayLine {
	segments: LineSegments;
}

export interface DisplayConfig {
	lines: DisplayLine[];
}

export interface StatuslineConfig {
	separators: SeparatorConfig;
	separatorProfile?: SeparatorProfile;
	segments: SegmentVisibility;
	display?: DisplayConfig;
	theme:
		| 'minimal'
		| 'expressive'
		| 'subtle'
		| 'electric'
		| 'curvy'
		| 'angular'
		| 'custom';
	// New theme system
	color_theme?: string; // 'dark', 'electric', etc.
	current_theme?: any; // Will be populated with actual theme object
	// Font profile
	font_profile?: string; // 'powerline', 'nerd-font'
	// New flexible segment configuration
	segment_config?: SegmentsConfiguration;
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
	inputTokens: number;
	outputTokens: number;
	cacheTokens: number;
	contextWindow: number;
}

export interface SegmentStyleConfig {
	bg_color?: string;
	fg_color?: string;
	separator?: {
		style?: SeparatorStyle;
		color?: string;
	};
}

export interface SegmentConfig {
	type: 'model' | 'directory' | 'git' | 'session';
	enabled: boolean;
	order: number;
	style?: SegmentStyleConfig;
}

export interface SegmentsConfiguration {
	segments: SegmentConfig[];
}
