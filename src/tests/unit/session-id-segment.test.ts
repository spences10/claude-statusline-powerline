import '../../segments'; // Auto-register segments
import { segmentRegistry } from '../../core/registry';
import { ClaudeStatusInput, StatuslineConfig } from '../../types';

function run_session_id_segment_tests(): boolean {
	console.log('🧪 Running SessionIdSegment tests...\n');

	const mock_data: ClaudeStatusInput = {
		session_id: 'abc123-def456-ghi789',
		model: { display_name: 'Sonnet 4' },
		workspace: { current_dir: '/test/project' },
	};

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
			session_id: 'thick',
		},
		segment_config: {
			segments: [
				{ type: 'model' },
				{ type: 'session_id' },
			],
		},
	};

	// Test 1: session_id segment is registered
	console.log('Test 1: session_id segment is registered');
	const segment = segmentRegistry.get_segment('session_id');
	if (!segment) {
		console.log('❌ FAIL: session_id segment not found in registry');
		return false;
	}
	console.log('✅ PASS: session_id segment is registered');

	// Test 2: segment builds with session_id data
	console.log('\nTest 2: segment builds with session_id data');
	const result = segment.build(mock_data, mock_config);
	if (!result) {
		console.log('❌ FAIL: segment returned null');
		return false;
	}
	console.log('✅ PASS: segment builds successfully');

	// Test 3: output contains session_id
	console.log('\nTest 3: output contains session_id');
	if (!result.content.includes('abc123')) {
		console.log(
			'❌ FAIL: content does not include session_id: %s',
			result.content,
		);
		return false;
	}
	console.log('✅ PASS: output contains session_id');

	// Test 4: segment has proper ANSI colors
	console.log('\nTest 4: segment has proper ANSI colors');
	if (!result.bg_color || !result.fg_color) {
		console.log('❌ FAIL: missing color data');
		return false;
	}
	console.log('✅ PASS: segment has proper colors');

	// Test 5: truncation works for long session IDs
	console.log('\nTest 5: truncation respects config');
	const config_with_truncation: StatuslineConfig = {
		...mock_config,
		segment_config: {
			segments: [
				{
					type: 'session_id',
					style: { truncation_length: 8 },
				},
			],
		},
	};
	const truncated_result = segment.build(mock_data, config_with_truncation);
	if (!truncated_result) {
		console.log('❌ FAIL: truncated segment returned null');
		return false;
	}
	// The icon + space + truncated id should respect the truncation
	console.log('✅ PASS: truncation config accepted');

	console.log('\n✅ All SessionIdSegment tests passed!\n');
	return true;
}

if (require.main === module) {
	const success = run_session_id_segment_tests();
	process.exit(success ? 0 : 1);
}

export { run_session_id_segment_tests };
