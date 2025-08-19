import { UsageDatabase } from '../../../utils/usage-db';

// Utility function for extracting project names
function extract_project_name(
	project_dir: string | null | undefined,
): string {
	return project_dir?.split('/').pop() || 'unknown';
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
