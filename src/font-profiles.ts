export interface FontProfile {
	name: string;
	description: string;
	symbols: {
		branch: string;
		dirty: string;
		clean: string;
		folder: string;
		ai: string;
		warning: string;
		error: string;
		info: string;
		cost: string;
		ahead: string;
		behind: string;
		conflicts: string;
		staged_add: string;
		staged_del: string;
		unstaged: string;
		untracked: string;
	};
	separators: {
		basic: {
			left: string;
			right: string;
			left_thin: string;
			right_thin: string;
		};
		extra: {
			curvy?: string;
			curvy_left?: string;
			angly?: string;
			angly_left?: string;
			angly2?: string;
			angly2_left?: string;
			flame?: string;
			flame_left?: string;
			double_chevron?: string;
			double_chevron_left?: string;
		};
	};
}

export const FONT_PROFILES: Record<string, FontProfile> = {
	powerline: {
		name: 'Powerline Compatible',
		description: 'Basic powerline fonts with core symbol support',
		symbols: {
			branch: ' \uE0A0',
			dirty: '\u00B1',
			clean: '\u2713',
			folder: '📁',
			ai: '\u26A1',
			warning: '\u2699',
			error: '\u2717',
			info: '\u2022',
			cost: '💰',
			ahead: '⇡',
			behind: '⇣',
			conflicts: '⚠️',
			staged_add: '\u207A', // superscript plus ⁺
			staged_del: '\u207B', // superscript minus ⁻
			unstaged: '\u02DC', // small tilde ˜
			untracked: '\u1D58', // superscript u ᵘ
		},
		separators: {
			basic: {
				left: '\uE0B2',
				right: '\uE0B0',
				left_thin: '\uE0B3',
				right_thin: '\uE0B1',
			},
			extra: {
				curvy: '\uE0B4',
				curvy_left: '\uE0B6',
				angly: '\uE0B8',
				angly_left: '\uE0B9',
				angly2: '\uE0BC',
				angly2_left: '\uE0BD',
				double_chevron: '\uE0B0\uE0B1',
				double_chevron_left: '\uE0B2\uE0B3',
			},
		},
	},

	'nerd-font': {
		name: 'Nerd Font',
		description:
			'Complete Nerd Font with full powerline and icon support',
		symbols: {
			branch: '\uE0A0',
			dirty: '\u00B1',
			clean: '\u2713',
			folder: '\uF07B',
			ai: '\uF544',
			warning: '\uF071',
			error: '\uF00D',
			info: '\uF05A',
			cost: '\uF0D6',
			ahead: '\uF062',
			behind: '\uF063',
			conflicts: '\uF071',
			staged_add: '\uF067',
			staged_del: '\uF068',
			unstaged: '\uF111',
			untracked: '\uF128',
		},
		separators: {
			basic: {
				left: '\uE0B2',
				right: '\uE0B0',
				left_thin: '\uE0B3',
				right_thin: '\uE0B1',
			},
			extra: {
				curvy: '\uE0B4',
				curvy_left: '\uE0B6',
				angly: '\uE0B8',
				angly_left: '\uE0B9',
				angly2: '\uE0BC',
				angly2_left: '\uE0BD',
				flame: '\uE0C0',
				flame_left: '\uE0C1',
			},
		},
	},
};

// Get font profile from config or default to powerline
export function get_font_profile(profile_name?: string): FontProfile {
	const name = profile_name || 'powerline';
	return FONT_PROFILES[name] || FONT_PROFILES['powerline'];
}

export function get_symbol(
	font_profile: FontProfile,
	symbol_name: keyof FontProfile['symbols'],
	icon_overrides?: { [key: string]: string },
): string {
	if (icon_overrides && icon_overrides[symbol_name]) {
		return icon_overrides[symbol_name];
	}

	return font_profile.symbols[symbol_name];
}
