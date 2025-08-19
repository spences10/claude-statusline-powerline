import { SegmentBuilder } from '../segments/base';
import { StatuslineConfig } from '../types';

export class SegmentRegistry {
	private segments = new Map<string, SegmentBuilder>();

	register(segment: SegmentBuilder): void {
		this.segments.set(segment.name, segment);
	}

	unregister(name: string): void {
		this.segments.delete(name);
	}

	get_segment(name: string): SegmentBuilder | undefined {
		return this.segments.get(name);
	}

	get_all_segments(): SegmentBuilder[] {
		return Array.from(this.segments.values());
	}

	get_enabled_segments(config: StatuslineConfig): SegmentBuilder[] {
		// If we have segment_config, include all segments for styling purposes
		if (config.segment_config?.segments) {
			const segments: SegmentBuilder[] = [];
			for (const segment_config of config.segment_config.segments) {
				const segment = this.segments.get(segment_config.type);
				if (segment) {
					segments.push(segment);
				}
			}
			return segments;
		}

		// Fallback: show all segments in registration order
		return this.get_all_segments();
	}

	get_segment_names(): string[] {
		return Array.from(this.segments.keys());
	}
}

// Global registry instance
export const segmentRegistry = new SegmentRegistry();
