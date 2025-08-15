import { BaseTheme } from './base';
import { ThemePalette } from '../types';

export class NightOwlTheme extends BaseTheme {
	name = 'night-owl';

	palette: ThemePalette = {
		primary: '#5f8bcf',      // Night Owl blue (model)
		secondary: '#c792ea',    // Night Owl purple (session)
		success: '#7fdbca',      // Night Owl teal (git clean)
		warning: '#ff5874',      // Night Owl red/pink (git dirty)
		error: '#ff1744',        // Bright red (conflicts)
		neutral: '#ecc48d',      // Night Owl orange (directory)
		text_light: '#f0f0f0',   // Light text
		text_dark: '#011627',    // Night Owl dark background
	};
}
