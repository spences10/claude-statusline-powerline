#!/bin/bash

# Demo script for claude-statusline-powerline
# Shows various configuration examples

# Colors for headers
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Base JSON data
BASE_JSON='{
  "session_id": "demo-session",
  "model": {
    "id": "claude-sonnet-4-20250514",
    "display_name": "Claude Sonnet 4"
  },
  "workspace": {
    "current_dir": "/home/scott/repos/claude-statusline-powerline"
  },
  "transcript_path": "demo-transcript.jsonl"
}'

# Model variations
MODELS=(
  '{"id": "claude-sonnet-4-20250514", "display_name": "Claude Sonnet 4"}'
  '{"id": "claude-opus-4-20250514", "display_name": "Claude Opus 4"}'
  '{"id": "claude-3-5-haiku-20241022", "display_name": "Claude Haiku 3.5"}'
  '{"id": "custom-model", "display_name": "Very Long Model Name That Gets Truncated"}'
)

# Theme options
THEMES=("minimal" "expressive" "subtle" "electric" "curvy" "angular")

# Separator profiles
SEPARATOR_PROFILES=("all-curvy" "all-angly" "mixed-dynamic" "minimal-clean" "electric-chaos")

# Directory scenarios
DIRECTORIES=(
  "/home/user/projects/my-awesome-app"
  "/tmp/test-dir"
  "/usr/local/bin"
  "/"
  "/home/user/.config/claude"
)

# Segment visibility combinations
SEGMENT_CONFIGS=(
  "all" # Show all segments
  "no-session" # Hide session
  "no-git" # Hide git
  "minimal" # Only model and directory
  "git-only" # Only git and directory
)

# Print header function
print_header() {
  echo -e "\n${BLUE}========================================${NC}"
  echo -e "${CYAN}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
}

# Print subheader function
print_subheader() {
  echo -e "\n${YELLOW}--- $1 ---${NC}"
}

# Function to create demo transcript file
create_demo_transcript() {
  cat > demo-transcript.jsonl << 'EOF'
{"type":"user","timestamp":"2025-01-15T10:00:00Z","message":{"role":"user","content":"Hello!"}}
{"type":"assistant","timestamp":"2025-01-15T10:00:05Z","message":{"role":"assistant","content":"Hi there!","model":"claude-sonnet-4-20250514","usage":{"input_tokens":1200,"output_tokens":350,"cache_creation_input_tokens":0,"cache_read_input_tokens":500}}}
{"type":"user","timestamp":"2025-01-15T10:01:00Z","message":{"role":"user","content":"Can you help me code?"}}
{"type":"assistant","timestamp":"2025-01-15T10:01:10Z","message":{"role":"assistant","content":"Absolutely! I'd be happy to help you with coding.","model":"claude-sonnet-4-20250514","usage":{"input_tokens":1500,"output_tokens":420,"cache_creation_input_tokens":200,"cache_read_input_tokens":300}}}
EOF
}

# Function to run statusline with configuration
run_statusline() {
  local json_data="$1"
  local env_vars="$2"
  
  if [ -n "$env_vars" ]; then
    env $env_vars sh -c "echo '$json_data' | node dist/statusline.js"
  else
    echo "$json_data" | node dist/statusline.js
  fi
}

# Create demo transcript file
create_demo_transcript

print_header "Claude Statusline Powerline Demo"
echo "This script demonstrates various configuration options for the statusline."

# 1. Theme Examples
print_header "1. Theme Examples"
for theme in "${THEMES[@]}"; do
  print_subheader "Theme: $theme"
  echo -n "Result: "
  run_statusline "$BASE_JSON" "STATUSLINE_THEME=$theme"
done

# 2. Separator Profile Examples
print_header "2. Separator Profile Examples"
for profile in "${SEPARATOR_PROFILES[@]}"; do
  print_subheader "Separator Profile: $profile"
  echo -n "Result: "
  run_statusline "$BASE_JSON" "STATUSLINE_SEPARATOR_PROFILE=$profile"
done

# 3. Different Models
print_header "3. Different Models"
for model in "${MODELS[@]}"; do
  model_name=$(echo "$model" | jq -r '.display_name')
  print_subheader "Model: $model_name"
  
  # Create JSON with different model
  modified_json=$(echo "$BASE_JSON" | jq --argjson model "$model" '.model = $model')
  echo -n "Result: "
  run_statusline "$modified_json"
done

# 4. Different Directories
print_header "4. Different Directory Paths"
for dir in "${DIRECTORIES[@]}"; do
  print_subheader "Directory: $dir"
  
  # Create JSON with different directory
  modified_json=$(echo "$BASE_JSON" | jq --arg dir "$dir" '.workspace.current_dir = $dir')
  echo -n "Result: "
  run_statusline "$modified_json"
done

# 5. Segment Visibility Examples
print_header "5. Segment Visibility Examples"

print_subheader "All segments visible (default)"
echo -n "Result: "
run_statusline "$BASE_JSON"

