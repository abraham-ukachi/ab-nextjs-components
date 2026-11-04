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
* @name: AbCallout (0.3.4, QA 0.2.24 MDX docs)
* @file: ab-callout/index.tsx
* @type: Server component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbCallout variant="warning" title="Heads up">Next 16 only.</AbCallout>
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
// 🔣 the server-safe icon (built-in AbIcons: info, lightbulb, warning, error)
import AbIcon from '../server/ab-icon';
// 🎨 styles
import styles from './styles.module.css';

/** 🎨 the four kinds */
export type AbCalloutVariant = 'note' | 'tip' | 'warning' | 'danger';
/** 🔣 the icon of each kind (AbIcons names, all built in) */
export const AB_CALLOUT_ICONS: Readonly<Record<AbCalloutVariant, string>> = { note: 'info', tip: 'lightbulb', warning: 'warning', danger: 'error' };

/** ⚙️ props */
export interface AbCalloutProps {
  variant?: AbCalloutVariant; // 🎨 default 'note'
  title?: ReactNode; // 🏷️ bold first line (also names the region)
  children?: ReactNode; // 📝 the body (MDX content)
  icon?: string | null; // 🔣 override the glyph (`null` = none)
  // ♿ default 'note' for every kind: a callout is static aside content, NOT a live message. Pass role="alert"
  //    only for something that appears dynamically (it interrupts screen readers)
  role?: 'note' | 'alert' | 'status' | 'region';
  label?: string; // ♿ an accessible name when there is no title (e.g. "Warning")
  className?: string; // 🏷️
}

/**
 * 💡 AbCallout — an MDX admonition: an icon, an optional title and the body on a tinted card. Server-safe.
 * The root is role="note" (a static aside to the text, not a live alert) named by its title, and the kind is
 * also said in words for screen readers when there is no title, so meaning never rests on colour or icon alone.
 */
const AbCallout = ({ variant = 'note', title, children, icon, role = 'note', label, className }: AbCalloutProps): ReactElement => {
  const glyph = icon === undefined ? AB_CALLOUT_ICONS[variant] : icon; // 🔣
  return (
    <div
      role={role} // ♿
      aria-label={title == null ? (label ?? variant[0].toUpperCase() + variant.slice(1)) : undefined} // 🏷️ "Warning" etc.
      className={clsx('AbCallout', styles.abCallout, className)} // 🎨 the body keeps theme .ab-prose styles
      data-ab-part="callout" // 🗂️
      data-variant={variant} // 🎨 the colour set
    >
      {glyph && <span className={styles.abCalloutIcon} aria-hidden="true"><AbIcon name={glyph} size={20} /></span> /* 🔣 decorative */}
      <div className={styles.abCalloutBody}>
        {title != null && <p className={styles.abCalloutTitle} data-ab-part="callout-title">{title}</p> /* 🏷️ */}
        {children != null && <div className={styles.abCalloutText}>{children}</div> /* 📝 */}
      </div>
    </div>
  );
};

// 📦 exports
export default AbCallout;
export { AbCallout };
