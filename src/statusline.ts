#!/usr/bin/env node

import { execSync } from 'child_process';
import * as path from 'path';
import { ClaudeStatusInput, GitInfo } from './types';

// Powerline symbols (using Unicode escape sequences like claude-powerline)
const SEPARATORS = {
  left: '\uE0B2',
  right: '\uE0B0',
  leftThin: '\uE0B3',
  rightThin: '\uE0B1'
} as const;

// Git symbols that work with most powerline fonts
const SYMBOLS = {
  branch: '\uE0A0', // Git branch symbol (same as claude-powerline)
  folder: '📁'
} as const;

// ANSI color codes
const COLORS = {
  reset: '\x1b[0m',
  // Backgrounds
  bg: {
    blue: '\x1b[44m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    red: '\x1b[41m',
    purple: '\x1b[45m',
    cyan: '\x1b[46m',
    gray: '\x1b[100m'
  },
  // Foregrounds (for separators)
  fg: {
    blue: '\x1b[34m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    purple: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
  },
  white: '\x1b[97m',
  black: '\x1b[30m'
} as const;

function get_git_info(cwd: string): GitInfo | null {
  try {
    // Check if in git repo
    execSync('git rev-parse --git-dir', { cwd, stdio: 'pipe' });
    
    // Get branch name
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { 
      cwd, 
      encoding: 'utf8' 
    }).trim();
    
    // Get status
    const status = execSync('git status --porcelain', { 
      cwd, 
      encoding: 'utf8' 
    });
    const is_dirty = status.trim().length > 0;
    
    return { branch, isDirty: is_dirty };
  } catch (error) {
    return null;
  }
}

function create_segment(content: string, bg_color: string, fg_color: string = COLORS.white): string {
  return `${bg_color}${fg_color} ${content} ${COLORS.reset}`;
}

function create_separator(from_color: string, to_color: string = '', style: 'thick' | 'thin' = 'thick'): string {
  const separator = style === 'thin' ? SEPARATORS.rightThin : SEPARATORS.right;
  return `${to_color}${from_color}${separator}${COLORS.reset}`;
}

function create_flame_separator(from_color: string, to_color: string = ''): string {
  // Double separator for "flame" effect
  return `${to_color}${from_color}${SEPARATORS.right}${SEPARATORS.rightThin}${COLORS.reset}`;
}

function create_wave_separator(from_color: string, to_color: string = ''): string {
  // Alternating thick/thin for wave effect
  return `${to_color}${from_color}${SEPARATORS.rightThin}${SEPARATORS.right}${COLORS.reset}`;
}

function create_lightning_separator(from_color: string, to_color: string = ''): string {
  // Triple separator for lightning effect
  return `${to_color}${from_color}${SEPARATORS.right}${SEPARATORS.rightThin}${SEPARATORS.right}${COLORS.reset}`;
}

function build_statusline(data: ClaudeStatusInput): string {
  const cwd = data.workspace?.current_dir || process.cwd();
  const model = data.model?.display_name || 'Claude';
  
  const segments: string[] = [];
  
  // Model segment (blue background) - use wave separator for smooth flow
  segments.push(create_segment(` ${model}`, COLORS.bg.blue));
  segments.push(create_wave_separator(COLORS.fg.blue, COLORS.bg.gray));
  
  // Directory segment (gray background)
  const dir_name = path.basename(cwd);
  segments.push(create_segment(`${SYMBOLS.folder} ${dir_name}`, COLORS.bg.gray));
  
  // Git segment (green/red background)
  const git_info = get_git_info(cwd);
  if (git_info) {
    const git_bg = git_info.isDirty ? COLORS.bg.yellow : COLORS.bg.green;
    const git_fg = git_info.isDirty ? COLORS.fg.yellow : COLORS.fg.green;
    const status_icon = git_info.isDirty ? '±' : '✓';
    
    // Use flame separator for dirty repos (attention-grabbing)
    if (git_info.isDirty) {
      segments.push(create_flame_separator(COLORS.fg.gray, git_bg));
      segments.push(create_segment(`${SYMBOLS.branch} ${git_info.branch} ${status_icon}`, git_bg, COLORS.black));
      segments.push(create_lightning_separator(git_fg)); // Triple separator for dirty repos!
    } else {
      // Clean repo gets smooth wave transition
      segments.push(create_wave_separator(COLORS.fg.gray, git_bg));
      segments.push(create_segment(`${SYMBOLS.branch} ${git_info.branch} ${status_icon}`, git_bg, COLORS.black));
      segments.push(create_separator(git_fg, '', 'thick'));
    }
  } else {
    // No git repo gets simple thin separator
    segments.push(create_separator(COLORS.fg.gray, '', 'thin'));
  }
  
  return segments.join('');
}

function main(): void {
  let input = '';
  
  // Read from stdin
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk: string) => {
    input += chunk;
  });
  
  process.stdin.on('end', () => {
    try {
      const data: ClaudeStatusInput = JSON.parse(input);
      const statusline = build_statusline(data);
      console.log(statusline);
    } catch (error) {
      // Fallback if JSON parsing fails
      console.log(`${COLORS.bg.red}${COLORS.white} Error parsing input ${COLORS.reset}`);
    }
  });
}

if (require.main === module) {
  main();
}