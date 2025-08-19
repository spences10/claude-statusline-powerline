import { UsageDatabase } from '../../../utils/usage-db';

// Utility function for extracting project names
function extract_project_name(
	project_dir: string | null | undefined,
): string {
	return project_dir?.split('/').pop() || 'unknown';
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
