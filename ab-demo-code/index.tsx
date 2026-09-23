/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbDemoCode - Client (port of lyd-demo-code; prism soft-optional)
* @file: ab-demo-code/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbDemoCodeProps {
  className?: string;
  hidden?: boolean;
  language?: 'tsx' | 'css' | 'ts' | 'js' | string;
  code: string;
}

const AbDemoCode = forwardRef<HTMLDivElement, AbDemoCodeProps>(function AbDemoCode(
  { className, hidden = false, language = 'tsx', code },
  ref,
): ReactElement {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div ref={ref} hidden={hidden} className={clsx('AbDemoCode', styles.abDemoCode, className)}>
      <div className={styles.abDemoCodeHeader}>
        <span>{language}</span>
        <button type="button" className={styles.abDemoCodeCopy} onClick={copy} aria-label="Copy code">
          <span className="material-symbols-rounded" aria-hidden style={{ fontSize: 16 }}>
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={styles.abDemoCodePre}>
        <code className={styles.abDemoCodeCode}>{code}</code>
      </pre>
    </div>
  );
});

export default AbDemoCode;
export { AbDemoCode };
