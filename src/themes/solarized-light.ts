import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class SolarizedLightTheme extends BaseTheme {
	name = 'solarized-light';

	palette: ThemePalette = {
		primary: '#268bd2', // Solarized blue
		secondary: '#6c71c4', // Solarized violet
		success: '#859900', // Solarized green
		warning: '#b58900', // Solarized yellow
		error: '#dc322f', // Solarized red
		neutral: '#657b83', // Solarized base01
		text_light: '#fdf6e3', // Solarized base3
		text_dark: '#002b36', // Solarized base03
	};
}
