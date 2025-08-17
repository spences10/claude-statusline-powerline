export { BaseTheme } from './base';
export {
	ThemePalette,
	SegmentTheme,
	StatuslineTheme,
} from '../types';
export { DarkTheme } from './dark';
export { ElectricTheme } from './electric';
export { NightOwlTheme } from './night-owl';
export { DraculaTheme } from './dracula';
export { GruvboxTheme } from './gruvbox';
export { OneDarkTheme } from './one-dark';
export { MonokaiTheme } from './monokai';
export { SolarizedLightTheme } from './solarized-light';
export { GruvboxLightTheme } from './gruvbox-light';
export { AlucardTheme } from './alucard';
export { NordTheme } from './nord';
export { TokyoNightTheme } from './tokyo-night';

import { StatuslineTheme } from '../types';
import { DarkTheme } from './dark';
import { ElectricTheme } from './electric';
import { NightOwlTheme } from './night-owl';
import { DraculaTheme } from './dracula';
import { GruvboxTheme } from './gruvbox';
import { OneDarkTheme } from './one-dark';
import { MonokaiTheme } from './monokai';
import { SolarizedLightTheme } from './solarized-light';
import { GruvboxLightTheme } from './gruvbox-light';
import { AlucardTheme } from './alucard';
import { NordTheme } from './nord';
import { TokyoNightTheme } from './tokyo-night';

// Theme registry
export const THEMES: Record<string, StatuslineTheme> = {
	// Dark themes
	dark: new DarkTheme(),
	electric: new ElectricTheme(),
	'night-owl': new NightOwlTheme(),
	dracula: new DraculaTheme(),
	gruvbox: new GruvboxTheme(),
	'one-dark': new OneDarkTheme(),
	monokai: new MonokaiTheme(),
	nord: new NordTheme(),
	'tokyo-night': new TokyoNightTheme(),
	// Light themes
	'solarized-light': new SolarizedLightTheme(),
	'gruvbox-light': new GruvboxLightTheme(),
	alucard: new AlucardTheme(),
};

export function get_theme(name: string): StatuslineTheme {
	return THEMES[name] || THEMES.dark;
}
