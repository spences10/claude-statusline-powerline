import { ClaudeStatusInput, StatuslineConfig } from '../types';

export interface SegmentData {
	content: string;
	bg_color: string;
	fg_color: string;
	separator_from_color: string;
	separator_style?: string;
}

export interface SegmentBuilder {
	name: string;
	priority: number; // Lower numbers appear first
	is_enabled(config: StatuslineConfig): boolean;
	build(data: ClaudeStatusInput, config: StatuslineConfig): SegmentData | null;
}

export abstract class BaseSegment implements SegmentBuilder {
	abstract name: string;
	abstract priority: number;

	abstract is_enabled(config: StatuslineConfig): boolean;
	abstract build(data: ClaudeStatusInput, config: StatuslineConfig): SegmentData | null;

	protected createSegment(
		content: string,
		bg_color: string,
		fg_color: string,
		separator_from_color: string,
		separator_style?: string,
	): SegmentData {
		return {
			content,
			bg_color,
			fg_color,
			separator_from_color,
			separator_style,
		};
	}
}