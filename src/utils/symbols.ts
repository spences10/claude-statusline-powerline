/**
 * Powerline and Unicode symbols used throughout the statusline
 * Direct symbol definitions without profile complexity
 */

// Git and status symbols
export const BRANCH_SYMBOL = ' \uE0A0';
export const DIRTY_SYMBOL = '\u00B1';
export const CLEAN_SYMBOL = '\u2713';

// UI symbols
export const FOLDER_SYMBOL = '📁';
export const AI_SYMBOL = '\u26A1';
export const WARNING_SYMBOL = '\u2699';
export const ERROR_SYMBOL = '\u2717';
export const INFO_SYMBOL = '\u2022';
export const COST_SYMBOL = '💰';

// Git state symbols
export const AHEAD_SYMBOL = '⇡';
export const BEHIND_SYMBOL = '⇣';
export const CONFLICTS_SYMBOL = '⚠️';
export const STAGED_ADD_SYMBOL = '\u207A';
export const STAGED_DEL_SYMBOL = '\u207B';
export const UNSTAGED_SYMBOL = '\u02DC';
export const UNTRACKED_SYMBOL = '\u1D58';

// Context symbols
export const BRAIN_SYMBOL = '🧠';

/**
 * Get a symbol with optional override support
 */
export function get_symbol(
	symbol_name: string,
	icon_overrides?: { [key: string]: string },
): string {
	if (icon_overrides && icon_overrides[symbol_name]) {
		return icon_overrides[symbol_name];
	}

	// Map symbol names to exports
	const symbol_map: { [key: string]: string } = {
		branch: BRANCH_SYMBOL,
		dirty: DIRTY_SYMBOL,
		clean: CLEAN_SYMBOL,
		folder: FOLDER_SYMBOL,
		ai: AI_SYMBOL,
		warning: WARNING_SYMBOL,
		error: ERROR_SYMBOL,
		info: INFO_SYMBOL,
		cost: COST_SYMBOL,
		ahead: AHEAD_SYMBOL,
		behind: BEHIND_SYMBOL,
		conflicts: CONFLICTS_SYMBOL,
		staged_add: STAGED_ADD_SYMBOL,
		staged_del: STAGED_DEL_SYMBOL,
		unstaged: UNSTAGED_SYMBOL,
		untracked: UNTRACKED_SYMBOL,
		brain: BRAIN_SYMBOL,
	};

	return symbol_map[symbol_name] || symbol_name;
}
