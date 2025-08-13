export { BaseSegment, SegmentBuilder, SegmentData } from './base';
export { DirectorySegment } from './directory';
export { GitSegment } from './git';
export { ModelSegment } from './model';
export { SessionSegment } from './session';

// Auto-register all segments
import { segmentRegistry } from '../core/registry';
import { DirectorySegment } from './directory';
import { GitSegment } from './git';
import { ModelSegment } from './model';
import { SessionSegment } from './session';

// Register default segments
segmentRegistry.register(new ModelSegment());
segmentRegistry.register(new DirectorySegment());
segmentRegistry.register(new GitSegment());
segmentRegistry.register(new SessionSegment());
