import { get_font_profile } from '../font-profiles';
import { SeparatorStyle } from '../types';

// ANSI color codes
const COLORS = {
	reset: '\x1b[0m',
};

export function create_styled_separator(
	from_color: string,
	to_color = '',
	style: SeparatorStyle = 'thick',
	font_profile_name?: string,
): string {
	const font_profile = get_font_profile(font_profile_name);
	const separators = font_profile.separators;

	switch (style) {
		case 'thin':
			return `${to_color}${from_color}${separators.basic.right_thin}${COLORS.reset}`;
		case 'thick':
			return `${to_color}${from_color}${separators.basic.right}${COLORS.reset}`;
		case 'flame':
			// Use angly2 since flame glyphs don't work in Victor Mono
			return `${to_color}${from_color}${
				separators.extra.angly2 || separators.basic.right
			}${COLORS.reset}`;
		case 'wave':
			// Using curvy separators for wave effect
			return `${to_color}${from_color}${
				separators.extra.curvy || separators.basic.right
			}${COLORS.reset}`;
		case 'lightning':
			// Using angular separators for lightning effect
			return `${to_color}${from_color}${
				separators.extra.angly || separators.basic.right
			}${COLORS.reset}`;
		case 'curvy':
			return `${to_color}${from_color}${
				separators.extra.curvy || separators.basic.right
			}${COLORS.reset}`;
		case 'angly':
			return `${to_color}${from_color}${
				separators.extra.angly || separators.basic.right
			}${COLORS.reset}`;
		case 'angly2':
			return `${to_color}${from_color}${
				separators.extra.angly2 || separators.basic.right
			}${COLORS.reset}`;
		case 'double_chevron':
			return `${to_color}${from_color}${
				separators.extra.double_chevron || separators.basic.right
			}${COLORS.reset}`;
		case 'none':
			return '';
		default:
			return `${to_color}${from_color}${separators.basic.right}${COLORS.reset}`;
	}
}
