# Claude Statusline Enhancement TODO

This document tracks planned enhancements to the Claude Code
statusline, inspired by features from
[claude-powerline](https://github.com/Owloops/claude-powerline) and
additional improvements.

## 🎯 Current Status

### 🐛 Current Issues (High Priority)

- [ ] **SEPARATOR_THEMES Configuration** - Review and refactor
      predefined separator themes
  - Demo currently uses manual separator configurations instead of
    SEPARATOR_THEMES
  - Current implementation: minimal=none,
    expressive=mix/git-status-changes, curvy=all-curvy,
    angular=all-angular, double_chevron=bonus-theme
  - Need to decide whether to keep SEPARATOR_THEMES or use a different
    approach
  - Consider removing SEPARATOR_THEMES entirely if manual
    configuration is preferred

### 📋 Planned Features

#### Session & Usage Tracking

- [ ] **Cache hit rate tracking** - Show cache efficiency with
      `cache_read_input_tokens` vs `cache_creation_input_tokens` ratio
      for performance insights (e.g., "85% cached" or cache hit icon)

- [ ] **Daily usage segment** ("today")
  - [ ] Daily token and cost aggregation
  - [ ] Daily budget monitoring
  - [ ] Configurable warning thresholds (50%, 80%+)
  - [ ] Visual indicators: "25%" normal, "+75%" moderate, "!85%"
        warning

#### Advanced Separator Features

- [ ] **New separator styles**
  - [ ] Current: thick, thin, flame, wave, lightning, curvy, angly,
        angly2, double_chevron
  - [ ] Add: "pulse" (alternating thickness)
  - [ ] Add: "gradient" (color transitions)
  - [ ] Add: "arrow" (custom arrow shapes)
  - [ ] Add: "diamond" (◆ diamond separators)

- [ ] **Context-aware separators**
  - [ ] Different styles based on segment content
  - [ ] Time-based variations (morning/evening themes)
  - [ ] Status-responsive separators (error states)

#### Configuration Enhancements

- [ ] **Advanced theming**
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
  - [ ] Live config reload
  - [ ] Multiple config profiles

- [ ] **Testing & Quality**
  - [ ] Unit tests for all segments
  - [ ] Visual regression testing
  - [ ] Performance benchmarks

## 🔧 Implementation Notes

### 🎨 Modular Theme System Architecture

- ✅ **Segment Registry**: Pluggable architecture with `BaseSegment`
  interface
- ✅ **Color Themes**: `DarkTheme` vs `ElectricTheme` with dramatic
  visual differences
- ✅ **Separator Styles**: Support for
  thin/thick/curvy/angly/flame/wave/lightning
- ✅ **Font Profiles**: powerline (basic) vs nerd-font (full icons)
- ✅ **TypeScript Demo**: `src/demo/demo.ts` with comprehensive
  testing and performance metrics
- ✅ **Configuration System**: JSON config support (environment
  variables removed)

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

- JSON config file support
- Sensible defaults with easy customization
- Multiple config file locations for flexibility

## 📚 References

- [Claude Code Statusline Docs](https://docs.anthropic.com/en/docs/claude-code/statusline)
- [claude-powerline Repository](https://github.com/Owloops/claude-powerline) -
  Session/cost tracking inspiration
- [ccusage](https://github.com/ryanschneider/ccusage) - Usage data
  retrieval
- [Nerd Fonts](https://www.nerdfonts.com/) - Powerline symbol
  reference
