import { execSync } from 'node:child_process';
import { load_config } from '../../config';

export function run_demo(): void {
	console.log('🎭 Running statusline demo...\n');

	try {
		// Run the demo script that's currently in package.json
		execSync('npm run demo', { stdio: 'inherit' });
	} catch (error) {
		console.error('❌ Demo failed:', error);
		process.exit(1);
	}
}

export function demo_theme(theme_name: string): void {
	console.log(`🎨 Demoing theme: ${theme_name}\n`);

	try {
		// Set theme environment variable and run demo
		execSync(`STATUSLINE_COLOR_THEME=${theme_name} npm run demo`, {
			stdio: 'inherit',
			env: { ...process.env, STATUSLINE_COLOR_THEME: theme_name },
		});
	} catch (error) {
		console.error(`❌ Demo failed for theme ${theme_name}:`, error);
		process.exit(1);
	}
}

export function test_segments(): void {
	console.log('🧪 Testing all segments with current config...\n');

	try {
		const config = load_config();
		console.log('Current config:', JSON.stringify(config, null, 2));

		// Run demo to test current configuration
		execSync('npm run demo', { stdio: 'inherit' });
	} catch (error) {
		console.error('❌ Segment test failed:', error);
		process.exit(1);
	}
}
