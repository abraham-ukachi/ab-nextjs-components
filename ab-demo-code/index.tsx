/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbDemoCode (port of lyd-demo-code; 0.6.0: built on AbCodeBlock)
* @file: ab-demo-code/index.tsx
* @type: Server-safe component (the copy button is AbCodeBlock's client island)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbDemoCode language="tsx" code={`<AbButton label="Save" />`} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ReactElement, ReactNode } from 'react';
import { forwardRef } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 💻 the docs code block (header, focusable <pre>, AbIcon copy button with a polite "Copied")
import AbCodeBlock from '../ab-code-block';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props (the 0.1.x shape, plus the AbCodeBlock options a preview pair needs) */
export interface AbDemoCodeProps {
  className?: string; // 🏷️
  hidden?: boolean; // 🙈
  language?: 'tsx' | 'css' | 'ts' | 'js' | string; // 🔤 default 'tsx'
  code: string; // 📋 the raw source (shown when there is no `trustedHtml` / `children`, always what Copy copies)
  trustedHtml?: string; // 🧾 0.6.0: Shiki `codeToHtml` output, ⚠️ NOT sanitized: trusted HTML only, never user input (prefer children)
  children?: ReactNode; // 🖍️ 0.6.0: OR an already highlighted <pre> (e.g. an MDX fenced block)
  filename?: string; // 📄 0.6.0
  copyLabel?: string; // ♿ 0.6.0 (default "Copy code")
  copiedLabel?: string; // ✅ 0.6.0 (default "Copied")
}

/**
 * 💻 AbDemoCode — the source half of a preview pair. Since 0.6.0 it is an AbCodeBlock, so it shares the
 * highlighted rendering, the named + focusable <pre> and the SVG copy button (no icon font, no local timer).
 * The plain fallback is a <pre><code> of `code` (React escapes it; nothing is ever evaluated).
 */
const AbDemoCode = forwardRef<HTMLDivElement, AbDemoCodeProps>(function AbDemoCode(
  { className, hidden = false, language = 'tsx', code, trustedHtml, children, filename, copyLabel, copiedLabel },
  ref,
): ReactElement {
  return (
    <div ref={ref} hidden={hidden} className={clsx('AbDemoCode', styles.abDemoCode, className)} data-ab-part="demo-code">
      <AbCodeBlock code={code} trustedHtml={trustedHtml} language={language} filename={filename} copyLabel={copyLabel} copiedLabel={copiedLabel}>
        {children ?? <pre><code>{code}</code></pre> /* 🧾 plain, escaped */}
      </AbCodeBlock>
    </div>
  );
});

// 📦 exports
export default AbDemoCode;
export { AbDemoCode };
