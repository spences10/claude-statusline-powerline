export class StatsError extends Error {
	constructor(
		message: string,
		public cause?: Error,
	) {
		super(message);
		this.name = 'StatsError';
	}
}

export function handle_stats_error(
	error: unknown,
	operation: string,
): never {
	if (error instanceof StatsError) {
		console.error(`❌ ${error.message}`);
		if (error.cause) {
			console.error(`   Cause: ${error.cause.message}`);
		}
	} else if (error instanceof Error) {
		console.error(`❌ Failed to ${operation}: ${error.message}`);
	} else {
		console.error(`❌ Failed to ${operation}: Unknown error`);
	}

	process.exit(1);
}

export function wrap_stats_operation<T>(
	operation: () => T,
	error_message: string,
): T {
	try {
		return operation();
	} catch (error) {
		throw new StatsError(
			error_message,
			error instanceof Error ? error : undefined,
		);
	}
}
