/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-components
* @name: AbCodeBlock (0.3.4, Joseph 0.2.24 MDX docs)
* @file: ab-code-block/index.tsx
* @type: Server component (no hooks; the copy button is a client island)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbCodeBlock filename="app/page.tsx" language="tsx" code={source} html={await codeToHtml(source, …)} />
*   2+|> <AbCodeBlock language="bash" copyLabel={t('copy')} copiedLabel={t('copied')}><pre><code>pnpm add ab-nextjs-components</code></pre></AbCodeBlock>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 📋 the copy button (the only client part)
import AbCodeBlockCopy from './copy';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props */
export interface AbCodeBlockProps {
  children?: ReactNode; // 🖍️ Shiki-rendered (or plain) <pre><code>…</code></pre>, e.g. from rehype-pretty-code in MDX
  html?: string; // 🧾 OR a pre-rendered HTML string (Shiki `codeToHtml`), trusted: YOU render it, never user input
  code?: string; // 📋 the raw source to copy (best). Without it the button copies the rendered <pre>'s text
  title?: ReactNode; // 🏷️ a caption in the header bar (e.g. "Install")
  filename?: string; // 📄 a file name in the header bar (mono), e.g. "app/page.tsx"
  language?: string; // 🔤 e.g. "tsx": a small badge + data-language (+ the region's name when there is no title)
  copyLabel?: string; // ♿ the copy button's name (default "Copy code")
  copiedLabel?: string; // ✅ announced after a copy (default "Copied")
  copy?: boolean; // 📋 show the copy button (default true)
  className?: string; // 🏷️
}

/**
 * 💻 AbCodeBlock — a server-rendered code block for MDX docs: an optional header (title / filename · language),
 * the highlighted code (children or an `html` string, both from Shiki), and a small client copy button. It is a
 * <figure> (with a <figcaption> when there is a header), so the caption names the code for assistive tech; Shiki's
 * <pre tabindex="0"> stays focusable, so keyboard users can scroll long lines.
 */
const AbCodeBlock = ({ children, html, code, title, filename, language, copyLabel = 'Copy code', copiedLabel = 'Copied', copy = true, className }: AbCodeBlockProps): ReactElement => {
  const hasHeader = title != null || !!filename || !!language; // 🏷️ a header bar?
  const caption = (title ?? filename) != null; // 💬 a visible name for the figure
  return (
    <figure
      className={clsx('AbCodeBlock', 'ab-prose-none', styles.abCodeBlock, className)} // 🎨 (opts out of theme .ab-prose)
      data-ab-part="code-block" // 🗂️ the copy island finds its <pre> through this
      data-language={language || undefined} // 🔤
      aria-label={!caption && language ? `${language} code` : undefined} // ♿ a name when nothing else gives one
    >
      {hasHeader && (
        <figcaption className={styles.abCodeBlockHead} data-ab-part="code-block-head">
          {title != null && <span className={styles.abCodeBlockTitle}>{title}</span> /* 🏷️ */}
          {filename && <span className={styles.abCodeBlockFile} translate="no">{filename}</span> /* 📄 */}
          {language && <span className={styles.abCodeBlockLang} aria-hidden={caption ? undefined : true} translate="no">{language}</span> /* 🔤 */}
        </figcaption>
      )}
      <div className={styles.abCodeBlockBody}>
        {html != null
          ? <div className={styles.abCodeBlockCode} data-ab-part="code-block-code" dangerouslySetInnerHTML={{ __html: html }} /> // 🧾 Shiki string
          : <div className={styles.abCodeBlockCode} data-ab-part="code-block-code">{children}</div> /* 🖍️ Shiki children */}
        {copy && <AbCodeBlockCopy code={code} label={copyLabel} copiedLabel={copiedLabel} /> /* 📋 client island */}
      </div>
    </figure>
  );
};

// 📦 exports
export default AbCodeBlock;
export { AbCodeBlock };
