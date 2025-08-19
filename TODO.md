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

The session segment (`src/segments/session.ts`) currently parses
transcript files on every statusline render:

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

- [ ] Update `SessionSegment.build()` to query database instead of
      parsing files
- [ ] Add fallback to file parsing if session not in database
- [ ] Test session segment with database queries
- [ ] Verify performance improvements
- [ ] Update session segment tests

### Implementation Notes

The database already contains all needed session data:

- `session_id`, `model`, `start_time`, `end_time`
- `input_tokens`, `output_tokens`, `cache_tokens`
- `cost`, `project_dir`

Context window calculations can still use the same logic with
pre-calculated totals.

---

## CLI Enhancement & Refactoring

### Current CLI Structure Issues

- CLI logic scattered across multiple files: `src/statusline.ts`,
  `src/cli-config.ts`, `src/install.ts`
- Limited CLI functionality compared to potential
- No consistent command structure or help system

### Proposed CLI Refactoring

**Goal**: Consolidate all CLI functionality into a dedicated `/cli`
folder with modular commands

#### New CLI Structure

```
src/cli/
├── index.ts          # Main CLI entry point with command routing
├── commands/
│   ├── config.ts     # Config management commands
│   ├── demo.ts       # Demo mode functionality
│   ├── stats.ts      # Usage statistics display
│   ├── themes.ts     # Theme listing and preview
│   ├── database.ts   # Database management
│   └── install.ts    # Installation command
└── utils/
    ├── help.ts       # Help system utilities
    └── validation.ts # Config validation utilities
```

#### New CLI Commands to Implement

**Version & Info**

- [ ] `--version/-v` - Show package version
- [ ] `--help/-h` - Enhanced help system

**Configuration Management**

- [ ] `--config` - Open config in editor (existing, move to cli/)
- [ ] `--config-create` - Create default config (existing, move to
      cli/)
- [ ] `--config-path` - Show config location (existing, move to cli/)
- [ ] `--config-info` - Show config info (existing, move to cli/)
- [ ] `--reset-config` - Reset config to defaults
- [ ] `--validate-config` - Validate current config file

**Theme Management**

- [ ] `--list-themes` - Show available color themes with previews
- [ ] `--preview-theme <theme>` - Preview specific theme
- [ ] `--list-separators` - Show available separator styles

**Demo & Testing**

- [ ] `--demo` - Run demo mode (move from npm script)
- [ ] `--demo-theme <theme>` - Demo specific theme
- [ ] `--test-segments` - Test all segments with current config

**Usage Analytics**

- [ ] `--stats` - Show usage statistics from database
- [ ] `--stats-daily` - Show daily usage breakdown
- [ ] `--stats-project` - Show per-project usage
- [ ] `--export-data <format>` - Export usage data (JSON/CSV)

**Database Management**

- [ ] `--clean-database` - Clean old database entries
- [ ] `--database-info` - Show database statistics
- [ ] `--reset-database` - Reset/recreate database

**Installation**

- [ ] Move `src/install.ts` to `src/cli/commands/install.ts`
- [ ] `--install` - Manual installation trigger
- [ ] `--uninstall` - Remove statusline from Claude settings

### Implementation Priority

1. **High**: CLI structure refactoring, --version, --demo
2. **Medium**: Enhanced config commands, theme management
3. **Low**: Advanced stats, database management commands

### Benefits of Refactoring

- **Modular**: Each command in separate file
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new commands
- **User-friendly**: Consistent help and error handling
- **Professional**: More complete CLI experience
