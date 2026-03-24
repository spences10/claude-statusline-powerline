export { BaseSegment, SegmentBuilder, SegmentData } from './base';
export { ContextSegment } from './context';
export { DirectorySegment } from './directory';
export { GitSegment } from './git';
export { ModelSegment } from './model';
export { SessionSegment } from './session';
export { SessionIdSegment } from './session-id';
export { UsageSegment } from './usage';

// Auto-register all segments
import { segmentRegistry } from '../core/registry';
import { ContextSegment } from './context';
import { DirectorySegment } from './directory';
import { GitSegment } from './git';
import { ModelSegment } from './model';
import { SessionSegment } from './session';
import { SessionIdSegment } from './session-id';
import { UsageSegment } from './usage';

// Register default segments
segmentRegistry.register(new ModelSegment());
segmentRegistry.register(new DirectorySegment());
segmentRegistry.register(new GitSegment());
segmentRegistry.register(new SessionSegment());
segmentRegistry.register(new ContextSegment());
segmentRegistry.register(new SessionIdSegment());
segmentRegistry.register(new UsageSegment());
