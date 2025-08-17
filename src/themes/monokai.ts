import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class MonokaiTheme extends BaseTheme {
	name = 'monokai';

	palette: ThemePalette = {
		primary: '#66d9ef', // Monokai cyan
		secondary: '#ae81ff', // Monokai purple
		success: '#a6e22e', // Monokai green
		warning: '#e6db74', // Monokai yellow
		error: '#f92672', // Monokai pink/red
		neutral: '#75715e', // Monokai comment
		text_light: '#f8f8f2', // Monokai foreground
		text_dark: '#272822', // Monokai background
	};
}