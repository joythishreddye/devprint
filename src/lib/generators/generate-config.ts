import type { ProjectSelections, GeneratedConfig, GenerateConfigResult } from '@/types/generators';
import { CONFIG_FORMAT } from '@/types/generators';

// ─── Template helpers ─────────────────────────────────────────────────────────

function lines(...parts: string[]): string {
  return parts.join('\n');
}

function techStack(selections: ProjectSelections): string {
  const entries: string[] = [];
  if (selections.frontend) entries.push(`- **Frontend**: ${selections.frontend}`);
  if (selections.backend) entries.push(`- **Backend**: ${selections.backend}`);
  if (selections.database) entries.push(`- **Database**: ${selections.database}`);
  if (selections.styling) entries.push(`- **Styling**: ${selections.styling}`);
  if (selections.testing) entries.push(`- **Testing**: ${selections.testing}`);
  if (selections.deployment) entries.push(`- **Deploy target**: ${selections.deployment}`);
  return entries.length > 0 ? entries.join('\n') : '- (no technologies selected)';
}

function techList(selections: ProjectSelections): string {
  const items = [
    selections.frontend,
    selections.backend,
    selections.database,
    selections.styling,
    selections.testing,
  ].filter((t): t is string => t !== null);
  return items.length > 0 ? items.join(', ') : 'none specified';
}

// ─── Format generators ────────────────────────────────────────────────────────

export function generateClaudeConfig(selections: ProjectSelections): GeneratedConfig {
  const { projectName, description } = selections;
  const content = lines(
    `# ${projectName} — Claude Code Configuration`,
    '',
    `## Project Overview`,
    '',
    description,
    '',
    `## Tech Stack`,
    '',
    techStack(selections),
    '',
    `## Key Conventions`,
    '',
    `- Follow the established patterns for ${techList(selections)}`,
    `- Write tests before implementation (TDD)`,
    `- Keep business logic out of components`,
    `- Validate all external input before processing`,
  );
  return { format: CONFIG_FORMAT.claude, filename: 'CLAUDE.md', content };
}

export function generateGeminiConfig(selections: ProjectSelections): GeneratedConfig {
  const { projectName, description } = selections;
  const content = lines(
    `# ${projectName}`,
    '',
    `## Project Description`,
    '',
    description,
    '',
    `## Tech Stack`,
    '',
    techStack(selections),
    '',
    `## Development Guidelines`,
    '',
    `- Use ${techList(selections)} according to their respective best practices`,
    `- Prefer immutable data patterns`,
    `- Handle errors explicitly at every boundary`,
  );
  return { format: CONFIG_FORMAT.gemini, filename: 'GEMINI.md', content };
}

export function generateCopilotConfig(selections: ProjectSelections): GeneratedConfig {
  const { projectName, description } = selections;
  const content = lines(
    `# Copilot Instructions for ${projectName}`,
    '',
    `## About This Project`,
    '',
    description,
    '',
    `## Stack & Tools`,
    '',
    techStack(selections),
    '',
    `## Coding Guidelines`,
    '',
    `- Follow conventions for ${techList(selections)}`,
    `- Write descriptive variable and function names`,
    `- Add tests for all new functionality`,
  );
  return { format: CONFIG_FORMAT.copilot, filename: '.github/copilot-instructions.md', content };
}

export function generateAllConfigs(selections: ProjectSelections): GenerateConfigResult {
  return {
    projectName: selections.projectName,
    configs: [
      generateClaudeConfig(selections),
      generateGeminiConfig(selections),
      generateCopilotConfig(selections),
    ],
  };
}
