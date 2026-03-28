import * as path from 'path';
import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { BaseSegment, SegmentData } from './base';

export class DirectorySegment extends BaseSegment {
	name = 'directory';

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		const { style_override, get_icon } = this.setup_segment(config);

		const cwd = data.workspace?.current_dir || process.cwd();
		const full_dir_name = path.basename(cwd) || '~';
		const folder_icon = get_icon('folder');
		const content = this.finalize_content(
			`${folder_icon} ${full_dir_name}`,
			config,
			style_override,
		);
		const theme = config.current_theme?.segments.directory;

		return this.create_segment_with_fallback(
			content,
			theme,
			'directory',
			config.separators.directory,
			style_override,
		);
	}
}
