import { UsageSummary } from '../types';
import { UsageDatabase } from '../utils/usage-db';

export interface AnalyticsService {
	get_usage_summary(): UsageSummary;
	get_cache_efficiency(): {
		cache_hit_rate: number;
		cache_savings: number;
		total_tokens: number;
		cached_tokens: number;
	};
	get_project_breakdown(): Array<{
		project: string;
		sessions: number;
		cost: number;
		tokens: number;
	}>;
}

export class DefaultAnalyticsService implements AnalyticsService {
	private db: UsageDatabase;

	constructor() {
		this.db = new UsageDatabase();
	}

	get_usage_summary(): UsageSummary {
		return this.db.get_usage_summary();
	}

	get_cache_efficiency(): {
		cache_hit_rate: number;
		cache_savings: number;
		total_tokens: number;
		cached_tokens: number;
	} {
		const stats = this.db.get_cache_stats();
		const total_tokens =
			stats.total_input_tokens + stats.total_output_tokens;
		const cache_hit_rate =
			total_tokens > 0 ? stats.total_cache_tokens / total_tokens : 0;

		// Estimate savings based on cached vs non-cached token costs
		const cache_savings = stats.total_cache_tokens * 0.9; // Approximate 90% savings

		return {
			cache_hit_rate,
			cache_savings,
			total_tokens,
			cached_tokens: stats.total_cache_tokens,
		};
	}

	get_project_breakdown(): Array<{
		project: string;
		sessions: number;
		cost: number;
		tokens: number;
	}> {
		return this.db.get_project_breakdown();
	}
}
