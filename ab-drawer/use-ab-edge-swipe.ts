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
* @name: useAbEdgeSwipe
* @file: ab-drawer/use-ab-edge-swipe.ts
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
// 🤏 the pure rules
import { AB_SWIPE, createAbVelocityTracker, isInAbEdgeZone, isInAbHorizontalScroller, resolveAbSideRelease } from './gestures';
// 🗺️ the app box (same lookup AbDrawer uses)
import { getAbDrawerHost } from './index';

/** ⚙️ options */
export interface UseAbEdgeSwipeOptions {
  edge: 'left' | 'right'; // 🧱 which edge the swipe starts from (left = left-to-right, opens the left drawer)
  onOpen: () => void; // 🚪 called when the swipe commits
  enabled?: boolean; // 🎚️ e.g. false while that drawer is open, or when the page has no aside (default true)
  width?: number; // 📏 the drawer width the 30% rule uses (default 320)
  pointerTypes?: readonly string[]; // 🖐️ default touch + pen (a mouse never edge-swipes)
}

// 📱 iOS home-screen web app (the zone starts 16px in there)
const standalone = (): boolean => typeof navigator !== 'undefined' && (navigator as Navigator & { standalone?: boolean }).standalone === true;

/**
 * 🤏 useAbEdgeSwipe — open a side drawer with an edge swipe (drawer spec §2 / §3):
 * - 🧱 the press starts in a 24px zone on that edge of the app box (16px in on iOS standalone)
 * - ↔️ it commits past 30% of the drawer width or above 0.5px/ms toward the middle; slower or shorter does nothing
 * - 🎠 ignored inside things that scroll sideways (code blocks, carousels) and `[data-ab-no-edge-swipe]`
 * - 🧭 a mostly vertical move is a scroll, not a swipe
 * - 📱 iOS Safari's own back gesture starts at the very screen edge and takes the touch before the page sees it,
 *   so the two don't fight; in standalone mode the 16px inset leaves that edge to the system
 *
 * - 👆 touch uses touch events (non-passive touchmove only during an edge press, preventDefault only once it's
 *   sideways), so Android Chrome's pointercancel-on-pan can't swallow it
 *
 * The drawer opens on release (it doesn't follow the finger), then slides in with its normal 200ms motion.
 */
