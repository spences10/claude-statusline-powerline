export {
	BaseTheme,
	ColorPalette,
	SegmentTheme,
	StatuslineTheme,
} from './base';
export { DarkTheme } from './dark';
export { ElectricTheme } from './electric';

import { StatuslineTheme } from './base';
import { DarkTheme } from './dark';
import { ElectricTheme } from './electric';

// Theme registry
export const THEMES: Record<string, StatuslineTheme> = {
	dark: new DarkTheme(),
	electric: new ElectricTheme(),
	// Add more themes here
};

export function get_theme(name: string): StatuslineTheme {
	return THEMES[name] || THEMES.dark;
}
