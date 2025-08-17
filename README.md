# Claude Statusline Powerline

[![npm version](https://badge.fury.io/js/claude-statusline-powerline.svg)](https://badge.fury.io/js/claude-statusline-powerline)
[![npm downloads](https://img.shields.io/npm/dm/claude-statusline-powerline.svg)](https://www.npmjs.com/package/claude-statusline-powerline)
[![install size](https://packagephobia.com/badge?p=claude-statusline-powerline)](https://packagephobia.com/result?p=claude-statusline-powerline)
[![license](https://img.shields.io/npm/l/claude-statusline-powerline.svg)](https://github.com/spences10/claude-statusline-powerline/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A beautiful powerline-style statusline for Claude Code with git
integration, session tracking, and settings config IntelliSense
support.

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
| **Context**   | 🧠   | Cache performance and session state       | `🧠 10.5k cached (70% reused)` |

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
				"type": "context"
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

For the best experience, use a powerline-compatible font:

**Recommended fonts:**

- **Victor Mono** (built and tested with this)
- Any [Nerd Font](https://www.nerdfonts.com/)

The statusline uses these symbols: `(powerline separators) and` (git
branch)

## How It Works

Claude Code sends session information via stdin as JSON:

```json
{
	"session_id": "...",
	"model": { "display_name": "Claude Sonnet 4" },
	"workspace": { "current_dir": "/path/to/project" }
}
```

The statusline script processes this and outputs a colored
powerline-style status.

## Segments

1. **Model** - Shows the Claude model name
2. **Directory** - Shows current directory name
3. **Git** - Enhanced status with superscript symbols
4. **Session** - Token usage, cost, and context monitoring
   - Format: `💰 {tokens}k • ${cost} {context}`
   - Context shows: remaining tokens (< 75%), percentage (75-89%), or
     warning (!90%+)
5. **Context** - Cache performance and session state
   - Shows cache hit rate and total cached tokens for warm sessions
   - Displays "Cold" for new sessions without significant cache usage

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
