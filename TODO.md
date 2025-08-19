# Usage Analytics Enhancement Ideas

## 1. Tool Usage Dashboard 🚧

**Status**: Ready to Implement (Foundation Complete) **Description**:
Track which tools are used most frequently, success rates, and
patterns

- [ ] Tool call frequency analytics
- [ ] Success/failure rates per tool
- [ ] Tool usage patterns and combinations
- [ ] Performance metrics (execution time)
- [ ] CLI command: `--stats-tools`
- [ ] Add tool tracking to usage database schema

## 2. Session Quality Metrics 🤔

**Status**: Maybe  
**Description**: Analyze conversation quality and patterns

- Turn count per session
- Average response length
- User vs assistant message ratios
- Session duration trends

## 3. Cache Efficiency Tracking 🚧

**Status**: Ready to Implement (Data Available) **Description**:
Enhanced cache analytics beyond current basic tracking

- ✅ Cache token tracking (already in database)
- [ ] Cache hit rate calculations
- [ ] Cache savings by project/model
- [ ] Context window utilization analysis
- [ ] CLI command: `--stats-cache`

## 5. Project Comparison ✅

**Status**: Basic Implementation Complete **Description**: Usage
patterns across different projects

- ✅ Cross-project usage analysis (`--stats-project`)
- ✅ Cost allocation by project
- [ ] Project-specific tool preferences (needs tool tracking)
- [ ] Enhanced project insights

## 6. Time-based Analysis 🚧

**Status**: Ready to Implement (Data Available) **Description**:
Temporal usage patterns

- ✅ Daily usage patterns (basic via `--stats-daily`)
- [ ] Peak usage hours identification
- [ ] Session duration trends analysis
- [ ] Weekly/monthly productivity insights
- [ ] CLI command: `--stats-time`

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

## CLI Enhancement & Refactoring ✅

### Status: **COMPLETED**

The CLI has been successfully refactored with a modular structure and
comprehensive commands.

#### Implemented CLI Structure ✅

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
```

#### Implemented CLI Commands ✅

**Version & Info**

- ✅ `--version/-v` - Show package version
- ✅ `--help/-h` - Enhanced help system

**Configuration Management**

- ✅ `--config` - Open config in editor
- ✅ `--config-create` - Create default config
- ✅ `--config-path` - Show config location
- ✅ `--config-info` - Show config info
- ✅ `--reset-config` - Reset config to defaults
- ✅ `--validate-config` - Validate current config file

**Theme Management**

- ✅ `--list-themes` - Show available color themes
- ✅ `--preview-theme <theme>` - Preview specific theme
- ✅ `--list-separators` - Show available separator styles

**Demo & Testing**

- ✅ `--demo` - Run demo mode
- ✅ `--demo-theme <theme>` - Demo specific theme
- ✅ `--test-segments` - Test all segments with current config

**Usage Analytics**

- ✅ `--stats` - Show usage statistics from database
- ✅ `--stats-daily` - Show daily usage breakdown
- ✅ `--stats-project` - Show per-project usage
- ✅ `--export-data <format>` - Export usage data (JSON/CSV)

**Database Management**

- ✅ `--clean-database` - Clean old database entries
- ✅ `--database-info` - Show database statistics
- ✅ `--reset-database` - Reset/recreate database

**Installation**

- ✅ `--install` - Manual installation trigger
- ✅ `--uninstall` - Remove statusline from Claude settings

### Foundation Benefits Achieved ✅

- **Modular**: Each command in separate file
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new commands
- **User-friendly**: Consistent help and error handling
- **Professional**: Complete CLI experience

**The CLI now acts like an MCP tool** - you can run commands like
`--stats`, `--database-info`, etc. directly.

---

## New Features Ready to Implement (Foundation Complete)

### 7. Enhanced Usage Segment Display 🚧

**Status**: Ready to Implement **Description**: Improve the statusline
usage segment beyond basic cost display

- [ ] Configurable display modes (cost/tokens/sessions/cache
      efficiency)
- [ ] Rotating metrics that cycle through different insights
- [ ] Context-aware display (show relevant metric based on recent
      activity)
- [ ] Compact multi-line display option
- [ ] CLI preview: `--preview-usage-segment`

### 8. Advanced Export Formats 🚧

**Status**: Ready to Implement (CLI foundation exists)
**Description**: Rich data export capabilities

- ✅ Basic JSON/CSV export (`--export-data`)
- [ ] Excel/XLSX export with charts
- [ ] Markdown reports with analytics
- [ ] Time-series CSV for external analysis
- [ ] CLI commands: `--export-excel`, `--export-report`

### 9. Configuration Profiles 🚧

**Status**: Ready to Implement (CLI structure ready) **Description**:
Multiple named configurations for different use cases

- [ ] Save/load named configuration profiles
- [ ] Project-specific auto-config switching
- [ ] Quick theme/segment switching
- [ ] CLI commands: `--profile save <name>`, `--profile load <name>`

### 10. Real-time Monitoring 🚧

**Status**: Ready to Implement **Description**: Live monitoring
capabilities

- [ ] Watch mode for real-time stats (`--stats --watch`)
- [ ] Live usage tracking during sessions
- [ ] Cost threshold alerts
- [ ] Performance monitoring dashboard

---

## Model Pricing Configuration 💰

**Status**: User Configuration Enhancement  
**Description**: Allow users to configure their own model pricing information in case the project isn't maintained or new models are released

### Current Implementation

The model pricing is hardcoded in `src/config.ts:191-245` with the following models:

```typescript
export const MODEL_PRICING: Record<string, ModelPricing> = {
    'claude-opus-4-1-20250805': {
        name: 'Claude Opus 4.1',
        input_tokens: 15,
        output_tokens: 75,
        cache_tokens: 1.5,
        context_window: 200000,
    },
    // ... other models
};
```

### Proposed Enhancement

**Goal**: Make model pricing user-configurable via JSON config files

#### Configuration Structure

Add `model_pricing` section to statusline config files:

```json
{
    "color_theme": "dark",
    "model_pricing": {
        "claude-opus-4-2-future": {
            "name": "Claude Opus 4.2",
            "input_tokens": 18,
            "output_tokens": 85,
            "cache_tokens": 1.8,
            "context_window": 300000
        },
        "custom-model-name": {
            "name": "Custom Model",
            "input_tokens": 5,
            "output_tokens": 20,
            "cache_tokens": 0.5,
            "context_window": 150000
        }
    }
}
```

#### Implementation Requirements

- [ ] Update `StatuslineConfig` type to include optional `model_pricing` field
- [ ] Modify `load_config()` to merge user-defined pricing with built-in defaults
- [ ] User pricing overrides built-in pricing for matching model keys
- [ ] Add validation for pricing structure (positive numbers, required fields)
- [ ] Update JSON schema to include model pricing configuration
- [ ] Add CLI command `--add-model-pricing <model-id>` for easy setup

#### Benefits

- **Future-proof**: Users can add new models without code updates
- **Flexibility**: Override pricing for specific use cases or regions  
- **Maintenance**: Project remains useful even if not actively maintained
- **Customization**: Support for private/custom models with user-defined pricing

#### JSON Schema Updates

Update `statusline.schema.json` to include:

```json
{
    "model_pricing": {
        "type": "object",
        "additionalProperties": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "input_tokens": {"type": "number", "minimum": 0},
                "output_tokens": {"type": "number", "minimum": 0}, 
                "cache_tokens": {"type": "number", "minimum": 0},
                "context_window": {"type": "number", "minimum": 1}
            },
            "required": ["name", "input_tokens", "output_tokens", "cache_tokens", "context_window"]
        }
    }
}
```
