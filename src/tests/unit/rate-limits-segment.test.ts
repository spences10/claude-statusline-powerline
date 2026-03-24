import '../../segments'; // Auto-register segments
import { segmentRegistry } from '../../core/registry';
import { ClaudeStatusInput, StatuslineConfig } from '../../types';

function run_rate_limits_segment_tests(): boolean {
	console.log('🧪 Running RateLimitsSegment tests...\n');

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
			rate_limits: 'thick',
		},
		segment_config: {
			segments: [{ type: 'rate_limits' }],
		},
	};

	// Test 1: rate_limits segment is registered
	console.log('Test 1: rate_limits segment is registered');
	const segment = segmentRegistry.get_segment('rate_limits');
	if (!segment) {
		console.log('❌ FAIL: rate_limits segment not found in registry');
		return false;
	}
	console.log('✅ PASS: rate_limits segment is registered');

	// Test 2: segment builds with both rate limits present
	console.log('\nTest 2: segment builds with both rate limits');
	const mock_data_both: ClaudeStatusInput = {
		session_id: 'test-session',
		model: { display_name: 'Sonnet 4' },
		workspace: { current_dir: '/test' },
		rate_limits: {
			five_hour: { used_percentage: 23.5, resets_at: 1738425600 },
			seven_day: { used_percentage: 41.2, resets_at: 1738857600 },
		},
	};
	const result_both = segment.build(mock_data_both, mock_config);
	if (!result_both) {
		console.log('❌ FAIL: segment returned null with both limits');
		return false;
	}
	if (!result_both.content.includes('5h') || !result_both.content.includes('7d')) {
		console.log(
			'❌ FAIL: expected both 5h and 7d in content: %s',
			result_both.content,
		);
		return false;
	}
	console.log('✅ PASS: segment builds with both rate limits');

	// Test 3: segment builds with only five_hour
	console.log('\nTest 3: segment builds with only five_hour');
	const mock_data_5h: ClaudeStatusInput = {
		session_id: 'test-session',
		model: { display_name: 'Sonnet 4' },
		workspace: { current_dir: '/test' },
		rate_limits: {
			five_hour: { used_percentage: 80, resets_at: 1738425600 },
		},
	};
	const result_5h = segment.build(mock_data_5h, mock_config);
	if (!result_5h) {
		console.log('❌ FAIL: segment returned null with only five_hour');
		return false;
	}
	if (!result_5h.content.includes('5h')) {
		console.log(
			'❌ FAIL: expected 5h in content: %s',
			result_5h.content,
		);
		return false;
	}
	console.log('✅ PASS: segment builds with only five_hour');

	// Test 4: segment returns null when no rate_limits
	console.log('\nTest 4: segment returns null when no rate_limits');
	const mock_data_none: ClaudeStatusInput = {
		session_id: 'test-session',
		model: { display_name: 'Sonnet 4' },
		workspace: { current_dir: '/test' },
	};
	const result_none = segment.build(mock_data_none, mock_config);
	if (result_none !== null) {
		console.log('❌ FAIL: expected null when no rate_limits');
		return false;
	}
	console.log('✅ PASS: segment returns null when no rate_limits');

	// Test 5: percentages are rounded to integers
	console.log('\nTest 5: percentages are rounded to integers');
	if (!result_both.content.includes('24%') || !result_both.content.includes('41%')) {
		console.log(
			'❌ FAIL: expected rounded percentages (24%%, 41%%): %s',
			result_both.content,
		);
		return false;
	}
	console.log('✅ PASS: percentages are rounded');

	console.log('\n✅ All RateLimitsSegment tests passed!\n');
	return true;
}

if (require.main === module) {
	const success = run_rate_limits_segment_tests();
	process.exit(success ? 0 : 1);
}

export { run_rate_limits_segment_tests };
