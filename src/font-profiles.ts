export interface FontProfile {
	name: string;
	description: string;
	symbols: {
		// Git symbols
		branch: string;
		dirty: string;
		clean: string;

		// Directory symbols
		folder: string;

		// AI/Model symbols
		ai: string;

		// Status symbols
		warning: string;
		error: string;
		info: string;
	};
	separators: {
		basic: {
			left: string;
			right: string;
			leftThin: string;
			rightThin: string;
		};
		extra: {
			curvy?: string;
			curvyLeft?: string;
			angly?: string;
			anglyLeft?: string;
			angly2?: string;
			angly2Left?: string;
			flame?: string;
			flameLeft?: string;
		};
	};
}

export const FONT_PROFILES: Record<string, FontProfile> = {
	powerline: {
		name: 'Powerline Compatible',
		description: 'Basic powerline fonts with core symbol support',
		symbols: {
			branch: '\uE0A0',
			dirty: '\u00B1',
			clean: '\u2713',
			folder: '📁',
			ai: '\u26A1',
			warning: '\u2699',
			error: '\u2717',
			info: '\u2022',
		},
		separators: {
			basic: {
				left: '\uE0B2',
				right: '\uE0B0',
				leftThin: '\uE0B3',
				rightThin: '\uE0B1',
			},
			extra: {
				curvy: '\uE0B0',
				curvyLeft: '\uE0B2',
				angly: '\uE0B0',
				anglyLeft: '\uE0B2',
				angly2: '\uE0B0',
				angly2Left: '\uE0B2',
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
			ai: '\uE0A0',
			warning: '\uF071',
			error: '\uF00D',
			info: '\uF05A',
		},
		separators: {
			basic: {
				left: '\uE0B2',
				right: '\uE0B0',
				leftThin: '\uE0B3',
				rightThin: '\uE0B1',
			},
			extra: {
				curvy: '\uE0B4',
				curvyLeft: '\uE0B6',
				angly: '\uE0B8',
				anglyLeft: '\uE0B9',
				angly2: '\uE0BC',
				angly2Left: '\uE0BD',
				flame: '\uE0C0',
				flameLeft: '\uE0C1',
			},
		},
	},
};

// Get font profile from environment or default to powerline
export function get_font_profile(): FontProfile {
	const profile_name =
		process.env.STATUSLINE_FONT_PROFILE || 'powerline';
	return FONT_PROFILES[profile_name] || FONT_PROFILES['powerline'];
}
