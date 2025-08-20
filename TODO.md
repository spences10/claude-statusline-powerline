# Usage Analytics Enhancement Ideas

## 1. Tool Usage Enhancements 🚧

**Status**: Partial Implementation (Core Complete)  
**Description**: Remaining tool usage analytics features

- [ ] Success/failure rates per tool (needs refinement)
- [ ] Performance metrics (execution time)
- [ ] Add tool tracking to usage database schema

## 2. Session Quality Metrics 🤔

**Status**: Maybe  
**Description**: Analyze conversation quality and patterns

- Turn count per session
- Average response length
- User vs assistant message ratios
- Session duration trends

## 3. Project Comparison 🚧

**Status**: Partially Complete **Description**: Usage patterns across
different projects

- ✅ Cross-project usage analysis (`--stats-project`)
- ✅ Cost allocation by project
- [ ] Enhanced project insights

## 4. Time-based Analysis 🚧

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

## New Features Ready to Implement (Foundation Complete)

### 5. Enhanced Usage Segment Display 🚧

**Status**: Ready to Implement **Description**: Improve the statusline
usage segment beyond basic cost display

- [ ] Configurable display modes (cost/tokens/sessions/cache
      efficiency)
- [ ] Rotating metrics that cycle through different insights
- [ ] Context-aware display (show relevant metric based on recent
      activity)
- [ ] Compact multi-line display option
- [ ] CLI preview: `--preview-usage-segment`

### 6. Advanced Export Formats 🚧

**Status**: Ready to Implement (CLI foundation exists)
**Description**: Rich data export capabilities

- ✅ Basic JSON/CSV export (`--export-data`)
- [ ] Excel/XLSX export with charts
- [ ] Markdown reports with analytics
- [ ] Time-series CSV for external analysis
- [ ] CLI commands: `--export-excel`, `--export-report`

### 7. Configuration Profiles 🚧

**Status**: Ready to Implement (CLI structure ready) **Description**:
Multiple named configurations for different use cases

- [ ] Save/load named configuration profiles
- [ ] Project-specific auto-config switching
- [ ] Quick theme/segment switching
- [ ] CLI commands: `--profile save <name>`, `--profile load <name>`

### 8. Real-time Monitoring 🚧

**Status**: Ready to Implement **Description**: Live monitoring
capabilities

- [ ] Watch mode for real-time stats (`--stats --watch`)
- [ ] Live usage tracking during sessions
- [ ] Cost threshold alerts
- [ ] Performance monitoring dashboard

---

## Missing CLI Commands (Entry Points Only) 🚧

**Status**: Foundation Complete, Implementation Needed
**Description**: CLI commands that have routing but no actual
implementation

- [ ] `--stats-time` - Time-based analysis (entry point missing)
- [ ] `--preview-usage-segment` - Preview usage segment display modes
- [ ] `--export-excel` - Excel/XLSX export with charts
- [ ] `--export-report` - Markdown reports with analytics
- [ ] `--profile save <name>` - Save configuration profile
- [ ] `--profile load <name>` - Load configuration profile
- [ ] `--stats --watch` - Real-time monitoring mode
- [ ] `--add-model-pricing <model-id>` - Add custom model pricing

---

## Model Pricing Configuration 💰

**Status**: User Configuration Enhancement  
**Description**: Allow users to configure their own model pricing
information in case the project isn't maintained or new models are
released

### Current Implementation

The model pricing is hardcoded in `src/config.ts:191-245` with the
following models:

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

- [ ] Update `StatuslineConfig` type to include optional
      `model_pricing` field
- [ ] Modify `load_config()` to merge user-defined pricing with
      built-in defaults
- [ ] User pricing overrides built-in pricing for matching model keys
- [ ] Add validation for pricing structure (positive numbers, required
      fields)
- [ ] Update JSON schema to include model pricing configuration
- [ ] Add CLI command `--add-model-pricing <model-id>` for easy setup

#### Benefits

- **Future-proof**: Users can add new models without code updates
- **Flexibility**: Override pricing for specific use cases or regions
- **Maintenance**: Project remains useful even if not actively
  maintained
- **Customization**: Support for private/custom models with
  user-defined pricing

#### JSON Schema Updates

Update `statusline.schema.json` to include:

```json
{
	"model_pricing": {
		"type": "object",
		"additionalProperties": {
			"type": "object",
			"properties": {
				"name": { "type": "string" },
				"input_tokens": { "type": "number", "minimum": 0 },
				"output_tokens": { "type": "number", "minimum": 0 },
				"cache_tokens": { "type": "number", "minimum": 0 },
				"context_window": { "type": "number", "minimum": 1 }
			},
			"required": [
				"name",
				"input_tokens",
				"output_tokens",
				"cache_tokens",
				"context_window"
			]
		}
	}
}
```

