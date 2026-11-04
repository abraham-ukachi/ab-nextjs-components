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
* @name: AbCodeBlock (0.3.4, QA 0.2.24 MDX docs)
* @file: ab-code-block/index.tsx
* @type: Server component (no hooks; the copy button is a client island)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbCodeBlock filename="app/page.tsx" language="tsx" code={source} trustedHtml={await codeToHtml(source, …)} />
*   2+|> <AbCodeBlock language="bash" copyLabel={t('copy')} copiedLabel={t('copied')}><pre><code>pnpm add ab-nextjs-components</code></pre></AbCodeBlock>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 📋 the copy button (the only client part)
import AbCodeBlockCopy from './copy';
// 🎨 styles
import styles from './styles.module.css';

/**
 * 🚨 risky patterns in a `trustedHtml` string (dev warning only, NOT a sanitizer):
 * <script, an on…= event handler, javascript:, <iframe, srcdoc
 */
const AB_RISKY_HTML: ReadonlyArray<[string, RegExp]> = [
  ['<script', /<script\b/i], // 📜 inline script
  ['on…= handler', /\son[a-z]+\s*=/i], // 🖱️ onclick=, onerror=, …
  ['javascript:', /javascript\s*:/i], // 🔗 script URL
  ['<iframe', /<iframe\b/i], // 🪟 embedded frame
  ['srcdoc', /\bsrcdoc\b/i], // 📄 inline frame document
];

/** ⚠️ dev only: warn when `trustedHtml` looks like it carries script (silent in production) */
export function warnAbRiskyHtml(html: string, where = 'AbCodeBlock'): void {
  if (process.env.NODE_ENV === 'production') return; // 🤫 never in production
  const hits = AB_RISKY_HTML.filter(([, re]) => re.test(html)).map(([n]) => n); // 🔎
  if (hits.length) console.warn(`[${where}] trustedHtml contains ${hits.join(', ')}. It is injected without sanitizing: only pass HTML you render yourself (e.g. Shiki), never user input. Prefer \`highlighted\`/children.`); // ⚠️
}

/**
 * ⌨️ 0.4.0: a plain <pre> gets tabIndex 0 (keyboard users can scroll long lines with the arrow keys) and a name.
 * Shiki's <pre tabindex="0"> keeps its own tabindex (never doubled); an existing aria-label is never replaced.
 */
function withAbFocusablePre(children: ReactNode, name?: string): ReactNode {
  return Children.map(children, (c) => {
    if (!isValidElement<Record<string, unknown>>(c) || c.type !== 'pre') return c; // 🙅 only a direct <pre>
    const extra: Record<string, unknown> = {}; // 🧩 what we add
    if (c.props.tabIndex == null && c.props.tabindex == null) extra.tabIndex = 0; // ⌨️ focusable
    if (name && c.props['aria-label'] == null && c.props['aria-labelledby'] == null) extra['aria-label'] = name; // 🏷️ named
    return Object.keys(extra).length ? cloneElement(c, extra) : c; // ✅
  });
}

/** ⚙️ props */
export interface AbCodeBlockProps {
  children?: ReactNode; // 🖍️ Shiki-rendered (or plain) <pre><code>…</code></pre>, e.g. from rehype-pretty-code in MDX
  /**
   * 🧾 OR a pre-rendered HTML string (Shiki `codeToHtml`). ⚠️ Injected via dangerouslySetInnerHTML WITHOUT
   * sanitizing: it MUST be trusted (you render it at build/server time), never user input. Prefer children.
   */
  trustedHtml?: string;
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
 * the highlighted code (children or a `trustedHtml` string, both from Shiki), and a small client copy button. It is a
 * <figure> (with a <figcaption> when there is a header), so the caption names the code for assistive tech; the
 * <pre> is focusable (Shiki's tabindex kept, a plain one gets tabIndex 0) and named, so keyboard users can scroll it.
 */
const AbCodeBlock = ({ children, trustedHtml, code, title, filename, language, copyLabel = 'Copy code', copiedLabel = 'Copied', copy = true, className }: AbCodeBlockProps): ReactElement => {
  const hasHeader = title != null || !!filename || !!language; // 🏷️ a header bar?
  const caption = (title ?? filename) != null; // 💬 a visible name for the figure
  // 🏷️ the scroller's name: the title (if text), else the filename, else "<language> code"
  const preName = typeof title === 'string' ? title : filename || (language ? `${language} code` : undefined);
  if (trustedHtml != null) warnAbRiskyHtml(trustedHtml); // ⚠️ dev-only check
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
        {trustedHtml != null
          ? <div
              className={styles.abCodeBlockCode}
              data-ab-part="code-block-code"
              tabIndex={0} // ⌨️ 0.6.0: the WRAPPER is focusable (no regex patching of the HTML string)
              aria-label={preName} // 🏷️ and named
              dangerouslySetInnerHTML={{ __html: trustedHtml }} // 🧾 trusted Shiki string, injected as-is
            />
          : <div className={styles.abCodeBlockCode} data-ab-part="code-block-code">{withAbFocusablePre(children, preName)}</div> /* 🖍️ Shiki children (+ a focusable, named <pre>) */}
        {copy && <AbCodeBlockCopy code={code} label={copyLabel} copiedLabel={copiedLabel} /> /* 📋 client island */}
      </div>
    </figure>
  );
};

// 📦 exports
export default AbCodeBlock;
export { AbCodeBlock };
