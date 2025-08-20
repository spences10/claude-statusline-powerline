import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class GruvboxTheme extends BaseTheme {
	name = 'gruvbox';

	palette: ThemePalette = {
		primary: '#458588', // Gruvbox blue
		secondary: '#b16286', // Gruvbox purple
		success: '#98971a', // Gruvbox green
		warning: '#d79921', // Gruvbox yellow
		error: '#cc241d', // Gruvbox red
		neutral: '#928374', // Gruvbox gray
		text_light: '#ebdbb2', // Gruvbox light foreground
		text_dark: '#282828', // Gruvbox dark background
	};
}
