import { UsageDatabase } from '../../../utils/usage-db';

// Utility function for extracting project names
function extract_project_name(
	project_dir: string | null | undefined,
): string {
	return project_dir?.split('/').pop() || 'unknown';
}

// Utility function for calculating cache ratio
function calculate_cache_ratio(
	cache_tokens: number,
	total_tokens: number,
): number {
	return total_tokens > 0
		? (cache_tokens / (total_tokens + cache_tokens)) * 100
		: 0;
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
		const today_cache_ratio = calculate_cache_ratio(
			stats.today.total_cache_tokens,
			today_total_tokens,
		);

		const week_total_tokens =
			stats.week.total_input_tokens + stats.week.total_output_tokens;
		const week_cache_ratio = calculate_cache_ratio(
			stats.week.total_cache_tokens,
			week_total_tokens,
		);

		const month_total_tokens =
			stats.month.total_input_tokens +
			stats.month.total_output_tokens;
		const month_cache_ratio = calculate_cache_ratio(
			stats.month.total_cache_tokens,
			month_total_tokens,
		);

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
			const cache_ratio = calculate_cache_ratio(
				cache_stats.cache_tokens,
				cache_stats.total_tokens,
			);
			console.log(
				`  ${project}: ${cache_ratio.toFixed(1)}% (${cache_stats.cache_tokens.toLocaleString()} cached, ${cache_stats.total_tokens.toLocaleString()} new)`,
			);
		});
	} catch (error) {
		console.error('❌ Failed to retrieve cache stats:', error);
		process.exit(1);
	}
}
