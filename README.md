# Claude Statusline Powerline

[![npm version](https://badge.fury.io/js/claude-statusline-powerline.svg)](https://badge.fury.io/js/claude-statusline-powerline)
[![npm downloads](https://img.shields.io/npm/dm/claude-statusline-powerline.svg)](https://www.npmjs.com/package/claude-statusline-powerline)
[![license](https://img.shields.io/npm/l/claude-statusline-powerline.svg)](https://github.com/spences10/claude-statusline-powerline/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A beautiful powerline-style statusline for Claude Code with git
integration, session tracking, and settings config IntelliSense
support.

![demo of themes](/demo.png)

## ✨ Features

- 🎨 **Powerline styling** with beautiful separators and colors
- 🌿 **Enhanced git integration** - comprehensive status with
  superscript symbols
- 📁 **Directory display** - current working directory
- 📱 **Model info** - shows which Claude model you're using
- 💰 **Session tracking** - real-time token usage and cost estimation
- 📊 **Context monitoring** - smart warnings at 75% and 90% usage
- 🧠 **Context caching** - displays cache hit rate and warm/cold
  sessions
- 🎯 **Settings IntelliSense** - autocomplete, validation, and hover
  docs in settings files

## 📊 Available Segments

| Segment       | Icon | Description                               | Example Output                 |
| ------------- | ---- | ----------------------------------------- | ------------------------------ |
| **Model**     | ⚡   | Shows the Claude model being used         | `⚡ Claude Sonnet 4`           |
| **Directory** | 📁   | Current working directory name            | `📁 my-project`                |
| **Git**       | 🌿   | Git branch and status with superscript    | `🌿 main ⁺3 ˜1 ᵘ2`             |
| **Session**   | 💰   | Token usage, cost, and context monitoring | `💰 1.2k • $0.01 999k left`    |
| **Usage**     | 📊   | Aggregated usage statistics from database | `📊 29.9k • $8.83 7d`          |
| **Context**   | 🧠   | Cache performance and session state       | `🧠 10.5k cached (70% reused)` |
| **Session ID**| ℹ    | Current session identifier                | `ℹ abc123-def456`              |
| **Rate Limits** | ⚠  | Claude.ai subscription rate limit usage   | `⚠ 5h: 24% \| 7d: 41%`        |

All segments can be **shown/hidden** (via `lines` configuration),
**reordered**, and **customized** through the configuration file.

## Themes & Configuration

### 🎨 Color Themes:

- **`dark`** - Default professional dark theme
- **`electric`** - High-contrast electric theme with vibrant colors
- **`night-owl`** - Dark theme inspired by Night Owl
- **`dracula`** - Popular Dracula theme colors
- **`gruvbox`** - Retro groove color scheme
- **`one-dark`** - Atom's One Dark theme
- **`monokai`** - Classic Monokai theme
- **`nord`** - Arctic, north-bluish theme
- **`tokyo-night`** - Modern dark theme
- **`solarized-light`** - Light theme based on Solarized
- **`gruvbox-light`** - Light variant of Gruvbox
- **`alucard`** - Dark red theme inspired by Hellsing

### ⚡ Available Separator Styles:

- `thick` - Standard powerline separator ▶
- `thin` - Thin powerline separator →
- `curvy` - Curved separator (Victor Mono compatible)
- `angly` - Angular separator \
- `angly2` - Alternative angular separator /
- `flame` - Dramatic flame-style effect 🔥
- `wave` - Wave-like alternating effect 🌊
- `lightning` - High-energy lightning effect ⚡
- `none` - No separator

## 🔧 Configuration

### JSON Configuration with IntelliSense

Claude Statusline Powerline uses JSON configuration files with
**IntelliSense support**:

**Primary config location:**
`~/.claude/claude-statusline-powerline.json`  
**Project-specific override:**
`./.claude/claude-statusline-powerline.json`

### ⚡ IntelliSense Features

- **🎯 Autocomplete** - All available options as you type
- **📖 Hover documentation** - Descriptions for every property
- **🎨 Color validation** - Hex color patterns with examples

### Example Configuration

```json
{
	"$schema": "https://raw.githubusercontent.com/spences10/claude-statusline-powerline/main/statusline.schema.json",
	"color_theme": "dark",
	"font_profile": "nerd-font",
	"segment_config": {
		"segments": [
			{
				"type": "model"
			},
			{
				"type": "directory"
			},
			{
				"type": "git"
			},
			{
				"type": "session"
			},
			{
				"type": "usage"
			},
			{
				"type": "context"
			},
			{
				"type": "session_id"
			},
			{
				"type": "rate_limits"
			}
		]
	}
}
```

### Configuration Options

**Color Themes:**

- `"dark"` - Classic blue/gray/yellow theme
- `"electric"` - Purple/cyan/red theme
- `"night-owl"` - Dark theme with blue/purple accents
- `"dracula"` - Purple/pink/green Dracula theme
- `"gruvbox"` - Warm retro colors
- `"one-dark"` - Blue/purple Atom theme
- `"monokai"` - Classic yellow/orange/green
- `"nord"` - Cool blue/teal arctic theme
- `"tokyo-night"` - Modern purple/blue theme
- `"solarized-light"` - Light theme with blue accents
- `"gruvbox-light"` - Light warm theme
- `"alucard"` - Dark red/crimson theme

**Font Profiles:**

- `"powerline"` - Basic powerline font support
- `"nerd-font"` - Full Nerd Font support with more icons

### Multi-line Layout & Segment Ordering

Control segment layout and ordering using the `lines` configuration:

```json
{
	"segment_config": {
		"lines": [
			{
				"directory": true,
				"git": true
			},
			{
				"model": true,
				"session": true
			},
			{
				"context": true
			}
		],
		"segments": [
			{ "type": "git" },
			{ "type": "model" },
			{ "type": "directory" },
			{ "type": "session" }
		]
	}
}
```

**Control rules:**

- **Visibility**: Only segments present in `lines` configuration are
  shown
- **Between lines**: Order determined by position in `lines` array
- **Within lines**: Order determined by property order in each line
  object
- **Styling**: Use `segments` array to configure colors, icons,
  separators, etc.

### Custom Icons

Customize the icons used in each segment with the `icons` property in
segment styles:

```json
{
	"segment_config": {
		"segments": [
			{
				"type": "model",
				"style": {
					"icons": {
						"ai": "🤖"
					}
				}
			},
			{
				"type": "directory",
				"style": {
					"icons": {
						"folder": "🗂️"
					}
				}
			},
			{
				"type": "git",
				"style": {
					"icons": {
						"branch": "🌿",
						"clean": "✅",
						"dirty": "⚠️"
					}
				}
			},
			{
				"type": "session",
				"style": {
					"icons": {
						"cost": "💲"
					}
				}
			}
		]
	}
}
```

**Available Icons:**

- `ai` - AI/Model segment icon
- `folder` - Directory/folder icon
- `branch` - Git branch icon
- `clean` - Clean git status icon
- `dirty` - Dirty git status icon (fallback)
- `ahead` - Commits ahead of remote
- `behind` - Commits behind remote
- `conflicts` - Merge conflicts
- `staged_add` - Staged additions/modifications
- `staged_del` - Staged deletions
- `unstaged` - Unstaged working directory changes
- `untracked` - Untracked files
- `cost` - Session cost/usage icon

You can use any Unicode character, emoji, or Nerd Font icon code
(e.g., `\uF07B` for folder).

### Custom Separators

Customize separators for individual segments or git states:

```json
{
	"segment_config": {
		"segments": [
			{
				"type": "git",
				"style": {
					"separator": {
						"clean": "thick",
						"dirty": "lightning",
						"conflicts": "flame"
					}
				}
			},
			{
				"type": "model",
				"style": {
					"separator": {
						"style": "curvy"
					}
				}
			}
		]
	}
}
```

### Single Line Layout

For simple single-line statuslines, just omit the `lines`
configuration:

```json
{
	"segment_config": {
		"segments": [
			{ "type": "model" },
			{ "type": "directory" },
			{ "type": "git" },
			{ "type": "session" }
		]
	}
}
```

Segments will appear in the order enabled segments are found.

## 🌿 Enhanced Git Status

The git segment displays comprehensive repository information using
beautiful superscript symbols optimized for Victor Mono font:

### Git Status Symbols

**Powerline Font Profile:**

- `⇡2` - 2 commits ahead of remote
- `⇣1` - 1 commit behind remote
- `⚠️` - Merge conflicts present
- `⁺3` - 3 staged additions/modifications
- `⁻1` - 1 staged deletion
- `˜2` - 2 unstaged changes in working directory
- `ᵘ4` - 4 untracked files

**Example outputs:**

- Clean repo: ` main ✓`
- Complex status: ` main ⇡2 ⁺3 ˜1 ᵘ2`
- With conflicts: ` main ⚠️ ⁺1`
- Behind remote: ` main ⇣3 ˜2`

### Truncation Control

Long segment content is automatically truncated. You can configure the
maximum length per segment:

```json
{
	"segment_config": {
		"segments": [
			{
				"type": "git",
				"style": {
					"truncation_length": 15
				}
			}
		]
	}
}
```

### Minimum Width

You can set a minimum width for any segment to ensure consistent sizing.
Content shorter than the minimum is right-padded with spaces:

```json
{
	"segment_config": {
		"segments": [
			{
				"type": "model",
				"style": {
					"minimum_width": 20
				}
			}
		]
	}
}
```

## 📦 Installation

Install globally with your preferred package manager:

```bash
# npm
npm install -g claude-statusline-powerline

# pnpm
pnpm add -g claude-statusline-powerline

# bun
bun add -g claude-statusline-powerline

# volta
volta install claude-statusline-powerline
```

The statusline will be automatically configured for Claude Code with a
default config file!

## Font Setup

This statusline is **built and tested specifically with Victor Mono**
for optimal powerline compatibility. While it should work with other
Nerd Fonts, the focus is on providing the best experience with
reliable powerline symbols rather than chasing extensive Nerd Font
icon support.

**Primary recommendation:**

- **Victor Mono** - The font this project is optimized for
- Any powerline-compatible font as a secondary option

**Note:** This project prioritizes rock-solid powerline separator
rendering over extensive icon support. Many Nerd Font separators don't
render consistently across different terminals and fonts, so we focus
on what actually works reliably.

## How It Works

Claude Code sends session information via stdin as JSON:

```json
{
	"session_id": "abc123-def456",
	"model": { "display_name": "Claude Sonnet 4" },
	"workspace": { "current_dir": "/path/to/project" },
	"rate_limits": {
		"five_hour": { "used_percentage": 23.5, "resets_at": 1738425600 },
		"seven_day": { "used_percentage": 41.2, "resets_at": 1738857600 }
	}
}
```

The statusline script processes this and outputs a coloured
powerline-style status.

## 🗃️ Local Usage Database

Claude Statusline Powerline maintains a local SQLite database at
`~/.claude/statusline-usage.db` to track usage analytics and power
both the **Session** and **Usage** segments with high-performance data
access.

**Stored Data:**

- **Session records** with start/end times and token usage
- **Daily summaries** with total costs and model usage
- **Project mapping** linking sessions to directory paths
- **Cache performance** metrics for optimization insights

**Performance Benefits:**

- **Session segment**: 31x faster than file parsing (0.11ms vs 3.44ms)
- **Usage segment**: Pre-aggregated daily/weekly/monthly summaries
- **Real-time insights** without impacting statusline responsiveness
- **Efficient SQLite queries** for instant data access

**These segments are database-only** and require the SQLite database
to function. They are not included in the default configuration but
can be enabled by adding them to your config:

```json
{
	"segment_config": {
		"segments": [{ "type": "session" }, { "type": "usage" }]
	}
}
```

The database automatically tracks usage data as you use Claude Code.
If the database is unavailable, these segments simply won't appear.

## Segments

1. **Model** - Shows the Claude model name
2. **Directory** - Shows current directory name
3. **Git** - Enhanced status with superscript symbols
4. **Session** - Current session token usage, cost, and context
   monitoring
   - **Powered by SQLite database**
   - Format: `💰 {tokens}k • ${cost} {context}`
   - Context shows: remaining tokens (< 75%), percentage (75-89%), or
     warning (!90%+)
   - Must be manually enabled in configuration
5. **Usage** - Aggregated usage statistics across time periods
   - **Powered by SQLite database** with pre-calculated summaries
   - Format: `📊 {tokens}k • ${cost} {period}`
   - Shows daily/weekly/monthly aggregated data
   - Must be manually enabled in configuration

6. **Context** - Cache performance and session state
   - Shows cache hit rate and total cached tokens for warm sessions
   - Displays "Cold" for new sessions without significant cache usage
7. **Session ID** - Displays the current session identifier
   - Useful for distinguishing between multiple concurrent sessions
   - Supports truncation for long IDs (default max 20 chars)
8. **Rate Limits** - Shows Claude.ai subscription rate limit usage
   - Displays 5-hour and 7-day rolling window percentages
   - Only appears for Claude.ai subscribers (Pro/Max) after the first
     API response
   - Gracefully hides when rate limit data is not available

## Credits

This project was inspired by
[claude-powerline](https://github.com/Owloops/claude-powerline) by
[@Owloops](https://github.com/Owloops) - thanks for the initial
concept and inspiration!

Built for
[Claude Code](https://docs.anthropic.com/en/docs/claude-code) by
[Anthropic](https://www.anthropic.com/).

## License

MIT
