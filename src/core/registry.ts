import { SegmentBuilder } from '../segments/base';

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

	get_enabled_segments(config: any): SegmentBuilder[] {
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
