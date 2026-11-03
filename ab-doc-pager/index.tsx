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
* @name: AbDocPager (0.3.4, Joseph 0.2.24 MDX docs)
* @file: ab-doc-pager/index.tsx
* @type: Server-safe component (links via AbLinkProvider)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbDocPager prev={{ href: '/docs/install', title: 'Install' }} next={{ href: '/docs/theme', title: 'Theme' }} />
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
// 🔗 the app's link (AbLinkProvider, e.g. the i18n Link)
import Link from '../ab-link';
// 🔣 the arrows (server-safe icon)
import AbIcon from '../server/ab-icon';
// 🎨 styles
import styles from './styles.module.css';

/** 🔗 one side of the pager */
export interface AbDocPagerLink {
  href: string; // 🔗
  title: ReactNode; // 🏷️ the page's title
}

/** ⚙️ props */
export interface AbDocPagerProps {
  prev?: AbDocPagerLink | null; // ⬅️ the previous page (none on the first)
  next?: AbDocPagerLink | null; // ➡️ the next page (none on the last)
  labels?: { nav?: string; prev?: string; next?: string }; // 🌍 "Pages", "Previous", "Next"
  className?: string; // 🏷️
}

/**
 * ⏮️⏭️ AbDocPager — the "Previous / Next" cards at the end of a docs page. A <nav> named "Pages"; each card is
 * one link (≥ 44px tall) whose name reads "Previous: Install" (the small label is part of the link text).
 * rel="prev" / rel="next" for crawlers. Server-safe: no hooks of its own.
 */
const AbDocPager = ({ prev, next, labels = {}, className }: AbDocPagerProps): ReactElement | null => {
  const L = { nav: 'Pages', prev: 'Previous', next: 'Next', ...labels }; // 🌍
  if (!prev && !next) return null; // 🙅 nothing to show
  return (
    <nav aria-label={L.nav} className={clsx('AbDocPager', 'ab-prose-none', styles.abDocPager, className)} data-ab-part="doc-pager">
      {prev ? (
        <Link href={prev.href} rel="prev" className={styles.abDocPagerLink} data-ab-part="doc-pager-prev">
          <span className={styles.abDocPagerHint}><AbIcon name="arrow_back" size={16} />{L.prev}<span className={styles.srOnly}>: </span></span>
          <span className={styles.abDocPagerTitle}>{prev.title}</span>
        </Link>
      ) : <span aria-hidden="true" />}
      {next && (
        <Link href={next.href} rel="next" className={clsx(styles.abDocPagerLink, styles.abDocPagerNext)} data-ab-part="doc-pager-next">
          <span className={styles.abDocPagerHint}>{L.next}<span className={styles.srOnly}>: </span><AbIcon name="arrow_forward" size={16} /></span>
          <span className={styles.abDocPagerTitle}>{next.title}</span>
        </Link>
      )}
    </nav>
  );
};

// 📦 exports
export default AbDocPager;
export { AbDocPager };
