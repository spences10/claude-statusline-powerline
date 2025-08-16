/**
 * Utility function for formatting token counts in a human-readable way
 *
 * @param tokens - The number of tokens to format
 * @returns Formatted string (e.g., "499", "1.5k", "2.3M")
 */
export function format_tokens(tokens: number): string {
	if (tokens >= 1000000) {
		return `${(tokens / 1000000).toFixed(1)}M`;
	} else if (tokens >= 1000) {
		return `${(tokens / 1000).toFixed(1)}k`;
	} else {
		return tokens.toString();
	}
}
