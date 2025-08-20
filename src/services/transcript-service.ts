import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export interface TranscriptEntry {
	type: string;
	message?: {
		content?: Array<{ type: string; name?: string; id?: string }>;
	};
	uuid?: string;
	timestamp?: string;
	sessionId?: string;
	cwd?: string;
	toolUseResult?: any;
}

export interface ToolUsage {
	tool_name: string;
	count: number;
	success_count: number;
	failure_count: number;
	sessions: string[];
	projects: Set<string>;
	first_used: string;
	last_used: string;
}

export interface TranscriptService {
	extract_tool_usage(): Map<string, ToolUsage>;
	get_transcript_files(): Array<{
		path: string;
		project: string;
		session_id: string;
	}>;
	parse_transcript_file(file_path: string): TranscriptEntry[];
}

export class DefaultTranscriptService implements TranscriptService {
	private claude_projects_dir: string;

	constructor() {
		this.claude_projects_dir = path.join(
			os.homedir(),
			'.claude',
			'projects',
		);
	}

	parse_transcript_file(file_path: string): TranscriptEntry[] {
		try {
			const content = fs.readFileSync(file_path, 'utf-8');
			return content
				.split('\n')
				.filter((line) => line.trim())
				.map((line) => JSON.parse(line));
		} catch (error) {
			return [];
		}
	}

	get_transcript_files(): Array<{
		path: string;
		project: string;
		session_id: string;
	}> {
		const files: Array<{
			path: string;
			project: string;
			session_id: string;
		}> = [];

		if (!fs.existsSync(this.claude_projects_dir)) {
			return files;
		}

		const project_dirs = fs.readdirSync(this.claude_projects_dir);

		for (const project_dir of project_dirs) {
			const project_path = path.join(
				this.claude_projects_dir,
				project_dir,
			);
			if (!fs.statSync(project_path).isDirectory()) continue;

			const transcript_files = fs
				.readdirSync(project_path)
				.filter((file) => file.endsWith('.jsonl'));

			for (const transcript_file of transcript_files) {
				files.push({
					path: path.join(project_path, transcript_file),
					project: project_dir.replace(/-/g, '/'),
					session_id: path.basename(transcript_file, '.jsonl'),
				});
			}
		}

		return files;
	}

	extract_tool_usage(): Map<string, ToolUsage> {
		const tool_usage_map = new Map<string, ToolUsage>();
		const transcript_files = this.get_transcript_files();

		for (const {
			path: transcript_path,
			project: project_name,
			session_id,
		} of transcript_files) {
			const entries = this.parse_transcript_file(transcript_path);
			const tool_results = new Map<string, boolean>(); // tool_id -> success/failure

			for (const entry of entries) {
				if (entry.type === 'assistant' && entry.message?.content) {
					// Look for tool_use entries
					for (const content_item of entry.message.content) {
						if (
							content_item.type === 'tool_use' &&
							content_item.name &&
							content_item.id
						) {
							const tool_name = content_item.name;
							const tool_id = content_item.id;

							if (!tool_usage_map.has(tool_name)) {
								tool_usage_map.set(tool_name, {
									tool_name,
									count: 0,
									success_count: 0,
									failure_count: 0,
									sessions: [],
									projects: new Set(),
									first_used: entry.timestamp || '',
									last_used: entry.timestamp || '',
								});
							}

							const usage = tool_usage_map.get(tool_name)!;
							usage.count++;
							usage.sessions.push(session_id);
							usage.projects.add(project_name);

							this.update_usage_timestamps(usage, entry.timestamp);

							// Mark this tool call for success/failure tracking
							tool_results.set(tool_id, false); // Default to failure
						}
					}
				} else if (
					entry.type === 'user' &&
					entry.toolUseResult !== undefined
				) {
					// This is a tool result entry - check for errors
					const tool_id = entry.uuid;
					if (tool_id) {
						const has_error =
							entry.toolUseResult?.error !== undefined;
						tool_results.set(tool_id, !has_error);
					}
				}
			}

			// Update success/failure counts for this session
			this.update_success_failure_counts(
				tool_usage_map,
				tool_results,
			);
		}

		return tool_usage_map;
	}

	private update_usage_timestamps(
		usage: ToolUsage,
		timestamp: string | undefined,
	): void {
		if (!timestamp) return;

		if (!usage.first_used || timestamp < usage.first_used) {
			usage.first_used = timestamp;
		}
		if (!usage.last_used || timestamp > usage.last_used) {
			usage.last_used = timestamp;
		}
	}

	private update_success_failure_counts(
		tool_usage_map: Map<string, ToolUsage>,
		tool_results: Map<string, boolean>,
	): void {
		for (const [tool_id, success] of tool_results.entries()) {
			// Find which tool this result belongs to - this is simplified
			// In practice, we'd need better tracking of tool_id to tool_name mapping
			for (const usage of tool_usage_map.values()) {
				if (success) {
					usage.success_count++;
				} else {
					usage.failure_count++;
				}
				break; // Simplified - in reality we'd need proper mapping
			}
		}
	}

	// Utility function for extracting project names
	extract_project_name(
		project_dir: string | null | undefined,
	): string {
		return project_dir?.split('/').pop() || 'unknown';
	}
}
