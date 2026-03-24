import { BaseSegment, SegmentData } from '../../segments/base';
import { ClaudeStatusInput, StatuslineConfig } from '../../types';

class MinWidthTestSegment extends BaseSegment {
	name = 'test';

	build(
		data: ClaudeStatusInput,
		config: StatuslineConfig,
	): SegmentData | null {
		const { style_override } = this.setup_segment(config);
		const content = this.apply_minimum_width('Hi', style_override);
		return this.createSegment(
			content,
			'#ff0000',
			'#ffffff',
			'#ff0000',
			'thick',
			style_override,
		);
	}
}

function run_minimum_width_tests(): boolean {
	console.log('🧪 Running minimum_width tests...\n');

	const segment = new MinWidthTestSegment();
	const mock_data: ClaudeStatusInput = {
		session_id: 'test-session',
		model: { display_name: 'Sonnet 4' },
		workspace: { current_dir: '/test' },
	};

	// Test 1: Content is padded when shorter than minimum_width
	console.log('Test 1: Content padded to minimum_width');
	const config_with_min_width: StatuslineConfig = {
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
					style: { minimum_width: 10 },
				},
			],
		},
	};

	// Override the segment config lookup to use 'test' type matching 'model'
	// We need to register the segment type as 'model' for config lookup
	// Instead, build a config where type matches our segment name
	const config_for_test: StatuslineConfig = {
		...config_with_min_width,
		segment_config: {
			segments: [
				{
					type: 'model', // unused
				},
				{
					// @ts-ignore - test type for our test segment
					type: 'test',
					style: { minimum_width: 10 },
				},
			],
		},
	};

	const result = segment.build(mock_data, config_for_test);
	if (!result) {
		console.log('❌ FAIL: Segment should return data');
		return false;
	}

	// "Hi" is 2 chars, minimum_width is 10, so content should be 10 chars
	if (result.content.length !== 10) {
		console.log(
			`❌ FAIL: Expected content length 10, got ${result.content.length}: "${result.content}"`,
		);
		return false;
	}

	// Content should start with "Hi" and be padded with spaces
	if (!result.content.startsWith('Hi')) {
		console.log(
			`❌ FAIL: Expected content to start with "Hi", got: "${result.content}"`,
		);
		return false;
	}
	console.log('✅ PASS: Content padded to minimum_width');

	// Test 2: Content unchanged when longer than minimum_width
	console.log('\nTest 2: Content unchanged when longer than minimum_width');
	const config_small_min: StatuslineConfig = {
		...config_with_min_width,
		segment_config: {
			segments: [
				{
					// @ts-ignore
					type: 'test',
					style: { minimum_width: 1 },
				},
			],
		},
	};

	// Need a segment that produces longer content
	const result2 = segment.build(mock_data, config_small_min);
	if (!result2) {
		console.log('❌ FAIL: Segment should return data');
		return false;
	}
	if (result2.content !== 'Hi') {
		console.log(
			`❌ FAIL: Expected "Hi" unchanged, got: "${result2.content}"`,
		);
		return false;
	}
	console.log('✅ PASS: Content unchanged when longer than minimum_width');

	// Test 3: No minimum_width config means no padding
	console.log('\nTest 3: No minimum_width means no padding');
	const config_no_min: StatuslineConfig = {
		...config_with_min_width,
		segment_config: {
			segments: [
				{
					// @ts-ignore
					type: 'test',
					style: {},
				},
			],
		},
	};

	const result3 = segment.build(mock_data, config_no_min);
	if (!result3) {
		console.log('❌ FAIL: Segment should return data');
		return false;
	}
	if (result3.content !== 'Hi') {
		console.log(
			`❌ FAIL: Expected "Hi" unchanged, got: "${result3.content}"`,
		);
		return false;
	}
	console.log('✅ PASS: No minimum_width means no padding');

	console.log('\n✅ All minimum_width tests passed!\n');
	return true;
}

if (require.main === module) {
	const success = run_minimum_width_tests();
	process.exit(success ? 0 : 1);
}

export { run_minimum_width_tests };
