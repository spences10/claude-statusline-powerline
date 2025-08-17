import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class DraculaTheme extends BaseTheme {
	name = 'dracula';

	palette: ThemePalette = {
		primary: '#bd93f9', // Dracula purple
		secondary: '#ff79c6', // Dracula pink
		success: '#50fa7b', // Dracula green
		warning: '#ffb86c', // Dracula orange
		error: '#ff5555', // Dracula red
		neutral: '#6272a4', // Dracula comment/current line
		text_light: '#f8f8f2', // Dracula foreground
		text_dark: '#282a36', // Dracula background
	};
}