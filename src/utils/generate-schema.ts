import { execSync } from 'node:child_process';
import * as fs from 'node:fs';

import { SEPARATOR_THEMES } from '../config';
import { FONT_PROFILES } from '../font-profiles';
import { THEMES } from '../themes';

interface JsonSchema {
	$schema?: string;
	$id?: string;
	title?: string;
	description?: string;
	type: string;
	properties?: Record<string, any>;
	definitions?: Record<string, any>;
	required?: string[];
	additionalProperties?: boolean;
	examples?: any[];
}

function generate_schema(): void {
	// Generate base schema using typescript-json-schema
	console.log(
		'🔧 Generating base schema from TypeScript interfaces...',
	);
	execSync(
		'npx typescript-json-schema src/types.ts StatuslineConfig --out statusline.schema.generated.json --required',
		{
			stdio: 'inherit',
		},
	);

	// Load the generated schema
	const generated_schema: JsonSchema = JSON.parse(
		fs.readFileSync('statusline.schema.generated.json', 'utf8'),
	);

	// Enhance with metadata, descriptions, and constraints
	const enhanced_schema: JsonSchema = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		$id: 'https://raw.githubusercontent.com/spences10/claude-statusline-powerline/main/statusline.schema.json',
		title: 'Claude Statusline Powerline Configuration',
		description:
			'Configuration schema for Claude Code statusline with powerline symbols, git integration, and session tracking',
		...generated_schema,

		// Add missing properties
		properties: {
			$schema: {
				type: 'string',
				description: 'JSON Schema reference for IntelliSense support',
			},
			...generated_schema.properties,
		},
	};

	// Add descriptions to main properties
	if (enhanced_schema.properties) {
		enhanced_schema.properties.separators.description =
			'Configure separator styles for different segments and states';
		enhanced_schema.properties.separatorProfile.description =
			"Override separator styles with predefined profiles like 'all-curvy', 'mixed-dynamic', etc.";
		enhanced_schema.properties.segments.description =
			'Control which segments are visible in the statusline';
		enhanced_schema.properties.display.description =
			'Configure multiline layout and which segments appear on each line';
		enhanced_schema.properties.theme.description =
			'Separator theme preset determining visual style';
		enhanced_schema.properties.color_theme.description =
			'Color theme for segment backgrounds and text';
		enhanced_schema.properties.font_profile.description =
			'Font compatibility profile determining available separator symbols';
		enhanced_schema.properties.segment_config.description =
			'Advanced segment configuration with custom ordering, styling, and granular control';
		enhanced_schema.properties.current_theme.description =
			'Internal property populated with actual theme object - not for user configuration';

		enhanced_schema.properties.color_theme.enum = Object.keys(THEMES);
		enhanced_schema.properties.color_theme.default = 'dark';
		enhanced_schema.properties.font_profile.enum =
			Object.keys(FONT_PROFILES);
		enhanced_schema.properties.font_profile.default = 'powerline';
		enhanced_schema.properties.theme.enum =
			Object.keys(SEPARATOR_THEMES);
		enhanced_schema.properties.theme.default = 'minimal';
	}

	if (enhanced_schema.definitions?.SegmentStyleConfig) {
		const style_config =
			enhanced_schema.definitions.SegmentStyleConfig;
		if (style_config.properties?.bg_color) {
			style_config.properties.bg_color.pattern = '^#[0-9a-fA-F]{6}$';
			style_config.properties.bg_color.description =
				'Background color in hex format (e.g., #1e40af)';
			style_config.properties.bg_color.examples = [
				'#1e40af',
				'#059669',
				'#dc2626',
			];
		}
		if (style_config.properties?.fg_color) {
			style_config.properties.fg_color.pattern = '^#[0-9a-fA-F]{6}$';
			style_config.properties.fg_color.description =
				'Foreground (text) color in hex format (e.g., #ffffff)';
			style_config.properties.fg_color.examples = [
				'#ffffff',
				'#000000',
			];
		}
		if (style_config.properties?.separator?.properties?.color) {
			style_config.properties.separator.properties.color.pattern =
				'^#[0-9a-fA-F]{6}$';
			style_config.properties.separator.properties.color.description =
				'Separator color in hex format';
			style_config.properties.separator.properties.color.examples = [
				'#1e40af',
				'#059669',
			];
		}
	}

	// Add descriptions to definitions
	if (enhanced_schema.definitions?.SeparatorStyle) {
		enhanced_schema.definitions.SeparatorStyle.description =
			'Visual style of powerline separators between segments';
	}

	// Add additionalProperties: false to key objects (optional - makes schema stricter)
	enhanced_schema.additionalProperties = false;

	// Add examples
	enhanced_schema.examples = [
		{
			color_theme: 'dark',
			theme: 'minimal',
			segments: {
				model: true,
				directory: true,
				git: true,
				session: true,
			},
		},
		{
			display: {
				lines: [
					{
						segments: {
							directory: true,
							git: true,
							model: true,
						},
					},
					{
						segments: {
							session: true,
						},
					},
				],
			},
			color_theme: 'electric',
			theme: 'expressive',
		},
	];

	// Remove the old required constraint that makes all top-level properties required
	// Most config properties should be optional
	delete enhanced_schema.required;

	// Write the enhanced schema
	fs.writeFileSync(
		'statusline.schema.json',
		JSON.stringify(enhanced_schema, null, 2),
	);

	// Clean up temporary file
	fs.unlinkSync('statusline.schema.generated.json');

	console.log('✅ Enhanced schema generated successfully!');
	console.log('📍 Schema written to statusline.schema.json');
}

if (require.main === module) {
	generate_schema();
}
