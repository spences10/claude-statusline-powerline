import { execSync } from 'node:child_process';
import { THEMES } from '../../themes';

export function list_themes(): void {
	console.log('🎨 Available Color Themes\n');

	Object.entries(THEMES).forEach(([name, theme]) => {
		console.log(`${name}:`);
		console.log(
			`  Segments: ${Object.keys(theme.segments).join(', ')}`,
		);
		console.log();
	});
}

export function preview_theme(theme_name: string): void {
	if (!THEMES[theme_name]) {
		console.error(
			`❌ Theme "${theme_name}" not found. Available themes:`,
		);
		Object.keys(THEMES).forEach((name) => console.log(`  - ${name}`));
		process.exit(1);
	}

	console.log(`🎨 Previewing theme: ${theme_name}\n`);

	try {
		// Run demo with specific theme
		execSync(`STATUSLINE_COLOR_THEME=${theme_name} npm run demo`, {
			stdio: 'inherit',
			env: { ...process.env, STATUSLINE_COLOR_THEME: theme_name },
		});
	} catch (error) {
		console.error(
			`❌ Preview failed for theme ${theme_name}:`,
			error,
		);
		process.exit(1);
	}
}

export function list_separators(): void {
	console.log('🎭 Available Separator Styles\n');

	// Import separator styles
	const { SEPARATOR_STYLES } = require('../../separators/styles');

	Object.entries(SEPARATOR_STYLES).forEach(
		([name, style]: [string, any]) => {
			console.log(`${name}:`);
			console.log(`  Left: ${style.left}`);
			console.log(`  Right: ${style.right}`);
			console.log();
		},
	);
}
