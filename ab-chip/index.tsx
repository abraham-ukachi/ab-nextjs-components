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

// ⚙️ props
export interface AbChipProps {
  children: ReactNode; // 🏷️ text
  dot?: boolean | AbChipDot; // 🟢 leading dot (true = bronze)
  icon?: ReactNode; // 🖼️ leading icon (decorative)
  as?: 'span' | 'li'; // 🧱 'li' inside a <ul> for lists of chips
  className?: string; // 🏷️
  style?: CSSProperties; // 🎨
}

/** 🏷️ Static chip: plain text, never interactive (use AbButton for actions). */
export function AbChip({ children, dot, icon, as: Tag = 'span', className, style }: AbChipProps): ReactElement {
  const tone = dot === true ? 'bronze' : dot || undefined; // 🎨 resolve dot colour
  return (
    <Tag className={clsx('AbChip', styles.chip, className)} style={style} data-ab-part="chip">
      {tone ? <span className={styles.dot} data-tone={tone} aria-hidden="true" /> : null /* 🟢 decorative */}
      {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null /* 🖼️ decorative */}
      <span>{children}</span>
    </Tag>
  );
}

// 📦 default export
export default AbChip;
