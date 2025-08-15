import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class NightOwlTheme extends BaseTheme {
	name = 'night-owl';

	palette: ThemePalette = {
		primary: '#5f8bcf',
		secondary: '#c792ea',
		success: '#7fdbca',
		warning: '#ff5874',
		error: '#ff1744',
		neutral: '#ecc48d',
		text_light: '#f0f0f0',
		text_dark: '#011627',
	};
}
