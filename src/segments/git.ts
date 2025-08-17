import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { get_git_info } from '../utils/git';
import { BaseSegment, SegmentData } from './base';

export class GitSegment extends BaseSegment {
	name = 'git';
	priority = 30;

	is_enabled(config: StatuslineConfig): boolean {
		return this.isSegmentEnabled(config);
	}

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		const cwd = data.workspace?.current_dir || process.cwd();
		const git_info = get_git_info(cwd);

		if (git_info) {
			const { style_override, get_icon } = this.setup_segment(config);

			const branch_name = this.truncate_text(
				git_info.branch,
				config,
				style_override,
			);
			const branch_icon = get_icon('branch');

			// Build status indicators
			let status_parts: string[] = [];

			// Ahead/behind arrows with counts
			if (git_info.ahead > 0) {
				const ahead_icon = get_icon('ahead');
				status_parts.push(`${ahead_icon}${git_info.ahead}`);
			}
			if (git_info.behind > 0) {
				const behind_icon = get_icon('behind');
				status_parts.push(`${behind_icon}${git_info.behind}`);
			}

			// Conflict warning
			if (git_info.conflicts) {
				const conflicts_icon = get_icon('conflicts');
				status_parts.push(conflicts_icon);
			}

			// Staged additions/deletions counts (only show if > 0)
			if (git_info.staged_add > 0) {
				const staged_add_icon = get_icon('staged_add');
				status_parts.push(`${staged_add_icon}${git_info.staged_add}`);
			}
			if (git_info.staged_del > 0) {
				const staged_del_icon = get_icon('staged_del');
				status_parts.push(`${staged_del_icon}${git_info.staged_del}`);
			}

			// Unstaged changes count
			if (git_info.unstaged > 0) {
				const unstaged_icon = get_icon('unstaged');
				status_parts.push(`${unstaged_icon}${git_info.unstaged}`);
			}
			if (git_info.untracked > 0) {
				const untracked_icon = get_icon('untracked');
				status_parts.push(`${untracked_icon}${git_info.untracked}`);
			}

			// Fallback to basic clean/dirty if no detailed status
			if (status_parts.length === 0) {
				const status_icon = git_info.is_dirty
					? get_icon('dirty')
					: get_icon('clean');
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

			const fallback_type = git_info.is_dirty
				? 'git_dirty'
				: 'git_clean';
			const content =
				`${branch_icon} ${branch_name} ${status_display}`.trimEnd();

			return this.create_segment_with_fallback(
				content,
				theme,
				fallback_type,
				separator_style,
				style_override,
			);
		}

		return null;
	}
}
