import { get_font_profile, get_symbol } from '../font-profiles';
import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { get_git_info } from '../utils/git';
import { BaseSegment, SegmentData } from './base';

// ANSI color codes
const COLORS = {
	bg: {
		green: '\x1b[42m',
		yellow: '\x1b[43m',
		gray: '\x1b[100m',
	},
	fg: {
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		gray: '\x1b[90m',
	},
	white: '\x1b[97m',
	black: '\x1b[30m',
};

export class GitSegment extends BaseSegment {
	name = 'git';
	priority = 30;

	is_enabled(config: StatuslineConfig): boolean {
		return config.segments.git;
	}

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		const cwd = data.workspace?.current_dir || process.cwd();
		const git_info = get_git_info(cwd);
		const font_profile = get_font_profile(config.font_profile);

		if (git_info) {
			const style_override = this.getSegmentConfig(config);

			// Truncate long branch names
			const branch_name =
				git_info.branch.length > 25
					? `${git_info.branch.slice(0, 22)}...`
					: git_info.branch;

			// Get icons with potential user overrides
			const branch_icon = get_symbol(
				font_profile,
				'branch',
				style_override?.icons,
			);
			const status_icon = git_info.is_dirty
				? get_symbol(font_profile, 'dirty', style_override?.icons)
				: get_symbol(font_profile, 'clean', style_override?.icons);

			const separator_style = git_info.is_dirty
				? config.separators.git.dirty
				: config.separators.git.clean;

			// Use theme colors
			const theme = git_info.is_dirty
				? config.current_theme?.segments.git.dirty
				: config.current_theme?.segments.git.clean;

			if (!theme) {
				// Fallback colors
				const fallback_bg = git_info.is_dirty
					? COLORS.bg.yellow
					: COLORS.bg.green;
				const fallback_separator = git_info.is_dirty
					? COLORS.fg.yellow
					: COLORS.fg.green;

				return this.createSegment(
					`${branch_icon} ${branch_name} ${status_icon}`.trimEnd(),
					fallback_bg,
					COLORS.black,
					fallback_separator,
					separator_style,
					style_override,
				);
			}

			return this.createSegment(
				`${branch_icon} ${branch_name} ${status_icon}`.trimEnd(),
				theme.background,
				theme.foreground,
				theme.separator_color,
				separator_style,
				style_override,
			);
		} else {
			// Fallback for no git repo - use directory theme
			const theme = config.current_theme?.segments.directory;
			const style_override = this.getSegmentConfig(config);

			// Get folder icon with potential user override
			const folder_icon = get_symbol(
				font_profile,
				'folder',
				style_override?.icons,
			);

			if (!theme) {
				return this.createSegment(
					`${folder_icon} no git`.trimEnd(),
					COLORS.bg.gray,
					COLORS.white,
					COLORS.fg.gray,
					config.separators.directory.no_git,
					style_override,
				);
			}

			return this.createSegment(
				`${folder_icon} no git`.trimEnd(),
				theme.background,
				theme.foreground,
				theme.separator_color,
				config.separators.directory.no_git,
				style_override,
			);
		}
	}
}
