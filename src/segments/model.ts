import { BaseSegment, SegmentData } from './base';
import { ClaudeStatusInput, StatuslineConfig } from '../types';

export class ModelSegment extends BaseSegment {
	name = 'model';
	priority = 10;

	is_enabled(config: StatuslineConfig): boolean {
		return config.segments.model;
	}

	build(data: ClaudeStatusInput, config: StatuslineConfig): SegmentData | null {
		const model = data.model?.display_name || 'Claude';
		
		// Truncate long model names
		const display_model = model.length > 15 ? `${model.slice(0, 12)}...` : model;
		
		const theme = config.currentTheme?.segments.model;
		// Debug: log theme info
		console.error(`DEBUG: Theme exists: ${!!config.currentTheme}, Model theme: ${!!theme}`);
		if (theme) {
			console.error(`DEBUG: Model colors - bg: ${theme.background}, fg: ${theme.foreground}`);
		}
		
		if (!theme) {
			// Fallback to hardcoded colors if no theme
			console.error('DEBUG: Using fallback colors');
			return this.createSegment(
				` ${display_model}`,
				'\x1b[44m',
				'\x1b[97m',
				'\x1b[34m',
				config.separators.model,
			);
		}
		
		return this.createSegment(
			` ${display_model}`,
			theme.background,
			theme.foreground,
			theme.separatorColor,
			config.separators.model,
		);
	}
}