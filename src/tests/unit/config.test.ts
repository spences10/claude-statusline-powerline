import { load_config, SEPARATOR_THEMES } from '../../config';
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

	if (!config.color_theme || !config.theme || !config.font_profile) {
		console.log('❌ FAIL: Config missing required properties');
		return false;
	}
	console.log('✅ PASS: Default config loads correctly');

	// Test 2: Separator themes exist
	console.log('\nTest 2: Separator themes');
	const theme_names = Object.keys(SEPARATOR_THEMES);
	if (theme_names.length === 0) {
		console.log('❌ FAIL: No separator themes found');
		return false;
	}

	const required_themes = ['minimal', 'expressive'];
	for (const theme of required_themes) {
		if (!SEPARATOR_THEMES[theme]) {
			console.log(`❌ FAIL: Missing required theme: ${theme}`);
			return false;
		}
	}
	console.log('✅ PASS: Separator themes exist');

	// Test 3: Color themes exist
	console.log('\nTest 3: Color themes');
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

	// Test 4: Theme structure validation
	console.log('\nTest 4: Theme structure validation');
	for (const [theme_name, theme] of Object.entries(
		SEPARATOR_THEMES,
	)) {
		if (!theme.model || !theme.directory || !theme.git) {
			console.log(
				`❌ FAIL: Theme ${theme_name} missing required segments`,
			);
			return false;
		}

		if (!theme.directory) {
			console.log(
				`❌ FAIL: Theme ${theme_name} missing directory separator`,
			);
			return false;
		}

		if (!theme.git.clean || !theme.git.dirty) {
			console.log(`❌ FAIL: Theme ${theme_name} missing git states`);
			return false;
		}
	}
	console.log('✅ PASS: Theme structures valid');

	console.log('\n✅ All Config tests passed!\n');
	return true;
}

if (require.main === module) {
	const success = run_config_tests();
	process.exit(success ? 0 : 1);
}

export { run_config_tests };
