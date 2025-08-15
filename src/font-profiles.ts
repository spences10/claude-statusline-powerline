import { FontProfileData } from './types';

// Base symbols and separators shared across profiles
const BASE_SYMBOLS: FontProfileData['symbols'] = {
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
	staged_add: '\u207A',
	staged_del: '\u207B',
	unstaged: '\u02DC',
	untracked: '\u1D58',
	brain: '🧠',
};

const BASE_SEPARATORS = {
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
};

// Helper function to create font profile with base + overrides
function create_font_profile(
	name: string,
	description: string,
	symbol_overrides: Partial<FontProfileData['symbols']> = {},
	separator_overrides: Partial<
		FontProfileData['separators']['extra']
	> = {},
): FontProfileData {
	return {
		name,
		description,
		symbols: { ...BASE_SYMBOLS, ...symbol_overrides },
		separators: {
			...BASE_SEPARATORS,
			extra: { ...BASE_SEPARATORS.extra, ...separator_overrides },
		},
	};
}

export const FONT_PROFILES: Record<string, FontProfileData> = {
	powerline: create_font_profile(
		'Powerline Compatible',
		'Basic powerline fonts with core symbol support',
		// Uses all BASE_SYMBOLS defaults
	),

	'nerd-font': create_font_profile(
		'Nerd Font',
		'Complete Nerd Font with full powerline and icon support',
		{
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
			brain: '\uF7DC',
		},
		{
			flame: '\uE0C0',
			flame_left: '\uE0C1',
		},
	),
};

// Get font profile from config or default to powerline
export function get_font_profile(
	profile_name?: string,
): FontProfileData {
	const name = profile_name || 'powerline';
	return FONT_PROFILES[name] || FONT_PROFILES['powerline'];
}

export function get_symbol(
	font_profile: FontProfileData,
	symbol_name: keyof FontProfileData['symbols'],
	icon_overrides?: { [key: string]: string },
): string {
	if (icon_overrides && icon_overrides[symbol_name]) {
		return icon_overrides[symbol_name];
	}

	return font_profile.symbols[symbol_name];
}
