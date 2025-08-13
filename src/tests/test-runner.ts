import { run_statusline_integration_tests } from './integration/statusline.test';
import { run_base_segment_tests } from './unit/base-segment.test';
import { run_config_tests } from './unit/config.test';
import { run_registry_tests } from './unit/registry.test';

async function run_all_tests() {
	console.log('🚀 Running All Tests\n');
	console.log('='.repeat(50));

	const tests = [
		{ name: 'Base Segment', fn: run_base_segment_tests },
		{ name: 'Config', fn: run_config_tests },
		{ name: 'Registry', fn: run_registry_tests },
		{
			name: 'Statusline Integration',
			fn: run_statusline_integration_tests,
		},
	];

	let passed = 0;
	let failed = 0;

	for (const test of tests) {
		console.log(`\n📋 ${test.name} Tests`);
		console.log('-'.repeat(30));

		try {
			const success = test.fn();
			if (success) {
				passed++;
			} else {
				failed++;
			}
		} catch (error) {
			console.log(`❌ Test suite ${test.name} threw error:`, error);
			failed++;
		}
	}

	console.log('\n' + '='.repeat(50));
	console.log(`📊 Test Summary:`);
	console.log(`   ✅ Passed: ${passed}`);
	console.log(`   ❌ Failed: ${failed}`);
	console.log(`   📈 Total:  ${passed + failed}`);

	if (failed === 0) {
		console.log('\n🎉 All tests passed!');
		return true;
	} else {
		console.log(`\n💥 ${failed} test suite(s) failed`);
		return false;
	}
}

if (require.main === module) {
	run_all_tests().then((success) => {
		process.exit(success ? 0 : 1);
	});
}

export { run_all_tests };
