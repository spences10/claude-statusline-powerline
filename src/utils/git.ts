import { execSync } from 'node:child_process';

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

export function get_git_info(cwd: string): GitInfo | null {
	try {
		// Check if in git repo
		execSync('git rev-parse --git-dir', { cwd, stdio: 'pipe' });

		// Get branch name
		const branch = execSync('git rev-parse --abbrev-ref HEAD', {
			cwd,
			encoding: 'utf8',
		}).trim();

		// Get status with porcelain format
		const status = execSync('git status --porcelain', {
			cwd,
			encoding: 'utf8',
		});

		const is_dirty = status.trim().length > 0;

		// Parse detailed status
		const lines = status
			.trim()
			.split('\n')
			.filter((line) => line.length > 0);
		let staged_add = 0;
		let staged_del = 0;
		let unstaged = 0;
		let untracked = 0;
		let conflicts = false;

		for (const line of lines) {
			const index_status = line[0];
			const working_status = line[1];

			// Count staged additions and deletions separately
			if (
				index_status === 'A' ||
				index_status === 'M' ||
				index_status === 'R' ||
				index_status === 'C'
			) {
				staged_add++;
			} else if (index_status === 'D') {
				staged_del++;
			}

			// Count unstaged changes (working directory changes)
			if (
				working_status === 'M' ||
				working_status === 'D' ||
				working_status === 'T'
			) {
				unstaged++;
			}

			// Count untracked files
			if (index_status === '?' && working_status === '?') {
				untracked++;
			}

			// Check for conflicts (U = unmerged)
			if (
				index_status === 'U' ||
				working_status === 'U' ||
				(index_status === 'A' && working_status === 'A') ||
				(index_status === 'D' && working_status === 'D')
			) {
				conflicts = true;
			}
		}

		// Get ahead/behind info
		let ahead = 0;
		let behind = 0;
		try {
			const tracking_branch = execSync(
				`git rev-parse --abbrev-ref ${branch}@{upstream}`,
				{
					cwd,
					encoding: 'utf8',
					stdio: 'pipe',
				},
			).trim();

			const rev_list = execSync(
				`git rev-list --count --left-right ${tracking_branch}...${branch}`,
				{
					cwd,
					encoding: 'utf8',
					stdio: 'pipe',
				},
			).trim();

			const [behind_str, ahead_str] = rev_list.split('\t');
			behind = parseInt(behind_str) || 0;
			ahead = parseInt(ahead_str) || 0;
		} catch (error) {
			// No tracking branch or other error - that's okay
		}

		return {
			branch,
			is_dirty,
			ahead,
			behind,
			conflicts,
			staged_add,
			staged_del,
			unstaged,
			untracked,
		};
	} catch (error) {
		return null;
	}
}
