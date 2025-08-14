import * as path from 'path';
import { get_font_profile, get_symbol } from '../font-profiles';
import { ClaudeStatusInput, StatuslineConfig } from '../types';
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
		const full_dir_name = path.basename(cwd) || '~';

		const style_override = this.getSegmentConfig(config);

		const max_length =
			style_override?.truncation_length ||
			config.truncation?.directory_length ||
			25;

		// Truncate long directory names
		const dir_name =
			full_dir_name.length > max_length
				? `${full_dir_name.slice(0, max_length - 3)}...`
				: full_dir_name;
		const font_profile = get_font_profile(config.font_profile);

		const separator_style = config.separators.directory;

		const theme = config.current_theme?.segments.directory;

		// Get folder icon with potential user override
		const folder_icon = get_symbol(
			font_profile,
			'folder',
			style_override?.icons,
		);

		if (!theme) {
			// Fallback to hardcoded colors if no theme
			return this.createSegment(
				`${folder_icon} ${dir_name}`,
				FALLBACK_COLORS.bg,
				FALLBACK_COLORS.fg,
				FALLBACK_COLORS.separator,
				separator_style,
				style_override,
			);
		}

		return this.createSegment(
			`${folder_icon} ${dir_name}`,
			theme.background,
			theme.foreground,
			theme.separator_color,
			separator_style,
			style_override,
		);
	}
}
