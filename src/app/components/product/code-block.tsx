'use client';

import ForgeIcon from '@/app/components/brand/forge-icon';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

export type CodeSnippet = {
  label: string;
  code: string;
  language?: string;
};

type CodeBlockProps = {
  title?: string;
  eyebrow?: string;
  copyable?: boolean;
  showLineNumbers?: boolean;
  snippets: readonly CodeSnippet[];
  defaultSnippet?: number;
};

export default function CodeBlock({
  title = `Forge terminal`,
  eyebrow = `CLI`,
  copyable = true,
  snippets,
  defaultSnippet = 0,
  showLineNumbers = true,
}: CodeBlockProps) {
  const codeBlockId = useId();
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<number | null>(null);
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(() => Math.max(0, Math.min(defaultSnippet, snippets.length - 1)));
  const activeSnippet = snippets[activeSnippetIndex] ?? snippets[0];

  useEffect(() => {
    if (activeSnippetIndex < snippets.length) return;
    setActiveSnippetIndex(0);
  }, [activeSnippetIndex, snippets.length]);

  useEffect(() => () => {
    if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
  }, []);

  const selectSnippet = (index: number) => {
    setCopied(false);
    setActiveSnippetIndex(index);
  };

  const handleSnippetKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === `ArrowRight`) nextIndex = (index + 1) % snippets.length;
    else if (event.key === `ArrowLeft`) nextIndex = (index - 1 + snippets.length) % snippets.length;
    else if (event.key === `Home`) nextIndex = 0;
    else if (event.key === `End`) nextIndex = snippets.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    selectSnippet(nextIndex);
    document.getElementById(`${codeBlockId}-tab-${nextIndex}`)?.focus();
  };

  const copySnippet = async () => {
    if (!activeSnippet || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(activeSnippet.code);
    } catch {
      return;
    }
    setCopied(true);

    if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = window.setTimeout(() => setCopied(false), 1800);
  };

  if (!activeSnippet) return null;

  return (
    <section className="codeBlock" aria-label={title}>
      <div className="codeBlockChrome">
        <div className="codeBlockIdentity">
          <span className="codeBlockLights" aria-hidden="true"><i /><i /><i /></span>
          <span>{eyebrow}</span>
          <strong>{title}</strong>
        </div>
        {copyable ? (
          <button type="button" className="codeBlockCopy" onClick={copySnippet} aria-live="polite" aria-label={`Copy ${activeSnippet.label} code`}>
            <ForgeIcon name={copied ? `shield` : `terminal`} />
            {copied ? `Copied` : `Copy`}
          </button>
        ) : null}
      </div>

      {snippets.length > 1 ? (
        <div className="codeBlockTabs" role="tablist" aria-label={`${title} examples`}>
          {snippets.map((snippet, index) => (
            <button
              type="button"
              role="tab"
              id={`${codeBlockId}-tab-${index}`}
              key={snippet.label}
              tabIndex={index === activeSnippetIndex ? 0 : -1}
              aria-controls={`${codeBlockId}-panel`}
              aria-selected={index === activeSnippetIndex}
              className={index === activeSnippetIndex ? `active` : ``}
              onClick={() => selectSnippet(index)}
              onKeyDown={(event) => handleSnippetKeyDown(event, index)}
            >
              {snippet.label}
            </button>
          ))}
        </div>
      ) : null}

      <pre
        role="tabpanel"
        id={`${codeBlockId}-panel`}
        className="codeBlockPre"
        data-language={activeSnippet.language ?? `shell`}
        aria-labelledby={snippets.length > 1 ? `${codeBlockId}-tab-${activeSnippetIndex}` : undefined}
      >
        <code>
          {activeSnippet.code.split(`\n`).map((line, index) => (
            <span className="codeBlockLine" key={`${index}-${line}`}>
              {showLineNumbers ? <span className="codeBlockLineNumber">{String(index + 1).padStart(2, `0`)}</span> : null}
              <span className={line.startsWith(`$`) ? `codeBlockCommand` : ``}>{line || ` `}</span>
            </span>
          ))}
        </code>
      </pre>
    </section>
  );
}
