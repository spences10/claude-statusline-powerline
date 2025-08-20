import { DefaultAnalyticsService } from '../../../services/analytics-service';
import { DefaultStatsFormatter } from '../../../utils/formatters/stats-formatter';

export function show_stats(): void {
	try {
		const analytics_service = new DefaultAnalyticsService();
		const stats_formatter = new DefaultStatsFormatter();

		const stats = analytics_service.get_usage_summary();
		stats_formatter.format_basic_stats(stats);
	} catch (error) {
		console.error('❌ Failed to retrieve stats:', error);
		process.exit(1);
	}
}

export function show_daily_stats(): void {
	try {
		const analytics_service = new DefaultAnalyticsService();
		const stats_formatter = new DefaultStatsFormatter();

		const stats = analytics_service.get_usage_summary();

		console.log('📊 Daily Usage Breakdown\n');
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
