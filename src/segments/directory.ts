import * as path from 'path';
import { BaseSegment, SegmentData } from './base';
import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { get_font_profile } from '../font-profiles';
import { get_git_info } from '../utils/git';

// ANSI color codes
const COLORS = {
	bg: {
		gray: '\x1b[100m',
	},
	fg: {
		gray: '\x1b[90m',
	},
	white: '\x1b[97m',
};

export class DirectorySegment extends BaseSegment {
	name = 'directory';
	priority = 20;

	is_enabled(config: StatuslineConfig): boolean {
		return config.segments.directory;
	}

	build(data: ClaudeStatusInput, config: StatuslineConfig): SegmentData | null {
		const cwd = data.workspace?.current_dir || process.cwd();
		const dir_name = path.basename(cwd) || '~';
		const font_profile = get_font_profile();
		
		// Determine separator style based on git status and next segment
		const git_info = get_git_info(cwd);
		let separator_style: string;
		
		if (config.segments.git) {
			separator_style = git_info?.is_dirty
				? config.separators.directory.dirty
				: config.separators.directory.clean;
		} else {
			separator_style = config.separators.directory.noGit;
		}
		
		return this.createSegment(
			`${font_profile.symbols.folder} ${dir_name}`,
			COLORS.bg.gray,
			COLORS.white,
			COLORS.fg.gray,
			separator_style,
		);
	}
}