export function useAbEdgeSwipe({ edge, onOpen, enabled = true, width = 320, pointerTypes = ['touch', 'pen'] }: UseAbEdgeSwipeOptions): void {
  const latest = useRef(onOpen); // 🔁 latest callback for the listener
  useEffect(() => { latest.current = onOpen; }, [onOpen]);
  const types = pointerTypes.join(','); // 🧮 a stable dep
  useEffect(() => {
    if (!enabled) return;
    let d: { x: number; y: number; axis: 0 | 1 | 2; v: ReturnType<typeof createAbVelocityTracker> } | null = null; // 🫳 the current press
    const sign = edge === 'left' ? 1 : -1; // ➡️ / ⬅️ toward the middle
    const allow = types.split(','); // 🖐️
    // 🧱 shared start rule (pointer or touch): from the edge zone, not in a sideways scroller / opt-out / open drawer
    const start = (x: number, y: number, t: number, target: Element): boolean => {
      const host = getAbDrawerHost('app', target); // 🗺️ the app box
      const box = host === document.body ? { left: 0, right: window.innerWidth } : host.getBoundingClientRect();
      if (!isInAbEdgeZone(x, edge, box, standalone())) return false; // 🧱 not from the edge
      if (isInAbHorizontalScroller(target)) return false; // 🎠 (also [data-ab-no-edge-swipe])
      if (target.closest?.('[data-ab-part="drawer"]')) return false; // 🗄️ a drawer is already up there
      const v = createAbVelocityTracker(); v.add(x, t);
      d = { x, y, axis: 0, v }; return true;
    };
    // 🧭 shared move rule; returns true while the gesture is ours (sideways)
    const step = (x: number, y: number, t: number): boolean => {
      if (!d || d.axis === 2) return false;
      const dx = x - d.x; const dy = y - d.y;
      if (d.axis === 0) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < AB_SWIPE.slop) return false; // 🫳
        d.axis = Math.abs(dx) > Math.abs(dy) ? 1 : 2; // 🧭 sideways = ours, vertical = the page's scroll
      }
      if (d.axis === 1) { d.v.add(x, t); return true; } // ⚡
      return false;
    };
    const finish = (x: number) => {
      const cur = d; d = null;
      if (!cur || cur.axis !== 1) return;
      if (resolveAbSideRelease({ distance: (x - cur.x) * sign, velocity: cur.v.velocity() * sign, width })) latest.current(); // ✅
    };

    // 🖊️ pointer path: pen (and touch only where there are no touch events)
    const touchy = typeof window !== 'undefined' && 'ontouchstart' in window;
    const byPointer = (e: PointerEvent) => allow.includes(e.pointerType) && !(touchy && e.pointerType === 'touch');
    const down = (e: PointerEvent) => { if (byPointer(e)) start(e.clientX, e.clientY, e.timeStamp, e.target as Element); };
    const move = (e: PointerEvent) => { if (byPointer(e)) step(e.clientX, e.clientY, e.timeStamp); };
    const up = (e: PointerEvent) => { if (byPointer(e)) finish(e.clientX); };
    const cancel = (e: PointerEvent) => { if (byPointer(e)) d = null; }; // 🧹 the browser took it (scroll)

    // 👆 touch path (Android Chrome fix): Chromium fires pointercancel as soon as it starts a native pan, so a
    // touch swipe is read from touch events instead. A NON-passive touchmove listener is attached only while a
    // touch that started in the edge zone is down (no scroll jank elsewhere), and it calls preventDefault only
    // once the move is sideways. Vertical moves are never prevented, so the page still scrolls from the strip.
    const tmove = (e: TouchEvent) => {
      const t = e.touches[0]; if (!t) return;
      if (step(t.clientX, t.clientY, e.timeStamp) && e.cancelable) e.preventDefault(); // 🛑 ours: keep the browser out
      if (d?.axis === 2) detach(); // 🧭 a scroll: let go early
    };
    const tend = (e: TouchEvent) => { const t = e.changedTouches[0]; detach(); if (t && e.type === 'touchend') finish(t.clientX); else d = null; };
    const attach = () => { document.addEventListener('touchmove', tmove, { capture: true, passive: false }); document.addEventListener('touchend', tend, true); document.addEventListener('touchcancel', tend, true); };
    const detach = () => { document.removeEventListener('touchmove', tmove, true); document.removeEventListener('touchend', tend, true); document.removeEventListener('touchcancel', tend, true); };
    const tstart = (e: TouchEvent) => {
      if (!allow.includes('touch')) return;
      detach(); d = null;
      if (e.touches.length !== 1) return; // ✌️ pinch etc. are not swipes
      const t = e.touches[0];
      if (start(t.clientX, t.clientY, e.timeStamp, e.target as Element)) attach();
    };

    document.addEventListener('pointerdown', down, true); // 🎧 capture: before anything stops it
    document.addEventListener('pointermove', move, true);
    document.addEventListener('pointerup', up, true);
    document.addEventListener('pointercancel', cancel, true);
    document.addEventListener('touchstart', tstart, { capture: true, passive: true }); // 👆 passive: never delays a tap or scroll
    return () => {
      document.removeEventListener('pointerdown', down, true);
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointerup', up, true);
      document.removeEventListener('pointercancel', cancel, true);
      document.removeEventListener('touchstart', tstart, true);
      detach();
    };
  }, [edge, enabled, width, types]);
}

// 📦 default export
export default useAbEdgeSwipe;
