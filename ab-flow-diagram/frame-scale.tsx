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
* @name: AbFlowFrameScale
* @file: ab-flow-diagram/frame-scale.tsx
* @type: Client Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ react
import { useEffect, useRef, type ReactElement } from 'react';

/**
 * 📐 AbFlowFrameScale — the tiny client island behind `frame`: watches the card width and sets
 * `--ab-flow-scale` (card width / frame width) on it, so the fixed v6 pixel stage scales 1:1.
 * Browsers with CSS typed arithmetic already get the same value from `100cqw / frame px` before hydration;
 * this covers everyone else. Renders one hidden <span>, nothing visible.
 */
export function AbFlowFrameScale({ width }: { width: number }): ReactElement {
  const ref = useRef<HTMLSpanElement | null>(null); // 📍 our marker
  useEffect(() => {
    const card = ref.current?.parentElement; // 🃏 the figure
    if (!card || !(width > 0)) return; // 🧯
    const apply = (): void => { card.style.setProperty('--ab-flow-scale', String(card.clientWidth / width)); }; // 📏
    apply(); // ▶️ now
    if (typeof ResizeObserver === 'undefined') return; // 🧓 old engines: the first value stays
    const ro = new ResizeObserver(apply); // 👀
    ro.observe(card);
    return () => ro.disconnect(); // 🧹
  }, [width]);
  return <span ref={ref} hidden data-ab-part="flow-frame-scale" />;
}

export default AbFlowFrameScale;
