import { DefaultAnalyticsService } from '../../../services/analytics-service';
import { DefaultStatsFormatter } from '../../../utils/formatters/stats-formatter';

export function show_project_stats(): void {
	try {
		const analytics_service = new DefaultAnalyticsService();
		const stats_formatter = new DefaultStatsFormatter();

		const projects = analytics_service.get_project_breakdown();
		stats_formatter.format_project_breakdown(projects);

		if (projects.length === 0) {
			return;
		}

		// Additional detailed breakdown
		const sorted_projects = projects.sort(
			(a: any, b: any) => b.cost - a.cost,
		);
		const total_cost = sorted_projects.reduce(
			(sum: number, project: any) => sum + project.cost,
			0,
		);
		const total_sessions = sorted_projects.reduce(
			(sum: number, project: any) => sum + project.sessions,
			0,
		);
		const total_tokens = sorted_projects.reduce(
			(sum: number, project: any) => sum + project.tokens,
			0,
		);

		console.log('\n📊 Summary:');
		console.log(`  Total projects: ${sorted_projects.length}`);
		console.log(`  Total cost: $${total_cost.toFixed(2)}`);
		console.log(`  Total sessions: ${total_sessions}`);
		console.log(
			`  Total tokens: ${(total_tokens / 1000).toFixed(1)}k`,
		);

		console.log('\n🥧 Distribution (Top 5):');
		for (let i = 0; i < Math.min(5, sorted_projects.length); i++) {
			const project = sorted_projects[i];
			const percentage = ((project.cost / total_cost) * 100).toFixed(
				1,
			);
			console.log(
				`  ${project.project}: ${percentage}% ($${project.cost.toFixed(2)})`,
			);
		}
	} catch (error) {
		console.error('❌ Failed to retrieve project stats:', error);
		process.exit(1);
	}
}
