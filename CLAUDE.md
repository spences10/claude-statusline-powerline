# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when
working with code in this repository.

Unbreakable rules:

- snake case for function and variables names

## Project Overview

A TypeScript-based powerline statusline for Claude Code with git
integration, session tracking, and cost monitoring. The project
creates a beautiful terminal status bar that displays model info,
directory, git status, and usage metrics.

## Development Commands

```bash
# Build the project
pnpm run build

# Development with watch mode
pnpm run dev

# Run tests
pnpm run test

# Run demo (requires build first)
pnpm run demo

# Format code
pnpm run format

# Check formatting
pnpm run format:check

# Release workflow
pnpm run changeset    # Add changesets
pnpm run version      # Update versions
pnpm run release      # Build and publish
```

## Architecture

### Core System

- **Entry Point**: `src/statusline.ts` - Main script that reads JSON
  from stdin and outputs formatted statusline
- **Core Engine**: `src/core/statusline.ts` - Builds statusline from
  segments, handles multiline layouts
- **Registry**: `src/core/registry.ts` - Plugin-style segment
  registration system with priority ordering

### Segment System

- **Base**: `src/segments/base.ts` - Abstract base class for all
  segments
- **Auto-registration**: Segments auto-register on import via
  `src/segments/index.ts`
- **Built-in segments**: model, directory, git, session (in
  `src/segments/`)
- Each segment implements `build()` method returning styled segment
  with separator info

### Configuration System

- **Config**: `src/config.ts` - Handles environment variables, JSON
  file loading, theme application
- **Themes**: `src/themes/` - Color themes (dark, electric) with
  segment-specific colors
- **Separators**: Multiple styles (thick, thin, curvy, flame,
  lightning, etc.) with theme presets
- **Profiles**: Override separator styles across themes (all-curvy,
  electric-chaos, etc.)

### Environment Variables

- `STATUSLINE_COLOR_THEME` - Color theme (dark, electric)
- `STATUSLINE_THEME` - Separator theme (minimal, expressive, subtle,
  electric, curvy, angular)
- `STATUSLINE_SEPARATOR_PROFILE` - Override separators (all-curvy,
  mixed-dynamic, etc.)
- `STATUSLINE_FONT_PROFILE` - Font compatibility (powerline,
  nerd-font)
- `STATUSLINE_SHOW_*` - Toggle individual segments (MODEL, DIRECTORY,
  GIT, SESSION)

### Multiline Support

- JSON config files (multiline-example.json, statusline.config.json,
  .statusline.json)
- `DisplayConfig` with multiple lines, each specifying which segments
  to show
- Fallback to single-line if no multiline config found

### Cost Tracking

- Model pricing in `src/config.ts` with per-million token rates
- Session usage parsing from transcript files
- Context window monitoring with percentage warnings

## Testing Strategy

The project uses a custom test runner (`src/test.ts`) that:

- Tests theme loading and application
- Validates separator style generation
- Checks configuration merging logic
- Runs demo scenarios

## Key Files to Understand

- `src/types.ts` - All TypeScript interfaces and types
- `src/config.ts` - Configuration loading, themes, model pricing
- `src/core/statusline.ts` - Main rendering logic
- `src/segments/base.ts` - Segment architecture
- `src/separators/styles.ts` - Visual separator implementations

## Build Output

- Compiles TypeScript to `dist/` directory
- Main executable: `dist/statusline.js`
- Install script: `dist/install.js`
- Includes source maps and declarations for debugging
