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
* @name: AbCodeBlockCopy (0.3.4)
* @file: ab-code-block/copy.tsx
* @type: Client component (the AbCodeBlock copy island)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { useRef, type ReactElement } from 'react';
// 📋 clipboard (hooks ≥ 0.1.6, deep import)
import { useAbClipboard } from 'ab-nextjs-hooks/useAbClipboard';
// 🔘 the shared icon button
import AbIconButton from '../ab-icon-button';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props */
export interface AbCodeBlockCopyProps {
  code?: string; // 📋 the raw source (else the block's <pre> text)
  label: string; // ♿ "Copy code"
  copiedLabel: string; // ✅ "Copied"
}

/** 📋 the copy button: copies `code`, or the text of its own block's code; "Copied" is announced politely */
const AbCodeBlockCopy = ({ code, label, copiedLabel }: AbCodeBlockCopyProps): ReactElement => {
  const ref = useRef<HTMLSpanElement>(null); // 📍 to find the block around us
  const { copy, copied } = useAbClipboard(); // 📋 resets after 2s
  const onCopy = () => {
    const block = ref.current?.closest('[data-ab-part="code-block"]'); // 🧱 our AbCodeBlock
    const text = code ?? block?.querySelector('[data-ab-part="code-block-code"]')?.textContent ?? ''; // 📝 what to copy
    void copy(text.replace(/\n$/, '')); // 📋 (no trailing newline)
  };
  return (
    <span ref={ref} className={styles.abCodeBlockCopy} data-ab-part="code-block-copy">
      <AbIconButton icon={copied ? 'check' : 'content_copy'} label={label} naked onClick={onCopy} /> {/* 🔘 name stays the action */}
      <span className={styles.srOnly} role="status" aria-live="polite">{copied ? copiedLabel : ''}</span> {/* 📣 */}
    </span>
  );
};

// 📦 exports
export default AbCodeBlockCopy;
export { AbCodeBlockCopy };