print_subheader "Hide session segment"
echo -n "Result: "
run_statusline "$BASE_JSON" "STATUSLINE_SHOW_SESSION=false"

print_subheader "Hide git segment"
echo -n "Result: "
run_statusline "$BASE_JSON" "STATUSLINE_SHOW_GIT=false"

print_subheader "Hide model segment"
echo -n "Result: "
run_statusline "$BASE_JSON" "STATUSLINE_SHOW_MODEL=false"

print_subheader "Hide directory segment"
echo -n "Result: "
run_statusline "$BASE_JSON" "STATUSLINE_SHOW_DIRECTORY=false"

print_subheader "Only model and directory"
echo -n "Result: "
run_statusline "$BASE_JSON" "STATUSLINE_SHOW_GIT=false STATUSLINE_SHOW_SESSION=false"

print_subheader "Only git and directory"
echo -n "Result: "
run_statusline "$BASE_JSON" "STATUSLINE_SHOW_MODEL=false STATUSLINE_SHOW_SESSION=false"

# 6. Combined Theme and Profile Examples
print_header "6. Theme + Separator Profile Combinations"

combinations=(
  "minimal:all-curvy"
  "expressive:electric-chaos"
  "subtle:mixed-dynamic"
  "electric:minimal-clean"
  "curvy:all-angly"
  "angular:all-curvy"
)

for combo in "${combinations[@]}"; do
  IFS=':' read -r theme profile <<< "$combo"
  print_subheader "Theme: $theme + Profile: $profile"
  echo -n "Result: "
  run_statusline "$BASE_JSON" "STATUSLINE_THEME=$theme STATUSLINE_SEPARATOR_PROFILE=$profile"
done

# 7. Git Status Scenarios
print_header "7. Git Status Scenarios"

print_subheader "Clean git repository (current state)"
echo -n "Result: "
run_statusline "$BASE_JSON"

print_subheader "With dirty git (simulated by adding untracked file)"
echo "Creating temporary file to make git dirty..."
touch temp_demo_file.txt
echo -n "Result: "
run_statusline "$BASE_JSON"
rm -f temp_demo_file.txt

print_subheader "No git repository (simulated directory)"
no_git_json=$(echo "$BASE_JSON" | jq '.workspace.current_dir = "/tmp"')
echo -n "Result: "
run_statusline "$no_git_json"

# 8. Session Data Scenarios
print_header "8. Session Data Scenarios"

print_subheader "With session data"
echo -n "Result: "
run_statusline "$BASE_JSON"

print_subheader "Without session data"
no_session_json=$(echo "$BASE_JSON" | jq 'del(.transcript_path)')
echo -n "Result: "
run_statusline "$no_session_json"

# 9. Edge Cases
print_header "9. Edge Cases and Special Scenarios"

print_subheader "Very long directory name"
long_dir_json=$(echo "$BASE_JSON" | jq '.workspace.current_dir = "/home/user/very/deeply/nested/directory/structure/with/extremely/long/path/names"')
echo -n "Result: "
run_statusline "$long_dir_json"

print_subheader "Root directory"
root_json=$(echo "$BASE_JSON" | jq '.workspace.current_dir = "/"')
echo -n "Result: "
run_statusline "$root_json"

print_subheader "Empty model name"
empty_model_json=$(echo "$BASE_JSON" | jq '.model.display_name = ""')
echo -n "Result: "
run_statusline "$empty_model_json"

# 10. Performance Test
print_header "10. Rapid Fire Demo (Performance Test)"
echo "Running multiple configurations rapidly..."

count=0
for theme in "minimal" "expressive" "electric"; do
  for profile in "all-curvy" "mixed-dynamic"; do
    for show_session in "true" "false"; do
      ((count++))
      echo -n "Config $count: "
      run_statusline "$BASE_JSON" "STATUSLINE_THEME=$theme STATUSLINE_SEPARATOR_PROFILE=$profile STATUSLINE_SHOW_SESSION=$show_session"
    done
  done
done

# Cleanup
rm -f demo-transcript.jsonl temp_demo_file.txt

print_header "Demo Complete!"
echo -e "${GREEN}All examples have been demonstrated.${NC}"
echo -e "${CYAN}You can now experiment with your own configurations!${NC}"
echo ""
echo -e "${YELLOW}Available environment variables:${NC}"
echo "  STATUSLINE_THEME: minimal, expressive, subtle, electric, curvy, angular"
echo "  STATUSLINE_SEPARATOR_PROFILE: all-curvy, all-angly, mixed-dynamic, minimal-clean, electric-chaos"
echo "  STATUSLINE_SHOW_MODEL: true/false"
echo "  STATUSLINE_SHOW_DIRECTORY: true/false"
echo "  STATUSLINE_SHOW_GIT: true/false"
echo "  STATUSLINE_SHOW_SESSION: true/false"
echo ""
echo -e "${YELLOW}Example usage:${NC}"
echo "  STATUSLINE_THEME=electric echo '$BASE_JSON' | node dist/statusline.js"