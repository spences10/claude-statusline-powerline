import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { UsageDatabase } from '../../utils/usage-db';

export function show_database_info(): void {
	console.log('🗄️  Database Information\n');

	try {
		const db = new UsageDatabase();
		const db_path = path.join(
			os.homedir(),
			'.claude',
			'statusline-usage.db',
		);

		console.log(`📍 Location: ${db_path}`);
		console.log(`📁 Size: ${get_file_size(db_path)}`);
		console.log(
			`🔗 Exists: ${fs.existsSync(db_path) ? 'Yes' : 'No'}`,
		);
		console.log();

		// Get table info by querying database directly
		const session_count = (db as any).db
			.prepare('SELECT COUNT(*) as count FROM sessions')
			.get().count;
		const daily_count = (db as any).db
			.prepare('SELECT COUNT(*) as count FROM daily_summaries')
			.get().count;

		console.log('📊 Table Statistics:');
		console.log(`  Sessions: ${session_count} records`);
		console.log(`  Daily summaries: ${daily_count} records`);
	} catch (error) {
		console.error('❌ Failed to get database info:', error);
		process.exit(1);
	}
}

export function clean_database(): void {
	console.log('🧹 Cleaning old database entries...\n');

	try {
		const db = new UsageDatabase();
		const cutoff_date = new Date();
		cutoff_date.setDate(cutoff_date.getDate() - 90); // Keep 90 days
		const cutoff_iso = cutoff_date.toISOString();

		// Clean old sessions manually
		const result = (db as any).db
			.prepare('DELETE FROM sessions WHERE start_time < ?')
			.run(cutoff_iso);
		console.log(
			`✅ Cleaned ${result.changes} old session records (older than 90 days)`,
		);
	} catch (error) {
		console.error('❌ Failed to clean database:', error);
		process.exit(1);
	}
}

export function reset_database(): void {
	console.log('🗑️  Resetting database...\n');

	try {
		const db_path = path.join(
			os.homedir(),
			'.claude',
			'statusline-usage.db',
		);

		if (fs.existsSync(db_path)) {
			fs.unlinkSync(db_path);
			console.log('✅ Removed existing database');
		}

		// Create new database
		const db = new UsageDatabase();
		console.log('✅ Created new database');
	} catch (error) {
		console.error('❌ Failed to reset database:', error);
		process.exit(1);
	}
}

function get_file_size(file_path: string): string {
	try {
		const stats = fs.statSync(file_path);
		const bytes = stats.size;

		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	} catch {
		return 'Unknown';
	}
}
