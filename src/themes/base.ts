import { StatuslineTheme, ThemePalette } from '../types';
import { create_segment_theme } from '../utils/colors';

/**
 * Base theme class that generates segments from palette
 */
export abstract class BaseTheme implements StatuslineTheme {
	abstract name: string;
	abstract palette: ThemePalette;

	get segments() {
		return {
			model: create_segment_theme(
				this.palette.primary,
				this.palette.text_light,
			),
			directory: create_segment_theme(
				this.palette.neutral,
				this.palette.text_light,
			),
			git: {
				clean: create_segment_theme(
					this.palette.success,
					this.palette.text_dark,
				),
				dirty: create_segment_theme(
					this.palette.warning,
					this.palette.text_dark,
				),
			},
			session: create_segment_theme(
				this.palette.secondary,
				this.palette.text_light,
			),
		};
	}
}
