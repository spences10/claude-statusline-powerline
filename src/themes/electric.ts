import { BaseTheme } from './base';
import { ThemePalette } from '../types';

export class ElectricTheme extends BaseTheme {
	name = 'electric';

	palette: ThemePalette = {
		primary: '#d946ef',      // Electric purple (model)
		secondary: '#0ea5e9',    // Electric blue (session)
		success: '#00ff41',      // Electric green (git clean)
		warning: '#ff4500',      // Electric orange/red (git dirty)
		error: '#ff1744',        // Electric red (conflicts)
		neutral: '#00e5ff',      // Electric cyan (directory)
		text_light: '#ffffff',   // White text
		text_dark: '#000000',    // Black text
	};
}
