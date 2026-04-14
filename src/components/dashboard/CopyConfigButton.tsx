'use client';

import { useState } from 'react';

export interface CopyConfigButtonProps {
  content: string;
  filename: string;
}

export function CopyConfigButton({ content, filename }: CopyConfigButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
      aria-label={`Copy ${filename} to clipboard`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
