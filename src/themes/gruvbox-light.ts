import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class GruvboxLightTheme extends BaseTheme {
	name = 'gruvbox-light';

	palette: ThemePalette = {
		primary: '#076678', // Gruvbox light blue
		secondary: '#8f3f71', // Gruvbox light purple
		success: '#79740e', // Gruvbox light green
		warning: '#b57614', // Gruvbox light yellow
		error: '#9d0006', // Gruvbox light red
		neutral: '#7c6f64', // Gruvbox light gray
		text_light: '#fbf1c7', // Gruvbox light background
		text_dark: '#3c3836', // Gruvbox light dark foreground
	};
}
