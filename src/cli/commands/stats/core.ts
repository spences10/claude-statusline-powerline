import { UsageDatabase } from '../../../utils/usage-db';

export function show_stats(): void {
	console.log('📊 Usage Statistics\n');

	try {
		const db = new UsageDatabase();
		const stats = db.get_usage_summary();

		// Today
		console.log('📅 Today:');
		console.log(`  Sessions: ${stats.today.total_sessions}`);
		console.log(
			`  Tokens: ${stats.today.total_input_tokens + stats.today.total_output_tokens} (${stats.today.total_cache_tokens} cached)`,
		);
		console.log(`  Cost: $${stats.today.total_cost.toFixed(2)}`);
		console.log();

		// 7 days
		console.log('📅 Last 7 days:');
		console.log(`  Sessions: ${stats.week.total_sessions}`);
		console.log(
			`  Tokens: ${stats.week.total_input_tokens + stats.week.total_output_tokens} (${stats.week.total_cache_tokens} cached)`,
		);
		console.log(`  Cost: $${stats.week.total_cost.toFixed(2)}`);
		console.log();

		// 30 days
		console.log('📅 Last 30 days:');
		console.log(`  Sessions: ${stats.month.total_sessions}`);
		console.log(
			`  Tokens: ${stats.month.total_input_tokens + stats.month.total_output_tokens} (${stats.month.total_cache_tokens} cached)`,
		);
		console.log(`  Cost: $${stats.month.total_cost.toFixed(2)}`);
	} catch (error) {
		console.error('❌ Failed to retrieve stats:', error);
		process.exit(1);
	}
}

export function show_daily_stats(): void {
	console.log('📊 Daily Usage Breakdown\n');

	try {
		const db = new UsageDatabase();
		const stats = db.get_usage_summary();

		console.log('📅 Recent summary:');
		console.log(
			`  Today: ${stats.today.total_sessions} sessions, $${stats.today.total_cost.toFixed(2)}`,
		);
		console.log(
			`  Week: ${stats.week.total_sessions} sessions, $${stats.week.total_cost.toFixed(2)}`,
		);
		console.log(
			`  Month: ${stats.month.total_sessions} sessions, $${stats.month.total_cost.toFixed(2)}`,
		);
	} catch (error) {
		console.error('❌ Failed to retrieve daily stats:', error);
		process.exit(1);
	}
}
