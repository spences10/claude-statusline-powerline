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
- 🧠 **Settings IntelliSense** - autocomplete, validation, and hover
  docs in settings files

## Separator Themes & Profiles

### 🎨 Color Themes:

- **`dark`** - Default professional dark theme
- **`electric`** - High-contrast electric theme with vibrant colors

### 🔧 Separator Themes:

- **`minimal`** - Subtle thin separators, clean and professional
- **`expressive`** - Full range of dynamic effects (default)
- **`subtle`** - Balanced thick separators with gentle waves
- **`electric`** - Maximum drama with lightning everywhere! ⚡
- **`curvy`** - Smooth curved separators throughout
- **`angular`** - Sharp angular separators for a modern look

### 🔧 Separator Profiles

Override any theme's separators with these profiles:

- **`all-curvy`** - Make everything use curved separators
- **`all-angly`** - All angular separators
- **`mixed-dynamic`** - Curved by default, lightning/flame for dirty
  repos
- **`minimal-clean`** - Thin separators with thick accents for changes
- **`electric-chaos`** - Maximum separator variety for power users

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
	"theme": "expressive",
	"font_profile": "nerd-font",
	"separator_profile": "all-curvy",
	"segment_config": {
		"segments": [
			{
				"type": "model",
				"enabled": true,
				"order": 1
			},
			{
				"type": "directory",
				"enabled": true,
				"order": 2
			},
			{
				"type": "git",
				"enabled": true,
				"order": 3
			},
			{
				"type": "session",
				"enabled": true,
				"order": 4
			}
		]
	}
}
```

### Configuration Options

**Color Themes:**

- `"dark"` - Classic blue/gray/yellow theme
- `"electric"` - Purple/cyan/red theme

**Separator Themes:**

- `"minimal"` - Clean and simple separators
- `"expressive"` - Bold, dynamic separators
- `"subtle"` - Refined, understated style
- `"electric"` - High-energy, lightning-style separators
- `"curvy"` - Smooth, curved separators (Victor Mono compatible)
- `"angular"` - Sharp, angular separators (Victor Mono compatible)

**Font Profiles:**

- `"powerline"` - Basic powerline font support
- `"nerd-font"` - Full Nerd Font support with more icons

**Separator Profiles:**

- `"all-curvy"` - All curved separators
- `"all-angly"` - All angular separators
- `"mixed-dynamic"` - Curved with dynamic dirty state indicators
- `"minimal-clean"` - Thin separators with thick for dirty states
- `"electric-chaos"` - High-energy mix of lightning and flame
  separators

### Custom Segment Ordering

You can reorder segments by changing the `order` property:

```json
{
	"segment_config": {
		"segments": [
			{ "type": "git", "enabled": true, "order": 1 },
			{ "type": "model", "enabled": true, "order": 2 },
			{ "type": "directory", "enabled": true, "order": 3 },
			{ "type": "session", "enabled": false, "order": 4 }
		]
	}
}
```

### Custom Icons

Customize the icons used in each segment with the `icons` property in
segment styles:

```json
{
	"segment_config": {
		"segments": [
			{
				"type": "model",
				"enabled": true,
				"order": 1,
				"style": {
					"icons": {
						"ai": "🤖"
					}
				}
			},
			{
				"type": "directory",
				"enabled": true,
				"order": 2,
				"style": {
					"icons": {
						"folder": "🗂️"
					}
				}
			},
			{
				"type": "git",
				"enabled": true,
				"order": 3,
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
				"enabled": true,
				"order": 4,
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

### Multi-line Layout Support

For complex statuslines, use multi-line layouts:

```json
{
	"display": {
		"lines": [
			{
				"segments": {
					"model": true,
					"directory": true
				}
			},
			{
				"segments": {
					"git": true,
					"session": true
				}
			}
		]
	}
}
```

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

Long branch names and directory names are automatically truncated. You
can configure the maximum length:

```json
{
	"truncation": {
		"model_length": 15,
		"directory_length": 25,
		"git_length": 20,
		"session_length": 30
	}
}
```

Or override per segment:

```json
{
	"segment_config": {
		"segments": [
			{
				"type": "git",
				"enabled": true,
				"order": 3,
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

1. **Model** (Blue) - Shows the Claude model name
2. **Directory** (Gray) - Shows current directory name
3. **Git** (Green/Yellow) - Enhanced status with superscript symbols
4. **Session** (Purple) - Token usage, cost, and context monitoring
   - Format: `💰 {tokens}k • ${cost} {context}`
   - Context shows: remaining tokens (< 75%), percentage (75-89%), or
     warning (!90%+)

## Colors

- 🔵 **Blue** - Model information
- ⚫ **Gray** - Directory/path information
- 🟢 **Green** - Clean git repository
- 🟡 **Yellow** - Dirty git repository (uncommitted changes)
- 🟣 **Purple** - Session usage and cost tracking

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
