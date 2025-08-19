/**
 * Input data structure for Claude statusline generation
 */
export interface ClaudeStatusInput {
	/** Unique identifier for the current session */
	session_id: string;
	/** Optional path to transcript file containing conversation history */
	transcript_path?: string;
	/** Optional current working directory */
	cwd?: string;
	/** Model information */
	model: {
		/** Optional model identifier */
		id?: string;
		/** Display name for the model */
		display_name: string;
	};
	/** Workspace information */
	workspace: {
		/** Current working directory */
		current_dir: string;
		/** Optional project root directory */
		project_dir?: string;
	};
}

/**
 * Individual status segment with styling information
 */
export interface StatusSegment {
	/** Text content of the segment */
	content: string;
	/** Background color (hex or color name) */
	bg_color: string;
	/** Foreground/text color (hex or color name) */
	fg_color: string;
}

/**
 * Available separator styles for powerline segments
 * - `thick`: Bold separator
 * - `thin`: Minimal separator
 * - `flame`: Fire-like jagged separator
 * - `wave`: Wavy separator
 * - `lightning`: Zigzag separator
 * - `curvy`: Smooth curved separator
 * - `angly`: Sharp angled separator
 * - `angly2`: Alternative angled separator
 * - `double_chevron`: Double arrow separator
 * - `none`: No separator
 */
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

/**
 * Types of segments that can be displayed in the statusline
 * - `model`: Shows current AI model information
 * - `directory`: Shows current directory/path
 * - `git`: Shows git repository status
 * - `session`: Shows session usage/cost information
 * - `context`: Shows cache hit rate and context usage
 * - `usage`: Shows usage statistics from SQLite database
 */
export type SegmentType =
	| 'model'
	| 'directory'
	| 'git'
	| 'session'
	| 'context'
	| 'usage';

/**
 * Available themes that define separator and styling patterns
 * - `minimal`: Clean, minimal separators
 * - `expressive`: Mixed separator styles with visual variety
 * - `subtle`: Understated styling
 * - `electric`: Bold, high-contrast styling
 * - `curvy`: All curved separators
 * - `angular`: All angular separators
 * - `custom`: User-defined theme
 */
export type ThemeType =
	| 'minimal'
	| 'expressive'
	| 'subtle'
	| 'electric'
	| 'curvy'
	| 'angular'
	| 'custom';

/**
 * Available color themes
 * - `dark`: Dark theme with muted colors
 * - `electric`: High-contrast electric colors
 * - `night-owl`: Night Owl inspired color scheme
 */
export type ColorTheme =
	| 'dark'
	| 'electric'
	| 'night-owl'
	| 'dracula'
	| 'gruvbox'
	| 'one-dark'
	| 'monokai'
	| 'nord'
	| 'tokyo-night'
	| 'solarized-light'
	| 'gruvbox-light'
	| 'alucard';

/**
 * Font profiles that determine available separator characters
 * - `powerline`: Uses Powerline font symbols
 * - `nerd-font`: Uses Nerd Font symbols with more variety
 */
export type FontProfile = 'powerline' | 'nerd-font';

/**
 * Git repository states that can have different separator styles
 * - `clean`: Repository has no changes
 * - `dirty`: Repository has uncommitted changes
 * - `ahead`: Local branch is ahead of remote
 * - `behind`: Local branch is behind remote
 * - `conflicts`: Repository has merge conflicts
 * - `staged`: Repository has staged changes
 * - `untracked`: Repository has untracked files
 */
export type GitState =
	| 'clean'
	| 'dirty'
	| 'ahead'
	| 'behind'
	| 'conflicts'
	| 'staged'
	| 'untracked';

/**
 * Configuration for separator styles across all segments
 * Defines which separator style to use for each segment type and git state
 */
export interface SeparatorConfig {
	/** Separator style for the model segment */
	model: SeparatorStyle;
	/** Separator style for the directory segment */
	directory: SeparatorStyle;
	/** Separator styles for different git states */
	git: Record<GitState, SeparatorStyle>;
	/** Separator style for the session segment */
	session: SeparatorStyle;
	/** Separator style for the context segment */
	context: SeparatorStyle;
	/** Separator style for the usage segment */
	usage?: SeparatorStyle;
}

/**
 * Defines which segments appear on a specific line
 * Segments are optional (can be omitted from a line)
 */
export interface LineSegments
	extends Partial<Record<SegmentType, boolean>> {}

/**
 * Configuration for truncating segment content when too long
 */

/**
 * Complete configuration for the statusline
 * This is the main configuration interface that combines all settings
 */
export interface StatuslineConfig {
	/** Separator styles configuration */
	separators: SeparatorConfig;
	/** Color scheme */
	color_theme?: ColorTheme;
	/** Runtime theme object (populated automatically) */
	current_theme?: any;
	/** Font profile determining available separator characters */
	font_profile?: FontProfile;
	/** Advanced segment configuration with styling */
	segment_config?: SegmentsConfiguration;
}

/**
 * Session usage statistics for cost/token tracking
 */
export interface SessionUsage {
	/** Total input tokens used in session */
	totalInputTokens: number;
	/** Total output tokens generated in session */
	totalOutputTokens: number;
	/** Total cache tokens used in session */
	totalCacheTokens: number;
	/** Total estimated cost in USD */
	totalCost: number;
	/** Model identifier used in session */
	modelUsed?: string;
	/** Session duration in seconds */
	sessionDuration?: number;
}

/**
 * Pricing information for AI models
 * Used to calculate session costs
 */
