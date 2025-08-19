import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

// Tool usage analysis types
interface ToolUsage {
	tool_name: string;
	count: number;
	success_count: number;
	failure_count: number;
	sessions: string[];
	projects: Set<string>;
	first_used: string;
	last_used: string;
}

interface TranscriptEntry {
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

// Utility function for extracting project names
function extract_project_name(
	project_dir: string | null | undefined,
): string {
	return project_dir?.split('/').pop() || 'unknown';
}

function parse_transcript_file(file_path: string): TranscriptEntry[] {
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

function extract_tool_usage_from_transcripts(): Map<
	string,
	ToolUsage
> {
	const claude_projects_dir = path.join(
		os.homedir(),
		'.claude',
		'projects',
	);
	const tool_usage_map = new Map<string, ToolUsage>();

	if (!fs.existsSync(claude_projects_dir)) {
		return tool_usage_map;
	}

	// Get all project directories
	const project_dirs = fs.readdirSync(claude_projects_dir);

	for (const project_dir of project_dirs) {
		const project_path = path.join(claude_projects_dir, project_dir);
		const project_name = project_dir.replace(/-/g, '/');

		if (!fs.statSync(project_path).isDirectory()) continue;

		// Get all transcript files in this project
		const transcript_files = fs
			.readdirSync(project_path)
			.filter((file) => file.endsWith('.jsonl'));

		for (const transcript_file of transcript_files) {
			const transcript_path = path.join(
				project_path,
				transcript_file,
			);
			const session_id = path.basename(transcript_file, '.jsonl');
			const entries = parse_transcript_file(transcript_path);

			// Track tool usage for this session
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

							if (entry.timestamp) {
								if (
									!usage.first_used ||
									entry.timestamp < usage.first_used
								) {
									usage.first_used = entry.timestamp;
								}
								if (
									!usage.last_used ||
									entry.timestamp > usage.last_used
								) {
									usage.last_used = entry.timestamp;
								}
							}

							// Mark this tool call for success/failure tracking
							tool_results.set(tool_id, false); // Default to failure, will be updated if we find success
						}
					}
				} else if (
					entry.type === 'user' &&
					entry.toolUseResult !== undefined
				) {
					// This is a tool result entry - check for errors
					const tool_id = entry.uuid; // The result entry should reference the tool call

					// Check if there was an error in the result
					const has_error =
						entry.toolUseResult?.is_error === true ||
						(typeof entry.toolUseResult === 'string' &&
							entry.toolUseResult.includes('error'));

					if (tool_id && tool_results.has(tool_id)) {
						tool_results.set(tool_id, !has_error);
					}
				}
			}

			// Update success/failure counts
			for (const [tool_id, success] of tool_results) {
				// Find which tool this result belongs to by looking through the entries again
				for (const entry of entries) {
					if (entry.type === 'assistant' && entry.message?.content) {
						for (const content_item of entry.message.content) {
							if (
								content_item.type === 'tool_use' &&
								content_item.id === tool_id &&
								content_item.name
							) {
								const usage = tool_usage_map.get(content_item.name);
								if (usage) {
									if (success) {
										usage.success_count++;
									} else {
										usage.failure_count++;
									}
								}
								break;
							}
						}
					}
				}
			}
		}
	}

	return tool_usage_map;
}

export function show_tool_stats(): void {
	console.log('🔧 Tool Usage Analytics\n');

	try {
		const tool_usage_map = extract_tool_usage_from_transcripts();

		if (tool_usage_map.size === 0) {
			console.log('No tool usage data found in transcript files.');
			return;
		}

		// Convert to array and sort by usage count
		const tool_usage_array = Array.from(tool_usage_map.values()).sort(
			(a, b) => b.count - a.count,
		);

		console.log('📈 Most Used Tools:');
		console.log('─'.repeat(80));
		console.log(
			'Tool Name'.padEnd(25) +
				'Count'.padEnd(8) +
				'Success%'.padEnd(10) +
				'Projects'.padEnd(10) +
				'Sessions',
		);
		console.log('─'.repeat(80));

		for (const tool of tool_usage_array.slice(0, 15)) {
			const success_rate =
				tool.count > 0
					? ((tool.success_count / tool.count) * 100).toFixed(1)
					: '0.0';
			const unique_sessions = [...new Set(tool.sessions)].length;

			console.log(
				tool.tool_name.padEnd(25) +
					tool.count.toString().padEnd(8) +
					`${success_rate}%`.padEnd(10) +
					tool.projects.size.toString().padEnd(10) +
					unique_sessions.toString(),
			);
		}

		console.log('\n📊 Tool Categories:');
		const categories = new Map<
			string,
			{ count: number; tools: Set<string> }
		>();

		for (const tool of tool_usage_array) {
			let category = 'Other';

			if (tool.tool_name.startsWith('mcp__')) {
				category = 'MCP Tools';
			} else if (
				['Read', 'Write', 'Edit', 'MultiEdit'].includes(
					tool.tool_name,
				)
			) {
				category = 'File Operations';
			} else if (['Glob', 'Grep'].includes(tool.tool_name)) {
				category = 'Search Tools';
			} else if (tool.tool_name === 'Bash') {
				category = 'Shell Commands';
			} else if (tool.tool_name === 'TodoWrite') {
				category = 'Task Management';
			} else if (['LS', 'WebFetch'].includes(tool.tool_name)) {
				category = 'Data Retrieval';
			}

			if (!categories.has(category)) {
				categories.set(category, { count: 0, tools: new Set() });
			}

			const cat = categories.get(category)!;
			cat.count += tool.count;
			cat.tools.add(tool.tool_name);
		}

		const sorted_categories = Array.from(categories.entries()).sort(
			([, a], [, b]) => b.count - a.count,
		);

		for (const [category, stats] of sorted_categories) {
			console.log(
				`  ${category}: ${stats.count} uses (${stats.tools.size} tools)`,
			);
		}

		console.log('\n⏰ Usage Timeline:');
		const timeline_tools = tool_usage_array.slice(0, 5);
		for (const tool of timeline_tools) {
			if (tool.first_used) {
				const first_date = new Date(tool.first_used)
					.toISOString()
					.split('T')[0];
				const last_date = new Date(tool.last_used)
					.toISOString()
					.split('T')[0];
				console.log(
					`  ${tool.tool_name}: ${first_date} → ${last_date} (${tool.count} uses)`,
				);
			}
		}
	} catch (error) {
		console.error('❌ Failed to retrieve tool stats:', error);
		process.exit(1);
	}
}
