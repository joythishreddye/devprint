// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  generateClaudeConfig,
  generateGeminiConfig,
  generateCopilotConfig,
  generateAllConfigs,
} from '../generate-config';
import type { ProjectSelections } from '@/types/generators';
import { CONFIG_FORMAT } from '@/types/generators';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const fullSelections: ProjectSelections = {
  projectName: 'my-app',
  description: 'A full-stack web application',
  frontend: 'Next.js',
  backend: 'Node.js',
  database: 'PostgreSQL',
  styling: 'Tailwind CSS',
  testing: 'Vitest',
  deployment: 'Vercel',
};

const minimalSelections: ProjectSelections = {
  projectName: 'bare-project',
  description: 'Minimal project',
  frontend: null,
  backend: null,
  database: null,
  styling: null,
  testing: null,
  deployment: null,
};

// ─── generateClaudeConfig ─────────────────────────────────────────────────────

describe('generateClaudeConfig', () => {
  it('returns format "claude"', () => {
    expect(generateClaudeConfig(fullSelections).format).toBe(CONFIG_FORMAT.claude);
  });

  it('returns filename "CLAUDE.md"', () => {
    expect(generateClaudeConfig(fullSelections).filename).toBe('CLAUDE.md');
  });

  it('content contains the project name', () => {
    expect(generateClaudeConfig(fullSelections).content).toContain('my-app');
  });

  it('content contains the project description', () => {
    expect(generateClaudeConfig(fullSelections).content).toContain('A full-stack web application');
  });

  it('content includes selected frontend technology', () => {
    expect(generateClaudeConfig(fullSelections).content).toContain('Next.js');
  });

  it('content includes selected database', () => {
    expect(generateClaudeConfig(fullSelections).content).toContain('PostgreSQL');
  });

  it('content includes selected testing framework', () => {
    expect(generateClaudeConfig(fullSelections).content).toContain('Vitest');
  });

  it('content includes deployment target when set', () => {
    expect(generateClaudeConfig(fullSelections).content).toContain('Vercel');
  });

  it('omits null selections gracefully — no "null" or "undefined" in output', () => {
    const result = generateClaudeConfig(minimalSelections);
    expect(result.content).not.toContain('null');
    expect(result.content).not.toContain('undefined');
  });

  it('content is a non-empty string for minimal selections', () => {
    const result = generateClaudeConfig(minimalSelections);
    expect(typeof result.content).toBe('string');
    expect(result.content.length).toBeGreaterThan(0);
  });

  it('does not include deployment section text when deployment is null', () => {
    expect(generateClaudeConfig(minimalSelections).content).not.toContain('Deploy target');
  });
});

// ─── generateGeminiConfig ─────────────────────────────────────────────────────

describe('generateGeminiConfig', () => {
  it('returns format "gemini"', () => {
    expect(generateGeminiConfig(fullSelections).format).toBe(CONFIG_FORMAT.gemini);
  });

  it('returns filename "GEMINI.md"', () => {
    expect(generateGeminiConfig(fullSelections).filename).toBe('GEMINI.md');
  });

  it('content contains the project name', () => {
    expect(generateGeminiConfig(fullSelections).content).toContain('my-app');
  });

  it('content contains the project description', () => {
    expect(generateGeminiConfig(fullSelections).content).toContain('A full-stack web application');
  });

  it('content includes selected styling framework', () => {
    expect(generateGeminiConfig(fullSelections).content).toContain('Tailwind CSS');
  });

  it('omits null selections gracefully', () => {
    const result = generateGeminiConfig(minimalSelections);
    expect(result.content).not.toContain('null');
    expect(result.content).not.toContain('undefined');
  });

  it('content is a non-empty string for minimal selections', () => {
    const result = generateGeminiConfig(minimalSelections);
    expect(typeof result.content).toBe('string');
    expect(result.content.length).toBeGreaterThan(0);
  });
});

// ─── generateCopilotConfig ────────────────────────────────────────────────────

describe('generateCopilotConfig', () => {
  it('returns format "copilot"', () => {
    expect(generateCopilotConfig(fullSelections).format).toBe(CONFIG_FORMAT.copilot);
  });

  it('returns filename ".github/copilot-instructions.md"', () => {
    expect(generateCopilotConfig(fullSelections).filename).toBe('.github/copilot-instructions.md');
  });

  it('content contains the project name', () => {
    expect(generateCopilotConfig(fullSelections).content).toContain('my-app');
  });

  it('content contains the project description', () => {
    expect(generateCopilotConfig(fullSelections).content).toContain('A full-stack web application');
  });

  it('content includes backend technology', () => {
    expect(generateCopilotConfig(fullSelections).content).toContain('Node.js');
  });

  it('omits null selections gracefully', () => {
    const result = generateCopilotConfig(minimalSelections);
    expect(result.content).not.toContain('null');
    expect(result.content).not.toContain('undefined');
  });

  it('content is a non-empty string for minimal selections', () => {
    const result = generateCopilotConfig(minimalSelections);
    expect(typeof result.content).toBe('string');
    expect(result.content.length).toBeGreaterThan(0);
  });
});

// ─── generateAllConfigs ───────────────────────────────────────────────────────

describe('generateAllConfigs', () => {
  it('returns all 3 config formats', () => {
    const result = generateAllConfigs(fullSelections);
    const formats = result.configs.map((c) => c.format);
    expect(formats).toContain(CONFIG_FORMAT.claude);
    expect(formats).toContain(CONFIG_FORMAT.gemini);
    expect(formats).toContain(CONFIG_FORMAT.copilot);
    expect(result.configs).toHaveLength(3);
  });

  it('returns the correct projectName', () => {
    expect(generateAllConfigs(fullSelections).projectName).toBe('my-app');
  });

  it('each config has a non-empty filename', () => {
    for (const config of generateAllConfigs(fullSelections).configs) {
      expect(config.filename.length).toBeGreaterThan(0);
    }
  });

  it('each config has a non-empty content string', () => {
    for (const config of generateAllConfigs(fullSelections).configs) {
      expect(config.content.length).toBeGreaterThan(0);
    }
  });

  it('works with minimal (all-null) selections', () => {
    expect(() => generateAllConfigs(minimalSelections)).not.toThrow();
    expect(generateAllConfigs(minimalSelections).configs).toHaveLength(3);
  });

  it('all configs contain the project name', () => {
    for (const config of generateAllConfigs(fullSelections).configs) {
      expect(config.content).toContain('my-app');
    }
  });

  it('no config content contains "null" or "undefined" strings', () => {
    for (const config of generateAllConfigs(fullSelections).configs) {
      expect(config.content).not.toContain('null');
      expect(config.content).not.toContain('undefined');
    }
  });

  it('filenames are unique across configs', () => {
    const filenames = generateAllConfigs(fullSelections).configs.map((c) => c.filename);
    expect(new Set(filenames).size).toBe(filenames.length);
  });
});
