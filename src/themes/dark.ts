import { BaseTheme } from './base';
import { ThemePalette } from '../types';

export class DarkTheme extends BaseTheme {
	name = 'dark';

	palette: ThemePalette = {
		primary: '#1e40af',      // Blue (model)
		secondary: '#7c3aed',    // Purple (session)
		success: '#16a34a',      // Green (git clean)
		warning: '#eab308',      // Yellow (git dirty)
		error: '#dc2626',        // Red (conflicts)
		neutral: '#4b5563',      // Gray (directory)
		text_light: '#ffffff',   // White text
		text_dark: '#000000',    // Black text
	};
}
