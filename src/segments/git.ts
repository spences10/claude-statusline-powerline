import { BaseSegment, SegmentData } from './base';
import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { get_font_profile } from '../font-profiles';
import { get_git_info } from '../utils/git';

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

	build(data: ClaudeStatusInput, config: StatuslineConfig): SegmentData | null {
		const cwd = data.workspace?.current_dir || process.cwd();
		const git_info = get_git_info(cwd);
		const font_profile = get_font_profile();

		if (git_info) {
			const git_bg = git_info.is_dirty ? COLORS.bg.yellow : COLORS.bg.green;
			const git_fg = git_info.is_dirty ? COLORS.fg.yellow : COLORS.fg.green;
			
			const status_icon = git_info.is_dirty
				? font_profile.symbols.dirty
				: font_profile.symbols.clean;
			
			const separator_style = git_info.is_dirty
				? config.separators.git.dirty
				: config.separators.git.clean;

			return this.createSegment(
				`${font_profile.symbols.branch} ${git_info.branch} ${status_icon}`,
				git_bg,
				COLORS.black,
				git_fg,
				separator_style,
			);
		} else {
			// Fallback for no git repo
			return this.createSegment(
				`${font_profile.symbols.folder} no git`,
				COLORS.bg.gray,
				COLORS.white,
				COLORS.fg.gray,
				config.separators.directory.noGit,
			);
		}
	}
}