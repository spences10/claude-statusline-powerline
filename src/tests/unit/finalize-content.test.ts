import { BaseSegment, SegmentData } from '../../segments/base';
import {
	ClaudeStatusInput,
	SegmentStyleConfig,
	StatuslineConfig,
} from '../../types';

/**
 * Test segment that exposes finalize_content for testing
 */
class FinalizeTestSegment extends BaseSegment {
	name = 'model';

	build(
		_data: ClaudeStatusInput,
		_config: StatuslineConfig,
	): SegmentData | null {
		return null;
	}

	// Expose protected method for testing
	public test_finalize_content(
		content: string,
		config: StatuslineConfig,
		style_override?: SegmentStyleConfig,
	): string {
		return this.finalize_content(content, config, style_override);
	}
}

function make_config(
	style?: SegmentStyleConfig,
): StatuslineConfig {
	return {
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
			segments: [
				{
					type: 'model',
					style: style,
				},
			],
		},
	};
}

function run_finalize_content_tests(): boolean {
	console.log('🧪 Running finalize_content tests...\n');
	const segment = new FinalizeTestSegment();
	let all_passed = true;

	// Test 1: Truncation when content exceeds truncation_length
	console.log(
		'Test 1: Content truncated with ellipsis when exceeding truncation_length',
	);
	{
		const config = make_config({
			truncation_length: 9,
			minimum_width: 8,
		});
		const result = segment.test_finalize_content(
			'x 12345678',
			config,
		);
		// 10 chars -> truncate to 9: "x 1234..." (6 + 3 dots = 9)
		if (result !== 'x 1234...') {
			console.log(
				`❌ FAIL: Expected "x 1234...", got: "${result}"`,
			);
			all_passed = false;
		} else {
			console.log('✅ PASS');
		}
	}

	// Test 2: No truncation when content fits within truncation_length
	console.log(
		'\nTest 2: Content not truncated when within truncation_length',
	);
	{
		const config = make_config({
			truncation_length: 9,
			minimum_width: 8,
		});
		const result = segment.test_finalize_content(
			'x 123456',
			config,
		);
		// 8 chars, fits in 9 - but minimum_width is 8 so no padding needed
		if (result !== 'x 123456') {
			console.log(
				`❌ FAIL: Expected "x 123456", got: "${result}"`,
			);
			all_passed = false;
		} else {
			console.log('✅ PASS');
		}
	}

	// Test 3: Padding when content shorter than minimum_width
	console.log(
		'\nTest 3: Content padded to minimum_width when shorter',
	);
	{
		const config = make_config({
			truncation_length: 9,
			minimum_width: 8,
		});
		const result = segment.test_finalize_content('x 1234', config);
		// 6 chars, pad to 8: "x 1234  "
		if (result !== 'x 1234  ') {
			console.log(
				`❌ FAIL: Expected "x 1234  " (8 chars), got: "${result}" (${result.length} chars)`,
			);
			all_passed = false;
		} else {
			console.log('✅ PASS');
		}
	}

	// Test 4: Fixed-width when truncation_length equals minimum_width
	console.log(
		'\nTest 4: Fixed-width when truncation_length equals minimum_width',
	);
	{
		const config = make_config({
			truncation_length: 10,
			minimum_width: 10,
		});
		// Short content -> pad to 10
		const result_short = segment.test_finalize_content(
			'abc',
			config,
		);
		if (result_short.length !== 10) {
			console.log(
				`❌ FAIL: Expected length 10, got ${result_short.length}: "${result_short}"`,
			);
			all_passed = false;
		} else {
			console.log('✅ PASS (short content padded)');
		}
		// Long content -> truncate to 10
		const result_long = segment.test_finalize_content(
			'abcdefghijklmno',
			config,
		);
		if (result_long.length !== 10) {
			console.log(
				`❌ FAIL: Expected length 10, got ${result_long.length}: "${result_long}"`,
			);
			all_passed = false;
		} else {
			console.log('✅ PASS (long content truncated)');
		}
	}

	// Test 5: No style config - content unchanged
	console.log(
		'\nTest 5: No style config means content unchanged',
	);
	{
		const config = make_config(undefined);
		const result = segment.test_finalize_content(
			'hello world',
			config,
		);
		// Default truncation for model is 15, "hello world" is 11 - fits
		if (result !== 'hello world') {
			console.log(
				`❌ FAIL: Expected "hello world", got: "${result}"`,
			);
			all_passed = false;
		} else {
			console.log('✅ PASS');
		}
	}

	// Test 6: Only minimum_width set (no truncation_length override)
	console.log(
		'\nTest 6: Only minimum_width set, short content padded',
	);
	{
		const config = make_config({ minimum_width: 20 });
		const result = segment.test_finalize_content('short', config);
		if (result.length !== 20) {
			console.log(
				`❌ FAIL: Expected length 20, got ${result.length}: "${result}"`,
			);
			all_passed = false;
		} else {
			console.log('✅ PASS');
		}
	}

	if (all_passed) {
		console.log('\n✅ All finalize_content tests passed!\n');
	} else {
		console.log('\n❌ Some finalize_content tests failed!\n');
	}
	return all_passed;
}

if (require.main === module) {
	const success = run_finalize_content_tests();
	process.exit(success ? 0 : 1);
}

export { run_finalize_content_tests };
