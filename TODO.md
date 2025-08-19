# Usage Analytics Enhancement Ideas

## 1. Tool Usage Dashboard ✅

**Status**: High Priority  
**Description**: Track which tools are used most frequently, success
rates, and patterns

- Tool call frequency analytics
- Success/failure rates per tool
- Tool usage patterns and combinations
- Performance metrics (execution time)

## 2. Git Branch Analytics ❓

**Status**: Needs Clarification  
**Description**: Cost/usage breakdown by git branch

- **Question**: How is this useful? What insights would this provide?
- Potential use cases:
  - Feature branch cost tracking?
  - Development vs production branch analysis?
  - Team collaboration patterns?

## 3. Session Quality Metrics 🤔

**Status**: Maybe  
**Description**: Analyze conversation quality and patterns

- Turn count per session
- Average response length
- User vs assistant message ratios
- Session duration trends

## 4. Cache Efficiency Tracking 🔄

**Status**: Session Extension  
**Description**: Enhanced cache analytics beyond current basic
tracking

- Cache hit rates and miss patterns
- Cache savings calculations
- Cache efficiency by project/model
- Context window utilization

## 5. Project Comparison 🤔

**Status**: Maybe  
**Description**: Usage patterns across different projects

- Cross-project usage analysis
- Project-specific tool preferences
- Cost allocation by project

## 6. Time-based Analysis 🤔

**Status**: Maybe  
**Description**: Temporal usage patterns

- Peak usage hours identification
- Session duration trends
- Daily/weekly usage patterns
- Productivity insights

---

## Current Usage Database Analysis

The current `src/utils/usage-db.ts` operates as a **comprehensive
session tracker**, not just simple cost tracking:

### Current Capabilities:

- **Session Records**: Full session lifecycle with start/end times
- **Token Tracking**: Input, output, and cache tokens separately
- **Cost Calculations**: Model-specific pricing with cache
  considerations
- **Project Mapping**: Links sessions to specific project directories
- **Daily Aggregation**: Automatic daily summary generation
- **Time Periods**: Today, 7-day, and 30-day summaries
- **Model Tracking**: Which models used per session/day

### Rich Data Already Available:

The database structure supports much more than basic cost display:

- Session duration analysis
- Project-specific usage patterns
- Model performance comparisons
- Cache efficiency metrics
- Daily productivity trends

### Display Challenge:

The usage segment currently shows: `📊 29.9k • $8.83 7d`

This compact format doesn't reflect the rich analytics capabilities
already built into the system. The segment could be enhanced to show
different metrics based on user configuration or rotate through
different insights.

### Potential Solutions:

1. **Configurable Display Modes**: User can choose what to display
2. **Rotating Metrics**: Cycle through different insights
3. **Compact Multi-line**: Show multiple metrics in minimal space
4. **Interactive Details**: Basic display with expandable details

---

## Session Segment Database Migration

### Current Status
The session segment (`src/segments/session.ts`) currently parses transcript files on every statusline render:
- Reads entire transcript file (~several hundred lines)
- Parses every JSON line looking for assistant messages  
- Calculates totals from scratch each time
- **Performance**: ~66ms execution time

### Database Approach Benefits
- Single SQL query: `SELECT * FROM sessions WHERE session_id = ?`
- Pre-calculated totals, no parsing needed
- **Performance**: <1ms query time
- Consistent with usage segment approach
- Data already available in `statusline-usage.db`

### Migration Tasks
- [ ] Update `SessionSegment.build()` to query database instead of parsing files
- [ ] Add fallback to file parsing if session not in database
- [ ] Test session segment with database queries
- [ ] Verify performance improvements
- [ ] Update session segment tests

### Implementation Notes
The database already contains all needed session data:
- `session_id`, `model`, `start_time`, `end_time`  
- `input_tokens`, `output_tokens`, `cache_tokens`
- `cost`, `project_dir`

Context window calculations can still use the same logic with pre-calculated totals.
