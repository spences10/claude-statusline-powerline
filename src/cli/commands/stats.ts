import { UsageDatabase } from '../../utils/usage-db';

// Utility functions
function extract_project_name(project_dir: string | null | undefined): string {
	return project_dir?.split('/').pop() || 'unknown';
}

function calculate_cache_ratio(cache_tokens: number, total_tokens: number): number {
	return total_tokens > 0 ? (cache_tokens / (total_tokens + cache_tokens)) * 100 : 0;
}

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

export function show_project_stats(): void {
	console.log('📊 Project Usage Breakdown\n');

	try {
		const db = new UsageDatabase();
		const stats = db.get_usage_summary();

		// Group sessions by project
		const project_stats = new Map<
			string,
			{ sessions: number; cost: number; tokens: number }
		>();

		stats.recent_sessions.forEach((session) => {
			const project = extract_project_name(session.project_dir);
			const existing = project_stats.get(project) || {
				sessions: 0,
				cost: 0,
				tokens: 0,
			};

			project_stats.set(project, {
				sessions: existing.sessions + 1,
				cost: existing.cost + session.cost,
				tokens:
					existing.tokens +
					session.input_tokens +
					session.output_tokens,
			});
		});

		// Sort by cost
		const sorted_projects = Array.from(project_stats.entries()).sort(
			([, a], [, b]) => b.cost - a.cost,
		);

		sorted_projects.forEach(([project, stats]) => {
			console.log(`📁 ${project}:`);
			console.log(`  Sessions: ${stats.sessions}`);
			console.log(`  Tokens: ${stats.tokens}`);
			console.log(`  Cost: $${stats.cost.toFixed(2)}`);
			console.log();
		});
	} catch (error) {
		console.error('❌ Failed to retrieve project stats:', error);
		process.exit(1);
	}
}

export function export_data(format: string): void {
	console.log(`📤 Exporting usage data as ${format}...\n`);

	try {
		const db = new UsageDatabase();
		const stats = db.get_usage_summary();

		if (format.toLowerCase() === 'json') {
			console.log(JSON.stringify(stats, null, 2));
		} else if (format.toLowerCase() === 'csv') {
			// Simple CSV export of sessions
			console.log(
				'session_id,model,start_time,end_time,input_tokens,output_tokens,cache_tokens,cost,project',
			);
			stats.recent_sessions.forEach((session) => {
				const project = extract_project_name(session.project_dir);
				console.log(
					`${session.session_id},${session.model},${session.start_time},${session.end_time},${session.input_tokens},${session.output_tokens},${session.cache_tokens},${session.cost},${project}`,
				);
			});
		} else {
			console.error('❌ Unsupported format. Use "json" or "csv"');
			process.exit(1);
		}
	} catch (error) {
		console.error('❌ Failed to export data:', error);
		process.exit(1);
	}
}

export function show_cache_stats(): void {
	console.log('📊 Cache Efficiency Analysis\n');

	try {
		const db = new UsageDatabase();
		const stats = db.get_usage_summary();

		// Calculate cache efficiency - cache tokens as ratio of total tokens processed
		const today_total_tokens =
			stats.today.total_input_tokens +
			stats.today.total_output_tokens;
		const today_cache_ratio = calculate_cache_ratio(stats.today.total_cache_tokens, today_total_tokens);

		const week_total_tokens =
			stats.week.total_input_tokens + stats.week.total_output_tokens;
		const week_cache_ratio = calculate_cache_ratio(stats.week.total_cache_tokens, week_total_tokens);

		const month_total_tokens =
			stats.month.total_input_tokens +
			stats.month.total_output_tokens;
		const month_cache_ratio = calculate_cache_ratio(stats.month.total_cache_tokens, month_total_tokens);

		console.log('💾 Cache Utilization:');
		console.log(
			`  Today: ${today_cache_ratio.toFixed(1)}% of total processing (${stats.today.total_cache_tokens.toLocaleString()} cached tokens)`,
		);
		console.log(
			`  Week: ${week_cache_ratio.toFixed(1)}% of total processing (${stats.week.total_cache_tokens.toLocaleString()} cached tokens)`,
		);
		console.log(
			`  Month: ${month_cache_ratio.toFixed(1)}% of total processing (${stats.month.total_cache_tokens.toLocaleString()} cached tokens)`,
		);
		console.log();

		console.log('📈 Token Breakdown:');
		console.log(
			`  Today: ${today_total_tokens.toLocaleString()} new + ${stats.today.total_cache_tokens.toLocaleString()} cached = ${(today_total_tokens + stats.today.total_cache_tokens).toLocaleString()} total`,
		);
		console.log(
			`  Week: ${week_total_tokens.toLocaleString()} new + ${stats.week.total_cache_tokens.toLocaleString()} cached = ${(week_total_tokens + stats.week.total_cache_tokens).toLocaleString()} total`,
		);
		console.log(
			`  Month: ${month_total_tokens.toLocaleString()} new + ${stats.month.total_cache_tokens.toLocaleString()} cached = ${(month_total_tokens + stats.month.total_cache_tokens).toLocaleString()} total`,
		);
		console.log();

		// Show cache efficiency by project
		const project_cache_stats = new Map<
			string,
			{ cache_tokens: number; total_tokens: number }
		>();

		stats.recent_sessions.forEach((session) => {
			const project = extract_project_name(session.project_dir);
			const existing = project_cache_stats.get(project) || {
				cache_tokens: 0,
				total_tokens: 0,
			};

			project_cache_stats.set(project, {
				cache_tokens: existing.cache_tokens + session.cache_tokens,
				total_tokens:
					existing.total_tokens +
					session.input_tokens +
					session.output_tokens,
			});
		});

		console.log('📁 Cache Utilization by Project:');
		const sorted_projects = Array.from(project_cache_stats.entries())
			.filter(
				([, stats]) =>
					stats.cache_tokens > 0 || stats.total_tokens > 0,
			)
			.sort(([, a], [, b]) => b.cache_tokens - a.cache_tokens);

		sorted_projects.forEach(([project, cache_stats]) => {
			const cache_ratio = calculate_cache_ratio(cache_stats.cache_tokens, cache_stats.total_tokens);
			console.log(
				`  ${project}: ${cache_ratio.toFixed(1)}% (${cache_stats.cache_tokens.toLocaleString()} cached, ${cache_stats.total_tokens.toLocaleString()} new)`,
			);
		});
	} catch (error) {
		console.error('❌ Failed to retrieve cache stats:', error);
		process.exit(1);
	}
}
