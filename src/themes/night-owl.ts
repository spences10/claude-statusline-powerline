import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class NightOwlTheme extends BaseTheme {
	name = 'night-owl';

	palette: ThemePalette = {
		primary: '#82aaff', // Night Owl blue
		secondary: '#c792ea', // Night Owl purple
		success: '#addb67', // Night Owl green
		warning: '#f78c6c', // Night Owl orange
		error: '#ef5350', // Night Owl red
		neutral: '#637777', // Night Owl comment
		text_light: '#d6deeb', // Night Owl foreground
		text_dark: '#011627', // Night Owl background
	};
}
