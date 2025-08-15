export { BaseTheme } from './base';
export {
	ThemePalette,
	SegmentTheme,
	StatuslineTheme,
} from '../types';
export { DarkTheme } from './dark';
export { ElectricTheme } from './electric';
export { NightOwlTheme } from './night-owl';

import { StatuslineTheme } from '../types';
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
