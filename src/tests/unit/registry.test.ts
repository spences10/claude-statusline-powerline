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
		if (!segment.name) {
			console.log('❌ FAIL: Segment missing name');
			return false;
		}

		if (typeof segment.build !== 'function') {
			console.log('❌ FAIL: Segment missing required methods');
			return false;
		}
	}
	console.log('✅ PASS: All segments have required properties');

	// Test 4: Segment configuration handling
	console.log('\nTest 4: Segment configuration handling');
	const mock_config: StatuslineConfig = {
		color_theme: 'dark',
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
			context: 'thick',
		},
		segment_config: {
			segments: [{ type: 'model' }, { type: 'git' }],
		},
	};

	const configured_segments =
		segmentRegistry.get_enabled_segments(mock_config);
	const configured_names = configured_segments.map((s) =>
		s.name.toLowerCase(),
	);

	// Should return only configured segments
	if (configured_names.length !== 2) {
		console.log('❌ FAIL: Should return only configured segments');
		return false;
	}

	if (
		!configured_names.includes('model') ||
		!configured_names.includes('git')
	) {
		console.log('❌ FAIL: Configured segments should be included');
		return false;
	}
	console.log('✅ PASS: Segment configuration works correctly');

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
