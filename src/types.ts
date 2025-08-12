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
		noGit: SeparatorStyle;
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
		directoryClean?: SeparatorStyle;
		directoryDirty?: SeparatorStyle;
		gitClean?: SeparatorStyle;
		gitDirty?: SeparatorStyle;
		directoryNoGit?: SeparatorStyle;
	};
}

export interface StatuslineConfig {
	separators: SeparatorConfig;
	separatorProfile?: SeparatorProfile;
	theme:
		| 'minimal'
		| 'expressive'
		| 'subtle'
		| 'electric'
		| 'curvy'
		| 'angular'
		| 'custom';
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
}
