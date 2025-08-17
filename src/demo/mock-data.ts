export interface MockUsageScenario {
	name: string;
	description: string;
	input_tokens: number;
	output_tokens: number;
	cache_tokens: number;
}

export const MOCK_USAGE_SCENARIOS: MockUsageScenario[] = [
	{
		name: 'light',
		description: 'Light usage - quick questions',
		input_tokens: 800,
		output_tokens: 400,
		cache_tokens: 15000, // Warm session
	},
	{
		name: 'medium',
		description: 'Medium usage - code reviews',
		input_tokens: 5000,
		output_tokens: 3200,
		cache_tokens: 25000, // Warm session
	},
	{
		name: 'heavy',
		description: 'Heavy usage - large refactoring',
		input_tokens: 45000,
		output_tokens: 32000,
		cache_tokens: 50000, // Warm session
	},
	{
		name: 'extreme',
		description: 'Extreme usage - full codebase analysis',
		input_tokens: 95000,
		output_tokens: 68000,
		cache_tokens: 15000,
	},
	{
		name: 'minimal',
		description: 'Minimal usage - simple chat',
		input_tokens: 150,
		output_tokens: 80,
		cache_tokens: 50,
	},
];

export function create_mock_transcript(
	scenario: MockUsageScenario,
): string {
	const now = new Date();
	const earlier = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago

	const mock_transcript = [
		{
			type: 'user',
			timestamp: earlier.toISOString(),
			message: {
				role: 'user',
				content: `Help me with my project - ${scenario.description}`,
			},
		},
		{
			type: 'assistant',
			timestamp: now.toISOString(),
			message: {
				role: 'assistant',
				model: 'claude-sonnet-4-20250514',
				usage: {
					input_tokens: scenario.input_tokens,
					output_tokens: scenario.output_tokens,
					cache_creation_input_tokens: Math.floor(
						scenario.cache_tokens * 0.3,
					),
					cache_read_input_tokens: Math.floor(
						scenario.cache_tokens * 0.7,
					),
				},
				content: `Here is my response for ${scenario.description}...`,
			},
		},
	];

	return mock_transcript
		.map((entry) => JSON.stringify(entry))
		.join('\n');
}
