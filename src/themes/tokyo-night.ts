import { ThemePalette } from '../types';
import { BaseTheme } from './base';

export class TokyoNightTheme extends BaseTheme {
	name = 'tokyo-night';

	palette: ThemePalette = {
		primary: '#7aa2f7', // Tokyo Night blue
		secondary: '#bb9af7', // Tokyo Night purple
		success: '#9ece6a', // Tokyo Night green
		warning: '#e0af68', // Tokyo Night yellow
		error: '#f7768e', // Tokyo Night red
		neutral: '#565f89', // Tokyo Night comment
		text_light: '#c0caf5', // Tokyo Night foreground
		text_dark: '#1a1b26', // Tokyo Night background
	};
}
