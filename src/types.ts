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
 */
export type SegmentType = 'model' | 'directory' | 'git' | 'session';

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
export type ColorTheme = 'dark' | 'electric' | 'night-owl';

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
}

/**
 * Profile-based separator configuration with defaults and overrides
 * Allows defining a default separator style with specific overrides
 */
export interface SeparatorProfile {
	/** Default separator style for all segments */
	default?: SeparatorStyle;
	/** Specific overrides for individual segments */
	overrides?: {
		/** Override separator for model segment */
		model?: SeparatorStyle;
		/** Override separator for directory segment */
		directory?: SeparatorStyle;
		/** Override separator for session segment */
		session?: SeparatorStyle;
	} & {
		/** Override separators for specific git states (e.g., git_dirty, git_clean) */
		[K in GitState as `git_${K}`]?: SeparatorStyle;
	};
}

/**
 * Defines which segments are visible in the statusline
 * All segment types must be explicitly enabled/disabled
 */
export interface SegmentVisibility
	extends Record<SegmentType, boolean> {}

/**
 * Defines which segments appear on a specific line
 * Segments are optional (can be omitted from a line)
 */
export interface LineSegments
	extends Partial<Record<SegmentType, boolean>> {}

/**
 * Configuration for a single display line
 */
export interface DisplayLine {
	/** Which segments to show on this line */
	segments: LineSegments;
}

/**
 * Multi-line display configuration
 * Allows organizing segments across multiple lines
 */
export interface DisplayConfig {
	/** Array of line configurations */
	lines: DisplayLine[];
}

/**
 * Configuration for truncating segment content when too long
 */
export interface TruncationConfig
	extends Partial<Record<SegmentType, number>> {
	/** Maximum characters for model segment */
	model_length?: number;
	/** Maximum characters for directory segment */
	directory_length?: number;
	/** Maximum characters for git segment */
	git_length?: number;
	/** Maximum characters for session segment */
	session_length?: number;
}

/**
 * Complete configuration for the statusline
 * This is the main configuration interface that combines all settings
 */
export interface StatuslineConfig {
	/** Separator styles configuration */
	separators: SeparatorConfig;
	/** Alternative profile-based separator configuration */
	separatorProfile?: SeparatorProfile;
	/** Which segments to display */
	segments: SegmentVisibility;
	/** Multi-line display configuration (overrides segments) */
	display?: DisplayConfig;
	/** Theme for styling and separator patterns */
	theme: ThemeType;
	/** Color scheme */
	color_theme?: ColorTheme;
	/** Runtime theme object (populated automatically) */
	current_theme?: any;
	/** Font profile determining available separator characters */
	font_profile?: FontProfile;
	/** Advanced segment configuration with styling */
	segment_config?: SegmentsConfiguration;
	/** Content truncation settings */
	truncation?: TruncationConfig;
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
	/** Whether this segment is enabled */
	enabled: boolean;
	/** Display order (lower numbers appear first) */
	order: number;
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
	priority: number; // Lower numbers appear first
	is_enabled(config: StatuslineConfig): boolean;
	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null;
}
