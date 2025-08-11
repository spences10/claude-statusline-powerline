# Claude Statusline Powerline

A beautiful powerline-style statusline for Claude Code with git integration.

## Features

- 🎨 **Powerline styling** with beautiful separators and colors
- 🌿 **Git integration** - shows branch name and dirty status
- 📁 **Directory display** - current working directory
- 📱 **Model info** - shows which Claude model you're using
- ⚡ **Fast** - minimal overhead, updates smoothly
- 🛠️ **TypeScript** - fully typed and maintainable

## Preview

```
 Claude Sonnet 4  📁 my-project   main ✓
```

When you have uncommitted changes:

```
 Claude Sonnet 4  📁 my-project   main ±
```

## Installation

### Global Installation (Recommended)

```bash
npm install -g claude-statusline-powerline
claude-statusline-install
```

### Local Development

```bash
git clone <repo-url>
cd claude-statusline
pnpm install
pnpm build
```

Then configure manually in your `~/.claude/settings.json`:

```json
{
	"statusLine": {
		"type": "command",
		"command": "/path/to/claude-statusline/dist/statusline.js"
	}
}
```

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

The statusline uses these symbols: `` (powerline separators) and `` (git branch)

## How It Works

Claude Code sends session information via stdin as JSON:

```json
{
	"session_id": "...",
	"model": { "display_name": "Claude Sonnet 4" },
	"workspace": { "current_dir": "/path/to/project" }
}
```

The statusline script processes this and outputs a colored powerline-style status.

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

## Colors

- 🔵 **Blue** - Model information
- ⚫ **Gray** - Directory/path information
- 🟢 **Green** - Clean git repository
- 🟡 **Yellow** - Dirty git repository (uncommitted changes)

## License

MIT
