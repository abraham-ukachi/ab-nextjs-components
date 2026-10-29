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
* @name: useAbSwipeDown (close a bottom sheet with a swipe down)
* @file: ab-bottom-drawer/use-ab-swipe-down.ts
* @type: Client hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { useEffect, useRef } from 'react';
// 🤏 the shared drawer rules (same numbers as useAbEdgeSwipe: 8px slop, 30% / 0.5px/ms commit)
import { AB_SWIPE, createAbVelocityTracker, resolveAbSideRelease } from '../ab-drawer/gestures';

/** ⚙️ options */
export interface UseAbSwipeDownOptions {
  id: string; // 🆔 the sheet's dialog id (the panel is portalled, so we find it by id)
  onClose: () => void; // 🚪 called when the swipe commits
  enabled?: boolean; // 🎚️ e.g. only while open (default true)
}

/** 📜 is there a scroller between `el` and the sheet that is NOT at its top? Then the finger scrolls it, not the sheet. */
export function isAbScrolledInside(el: Element | null, sheet: Element): boolean {
  for (let n: Element | null = el; n && n !== sheet.parentElement; n = n.parentElement) {
    if ((n as HTMLElement).scrollTop > 0) return true; // 📜 scrolled down: the gesture belongs to the content
    if (n === sheet) break; // 🧱 stop at the sheet
  }
  return false;
}

/**
 * 👇 useAbSwipeDown — close a bottom sheet with a swipe down (Joseph, Welcome 0.2.21):
 * - 👆 touch events, like useAbEdgeSwipe (Android Chrome fires pointercancel on a native pan, so pointer events
 *   would lose the gesture); the passive touchstart only arms it, a NON-passive touchmove is attached just for
 *   that press, and preventDefault runs only once the move is ours (down, and mostly vertical)
 * - 📜 never fights inner scroll: a press inside a scroller that isn't at scrollTop 0 is left alone, and an
 *   upward move is always the content's
 * - 🧭 a mostly sideways move (a carousel, a chip row) is not ours either
 * - 🫳 the sheet follows the finger (translateY), then on release it closes past 30% of its height or at
 *   ≥ 0.5px/ms down; anything less springs back
 */
export function useAbSwipeDown({ id, onClose, enabled = true }: UseAbSwipeDownOptions): void {
  const latest = useRef(onClose); // 🔁 latest callback for the listeners
  useEffect(() => { latest.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!enabled) return;
    let d: { y: number; x: number; axis: 0 | 1 | 2; v: ReturnType<typeof createAbVelocityTracker>; sheet: HTMLElement } | null = null; // 🫳 the press
    // 🎞️ follow / release the finger
    const follow = (sheet: HTMLElement, dy: number | null) => {
      if (dy == null) { sheet.style.removeProperty('transform'); sheet.style.removeProperty('transition'); return; } // 🛬 back to CSS
      sheet.style.transition = 'none'; // 🚫 no lag while dragging
      sheet.style.transform = `translateY(${Math.max(0, dy)}px)`; // ⬇️ never above its rest
    };
    const tmove = (e: TouchEvent) => {
      const t = e.touches[0]; if (!d || !t || d.axis === 2) return;
      const dx = t.clientX - d.x; const dy = t.clientY - d.y; // ↔️ ↕️
      if (d.axis === 0) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < AB_SWIPE.slop) return; // 🫳 still a tap
        d.axis = dy > 0 && Math.abs(dy) > Math.abs(dx) ? 1 : 2; // 🧭 down = ours; up / sideways = the content's
        if (d.axis === 2) { detach(); d = null; return; } // 🙅 let go early
      }
      if (e.cancelable) e.preventDefault(); // 🛑 no page / body scroll while we lead
      d.v.add(t.clientY, e.timeStamp); // ⚡
      follow(d.sheet, dy); // 🫳
    };
    const tend = (e: TouchEvent) => {
      const cur = d; d = null; detach();
      if (!cur || cur.axis !== 1) return;
      const t = e.changedTouches[0];
      follow(cur.sheet, null); // 🛬 the drawer's own slide-out (or spring back) takes over
      if (e.type !== 'touchend' || !t) return; // ❌ cancelled
      const height = cur.sheet.offsetHeight || cur.sheet.getBoundingClientRect().height || 320; // 📏
      if (resolveAbSideRelease({ distance: t.clientY - cur.y, velocity: cur.v.velocity(), width: height })) latest.current(); // ✅ 30% / 0.5px/ms
    };
    const attach = () => { document.addEventListener('touchmove', tmove, { capture: true, passive: false }); document.addEventListener('touchend', tend, true); document.addEventListener('touchcancel', tend, true); };
    const detach = () => { document.removeEventListener('touchmove', tmove, true); document.removeEventListener('touchend', tend, true); document.removeEventListener('touchcancel', tend, true); };
    const tstart = (e: TouchEvent) => {
      detach(); d = null;
      if (e.touches.length !== 1) return; // ✌️ pinch etc.
      const target = e.target as Element | null;
      const sheet = document.getElementById(id); // 🗄️ the portalled panel
      if (!sheet || !target || !sheet.contains(target)) return; // 🙅 not on our sheet
      if (target.closest('[data-ab-no-swipe-down], input, textarea, select, [contenteditable="true"]')) return; // 🙅 opt-out + text editing
      if (isAbScrolledInside(target, sheet)) return; // 📜 the content isn't at its top
      const t = e.touches[0]; const v = createAbVelocityTracker(); v.add(t.clientY, e.timeStamp);
      d = { x: t.clientX, y: t.clientY, axis: 0, v, sheet }; attach(); // 🎧 armed
    };
    document.addEventListener('touchstart', tstart, { capture: true, passive: true }); // 👆 passive: never delays a tap or scroll
    return () => { document.removeEventListener('touchstart', tstart, true); detach(); if (d) follow(d.sheet, null); d = null; };
  }, [id, enabled]);
}

// 📦 default export
export default useAbSwipeDown;
