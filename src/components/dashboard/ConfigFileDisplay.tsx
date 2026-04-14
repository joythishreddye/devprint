import type { GeneratedConfig } from '@/types/generators';
import { CopyConfigButton } from './CopyConfigButton';

export interface ConfigFileDisplayProps {
  config: GeneratedConfig;
}

export function ConfigFileDisplay({ config }: ConfigFileDisplayProps) {
  return (
    <div className="rounded-xl border border-zinc-200 overflow-hidden">
      <div className="flex items-center justify-between bg-zinc-50 px-4 py-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-700">{config.filename}</span>
          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-500 capitalize">
            {config.format}
          </span>
        </div>
        <CopyConfigButton content={config.content} filename={config.filename} />
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap">
        {config.content}
      </pre>
    </div>
  );
}
