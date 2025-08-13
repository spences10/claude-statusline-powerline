---
'claude-statusline-powerline': patch
---

Refactor configuration handling and enhance font profile support

- Updated cli-config.ts to improve code organization and readability.
- Changed separator theme keys from camelCase to snake_case in
  config.ts.
- Enhanced statusline.ts to utilize font profiles from configuration.
- Modified demo.ts to support new configuration options and improved
  output.
- Updated font-profiles.ts to allow font profile retrieval from
  config.
- Adjusted directory and git segments to use the specified font
  profile.
- Improved separator styles to accommodate new font profile handling.
- Enhanced theme-test.ts to provide clearer instructions and examples.
- Updated types.ts to include font profile in the StatuslineConfig
  interface.
- Ensured consistent naming conventions across the codebase.
