export { BaseSegment, SegmentBuilder, SegmentData } from './base';
export { ModelSegment } from './model';
export { DirectorySegment } from './directory';
export { GitSegment } from './git';
export { SessionSegment } from './session';

// Auto-register all segments
import { segmentRegistry } from '../core/registry';
import { ModelSegment } from './model';
import { DirectorySegment } from './directory';
import { GitSegment } from './git';
import { SessionSegment } from './session';

// Register default segments
segmentRegistry.register(new ModelSegment());
segmentRegistry.register(new DirectorySegment());
segmentRegistry.register(new GitSegment());
segmentRegistry.register(new SessionSegment());