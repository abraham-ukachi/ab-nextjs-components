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
* @name: AbSplash - Client
* @file: ab-splash/index.tsx
* @type: Client Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client'; // 💧 hides itself after hydration

// ⚛️ React hooks
import { useEffect, useRef, useState, type ReactElement } from 'react';
// 🧵 class-name joiner
import clsx from 'clsx';
// 🅰️ the Ab mark + "Elements" wordmark (this package)
import AbLogo from '../ab-logo';
// 📶 the linear progress (this package)
import AbLinearProgress from '../ab-linear-progress';
// 🚦 gate constants & helpers
import {
  AB_SPLASH_ATTRIBUTE,
  getAbSplashFadeMs,
  getAbSplashRemainingMs,
  setAbSplashBackgroundInert,
  waitForAbSplashReady,
  type AbInertNode,
} from './gate';
// 🎨 package-shipped styles
import styles from './styles.module.css';

// 📦 re-export the gate so `import { abSplashGateScript } from 'ab-nextjs-components/ab-splash'` works
export * from './gate';

// 📐 props
export interface AbSplashProps {
  // 🏷️ consumer classes
  className?: string;
  // 🔤 wordmark text (default "Elements")
  wordmark?: string;
  // ⏱️ hard cap in ms (default 1200)
  maxMs?: number;
}

/** 💦 AbSplash — brand overlay shown only when the gate script set `html[data-ab-splash]`. */
export default function AbSplash({ className, wordmark = 'Elements', maxMs }: AbSplashProps): ReactElement {
  // 📶 progress (25% until hydration)
  const [progress, setProgress] = useState<number>(25);
  // 📌 the overlay element
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 🌳 the <html> element
    const root = document.documentElement;
    // 😴 gate said no → nothing to do
    if (root.getAttribute(AB_SPLASH_ATTRIBUTE) !== 'on') return;
    // 🛟 unmount guard
    let alive = true;
    // ⏲️ fade timer
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    // 🙈 make the page behind inert while we show
    const restoreInert = ref.current ? setAbSplashBackgroundInert(ref.current as unknown as AbInertNode) : () => {};
    // 👋 final cleanup: flag off + page interactive again
    const finish = () => { root.removeAttribute(AB_SPLASH_ATTRIBUTE); restoreInert(); };
    // ➡️ hydrated: move the progress on (next frame)
    const frame = requestAnimationFrame(() => setProgress(60));
    // ♿ reduced motion?
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    // ⏳ time left before the cap
    const remaining = getAbSplashRemainingMs(performance.now(), maxMs);
    // 🔤 wait for fonts (or the cap), then hide
    waitForAbSplashReady(document.fonts?.ready, remaining).then(() => {
      // 🛟 unmounted meanwhile
      if (!alive) return;
      // ✅ fill the bar
      setProgress(100);
      // 🌫️ start the CSS fade
      root.setAttribute(AB_SPLASH_ATTRIBUTE, 'leaving');
      // 👋 remove for good (at once with reduced motion)
      fadeTimer = setTimeout(finish, getAbSplashFadeMs(reduced));
    });
    // 🧹 cleanup
    return () => {
      alive = false; // 🛟 dead
      cancelAnimationFrame(frame); // 🚫 frame
      if (fadeTimer) clearTimeout(fadeTimer); // 🚫 timer
      restoreInert(); // 🙉 never leave the page inert
    };
  }, [maxMs]);

  return (
    // 💦 the overlay (decorative → hidden from assistive tech)
    <div ref={ref} className={clsx('AbSplash', styles.abSplash, className)} aria-hidden="true">
      {/* 🅰️ mark + wordmark */}
      <AbLogo wordmark={wordmark} alt="" className={styles.abSplash__brand} />
      {/* 📶 progress */}
      <AbLinearProgress className={styles.abSplash__progress} progress={progress} label="" />
    </div>
  );
}

// 📦 named export too
export { AbSplash };
