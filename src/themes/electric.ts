import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class ElectricTheme extends BaseTheme {
	name = 'electric';

	palette: ThemePalette = {
		primary: '#d946ef',
		secondary: '#0ea5e9',
		success: '#00ff41',
		warning: '#ff4500',
		error: '#ff1744',
		neutral: '#00e5ff',
		text_light: '#ffffff',
		text_dark: '#000000',
	};
}
