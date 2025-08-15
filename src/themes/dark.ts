import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class DarkTheme extends BaseTheme {
	name = 'dark';

	palette: ThemePalette = {
		primary: '#1e40af',
		secondary: '#7c3aed',
		success: '#16a34a',
		warning: '#eab308',
		error: '#dc2626',
		neutral: '#4b5563',
		text_light: '#ffffff',
		text_dark: '#000000',
	};
}
