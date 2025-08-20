import { ToolUsage } from '../../services/transcript-service';

export interface StatsFormatter {
	format_tool_usage(tool_usage_map: Map<string, ToolUsage>): void;
	format_basic_stats(stats: any): void;
	format_project_breakdown(projects: any[]): void;
	format_cache_efficiency(cache_stats: any): void;
}

export class DefaultStatsFormatter implements StatsFormatter {
	format_tool_usage(tool_usage_map: Map<string, ToolUsage>): void {
		console.log('🔧 Tool Usage Analytics\n');

		if (tool_usage_map.size === 0) {
			console.log('❌ No tool usage data found');
			console.log(
				'   Make sure you have Claude Code transcript files in ~/.claude/projects/',
			);
			return;
		}

		const sorted_tools = Array.from(tool_usage_map.values()).sort(
			(a, b) => b.count - a.count,
		);

		console.log('📊 Most Used Tools:');
		for (let i = 0; i < Math.min(10, sorted_tools.length); i++) {
			const tool = sorted_tools[i];
			const success_rate =
				tool.count > 0
					? ((tool.success_count / tool.count) * 100).toFixed(1)
					: '0.0';
			console.log(
				`  ${i + 1}. ${tool.tool_name}: ${tool.count} uses (${success_rate}% success)`,
			);
		}

		console.log('\n📈 Usage Summary:');
		console.log(`  Total tools discovered: ${tool_usage_map.size}`);
		console.log(
			`  Total tool calls: ${Array.from(tool_usage_map.values()).reduce((sum, tool) => sum + tool.count, 0)}`,
		);
		console.log(
			`  Unique sessions: ${new Set(Array.from(tool_usage_map.values()).flatMap((tool) => tool.sessions)).size}`,
		);
		console.log(
			`  Projects involved: ${new Set(Array.from(tool_usage_map.values()).flatMap((tool) => Array.from(tool.projects))).size}`,
		);

		const most_recent = sorted_tools.reduce(
			(latest, tool) =>
				tool.last_used > latest.last_used ? tool : latest,
			sorted_tools[0],
		);

		console.log(
			`  Most recent activity: ${most_recent.tool_name} (${this.format_relative_time(most_recent.last_used)})`,
		);

		console.log('\n🎯 Tool Distribution:');
		const project_counts = new Map<string, number>();
		for (const tool of tool_usage_map.values()) {
			for (const project of tool.projects) {
				project_counts.set(
					project,
					(project_counts.get(project) || 0) + tool.count,
				);
			}
		}

		const sorted_projects = Array.from(project_counts.entries()).sort(
			(a, b) => b[1] - a[1],
		);
		for (let i = 0; i < Math.min(5, sorted_projects.length); i++) {
			const [project, count] = sorted_projects[i];
			console.log(`  ${project}: ${count} tool calls`);
		}
	}

	format_basic_stats(stats: any): void {
		console.log('📊 Usage Statistics\n');

		console.log('📅 Today:');
		console.log(`  Sessions: ${stats.today.total_sessions}`);
		console.log(
			`  Tokens: ${stats.today.total_input_tokens + stats.today.total_output_tokens} (${stats.today.total_cache_tokens} cached)`,
		);
		console.log(`  Cost: $${stats.today.total_cost.toFixed(2)}`);
		console.log();

		console.log('📅 Last 7 days:');
		console.log(`  Sessions: ${stats.week.total_sessions}`);
		console.log(
			`  Tokens: ${stats.week.total_input_tokens + stats.week.total_output_tokens} (${stats.week.total_cache_tokens} cached)`,
		);
		console.log(`  Cost: $${stats.week.total_cost.toFixed(2)}`);
		console.log();

		console.log('📅 Last 30 days:');
		console.log(`  Sessions: ${stats.month.total_sessions}`);
		console.log(
			`  Tokens: ${stats.month.total_input_tokens + stats.month.total_output_tokens} (${stats.month.total_cache_tokens} cached)`,
		);
		console.log(`  Cost: $${stats.month.total_cost.toFixed(2)}`);
	}

	format_project_breakdown(projects: any[]): void {
		console.log('📁 Project Breakdown\n');

		if (projects.length === 0) {
			console.log('❌ No project data found');
			return;
		}

		const sorted_projects = projects.sort((a, b) => b.cost - a.cost);

		console.log('💰 Top Projects by Cost:');
		for (let i = 0; i < Math.min(10, sorted_projects.length); i++) {
			const project = sorted_projects[i];
			console.log(
				`  ${i + 1}. ${project.project}: $${project.cost.toFixed(2)} (${project.sessions} sessions)`,
			);
		}
	}

	format_cache_efficiency(cache_stats: any): void {
		console.log('🚀 Cache Efficiency Analysis\n');

		console.log(
			`Cache Hit Rate: ${(cache_stats.cache_hit_rate * 100).toFixed(1)}%`,
		);
		console.log(
			`Total Tokens: ${cache_stats.total_tokens.toLocaleString()}`,
		);
		console.log(
			`Cached Tokens: ${cache_stats.cached_tokens.toLocaleString()}`,
		);
		console.log(
			`Estimated Savings: $${cache_stats.cache_savings.toFixed(2)}`,
		);
	}

	private format_relative_time(timestamp: string): string {
		const now = new Date();
		const then = new Date(timestamp);
		const diff = now.getTime() - then.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days === 0) return 'today';
		if (days === 1) return 'yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
		return `${Math.floor(days / 30)} months ago`;
	}
}
