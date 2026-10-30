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
* @name: AbChip - Server (G36)
* @file: ab-chip/index.tsx
* @type: Server component (static, no JS)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <ul><AbChip as="li" dot>Tokens</AbChip><AbChip as="li">Light &amp; dark</AbChip></ul>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ types
import type { CSSProperties, ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🎨 styles
import styles from './styles.module.css';

// 🎨 dot colours
export type AbChipDot = 'sage' | 'bronze';
// 🎨 0.1.14 (P16): Home chip tones · 'accent' = --tint bg + --accent-text · 'sage' = the `beta` chip
export type AbChipTone = 'neutral' | 'accent' | 'sage';

// ⚙️ props
export interface AbChipProps {
  children: ReactNode; // 🏷️ text
  dot?: boolean | AbChipDot; // 🟢 leading dot (true = bronze)
  icon?: ReactNode; // 🖼️ leading icon (decorative)
  as?: 'span' | 'li'; // 🧱 'li' inside a <ul> for lists of chips
  className?: string; // 🏷️
  style?: CSSProperties; // 🎨
  size?: 'md' | 'sm'; // 📏 0.1.14 (P16): 'sm' = the 20px Home chip (version, count, New)
  shape?: 'pill' | 'rounded'; // 🔷 0.1.14: 'rounded' = 6px radius (default pill)
  mono?: boolean; // ⌨️ 0.1.14: Roboto Mono 11/600 (versions, package names)
  tone?: AbChipTone; // 🎨 0.1.14 (default 'neutral' = the legacy outline chip)
  // ===== 404 gaps: long text =====
  overflow?: 'ellipsis' | 'wrap'; // ✂️ NEW: 'ellipsis' (default) clips to the parent width with "…"; 'wrap' breaks onto lines
  title?: string; // 💬 NEW: tooltip; defaults to the text itself when `children` is a string (so clipped text stays readable)
}

/** 🏷️ Static chip: plain text, never interactive (use AbButton for actions). */
export function AbChip({ children, dot, icon, as: Tag = 'span', className, style, size = 'md', shape = 'pill', mono = false, tone = 'neutral', overflow = 'ellipsis', title }: AbChipProps): ReactElement {
  const dotTone = dot === true ? 'bronze' : dot || undefined; // 🎨 resolve dot colour
  // 💬 404 gaps: full text as a tooltip while ellipsing (only when we know it: a plain string/number child)
  const tip = title ?? (overflow === 'ellipsis' && (typeof children === 'string' || typeof children === 'number') ? String(children) : undefined);
  return (
    <Tag
      className={clsx('AbChip', styles.chip, mono && styles.mono, className)} style={style} data-ab-part="chip"
      data-size={size === 'sm' ? 'sm' : undefined} // 📏 P16
      data-shape={shape === 'rounded' ? 'rounded' : undefined} // 🔷
      data-tone={tone === 'neutral' ? undefined : tone} // 🎨
      data-mono={mono ? 'true' : undefined} // ⌨️
      data-overflow={overflow} // ✂️ 404 gaps: ellipsis | wrap
      title={tip} // 💬 404 gaps: the full text on hover
    >
      {dotTone ? <span className={styles.dot} data-tone={dotTone} aria-hidden="true" /> : null /* 🟢 decorative */}
      {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null /* 🖼️ decorative */}
      <span className={styles.text}>{children}</span>{/* ✂️ 404 gaps: the part that ellipses / wraps */}
    </Tag>
  );
}

// 📦 default export
export default AbChip;
