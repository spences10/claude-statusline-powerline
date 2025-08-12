# Claude Statusline Enhancement TODO

This document tracks planned enhancements to the Claude Code
statusline, inspired by features from
[claude-powerline](https://github.com/Owloops/claude-powerline) and
additional improvements.

## 🎯 Current Status

### ✅ Completed Features

- [x] Basic statusline with Model, Directory, and Git segments
- [x] Powerline symbols and separators (thick, thin, flame, wave,
      lightning)
- [x] Theme-based configuration (minimal, expressive, subtle,
      electric)
- [x] Git branch and dirty status indicators
- [x] Configurable separator styles based on git status

### 🚧 In Progress

- [ ] Session tracking with usage metrics
- [ ] Cost tracking and budget monitoring

### 📋 Planned Features

#### Session & Usage Tracking

- [ ] **Session segment** - Track current session usage
  - [ ] Token counting (input/output/cached)
  - [ ] Cost calculation in dollars
  - [ ] Display types: "cost", "tokens", "both", "breakdown"
  - [ ] Session budget warnings with percentage indicators
  - [ ] Integration with ccusage for data retrieval

- [ ] **Daily usage segment** ("today")
  - [ ] Daily token and cost aggregation
  - [ ] Daily budget monitoring
  - [ ] Configurable warning thresholds (50%, 80%+)
  - [ ] Visual indicators: "25%" normal, "+75%" moderate, "!85%"
        warning

#### Enhanced Git Integration

- [ ] **Comprehensive git status symbols**
  - [ ] Current: `✓` clean, `±` dirty
  - [ ] Add: `⚠` conflicts, `↑3` ahead, `↓2` behind
  - [ ] Add: `⇕` diverged, `?` untracked files count
  - [ ] Add: `+` staged changes, `-` deletions
  - [ ] Git SHA display (short hash, configurable)

#### AI Model Enhancement

- [ ] **Configurable AI model symbols**
  - [ ] Default options: `⚡`, `🤖`, `🧠`, `✨`, `🔮`
  - [ ] User-configurable via environment variable
  - [ ] Model-specific symbols (Claude: `⚡`, GPT: `🤖`, etc.)

#### Advanced Separator Features

- [ ] **New separator styles**
  - [ ] Current: thick, thin, flame, wave, lightning
  - [ ] Add: "pulse" (alternating thickness)
  - [ ] Add: "gradient" (color transitions)
  - [ ] Add: "arrow" (custom arrow shapes)
  - [ ] Add: "diamond" (◆ diamond separators)

- [ ] **Context-aware separators**
  - [ ] Different styles based on segment content
  - [ ] Time-based variations (morning/evening themes)
  - [ ] Status-responsive separators (error states)

#### Configuration Enhancements

- [ ] **Multi-line layout support**
  - [ ] Split segments across multiple lines
  - [ ] Prevent segment cutoff in narrow terminals
  - [ ] Configurable line arrangements

- [ ] **Advanced theming**
  - [ ] 24-bit color support (hex colors)
  - [ ] Light/dark theme variants
  - [ ] Custom theme creation wizard
  - [ ] Theme inheritance and overrides

#### Additional Segments

- [ ] **Time/Date segment**
  - [ ] Current time display
  - [ ] Session duration tracking
  - [ ] Timezone support

- [ ] **System info segment**
  - [ ] Battery level (if laptop)
  - [ ] CPU/Memory usage
  - [ ] Network status

- [ ] **Project context segment**
  - [ ] Package.json version
  - [ ] Node.js version
  - [ ] Virtual environment info

#### Developer Experience

- [ ] **Configuration management**
  - [ ] Config file validation
  - [ ] Live config reload
  - [ ] Multiple config profiles

- [ ] **Testing & Quality**
  - [ ] Unit tests for all segments
  - [ ] Visual regression testing
  - [ ] Performance benchmarks

## 🔧 Implementation Notes

### Session/Cost Tracking Architecture

- Use ccusage library for Claude usage data retrieval
- Implement budget tracking with configurable thresholds
- Add persistent storage for daily aggregation
- Support multiple display formats with proper formatting

### Git Enhancement Strategy

- Extend existing GitInfo interface
- Add async status fetching for performance
- Implement symbol mapping configuration
- Support for complex git states (merge conflicts, rebase, etc.)

### Separator Innovation Areas

- Animated separators (if terminal supports)
- Context-sensitive separator selection
- Performance-optimized separator rendering
- Accessibility-friendly separator alternatives

### Configuration Philosophy

- Environment variable overrides
- JSON config file support
- Sensible defaults with easy customization
- Backward compatibility preservation

## 🎨 Visual Design Goals

- **Clarity**: Information should be immediately readable
- **Efficiency**: Minimal performance impact
- **Personality**: Fun and engaging while professional
- **Flexibility**: Adaptable to different workflows and preferences

## 🚀 Deployment Strategy

1. **Phase 1**: Session/cost tracking (high value, builds on existing
   foundation)
2. **Phase 2**: Enhanced git status (natural extension of current
   features)
3. **Phase 3**: AI model symbols and separator enhancements (polish
   and personality)
4. **Phase 4**: Advanced features and additional segments (power user
   features)

## 📚 References

- [Claude Code Statusline Docs](https://docs.anthropic.com/en/docs/claude-code/statusline)
- [claude-powerline Repository](https://github.com/Owloops/claude-powerline) -
  Session/cost tracking inspiration
- [ccusage](https://github.com/ryanschneider/ccusage) - Usage data
  retrieval
- [Nerd Fonts](https://www.nerdfonts.com/) - Powerline symbol
  reference
