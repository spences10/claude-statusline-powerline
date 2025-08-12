#!/usr/bin/env node

import { SEPARATOR_THEMES } from './config';

const mockInput = JSON.stringify({
	session_id: 'test-session',
	model: {
		display_name: 'Claude Sonnet 4',
	},
	workspace: {
		current_dir: '/home/scott/repos/claude-statusline',
	},
});

console.log('🎨 Separator Theme Showcase\n');

Object.entries(SEPARATOR_THEMES).forEach(([theme_name, config]) => {
	console.log(`📍 Theme: ${theme_name.toUpperCase()}`);
	console.log(`   Model: ${config.model}`);
	console.log(`   Directory (clean): ${config.directory.clean}`);
	console.log(`   Directory (dirty): ${config.directory.dirty}`);
	console.log(`   Directory (no git): ${config.directory.noGit}`);
	console.log(`   Git (clean): ${config.git.clean}`);
	console.log(`   Git (dirty): ${config.git.dirty}\n`);
});

console.log('🚀 To test a theme, set environment variable:');
console.log('   STATUSLINE_THEME=minimal node dist/statusline.js');
console.log('   STATUSLINE_THEME=expressive node dist/statusline.js');
console.log('   STATUSLINE_THEME=subtle node dist/statusline.js');
console.log('   STATUSLINE_THEME=electric node dist/statusline.js\n');

console.log('⚡ Available separator styles:');
console.log('   • thick: Standard powerline separator');
console.log('   • thin: Thin powerline separator');
console.log('   • flame: Double separator (🔥)');
console.log('   • wave: Alternating thick/thin (🌊)');
console.log('   • lightning: Triple separator (⚡)');
console.log('   • none: No separator');
