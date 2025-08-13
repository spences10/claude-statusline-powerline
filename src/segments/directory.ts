import * as path from 'path';
import { get_font_profile } from '../font-profiles';
import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { get_git_info } from '../utils/git';
import { BaseSegment, SegmentData } from './base';

// Fallback colors
const FALLBACK_COLORS = {
	bg: '\x1b[100m',
	fg: '\x1b[97m',
	separator: '\x1b[90m',
};

export class DirectorySegment extends BaseSegment {
	name = 'directory';
	priority = 20;

	is_enabled(config: StatuslineConfig): boolean {
		return config.segments.directory;
	}

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		const cwd = data.workspace?.current_dir || process.cwd();
		const dir_name = path.basename(cwd) || '~';
		const font_profile = get_font_profile(config.font_profile);

		// Determine separator style based on git status and next segment
		const git_info = get_git_info(cwd);
		let separator_style: string;

		if (config.segments.git) {
			separator_style = git_info?.is_dirty
				? config.separators.directory.dirty
				: config.separators.directory.clean;
		} else {
			separator_style = config.separators.directory.no_git;
		}

		const theme = config.current_theme?.segments.directory;
		const style_override = this.getSegmentConfig(config);

		if (!theme) {
			// Fallback to hardcoded colors if no theme
			return this.createSegment(
				`${font_profile.symbols.folder} ${dir_name}`,
				FALLBACK_COLORS.bg,
				FALLBACK_COLORS.fg,
				FALLBACK_COLORS.separator,
				separator_style,
				style_override,
			);
		}

		return this.createSegment(
			`${font_profile.symbols.folder} ${dir_name}`,
			theme.background,
			theme.foreground,
			theme.separator_color,
			separator_style,
			style_override,
		);
	}
}
