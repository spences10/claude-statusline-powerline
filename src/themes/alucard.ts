import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class AlucardTheme extends BaseTheme {
	name = 'alucard';

	palette: ThemePalette = {
		primary: '#644ac9', // Alucard purple
		secondary: '#a3144d', // Alucard pink
		success: '#14710a', // Alucard green
		warning: '#a34d14', // Alucard orange
		error: '#cb3a2a', // Alucard red
		neutral: '#6c664b', // Alucard comment/current line
		text_light: '#fffbeb', // Alucard background (light)
		text_dark: '#1f1f1f', // Alucard foreground (dark)
	};
}
