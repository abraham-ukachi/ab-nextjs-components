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
* @name: AbBreadcrumbs (P2)
* @file: ab-breadcrumbs/index.tsx
* @type: Server-safe component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbBreadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: "Home" }]} />
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
// 🔗 the app's link (AbLinkProvider)
import Link from '../ab-link';
// 🔣 separators
import AbIcon from '../ab-icon';
// 🎨 styles
import styles from './styles.module.css';

/** 🍞 one crumb */
export interface AbBreadcrumbItem {
  label: ReactNode; // 🏷️
  href?: string; // 🔗 omitted on the last (current) crumb
}

/** ⚙️ props */
export interface AbBreadcrumbsProps {
  items: readonly AbBreadcrumbItem[]; // 🍞 first → current
  label?: string; // ♿ nav name (default "Breadcrumb")
  className?: string; // 🏷️
}

/**
 * 🍞 AbBreadcrumbs (P2): the tablet main bar's "Docs › **Home**". 13px faint links, the last crumb is the
 * current page (650, text colour, `aria-current="page"`), 16px `chevron_right` separators (hidden from AT).
 * Server-safe: no hooks.
 */
const AbBreadcrumbs = ({ items, label = 'Breadcrumb', className }: AbBreadcrumbsProps): ReactElement => (
  <nav aria-label={label} className={clsx('AbBreadcrumbs', styles.abCrumbs, className)} data-ab-part="breadcrumbs">
    <ol className={styles.abCrumbsList}>
      {items.map((it, i) => {
        const last = i === items.length - 1; // 🎯 current page
        return (
          <li key={i} className={styles.abCrumb}>
            {i > 0 && <AbIcon name="chevron_right" size={16} className={styles.abCrumbSep} />}
            {last ? <span className={styles.abCrumbCurrent} aria-current="page">{it.label}</span>
              : it.href ? <Link href={it.href} className={styles.abCrumbLink}>{it.label}</Link>
              : <span>{it.label}</span>}
          </li>
        );
      })}
    </ol>
  </nav>
);

// 📦 exports
export default AbBreadcrumbs;
export { AbBreadcrumbs };
