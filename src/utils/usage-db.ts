import Database from 'better-sqlite3';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { DailySummary, SessionRecord, UsageSummary } from '../types';

class UsageDatabase {
	private db: Database.Database;
	private db_path: string;

	constructor() {
		// Store database in Claude config directory
		const claude_dir = path.join(os.homedir(), '.claude');
		if (!fs.existsSync(claude_dir)) {
			fs.mkdirSync(claude_dir, { recursive: true });
		}

		this.db_path = path.join(claude_dir, 'statusline-usage.db');
		this.db = new Database(this.db_path);
		this.initialize_schema();
	}

	private initialize_schema() {
		// Create sessions table
		this.db.exec(`
			CREATE TABLE IF NOT EXISTS sessions (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				session_id TEXT UNIQUE NOT NULL,
				model TEXT NOT NULL,
				start_time DATETIME NOT NULL,
				end_time DATETIME,
				input_tokens INTEGER DEFAULT 0,
				output_tokens INTEGER DEFAULT 0,
				cache_tokens INTEGER DEFAULT 0,
				cost REAL DEFAULT 0.0,
				project_dir TEXT,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`);

		// Create daily summaries table
		this.db.exec(`
			CREATE TABLE IF NOT EXISTS daily_summaries (
				date TEXT PRIMARY KEY,
				total_sessions INTEGER DEFAULT 0,
				total_input_tokens INTEGER DEFAULT 0,
				total_output_tokens INTEGER DEFAULT 0,
				total_cache_tokens INTEGER DEFAULT 0,
				total_cost REAL DEFAULT 0.0,
				models_used TEXT DEFAULT '[]',
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`);

		// Create indexes for performance
		this.db.exec(`
			CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date(start_time));
			CREATE INDEX IF NOT EXISTS idx_sessions_model ON sessions(model);
			CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project_dir);
		`);
	}

	record_session(session: Omit<SessionRecord, 'id'>) {
		const stmt = this.db.prepare(`
			INSERT OR REPLACE INTO sessions (
				session_id, model, start_time, end_time, 
				input_tokens, output_tokens, cache_tokens, cost, project_dir
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		stmt.run(
			session.session_id,
			session.model,
			session.start_time,
			session.end_time,
			session.input_tokens,
			session.output_tokens,
			session.cache_tokens,
			session.cost,
			session.project_dir,
		);

		// Update daily summary
		this.update_daily_summary(session.start_time);
	}

	private update_daily_summary(timestamp: string) {
		const date = timestamp.split('T')[0]; // Extract YYYY-MM-DD

		const daily_stats = this.db
			.prepare(
				`
			SELECT 
				COUNT(*) as total_sessions,
				SUM(input_tokens) as total_input_tokens,
				SUM(output_tokens) as total_output_tokens,
				SUM(cache_tokens) as total_cache_tokens,
				SUM(cost) as total_cost,
				GROUP_CONCAT(DISTINCT model) as models_used
			FROM sessions 
			WHERE date(start_time) = ?
		`,
			)
			.get(date) as any;

		this.db
			.prepare(
				`
			INSERT OR REPLACE INTO daily_summaries (
				date, total_sessions, total_input_tokens, total_output_tokens,
				total_cache_tokens, total_cost, models_used
			) VALUES (?, ?, ?, ?, ?, ?, ?)
		`,
			)
			.run(
				date,
				daily_stats.total_sessions || 0,
				daily_stats.total_input_tokens || 0,
				daily_stats.total_output_tokens || 0,
				daily_stats.total_cache_tokens || 0,
				daily_stats.total_cost || 0.0,
				JSON.stringify(
					(daily_stats.models_used || '').split(',').filter(Boolean),
				),
			);
	}

	get_usage_summary(): UsageSummary {
		const today = new Date().toISOString().split('T')[0];
		const week_ago = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split('T')[0];
		const month_ago = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split('T')[0];

		// Get today's summary
		const today_summary = (this.db
			.prepare(
				`
			SELECT * FROM daily_summaries WHERE date = ?
		`,
			)
			.get(today) as DailySummary) || {
			date: today,
			total_sessions: 0,
			total_input_tokens: 0,
			total_output_tokens: 0,
			total_cache_tokens: 0,
			total_cost: 0,
			models_used: '[]',
		};

		// Get week summary
		const week_stats = this.db
			.prepare(
				`
			SELECT 
				SUM(total_sessions) as total_sessions,
				SUM(total_input_tokens) as total_input_tokens,
				SUM(total_output_tokens) as total_output_tokens,
				SUM(total_cache_tokens) as total_cache_tokens,
				SUM(total_cost) as total_cost
			FROM daily_summaries 
			WHERE date >= ?
		`,
			)
			.get(week_ago) as any;

		const week_summary: DailySummary = {
			date: week_ago,
			total_sessions: week_stats?.total_sessions || 0,
			total_input_tokens: week_stats?.total_input_tokens || 0,
			total_output_tokens: week_stats?.total_output_tokens || 0,
			total_cache_tokens: week_stats?.total_cache_tokens || 0,
			total_cost: week_stats?.total_cost || 0,
			models_used: '[]',
		};

		// Get month summary
		const month_stats = this.db
			.prepare(
				`
			SELECT 
				SUM(total_sessions) as total_sessions,
				SUM(total_input_tokens) as total_input_tokens,
				SUM(total_output_tokens) as total_output_tokens,
				SUM(total_cache_tokens) as total_cache_tokens,
				SUM(total_cost) as total_cost
			FROM daily_summaries 
			WHERE date >= ?
		`,
			)
			.get(month_ago) as any;

		const month_summary: DailySummary = {
			date: month_ago,
			total_sessions: month_stats?.total_sessions || 0,
			total_input_tokens: month_stats?.total_input_tokens || 0,
			total_output_tokens: month_stats?.total_output_tokens || 0,
			total_cache_tokens: month_stats?.total_cache_tokens || 0,
			total_cost: month_stats?.total_cost || 0,
			models_used: '[]',
		};

		// Get recent sessions
		const recent_sessions = this.db
			.prepare(
				`
			SELECT * FROM sessions 
			ORDER BY start_time DESC 
			LIMIT 5
		`,
			)
			.all() as SessionRecord[];

		return {
			today: today_summary,
			week: week_summary,
			month: month_summary,
			recent_sessions,
		};
	}

	close() {
		this.db.close();
	}
}

// Singleton instance
let db_instance: UsageDatabase | null = null;

export function get_usage_db(): UsageDatabase {
	if (!db_instance) {
		db_instance = new UsageDatabase();
	}
	return db_instance;
}

export { UsageDatabase };
