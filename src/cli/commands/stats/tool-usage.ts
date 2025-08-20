import { DefaultTranscriptService } from '../../../services/transcript-service';
import { DefaultStatsFormatter } from '../../../utils/formatters/stats-formatter';

export function show_tool_stats(): void {
	try {
		const transcript_service = new DefaultTranscriptService();
		const stats_formatter = new DefaultStatsFormatter();

		const tool_usage_map = transcript_service.extract_tool_usage();
		stats_formatter.format_tool_usage(tool_usage_map);
	} catch (error) {
		console.error('❌ Failed to retrieve tool usage stats:', error);
		process.exit(1);
	}
}
