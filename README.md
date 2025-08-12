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

## Preview

**Expressive theme with session tracking:**

```
 Claude Sonnet 4  📁 my-project   main ✓  💰 25k • $0.15 175k left
```

**When you have uncommitted changes (attention-grabbing separators):**

```
 Claude Sonnet 4  📁 my-project   main ±  💰 150k • $0.90 !85%
```

**Context usage warnings:**

- `175k left` - Normal usage (< 75%)
- `85%` - High usage warning (75-89%)
- `!95%` - Critical usage warning (90%+)

## Separator Themes & Profiles

### 🎨 Built-in Themes:

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

### Environment Variables

```bash
# Set theme via environment variable
export STATUSLINE_THEME=electric

# Override separators with a profile
export STATUSLINE_SEPARATOR_PROFILE=all-curvy

# Font profile (for compatibility)
export STATUSLINE_FONT_PROFILE=victor-mono  # or nerd-font-full, minimal
```

### Testing Themes & Profiles

```bash
# Test different themes
STATUSLINE_THEME=minimal claude-statusline
STATUSLINE_THEME=electric claude-statusline

# Test separator profiles (can combine with any theme!)
STATUSLINE_SEPARATOR_PROFILE=all-curvy claude-statusline
STATUSLINE_SEPARATOR_PROFILE=electric-chaos STATUSLINE_THEME=minimal claude-statusline

# Font profile examples
STATUSLINE_FONT_PROFILE=minimal claude-statusline    # ASCII-safe
STATUSLINE_FONT_PROFILE=nerd-font-full claude-statusline  # Full Nerd Font support
```

### 🎯 Pro Tips:

- **Combine themes + profiles**:
  `STATUSLINE_THEME=minimal STATUSLINE_SEPARATOR_PROFILE=all-curvy`
- **Victor Mono users**: The default font profile works great!
- **Full Nerd Font users**: Set
  `STATUSLINE_FONT_PROFILE=nerd-font-full` for more icons
- **Universal compatibility**: Use `STATUSLINE_FONT_PROFILE=minimal`
  for ASCII-only

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

- Node.js >= 14.0.0
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

## Development

```bash
# Build TypeScript
pnpm build

# Watch mode
pnpm dev

# Test locally
pnpm test

# Test with custom input
echo '{"model":{"display_name":"Test"},"workspace":{"current_dir":"/tmp"}}' | node dist/statusline.js
```

## Segments

1. **Model** (Blue) - Shows the Claude model name
2. **Directory** (Gray) - Shows current directory name
3. **Git** (Green/Yellow) - Shows branch and status (✓ clean, ± dirty)
4. **Session** (Purple) - Token usage, cost, and context monitoring
   - Format: `💰 {tokens}k • ${cost} {context}`
   - Context shows: tokens remaining, percentage (75%+), or warning
     (!90%+)

## Colors

- 🔵 **Blue** - Model information
- ⚫ **Gray** - Directory/path information
- 🟢 **Green** - Clean git repository
- 🟡 **Yellow** - Dirty git repository (uncommitted changes)
- 🟣 **Purple** - Session usage and cost tracking

## License

MIT
