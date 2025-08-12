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
- [x] **Session tracking with usage metrics** - Real-time token and
      cost display with cumulative session totals
- [x] **Cost tracking and budget monitoring** - Model-specific pricing
      with context window warnings at 75% and 90%
- [x] **Context window tracking** - Shows remaining tokens with smart
      display (tokens left vs percentage warnings)
- [x] **Transcript parsing** - Direct JSONL parsing of Claude Code's
      session transcripts for accurate cumulative usage
- [x] **🎨 MODULAR THEME SYSTEM** - Complete architectural refactor
      with:
  - [x] Segment registry for pluggable architecture
  - [x] Color theme system (Dark vs Electric themes working!)
  - [x] Separator style system with multiple font profile support
  - [x] TypeScript demo script with comprehensive testing
  - [x] Theme + separator + segment visibility combinations

### 🐛 Current Issues (High Priority)

- [ ] **SEPARATOR STYLES NOT WORKING** - Environment variable
      regression
  - Issue: `STATUSLINE_THEME` env var not being read (shows
    `undefined`)
  - Root cause: Multiline environment variable parsing in
    `src/config.ts:174`
  - Expected: Victor Mono should show thin vs thick separators at
    minimum
  - Status: Color themes work perfectly, separators broken during
    refactor
  - Fix needed: Environment variable reading in `load_config()`
    function

### 📋 Planned Features

#### Session & Usage Tracking

- [x] **Session segment** - Track current session usage
  - [x] Token counting (input/output/cached) with cumulative totals
  - [x] Cost calculation in dollars with model-specific pricing
  - [x] Context window tracking with smart display (75%: show %, 90%+:
        warning !%)
  - [x] Session duration calculation from first to last message
  - [x] Direct transcript parsing (JSONL format, no external
        dependencies)
  - [x] Real-time parsing of entire session history for accurate
        totals

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

### 🎨 Modular Theme System Architecture (NEW!)

- ✅ **Segment Registry**: Pluggable architecture with `BaseSegment`
  interface
- ✅ **Color Themes**: `DarkTheme` vs `ElectricTheme` with dramatic
  visual differences
- ✅ **Separator Styles**: Support for
  thin/thick/curvy/angly/flame/wave/lightning
- ✅ **Font Profiles**: powerline (basic) vs nerd-font (full icons)
- ✅ **TypeScript Demo**: `src/demo/demo.ts` with comprehensive testing and performance metrics
  and performance metrics
- ✅ **Configuration System**: Environment variable + JSON config
  support
- 🐛 **Current Bug**: Environment variable parsing regression in
  `load_config()`

**Quick Fix for Next Session**:

```typescript
// In src/config.ts:174, fix the multiline env var parsing:
const theme_from_env = process.env.STATUSLINE_THEME; // Remove multiline syntax
```

### Session/Cost Tracking Architecture

- ✅ Parse Claude Code's internal transcript files directly (JSONL
  format) with complete session history
- ✅ Model-specific pricing configuration for accurate cost
  calculation (input, output, and cache tokens)
- ✅ Context window tracking with usage warnings (75%: %, 90%+: !%)
- ✅ Real-time session duration and cumulative token tracking
- ✅ Smart display formatting (tokens remaining vs percentage
  warnings)
- ✅ Handles long sessions and resumed sessions correctly
- 🔄 Daily aggregation and budget thresholds (future enhancement)

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
