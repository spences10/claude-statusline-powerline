import { BaseSegment, SegmentData } from '../../segments/base';
import { ClaudeStatusInput, StatuslineConfig } from '../../types';

class TestSegment extends BaseSegment {
	name = 'test';
	priority = 10;

	is_enabled(config: StatuslineConfig): boolean {
		return true;
	}

	build(data: ClaudeStatusInput, config: StatuslineConfig): SegmentData | null {
		return this.createSegment(
			'test content',
			'#ff0000',
			'#ffffff',
			'#ff0000',
			'thick'
		);
	}
}

function run_base_segment_tests() {
	console.log('🧪 Running BaseSegment tests...\n');
	
	const segment = new TestSegment();
	const mock_data: ClaudeStatusInput = {
		session_id: 'test-session',
		model: { display_name: 'Claude Sonnet 4' },
		workspace: { current_dir: '/test' }
	};
	const mock_config: StatuslineConfig = {
		color_theme: 'dark',
		theme: 'minimal',
		font_profile: 'powerline',
		separators: {
			model: 'thick',
			directory: { clean: 'thick', dirty: 'thick', no_git: 'thick' },
			git: { clean: 'thick', dirty: 'thick' }
		},
		segments: {
			model: true,
			directory: true,
			git: true,
			session: true
		}
	};

	// Test 1: Basic segment creation
	console.log('Test 1: Basic segment creation');
	const result = segment.build(mock_data, mock_config);
	if (!result) {
		console.log('❌ FAIL: Segment should return data');
		return false;
	}
	
	if (result.content !== 'test content') {
		console.log('❌ FAIL: Expected "test content", got:', result.content);
		return false;
	}
	console.log('✅ PASS: Basic segment creation works');

	// Test 2: Hex color conversion
	console.log('\nTest 2: Hex color conversion');
	if (!result.bg_color.startsWith('\x1b[48;5;')) {
		console.log('❌ FAIL: Background color should be converted to ANSI');
		return false;
	}
	
	if (!result.fg_color.startsWith('\x1b[38;5;')) {
		console.log('❌ FAIL: Foreground color should be converted to ANSI');
		return false;
	}
	console.log('✅ PASS: Hex colors converted to ANSI');

	// Test 3: Segment properties
	console.log('\nTest 3: Segment properties');
	if (segment.name !== 'test') {
		console.log('❌ FAIL: Expected name "test", got:', segment.name);
		return false;
	}
	
	if (segment.priority !== 10) {
		console.log('❌ FAIL: Expected priority 10, got:', segment.priority);
		return false;
	}
	console.log('✅ PASS: Segment properties correct');

	console.log('\n✅ All BaseSegment tests passed!\n');
	return true;
}

if (require.main === module) {
	const success = run_base_segment_tests();
	process.exit(success ? 0 : 1);
}

export { run_base_segment_tests };