---

## Font Installation & Management 🔤

**Status**: User Experience Enhancement  
**Description**: CLI-based font installation and management for
optimal statusline display

### Current Font Support

The project currently supports different `font_profile` options:

- `powerline` - Basic powerline symbols (works with Victor Mono,
  Source Code Pro)
- `nerd-font` - Full Nerd Font symbol set

### Proposed Font Installation Features

#### Core Font Installation

- [ ] `--install-fonts` - Interactive font installer
- [ ] `--list-fonts` - Show installed fonts with powerline/nerd-font
      compatibility
- [ ] `--test-fonts` - Test current font rendering with sample
      statusline
- [ ] `--recommend-fonts` - Recommend fonts based on system/terminal

#### Supported Font Categories

**Powerline-Compatible Fonts** (basic symbols):

- [ ] Victor Mono (already mentioned by user)
- [ ] Source Code Pro for Powerline
- [ ] Inconsolata for Powerline
- [ ] DejaVu Sans Mono for Powerline

**Full Nerd Fonts** (complete symbol set):

- [ ] FiraCode Nerd Font
- [ ] JetBrains Mono Nerd Font
- [ ] Hack Nerd Font
- [ ] CascadiaCode Nerd Font

#### Installation Methods

**Cross-Platform Font Installation**:

- [ ] **Linux**: Download to `~/.local/share/fonts/` and run
      `fc-cache`
- [ ] **macOS**: Download to `~/Library/Fonts/`
- [ ] **Windows**: Download to
      `%LOCALAPPDATA%\Microsoft\Windows\Fonts\`

**Package Manager Integration**:

- [ ] **Homebrew** (macOS):
      `brew install --cask font-fira-code-nerd-font`
- [ ] **Chocolatey** (Windows): `choco install firacodenerd`
- [ ] **APT** (Ubuntu/Debian): `apt install fonts-firacode`

#### CLI Commands

```bash
# Font installation
--install-fonts                    # Interactive installer
--install-fonts nerd               # Install recommended Nerd Font
--install-fonts powerline          # Install powerline-compatible font
--install-fonts fira-code          # Install specific font

# Font management
--list-fonts                       # Show available fonts
--test-fonts                       # Test current font rendering
--recommend-fonts                  # Get font recommendations
--font-info                        # Show current font compatibility
```

#### Implementation Architecture

**Font Detection System**:

- [ ] Detect terminal type (iTerm2, Windows Terminal, GNOME Terminal,
      etc.)
- [ ] Test font rendering capabilities
- [ ] Recommend optimal fonts based on environment

**Download & Installation**:

- [ ] GitHub releases API integration for Nerd Fonts
- [ ] Font file validation (TTF/OTF format checking)
- [ ] Cross-platform installation paths
- [ ] System font cache refresh

**Font Testing**:

- [ ] Render sample statusline with various symbols
- [ ] Test powerline separators (, , , etc.)
- [ ] Test Nerd Font icons (, , , etc.)
- [ ] Validate separator alignment and spacing

#### Interactive Installation Flow

```
$ statusline --install-fonts

🔤 Font Installation for Claude Statusline Powerline

Current font compatibility: ⚠️  Partial (powerline symbols work, nerd-font symbols missing)
Terminal detected: iTerm2 on macOS

Recommended fonts for your setup:
  1. FiraCode Nerd Font (complete symbol set) ⭐ RECOMMENDED
  2. JetBrains Mono Nerd Font (popular choice)
  3. Victor Mono Nerd Font (upgrade your current Victor Mono)

Install FiraCode Nerd Font? [y/N]: y

📥 Downloading FiraCode Nerd Font...
✅ Downloaded 12 font files (6.2 MB)
📁 Installing to ~/Library/Fonts/...
🔄 Refreshing font cache...
✅ Installation complete!

Next steps:
  1. Restart your terminal
  2. Set terminal font to "FiraCodeNerdFont-Regular"
  3. Run: statusline --test-fonts
```

#### Font Profile Auto-Detection

- [ ] Automatically detect if user has Nerd Fonts installed
- [ ] Switch font profile based on detected capabilities
- [ ] Graceful fallback from nerd-font to powerline symbols

#### Benefits

- **User-Friendly**: No manual font hunting and installation
- **Optimal Display**: Ensures best visual experience
- **Cross-Platform**: Works on Linux, macOS, Windows
- **Smart Detection**: Automatic font capability detection
- **Terminal Integration**: Terminal-specific recommendations

#### Implementation Files

```
src/cli/commands/fonts.ts          # Font management commands
src/utils/font-detection.ts        # Font capability detection
src/utils/font-installer.ts        # Cross-platform installation
src/data/recommended-fonts.json    # Font database with download URLs
```
