# Claude Statusline Powerline

A beautiful powerline-style statusline for Claude Code with git
integration.

## Features

- 🎨 **Powerline styling** with beautiful separators and colors
- 🌿 **Git integration** - shows branch name and dirty status
- 📁 **Directory display** - current working directory
- 📱 **Model info** - shows which Claude model you're using
- 💰 **Session tracking** - real-time token usage and cost monitoring
- 📊 **Context monitoring** - smart warnings at 75% and 90% usage
- ⚡ **Fast** - minimal overhead, updates smoothly
- 🛠️ **TypeScript** - fully typed and maintainable
- 🎨 **Flexible separator system** - themes + profiles for infinite
  combinations
- 🔤 **Font compatibility** - Victor Mono, Nerd Fonts
- 🎯 **Context-aware** - different effects for clean vs dirty repos
- 🔧 **Highly configurable** - mix and match themes with separator
  profiles

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

### 🔧 Separator Profiles (NEW!)

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

## Configuration

### JSON Configuration

Claude Statusline Powerline uses JSON configuration files for easy
customization:

**Primary config location:**
`~/.claude/claude-statusline-powerline.json`

**Project-specific override:** `./.claude-statusline-powerline.json`

### Example Configuration

```json
{
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

### Testing Configurations

Use the built-in tools to test different themes:

```bash
# View all available themes and separators
pnpm run build && node dist/theme-test.js

# Run the interactive demo
pnpm run demo
```

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

### 🎯 Pro Tips:

- **Combine themes**: Mix color themes, separator themes, and profiles
  for unique looks
- **Full Nerd Font users**: Set `"font_profile": "nerd-font"` for more
  icons
- **Basic compatibility**: Use `"font_profile": "powerline"` for
  standard powerline fonts
- **Project-specific configs**: Create
  `.claude-statusline-powerline.json` in project roots for custom
  per-project styling

## Installation

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

That's it! The statusline will be automatically configured for Claude
Code.

## Requirements

- Node.js >= 20.0.0
- A terminal with powerline font support (recommended: Nerd Fonts)
- Git (for git integration features)

## Font Setup

For the best experience, use a powerline-compatible font:

**Recommended fonts:**

- **Victor Mono** (excellent powerline support)
- **JetBrains Mono Nerd Font**
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
3. **Git** (Green/Yellow) - Shows branch and status (✓ clean, ± dirty)
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

## License

MIT
