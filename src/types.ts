export interface ClaudeStatusInput {
	session_id: string;
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
	modelToDirectory: SeparatorStyle;
	directoryToGit: {
		clean: SeparatorStyle;
		dirty: SeparatorStyle;
	};
	gitEnd: {
		clean: SeparatorStyle;
		dirty: SeparatorStyle;
	};
	noGit: SeparatorStyle;
}

export interface StatuslineConfig {
	separators: SeparatorConfig;
	theme: 'minimal' | 'expressive' | 'subtle' | 'custom';
}
