import { get_font_profile, get_symbol } from '../font-profiles';
import { ClaudeStatusInput, StatuslineConfig } from '../types';
import { BaseSegment, SegmentData } from './base';

export class ModelSegment extends BaseSegment {
	name = 'model';
	priority = 10;

	is_enabled(config: StatuslineConfig): boolean {
		return config.segments.model;
	}

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		const model = data.model?.display_name || 'Claude';
		const style_override = this.getSegmentConfig(config);

		const max_length =
			style_override?.truncation_length ||
			config.truncation?.model_length ||
			15;

		// Truncate long model names
		const display_model =
			model.length > max_length
				? `${model.slice(0, max_length - 3)}...`
				: model;

		const theme = config.current_theme?.segments.model;
		const font_profile = get_font_profile(config.font_profile);

		// Get AI icon with potential user override
		const ai_icon = get_symbol(
			font_profile,
			'ai',
			style_override?.icons,
		);

		if (!theme) {
			// Fallback to hardcoded colors if no theme
			return this.createSegment(
				`${ai_icon} ${display_model}`,
				'\x1b[44m',
				'\x1b[97m',
				'\x1b[34m',
				config.separators.model,
				style_override,
			);
		}

		return this.createSegment(
			`${ai_icon} ${display_model}`,
			theme.background,
			theme.foreground,
			theme.separator_color,
			config.separators.model,
			style_override,
		);
	}
}
