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
		// If we have segment_config, use that for ordering and filtering
		if (config.segment_config?.segments) {
			const enabled_configs = config.segment_config.segments
				.filter((s) => s.enabled)
				.sort((a, b) => a.order - b.order);

			const ordered_segments: SegmentBuilder[] = [];
			for (const segment_config of enabled_configs) {
				const segment = this.segments.get(segment_config.type);
				if (segment) {
					ordered_segments.push(segment);
				}
			}
			return ordered_segments;
		}

		// Fallback to old behavior for backward compatibility
		return this.get_all_segments()
			.filter((segment) => segment.is_enabled(config))
			.sort((a, b) => a.priority - b.priority);
	}

	get_segment_names(): string[] {
		return Array.from(this.segments.keys());
	}
}

// Global registry instance
export const segmentRegistry = new SegmentRegistry();