export interface ModelPricing {
	/** Human-readable model name */
	name?: string;
	/** Cost per input token */
	input_tokens: number;
	/** Cost per output token */
	output_tokens: number;
	/** Cost per cache token */
	cache_tokens: number;
	/** Maximum context window size */
	context_window: number;
}

/**
 * Styling configuration for individual segments
 */
export interface SegmentStyleConfig {
	/** Background color (hex or color name) */
	bg_color?: string;
	/** Foreground/text color (hex or color name) */
	fg_color?: string;
	/** Separator styling */
	separator?: {
		/** Separator style override */
		style?: SeparatorStyle;
		/** Separator color override */
		color?: string;
	};
	/** Custom icons for the segment */
	icons?: {
		[key: string]: string;
	};
	/** Maximum length before truncation */
	truncation_length?: number;
}

/**
 * Configuration for a single segment with advanced options
 */
export interface SegmentConfig {
	/** Type of segment */
	type: SegmentType;
	/** Custom styling for this segment */
	style?: SegmentStyleConfig;
}

/**
 * Advanced segment configuration system
 * Allows fine-grained control over segment appearance and behavior
 */
export interface SegmentsConfiguration {
	/** Array of segment configurations */
	segments: SegmentConfig[];
	/** Multi-line configuration - which segments appear on each line */
	lines?: LineSegments[];
}

// =============================================================================
// THEME INTERFACES
// =============================================================================

/**
 * Base colors for a theme - hex values
 */
export interface ThemePalette {
	/** Primary accent color */
	primary: string;
	/** Secondary accent color */
	secondary: string;
	/** Success/clean state color */
	success: string;
	/** Warning/dirty state color */
	warning: string;
	/** Error/conflict state color */
	error: string;
	/** Neutral/directory color */
	neutral: string;
	/** Light text color */
	text_light: string;
	/** Dark text color */
	text_dark: string;
}

/**
 * Individual segment styling with ANSI codes
 */
export interface SegmentTheme {
	background: string;
	foreground: string;
	separator_color: string;
}

/**
 * Complete theme with computed segment styles
 */
export interface StatuslineTheme {
	name: string;
	palette: ThemePalette;
	segments: {
		model: SegmentTheme;
		directory: SegmentTheme;
		git: {
			clean: SegmentTheme;
			dirty: SegmentTheme;
		};
		session: SegmentTheme;
		context: SegmentTheme;
		usage?: SegmentTheme;
	};
}

// =============================================================================
// FONT PROFILE INTERFACES
// =============================================================================

/**
 * Complete font profile with symbols and separators
 */
export interface FontProfileData {
	name: string;
	description: string;
	symbols: {
		branch: string;
		dirty: string;
		clean: string;
		folder: string;
		ai: string;
		warning: string;
		error: string;
		info: string;
		cost: string;
		ahead: string;
		behind: string;
		conflicts: string;
		staged_add: string;
		staged_del: string;
		unstaged: string;
		untracked: string;
		brain: string;
	};
	separators: {
		basic: {
			left: string;
			right: string;
			left_thin: string;
			right_thin: string;
		};
		extra: {
			curvy?: string;
			curvy_left?: string;
			angly?: string;
			angly_left?: string;
			angly2?: string;
			angly2_left?: string;
			flame?: string;
			flame_left?: string;
			double_chevron?: string;
			double_chevron_left?: string;
		};
	};
}

// =============================================================================
// GIT INTERFACES
// =============================================================================

/**
 * Git repository information
 */
export interface GitInfo {
	branch: string;
	is_dirty: boolean;
	ahead: number;
	behind: number;
	conflicts: boolean;
	staged_add: number;
	staged_del: number;
	unstaged: number;
	untracked: number;
}

// =============================================================================
// SEGMENT INTERFACES
// =============================================================================

/**
 * Segment data with styling information
 */
export interface SegmentData {
	content: string;
	bg_color: string;
	fg_color: string;
	separator_from_color: string;
	separator_style?: string;
}

/**
 * Interface for segment builders
 */
export interface SegmentBuilder {
	name: string;
	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null;
}

// =============================================================================
// DATABASE INTERFACES
// =============================================================================

/**
 * Database record for individual sessions
 */
export interface SessionRecord {
	/** Database primary key */
	id?: number;
	/** Unique session identifier */
	session_id: string;
	/** Model name used in session */
	model: string;
	/** Session start timestamp (ISO string) */
	start_time: string;
	/** Session end timestamp (ISO string) */
	end_time?: string;
	/** Total input tokens used */
	input_tokens: number;
	/** Total output tokens generated */
	output_tokens: number;
	/** Total cache tokens used */
	cache_tokens: number;
	/** Total estimated cost in USD */
	cost: number;
	/** Project directory path */
	project_dir?: string;
}

/**
 * Aggregated daily usage statistics
 */
export interface DailySummary {
	/** Date in YYYY-MM-DD format */
	date: string;
	/** Total number of sessions */
	total_sessions: number;
	/** Total input tokens across all sessions */
	total_input_tokens: number;
	/** Total output tokens across all sessions */
	total_output_tokens: number;
	/** Total cache tokens across all sessions */
	total_cache_tokens: number;
	/** Total cost across all sessions */
	total_cost: number;
	/** JSON string array of models used */
	models_used: string;
}

/**
 * Complete usage summary with time-based aggregations
 */
export interface UsageSummary {
	/** Today's usage summary */
	today: DailySummary;
	/** Past week's usage summary */
	week: DailySummary;
	/** Past month's usage summary */
	month: DailySummary;
	/** Recent session records */
	recent_sessions: SessionRecord[];
}
