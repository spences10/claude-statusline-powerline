import { SessionSegment } from '../../segments/session';
import { ClaudeStatusInput } from '../../types';
import { get_usage_db } from '../../utils/usage-db';

function run_session_performance_test(): boolean {
	console.log('⚡ Running Session Performance Comparison...\n');

	try {
		const session_segment = new SessionSegment();

		// Create test data
		const session_id = 'perf-test-session-' + Date.now();

		const config = {
			separators: {
				model: 'thick' as any,
				directory: 'thick' as any,
				git: {
					clean: 'thick' as any,
					dirty: 'thick' as any,
					ahead: 'thick' as any,
					behind: 'thick' as any,
					conflicts: 'thick' as any,
					staged: 'thick' as any,
					untracked: 'thick' as any,
				},
				session: 'thick' as any,
				context: 'thick' as any,
			},
			current_theme: {
				segments: {
					session: {
						background: '\x1b[48;2;124;58;237m',
						foreground: '\x1b[38;2;255;255;255m',
						separator_color: '\x1b[38;2;124;58;237m',
					},
				},
			},
		};

		// Test 1: Database query performance
		console.log('Test 1: Database query performance');

		// Create session in database first
		const db = get_usage_db();
		db.record_session({
			session_id: session_id,
			model: 'claude-3-5-sonnet-20241022',
			start_time: new Date().toISOString(),
			end_time: new Date(Date.now() + 60000).toISOString(),
			input_tokens: 7000,
			output_tokens: 3000,
			cache_tokens: 0,
			cost: 0.1,
			project_dir: '/test/project',
		});

		const db_data: ClaudeStatusInput = {
			session_id: session_id,
			model: { display_name: 'Sonnet 3.5' },
			workspace: { current_dir: '/test/project' },
		};

		const db_start = performance.now();
		const db_result = session_segment.build(db_data, config);
		const db_end = performance.now();
		const db_time = db_end - db_start;

		if (!db_result) {
			console.log('❌ FAIL: Database query should return result');
			return false;
		}

		console.log(`Database query time: ${db_time.toFixed(2)}ms`);

		// Test 2: Performance validation
		console.log('\nTest 2: Performance validation');

		if (db_time > 1.0) {
			console.log(
				'⚠️  WARNING: Expected sub-millisecond performance, got',
				db_time.toFixed(2) + 'ms',
			);
		}

		// Verify result format
		const db_tokens =
			db_result.content.match(/(\d+(?:\.\d+)?k?)/)?.[1];
		console.log(`Database result tokens: ${db_tokens}`);

		if (!db_tokens) {
			console.log('❌ FAIL: Should show token count in result');
			return false;
		}

		// Clean up
		db.close();

		console.log('✅ PASS: Performance comparison completed');
	} catch (error) {
		console.log('❌ FAIL: Performance test threw error:', error);
		return false;
	}

	console.log('\n✅ Session Performance test completed!\n');
	return true;
}

if (require.main === module) {
	const success = run_session_performance_test();
	process.exit(success ? 0 : 1);
}

export { run_session_performance_test };
