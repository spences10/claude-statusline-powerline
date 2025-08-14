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

			const max_length =
				style_override?.truncation_length ||
				config.truncation?.git_length ||
				25;

			// Truncate long branch names
			const branch_name =
				git_info.branch.length > max_length
					? `${git_info.branch.slice(0, max_length - 3)}...`
					: git_info.branch;

			// Get icons with potential user overrides
			const branch_icon = get_symbol(
				font_profile,
				'branch',
				style_override?.icons,
			);

			// Build status indicators
			let status_parts: string[] = [];

			// Ahead/behind arrows with counts
			if (git_info.ahead > 0) {
				const ahead_icon = get_symbol(
					font_profile,
					'ahead',
					style_override?.icons,
				);
				status_parts.push(`${ahead_icon}${git_info.ahead}`);
			}
			if (git_info.behind > 0) {
				const behind_icon = get_symbol(
					font_profile,
					'behind',
					style_override?.icons,
				);
				status_parts.push(`${behind_icon}${git_info.behind}`);
			}

			// Conflict warning
			if (git_info.conflicts) {
				const conflicts_icon = get_symbol(
					font_profile,
					'conflicts',
					style_override?.icons,
				);
				status_parts.push(conflicts_icon);
			}

			// Staged additions/deletions counts (only show if > 0)
			if (git_info.staged_add > 0) {
				const staged_add_icon = get_symbol(
					font_profile,
					'staged_add',
					style_override?.icons,
				);
				status_parts.push(`${staged_add_icon}${git_info.staged_add}`);
			}
			if (git_info.staged_del > 0) {
				const staged_del_icon = get_symbol(
					font_profile,
					'staged_del',
					style_override?.icons,
				);
				status_parts.push(`${staged_del_icon}${git_info.staged_del}`);
			}

			// Unstaged changes count
			if (git_info.unstaged > 0) {
				const unstaged_icon = get_symbol(
					font_profile,
					'unstaged',
					style_override?.icons,
				);
				status_parts.push(`${unstaged_icon}${git_info.unstaged}`);
			}
			if (git_info.untracked > 0) {
				const untracked_icon = get_symbol(
					font_profile,
					'untracked',
					style_override?.icons,
				);
				status_parts.push(`${untracked_icon}${git_info.untracked}`);
			}

			// Fallback to basic clean/dirty if no detailed status
			if (status_parts.length === 0) {
				const status_icon = git_info.is_dirty
					? get_symbol(font_profile, 'dirty', style_override?.icons)
					: get_symbol(font_profile, 'clean', style_override?.icons);
				status_parts.push(status_icon);
			}

			const status_display = status_parts.join(' ');

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
					`${branch_icon} ${branch_name} ${status_display}`.trimEnd(),
					fallback_bg,
					COLORS.black,
					fallback_separator,
					separator_style,
					style_override,
				);
			}

			return this.createSegment(
				`${branch_icon} ${branch_name} ${status_display}`.trimEnd(),
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
					config.separators.git.clean,
					style_override,
				);
			}

			return this.createSegment(
				`${folder_icon} no git`.trimEnd(),
				theme.background,
				theme.foreground,
				theme.separator_color,
				config.separators.git.clean,
				style_override,
			);
		}
	}
}
