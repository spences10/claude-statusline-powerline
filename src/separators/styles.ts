import { get_font_profile } from '../font-profiles';
import { SeparatorStyle } from '../types';
import { ANSI_RESET } from '../utils/ansi';

// Mapping of styles to separator keys with fallback behavior
const SEPARATOR_STYLE_MAP: Record<
	SeparatorStyle,
	{ key: keyof any; fallback?: keyof any }
> = {
	thin: { key: 'right_thin' },
	thick: { key: 'right' },
	flame: { key: 'angly2', fallback: 'right' },
	wave: { key: 'curvy', fallback: 'right' },
	lightning: { key: 'angly', fallback: 'right' },
	curvy: { key: 'curvy', fallback: 'right' },
	angly: { key: 'angly', fallback: 'right' },
	angly2: { key: 'angly2', fallback: 'right' },
	double_chevron: { key: 'double_chevron', fallback: 'right' },
	none: { key: 'none' },
};

function get_separator_char(
	style: SeparatorStyle,
	separators: any,
): string {
	if (style === 'none') return '';

	const mapping = SEPARATOR_STYLE_MAP[style];
	if (!mapping) return separators.basic.right;

	// Try basic first for thin/thick
	if (mapping.key === 'right_thin' || mapping.key === 'right') {
		return separators.basic[mapping.key];
	}

	// Try extra separators with fallback
	const separator = separators.extra[mapping.key];
	if (separator) return separator;

	// Use fallback if available
	if (mapping.fallback) {
		return separators.basic[mapping.fallback];
	}

	return separators.basic.right;
}

export function create_styled_separator(
	from_color: string,
	to_color = '',
	style: SeparatorStyle = 'thick',
	font_profile_name?: string,
): string {
	if (style === 'none') return '';

	const font_profile = get_font_profile(font_profile_name);
	const separator_char = get_separator_char(
		style,
		font_profile.separators,
	);

	return `${to_color}${from_color}${separator_char}${ANSI_RESET}`;
}
