import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class NordTheme extends BaseTheme {
	name = 'nord';

	palette: ThemePalette = {
		primary: '#5e81ac', // Nord blue
		secondary: '#b48ead', // Nord purple
		success: '#a3be8c', // Nord green
		warning: '#ebcb8b', // Nord yellow
		error: '#bf616a', // Nord red
		neutral: '#4c566a', // Nord gray
		text_light: '#eceff4', // Nord light foreground
		text_dark: '#2e3440', // Nord dark background
	};
}