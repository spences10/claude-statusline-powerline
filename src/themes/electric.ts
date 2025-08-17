import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class ElectricTheme extends BaseTheme {
	name = 'electric';

	palette: ThemePalette = {
		primary: '#ff00ff', // Electric magenta
		secondary: '#00ffff', // Electric cyan
		success: '#00ff00', // Electric green
		warning: '#ffff00', // Electric yellow
		error: '#ff0080', // Electric pink
		neutral: '#8080ff', // Electric blue
		text_light: '#ffffff',
		text_dark: '#000000',
	};
}
