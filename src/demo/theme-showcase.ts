import { SEPARATOR_THEMES } from '../config';
import { SeparatorConfig } from '../types';

console.log('🎨 Separator Theme Showcase\n');

Object.entries(SEPARATOR_THEMES).forEach(
	([theme_name, config]: [string, SeparatorConfig]) => {
		console.log(`📍 Theme: ${theme_name.toUpperCase()}`);
		console.log(`   Model: ${config.model}`);
		console.log(`   Directory (clean): ${config.directory.clean}`);
		console.log(`   Directory (dirty): ${config.directory.dirty}`);
		console.log(`   Directory (no git): ${config.directory.no_git}`);
		console.log(`   Git (clean): ${config.git.clean}`);
		console.log(`   Git (dirty): ${config.git.dirty}\n`);
	},
);

console.log('🚀 To test a theme, create a JSON config file:');
console.log('   ~/.claude/claude-statusline-powerline.json');
console.log(
	'   Or project-specific: .claude-statusline-powerline.json\n',
);

console.log('📝 Example configuration:');
console.log(
	JSON.stringify(
		{
			color_theme: 'dark',
			theme: 'expressive',
			font_profile: 'nerd-font',
			separator_profile: 'all-curvy',
		},
		null,
		2,
	),
);
console.log('');

console.log('⚡ Available separator styles:');
console.log('   • thick: Standard powerline separator');
console.log('   • thin: Thin powerline separator');
console.log('   • flame: Double separator (🔥)');
console.log('   • wave: Alternating thick/thin (🌊)');
console.log('   • lightning: Triple separator (⚡)');
console.log('   • curvy: Curved separator (Victor Mono compatible)');
console.log('   • angly: Angular separator (Victor Mono compatible)');
console.log('   • angly2: Double angular separator');
console.log('   • none: No separator');
