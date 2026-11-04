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
* @name: AbCodeBlockFocus (0.6.0)
* @file: ab-code-block/focus.tsx
* @type: Client component (island)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { useEffect, useRef, type ReactElement } from 'react';

/**
 * ⌨️ AbCodeBlockFocus — keeps ONE tab stop in a `trustedHtml` block. Shiki's string carries
 * `<pre tabindex="0">`; we never edit that string, so after hydration this island sets the inner <pre>'s
 * tabindex to -1 in the DOM (the wrapper scroller stays the stop). Before hydration / without JS the
 * leftover tabindex remains (a harmless second stop); pass `highlighted` / children to avoid it entirely.
 */
const AbCodeBlockFocus = (): ReactElement => {
  const ref = useRef<HTMLSpanElement>(null); // 📍 to find our block
  useEffect(() => {
    const block = ref.current?.closest('[data-ab-part="code-block"]'); // 🧱 our AbCodeBlock
    block?.querySelectorAll<HTMLElement>('[data-ab-part="code-block-code"] pre[tabindex]').forEach((pre) => {
      if (pre.tabIndex >= 0) pre.setAttribute('tabindex', '-1'); // ✂️ demote Shiki's stop (string untouched)
    });
  }); // 🔁 every render: a new trustedHtml string brings a new <pre>
  return <span ref={ref} hidden data-ab-part="code-block-focus" />; // 🫥 an invisible anchor
};

// 📦 exports
export default AbCodeBlockFocus;
export { AbCodeBlockFocus };
