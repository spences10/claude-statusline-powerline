export interface ClaudeStatusInput {
  session_id: string;
  model: {
    id?: string;
    display_name: string;
  };
  workspace: {
    current_dir: string;
    project_dir?: string;
  };
}

export interface GitInfo {
  branch: string;
  isDirty: boolean;
}

export interface StatusSegment {
  content: string;
  bgColor: string;
  fgColor: string;
}