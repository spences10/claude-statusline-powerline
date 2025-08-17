import { load_config } from '../../config';
import { THEMES } from '../../themes';

function run_config_tests() {
	console.log('🧪 Running Config tests...\n');

	// Test 1: Default config loading
	console.log('Test 1: Default config loading');
	const config = load_config();
	if (!config) {
		console.log('❌ FAIL: Config should load');
		return false;
	}

	if (!config.color_theme || !config.font_profile) {
		console.log('❌ FAIL: Config missing required properties');
		return false;
	}
	console.log('✅ PASS: Default config loads correctly');

	// Test 2: Color themes exist
	console.log('\nTest 2: Color themes');
	const color_theme_names = Object.keys(THEMES);
	if (color_theme_names.length === 0) {
		console.log('❌ FAIL: No color themes found');
		return false;
	}

	const required_color_themes = ['dark', 'electric'];
	for (const theme of required_color_themes) {
		if (!THEMES[theme]) {
			console.log(`❌ FAIL: Missing required color theme: ${theme}`);
			return false;
		}
	}
	console.log('✅ PASS: Color themes exist');

	// Test 3: Separator config validation
	console.log('\nTest 3: Separator config validation');
	if (!config.separators) {
		console.log('❌ FAIL: Config missing separators');
		return false;
	}

	if (!config.separators.model || !config.separators.directory || !config.separators.git) {
		console.log('❌ FAIL: Separators missing required segments');
		return false;
	}

	if (!config.separators.git.clean || !config.separators.git.dirty) {
		console.log('❌ FAIL: Git separators missing states');
		return false;
	}
	console.log('✅ PASS: Separator config valid');

	console.log('\n✅ All Config tests passed!\n');
	return true;
}

if (require.main === module) {
	const success = run_config_tests();
	process.exit(success ? 0 : 1);
}

export { run_config_tests };
