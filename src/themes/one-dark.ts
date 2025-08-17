import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class OneDarkTheme extends BaseTheme {
	name = 'one-dark';

	palette: ThemePalette = {
		primary: '#61afef', // One Dark blue
		secondary: '#c678dd', // One Dark purple
		success: '#98c379', // One Dark green
		warning: '#e5c07b', // One Dark yellow
		error: '#e06c75', // One Dark red
		neutral: '#5c6370', // One Dark comment
		text_light: '#abb2bf', // One Dark foreground
		text_dark: '#282c34', // One Dark background
	};
}