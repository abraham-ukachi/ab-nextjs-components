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
* @name: AbPill - Server (G36)
* @file: ab-pill/index.tsx
* @type: Server component (static, no JS)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbPill dot="sage">Free forever · MIT</AbPill>
*    -|> <AbPill mono>ab-nextjs-core</AbPill>
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
// 🎨 shares the chip stylesheet (pill composes chip)
import styles from '../ab-chip/styles.module.css';
// 🎨 dot colours
import type { AbChipDot } from '../ab-chip';

// ⚙️ props
export interface AbPillProps {
  children: ReactNode; // 🏷️ eyebrow text
  dot?: AbChipDot; // 🟢 leading dot
  icon?: ReactNode; // 🖼️ decorative icon
  mono?: boolean; // ⌨️ monospace (package names)
  className?: string; // 🏷️
  style?: CSSProperties; // 🎨
}

/** 💊 Eyebrow pill above a title. Static text; dot + icon are decorative. */
export function AbPill({ children, dot, icon, mono = false, className, style }: AbPillProps): ReactElement {
  return (
    <span className={clsx('AbPill', styles.pill, mono && styles.mono, className)} style={style} data-ab-part="pill">
      {dot ? <span className={styles.dot} data-tone={dot} aria-hidden="true" /> : null /* 🟢 */}
      {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null /* 🖼️ */}
      <span>{children}</span>
    </span>
  );
}

// 📦 default export
export default AbPill;
