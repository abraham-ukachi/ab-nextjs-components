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
* @name: AbList + AbListItem (P13)
* @file: ab-list/index.tsx
* @type: Server-safe component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbList><AbListItem href="/guides/install" media={<AbIcon name="rocket_launch" />} title="Install AbElements" meta="Getting started" trailing="chevron" /></AbList>
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
// 🔗 the app's link
import Link from '../ab-link';
// 🔣 the default chevron
import AbIcon from '../ab-icon';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ AbList props */
export interface AbListProps {
  children: ReactNode; // 📋 AbListItem rows
  label?: string; // ♿ optional list name
  className?: string; // 🏷️
}

/** ⚙️ AbListItem props */
export interface AbListItemProps {
  title: ReactNode; // 💪 13.5/600, one line with ellipsis
  meta?: ReactNode; // 🧾 12px faint subline (`<code>` inside = 11px mono muted)
  media?: ReactNode; // 🖼️ an icon: shown in a 30px tile (card2 bg, accent-text, 18px)
  badge?: ReactNode; // 🏷️ a leading 64×22 badge instead of media ("New", "Improved")
  badgeTone?: 'primary' | 'tonal'; // 🎨 primary = button colours ("New"), tonal = tint ("Improved", default)
  trailing?: 'chevron' | ReactNode; // ➡️ 'chevron' = 18px faint chevron_right
  href?: string; // 🔗 the whole row becomes one link
  className?: string; // 🏷️
}

/**
 * 📋 AbList (P13): one bordered card of rows (Guides, What's new). Radius 14, hairline border, card bg,
 * soft shadow, rows divided by `--div`. Server-safe.
 */
const AbList = ({ children, label, className }: AbListProps): ReactElement => (
  <ul className={clsx('AbList', styles.abList, className)} aria-label={label} data-ab-part="list">{children}</ul>
);

/**
 * 📄 AbListItem: `media | badge` · title + meta · `trailing`. A row with `href` is a single link (hover
 * `--hover`, focus-visible inset 2px accent ring). Rows are at least 44px tall (touch target).
 */
const AbListItem = ({ title, meta, media, badge, badgeTone = 'tonal', trailing, href, className }: AbListItemProps): ReactElement => {
  const body = (
    <>
      {badge != null ? <span className={styles.abListBadge} data-tone={badgeTone}>{badge}</span>
        : media != null ? <span className={styles.abListMedia} aria-hidden="true">{media}</span> : null}
      <span className={styles.abListText}>
        <span className={styles.abListTitle}>{title}</span>
        {meta != null && <span className={styles.abListMeta}>{meta}</span>}
      </span>
      {trailing === 'chevron' ? <AbIcon name="chevron_right" size={18} className={styles.abListChevron} />
        : trailing != null ? <span className={styles.abListTrailing}>{trailing}</span> : null}
    </>
  );
  return (
    <li className={clsx('AbListItem', styles.abListItem, className)} data-ab-part="list-item">
      {href ? <Link href={href} className={styles.abListRow} data-link="true">{body}</Link> : <div className={styles.abListRow}>{body}</div>}
    </li>
  );
};

// 📦 exports
export default AbList;
export { AbList, AbListItem };
