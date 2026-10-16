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
* @name: AbKbd (G44)
* @file: ab-kbd/index.tsx
* @type: React Component (server-safe)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   <AbKbd keys={['⌘', 'K']} />
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
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props */
export interface AbKbdProps {
  keys?: string[]; // ⌨️ e.g. ['⌘', 'K'] → one <kbd> per key, nested in an outer <kbd>
  children?: ReactNode; // ✍️ or plain content
  className?: string; // 🏷️
}

/** ⌨️ AbKbd: a keyboard hint (`<kbd>`), no hooks, so it renders on the server too. */
const AbKbd = ({ keys, children, className }: AbKbdProps): ReactElement => (
  <kbd className={clsx('AbKbd', styles.abKbd, className)} data-ab-part="kbd">
    {keys ? keys.map((k, i) => <kbd key={`${k}-${i}`} className={styles.abKbdKey}>{k}</kbd>) : children}
  </kbd>
);

// 📦 exports
export default AbKbd;
export { AbKbd };
