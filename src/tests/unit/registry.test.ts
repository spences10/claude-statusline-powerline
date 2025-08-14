import { segmentRegistry } from '../../core/registry';
import { StatuslineConfig } from '../../types';
// Import to trigger segment registration
import '../../segments';

function run_registry_tests() {
	console.log('🧪 Running Registry tests...\n');

	// Test 1: Registry has segments
	console.log('Test 1: Registry has segments');
	const all_segments = segmentRegistry.get_all_segments();
	if (all_segments.length === 0) {
		console.log('❌ FAIL: No segments registered');
		return false;
	}
	console.log(`✅ PASS: ${all_segments.length} segments registered`);

	// Test 2: Segments have required properties
	console.log('\nTest 2: Segment properties');
	for (const segment of all_segments) {
		if (!segment.name || typeof segment.priority !== 'number') {
			console.log('❌ FAIL: Segment missing name or priority');
			return false;
		}

		if (
			typeof segment.is_enabled !== 'function' ||
			typeof segment.build !== 'function'
		) {
			console.log('❌ FAIL: Segment missing required methods');
			return false;
		}
	}
	console.log('✅ PASS: All segments have required properties');

	// Test 3: Priority ordering
	console.log('\nTest 3: Priority ordering');
	for (let i = 0; i < all_segments.length - 1; i++) {
		if (all_segments[i].priority > all_segments[i + 1].priority) {
			console.log('❌ FAIL: Segments not ordered by priority');
			return false;
		}
	}
	console.log('✅ PASS: Segments ordered by priority');

	// Test 4: Enabled segments filtering
	console.log('\nTest 4: Enabled segments filtering');
	const mock_config: StatuslineConfig = {
		color_theme: 'dark',
		theme: 'minimal',
		font_profile: 'powerline',
		separators: {
			model: 'thick',
			directory: 'thick',
			git: {
				clean: 'thick',
				dirty: 'thick',
				ahead: 'thick',
				behind: 'thick',
				conflicts: 'thick',
				staged: 'thick',
				untracked: 'thick',
			},
			session: 'thick',
		},
		segments: {
			model: true,
			directory: false,
			git: true,
			session: false,
		},
	};

	const enabled_segments =
		segmentRegistry.get_enabled_segments(mock_config);
	const enabled_names = enabled_segments.map((s) =>
		s.name.toLowerCase(),
	);

	if (
		enabled_names.includes('directory') ||
		enabled_names.includes('session')
	) {
		console.log('❌ FAIL: Disabled segments should not be enabled');
		return false;
	}

	if (
		!enabled_names.includes('model') ||
		!enabled_names.includes('git')
	) {
		console.log('❌ FAIL: Enabled segments should be included');
		return false;
	}
	console.log('✅ PASS: Segment filtering works correctly');

	// Test 5: Expected segments exist
	console.log('\nTest 5: Expected segments exist');
	const expected_segments = ['model', 'directory', 'git', 'session'];
	const registered_names = all_segments.map((s) =>
		s.name.toLowerCase(),
	);

	for (const expected of expected_segments) {
		if (!registered_names.includes(expected)) {
			console.log(`❌ FAIL: Expected segment not found: ${expected}`);
			return false;
		}
	}
	console.log('✅ PASS: All expected segments registered');

	console.log('\n✅ All Registry tests passed!\n');
	return true;
}

if (require.main === module) {
	const success = run_registry_tests();
	process.exit(success ? 0 : 1);
}

export { run_registry_tests };
