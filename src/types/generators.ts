export interface ProjectSelections {
  projectName: string;
  description: string;
  frontend: string | null;
  backend: string | null;
  database: string | null;
  styling: string | null;
  testing: string | null;
  deployment: string | null;
}

export const CONFIG_FORMAT = {
  claude: 'claude',
  gemini: 'gemini',
  copilot: 'copilot',
} as const;

export type ConfigFormat = typeof CONFIG_FORMAT[keyof typeof CONFIG_FORMAT];

export interface GeneratedConfig {
  format: ConfigFormat;
  filename: string;
  content: string;
}

export interface GenerateConfigResult {
  projectName: string;
  configs: GeneratedConfig[];
}
