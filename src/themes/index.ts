export {
	BaseTheme,
	ColorPalette,
	SegmentTheme,
	StatuslineTheme,
} from './base';
export { DarkTheme } from './dark';
export { ElectricTheme } from './electric';
export { NightOwlTheme } from './night-owl';

import { StatuslineTheme } from './base';
import { DarkTheme } from './dark';
import { ElectricTheme } from './electric';
import { NightOwlTheme } from './night-owl';

// Theme registry
export const THEMES: Record<string, StatuslineTheme> = {
	dark: new DarkTheme(),
	electric: new ElectricTheme(),
	'night-owl': new NightOwlTheme(),
};

export function get_theme(name: string): StatuslineTheme {
	return THEMES[name] || THEMES.dark;
}
