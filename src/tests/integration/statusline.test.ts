import { build_statusline } from '../../core/statusline';
import { ClaudeStatusInput } from '../../types';
// Import to trigger segment registration
import '../../segments';

function run_statusline_integration_tests() {
	console.log('🧪 Running Statusline Integration tests...\n');

	const mock_data: ClaudeStatusInput = {
		session_id: 'test-session-123',
		model: { display_name: 'Sonnet 4' },
		workspace: { current_dir: process.cwd() },
	};

	// Test 1: Basic statusline generation
	console.log('Test 1: Basic statusline generation');
	const result = build_statusline(mock_data);
	if (!result || typeof result !== 'string') {
		console.log('❌ FAIL: Should return a string');
		return false;
	}

	if (result.length === 0) {
		console.log('❌ FAIL: Result should not be empty');
		return false;
	}
	console.log('✅ PASS: Statusline generates output');

	// Test 2: Contains ANSI escape codes
	console.log('\nTest 2: Contains ANSI escape codes');
	if (!result.includes('\x1b[')) {
		console.log('❌ FAIL: Result should contain ANSI escape codes');
		return false;
	}
	console.log('✅ PASS: Contains ANSI color codes');

	// Test 3: Model name appears in output
	console.log('\nTest 3: Model name in output');
	// Remove ANSI codes for content checking
	const clean_result = result.replace(/\x1b\[[0-9;]*m/g, '');
	if (!clean_result.includes('Sonnet 4')) {
		console.log('❌ FAIL: Model name should appear in output');
		console.log('Clean result:', clean_result);
		return false;
	}
	console.log('✅ PASS: Model name appears in output');

	// Test 4: Different input produces different output
	console.log('\nTest 4: Different inputs');
	const different_data: ClaudeStatusInput = {
		session_id: 'different-session',
		model: { display_name: 'Different Model' },
		workspace: { current_dir: '/different/path' },
	};

	const different_result = build_statusline(different_data);
	if (result === different_result) {
		console.log(
			'❌ FAIL: Different inputs should produce different outputs',
		);
		return false;
	}
	console.log('✅ PASS: Different inputs produce different outputs');

	// Test 5: Handles missing optional data
	console.log('\nTest 5: Handles missing data gracefully');
	const minimal_data: ClaudeStatusInput = {
		session_id: '',
		model: { display_name: '' },
		workspace: { current_dir: '' },
	};

	try {
		const minimal_result = build_statusline(minimal_data);
		if (typeof minimal_result !== 'string') {
			console.log(
				'❌ FAIL: Should still return string with minimal data',
			);
			return false;
		}
		console.log('✅ PASS: Handles minimal data gracefully');
	} catch (error) {
		console.log(
			'❌ FAIL: Should not throw with minimal data:',
			error,
		);
		return false;
	}

	console.log('\n✅ All Statusline Integration tests passed!\n');
	return true;
}

if (require.main === module) {
	const success = run_statusline_integration_tests();
	process.exit(success ? 0 : 1);
}

export { run_statusline_integration_tests };
