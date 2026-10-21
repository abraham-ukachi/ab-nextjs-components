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
* @name: AbTocPromo (0.2.1, God 02:44, mock .toc-card)
* @file: ab-toc/promo.tsx
* @type: React Component (no hooks: client + server)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage (in AbToc `footer`, or anywhere in the aside):
*   <AbTocPromo title="BottomNav & Sheet" href="/changelog">Now in <code>ab-nextjs-components</code></AbTocPromo>
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
// 🔗 injectable link
import Link from '../ab-link';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props */
export interface AbTocPromoProps {
  title: ReactNode; // 🏷️ 13px bold, e.g. "BottomNav & Sheet"
  children?: ReactNode; // 📝 the 11.5px muted subtitle (a `<code>` inside is 10.5px)
  badge?: ReactNode; // 🆕 the small chip (default "New"; `null` = none)
  href?: string; // 🔗 makes the title a link (the whole card clicks)
  className?: string; // 🏷️
}

/**
 * 🆕 AbTocPromo — the aside's "New" card (mock `.toc-card`): a rounded (12px), evenly padded (12px) container on
 * the card colour with a 1px border; a small "New" chip, a smaller title and a relatively smaller subtitle.
 */
const AbTocPromo = ({ title, children, badge = 'New', href, className }: AbTocPromoProps): ReactElement => (
  <aside className={clsx('AbTocPromo', styles.abTocPromo, className)} data-ab-part="toc-promo">
    {badge != null && <span className={styles.abTocPromoChip}>{badge}</span> /* 🆕 */}
    <b className={styles.abTocPromoTitle}>{href ? <Link href={href} className={styles.abTocPromoLink}>{title}</Link> : title}</b> {/* 🏷️ */}
    {children != null && <small className={styles.abTocPromoText}>{children}</small> /* 📝 */}
  </aside>
);

// 📦 exports
export default AbTocPromo;
export { AbTocPromo };
