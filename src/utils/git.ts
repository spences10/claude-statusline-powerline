import { execSync } from 'child_process';

export interface GitInfo {
	branch: string;
	is_dirty: boolean;
}

export function get_git_info(cwd: string): GitInfo | null {
	try {
		// Check if in git repo
		execSync('git rev-parse --git-dir', { cwd, stdio: 'pipe' });

		// Get branch name
		const branch = execSync('git rev-parse --abbrev-ref HEAD', {
			cwd,
			encoding: 'utf8',
		}).trim();

		// Get status
		const status = execSync('git status --porcelain', {
			cwd,
			encoding: 'utf8',
		});

		const is_dirty = status.trim().length > 0;

		return { branch, is_dirty };
	} catch (error) {
		return null;
	}
}