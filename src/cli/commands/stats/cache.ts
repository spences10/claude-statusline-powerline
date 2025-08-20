import { DefaultAnalyticsService } from '../../../services/analytics-service';
import { DefaultStatsFormatter } from '../../../utils/formatters/stats-formatter';

export function show_cache_stats(): void {
	try {
		const analytics_service = new DefaultAnalyticsService();
		const stats_formatter = new DefaultStatsFormatter();

		const cache_efficiency = analytics_service.get_cache_efficiency();
		stats_formatter.format_cache_efficiency(cache_efficiency);
	} catch (error) {
		console.error('❌ Failed to retrieve cache stats:', error);
		process.exit(1);
	}
}
